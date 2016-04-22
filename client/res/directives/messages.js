/**
 * messages 表单验证消息指令
 * 依赖：jquery，bootstrap.js
 * 该指令可以作为: 属性
 *
 * 属性 msg-placement：字符串；消息位置，可以为left、top、right，bottom，默认为top
 * 属性 msg-show-delay：整数；消息显示延时，单位为毫秒, 默认为200
 * 属性 msg-hide-delay：整数；消息隐藏延时，单位为毫秒, 默认为200
 * 属性 msg-width：字符串；消息宽度，格式为数字加px后缀，表示像素数，该属性暂不支持
 * 属性 msg-height：字符串；消息高度，格式为数字加px后缀，表示像素数，该属性暂不支持
 *
 * 附加在input元素上，只有当宿主元素具有name属性，并且宿主元素处在某个具有name属性的form元素中时，该指令才有效，否则无效
 * 需要为宿主input元素上附加的每个验证指令添加对应的错误信息属性，否则不会显示该指令的验证错误消息
 * 例如：宿主input元素上附加了 required 或 ng-required 验证指令，则需要在宿主input元素添加 required-msg="某某不可为空"
 * 又如：宿主input元素上附加了 ng-maxlength="10" 验证指令，则需要在宿主input元素添加 maxlength-msg="某某不应超过10个字符"
 * 规则是对于某个验证指令，错误消息属性名应为：验证指令名称去掉 ng- 前缀，然后加上 -msg 后缀
 */
angular.module('auais').directive('messages', function ($timeout) {
  return {
    restrict: 'A',
    //require: ['ngModel','^form'],
    link: function (scope, $elem, attrs) {

      var formName = $elem.parents('form').attr('name');
      if (!formName)return;
      var name = attrs.name;
      if (!name)return;

      var msgPlacement = attrs.msgPlacement;
      if (msgPlacement !== 'left' && msgPlacement !== 'right' && msgPlacement !== 'bottom')msgPlacement = 'top';
      var msgShowDelay = parseInt(attrs.msgShowDelay);
      if (isNaN(msgShowDelay))msgShowDelay = 200;
      var msgHideDelay = parseInt(attrs.msgHideDelay);
      if (isNaN(msgHideDelay))msgHideDelay = 200;
      var msgWidth = attrs.msgWidth;
      var msgHeight = attrs.msgHeight;

      var $group = $elem.closest('.form-group');
      if ($group.length) {
        scope.$watch(formName + '.' + name + '.$dirty&&' + formName + '.' + name + '.$invalid', function (newValue) {
          if (newValue) {
            $group.addClass('has-error');
          } else {
            $group.removeClass('has-error');
          }
        });
      }


      scope.$watch(formName + '.' + name + '.$error', function (newValue) {
        for (var key in newValue) {
          break;
        }
        $elem.tooltip('destroy');
        if (key) {
          $elem.tooltip({
            title: '<span style="margin-right:5px;" class="glyphicon glyphicon-exclamation-sign"></span>' + attrs[key + 'Msg'],
            animation: false,
            html: true,
            placement: msgPlacement,
            delay: {'show': msgShowDelay, 'hide': msgHideDelay},
            template: '<div class="tooltip">' +
            '<div class="tooltip-arrow">' +
            '</div>' +
            '<div class="tooltip-inner" style="text-align:left;padding:5px;">' +
            '</div>' +
            '</div>'
          });
          //$timeout(function () {
            scope.$eval(formName + '.' + name + '.$dirty') && $elem.tooltip('show');
          //}, 0);

        }
      }, true);
    }
  }
});

