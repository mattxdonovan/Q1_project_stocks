
// http://marketdata.websol.barchart.com/getHistory.json?key=b3ec29de1356877ff2be07f40c254204&symbol=IBM&type=daily&startDate=20150728000000
// ('Access-Control-Allow-Origin: *');


//======================== END of Snapshot View ========================

google.charts.load('current', {'packages':['corechart']});

function commaSeparateNumber(val){
  while (/(\d+)(\d{3})/.test(val.toString())){
    val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
  }
  return val;
}
function round2Fixed(value) {
  value = +value;
  if (isNaN(value))
    return NaN;
    value = value.toString().split('e');
    value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + 2) : 2)));
    value = value.toString().split('e');
    return (+(value[0] + 'e' + (value[1] ? (+value[1] - 2) : -2))).toFixed(2);
}

function posOrNeg(input,value){
  $(input).removeClass();
  if (value < 0){
    $(input).addClass("neg");
    return value;
  } else if (value > 0) {
      $(input).addClass("pos");
      return value;
    } else {
        $(input).addClass("unchanged");
        return value;
      }
};

var stockTicker;
var stockName;
var stockStartDate;
var stockEndDate;
var chartTitle;
var chartFormat;

$("#Form").on("submit",function(event){
  event.preventDefault();
  stockTicker = $("#ticker").val().toUpperCase();
  reLoad();
});

function reLoad(){

$.get("https://api.coinmarketcap.com/v1/ticker/bitcoin/")
  // $.get("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22"+stockTicker+"%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys")
  //
  .then(function(data) {
    stockName = data.name;
  // stockName = data.query.results.quote.Name;
  // var dollarChange = round2Fixed(data.query.results.quote.Change);
  // var percentChange = round2Fixed((data.query.results.quote.Change/data.query.results.quote.PreviousClose)*100);
  // var dollarFiftyDayChange = round2Fixed(data.query.results.quote.ChangeFromFiftydayMovingAverage);
  // var percentFiftyDayChange = round2Fixed((data.query.results.quote.ChangeFromFiftydayMovingAverage/data.query.results.quote.FiftydayMovingAverage)*100);
  // var dollar200DayChange = round2Fixed(data.query.results.quote.ChangeFromTwoHundreddayMovingAverage);
  // var percent200DayChange = round2Fixed((data.query.results.quote.ChangeFromTwoHundreddayMovingAverage/data.query.results.quote.TwoHundreddayMovingAverage)*100);
  // $("#newsfeedHead").empty().append("Latest Financial News for " + data.query.results.quote.Name+ "<br>");
  // $("#name").empty().append(data.query.results.quote.Name);
  // $("#symbol").empty().append(data.query.results.quote.symbol);
  // $("#exchange").empty().append(data.query.results.quote.StockExchange);
  // $("#result").empty().append("$"+ round2Fixed(data.query.results.quote.LastTradePriceOnly));
  // $("#change").empty().append(" $"+ posOrNeg("#change",dollarChange)+" ("+posOrNeg("#change",percentChange)+"%)");
  // $("#result").hide().fadeIn(100);
  // $("#time").empty().append("Last Valid Trade Time (EST): "+ data.query.results.quote.LastTradeTime);
  // $("#ask").empty().append("$" +round2Fixed(data.query.results.quote.Ask));
  // $("#bid").empty().append("$" + round2Fixed(data.query.results.quote.Bid));
  // $("#dayRange").empty().append("$" +round2Fixed(data.query.results.quote.DaysLow)+" - $" +round2Fixed(data.query.results.quote.DaysHigh));
  // $("#previousClose").empty().append("$" +round2Fixed(data.query.results.quote.PreviousClose));
  // $("#open").empty().append("$" +round2Fixed(data.query.results.quote.Open));
  // $("#yearRange").empty().append("$" + round2Fixed(data.query.results.quote.YearLow) + " - $"+round2Fixed(data.query.results.quote.YearHigh));
  // $("#50dayMovingAverage").empty().append("$" + round2Fixed(data.query.results.quote.FiftydayMovingAverage) + " ($"+ dollarFiftyDayChange + " / "+ percentFiftyDayChange+ "%)");
  // $("#200dayMovingAverage").empty().append("$" + round2Fixed(data.query.results.quote.TwoHundreddayMovingAverage) + " ($" + dollar200DayChange + " / "+ percent200DayChange+"%)");
  // $("#volume").empty().append(commaSeparateNumber(data.query.results.quote.Volume));
  // $("#AverageDailyVolume").empty().append(commaSeparateNumber(data.query.results.quote.AverageDailyVolume));

  setTimeout(reLoad,10000);
  return stockName;
  })
};
//======================== END of Snapshot View ========================


//======================== START of News Feed ========================


$("#Form").on("submit",function(event){
  event.preventDefault();
  stockTicker = $("#ticker").val().toUpperCase();
  $('#rss_feed').empty()
  getFeed();
});

function getFeed(){

  $.get("http://cors-anywhere.herokuapp.com/https://feeds.finance.yahoo.com/rss/2.0/headline?s="+stockTicker+"&region=US&lang=en-US", function(data) {
    var $XML = $(data);

    $XML.find("item").each(function() {
      var $this = $(this);
      var lnk = $this.find("link").text();
      var correctLnk = lnk.substring(lnk.lastIndexOf("*") + 1);
      var desc = $this.find("description").text();
      var pubDates = $this.find("pubDate").text();
      var articleTitle = $this.find("title").text();
      if (articleTitle[0] == '"'){
        articleTitle = JSON.parse(articleTitle);
      }
      if (desc == "" ){
        desc = "There is no description available for this article."
      }
      item = {
              title:       articleTitle,
              link:        correctLnk,
              description: desc,
              pubDate:     pubDates,
      };
      $('#rss_feed').append($('<div class="feedDiv"><a class="titleLink" href='+correctLnk+'>'+articleTitle+'</a><p class="descriptions">'+desc+'</p><p class="pubDates">'+pubDates+'</p></div>'));
    });
  });
}

//======================== END of News Feed ========================

//======================== START of Stock Chart ========================

var chartArray = [];

$("#Form").on("submit",function(event){
  event.preventDefault();
  var stockTicker = $("#ticker").val().toUpperCase();
  getChartData()
})

function getChartData(){
  var today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth()+1; //January is 0!
  let yyyy = today.getFullYear();
    if(dd<10) {
      dd='0'+dd
    }
    if(mm<10) {
      mm='0'+mm
    }
  today = yyyy+"-"+mm+"-"+dd;
  stockEndDate = today;
  var timeRange = $("#type").val();

  switch (timeRange){
    case "1 Week":
    chartTitle = "One Week";
    chartFormat = "d";
    var oneWeekAgo = new Date();
    let ddLess1wk = oneWeekAgo.getDate()-7;
    let mmLess1wk = oneWeekAgo.getMonth()+1;
    let yyyyLess1wk = oneWeekAgo.getFullYear();

      if(ddLess1wk<10) {
      ddLess1wk='0'+ddLess1wk
      }
      if(mmLess1wk<10) {
      mmLess1wk='0'+mmLess1wk
      }
      oneWeekAgo = yyyyLess1wk+"-"+mmLess1wk+"-"+ddLess1wk;
      stockStartDate = oneWeekAgo;
    break;

    case "1 Month":
    chartTitle = "One Month ";
    chartFormat = "d";
    var oneMonthAgo = new Date();
    let ddLess1 = oneMonthAgo.getDate();
    let mmLess1 = oneMonthAgo.getMonth();
    let yyyyLess1 = oneMonthAgo.getFullYear();
      if(ddLess1<10) {
      ddLess1='0'+ddLess1
      }
      if(mmLess1<10) {
      mmLess1='0'+mmLess1
      }
      oneMonthAgo = yyyyLess1+"-"+mmLess1+"-"+ddLess1;
      stockStartDate = oneMonthAgo;
    break;

    case "3 Months":
    chartTitle = "Three Months ";
    chartFormat = "MMM";
    var threeMonthsAgo = new Date();
    let ddLess3 = threeMonthsAgo.getDate();
    let mmLess3 = threeMonthsAgo.getMonth()-2;
    let yyyyLess3 = threeMonthsAgo.getFullYear();
      if(ddLess3<10) {
      ddLess3='0'+ddLess3
      }
      if(mmLess3<10) {
      mmLess3='0'+mmLess3
      }
      threeMonthsAgo = yyyyLess3+"-"+mmLess3+"-"+ddLess3;
      stockStartDate = threeMonthsAgo;
    break;

    case "6 Months":
    chartTitle = "Six Months ";
    chartFormat = "MMM";
    var sixMonthsAgo = new Date();
    let ddLess6 = sixMonthsAgo.getDate();
    let mmLess6 = sixMonthsAgo.getMonth()-5;
    let yyyyLess6 = sixMonthsAgo.getFullYear();
      if(ddLess6<10) {
      ddLess6='0'+ddLess6
      }
      if(mmLess6<10) {
      mmLess6='0'+mmLess6
      }
      sixMonthsAgo = yyyyLess6+"-"+mmLess6+"-"+ddLess6;
      stockStartDate = sixMonthsAgo;
    break;

    case "1 Year":
    chartTitle = "One Year ";
    chartFormat = "MMM";
    var OneYearAgo = new Date();
    let ddLess1yr = OneYearAgo.getDate();
    let mmLess1yr = OneYearAgo.getMonth()+1;
    let yyyyLess1yr = OneYearAgo.getFullYear()-1;
      if(ddLess1yr<10) {
        ddLess1yr='0'+ddLess1yr
      }
      if(mmLess1yr<10) {
        mmLess1yr='0'+mmLess1yr
      }
      OneYearAgo = yyyyLess1yr+"-"+mmLess1yr+"-"+ddLess1yr;
      stockStartDate = OneYearAgo;
    break;

    case "17 Months":
    chartTitle = "17 Months ";
    chartFormat = "yyyy";
    var seventeenMonthsAgo = new Date();
    let ddLess17m = seventeenMonthsAgo.getDate();
    let mmLess17m = seventeenMonthsAgo.getMonth()-4;
    let yyyyLess17m = seventeenMonthsAgo.getFullYear()-1;
      if(ddLess17m<10) {
        ddLess17m='0'+ddLess17m
      }
      if(mmLess17m<10) {
        mmLess17m='0'+mmLess17m
      }
      TwoYearsAgo = yyyyLess17m+"-"+mmLess17m+"-"+ddLess17m;
      stockStartDate = seventeenMonthsAgo;
}

  var apiCall  = "http://cors-anywhere.herokuapp.com/http://query.yahooapis.com/v1/public/yql?q=%20select%20*%20from%20yahoo.finance.historicaldata%20where%20symbol%20=%20%22"+stockTicker+"%22%20and%20startDate%20=%20%22"+stockStartDate+"%22%20and%20endDate%20=%20%22"+stockEndDate+"%22%20&format=json%20&diagnostics=true%20&env=store://datatables.org/alltableswithkeys%20&callback="
  $.get(apiCall)

  .then(function(data) {
    let quoteChart = data.query.results.quote;
    for (i=0; i<data.query.results.quote.length; i++){
      let newquoteChart = quoteChart[i].Date;
      chartArray.push([newquoteChart,parseFloat(quoteChart[i].Low,10),parseFloat(quoteChart[i].Open,10),parseFloat(quoteChart[i].Close,10),parseFloat(quoteChart[i].High,10)]);
    }
      drawChart()
  })
};
// google.charts.setOnLoadCallback(drawChart);
function drawChart() {
  var data = google.visualization.arrayToDataTable(
  chartArray.reverse()
  , true);
  var options = {
    legend:'none',
    title : 'Chart for ' + stockTicker,
    vAxis: {
      title: "Price in USD ($)"
    },
    hAxis: {
      title: chartTitle,
      format: chartFormat
    },
    displayAnnotations: true,
    seriesType: 'candlesticks',
    series: {
      1: {type: 'line'}
    }
  };
  var chart = new google.visualization.CandlestickChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}
  //======================== END of Stock Chart ========================





// http://ichart.finance.yahoo.com/table.csv?g=d&f=2014&e=12&c=2014&b=10&a=7&d=7&s=AAPL **produces xml doc of stock info****
