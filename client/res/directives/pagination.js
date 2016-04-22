/**
 * page
 */
angular.module('auais').directive('pagination', function ($parse) {
  return {
    restrict: 'A',
    link: function (scope, $elem, attrs) {
      $elem.addClass('btn-group btn-group-sm');
      var pageExpression = attrs.pagination;
      var indexExpression = attrs.index;
      var indexChangeExpression = attrs.indexChange;
      var indexSetter = $parse(indexExpression).assign;
      var neighbor = 4;
      var previous = '上一页';
      var next = '下一页';
      var omit = '…';
      var selectedClass = 'btn-success';
      var defaultClass = 'btn-default';

      scope.$watch(pageExpression, function (page) {

        if(!page)return;

        var pageSize = page.size;
        var pageIndex = page.index;
        var count = page.count;
        var pageCount = page.pageCount;
        var hasPrevious = page.hasPrevious;
        var hasNext = page.hasNext;

        $elem.children().remove();
        if (pageCount <= 1) {
          $elem.addClass('hidden');
          return;
        }

        $elem.removeClass('hidden');

        var $buttons = [];
        $buttons.push(angular.element('<button>').text(previous));
        $buttons.push(angular.element('<button>').text('1'));

        if (pageIndex > neighbor + 2) {
          $buttons.push(angular.element('<button>').text(omit));
        }
        for (var i = pageIndex - neighbor; i <= pageIndex + neighbor; i++) {
          if (i > 1 && i < pageCount) {
            $buttons.push(angular.element('<button>').text(i));
          }
        }
        if (pageCount - pageIndex > neighbor + 1) {
          $buttons.push(angular.element('<button>').text(omit));
        }
        $buttons.push(angular.element('<button>').text(pageCount));
        $buttons.push(angular.element('<button>').text(next));

        angular.forEach($buttons, function ($button) {
          $button.addClass('btn ' + defaultClass);
          var text = $button.text();
          //((text === previous && !hasPrevious) || (text === next && !hasNext)) && $button.attr('disabled', 'disabled');

          if (text === previous) {
            if (!hasPrevious) {
              $button.attr('disabled', 'disabled');
            } else {
              $button.on('click', function () {
                indexSetter && indexSetter(scope, pageIndex - 1);
                indexChangeExpression && scope.$eval(indexChangeExpression);
              });
            }
          }

          if (text === next) {
            if (!hasNext) {
              $button.attr('disabled', 'disabled');
            } else {
              $button.on('click', function () {
                indexSetter && indexSetter(scope, pageIndex + 1);
                indexChangeExpression && scope.$eval(indexChangeExpression);
              });
            }
          }

          var i = parseInt(text);
          if (i === pageIndex) {
            $button.addClass(selectedClass);
          } else if (!isNaN(i)) {
            $button.on('click', function (e) {
              indexSetter && indexSetter(scope, parseInt(angular.element(this).text()));
              indexChangeExpression && scope.$eval(indexChangeExpression);
            });
          }


          $elem.append($button);
        });
      });


    }
  }

});
