'use strict';
const RippleAPI = require('ripple-lib').RippleAPI;
const decodeAddress = require('ripple-address-codec').decodeAddress;
const createHash = require('crypto').createHash;

const sender = 'r42Qv8NwggeMWnpKcxMkx7qTtB23GYLHBX';
const secret = 'shMrNknuQCteaNE3XUMEBgWs1EebU';
const options = {};
const api = new RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'});
api.connect().then(() => {
  console.log('Connected');
  return api.prepareCheckCash(sender, {
    "checkID": "25B092AEB7966D572A0DC7BD1EFC9932F1BE081FD1F153C556132E1AAB45D153",
    "amount": {
      "currency": "XRP",
      "value": "100"
    }
  }, options);

}).then(prepared => {
  console.log("txJSON:", prepared.txJSON);
  const {signedTransaction} = api.sign(prepared.txJSON, secret);
  api.submit(signedTransaction).then(onSuccess,onFailure);
});

function onSuccess(message){
  console.log(message);
	console.log("Transaction Successfully Submitted.");
  disconnect();
}

function onFailure(message){
	console.log("Transaction Submission Failed.");
	console.log(message);
	disconnect();
}

function disconnect(){
	api.disconnect().then(()=> {
		console.log("Disconnected from test network.")
	});
}
