jQuery(document).ready(function($){
	$("#content-overlay").hide();
	$('.v-scroll').mCustomScrollbar({ theme:"light-1", scrollbarPosition: "outside",axis:"y"  });
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
	// $( window ).resize(function() {
	// 	 $('#vertical-menu-wrapper').hide();
	// });
	$('#stripe-menu').on('click',function(){
		var stripe_menu_height =($('#menu-wrapper-stripe' ).height())+30;
 		 $('#vertical-menu-wrapper').css("top", stripe_menu_height+"px");
		$('#vertical-menu-wrapper').toggle();
		
	});
	$('.menu-close').on('click',function(){
		$('#vertical-menu-wrapper').toggle();
	});
	$(document).on('click','#menu ul li.jstree-open ul.jstree-children li a.jstree-clicked',function(){
		$('#menu-wrapper-stripe').hide();
		$('#vertical-menu-wrapper').hide();
		$('.icon-menu-close').hide();
		$('.icon-menu-main').show();
	});
	resizeWindow();
	function resizeWindow(){
		var window_width = $(window).width();
		$("#inner-wrapper").height($(window).height()); 
		var content_height = ($(window).height() - $('#header').outerHeight(true) - $('#footer').height());
		$("#content").height(content_height);
		$("#content-overlay, #safari-start-overlay").height($(window).height());
		$("#preloader-overlay").height($(window).height());
		var start_course_top = ($(window).height()/2) - ($('#start-course').height()/2)
		$('#start-course').css('margin-top', start_course_top);
		$("#preloader-overlay").css("padding-top", (($(window).height()/2)-32));
	}
	$(window).resize(function(){
		//alert('resize');
		resizeWindow();
		verticalMenuHeight();

	});
	/*$(window).orientationchange(function(){
		alert('orientationchange');
		resizeWindow();
		verticalMenuHeight();

	});
*/
	$( window ).on( "orientationchange", function( event ) {
		//alert('orientationchange');
		resizeWindow();
		verticalMenuHeight();
	});

	$(document).on('click', '.panel-heading a', function(){	
		$('.panel-heading a').removeClass('active');
		$(this).addClass('active');
		$('.panel-collapse').removeClass('in');
	});
	$(function() {
		function reposition() {
		    var modal = $(this),
		        dialog = modal.find('.modal-dialog');
		    modal.css('display', 'block');
		    dialog.css("margin-top", Math.max(0, ($(window).height() - dialog.height()) / 2));
		}
		$('.modal').on('show.bs.modal', reposition);
		$(window).on('resize', function() {
		    $('.modal:visible').each(reposition);
		});
	});
	$.each(['show', 'hide'], function (i, ev) {
		var el = $.fn[ev];
		$.fn[ev] = function () {
			this.trigger(ev);
			return el.apply(this, arguments);
		};
	});
	verticalMenuHeight();
	function verticalMenuHeight(){
		var vertical_menu_outer_height = ($('#content').outerHeight()) - ($('#menu-wrapper-stripe').outerHeight());
		$('#vertical-menu-wrapper').css('height',vertical_menu_outer_height+'px');
		//$('#vertical-menu-wrapper').css('height','auto');
		var vertical_menu_height = $('#vertical-menu-wrapper').height();
		var menu_heading_height =$('#menu-heading').height(); 
		var outer_height = (vertical_menu_outer_height -vertical_menu_height)+menu_heading_height;
		var menu_container_height = (vertical_menu_outer_height)-(outer_height);
		 $('#menu-container').css('height',menu_container_height+'px');
	}
});