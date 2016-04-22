angular.module('auais').provider('security', function () {
  var _pubKey;

  return {

    pubKey: function (value) {
      _pubKey = value;
      return this;
    },

    $get: function () {
      function asymEncrypt(message) {
        return forge.pki.publicKeyFromPem(_pubKey).encrypt(message);
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

      function asymEncryptKeyIv(keyIvData) {
        return {
          encryptedKey: serialize(asymEncrypt(serialize(keyIvData.keyData))),
          encryptedIv: serialize(asymEncrypt(serialize(keyIvData.ivData)))
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

      function sign(message) {
        var md = forge.md.md5.create();
        md.update(message);
        return md.digest().toHex();
      }

      return {
        createKeyIvData: createKeyIvData,
        asymEncryptKeyIv: asymEncryptKeyIv,
        symEncrypt: symEncrypt,
        symDecrypt: symDecrypt,
        sign: sign
      };
    }
  }


});


