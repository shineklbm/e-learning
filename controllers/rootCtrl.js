angular.module('ELearningApp')
	.controller('rootCtrl', function($scope, $http){
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
