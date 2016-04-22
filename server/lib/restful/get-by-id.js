'use strict';

module.exports = entity=>{

  return (req,res,next)=>{
    req.mongo.collection(entity)
      .find({$or: [{name: username}, {mobile: username}, {email: username}]})
      .limit(1)
      .next(function (err, user) {

        if (err) return req.err.mongoError(next, err);
        if (!user) return req.err.notExist(next);
      });
  };




};
