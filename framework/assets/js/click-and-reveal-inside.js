jQuery(document).ready(function($){
	$('.show-content-wrapper').hide();

	$('.click-block').on('click', function(){

		$('.show-content-wrapper').show();
		var active_panel = $(this).attr('data-target');
		$(active_panel).show().siblings(".content-panel").hide();
	});

});