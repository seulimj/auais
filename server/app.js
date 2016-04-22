const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('morgan');
const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
const config = require('./config');
const error = require('./error');

const yibit = require('yibit');
const appRouter = yibit.appRouter;
const redis = yibit.redis;
const errorHandler = yibit.errorHandler;

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/res', express.static('./res'));
app.use('/js', express.static('./bower_components'));

const dev = app.get('env') === 'development';

app.use(function (req, res, next) {
  req.priKey = config.priKey;
  res.sendErr = function (err) {
    const e = {code: err.code};
    if (dev) {
      e.message = err.message;
      e.details = err.details;
      e.stack = err.stack;
    }
    this.status(err.status || 500).send(e);
  };
  next();
});

app.use(errorHandler(error));
app.use(redis(config.redis.options));

var startApp = function () {

};


mongoClient.connect(config.mongo.url, config.mongo.options, function (err, db) {

  if (err)return console.log('mongo数据库连接失败');
  console.log('mongo数据库连接成功');

  app.use(function (req, res, next) {
    req.mongo = db;
    next();
  });

  //app.use(require('./lib/app-router/security')(config.priKey));
  app.use(appRouter({
    routersDirectory: path.join(__dirname, config.routers.directory),
    open: !!config.routers.open,
    security: !!config.routers.security
  }));


  app.use(function (req, res, next) {
    var err = new Error('notFound');
    var notFound = error.get('notFound');
    err.code = notFound.code;
    err.status = notFound.status;
    next(err);
  });

  app.use(function (err, req, res, next) {
    res.sendErr(err);
  });


  app.listen(config.app.port, function () {
    console.log('服务器开始监听端口[%d]', config.app.port);
  });

});




