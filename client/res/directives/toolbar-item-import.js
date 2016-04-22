angular.module('auais').directive('toolbarItemImport', function () {
  return {
    restrict: 'E',
    replace: true,
    template: '<div toolbar-item text="导入" icon="glyphicon glyphicon-import"></div>',

    compile: function ($elem, attrs) {
    }
  }
});


