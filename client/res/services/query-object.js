angular.module('auais').factory('QueryObject', function () {
  var QueryObject = function (options) {
    options = options || {};
    if (options.page)this.page = options.page;
    if (options.sort)this.sort = options.sort;
    if (options.query)this.query = options.query;
  };

  var _getItem = function (arr, key) {
    for (var i = arr.length; i--;) {
      if (arr[i][key] !== undefined)return arr[i];
    }
  };
  QueryObject.prototype.export = function (clear) {
    clear = clear || angular.noop;
    clear(this);
    var o = {};
    if (this.page)o.page = this.page;
    if (this.sort)o.sort = this.sort;
    if (this.query)o.query = this.query;
    return o;
  };
  QueryObject.prototype.setSort = function (value) {
    this.sort = value;
  };
  QueryObject.prototype.getSort = function (value) {
    return this.sort;
  };

  QueryObject.prototype.setQuery = function () {
    var argLength = arguments.length;
    if (argLength < 2)return;
    var value = arguments[argLength - 1];
    var lastKey = arguments[argLength - 2];
    var parent = this.query = this.query || {};
    var current, key;

    for (var i = 0; i < argLength - 2; i++) {
      key = arguments[i];
      if (angular.isArray(parent)) {
        var item = _getItem(parent, key);
        if (item !== undefined) {
          current = item[key];
        } else {
          if (key === '$or') {
            var a = {$or: []};
            current = a.$or;
            parent.push(a);
          } else {
            var o = {};
            o[key] = {};
            current = o[key];
            parent.push(o);
          }
        }
      } else {

        current = parent[key];
        if (current === undefined) {
          current = key === '$or' ? [] : {};
          parent[key] = current;
        }

      }

      parent = current;
    }

    if (angular.isArray(parent)) {
      var last = _getItem(parent, lastKey);
      if (last !== undefined) {
        last[lastKey] = value;
      } else {
        last = {};
        last[lastKey] = value;
        parent.push(last);
      }
    } else {
      parent[lastKey] = value;
    }

  };


  QueryObject.prototype.getQuery = function () {

    var argLength = arguments.length;
    var parent = this.query;
    if (parent === undefined)return;

    var key;
    for (var i = 0; i < argLength; i++) {
      key = arguments[i];
      if (angular.isArray(parent)) {
        var item = _getItem(parent, key);
        if (item === undefined)return;
        parent = item[key];
      } else {
        parent = parent[key];
        console.log('===============================')
        console.log(parent)
      }
      if (parent === undefined)return;
    }
    return parent;
  };


  QueryObject.prototype.removeQuery = function () {

    var argLength = arguments.length;
    var parent = this.query;
    if (parent === undefined)return;
    var lastKey = arguments[argLength - 1];

    var key;
    for (var i = 0; i < argLength - 1; i++) {
      key = arguments[i];
      if (angular.isArray(parent)) {
        var item = _getItem(parent, key);
        if (item === undefined)return;
        parent = item[key];
      } else {
        parent = parent[key];
      }
      if (parent === undefined)return;
    }


    if (angular.isArray(parent)) {
      var last = _getItem(parent, lastKey);
      if (last !== undefined) {
        parent.splice($.inArray(last, parent), 1);
      }
    } else {
      delete parent[lastKey];
    }
  };


  return QueryObject;
});




