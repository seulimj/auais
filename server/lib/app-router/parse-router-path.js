'use strict';
module.exports = (routersDirectory, directory)=> {
  let routerPath = directory.substr(routersDirectory.length);
  routerPath = routerPath.replace(/\\/g, '/').replace(/\@/g, ':');
  if (routerPath === '')routerPath = '/';
  return routerPath;
};
