'use strict';
/* App Module */
var ELearningApp = angular.module('ELearningApp', [
  'ngRoute',
  'coreRoutesController'
]);
ELearningApp.config(['$routeProvider',
    function($routeProvider) {
      $routeProvider
      .when('/index', {
        templateUrl: 'views/index.html',
        controller: 'pageCtrl'
      })
      .otherwise({
        redirectTo: '/index'
      });
    }
  ]);