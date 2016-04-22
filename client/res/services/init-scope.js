angular.module('auais').factory('initScope', function (confirm, alert) {
    return function (scope, service, options) {
        options = options || {};

        var queryObject = {
            page: {size: options.pageSize || 10},
            query: {}
        };

        if (options.sortField) {
            queryObject.sort = {};
            queryObject.sort[options.sortField] = options.sortDir || 1;
        }
        scope.queryObject = queryObject;

        scope.retrieve = function (keepPageIndex) {
            if (!keepPageIndex)scope.queryObject.page.index = 1;
            scope.validateEmpty(scope.queryObject);
            service.find(scope.queryObject).then(function (data) {
                scope.page = data;
            });
        };

        //清理对象空值
        scope.validateEmpty = function (obj) {
            for (var key in obj) {
                if(typeof obj[key]=="object")  scope.validateEmpty(obj[key]);
                if (obj[key]===false)continue;

                if (!obj[key] || obj[key] === '' || obj[key]==="undefined") {
                    console.log("delete:"+ key);
                    delete obj[key];
                }
            }
        }
        /**
         * 默认添加事件
         * @param keepInput，保留上次录入
         *
         */
        scope.insert = function (keepInput) {
            scope.current = {isNew: true, item: {}};
            if (keepInput){
                scope.current.item=scope.oldItem||{};
            }
        };

        scope.update = function (item) {
            service.findById(item._id).then(function (data) {
                scope.current = {isNew: false, item: data};
            });
        };

        scope.cancel = function () {
            //console.log('cancel');
            scope.current = null;
        };

        scope.remove = function (id) {
            confirm('您确定要删除吗？').then(
                function () {
                    service.remove(id).then(function () {
                        scope.retrieve();
                        //alert('删除成功');

                    });
                }
            );
        };

        scope.submit = function () {
            //console.log('submit');
            if (scope.current.isNew) {
                //记录上次录入，方便连续录入
                scope.oldItem=scope.current.item;
                service.insert(scope.current.item).then(function () {
                    scope.current = null;
                    scope.retrieve();
                });
            }
            else {
                confirm('您确定要修改吗？').then(
                    function () {
                        service.update(scope.current.item).then(function () {
                            scope.current = null;
                            scope.retrieve();
                            //alert('修改成功');
                        });
                    }
                );
            }
        };

        scope.retrieve();

    }
});
