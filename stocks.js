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


    // $("#Form").on("submit",function(event){
    //   event.preventDefault();
    //   $(input).removeClass();
    // })


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
  $("#result").empty().append("Delayed Quote $"+ round2Fixed(data.query.results.quote.LastTradePriceOnly));
  $("#change").empty().append(" $"+ posOrNeg("#change",dollarChange)+" ("+posOrNeg("#change",percentChange)+"%)");
      $("#result").hide().fadeIn(500);
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

      // $(".resultsQuote").empty();
})
    };












// $(".submit").on("click",function(){
//   $(".resultsQuote").empty();
// });




// $(function(){
// parseRSS("https://twitter.com/hashtag/"+$("#ticker").val(), "#twitter");
// parseRSS("https://www.google.com/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q="+$("#ticker").val()+"%20site%3Acnbc.com", '#CNBC');
// parseRSS("https://www.google.com/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q="+$("#ticker").val()+"+site:yahoo.com&tbm=nws", '#yahoo');
// parseRSS("https://www.google.com/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#tbm=nws&q="+$("#ticker").val()+"+site:marketwatch.com", '#marketwatch')
// });

// 760622527118921730 (twitter key)
