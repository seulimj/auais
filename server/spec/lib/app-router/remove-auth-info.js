'use strict';

describe('remove-auth-info中间件', function () {

  const removeAuthInfo = require('../../../lib/app-router/remove-auth-info');
  const req = {query: {_u_: '_u_', _s_: '_s_', _t_: '_t_'}};
  const next = jasmine.createSpy('next');

  removeAuthInfo(req, null, next);

  it('remove-auth-info应该从req.query对象上移除了_u_，_s_，_t_三个属性', function () {
    expect(req.query._u_).toBeUndefined();
    expect(req.query._s_).toBeUndefined();
    expect(req.query._t_).toBeUndefined();
  });

  it('remove-auth-info应该应该调用了next', function () {
    expect(next).toHaveBeenCalledWith();
  });

});