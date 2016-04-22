'use strict';
describe('parse-method', function () {

  const parseMethod = require('../../../lib/app-router/parse-method');

  it('#get应该解析为get', function () {
      expect(parseMethod('#get')).toBe('get');
  });
  it('#post应该解析为post', function () {
    expect(parseMethod('#post')).toBe('post');
  });
  it('#put应该解析为put', function () {
    expect(parseMethod('#put')).toBe('put');
  });
  it('#delete应该解析为delete', function () {
    expect(parseMethod('#delete')).toBe('delete');
  });
  it('#notamethed应该解析为undefined', function () {
    expect(parseMethod('#notamethed')).toBe(undefined);
  });
});
