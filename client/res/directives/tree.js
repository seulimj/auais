angular.module('auais').directive('tree', function ($parse, $compile) {
  return {
    restrict: 'A',
    require: ['?^ngModel', '?^drop'],
    compile: function ($elem, attrs) {
      var name = attrs.name;
      var multiple = attrs.multiple === '';

      var toggle = attrs.toggle === '';
      var branchSelectable = attrs.branchSelectable === '';
      var expandSelected = attrs.expandSelected === '';
      var expandDeep = attrs.expandDeep || 0;
      var sourceExpression = attrs.tree;
      var itemsExpression = attrs.items;
      var valueExpression = attrs.val;
      var textExpression = attrs.txt;

      var selectedChangedExpression = attrs.selectedChanged;

      var selectedValueExpression = attrs.selectedValue;
      var selectedValueGetter = $parse(selectedValueExpression);
      var selectedValueSetter = selectedValueGetter.assign;

      var selectedExpression = attrs.selected;
      var selectedGetter = $parse(selectedExpression);
      var selectedSetter = selectedGetter.assign;

      var state = attrs.state === '' && multiple && !branchSelectable;

      var valueGetter = valueExpression ? $parse(valueExpression) : function (p) {
        return p;
      };
      var textGetter = textExpression ? $parse(textExpression) : valueGetter;
      var $nodeTemplate = $elem.children().remove();


      return function (scope, $elem, attrs, controllers) {


        var ngModel = controllers[0];
        var drop = controllers[1];

        var scopes;
        var treeScope;

        var init = function () {
          $elem.children().remove();
          angular.forEach(scopes, function (_scope) {
            _scope.$destroy();
          });
          scopes = [];
          treeScope && treeScope.$destroy();
          treeScope = scope.$new(true);

          if (name) {
            scope[name] = {};
            if (multiple)scope[name].$_selectAll = function (b) {
              angular.forEach(scopes, function (_scope) {
                _scope.$_selectMe(b);
                if (state) {
                  if (angular.isDefined(b)) {
                    _scope.$_state = b;
                  } else {
                    if (angular.isDefined(_scope.$_state))_scope.$_state = !_scope.$_state;
                  }
                }
              });
              change();
            };

            scope[name].$_expandAll = function (b) {
              angular.forEach(scopes, function (_scope) {
                _scope.$_expandMe(b);
              });
            };
          }


        };
        //init();

        var getSelected;
        if (multiple) {
          getSelected = function () {
            var items = [];
            angular.forEach(scopes, function (_scope) {
              _scope.$_canSelect && _scope.$_selected && items.push(_scope.$_item);
            });
            return items;
          };
        } else {
          getSelected = function () {
            for (var i = scopes.length; i--;) {
              var _scope = scopes[i];
              if (_scope.$_canSelect && _scope.$_selected)return scopes[i].$_item;
            }
          };
        }


        var getText;
        if (multiple) {
          getText = function () {
            var texts = [];
            angular.forEach(scopes, function (_scope) {
              _scope.$_canSelect && _scope.$_selected && texts.push(_scope.$_getText());
            });
            return texts.toString();
          };
        } else {
          getText = function () {
            for (var i = scopes.length; i--;) {
              var _scope = scopes[i];
              if (_scope.$_canSelect && _scope.$_selected)return scopes[i].$_getText();
            }
          };
        }


        var getValue;
        if (multiple) {
          getValue = function () {
            var values = [];
            angular.forEach(scopes, function (_scope) {
              _scope.$_canSelect && _scope.$_selected && values.push(_scope.$_getValue());
            });
            return values;
          };
        } else {
          getValue = function () {
            for (var i = scopes.length; i--;) {
              var _scope = scopes[i];
              if (_scope.$_canSelect && _scope.$_selected)return scopes[i].$_getValue();
            }
            return null;
          };
        }


        var change = function (value) {
          if (angular.isUndefined(value))value = getValue();
          ngModel && ngModel.$setViewValue(value);
          selectedValueSetter && selectedValueSetter(scope, value);
          selectedSetter && selectedSetter(scope, getSelected());

          selectedChangedExpression && scope.$eval(selectedChangedExpression);

          if (drop) {
            if (!multiple)drop.$_close();
            drop.$_setDirty();
            drop.$_setText(getText());
          }
        };

        var render = function (value) {
          if (angular.isUndefined(value))return;
          if (!multiple)value = [value];
          if (value.length <= 0)return;
          angular.forEach(scopes, function (_scope) {
            if (_scope.$_canSelect) {
              _scope.$_selected = $.inArray(_scope.$_getValue(), value) > -1;
              if (state && _scope.$_leaf)_scope.$_state = _scope.$_selected;
            }
          });
          angular.forEach(scopes, function (_scope) {
            _scope.$_selected && _scope.$_leaf && expandSelected && _scope.$_expandAncestry(true);
            state && _scope.$_root && _scope.$_setState();
          });
          drop && drop.$_setText(getText());
        };

        if (ngModel)ngModel.$render = function () {
          render(ngModel.$viewValue);
        };


        scope.$watch(sourceExpression, function (source) {
          init();
          if (!source)return;
          buildTree($elem, source, treeScope, -1);

          if (ngModel) {
            ngModel.$render();
          } else {
            if (selectedValueExpression) {
              render(selectedValueGetter(scope));
            }
          }
          selectedSetter && selectedSetter(scope, getSelected());
        });


        function buildTree($root, items, parentScope, deep) {
          deep++;
          var length = items.length;
          angular.forEach(items, function (item, index) {

            var itemScope = parentScope.$new(true);
            scopes.push(itemScope);

            itemScope.$_root = parentScope === treeScope;
            itemScope.$_item = item;
            itemScope.$_deep = deep;
            itemScope.$_index = index;
            itemScope.$_first = index === 0;
            itemScope.$_last = index === length - 1;

            itemScope.$_expandDeep = expandDeep;
            if (!multiple)itemScope.$_toggle = toggle;
            itemScope.$_branchSelectable = branchSelectable;

            itemScope.$_branch = !!item[itemsExpression];
            itemScope.$_leaf = !itemScope.$_branch;
            itemScope.$_canSelect = branchSelectable || itemScope.$_leaf;

            if (itemScope.$_canSelect)itemScope.$_selected = false;
            if (itemScope.$_branch)itemScope.$_expanded = expandDeep > deep;
            if (state)itemScope.$_state = false;


            itemScope.$_getValue = function () {
              return valueGetter(this.$_item);
            };

            itemScope.$_getText = function () {
              return textGetter(this.$_item);
            };


            itemScope.$_expandMe = function (b) {
              if (this.$_branch)this.$_expanded = angular.isDefined(b) ? b : !this.$_expanded;
            };

            itemScope.$on('expand', function (e, b) {
              itemScope.$_expandMe(b);
            });

            itemScope.$_expandAncestry = function (b) {
              itemScope.$emit('expand', b);
            };

            itemScope.$_expandPosterity = function (b) {
              itemScope.$broadcast('expand', b);
            };


            if (multiple)itemScope.$_selectMe = function (b) {
              if (itemScope.$_canSelect)
                itemScope.$_selected = angular.isDefined(b) ? b : !itemScope.$_selected;
            };


            if (multiple)itemScope.$on('select', function (e, b) {
              itemScope.$_selectMe(b);
            });

            if (state)itemScope.$on('set-state', function (e, b) {
              itemScope.$_state = b;
            });


            if (state)itemScope.$_getState = function () {
              if (this.$_leaf)return this.$_state;
              var children = [];
              angular.forEach(scopes, function (_scope) {
                if (_scope.$parent === itemScope)children.push(_scope);
              });
              var l = children.length;
              var t = 0, f = 0;
              for (var i = l; i--;) {
                var s = children[i].$_getState();
                s === true && t++;
                s === false && f++;
              }
              if (t == l)return true;
              if (f == l)return false;
            };

            if (state)itemScope.$_setState = function () {
              if (this.$_leaf)return this.$_state;
              var children = [];
              angular.forEach(scopes, function (_scope) {
                if (_scope.$parent === itemScope)children.push(_scope);
              });
              var l = children.length;
              var t = 0, f = 0;
              for (var i = l; i--;) {
                var s = children[i].$_setState();
                s === true && t++;
                s === false && f++;
              }
              if (t == l)return this.$_state = true;
              if (f == l)return this.$_state = false;
              return this.$_state = undefined;
            };


            if (state)itemScope.$on('check-state', function (e, b) {
              var me = e.currentScope;
              if (e.targetScope === me)return;
              var children = [];
              angular.forEach(scopes, function (_scope) {
                if (_scope.$parent === me)children.push(_scope);
              });
              var l = children.length;
              var t = 0, f = 0;
              for (var i = l; i--;) {
                var s = children[i].$_getState();
                s === true && t++;
                s === false && f++;
              }
              if (t == l)me.$_state = true;
              else if (f == l)me.$_state = false;
              else me.$_state = undefined;
            });

            if (multiple)itemScope.$_selectEx = function (b) {
              if (angular.isUndefined(b)) {
                b = state ? !itemScope.$_state : !itemScope.$_selected;
              }
              itemScope.$broadcast('select', b);
              if (state) {
                itemScope.$broadcast('set-state', b);
                itemScope.$emit('check-state', b);
              }
              change();
            };

            if (multiple) {
              itemScope.$_select = function () {
                if (!this.$_canSelect)return;
                this.$_selected = !this.$_selected;
                change();
              };
            } else {
              itemScope.$_select = function () {
                if (!this.$_canSelect)return;
                var value;
                if (this.$_selected) {
                  if (toggle) {
                    this.$_selected = false;
                    value = null;
                  }
                } else {
                  angular.forEach(scopes, function (_scope) {
                    _scope.$_selected = _scope === itemScope;
                  });
                  value = this.$_getValue();
                }
                if (angular.isDefined(value))change(value);
              };
            }


            var $node = $nodeTemplate.clone();
            $compile($node)(itemScope);
            $root.append($node);

            var $childrenNodes = $node.find('.tree-children-nodes');
            item[itemsExpression] ?
              buildTree($childrenNodes, item[itemsExpression], itemScope, deep)
              : $childrenNodes.remove();

          });
        }
      }
    }
  };
});

