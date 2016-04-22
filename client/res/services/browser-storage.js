angular.module('auais').factory('browserStorage', function () {

    var suffix = '__type__';

    var getStorage = function (storage) {

      var set = function (key, value) {
        var type;
        if (angular.isNumber(value)) {
          type = 'Number';
        }
        if (angular.isObject(value)) {
          type = 'Object';
          value = JSON.stringify(value);
        }
        if (typeof value === 'boolean') {
          type = 'Boolean';
          value = value ? 1 : 0;
        }
        storage[key] = value;
        if (type)storage[key + suffix] = type;
      };

      var get = function (key) {
        var value = storage[key];
        var type = storage[key + suffix];
        if (type === 'Number')return Number(value);
        if (type === 'Object')return JSON.parse(value);
        if (type === 'Boolean')return value === '1';
        return value;
      };

      var remove = function (key) {
        storage.removeItem(key);
        storage.removeItem(key + suffix);
      };

      var clear = function () {
        storage.clear();
      };

      return {
        set: set,
        remove: remove,
        clear: clear,
        get: get
      }
    };

    return {
      local: getStorage(localStorage),
      session: getStorage(sessionStorage)
    }


  }
);

