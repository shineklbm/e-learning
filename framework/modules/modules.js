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
});

function rootController($scope, $http){
    $scope.preLoader = new PxLoader();
    $scope.touch_device = false;
    $scope.framework_loaded = false;
    $scope.menu = new Object();
    $scope.page_status = [];
    $scope.previous_page;

    /**
    +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    Generic Fucntion for retrive a single element with a 
    matching key starts here
    +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    */
    $scope.findElement = function(arr, key, value) {
            for (var d = 0, len = arr.length; d < len; d += 1) {
                if (arr[d][key] === value) {
                    return arr[d];
                }
            }
        }
    /**
    +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    The findElement function ends here
    +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    */

    /**
    +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    Generic Fucntion for retrive an array with a matching key
    starts here
    +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    */
    $scope.findElements = function(arr, key, value) {
            var elements = new Array();
            var count = 0;
            $(arr).each(function(index, val){
                if(val[key] == value)
                {
                    elements[count] = value;
                    count++;
                }
            })
            return elements;
        }
    /**
    +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    Generic Fucntion findElements ends here
    +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    */

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
        $('#audio-volume').hide();
        $('#logo-wrapper span').css('display','none');
    }

    /**
    +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    Load Framework Configs Ends Here
    +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    */
    $scope.loadFrameworkConfigs = function(){
        $http.get('framework/configs/commons.json')
        .success(function(data){
            $scope.configs = data;
            $scope.registerGlobalAssets = function(){
                if(typeof $scope.configs.background_image != 'undefined'){
                    $scope.preLoader.addImage($scope.configs.path.images+$scope.configs.background_image)
                }
                if(typeof $scope.configs.background_music != 'undefined'){
                    $scope.preLoader.addAudio($scope.configs.path.audio+$scope.configs.background_music)
                }
            }
            $scope.loadMenuConfigs();
        });
    }    
    $scope.loadFrameworkConfigs();
    /**
    +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    Load Framework Configs Ends Here
    +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    */

    /**
    +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    Load Menu Configs Ends Here
    +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    */

    $scope.loadMenuConfigs = function(){
        $http.get($scope.configs.course_path.config+'menu.json')
        .success(function(data){
            $scope.menus = data;
            $scope.menu = $('#menu').jstree(data);
            found = $scope.findElements($scope.menus.core.data, 'parent', '#' );


            var total_pages = $scope.menus.core.data.length - found.length;
            if(total_pages < 10){
                $scope.total_pages = '0'+total_pages;
            }
            else{
                $scope.total_pages = total_pages;
            }
        });

        $scope.registerMenuFunctions();
    }
    /**
    +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    Load Menu Configs Ends Here
    +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    */

    /**
    +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    Register Menu Function Starts Here
    +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    */
    $scope.registerMenuFunctions = function(){
        /**
        +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        Defines all menu related functions
        +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        */
        $('#menu').bind("loaded.jstree", function (e, data) {
            var tree = $('#menu').jstree(true);
            $scope.refToMenuTree = tree;

            found = $scope.findElement($scope.menus.core.data, 'default', 'true');           

            var jstree_json = tree.get_json('#', { 'flat': true });
            var counter = 0;
            var page_index = new Array();

            /**
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            Menu Select Handler Starts Here
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            */
            $('#menu').bind("select_node.jstree", function (e, data) {
                var current_item = false;
                if(typeof $scope.page != "undefined"){
                    current_item = $scope.page.page_id;
                }
                if(data.node.parent != "#" &&  current_item != data.node.id){
                    $("#preloader-overlay").fadeIn();
                }
                $scope.menuClickListener(data);
                return data.instance.toggle_node(data.node);
            });
            /**
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            Menu Select Handler Starts Here
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            */

            $.jstree.reference('#menu').select_node(found.id);

            /**
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            Menu Changed Handler Starts Here
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            */
            $('#menu').on("changed.jstree", function (e, data) {
                $('#menu li a').removeClass('current-page-parent');
                if(typeof $scope.menus !== 'undefined' && typeof $scope.page !== 'undefined'){
                    var current_page_menu = $scope.findElement($scope.menus.core.data,  'id', $scope.page.page_id);
                    var linknode = $("#"+current_page_menu.parent).find('a').first();
                    $(linknode).addClass('current-page-parent');
                }
                if(typeof data.node !== 'undefined' && data.node.parent == "#"){
                    if(typeof $scope.page != "undefined"){                
                        $('#'+$scope.page.page_id).addClass("current-page");                
                    }
                }
            });
            /**
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            Menu Changed Handler Starts Here
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            */

            /**
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            Previous Click Handler Starts Here
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            */
            $("#page-left-wrapper").click(function(){
                var previous_element = {};
                var page_id = $scope.page.page_id;
                $scope.menu.jstree("deselect_all");
                $scope.menu.jstree('open_all');

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
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            Previous Click Handler Ends Here
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            */


            /**
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            Next Click Handler Starts Here
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            */
            $("#page-right-wrapper").click(function(){
                var next_element = {};
                var page_id = $scope.page.page_id;
                $scope.menu.jstree("deselect_all");
                $scope.menu.jstree('open_all');

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
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            Next Click Handler Ends Here
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            */

            /**
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            Page Index Generation Starts Here
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
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
            /**
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            Next Click Handler Ends Here
            +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            */
        });        
        $('#stripe-menu').on('click',function(){
            $('#menu li').removeClass('current-page');
        });
    }
    /**
    +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    Listener function to load the page starts here
    +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    */
    $scope.menuClickListener = function(data, custom){

        $scope.pausedAudio = new Object();

        var current_item = false;
        if(typeof $scope.page != "undefined"){
            current_item = $scope.page.page_id;
        }

        if(data.node.parent != "#" && current_item != data.node.id){
            var lang = $scope.configs.lang;
            $http.get('course/pages/'+data.node.id+'.json')
            .success(function(data){
                $scope.page = data;
                $('#'+$scope.page.page_id).addClass('current-page');
                $scope.page.page_index = $scope.page_index[$scope.page.page_id];

                $scope.page_status[$scope.page.page_id] = '1';

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
                    $http.get('course/data/'+lang+'/'+$scope.page.data)
                    .success(function(data){
                        $scope.contents = data;
                        $('#menu li a').removeClass('current-page-parent');
                        if(typeof $scope.menus !== 'undefined' && typeof $scope.page !== 'undefined'){
                            var current_page_menu = $scope.findElement($scope.menus.core.data,  'id', $scope.page.page_id);
                            var linknode = $("#"+current_page_menu.parent).find('a').first();
                            $(linknode).addClass('current-page-parent');
                        }

                        if(typeof $scope.contents.preload != 'undefined'){                            
                            if(typeof $scope.contents.preload.images != 'undefined'){
                                var preload_images = $scope.contents.preload.images;
                                $(preload_images).each(function(index, image){
                                    $scope.preLoader.addImage($scope.configs.course_path.images+image);
                                })
                            }
                            if(typeof $scope.contents.preload.audios != 'undefined'){
                                var preload_audios = $scope.contents.preload.audios;
                                $(preload_audios).each(function(index, audio){
                                    $scope.preLoader.addAudio($scope.configs.course_path.audios+audio);
                                })
                            }
                        }
                        if($scope.contents.audio){
                            $('#audio-volume, #audio-play, #audio-replay, .mejs-time-total').removeClass("el-disabled").addClass("el-enabled"); 
                            $scope.audioPlayer.pause();           
                            $scope.audioPlayer.setSrc($scope.configs.course_path.audios+$scope.contents.audio);
                            $scope.audioPlayer.load();                  
                            $('.pause').show();
                            $('.play').hide();
                            $('#click-me').hide();
                            $('#audio-replay').removeClass("el-enabled").addClass("el-disabled");
                        }
                        else{
                            $('#audio-volume, #audio-play, #audio-replay, .mejs-time-total').removeClass("el-enabled").addClass("el-disabled");
                            $('.pause').hide();
                            $('.play').show();  
                            $scope.audioPlayer.pause();                          
                            $scope.audioPlayer.setSrc($scope.configs.path.audio+'blank.mp3');
                            $('#click-me').show();
                        }
                        $scope.preLoader.addCompletionListener(function(){
                            $("#preloader-overlay").fadeOut();
                            if($scope.touch_device && $scope.framework_loaded == false){
                                $("#safari-start-overlay").show();                                
                            }else{
                                $scope.audioPlayer.play();
                            }
                            $scope.framework_loaded = true;
                        });
                        $scope.preLoader.start();   
                    });
                }
                $scope.loadContent($scope, $http);
            });
        }
    };
    /**
    +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    Listener function to load the page ends here
    +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    */

    /**
    +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    Audio Player Objects Declaration Starts Here
    +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    */
    $scope.audioPlayer = new MediaElementPlayer('#audio-player', {
        audioWidth: '100%',
        features: ['playpause','progress','tracks','volume','fullscreen'],
        type: 'audio/mp3',
        success: function(audioPlayer, domNode) {
            $('.play').hide();
            $('.pause').show();
            $('.audio-off').hide();
            $('#click-me').hide();
            $('#audio-replay').removeClass("el-enabled").addClass("el-disabled");
			audioPlayer.addEventListener('ended', function(e) {
				$('.pause').hide();
                $('.play').show();
                $('#click-me').show();
                $('#audio-play').removeClass('el-enabled').addClass('el-disabled');
                $('#audio-volume').removeClass('el-enabled').addClass('el-disabled');
                $('.mejs-time-total').removeClass("el-enabled").addClass("el-disabled");
                if($scope.contents.audio){
                    $('#audio-replay').removeClass("el-disabled").addClass("el-enabled");
                }
               
			}, false);
            document.getElementById('audio-play')['onclick'] = function() {
                if($("#audio-player").attr("src") !== "" && !($("#audio-play").hasClass("el-disabled"))){
                    if (audioPlayer.paused){
                        audioPlayer.play();
                        $('.pause').show();
                        $('.play').hide();
                        $('#click-me').hide();
                        $('#audio-replay').removeClass("el-enabled").addClass("el-disabled");
                    }else{
                        audioPlayer.pause();
                        $('.play').show();
                        $('.pause').hide();
                        $('#click-me').hide();
                        $scope.pausedAudio.track_src = $('#audio-player').attr("src");
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
                    $('#audio-volume').removeClass('el-disabled').addClass('el-enabled');
                    $('.mejs-time-total').removeClass("el-disabled").addClass("el-enabled");
                    $('#audio-replay').removeClass("el-enabled").addClass("el-disabled");
                    audioPlayer.load();
                    audioPlayer.play();
                    $('#click-me').hide();
                }
            };
        }
    });
    /**
    +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    Audio Player Objects Declaration Ends Here
    +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    */

    /**
    +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    Misc Functions
    +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    */
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
        $('.pause').hide();
        $('.play').show();
        $scope.audioPlayer.pause();
    });
    $('#menu-wrapper-stripe').on("hide", function(){
        $("#content-overlay").fadeOut();
        if(typeof $scope.pausedAudio.track_src == 'undefined'){
            $scope.audioPlayer.play();
            $('.play').hide();
            $('.pause').show();
        }           
    });
    $('#start-course').click(function(){
        $("#safari-start-overlay").fadeOut();
        $("#audio-play").trigger("click");
        $scope.refToMenuTree.select_node(found[0].id);
    });
    /**
    +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    Misc Functions
    +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    */
}