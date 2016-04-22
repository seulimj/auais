angular.module('auais').provider('api', function () {
  return {

    $get: function ($rootScope, $http, $q, security) {

      var attachQuery = function (url, queries) {
        for (var i = 1, l = arguments.length; i < l; i++) {
          var q = arguments[i];
          var char = url.indexOf('?') === -1 ? '?' : '&';
          var qs = q ? $.param(q) : '';
          if (qs === '')char = '';
          url += char + qs;
        }
        return url;
      };


      var createKeyIvQuery = function (keyIvData) {
        var encryptedKeyIv = security.asymEncryptKeyIv(keyIvData);
        return {
          _k_: encryptedKeyIv.encryptedKey,
          _i_: encryptedKeyIv.encryptedIv
        };
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
        return $q.reject(res);
      };

      var createSuccessHandler = function (keyIvData) {
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


      var Api = function (name) {
        var options = $rootScope.config.api[name];
        this.path = options.path;
        this.url = options.path;
        this.method = options.method ? options.method.toUpperCase() : 'GET';
        this.open = !!options.open;
        this.security = !!options.security;
      };

      Api.prototype.params = function (obj) {
        for (var key in obj) {
          this.url = this.path.replace(':' + key, obj[key]);
        }
        return this;
      };

      Api.prototype.request = function (dto) {
        var options = {
          method: this.method
        };
        var url = this.url;
        var successHandler, keyIvData, data;
        if (this.security) {
          keyIvData = security.createKeyIvData();
          url = attachQuery(url, createKeyIvQuery(keyIvData));
          if (dto)data = security.symEncrypt(JSON.stringify(dto), keyIvData);
          if (this.method === 'GET' || this.method === 'DELETE') {
            if (data)url = attachQuery(url, {_d_: data});
          }
          successHandler = createSuccessHandler(keyIvData);
        } else {
          data = dto;
          if (this.method === 'GET' || this.method === 'DELETE') {
            if (data)urlurl = attachQuery(url, data);
          }
          successHandler = createSuccessHandler();
        }
        if (!this.open) {
          url = sign(url);
        }
        options.url = url;
        if (this.method === 'POST' || this.method === 'PUT') {
          if (data)options.data = data;
        }
        return $http(options).then(successHandler, errorHandler);
      };

      return function (name) {
        return new Api(name);
      }

    }
  }
});
