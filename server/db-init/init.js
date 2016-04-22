var async = require('async');
var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;
var Double = mongodb.Double;
var ObjectID = mongodb.ObjectID;
var passwordHash = require('../lib/password-hash');
var config = require('../config');

var db;

var chineseNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '二十一', '二十二', '二十三', '二十四', '二十五', '二十六', '二十七', '二十八', '二十九', '三十',
  '三十一', '三十二', '三十三', '三十四', '三十五', '三十六', '三十七', '三十八', '三十九', '四十',
  '四十一', '四十二', '四十三', '四十四', '四十五', '四十六', '四十七', '四十八', '四十九', '五十',
  '五十一', '五十二', '五十三', '五十四', '五十五', '五十六', '五十七', '五十八', '五十九', '六十',
  '六十一', '六十二', '六十三', '六十四', '六十五', '六十六', '六十七', '六十八', '六十九', '七十',
  '七十一', '七十二', '七十三', '七十四', '七十五', '七十六', '七十七', '七十八', '七十九', '八十',
  '八十一', '八十二', '八十三', '八十四', '八十五', '八十六', '八十七', '八十八', '八十九', '九十',
  '九十一', '九十二', '九十三', '九十四', '九十五', '九十六', '九十七', '九十八', '九十九', '一百'
];


async.series([

    function (callback) {
      mongoClient.connect(config.mongo.url, config.mongo.options, function (err, _db) {
        db = _db;
        callback(err);
      });
    },

    function (callback) {
      db.dropDatabase(callback);
    },

    user,
    role,
    userRole
  ],
  function (err, results) {
    if (err)return console.log(err);
    db.close(function (err) {
      console.log(err || '数据库连接关闭');
    });
  }
);
/////////////////////////////////////////////////////////////////
function templet(callback) {
  var docs = [];
  for (var i = 1; i <= 1000; i++)
    docs.push({
      pFloat: new Double(1000 - i),
      pIntegers: i,
      pDate: new Date(),
      pBoolean: false,
      pString: '第' + i + '项'
    });
  db.collection('templet').insertMany(docs, {w: 1}, function (err, data) {
    console.log(data.ops);
    callback(err, data.ops);
  });
}


function user(callback) {
  var docs = [];
  passwordHash.hash('123456', function (err, hash) {
    if (err)return;
    for (var i = 1; i <= 100; i++) {
      docs.push({
        _id: buildUserId(i),
        name: 'user' + i,
        mobile: (13900000000 + i).toString(),
        email: i + '@yibit.com',
        pwd: hash,
        realname: '姓名' + chineseNum[i],
        sex: i % 3 === 0,
        on: new Date()
      });
    }
    db.collection('user').insertMany(docs, {w: 1}, function (err, data) {
      console.log(data.ops);
      callback(err, data.ops);
    });
  });
}

function role(callback) {
  var docs = [];
  for (var i = 1; i <= 10; i++) {
    docs.push({
      _id: buildRoleId(i),
      name: '角色' + chineseNum[i],
      descr: '第' + chineseNum[i] + '个角色'
    });
  }
  db.collection('role').insertMany(docs, {w: 1}, function (err, data) {
    console.log(data.ops);
    callback(err, data.ops);
  });
}


function userRole(callback) {
  var docs = [];
  for (var i = 1; i <= 100; i++) {
    var user = {
      _id:buildUserId(i),
      roles:[]
    };
    for(var j=1;j<=i%10;j++){
      user.roles.push(buildRoleId(j));
    }
    docs.push(user);
  }
  db.collection('userRole').insertMany(docs, {w: 1}, function (err, data) {
    console.log(data.ops);
    callback(err, data.ops);
  });
}







function buildId(profix, i) {
  var id = profix;
  while (id.length < 14)id = id + '0';
  id = id + (10000000000 + i).toString().substr(1);
  return new ObjectID(id);
}

function buildUserId(i){
  return buildId('',i);
}
function buildRoleId(i){
  return buildId('1',i);
}