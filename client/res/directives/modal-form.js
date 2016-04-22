/**
 * modal-form 弹出式表单
 * 依赖：jquery，bootstrap.js
 * 该指令可以作为: 属性
 * 属性 modal-form: angular表达式；为真值时窗口打开，否则窗口关闭
 * 属性 fade：布尔属性；若出现表示允许淡入淡出动画，若缺席则不允许淡入淡出动画
 * 属性 layout：字符串；表单布局方向，vertical表示垂直布局，horizontal表示水平布局，inline表示内联布局，默认为horizontal
 * 属性 cancel: angular表达式；取消按钮处理函数，默认为 'cancel()'
 * 属性 submit：angular表达式；提交按钮处理函数，默认为 'submit()'
 * 属性 form-name：字符串；form元素的name属性，默认为 'form1'
 * 属性 form-title：字符串；窗口标题
 * 属性 form-width：字符串；表单宽度，格式为数字加px后缀，表示像素数
 * 属性 form-height：字符串；表单高度，此高度不包含表单的页头页脚，格式为数字加px后缀，表示像素数
 *
 * 该指令应该附加在div元素上，宿主div元素包含的内容被作为表单控件组
 * 指令会自动添加页头，页头包含图标、标题、关闭按钮
 * 指令会自动添加页脚，页脚包含一个取消按钮和一个提交按钮，所以无需手工为表单添加这两个按钮
 *
 * modal-form属性所指定的scope字段应当是一个对象，并且具有isNew属性，表示新增或者修改
 * cancel、submit属性所指定的scope函数应包含关闭对话框的逻辑，即把modal-form属性所指定的scope字段清空或删除
 * 如果违反以上两个约定，该指令无法正常运行！
 */
angular.module('auais').directive('modalForm', function ($compile) {
  return {
    restrict: 'A',
    priority: 500,
    terminal: true,
    compile: function ($elem, attrs) {
      var fade = attrs.fade === '';
      var layout = attrs.layout || 'horizontal';
      var formWidth = attrs.formWidth;
      var formHeight = attrs.formHeight;
      var formName = attrs.formName || 'form1';
      var formTitle = attrs.formTitle || '';
      var showExpression = attrs.modalForm || attrs.show;
      var cancelExpression = attrs.cancel || 'cancel()';
      var submitExpression = attrs.submit || 'submit()';

      var $transclude = $elem.children().remove();


      $elem.addClass('modal');
      fade && $elem.addClass('fade');
      $elem.attr('data-backdrop', 'static').attr('tabindex', '-1').attr('data-keyboard','false');


      var $modalDialog = angular.element('<div class="modal-dialog"></div>');
      formWidth && $modalDialog.css('width', formWidth);
      var $modalContent = angular.element('<div class="modal-content"></div>');
      $elem.append($modalDialog.append($modalContent));


      var $form = angular.element('<form novalidate></form>');
      $form.attr('name', formName);
      $form.attr('ng-submit', submitExpression);

      layout === 'horizontal' && $form.addClass('form-horizontal');
      layout === 'inline' && $form.addClass('form-inline');

      var $header = angular.element('<div class="modal-header"></div>');
      var $x = angular.element('<a class="close"><span>&times;</span></a>');
      $x.attr('ng-click', cancelExpression);
      var $icon = angular.element('<i class="fa"></i>');
      $icon.attr('ng-class', showExpression + '.isNew?"fa-plus":"fa-pencil"');
      $icon.attr('ng-dblclick', cancelExpression);
      var $title = angular.element('<span class="modal-title h4 text-primary"></span>');
      $title.text(' ' + formTitle);
      $header.append($x).append($title.prepend($icon));

      var $body = angular.element('<div class="modal-body"></div>');
      formHeight && $body.css('height', formHeight);
      $body.append($transclude);

      var $footer = angular.element('<div class="modal-footer"></div>');
      var $submit = angular.element('<button type="submit" class="btn btn-primary btn-sm" style="width:100px">确 定</button>');
      $submit.attr('ng-disabled', formName + '.$invalid');
      var $cancel = angular.element('<a class="btn btn-warning btn-sm" style="width:100px">取 消</a>');
      $cancel.attr('ng-click', cancelExpression);
      $footer.append($submit).append($cancel);

      $form.append($header).append($body).append($footer);

      return function (scope, $elem, attrs) {
        var formScope;
        scope.$watch(showExpression, function (newValue) {
          if (newValue) {
            $elem.modal('show');
            formScope = scope.$new();
            $modalContent.append($compile($form.clone())(formScope))
          } else {
            $elem.modal('hide');
            $modalContent.children().remove();
            formScope && formScope.$destroy();
          }
        });
      };

    }
  }
});

angular.module('auais').directive('modalForm2', function () {
  return {
    restrict: 'A',
    compile: function ($elem, attrs) {
      var fade = attrs.fade === '';
      var layout = attrs.layout || 'horizontal';
      var formWidth = attrs.formWidth;
      var formHeight = attrs.formHeight;
      var formName = attrs.formName || 'form2';
      var formTitle = attrs.formTitle || '';
      var showExpression = attrs.modalForm || attrs.show;
      var cancelExpression = attrs.cancel || 'cancelPerson()';
      var submitExpression = attrs.submit || 'submitPerson()';
      var $transclude = $elem.children().remove();

      $elem.addClass('modal');
      fade && $elem.addClass('fade');
      $elem.attr('data-backdrop', 'static').attr('tabindex', '-1');

      var $modalDialog = angular.element('<div class="modal-dialog"></div>');
      formWidth && $modalDialog.css('width', formWidth);
      var $modalContent = angular.element('<div class="modal-content"></div>');
      $elem.append($modalDialog.append($modalContent));

      var $form = angular.element('<form novalidate></form>');
      $form.attr('name', formName);
      $form.attr('ng-submit', submitExpression);

      layout === 'horizontal' && $form.addClass('form-horizontal');
      layout === 'inline' && $form.addClass('form-inline');

      var $header = angular.element('<div class="modal-header"></div>');
      var $x = angular.element('<a class="close"><span>&times;</span></a>');
      $x.attr('ng-click', cancelExpression);
      var $icon = angular.element('<span class="glyphicon"></span>');
      $icon.attr('ng-class', showExpression + '.isNew?"glyphicon-plus":"glyphicon-pencil"');
      var $title = angular.element('<span class="modal-title h4"></span>');
      $title.text(' ' + formTitle);
      $header.append($x).append($icon).append($title);

      var $body = angular.element('<div class="modal-body"></div>');
      formHeight && $body.css('height', formHeight);
      $body.append($transclude);

      var $footer = angular.element('<div class="modal-footer"></div>');
      var $submit = angular.element('<button type="submit" class="btn btn-primary btn-sm" style="width:100px">确 定</button>');
      $submit.attr('ng-disabled', formName + '.$invalid');
      var $cancel = angular.element('<a class="btn btn-warning btn-sm" style="width:100px">取 消</a>');
      $cancel.attr('ng-click', cancelExpression);
      $footer.append($submit).append($cancel);
      $form.append($header).append($body).append($footer);
      $modalContent.append($form);

      return function (scope, $elem, attrs) {
        scope.$watch(showExpression, function (newValue) {
          if (newValue) {
            $elem.modal('show');
          } else {
            $elem.modal('hide');
            var formCtrl = scope.$eval(formName);
            formCtrl.$setUntouched();
            formCtrl.$setPristine();
          }
        });
      };

    }
  }
});


