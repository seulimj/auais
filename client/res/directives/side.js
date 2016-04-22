angular.module('auais').directive('side', function (windowResize) {
  return {
    restrict: 'A',
    compile: function ($elem, attrs) {
      $elem.css('width', width);
      $elem.css('margin', '0px 0px 0px 12px');
    }
  }
});


angular.module('auais').directive('side1', function (windowResize) {
  return {
    restrict: 'A',
    compile: function ($elem, attrs) {
      var width = attrs.sideWidth || '200px';

      $elem.attr('id', '__side__');
      $elem.addClass('well well-sm');
      $elem.css('position', 'fixed');
      $elem.css('top', '100px');
      $elem.css('left', '15px');
      $elem.css('overflow', 'auto');
      $elem.css('width', width);



      var setSize = function () {
        $elem.css('height', parseInt(window.innerHeight) - 115 + 'px');
      };
      setSize();
      windowResize.bind(setSize);
    }
  }
});