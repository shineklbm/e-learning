jQuery(document).ready(function($){
	$("#btn-start").click(function(){
		courseWindow = window.open("framework.html", "Course" ,'height=768,width=1024');
       	if (window.focus) {courseWindow.focus()}
	});
})