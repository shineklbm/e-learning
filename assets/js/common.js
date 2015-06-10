jQuery(document).ready(function($){
	$(".btn-close-yes").click(function(){
		//alert();
		window.close();
	})
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
	$(document).on('click','#menu ul li.jstree-open ul.jstree-children li a.jstree-clicked ',function(){
		$('#menu-wrapper-stripe').hide();
		$('#vertical-menu-wrapper').hide();
		$('.icon-menu-close').hide();
		$('.icon-menu-main').show();
	});

// -------------------------------- Content Height -----------------------------------------
	resizeWindow();
	function resizeWindow(){	
		var content_height = ($(window).height() - $('#header').height() - $('#footer').height() - 13);
		$("#content").height(content_height);
	}
	$(window).resize(function(){
		resizeWindow();
	});
//----------------------------------------- Collapse---------------------------------------------- 

	$(document).on('click', '.panel-heading a', function(){
	
		$('.panel-heading a').removeClass('active');
		$(this).addClass('active');
		$('.panel-collapse').removeClass('in');
	});
 
});