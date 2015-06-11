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
              scope.custom_classes = attrs.classes;
              scope.text_list = scope.$parent.contents[attrs.datasource];
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
      var snapshot = Defiant.getSnapshot($scope.menus);
    	found = JSON.search(snapshot, '//*[contains(parent, "#")]');
		  $scope.page_count = $scope.menus.core.data.length - found.length;
      $scope.menuOrganizer($scope.menus.core.data);
    });
  $scope.menuOrganizer = function(menu){
    var menu_items = new Array();
    var snapshot = Defiant.getSnapshot($scope.menus);
    found = JSON.search(snapshot, '//*[contains(parent, "#")]');
    if(found.length > 0){
	    $(found).each(function( index, item ){
	      menu_items[index] = item;
	      pattern = '//*[contains(parent,"' + item.id + '")]';
	      children = JSON.search(snapshot, pattern);
	      if(children.length > 0){
	        menu_items[index]['children'] = children;       
	      }
	    });
		$(menu_items).each(function(index, item){
	    	if(item.children.length > 0){
	    		$(item.children).each(function(child_index, child_item){
	    			var snapshot = Defiant.getSnapshot($scope.menus);
	    			pattern = '//*[contains(parent,"' + child_item.id + '")]';
	    			children_level2 = JSON.search(snapshot, pattern);
	    			if(children_level2.length > 0)
	    			{
						menu_items[index]['children'][child_index]['children'] = children_level2;
	    			}
	    		})
	    	}
	    });
	}
	if(menu_items.length > 0)
		$scope.menu_hierarchy = menu_items;
  }
  var menu = $("#menu").bind("select_node.jstree", function (e, data) {
	$scope.menuClickListener(data);
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

  $scope.menuClickListener = function(data){
  	if(data.node.parent != "#"){
	    var lang = $scope.configs.lang;
	    $http.get('app/pages/'+data.node.id+'.json')
	    .success(function(data){
	      $scope.page = data;
	      $scope.loadContent = function ($scope, $http){
	        $http.get('app/data/'+lang+'/'+$scope.page.data)
	          .success(function(data){
	            $scope.contents = data;
	            Pace.restart();
	            if($scope.contents.audio){
	              $scope.audioPlayer.pause();           
	              $scope.audioPlayer.setSrc($scope.contents.audio);
	              $scope.audioPlayer.load();
	              $scope.audioPlayer.play();
	            }
	            else{
	              $scope.audioPlayer.pause();
	              $scope.audioPlayer.setCurrentTime(0.0);
	            }
	          });
	      }
	      $scope.loadContent($scope, $http);
	    });
	}
  };

  // ------------------------------------- Audio ------------------------------------------
  $scope.audioPlayer = new MediaElementPlayer('#audio-player', {
            audioWidth: '100%',
            features: ['playpause','progress','tracks','volume','fullscreen'],
            success: function(audioPlayer, domNode) {
            $('.play').hide();
            $('.pause').show();
            $('.audio-off').hide();
            //$('.mejs-time-float-corner').hide();
            //audioPlayer.play(); // auto play
            document.getElementById('audio-play')['onclick'] = function() {
                if (audioPlayer.paused){
                  audioPlayer.play();
                  $('.pause').show();
                  $('.play').hide();
                  //$('.mejs-time-float-corner').show();
                }else{
                  audioPlayer.pause();
                  $('.play').show();
                  $('.pause').hide();
                }
            };
            document.getElementById('audio-volume')['onclick'] = function() {
              if(audioPlayer.volume){
				audioPlayer.volume=0;
				$('.audio-off').show();
				$('.audio-on').hide();
              }else{
                audioPlayer.volume=1;
                $('.audio-on').show();
                $('.audio-off').hide();
              } 
            };
            document.getElementById('audio-replay')['onclick'] = function() {
              audioPlayer.load();
              audioPlayer.play();
            };
          }});
}