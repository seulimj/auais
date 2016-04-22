'use strict';
const _ = require('lodash');
const express = require('express');
const buildRouterObject = require('./build-router-object');
const routerDirectories = require('./router-directories');


module.exports = options=> {

  const router = express.Router();
  let routerObjects = [];
  const directories = routerDirectories(options.routersDirectory);
  for (let directory of directories) {
    console.log(directory);
    const routerObject = buildRouterObject(options.routersDirectory, directory, options.open);
    routerObject && routerObjects.push(routerObject);
  }

  routerObjects = _.sortBy(routerObjects, function (routerObject) {
    return -routerObject.priority;
  });

  for (let routerObject of routerObjects) {
    console.log(routerObject );
    router[routerObject.method](routerObject.path, routerObject.middlewares, routerObject.handler)
  }

  return router;
};




