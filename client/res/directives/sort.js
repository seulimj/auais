angular.module('auais').directive('sort', function ($parse) {
  return {
    restrict: 'A',
    link: function (scope, $elem, attrs, ngModel) {

      var noDefault = attrs.noDefault === '';
      var sortGetter = $parse(attrs.sort);
      var sortSetter = sortGetter.assign;
      var sortChangedExpression = attrs.sortChanged;

      var selectedClass = 'active';

      $elem.addClass('list-group');



      var fields = [];
      !noDefault && fields.push({text: '默认排序', sort: {}});
      var $fields = $elem.children().remove();
      for (var i = 0, l = $fields.length; i < l; i++) {
        var $field = $fields.eq(i);
        var field = {};
        field.text = $field.text();
        field.desc = $field.attr('desc') === '';
        field.sort = {};
        field.sort[$field.attr('key')] = field.desc ? -1 : 1;
        fields.push(field);
      }


      angular.forEach(fields, function (_field) {
        var $item = angular.element('<a class="list-group-item drop-close" style="cursor: pointer"></a>');
        var $icon = angular.element('<i class="fa" style="width: 20px"></i>');
        _field.desc === true && $icon.addClass('fa-sort-amount-desc');
        _field.desc === false && $icon.addClass('fa-sort-amount-asc');
        $item.append($icon).append(_field.text);
        $item.data('field_sort', _field.sort);
        angular.equals(_field.sort, sortGetter(scope) || {}) ? $item.addClass(selectedClass) : $item.removeClass(selectedClass);

        $item.on('click', function () {
          var $this = angular.element(this);
          if ($this.hasClass(selectedClass))return;
          $this.parent().children().removeClass(selectedClass);
          $this.addClass(selectedClass);
          sortSetter(scope, $this.data('field_sort'));
          sortChangedExpression && scope.$eval(sortChangedExpression);
        });

        $elem.append($item);
      });

    }
  }
});


