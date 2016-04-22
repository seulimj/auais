angular.module('auais').provider('district', function () {
  var _districtUrl = '';
  var _districts;
  return {

    districtUrl: function (value) {
      _districtUrl = value;
      return this;
    },

    $get: function (http, $q) {
      var getDistricts = function () {
        var defer = $q.defer();
        if (_districts) {
          defer.resolve(_districts);
        } else {
          http.get(_districtUrl).then(function (data) {
            _districts = data;
            defer.resolve(data);
          });
        }
        return defer.promise;
      };

      return {
        getDistricts: getDistricts
      };
    }
  }
});



