var passwordHash = require('../../../lib/password-hash');
var ObjectID = require('mongodb').ObjectID;
module.exports = {
  open: true,

  handler(req, res, next) {

    var username = req.body.username;
    var password = req.body.password;
    console.log(username)
    console.log(password)
    req.mongo.collection('user')
      .find({$or: [{name: username}, {mobile: username}, {email: username}]})
      .limit(1)
      .next(function (err, user) {

        //console.log(user)

        if (err) return res.err.mongoError(err);
        if (!user) return res.err.notExist();

        passwordHash.compare(password, user.pwd, function (err, isMatch) {

          if (err) return res.err.unknownError();
          if (!isMatch) return res.err.invalidPassword();
          var _id = user._id;
          var token = new ObjectID();
          req.redis.set(_id,
            JSON.stringify({token: token, api: ['1', '2']}),
            function (err) {
              if (err) return res.err.redisError(err);
              res.json({_id: _id, token: token});
            });

        });

      });

  }
};
