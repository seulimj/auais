'use strict';
module.exports = dirName=> {
  switch (dirName) {
    case '#get':
      return 'get';
    case '#post':
      return 'post';
    case '#put':
      return 'put';
    case '#delete':
      return 'delete';
    default:
      return;
  }
};
