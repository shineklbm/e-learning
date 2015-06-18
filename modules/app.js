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
      $('#menu').jstree("deselect_all");
      $('#menu').jstree('open_all');

      $(jstree_json).each(function(index, value){
          if(value.id == page_id)
          {
            for(i = index-1; i > 0 ; i--){
              if(!jstree_json[i].data.has_children){
                previous_element = jstree_json[i];
                break;
              }
            }
            return false;
          }
      });
      //console.log(previous_element.id);
      if(previous_element.id){
        tree.select_node(previous_element.id);
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
      $('#menu').jstree("deselect_all");
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
        tree.select_node(next_element.id);
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
    
    if(data.node.parent != "#" && current_item != data.node.id){
      var lang = $scope.configs.lang;
      $http.get('app/pages/'+data.node.id+'.json')
        .success(function(data){
          $scope.page = data;
          $scope.page.page_index = $scope.page_index[$scope.page.page_id];
          var page_pogress = 0;
          page_pogress =($scope.page.page_index*100)/$scope.total_pages;
          $("#page-progress .progress-bar").css("width",page_pogress+"%");
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
                  $("#footer-content #left-block label").css("cursor", "pointer");
                  $('#audio-volume').css("cursor", "pointer");
                  $('#audio-replay').css("cursor", "pointer");
                  $('#audio-play').css("cursor", "pointer");
                  $('.icon-block').css("cursor", "pointer");
                  $('.mejs-time-loaded').css("cursor", "pointer");
                  $scope.audioPlayer.pause();           
                  $scope.audioPlayer.setSrc($scope.contents.audio);
                  $scope.audioPlayer.load();                  
                  $('.pause').show();
                  $('.play').hide();
                }
                else{
                  $("#footer-content #left-block label").css("cursor", "default");
                  $('#audio-volume').css("cursor", "default");
                  $('#audio-replay').css("cursor", "default");
                  $('#audio-play').css("cursor", "default");
                  $('.icon-block').css("cursor", "default");
                  $('.mejs-time-loaded').css("cursor", "default");
                  $('.pause').hide();
                  $('.play').show();
                  $scope.audioPlayer.setCurrentTime(0);
                  $scope.audioPlayer.setCurrentRail();       
                  $scope.audioPlayer.setSrc('');
                }
                Pace.on('hide', function(){
                  $scope.audioPlayer.play();
                })
              });
          }
          $scope.loadContent($scope, $http);
        });
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
                if($("#audio-player").attr("src") !== ""){
                  if (audioPlayer.paused){
                    audioPlayer.play();
                    $('.pause').show();
                    $('.play').hide();
                  }else{
                    audioPlayer.pause();
                    $('.play').show();
                    $('.pause').hide();
                  }
                }
            };
            document.getElementById('audio-volume')['onclick'] = function() {
              if($("#audio-player").attr("src") !== ""){
                if(audioPlayer.volume){
          				audioPlayer.volume = 0;
          				$('.audio-off').show();
          				$('.audio-on').hide();
                }else{
                  audioPlayer.volume = 1;
                  $('.audio-on').show();
                  $('.audio-off').hide();
                }
              }
            };
            document.getElementById('audio-replay')['onclick'] = function() {
              if($("#audio-player").attr("src") !== ""){
                audioPlayer.load();
                audioPlayer.play();
              }
            };
          }});
  $('.modal').on('show.bs.modal', function(){
    $scope.audioPlayer.pause();
    $(".btn-close-yes").click(function(){
      window.close();
    })
    $(".btn-close-no").click(function(){
      $scope.audioPlayer.play();
    })
  });
}