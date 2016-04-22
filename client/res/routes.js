angular.module('application').config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.when('', '/index');

  $stateProvider.state('login', {
    url: '/login',
    templateUrl: '/login.html',
    controller: 'LoginController'
  });
  $stateProvider.state('register', {
    url: '/register',
    templateUrl: '/register.html'
  });

  $stateProvider.state('site', {
    abstract: true,
    templateUrl: '/site.html',
    controller: 'SiteController'
  });


  $stateProvider.state('site.index', {
    url: '/index',
    templateUrl: '/index.html',
    controller: 'IndexController'
  });




});
