angular.module('auais').factory('query', function () {

  return function (path, queryObject) {
    var char = path.indexOf('?') === -1 ? '?' : '&';
    var qs = queryObject ? $.param(queryObject) : '';
    if (qs === '')char = '';
    return path + char + qs;
  };

});