angular.module('application').controller('TempletController', function ($scope, templetService, initScope,$timeout) {
  initScope($scope, templetService);

  $scope.gs = {};
  $scope.gs.pString = function (value) {
    if (angular.isUndefined(value))return $scope.queryObject.query.pString && $scope.queryObject.query.pString.$regex;
    $scope.queryObject.query.pString = $scope.queryObject.query.pString || {};
    $scope.queryObject.query.pString.$regex = value;
  };

  $timeout(function () {
    $scope.a = [
      {
        state: {id: 5},
        name: '5项'
      },
      {
        state: {id: 6},
        name: '6项'
      },
      {
        state: {id: 7},
        name: '7项'
      },
      {
        state: {id: 8},
        name: '8项'
      }
    ];
  }, 500);


  $scope.me = 6;
  $scope.setMe = function (value) {
    return angular.isDefined(value) ? ($scope.me = value) : $scope.me;
  }
});
