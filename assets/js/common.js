jQuery(document).ready(function($){
	//$('.v-scroll').mCustomScrollbar({ theme:"light-1", scrollbarPosition: "outside" });
	$('#menu-wrapper span').on('click',function(){
		$('#vertical-menu-wrapper').toggle('slow');
	});
	$('.menu-close').on('click',function(){
		$('#vertical-menu-wrapper').toggle('slow');
	});
	var content_height = ($(window).height() - $('#header').height() - $('#footer').height());
	$("#content-wrapper").height(content_height-72);
});