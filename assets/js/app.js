(function($) {
	"use strict";
	// ==============================
	// Check scrollbar width
	// ==============================
	var widthContentA = $("#scroll_bar_check_A").width(),
		widthContentB = $("#scroll_bar_check_B").width();

	var scrollBarWidth = widthContentA - widthContentB;

	$("#scroll_bar_check_A").css("display","none");
	// ==========================================
	// Preloader with percentage by image count
	// ==========================================
	function preloader() {
		var preloader_stat = $("#preloader-svg__percentage"),
			hasImageProperties = ["backgroundImage", "listStyleImage", "borderImage", "borderCornerImage", "cursor"],
			hasImageAttributes = ["srcset"],
			match_url = /url\(\s*(['"]?)(.*?)\1\s*\)/g,
			all_images = [],
			total = 0,
			count = 0;

		var circle_o = $("#preloader-svg__img .bar__outer"),
			circle_c = $("#preloader-svg__img .bar__center"),
			circle_i = $("#preloader-svg__img .bar__inner"),
			length_o = Math.PI*(circle_o.attr("r") * 2),
			length_c = Math.PI*(circle_c.attr("r") * 2),
			length_i = Math.PI*(circle_i.attr("r") * 2);


		$("body").find("*").addBack().each(function () {
			var element = $(this);

			if (element.is("img") && element.attr("src")) {
				all_images.push({
					src: element.attr("src"),
					element: element[0]
				});
			}

			$.each(hasImageProperties, function (i, property) {
				var propertyValue = element.css(property);
				var match;

				if (!propertyValue) {
					return true;
				}

				match = match_url.exec(propertyValue);

				if (match) {
					all_images.push({
						src: match[2],
						element: element[0]
					});
				}
			});

			$.each(hasImageAttributes, function (i, attribute) {
				var attributeValue = element.attr(attribute);

				if (!attributeValue) {
					return true;
				}

				all_images.push({
					src: element.attr("src"),
					srcset: element.attr("srcset"),
					element: element[0]
				});
			});
		});

		function img_loaded(){
			count += 1;
			var percentage = Math.round(count / total * 100);

			percentage = percentage > 100 ? 100 : percentage;

			circle_o.css({strokeDashoffset: ((100-percentage)/100)*length_o });

			if(percentage > 33) {
				circle_c.css({strokeDashoffset: ((100-percentage)/100)*length_c });
			}

			if(percentage > 66) {
				circle_i.css({strokeDashoffset: ((100-percentage)/100)*length_i });
			}

			preloader_stat.text(percentage);

			if(count === total) return done_loading();
		}

		function done_loading(){
			$("#preloader").delay(700).fadeOut(500, function(){
				$("#preloader__progress").remove();

				if($(".flip-card").length){
					$(".flip-card").addClass("loaded");
				}
			});
		}

		total = all_images.length;

		if (total === 0) {
			done_loading();
		}

		var i = total;
		function images_loop () {
			setTimeout(function () {
				var test_image = new Image();


				test_image.onload = img_loaded;
				test_image.onerror = img_loaded;

				i--;
				if (all_images[i].srcset) {
					test_image.srcset = all_images[i].srcset;
				}
				test_image.src = all_images[i].src;

				if (i > 0) {
					images_loop();
				}
			}, 20);
		}

		images_loop();
	}

	if($(window).width() > (768 - scrollBarWidth)){
		preloader();
	} else {
		$("#preloader").remove();
		if($(".flip-card").length){
			$(".flip-card").addClass("loaded");
		}
	}



	// ==============================
	// Animations
	// ==============================
	$.fn.animated = function(inEffect) {
		$(this).each(function() {
			var ths = $(this);
			ths.css({opacity:0})
				.addClass("animated")
				.waypoint(function(dir) {
					if (dir === "down") {
						ths.addClass(inEffect).css({opacity:1});
					}
				},
				{
					offset: "90%"
				});
		});
	};

	$("header .svg-heading, .talks .svg-heading, .talks .testimonial").animated("fadeInUp");
	$(".portfolio-slider__module>div, .about-me__skills>div").animated("fadeInUp");
	$(".article").animated("fadeIn");



	// ==============================
	// Piecharts animation
	// ==============================
	$(".piechart .piechart__fill").each(function(){
		var pie = $(this);
		pie.waypoint(function(dir) {
			if (dir === "down") {
				pie.css({strokeDashoffset:pie.data("percentage")});
			}
		},
			{
				offset: "90%"
			});
	});


	// ==============================
	// Parallax
	// ==============================
	$("#scene.axis").parallax({
		scalarX: 3,
		scalarY: 3,
		frictionX: 0.5,
		frictionY: 0.5
	});

	$(window).scroll(function() {
		var scrollPos = $(this).scrollTop();
		$("#scene.vertical .layer").each(function(){
			var layer = $(this);
			layer.css({
				"top" : ((scrollPos/30)*layer.index())+"px"
			});
		});
		// $("#scene.vertical").css({
		// 	'opacity' : 1-(scrollPos/700)
		// });
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

			if(fromTop >= blogNavLimit && $(window).width() > (768 - scrollBarWidth)) {
				$(".blog-navigation__wrapper").css({"position":"absolute", "top":blogNavLimit + "px"});
			} else if (fromTop >= blogNavOffset && $(window).width() > (768 - scrollBarWidth)) {
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
			if($(window).width() <= (768 - scrollBarWidth)){
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
		if( $(window).width()>2000 - scrollBarWidth){
			$(".talks, .contact-form__bg").css("background-size", $(window).width() + "px");
		}
	});



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



	// =======================================
	// Preloader with percentage by interval
	// =======================================
	// function preloader() {
	// 	var duration = 1000;
	// 	var st = new Date().getTime();

	// 	var $circle__o = $("#preloader-svg__img .bar__outer"),
	// 		$circle__c = $("#preloader-svg__img .bar__center"),
	// 		$circle__i = $("#preloader-svg__img .bar__inner");

	// 	var c_o = Math.PI*($circle__o.attr("r") * 2),
	// 		c_c = Math.PI*($circle__c.attr("r") * 2),
	// 		c_i = Math.PI*($circle__i.attr("r") * 2);


	// 	var interval = setInterval(function() {
	// 		var diff = Math.round(new Date().getTime() - st),
	// 			val = Math.round(diff / duration * 100);

	// 		val = val > 100 ? 100 : val;

	// 		var pct_o = ((100-val)/100)*c_o,
	// 			pct_c = ((100-val)/100)*c_c,
	// 			pct_i = ((100-val)/100)*c_i;

	// 		$circle__o.css({strokeDashoffset: pct_o});
	// 		$circle__c.css({strokeDashoffset: pct_c});
	// 		$circle__i.css({strokeDashoffset: pct_i});

	// 		$("#preloader-svg__percentage").text(val);
	// 		$("#preloader-svg__img").css({opacity:1});

	// 		if (diff >= duration) {
	// 			clearInterval(interval);

	// 			if($(".flip-card").length){
	// 				$("#preloader").delay(1000).fadeOut(700, function(){
	// 					$("#preloader__progress").remove();
	// 					$(".flip-card").addClass("loaded");
	// 				});
	// 			} else {
	// 				$("#preloader").delay(1000).fadeOut(700, function(){
	// 					$("#preloader__progress").remove();
	// 				});
	// 			}
	// 		}
	// 	}, 200);
	// }
	// preloader();


})(jQuery);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCQpIHtcclxuXHRcInVzZSBzdHJpY3RcIjtcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBDaGVjayBzY3JvbGxiYXIgd2lkdGhcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHR2YXIgd2lkdGhDb250ZW50QSA9ICQoXCIjc2Nyb2xsX2Jhcl9jaGVja19BXCIpLndpZHRoKCksXHJcblx0XHR3aWR0aENvbnRlbnRCID0gJChcIiNzY3JvbGxfYmFyX2NoZWNrX0JcIikud2lkdGgoKTtcclxuXHJcblx0dmFyIHNjcm9sbEJhcldpZHRoID0gd2lkdGhDb250ZW50QSAtIHdpZHRoQ29udGVudEI7XHJcblxyXG5cdCQoXCIjc2Nyb2xsX2Jhcl9jaGVja19BXCIpLmNzcyhcImRpc3BsYXlcIixcIm5vbmVcIik7XHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gUHJlbG9hZGVyIHdpdGggcGVyY2VudGFnZSBieSBpbWFnZSBjb3VudFxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIHByZWxvYWRlcigpIHtcclxuXHRcdHZhciBwcmVsb2FkZXJfc3RhdCA9ICQoXCIjcHJlbG9hZGVyLXN2Z19fcGVyY2VudGFnZVwiKSxcclxuXHRcdFx0aGFzSW1hZ2VQcm9wZXJ0aWVzID0gW1wiYmFja2dyb3VuZEltYWdlXCIsIFwibGlzdFN0eWxlSW1hZ2VcIiwgXCJib3JkZXJJbWFnZVwiLCBcImJvcmRlckNvcm5lckltYWdlXCIsIFwiY3Vyc29yXCJdLFxyXG5cdFx0XHRoYXNJbWFnZUF0dHJpYnV0ZXMgPSBbXCJzcmNzZXRcIl0sXHJcblx0XHRcdG1hdGNoX3VybCA9IC91cmxcXChcXHMqKFsnXCJdPykoLio/KVxcMVxccypcXCkvZyxcclxuXHRcdFx0YWxsX2ltYWdlcyA9IFtdLFxyXG5cdFx0XHR0b3RhbCA9IDAsXHJcblx0XHRcdGNvdW50ID0gMDtcclxuXHJcblx0XHR2YXIgY2lyY2xlX28gPSAkKFwiI3ByZWxvYWRlci1zdmdfX2ltZyAuYmFyX19vdXRlclwiKSxcclxuXHRcdFx0Y2lyY2xlX2MgPSAkKFwiI3ByZWxvYWRlci1zdmdfX2ltZyAuYmFyX19jZW50ZXJcIiksXHJcblx0XHRcdGNpcmNsZV9pID0gJChcIiNwcmVsb2FkZXItc3ZnX19pbWcgLmJhcl9faW5uZXJcIiksXHJcblx0XHRcdGxlbmd0aF9vID0gTWF0aC5QSSooY2lyY2xlX28uYXR0cihcInJcIikgKiAyKSxcclxuXHRcdFx0bGVuZ3RoX2MgPSBNYXRoLlBJKihjaXJjbGVfYy5hdHRyKFwiclwiKSAqIDIpLFxyXG5cdFx0XHRsZW5ndGhfaSA9IE1hdGguUEkqKGNpcmNsZV9pLmF0dHIoXCJyXCIpICogMik7XHJcblxyXG5cclxuXHRcdCQoXCJib2R5XCIpLmZpbmQoXCIqXCIpLmFkZEJhY2soKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0dmFyIGVsZW1lbnQgPSAkKHRoaXMpO1xyXG5cclxuXHRcdFx0aWYgKGVsZW1lbnQuaXMoXCJpbWdcIikgJiYgZWxlbWVudC5hdHRyKFwic3JjXCIpKSB7XHJcblx0XHRcdFx0YWxsX2ltYWdlcy5wdXNoKHtcclxuXHRcdFx0XHRcdHNyYzogZWxlbWVudC5hdHRyKFwic3JjXCIpLFxyXG5cdFx0XHRcdFx0ZWxlbWVudDogZWxlbWVudFswXVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQkLmVhY2goaGFzSW1hZ2VQcm9wZXJ0aWVzLCBmdW5jdGlvbiAoaSwgcHJvcGVydHkpIHtcclxuXHRcdFx0XHR2YXIgcHJvcGVydHlWYWx1ZSA9IGVsZW1lbnQuY3NzKHByb3BlcnR5KTtcclxuXHRcdFx0XHR2YXIgbWF0Y2g7XHJcblxyXG5cdFx0XHRcdGlmICghcHJvcGVydHlWYWx1ZSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRtYXRjaCA9IG1hdGNoX3VybC5leGVjKHByb3BlcnR5VmFsdWUpO1xyXG5cclxuXHRcdFx0XHRpZiAobWF0Y2gpIHtcclxuXHRcdFx0XHRcdGFsbF9pbWFnZXMucHVzaCh7XHJcblx0XHRcdFx0XHRcdHNyYzogbWF0Y2hbMl0sXHJcblx0XHRcdFx0XHRcdGVsZW1lbnQ6IGVsZW1lbnRbMF1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQkLmVhY2goaGFzSW1hZ2VBdHRyaWJ1dGVzLCBmdW5jdGlvbiAoaSwgYXR0cmlidXRlKSB7XHJcblx0XHRcdFx0dmFyIGF0dHJpYnV0ZVZhbHVlID0gZWxlbWVudC5hdHRyKGF0dHJpYnV0ZSk7XHJcblxyXG5cdFx0XHRcdGlmICghYXR0cmlidXRlVmFsdWUpIHtcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0YWxsX2ltYWdlcy5wdXNoKHtcclxuXHRcdFx0XHRcdHNyYzogZWxlbWVudC5hdHRyKFwic3JjXCIpLFxyXG5cdFx0XHRcdFx0c3Jjc2V0OiBlbGVtZW50LmF0dHIoXCJzcmNzZXRcIiksXHJcblx0XHRcdFx0XHRlbGVtZW50OiBlbGVtZW50WzBdXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gaW1nX2xvYWRlZCgpe1xyXG5cdFx0XHRjb3VudCArPSAxO1xyXG5cdFx0XHR2YXIgcGVyY2VudGFnZSA9IE1hdGgucm91bmQoY291bnQgLyB0b3RhbCAqIDEwMCk7XHJcblxyXG5cdFx0XHRwZXJjZW50YWdlID0gcGVyY2VudGFnZSA+IDEwMCA/IDEwMCA6IHBlcmNlbnRhZ2U7XHJcblxyXG5cdFx0XHRjaXJjbGVfby5jc3Moe3N0cm9rZURhc2hvZmZzZXQ6ICgoMTAwLXBlcmNlbnRhZ2UpLzEwMCkqbGVuZ3RoX28gfSk7XHJcblxyXG5cdFx0XHRpZihwZXJjZW50YWdlID4gMzMpIHtcclxuXHRcdFx0XHRjaXJjbGVfYy5jc3Moe3N0cm9rZURhc2hvZmZzZXQ6ICgoMTAwLXBlcmNlbnRhZ2UpLzEwMCkqbGVuZ3RoX2MgfSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKHBlcmNlbnRhZ2UgPiA2Nikge1xyXG5cdFx0XHRcdGNpcmNsZV9pLmNzcyh7c3Ryb2tlRGFzaG9mZnNldDogKCgxMDAtcGVyY2VudGFnZSkvMTAwKSpsZW5ndGhfaSB9KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cHJlbG9hZGVyX3N0YXQudGV4dChwZXJjZW50YWdlKTtcclxuXHJcblx0XHRcdGlmKGNvdW50ID09PSB0b3RhbCkgcmV0dXJuIGRvbmVfbG9hZGluZygpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIGRvbmVfbG9hZGluZygpe1xyXG5cdFx0XHQkKFwiI3ByZWxvYWRlclwiKS5kZWxheSg3MDApLmZhZGVPdXQoNTAwLCBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdCQoXCIjcHJlbG9hZGVyX19wcm9ncmVzc1wiKS5yZW1vdmUoKTtcclxuXHJcblx0XHRcdFx0aWYoJChcIi5mbGlwLWNhcmRcIikubGVuZ3RoKXtcclxuXHRcdFx0XHRcdCQoXCIuZmxpcC1jYXJkXCIpLmFkZENsYXNzKFwibG9hZGVkXCIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0dG90YWwgPSBhbGxfaW1hZ2VzLmxlbmd0aDtcclxuXHJcblx0XHRpZiAodG90YWwgPT09IDApIHtcclxuXHRcdFx0ZG9uZV9sb2FkaW5nKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIGkgPSB0b3RhbDtcclxuXHRcdGZ1bmN0aW9uIGltYWdlc19sb29wICgpIHtcclxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0dmFyIHRlc3RfaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuXHJcblxyXG5cdFx0XHRcdHRlc3RfaW1hZ2Uub25sb2FkID0gaW1nX2xvYWRlZDtcclxuXHRcdFx0XHR0ZXN0X2ltYWdlLm9uZXJyb3IgPSBpbWdfbG9hZGVkO1xyXG5cclxuXHRcdFx0XHRpLS07XHJcblx0XHRcdFx0aWYgKGFsbF9pbWFnZXNbaV0uc3Jjc2V0KSB7XHJcblx0XHRcdFx0XHR0ZXN0X2ltYWdlLnNyY3NldCA9IGFsbF9pbWFnZXNbaV0uc3Jjc2V0O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0ZXN0X2ltYWdlLnNyYyA9IGFsbF9pbWFnZXNbaV0uc3JjO1xyXG5cclxuXHRcdFx0XHRpZiAoaSA+IDApIHtcclxuXHRcdFx0XHRcdGltYWdlc19sb29wKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LCAyMCk7XHJcblx0XHR9XHJcblxyXG5cdFx0aW1hZ2VzX2xvb3AoKTtcclxuXHR9XHJcblxyXG5cdGlmKCQod2luZG93KS53aWR0aCgpID4gKDc2OCAtIHNjcm9sbEJhcldpZHRoKSl7XHJcblx0XHRwcmVsb2FkZXIoKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0JChcIiNwcmVsb2FkZXJcIikucmVtb3ZlKCk7XHJcblx0XHRpZigkKFwiLmZsaXAtY2FyZFwiKS5sZW5ndGgpe1xyXG5cdFx0XHQkKFwiLmZsaXAtY2FyZFwiKS5hZGRDbGFzcyhcImxvYWRlZFwiKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gQW5pbWF0aW9uc1xyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdCQuZm4uYW5pbWF0ZWQgPSBmdW5jdGlvbihpbkVmZmVjdCkge1xyXG5cdFx0JCh0aGlzKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgdGhzID0gJCh0aGlzKTtcclxuXHRcdFx0dGhzLmNzcyh7b3BhY2l0eTowfSlcclxuXHRcdFx0XHQuYWRkQ2xhc3MoXCJhbmltYXRlZFwiKVxyXG5cdFx0XHRcdC53YXlwb2ludChmdW5jdGlvbihkaXIpIHtcclxuXHRcdFx0XHRcdGlmIChkaXIgPT09IFwiZG93blwiKSB7XHJcblx0XHRcdFx0XHRcdHRocy5hZGRDbGFzcyhpbkVmZmVjdCkuY3NzKHtvcGFjaXR5OjF9KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdG9mZnNldDogXCI5MCVcIlxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fTtcclxuXHJcblx0JChcImhlYWRlciAuc3ZnLWhlYWRpbmcsIC50YWxrcyAuc3ZnLWhlYWRpbmcsIC50YWxrcyAudGVzdGltb25pYWxcIikuYW5pbWF0ZWQoXCJmYWRlSW5VcFwiKTtcclxuXHQkKFwiLnBvcnRmb2xpby1zbGlkZXJfX21vZHVsZT5kaXYsIC5hYm91dC1tZV9fc2tpbGxzPmRpdlwiKS5hbmltYXRlZChcImZhZGVJblVwXCIpO1xyXG5cdCQoXCIuYXJ0aWNsZVwiKS5hbmltYXRlZChcImZhZGVJblwiKTtcclxuXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBQaWVjaGFydHMgYW5pbWF0aW9uXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0JChcIi5waWVjaGFydCAucGllY2hhcnRfX2ZpbGxcIikuZWFjaChmdW5jdGlvbigpe1xyXG5cdFx0dmFyIHBpZSA9ICQodGhpcyk7XHJcblx0XHRwaWUud2F5cG9pbnQoZnVuY3Rpb24oZGlyKSB7XHJcblx0XHRcdGlmIChkaXIgPT09IFwiZG93blwiKSB7XHJcblx0XHRcdFx0cGllLmNzcyh7c3Ryb2tlRGFzaG9mZnNldDpwaWUuZGF0YShcInBlcmNlbnRhZ2VcIil9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG9mZnNldDogXCI5MCVcIlxyXG5cdFx0XHR9KTtcclxuXHR9KTtcclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFBhcmFsbGF4XHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0JChcIiNzY2VuZS5heGlzXCIpLnBhcmFsbGF4KHtcclxuXHRcdHNjYWxhclg6IDMsXHJcblx0XHRzY2FsYXJZOiAzLFxyXG5cdFx0ZnJpY3Rpb25YOiAwLjUsXHJcblx0XHRmcmljdGlvblk6IDAuNVxyXG5cdH0pO1xyXG5cclxuXHQkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHNjcm9sbFBvcyA9ICQodGhpcykuc2Nyb2xsVG9wKCk7XHJcblx0XHQkKFwiI3NjZW5lLnZlcnRpY2FsIC5sYXllclwiKS5lYWNoKGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciBsYXllciA9ICQodGhpcyk7XHJcblx0XHRcdGxheWVyLmNzcyh7XHJcblx0XHRcdFx0XCJ0b3BcIiA6ICgoc2Nyb2xsUG9zLzMwKSpsYXllci5pbmRleCgpKStcInB4XCJcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHRcdC8vICQoXCIjc2NlbmUudmVydGljYWxcIikuY3NzKHtcclxuXHRcdC8vIFx0J29wYWNpdHknIDogMS0oc2Nyb2xsUG9zLzcwMClcclxuXHRcdC8vIH0pO1xyXG5cdH0pO1xyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBMb2dpbiBjYXJkIGZsaXBcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQkKFwiLmxvZ2luLWJ1dHRvblwiKS5jbGljayhmdW5jdGlvbigpIHtcclxuXHRcdCQoXCJib2R5XCIpLmFkZENsYXNzKFwiY2FyZF9mbGlwcGVkXCIpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiI3VuZmxpcC1jYXJkXCIpLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG5cdFx0JChcImJvZHlcIikucmVtb3ZlQ2xhc3MoXCJjYXJkX2ZsaXBwZWRcIik7XHJcblx0fSk7XHJcblxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gTWFpbiBtZW51XHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0JChcIiNtZW51LXRvZ2dsZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0JCh0aGlzKS5hZGQoXCIubWFpbi1tZW51XCIpLnRvZ2dsZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiLm1haW4tbWVudV9faXRlbVwiKS5lYWNoKGZ1bmN0aW9uKGluZGV4KSB7XHJcblx0XHQkKHRoaXMpLmNzcyhcInRyYW5zaXRpb24tZGVsYXlcIiwgMC4zKzAuMSppbmRleCArIFwic1wiKTtcclxuXHR9KTtcclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIEJ1dHRvbnNcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQkKFwiYnV0dG9uLmdvLWRvd25cIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdHZhciBnbyA9ICQodGhpcykuZGF0YShcImxpbmtcIik7XHJcblx0XHQkKFwiaHRtbCwgYm9keVwiKS5zdG9wKCkuYW5pbWF0ZSh7XHJcblx0XHRcdHNjcm9sbFRvcDogJChnbykub2Zmc2V0KCkudG9wXHJcblx0XHR9LCA3MDAsIFwic3dpbmdcIik7XHJcblx0fSk7XHJcblxyXG5cdCQoXCJidXR0b24uZ28tdXBcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdCQoXCJodG1sLCBib2R5XCIpLnN0b3AoKS5hbmltYXRlKHtcclxuXHRcdFx0c2Nyb2xsVG9wOiAwXHJcblx0XHR9LCA3MDAsIFwic3dpbmdcIik7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIuYmxvZy1uYXZpZ2F0aW9uX190b2dnbGVcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uXCIpLnRvZ2dsZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdH0pO1xyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gU0NST0xMIEVWRU5UU1xyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuXHQvLyBTQ1JPTEwgTkFWSUdBVElPTiBCRUdJTlxyXG5cdHZhciBsYXN0SWQsXHJcblx0XHRtZW51ID0gJChcIi5ibG9nLW5hdmlnYXRpb25cIiksXHJcblx0XHRtZW51SXRlbXMgPSBtZW51LmZpbmQoXCJsaSBhXCIpLFxyXG5cdFx0c2Nyb2xsSXRlbXMgPSBtZW51SXRlbXMubWFwKGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciBpdGVtID0gJCgkKHRoaXMpLmF0dHIoXCJocmVmXCIpKTtcclxuXHRcdFx0aWYgKGl0ZW0ubGVuZ3RoKSByZXR1cm4gaXRlbTtcclxuXHRcdH0pO1xyXG5cclxuXHQvLyBCaW5kIGNsaWNrIGhhbmRsZXIgdG8gbWVudSBpdGVtc1xyXG5cdC8vIHNvIHdlIGNhbiBnZXQgYSBmYW5jeSBzY3JvbGwgYW5pbWF0aW9uXHJcblx0bWVudUl0ZW1zLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0dmFyIGhyZWYgPSAkKHRoaXMpLmF0dHIoXCJocmVmXCIpLFxyXG5cdFx0XHRvZmZzZXRUb3AgPSAoaHJlZiA9PT0gXCIjXCIpID8gMCA6ICQoaHJlZikub2Zmc2V0KCkudG9wLTYwO1xyXG5cdFx0XHJcblx0XHQkKFwiaHRtbCwgYm9keVwiKS5zdG9wKCkuYW5pbWF0ZSh7IFxyXG5cdFx0XHRzY3JvbGxUb3A6IG9mZnNldFRvcFxyXG5cdFx0fSwgNzAwLCBcInN3aW5nXCIpO1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdH0pO1xyXG5cclxuXHQvLyBCaW5kIHRvIHNjcm9sbFxyXG5cdGlmKCQoXCIuYmxvZy1uYXZpZ2F0aW9uXCIpLm9mZnNldCgpKXtcclxuXHRcdCQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oKSB7XHJcblx0XHRcdC8vIEdldCBjb250YWluZXIgc2Nyb2xsIHBvc2l0aW9uXHJcblx0XHRcdHZhciBmcm9tVG9wID0gJCh0aGlzKS5zY3JvbGxUb3AoKSxcclxuXHRcdFx0XHRibG9nTmF2T2Zmc2V0ID0gJChcIi5ibG9nLW5hdmlnYXRpb25cIikub2Zmc2V0KCkudG9wLFxyXG5cdFx0XHRcdGJsb2dOYXZMaW1pdCA9ICQoXCIuZm9vdGVyX193cmFwcGVyXCIpLm9mZnNldCgpLnRvcCAtICQoXCIuYmxvZy1uYXZpZ2F0aW9uX193cmFwcGVyXCIpLm91dGVySGVpZ2h0KCk7XHJcblxyXG5cdFx0XHQvLyBHZXQgaWQgb2YgY3VycmVudCBzY3JvbGwgaXRlbVxyXG5cdFx0XHR2YXIgY3VyID0gc2Nyb2xsSXRlbXMubWFwKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0aWYgKCQodGhpcykub2Zmc2V0KCkudG9wIDwgZnJvbVRvcCsxNDQpXHJcblx0XHRcdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdFx0fSk7XHJcblx0XHRcdC8vIEdldCB0aGUgaWQgb2YgdGhlIGN1cnJlbnQgZWxlbWVudFxyXG5cdFx0XHRjdXIgPSBjdXJbY3VyLmxlbmd0aC0xXTtcclxuXHRcdFx0dmFyIGlkID0gY3VyICYmIGN1ci5sZW5ndGggPyBjdXJbMF0uaWQgOiBcIlwiO1xyXG5cclxuXHRcdFx0aWYgKGxhc3RJZCAhPT0gaWQpIHtcclxuXHRcdFx0XHRsYXN0SWQgPSBpZDtcclxuXHRcdFx0XHQvLyBTZXQvcmVtb3ZlIGFjdGl2ZSBjbGFzc1xyXG5cdFx0XHRcdG1lbnVJdGVtc1xyXG5cdFx0XHRcdC5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKVxyXG5cdFx0XHRcdC5maWx0ZXIoXCJbaHJlZj0jXCIraWQrXCJdXCIpXHJcblx0XHRcdFx0LmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZihmcm9tVG9wID49IGJsb2dOYXZMaW1pdCAmJiAkKHdpbmRvdykud2lkdGgoKSA+ICg3NjggLSBzY3JvbGxCYXJXaWR0aCkpIHtcclxuXHRcdFx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5jc3Moe1wicG9zaXRpb25cIjpcImFic29sdXRlXCIsIFwidG9wXCI6YmxvZ05hdkxpbWl0ICsgXCJweFwifSk7XHJcblx0XHRcdH0gZWxzZSBpZiAoZnJvbVRvcCA+PSBibG9nTmF2T2Zmc2V0ICYmICQod2luZG93KS53aWR0aCgpID4gKDc2OCAtIHNjcm9sbEJhcldpZHRoKSkge1xyXG5cdFx0XHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uX193cmFwcGVyXCIpLmNzcyh7XCJwb3NpdGlvblwiOlwiZml4ZWRcIiwgXCJ0b3BcIjowfSk7XHJcblx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikuYWRkQ2xhc3MoXCJuYXYtZml4ZWRcIik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikuY3NzKHtcInBvc2l0aW9uXCI6XCJyZWxhdGl2ZVwifSk7XHJcblx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikucmVtb3ZlQ2xhc3MoXCJuYXYtZml4ZWRcIik7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9KTtcclxuXHR9XHJcblx0Ly8gU0NST0xMIE5BVklHQVRJT04gRU5EXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBSRVNJWkUgRVZFTlRTXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0aWYoJChcIi5ibG9nLW5hdmlnYXRpb25cIikub2Zmc2V0KCkpe1xyXG5cdFx0JCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbigpIHtcclxuXHRcdFx0aWYoJCh3aW5kb3cpLndpZHRoKCkgPD0gKDc2OCAtIHNjcm9sbEJhcldpZHRoKSl7XHJcblx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikucmVtb3ZlQ2xhc3MoXCJuYXYtZml4ZWRcIik7XHJcblx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikuY3NzKHtcInBvc2l0aW9uXCI6XCJyZWxhdGl2ZVwifSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0aWYoJChcImJvZHlcIikuc2Nyb2xsVG9wKCkgPj0gJChcIi5ibG9nXCIpLm9mZnNldCgpLnRvcCl7XHJcblx0XHRcdFx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5jc3Moe1wicG9zaXRpb25cIjpcImZpeGVkXCIsIFwidG9wXCI6MH0pO1xyXG5cdFx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikuYWRkQ2xhc3MoXCJuYXYtZml4ZWRcIik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cclxuXHQkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCkge1xyXG5cdFx0Ly8gVGVzdGltb25pYWxzIHNlY3Rpb24gYmcgc2l6ZVxyXG5cdFx0aWYoICQod2luZG93KS53aWR0aCgpPjIwMDAgLSBzY3JvbGxCYXJXaWR0aCl7XHJcblx0XHRcdCQoXCIudGFsa3MsIC5jb250YWN0LWZvcm1fX2JnXCIpLmNzcyhcImJhY2tncm91bmQtc2l6ZVwiLCAkKHdpbmRvdykud2lkdGgoKSArIFwicHhcIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gUGFnZSBjaGFuZ2VyXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0JChkb2N1bWVudCkub24oXCJjbGlja1wiLCBcImEucHJlbG9hZC1saW5rXCIsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdHZhciBocmVmID0gJCh0aGlzKS5hdHRyKFwiaHJlZlwiKTtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRyZXR1cm4gJChcIiNwcmVsb2FkZXJcIilcclxuXHRcdFx0LmZhZGVJbigzMDAsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0cmV0dXJuIGRvY3VtZW50LmxvY2F0aW9uID0gaHJlZiAhPSBudWxsID8gaHJlZiA6IFwiL1wiO1xyXG5cdFx0XHR9KTtcclxuXHR9KTtcclxuXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBQcmVsb2FkZXIgd2l0aCBwZXJjZW50YWdlIGJ5IGludGVydmFsXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gZnVuY3Rpb24gcHJlbG9hZGVyKCkge1xyXG5cdC8vIFx0dmFyIGR1cmF0aW9uID0gMTAwMDtcclxuXHQvLyBcdHZhciBzdCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG5cclxuXHQvLyBcdHZhciAkY2lyY2xlX19vID0gJChcIiNwcmVsb2FkZXItc3ZnX19pbWcgLmJhcl9fb3V0ZXJcIiksXHJcblx0Ly8gXHRcdCRjaXJjbGVfX2MgPSAkKFwiI3ByZWxvYWRlci1zdmdfX2ltZyAuYmFyX19jZW50ZXJcIiksXHJcblx0Ly8gXHRcdCRjaXJjbGVfX2kgPSAkKFwiI3ByZWxvYWRlci1zdmdfX2ltZyAuYmFyX19pbm5lclwiKTtcclxuXHJcblx0Ly8gXHR2YXIgY19vID0gTWF0aC5QSSooJGNpcmNsZV9fby5hdHRyKFwiclwiKSAqIDIpLFxyXG5cdC8vIFx0XHRjX2MgPSBNYXRoLlBJKigkY2lyY2xlX19jLmF0dHIoXCJyXCIpICogMiksXHJcblx0Ly8gXHRcdGNfaSA9IE1hdGguUEkqKCRjaXJjbGVfX2kuYXR0cihcInJcIikgKiAyKTtcclxuXHJcblxyXG5cdC8vIFx0dmFyIGludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XHJcblx0Ly8gXHRcdHZhciBkaWZmID0gTWF0aC5yb3VuZChuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHN0KSxcclxuXHQvLyBcdFx0XHR2YWwgPSBNYXRoLnJvdW5kKGRpZmYgLyBkdXJhdGlvbiAqIDEwMCk7XHJcblxyXG5cdC8vIFx0XHR2YWwgPSB2YWwgPiAxMDAgPyAxMDAgOiB2YWw7XHJcblxyXG5cdC8vIFx0XHR2YXIgcGN0X28gPSAoKDEwMC12YWwpLzEwMCkqY19vLFxyXG5cdC8vIFx0XHRcdHBjdF9jID0gKCgxMDAtdmFsKS8xMDApKmNfYyxcclxuXHQvLyBcdFx0XHRwY3RfaSA9ICgoMTAwLXZhbCkvMTAwKSpjX2k7XHJcblxyXG5cdC8vIFx0XHQkY2lyY2xlX19vLmNzcyh7c3Ryb2tlRGFzaG9mZnNldDogcGN0X299KTtcclxuXHQvLyBcdFx0JGNpcmNsZV9fYy5jc3Moe3N0cm9rZURhc2hvZmZzZXQ6IHBjdF9jfSk7XHJcblx0Ly8gXHRcdCRjaXJjbGVfX2kuY3NzKHtzdHJva2VEYXNob2Zmc2V0OiBwY3RfaX0pO1xyXG5cclxuXHQvLyBcdFx0JChcIiNwcmVsb2FkZXItc3ZnX19wZXJjZW50YWdlXCIpLnRleHQodmFsKTtcclxuXHQvLyBcdFx0JChcIiNwcmVsb2FkZXItc3ZnX19pbWdcIikuY3NzKHtvcGFjaXR5OjF9KTtcclxuXHJcblx0Ly8gXHRcdGlmIChkaWZmID49IGR1cmF0aW9uKSB7XHJcblx0Ly8gXHRcdFx0Y2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XHJcblxyXG5cdC8vIFx0XHRcdGlmKCQoXCIuZmxpcC1jYXJkXCIpLmxlbmd0aCl7XHJcblx0Ly8gXHRcdFx0XHQkKFwiI3ByZWxvYWRlclwiKS5kZWxheSgxMDAwKS5mYWRlT3V0KDcwMCwgZnVuY3Rpb24oKXtcclxuXHQvLyBcdFx0XHRcdFx0JChcIiNwcmVsb2FkZXJfX3Byb2dyZXNzXCIpLnJlbW92ZSgpO1xyXG5cdC8vIFx0XHRcdFx0XHQkKFwiLmZsaXAtY2FyZFwiKS5hZGRDbGFzcyhcImxvYWRlZFwiKTtcclxuXHQvLyBcdFx0XHRcdH0pO1xyXG5cdC8vIFx0XHRcdH0gZWxzZSB7XHJcblx0Ly8gXHRcdFx0XHQkKFwiI3ByZWxvYWRlclwiKS5kZWxheSgxMDAwKS5mYWRlT3V0KDcwMCwgZnVuY3Rpb24oKXtcclxuXHQvLyBcdFx0XHRcdFx0JChcIiNwcmVsb2FkZXJfX3Byb2dyZXNzXCIpLnJlbW92ZSgpO1xyXG5cdC8vIFx0XHRcdFx0fSk7XHJcblx0Ly8gXHRcdFx0fVxyXG5cdC8vIFx0XHR9XHJcblx0Ly8gXHR9LCAyMDApO1xyXG5cdC8vIH1cclxuXHQvLyBwcmVsb2FkZXIoKTtcclxuXHJcblxyXG59KShqUXVlcnkpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
