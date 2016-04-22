/**
 * modal 弹出式模态对话框
 * restrict: EA
 * 属性 show: angular表达式，为真值时窗口打开，否则窗口关闭
 * 属性 fade：布尔属性，若出现表示允许淡入淡出动画，若缺席则不允许淡入淡出动画
 */
angular.module('auais').directive('modal', function ($parse) {
  return {
    restrict: 'EA',
    replace: true,
    transclude: true,
    template: '<div class="modal" data-backdrop="static" tabindex="-1">' +
    '<div class="modal-dialog">' +
    '<div class="modal-content">' +
    '<div class="modal-header">' +
    '<button type="button" class="close" ng-click="show=false"><span>&times;</span></button>' +
        '<span class="glyphicon glyphicon-list-alt text-primary"></span>'+
    '<span class="modal-title text-primary h4"  style="margin-left: 10px"></span>' +
    '</div>' +
    '<div class="modal-body"  ng-transclude></div>'+

    '</div>' +
    '</div>' +
    '</div>',
    scope: {show: '='},
    compile: function ($elem, attrs) {
      var fade = attrs.fade === '';
      fade && $elem.addClass('fade');
      var modalTitle = attrs.modalTitle;
      $elem.find('.modal-title').text(modalTitle);

      return function (scope, $elem, attrs) {

        scope.$watch('show', function (newValue) {
          if (newValue) {
            $elem.modal('show');
          } else {
            $elem.modal('hide');
          }
        });
      };

    }

  }


});