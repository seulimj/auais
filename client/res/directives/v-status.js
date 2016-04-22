angular.module('auais').directive('vStatus', function ($compile) {
  return {
    restrict: 'A',
    link: function (scope, $elem, attrs) {
      var formName = $elem.parents('form').attr('name');
      if (!formName)return;
      var inputName = $elem.find('input').attr('name');
      if (!inputName)return;
      var s = formName + '.' + inputName + '.';
      scope.$watch(s + '$dirty&&' + s + '$invalid', function (value) {
        if(value){
          $elem.addClass('has-error');
        }else{
          $elem.removeClass('has-error');
        }
      });

    }
  }
});