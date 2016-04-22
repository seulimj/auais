angular.module('auais').directive('toolbarItemSearch', function () {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    template: '<div toolbar-item dropdown text="搜索" icon="fa fa-search">' +
    '<div class="well" style="padding:15px;margin: 0" ng-transclude>' +
    '</div>' +
    '</div>'
  }
});

/**
 * toolbar-item-search 弹出式表单
 * 依赖：无
 * 该指令可以作为: 元素
 *
 * 属性 notAutoClose：布尔属性；当点击搜索按钮时是否自动关闭搜索框，缺席时自动关闭，出席时不自动关闭
 * 属性 noSearchButton：布尔属性；是否自动添加搜索按钮，缺席时自动添加搜索按钮，出席时不自动添加搜索按钮
 * 属性 layout：字符串；表单布局方向，vertical表示垂直布局，horizontal表示水平布局，inline表示内联布局，默认为horizontal
 * 属性 search: angular表达式；搜索处理函数，默认为 'retrieve()'
 */

angular.module('auais').directive('toolbarItemSearch1', function () {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    template: '<div toolbar-item dropdown text="搜索" icon="glyphicon glyphicon-search"></div>',

    compile: function ($elem, attrs) {
      var notAutoClose = attrs.notAutoClose === '';
      var noSearchButton = attrs.noSearchButton === '';
      var layout = attrs.layout || 'horizontal';
      var searchExpression = attrs.search || 'retrieve()';
      var formName = 'form_' + Math.random().toString().replace('.', '_');

      var $form = angular.element('<form novalidate></form>');
      $form.attr('name', formName);
      $form.attr('ng-submit', searchExpression);
      layout === 'horizontal' && $form.addClass('form-horizontal');
      layout === 'inline' && $form.addClass('form-inline');

      $elem.append($form.append('<div ng-transclude></div>'));

      if (noSearchButton)return;

      var $searchButton = angular.element('<button type="submit" class="btn btn-primary btn-sm pull-right" style="margin-top: 15px;">搜索</button>');
      $searchButton.attr('ng-disabled', formName + '.$invalid');
      notAutoClose || $searchButton.addClass('drop-close');

      $form.append($searchButton);
    }
  }
});


