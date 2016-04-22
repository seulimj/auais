'use strict';


describe('password-hash', function () {

  let path = require('path');
  let routerDirectories = require('../../../lib/app-router/router-directories');
  let mkdirp = require('mkdirp');

  let routerDir = path.join(__dirname, 'temp');

  beforeAll(function () {
    mkdirp.sync(path.join(routerDir, '#get'));
    mkdirp.sync(path.join(routerDir, 'a1'));
    mkdirp.sync(path.join(routerDir, 'a1','#post'));
    mkdirp.sync(path.join(routerDir, 'a1','a11'));
    mkdirp.sync(path.join(routerDir, 'a2'));
    mkdirp.sync(path.join(routerDir, 'a2','#get'));
    mkdirp.sync(path.join(routerDir, 'a2','a21'));
    mkdirp.sync(path.join(routerDir, 'a2','a21', '#get'));
    mkdirp.sync(path.join(routerDir, 'a2','a22'));
    mkdirp.sync(path.join(routerDir, 'a2','a22', '#get'));
    mkdirp.sync(path.join(routerDir, 'a3'));
    mkdirp.sync(path.join(routerDir, 'a3','a31'));
    mkdirp.sync(path.join(routerDir, 'a3','a32'));
    mkdirp.sync(path.join(routerDir, 'a3','a33'));
    mkdirp.sync(path.join(routerDir, 'a3','a33','a331'));
    mkdirp.sync(path.join(routerDir, 'a3','a33','a332'));
    mkdirp.sync(path.join(routerDir, 'a3','a33','a332','#get'));
    mkdirp.sync(path.join(routerDir, 'a3','a33','a333'));
    mkdirp.sync(path.join(routerDir, 'a3','a33','a333','#get'));
  });



  it('应该能找到7个路由文件夹', function () {
    let directories = routerDirectories(routerDir);
    expect(directories.length).toBe(7);
    expect(directories[0]).toBe(path.join(routerDir, 'a3','a33','a333','#get'));
    expect(directories[1]).toBe(path.join(routerDir, 'a3','a33','a332','#get'));
    expect(directories[2]).toBe(path.join(routerDir, 'a2','a22', '#get'));
    expect(directories[3]).toBe(path.join(routerDir, 'a2','a21', '#get'));
    expect(directories[4]).toBe(path.join(routerDir, 'a2','#get'));
    expect(directories[5]).toBe(path.join(routerDir, 'a1','#post'));
    expect(directories[6]).toBe(path.join(routerDir, '#get'));
  });
});
