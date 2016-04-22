'use strict';
module.exports = errors=> {

  return (req, res, next)=> {
    const errFunction = (err, code, status, message)=> {
      Object.assign(err, {code, status, message});
      res.sendErr(err);
    };

    errors.forEach((value, key)=> {
      errFunction[key] = err=> {
        err = err || new Error();
        err.code = value.code;
        err.status = value.status;
        err.message = err.message || value.message || key;
        res.sendErr(err);
      };
    });

    res.err = errFunction;
    next();
  };


};
