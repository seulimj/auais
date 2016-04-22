angular.module('auais').directive('datetime', function ($filter) {
  return {
    restrict: 'EA',
    require: ['^ngModel', '?^drop'],
    replace: true,
    template: '<div  class="panel panel-default" style="width: 100%"></div>',
    link: function (scope, $elem, attrs, controllers) {
      var ngModel = controllers[0];
      var drop = controllers[1];
      var dirty = false;

      var options = {
        inline: true,
        showClear: true
      };

      $elem.datetimepicker(options).on('dp.change', function (e) {
        var _date = e.date ? e.date.format() : null;
        var text = e.date ? e.date.format() : '';
        ngModel.$setViewValue(_date);
        drop && scope.$applyAsync(function () {
          drop.$_setText(text);
          dirty && drop.$_setDirty();
          drop.$_close();
          dirty = true;
        });

      });

      ngModel.$render = function () {
        $elem.data("DateTimePicker").date(ngModel.$viewValue || null);
        drop && drop.$_setText(ngModel.$viewValue);
      };
    }
  };
});