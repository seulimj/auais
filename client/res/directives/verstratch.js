angular.module('auais').directive('verstratch', function (windowResize) {
  return {
    restrict: 'A',
    compile: function ($elem, attrs) {
      var setSize = function () {
        $elem.css('min-height', parseInt(window.innerHeight) - 120 + 'px');
      };
      setSize();
      windowResize.bind(setSize);
    }
  }
});
