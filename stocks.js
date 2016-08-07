//
// http://marketdata.websol.barchart.com/getHistory.json?key=b3ec29de1356877ff2be07f40c254204&symbol=IBM&type=daily&startDate=20150728000000
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




// ('Access-Control-Allow-Origin: *');



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

$("#Form").on("submit",function(event){
  event.preventDefault();
   stockTicker = $("#ticker").val().toUpperCase();

$.get("http://query.yahooapis.com/v1/public/yql?q=%20select%20*%20from%20yahoo.finance.historicaldata%20where%20symbol%20=%20%22AAPL%22%20and%20startDate%20=%20%222012-09-11%22%20and%20endDate%20=%20%222014-02-11%22%20&format=json%20&diagnostics=true%20&env=store://datatables.org/alltableswithkeys%20&callback=")

.then(function(data) {

let date = data.query.results.quote.date;
let open = data.query.results.quote.open;
let close = data.query.results.quote.close;
let low = data.query.results.quote.low;
let high = data.query.results.quote.high;
let volume = data.query.results.quote.volume;

});
