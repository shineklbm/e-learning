jQuery(document).ready(function($){
	$("#btn-start").click(function(){
		courseWindow = window.open("framework.html", "Course" ,'height=768,width=1024');
       	if (window.focus) {courseWindow.focus()}
	});
	start_button_position();
	function start_button_position(){
		var window_width = $(window).width();
		var window_height = $(window).height();
		var start_btn_width = $('#btn-start').outerWidth();
		var start_btn_height = $('#btn-start').outerHeight();
		var start_btn_width_position = ((window_width)/2) - ((start_btn_width)/2);
		var start_btn_height_position = (window_height/2) - ((start_btn_height)/2);
		$('#btn-start').css({'left':start_btn_width_position+'px', 'top':start_btn_height_position+'px'});
	}
});