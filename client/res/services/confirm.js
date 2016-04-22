angular.module('auais').factory('confirm', function ($window, $q) {
    return function (message) {
      var defer = $q.defer();
      if ($window.confirm(message)) {
        defer.resolve(true);
      } else {
        defer.reject(false);
      }
      return defer.promise;
    };
  }
);
