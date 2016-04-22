angular.module('auais').directive('toolbarItemEdit', function () {
  return {
    restrict: 'E',
    replace: true,
    template: '<div toolbar-item text="编辑" icon="fa fa-pencil"></div>'
  }
});


