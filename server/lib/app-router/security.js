'use strict';

var forge = require('node-forge');


function asymDecrypt(encryptedMessageBuf, priKey) {
  return forge.pki.privateKeyFromPem(priKey).decrypt(encryptedMessageBuf);
}

function serialize(buf) {
  return forge.util.bytesToHex(buf);
}

function deserialize(hex) {
  return forge.util.createBuffer(forge.util.hexToBytes(hex), 'raw');
}

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

function symEncrypt(message, keyIvData) {
  var cipher = forge.cipher.createCipher('AES-CBC', keyIvData.keyData);
  cipher.start({iv: keyIvData.ivData});
  cipher.update(forge.util.createBuffer(message));
  cipher.finish();
  var encryptedMessageBuf = cipher.output;
  return serialize(encryptedMessageBuf)
}


function symDecrypt(encryptedMessage, keyIvData) {
  var decipher = forge.cipher.createDecipher('AES-CBC', keyIvData.keyData);
  decipher.start({iv: keyIvData.ivData});
  decipher.update(deserialize(encryptedMessage));
  decipher.finish();
  return decipher.output.data;
}


module.exports = (req, res, next)=> {
  const encryptedKeyIv = {
    encryptedKey: req.query._k_,
    encryptedIv: req.query._i_
  };
  if (!encryptedKeyIv.encryptedKey || !encryptedKeyIv.encryptedIv){
    return res.err.cryptoError();
  }
  let keyIvData;
  try {
    keyIvData = asymDecryptKeyIv(encryptedKeyIv, req.priKey);
  }
  catch (err) {
    return res.err.cryptoError(err);
  }
  const encryptedQuery = req.query._d_;
  const encryptedBody = req.body;
  if (encryptedQuery) {
    try {
      Object.assign(req.query, JSON.parse(symDecrypt(encryptedQuery, keyIvData)));
    }
    catch (err) {
      return res.err.cryptoError(err);
    }
  }
  delete req.query._k_;
  delete req.query._i_;
  delete req.query._d_;
  if (Object.keys(encryptedBody).length > 0) {
    try {
      req.body = JSON.parse(symDecrypt(encryptedBody, keyIvData));
    }
    catch (err) {
      return res.err.cryptoError(err);
    }

  }
  res.json = function (obj) {
    var encrypted = symEncrypt(JSON.stringify(obj), keyIvData);
    this.send(encrypted);
  };
  next();
};


module.exports = priKey=> {

  return (req, res, next)=> {
    const encryptedKeyIv = {
      encryptedKey: req.query._k_,
      encryptedIv: req.query._i_
    };
    if (!encryptedKeyIv.encryptedKey || !encryptedKeyIv.encryptedIv)return req.err.cryptoError(next);
    let keyIvData;
    try {
      keyIvData = asymDecryptKeyIv(encryptedKeyIv, priKey);
      console.log(keyIvData)
    }
    catch (err) {
      return req.err.cryptoError(next, err);
    }
    const encryptedQuery = req.query._d_;
    const encryptedBody = req.body;
    if (encryptedQuery) {
      try {
        Object.assign(req.query, JSON.parse(symDecrypt(encryptedQuery, keyIvData)));
      }
      catch (err) {
        return req.err.cryptoError(next, err);
      }
    }
    delete req.query._k_;
    delete req.query._i_;
    delete req.query._d_;
    if (Object.keys(encryptedBody).length > 0) {
      try {
        req.body = JSON.parse(symDecrypt(encryptedBody, keyIvData));
      }
      catch (err) {
        return req.err.cryptoError(next, err);
      }

    }
    res.json = function (obj) {
      var encrypted = symEncrypt(JSON.stringify(obj), keyIvData);
      res.send(encrypted);

    };
    next();
  }


};
