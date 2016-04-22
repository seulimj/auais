'use strict';
const redis = require('redis');
module.exports = options=> {
  return (req, res, next)=> {
    req.redis = redis.createClient(options);
    next();
  }
};
