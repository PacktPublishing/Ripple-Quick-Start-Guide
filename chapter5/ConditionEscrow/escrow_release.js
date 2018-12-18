'use strict';
const RippleAPI = require('ripple-lib').RippleAPI;

const sender = 'r41sFTd4rftxY1VCn5ZDDipb4KaV5VLFy2';
const secret = 'sptkAoSPzHq8mKLWrjU33EDj7v96u';
const options = {};

const api = new RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'});
api.connect().then(() => {
  console.log('Connected');
  return api.prepareEscrowExecution(sender, {
      "owner": sender,
      "escrowSequence": 87,
      "condition": "A025802010BE1D1DE61FE69A9EE99689CB79820326BF6CA8A725F6631A0CE00A07B134DA810120",
      "fulfillment": "A022802021EB4CB44AD71E3B2A23B4AAF6A546EA208960737C23F29F0645499968664404"
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
