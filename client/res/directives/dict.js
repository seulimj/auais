angular.module('auais').directive('dict', function (dict) {
  return {
    restrict: 'A',
    require: ['^ngModel', '?^drop'],
    compile: function ($elem, attrs) {
      return function (scope, $elem, attrs, controllers) {

        var ngModel = controllers[0];
        var drop = controllers[1];

        var id = attrs.dict;
        var lineHeight = attrs.lineHeight || '8px';

        $elem.addClass('panel panel-default');
        var selectedClass = 'active';
        var $listGroup = angular.element('<div class="list-group"></div>');
        $elem.append($listGroup);

        dict.getKeys(id).then(function (keys) {

          angular.forEach(keys, function (key) {
            var $item = angular.element('<a class="list-group-item" style="cursor: pointer;"></a>');
            $item.css('line-height', lineHeight);
            $item.text(key.name);
            $item.data('val', key.val);
            $item.on('click', function () {
              if ($item.hasClass(selectedClass))return;
              $listGroup.children().removeClass(selectedClass);
              $item.addClass(selectedClass);
              ngModel.$setViewValue($item.data('val'));
              drop && scope.$apply(function () {
                drop.$_setText($item.text());
                drop.$_setDirty();
                drop.$_close();
              });
            });

            $listGroup.append($item);
          });

          ngModel.$render();
        });


        ngModel.$render = function () {
          var $items = $listGroup.children();
          for (var i = $items.length; i--;) {
            var $item = $items.eq(i);
            if ($item.data('val') === ngModel.$viewValue) {
              $item.addClass(selectedClass);
              drop && drop.$_setText($item.text());
            } else {
              $item.removeClass(selectedClass);
            }
          }
        };


      };
    }
  };
});