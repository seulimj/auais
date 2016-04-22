angular.module('auais').directive('toolbarItemAddex', function () {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    template: '<div toolbar-item dropdown text="添加" icon="fa fa-plus">' +
    '<div ng-transclude class="panel panel-default" style="margin:0"></div>' +
    '</div>'
  }
});


