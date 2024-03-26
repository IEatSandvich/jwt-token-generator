const crypto = require('crypto');
const fs = require('node:fs');
const base64url = require('base64url');

const jti = crypto.randomUUID();
const FIVE_MINUTES = 5 * 60;
const key = fs.readFileSync('private_key.pem');

const header = {
  alg: 'RS256',
  typ: 'JWT',
};

const payload = {
  iss: process.env.JWT_ISSUER,
  sub: process.env.JWT_SUBJECT,
  aud: process.env.JWT_AUDIENCE,
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + FIVE_MINUTES,
  jti,
};

const stringifiedHeader = JSON.stringify(header);
const stringifiedPayload = JSON.stringify(payload);

const encodedHeader = base64url(stringifiedHeader);
const encodedPayload = base64url(stringifiedPayload);

const tokenData = `${encodedHeader}.${encodedPayload}`;

const sign = crypto.createSign('RSA-SHA256');
sign.update(tokenData);
const signature = sign.sign(key);
const encodedSignature = base64url(signature);

console.log(`${tokenData}.${encodedSignature}`);
