const cc = require('five-bells-condition')
const crypto = require('crypto')

const preimageData = crypto.randomBytes(32);
const myFulfillment = new cc.PreimageSha256();
myFulfillment.setPreimage(preimageData);

const condition = myFulfillment.getConditionBinary().toString('hex').toUpperCase();
console.log('Condition:', condition);

const fulfillment = myFulfillment.serializeBinary().toString('hex').toUpperCase();
console.log('Fulfillment:', fulfillment);
