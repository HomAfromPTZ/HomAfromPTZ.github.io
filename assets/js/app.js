(function($) {
	"use strict";

	// ==============================
	// App global parameters object
	// ==============================
	window.hm = {}



	// ==============================
	// Check scrollbar width
	// ==============================
	function getScrollbarWidth(){
		var style = {"max-height":"100px", "overflow":"scroll", "position":"absolute"},
			wrapper = $("<div id='scroll_bar_check_A'></div>").css(style),
			inner = $("<div id='scroll_bar_check_B'></div>"),
			stretcher = $("<img src='/assets/img/force-scroll.png'/>"),
			scrollBarWidth = 0;

		wrapper.append(stretcher).append(inner);
		$("body").append(wrapper);

		scrollBarWidth = wrapper.width()-inner.width();
		wrapper.remove();

		return scrollBarWidth;
	};

	window.hm.scrollBarWidth = getScrollbarWidth();



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
			hasImageProperties = ["background", "backgroundImage", "listStyleImage", "borderImage", "borderCornerImage", "cursor"],
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
	$(".about-me__skills>div").animated("fadeInUp");
	$(".article, .portfolio-slider__navigation-container, .portfolio-slider__preview-container").animated("fadeIn");
	$(".portfolio-slider__projects-container").animated("fadeIn");


	// ==============================
	// Piecharts animation
	// ==============================
	if($(".piechart").length){
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
	}


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

	if($("#scene.vertical").length){
		$(window).scroll(function() {
			var scrollPos = $(this).scrollTop(),
				layers = $("#scene.vertical .layer");

			layers.css({"will-change":"transform"});

			layers.each(function(){
				var layer = $(this);

				if(layer.index() !=0 ) {
					layer.css({
						"transform" : "translate3d(0," + ( (scrollPos/(5 + 2*layer.index())) ) + "px,0)"
						// "top" : ( (scrollPos/(5 + 2*layer.index())) ) + "px"
					});
				}
			});
			$("#scene.vertical").css({
				"opacity" : 1-(scrollPos/720)
			});
		});
	}

	// ==============================
	// Login card flip
	// ==============================
	$(".login-button").click(function() {
		$("body").addClass("card_flipped");
	});

	$("#unflip-card").click(function(e) {
		e.preventDefault();
		$("body").removeClass("card_flipped");
	});

	// ==============================
	// Contact form
	// ==============================
	if($("#contact").length){
		var c_form = $("#contact"),
			send_button = c_form.find("#form-submit"),
			clear_button = c_form.find("#form-clear");

		clear_button.on("click", function(e){
			e.preventDefault();
			c_form[0].reset();
		});

		send_button.on("click", function(e){
			e.preventDefault();
			// c_form[0].reset();
		});
	}

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



	// ==============================
	// Slider
	// ==============================
	function prepare_title(title_container){
		var letters = $.trim(title_container.text()),
			new_title = "";

		title_container.html("");

		for(var i = 0; i < letters.length; i++){
			var css_delay = "style='animation-delay: " + (0.7/letters.length)*(i+1) + "s'",
				text = "<span class='letter' " + css_delay + ">" + letters[i] + "</span>";

			if(i==0){
				text = "<span class='word'>" + text;
			}
			if(letters[i] == " " || letters[i] == "&nbsp;"){
				text = "</span>\n<span class='word'>";
			}
			if(i == letters.length-1) {
				text = text + "</span>";
			}

			new_title += text;
		}

		title_container.append(new_title);
	}

	if($(".portfolio-slider").length){

		// console.time("Slider prepare");

		$(".portfolio-projects .project__title")
			.add(".portfolio-projects .project__tech")
			.each(function() {
				prepare_title($(this));
			});


		$(".portfolio-projects .active .project__title .letter")
			.add(".portfolio-projects .active .project__tech .letter")
			.addClass("show");


		var slider = $(".portfolio-slider"),
			previews = slider.find(".portfolio-preview"),
			projects = slider.find(".portfolio-projects .project");

		// console.timeEnd("Slider prepare");

		$(".portfolio-button").on("click", function(e){
			e.preventDefault();
			// console.time("Slider click");

			var this_button = $(this),
				this_thumbnails = this_button.next().find(".portfolio-thumbnails__thumbnail"),
				this_active_thumb = this_thumbnails.filter(".active"),
				this_next_index = this_thumbnails.index(this_active_thumb);

			var other_button = this_button.parent().siblings().find(".portfolio-button"),
				other_thumbnails = other_button.next().find(".portfolio-thumbnails__thumbnail"),
				other_active_thumb = other_thumbnails.filter(".active"),
				other_next_index = other_thumbnails.index(other_active_thumb);

			var active_preview = previews.filter(".active"),
				next_preview_index = previews.index(active_preview),
				active_project = projects.filter(".active"),
				next_project_index = projects.index(active_project);



			if(this_button.hasClass("portfolio-button_next")) {
				next_project_index = (next_project_index >= projects.length-1) ? 0 : next_project_index+1;
				this_next_index = this_next_index >= this_thumbnails.length-1 ? 0 : this_next_index+1;
				other_next_index = (other_next_index >= other_thumbnails.length-1) ? 0 : other_next_index+1;

				next_preview_index = (next_preview_index >= previews.length-1) ? 0 : next_preview_index+1;
			} else {
				next_project_index--;
				this_next_index--;
				other_next_index--;

				next_preview_index--;
			}

			function lock_buttons(){
				this_button.prop("disabled", true);
				other_button.prop("disabled", true);

				setTimeout(function(){
					this_button.prop("disabled", false);
					other_button.prop("disabled", false);
				}, 700);
			}

			function change_thumbs(){
				var this_next_thumb = this_thumbnails.eq(this_next_index),
					other_next_thumb = other_thumbnails.eq(other_next_index);

				this_next_thumb.removeClass("move-down").addClass("active move-up");
				this_active_thumb.removeClass("active move-down").addClass("move-up");

				other_next_thumb.removeClass("move-up").addClass("active move-down");
				other_active_thumb.removeClass("active move-up").addClass("move-down");
			}

			function change_preview(){
				var next_preview = previews.eq(next_preview_index);

				active_preview.removeClass("active");
				next_preview.addClass("active");
			}

			function change_project(){
				var next_project = projects.eq(next_project_index),
					title_letters = next_project.find(".project__title span.letter"),
					tech_letters = next_project.find(".project__tech span.letter");

				active_project
					.removeClass("active")
					.find("span.letter, span.letter")
					.removeClass("show");
				next_project.addClass("active");

				title_letters.addClass("show");
				tech_letters.addClass("show");
			}

			// console.timeEnd("Slider click");

			change_thumbs();
			change_project();
			change_preview();
			lock_buttons();
		});
	}



	// ==============================
	// Blog scroll events
	// ==============================
	if($(".blog-navigation").length){
		$(".blog-navigation__toggle").click(function(){
			$(".blog-navigation").toggleClass("active");
		});

		var lastId,
			menu = $(".blog-navigation"),
			menuItems = menu.find("li a"),
			scrollItems = menuItems.map(function(){
				var item = $($(this).attr("href"));
				if (item.length) return item;
			});

		menuItems.click(function(e){
			var href = $(this).attr("href"),
				offsetTop = (href === "#") ? 0 : $(href).offset().top-60;
			
			$("html, body").stop().animate({ 
				scrollTop: offsetTop
			}, 700, "swing");
			e.preventDefault();
		});

		$(window).scroll(function() {
			var fromTop = $(this).scrollTop(),
				blogNavOffset = $(".blog-navigation").offset().top,
				blogNavLimit = $(".footer__wrapper").offset().top - $(".blog-navigation__wrapper").outerHeight(),
				current = scrollItems.map(function(){
					if ($(this).offset().top < fromTop+144)
						return this;
				});

			current = current[current.length-1];
			var id = current && current.length ? current[0].id : "";

			if (lastId !== id) {
				lastId = id;
				menuItems.removeClass("active").filter("[href=#"+id+"]").addClass("active");
			}

			if(fromTop >= blogNavLimit && $(window).width() > (768 - window.hm.scrollBarWidth)) {
				$(".blog-navigation__wrapper").css({"position":"absolute", "top":blogNavLimit + "px"});
			} else if (fromTop >= blogNavOffset && $(window).width() > (768 - window.hm.scrollBarWidth)) {
				$(".blog-navigation__wrapper").css({"position":"fixed", "top":0});
				$(".blog-navigation__wrapper").addClass("nav-fixed");
			} else {
				$(".blog-navigation__wrapper").css({"position":"relative"});
				$(".blog-navigation__wrapper").removeClass("nav-fixed");
			}

		});

		$(window).resize(function() {
			if($(window).width() <= (768 - window.hm.scrollBarWidth)){
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



	// ==============================
	// Talks blur based on js
	// ==============================
	function set_bg(){
		var section = $(".talks"),
			form = section.find(".contact-form"),
			form_bg = form.find(".contact-form__bg"),
			bg_offset = section.offset().top - form_bg.offset().top;

		form_bg.css({
			"background-position" : "center " + bg_offset + "px"
		});
	}

	if($(".talks").length){
		$(window).load(function() {
			set_bg();
		});

		$(window).resize(function() {
			set_bg();

			if( $(window).width()>2000 - window.hm.scrollBarWidth){
				$(".talks, .contact-form__bg").css("background-size", $(window).width() + "px");
			}
		});
	}

})(jQuery);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigkKSB7XHJcblx0XCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIEFwcCBnbG9iYWwgcGFyYW1ldGVycyBvYmplY3RcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHR3aW5kb3cuaG0gPSB7fVxyXG5cclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIENoZWNrIHNjcm9sbGJhciB3aWR0aFxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIGdldFNjcm9sbGJhcldpZHRoKCl7XHJcblx0XHR2YXIgc3R5bGUgPSB7XCJtYXgtaGVpZ2h0XCI6XCIxMDBweFwiLCBcIm92ZXJmbG93XCI6XCJzY3JvbGxcIiwgXCJwb3NpdGlvblwiOlwiYWJzb2x1dGVcIn0sXHJcblx0XHRcdHdyYXBwZXIgPSAkKFwiPGRpdiBpZD0nc2Nyb2xsX2Jhcl9jaGVja19BJz48L2Rpdj5cIikuY3NzKHN0eWxlKSxcclxuXHRcdFx0aW5uZXIgPSAkKFwiPGRpdiBpZD0nc2Nyb2xsX2Jhcl9jaGVja19CJz48L2Rpdj5cIiksXHJcblx0XHRcdHN0cmV0Y2hlciA9ICQoXCI8aW1nIHNyYz0nL2Fzc2V0cy9pbWcvZm9yY2Utc2Nyb2xsLnBuZycvPlwiKSxcclxuXHRcdFx0c2Nyb2xsQmFyV2lkdGggPSAwO1xyXG5cclxuXHRcdHdyYXBwZXIuYXBwZW5kKHN0cmV0Y2hlcikuYXBwZW5kKGlubmVyKTtcclxuXHRcdCQoXCJib2R5XCIpLmFwcGVuZCh3cmFwcGVyKTtcclxuXHJcblx0XHRzY3JvbGxCYXJXaWR0aCA9IHdyYXBwZXIud2lkdGgoKS1pbm5lci53aWR0aCgpO1xyXG5cdFx0d3JhcHBlci5yZW1vdmUoKTtcclxuXHJcblx0XHRyZXR1cm4gc2Nyb2xsQmFyV2lkdGg7XHJcblx0fTtcclxuXHJcblx0d2luZG93LmhtLnNjcm9sbEJhcldpZHRoID0gZ2V0U2Nyb2xsYmFyV2lkdGgoKTtcclxuXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBDaGVjayBJRSB2ZXJzaW9uXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0ZnVuY3Rpb24gZGV0ZWN0X0lFKCkge1xyXG5cdFx0dmFyIHVhID0gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQ7XHJcblxyXG5cdFx0dmFyIG1zaWUgPSB1YS5pbmRleE9mKFwiTVNJRSBcIik7XHJcblx0XHRpZiAobXNpZSA+IDApIHtcclxuXHRcdFx0Ly8gSUUgMTAgb3Igb2xkZXIgPT4gcmV0dXJuIHZlcnNpb24gbnVtYmVyXHJcblx0XHRcdHJldHVybiBwYXJzZUludCh1YS5zdWJzdHJpbmcobXNpZSArIDUsIHVhLmluZGV4T2YoXCIuXCIsIG1zaWUpKSwgMTApO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciB0cmlkZW50ID0gdWEuaW5kZXhPZihcIlRyaWRlbnQvXCIpO1xyXG5cdFx0aWYgKHRyaWRlbnQgPiAwKSB7XHJcblx0XHRcdC8vIElFIDExID0+IHJldHVybiB2ZXJzaW9uIG51bWJlclxyXG5cdFx0XHR2YXIgcnYgPSB1YS5pbmRleE9mKFwicnY6XCIpO1xyXG5cdFx0XHRyZXR1cm4gcGFyc2VJbnQodWEuc3Vic3RyaW5nKHJ2ICsgMywgdWEuaW5kZXhPZihcIi5cIiwgcnYpKSwgMTApO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBlZGdlID0gdWEuaW5kZXhPZihcIkVkZ2UvXCIpO1xyXG5cdFx0aWYgKGVkZ2UgPiAwKSB7XHJcblx0XHRcdC8vIEVkZ2UgKElFIDEyKykgPT4gcmV0dXJuIHZlcnNpb24gbnVtYmVyXHJcblx0XHRcdHJldHVybiBwYXJzZUludCh1YS5zdWJzdHJpbmcoZWRnZSArIDUsIHVhLmluZGV4T2YoXCIuXCIsIGVkZ2UpKSwgMTApO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIG90aGVyIGJyb3dzZXJcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gUHJlbG9hZGVyIHdpdGggcGVyY2VudGFnZSBieSBpbWFnZSBjb3VudFxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIHByZWxvYWRlcigpIHtcclxuXHRcdHZhciBwcmVsb2FkZXJfc3RhdCA9ICQoXCIjcHJlbG9hZGVyLXN2Z19fcGVyY2VudGFnZVwiKSxcclxuXHRcdFx0aGFzSW1hZ2VQcm9wZXJ0aWVzID0gW1wiYmFja2dyb3VuZFwiLCBcImJhY2tncm91bmRJbWFnZVwiLCBcImxpc3RTdHlsZUltYWdlXCIsIFwiYm9yZGVySW1hZ2VcIiwgXCJib3JkZXJDb3JuZXJJbWFnZVwiLCBcImN1cnNvclwiXSxcclxuXHRcdFx0aGFzSW1hZ2VBdHRyaWJ1dGVzID0gW1wic3Jjc2V0XCJdLFxyXG5cdFx0XHRtYXRjaF91cmwgPSAvdXJsXFwoXFxzKihbJ1wiXT8pKC4qPylcXDFcXHMqXFwpL2csXHJcblx0XHRcdGFsbF9pbWFnZXMgPSBbXSxcclxuXHRcdFx0dG90YWwgPSAwLFxyXG5cdFx0XHRjb3VudCA9IDA7XHJcblxyXG5cdFx0dmFyIGNpcmNsZV9vID0gJChcIiNwcmVsb2FkZXItc3ZnX19pbWcgLmJhcl9fb3V0ZXJcIiksXHJcblx0XHRcdGNpcmNsZV9jID0gJChcIiNwcmVsb2FkZXItc3ZnX19pbWcgLmJhcl9fY2VudGVyXCIpLFxyXG5cdFx0XHRjaXJjbGVfaSA9ICQoXCIjcHJlbG9hZGVyLXN2Z19faW1nIC5iYXJfX2lubmVyXCIpLFxyXG5cdFx0XHRsZW5ndGhfbyA9IE1hdGguUEkqKGNpcmNsZV9vLmF0dHIoXCJyXCIpICogMiksXHJcblx0XHRcdGxlbmd0aF9jID0gTWF0aC5QSSooY2lyY2xlX2MuYXR0cihcInJcIikgKiAyKSxcclxuXHRcdFx0bGVuZ3RoX2kgPSBNYXRoLlBJKihjaXJjbGVfaS5hdHRyKFwiclwiKSAqIDIpO1xyXG5cclxuXHJcblx0XHRmdW5jdGlvbiBpbWdfbG9hZGVkKCl7XHJcblx0XHRcdHZhciBwZXJjZW50YWdlID0gTWF0aC5jZWlsKCArK2NvdW50IC8gdG90YWwgKiAxMDAgKTtcclxuXHJcblx0XHRcdHBlcmNlbnRhZ2UgPSBwZXJjZW50YWdlID4gMTAwID8gMTAwIDogcGVyY2VudGFnZTtcclxuXHJcblx0XHRcdC8vIERyYXcgb2Zmc2V0c1xyXG5cdFx0XHRjaXJjbGVfby5jc3Moe3N0cm9rZURhc2hvZmZzZXQ6ICgoMTAwLXBlcmNlbnRhZ2UpLzEwMCkqbGVuZ3RoX28gfSk7XHJcblxyXG5cdFx0XHRpZihwZXJjZW50YWdlID4gNTApIHtcclxuXHRcdFx0XHRjaXJjbGVfYy5jc3Moe3N0cm9rZURhc2hvZmZzZXQ6ICgoMTAwLXBlcmNlbnRhZ2UpLzEwMCkqbGVuZ3RoX2MgfSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKHBlcmNlbnRhZ2UgPT0gMTAwKSB7XHJcblx0XHRcdFx0Y2lyY2xlX2kuY3NzKHtzdHJva2VEYXNob2Zmc2V0OiAoKDEwMC1wZXJjZW50YWdlKS8xMDApKmxlbmd0aF9pIH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRwcmVsb2FkZXJfc3RhdC5odG1sKHBlcmNlbnRhZ2UpO1xyXG5cclxuXHRcdFx0aWYoY291bnQgPT09IHRvdGFsKSByZXR1cm4gZG9uZV9sb2FkaW5nKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gZG9uZV9sb2FkaW5nKCl7XHJcblx0XHRcdCQoXCIjcHJlbG9hZGVyXCIpLmRlbGF5KDcwMCkuZmFkZU91dCg3MDAsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0JChcIiNwcmVsb2FkZXJfX3Byb2dyZXNzXCIpLnJlbW92ZSgpO1xyXG5cclxuXHRcdFx0XHRpZigkKFwiLmZsaXAtY2FyZFwiKS5sZW5ndGgpe1xyXG5cdFx0XHRcdFx0JChcIi5mbGlwLWNhcmRcIikuYWRkQ2xhc3MoXCJsb2FkZWRcIik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBpbWFnZXNfbG9vcCAoKSB7XHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHZhciB0ZXN0X2ltYWdlID0gbmV3IEltYWdlKCk7XHJcblxyXG5cdFx0XHRcdHRlc3RfaW1hZ2Uub25sb2FkID0gaW1nX2xvYWRlZDtcclxuXHRcdFx0XHR0ZXN0X2ltYWdlLm9uZXJyb3IgPSBpbWdfbG9hZGVkO1xyXG5cclxuXHRcdFx0XHQvLyBjb25zb2xlLmxvZyhcIkM6IFwiICsgY291bnQsIFwiIFQ6IFwiICsgdG90YWwpO1xyXG5cclxuXHRcdFx0XHRpZiAoY291bnQgIT0gdG90YWwpIHtcclxuXHRcdFx0XHRcdGlmIChhbGxfaW1hZ2VzW2NvdW50XS5zcmNzZXQpIHtcclxuXHRcdFx0XHRcdFx0dGVzdF9pbWFnZS5zcmNzZXQgPSBhbGxfaW1hZ2VzW2NvdW50XS5zcmNzZXQ7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR0ZXN0X2ltYWdlLnNyYyA9IGFsbF9pbWFnZXNbY291bnRdLnNyYztcclxuXHJcblx0XHRcdFx0XHRpbWFnZXNfbG9vcCgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSwgNTApO1xyXG5cdFx0fVxyXG5cclxuXHRcdCQoXCIqXCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG5cdFx0XHR2YXIgZWxlbWVudCA9ICQodGhpcyk7XHJcblxyXG5cdFx0XHRpZiAoZWxlbWVudC5pcyhcImltZ1wiKSAmJiBlbGVtZW50LmF0dHIoXCJzcmNcIikpIHtcclxuXHRcdFx0XHRhbGxfaW1hZ2VzLnB1c2goe1xyXG5cdFx0XHRcdFx0c3JjOiBlbGVtZW50LmF0dHIoXCJzcmNcIiksXHJcblx0XHRcdFx0XHRlbGVtZW50OiBlbGVtZW50WzBdXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdCQuZWFjaChoYXNJbWFnZVByb3BlcnRpZXMsIGZ1bmN0aW9uIChpLCBwcm9wZXJ0eSkge1xyXG5cdFx0XHRcdHZhciBwcm9wZXJ0eVZhbHVlID0gZWxlbWVudC5jc3MocHJvcGVydHkpO1xyXG5cdFx0XHRcdHZhciBtYXRjaDtcclxuXHJcblx0XHRcdFx0aWYgKCFwcm9wZXJ0eVZhbHVlKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdG1hdGNoID0gbWF0Y2hfdXJsLmV4ZWMocHJvcGVydHlWYWx1ZSk7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYgKG1hdGNoKSB7XHJcblx0XHRcdFx0XHRhbGxfaW1hZ2VzLnB1c2goe1xyXG5cdFx0XHRcdFx0XHRzcmM6IG1hdGNoWzJdLFxyXG5cdFx0XHRcdFx0XHRlbGVtZW50OiBlbGVtZW50WzBdXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0JC5lYWNoKGhhc0ltYWdlQXR0cmlidXRlcywgZnVuY3Rpb24gKGksIGF0dHJpYnV0ZSkge1xyXG5cdFx0XHRcdHZhciBhdHRyaWJ1dGVWYWx1ZSA9IGVsZW1lbnQuYXR0cihhdHRyaWJ1dGUpO1xyXG5cclxuXHRcdFx0XHRpZiAoIWF0dHJpYnV0ZVZhbHVlKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGFsbF9pbWFnZXMucHVzaCh7XHJcblx0XHRcdFx0XHRzcmM6IGVsZW1lbnQuYXR0cihcInNyY1wiKSxcclxuXHRcdFx0XHRcdHNyY3NldDogZWxlbWVudC5hdHRyKFwic3Jjc2V0XCIpLFxyXG5cdFx0XHRcdFx0ZWxlbWVudDogZWxlbWVudFswXVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdHRvdGFsID0gYWxsX2ltYWdlcy5sZW5ndGg7XHJcblxyXG5cdFx0aWYgKHRvdGFsID09PSAwKSB7XHJcblx0XHRcdGRvbmVfbG9hZGluZygpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cHJlbG9hZGVyX3N0YXQuY3NzKHtvcGFjaXR5OiAxfSk7XHJcblx0XHRcdGltYWdlc19sb29wKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZm9yKHZhciBpPTA7IGk8dG90YWw7IGkrKyl7XHJcblx0XHQvLyBcdHZhciB0ZXN0X2ltYWdlID0gbmV3IEltYWdlKCk7XHJcblxyXG5cclxuXHRcdC8vIFx0dGVzdF9pbWFnZS5vbmxvYWQgPSBpbWdfbG9hZGVkO1xyXG5cdFx0Ly8gXHR0ZXN0X2ltYWdlLm9uZXJyb3IgPSBpbWdfbG9hZGVkO1xyXG5cclxuXHRcdC8vIFx0aWYgKGFsbF9pbWFnZXNbaV0uc3Jjc2V0KSB7XHJcblx0XHQvLyBcdFx0dGVzdF9pbWFnZS5zcmNzZXQgPSBhbGxfaW1hZ2VzW2ldLnNyY3NldDtcclxuXHRcdC8vIFx0fVxyXG5cdFx0Ly8gXHR0ZXN0X2ltYWdlLnNyYyA9IGFsbF9pbWFnZXNbaV0uc3JjO1xyXG5cdFx0Ly8gfVxyXG5cdH1cclxuXHJcblx0cHJlbG9hZGVyKCk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBQYWdlIGNoYW5nZXJcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQkKGRvY3VtZW50KS5vbihcImNsaWNrXCIsIFwiYS5wcmVsb2FkLWxpbmtcIiwgZnVuY3Rpb24oZSkge1xyXG5cdFx0dmFyIGhyZWYgPSAkKHRoaXMpLmF0dHIoXCJocmVmXCIpO1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdHJldHVybiAkKFwiI3ByZWxvYWRlclwiKVxyXG5cdFx0XHQuZmFkZUluKDMwMCwgZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRyZXR1cm4gZG9jdW1lbnQubG9jYXRpb24gPSBocmVmICE9IG51bGwgPyBocmVmIDogXCIvXCI7XHJcblx0XHRcdH0pO1xyXG5cdH0pO1xyXG5cclxuXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBBbmltYXRpb25zXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0JC5mbi5hbmltYXRlZCA9IGZ1bmN0aW9uKGluRWZmZWN0KSB7XHJcblx0XHQkKHRoaXMpLmVhY2goZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciB0aHMgPSAkKHRoaXMpO1xyXG5cdFx0XHR0aHMuY3NzKHtvcGFjaXR5OjB9KVxyXG5cdFx0XHRcdC5hZGRDbGFzcyhcImFuaW1hdGVkXCIpXHJcblx0XHRcdFx0LndheXBvaW50KGZ1bmN0aW9uKGRpcikge1xyXG5cdFx0XHRcdFx0aWYgKGRpciA9PT0gXCJkb3duXCIpIHtcclxuXHRcdFx0XHRcdFx0dGhzLmFkZENsYXNzKGluRWZmZWN0KS5jc3Moe29wYWNpdHk6MX0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0b2Zmc2V0OiBcIjkwJVwiXHJcblx0XHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9O1xyXG5cclxuXHQkKFwiaGVhZGVyIC5zdmctaGVhZGluZywgLnRhbGtzIC5zdmctaGVhZGluZywgLnRhbGtzIC50ZXN0aW1vbmlhbFwiKS5hbmltYXRlZChcImZhZGVJblVwXCIpO1xyXG5cdCQoXCIuYWJvdXQtbWVfX3NraWxscz5kaXZcIikuYW5pbWF0ZWQoXCJmYWRlSW5VcFwiKTtcclxuXHQkKFwiLmFydGljbGUsIC5wb3J0Zm9saW8tc2xpZGVyX19uYXZpZ2F0aW9uLWNvbnRhaW5lciwgLnBvcnRmb2xpby1zbGlkZXJfX3ByZXZpZXctY29udGFpbmVyXCIpLmFuaW1hdGVkKFwiZmFkZUluXCIpO1xyXG5cdCQoXCIucG9ydGZvbGlvLXNsaWRlcl9fcHJvamVjdHMtY29udGFpbmVyXCIpLmFuaW1hdGVkKFwiZmFkZUluXCIpO1xyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gUGllY2hhcnRzIGFuaW1hdGlvblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGlmKCQoXCIucGllY2hhcnRcIikubGVuZ3RoKXtcclxuXHRcdCQoXCIucGllY2hhcnQgLnBpZWNoYXJ0X19maWxsXCIpLmVhY2goZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIHBpZSA9ICQodGhpcyk7XHJcblx0XHRcdHBpZS53YXlwb2ludChmdW5jdGlvbihkaXIpIHtcclxuXHRcdFx0XHRpZiAoZGlyID09PSBcImRvd25cIikge1xyXG5cdFx0XHRcdFx0cGllLmNzcyh7c3Ryb2tlRGFzaG9mZnNldDpwaWUuZGF0YShcInBlcmNlbnRhZ2VcIil9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0b2Zmc2V0OiBcIjkwJVwiXHJcblx0XHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBQYXJhbGxheFxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdHZhciBpc190aGlzX2llID0gZGV0ZWN0X0lFKCk7XHJcblxyXG5cdC8vIElFIHNjcm9sbCBqdW1wIGZpeFxyXG5cdGlmKGlzX3RoaXNfaWUpIHtcclxuXHRcdCQoXCIubGF5ZXJcIikuY3NzKHt0cmFuc2l0aW9uOlwidG9wIC4xNXMgbGluZWFyXCJ9KTtcclxuXHRcdCQoXCIjc2NlbmUudmVydGljYWxcIikuY3NzKHt0cmFuc2l0aW9uOlwib3BhY2l0eSAuMTVzIGxpbmVhclwifSk7XHJcblxyXG5cdFx0JChcImJvZHlcIikub24oXCJtb3VzZXdoZWVsXCIsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTsgXHJcblxyXG5cdFx0XHR2YXIgd2hlZWxEZWx0YSA9IGV2ZW50LndoZWVsRGVsdGEsXHJcblx0XHRcdFx0Y3VycmVudFNjcm9sbFBvc2l0aW9uID0gd2luZG93LnBhZ2VZT2Zmc2V0O1xyXG5cclxuXHRcdFx0d2luZG93LnNjcm9sbFRvKDAsIGN1cnJlbnRTY3JvbGxQb3NpdGlvbiAtIHdoZWVsRGVsdGEpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRpZigkKFwiI3NjZW5lLmF4aXNcIikubGVuZ3RoKXtcclxuXHRcdCQoXCIjc2NlbmUuYXhpc1wiKS5wYXJhbGxheCh7XHJcblx0XHRcdHNjYWxhclg6IDMsXHJcblx0XHRcdHNjYWxhclk6IDMsXHJcblx0XHRcdGZyaWN0aW9uWDogMC41LFxyXG5cdFx0XHRmcmljdGlvblk6IDAuNVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRpZigkKFwiI3NjZW5lLnZlcnRpY2FsXCIpLmxlbmd0aCl7XHJcblx0XHQkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgc2Nyb2xsUG9zID0gJCh0aGlzKS5zY3JvbGxUb3AoKSxcclxuXHRcdFx0XHRsYXllcnMgPSAkKFwiI3NjZW5lLnZlcnRpY2FsIC5sYXllclwiKTtcclxuXHJcblx0XHRcdGxheWVycy5jc3Moe1wid2lsbC1jaGFuZ2VcIjpcInRyYW5zZm9ybVwifSk7XHJcblxyXG5cdFx0XHRsYXllcnMuZWFjaChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHZhciBsYXllciA9ICQodGhpcyk7XHJcblxyXG5cdFx0XHRcdGlmKGxheWVyLmluZGV4KCkgIT0wICkge1xyXG5cdFx0XHRcdFx0bGF5ZXIuY3NzKHtcclxuXHRcdFx0XHRcdFx0XCJ0cmFuc2Zvcm1cIiA6IFwidHJhbnNsYXRlM2QoMCxcIiArICggKHNjcm9sbFBvcy8oNSArIDIqbGF5ZXIuaW5kZXgoKSkpICkgKyBcInB4LDApXCJcclxuXHRcdFx0XHRcdFx0Ly8gXCJ0b3BcIiA6ICggKHNjcm9sbFBvcy8oNSArIDIqbGF5ZXIuaW5kZXgoKSkpICkgKyBcInB4XCJcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRcdCQoXCIjc2NlbmUudmVydGljYWxcIikuY3NzKHtcclxuXHRcdFx0XHRcIm9wYWNpdHlcIiA6IDEtKHNjcm9sbFBvcy83MjApXHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBMb2dpbiBjYXJkIGZsaXBcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQkKFwiLmxvZ2luLWJ1dHRvblwiKS5jbGljayhmdW5jdGlvbigpIHtcclxuXHRcdCQoXCJib2R5XCIpLmFkZENsYXNzKFwiY2FyZF9mbGlwcGVkXCIpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiI3VuZmxpcC1jYXJkXCIpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdCQoXCJib2R5XCIpLnJlbW92ZUNsYXNzKFwiY2FyZF9mbGlwcGVkXCIpO1xyXG5cdH0pO1xyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBDb250YWN0IGZvcm1cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRpZigkKFwiI2NvbnRhY3RcIikubGVuZ3RoKXtcclxuXHRcdHZhciBjX2Zvcm0gPSAkKFwiI2NvbnRhY3RcIiksXHJcblx0XHRcdHNlbmRfYnV0dG9uID0gY19mb3JtLmZpbmQoXCIjZm9ybS1zdWJtaXRcIiksXHJcblx0XHRcdGNsZWFyX2J1dHRvbiA9IGNfZm9ybS5maW5kKFwiI2Zvcm0tY2xlYXJcIik7XHJcblxyXG5cdFx0Y2xlYXJfYnV0dG9uLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSl7XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0Y19mb3JtWzBdLnJlc2V0KCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRzZW5kX2J1dHRvbi5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdC8vIGNfZm9ybVswXS5yZXNldCgpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBNYWluIG1lbnVcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQkKFwiI21lbnUtdG9nZ2xlXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHQkKHRoaXMpLmFkZChcIi5tYWluLW1lbnVcIikudG9nZ2xlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIubWFpbi1tZW51X19pdGVtXCIpLmVhY2goZnVuY3Rpb24oaW5kZXgpIHtcclxuXHRcdCQodGhpcykuY3NzKFwidHJhbnNpdGlvbi1kZWxheVwiLCAwLjMrMC4xKmluZGV4ICsgXCJzXCIpO1xyXG5cdH0pO1xyXG5cclxuXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBCdXR0b25zXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0JChcImJ1dHRvbi5nby1kb3duXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgZ28gPSAkKHRoaXMpLmRhdGEoXCJsaW5rXCIpO1xyXG5cdFx0JChcImh0bWwsIGJvZHlcIikuc3RvcCgpLmFuaW1hdGUoe1xyXG5cdFx0XHRzY3JvbGxUb3A6ICQoZ28pLm9mZnNldCgpLnRvcFxyXG5cdFx0fSwgNzAwLCBcInN3aW5nXCIpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiYnV0dG9uLmdvLXVwXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHQkKFwiaHRtbCwgYm9keVwiKS5zdG9wKCkuYW5pbWF0ZSh7XHJcblx0XHRcdHNjcm9sbFRvcDogMFxyXG5cdFx0fSwgNzAwLCBcInN3aW5nXCIpO1xyXG5cdH0pO1xyXG5cclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFNsaWRlclxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIHByZXBhcmVfdGl0bGUodGl0bGVfY29udGFpbmVyKXtcclxuXHRcdHZhciBsZXR0ZXJzID0gJC50cmltKHRpdGxlX2NvbnRhaW5lci50ZXh0KCkpLFxyXG5cdFx0XHRuZXdfdGl0bGUgPSBcIlwiO1xyXG5cclxuXHRcdHRpdGxlX2NvbnRhaW5lci5odG1sKFwiXCIpO1xyXG5cclxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBsZXR0ZXJzLmxlbmd0aDsgaSsrKXtcclxuXHRcdFx0dmFyIGNzc19kZWxheSA9IFwic3R5bGU9J2FuaW1hdGlvbi1kZWxheTogXCIgKyAoMC43L2xldHRlcnMubGVuZ3RoKSooaSsxKSArIFwicydcIixcclxuXHRcdFx0XHR0ZXh0ID0gXCI8c3BhbiBjbGFzcz0nbGV0dGVyJyBcIiArIGNzc19kZWxheSArIFwiPlwiICsgbGV0dGVyc1tpXSArIFwiPC9zcGFuPlwiO1xyXG5cclxuXHRcdFx0aWYoaT09MCl7XHJcblx0XHRcdFx0dGV4dCA9IFwiPHNwYW4gY2xhc3M9J3dvcmQnPlwiICsgdGV4dDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihsZXR0ZXJzW2ldID09IFwiIFwiIHx8IGxldHRlcnNbaV0gPT0gXCImbmJzcDtcIil7XHJcblx0XHRcdFx0dGV4dCA9IFwiPC9zcGFuPlxcbjxzcGFuIGNsYXNzPSd3b3JkJz5cIjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihpID09IGxldHRlcnMubGVuZ3RoLTEpIHtcclxuXHRcdFx0XHR0ZXh0ID0gdGV4dCArIFwiPC9zcGFuPlwiO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRuZXdfdGl0bGUgKz0gdGV4dDtcclxuXHRcdH1cclxuXHJcblx0XHR0aXRsZV9jb250YWluZXIuYXBwZW5kKG5ld190aXRsZSk7XHJcblx0fVxyXG5cclxuXHRpZigkKFwiLnBvcnRmb2xpby1zbGlkZXJcIikubGVuZ3RoKXtcclxuXHJcblx0XHQvLyBjb25zb2xlLnRpbWUoXCJTbGlkZXIgcHJlcGFyZVwiKTtcclxuXHJcblx0XHQkKFwiLnBvcnRmb2xpby1wcm9qZWN0cyAucHJvamVjdF9fdGl0bGVcIilcclxuXHRcdFx0LmFkZChcIi5wb3J0Zm9saW8tcHJvamVjdHMgLnByb2plY3RfX3RlY2hcIilcclxuXHRcdFx0LmVhY2goZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cHJlcGFyZV90aXRsZSgkKHRoaXMpKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cclxuXHRcdCQoXCIucG9ydGZvbGlvLXByb2plY3RzIC5hY3RpdmUgLnByb2plY3RfX3RpdGxlIC5sZXR0ZXJcIilcclxuXHRcdFx0LmFkZChcIi5wb3J0Zm9saW8tcHJvamVjdHMgLmFjdGl2ZSAucHJvamVjdF9fdGVjaCAubGV0dGVyXCIpXHJcblx0XHRcdC5hZGRDbGFzcyhcInNob3dcIik7XHJcblxyXG5cclxuXHRcdHZhciBzbGlkZXIgPSAkKFwiLnBvcnRmb2xpby1zbGlkZXJcIiksXHJcblx0XHRcdHByZXZpZXdzID0gc2xpZGVyLmZpbmQoXCIucG9ydGZvbGlvLXByZXZpZXdcIiksXHJcblx0XHRcdHByb2plY3RzID0gc2xpZGVyLmZpbmQoXCIucG9ydGZvbGlvLXByb2plY3RzIC5wcm9qZWN0XCIpO1xyXG5cclxuXHRcdC8vIGNvbnNvbGUudGltZUVuZChcIlNsaWRlciBwcmVwYXJlXCIpO1xyXG5cclxuXHRcdCQoXCIucG9ydGZvbGlvLWJ1dHRvblwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdC8vIGNvbnNvbGUudGltZShcIlNsaWRlciBjbGlja1wiKTtcclxuXHJcblx0XHRcdHZhciB0aGlzX2J1dHRvbiA9ICQodGhpcyksXHJcblx0XHRcdFx0dGhpc190aHVtYm5haWxzID0gdGhpc19idXR0b24ubmV4dCgpLmZpbmQoXCIucG9ydGZvbGlvLXRodW1ibmFpbHNfX3RodW1ibmFpbFwiKSxcclxuXHRcdFx0XHR0aGlzX2FjdGl2ZV90aHVtYiA9IHRoaXNfdGh1bWJuYWlscy5maWx0ZXIoXCIuYWN0aXZlXCIpLFxyXG5cdFx0XHRcdHRoaXNfbmV4dF9pbmRleCA9IHRoaXNfdGh1bWJuYWlscy5pbmRleCh0aGlzX2FjdGl2ZV90aHVtYik7XHJcblxyXG5cdFx0XHR2YXIgb3RoZXJfYnV0dG9uID0gdGhpc19idXR0b24ucGFyZW50KCkuc2libGluZ3MoKS5maW5kKFwiLnBvcnRmb2xpby1idXR0b25cIiksXHJcblx0XHRcdFx0b3RoZXJfdGh1bWJuYWlscyA9IG90aGVyX2J1dHRvbi5uZXh0KCkuZmluZChcIi5wb3J0Zm9saW8tdGh1bWJuYWlsc19fdGh1bWJuYWlsXCIpLFxyXG5cdFx0XHRcdG90aGVyX2FjdGl2ZV90aHVtYiA9IG90aGVyX3RodW1ibmFpbHMuZmlsdGVyKFwiLmFjdGl2ZVwiKSxcclxuXHRcdFx0XHRvdGhlcl9uZXh0X2luZGV4ID0gb3RoZXJfdGh1bWJuYWlscy5pbmRleChvdGhlcl9hY3RpdmVfdGh1bWIpO1xyXG5cclxuXHRcdFx0dmFyIGFjdGl2ZV9wcmV2aWV3ID0gcHJldmlld3MuZmlsdGVyKFwiLmFjdGl2ZVwiKSxcclxuXHRcdFx0XHRuZXh0X3ByZXZpZXdfaW5kZXggPSBwcmV2aWV3cy5pbmRleChhY3RpdmVfcHJldmlldyksXHJcblx0XHRcdFx0YWN0aXZlX3Byb2plY3QgPSBwcm9qZWN0cy5maWx0ZXIoXCIuYWN0aXZlXCIpLFxyXG5cdFx0XHRcdG5leHRfcHJvamVjdF9pbmRleCA9IHByb2plY3RzLmluZGV4KGFjdGl2ZV9wcm9qZWN0KTtcclxuXHJcblxyXG5cclxuXHRcdFx0aWYodGhpc19idXR0b24uaGFzQ2xhc3MoXCJwb3J0Zm9saW8tYnV0dG9uX25leHRcIikpIHtcclxuXHRcdFx0XHRuZXh0X3Byb2plY3RfaW5kZXggPSAobmV4dF9wcm9qZWN0X2luZGV4ID49IHByb2plY3RzLmxlbmd0aC0xKSA/IDAgOiBuZXh0X3Byb2plY3RfaW5kZXgrMTtcclxuXHRcdFx0XHR0aGlzX25leHRfaW5kZXggPSB0aGlzX25leHRfaW5kZXggPj0gdGhpc190aHVtYm5haWxzLmxlbmd0aC0xID8gMCA6IHRoaXNfbmV4dF9pbmRleCsxO1xyXG5cdFx0XHRcdG90aGVyX25leHRfaW5kZXggPSAob3RoZXJfbmV4dF9pbmRleCA+PSBvdGhlcl90aHVtYm5haWxzLmxlbmd0aC0xKSA/IDAgOiBvdGhlcl9uZXh0X2luZGV4KzE7XHJcblxyXG5cdFx0XHRcdG5leHRfcHJldmlld19pbmRleCA9IChuZXh0X3ByZXZpZXdfaW5kZXggPj0gcHJldmlld3MubGVuZ3RoLTEpID8gMCA6IG5leHRfcHJldmlld19pbmRleCsxO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdG5leHRfcHJvamVjdF9pbmRleC0tO1xyXG5cdFx0XHRcdHRoaXNfbmV4dF9pbmRleC0tO1xyXG5cdFx0XHRcdG90aGVyX25leHRfaW5kZXgtLTtcclxuXHJcblx0XHRcdFx0bmV4dF9wcmV2aWV3X2luZGV4LS07XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZ1bmN0aW9uIGxvY2tfYnV0dG9ucygpe1xyXG5cdFx0XHRcdHRoaXNfYnV0dG9uLnByb3AoXCJkaXNhYmxlZFwiLCB0cnVlKTtcclxuXHRcdFx0XHRvdGhlcl9idXR0b24ucHJvcChcImRpc2FibGVkXCIsIHRydWUpO1xyXG5cclxuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHR0aGlzX2J1dHRvbi5wcm9wKFwiZGlzYWJsZWRcIiwgZmFsc2UpO1xyXG5cdFx0XHRcdFx0b3RoZXJfYnV0dG9uLnByb3AoXCJkaXNhYmxlZFwiLCBmYWxzZSk7XHJcblx0XHRcdFx0fSwgNzAwKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZnVuY3Rpb24gY2hhbmdlX3RodW1icygpe1xyXG5cdFx0XHRcdHZhciB0aGlzX25leHRfdGh1bWIgPSB0aGlzX3RodW1ibmFpbHMuZXEodGhpc19uZXh0X2luZGV4KSxcclxuXHRcdFx0XHRcdG90aGVyX25leHRfdGh1bWIgPSBvdGhlcl90aHVtYm5haWxzLmVxKG90aGVyX25leHRfaW5kZXgpO1xyXG5cclxuXHRcdFx0XHR0aGlzX25leHRfdGh1bWIucmVtb3ZlQ2xhc3MoXCJtb3ZlLWRvd25cIikuYWRkQ2xhc3MoXCJhY3RpdmUgbW92ZS11cFwiKTtcclxuXHRcdFx0XHR0aGlzX2FjdGl2ZV90aHVtYi5yZW1vdmVDbGFzcyhcImFjdGl2ZSBtb3ZlLWRvd25cIikuYWRkQ2xhc3MoXCJtb3ZlLXVwXCIpO1xyXG5cclxuXHRcdFx0XHRvdGhlcl9uZXh0X3RodW1iLnJlbW92ZUNsYXNzKFwibW92ZS11cFwiKS5hZGRDbGFzcyhcImFjdGl2ZSBtb3ZlLWRvd25cIik7XHJcblx0XHRcdFx0b3RoZXJfYWN0aXZlX3RodW1iLnJlbW92ZUNsYXNzKFwiYWN0aXZlIG1vdmUtdXBcIikuYWRkQ2xhc3MoXCJtb3ZlLWRvd25cIik7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZ1bmN0aW9uIGNoYW5nZV9wcmV2aWV3KCl7XHJcblx0XHRcdFx0dmFyIG5leHRfcHJldmlldyA9IHByZXZpZXdzLmVxKG5leHRfcHJldmlld19pbmRleCk7XHJcblxyXG5cdFx0XHRcdGFjdGl2ZV9wcmV2aWV3LnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHRcdG5leHRfcHJldmlldy5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZnVuY3Rpb24gY2hhbmdlX3Byb2plY3QoKXtcclxuXHRcdFx0XHR2YXIgbmV4dF9wcm9qZWN0ID0gcHJvamVjdHMuZXEobmV4dF9wcm9qZWN0X2luZGV4KSxcclxuXHRcdFx0XHRcdHRpdGxlX2xldHRlcnMgPSBuZXh0X3Byb2plY3QuZmluZChcIi5wcm9qZWN0X190aXRsZSBzcGFuLmxldHRlclwiKSxcclxuXHRcdFx0XHRcdHRlY2hfbGV0dGVycyA9IG5leHRfcHJvamVjdC5maW5kKFwiLnByb2plY3RfX3RlY2ggc3Bhbi5sZXR0ZXJcIik7XHJcblxyXG5cdFx0XHRcdGFjdGl2ZV9wcm9qZWN0XHJcblx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIilcclxuXHRcdFx0XHRcdC5maW5kKFwic3Bhbi5sZXR0ZXIsIHNwYW4ubGV0dGVyXCIpXHJcblx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoXCJzaG93XCIpO1xyXG5cdFx0XHRcdG5leHRfcHJvamVjdC5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHJcblx0XHRcdFx0dGl0bGVfbGV0dGVycy5hZGRDbGFzcyhcInNob3dcIik7XHJcblx0XHRcdFx0dGVjaF9sZXR0ZXJzLmFkZENsYXNzKFwic2hvd1wiKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gY29uc29sZS50aW1lRW5kKFwiU2xpZGVyIGNsaWNrXCIpO1xyXG5cclxuXHRcdFx0Y2hhbmdlX3RodW1icygpO1xyXG5cdFx0XHRjaGFuZ2VfcHJvamVjdCgpO1xyXG5cdFx0XHRjaGFuZ2VfcHJldmlldygpO1xyXG5cdFx0XHRsb2NrX2J1dHRvbnMoKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBCbG9nIHNjcm9sbCBldmVudHNcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRpZigkKFwiLmJsb2ctbmF2aWdhdGlvblwiKS5sZW5ndGgpe1xyXG5cdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3RvZ2dsZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvblwiKS50b2dnbGVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdHZhciBsYXN0SWQsXHJcblx0XHRcdG1lbnUgPSAkKFwiLmJsb2ctbmF2aWdhdGlvblwiKSxcclxuXHRcdFx0bWVudUl0ZW1zID0gbWVudS5maW5kKFwibGkgYVwiKSxcclxuXHRcdFx0c2Nyb2xsSXRlbXMgPSBtZW51SXRlbXMubWFwKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dmFyIGl0ZW0gPSAkKCQodGhpcykuYXR0cihcImhyZWZcIikpO1xyXG5cdFx0XHRcdGlmIChpdGVtLmxlbmd0aCkgcmV0dXJuIGl0ZW07XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdG1lbnVJdGVtcy5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdFx0dmFyIGhyZWYgPSAkKHRoaXMpLmF0dHIoXCJocmVmXCIpLFxyXG5cdFx0XHRcdG9mZnNldFRvcCA9IChocmVmID09PSBcIiNcIikgPyAwIDogJChocmVmKS5vZmZzZXQoKS50b3AtNjA7XHJcblx0XHRcdFxyXG5cdFx0XHQkKFwiaHRtbCwgYm9keVwiKS5zdG9wKCkuYW5pbWF0ZSh7IFxyXG5cdFx0XHRcdHNjcm9sbFRvcDogb2Zmc2V0VG9wXHJcblx0XHRcdH0sIDcwMCwgXCJzd2luZ1wiKTtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0JCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIGZyb21Ub3AgPSAkKHRoaXMpLnNjcm9sbFRvcCgpLFxyXG5cdFx0XHRcdGJsb2dOYXZPZmZzZXQgPSAkKFwiLmJsb2ctbmF2aWdhdGlvblwiKS5vZmZzZXQoKS50b3AsXHJcblx0XHRcdFx0YmxvZ05hdkxpbWl0ID0gJChcIi5mb290ZXJfX3dyYXBwZXJcIikub2Zmc2V0KCkudG9wIC0gJChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikub3V0ZXJIZWlnaHQoKSxcclxuXHRcdFx0XHRjdXJyZW50ID0gc2Nyb2xsSXRlbXMubWFwKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHRpZiAoJCh0aGlzKS5vZmZzZXQoKS50b3AgPCBmcm9tVG9wKzE0NClcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRjdXJyZW50ID0gY3VycmVudFtjdXJyZW50Lmxlbmd0aC0xXTtcclxuXHRcdFx0dmFyIGlkID0gY3VycmVudCAmJiBjdXJyZW50Lmxlbmd0aCA/IGN1cnJlbnRbMF0uaWQgOiBcIlwiO1xyXG5cclxuXHRcdFx0aWYgKGxhc3RJZCAhPT0gaWQpIHtcclxuXHRcdFx0XHRsYXN0SWQgPSBpZDtcclxuXHRcdFx0XHRtZW51SXRlbXMucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIikuZmlsdGVyKFwiW2hyZWY9I1wiK2lkK1wiXVwiKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYoZnJvbVRvcCA+PSBibG9nTmF2TGltaXQgJiYgJCh3aW5kb3cpLndpZHRoKCkgPiAoNzY4IC0gd2luZG93LmhtLnNjcm9sbEJhcldpZHRoKSkge1xyXG5cdFx0XHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uX193cmFwcGVyXCIpLmNzcyh7XCJwb3NpdGlvblwiOlwiYWJzb2x1dGVcIiwgXCJ0b3BcIjpibG9nTmF2TGltaXQgKyBcInB4XCJ9KTtcclxuXHRcdFx0fSBlbHNlIGlmIChmcm9tVG9wID49IGJsb2dOYXZPZmZzZXQgJiYgJCh3aW5kb3cpLndpZHRoKCkgPiAoNzY4IC0gd2luZG93LmhtLnNjcm9sbEJhcldpZHRoKSkge1xyXG5cdFx0XHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uX193cmFwcGVyXCIpLmNzcyh7XCJwb3NpdGlvblwiOlwiZml4ZWRcIiwgXCJ0b3BcIjowfSk7XHJcblx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikuYWRkQ2xhc3MoXCJuYXYtZml4ZWRcIik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikuY3NzKHtcInBvc2l0aW9uXCI6XCJyZWxhdGl2ZVwifSk7XHJcblx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikucmVtb3ZlQ2xhc3MoXCJuYXYtZml4ZWRcIik7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9KTtcclxuXHJcblx0XHQkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpZigkKHdpbmRvdykud2lkdGgoKSA8PSAoNzY4IC0gd2luZG93LmhtLnNjcm9sbEJhcldpZHRoKSl7XHJcblx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikucmVtb3ZlQ2xhc3MoXCJuYXYtZml4ZWRcIik7XHJcblx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikuY3NzKHtcInBvc2l0aW9uXCI6XCJyZWxhdGl2ZVwifSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0aWYoJChcImJvZHlcIikuc2Nyb2xsVG9wKCkgPj0gJChcIi5ibG9nXCIpLm9mZnNldCgpLnRvcCl7XHJcblx0XHRcdFx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5jc3Moe1wicG9zaXRpb25cIjpcImZpeGVkXCIsIFwidG9wXCI6MH0pO1xyXG5cdFx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikuYWRkQ2xhc3MoXCJuYXYtZml4ZWRcIik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gVGFsa3MgYmx1ciBiYXNlZCBvbiBqc1xyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIHNldF9iZygpe1xyXG5cdFx0dmFyIHNlY3Rpb24gPSAkKFwiLnRhbGtzXCIpLFxyXG5cdFx0XHRmb3JtID0gc2VjdGlvbi5maW5kKFwiLmNvbnRhY3QtZm9ybVwiKSxcclxuXHRcdFx0Zm9ybV9iZyA9IGZvcm0uZmluZChcIi5jb250YWN0LWZvcm1fX2JnXCIpLFxyXG5cdFx0XHRiZ19vZmZzZXQgPSBzZWN0aW9uLm9mZnNldCgpLnRvcCAtIGZvcm1fYmcub2Zmc2V0KCkudG9wO1xyXG5cclxuXHRcdGZvcm1fYmcuY3NzKHtcclxuXHRcdFx0XCJiYWNrZ3JvdW5kLXBvc2l0aW9uXCIgOiBcImNlbnRlciBcIiArIGJnX29mZnNldCArIFwicHhcIlxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRpZigkKFwiLnRhbGtzXCIpLmxlbmd0aCl7XHJcblx0XHQkKHdpbmRvdykubG9hZChmdW5jdGlvbigpIHtcclxuXHRcdFx0c2V0X2JnKCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHQkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRzZXRfYmcoKTtcclxuXHJcblx0XHRcdGlmKCAkKHdpbmRvdykud2lkdGgoKT4yMDAwIC0gd2luZG93LmhtLnNjcm9sbEJhcldpZHRoKXtcclxuXHRcdFx0XHQkKFwiLnRhbGtzLCAuY29udGFjdC1mb3JtX19iZ1wiKS5jc3MoXCJiYWNrZ3JvdW5kLXNpemVcIiwgJCh3aW5kb3cpLndpZHRoKCkgKyBcInB4XCIpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG59KShqUXVlcnkpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
