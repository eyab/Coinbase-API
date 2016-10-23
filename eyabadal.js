//********** Midterm SE 172 ***********
// Eya Badal Abdisho 008875321
// eyabadal@yahoo.com
//Professor Spoorthy
//*************************************


//variables 
var saveOrder = []; 


var market = {
rates: {}
};



//Connecting to Coinbase API
var request = require('request');
request('https://coinbase.com/api/v1/currencies/exchange_rates', function (error, response, body) {
  if (!error && response.statusCode == 200) {

    //then assign it to market JSON object

//market.rates = JSON.parse(body) ;
    //console.log(body)
	market.rates = JSON.parse(body); 
  // assigning output to json object 
	//console.log(market.rates);
	//console.log(market.rates[0]);
	
  }
})

//repl mode **********************************************************************
const repl = require('repl');

const r = repl.start({prompt: 'Coinbase> ', eval: myEval}); 

// using switch for switiching mode between commands 
function myEval(cmd, currency, total, callback) {
  var b = cmd.split(" ");
  console.log(cmd);
  switch(b[0]){
//BUY mode
    case (b[0].match(/BUY/) || {}).input: buy(b); 
      break;
    //SELL mode
    case (b[0].match(/SELL/) || {}).input: buy(b); 
      break;
    //ORDERS mode
    case (b[0].match(/ORDERS/) || {}).input: orders(); 
      break;
      //default mode
    default: console.log("No amount specified");
     break;
  }
  this.displayPrompt();
}


//BUY *****************************************************************************
function buy(cmd){
  

    var amountString = cmd[1];
    var currency = "";

    if(cmd[2]) {
      var currency = cmd[2];
    }

//when the amonut is not valid gives errors and return
    var amount = parseFloat(amountString);
    if(amount <= 0 || isNaN(amount)){
      console.log("No amount specified");
      return;
    }
	//making new lines ************************************
	currency = currency.replace(/(\r\n|\n|\r)/gm,"");
	var index= currency.toLowerCase() + '_to_btc';
	index = index.replace(/(\r\n|\n|\r)/gm,"");
	

	//checking json output 
	if ('usd_to_btc' == index){
		console.log('Success');
	}
  else
  {
console.log('Fail');
console.log('No known exchange rate for BTC/UCD. Order failed.');
return;

  }
	
  //fetching form JSON Output  ****************************
	if(market.rates[index] == null){
    console.log('empty')
  }

    else {
		var exchange = market.rates[index];
		amount = amount * exchange; 
   // console.log(amount);
     //console.log(exchange);


		
	}
	
console.log("order to" +" " + cmd[0] +" "+ amountString+" "+ currency + " worth of " + "BTC queued @" + amount);


var date = new Date(); 
 
saveOrder.push({
//Wed Oct 05 2016 22:09:40 GMT+0000 (UTC) : BUY 10 : UNFILLED
timestamp: date, type: "BUY", amount: amountString, currency: currency,
});
}

//Sell*************************************************************************************
// SELL <amount>[currency] 
//Same rules apply as BUY

function sell(cmd){
  

    var amountString = cmd[1];
    var currency = "";

    if(cmd[2]) {
      var currency = cmd[2];
    }

//when the amonut is not valid gives errors and return
    var amount = parseFloat(amountString);
    if(amount <= 0 || isNaN(amount)){
      console.log("No amount specified");
      return;
    }
  //making new lines ************************************
  currency = currency.replace(/(\r\n|\n|\r)/gm,"");
  var index= currency.toLowerCase() + '_to_btc';
  index = index.replace(/(\r\n|\n|\r)/gm,"");
  
  
    //checking json output 
  if ('usd_to_btc' == index){
    console.log('Success');
  }
  else
  {
console.log('fail');
console.log('No known exchange rate for BTC/UCD. Order failed.');
return;

  }
  
  //fetching form JSON Output  ****************************
  if(market.rates[index] == null){
    console.log('empty')
  }

    else {
    var exchange = market.rates[index];
    amount = amount * exchange; 
    
  }
  
console.log("order to" + " " + cmd[0] +" "+ amountString+" "+ currency + " worth of " + "BTC queued @" + amount);


var date = new Date(); 

saveOrder.push({
                                //Wed Oct 05 2016 22:09:40 GMT+0000 (UTC) : BUY 10 : UNFILLED
timestamp: date, type: "BUY", amount: amountString, currency: currency,

});

}




//Orders *************************CSV**************************************
//marke-research example for CSV
/*fs.createReadStream(csvfile).pipe(parser);//Open file as stream and pipe it to parser
};

var buildfn = function(csvfile, headers) {
    var response2console = function(result, response) {
        if (result instanceof Error) {
            console.error('Error: ' + util.format(response.message));
        } else {
            console.error("Wrote %s", csvfile);
            fs.writeFileSync(csvfile, result);
            csv2console(csvfile, headers);
        }
    };
    return response2console;
};

*/
var fs = require('fs'); 
var uu = require('underscore'); 
var csv = require('fast-csv'); 

function orders(){

    var finalOrder = uu.map(saveOrder, function(sub){
      return { "timestamp": sub.timestamp,
              "buy/sell type": sub.type,
              "amount": sub.amount,
              "currency": sub.currency,
              "conversion rate to BTC": sub.rate};
      });

   
    var writableStream = fs.createWriteStream("Eya.csv");

    
    csv.write(finalOrder, {headers :true}).pipe(writableStream);

    console.log("=== CURRENT ORDERS ===");
    uu.each(saveOrder, function(sub){
      // console.log("%s (UTC) : %s %s %s: UNFILLED", item.timestamp, item.type, item.currency, item.amount);

      console.log(sub.timestamp + " " + ":"+sub.type, sub.amount, sub.currency + ":" + " " +'UNFILED');
    });
}
  


/*

var csv = require("fast-csv");
//Transform the orders object to include headers for csv generation 
/*Use map function from underscore.js to transform your order object and create a final data structure that looks like this:

uu.map(){ return { "timestamp": orderID,
"buy/sell type":order.type,
"amount":order.amount,
"currency":order.currency,
"conversion rate to BTC":order.rate
};


//create a writable stream 
var writableStream = fs.createWriteStream("my.csv");


//use fast-csv write function to write the orders and pipe it to writable stream used to create a csv of unknown size 

csv.write(transformedOrders, {headers :true}).pipe(writableStream);

*/











