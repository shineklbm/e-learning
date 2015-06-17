angular.module("eLearning", []);

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
		  var total_pages = $scope.menus.core.data.length - found.length;
      if(total_pages < 10){
        $scope.total_pages = '0'+total_pages;
      }
      else{
        $scope.total_pages = total_pages;
      }
    });
  var menu = $("#menu").bind("select_node.jstree", function (e, data) {    
  	$scope.menuClickListener(data);
  	return data.instance.toggle_node(data.node);
  });
  menu.bind("loaded.jstree", function (e, data) {
    var snapshot = Defiant.getSnapshot($scope.menus);
    found = JSON.search(snapshot, '//*[contains(default, "true")]');
    var tree = $('#menu').jstree(true);
    tree.select_node(found[0].id);

    var jstree_json = $("#menu").jstree(true).get_json('#', { 'flat': true });
    var counter = 0;

    var page_index = new Array();
    /**
    Previous Click Handler
    */
    $("#page-left-wrapper").click(function(){
      var previous_element = {};
      var page_id = $scope.page.page_id;
    
      var tree = $('#menu').jstree(true);
      $('#menu').jstree('open_all');
      $(jstree_json).each(function(index, value){
          if(value.id == page_id)
          {
            for(i = index-1; i >= 0 ; i--){
              if(!jstree_json[i].data.has_children){
                previous_element = jstree_json[i];
                break;
              }
            }
            return false;
          }
      });
      if(previous_element.id){
        $scope.menuClickListener(previous_element, true);
      }
    });
    /**
    Previous Click Handler
    */

    /**
    Next Click Handler
    */
    $("#page-right-wrapper").click(function(){
      var next_element = {};
      var page_id = $scope.page.page_id;
      var tree = $('#menu').jstree(true);
      $('#menu').jstree('open_all');

      $(jstree_json).each(function(index, value){
          if(value.id == page_id)
          {
            for(i = index+1; i < jstree_json.length ; i++){
              if(!jstree_json[i].data.has_children){
                next_element = jstree_json[i];
                break;
              }
            }
            return false;
          }
      });
      if(next_element.id){
        $scope.menuClickListener(next_element, true);
      }
    });
    /**
    Next Click Handler
    */
    $(jstree_json).each(function(key, value){
      if(value.data.has_children !== true){
        counter++;
        if(counter < 10)
          page_index[value.id] = '0'+counter;
        else
          page_index[value.id] = counter;
      }
    });
    $scope.page_index = page_index;
  });
  $scope.menuClickListener = function(data, custom){
    var current_item = false;
    if(typeof $scope.page != "undefined"){
      current_item = $scope.page.page_id;
    }
   // console.log(current_item);

    if(custom !== true){
    	if(data.node.parent != "#" && current_item != data.node.id){
  	    var lang = $scope.configs.lang;
  	    $http.get('app/pages/'+data.node.id+'.json')
  	    .success(function(data){
  	      $scope.page = data;
          $scope.page.page_index = $scope.page_index[$scope.page.page_id];
          if($scope.page.page_index == "01"){
            $("#page-left-wrapper").css({'color':'#ccc','cursor':'default'});
          }
  	      $scope.loadContent = function ($scope, $http){
            /*if($scope.page.page_index ==01){
              $("#page-left-wrapper").css({'color':'#ccc','cursor':'default'});
            }
            else{
                $("#page-left-wrapper").css('color','#333');
              }*/
            
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
                  $('.play').show();
                  $('.pause').hide();
                  $scope.audioPlayer.pause();
                  $scope.audioPlayer.setCurrentTime(0.0);
                }
  	          });
  	      }
  	      $scope.loadContent($scope, $http);
  	    });
      }
    }
    else{
      if(data.parent != "#" && current_item != data.id){
        var lang = $scope.configs.lang;
        $http.get('app/pages/'+data.id+'.json')
          .success(function(data){
            $scope.page = data;
            $scope.page.page_index = $scope.page_index[$scope.page.page_id];
            if($scope.page.page_index == "01"){
              $("#page-left-wrapper").css({'color':'#ccc','cursor':'default'});
            }
            else{
              $("#page-left-wrapper").css({'color':'#333','cursor':'pointer'});
            }
            if($scope.page.page_index === $scope.total_pages){
              $("#page-right-wrapper").css({'color':'#ccc','cursor':'default'});
            }
            else{
              $("#page-right-wrapper").css({'color':'#333','cursor':'pointer'});
            }
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
                    $('.pause').show();
                    $('.play').hide();
                  }
                  else{                    
                    $('.pause').hide();
                    $('.play').show();
                    $scope.audioPlayer.setCurrentRail();       
                    $scope.audioPlayer.setSrc('');
                  }
                });
            }
            $scope.loadContent($scope, $http);
          });
      }
    }
  };

  $scope.audioPlayer = new MediaElementPlayer('#audio-player', {
            audioWidth: '100%',
            features: ['playpause','progress','tracks','volume','fullscreen'],
            type: 'audio/mp3',
            success: function(audioPlayer, domNode) {
            $('.play').hide();
            $('.pause').show();
            $('.audio-off').hide();
            document.getElementById('audio-play')['onclick'] = function() {
                if (audioPlayer.paused){
                  audioPlayer.play();
                  $('.pause').show();
                  $('.play').hide();
                }else{
                  audioPlayer.pause();
                  $('.play').show();
                  $('.pause').hide();
                }
            };
            document.getElementById('audio-volume')['onclick'] = function() {
              if(audioPlayer.volume){
        				audioPlayer.volume = 0;
        				$('.audio-off').show();
        				$('.audio-on').hide();
              }else{
                audioPlayer.volume = 1;
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