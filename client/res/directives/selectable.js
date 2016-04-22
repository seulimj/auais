



angular.module('auais').directive('list1', function ($parse, $compile) {
  return {
    restrict: 'A',
    require: ['^ngModel', '?^dropdown'],
    compile: function ($elem, attrs) {

      var echo = function (p) {
        return p
      };
      var toggle = attrs.toggle === '';
      var multiple = attrs.multiple === '';
      var sourceExpression = attrs.list;
      var valueExpression = attrs.val;
      var valueGetter = valueExpression ? $parse(valueExpression) : echo;
      var textExpression = attrs.txt;
      var textGetter = textExpression ? $parse(textExpression) : valueGetter;
      //var textFormatter = attrs.textFormatter;

      var $itemTemplate = $elem.children().remove();

      return function (scope, $elem, attrs, controllers) {

        var ngModel = controllers[0];
        var dropdown = controllers[1];
        var scopes = [];


        var getText = function () {
          var texts = [];
          angular.forEach(scopes, function (_scope) {
            _scope.selected && texts.push(_scope.getText());
          });
          return texts.length ? texts.toString() : '';
        };

        ngModel.$render = function () {
          var values = multiple ? ngModel.$viewValue : [ngModel.$viewValue];
          angular.forEach(scopes, function (_scope) {
            _scope.selected = $.inArray(_scope.getValue(), values) > -1;
          });
          dropdown && dropdown.setText(getText());
        };

        scope.$watch(sourceExpression, function (source) {
          if (!source)return;
          scopes = [];
          $elem.children().remove();

          angular.forEach(source, function (item) {

            var itemScope = scope.$new();
            itemScope.item = item;
            itemScope.selected = false;
            itemScope.toggle = toggle;
            itemScope.multiple = multiple;
            itemScope.getValue = function () {
              return valueGetter(this.item);
            };
            itemScope.getText = function () {
              return textGetter(this.item);
            };
            itemScope.select = function () {
              var me = this;
              var value;
              if (!multiple) {
                if (this.selected) {
                  if (toggle) {
                    this.selected = false;
                    ngModel.$setViewValue(value = null);
                  }
                } else {
                  angular.forEach(scopes, function (_scope) {
                    _scope.selected = _scope === me;
                  });
                  ngModel.$setViewValue(value = this.getValue());
                }
              } else {
                this.selected = !this.selected;
                var values = [];
                angular.forEach(scopes, function (_scope) {
                  _scope.selected && values.push(_scope.getValue());
                });
                ngModel.$setViewValue(value = values);
              }

              if (dropdown) {
                if (!multiple)dropdown.close();
                dropdown.setDirty();
                dropdown.setText(getText());
              }

            };

            scopes.push(itemScope);
            $elem.append($compile($itemTemplate.clone())(itemScope));
          });

          ngModel.$render();
        });
      };
    }
  };
});

angular.module('auais').directive('down', function () {
  return {
    restrict: 'A',
    require: ['^ngModel', '^dropdown'],
    compile: function ($elem, attrs) {
      return function (scope, $elem, attrs, controllers) {
        var ngModel = controllers[0];
        var dropdown = controllers[1];
        $elem.on('click', function () {
          scope.$apply(function () {
            ngModel.$text = new Date().toString()
            console.log(ngModel)
          });
          dropdown.close();

        });


      };
    }
  };
});

angular.module('auais').directive('dropdown2', function ($parse, $compile) {
  return {
    restrict: 'A',
    require: ['ngModel', '^form'],
    transclude: true,
    controller: ['$element', '$attrs', '$transclude', function ($elem, attrs, transclude) {
      this.ff = 'ff';

    }],
    compile: function ($elem, attrs, transclude) {
      return function (scope, $elem, attrs, controllers) {

        var ngModel = controllers[0];
        var ngForm = controllers[1];
        var formName = ngForm.$name;
        var name = ngModel.$name;
        var dropClass = 'class' + Math.random().toString().replace('.', '-');

        var $transclude = transclude(scope);
        $transclude.addClass(dropClass);
        $transclude.addClass('hidden');
        $transclude.css('position', 'absolute');
        $transclude.css('top', '1px');
        $transclude.css('z-index', '1000000');
        $transclude.css('box-shadow', '0 6px 12px rgba(0, 0, 0, 0.175)');

        var $input = $elem.prev();
        $input.addClass(dropClass);
        $input.css('cursor', 'pointer');
        $input.css('background-color', '#ffffff');
        $input.attr('readonly', '');
        $input.attr('ng-model', formName + '.' + name + '.$text');
        $compile($input)(scope);


        $elem.css('position', 'relative');
        $elem.css('margin-left', $input.css('margin-left'));
        $elem.css('margin-top', '-' + $input.css('margin-bottom'));
        $elem.append($transclude);

        var bodyClick = function (event) {
          var $target = $(event.target);
          if ($target.closest('.' + dropClass).length <= 0)close();
        };

        var open = function () {
          $transclude.removeClass('hidden');
          $('body').click(bodyClick);
        };

        var close = function () {
          $transclude.addClass('hidden');
          $('body').unbind('click', bodyClick);
        };

        $input.on('click', function () {
          $transclude.hasClass('hidden') ? open() : close();
        });

      };
    }
  };
});

angular.module('auais').directive('selectable', function ($parse, $compile) {
  return {
    restrict: 'A',
    require: 'ngModel',
    compile: function ($elem, attrs) {

      var echo = function (p) {
        return p
      };

      var toggle = attrs.toggle === '';
      var multiple = attrs.multiple === '';
      var sourceExpression = attrs.selectable;
      var valueExpression = attrs.valueExpression;
      var valueGetter = valueExpression ? $parse(valueExpression) : echo;
      var textExpression = attrs.textExpression;
      var textGetter = textExpression ? $parse(textExpression) : valueGetter;
      //var textFormatter = attrs.textFormatter;

      var $template = $elem.children().remove();

      return function (scope, $elem, attrs, ngModel) {

        var $transclude = $template;
        var $itemTemplate = $transclude.children().remove();
        var dropClass = 'class' + Math.random().toString().replace('.', '-');
        var formName = $elem.parents('form').attr('name');
        var name = attrs.name;

        $compile($transclude)(scope);
        $elem.append($transclude);
        $elem.css('position', 'relative');


        var $input = $elem.prev();
        $input.addClass(dropClass);
        $input.css('cursor', 'pointer');
        $input.css('background-color', '#ffffff');
        $input.attr('readonly', '');
        //$input.attr('onkeydown', 'return false;');
        $input.attr('ng-model', formName + '.' + name + '.$text');
        $compile($input)(scope);

        $transclude.addClass(dropClass);
        $transclude.addClass('hidden');
        $transclude.css('position', 'absolute');
        $transclude.css('top', '1px');
        $transclude.css('z-index', '1000000');
        $transclude.css('box-shadow', '0 6px 12px rgba(0, 0, 0, 0.175)');
        $transclude.css('margin-left', $input.css('margin-left'));
        $transclude.css('margin-top', '-' + $input.css('margin-bottom'));

        var bodyClick = function (event) {
          var $target = $(event.target);
          if ($target.closest('.' + dropClass).length <= 0)close();
        };

        var open = function () {
          $transclude.removeClass('hidden');
          $('body').click(bodyClick);
        };

        var close = function () {
          $transclude.addClass('hidden');
          $('body').unbind('click', bodyClick);
        };

        $input.on('click', function () {
          $transclude.hasClass('hidden') ? open() : close();
        });


        ///////////////////////////////////////////////////////////
        var scopes = [];


        var setText = function () {
          var texts = [];
          angular.forEach(scopes, function (_scope) {
            _scope.selected && texts.push(_scope.getText());
          });
          ngModel.$text = texts.length ? texts.toString() : '';
        };


        ngModel.$render = function () {
          console.log('$render');
          var values = multiple ? ngModel.$viewValue : [ngModel.$viewValue];
          angular.forEach(scopes, function (_scope) {
            _scope.selected = $.inArray(_scope.getValue(), values) > -1;
          });
          setText();
        };


        scope.$watch(sourceExpression, function (source) {
          if (!source)return;
          scopes = [];
          $transclude.children().remove();

          angular.forEach(source, function (item) {

            var itemScope = scope.$new();
            itemScope.item = item;
            itemScope.selected = false;
            itemScope.toggle = toggle;
            itemScope.multiple = multiple;
            itemScope.getValue = function () {
              return valueGetter(this.item);
            };
            itemScope.getText = function () {
              return textGetter(this.item);
            };
            itemScope.select = function () {
              var me = this;
              var value;
              if (!multiple) {
                if (this.selected) {
                  if (toggle) {
                    this.selected = false;
                    ngModel.$setViewValue(value = null);
                  }
                } else {
                  angular.forEach(scopes, function (_scope) {
                    _scope.selected = _scope === me;
                  });
                  ngModel.$setViewValue(value = this.getValue());
                }
              } else {
                this.selected = !this.selected;
                var values = [];
                angular.forEach(scopes, function (_scope) {
                  _scope.selected && values.push(_scope.getValue());
                });
                ngModel.$setViewValue(value = values);
              }
              //关闭下拉框
              if (!multiple)close();
              $input.addClass('ng-dirty');
              setText();
            };


            scopes.push(itemScope);
            $transclude.append($compile($itemTemplate.clone())(itemScope));
          });

          ngModel.$render();
        });
      };
    }
  };
});


angular.module('auais').directive('selectable1', function ($parse, $compile) {
  return {
    restrict: 'A',
    require: 'ngModel',
    compile: function ($elem, attrs) {

      var toggle = attrs.toggle === '';
      var multiple = attrs.multiple === '';
      var sourceExpression = attrs.selectable;
      var valueExpression = attrs.valueExpr;
      var selectableTemplate = attrs.selectableTemplate;

      var $itemTemplate = $elem.children().remove();


      if (selectableTemplate) {
        $itemTemplate = angular.element($('#' + selectableTemplate).html());
      }


      return function (scope, $elem, attrs, ngModel) {
        var scopes = [];

        ngModel.$render = function () {
          var values = multiple ? ngModel.$viewValue : [ngModel.$viewValue];
          angular.forEach(values, function (value) {
            angular.forEach(scopes, function (_scope) {
              _scope.selected = _scope.getValue() === value;
            });
          });
        };

        scope.$watch(sourceExpression, function (source) {
          if (!source)return;
          scopes = [];
          $elem.children().remove();

          angular.forEach(source, function (item) {

            var itemScope = scope.$new();
            itemScope.item = item;
            itemScope.selected = false;
            itemScope.toggle = toggle;
            itemScope.multiple = multiple;
            itemScope.getValue = function () {
              return valueExpression ? $parse(valueExpression)(this.item) : this.item;
            };
            itemScope.select = function () {
              var me = this;
              if (!multiple) {
                if (this.selected) {
                  if (toggle) {
                    this.selected = false;
                    ngModel.$setViewValue(null);
                  }
                } else {
                  angular.forEach(scopes, function (_scope) {
                    _scope.selected = _scope === me;
                  });
                  ngModel.$setViewValue(this.getValue());
                }
              } else {
                this.selected = !this.selected;
                var value = [];
                angular.forEach(scopes, function (_scope) {
                  _scope.selected && value.push(_scope.getValue());
                });
                ngModel.$setViewValue(value);
              }
            };

            scopes.push(itemScope);
            $elem.append($compile($itemTemplate.clone())(itemScope));
          });
        });
      };
    }
  };
});