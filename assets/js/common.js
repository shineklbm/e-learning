jQuery(document).ready(function($){
	$('#menu-wrapper span').on('click',function(){
		$('#vertical-menu-wrapper').toggle('slow');
	});
	$('#vertical-menu-wrapper .close').on('click',function(){
		$('#vertical-menu-wrapper').toggle('slow');
	});
	var content_height = ($(window).height() - $('#header').height() - $('#footer').height());
	$("#content-wrapper").height(content_height-80);
});