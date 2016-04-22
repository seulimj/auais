angular.module('auais').provider('dict', function () {
  var _dictUrl = '';
  var _dict;
  return {

    dictUrl: function (value) {
      _dictUrl = value;
      return this;
    },

    $get: function (http, $q) {
      var getKeys = function (id) {
        var defer = $q.defer();
        if (_dict) {
          defer.resolve(_dict[id]);
        } else {
          http.get(_dictUrl).then(function (data) {
            _dict = {};
            angular.forEach(data, function (item) {
              _dict[item._id] = item.keys;
            });
            defer.resolve(_dict[id]);
          });
        }
        return defer.promise;
      };

      return {
        getKeys: getKeys
      };
    }
  }
});



