jQuery(document).ready(function($){
	$("#btn-start").click(function(){
		courseWindow = window.open("framework.html", "Course" ,'height=768,width=1024');
       	if (window.focus) {courseWindow.focus()}
	});
	start_button();
	function start_button(){
		var window_width = $(window).outerWidth();
		var window_height = $(window).outerHeight();
		var start_btn_width = $('#btn-start').outerWidth();
		var start_btn_height = $('#btn-start').outerHeight();
		var start_btn_width_position = (window_width/2) - (start_btn_width/2);
		var start_btn_height_position = (window_height/2) - (start_btn_height/2);
		$('#btn-start').css({'left':start_btn_width_position+'px', 'top':start_btn_height_position+'px'});

		// alert("window_width:"+window_width+"start_btn_width:"+start_btn_width+"start_btn_position:"+start_btn_position );
		// alert(start_btn);
	}
});