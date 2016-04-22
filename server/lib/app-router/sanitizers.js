'use strict';

const joi = require('joi');
module.exports = schema=> {
  const sanitizers = [];
  for (var k in schema) {
    let sanitizer = (function ($) {
      return function (req, res, next) {
        joi.validate(req[$], schema[$], function (err, value) {
          if (err) return res.err.invalidRequest(err);
          req.san = req.san || {};
          req.san[$] = value;
          next();
        });
      }
    }(k));
    sanitizers.push(sanitizer);
  }
  return sanitizers;
};
