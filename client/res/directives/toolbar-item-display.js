angular.module('auais').directive('toolbarItemDisplay', function () {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    template: '<div toolbar-item dropdown text="显示" icon="fa fa-eye">' +
    '<div ng-transclude class="panel panel-default" style="margin:0"></div>' +
    '</div>'
  }
});
