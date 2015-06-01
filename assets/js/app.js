// app module declartion
angular.module("eLearning", []);

//controller declaration
angular.module("eLearning")
	.controller('rootCtrl', ['$scope', '$http', rootController])
	.run(function($rootScope, $templateCache) {
	   $rootScope.$on('$viewContentLoaded', function() {
	      $templateCache.removeAll();
	   });
	})
	.filter('unsafe', function($sce) {
	    return function(val) {
			return $sce.trustAsHtml(val);
	    };
	})
	.directive('textComponent', function(){
		return {
			restirct: "E",
			scope: {},
			templateUrl: 'components/text-component.html',
			link: function(scope, element, attrs){
				scope.$parent.$watch('contents', function(newValue, oldValue) {
						if (newValue){
							//console.log(scope.$parent.contents);
							scope.custom_classes = attrs.classes;
							scope.text_list = scope.$parent.contents[attrs.datasource];
							//console.log("I come here");
							//console.log(attrs.datasource+" : "+scope.text_list);
						}												
		        }, true);
			}
		}
	})
	.directive('tabComponent', function(){
		return {
			restirct: "E",
			scope: {},
			templateUrl: 'components/tab-component.html',
			link: function(scope, element, attrs){
				scope.$parent.$watch('contents', function(newValue, oldValue) {
						if (newValue){
							//console.log(scope.$parent.contents);
							scope.custom_classes = attrs.classes;
							scope.tab_list = scope.$parent.contents[attrs.datasource];
						}												
		        }, true);
			}
		}
	})
	.directive('imageComponent', function(){
		return {
			restirct: "E",
			scope: {},
			templateUrl: 'components/image-component.html',
			link: function(scope, element, attrs){
				scope.$parent.$watch('contents', function(newValue, oldValue) {
						if (newValue){
							//console.log(scope.$parent.contents);
							scope.custom_classes = attrs.classes;
							scope.image_list = scope.$parent.contents[attrs.datasource];
						}												
		        }, true);
			}
		}
	})
	.directive('collapseComponent', function(){
		return {
			restirct: "E",
			scope: {},
			templateUrl: 'components/collapse-component.html',
			link: function(scope, element, attrs){
				scope.$parent.$watch('contents', function(newValue, oldValue) {
						if (newValue){
							/*console.log(attrs.classes);*/
							scope.custom_classes = attrs.classes;
							scope.collapse_list = scope.$parent.contents[attrs.datasource];
						}												
		        }, true);
			}
		}
	});
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
	var menu = $("#menu").bind("select_node.jstree", function (e, data) {
		$scope.menuClickListener($(data.node).attr('id'));
		return data.instance.toggle_node(data.node);
	});

	$scope.pagePrevious = function(page_id){
		var tree = $('#menu').jstree(true);
		if(angular.isDefined(page_id)){			
		    curr = tree.get_selected(false);
		    tree.deselect_all();
		    tree.open_all();
		    var n = tree.get_prev_dom(curr);
		    tree.select_node(n);
			//$scope.menuClickListener('page3');
			//console.log($scope.menus.core.data);
			/*var menuList = $scope.menus.core.data;
			for (var i = 0, len = arr.length; i < len; i++) {
  				var obj = arr[i];
			}*/
			/*curr = menu.get_selected (false);
		    menu.deselect_all ();
		    menu.open_all ();
		    var n = menu.get_next_dom (curr);
		    menu.select_node (n);*/
		    //console.log(menu);
		}
		else{

		}
	}
	$scope.pageNext = function(page_id){
		if(angular.isDefined(page_id)){
			var tree = $('#menu').jstree(true);
		    curr = tree.get_selected(false);
		    tree.deselect_all();
		    tree.open_all();
		    var n = tree.get_next_dom(curr);
		    tree.select_node(n);
			//$scope.menuClickListener('page3');
			/*$("#menu").jstree("select_node", "");
			$("#menu").jstree("select_node", "#page3");*/ 
		}
	}

	$scope.menuClickListener = function(pageId){
		var lang = $scope.configs.lang;
		$http.get('app/pages/'+pageId+'.json')
		.success(function(data){
			$scope.page = data;
			$scope.loadContent = function ($scope, $http){
				$http.get('app/data/'+lang+'/'+$scope.page.data)
					.success(function(data){
						$scope.contents = data;
					});
			}
			$scope.loadContent($scope, $http);
		});
	};	
}