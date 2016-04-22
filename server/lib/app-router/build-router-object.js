'use strict';

const path = require('path');
const fs = require('fs');

const parseMethod = require('./parse-method');
const parseRouterPath = require('./parse-router-path');
const auth = require('./auth');
const removeAuthInfo = require('./remove-auth-info');
const sanitizers = require('./sanitizers');

module.exports = (routersDirectory, directory, open)=> {

  if (!fs.existsSync(path.join(directory, 'index.js')))return;
  const _routerObject = require(directory);
  if (!_routerObject)return;

  const routerObject = {};
  if (typeof _routerObject === 'function') {
    routerObject.handler = _routerObject;
  } else {
    Object.assign(routerObject, _routerObject)
  }

  routerObject.method = routerObject.method || parseMethod(path.basename(directory));
  routerObject.path = routerObject.path || parseRouterPath(routersDirectory, path.dirname(directory));
  routerObject.middlewares = routerObject.middlewares || [];
  routerObject.priority = routerObject.priority || 0;


  open || routerObject.open || routerObject.middlewares.push(auth(routerObject.method, routerObject.path));
  routerObject.middlewares.push(removeAuthInfo);

  const schemaFile = path.join(directory, 'schema.js');
  fs.existsSync(schemaFile) && routerObject.middlewares.push(sanitizers(require(schemaFile)));

  return routerObject;
};

