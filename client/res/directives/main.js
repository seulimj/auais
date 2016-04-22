angular.module('auais').directive('main', function (windowResize) {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    template: '<div ng-style="{\'box-shadow\':$navbarShadow?\'0px 6px 12px rgba(0, 0, 0, 0.175)\':\'\'}" class="panel" style="padding: 15px 0;margin: 0 15px;border-radius: 0;border-width: 0"><div class="container-fluid"><div ng-transclude class="row"></div></div></div>',
    compile: function ($elem, attrs) {

      var setSize = function () {
        $elem.css('min-height', parseInt(window.innerHeight) - 115 + 'px');
      };
      setSize();
      windowResize.bind(setSize);
    }
  }
});
