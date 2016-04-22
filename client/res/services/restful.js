angular.module('auais').provider('RESTful', function () {
  var _baseUrl = '';

  return {
    baseUrl: function (value) {
      _baseUrl = value;
      return this;
    },

    $get: function(http){
      var RESTful = function (path) {
        this.path = _baseUrl + path;
      };
      RESTful.prototype.find = function (queryObject) {
        return http.get(this.path, queryObject);
      };
      RESTful.prototype.findById = function (id) {
        return http.get(this.path + '/' + id);
      };

      RESTful.prototype.insert = function (dto) {
        return http.post(this.path, dto);
      };
      RESTful.prototype.update = function (dto) {
        return http.put(this.path, dto);
      };
      RESTful.prototype.remove = function (id) {
        return http.delete(this.path + '/' + id);
      };
      return RESTful;
    }
  }
});



