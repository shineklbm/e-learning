jQuery(document).ready(function($){
	$('#menu-wrapper span').on('click',function(){
		$('#vertical-menu-wrapper').toggle('slow');
	});
	$('.close-btn').on('click',function(){
		$('#vertical-menu-wrapper').toggle('slow');
	});
	var content_height = ($(window).height() - $('#header').height() - $('#footer').height());
	$("#content-wrapper").height(content_height-20);
});