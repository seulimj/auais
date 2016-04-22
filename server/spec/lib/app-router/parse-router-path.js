'use strict';
describe('parse-router-path', function () {

  const parseRouterPath = require('../../../lib/app-router/parse-router-path');
  const path = require('path');
  it('应该解析正确', function () {
    expect(parseRouterPath(__dirname,path.join(__dirname,'/a/b/@c'))).toBe('/a/b/:c');
    expect(parseRouterPath(__dirname,path.join(__dirname,'a/b/c'))).toBe('/a/b/c');
    expect(parseRouterPath(__dirname,path.join(__dirname,'/'))).toBe('/');
    expect(parseRouterPath(__dirname,__dirname)).toBe('/');
  });
});
