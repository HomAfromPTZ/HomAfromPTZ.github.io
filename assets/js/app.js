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
			this_next_index = this_thumbnails.index(this_active_thumb) + 1;

		var other_button = this_button.parent().siblings().find(".portfolio-button"),
			other_thumbnails = other_button.next().find(".portfolio-thumbnails__thumbnail"),
			other_active_thumb = other_thumbnails.filter(".active"),
			other_next_index = other_thumbnails.index(other_active_thumb) + 1;

		var active_preview = this_button.closest(".portfolio-slider").find(".portfolio-preview"),
			next_preview = this_active_thumb.find("img").attr("src"),
			projects = this_button.closest(".portfolio-slider").find(".portfolio-projects .project"),
			active_project = projects.filter(".active"),
			next_project_index = projects.index(active_project)+1;

		if(this_next_index >= this_thumbnails.length){
			this_next_index = 0;
		}

		if(other_next_index >= other_thumbnails.length){
			other_next_index = 0;
		}

		if(next_project_index >= projects.length){
			next_project_index = 0;
		}

		var this_next_thumb = this_thumbnails.eq(this_next_index),
			other_next_thumb = other_thumbnails.eq(other_next_index),
			next_project = projects.eq(next_project_index);

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

		active_project.fadeOut(350, function(){
			$(this).removeClass("active");
			next_project.addClass("active").fadeIn(350);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCQpIHtcclxuXHRcInVzZSBzdHJpY3RcIjtcclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gQ2hlY2sgc2Nyb2xsYmFyIHdpZHRoXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0dmFyIHdpZHRoQ29udGVudEEgPSAkKFwiI3Njcm9sbF9iYXJfY2hlY2tfQVwiKS53aWR0aCgpLFxyXG5cdFx0d2lkdGhDb250ZW50QiA9ICQoXCIjc2Nyb2xsX2Jhcl9jaGVja19CXCIpLndpZHRoKCk7XHJcblxyXG5cdHZhciBzY3JvbGxCYXJXaWR0aCA9IHdpZHRoQ29udGVudEEgLSB3aWR0aENvbnRlbnRCO1xyXG5cclxuXHQkKFwiI3Njcm9sbF9iYXJfY2hlY2tfQVwiKS5jc3MoXCJkaXNwbGF5XCIsXCJub25lXCIpO1xyXG5cclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIENoZWNrIElFIHZlcnNpb25cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRmdW5jdGlvbiBkZXRlY3RfSUUoKSB7XHJcblx0XHR2YXIgdWEgPSB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudDtcclxuXHJcblx0XHR2YXIgbXNpZSA9IHVhLmluZGV4T2YoXCJNU0lFIFwiKTtcclxuXHRcdGlmIChtc2llID4gMCkge1xyXG5cdFx0XHQvLyBJRSAxMCBvciBvbGRlciA9PiByZXR1cm4gdmVyc2lvbiBudW1iZXJcclxuXHRcdFx0cmV0dXJuIHBhcnNlSW50KHVhLnN1YnN0cmluZyhtc2llICsgNSwgdWEuaW5kZXhPZihcIi5cIiwgbXNpZSkpLCAxMCk7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIHRyaWRlbnQgPSB1YS5pbmRleE9mKFwiVHJpZGVudC9cIik7XHJcblx0XHRpZiAodHJpZGVudCA+IDApIHtcclxuXHRcdFx0Ly8gSUUgMTEgPT4gcmV0dXJuIHZlcnNpb24gbnVtYmVyXHJcblx0XHRcdHZhciBydiA9IHVhLmluZGV4T2YoXCJydjpcIik7XHJcblx0XHRcdHJldHVybiBwYXJzZUludCh1YS5zdWJzdHJpbmcocnYgKyAzLCB1YS5pbmRleE9mKFwiLlwiLCBydikpLCAxMCk7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIGVkZ2UgPSB1YS5pbmRleE9mKFwiRWRnZS9cIik7XHJcblx0XHRpZiAoZWRnZSA+IDApIHtcclxuXHRcdFx0Ly8gRWRnZSAoSUUgMTIrKSA9PiByZXR1cm4gdmVyc2lvbiBudW1iZXJcclxuXHRcdFx0cmV0dXJuIHBhcnNlSW50KHVhLnN1YnN0cmluZyhlZGdlICsgNSwgdWEuaW5kZXhPZihcIi5cIiwgZWRnZSkpLCAxMCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gb3RoZXIgYnJvd3NlclxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBQcmVsb2FkZXIgd2l0aCBwZXJjZW50YWdlIGJ5IGltYWdlIGNvdW50XHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0ZnVuY3Rpb24gcHJlbG9hZGVyKCkge1xyXG5cdFx0dmFyIHByZWxvYWRlcl9zdGF0ID0gJChcIiNwcmVsb2FkZXItc3ZnX19wZXJjZW50YWdlXCIpLFxyXG5cdFx0XHRoYXNJbWFnZVByb3BlcnRpZXMgPSBbXCJiYWNrZ3JvdW5kSW1hZ2VcIiwgXCJsaXN0U3R5bGVJbWFnZVwiLCBcImJvcmRlckltYWdlXCIsIFwiYm9yZGVyQ29ybmVySW1hZ2VcIiwgXCJjdXJzb3JcIl0sXHJcblx0XHRcdGhhc0ltYWdlQXR0cmlidXRlcyA9IFtcInNyY3NldFwiXSxcclxuXHRcdFx0bWF0Y2hfdXJsID0gL3VybFxcKFxccyooWydcIl0/KSguKj8pXFwxXFxzKlxcKS9nLFxyXG5cdFx0XHRhbGxfaW1hZ2VzID0gW10sXHJcblx0XHRcdHRvdGFsID0gMCxcclxuXHRcdFx0Y291bnQgPSAwO1xyXG5cclxuXHRcdHZhciBjaXJjbGVfbyA9ICQoXCIjcHJlbG9hZGVyLXN2Z19faW1nIC5iYXJfX291dGVyXCIpLFxyXG5cdFx0XHRjaXJjbGVfYyA9ICQoXCIjcHJlbG9hZGVyLXN2Z19faW1nIC5iYXJfX2NlbnRlclwiKSxcclxuXHRcdFx0Y2lyY2xlX2kgPSAkKFwiI3ByZWxvYWRlci1zdmdfX2ltZyAuYmFyX19pbm5lclwiKSxcclxuXHRcdFx0bGVuZ3RoX28gPSBNYXRoLlBJKihjaXJjbGVfby5hdHRyKFwiclwiKSAqIDIpLFxyXG5cdFx0XHRsZW5ndGhfYyA9IE1hdGguUEkqKGNpcmNsZV9jLmF0dHIoXCJyXCIpICogMiksXHJcblx0XHRcdGxlbmd0aF9pID0gTWF0aC5QSSooY2lyY2xlX2kuYXR0cihcInJcIikgKiAyKTtcclxuXHJcblxyXG5cdFx0ZnVuY3Rpb24gaW1nX2xvYWRlZCgpe1xyXG5cdFx0XHR2YXIgcGVyY2VudGFnZSA9IE1hdGguY2VpbCggKytjb3VudCAvIHRvdGFsICogMTAwICk7XHJcblxyXG5cdFx0XHRwZXJjZW50YWdlID0gcGVyY2VudGFnZSA+IDEwMCA/IDEwMCA6IHBlcmNlbnRhZ2U7XHJcblxyXG5cdFx0XHQvLyBEcmF3IG9mZnNldHNcclxuXHRcdFx0Y2lyY2xlX28uY3NzKHtzdHJva2VEYXNob2Zmc2V0OiAoKDEwMC1wZXJjZW50YWdlKS8xMDApKmxlbmd0aF9vIH0pO1xyXG5cclxuXHRcdFx0aWYocGVyY2VudGFnZSA+IDUwKSB7XHJcblx0XHRcdFx0Y2lyY2xlX2MuY3NzKHtzdHJva2VEYXNob2Zmc2V0OiAoKDEwMC1wZXJjZW50YWdlKS8xMDApKmxlbmd0aF9jIH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZihwZXJjZW50YWdlID09IDEwMCkge1xyXG5cdFx0XHRcdGNpcmNsZV9pLmNzcyh7c3Ryb2tlRGFzaG9mZnNldDogKCgxMDAtcGVyY2VudGFnZSkvMTAwKSpsZW5ndGhfaSB9KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cHJlbG9hZGVyX3N0YXQuaHRtbChwZXJjZW50YWdlKTtcclxuXHJcblx0XHRcdGlmKGNvdW50ID09PSB0b3RhbCkgcmV0dXJuIGRvbmVfbG9hZGluZygpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIGRvbmVfbG9hZGluZygpe1xyXG5cdFx0XHQkKFwiI3ByZWxvYWRlclwiKS5kZWxheSg3MDApLmZhZGVPdXQoNzAwLCBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdCQoXCIjcHJlbG9hZGVyX19wcm9ncmVzc1wiKS5yZW1vdmUoKTtcclxuXHJcblx0XHRcdFx0aWYoJChcIi5mbGlwLWNhcmRcIikubGVuZ3RoKXtcclxuXHRcdFx0XHRcdCQoXCIuZmxpcC1jYXJkXCIpLmFkZENsYXNzKFwibG9hZGVkXCIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gaW1hZ2VzX2xvb3AgKCkge1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHR2YXIgdGVzdF9pbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG5cclxuXHRcdFx0XHR0ZXN0X2ltYWdlLm9ubG9hZCA9IGltZ19sb2FkZWQ7XHJcblx0XHRcdFx0dGVzdF9pbWFnZS5vbmVycm9yID0gaW1nX2xvYWRlZDtcclxuXHJcblx0XHRcdFx0Ly8gY29uc29sZS5sb2coXCJDOiBcIiArIGNvdW50LCBcIiBUOiBcIiArIHRvdGFsKTtcclxuXHJcblx0XHRcdFx0aWYgKGNvdW50ICE9IHRvdGFsKSB7XHJcblx0XHRcdFx0XHRpZiAoYWxsX2ltYWdlc1tjb3VudF0uc3Jjc2V0KSB7XHJcblx0XHRcdFx0XHRcdHRlc3RfaW1hZ2Uuc3Jjc2V0ID0gYWxsX2ltYWdlc1tjb3VudF0uc3Jjc2V0O1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0dGVzdF9pbWFnZS5zcmMgPSBhbGxfaW1hZ2VzW2NvdW50XS5zcmM7XHJcblxyXG5cdFx0XHRcdFx0aW1hZ2VzX2xvb3AoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sIDUwKTtcclxuXHRcdH1cclxuXHJcblx0XHQkKFwiKlwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0dmFyIGVsZW1lbnQgPSAkKHRoaXMpO1xyXG5cclxuXHRcdFx0aWYgKGVsZW1lbnQuaXMoXCJpbWdcIikgJiYgZWxlbWVudC5hdHRyKFwic3JjXCIpKSB7XHJcblx0XHRcdFx0YWxsX2ltYWdlcy5wdXNoKHtcclxuXHRcdFx0XHRcdHNyYzogZWxlbWVudC5hdHRyKFwic3JjXCIpLFxyXG5cdFx0XHRcdFx0ZWxlbWVudDogZWxlbWVudFswXVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQkLmVhY2goaGFzSW1hZ2VQcm9wZXJ0aWVzLCBmdW5jdGlvbiAoaSwgcHJvcGVydHkpIHtcclxuXHRcdFx0XHR2YXIgcHJvcGVydHlWYWx1ZSA9IGVsZW1lbnQuY3NzKHByb3BlcnR5KTtcclxuXHRcdFx0XHR2YXIgbWF0Y2g7XHJcblxyXG5cdFx0XHRcdGlmICghcHJvcGVydHlWYWx1ZSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRtYXRjaCA9IG1hdGNoX3VybC5leGVjKHByb3BlcnR5VmFsdWUpO1xyXG5cclxuXHRcdFx0XHRpZiAobWF0Y2gpIHtcclxuXHRcdFx0XHRcdGFsbF9pbWFnZXMucHVzaCh7XHJcblx0XHRcdFx0XHRcdHNyYzogbWF0Y2hbMl0sXHJcblx0XHRcdFx0XHRcdGVsZW1lbnQ6IGVsZW1lbnRbMF1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQkLmVhY2goaGFzSW1hZ2VBdHRyaWJ1dGVzLCBmdW5jdGlvbiAoaSwgYXR0cmlidXRlKSB7XHJcblx0XHRcdFx0dmFyIGF0dHJpYnV0ZVZhbHVlID0gZWxlbWVudC5hdHRyKGF0dHJpYnV0ZSk7XHJcblxyXG5cdFx0XHRcdGlmICghYXR0cmlidXRlVmFsdWUpIHtcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0YWxsX2ltYWdlcy5wdXNoKHtcclxuXHRcdFx0XHRcdHNyYzogZWxlbWVudC5hdHRyKFwic3JjXCIpLFxyXG5cdFx0XHRcdFx0c3Jjc2V0OiBlbGVtZW50LmF0dHIoXCJzcmNzZXRcIiksXHJcblx0XHRcdFx0XHRlbGVtZW50OiBlbGVtZW50WzBdXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0dG90YWwgPSBhbGxfaW1hZ2VzLmxlbmd0aDtcclxuXHJcblx0XHRpZiAodG90YWwgPT09IDApIHtcclxuXHRcdFx0ZG9uZV9sb2FkaW5nKCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRwcmVsb2FkZXJfc3RhdC5jc3Moe29wYWNpdHk6IDF9KTtcclxuXHRcdFx0aW1hZ2VzX2xvb3AoKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBmb3IodmFyIGk9MDsgaTx0b3RhbDsgaSsrKXtcclxuXHRcdC8vIFx0dmFyIHRlc3RfaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuXHJcblxyXG5cdFx0Ly8gXHR0ZXN0X2ltYWdlLm9ubG9hZCA9IGltZ19sb2FkZWQ7XHJcblx0XHQvLyBcdHRlc3RfaW1hZ2Uub25lcnJvciA9IGltZ19sb2FkZWQ7XHJcblxyXG5cdFx0Ly8gXHRpZiAoYWxsX2ltYWdlc1tpXS5zcmNzZXQpIHtcclxuXHRcdC8vIFx0XHR0ZXN0X2ltYWdlLnNyY3NldCA9IGFsbF9pbWFnZXNbaV0uc3Jjc2V0O1xyXG5cdFx0Ly8gXHR9XHJcblx0XHQvLyBcdHRlc3RfaW1hZ2Uuc3JjID0gYWxsX2ltYWdlc1tpXS5zcmM7XHJcblx0XHQvLyB9XHJcblx0fVxyXG5cclxuXHRwcmVsb2FkZXIoKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFBhZ2UgY2hhbmdlclxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdCQoZG9jdW1lbnQpLm9uKFwiY2xpY2tcIiwgXCJhLnByZWxvYWQtbGlua1wiLCBmdW5jdGlvbihlKSB7XHJcblx0XHR2YXIgaHJlZiA9ICQodGhpcykuYXR0cihcImhyZWZcIik7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0cmV0dXJuICQoXCIjcHJlbG9hZGVyXCIpXHJcblx0XHRcdC5mYWRlSW4oMzAwLCBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHJldHVybiBkb2N1bWVudC5sb2NhdGlvbiA9IGhyZWYgIT0gbnVsbCA/IGhyZWYgOiBcIi9cIjtcclxuXHRcdFx0fSk7XHJcblx0fSk7XHJcblxyXG5cclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIEFuaW1hdGlvbnNcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQkLmZuLmFuaW1hdGVkID0gZnVuY3Rpb24oaW5FZmZlY3QpIHtcclxuXHRcdCQodGhpcykuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHRocyA9ICQodGhpcyk7XHJcblx0XHRcdHRocy5jc3Moe29wYWNpdHk6MH0pXHJcblx0XHRcdFx0LmFkZENsYXNzKFwiYW5pbWF0ZWRcIilcclxuXHRcdFx0XHQud2F5cG9pbnQoZnVuY3Rpb24oZGlyKSB7XHJcblx0XHRcdFx0XHRpZiAoZGlyID09PSBcImRvd25cIikge1xyXG5cdFx0XHRcdFx0XHR0aHMuYWRkQ2xhc3MoaW5FZmZlY3QpLmNzcyh7b3BhY2l0eToxfSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRvZmZzZXQ6IFwiOTAlXCJcclxuXHRcdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH07XHJcblxyXG5cdCQoXCJoZWFkZXIgLnN2Zy1oZWFkaW5nLCAudGFsa3MgLnN2Zy1oZWFkaW5nLCAudGFsa3MgLnRlc3RpbW9uaWFsXCIpLmFuaW1hdGVkKFwiZmFkZUluVXBcIik7XHJcblx0JChcIi5wb3J0Zm9saW8tc2xpZGVyX19tb2R1bGU+ZGl2LCAuYWJvdXQtbWVfX3NraWxscz5kaXZcIikuYW5pbWF0ZWQoXCJmYWRlSW5VcFwiKTtcclxuXHQkKFwiLmFydGljbGUsIC5wb3J0Zm9saW8tc2xpZGVyX19wcmV2aWV3LWNvbnRhaW5lclwiKS5hbmltYXRlZChcImZhZGVJblwiKTtcclxuXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBQaWVjaGFydHMgYW5pbWF0aW9uXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0JChcIi5waWVjaGFydCAucGllY2hhcnRfX2ZpbGxcIikuZWFjaChmdW5jdGlvbigpe1xyXG5cdFx0dmFyIHBpZSA9ICQodGhpcyk7XHJcblx0XHRwaWUud2F5cG9pbnQoZnVuY3Rpb24oZGlyKSB7XHJcblx0XHRcdGlmIChkaXIgPT09IFwiZG93blwiKSB7XHJcblx0XHRcdFx0cGllLmNzcyh7c3Ryb2tlRGFzaG9mZnNldDpwaWUuZGF0YShcInBlcmNlbnRhZ2VcIil9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG9mZnNldDogXCI5MCVcIlxyXG5cdFx0XHR9KTtcclxuXHR9KTtcclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFBhcmFsbGF4XHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0dmFyIGlzX3RoaXNfaWUgPSBkZXRlY3RfSUUoKTtcclxuXHJcblx0Ly8gSUUgc2Nyb2xsIGp1bXAgZml4XHJcblx0aWYoaXNfdGhpc19pZSkge1xyXG5cdFx0JChcIi5sYXllclwiKS5jc3Moe3RyYW5zaXRpb246XCJ0b3AgLjE1cyBsaW5lYXJcIn0pO1xyXG5cdFx0JChcIiNzY2VuZS52ZXJ0aWNhbFwiKS5jc3Moe3RyYW5zaXRpb246XCJvcGFjaXR5IC4xNXMgbGluZWFyXCJ9KTtcclxuXHJcblx0XHQkKFwiYm9keVwiKS5vbihcIm1vdXNld2hlZWxcIiwgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpOyBcclxuXHJcblx0XHRcdHZhciB3aGVlbERlbHRhID0gZXZlbnQud2hlZWxEZWx0YSxcclxuXHRcdFx0XHRjdXJyZW50U2Nyb2xsUG9zaXRpb24gPSB3aW5kb3cucGFnZVlPZmZzZXQ7XHJcblxyXG5cdFx0XHR3aW5kb3cuc2Nyb2xsVG8oMCwgY3VycmVudFNjcm9sbFBvc2l0aW9uIC0gd2hlZWxEZWx0YSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGlmKCQoXCIjc2NlbmUuYXhpc1wiKS5sZW5ndGgpe1xyXG5cdFx0JChcIiNzY2VuZS5heGlzXCIpLnBhcmFsbGF4KHtcclxuXHRcdFx0c2NhbGFyWDogMyxcclxuXHRcdFx0c2NhbGFyWTogMyxcclxuXHRcdFx0ZnJpY3Rpb25YOiAwLjUsXHJcblx0XHRcdGZyaWN0aW9uWTogMC41XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGlmKCQoXCIjc2NlbmUudmVydGljYWxcIikpe1xyXG5cdFx0JCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHNjcm9sbFBvcyA9ICQodGhpcykuc2Nyb2xsVG9wKCk7XHJcblxyXG5cdFx0XHQkKFwiI3NjZW5lLnZlcnRpY2FsIC5sYXllclwiKS5lYWNoKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dmFyIGxheWVyID0gJCh0aGlzKTtcclxuXHJcblx0XHRcdFx0aWYobGF5ZXIuaW5kZXgoKSAhPTAgKSB7XHJcblx0XHRcdFx0XHRsYXllci5jc3Moe1xyXG5cdFx0XHRcdFx0XHRcInRvcFwiIDogKCAoc2Nyb2xsUG9zLyg1ICsgMipsYXllci5pbmRleCgpKSkgKStcInB4XCJcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRcdCQoXCIjc2NlbmUudmVydGljYWxcIikuY3NzKHtcclxuXHRcdFx0XHRcIm9wYWNpdHlcIiA6IDEtKHNjcm9sbFBvcy83MDApXHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBMb2dpbiBjYXJkIGZsaXBcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQkKFwiLmxvZ2luLWJ1dHRvblwiKS5jbGljayhmdW5jdGlvbigpIHtcclxuXHRcdCQoXCJib2R5XCIpLmFkZENsYXNzKFwiY2FyZF9mbGlwcGVkXCIpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiI3VuZmxpcC1jYXJkXCIpLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG5cdFx0JChcImJvZHlcIikucmVtb3ZlQ2xhc3MoXCJjYXJkX2ZsaXBwZWRcIik7XHJcblx0fSk7XHJcblxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gTWFpbiBtZW51XHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0JChcIiNtZW51LXRvZ2dsZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0JCh0aGlzKS5hZGQoXCIubWFpbi1tZW51XCIpLnRvZ2dsZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiLm1haW4tbWVudV9faXRlbVwiKS5lYWNoKGZ1bmN0aW9uKGluZGV4KSB7XHJcblx0XHQkKHRoaXMpLmNzcyhcInRyYW5zaXRpb24tZGVsYXlcIiwgMC4zKzAuMSppbmRleCArIFwic1wiKTtcclxuXHR9KTtcclxuXHJcblxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gQnV0dG9uc1xyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdCQoXCJidXR0b24uZ28tZG93blwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0dmFyIGdvID0gJCh0aGlzKS5kYXRhKFwibGlua1wiKTtcclxuXHRcdCQoXCJodG1sLCBib2R5XCIpLnN0b3AoKS5hbmltYXRlKHtcclxuXHRcdFx0c2Nyb2xsVG9wOiAkKGdvKS5vZmZzZXQoKS50b3BcclxuXHRcdH0sIDcwMCwgXCJzd2luZ1wiKTtcclxuXHR9KTtcclxuXHJcblx0JChcImJ1dHRvbi5nby11cFwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0JChcImh0bWwsIGJvZHlcIikuc3RvcCgpLmFuaW1hdGUoe1xyXG5cdFx0XHRzY3JvbGxUb3A6IDBcclxuXHRcdH0sIDcwMCwgXCJzd2luZ1wiKTtcclxuXHR9KTtcclxuXHJcblx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3RvZ2dsZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0JChcIi5ibG9nLW5hdmlnYXRpb25cIikudG9nZ2xlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0fSk7XHJcblxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gU2xpZGVyXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0JChcIi5wb3J0Zm9saW8tYnV0dG9uXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgdGhpc19idXR0b24gPSAkKHRoaXMpLFxyXG5cdFx0XHR0aGlzX3RodW1ibmFpbHMgPSB0aGlzX2J1dHRvbi5uZXh0KCkuZmluZChcIi5wb3J0Zm9saW8tdGh1bWJuYWlsc19fdGh1bWJuYWlsXCIpLFxyXG5cdFx0XHR0aGlzX2FjdGl2ZV90aHVtYiA9IHRoaXNfdGh1bWJuYWlscy5maWx0ZXIoXCIuYWN0aXZlXCIpLFxyXG5cdFx0XHR0aGlzX25leHRfaW5kZXggPSB0aGlzX3RodW1ibmFpbHMuaW5kZXgodGhpc19hY3RpdmVfdGh1bWIpICsgMTtcclxuXHJcblx0XHR2YXIgb3RoZXJfYnV0dG9uID0gdGhpc19idXR0b24ucGFyZW50KCkuc2libGluZ3MoKS5maW5kKFwiLnBvcnRmb2xpby1idXR0b25cIiksXHJcblx0XHRcdG90aGVyX3RodW1ibmFpbHMgPSBvdGhlcl9idXR0b24ubmV4dCgpLmZpbmQoXCIucG9ydGZvbGlvLXRodW1ibmFpbHNfX3RodW1ibmFpbFwiKSxcclxuXHRcdFx0b3RoZXJfYWN0aXZlX3RodW1iID0gb3RoZXJfdGh1bWJuYWlscy5maWx0ZXIoXCIuYWN0aXZlXCIpLFxyXG5cdFx0XHRvdGhlcl9uZXh0X2luZGV4ID0gb3RoZXJfdGh1bWJuYWlscy5pbmRleChvdGhlcl9hY3RpdmVfdGh1bWIpICsgMTtcclxuXHJcblx0XHR2YXIgYWN0aXZlX3ByZXZpZXcgPSB0aGlzX2J1dHRvbi5jbG9zZXN0KFwiLnBvcnRmb2xpby1zbGlkZXJcIikuZmluZChcIi5wb3J0Zm9saW8tcHJldmlld1wiKSxcclxuXHRcdFx0bmV4dF9wcmV2aWV3ID0gdGhpc19hY3RpdmVfdGh1bWIuZmluZChcImltZ1wiKS5hdHRyKFwic3JjXCIpLFxyXG5cdFx0XHRwcm9qZWN0cyA9IHRoaXNfYnV0dG9uLmNsb3Nlc3QoXCIucG9ydGZvbGlvLXNsaWRlclwiKS5maW5kKFwiLnBvcnRmb2xpby1wcm9qZWN0cyAucHJvamVjdFwiKSxcclxuXHRcdFx0YWN0aXZlX3Byb2plY3QgPSBwcm9qZWN0cy5maWx0ZXIoXCIuYWN0aXZlXCIpLFxyXG5cdFx0XHRuZXh0X3Byb2plY3RfaW5kZXggPSBwcm9qZWN0cy5pbmRleChhY3RpdmVfcHJvamVjdCkrMTtcclxuXHJcblx0XHRpZih0aGlzX25leHRfaW5kZXggPj0gdGhpc190aHVtYm5haWxzLmxlbmd0aCl7XHJcblx0XHRcdHRoaXNfbmV4dF9pbmRleCA9IDA7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYob3RoZXJfbmV4dF9pbmRleCA+PSBvdGhlcl90aHVtYm5haWxzLmxlbmd0aCl7XHJcblx0XHRcdG90aGVyX25leHRfaW5kZXggPSAwO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmKG5leHRfcHJvamVjdF9pbmRleCA+PSBwcm9qZWN0cy5sZW5ndGgpe1xyXG5cdFx0XHRuZXh0X3Byb2plY3RfaW5kZXggPSAwO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciB0aGlzX25leHRfdGh1bWIgPSB0aGlzX3RodW1ibmFpbHMuZXEodGhpc19uZXh0X2luZGV4KSxcclxuXHRcdFx0b3RoZXJfbmV4dF90aHVtYiA9IG90aGVyX3RodW1ibmFpbHMuZXEob3RoZXJfbmV4dF9pbmRleCksXHJcblx0XHRcdG5leHRfcHJvamVjdCA9IHByb2plY3RzLmVxKG5leHRfcHJvamVjdF9pbmRleCk7XHJcblxyXG5cdFx0dGhpc19hY3RpdmVfdGh1bWIuYW5pbWF0ZSh7XHJcblx0XHRcdHRvcDogXCItMTAwJVwiXHJcblx0XHR9LCA3MDApO1xyXG5cclxuXHRcdHRoaXNfYnV0dG9uLnByb3AoXCJkaXNhYmxlZFwiLCB0cnVlKTtcclxuXHRcdG90aGVyX2J1dHRvbi5wcm9wKFwiZGlzYWJsZWRcIiwgdHJ1ZSk7XHJcblxyXG5cdFx0dGhpc19uZXh0X3RodW1iLmNzcyh7dG9wOlwiMTAwJVwifSk7XHJcblx0XHR0aGlzX25leHRfdGh1bWIuYW5pbWF0ZSh7XHJcblx0XHRcdHRvcDogMFxyXG5cdFx0fSwgNzAwLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0dGhpc19hY3RpdmVfdGh1bWIucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIikuY3NzKHt0b3A6XCIxMDAlXCJ9KTtcclxuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0dGhpc19idXR0b24ucHJvcChcImRpc2FibGVkXCIsIGZhbHNlKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdG90aGVyX2FjdGl2ZV90aHVtYi5hbmltYXRlKHtcclxuXHRcdFx0dG9wOiBcIjEwMCVcIlxyXG5cdFx0fSwgNzAwKTtcclxuXHJcblx0XHRvdGhlcl9uZXh0X3RodW1iLmNzcyh7dG9wOlwiLTEwMCVcIn0pO1xyXG5cdFx0b3RoZXJfbmV4dF90aHVtYi5hbmltYXRlKHtcclxuXHRcdFx0dG9wOiAwXHJcblx0XHR9LCA3MDAsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRvdGhlcl9hY3RpdmVfdGh1bWIucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIikuY3NzKHt0b3A6XCItMTAwJVwifSk7XHJcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHRcdG90aGVyX2J1dHRvbi5wcm9wKFwiZGlzYWJsZWRcIiwgZmFsc2UpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0YWN0aXZlX3ByZXZpZXcuZmFkZU91dCgzNTAsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdCQodGhpcykuYXR0cihcInNyY1wiLCBuZXh0X3ByZXZpZXcpLmZhZGVJbigzNTApO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0YWN0aXZlX3Byb2plY3QuZmFkZU91dCgzNTAsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHRcdG5leHRfcHJvamVjdC5hZGRDbGFzcyhcImFjdGl2ZVwiKS5mYWRlSW4oMzUwKTtcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gU0NST0xMIEVWRU5UU1xyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuXHQvLyBTQ1JPTEwgTkFWSUdBVElPTiBCRUdJTlxyXG5cdHZhciBsYXN0SWQsXHJcblx0XHRtZW51ID0gJChcIi5ibG9nLW5hdmlnYXRpb25cIiksXHJcblx0XHRtZW51SXRlbXMgPSBtZW51LmZpbmQoXCJsaSBhXCIpLFxyXG5cdFx0c2Nyb2xsSXRlbXMgPSBtZW51SXRlbXMubWFwKGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciBpdGVtID0gJCgkKHRoaXMpLmF0dHIoXCJocmVmXCIpKTtcclxuXHRcdFx0aWYgKGl0ZW0ubGVuZ3RoKSByZXR1cm4gaXRlbTtcclxuXHRcdH0pO1xyXG5cclxuXHQvLyBCaW5kIGNsaWNrIGhhbmRsZXIgdG8gbWVudSBpdGVtc1xyXG5cdC8vIHNvIHdlIGNhbiBnZXQgYSBmYW5jeSBzY3JvbGwgYW5pbWF0aW9uXHJcblx0bWVudUl0ZW1zLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0dmFyIGhyZWYgPSAkKHRoaXMpLmF0dHIoXCJocmVmXCIpLFxyXG5cdFx0XHRvZmZzZXRUb3AgPSAoaHJlZiA9PT0gXCIjXCIpID8gMCA6ICQoaHJlZikub2Zmc2V0KCkudG9wLTYwO1xyXG5cdFx0XHJcblx0XHQkKFwiaHRtbCwgYm9keVwiKS5zdG9wKCkuYW5pbWF0ZSh7IFxyXG5cdFx0XHRzY3JvbGxUb3A6IG9mZnNldFRvcFxyXG5cdFx0fSwgNzAwLCBcInN3aW5nXCIpO1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdH0pO1xyXG5cclxuXHQvLyBCaW5kIHRvIHNjcm9sbFxyXG5cdGlmKCQoXCIuYmxvZy1uYXZpZ2F0aW9uXCIpLm9mZnNldCgpKXtcclxuXHRcdCQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oKSB7XHJcblx0XHRcdC8vIEdldCBjb250YWluZXIgc2Nyb2xsIHBvc2l0aW9uXHJcblx0XHRcdHZhciBmcm9tVG9wID0gJCh0aGlzKS5zY3JvbGxUb3AoKSxcclxuXHRcdFx0XHRibG9nTmF2T2Zmc2V0ID0gJChcIi5ibG9nLW5hdmlnYXRpb25cIikub2Zmc2V0KCkudG9wLFxyXG5cdFx0XHRcdGJsb2dOYXZMaW1pdCA9ICQoXCIuZm9vdGVyX193cmFwcGVyXCIpLm9mZnNldCgpLnRvcCAtICQoXCIuYmxvZy1uYXZpZ2F0aW9uX193cmFwcGVyXCIpLm91dGVySGVpZ2h0KCk7XHJcblxyXG5cdFx0XHQvLyBHZXQgaWQgb2YgY3VycmVudCBzY3JvbGwgaXRlbVxyXG5cdFx0XHR2YXIgY3VyID0gc2Nyb2xsSXRlbXMubWFwKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0aWYgKCQodGhpcykub2Zmc2V0KCkudG9wIDwgZnJvbVRvcCsxNDQpXHJcblx0XHRcdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdFx0fSk7XHJcblx0XHRcdC8vIEdldCB0aGUgaWQgb2YgdGhlIGN1cnJlbnQgZWxlbWVudFxyXG5cdFx0XHRjdXIgPSBjdXJbY3VyLmxlbmd0aC0xXTtcclxuXHRcdFx0dmFyIGlkID0gY3VyICYmIGN1ci5sZW5ndGggPyBjdXJbMF0uaWQgOiBcIlwiO1xyXG5cclxuXHRcdFx0aWYgKGxhc3RJZCAhPT0gaWQpIHtcclxuXHRcdFx0XHRsYXN0SWQgPSBpZDtcclxuXHRcdFx0XHQvLyBTZXQvcmVtb3ZlIGFjdGl2ZSBjbGFzc1xyXG5cdFx0XHRcdG1lbnVJdGVtc1xyXG5cdFx0XHRcdC5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKVxyXG5cdFx0XHRcdC5maWx0ZXIoXCJbaHJlZj0jXCIraWQrXCJdXCIpXHJcblx0XHRcdFx0LmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZihmcm9tVG9wID49IGJsb2dOYXZMaW1pdCAmJiAkKHdpbmRvdykud2lkdGgoKSA+ICg3NjggLSBzY3JvbGxCYXJXaWR0aCkpIHtcclxuXHRcdFx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5jc3Moe1wicG9zaXRpb25cIjpcImFic29sdXRlXCIsIFwidG9wXCI6YmxvZ05hdkxpbWl0ICsgXCJweFwifSk7XHJcblx0XHRcdH0gZWxzZSBpZiAoZnJvbVRvcCA+PSBibG9nTmF2T2Zmc2V0ICYmICQod2luZG93KS53aWR0aCgpID4gKDc2OCAtIHNjcm9sbEJhcldpZHRoKSkge1xyXG5cdFx0XHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uX193cmFwcGVyXCIpLmNzcyh7XCJwb3NpdGlvblwiOlwiZml4ZWRcIiwgXCJ0b3BcIjowfSk7XHJcblx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikuYWRkQ2xhc3MoXCJuYXYtZml4ZWRcIik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikuY3NzKHtcInBvc2l0aW9uXCI6XCJyZWxhdGl2ZVwifSk7XHJcblx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikucmVtb3ZlQ2xhc3MoXCJuYXYtZml4ZWRcIik7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9KTtcclxuXHR9XHJcblx0Ly8gU0NST0xMIE5BVklHQVRJT04gRU5EXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBSRVNJWkUgRVZFTlRTXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0aWYoJChcIi5ibG9nLW5hdmlnYXRpb25cIikub2Zmc2V0KCkpe1xyXG5cdFx0JCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbigpIHtcclxuXHRcdFx0aWYoJCh3aW5kb3cpLndpZHRoKCkgPD0gKDc2OCAtIHNjcm9sbEJhcldpZHRoKSl7XHJcblx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikucmVtb3ZlQ2xhc3MoXCJuYXYtZml4ZWRcIik7XHJcblx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikuY3NzKHtcInBvc2l0aW9uXCI6XCJyZWxhdGl2ZVwifSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0aWYoJChcImJvZHlcIikuc2Nyb2xsVG9wKCkgPj0gJChcIi5ibG9nXCIpLm9mZnNldCgpLnRvcCl7XHJcblx0XHRcdFx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5jc3Moe1wicG9zaXRpb25cIjpcImZpeGVkXCIsIFwidG9wXCI6MH0pO1xyXG5cdFx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikuYWRkQ2xhc3MoXCJuYXYtZml4ZWRcIik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cclxuXHQkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCkge1xyXG5cdFx0Ly8gVGVzdGltb25pYWxzIHNlY3Rpb24gYmcgc2l6ZVxyXG5cdFx0aWYoICQod2luZG93KS53aWR0aCgpPjIwMDAgLSBzY3JvbGxCYXJXaWR0aCl7XHJcblx0XHRcdCQoXCIudGFsa3MsIC5jb250YWN0LWZvcm1fX2JnXCIpLmNzcyhcImJhY2tncm91bmQtc2l6ZVwiLCAkKHdpbmRvdykud2lkdGgoKSArIFwicHhcIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBQcmVsb2FkZXIgd2l0aCBwZXJjZW50YWdlIGJ5IGludGVydmFsXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gZnVuY3Rpb24gcHJlbG9hZGVyKCkge1xyXG5cdC8vIFx0dmFyIGR1cmF0aW9uID0gMTAwMDtcclxuXHQvLyBcdHZhciBzdCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG5cclxuXHQvLyBcdHZhciAkY2lyY2xlX19vID0gJChcIiNwcmVsb2FkZXItc3ZnX19pbWcgLmJhcl9fb3V0ZXJcIiksXHJcblx0Ly8gXHRcdCRjaXJjbGVfX2MgPSAkKFwiI3ByZWxvYWRlci1zdmdfX2ltZyAuYmFyX19jZW50ZXJcIiksXHJcblx0Ly8gXHRcdCRjaXJjbGVfX2kgPSAkKFwiI3ByZWxvYWRlci1zdmdfX2ltZyAuYmFyX19pbm5lclwiKTtcclxuXHJcblx0Ly8gXHR2YXIgY19vID0gTWF0aC5QSSooJGNpcmNsZV9fby5hdHRyKFwiclwiKSAqIDIpLFxyXG5cdC8vIFx0XHRjX2MgPSBNYXRoLlBJKigkY2lyY2xlX19jLmF0dHIoXCJyXCIpICogMiksXHJcblx0Ly8gXHRcdGNfaSA9IE1hdGguUEkqKCRjaXJjbGVfX2kuYXR0cihcInJcIikgKiAyKTtcclxuXHJcblxyXG5cdC8vIFx0dmFyIGludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XHJcblx0Ly8gXHRcdHZhciBkaWZmID0gTWF0aC5yb3VuZChuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHN0KSxcclxuXHQvLyBcdFx0XHR2YWwgPSBNYXRoLnJvdW5kKGRpZmYgLyBkdXJhdGlvbiAqIDEwMCk7XHJcblxyXG5cdC8vIFx0XHR2YWwgPSB2YWwgPiAxMDAgPyAxMDAgOiB2YWw7XHJcblxyXG5cdC8vIFx0XHR2YXIgcGN0X28gPSAoKDEwMC12YWwpLzEwMCkqY19vLFxyXG5cdC8vIFx0XHRcdHBjdF9jID0gKCgxMDAtdmFsKS8xMDApKmNfYyxcclxuXHQvLyBcdFx0XHRwY3RfaSA9ICgoMTAwLXZhbCkvMTAwKSpjX2k7XHJcblxyXG5cdC8vIFx0XHQkY2lyY2xlX19vLmNzcyh7c3Ryb2tlRGFzaG9mZnNldDogcGN0X299KTtcclxuXHQvLyBcdFx0JGNpcmNsZV9fYy5jc3Moe3N0cm9rZURhc2hvZmZzZXQ6IHBjdF9jfSk7XHJcblx0Ly8gXHRcdCRjaXJjbGVfX2kuY3NzKHtzdHJva2VEYXNob2Zmc2V0OiBwY3RfaX0pO1xyXG5cclxuXHQvLyBcdFx0JChcIiNwcmVsb2FkZXItc3ZnX19wZXJjZW50YWdlXCIpLnRleHQodmFsKTtcclxuXHQvLyBcdFx0JChcIiNwcmVsb2FkZXItc3ZnX19pbWdcIikuY3NzKHtvcGFjaXR5OjF9KTtcclxuXHJcblx0Ly8gXHRcdGlmIChkaWZmID49IGR1cmF0aW9uKSB7XHJcblx0Ly8gXHRcdFx0Y2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XHJcblxyXG5cdC8vIFx0XHRcdGlmKCQoXCIuZmxpcC1jYXJkXCIpLmxlbmd0aCl7XHJcblx0Ly8gXHRcdFx0XHQkKFwiI3ByZWxvYWRlclwiKS5kZWxheSgxMDAwKS5mYWRlT3V0KDcwMCwgZnVuY3Rpb24oKXtcclxuXHQvLyBcdFx0XHRcdFx0JChcIiNwcmVsb2FkZXJfX3Byb2dyZXNzXCIpLnJlbW92ZSgpO1xyXG5cdC8vIFx0XHRcdFx0XHQkKFwiLmZsaXAtY2FyZFwiKS5hZGRDbGFzcyhcImxvYWRlZFwiKTtcclxuXHQvLyBcdFx0XHRcdH0pO1xyXG5cdC8vIFx0XHRcdH0gZWxzZSB7XHJcblx0Ly8gXHRcdFx0XHQkKFwiI3ByZWxvYWRlclwiKS5kZWxheSgxMDAwKS5mYWRlT3V0KDcwMCwgZnVuY3Rpb24oKXtcclxuXHQvLyBcdFx0XHRcdFx0JChcIiNwcmVsb2FkZXJfX3Byb2dyZXNzXCIpLnJlbW92ZSgpO1xyXG5cdC8vIFx0XHRcdFx0fSk7XHJcblx0Ly8gXHRcdFx0fVxyXG5cdC8vIFx0XHR9XHJcblx0Ly8gXHR9LCAyMDApO1xyXG5cdC8vIH1cclxuXHQvLyBwcmVsb2FkZXIoKTtcclxuXHJcblxyXG59KShqUXVlcnkpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
