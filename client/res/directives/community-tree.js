angular.module('auais').directive('communityTree', function ($parse, $compile) {
  return {
    restrict: 'A',
    compile: function ($elem, attrs) {
      var name = attrs.name;
      var expandSelected = attrs.expandSelected === '';
      var expandDeep = attrs.expandDeep || 1;
      var sourceExpression = attrs.communityTree;
      var itemsExpression = attrs.items || 'items';
      var selectedChangedExpression = attrs.selectedChanged;
      var selectedExpression = attrs.selected;
      var selectedGetter = $parse(selectedExpression);
      var selectedSetter = selectedGetter.assign;
      var ctrlExpression = attrs.ctrl;
      var ctrlGetter = $parse(ctrlExpression);
      var ctrlSetter = ctrlGetter.assign;

      var typesGetter = $parse(attrs.types);

//' {{ $_item._id+":"+$_item.name+":"+$_item.type+"--index:"+$_index+"--deep:"+$_deep+"--expandDeep:"+$_expandDeep+"--isBranch:"+$_isBranch+"--isLeaf:"+$_isLeaf+"--selected:"+$_selected+"--expanded:"+$_expanded}}' +

      //<span aria-hidden="true" class="icon-iconfont-xingzhengquyu text-primary"></span>
      var $itemTemplate = angular.element(
        '<div class="class-{{$_item._id}}" style="margin-left: 10px">' +
        '<div style="line-height: 30px;position: relative">' +
        '<div ng-show="$_deep>0" class="panel panel-default" ng-style="{width:$_isLeaf?\'23px\':\'6px\'}" style="position:absolute;left:-10px;height:15px;border-width:0;border-bottom-width:1px;border-radius:0;box-shadow:0 0 0 rgba(0, 0, 0, 0);margin:0;"></div>'+
        '<i ng-click="$_expandMe()" style="cursor: pointer;width: 15px" ng-show="$_isBranch" class="fa fa-{{$_expanded?\'minus\':\'plus\'}}-square-o"></i>' +
        '<span ng-click="$_select()"  ng-class="{\'bg-primary\':$_selected}"  style="cursor:pointer;padding:0 5px;display: inline-block" ng-style="{\'margin-left\':$_isLeaf?\'15px\':\'0\'}">' +
        '<span aria-hidden="true" class="icon-iconfont-{{$_icon}}"></span>' +
        ' {{$_item.name}}' +
        '</span>' +
        '</div></div>');

      var $childrenTemplate = angular.element(
        '<div class="tree-children-items panel panel-default" ng-class="{hidden:!$_expanded}" style="border-width:0;border-left-width:1px;border-radius:0;box-shadow:0 0 0 rgba(0, 0, 0, 0);margin:0;margin-left:5px"></div>')


      return function (scope, $elem, attrs) {

        var treeScope;
        var scopes;

        var types = typesGetter(scope);

        var getSelectedScope = function () {
          for (var i = scopes.length; i--;) {
            if (scopes[i].$_selected)return scopes[i];
          }
        };

        var getSelected = function (_scope) {
          var itemScope = _scope || getSelectedScope();
          var selected = {
            path: [],
            item: itemScope.$_item
          };
          while (itemScope.$_deep > 0) {
            selected.path.push(itemScope.$_index);
            itemScope = itemScope.$parent;
          }
          return selected;
        };

        var initItemScope = function (itemScope, item, deep, index) {
          itemScope.$_item = item;
          itemScope.$_deep = deep;
          itemScope.$_index = index;
          itemScope.$_expandDeep = expandDeep;
          itemScope.$_selected = deep === 0;
          itemScope.$_expanded = expandDeep > deep;
          itemScope.$_isBranch = !!item[itemsExpression] && item[itemsExpression].length > 0;
          itemScope.$_isLeaf = !itemScope.$_isBranch;
          if (types)itemScope.$_icon = types[item.type].icon;

          itemScope.$_expandMe = function (b) {
            this.$_expanded = angular.isDefined(b) ? b : !this.$_expanded;
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

          itemScope.$_select = function () {
            if (itemScope.$_selected)return;
            angular.forEach(scopes, function (_scope) {
              _scope.$_selected = _scope === itemScope;
            });
            selectedSetter && selectedSetter(scope, getSelected(itemScope));
            selectedChangedExpression && scope.$eval(selectedChangedExpression);
          };
        };

        var ctrl = {};

        ctrl.$_expandAll = function (b) {
          angular.forEach(scopes, function (_scope) {
            _scope.$_expandMe(b);
          });
        };

        ctrl.$_renameItem = function (name) {
          getSelectedScope().$_item.name = name;
        };

        ctrl.$_removeItem = function () {

          var selectedScope = getSelectedScope();
          var selectedItem = selectedScope.$_item;
          var parentScope = selectedScope.$parent;
          var parentItem = parentScope.$_item;

          var items = parentItem[itemsExpression];
          var index = $.inArray(selectedItem, items);
          items.splice(index, 1);
          scopes.splice($.inArray(selectedScope, scopes), 1);
          selectedScope.$destroy();


          for (var i = scopes.length; i--;) {
            if (scopes[i].$parent === parentScope && scopes[i].$_index > index)scopes[i].$_index--;
          }

          var $parentItem = $elem.find('.class-' + parentItem._id);
          var $children = $parentItem.children('.tree-children-items');
          var $selectedItem = $children.children('.class-' + selectedItem._id);

          $selectedItem.remove();
          if (parentItem[itemsExpression].length <= 0) {
            $children.remove();
            parentScope.$_isBranch = false;
            parentScope.$_isLeaf = true;
          }
          parentScope.$_select();
        };

        ctrl.$_insert = function (item) {


          var parentScope = getSelectedScope();
          var parentItem = parentScope.$_item;
          if (!parentItem[itemsExpression]) {
            parentItem[itemsExpression] = [];
          }
          parentItem[itemsExpression].push(item);
          var itemScope = parentScope.$new(true);
          scopes.push(itemScope);
          initItemScope(itemScope, item, parentScope.$_deep + 1, parentItem[itemsExpression].length - 1);

          var $parentItem = $elem.find('.class-' + parentItem._id);
          var $children = $parentItem.children('.tree-children-items');
          if ($children.length <= 0) {
            $children = $compile($childrenTemplate.clone())(parentScope);
            $parentItem.append($children);
          }
          var $item = $itemTemplate.clone();
          $compile($item)(itemScope);
          $children.append($item);

          itemScope.$_select();
          parentScope.$_isBranch = true;
          parentScope.$_isLeaf = false;
          parentScope.$_expanded = true;
        };

        ctrlSetter && ctrlSetter(scope, ctrl);

        var init = function () {
          $elem.children().remove();
          angular.forEach(scopes, function (_scope) {
            _scope.$destroy();
          });
          scopes = [];
          treeScope && treeScope.$destroy();
          treeScope = scope.$new(true);
        };


        scope.$watch(sourceExpression, function (source) {
          //console.log('================$watch================')
          init();
          if (!source)return;
          buildTree($elem, source, treeScope, -1);
        });


        function buildTree($parentItem, items, parentScope, deep) {
          deep++;
          angular.forEach(items, function (item, index) {

            var itemScope = parentScope.$new(true);
            scopes.push(itemScope);

            initItemScope(itemScope, item, deep, index);

            var $item = $itemTemplate.clone();
            $compile($item)(itemScope);
            $parentItem.append($item);

            if (item[itemsExpression] && item[itemsExpression].length > 0) {
              var $childrenItem = $childrenTemplate.clone();
              $compile($childrenItem)(itemScope);
              $item.append($childrenItem);
              buildTree($childrenItem, item[itemsExpression], itemScope, deep);
            }
          });
        }
      }
    }
  };
});

