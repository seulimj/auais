angular.module('auais').directive('display', function ($parse) {
  return {
    restrict: 'A',
    link: function (scope, $elem, attrs, ngModel) {

      var getter = $parse(attrs.display);
      var setter = getter.assign;
      var modes = attrs.modes.split(';');
      var displayChangedExpression = attrs.displayChanged;

      var selectedClass = 'active';

      var dict = {
        table: '表格',
        list: '列表',
        th: '小图标',
        'th-large': '大图标'
      }

      var currentMode = getter(scope);
      if (!currentMode) {
        currentMode = modes[0];
        scope.$applyAsync(function () {
          setter(scope, currentMode);
        });
      }

      $elem.addClass('list-group');


      angular.forEach(modes, function (mode) {
        var $item = angular.element('<a class="list-group-item drop-close" style="cursor: pointer"></a>');
        var $icon = angular.element('<i class="fa" style="width: 20px"></i>');
        $icon.addClass('fa-' + mode);

        $item.append($icon).append(dict[mode]);
        $item.data('mode', mode);
        mode === currentMode ? $item.addClass(selectedClass) : $item.removeClass(selectedClass);

        $item.on('click', function () {
          var $this = angular.element(this);
          if ($this.hasClass(selectedClass))return;
          $this.parent().children().removeClass(selectedClass);
          $this.addClass(selectedClass);
          scope.$apply(function () {
            setter(scope, $this.data('mode'));
          });
          displayChangedExpression && scope.$eval(displayChangedExpression);
        });

        $elem.append($item);
      });

    }
  }
});


