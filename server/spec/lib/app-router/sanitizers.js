'use strict';

describe('sanitizers中间件', function () {

  const $ = require('joi');

  const sanitizers = require('../../../lib/app-router/sanitizers');
  const req = {query: {foo: 'foo'}, body: {bar: '2'}, params: {bas: '3'}};
  const badReq = {query: {foo: 'fo'}, body: {bar: 'bar'}, params: {bas: '3'}};


  const invalidRequest = jasmine.createSpy('invalidRequest');
  const err = {err:{invalidRequest}};

  Object.assign(req, err);
  Object.assign(badReq, err);


  const schema = {
    query: $.object({
      foo: $.string().min(3)
    }).requiredKeys('foo'),
    body: $.object({
      bar: $.number().integer()
    }).requiredKeys('bar'),
    params: $.object({
      bas: $.number().integer()
    }).requiredKeys('bas')
  };


  it('应该正确应用了中间件,验证将会通过', function () {
    const next = jasmine.createSpy('next');
    sanitizers(schema).forEach(mid=> {
      mid(req, null, next);
    });
    expect(next).toHaveBeenCalledWith();
    expect(invalidRequest).not.toHaveBeenCalled();
    expect(req.san).toBeDefined();
    expect(req.san.query).toBeDefined();
    expect(req.san.body).toBeDefined();
    expect(req.san.params).toBeDefined();
    expect(req.san.query.foo).toBe('foo');
    expect(req.san.body.bar).toBe(2);
    expect(req.san.params.bas).toBe(3);

  });


  it('应该正确应用了中间件,验证将不会通过', function () {
    const next = jasmine.createSpy('next');
    sanitizers(schema).forEach(mid=> {
      mid(badReq, null, next);
    });
    expect(invalidRequest).toHaveBeenCalledWith(next,jasmine.anything());
    expect(invalidRequest.calls.count()).toEqual(2);
    expect(badReq.san.query).toBeUndefined();
    expect(badReq.san.body).toBeUndefined();
    expect(badReq.san.params).toBeDefined();
  });



});