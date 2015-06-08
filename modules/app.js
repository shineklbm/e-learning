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
    Pace.restart();
    return data.instance.toggle_node(data.node);
  });
  menu.bind("loaded.jstree", function (e, data) {
    var snapshot = Defiant.getSnapshot($scope.menus);
    found = JSON.search(snapshot, '//*[contains(default, "true")]');
    var tree = $('#menu').jstree(true);
    tree.select_node(found[0].id);
  });

  $scope.pagePrevious = function(page_id){
    var tree = $('#menu').jstree(true);
    curr = tree.get_selected(false);
    tree.deselect_all();
    var prevpage = $('#'+page_id).prev().attr("id");
	if( prevpage != 'undefined'){
		tree.select_node(prevpage);
	}
  }
  $scope.pageNext = function(page_id){
    var tree = $('#menu').jstree(true);
    curr = tree.get_selected(false);
    tree.deselect_all();
    var nextpage = $('#'+page_id).next().attr("id");
	if( nextpage != 'undefined'){
		tree.select_node(nextpage);
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