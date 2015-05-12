angular.module('ELearningApp')
	.controller('loadScripts', function($scope, $http){
		$http.get("config/common.json")
		.success(function(response) {
			$scope.dependency_urls = response;
		});
	});
