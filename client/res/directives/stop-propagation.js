angular.module('auais').directive('stopPropagation', function () {
  return {
    restrict: 'A',
    link: function (scope,$elem, attrs) {
      $elem.on('click',function(e){
        e.stopPropagation();
      });
    }
  }
});

