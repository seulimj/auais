angular.module('auais').factory('windowResize', function () {
    var resizeEvents = [];
    return {
      bind: function (fun) {
        angular.element(window).bind('resize', fun);
        resizeEvents.push(fun);
      },
      unbind: function () {
        for (var i in resizeEvents)
          angular.element(window).unbind("resize", resizeEvents[i]);
        resizeEvents = [];
      }
    }
  }
);
