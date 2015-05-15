'use strict';

/* Controllers */

var coreRoutesController = angular.module('coreRoutesController', []);

coreRoutesController.controller('rootCtrl', function($scope, $http){
		$http.get("common/configs.json")
		.success(function(response) {
			$scope.common_configs = response;
		});
		$http.get("common/styles.json")
		.success(function(response) {
			$scope.common_styles = response;
		});
		$http.get("common/scripts.json")
		.success(function(response) {
			$scope.common_scripts = response;
		});
	});

coreRoutesController.controller('pageCtrl', ['$scope', '$http',
  function($scope, $http) {
    $http.get('app/data/en/home.html').success(function(data) {
      $scope.custom_data = data;
    });
    $scope.param = 'test param';
  }]);