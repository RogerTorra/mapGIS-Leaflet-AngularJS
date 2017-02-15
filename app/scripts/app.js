'use strict';

/**
 * @ngdoc overview
 * @name gisMapApp
 * @description
 * # gisMapApp
 *
 * Main module of the application.
 */
angular
  .module('gisMapApp', [
    'ngResource',
    'ngRoute',
    'ui.bootstrap',
    'ngMaterial',
    'ngStorage'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'vm'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
