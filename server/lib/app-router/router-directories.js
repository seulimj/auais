'use strict';

const parseMethod = require('./parse-method');
const path = require('path');
const fs = require('fs');


module.exports = routersDirectory=> {

  const routerDirectories = [];

  const getRouterDirectories = directory=> {
    const dirNames = fs.readdirSync(directory);
    for (let i = dirNames.length; i--;) {

      const dirName = dirNames[i];
      const subdirectory = path.join(directory, dirName);
      const method = parseMethod(dirName);
      if (method) {
        routerDirectories.push(subdirectory);
      } else {
        fs.statSync(subdirectory).isDirectory() && getRouterDirectories(subdirectory);
      }
    }
  };

  getRouterDirectories(routersDirectory);

  return routerDirectories;
};
