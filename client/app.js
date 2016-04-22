'use strict';
const express = require('express');
const logger = require('morgan');

const master = require('./master');
const app = express();
const port = 9001;

app.use(logger('dev'));

app.use('/index',master);

app.use('/content', express.static('./bower_components'));
app.use('/', express.static('./res'));



app.use(function (req, res) {
  res.status(404).end();
});

app.listen(port, function () {
  console.log('服务器开始监听端口[%d]', port);
});



