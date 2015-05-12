angular.module('eLearningApp', []);
angular.module('eLearningApp')
	.controller('commonScripts', function($scope, $http){
		$http.get("config/common.json")
		.success(function(response) {
			//$scope.members = response;
			//alert(response);
			$scope.script_urls = response;
		});
	});