jQuery(document).ready(function($){
	
	$('.v-scroll').mCustomScrollbar({ theme:"light-1", scrollbarPosition: "outside",axis:"y"  });

	$('#menu-wrapper span').on('click',function(){
		$('#vertical-menu-wrapper').toggle('slow');
	});
	$('.menu-close').on('click',function(){
		$('#vertical-menu-wrapper').toggle('slow');
	});
	var content_height = ($(window).height() - $('#header').height() - $('#footer').height());
	$("#content-wrapper").height(content_height-72);

	 $('audio').mediaelementplayer({
            videoWidth: '100%',
            videoHeight: '100%',
            audioWidth: '100%',
            features: ['playpause','progress','tracks','volume'],
            videoVolume: 'horizontal'
        });
	 MediaElement('audio-player', {success: function(control) {
		$('.pause').hide();
		$('.audio-off').hide();
		$('.mejs-time-float-corner').hide();
		//control.play(); // auto play
		document.getElementById('audio-play')['onclick'] = function() {
				if (control.paused){
					control.play();
					$('.pause').show();
					$('.play').hide();
					$('.mejs-time-float-corner').show();
				}else{
					control.pause();
					$('.play').show();
					$('.pause').hide();
				}
		};
		document.getElementById('audio-volume')['onclick'] = function() {
			if(control.volume){
				control.volume=0;
			$('.audio-off').show();
			$('.audio-on').hide();
			}else{
				control.volume=1;
				$('.audio-on').show();
				$('.audio-off').hide();
			}	
		};
		document.getElementById('audio-replay')['onclick'] = function() {
			control.load();
			control.play();
		};
	}});

	 //----------------------------- Collapse---------------------------------------------- 

	$(document).on('click', '.panel-heading a', function(){
	
		$('.panel-heading a').removeClass('active');
		$(this).addClass('active');
		$('.panel-collapse').removeClass('in');

	});
	
});