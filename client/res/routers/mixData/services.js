angular.module('application').factory('mixDataService', function (RESTful) {
  var restful = new RESTful('mixData');
  return restful;

});