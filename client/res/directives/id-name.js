angular.module('auais').directive('idName', function ($filter, dict) {
  return {
    restrict: 'E',
    replace: true,
    template: '<div val="_id" txt ="name" class="panel panel-default" style="overflow: auto;width: 100%;">' +
    '<p ng-class="{\'bg-primary\':$_selected}" ng-click="$_select()" style="cursor: pointer;line-height: 30px;margin: 0;padding:0 15px;">' +
    '{{$_item.name}}' +
    '</p></div>'
  };
});