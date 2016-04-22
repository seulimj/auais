angular.module('auais').directive('test', function () {
  return {
    restrict: 'A',
    compile: function ($elem, attrs) {
      $elem.css('background-color','#007196')
        .css('border','3px solid #ff0000');
    }
  }
});
