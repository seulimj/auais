angular.module('application').controller('MixDataController', function ($scope, mixDataService, initScope) {
    initScope($scope, mixDataService);
    var service = mixDataService;

    $scope.customData={};
    $scope.customData.rows = [{key: "key1", value: "value"}];

    //分页发生变化时监测并生成标题列
    $scope.$watch("page", function (newValue, oldValue, scope) {
        scope.keys = [];
        newValue = newValue || {};
        newValue.items = newValue.items || [];
        if (newValue.items.length > 0) {
            for (var key in newValue.items[0]) {
                scope.keys.push(key);
            }
        }
    }, true);

    $scope.newRow = function () {
        $scope.customData.rows.push({key: "", value: ""})
    }

    $scope.submit = function () {
        if ($scope.current.isNew) {
            $scope.customData.rows.forEach(function(x){
               $scope.current.item[x.key]= x.value;
            });
            if($scope.customData.hasImg){
                $scope.current.item.img= $scope.customData.url;
            }
            $scope.validateEmpty( $scope.current.item);
            $scope.oldItem=$scope.current.item;
            service.insert($scope.current.item).then(function () {
                $scope.current = null;
                $scope.retrieve();
            });
        }
    }

});
