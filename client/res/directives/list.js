angular.module('auais').directive('list', function ($parse, $compile) {
  return {
    restrict: 'A',
    transclude: true,
    require: ['^ngModel', '?^drop'],
    compile: function ($elem, attrs, transclude) {

      var toggle = attrs.toggle === '';
      var multiple = attrs.multiple === '';
      var sourceExpression = attrs.list;
      var valueExpression = attrs.val;
      var valueGetter = valueExpression ? $parse(valueExpression) : function (p) {
        return p;
      };
      var textExpression = attrs.txt;
      var textGetter = textExpression ? $parse(textExpression) : valueGetter;

      var selectedChangeExpression = attrs.selectedChange;

      return function (scope, $elem, attrs, controllers) {

        var ngModel = controllers[0];
        var drop = controllers[1];
        var scopes = [];


        var getText = function () {
          var texts = [];
          angular.forEach(scopes, function (_scope) {
            _scope.$_selected && texts.push(_scope.$_getText());
          });
          return texts.length ? texts.toString() : '';
        };

        var render = function (value) {
          var values = multiple ? value : [value];
          angular.forEach(scopes, function (_scope) {
            _scope.$_selected = $.inArray(_scope.$_getValue(), values) > -1;
          });
          drop && drop.$_setText(getText());
        };

        ngModel && (ngModel.$render = function () {
          render(ngModel.$viewValue);
        });

        scope.$watch(sourceExpression, function (source) {
          angular.forEach(scopes, function (_scope) {
            _scope.$destroy();
          });
          scopes = [];
          $elem.children().remove();

          if (!source)return;

          angular.forEach(source, function (item) {

            var itemScope = scope.$new();

            itemScope.$_item = item;
            itemScope.$_selected = false;
            itemScope.$_toggle = toggle;
            itemScope.$_multiple = multiple;

            itemScope.$_getValue = function () {
              return valueGetter(this.$_item);
            };

            itemScope.$_getText = function () {
              return textGetter(this.$_item);
            };

            itemScope.$_select = function () {
              var me = this;
              var value;
              if (!multiple) {
                if (this.$_selected) {
                  if (toggle) {
                    this.$_selected = false;
                    value = null;
                  }
                } else {
                  angular.forEach(scopes, function (_scope) {
                    _scope.$_selected = _scope === me;
                  });
                  value = this.$_getValue();
                }
              } else {
                this.$_selected = !this.$_selected;
                var values = [];
                angular.forEach(scopes, function (_scope) {
                  _scope.$_selected && values.push(_scope.$_getValue());
                });
                value = values;
              }

              if (angular.isUndefined(value))return;

              ngModel && ngModel.$setViewValue(value);
              selectedChangeExpression && scope.$eval(selectedChangeExpression);
              if (drop) {
                if (!multiple)drop.$_close();
                drop.$_setDirty();
                drop.$_setText(getText());
              }

            };

            scopes.push(itemScope);
            transclude(itemScope, function (clone) {
              $elem.append(clone);
            });

          });

          ngModel && ngModel.$render();

        });
      };
    }
  };
});
