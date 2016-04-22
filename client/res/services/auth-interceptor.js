angular.module('auais').factory('authInterceptor', function ($q, $rootScope) {


  var request = function (config) {
    config.headers = config.headers || {};
    if ($rootScope.$identity.login) {
      config.headers.Authorization = config.headers.Authorization || 'Bearer ' + $rootScope.$identity.token;
    }
    return config;
  };

  var responseError = function (rejection) {
    if (rejection.status === 401) {
     // $state.go('login');
    }
    return $q.reject(rejection);
  };


  return {
    request: request,
    responseError: responseError
  }
});
