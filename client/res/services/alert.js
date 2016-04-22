angular.module('auais').factory('alert', function ($window, $q) {
    return function (message) {
      var defer = $q.defer();
      $window.alert(message);
      defer.resolve();
      return defer.promise;
    };
  }
);
