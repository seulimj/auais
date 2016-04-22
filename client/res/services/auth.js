angular.module('auais').provider('auth', function () {
  var _authUrl;
  var _clientId;
  var _clientSecret;

  return {

    authUrl: function (value) {
      _authUrl = value;
      return this;
    },
    clientId: function (value) {
      _clientId = value;
      return this;
    },
    clientSecret: function (value) {
      _clientSecret = value;
      return this;
    },

    $get: function ($rootScope, $http, $q, $base64, browserStorage) {

      var loadIdentity = function () {
        $rootScope.$identity = {login: false};
        var identity = browserStorage.session.get('identity');
        if (identity) {
          $rootScope.$identity.login = true;
          $rootScope.$identity.token = identity.token;
          $rootScope.$identity.user = identity.user;
        }
      };

      var logout = function () {
        var deferred = $q.defer();
        browserStorage.session.remove('identity');
        $rootScope.$identity.login = false;
        $rootScope.$identity.token = undefined;
        $rootScope.$identity.user = undefined;
        deferred.resolve();
        return deferred.promise;
      };


      var login = function (username, password) {

        var deferred = $q.defer();

        var identity = {token: '1234567890', user: {
          name: 'name',
          email: 'email',
          mobile: 'mobile',
          realName: 'realName'
        }};
        browserStorage.session.set('identity', identity);
        $rootScope.$identity.login = true;
        $rootScope.$identity.token = identity.token;
        $rootScope.$identity.user = identity.user;
        deferred.resolve(identity);

        return deferred.promise;
      };





      return {
        loadIdentity: loadIdentity,
        login: login,
        logout: logout
      }


    }
  }
});