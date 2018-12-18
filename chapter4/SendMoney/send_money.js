'use strict';
const RippleAPI = require('ripple-lib').RippleAPI;
const api = new RippleAPI({
  server: 'wss://s.altnet.rippletest.net:51233' // Ripple Test Network Address
});
const instructions = {};
const sourceAddress = 'r41sFTd4rftxY1VCn5ZDDipb4KaV5VLFy2';
const sourceSecret = 'sptkAoSPzHq8mKLWrjU33EDj7v96u';
const destinationAddress = 'rMLhQ61cGQ3kcsGMFugYJV9QjP31BiMXav'
const amount = '50';

const transaction = {
source: {
	address: sourceAddress,
	maxAmount: {
		value: amount,
		currency: 'XRP'
	}
},
destination: {
	address: destinationAddress,
	amount: {
		value: amount,
		currency: 'XRP'
	}
}
};

api.connect().then(() => {

	console.log('Connected to the test network.');
  return api.preparePayment(sourceAddress, transaction, instructions).then(prepared => {
    console.log('Payment transaction is now prepared.');
    const {signedTransaction} = api.sign(prepared.txJSON, sourceSecret);
    console.log('Payment transaction is now signed.');
    api.submit(signedTransaction).then(onSuccess,onFailure);
	});

});

function onSuccess(message){
	console.log("Transaction Successfully Submitted.");
	console.log(message);
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
	})
}
