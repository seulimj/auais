angular.module('auais').directive('toolbarItemAdd', function () {
  return {
    restrict: 'E',
    replace: true,
    template: '<div toolbar-item text="添加" icon="fa fa-plus"></div>',

    compile: function ($elem, attrs) {
    }
  }
});


