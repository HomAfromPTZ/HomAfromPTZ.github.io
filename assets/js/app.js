(function($) {
	"use strict";

	// ==============================
	// Check scrollbar width
	// ==============================
	var widthContentA = $("#scroll_bar_check_A").width(),
		widthContentB = $("#scroll_bar_check_B").width();

	var scrollBarWidth = widthContentA - widthContentB;

	$("#scroll_bar_check_A").css("display","none");



	// ==============================
	// Check IE version
	// ==============================
	function detect_IE() {
		var ua = window.navigator.userAgent;

		var msie = ua.indexOf("MSIE ");
		if (msie > 0) {
			// IE 10 or older => return version number
			return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)), 10);
		}

		var trident = ua.indexOf("Trident/");
		if (trident > 0) {
			// IE 11 => return version number
			var rv = ua.indexOf("rv:");
			return parseInt(ua.substring(rv + 3, ua.indexOf(".", rv)), 10);
		}

		var edge = ua.indexOf("Edge/");
		if (edge > 0) {
			// Edge (IE 12+) => return version number
			return parseInt(ua.substring(edge + 5, ua.indexOf(".", edge)), 10);
		}

		// other browser
		return false;
	}



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


		function img_loaded(){
			var percentage = Math.ceil( ++count / total * 100 );

			percentage = percentage > 100 ? 100 : percentage;

			// Draw offsets
			circle_o.css({strokeDashoffset: ((100-percentage)/100)*length_o });

			if(percentage > 50) {
				circle_c.css({strokeDashoffset: ((100-percentage)/100)*length_c });
			}

			if(percentage == 100) {
				circle_i.css({strokeDashoffset: ((100-percentage)/100)*length_i });
			}

			preloader_stat.html(percentage);

			if(count === total) return done_loading();
		}

		function done_loading(){
			$("#preloader").delay(700).fadeOut(700, function(){
				$("#preloader__progress").remove();

				if($(".flip-card").length){
					$(".flip-card").addClass("loaded");
				}
			});
		}

		function images_loop () {
			setTimeout(function () {
				var test_image = new Image();

				test_image.onload = img_loaded;
				test_image.onerror = img_loaded;

				// console.log("C: " + count, " T: " + total);

				if (count != total) {
					if (all_images[count].srcset) {
						test_image.srcset = all_images[count].srcset;
					}
					test_image.src = all_images[count].src;

					images_loop();
				}
			}, 50);
		}

		$("*").each(function () {
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

		total = all_images.length;

		if (total === 0) {
			done_loading();
		} else {
			preloader_stat.css({opacity: 1});
			images_loop();
		}

		// for(var i=0; i<total; i++){
		// 	var test_image = new Image();


		// 	test_image.onload = img_loaded;
		// 	test_image.onerror = img_loaded;

		// 	if (all_images[i].srcset) {
		// 		test_image.srcset = all_images[i].srcset;
		// 	}
		// 	test_image.src = all_images[i].src;
		// }
	}

	preloader();





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
	$(".article, .portfolio-slider__preview-container").animated("fadeIn");



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
	var is_this_ie = detect_IE();

	// IE scroll jump fix
	if(is_this_ie) {
		$(".layer").css({transition:"top .15s linear"});
		$("#scene.vertical").css({transition:"opacity .15s linear"});

		$("body").on("mousewheel", function () {
			event.preventDefault(); 

			var wheelDelta = event.wheelDelta,
				currentScrollPosition = window.pageYOffset;

			window.scrollTo(0, currentScrollPosition - wheelDelta);
		});
	}

	if($("#scene.axis").length){
		$("#scene.axis").parallax({
			scalarX: 3,
			scalarY: 3,
			frictionX: 0.5,
			frictionY: 0.5
		});
	}

	if($("#scene.vertical")){
		$(window).scroll(function() {
			var scrollPos = $(this).scrollTop();

			$("#scene.vertical .layer").each(function(){
				var layer = $(this);

				if(layer.index() !=0 ) {
					layer.css({
						"top" : ( (scrollPos/(5 + 2*layer.index())) )+"px"
					});
				}
			});
			$("#scene.vertical").css({
				"opacity" : 1-(scrollPos/700)
			});
		});
	}

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
	// Slider
	// ==============================
	$(".portfolio-button").click(function(){
		var this_button = $(this),
			this_thumbnails = this_button.next().find(".portfolio-thumbnails__thumbnail"),
			this_active_thumb = this_thumbnails.filter(".active"),
			this_next_index = this_thumbnails.index(this_active_thumb) + 1,
			other_button = this_button.parent().siblings().find(".portfolio-button"),
			other_thumbnails = other_button.next().find(".portfolio-thumbnails__thumbnail"),
			other_active_thumb = other_thumbnails.filter(".active"),
			other_next_index = other_thumbnails.index(other_active_thumb) + 1,
			active_preview = this_button.closest(".portfolio-slider").find(".portfolio-preview"),
			next_preview = this_active_thumb.find("img").attr("src");


		if(this_next_index >= this_thumbnails.length){
			this_next_index = 0;
		}

		if(other_next_index >= other_thumbnails.length){
			other_next_index = 0;
		}

		var this_next_thumb = this_thumbnails.eq(this_next_index),
			other_next_thumb = other_thumbnails.eq(other_next_index);

		this_active_thumb.animate({
			top: "-100%"
		}, 700);

		this_button.prop("disabled", true);
		other_button.prop("disabled", true);

		this_next_thumb.css({top:"100%"});
		this_next_thumb.animate({
			top: 0
		}, 700, function() {
			this_active_thumb.removeClass("active").css({top:"100%"});
			$(this).addClass("active");
			this_button.prop("disabled", false);
		});

		other_active_thumb.animate({
			top: "100%"
		}, 700);

		other_next_thumb.css({top:"-100%"});
		other_next_thumb.animate({
			top: 0
		}, 700, function() {
			other_active_thumb.removeClass("active").css({top:"-100%"});
			$(this).addClass("active");
			other_button.prop("disabled", false);
		});

		active_preview.fadeOut(350, function(){
			$(this).attr("src", next_preview).fadeIn(350);
		});
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oJCkge1xyXG5cdFwidXNlIHN0cmljdFwiO1xyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBDaGVjayBzY3JvbGxiYXIgd2lkdGhcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHR2YXIgd2lkdGhDb250ZW50QSA9ICQoXCIjc2Nyb2xsX2Jhcl9jaGVja19BXCIpLndpZHRoKCksXHJcblx0XHR3aWR0aENvbnRlbnRCID0gJChcIiNzY3JvbGxfYmFyX2NoZWNrX0JcIikud2lkdGgoKTtcclxuXHJcblx0dmFyIHNjcm9sbEJhcldpZHRoID0gd2lkdGhDb250ZW50QSAtIHdpZHRoQ29udGVudEI7XHJcblxyXG5cdCQoXCIjc2Nyb2xsX2Jhcl9jaGVja19BXCIpLmNzcyhcImRpc3BsYXlcIixcIm5vbmVcIik7XHJcblxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gQ2hlY2sgSUUgdmVyc2lvblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIGRldGVjdF9JRSgpIHtcclxuXHRcdHZhciB1YSA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50O1xyXG5cclxuXHRcdHZhciBtc2llID0gdWEuaW5kZXhPZihcIk1TSUUgXCIpO1xyXG5cdFx0aWYgKG1zaWUgPiAwKSB7XHJcblx0XHRcdC8vIElFIDEwIG9yIG9sZGVyID0+IHJldHVybiB2ZXJzaW9uIG51bWJlclxyXG5cdFx0XHRyZXR1cm4gcGFyc2VJbnQodWEuc3Vic3RyaW5nKG1zaWUgKyA1LCB1YS5pbmRleE9mKFwiLlwiLCBtc2llKSksIDEwKTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgdHJpZGVudCA9IHVhLmluZGV4T2YoXCJUcmlkZW50L1wiKTtcclxuXHRcdGlmICh0cmlkZW50ID4gMCkge1xyXG5cdFx0XHQvLyBJRSAxMSA9PiByZXR1cm4gdmVyc2lvbiBudW1iZXJcclxuXHRcdFx0dmFyIHJ2ID0gdWEuaW5kZXhPZihcInJ2OlwiKTtcclxuXHRcdFx0cmV0dXJuIHBhcnNlSW50KHVhLnN1YnN0cmluZyhydiArIDMsIHVhLmluZGV4T2YoXCIuXCIsIHJ2KSksIDEwKTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgZWRnZSA9IHVhLmluZGV4T2YoXCJFZGdlL1wiKTtcclxuXHRcdGlmIChlZGdlID4gMCkge1xyXG5cdFx0XHQvLyBFZGdlIChJRSAxMispID0+IHJldHVybiB2ZXJzaW9uIG51bWJlclxyXG5cdFx0XHRyZXR1cm4gcGFyc2VJbnQodWEuc3Vic3RyaW5nKGVkZ2UgKyA1LCB1YS5pbmRleE9mKFwiLlwiLCBlZGdlKSksIDEwKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBvdGhlciBicm93c2VyXHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFByZWxvYWRlciB3aXRoIHBlcmNlbnRhZ2UgYnkgaW1hZ2UgY291bnRcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRmdW5jdGlvbiBwcmVsb2FkZXIoKSB7XHJcblx0XHR2YXIgcHJlbG9hZGVyX3N0YXQgPSAkKFwiI3ByZWxvYWRlci1zdmdfX3BlcmNlbnRhZ2VcIiksXHJcblx0XHRcdGhhc0ltYWdlUHJvcGVydGllcyA9IFtcImJhY2tncm91bmRJbWFnZVwiLCBcImxpc3RTdHlsZUltYWdlXCIsIFwiYm9yZGVySW1hZ2VcIiwgXCJib3JkZXJDb3JuZXJJbWFnZVwiLCBcImN1cnNvclwiXSxcclxuXHRcdFx0aGFzSW1hZ2VBdHRyaWJ1dGVzID0gW1wic3Jjc2V0XCJdLFxyXG5cdFx0XHRtYXRjaF91cmwgPSAvdXJsXFwoXFxzKihbJ1wiXT8pKC4qPylcXDFcXHMqXFwpL2csXHJcblx0XHRcdGFsbF9pbWFnZXMgPSBbXSxcclxuXHRcdFx0dG90YWwgPSAwLFxyXG5cdFx0XHRjb3VudCA9IDA7XHJcblxyXG5cdFx0dmFyIGNpcmNsZV9vID0gJChcIiNwcmVsb2FkZXItc3ZnX19pbWcgLmJhcl9fb3V0ZXJcIiksXHJcblx0XHRcdGNpcmNsZV9jID0gJChcIiNwcmVsb2FkZXItc3ZnX19pbWcgLmJhcl9fY2VudGVyXCIpLFxyXG5cdFx0XHRjaXJjbGVfaSA9ICQoXCIjcHJlbG9hZGVyLXN2Z19faW1nIC5iYXJfX2lubmVyXCIpLFxyXG5cdFx0XHRsZW5ndGhfbyA9IE1hdGguUEkqKGNpcmNsZV9vLmF0dHIoXCJyXCIpICogMiksXHJcblx0XHRcdGxlbmd0aF9jID0gTWF0aC5QSSooY2lyY2xlX2MuYXR0cihcInJcIikgKiAyKSxcclxuXHRcdFx0bGVuZ3RoX2kgPSBNYXRoLlBJKihjaXJjbGVfaS5hdHRyKFwiclwiKSAqIDIpO1xyXG5cclxuXHJcblx0XHRmdW5jdGlvbiBpbWdfbG9hZGVkKCl7XHJcblx0XHRcdHZhciBwZXJjZW50YWdlID0gTWF0aC5jZWlsKCArK2NvdW50IC8gdG90YWwgKiAxMDAgKTtcclxuXHJcblx0XHRcdHBlcmNlbnRhZ2UgPSBwZXJjZW50YWdlID4gMTAwID8gMTAwIDogcGVyY2VudGFnZTtcclxuXHJcblx0XHRcdC8vIERyYXcgb2Zmc2V0c1xyXG5cdFx0XHRjaXJjbGVfby5jc3Moe3N0cm9rZURhc2hvZmZzZXQ6ICgoMTAwLXBlcmNlbnRhZ2UpLzEwMCkqbGVuZ3RoX28gfSk7XHJcblxyXG5cdFx0XHRpZihwZXJjZW50YWdlID4gNTApIHtcclxuXHRcdFx0XHRjaXJjbGVfYy5jc3Moe3N0cm9rZURhc2hvZmZzZXQ6ICgoMTAwLXBlcmNlbnRhZ2UpLzEwMCkqbGVuZ3RoX2MgfSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKHBlcmNlbnRhZ2UgPT0gMTAwKSB7XHJcblx0XHRcdFx0Y2lyY2xlX2kuY3NzKHtzdHJva2VEYXNob2Zmc2V0OiAoKDEwMC1wZXJjZW50YWdlKS8xMDApKmxlbmd0aF9pIH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRwcmVsb2FkZXJfc3RhdC5odG1sKHBlcmNlbnRhZ2UpO1xyXG5cclxuXHRcdFx0aWYoY291bnQgPT09IHRvdGFsKSByZXR1cm4gZG9uZV9sb2FkaW5nKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gZG9uZV9sb2FkaW5nKCl7XHJcblx0XHRcdCQoXCIjcHJlbG9hZGVyXCIpLmRlbGF5KDcwMCkuZmFkZU91dCg3MDAsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0JChcIiNwcmVsb2FkZXJfX3Byb2dyZXNzXCIpLnJlbW92ZSgpO1xyXG5cclxuXHRcdFx0XHRpZigkKFwiLmZsaXAtY2FyZFwiKS5sZW5ndGgpe1xyXG5cdFx0XHRcdFx0JChcIi5mbGlwLWNhcmRcIikuYWRkQ2xhc3MoXCJsb2FkZWRcIik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBpbWFnZXNfbG9vcCAoKSB7XHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHZhciB0ZXN0X2ltYWdlID0gbmV3IEltYWdlKCk7XHJcblxyXG5cdFx0XHRcdHRlc3RfaW1hZ2Uub25sb2FkID0gaW1nX2xvYWRlZDtcclxuXHRcdFx0XHR0ZXN0X2ltYWdlLm9uZXJyb3IgPSBpbWdfbG9hZGVkO1xyXG5cclxuXHRcdFx0XHQvLyBjb25zb2xlLmxvZyhcIkM6IFwiICsgY291bnQsIFwiIFQ6IFwiICsgdG90YWwpO1xyXG5cclxuXHRcdFx0XHRpZiAoY291bnQgIT0gdG90YWwpIHtcclxuXHRcdFx0XHRcdGlmIChhbGxfaW1hZ2VzW2NvdW50XS5zcmNzZXQpIHtcclxuXHRcdFx0XHRcdFx0dGVzdF9pbWFnZS5zcmNzZXQgPSBhbGxfaW1hZ2VzW2NvdW50XS5zcmNzZXQ7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR0ZXN0X2ltYWdlLnNyYyA9IGFsbF9pbWFnZXNbY291bnRdLnNyYztcclxuXHJcblx0XHRcdFx0XHRpbWFnZXNfbG9vcCgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSwgNTApO1xyXG5cdFx0fVxyXG5cclxuXHRcdCQoXCIqXCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG5cdFx0XHR2YXIgZWxlbWVudCA9ICQodGhpcyk7XHJcblxyXG5cdFx0XHRpZiAoZWxlbWVudC5pcyhcImltZ1wiKSAmJiBlbGVtZW50LmF0dHIoXCJzcmNcIikpIHtcclxuXHRcdFx0XHRhbGxfaW1hZ2VzLnB1c2goe1xyXG5cdFx0XHRcdFx0c3JjOiBlbGVtZW50LmF0dHIoXCJzcmNcIiksXHJcblx0XHRcdFx0XHRlbGVtZW50OiBlbGVtZW50WzBdXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdCQuZWFjaChoYXNJbWFnZVByb3BlcnRpZXMsIGZ1bmN0aW9uIChpLCBwcm9wZXJ0eSkge1xyXG5cdFx0XHRcdHZhciBwcm9wZXJ0eVZhbHVlID0gZWxlbWVudC5jc3MocHJvcGVydHkpO1xyXG5cdFx0XHRcdHZhciBtYXRjaDtcclxuXHJcblx0XHRcdFx0aWYgKCFwcm9wZXJ0eVZhbHVlKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdG1hdGNoID0gbWF0Y2hfdXJsLmV4ZWMocHJvcGVydHlWYWx1ZSk7XHJcblxyXG5cdFx0XHRcdGlmIChtYXRjaCkge1xyXG5cdFx0XHRcdFx0YWxsX2ltYWdlcy5wdXNoKHtcclxuXHRcdFx0XHRcdFx0c3JjOiBtYXRjaFsyXSxcclxuXHRcdFx0XHRcdFx0ZWxlbWVudDogZWxlbWVudFswXVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdCQuZWFjaChoYXNJbWFnZUF0dHJpYnV0ZXMsIGZ1bmN0aW9uIChpLCBhdHRyaWJ1dGUpIHtcclxuXHRcdFx0XHR2YXIgYXR0cmlidXRlVmFsdWUgPSBlbGVtZW50LmF0dHIoYXR0cmlidXRlKTtcclxuXHJcblx0XHRcdFx0aWYgKCFhdHRyaWJ1dGVWYWx1ZSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRhbGxfaW1hZ2VzLnB1c2goe1xyXG5cdFx0XHRcdFx0c3JjOiBlbGVtZW50LmF0dHIoXCJzcmNcIiksXHJcblx0XHRcdFx0XHRzcmNzZXQ6IGVsZW1lbnQuYXR0cihcInNyY3NldFwiKSxcclxuXHRcdFx0XHRcdGVsZW1lbnQ6IGVsZW1lbnRbMF1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHJcblx0XHR0b3RhbCA9IGFsbF9pbWFnZXMubGVuZ3RoO1xyXG5cclxuXHRcdGlmICh0b3RhbCA9PT0gMCkge1xyXG5cdFx0XHRkb25lX2xvYWRpbmcoKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHByZWxvYWRlcl9zdGF0LmNzcyh7b3BhY2l0eTogMX0pO1xyXG5cdFx0XHRpbWFnZXNfbG9vcCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGZvcih2YXIgaT0wOyBpPHRvdGFsOyBpKyspe1xyXG5cdFx0Ly8gXHR2YXIgdGVzdF9pbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG5cclxuXHJcblx0XHQvLyBcdHRlc3RfaW1hZ2Uub25sb2FkID0gaW1nX2xvYWRlZDtcclxuXHRcdC8vIFx0dGVzdF9pbWFnZS5vbmVycm9yID0gaW1nX2xvYWRlZDtcclxuXHJcblx0XHQvLyBcdGlmIChhbGxfaW1hZ2VzW2ldLnNyY3NldCkge1xyXG5cdFx0Ly8gXHRcdHRlc3RfaW1hZ2Uuc3Jjc2V0ID0gYWxsX2ltYWdlc1tpXS5zcmNzZXQ7XHJcblx0XHQvLyBcdH1cclxuXHRcdC8vIFx0dGVzdF9pbWFnZS5zcmMgPSBhbGxfaW1hZ2VzW2ldLnNyYztcclxuXHRcdC8vIH1cclxuXHR9XHJcblxyXG5cdHByZWxvYWRlcigpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gUGFnZSBjaGFuZ2VyXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0JChkb2N1bWVudCkub24oXCJjbGlja1wiLCBcImEucHJlbG9hZC1saW5rXCIsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdHZhciBocmVmID0gJCh0aGlzKS5hdHRyKFwiaHJlZlwiKTtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRyZXR1cm4gJChcIiNwcmVsb2FkZXJcIilcclxuXHRcdFx0LmZhZGVJbigzMDAsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0cmV0dXJuIGRvY3VtZW50LmxvY2F0aW9uID0gaHJlZiAhPSBudWxsID8gaHJlZiA6IFwiL1wiO1xyXG5cdFx0XHR9KTtcclxuXHR9KTtcclxuXHJcblxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gQW5pbWF0aW9uc1xyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdCQuZm4uYW5pbWF0ZWQgPSBmdW5jdGlvbihpbkVmZmVjdCkge1xyXG5cdFx0JCh0aGlzKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgdGhzID0gJCh0aGlzKTtcclxuXHRcdFx0dGhzLmNzcyh7b3BhY2l0eTowfSlcclxuXHRcdFx0XHQuYWRkQ2xhc3MoXCJhbmltYXRlZFwiKVxyXG5cdFx0XHRcdC53YXlwb2ludChmdW5jdGlvbihkaXIpIHtcclxuXHRcdFx0XHRcdGlmIChkaXIgPT09IFwiZG93blwiKSB7XHJcblx0XHRcdFx0XHRcdHRocy5hZGRDbGFzcyhpbkVmZmVjdCkuY3NzKHtvcGFjaXR5OjF9KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdG9mZnNldDogXCI5MCVcIlxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fTtcclxuXHJcblx0JChcImhlYWRlciAuc3ZnLWhlYWRpbmcsIC50YWxrcyAuc3ZnLWhlYWRpbmcsIC50YWxrcyAudGVzdGltb25pYWxcIikuYW5pbWF0ZWQoXCJmYWRlSW5VcFwiKTtcclxuXHQkKFwiLnBvcnRmb2xpby1zbGlkZXJfX21vZHVsZT5kaXYsIC5hYm91dC1tZV9fc2tpbGxzPmRpdlwiKS5hbmltYXRlZChcImZhZGVJblVwXCIpO1xyXG5cdCQoXCIuYXJ0aWNsZSwgLnBvcnRmb2xpby1zbGlkZXJfX3ByZXZpZXctY29udGFpbmVyXCIpLmFuaW1hdGVkKFwiZmFkZUluXCIpO1xyXG5cclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFBpZWNoYXJ0cyBhbmltYXRpb25cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQkKFwiLnBpZWNoYXJ0IC5waWVjaGFydF9fZmlsbFwiKS5lYWNoKGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgcGllID0gJCh0aGlzKTtcclxuXHRcdHBpZS53YXlwb2ludChmdW5jdGlvbihkaXIpIHtcclxuXHRcdFx0aWYgKGRpciA9PT0gXCJkb3duXCIpIHtcclxuXHRcdFx0XHRwaWUuY3NzKHtzdHJva2VEYXNob2Zmc2V0OnBpZS5kYXRhKFwicGVyY2VudGFnZVwiKX0pO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0b2Zmc2V0OiBcIjkwJVwiXHJcblx0XHRcdH0pO1xyXG5cdH0pO1xyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gUGFyYWxsYXhcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHR2YXIgaXNfdGhpc19pZSA9IGRldGVjdF9JRSgpO1xyXG5cclxuXHQvLyBJRSBzY3JvbGwganVtcCBmaXhcclxuXHRpZihpc190aGlzX2llKSB7XHJcblx0XHQkKFwiLmxheWVyXCIpLmNzcyh7dHJhbnNpdGlvbjpcInRvcCAuMTVzIGxpbmVhclwifSk7XHJcblx0XHQkKFwiI3NjZW5lLnZlcnRpY2FsXCIpLmNzcyh7dHJhbnNpdGlvbjpcIm9wYWNpdHkgLjE1cyBsaW5lYXJcIn0pO1xyXG5cclxuXHRcdCQoXCJib2R5XCIpLm9uKFwibW91c2V3aGVlbFwiLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IFxyXG5cclxuXHRcdFx0dmFyIHdoZWVsRGVsdGEgPSBldmVudC53aGVlbERlbHRhLFxyXG5cdFx0XHRcdGN1cnJlbnRTY3JvbGxQb3NpdGlvbiA9IHdpbmRvdy5wYWdlWU9mZnNldDtcclxuXHJcblx0XHRcdHdpbmRvdy5zY3JvbGxUbygwLCBjdXJyZW50U2Nyb2xsUG9zaXRpb24gLSB3aGVlbERlbHRhKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0aWYoJChcIiNzY2VuZS5heGlzXCIpLmxlbmd0aCl7XHJcblx0XHQkKFwiI3NjZW5lLmF4aXNcIikucGFyYWxsYXgoe1xyXG5cdFx0XHRzY2FsYXJYOiAzLFxyXG5cdFx0XHRzY2FsYXJZOiAzLFxyXG5cdFx0XHRmcmljdGlvblg6IDAuNSxcclxuXHRcdFx0ZnJpY3Rpb25ZOiAwLjVcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0aWYoJChcIiNzY2VuZS52ZXJ0aWNhbFwiKSl7XHJcblx0XHQkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgc2Nyb2xsUG9zID0gJCh0aGlzKS5zY3JvbGxUb3AoKTtcclxuXHJcblx0XHRcdCQoXCIjc2NlbmUudmVydGljYWwgLmxheWVyXCIpLmVhY2goZnVuY3Rpb24oKXtcclxuXHRcdFx0XHR2YXIgbGF5ZXIgPSAkKHRoaXMpO1xyXG5cclxuXHRcdFx0XHRpZihsYXllci5pbmRleCgpICE9MCApIHtcclxuXHRcdFx0XHRcdGxheWVyLmNzcyh7XHJcblx0XHRcdFx0XHRcdFwidG9wXCIgOiAoIChzY3JvbGxQb3MvKDUgKyAyKmxheWVyLmluZGV4KCkpKSApK1wicHhcIlxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0JChcIiNzY2VuZS52ZXJ0aWNhbFwiKS5jc3Moe1xyXG5cdFx0XHRcdFwib3BhY2l0eVwiIDogMS0oc2Nyb2xsUG9zLzcwMClcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIExvZ2luIGNhcmQgZmxpcFxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdCQoXCIubG9naW4tYnV0dG9uXCIpLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG5cdFx0JChcImJvZHlcIikuYWRkQ2xhc3MoXCJjYXJkX2ZsaXBwZWRcIik7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjdW5mbGlwLWNhcmRcIikuY2xpY2soZnVuY3Rpb24oKSB7XHJcblx0XHQkKFwiYm9keVwiKS5yZW1vdmVDbGFzcyhcImNhcmRfZmxpcHBlZFwiKTtcclxuXHR9KTtcclxuXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBNYWluIG1lbnVcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQkKFwiI21lbnUtdG9nZ2xlXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHQkKHRoaXMpLmFkZChcIi5tYWluLW1lbnVcIikudG9nZ2xlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIubWFpbi1tZW51X19pdGVtXCIpLmVhY2goZnVuY3Rpb24oaW5kZXgpIHtcclxuXHRcdCQodGhpcykuY3NzKFwidHJhbnNpdGlvbi1kZWxheVwiLCAwLjMrMC4xKmluZGV4ICsgXCJzXCIpO1xyXG5cdH0pO1xyXG5cclxuXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBCdXR0b25zXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0JChcImJ1dHRvbi5nby1kb3duXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgZ28gPSAkKHRoaXMpLmRhdGEoXCJsaW5rXCIpO1xyXG5cdFx0JChcImh0bWwsIGJvZHlcIikuc3RvcCgpLmFuaW1hdGUoe1xyXG5cdFx0XHRzY3JvbGxUb3A6ICQoZ28pLm9mZnNldCgpLnRvcFxyXG5cdFx0fSwgNzAwLCBcInN3aW5nXCIpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiYnV0dG9uLmdvLXVwXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHQkKFwiaHRtbCwgYm9keVwiKS5zdG9wKCkuYW5pbWF0ZSh7XHJcblx0XHRcdHNjcm9sbFRvcDogMFxyXG5cdFx0fSwgNzAwLCBcInN3aW5nXCIpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fdG9nZ2xlXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvblwiKS50b2dnbGVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHR9KTtcclxuXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBTbGlkZXJcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQkKFwiLnBvcnRmb2xpby1idXR0b25cIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdHZhciB0aGlzX2J1dHRvbiA9ICQodGhpcyksXHJcblx0XHRcdHRoaXNfdGh1bWJuYWlscyA9IHRoaXNfYnV0dG9uLm5leHQoKS5maW5kKFwiLnBvcnRmb2xpby10aHVtYm5haWxzX190aHVtYm5haWxcIiksXHJcblx0XHRcdHRoaXNfYWN0aXZlX3RodW1iID0gdGhpc190aHVtYm5haWxzLmZpbHRlcihcIi5hY3RpdmVcIiksXHJcblx0XHRcdHRoaXNfbmV4dF9pbmRleCA9IHRoaXNfdGh1bWJuYWlscy5pbmRleCh0aGlzX2FjdGl2ZV90aHVtYikgKyAxLFxyXG5cdFx0XHRvdGhlcl9idXR0b24gPSB0aGlzX2J1dHRvbi5wYXJlbnQoKS5zaWJsaW5ncygpLmZpbmQoXCIucG9ydGZvbGlvLWJ1dHRvblwiKSxcclxuXHRcdFx0b3RoZXJfdGh1bWJuYWlscyA9IG90aGVyX2J1dHRvbi5uZXh0KCkuZmluZChcIi5wb3J0Zm9saW8tdGh1bWJuYWlsc19fdGh1bWJuYWlsXCIpLFxyXG5cdFx0XHRvdGhlcl9hY3RpdmVfdGh1bWIgPSBvdGhlcl90aHVtYm5haWxzLmZpbHRlcihcIi5hY3RpdmVcIiksXHJcblx0XHRcdG90aGVyX25leHRfaW5kZXggPSBvdGhlcl90aHVtYm5haWxzLmluZGV4KG90aGVyX2FjdGl2ZV90aHVtYikgKyAxLFxyXG5cdFx0XHRhY3RpdmVfcHJldmlldyA9IHRoaXNfYnV0dG9uLmNsb3Nlc3QoXCIucG9ydGZvbGlvLXNsaWRlclwiKS5maW5kKFwiLnBvcnRmb2xpby1wcmV2aWV3XCIpLFxyXG5cdFx0XHRuZXh0X3ByZXZpZXcgPSB0aGlzX2FjdGl2ZV90aHVtYi5maW5kKFwiaW1nXCIpLmF0dHIoXCJzcmNcIik7XHJcblxyXG5cclxuXHRcdGlmKHRoaXNfbmV4dF9pbmRleCA+PSB0aGlzX3RodW1ibmFpbHMubGVuZ3RoKXtcclxuXHRcdFx0dGhpc19uZXh0X2luZGV4ID0gMDtcclxuXHRcdH1cclxuXHJcblx0XHRpZihvdGhlcl9uZXh0X2luZGV4ID49IG90aGVyX3RodW1ibmFpbHMubGVuZ3RoKXtcclxuXHRcdFx0b3RoZXJfbmV4dF9pbmRleCA9IDA7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIHRoaXNfbmV4dF90aHVtYiA9IHRoaXNfdGh1bWJuYWlscy5lcSh0aGlzX25leHRfaW5kZXgpLFxyXG5cdFx0XHRvdGhlcl9uZXh0X3RodW1iID0gb3RoZXJfdGh1bWJuYWlscy5lcShvdGhlcl9uZXh0X2luZGV4KTtcclxuXHJcblx0XHR0aGlzX2FjdGl2ZV90aHVtYi5hbmltYXRlKHtcclxuXHRcdFx0dG9wOiBcIi0xMDAlXCJcclxuXHRcdH0sIDcwMCk7XHJcblxyXG5cdFx0dGhpc19idXR0b24ucHJvcChcImRpc2FibGVkXCIsIHRydWUpO1xyXG5cdFx0b3RoZXJfYnV0dG9uLnByb3AoXCJkaXNhYmxlZFwiLCB0cnVlKTtcclxuXHJcblx0XHR0aGlzX25leHRfdGh1bWIuY3NzKHt0b3A6XCIxMDAlXCJ9KTtcclxuXHRcdHRoaXNfbmV4dF90aHVtYi5hbmltYXRlKHtcclxuXHRcdFx0dG9wOiAwXHJcblx0XHR9LCA3MDAsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR0aGlzX2FjdGl2ZV90aHVtYi5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKS5jc3Moe3RvcDpcIjEwMCVcIn0pO1xyXG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHR0aGlzX2J1dHRvbi5wcm9wKFwiZGlzYWJsZWRcIiwgZmFsc2UpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0b3RoZXJfYWN0aXZlX3RodW1iLmFuaW1hdGUoe1xyXG5cdFx0XHR0b3A6IFwiMTAwJVwiXHJcblx0XHR9LCA3MDApO1xyXG5cclxuXHRcdG90aGVyX25leHRfdGh1bWIuY3NzKHt0b3A6XCItMTAwJVwifSk7XHJcblx0XHRvdGhlcl9uZXh0X3RodW1iLmFuaW1hdGUoe1xyXG5cdFx0XHR0b3A6IDBcclxuXHRcdH0sIDcwMCwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdG90aGVyX2FjdGl2ZV90aHVtYi5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKS5jc3Moe3RvcDpcIi0xMDAlXCJ9KTtcclxuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0b3RoZXJfYnV0dG9uLnByb3AoXCJkaXNhYmxlZFwiLCBmYWxzZSk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRhY3RpdmVfcHJldmlldy5mYWRlT3V0KDM1MCwgZnVuY3Rpb24oKXtcclxuXHRcdFx0JCh0aGlzKS5hdHRyKFwic3JjXCIsIG5leHRfcHJldmlldykuZmFkZUluKDM1MCk7XHJcblx0XHR9KTtcclxuXHR9KTtcclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFNDUk9MTCBFVkVOVFNcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcblx0Ly8gU0NST0xMIE5BVklHQVRJT04gQkVHSU5cclxuXHR2YXIgbGFzdElkLFxyXG5cdFx0bWVudSA9ICQoXCIuYmxvZy1uYXZpZ2F0aW9uXCIpLFxyXG5cdFx0bWVudUl0ZW1zID0gbWVudS5maW5kKFwibGkgYVwiKSxcclxuXHRcdHNjcm9sbEl0ZW1zID0gbWVudUl0ZW1zLm1hcChmdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgaXRlbSA9ICQoJCh0aGlzKS5hdHRyKFwiaHJlZlwiKSk7XHJcblx0XHRcdGlmIChpdGVtLmxlbmd0aCkgcmV0dXJuIGl0ZW07XHJcblx0XHR9KTtcclxuXHJcblx0Ly8gQmluZCBjbGljayBoYW5kbGVyIHRvIG1lbnUgaXRlbXNcclxuXHQvLyBzbyB3ZSBjYW4gZ2V0IGEgZmFuY3kgc2Nyb2xsIGFuaW1hdGlvblxyXG5cdG1lbnVJdGVtcy5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdHZhciBocmVmID0gJCh0aGlzKS5hdHRyKFwiaHJlZlwiKSxcclxuXHRcdFx0b2Zmc2V0VG9wID0gKGhyZWYgPT09IFwiI1wiKSA/IDAgOiAkKGhyZWYpLm9mZnNldCgpLnRvcC02MDtcclxuXHRcdFxyXG5cdFx0JChcImh0bWwsIGJvZHlcIikuc3RvcCgpLmFuaW1hdGUoeyBcclxuXHRcdFx0c2Nyb2xsVG9wOiBvZmZzZXRUb3BcclxuXHRcdH0sIDcwMCwgXCJzd2luZ1wiKTtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHR9KTtcclxuXHJcblx0Ly8gQmluZCB0byBzY3JvbGxcclxuXHRpZigkKFwiLmJsb2ctbmF2aWdhdGlvblwiKS5vZmZzZXQoKSl7XHJcblx0XHQkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQvLyBHZXQgY29udGFpbmVyIHNjcm9sbCBwb3NpdGlvblxyXG5cdFx0XHR2YXIgZnJvbVRvcCA9ICQodGhpcykuc2Nyb2xsVG9wKCksXHJcblx0XHRcdFx0YmxvZ05hdk9mZnNldCA9ICQoXCIuYmxvZy1uYXZpZ2F0aW9uXCIpLm9mZnNldCgpLnRvcCxcclxuXHRcdFx0XHRibG9nTmF2TGltaXQgPSAkKFwiLmZvb3Rlcl9fd3JhcHBlclwiKS5vZmZzZXQoKS50b3AgLSAkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5vdXRlckhlaWdodCgpO1xyXG5cclxuXHRcdFx0Ly8gR2V0IGlkIG9mIGN1cnJlbnQgc2Nyb2xsIGl0ZW1cclxuXHRcdFx0dmFyIGN1ciA9IHNjcm9sbEl0ZW1zLm1hcChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdGlmICgkKHRoaXMpLm9mZnNldCgpLnRvcCA8IGZyb21Ub3ArMTQ0KVxyXG5cdFx0XHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHQvLyBHZXQgdGhlIGlkIG9mIHRoZSBjdXJyZW50IGVsZW1lbnRcclxuXHRcdFx0Y3VyID0gY3VyW2N1ci5sZW5ndGgtMV07XHJcblx0XHRcdHZhciBpZCA9IGN1ciAmJiBjdXIubGVuZ3RoID8gY3VyWzBdLmlkIDogXCJcIjtcclxuXHJcblx0XHRcdGlmIChsYXN0SWQgIT09IGlkKSB7XHJcblx0XHRcdFx0bGFzdElkID0gaWQ7XHJcblx0XHRcdFx0Ly8gU2V0L3JlbW92ZSBhY3RpdmUgY2xhc3NcclxuXHRcdFx0XHRtZW51SXRlbXNcclxuXHRcdFx0XHQucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIilcclxuXHRcdFx0XHQuZmlsdGVyKFwiW2hyZWY9I1wiK2lkK1wiXVwiKVxyXG5cdFx0XHRcdC5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYoZnJvbVRvcCA+PSBibG9nTmF2TGltaXQgJiYgJCh3aW5kb3cpLndpZHRoKCkgPiAoNzY4IC0gc2Nyb2xsQmFyV2lkdGgpKSB7XHJcblx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikuY3NzKHtcInBvc2l0aW9uXCI6XCJhYnNvbHV0ZVwiLCBcInRvcFwiOmJsb2dOYXZMaW1pdCArIFwicHhcIn0pO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGZyb21Ub3AgPj0gYmxvZ05hdk9mZnNldCAmJiAkKHdpbmRvdykud2lkdGgoKSA+ICg3NjggLSBzY3JvbGxCYXJXaWR0aCkpIHtcclxuXHRcdFx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5jc3Moe1wicG9zaXRpb25cIjpcImZpeGVkXCIsIFwidG9wXCI6MH0pO1xyXG5cdFx0XHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uX193cmFwcGVyXCIpLmFkZENsYXNzKFwibmF2LWZpeGVkXCIpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uX193cmFwcGVyXCIpLmNzcyh7XCJwb3NpdGlvblwiOlwicmVsYXRpdmVcIn0pO1xyXG5cdFx0XHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uX193cmFwcGVyXCIpLnJlbW92ZUNsYXNzKFwibmF2LWZpeGVkXCIpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSk7XHJcblx0fVxyXG5cdC8vIFNDUk9MTCBOQVZJR0FUSU9OIEVORFxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gUkVTSVpFIEVWRU5UU1xyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGlmKCQoXCIuYmxvZy1uYXZpZ2F0aW9uXCIpLm9mZnNldCgpKXtcclxuXHRcdCQod2luZG93KS5yZXNpemUoZnVuY3Rpb24oKSB7XHJcblx0XHRcdGlmKCQod2luZG93KS53aWR0aCgpIDw9ICg3NjggLSBzY3JvbGxCYXJXaWR0aCkpe1xyXG5cdFx0XHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uX193cmFwcGVyXCIpLnJlbW92ZUNsYXNzKFwibmF2LWZpeGVkXCIpO1xyXG5cdFx0XHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uX193cmFwcGVyXCIpLmNzcyh7XCJwb3NpdGlvblwiOlwicmVsYXRpdmVcIn0pO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlmKCQoXCJib2R5XCIpLnNjcm9sbFRvcCgpID49ICQoXCIuYmxvZ1wiKS5vZmZzZXQoKS50b3Ape1xyXG5cdFx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikuY3NzKHtcInBvc2l0aW9uXCI6XCJmaXhlZFwiLCBcInRvcFwiOjB9KTtcclxuXHRcdFx0XHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uX193cmFwcGVyXCIpLmFkZENsYXNzKFwibmF2LWZpeGVkXCIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHJcblx0JCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbigpIHtcclxuXHRcdC8vIFRlc3RpbW9uaWFscyBzZWN0aW9uIGJnIHNpemVcclxuXHRcdGlmKCAkKHdpbmRvdykud2lkdGgoKT4yMDAwIC0gc2Nyb2xsQmFyV2lkdGgpe1xyXG5cdFx0XHQkKFwiLnRhbGtzLCAuY29udGFjdC1mb3JtX19iZ1wiKS5jc3MoXCJiYWNrZ3JvdW5kLXNpemVcIiwgJCh3aW5kb3cpLndpZHRoKCkgKyBcInB4XCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gUHJlbG9hZGVyIHdpdGggcGVyY2VudGFnZSBieSBpbnRlcnZhbFxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIGZ1bmN0aW9uIHByZWxvYWRlcigpIHtcclxuXHQvLyBcdHZhciBkdXJhdGlvbiA9IDEwMDA7XHJcblx0Ly8gXHR2YXIgc3QgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuXHJcblx0Ly8gXHR2YXIgJGNpcmNsZV9fbyA9ICQoXCIjcHJlbG9hZGVyLXN2Z19faW1nIC5iYXJfX291dGVyXCIpLFxyXG5cdC8vIFx0XHQkY2lyY2xlX19jID0gJChcIiNwcmVsb2FkZXItc3ZnX19pbWcgLmJhcl9fY2VudGVyXCIpLFxyXG5cdC8vIFx0XHQkY2lyY2xlX19pID0gJChcIiNwcmVsb2FkZXItc3ZnX19pbWcgLmJhcl9faW5uZXJcIik7XHJcblxyXG5cdC8vIFx0dmFyIGNfbyA9IE1hdGguUEkqKCRjaXJjbGVfX28uYXR0cihcInJcIikgKiAyKSxcclxuXHQvLyBcdFx0Y19jID0gTWF0aC5QSSooJGNpcmNsZV9fYy5hdHRyKFwiclwiKSAqIDIpLFxyXG5cdC8vIFx0XHRjX2kgPSBNYXRoLlBJKigkY2lyY2xlX19pLmF0dHIoXCJyXCIpICogMik7XHJcblxyXG5cclxuXHQvLyBcdHZhciBpbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xyXG5cdC8vIFx0XHR2YXIgZGlmZiA9IE1hdGgucm91bmQobmV3IERhdGUoKS5nZXRUaW1lKCkgLSBzdCksXHJcblx0Ly8gXHRcdFx0dmFsID0gTWF0aC5yb3VuZChkaWZmIC8gZHVyYXRpb24gKiAxMDApO1xyXG5cclxuXHQvLyBcdFx0dmFsID0gdmFsID4gMTAwID8gMTAwIDogdmFsO1xyXG5cclxuXHQvLyBcdFx0dmFyIHBjdF9vID0gKCgxMDAtdmFsKS8xMDApKmNfbyxcclxuXHQvLyBcdFx0XHRwY3RfYyA9ICgoMTAwLXZhbCkvMTAwKSpjX2MsXHJcblx0Ly8gXHRcdFx0cGN0X2kgPSAoKDEwMC12YWwpLzEwMCkqY19pO1xyXG5cclxuXHQvLyBcdFx0JGNpcmNsZV9fby5jc3Moe3N0cm9rZURhc2hvZmZzZXQ6IHBjdF9vfSk7XHJcblx0Ly8gXHRcdCRjaXJjbGVfX2MuY3NzKHtzdHJva2VEYXNob2Zmc2V0OiBwY3RfY30pO1xyXG5cdC8vIFx0XHQkY2lyY2xlX19pLmNzcyh7c3Ryb2tlRGFzaG9mZnNldDogcGN0X2l9KTtcclxuXHJcblx0Ly8gXHRcdCQoXCIjcHJlbG9hZGVyLXN2Z19fcGVyY2VudGFnZVwiKS50ZXh0KHZhbCk7XHJcblx0Ly8gXHRcdCQoXCIjcHJlbG9hZGVyLXN2Z19faW1nXCIpLmNzcyh7b3BhY2l0eToxfSk7XHJcblxyXG5cdC8vIFx0XHRpZiAoZGlmZiA+PSBkdXJhdGlvbikge1xyXG5cdC8vIFx0XHRcdGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xyXG5cclxuXHQvLyBcdFx0XHRpZigkKFwiLmZsaXAtY2FyZFwiKS5sZW5ndGgpe1xyXG5cdC8vIFx0XHRcdFx0JChcIiNwcmVsb2FkZXJcIikuZGVsYXkoMTAwMCkuZmFkZU91dCg3MDAsIGZ1bmN0aW9uKCl7XHJcblx0Ly8gXHRcdFx0XHRcdCQoXCIjcHJlbG9hZGVyX19wcm9ncmVzc1wiKS5yZW1vdmUoKTtcclxuXHQvLyBcdFx0XHRcdFx0JChcIi5mbGlwLWNhcmRcIikuYWRkQ2xhc3MoXCJsb2FkZWRcIik7XHJcblx0Ly8gXHRcdFx0XHR9KTtcclxuXHQvLyBcdFx0XHR9IGVsc2Uge1xyXG5cdC8vIFx0XHRcdFx0JChcIiNwcmVsb2FkZXJcIikuZGVsYXkoMTAwMCkuZmFkZU91dCg3MDAsIGZ1bmN0aW9uKCl7XHJcblx0Ly8gXHRcdFx0XHRcdCQoXCIjcHJlbG9hZGVyX19wcm9ncmVzc1wiKS5yZW1vdmUoKTtcclxuXHQvLyBcdFx0XHRcdH0pO1xyXG5cdC8vIFx0XHRcdH1cclxuXHQvLyBcdFx0fVxyXG5cdC8vIFx0fSwgMjAwKTtcclxuXHQvLyB9XHJcblx0Ly8gcHJlbG9hZGVyKCk7XHJcblxyXG5cclxufSkoalF1ZXJ5KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
