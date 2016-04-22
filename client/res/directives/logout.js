angular.module('auais').directive('logout', function ($state, auth) {
  return {
    restrict: 'A',
    compile: function ($elem, attrs) {
      $elem.on('click',function(){
        auth.logout().then(function () {
          $state.go('login');
        });
      });
    }
  }
});
