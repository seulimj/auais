angular.module('auais').directive('arrayEditor', function ($compile, confirm) {
  return {
    restrict: 'A',
    require: ['ngModel'],
    compile: function ($elem, attrs) {

      $elem.find('.readonly-template').attr('ng-show', '$_readonly');
      $elem.find('.edit-template').attr('ng-show', '!$_readonly');
      var $template = $elem.children().remove();
      var newItemExpression = attrs.newItem || '{}';


      return function (scope, $elem, attrs, controllers) {

        var ngModel = controllers[0];
        var scopes = [];

        var setViewValue = function (itemObjects) {
          var values = [];
          angular.forEach(itemObjects, function (itemObject) {
            values.push(itemObject.item);
          });
          ngModel.$setViewValue(values);
        };

        var render = function (itemObjects) {
          angular.forEach(scopes, function (_scope) {
            _scope.$destroy();
          });
          scopes = [];
          $elem.children().remove();


          var length = itemObjects.length;
          var newItem = scope.$eval(newItemExpression);
          if (length === 0) {
            itemObjects.push({isNew: true, item: newItem});
          }
          length = itemObjects.length;
          angular.forEach(itemObjects, function (itemObject, index) {

            var itemScope = scope.$new();

            itemScope.$_length = length;
            itemScope.$_index = index;
            itemScope.$_first = index === 0;
            itemScope.$_last = index === length - 1;
            itemScope.$_middle = index > 0 && index < length - 1;

            itemScope.$_itemObject = itemObject;
            itemScope.$_item = itemObject.item;

            itemScope.$_isNew = itemObject.isNew;
            itemScope.$_readonly = !itemObject.isNew;
            itemScope.$_editing = false;

            itemScope.$_up = function () {
              if (this.$_first)return;
              var temp = itemObjects[this.$_index - 1];
              itemObjects[this.$_index - 1] = this.$_itemObject;
              itemObjects[this.$_index] = temp;
              setViewValue(itemObjects);
              ngModel.$render();
            };

            itemScope.$_down = function () {
              if (this.$_last)return;
              var temp = itemObjects[this.$_index + 1];
              itemObjects[this.$_index + 1] = this.$_itemObject;
              itemObjects[this.$_index] = temp;
              setViewValue(itemObjects);
              ngModel.$render();
            };


            itemScope.$_insert = function (_index) {
              itemObjects.splice(_index, 0, {isNew: true, item: newItem});
              render(itemObjects);
              angular.forEach(scopes, function (_scope) {
                _scope.$_editing = true;
              });
            };


            itemScope.$_edit = function () {
              angular.forEach(scopes, function (_scope) {
                _scope.$_editing = true;
              });
              itemScope.$_readonly = false;
            };

            itemScope.$_cancel = function () {
              ngModel.$render();
            };

            itemScope.$_submit = function () {
              this.$_itemObject.item = this.$_item;
              setViewValue(itemObjects);
              ngModel.$render();
            };

            itemScope.$_delete = function () {
              confirm('您确定要删除吗？').then(
                function () {
                  itemObjects.splice(itemScope.$_index, 1);
                  setViewValue(itemObjects);
                  ngModel.$render();
                }
              );
            };

            scopes.push(itemScope);
            var $item = $template.clone();
            $compile($item)(itemScope);
            $elem.append($item);
          });

        };

        ngModel.$render = function () {

          var values = angular.copy(ngModel.$viewValue);
          var itemObjects = [];
          angular.forEach(values, function (value) {
            itemObjects.push({isNew: false, item: value});
          });
          render(itemObjects);
        };


      };
    }
  };
});


angular.module('auais').directive('arrayEditor1', function ($compile) {
  return {
    restrict: 'A',
    require: ['ngModel'],
    compile: function ($elem, attrs) {

      $elem.find('.readonly-template').attr('ng-if', '$_readonly');
      $elem.find('.edit-template').attr('ng-if', '!$_readonly');
      var $emptyTemplate = $elem.find('.empty-template').remove();
      var $template = $elem.children().remove();

      return function (scope, $elem, attrs, controllers) {

        var ngModel = controllers[0];
        var scopes = [];

        var createItemScope = function (item, index, values, isNew) {

          var length = values.length;
          var itemScope = scope.$new();

          itemScope.$_length = length;
          itemScope.$_isNew = isNew || false;
          itemScope.$_item = item;
          itemScope.$_index = index;
          itemScope.$_first = index === 0;
          itemScope.$_last = index === length - 1;
          itemScope.$_middle = index > 0 && index < length - 1;

          itemScope.$_readonly = !itemScope.$_isNew;
          itemScope.$_editing = false;

          itemScope.$_up = function () {
            if (this.$_first)return;
            var temp = values[this.$_index - 1];
            values[this.$_index - 1] = this.$_item;
            values[this.$_index] = temp;
            ngModel.$setViewValue(values);
            ngModel.$render();
          };

          itemScope.$_down = function () {
            if (this.$_last)return;
            var temp = values[this.$_index + 1];
            values[this.$_index + 1] = this.$_item;
            values[this.$_index] = temp;
            ngModel.$setViewValue(values);
            ngModel.$render();
          };


          itemScope.$_insertBefore = function (insertItem) {
            angular.forEach(scopes, function (_scope) {
              _scope.$_editing = true;
            });
            var $insertItem = $template.clone();
            var insertScope = createItemScope(insertItem, -1, values, true);
            $compile($insertItem)(insertScope);
            $elem.children().eq(this.$_index).before($insertItem);
            values.splice(this.$_index, 0, insertScope.$_item);
          };


          itemScope.$_insertAfter = function (insertItem) {
            angular.forEach(scopes, function (_scope) {
              _scope.$_editing = true;
            });
            var $insertItem = $template.clone();
            var insertScope = createItemScope(insertItem, -1, values, true);
            $compile($insertItem)(insertScope);
            $elem.children().eq(this.$_index).after($insertItem);
            values.splice(this.$_index + 1, 0, insertScope.$_item);
          };

          itemScope.$_edit = function () {
            angular.forEach(scopes, function (_scope) {
              _scope.$_editing = true;
            });
            itemScope.$_readonly = false;
          };

          itemScope.$_cancel = function () {
            ngModel.$render();
          };

          itemScope.$_submit = function () {
            values[this.$_index] = this.$_item;
            ngModel.$setViewValue(values);
            ngModel.$render();
          };

          itemScope.$_delete = function () {
            values.splice(this.$_index, 1);
            ngModel.$setViewValue(values);
            ngModel.$render();
          };

          return itemScope;

        }

        ngModel.$render = function () {
          angular.forEach(scopes, function (_scope) {
            _scope.$destroy();
          });
          scopes = [];
          $elem.children().remove();

          var values;
          if (!(ngModel.$viewValue && ngModel.$viewValue.length)) {
            values = [];
            if (!$emptyTemplate.length)return;
            var $empty = $emptyTemplate.clone();
            var emptyScope = scope.$new();
            scopes.push(emptyScope)
            emptyScope.$_insert = function (insertItem) {
              $elem.children().remove();
              var $insertItem = $template.clone();
              var insertScope = createItemScope(insertItem, -1, values, true);
              $compile($insertItem)(insertScope);
              $elem.append($insertItem);
              values.push(insertScope.$_item);
            };
            $compile($empty)(emptyScope);
            $elem.append($empty);
            return;
          }

          values = angular.copy(ngModel.$viewValue);
          angular.forEach(values, function (item, index) {
            var itemScope = createItemScope(item, index, values);
            scopes.push(itemScope);
            var $item = $template.clone();
            $compile($item)(itemScope);
            $elem.append($item);
          });

        };
      };
    }
  };
});