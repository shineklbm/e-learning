jQuery(document).ready(function($){

   // $('input.myClass').prettyCheckable();
	 $(".submit-btn").click(function(e){
	 	e.preventdefault();
	 	$('#myModal').modal('show'); 
	});

	$('#mcss-wrapper div').equalHeights();
});