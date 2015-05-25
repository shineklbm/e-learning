jQuery(document).ready(function($){
	//$('.v-scroll').mCustomScrollbar({ theme:"light-1", scrollbarPosition: "outside" });

	$('#menu-wrapper span').on('click',function(){
		$('#vertical-menu-wrapper').toggle('slow');
	});
	$('.close-btn').on('click',function(){
		$('#vertical-menu-wrapper').toggle('slow');
	});
});