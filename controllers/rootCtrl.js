angular.module('ELearningApp')
	.controller('rootCtrl', function($scope, $http){
		$http.get("configs/commons.json")
		.success(function(response) {
			$scope.common_configs = response;
		});
		$http.get("configs/styles.json")
		.success(function(response) {
			$scope.common_styles = response;
		});
		$http.get("configs/scripts.json")
		.success(function(response) {
			$scope.common_scripts = response;
		});
	});
