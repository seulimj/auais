angular.module('auais').directive('toolbarItemDel', function () {
  return {
    restrict: 'E',
    replace: true,
    template: '<div toolbar-item text="删除" icon="fa fa-remove"></div>'
  }
});


