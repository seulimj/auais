'use strict';
var forge = require('node-forge');
var pubkey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCAzuLPBPLzE0owmaUufPOkQJXU
0+k9d2YSGYrm3v3DXWxeW/WlT0gorZlUE0TSRk8ohI75dj/DUYscxNdRfMld2xJl
ch/NdsS3Jn39m+PDz9IITaJb0MccRtltXqSXQX874uyep0qtV781pGlrf60LXsC8
qdqLcJuPzKRwsJ7oXQIDAQAB
-----END PUBLIC KEY-----`;

var prikey = `-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQCAzuLPBPLzE0owmaUufPOkQJXU0+k9d2YSGYrm3v3DXWxeW/Wl
T0gorZlUE0TSRk8ohI75dj/DUYscxNdRfMld2xJlch/NdsS3Jn39m+PDz9IITaJb
0MccRtltXqSXQX874uyep0qtV781pGlrf60LXsC8qdqLcJuPzKRwsJ7oXQIDAQAB
AoGAevB7i+mGVLipi99pyAgcpz25hAvKRw9pzYaxi490Fv5ZC2qr917HWYPvn05Q
1n2i2eJDcBgL3ck7hHbfp/f5XIC1nFOohBp+jniqjA+ca8NxuOLNcHVxRWpUgPb2
qjjQ8dAq6TZbYsqHFdXTO+upWmelJvtETWYIOmYq68TT9WECQQCHds65W2X6WRX3
cHJR8Ul+vZqdynEFjX7k/0O7CH6xtvJ49UxL5BxfDc0gaVfNmOcEikpUQe4OYJwe
EyjAzWO1AkEA82vt+NnJB8sUK5cnGZHo8itErBS4gwxKBT1eFraXUD9KYzTGidNJ
hreNz/nl5zy0PwoK87kdr+9gA1RL6WsrCQJAY4zaCrmyTbJeREMsoC9z1WI9WCxH
ts7vLBazjaWGhc9ujZmnAjaW6vvXfTQtRHhTfbCrQxRYf9RbpnZqApZt6QJBALms
GK+ZRzrXj0IUoHFjl2Co2k+72mWzSP6oKY1/pvlB3XbAebQFYu8MMXJy9gckiYQQ
H/x5tghNuVmwwdqAsSkCQBVgl+Iij4J4zOoH87oU5/km6ZuuU0LrxERXXM/cTjJ7
usSyk4dguRjYKglFa9xD7eqtnNsEDDnGT3TKeuI25T0=
-----END RSA PRIVATE KEY-----`;

function asymEncrypt(message, pubKey) {
  return forge.pki.publicKeyFromPem(pubKey).encrypt(message);
}

function asymDecrypt(encryptedMessageBuf, priKey) {
  return forge.pki.privateKeyFromPem(priKey).decrypt(encryptedMessageBuf);
}

function serialize(buf) {
  return forge.util.bytesToHex(buf);
}

function deserialize(hex) {
  return forge.util.createBuffer(forge.util.hexToBytes(hex), 'raw');
}

function createKeyIvData() {
  return {
    keyData: forge.random.getBytesSync(32),
    ivData: forge.random.getBytesSync(32)
  };
}

function asymEncryptKeyIv(keyIvData, pubKey) {
  return {
    encryptedKey: serialize(asymEncrypt(serialize(keyIvData.keyData), pubKey)),
    encryptedIv: serialize(asymEncrypt(serialize(keyIvData.ivData), pubKey))
  };
}

console.log('==================KeyIvData');
var keyIvData = createKeyIvData();
console.log(keyIvData);

console.log('==================encryptedKeyIv');
var encryptedKeyIv = asymEncryptKeyIv(keyIvData, pubkey);
console.log(encryptedKeyIv);
console.log('==================encryptedKey');
console.log(encryptedKeyIv.encryptedKey);
console.log('==================encryptedIv');
console.log(encryptedKeyIv.encryptedIv);



function symEncrypt(message, keyIvData) {
  var cipher = forge.cipher.createCipher('AES-CBC', keyIvData.keyData);
  cipher.start({iv: keyIvData.ivData});
  cipher.update(forge.util.createBuffer(message));
  cipher.finish();
  var encryptedMessageBuf = cipher.output;
  return serialize(encryptedMessageBuf)
}

console.log('==================encryptedMessage');
var encryptedMessage = symEncrypt('{"a":123456}', keyIvData);
console.log(encryptedMessage);

function symDecrypt(encryptedMessage, keyIvData) {
  var decipher = forge.cipher.createDecipher('AES-CBC', keyIvData.keyData);
  decipher.start({iv: keyIvData.ivData});
  decipher.update(deserialize(encryptedMessage));
  decipher.finish();
  return decipher.output.data;
}

console.log('==================decryptedMessage');
var decryptedMessage = symDecrypt(encryptedMessage, keyIvData);
console.log(decryptedMessage);


function asymDecryptKeyIv(encryptedKeyIv, priKey) {
  var encryptedKeyBuf = deserialize(encryptedKeyIv.encryptedKey);
  var encryptedIvBuf = deserialize(encryptedKeyIv.encryptedIv);
  var keyBuf = deserialize(asymDecrypt(encryptedKeyBuf.data, priKey));
  var ivBuf = deserialize(asymDecrypt(encryptedIvBuf.data, priKey));
  return {
    keyData: keyBuf.data,
    ivData: ivBuf.data
  };
}

console.log('==================decryptedKeyIvData');
var falseKeyIv={
  encryptedKey:'1004ec131e3527b4fff2112562f6bb79e351a5121d1be1aa7e…4fe9bc0b792208cebbf723a06cc7ab8db3e5d4346fafbde',
  encryptedIv:'1004ec131e3527b4fff2112562f6bb79e351a5121d1be1aa7e…4fe9bc0b792208cebbf723a06cc7ab8db3e5d4346fafbde8323344'
};
var decryptedKeyIvData = asymDecryptKeyIv(encryptedKeyIv, prikey);
console.log(decryptedKeyIvData);
