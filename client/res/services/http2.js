angular.module('auais').provider('http2', function () {

  return {
    $get: function ($rootScope, $http, $q, security) {

      //附加查询字符串
      var attachQuery = function (url, queries) {
        for (var i = 1, l = arguments.length; i < l; i++) {
          var q = arguments[i];
          var char = url.indexOf('?') === -1 ? '?' : '&';
          var qs = q ? $.param(q) : '';
          if (qs === '')char = '';
          url += char + qs;
        }
        return url
      };


      var buildKeyIvQuery = function (keyIvData) {
        var encryptedKeyIv = security.asymEncryptKeyIv(keyIvData);
        return {
          _k_: encryptedKeyIv.encryptedKey,
          _i_: encryptedKeyIv.encryptedIv
        };
      };

      var buildDtoQuery = function (dto, keyIvData) {
        return {
          _d_: security.symEncrypt(JSON.stringify(dto), keyIvData)
        };
      };

      var buildAuthQuery = function (userId, token) {

      };

      var sign = function (url) {
        if (!$rootScope.$identity.login)return url;
        url = attachQuery(url, {
          _u_: $rootScope.$identity.userId,
          _t_: new Date().getTime()
        });
        return attachQuery(url, {
          _s_: security.sign(url + $rootScope.$identity.token)
        });
      };


      var decrypt = function (encryptedMessage, keyIvData) {
        var jsonString = security.symDecrypt(encryptedMessage, keyIvData);
        return JSON.parse(jsonString);
      };

      var errorHandler = function (res) {
        return $q.reject(res)
      };

      var successHandler = function (keyIvData) {
        if (keyIvData) {
          return function (res) {
            return decrypt(res.data, keyIvData);
          }
        } else {
          return function (res) {
            return res.data;
          }
        }
      };


      var get = function (api, dto) {
        var url = api.url;
        if (api.security) {
          var keyIvData = security.createKeyIvData();
          url = attachQuery(url, buildKeyIvQuery(keyIvData), buildDtoQuery(dto, keyIvData));
          return $http.get(sign(url)).then(successHandler(keyIvData), errorHandler);
        } else {
          url = attachQuery(url, dto);
          return $http.get(sign(url)).then(successHandler(), errorHandler);
        }
      };

      var put = function (api, dto) {
        var url = api.url;
        if (api.security) {
          var keyIvData = security.createKeyIvData();
          url = attachQuery(url, buildKeyIvQuery(keyIvData), buildDtoQuery(dto, keyIvData));
          return $http.get(url).then(successHandler(keyIvData), errorHandler);
        } else {
          url = attachQuery(url, dto);
          return $http.get(url).then(successHandler(), errorHandler);
        }
        return $http.put(path, dto).then(
          function (res) {
            return res.data;
          },
          function (res) {
            return $q.reject(res.statusText)
          }
        )
      }

      var post = function (path, dto) {
        return $http.post(path, dto).then(
          function (res) {
            return res.data;
          },
          function (res) {
            return $q.reject(res.statusText)
          }
        )
      };

      var del = function (path) {
        return $http.delete(path).then(
          function (res) {
            return res.data;
          },
          function (res) {
            return $q.reject(res.statusText)
          }
        )
      };


      return {
        get: get,
        put: put,
        post: post,
        delete: del
      };
    }
  };


});



