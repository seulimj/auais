angular.module('application').controller('LoginController', function ($scope,$rootScope, $state, auth,api) {


  $scope.submit = function () {


    api('login').request({username:$scope.username, password:$scope.password}).then(
      function (data){
        $rootScope.$identity.login = true;
        $rootScope.$identity.token = data.token;
        $rootScope.$identity.userId = data.userId;
      }


    );

  };
});

