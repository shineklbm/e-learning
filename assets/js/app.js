// app module declartion
angular.module("eLearning", []);

//controller declaration
angular.module("eLearning")
	.controller('rootCtrl', ['$scope', '$http', rootController])
	.controller('pageCtrl', ['$scope', '$http', pageController])
	.directive('textComponent', textComponent)
	.directive('imageComponent', imageComponent)
	.directive('accordionComponent', accordionComponent)
	.directive('tabComponent', tabComponent);
	
function textComponent() {
	return {
		restirct: 'E',
		templateUrl: 'components/text-component.html'
	};
}
function imageComponent() {
	return {
		restirct: 'E',
		templateUrl: 'components/image-component.html'
	};
}
function accordionComponent() {
	return {
		restirct: 'E',
		templateUrl: 'components/accordion-component.html'
	};
}
function tabComponent() {
	return {
		restirct: 'E',
		templateUrl: 'components/tab-component.html'
	};
}
function rootController($scope, $http){
	$http.get('configs/commons.json')
		.success(function(data){
			$scope.configs = data;
		});
	$http.get('app/configs/menu.json')
		.success(function(data){
			$scope.menus = data;
			$('#menu').jstree(data);
			$("#menu").bind("select_node.jstree", function (e, data) {
				$scope.menuClickListener($(data.node).attr('id'));
			    return data.instance.toggle_node(data.node);
			});
		});
	$scope.menuClickListener = function(pageId){
		$http.get('app/pages/'+pageId+'.json')
		.success(function(data){
			$scope.page = data;
		});
	} 
}
function pageController($scope, $http){
	$scope.init = function(data){
		$scope.page_id = data;
	}
}