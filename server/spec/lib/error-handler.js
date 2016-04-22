'use strict';

describe('error-handler中间件', function () {

  let yi = require('yibit');

  let code, status, message;

  let req = {};

  let error = new Map([
    ['error1', {code: 1, status: 100}],
    ['error2', {code: 2, status: 200}],
    ['error3', {code: 3, status: 300}],
    ['error4', {code: 4, status: 400, message: '错误四'}]
  ]);

  let next = e=> {
    code = e.code;
    status = e.status;
    message = e.message;
  };

  let errorHandler = yi.errorHandler(error);

  errorHandler(req, null, ()=> {
  });

  it('req对象应该具有err方法', function () {
    expect(typeof req.err).toBe('function')
  });

  it('req对象的err方法应该具有error1-error4四个方法', function () {
    expect(typeof req.err.error1).toBe('function');
    expect(typeof req.err.error2).toBe('function');
    expect(typeof req.err.error3).toBe('function');
    expect(typeof req.err.error4).toBe('function');
  });

  it('req.err执行后，code,status,message应该被赋予正确的值', function () {
    req.err(next,new Error,-1,-100,'error-1');
    expect(code).toBe(-1);
    expect(status).toBe(-100);
    expect(message).toBe('error-1');
  });

  it('req.err.error1执行后，code,status,message应该被赋予正确的值', function () {
    req.err.error1(next);
    expect(code).toBe(1);
    expect(status).toBe(100);
    expect(message).toBe('error1');
  });

  it('req.err.error2执行后，code,status,message应该被赋予正确的值', function () {
    req.err.error2(next, new Error('这里是错误二'));
    expect(code).toBe(2);
    expect(status).toBe(200);
    expect(message).toBe('这里是错误二');
  });

  it('req.err.error3执行后，code,status,message应该被赋予正确的值', function () {
    req.err.error3(next);
    expect(code).toBe(3);
    expect(status).toBe(300);
    expect(message).toBe('error3');
  });

  it('req.err.error4执行后，code,status,message应该被赋予正确的值', function () {
    req.err.error4(next);
    expect(code).toBe(4);
    expect(status).toBe(400);
    expect(message).toBe('错误四');
  });
});