// app module declartion
angular.module("eLearning", []);

//controller declaration
angular.module("eLearning")
	.controller('pageCtrl', ['$scope', '$http', pageController])
	.controller('readData', ['$scope', '$http', readData])
	.controller('imageCtrl', ['$scope', '$http', imageController]);
//controller function defenition
/*function readData($scope, $http){
	$scope.vals = $http.get('app/data/en/data.html')
					.success(function(data){
						$scope.$parent.content = data;
					});
}*/

function pageController($scope, $http){
	/*$scope.pageinfo = $http.get('app/config/en/data.json')
					.success(function(data){
						$scope.$parent.contents = data;
					});*/
	$scope.imageinfo = "demo";
	$scope.tabinfo = "demo";
}

function readData($scope, $http){
	$scope.vals = $http.get('app/data/en/data.json')
					.success(function(data){
						$scope.$parent.contents = data;
					});

}
function imageController($scope, $http){
	$scope.init = function(datasource){
		$scope.datasource = datasource;	
	}
	$scope.result = $scope.datasource;
	/*$scope.pathinfo = $http.get('app/data/en/'+ $scope.datasource +'.json')
					.success(function(data){
						$scope.$parent.imageinfo = data;
					});*/

}