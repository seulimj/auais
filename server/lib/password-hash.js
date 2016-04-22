
'use strict';

const bcrypt = require("bcrypt-nodejs");

module.exports = {
  hash(password, callback) {
    bcrypt.hash(password, null, null, callback);
  },
  compare(password, encrypted, callback) {
    bcrypt.compare(password, encrypted, callback);
  }
};
