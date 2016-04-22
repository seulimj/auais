/**
 * 下拉菜单
 * 依赖：无
 * 该指令可以作为: 属性
 * 属性 dropdown-menu: angular表达式；菜单绑定的二级树数据源，默认为 'states'
 *
 *
 */

angular.module('auais').directive('dropdownMenu', function () {
  return {
    restrict: 'A',
    link: function (scope, $elem, attrs) {
      var statesExpression = $elem.dropdownMenu || 'states';
      var states = scope.$eval(statesExpression);

      $elem.append(angular.element('<li><a href="#index"><span class="glyphicon glyphicon-home"></span> 首页</a></li>'));

      angular.forEach(states, function (state) {
        var subStates = state.subStates;
        if (!(subStates && subStates.length)) {
          $elem.append(angular.element('<li><a href="#' + state.state + '">' + state.name + '</a></li>'));
          return;
        }
        var $li = angular.element('<li class="dropdown"></li>');

        var open = function () {
          setTimeout(function () {
            $li.addClass('open');
          }, 100);
        };
        var close = function () {
          setTimeout(function () {
            $li.removeClass('open');
          }, 100);
        };
        var $a = angular.element('<a class="dropdown-toggle" style="cursor: pointer;"></a>')
          .text(state.name || '')
          .append(angular.element('<span class="caret"></span>'))
          .on('mouseenter', open)
          .on('mouseleave', close);

        var $ul = angular.element('<ul class="dropdown-menu"></ul>')
          .on('mouseenter', open)
          .on('mouseleave', close);

        var $divider = null;
        angular.forEach(subStates, function (subState, index) {
          var $a = angular.element('<a>')
            .attr('href', '#' + subState.state)
            .text(subState.name || '')
            .on('click', close);

          $ul.append(angular.element('<li>').append($a));
          $divider = angular.element('<li class="divider"></li>')
          $ul.append($divider);
        });
        $divider.remove();
        $elem.append($li.append($a).append($ul));

      });
    }
  }
});

/* 这里注释掉的是bootstrap原版的，仅支持鼠标单击打开，被我弃用
angular.module('auais').directive('dropdownMenu', function () {
  return {
    restrict: 'A',
    link: function (scope, $elem, attrs) {
      var statesExpression = $elem.dropdownMenu || 'states';
      var states = scope.$eval(statesExpression);

      angular.forEach(states, function (state) {
        var subStates = state.subStates;
        if (!(subStates && subStates.length)) {
          $elem.append(angular.element('<li><a href="#' + state.state + '">' + state.name + '</a></li>'));
          return;
        }
        var $li = angular.element('<li class="dropdown"></li>');


        var $a = angular.element('<a class="dropdown-toggle" data-target="#" data-toggle="dropdown" style="cursor: pointer"></a>')
          .text(state.name || '')
          .append(angular.element('<span class="caret"></span>'));

        var $ul = angular.element('<ul class="dropdown-menu"></ul>');

        var $divider = null;
        angular.forEach(subStates, function (subState, index) {
          var $a = angular.element('<a>')
            .attr('href', '#' + subState.state)
            .text(subState.name || '');

          $ul.append(angular.element('<li>').append($a));
          $divider = angular.element('<li class="divider"></li>')
          $ul.append($divider);
        });
        $divider.remove();
        $elem.append($li.append($a).append($ul));
        $a.dropdown();
      });
    }
  }
});

*/