// app module declartion
angular.module("eLearning", []);

//controller declaration
angular.module("eLearning")
	.controller('rootCtrl', ['$scope', '$http', rootController])
	.controller('pageCtrl', ['$scope', pageController])
	.directive('textComponent', textComponent)
	.directive('imageComponent', imageComponent)
	.directive('accordionComponent', accordionComponent)
	.directive('tabComponent', tabComponent)
	.filter('unsafe', function($sce) {
	    return function(val) {
			return $sce.trustAsHtml(val);
	    };
	});
function textComponent() {
	return {
		restirct: 'E',
		templateUrl: 'components/text-component.html',
		controller: function($scope, $http, $element, $attrs, $sce){
			if($attrs.datasource.length >= 1){
				$scope.current_content = $scope.page_content.contents[$attrs.datasource];
			}
		}
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
		});
	$("#menu").bind("select_node.jstree", function (e, data) {
		$scope.menuClickListener($(data.node).attr('id'));
		return data.instance.toggle_node(data.node);
	});
	$scope.menuClickListener = function(pageId){
		var lang = $scope.configs.lang;
		$http.get('app/pages/'+pageId+'.json')
		.success(function(data){
			$scope.page = data;
			$scope.getContent($scope, $http);
		});
	};

	$scope.getContent = function($scope, $http){
		var lang = $scope.configs.lang;
		$http.get('app/datas/'+lang+'/'+$scope.page.content)
		.success(function(data){
			$scope.page_content = data;
		});
	}

}
function pageController($scope) {

}