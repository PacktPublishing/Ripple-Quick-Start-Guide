'use strict';
const RippleAPI = require('ripple-lib').RippleAPI;

const sender = 'r41sFTd4rftxY1VCn5ZDDipb4KaV5VLFy2';
const secret = 'sptkAoSPzHq8mKLWrjU33EDj7v96u';
const options = {};
const release_date = new Date("2018-12-16T14:10:00Z");

const api = new RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'});
api.connect().then(() => {
  console.log('Connected');
  return api.prepareEscrowExecution(sender, {
      "owner": sender,
      "escrowSequence": 67
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
