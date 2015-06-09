jQuery(document).ready(function($){
    $('.v-scroll').mCustomScrollbar({ theme:"light-1", scrollbarPosition: "inside",axis:"y"  });
// -------------------------------------- Menu  Stripe -----------------------------------------

	$('.icon-menu-close').hide();
	
	$('.icon-menu-main').on('click',function(){
		$('#menu-wrapper-stripe').toggle();
		$('.icon-menu-close').show();
		$('.icon-menu-main').hide();
	});
	$('.icon-menu-close').on('click',function(){
		$('#menu-wrapper-stripe').toggle();
		$('.icon-menu-close').hide();
		$('.icon-menu-main').show();
		$('#vertical-menu-wrapper').hide();
	});
// -------------------------------------- Vertical Menu ----------------------------------------
	$( window ).resize(function() {
		 $('#vertical-menu-wrapper').hide();
	});
	$('#stripe-menu').on('click',function(){
		var stripe_menu_height =($('#menu-wrapper-stripe' ).height())+30;
 		 $('#vertical-menu-wrapper').css("top", stripe_menu_height+"px");
		$('#vertical-menu-wrapper').toggle();
		
	});
	
	$('.menu-close').on('click',function(){
		$('#vertical-menu-wrapper').toggle();
	});

// -------------------------------- Content Height -----------------------------------------

	var content_height = ($(window).height() - $('#header').height() - $('#footer').height()-119);
	$("#content").height(content_height);

//----------------------------------------- Collapse---------------------------------------------- 

	$(document).on('click', '.panel-heading a', function(){
	
		$('.panel-heading a').removeClass('active');
		$(this).addClass('active');
		$('.panel-collapse').removeClass('in');
	});
 
});