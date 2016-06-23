(function($) {
	"use strict";

	// ==============================
	// Check scrollbar width
	// ==============================
	var widthContentA = $("#scroll_bar_check_A").width(),
		widthContentB = $("#scroll_bar_check_B").width();

	var scrollBarWidth = widthContentA - widthContentB;

	$("#scroll_bar_check_A").css("display","none");




	// console.log(window.location.pathname);
	// if(window.location.pathname=="/xhrtest.html"){
	// 	$.ajax({
	// 		xhr: function() {
	// 			var xhr = new window.XMLHttpRequest();

	// 			// //Upload progress
	// 			// xhr.upload.addEventListener("progress", function(evt){
	// 			// 	if (evt.lengthComputable) {
	// 			// 		var percentComplete = evt.loaded / evt.total;

	// 			// 		//Do something with upload progress
	// 			// 		console.log(percentComplete);
	// 			// 	}
	// 			// }, false);

	// 			//Download progress
	// 			xhr.addEventListener("progress", function(evt){
	// 				if (evt.lengthComputable) {
	// 					var percentComplete = evt.loaded / evt.total;

	// 					//Do something with download progress
	// 					console.time("Execution time took");
	// 					console.log(percentComplete);
	// 					console.timeEnd("Execution time took");
	// 				}
	// 			}, false);
	// 			return xhr;
	// 		},
	// 		type: "POST",
	// 		url: window.location.pathname,
	// 		data: {},
	// 		success: function(data){
	// 			// $("#preloader").delay(700).fadeOut(700, function(){
	// 			// 	$("#preloader__progress").remove();

	// 			// 	if($(".flip-card").length){
	// 			// 		$(".flip-card").addClass("loaded");
	// 			// 	}
	// 			// });
	// 			console.log("Complete");
	// 		}
	// 	});
	// }


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

	// IE scroll jump fix
	if(navigator.userAgent.match(/Trident\/7\./)) {
		$(".layer").css({transition:"top .15s linear"});
		$("#scene.vertical").css({transition:"opacity .15s linear"});

		$("body").on("mousewheel", function () {
			event.preventDefault(); 

			var wheelDelta = event.wheelDelta,
				currentScrollPosition = window.pageYOffset;

			window.scrollTo(0, currentScrollPosition - wheelDelta);
		});
	}

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

		this_next_thumb.css({top:"100%"});
		this_next_thumb.animate({
			top: 0
		}, 700, function() {
			this_active_thumb.removeClass("active").css({top:"100%"});
			$(this).addClass("active");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oJCkge1xyXG5cdFwidXNlIHN0cmljdFwiO1xyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBDaGVjayBzY3JvbGxiYXIgd2lkdGhcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHR2YXIgd2lkdGhDb250ZW50QSA9ICQoXCIjc2Nyb2xsX2Jhcl9jaGVja19BXCIpLndpZHRoKCksXHJcblx0XHR3aWR0aENvbnRlbnRCID0gJChcIiNzY3JvbGxfYmFyX2NoZWNrX0JcIikud2lkdGgoKTtcclxuXHJcblx0dmFyIHNjcm9sbEJhcldpZHRoID0gd2lkdGhDb250ZW50QSAtIHdpZHRoQ29udGVudEI7XHJcblxyXG5cdCQoXCIjc2Nyb2xsX2Jhcl9jaGVja19BXCIpLmNzcyhcImRpc3BsYXlcIixcIm5vbmVcIik7XHJcblxyXG5cclxuXHJcblxyXG5cdC8vIGNvbnNvbGUubG9nKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSk7XHJcblx0Ly8gaWYod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lPT1cIi94aHJ0ZXN0Lmh0bWxcIil7XHJcblx0Ly8gXHQkLmFqYXgoe1xyXG5cdC8vIFx0XHR4aHI6IGZ1bmN0aW9uKCkge1xyXG5cdC8vIFx0XHRcdHZhciB4aHIgPSBuZXcgd2luZG93LlhNTEh0dHBSZXF1ZXN0KCk7XHJcblxyXG5cdC8vIFx0XHRcdC8vIC8vVXBsb2FkIHByb2dyZXNzXHJcblx0Ly8gXHRcdFx0Ly8geGhyLnVwbG9hZC5hZGRFdmVudExpc3RlbmVyKFwicHJvZ3Jlc3NcIiwgZnVuY3Rpb24oZXZ0KXtcclxuXHQvLyBcdFx0XHQvLyBcdGlmIChldnQubGVuZ3RoQ29tcHV0YWJsZSkge1xyXG5cdC8vIFx0XHRcdC8vIFx0XHR2YXIgcGVyY2VudENvbXBsZXRlID0gZXZ0LmxvYWRlZCAvIGV2dC50b3RhbDtcclxuXHJcblx0Ly8gXHRcdFx0Ly8gXHRcdC8vRG8gc29tZXRoaW5nIHdpdGggdXBsb2FkIHByb2dyZXNzXHJcblx0Ly8gXHRcdFx0Ly8gXHRcdGNvbnNvbGUubG9nKHBlcmNlbnRDb21wbGV0ZSk7XHJcblx0Ly8gXHRcdFx0Ly8gXHR9XHJcblx0Ly8gXHRcdFx0Ly8gfSwgZmFsc2UpO1xyXG5cclxuXHQvLyBcdFx0XHQvL0Rvd25sb2FkIHByb2dyZXNzXHJcblx0Ly8gXHRcdFx0eGhyLmFkZEV2ZW50TGlzdGVuZXIoXCJwcm9ncmVzc1wiLCBmdW5jdGlvbihldnQpe1xyXG5cdC8vIFx0XHRcdFx0aWYgKGV2dC5sZW5ndGhDb21wdXRhYmxlKSB7XHJcblx0Ly8gXHRcdFx0XHRcdHZhciBwZXJjZW50Q29tcGxldGUgPSBldnQubG9hZGVkIC8gZXZ0LnRvdGFsO1xyXG5cclxuXHQvLyBcdFx0XHRcdFx0Ly9EbyBzb21ldGhpbmcgd2l0aCBkb3dubG9hZCBwcm9ncmVzc1xyXG5cdC8vIFx0XHRcdFx0XHRjb25zb2xlLnRpbWUoXCJFeGVjdXRpb24gdGltZSB0b29rXCIpO1xyXG5cdC8vIFx0XHRcdFx0XHRjb25zb2xlLmxvZyhwZXJjZW50Q29tcGxldGUpO1xyXG5cdC8vIFx0XHRcdFx0XHRjb25zb2xlLnRpbWVFbmQoXCJFeGVjdXRpb24gdGltZSB0b29rXCIpO1xyXG5cdC8vIFx0XHRcdFx0fVxyXG5cdC8vIFx0XHRcdH0sIGZhbHNlKTtcclxuXHQvLyBcdFx0XHRyZXR1cm4geGhyO1xyXG5cdC8vIFx0XHR9LFxyXG5cdC8vIFx0XHR0eXBlOiBcIlBPU1RcIixcclxuXHQvLyBcdFx0dXJsOiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUsXHJcblx0Ly8gXHRcdGRhdGE6IHt9LFxyXG5cdC8vIFx0XHRzdWNjZXNzOiBmdW5jdGlvbihkYXRhKXtcclxuXHQvLyBcdFx0XHQvLyAkKFwiI3ByZWxvYWRlclwiKS5kZWxheSg3MDApLmZhZGVPdXQoNzAwLCBmdW5jdGlvbigpe1xyXG5cdC8vIFx0XHRcdC8vIFx0JChcIiNwcmVsb2FkZXJfX3Byb2dyZXNzXCIpLnJlbW92ZSgpO1xyXG5cclxuXHQvLyBcdFx0XHQvLyBcdGlmKCQoXCIuZmxpcC1jYXJkXCIpLmxlbmd0aCl7XHJcblx0Ly8gXHRcdFx0Ly8gXHRcdCQoXCIuZmxpcC1jYXJkXCIpLmFkZENsYXNzKFwibG9hZGVkXCIpO1xyXG5cdC8vIFx0XHRcdC8vIFx0fVxyXG5cdC8vIFx0XHRcdC8vIH0pO1xyXG5cdC8vIFx0XHRcdGNvbnNvbGUubG9nKFwiQ29tcGxldGVcIik7XHJcblx0Ly8gXHRcdH1cclxuXHQvLyBcdH0pO1xyXG5cdC8vIH1cclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFByZWxvYWRlciB3aXRoIHBlcmNlbnRhZ2UgYnkgaW1hZ2UgY291bnRcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRmdW5jdGlvbiBwcmVsb2FkZXIoKSB7XHJcblx0XHR2YXIgcHJlbG9hZGVyX3N0YXQgPSAkKFwiI3ByZWxvYWRlci1zdmdfX3BlcmNlbnRhZ2VcIiksXHJcblx0XHRcdGhhc0ltYWdlUHJvcGVydGllcyA9IFtcImJhY2tncm91bmRJbWFnZVwiLCBcImxpc3RTdHlsZUltYWdlXCIsIFwiYm9yZGVySW1hZ2VcIiwgXCJib3JkZXJDb3JuZXJJbWFnZVwiLCBcImN1cnNvclwiXSxcclxuXHRcdFx0aGFzSW1hZ2VBdHRyaWJ1dGVzID0gW1wic3Jjc2V0XCJdLFxyXG5cdFx0XHRtYXRjaF91cmwgPSAvdXJsXFwoXFxzKihbJ1wiXT8pKC4qPylcXDFcXHMqXFwpL2csXHJcblx0XHRcdGFsbF9pbWFnZXMgPSBbXSxcclxuXHRcdFx0dG90YWwgPSAwLFxyXG5cdFx0XHRjb3VudCA9IDA7XHJcblxyXG5cdFx0dmFyIGNpcmNsZV9vID0gJChcIiNwcmVsb2FkZXItc3ZnX19pbWcgLmJhcl9fb3V0ZXJcIiksXHJcblx0XHRcdGNpcmNsZV9jID0gJChcIiNwcmVsb2FkZXItc3ZnX19pbWcgLmJhcl9fY2VudGVyXCIpLFxyXG5cdFx0XHRjaXJjbGVfaSA9ICQoXCIjcHJlbG9hZGVyLXN2Z19faW1nIC5iYXJfX2lubmVyXCIpLFxyXG5cdFx0XHRsZW5ndGhfbyA9IE1hdGguUEkqKGNpcmNsZV9vLmF0dHIoXCJyXCIpICogMiksXHJcblx0XHRcdGxlbmd0aF9jID0gTWF0aC5QSSooY2lyY2xlX2MuYXR0cihcInJcIikgKiAyKSxcclxuXHRcdFx0bGVuZ3RoX2kgPSBNYXRoLlBJKihjaXJjbGVfaS5hdHRyKFwiclwiKSAqIDIpO1xyXG5cclxuXHJcblx0XHRmdW5jdGlvbiBpbWdfbG9hZGVkKCl7XHJcblx0XHRcdHZhciBwZXJjZW50YWdlID0gTWF0aC5jZWlsKCArK2NvdW50IC8gdG90YWwgKiAxMDAgKTtcclxuXHJcblx0XHRcdHBlcmNlbnRhZ2UgPSBwZXJjZW50YWdlID4gMTAwID8gMTAwIDogcGVyY2VudGFnZTtcclxuXHJcblx0XHRcdC8vIERyYXcgb2Zmc2V0c1xyXG5cdFx0XHRjaXJjbGVfby5jc3Moe3N0cm9rZURhc2hvZmZzZXQ6ICgoMTAwLXBlcmNlbnRhZ2UpLzEwMCkqbGVuZ3RoX28gfSk7XHJcblxyXG5cdFx0XHRpZihwZXJjZW50YWdlID4gNTApIHtcclxuXHRcdFx0XHRjaXJjbGVfYy5jc3Moe3N0cm9rZURhc2hvZmZzZXQ6ICgoMTAwLXBlcmNlbnRhZ2UpLzEwMCkqbGVuZ3RoX2MgfSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKHBlcmNlbnRhZ2UgPT0gMTAwKSB7XHJcblx0XHRcdFx0Y2lyY2xlX2kuY3NzKHtzdHJva2VEYXNob2Zmc2V0OiAoKDEwMC1wZXJjZW50YWdlKS8xMDApKmxlbmd0aF9pIH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRwcmVsb2FkZXJfc3RhdC5odG1sKHBlcmNlbnRhZ2UpO1xyXG5cclxuXHRcdFx0aWYoY291bnQgPT09IHRvdGFsKSByZXR1cm4gZG9uZV9sb2FkaW5nKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gZG9uZV9sb2FkaW5nKCl7XHJcblx0XHRcdCQoXCIjcHJlbG9hZGVyXCIpLmRlbGF5KDcwMCkuZmFkZU91dCg3MDAsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0JChcIiNwcmVsb2FkZXJfX3Byb2dyZXNzXCIpLnJlbW92ZSgpO1xyXG5cclxuXHRcdFx0XHRpZigkKFwiLmZsaXAtY2FyZFwiKS5sZW5ndGgpe1xyXG5cdFx0XHRcdFx0JChcIi5mbGlwLWNhcmRcIikuYWRkQ2xhc3MoXCJsb2FkZWRcIik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBpbWFnZXNfbG9vcCAoKSB7XHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHZhciB0ZXN0X2ltYWdlID0gbmV3IEltYWdlKCk7XHJcblxyXG5cdFx0XHRcdHRlc3RfaW1hZ2Uub25sb2FkID0gaW1nX2xvYWRlZDtcclxuXHRcdFx0XHR0ZXN0X2ltYWdlLm9uZXJyb3IgPSBpbWdfbG9hZGVkO1xyXG5cclxuXHRcdFx0XHQvLyBjb25zb2xlLmxvZyhcIkM6IFwiICsgY291bnQsIFwiIFQ6IFwiICsgdG90YWwpO1xyXG5cclxuXHRcdFx0XHRpZiAoY291bnQgIT0gdG90YWwpIHtcclxuXHRcdFx0XHRcdGlmIChhbGxfaW1hZ2VzW2NvdW50XS5zcmNzZXQpIHtcclxuXHRcdFx0XHRcdFx0dGVzdF9pbWFnZS5zcmNzZXQgPSBhbGxfaW1hZ2VzW2NvdW50XS5zcmNzZXQ7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR0ZXN0X2ltYWdlLnNyYyA9IGFsbF9pbWFnZXNbY291bnRdLnNyYztcclxuXHJcblx0XHRcdFx0XHRpbWFnZXNfbG9vcCgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSwgNTApO1xyXG5cdFx0fVxyXG5cclxuXHRcdCQoXCIqXCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG5cdFx0XHR2YXIgZWxlbWVudCA9ICQodGhpcyk7XHJcblxyXG5cdFx0XHRpZiAoZWxlbWVudC5pcyhcImltZ1wiKSAmJiBlbGVtZW50LmF0dHIoXCJzcmNcIikpIHtcclxuXHRcdFx0XHRhbGxfaW1hZ2VzLnB1c2goe1xyXG5cdFx0XHRcdFx0c3JjOiBlbGVtZW50LmF0dHIoXCJzcmNcIiksXHJcblx0XHRcdFx0XHRlbGVtZW50OiBlbGVtZW50WzBdXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdCQuZWFjaChoYXNJbWFnZVByb3BlcnRpZXMsIGZ1bmN0aW9uIChpLCBwcm9wZXJ0eSkge1xyXG5cdFx0XHRcdHZhciBwcm9wZXJ0eVZhbHVlID0gZWxlbWVudC5jc3MocHJvcGVydHkpO1xyXG5cdFx0XHRcdHZhciBtYXRjaDtcclxuXHJcblx0XHRcdFx0aWYgKCFwcm9wZXJ0eVZhbHVlKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdG1hdGNoID0gbWF0Y2hfdXJsLmV4ZWMocHJvcGVydHlWYWx1ZSk7XHJcblxyXG5cdFx0XHRcdGlmIChtYXRjaCkge1xyXG5cdFx0XHRcdFx0YWxsX2ltYWdlcy5wdXNoKHtcclxuXHRcdFx0XHRcdFx0c3JjOiBtYXRjaFsyXSxcclxuXHRcdFx0XHRcdFx0ZWxlbWVudDogZWxlbWVudFswXVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdCQuZWFjaChoYXNJbWFnZUF0dHJpYnV0ZXMsIGZ1bmN0aW9uIChpLCBhdHRyaWJ1dGUpIHtcclxuXHRcdFx0XHR2YXIgYXR0cmlidXRlVmFsdWUgPSBlbGVtZW50LmF0dHIoYXR0cmlidXRlKTtcclxuXHJcblx0XHRcdFx0aWYgKCFhdHRyaWJ1dGVWYWx1ZSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRhbGxfaW1hZ2VzLnB1c2goe1xyXG5cdFx0XHRcdFx0c3JjOiBlbGVtZW50LmF0dHIoXCJzcmNcIiksXHJcblx0XHRcdFx0XHRzcmNzZXQ6IGVsZW1lbnQuYXR0cihcInNyY3NldFwiKSxcclxuXHRcdFx0XHRcdGVsZW1lbnQ6IGVsZW1lbnRbMF1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHJcblx0XHR0b3RhbCA9IGFsbF9pbWFnZXMubGVuZ3RoO1xyXG5cclxuXHRcdGlmICh0b3RhbCA9PT0gMCkge1xyXG5cdFx0XHRkb25lX2xvYWRpbmcoKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHByZWxvYWRlcl9zdGF0LmNzcyh7b3BhY2l0eTogMX0pO1xyXG5cdFx0XHRpbWFnZXNfbG9vcCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGZvcih2YXIgaT0wOyBpPHRvdGFsOyBpKyspe1xyXG5cdFx0Ly8gXHR2YXIgdGVzdF9pbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG5cclxuXHJcblx0XHQvLyBcdHRlc3RfaW1hZ2Uub25sb2FkID0gaW1nX2xvYWRlZDtcclxuXHRcdC8vIFx0dGVzdF9pbWFnZS5vbmVycm9yID0gaW1nX2xvYWRlZDtcclxuXHJcblx0XHQvLyBcdGlmIChhbGxfaW1hZ2VzW2ldLnNyY3NldCkge1xyXG5cdFx0Ly8gXHRcdHRlc3RfaW1hZ2Uuc3Jjc2V0ID0gYWxsX2ltYWdlc1tpXS5zcmNzZXQ7XHJcblx0XHQvLyBcdH1cclxuXHRcdC8vIFx0dGVzdF9pbWFnZS5zcmMgPSBhbGxfaW1hZ2VzW2ldLnNyYztcclxuXHRcdC8vIH1cclxuXHR9XHJcblxyXG5cdHByZWxvYWRlcigpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gUGFnZSBjaGFuZ2VyXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0JChkb2N1bWVudCkub24oXCJjbGlja1wiLCBcImEucHJlbG9hZC1saW5rXCIsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdHZhciBocmVmID0gJCh0aGlzKS5hdHRyKFwiaHJlZlwiKTtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRyZXR1cm4gJChcIiNwcmVsb2FkZXJcIilcclxuXHRcdFx0LmZhZGVJbigzMDAsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0cmV0dXJuIGRvY3VtZW50LmxvY2F0aW9uID0gaHJlZiAhPSBudWxsID8gaHJlZiA6IFwiL1wiO1xyXG5cdFx0XHR9KTtcclxuXHR9KTtcclxuXHJcblxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gQW5pbWF0aW9uc1xyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdCQuZm4uYW5pbWF0ZWQgPSBmdW5jdGlvbihpbkVmZmVjdCkge1xyXG5cdFx0JCh0aGlzKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgdGhzID0gJCh0aGlzKTtcclxuXHRcdFx0dGhzLmNzcyh7b3BhY2l0eTowfSlcclxuXHRcdFx0XHQuYWRkQ2xhc3MoXCJhbmltYXRlZFwiKVxyXG5cdFx0XHRcdC53YXlwb2ludChmdW5jdGlvbihkaXIpIHtcclxuXHRcdFx0XHRcdGlmIChkaXIgPT09IFwiZG93blwiKSB7XHJcblx0XHRcdFx0XHRcdHRocy5hZGRDbGFzcyhpbkVmZmVjdCkuY3NzKHtvcGFjaXR5OjF9KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdG9mZnNldDogXCI5MCVcIlxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fTtcclxuXHJcblx0JChcImhlYWRlciAuc3ZnLWhlYWRpbmcsIC50YWxrcyAuc3ZnLWhlYWRpbmcsIC50YWxrcyAudGVzdGltb25pYWxcIikuYW5pbWF0ZWQoXCJmYWRlSW5VcFwiKTtcclxuXHQkKFwiLnBvcnRmb2xpby1zbGlkZXJfX21vZHVsZT5kaXYsIC5hYm91dC1tZV9fc2tpbGxzPmRpdlwiKS5hbmltYXRlZChcImZhZGVJblVwXCIpO1xyXG5cdCQoXCIuYXJ0aWNsZVwiKS5hbmltYXRlZChcImZhZGVJblwiKTtcclxuXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBQaWVjaGFydHMgYW5pbWF0aW9uXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0JChcIi5waWVjaGFydCAucGllY2hhcnRfX2ZpbGxcIikuZWFjaChmdW5jdGlvbigpe1xyXG5cdFx0dmFyIHBpZSA9ICQodGhpcyk7XHJcblx0XHRwaWUud2F5cG9pbnQoZnVuY3Rpb24oZGlyKSB7XHJcblx0XHRcdGlmIChkaXIgPT09IFwiZG93blwiKSB7XHJcblx0XHRcdFx0cGllLmNzcyh7c3Ryb2tlRGFzaG9mZnNldDpwaWUuZGF0YShcInBlcmNlbnRhZ2VcIil9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG9mZnNldDogXCI5MCVcIlxyXG5cdFx0XHR9KTtcclxuXHR9KTtcclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFBhcmFsbGF4XHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG5cdC8vIElFIHNjcm9sbCBqdW1wIGZpeFxyXG5cdGlmKG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL1RyaWRlbnRcXC83XFwuLykpIHtcclxuXHRcdCQoXCIubGF5ZXJcIikuY3NzKHt0cmFuc2l0aW9uOlwidG9wIC4xNXMgbGluZWFyXCJ9KTtcclxuXHRcdCQoXCIjc2NlbmUudmVydGljYWxcIikuY3NzKHt0cmFuc2l0aW9uOlwib3BhY2l0eSAuMTVzIGxpbmVhclwifSk7XHJcblxyXG5cdFx0JChcImJvZHlcIikub24oXCJtb3VzZXdoZWVsXCIsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTsgXHJcblxyXG5cdFx0XHR2YXIgd2hlZWxEZWx0YSA9IGV2ZW50LndoZWVsRGVsdGEsXHJcblx0XHRcdFx0Y3VycmVudFNjcm9sbFBvc2l0aW9uID0gd2luZG93LnBhZ2VZT2Zmc2V0O1xyXG5cclxuXHRcdFx0d2luZG93LnNjcm9sbFRvKDAsIGN1cnJlbnRTY3JvbGxQb3NpdGlvbiAtIHdoZWVsRGVsdGEpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHQkKFwiI3NjZW5lLmF4aXNcIikucGFyYWxsYXgoe1xyXG5cdFx0c2NhbGFyWDogMyxcclxuXHRcdHNjYWxhclk6IDMsXHJcblx0XHRmcmljdGlvblg6IDAuNSxcclxuXHRcdGZyaWN0aW9uWTogMC41XHJcblx0fSk7XHJcblxyXG5cdCQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgc2Nyb2xsUG9zID0gJCh0aGlzKS5zY3JvbGxUb3AoKTtcclxuXHJcblx0XHQkKFwiI3NjZW5lLnZlcnRpY2FsIC5sYXllclwiKS5lYWNoKGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciBsYXllciA9ICQodGhpcyk7XHJcblxyXG5cdFx0XHRpZihsYXllci5pbmRleCgpICE9MCApIHtcclxuXHRcdFx0XHRsYXllci5jc3Moe1xyXG5cdFx0XHRcdFx0XCJ0b3BcIiA6ICggKHNjcm9sbFBvcy8oNSArIDIqbGF5ZXIuaW5kZXgoKSkpICkrXCJweFwiXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0JChcIiNzY2VuZS52ZXJ0aWNhbFwiKS5jc3Moe1xyXG5cdFx0XHRcIm9wYWNpdHlcIiA6IDEtKHNjcm9sbFBvcy83MDApXHJcblx0XHR9KTtcclxuXHR9KTtcclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gTG9naW4gY2FyZCBmbGlwXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0JChcIi5sb2dpbi1idXR0b25cIikuY2xpY2soZnVuY3Rpb24oKSB7XHJcblx0XHQkKFwiYm9keVwiKS5hZGRDbGFzcyhcImNhcmRfZmxpcHBlZFwiKTtcclxuXHR9KTtcclxuXHJcblx0JChcIiN1bmZsaXAtY2FyZFwiKS5jbGljayhmdW5jdGlvbigpIHtcclxuXHRcdCQoXCJib2R5XCIpLnJlbW92ZUNsYXNzKFwiY2FyZF9mbGlwcGVkXCIpO1xyXG5cdH0pO1xyXG5cclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIE1haW4gbWVudVxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdCQoXCIjbWVudS10b2dnbGVcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdCQodGhpcykuYWRkKFwiLm1haW4tbWVudVwiKS50b2dnbGVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHR9KTtcclxuXHJcblx0JChcIi5tYWluLW1lbnVfX2l0ZW1cIikuZWFjaChmdW5jdGlvbihpbmRleCkge1xyXG5cdFx0JCh0aGlzKS5jc3MoXCJ0cmFuc2l0aW9uLWRlbGF5XCIsIDAuMyswLjEqaW5kZXggKyBcInNcIik7XHJcblx0fSk7XHJcblxyXG5cclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIEJ1dHRvbnNcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQkKFwiYnV0dG9uLmdvLWRvd25cIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdHZhciBnbyA9ICQodGhpcykuZGF0YShcImxpbmtcIik7XHJcblx0XHQkKFwiaHRtbCwgYm9keVwiKS5zdG9wKCkuYW5pbWF0ZSh7XHJcblx0XHRcdHNjcm9sbFRvcDogJChnbykub2Zmc2V0KCkudG9wXHJcblx0XHR9LCA3MDAsIFwic3dpbmdcIik7XHJcblx0fSk7XHJcblxyXG5cdCQoXCJidXR0b24uZ28tdXBcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdCQoXCJodG1sLCBib2R5XCIpLnN0b3AoKS5hbmltYXRlKHtcclxuXHRcdFx0c2Nyb2xsVG9wOiAwXHJcblx0XHR9LCA3MDAsIFwic3dpbmdcIik7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIuYmxvZy1uYXZpZ2F0aW9uX190b2dnbGVcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uXCIpLnRvZ2dsZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdH0pO1xyXG5cclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFNsaWRlclxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdCQoXCIucG9ydGZvbGlvLWJ1dHRvblwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0dmFyIHRoaXNfYnV0dG9uID0gJCh0aGlzKSxcclxuXHRcdFx0dGhpc190aHVtYm5haWxzID0gdGhpc19idXR0b24ubmV4dCgpLmZpbmQoXCIucG9ydGZvbGlvLXRodW1ibmFpbHNfX3RodW1ibmFpbFwiKSxcclxuXHRcdFx0dGhpc19hY3RpdmVfdGh1bWIgPSB0aGlzX3RodW1ibmFpbHMuZmlsdGVyKFwiLmFjdGl2ZVwiKSxcclxuXHRcdFx0dGhpc19uZXh0X2luZGV4ID0gdGhpc190aHVtYm5haWxzLmluZGV4KHRoaXNfYWN0aXZlX3RodW1iKSArIDEsXHJcblx0XHRcdG90aGVyX2J1dHRvbiA9IHRoaXNfYnV0dG9uLnBhcmVudCgpLnNpYmxpbmdzKCkuZmluZChcIi5wb3J0Zm9saW8tYnV0dG9uXCIpLFxyXG5cdFx0XHRvdGhlcl90aHVtYm5haWxzID0gb3RoZXJfYnV0dG9uLm5leHQoKS5maW5kKFwiLnBvcnRmb2xpby10aHVtYm5haWxzX190aHVtYm5haWxcIiksXHJcblx0XHRcdG90aGVyX2FjdGl2ZV90aHVtYiA9IG90aGVyX3RodW1ibmFpbHMuZmlsdGVyKFwiLmFjdGl2ZVwiKSxcclxuXHRcdFx0b3RoZXJfbmV4dF9pbmRleCA9IG90aGVyX3RodW1ibmFpbHMuaW5kZXgob3RoZXJfYWN0aXZlX3RodW1iKSArIDEsXHJcblx0XHRcdGFjdGl2ZV9wcmV2aWV3ID0gdGhpc19idXR0b24uY2xvc2VzdChcIi5wb3J0Zm9saW8tc2xpZGVyXCIpLmZpbmQoXCIucG9ydGZvbGlvLXByZXZpZXdcIiksXHJcblx0XHRcdG5leHRfcHJldmlldyA9IHRoaXNfYWN0aXZlX3RodW1iLmZpbmQoXCJpbWdcIikuYXR0cihcInNyY1wiKTtcclxuXHJcblxyXG5cdFx0aWYodGhpc19uZXh0X2luZGV4ID49IHRoaXNfdGh1bWJuYWlscy5sZW5ndGgpe1xyXG5cdFx0XHR0aGlzX25leHRfaW5kZXggPSAwO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmKG90aGVyX25leHRfaW5kZXggPj0gb3RoZXJfdGh1bWJuYWlscy5sZW5ndGgpe1xyXG5cdFx0XHRvdGhlcl9uZXh0X2luZGV4ID0gMDtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgdGhpc19uZXh0X3RodW1iID0gdGhpc190aHVtYm5haWxzLmVxKHRoaXNfbmV4dF9pbmRleCksXHJcblx0XHRcdG90aGVyX25leHRfdGh1bWIgPSBvdGhlcl90aHVtYm5haWxzLmVxKG90aGVyX25leHRfaW5kZXgpO1xyXG5cclxuXHRcdHRoaXNfYWN0aXZlX3RodW1iLmFuaW1hdGUoe1xyXG5cdFx0XHR0b3A6IFwiLTEwMCVcIlxyXG5cdFx0fSwgNzAwKTtcclxuXHJcblx0XHR0aGlzX25leHRfdGh1bWIuY3NzKHt0b3A6XCIxMDAlXCJ9KTtcclxuXHRcdHRoaXNfbmV4dF90aHVtYi5hbmltYXRlKHtcclxuXHRcdFx0dG9wOiAwXHJcblx0XHR9LCA3MDAsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR0aGlzX2FjdGl2ZV90aHVtYi5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKS5jc3Moe3RvcDpcIjEwMCVcIn0pO1xyXG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0b3RoZXJfYWN0aXZlX3RodW1iLmFuaW1hdGUoe1xyXG5cdFx0XHR0b3A6IFwiMTAwJVwiXHJcblx0XHR9LCA3MDApO1xyXG5cclxuXHRcdG90aGVyX25leHRfdGh1bWIuY3NzKHt0b3A6XCItMTAwJVwifSk7XHJcblx0XHRvdGhlcl9uZXh0X3RodW1iLmFuaW1hdGUoe1xyXG5cdFx0XHR0b3A6IDBcclxuXHRcdH0sIDcwMCwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdG90aGVyX2FjdGl2ZV90aHVtYi5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKS5jc3Moe3RvcDpcIi0xMDAlXCJ9KTtcclxuXHRcdFx0JCh0aGlzKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGFjdGl2ZV9wcmV2aWV3LmZhZGVPdXQoMzUwLCBmdW5jdGlvbigpe1xyXG5cdFx0XHQkKHRoaXMpLmF0dHIoXCJzcmNcIiwgbmV4dF9wcmV2aWV3KS5mYWRlSW4oMzUwKTtcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gU0NST0xMIEVWRU5UU1xyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuXHQvLyBTQ1JPTEwgTkFWSUdBVElPTiBCRUdJTlxyXG5cdHZhciBsYXN0SWQsXHJcblx0XHRtZW51ID0gJChcIi5ibG9nLW5hdmlnYXRpb25cIiksXHJcblx0XHRtZW51SXRlbXMgPSBtZW51LmZpbmQoXCJsaSBhXCIpLFxyXG5cdFx0c2Nyb2xsSXRlbXMgPSBtZW51SXRlbXMubWFwKGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciBpdGVtID0gJCgkKHRoaXMpLmF0dHIoXCJocmVmXCIpKTtcclxuXHRcdFx0aWYgKGl0ZW0ubGVuZ3RoKSByZXR1cm4gaXRlbTtcclxuXHRcdH0pO1xyXG5cclxuXHQvLyBCaW5kIGNsaWNrIGhhbmRsZXIgdG8gbWVudSBpdGVtc1xyXG5cdC8vIHNvIHdlIGNhbiBnZXQgYSBmYW5jeSBzY3JvbGwgYW5pbWF0aW9uXHJcblx0bWVudUl0ZW1zLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0dmFyIGhyZWYgPSAkKHRoaXMpLmF0dHIoXCJocmVmXCIpLFxyXG5cdFx0XHRvZmZzZXRUb3AgPSAoaHJlZiA9PT0gXCIjXCIpID8gMCA6ICQoaHJlZikub2Zmc2V0KCkudG9wLTYwO1xyXG5cdFx0XHJcblx0XHQkKFwiaHRtbCwgYm9keVwiKS5zdG9wKCkuYW5pbWF0ZSh7IFxyXG5cdFx0XHRzY3JvbGxUb3A6IG9mZnNldFRvcFxyXG5cdFx0fSwgNzAwLCBcInN3aW5nXCIpO1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdH0pO1xyXG5cclxuXHQvLyBCaW5kIHRvIHNjcm9sbFxyXG5cdGlmKCQoXCIuYmxvZy1uYXZpZ2F0aW9uXCIpLm9mZnNldCgpKXtcclxuXHRcdCQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oKSB7XHJcblx0XHRcdC8vIEdldCBjb250YWluZXIgc2Nyb2xsIHBvc2l0aW9uXHJcblx0XHRcdHZhciBmcm9tVG9wID0gJCh0aGlzKS5zY3JvbGxUb3AoKSxcclxuXHRcdFx0XHRibG9nTmF2T2Zmc2V0ID0gJChcIi5ibG9nLW5hdmlnYXRpb25cIikub2Zmc2V0KCkudG9wLFxyXG5cdFx0XHRcdGJsb2dOYXZMaW1pdCA9ICQoXCIuZm9vdGVyX193cmFwcGVyXCIpLm9mZnNldCgpLnRvcCAtICQoXCIuYmxvZy1uYXZpZ2F0aW9uX193cmFwcGVyXCIpLm91dGVySGVpZ2h0KCk7XHJcblxyXG5cdFx0XHQvLyBHZXQgaWQgb2YgY3VycmVudCBzY3JvbGwgaXRlbVxyXG5cdFx0XHR2YXIgY3VyID0gc2Nyb2xsSXRlbXMubWFwKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0aWYgKCQodGhpcykub2Zmc2V0KCkudG9wIDwgZnJvbVRvcCsxNDQpXHJcblx0XHRcdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdFx0fSk7XHJcblx0XHRcdC8vIEdldCB0aGUgaWQgb2YgdGhlIGN1cnJlbnQgZWxlbWVudFxyXG5cdFx0XHRjdXIgPSBjdXJbY3VyLmxlbmd0aC0xXTtcclxuXHRcdFx0dmFyIGlkID0gY3VyICYmIGN1ci5sZW5ndGggPyBjdXJbMF0uaWQgOiBcIlwiO1xyXG5cclxuXHRcdFx0aWYgKGxhc3RJZCAhPT0gaWQpIHtcclxuXHRcdFx0XHRsYXN0SWQgPSBpZDtcclxuXHRcdFx0XHQvLyBTZXQvcmVtb3ZlIGFjdGl2ZSBjbGFzc1xyXG5cdFx0XHRcdG1lbnVJdGVtc1xyXG5cdFx0XHRcdC5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKVxyXG5cdFx0XHRcdC5maWx0ZXIoXCJbaHJlZj0jXCIraWQrXCJdXCIpXHJcblx0XHRcdFx0LmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZihmcm9tVG9wID49IGJsb2dOYXZMaW1pdCAmJiAkKHdpbmRvdykud2lkdGgoKSA+ICg3NjggLSBzY3JvbGxCYXJXaWR0aCkpIHtcclxuXHRcdFx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5jc3Moe1wicG9zaXRpb25cIjpcImFic29sdXRlXCIsIFwidG9wXCI6YmxvZ05hdkxpbWl0ICsgXCJweFwifSk7XHJcblx0XHRcdH0gZWxzZSBpZiAoZnJvbVRvcCA+PSBibG9nTmF2T2Zmc2V0ICYmICQod2luZG93KS53aWR0aCgpID4gKDc2OCAtIHNjcm9sbEJhcldpZHRoKSkge1xyXG5cdFx0XHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uX193cmFwcGVyXCIpLmNzcyh7XCJwb3NpdGlvblwiOlwiZml4ZWRcIiwgXCJ0b3BcIjowfSk7XHJcblx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikuYWRkQ2xhc3MoXCJuYXYtZml4ZWRcIik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikuY3NzKHtcInBvc2l0aW9uXCI6XCJyZWxhdGl2ZVwifSk7XHJcblx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikucmVtb3ZlQ2xhc3MoXCJuYXYtZml4ZWRcIik7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9KTtcclxuXHR9XHJcblx0Ly8gU0NST0xMIE5BVklHQVRJT04gRU5EXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBSRVNJWkUgRVZFTlRTXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0aWYoJChcIi5ibG9nLW5hdmlnYXRpb25cIikub2Zmc2V0KCkpe1xyXG5cdFx0JCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbigpIHtcclxuXHRcdFx0aWYoJCh3aW5kb3cpLndpZHRoKCkgPD0gKDc2OCAtIHNjcm9sbEJhcldpZHRoKSl7XHJcblx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikucmVtb3ZlQ2xhc3MoXCJuYXYtZml4ZWRcIik7XHJcblx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikuY3NzKHtcInBvc2l0aW9uXCI6XCJyZWxhdGl2ZVwifSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0aWYoJChcImJvZHlcIikuc2Nyb2xsVG9wKCkgPj0gJChcIi5ibG9nXCIpLm9mZnNldCgpLnRvcCl7XHJcblx0XHRcdFx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5jc3Moe1wicG9zaXRpb25cIjpcImZpeGVkXCIsIFwidG9wXCI6MH0pO1xyXG5cdFx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikuYWRkQ2xhc3MoXCJuYXYtZml4ZWRcIik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cclxuXHQkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCkge1xyXG5cdFx0Ly8gVGVzdGltb25pYWxzIHNlY3Rpb24gYmcgc2l6ZVxyXG5cdFx0aWYoICQod2luZG93KS53aWR0aCgpPjIwMDAgLSBzY3JvbGxCYXJXaWR0aCl7XHJcblx0XHRcdCQoXCIudGFsa3MsIC5jb250YWN0LWZvcm1fX2JnXCIpLmNzcyhcImJhY2tncm91bmQtc2l6ZVwiLCAkKHdpbmRvdykud2lkdGgoKSArIFwicHhcIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBQcmVsb2FkZXIgd2l0aCBwZXJjZW50YWdlIGJ5IGludGVydmFsXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gZnVuY3Rpb24gcHJlbG9hZGVyKCkge1xyXG5cdC8vIFx0dmFyIGR1cmF0aW9uID0gMTAwMDtcclxuXHQvLyBcdHZhciBzdCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG5cclxuXHQvLyBcdHZhciAkY2lyY2xlX19vID0gJChcIiNwcmVsb2FkZXItc3ZnX19pbWcgLmJhcl9fb3V0ZXJcIiksXHJcblx0Ly8gXHRcdCRjaXJjbGVfX2MgPSAkKFwiI3ByZWxvYWRlci1zdmdfX2ltZyAuYmFyX19jZW50ZXJcIiksXHJcblx0Ly8gXHRcdCRjaXJjbGVfX2kgPSAkKFwiI3ByZWxvYWRlci1zdmdfX2ltZyAuYmFyX19pbm5lclwiKTtcclxuXHJcblx0Ly8gXHR2YXIgY19vID0gTWF0aC5QSSooJGNpcmNsZV9fby5hdHRyKFwiclwiKSAqIDIpLFxyXG5cdC8vIFx0XHRjX2MgPSBNYXRoLlBJKigkY2lyY2xlX19jLmF0dHIoXCJyXCIpICogMiksXHJcblx0Ly8gXHRcdGNfaSA9IE1hdGguUEkqKCRjaXJjbGVfX2kuYXR0cihcInJcIikgKiAyKTtcclxuXHJcblxyXG5cdC8vIFx0dmFyIGludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XHJcblx0Ly8gXHRcdHZhciBkaWZmID0gTWF0aC5yb3VuZChuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHN0KSxcclxuXHQvLyBcdFx0XHR2YWwgPSBNYXRoLnJvdW5kKGRpZmYgLyBkdXJhdGlvbiAqIDEwMCk7XHJcblxyXG5cdC8vIFx0XHR2YWwgPSB2YWwgPiAxMDAgPyAxMDAgOiB2YWw7XHJcblxyXG5cdC8vIFx0XHR2YXIgcGN0X28gPSAoKDEwMC12YWwpLzEwMCkqY19vLFxyXG5cdC8vIFx0XHRcdHBjdF9jID0gKCgxMDAtdmFsKS8xMDApKmNfYyxcclxuXHQvLyBcdFx0XHRwY3RfaSA9ICgoMTAwLXZhbCkvMTAwKSpjX2k7XHJcblxyXG5cdC8vIFx0XHQkY2lyY2xlX19vLmNzcyh7c3Ryb2tlRGFzaG9mZnNldDogcGN0X299KTtcclxuXHQvLyBcdFx0JGNpcmNsZV9fYy5jc3Moe3N0cm9rZURhc2hvZmZzZXQ6IHBjdF9jfSk7XHJcblx0Ly8gXHRcdCRjaXJjbGVfX2kuY3NzKHtzdHJva2VEYXNob2Zmc2V0OiBwY3RfaX0pO1xyXG5cclxuXHQvLyBcdFx0JChcIiNwcmVsb2FkZXItc3ZnX19wZXJjZW50YWdlXCIpLnRleHQodmFsKTtcclxuXHQvLyBcdFx0JChcIiNwcmVsb2FkZXItc3ZnX19pbWdcIikuY3NzKHtvcGFjaXR5OjF9KTtcclxuXHJcblx0Ly8gXHRcdGlmIChkaWZmID49IGR1cmF0aW9uKSB7XHJcblx0Ly8gXHRcdFx0Y2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XHJcblxyXG5cdC8vIFx0XHRcdGlmKCQoXCIuZmxpcC1jYXJkXCIpLmxlbmd0aCl7XHJcblx0Ly8gXHRcdFx0XHQkKFwiI3ByZWxvYWRlclwiKS5kZWxheSgxMDAwKS5mYWRlT3V0KDcwMCwgZnVuY3Rpb24oKXtcclxuXHQvLyBcdFx0XHRcdFx0JChcIiNwcmVsb2FkZXJfX3Byb2dyZXNzXCIpLnJlbW92ZSgpO1xyXG5cdC8vIFx0XHRcdFx0XHQkKFwiLmZsaXAtY2FyZFwiKS5hZGRDbGFzcyhcImxvYWRlZFwiKTtcclxuXHQvLyBcdFx0XHRcdH0pO1xyXG5cdC8vIFx0XHRcdH0gZWxzZSB7XHJcblx0Ly8gXHRcdFx0XHQkKFwiI3ByZWxvYWRlclwiKS5kZWxheSgxMDAwKS5mYWRlT3V0KDcwMCwgZnVuY3Rpb24oKXtcclxuXHQvLyBcdFx0XHRcdFx0JChcIiNwcmVsb2FkZXJfX3Byb2dyZXNzXCIpLnJlbW92ZSgpO1xyXG5cdC8vIFx0XHRcdFx0fSk7XHJcblx0Ly8gXHRcdFx0fVxyXG5cdC8vIFx0XHR9XHJcblx0Ly8gXHR9LCAyMDApO1xyXG5cdC8vIH1cclxuXHQvLyBwcmVsb2FkZXIoKTtcclxuXHJcblxyXG59KShqUXVlcnkpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
