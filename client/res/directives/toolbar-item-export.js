angular.module('auais').directive('toolbarItemExport', function () {
  return {
    restrict: 'E',
    replace: true,
    template: '<div toolbar-item text="导出" icon="glyphicon glyphicon-export"></div>',

    compile: function ($elem, attrs) {
    }
  }
});


