const path = require('path');
var fs = require('fs');


module.exports = (req, res, next)=> {

  var page = fs.readFileSync(path.join(__dirname, 'master.html'), 'utf-8');

  res.send(page);
};