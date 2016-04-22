'use strict';
const $ = require('joi');
module.exports = {

  body: $.object({
    username: $.string(),
    password: $.string().min(6)
  }).requiredKeys('username', 'password')

};