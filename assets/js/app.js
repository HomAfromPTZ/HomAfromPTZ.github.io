(function($) {
	"use strict";


	// ==============================
	// Check scrollbar width
	// ==============================
	var widthContentA = $("#scroll_bar_check_A").width(),
		widthContentB = $("#scroll_bar_check_B").width();

	var scrollBarWidht =  widthContentA - widthContentB;
	$("#scroll_bar_check_A").css("display","none");


	// ==============================
	// Animations
	// ==============================
	$.fn.animated = function(inEffect) {
		$(this).each(function() {
			var ths = $(this);
			ths.css("opacity", "0")
				.addClass("animated")
				.waypoint(function(dir) {
					if (dir === "down") {
						ths.addClass(inEffect).css("opacity", "1");
					}
				},
				{
					offset: "90%"
				});
		});
	};

	$("header .svg-heading, .talks .svg-heading, .talks .testimonial, .portfolio-slider__module>div, .about-me__skills>div").animated("fadeInUp");
	$(".article").animated("fadeIn");


	// ==============================
	// Axis Parallax
	// ==============================
	$("#scene").parallax({
		scalarX: 3,
		scalarY: 3,
		frictionX: 0.5,
		frictionY: 0.5
	});


	// ==============================
	// Login card flip
	// ==============================
	$(".login-button").click(function() {
		$("body").addClass("card_flipped");
	});

	$("#unflip-card").click(function() {
		$("body").removeClass("card_flipped");
	});



	// ==============================
	// Main menu
	// ==============================
	$("#menu-toggle").click(function(){
		$(this).add(".main-menu").toggleClass("active");
	});

	$(".main-menu__item").each(function(index) {
		$(this).css("transition-delay", 0.3+0.1*index + "s");
	});


	// ==============================
	// Buttons
	// ==============================
	$("button.go-down").click(function(){
		var go = $(this).data("link");
		$("html, body").stop().animate({
			scrollTop: $(go).offset().top
		}, 700, "swing");
	});

	$("button.go-up").click(function(){
		$("html, body").stop().animate({
			scrollTop: 0
		}, 700, "swing");
	});

	$(".blog-navigation__toggle").click(function(){
		$(".blog-navigation").toggleClass("active");
	});


	// ==============================
	// SCROLL EVENTS
	// ==============================

	// SCROLL NAVIGATION BEGIN
	var lastId,
		menu = $(".blog-navigation"),
		menuItems = menu.find("li a"),
		scrollItems = menuItems.map(function(){
			var item = $($(this).attr("href"));
			if (item.length) return item;
		});

	// Bind click handler to menu items
	// so we can get a fancy scroll animation
	menuItems.click(function(e){
		var href = $(this).attr("href"),
			offsetTop = (href === "#") ? 0 : $(href).offset().top-60;
		
		$("html, body").stop().animate({ 
			scrollTop: offsetTop
		}, 700, "swing");
		e.preventDefault();
	});

	// Bind to scroll
	if($(".blog-navigation").offset()){
		$(window).scroll(function() {
			// Get container scroll position
			var fromTop = $(this).scrollTop(),
				blogNavOffset = $(".blog-navigation").offset().top,
				blogNavLimit = $(".footer__wrapper").offset().top - $(".blog-navigation__wrapper").outerHeight();

			// Get id of current scroll item
			var cur = scrollItems.map(function(){
				if ($(this).offset().top < fromTop+144)
					return this;
			});
			// Get the id of the current element
			cur = cur[cur.length-1];
			var id = cur && cur.length ? cur[0].id : "";

			if (lastId !== id) {
				lastId = id;
				// Set/remove active class
				menuItems
				.removeClass("active")
				.filter("[href=#"+id+"]")
				.addClass("active");
			}

			if(fromTop >= blogNavLimit && $(window).width() > (768 - scrollBarWidht)) {
				$(".blog-navigation__wrapper").css({"position":"absolute", "top":blogNavLimit + "px"});
			} else if (fromTop >= blogNavOffset && $(window).width() > (768 - scrollBarWidht)) {
				$(".blog-navigation__wrapper").css({"position":"fixed", "top":0});
				$(".blog-navigation__wrapper").addClass("nav-fixed");
			} else {
				$(".blog-navigation__wrapper").css({"position":"relative"});
				$(".blog-navigation__wrapper").removeClass("nav-fixed");
			}

		});
	}
	// SCROLL NAVIGATION END


	// ==============================
	// RESIZE EVENTS
	// ==============================
	if($(".blog-navigation").offset()){
		$(window).resize(function() {
			if($(window).width() <= (768 - scrollBarWidht)){
				$(".blog-navigation__wrapper").removeClass("nav-fixed");
				$(".blog-navigation__wrapper").css({"position":"relative"});
			} else {
				if($("body").scrollTop() >= $(".blog").offset().top){
					$(".blog-navigation__wrapper").css({"position":"fixed", "top":0});
					$(".blog-navigation__wrapper").addClass("nav-fixed");
				}
			}
		});
	}


	$(window).resize(function() {
		// Testimonials section bg size
		if( $(window).width()>2000){
			$(".talks, .contact-form__bg").css("background-size", $(window).width() + "px");
		}
	});


	// ==============================
	// Fake preloader
	// ==============================
	// if($(".flip-card").length){
	// 	setTimeout(function(){
	// 		$("#preloader")
	// 			.delay(200)
	// 			.fadeOut(700, function(){
	// 				$(".flip-card").addClass("loaded");
	// 			});
	// 	}, 500);
	// } else {
	// 	$("#preloader").delay(500).fadeOut(700);
	// }

	// ==============================
	// Page changer
	// ==============================
	$(document).on("click", "a.preload-link", function(e) {
		var href = $(this).attr("href");
		e.preventDefault();

		return $("#preloader")
			.fadeIn(300, function(){
				return document.location = href != null ? href : "/";
			});
	});

	// ==============================
	// Preloader with percentage
	// ==============================
	function preloader() {
		var duration = 1000;
		var st = new Date().getTime();

		var $circle__o = $("#preloader-svg__img .bar__outer"),
			$circle__c = $("#preloader-svg__img .bar__center"),
			$circle__i = $("#preloader-svg__img .bar__inner");

		var c_o = Math.PI*($circle__o.attr("r") * 2),
			c_c = Math.PI*($circle__c.attr("r") * 2),
			c_i = Math.PI*($circle__i.attr("r") * 2);


		var interval = setInterval(function() {
			var diff = Math.round(new Date().getTime() - st),
				val = Math.round(diff / duration * 100);

			val = val > 100 ? 100 : val;

			var pct_o = ((100-val)/100)*c_o,
				pct_c = ((100-val)/100)*c_c,
				pct_i = ((100-val)/100)*c_i;

			$circle__o.css({strokeDashoffset: pct_o});
			$circle__c.css({strokeDashoffset: pct_c});
			$circle__i.css({strokeDashoffset: pct_i});

			$("#preloader-svg__percentage").text(val);
			$("#preloader-svg__img").css({opacity:1});

			if (diff >= duration) {
				clearInterval(interval);

				if($(".flip-card").length){
					$("#preloader").delay(1000).fadeOut(700, function(){
						$("#preloader__progress").remove();
						$(".flip-card").addClass("loaded");
					});
				} else {
					$("#preloader").delay(1000).fadeOut(700, function(){
						$("#preloader__progress").remove();
					});
				}
			}
		}, 200);
	}

	preloader();

})(jQuery);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCQpIHtcclxuXHRcInVzZSBzdHJpY3RcIjtcclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIENoZWNrIHNjcm9sbGJhciB3aWR0aFxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdHZhciB3aWR0aENvbnRlbnRBID0gJChcIiNzY3JvbGxfYmFyX2NoZWNrX0FcIikud2lkdGgoKSxcclxuXHRcdHdpZHRoQ29udGVudEIgPSAkKFwiI3Njcm9sbF9iYXJfY2hlY2tfQlwiKS53aWR0aCgpO1xyXG5cclxuXHR2YXIgc2Nyb2xsQmFyV2lkaHQgPSAgd2lkdGhDb250ZW50QSAtIHdpZHRoQ29udGVudEI7XHJcblx0JChcIiNzY3JvbGxfYmFyX2NoZWNrX0FcIikuY3NzKFwiZGlzcGxheVwiLFwibm9uZVwiKTtcclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIEFuaW1hdGlvbnNcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQkLmZuLmFuaW1hdGVkID0gZnVuY3Rpb24oaW5FZmZlY3QpIHtcclxuXHRcdCQodGhpcykuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHRocyA9ICQodGhpcyk7XHJcblx0XHRcdHRocy5jc3MoXCJvcGFjaXR5XCIsIFwiMFwiKVxyXG5cdFx0XHRcdC5hZGRDbGFzcyhcImFuaW1hdGVkXCIpXHJcblx0XHRcdFx0LndheXBvaW50KGZ1bmN0aW9uKGRpcikge1xyXG5cdFx0XHRcdFx0aWYgKGRpciA9PT0gXCJkb3duXCIpIHtcclxuXHRcdFx0XHRcdFx0dGhzLmFkZENsYXNzKGluRWZmZWN0KS5jc3MoXCJvcGFjaXR5XCIsIFwiMVwiKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdG9mZnNldDogXCI5MCVcIlxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fTtcclxuXHJcblx0JChcImhlYWRlciAuc3ZnLWhlYWRpbmcsIC50YWxrcyAuc3ZnLWhlYWRpbmcsIC50YWxrcyAudGVzdGltb25pYWwsIC5wb3J0Zm9saW8tc2xpZGVyX19tb2R1bGU+ZGl2LCAuYWJvdXQtbWVfX3NraWxscz5kaXZcIikuYW5pbWF0ZWQoXCJmYWRlSW5VcFwiKTtcclxuXHQkKFwiLmFydGljbGVcIikuYW5pbWF0ZWQoXCJmYWRlSW5cIik7XHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBBeGlzIFBhcmFsbGF4XHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0JChcIiNzY2VuZVwiKS5wYXJhbGxheCh7XHJcblx0XHRzY2FsYXJYOiAzLFxyXG5cdFx0c2NhbGFyWTogMyxcclxuXHRcdGZyaWN0aW9uWDogMC41LFxyXG5cdFx0ZnJpY3Rpb25ZOiAwLjVcclxuXHR9KTtcclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIExvZ2luIGNhcmQgZmxpcFxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdCQoXCIubG9naW4tYnV0dG9uXCIpLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG5cdFx0JChcImJvZHlcIikuYWRkQ2xhc3MoXCJjYXJkX2ZsaXBwZWRcIik7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjdW5mbGlwLWNhcmRcIikuY2xpY2soZnVuY3Rpb24oKSB7XHJcblx0XHQkKFwiYm9keVwiKS5yZW1vdmVDbGFzcyhcImNhcmRfZmxpcHBlZFwiKTtcclxuXHR9KTtcclxuXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBNYWluIG1lbnVcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQkKFwiI21lbnUtdG9nZ2xlXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHQkKHRoaXMpLmFkZChcIi5tYWluLW1lbnVcIikudG9nZ2xlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIubWFpbi1tZW51X19pdGVtXCIpLmVhY2goZnVuY3Rpb24oaW5kZXgpIHtcclxuXHRcdCQodGhpcykuY3NzKFwidHJhbnNpdGlvbi1kZWxheVwiLCAwLjMrMC4xKmluZGV4ICsgXCJzXCIpO1xyXG5cdH0pO1xyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gQnV0dG9uc1xyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdCQoXCJidXR0b24uZ28tZG93blwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0dmFyIGdvID0gJCh0aGlzKS5kYXRhKFwibGlua1wiKTtcclxuXHRcdCQoXCJodG1sLCBib2R5XCIpLnN0b3AoKS5hbmltYXRlKHtcclxuXHRcdFx0c2Nyb2xsVG9wOiAkKGdvKS5vZmZzZXQoKS50b3BcclxuXHRcdH0sIDcwMCwgXCJzd2luZ1wiKTtcclxuXHR9KTtcclxuXHJcblx0JChcImJ1dHRvbi5nby11cFwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0JChcImh0bWwsIGJvZHlcIikuc3RvcCgpLmFuaW1hdGUoe1xyXG5cdFx0XHRzY3JvbGxUb3A6IDBcclxuXHRcdH0sIDcwMCwgXCJzd2luZ1wiKTtcclxuXHR9KTtcclxuXHJcblx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3RvZ2dsZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0JChcIi5ibG9nLW5hdmlnYXRpb25cIikudG9nZ2xlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0fSk7XHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBTQ1JPTEwgRVZFTlRTXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG5cdC8vIFNDUk9MTCBOQVZJR0FUSU9OIEJFR0lOXHJcblx0dmFyIGxhc3RJZCxcclxuXHRcdG1lbnUgPSAkKFwiLmJsb2ctbmF2aWdhdGlvblwiKSxcclxuXHRcdG1lbnVJdGVtcyA9IG1lbnUuZmluZChcImxpIGFcIiksXHJcblx0XHRzY3JvbGxJdGVtcyA9IG1lbnVJdGVtcy5tYXAoZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIGl0ZW0gPSAkKCQodGhpcykuYXR0cihcImhyZWZcIikpO1xyXG5cdFx0XHRpZiAoaXRlbS5sZW5ndGgpIHJldHVybiBpdGVtO1xyXG5cdFx0fSk7XHJcblxyXG5cdC8vIEJpbmQgY2xpY2sgaGFuZGxlciB0byBtZW51IGl0ZW1zXHJcblx0Ly8gc28gd2UgY2FuIGdldCBhIGZhbmN5IHNjcm9sbCBhbmltYXRpb25cclxuXHRtZW51SXRlbXMuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0XHR2YXIgaHJlZiA9ICQodGhpcykuYXR0cihcImhyZWZcIiksXHJcblx0XHRcdG9mZnNldFRvcCA9IChocmVmID09PSBcIiNcIikgPyAwIDogJChocmVmKS5vZmZzZXQoKS50b3AtNjA7XHJcblx0XHRcclxuXHRcdCQoXCJodG1sLCBib2R5XCIpLnN0b3AoKS5hbmltYXRlKHsgXHJcblx0XHRcdHNjcm9sbFRvcDogb2Zmc2V0VG9wXHJcblx0XHR9LCA3MDAsIFwic3dpbmdcIik7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0fSk7XHJcblxyXG5cdC8vIEJpbmQgdG8gc2Nyb2xsXHJcblx0aWYoJChcIi5ibG9nLW5hdmlnYXRpb25cIikub2Zmc2V0KCkpe1xyXG5cdFx0JCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpIHtcclxuXHRcdFx0Ly8gR2V0IGNvbnRhaW5lciBzY3JvbGwgcG9zaXRpb25cclxuXHRcdFx0dmFyIGZyb21Ub3AgPSAkKHRoaXMpLnNjcm9sbFRvcCgpLFxyXG5cdFx0XHRcdGJsb2dOYXZPZmZzZXQgPSAkKFwiLmJsb2ctbmF2aWdhdGlvblwiKS5vZmZzZXQoKS50b3AsXHJcblx0XHRcdFx0YmxvZ05hdkxpbWl0ID0gJChcIi5mb290ZXJfX3dyYXBwZXJcIikub2Zmc2V0KCkudG9wIC0gJChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikub3V0ZXJIZWlnaHQoKTtcclxuXHJcblx0XHRcdC8vIEdldCBpZCBvZiBjdXJyZW50IHNjcm9sbCBpdGVtXHJcblx0XHRcdHZhciBjdXIgPSBzY3JvbGxJdGVtcy5tYXAoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRpZiAoJCh0aGlzKS5vZmZzZXQoKS50b3AgPCBmcm9tVG9wKzE0NClcclxuXHRcdFx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0Ly8gR2V0IHRoZSBpZCBvZiB0aGUgY3VycmVudCBlbGVtZW50XHJcblx0XHRcdGN1ciA9IGN1cltjdXIubGVuZ3RoLTFdO1xyXG5cdFx0XHR2YXIgaWQgPSBjdXIgJiYgY3VyLmxlbmd0aCA/IGN1clswXS5pZCA6IFwiXCI7XHJcblxyXG5cdFx0XHRpZiAobGFzdElkICE9PSBpZCkge1xyXG5cdFx0XHRcdGxhc3RJZCA9IGlkO1xyXG5cdFx0XHRcdC8vIFNldC9yZW1vdmUgYWN0aXZlIGNsYXNzXHJcblx0XHRcdFx0bWVudUl0ZW1zXHJcblx0XHRcdFx0LnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpXHJcblx0XHRcdFx0LmZpbHRlcihcIltocmVmPSNcIitpZCtcIl1cIilcclxuXHRcdFx0XHQuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKGZyb21Ub3AgPj0gYmxvZ05hdkxpbWl0ICYmICQod2luZG93KS53aWR0aCgpID4gKDc2OCAtIHNjcm9sbEJhcldpZGh0KSkge1xyXG5cdFx0XHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uX193cmFwcGVyXCIpLmNzcyh7XCJwb3NpdGlvblwiOlwiYWJzb2x1dGVcIiwgXCJ0b3BcIjpibG9nTmF2TGltaXQgKyBcInB4XCJ9KTtcclxuXHRcdFx0fSBlbHNlIGlmIChmcm9tVG9wID49IGJsb2dOYXZPZmZzZXQgJiYgJCh3aW5kb3cpLndpZHRoKCkgPiAoNzY4IC0gc2Nyb2xsQmFyV2lkaHQpKSB7XHJcblx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikuY3NzKHtcInBvc2l0aW9uXCI6XCJmaXhlZFwiLCBcInRvcFwiOjB9KTtcclxuXHRcdFx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5hZGRDbGFzcyhcIm5hdi1maXhlZFwiKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5jc3Moe1wicG9zaXRpb25cIjpcInJlbGF0aXZlXCJ9KTtcclxuXHRcdFx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5yZW1vdmVDbGFzcyhcIm5hdi1maXhlZFwiKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH0pO1xyXG5cdH1cclxuXHQvLyBTQ1JPTEwgTkFWSUdBVElPTiBFTkRcclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFJFU0laRSBFVkVOVFNcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRpZigkKFwiLmJsb2ctbmF2aWdhdGlvblwiKS5vZmZzZXQoKSl7XHJcblx0XHQkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpZigkKHdpbmRvdykud2lkdGgoKSA8PSAoNzY4IC0gc2Nyb2xsQmFyV2lkaHQpKXtcclxuXHRcdFx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5yZW1vdmVDbGFzcyhcIm5hdi1maXhlZFwiKTtcclxuXHRcdFx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5jc3Moe1wicG9zaXRpb25cIjpcInJlbGF0aXZlXCJ9KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpZigkKFwiYm9keVwiKS5zY3JvbGxUb3AoKSA+PSAkKFwiLmJsb2dcIikub2Zmc2V0KCkudG9wKXtcclxuXHRcdFx0XHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uX193cmFwcGVyXCIpLmNzcyh7XCJwb3NpdGlvblwiOlwiZml4ZWRcIiwgXCJ0b3BcIjowfSk7XHJcblx0XHRcdFx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5hZGRDbGFzcyhcIm5hdi1maXhlZFwiKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblxyXG5cdCQod2luZG93KS5yZXNpemUoZnVuY3Rpb24oKSB7XHJcblx0XHQvLyBUZXN0aW1vbmlhbHMgc2VjdGlvbiBiZyBzaXplXHJcblx0XHRpZiggJCh3aW5kb3cpLndpZHRoKCk+MjAwMCl7XHJcblx0XHRcdCQoXCIudGFsa3MsIC5jb250YWN0LWZvcm1fX2JnXCIpLmNzcyhcImJhY2tncm91bmQtc2l6ZVwiLCAkKHdpbmRvdykud2lkdGgoKSArIFwicHhcIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBGYWtlIHByZWxvYWRlclxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIGlmKCQoXCIuZmxpcC1jYXJkXCIpLmxlbmd0aCl7XHJcblx0Ly8gXHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0Ly8gXHRcdCQoXCIjcHJlbG9hZGVyXCIpXHJcblx0Ly8gXHRcdFx0LmRlbGF5KDIwMClcclxuXHQvLyBcdFx0XHQuZmFkZU91dCg3MDAsIGZ1bmN0aW9uKCl7XHJcblx0Ly8gXHRcdFx0XHQkKFwiLmZsaXAtY2FyZFwiKS5hZGRDbGFzcyhcImxvYWRlZFwiKTtcclxuXHQvLyBcdFx0XHR9KTtcclxuXHQvLyBcdH0sIDUwMCk7XHJcblx0Ly8gfSBlbHNlIHtcclxuXHQvLyBcdCQoXCIjcHJlbG9hZGVyXCIpLmRlbGF5KDUwMCkuZmFkZU91dCg3MDApO1xyXG5cdC8vIH1cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gUGFnZSBjaGFuZ2VyXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0JChkb2N1bWVudCkub24oXCJjbGlja1wiLCBcImEucHJlbG9hZC1saW5rXCIsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdHZhciBocmVmID0gJCh0aGlzKS5hdHRyKFwiaHJlZlwiKTtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRyZXR1cm4gJChcIiNwcmVsb2FkZXJcIilcclxuXHRcdFx0LmZhZGVJbigzMDAsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0cmV0dXJuIGRvY3VtZW50LmxvY2F0aW9uID0gaHJlZiAhPSBudWxsID8gaHJlZiA6IFwiL1wiO1xyXG5cdFx0XHR9KTtcclxuXHR9KTtcclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gUHJlbG9hZGVyIHdpdGggcGVyY2VudGFnZVxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIHByZWxvYWRlcigpIHtcclxuXHRcdHZhciBkdXJhdGlvbiA9IDEwMDA7XHJcblx0XHR2YXIgc3QgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuXHJcblx0XHR2YXIgJGNpcmNsZV9fbyA9ICQoXCIjcHJlbG9hZGVyLXN2Z19faW1nIC5iYXJfX291dGVyXCIpLFxyXG5cdFx0XHQkY2lyY2xlX19jID0gJChcIiNwcmVsb2FkZXItc3ZnX19pbWcgLmJhcl9fY2VudGVyXCIpLFxyXG5cdFx0XHQkY2lyY2xlX19pID0gJChcIiNwcmVsb2FkZXItc3ZnX19pbWcgLmJhcl9faW5uZXJcIik7XHJcblxyXG5cdFx0dmFyIGNfbyA9IE1hdGguUEkqKCRjaXJjbGVfX28uYXR0cihcInJcIikgKiAyKSxcclxuXHRcdFx0Y19jID0gTWF0aC5QSSooJGNpcmNsZV9fYy5hdHRyKFwiclwiKSAqIDIpLFxyXG5cdFx0XHRjX2kgPSBNYXRoLlBJKigkY2lyY2xlX19pLmF0dHIoXCJyXCIpICogMik7XHJcblxyXG5cclxuXHRcdHZhciBpbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgZGlmZiA9IE1hdGgucm91bmQobmV3IERhdGUoKS5nZXRUaW1lKCkgLSBzdCksXHJcblx0XHRcdFx0dmFsID0gTWF0aC5yb3VuZChkaWZmIC8gZHVyYXRpb24gKiAxMDApO1xyXG5cclxuXHRcdFx0dmFsID0gdmFsID4gMTAwID8gMTAwIDogdmFsO1xyXG5cclxuXHRcdFx0dmFyIHBjdF9vID0gKCgxMDAtdmFsKS8xMDApKmNfbyxcclxuXHRcdFx0XHRwY3RfYyA9ICgoMTAwLXZhbCkvMTAwKSpjX2MsXHJcblx0XHRcdFx0cGN0X2kgPSAoKDEwMC12YWwpLzEwMCkqY19pO1xyXG5cclxuXHRcdFx0JGNpcmNsZV9fby5jc3Moe3N0cm9rZURhc2hvZmZzZXQ6IHBjdF9vfSk7XHJcblx0XHRcdCRjaXJjbGVfX2MuY3NzKHtzdHJva2VEYXNob2Zmc2V0OiBwY3RfY30pO1xyXG5cdFx0XHQkY2lyY2xlX19pLmNzcyh7c3Ryb2tlRGFzaG9mZnNldDogcGN0X2l9KTtcclxuXHJcblx0XHRcdCQoXCIjcHJlbG9hZGVyLXN2Z19fcGVyY2VudGFnZVwiKS50ZXh0KHZhbCk7XHJcblx0XHRcdCQoXCIjcHJlbG9hZGVyLXN2Z19faW1nXCIpLmNzcyh7b3BhY2l0eToxfSk7XHJcblxyXG5cdFx0XHRpZiAoZGlmZiA+PSBkdXJhdGlvbikge1xyXG5cdFx0XHRcdGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xyXG5cclxuXHRcdFx0XHRpZigkKFwiLmZsaXAtY2FyZFwiKS5sZW5ndGgpe1xyXG5cdFx0XHRcdFx0JChcIiNwcmVsb2FkZXJcIikuZGVsYXkoMTAwMCkuZmFkZU91dCg3MDAsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHRcdCQoXCIjcHJlbG9hZGVyX19wcm9ncmVzc1wiKS5yZW1vdmUoKTtcclxuXHRcdFx0XHRcdFx0JChcIi5mbGlwLWNhcmRcIikuYWRkQ2xhc3MoXCJsb2FkZWRcIik7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0JChcIiNwcmVsb2FkZXJcIikuZGVsYXkoMTAwMCkuZmFkZU91dCg3MDAsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHRcdCQoXCIjcHJlbG9hZGVyX19wcm9ncmVzc1wiKS5yZW1vdmUoKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSwgMjAwKTtcclxuXHR9XHJcblxyXG5cdHByZWxvYWRlcigpO1xyXG5cclxufSkoalF1ZXJ5KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
