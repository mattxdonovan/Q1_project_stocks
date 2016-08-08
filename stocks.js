
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
        } else if(value > 0) {
            $(input).addClass("pos");
            return value;
        } else {
            $(input).addClass("unchanged");
            return value;
        }
    };

var stockTicker;

$("#Form").on("submit",function(event){
  event.preventDefault();
   stockTicker = $("#ticker").val().toUpperCase();
          reLoad();
});

function reLoad(){

  $.get("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22"+stockTicker+"%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys")

  .then(function(data) {
  var dollarChange = round2Fixed(data.query.results.quote.Change);
  var percentChange = round2Fixed((data.query.results.quote.Change/data.query.results.quote.PreviousClose)*100);
  var dollarFiftyDayChange = round2Fixed(data.query.results.quote.ChangeFromFiftydayMovingAverage);
  var percentFiftyDayChange = round2Fixed((data.query.results.quote.ChangeFromFiftydayMovingAverage/data.query.results.quote.FiftydayMovingAverage)*100);
  var dollar200DayChange = round2Fixed(data.query.results.quote.ChangeFromTwoHundreddayMovingAverage);
  var percent200DayChange = round2Fixed((data.query.results.quote.ChangeFromTwoHundreddayMovingAverage/data.query.results.quote.TwoHundreddayMovingAverage)*100);
  $("#name").empty().append(data.query.results.quote.Name);
  $("#symbol").empty().append(data.query.results.quote.symbol);
  $("#exchange").empty().append(data.query.results.quote.StockExchange);
  $("#result").empty().append("$"+ round2Fixed(data.query.results.quote.LastTradePriceOnly));
  $("#change").empty().append(" $"+ posOrNeg("#change",dollarChange)+" ("+posOrNeg("#change",percentChange)+"%)");
      $("#result").hide().fadeIn(100);
  $("#time").empty().append("Last Valid Trade Time (EST): "+ data.query.results.quote.LastTradeTime);
  $("#ask").empty().append("$" +round2Fixed(data.query.results.quote.Ask));
  $("#bid").empty().append("$" + round2Fixed(data.query.results.quote.Bid));
  $("#dayRange").empty().append("$" +round2Fixed(data.query.results.quote.DaysLow)+" - $" +round2Fixed(data.query.results.quote.DaysHigh));
  $("#previousClose").empty().append("$" +round2Fixed(data.query.results.quote.PreviousClose));
  $("#open").empty().append("$" +round2Fixed(data.query.results.quote.Open));
  $("#yearRange").empty().append("$" + round2Fixed(data.query.results.quote.YearLow) + " - $"+round2Fixed(data.query.results.quote.YearHigh));
  $("#50dayMovingAverage").empty().append("$" + round2Fixed(data.query.results.quote.FiftydayMovingAverage) + " ($"+ dollarFiftyDayChange + " / "+ percentFiftyDayChange+ "%)");
  $("#200dayMovingAverage").empty().append("$" + round2Fixed(data.query.results.quote.TwoHundreddayMovingAverage) + " ($" + dollar200DayChange + " / "+ percent200DayChange+"%)");
  $("#volume").empty().append(commaSeparateNumber(data.query.results.quote.Volume));
  $("#AverageDailyVolume").empty().append(commaSeparateNumber(data.query.results.quote.AverageDailyVolume));

  setTimeout(reLoad,5000);

})
    };

//======================== END of Snapshot View ========================


//======================== START of News Feed ========================


$("#Form").on("submit",function(event){
  event.preventDefault();
   stockTicker = $("#ticker").val().toUpperCase();

   getFeed();
});

function getFeed(){

$.get("http://cors-anywhere.herokuapp.com/https://feeds.finance.yahoo.com/rss/2.0/headline?s="+stockTicker+"&region=US&lang=en-US", function(data) {
    var $XML = $(data);
    $XML.find("item").each(function() {
        var $this = $(this);
        var lnk = $this.find("link").text();
        var correctLnk = lnk.substring(lnk.lastIndexOf("*") + 1),

        item = {
                title:       $this.find("title").text(),
                link:        correctLnk,
                description: $this.find("description").text(),
                pubDate:     $this.find("pubDate").text(),
            };
        $('#rss_feed').append($('<h1/>').text(item.title));
        $('#rss_feed').append($('<p/>').text(item.description));
        $('#rss_feed').append($('<a href=""/>').text(item.link));

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
});

function getChartData(){
var stockStartDate = $("#startDate").val();
var stockEndDate = $("#endDate").val();
// console.log(stockEndDate);
  $.get("http://cors-anywhere.herokuapp.com/http://query.yahooapis.com/v1/public/yql?q=%20select%20*%20from%20yahoo.finance.historicaldata%20where%20symbol%20=%20%22"+stockTicker+"%22%20and%20startDate%20=%20%22"+stockStartDate+"%22%20and%20endDate%20=%20%22"+stockEndDate+"%22%20&format=json%20&diagnostics=true%20&env=store://datatables.org/alltableswithkeys%20&callback=")

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
      chartArray
      , true);
      var options = {
        legend:'none',
        title : 'S&P500 vs StockTwits Emotional Sentiment',
        xAxis: {title: "Price in USD ($)"},
        yAxis: {title: "Day"},
        displayAnnotations: true,
        seriesType: 'candlesticks',
        series: {1: {type: 'line'}}
      };
      var chart = new google.visualization.CandlestickChart(document.getElementById('chart_div'));
      chart.draw(data, options);
    }

  //======================== END of Stock Chart ========================





// http://ichart.finance.yahoo.com/table.csv?g=d&f=2014&e=12&c=2014&b=10&a=7&d=7&s=AAPL **produces xml doc of stock info****
// let dateChart = .Date;
// let lowChart = .Low;
// let openChart = .Open;
// let closeChart = .Close;
// let highChart = .High;
// let volumeChart = .Volume;
