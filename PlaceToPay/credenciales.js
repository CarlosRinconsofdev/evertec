const crypto = require('crypto');

const login = "2d9eaf1e662518756a3d78806543af5b";
const secretKey = "3YC5brb5eAR4xBGQ";
const seed = new Date().toISOString();
const rawNonce = Math.floor(Math.random() * 1000000);

const tranKey = Buffer.from(crypto.createHash('sha256').update(rawNonce + seed + secretKey).digest(), 'binary').toString('base64');
const nonce = Buffer.from(rawNonce.toString()).toString('base64');

const body = {
  auth: {
    login: login,
    tranKey: tranKey,
    nonce: nonce,
    seed: seed,
  },
  // ... other params
};


console.log(`seed: ${seed}`);
console.log(`nonce: ${nonce}`);
console.log(`tranKey: ${tranKey}`);