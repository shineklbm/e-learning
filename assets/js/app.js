// app module declartion
angular.module("eLearning", []);

//controller declaration
angular.module("eLearning")
	.controller('rootCtrl', ['$scope', '$http', rootController])
	.controller('pageCtrl', ['$scope', '$http', pageController])
	.controller('imageCtrl', ['$scope', '$http', imageController]);

function rootController($scope, $http){
	$http.get('app/config/menus.json')
		.success(function(data){
			$scope.menus = data;
			$('#menu').jstree(data);
			$("#menu").bind("select_node.jstree", function (e, data) {
			    return data.instance.toggle_node(data.node);
			});
		});

	$scope.changeListName = function(page_id) {
	    alert(page_id);
	};
}


function pageController($scope, $http){
}

function imageController($scope, $http){
}