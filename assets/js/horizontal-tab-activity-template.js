jQuery(document).ready(function($){

	$('#horrizontal-collapse-wrapper > .panel').on('show.bs.collapse', function (e) {
    	$(this).find('.panel-heading').addClass("active-panel");
	});
	$('#horrizontal-collapse-wrapper > .panel').on('hide.bs.collapse', function (e) {
    	$(this).find('.panel-heading').removeClass("active-panel active");
	});
});