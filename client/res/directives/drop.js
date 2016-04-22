angular.module('auais').directive('drop', function ($compile) {
  return {
    restrict: 'A',
    require: ['ngModel', '^form'],
    controller: ['$scope', '$element', '$attrs', function (scope, $elem, attrs) {

      var dropClass = 'class' + Math.random().toString().replace('.', '-');

      var $transclude = $elem.children();
      $transclude.addClass(dropClass);
      $transclude.addClass('hidden');
      $transclude.css('position', 'absolute');
      $transclude.css('top', '1px');
      $transclude.css('z-index', '1000000');
      $transclude.css('box-shadow', '0 6px 12px rgba(0, 0, 0, 0.175)');

      var $input = $elem.prev();

      $elem.css('position', 'relative');
      $elem.css('width', '100%');
      $elem.css('margin-left', $input.css('margin-left'));
      $elem.css('margin-top', '-' + $input.css('margin-bottom'));

      var $childInput = $input.find('input');
      if ($childInput.length)$input = $childInput;
      $input.addClass(dropClass);
      $input.css('cursor', 'pointer');
      $input.css('background-color', '#ffffff');
      $input.attr('readonly', '');



      var bodyClick = function (event) {
        var $target = $(event.target);
        if ($target.closest('.' + dropClass).length <= 0){
          close();
        }
      };

      var open = function () {
        $transclude.removeClass('hidden');
        $('body').click(bodyClick);
      };

      var close = function () {
        $transclude.addClass('hidden');
        $('body').unbind('click', bodyClick);
      };

      $input.on('click', function () {
        $transclude.hasClass('hidden') ? open() : close();
      });
      this.dropClass = dropClass;
      this.$_close = close;
      this.$_setDirty = function () {
        var formName = $elem.parents('form').attr('name');
        var name = $input.attr('name');
        var ngModel = scope[formName][name];
        if (ngModel)ngModel.$dirty = true;
        $input.addClass('ng-dirty');
      };

      this.$_setText = function (text) {
        var formName = $elem.parents('form').attr('name');
        var name = attrs.name;
        var ngModel = scope[formName][name];
        if (ngModel)ngModel.$text = text;
      };

    }],

    compile: function ($elem, attrs) {
      return function (scope, $elem, attrs, controllers) {

        var ngModel = controllers[0];
        var ngForm = controllers[1];
        var formName = ngForm.$name;
        var name = ngModel.$name;

        var $input = $elem.prev();
        var $childInput = $input.find('input');
        if ($childInput.length)$input = $childInput;
        $input.attr('ng-model', formName + '.' + name + '.$text');
        $compile($input)(scope);

      };
    }
  };
});