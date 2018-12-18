'use strict';
const RippleAPI = require('ripple-lib').RippleAPI;
const decodeAddress = require('ripple-address-codec').decodeAddress;
const createHash = require('crypto').createHash;

const sender = 'r41sFTd4rftxY1VCn5ZDDipb4KaV5VLFy2';
const receiver = 'r42Qv8NwggeMWnpKcxMkx7qTtB23GYLHBX';
const secret = 'sptkAoSPzHq8mKLWrjU33EDj7v96u';
const options = {};

const api = new RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'});
api.connect().then(() => {
  console.log('Connected to the test network.');
  return api.prepareCheckCreate(sender, {
    "destination": receiver,
    "sendMax": {
      "currency": "XRP",
      "value": "100"
    }
  }, options);

}).then(prepared => {
  console.log("Transaction JSON:", prepared.txJSON);
  const {signedTransaction} = api.sign(prepared.txJSON, secret);
  console.log("Transaction Signed.")
  api.submit(signedTransaction).then(onSuccess,onFailure);
});

function onSuccess(message){
  console.log(message);
  console.log("Transaction Successfully Submitted.");
  const checkIDhasher = createHash('sha512');
  checkIDhasher.update(Buffer.from('0043', 'hex'));
  console.log("Heck");
  console.log(decodeAddress(sender));
  checkIDhasher.update(new Buffer(decodeAddress(sender)));
  const seqBuf = Buffer.alloc(4);
  seqBuf.writeUInt32BE(message['tx_json']['Sequence'], 0);
  checkIDhasher.update(seqBuf);
  const checkID = checkIDhasher.digest('hex').slice(0,64).toUpperCase();
  console.log("CheckID:", checkID);
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
