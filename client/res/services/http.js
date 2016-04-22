angular.module('auais').factory('http', function ($http, $q) {

  var query = function (path, queryObject) {
    var char = path.indexOf('?') === -1 ? '?' : '&';
    var qs = queryObject ? $.param(queryObject) : '';
    if (qs === '')char = '';
    return path + char + qs;
  };

  var get = function (path, queryOptions) {

    return $http.get(query(path, queryOptions)).then(
      function (res) {
        return res.data;
      },
      function (res) {
        return $q.reject(res.statusText)
      }
    )
  };

  var put = function (path, dto) {
    return $http.put(path, dto).then(
      function (res) {
        return res.data;
      },
      function (res) {
        return $q.reject(res.statusText)
      }
    )
  }

  var post = function (path, dto) {
    return $http.post(path, dto).then(
      function (res) {
        return res.data;
      },
      function (res) {
        return $q.reject(res.statusText)
      }
    )
  };

  var del = function (path) {
    return $http.delete(path).then(
      function (res) {
        return res.data;
      },
      function (res) {
        return $q.reject(res.statusText)
      }
    )
  };


  return {
    get: get,
    put: put,
    post: post,
    delete: del
  };
});
