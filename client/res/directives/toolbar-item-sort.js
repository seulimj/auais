angular.module('auais').directive('toolbarItemSort', function () {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    template: '<div toolbar-item dropdown text="排序" icon="fa fa-sort">' +
    '<div ng-transclude class="panel panel-default" style="margin:0"></div>' +
    '</div>'
  }
});
