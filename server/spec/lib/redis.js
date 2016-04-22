'use strict';

describe('redis中间件', function () {

  const redis = require('yibit').redis({host: '192.168.100.242'});
  const req = {};
  const next = jasmine.createSpy('next');

  redis(req, null, next);

  it('req对象应该具有redis属性', function () {
    expect(req.redis).toBeDefined();
  });

  it('应该调用了next', function () {
    expect(next).toHaveBeenCalledWith();
  });

  /*
  it('redis读取', function (done) {
    req.redis.get('qwerty',(err,result)=>{
      expect(err).toBeFalsy();
      expect(result).toBe('qwerty');
      done();
    });
  });

  it('redis写入', function (done) {
    req.redis.set('foo','fooooooooo',(err,result)=>{
      expect(err).toBeFalsy();
      expect(result).toBe('OK');
      done();
    });
  });
  */
});