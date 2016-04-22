'use strict';
const md5 = require('md5');
module.exports = (method, path)=> {
  return (req, res, next)=> {
    const userId = req.query._u_;
    const sign = req.query._s_;
    const time = parseInt(req.query._t_);
    if (!userId || !sign || !time) return res.err.unauthorized();

    let url = req.headers.host + req.originalUrl;
    url = url.substr(0, url.length - sign.length - 5);

    const api = path + '#' + method;
    req.redis.get(userId, (err, authInfo)=> {
      if (err) return res.err.redisError();
      if (!authInfo) return res.err.unauthorized();
      authInfo = JSON.parse(authInfo);
      if (md5(url + authInfo.token) !== sign) return res.err.unauthorized();
      if (Math.abs(new Date().getTime() - time) > 1000 * 60 * 1000) return res.err.unauthorized();
      if (authInfo.apis.indexOf(api) < 0) return res.err.unauthorized();
      next();
    });
  };
};
