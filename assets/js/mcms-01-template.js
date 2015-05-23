jQuery(document).ready(function($){

  // $('input.myClass').prettyCheckable({
  //   color: 'red'
  // });
// $('#myModal').modal('show');
	 $(".submit-btn").click(function(e){
	 	e.preventdefault();
	 	$('#myModal').modal('show'); 
	});

	 $('#mcms-wrapper div').equalHeights();

});