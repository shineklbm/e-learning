jQuery(document).ready(function($){	
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
	$(document).on('click','#menu ul li.jstree-open ul.jstree-children li a.jstree-clicked',function(){
		$('#menu-wrapper-stripe').hide();
		$('#vertical-menu-wrapper').hide();
		$('.icon-menu-close').hide();
		$('.icon-menu-main').show();
	});
	resizeWindow();
	function resizeWindow(){
		var window_width = $(window).width();
		var deduct_padding = 12;
		var content_height = ($(window).height() - $('#header').height() - $('#footer').height() - deduct_padding);
		$("#content").height(content_height);
	}
	$(window).resize(function(){
		resizeWindow();
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
});