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
    $scope.preLoader = new PxLoader();
    $scope.touch_device = false;
    var deviceAgent = navigator.userAgent.toLowerCase();
    var isTouchDevice = ('ontouchstart' in document.documentElement) || 
                        (deviceAgent.match(/(iphone|ipod|ipad)/) ||
                        deviceAgent.match(/(android)/)  || 
                        deviceAgent.match(/(iemobile)/) || 
                        deviceAgent.match(/iphone/i) || 
                        deviceAgent.match(/ipad/i) || 
                        deviceAgent.match(/ipod/i) || 
                        deviceAgent.match(/blackberry/i) || 
                        deviceAgent.match(/bada/i));
    if (isTouchDevice) {
        $scope.touch_device = true;            
    }

    $http.get('configs/commons.json')
    .success(function(data){
        $scope.configs = data;
        $scope.registerGlobalAssets = function(){
            if(typeof $scope.configs.background_image != 'undefined'){
                /*console.log($scope.configs.background_image);*/
                $scope.preLoader.addImage($scope.configs.path.images+$scope.configs.background_image)
            }
            if(typeof $scope.configs.background_music != 'undefined'){
                /*console.log($scope.configs.background_image);*/
                $scope.preLoader.addAudio($scope.configs.path.audio+$scope.configs.background_music)
            }
        }
        $scope.registerGlobalAssets();
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
    	$("#preloader-overlay").fadeIn();
        $scope.menuClickListener(data);
        return data.instance.toggle_node(data.node);
    });
    menu.bind("loaded.jstree", function (e, data) {
        var snapshot = Defiant.getSnapshot($scope.menus);
        found = JSON.search(snapshot, '//*[contains(default, "true")]');
        var tree = $('#menu').jstree(true);
        $scope.refToMenuTree = tree;
        alert("here:: "+$scope.touch_device);
        if($scope.touch_device){
            $("#preloader-overlay").fadeOut();
            $("#safari-start-overlay").show();
        }else{
            tree.select_node(found[0].id);
        }        
        /*tree.select_node(found[0].id);*/

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
                    $("#page-left-wrapper").removeClass("el-enabled");
                    $("#page-left-wrapper").addClass("el-disabled");
                }
                else{
                    $("#page-left-wrapper").removeClass("el-disabled");
                    $("#page-left-wrapper").addClass("el-enabled");
                }
                if($scope.page.page_index === $scope.total_pages){                    
                    $("#page-right-wrapper").removeClass("el-enabled");
                    $("#page-right-wrapper").addClass("el-disabled");
                }
                else{
                    $("#page-right-wrapper").addClass("el-enabled");
                    $("#page-right-wrapper").removeClass("el-disabled");
                }
                $scope.loadContent = function ($scope, $http){
                    $scope.audioPlayer.pause();
                    $http.get('app/data/'+lang+'/'+$scope.page.data)
                    .success(function(data){
                        $scope.contents = data;
                        /*preload images*/
                        if(typeof $scope.contents.preload != 'undefined'){                            
                            if(typeof $scope.contents.preload.images != 'undefined'){
                                var preload_images = $scope.contents.preload.images;
                                $(preload_images).each(function(index, image){
                                    $scope.preLoader.addImage($scope.configs.app_path.images+image);
                                })
                            }
                            if(typeof $scope.contents.preload.audios != 'undefined'){
                                var preload_audios = $scope.contents.preload.audios;
                                $(preload_audios).each(function(index, audio){
                                    $scope.preLoader.addAudio($scope.configs.app_path.audios+audio);
                                })
                            }
                        }
                        if($scope.contents.audio){
                            $('#audio-volume, #audio-play, #audio-replay, .icon-block, .mejs-time-loaded').removeClass("el-disabled"); 
                            $('#audio-volume, #audio-play, #audio-replay, .icon-block, .mejs-time-loaded').addClass("el-enabled"); 
                            $scope.audioPlayer.pause();           
                            $scope.audioPlayer.setSrc($scope.configs.app_path.audios+$scope.contents.audio);
                            $scope.audioPlayer.load();                  
                            $('.pause').show();
                            $('.play').hide();
                        }
                        else{
                            $('#audio-volume, #audio-play, #audio-replay, .icon-block, .mejs-time-loaded').removeClass("el-enabled");
                            $('#audio-volume, #audio-play, #audio-replay, .icon-block, .mejs-time-loaded').addClass("el-disabled");
                            $('.pause').hide();
                            $('.play').show();  
                            $scope.audioPlayer.pause();                          
                            $scope.audioPlayer.setSrc($scope.configs.path.audio+'blank.mp3');
                        }
                        $scope.preLoader.addCompletionListener(function(){
                            //alert($scope.touch_device);
                            $("#preloader-overlay").fadeOut();
                            /*if($scope.touch_device){
                                $("#safari-start-overlay").show();
                            }else{*/
                                $scope.audioPlayer.play();
                            /*}*/
                        });
                        $scope.preLoader.start();   
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

			audioPlayer.addEventListener('ended', function(e) {
				$('.pause').hide();
                $('.play').show();
                $('#audio-play').removeClass('el-enabled').addClass('el-disabled');
			}, false);

            document.getElementById('audio-play')['onclick'] = function() {
                if($("#audio-player").attr("src") !== "" && !($("#audio-play").hasClass("el-disabled"))){
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
                if($("#audio-player").attr("src") !== "" && !($("#audio-volume").hasClass("el-disabled"))){
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
                if($("#audio-player").attr("src") !== "" && !($("#audio-replay").hasClass("el-disabled"))){
                    $('.play').hide();
                    $('.pause').show();
                    $('#audio-play').removeClass('el-disabled').addClass('el-enabled');
                    audioPlayer.load();
                    audioPlayer.play();
                }
            };
        }
    });
    
    $('.modal').on('show.bs.modal', function(){
        $scope.audioPlayer.pause();
        $(".btn-close-yes").click(function(){
            window.close();
        })
        $(".btn-close-no").click(function(){
            $scope.audioPlayer.play();
        })
    });
    $('#menu-wrapper-stripe').on("show", function(){
        $("#content-overlay").fadeIn();
        $scope.audioPlayer.pause();
    });
    $('#menu-wrapper-stripe').on("hide", function(){
        $("#content-overlay").fadeOut();
        $scope.audioPlayer.play();
    });
    $('#start-course').click(function(){
        $("#safari-start-overlay").fadeOut();
        $("#audio-play").trigger("click");
        $scope.refToMenuTree.select_node(found[0].id);
    });
}