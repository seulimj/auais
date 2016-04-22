angular.module('application').factory('templetService', function (RESTful) {

  var restful = new RESTful('templet');
  return restful;

});