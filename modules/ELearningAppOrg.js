angular.module('ELearningApp', ['ngRoute'])
	.config(function ($routeProvider, $locationProvider){
		$routeProvider.when('/page1', {
			controller: 'controllers/pageController',
			templateUrl: 'views/text-with-image-template.html'
		})
		$locationProvider.html5Mode(true);
	});