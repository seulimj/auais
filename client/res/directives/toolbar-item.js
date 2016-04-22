angular.module('auais').directive('toolbarItem', function () {
  return {
    restrict: 'A',
    compile: function ($elem, attrs) {
      var text = attrs.text;
      var icon = attrs.icon;
      var canDrop = attrs.dropdown === '';
      var dropHeight = attrs.dropHeight;
      var dropWidth = attrs.dropWidth;

      var buttonClass = 'class' + Math.random().toString().replace('.', '-');
      var dropClass = 'class' + Math.random().toString().replace('.', '-');


      var height = '34px';

      $elem.css('position', 'relative');
      $elem.css('display', 'inline-block');
      $elem.css('height', height);
      $elem.css('line-height', height);

      var $transclude = $elem.children().remove();

      var $icon = angular.element('<i>').addClass(icon);
      var $button = angular.element('<a>');
      $button.addClass(buttonClass);
      $button.css('margin', '0 10px');
      $button.css('font-size', '12px');
      $button.append($icon).append(' ' + text);
      $button.css('cursor', 'pointer');
      $elem.append($button);

      if (!canDrop)return;


      //$button.append('<span class="caret"></span>');

      var $drop = angular.element('<div>');
      $drop.addClass(dropClass);
      //$drop.addClass('panel panel-default');
      //$drop.css('padding', '0');
      //$drop.css('border-width', '2px');
      $drop.addClass('hidden');
      $drop.css('position', 'absolute');
      $drop.css('z-index', '2');
      $drop.css('box-shadow', '0 6px 12px rgba(0, 0, 0, 0.175)');
      $drop.css('right', '0');
      $drop.css('top', parseInt(height) + 2 + 'px');
      $drop.css('line-height', 'normal');
      dropHeight && $drop.css('height', dropHeight);
      dropWidth && $drop.css('width', dropWidth);

      var $arrow = angular.element('<div style="text-align: center;padding-top: 12px; "><a class="caret"></a></div>');
      $arrow.addClass(dropClass);
      $arrow.addClass('hidden');
      $arrow.css('position', 'absolute');
      $arrow.css('z-index', '3');
      $arrow.css('width', '100%');
      $arrow.css('top', '0');
      $arrow.css('left', '0');
      $elem.append($arrow);
      $elem.append($drop.append($transclude));


      return function (scope, $elem, attrs) {

        var $drop = $elem.find('.' + dropClass);

        var bodyClick = function (event) {
          var $target = $(event.target);
          if ($target.closest('.' + dropClass + ',.' + buttonClass).length <= 0)close();
        };

        var close = function () {
          $drop.addClass('hidden');
          $('body').unbind('click', bodyClick);
        };

        var open = function () {
          $drop.removeClass('hidden');
          $('body').click(bodyClick);
        };

        $elem.find('.' + buttonClass).on('click', function (event) {
          $drop.hasClass('hidden') ? open() : close();
        });

        //$elem.find('.drop-close').on('click', function () {
        //  close();
        //});

        $elem.on('click', function (event) {
          var $target = $(event.target);
          if ($target.closest('.drop-close').length > 0)close();
        });

      };
    },
    controller: ['$scope', '$element', '$attrs', function (scope, $elem, attrs) {

    }]
  };
});

