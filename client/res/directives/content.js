angular.module('auais').directive('content', function (windowResize) {
  return {
    restrict: 'A',
    compile: function ($elem, attrs) {
      $elem.addClass('well well-sm');
      $elem.css('margin', '0px 12px 0px 12px');



      var setSize = function () {
        $elem.css('min-height', parseInt(window.innerHeight) - 112 + 'px');
      };
      setSize();
      windowResize.bind(setSize);
    }
  }
});