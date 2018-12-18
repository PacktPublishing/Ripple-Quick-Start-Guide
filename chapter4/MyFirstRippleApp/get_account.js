'use strict';
const RippleAPI = require('ripple-lib').RippleAPI;

const api = new RippleAPI({
  server: 'wss://s.altnet.rippletest.net:51233' // Ripple Test Network Address
});

api.connect().then(() => {
  const accountAddress = 'r41sFTd4rftxY1VCn5ZDDipb4KaV5VLFy2';

  console.log('Fetching account details of', accountAddress);
  return api.getAccountInfo(accountAddress);

}).then(info => {
  console.log(info);
  console.log('Account Details Fetched');
}).then(() => {
  return api.disconnect();
}).then(() => {
  console.log('Disconnected from the test net.');
}).catch(console.error);
