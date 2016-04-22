angular.module('auais').directive('toolbar', function ($compile, $state) {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    template: '<div ng-style="{\'box-shadow\':$navbarShadow?\'0 6px 12px rgba(0, 0, 0, 0.175)\':\'\'}"></div>',

    compile: function ($elem, attrs) {
      var height = '34px';
      var here = attrs.here;
      $elem.addClass('panel');
      $elem.css('height', height);
      $elem.css('line-height', height);
      $elem.css('margin', '0');
      $elem.css('padding', '0');
      $elem.css('border-radius', '0');
      $elem.css('border-width', '0');
      $elem.css('position', 'fixed');
      $elem.css('top', '50px');
      $elem.css('left', '0px');
      $elem.css('width', '100%');
      $elem.css('z-index', '201');

      $elem.append('<div ng-transclude class="pull-right visible-lg-inline visible-md-inline visible-sm-inline"></div>');

      if (!here)return;
      var $here = angular.element('<div class="pull-left text-primary" style="font-size: 12px;"></div>');
      $here.append('<i class="fa fa-street-view fa-lg" style="margin: 0 8px"></i>');
      $here.append('当前位置：' + here);
      $elem.append($here);
    }
  }
});
