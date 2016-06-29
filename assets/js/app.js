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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigkKSB7XHJcblx0XCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIEFwcCBnbG9iYWwgcGFyYW1ldGVycyBvYmplY3RcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHR3aW5kb3cuaG0gPSB7fVxyXG5cclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIENoZWNrIHNjcm9sbGJhciB3aWR0aFxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIGdldFNjcm9sbGJhcldpZHRoKCl7XHJcblx0XHR2YXIgc3R5bGUgPSB7XCJtYXgtaGVpZ2h0XCI6XCIxMDBweFwiLCBcIm92ZXJmbG93XCI6XCJzY3JvbGxcIiwgXCJwb3NpdGlvblwiOlwiYWJzb2x1dGVcIn0sXHJcblx0XHRcdHdyYXBwZXIgPSAkKFwiPGRpdiBpZD0nc2Nyb2xsX2Jhcl9jaGVja19BJz48L2Rpdj5cIikuY3NzKHN0eWxlKSxcclxuXHRcdFx0aW5uZXIgPSAkKFwiPGRpdiBpZD0nc2Nyb2xsX2Jhcl9jaGVja19CJz48L2Rpdj5cIiksXHJcblx0XHRcdHN0cmV0Y2hlciA9ICQoXCI8aW1nIHNyYz0nL2Fzc2V0cy9pbWcvZm9yY2Utc2Nyb2xsLnBuZycvPlwiKSxcclxuXHRcdFx0c2Nyb2xsQmFyV2lkdGggPSAwO1xyXG5cclxuXHRcdHdyYXBwZXIuYXBwZW5kKHN0cmV0Y2hlcikuYXBwZW5kKGlubmVyKTtcclxuXHRcdCQoXCJib2R5XCIpLmFwcGVuZCh3cmFwcGVyKTtcclxuXHJcblx0XHRzY3JvbGxCYXJXaWR0aCA9IHdyYXBwZXIud2lkdGgoKS1pbm5lci53aWR0aCgpO1xyXG5cdFx0d3JhcHBlci5yZW1vdmUoKTtcclxuXHJcblx0XHRyZXR1cm4gc2Nyb2xsQmFyV2lkdGg7XHJcblx0fTtcclxuXHJcblx0d2luZG93LmhtLnNjcm9sbEJhcldpZHRoID0gZ2V0U2Nyb2xsYmFyV2lkdGgoKTtcclxuXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBDaGVjayBJRSB2ZXJzaW9uXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0ZnVuY3Rpb24gZGV0ZWN0X0lFKCkge1xyXG5cdFx0dmFyIHVhID0gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQ7XHJcblxyXG5cdFx0dmFyIG1zaWUgPSB1YS5pbmRleE9mKFwiTVNJRSBcIik7XHJcblx0XHRpZiAobXNpZSA+IDApIHtcclxuXHRcdFx0Ly8gSUUgMTAgb3Igb2xkZXIgPT4gcmV0dXJuIHZlcnNpb24gbnVtYmVyXHJcblx0XHRcdHJldHVybiBwYXJzZUludCh1YS5zdWJzdHJpbmcobXNpZSArIDUsIHVhLmluZGV4T2YoXCIuXCIsIG1zaWUpKSwgMTApO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciB0cmlkZW50ID0gdWEuaW5kZXhPZihcIlRyaWRlbnQvXCIpO1xyXG5cdFx0aWYgKHRyaWRlbnQgPiAwKSB7XHJcblx0XHRcdC8vIElFIDExID0+IHJldHVybiB2ZXJzaW9uIG51bWJlclxyXG5cdFx0XHR2YXIgcnYgPSB1YS5pbmRleE9mKFwicnY6XCIpO1xyXG5cdFx0XHRyZXR1cm4gcGFyc2VJbnQodWEuc3Vic3RyaW5nKHJ2ICsgMywgdWEuaW5kZXhPZihcIi5cIiwgcnYpKSwgMTApO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBlZGdlID0gdWEuaW5kZXhPZihcIkVkZ2UvXCIpO1xyXG5cdFx0aWYgKGVkZ2UgPiAwKSB7XHJcblx0XHRcdC8vIEVkZ2UgKElFIDEyKykgPT4gcmV0dXJuIHZlcnNpb24gbnVtYmVyXHJcblx0XHRcdHJldHVybiBwYXJzZUludCh1YS5zdWJzdHJpbmcoZWRnZSArIDUsIHVhLmluZGV4T2YoXCIuXCIsIGVkZ2UpKSwgMTApO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIG90aGVyIGJyb3dzZXJcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gUHJlbG9hZGVyIHdpdGggcGVyY2VudGFnZSBieSBpbWFnZSBjb3VudFxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIHByZWxvYWRlcigpIHtcclxuXHRcdHZhciBwcmVsb2FkZXJfc3RhdCA9ICQoXCIjcHJlbG9hZGVyLXN2Z19fcGVyY2VudGFnZVwiKSxcclxuXHRcdFx0aGFzSW1hZ2VQcm9wZXJ0aWVzID0gW1wiYmFja2dyb3VuZFwiLCBcImJhY2tncm91bmRJbWFnZVwiLCBcImxpc3RTdHlsZUltYWdlXCIsIFwiYm9yZGVySW1hZ2VcIiwgXCJib3JkZXJDb3JuZXJJbWFnZVwiLCBcImN1cnNvclwiXSxcclxuXHRcdFx0aGFzSW1hZ2VBdHRyaWJ1dGVzID0gW1wic3Jjc2V0XCJdLFxyXG5cdFx0XHRtYXRjaF91cmwgPSAvdXJsXFwoXFxzKihbJ1wiXT8pKC4qPylcXDFcXHMqXFwpL2csXHJcblx0XHRcdGFsbF9pbWFnZXMgPSBbXSxcclxuXHRcdFx0dG90YWwgPSAwLFxyXG5cdFx0XHRjb3VudCA9IDA7XHJcblxyXG5cdFx0dmFyIGNpcmNsZV9vID0gJChcIiNwcmVsb2FkZXItc3ZnX19pbWcgLmJhcl9fb3V0ZXJcIiksXHJcblx0XHRcdGNpcmNsZV9jID0gJChcIiNwcmVsb2FkZXItc3ZnX19pbWcgLmJhcl9fY2VudGVyXCIpLFxyXG5cdFx0XHRjaXJjbGVfaSA9ICQoXCIjcHJlbG9hZGVyLXN2Z19faW1nIC5iYXJfX2lubmVyXCIpLFxyXG5cdFx0XHRsZW5ndGhfbyA9IE1hdGguUEkqKGNpcmNsZV9vLmF0dHIoXCJyXCIpICogMiksXHJcblx0XHRcdGxlbmd0aF9jID0gTWF0aC5QSSooY2lyY2xlX2MuYXR0cihcInJcIikgKiAyKSxcclxuXHRcdFx0bGVuZ3RoX2kgPSBNYXRoLlBJKihjaXJjbGVfaS5hdHRyKFwiclwiKSAqIDIpO1xyXG5cclxuXHJcblx0XHRmdW5jdGlvbiBpbWdfbG9hZGVkKCl7XHJcblx0XHRcdHZhciBwZXJjZW50YWdlID0gTWF0aC5jZWlsKCArK2NvdW50IC8gdG90YWwgKiAxMDAgKTtcclxuXHJcblx0XHRcdHBlcmNlbnRhZ2UgPSBwZXJjZW50YWdlID4gMTAwID8gMTAwIDogcGVyY2VudGFnZTtcclxuXHJcblx0XHRcdC8vIERyYXcgb2Zmc2V0c1xyXG5cdFx0XHRjaXJjbGVfby5jc3Moe3N0cm9rZURhc2hvZmZzZXQ6ICgoMTAwLXBlcmNlbnRhZ2UpLzEwMCkqbGVuZ3RoX28gfSk7XHJcblxyXG5cdFx0XHRpZihwZXJjZW50YWdlID4gNTApIHtcclxuXHRcdFx0XHRjaXJjbGVfYy5jc3Moe3N0cm9rZURhc2hvZmZzZXQ6ICgoMTAwLXBlcmNlbnRhZ2UpLzEwMCkqbGVuZ3RoX2MgfSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKHBlcmNlbnRhZ2UgPT0gMTAwKSB7XHJcblx0XHRcdFx0Y2lyY2xlX2kuY3NzKHtzdHJva2VEYXNob2Zmc2V0OiAoKDEwMC1wZXJjZW50YWdlKS8xMDApKmxlbmd0aF9pIH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRwcmVsb2FkZXJfc3RhdC5odG1sKHBlcmNlbnRhZ2UpO1xyXG5cclxuXHRcdFx0aWYoY291bnQgPT09IHRvdGFsKSByZXR1cm4gZG9uZV9sb2FkaW5nKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gZG9uZV9sb2FkaW5nKCl7XHJcblx0XHRcdCQoXCIjcHJlbG9hZGVyXCIpLmRlbGF5KDcwMCkuZmFkZU91dCg3MDAsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0JChcIiNwcmVsb2FkZXJfX3Byb2dyZXNzXCIpLnJlbW92ZSgpO1xyXG5cclxuXHRcdFx0XHRpZigkKFwiLmZsaXAtY2FyZFwiKS5sZW5ndGgpe1xyXG5cdFx0XHRcdFx0JChcIi5mbGlwLWNhcmRcIikuYWRkQ2xhc3MoXCJsb2FkZWRcIik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBpbWFnZXNfbG9vcCAoKSB7XHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHZhciB0ZXN0X2ltYWdlID0gbmV3IEltYWdlKCk7XHJcblxyXG5cdFx0XHRcdHRlc3RfaW1hZ2Uub25sb2FkID0gaW1nX2xvYWRlZDtcclxuXHRcdFx0XHR0ZXN0X2ltYWdlLm9uZXJyb3IgPSBpbWdfbG9hZGVkO1xyXG5cclxuXHRcdFx0XHQvLyBjb25zb2xlLmxvZyhcIkM6IFwiICsgY291bnQsIFwiIFQ6IFwiICsgdG90YWwpO1xyXG5cclxuXHRcdFx0XHRpZiAoY291bnQgIT0gdG90YWwpIHtcclxuXHRcdFx0XHRcdGlmIChhbGxfaW1hZ2VzW2NvdW50XS5zcmNzZXQpIHtcclxuXHRcdFx0XHRcdFx0dGVzdF9pbWFnZS5zcmNzZXQgPSBhbGxfaW1hZ2VzW2NvdW50XS5zcmNzZXQ7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR0ZXN0X2ltYWdlLnNyYyA9IGFsbF9pbWFnZXNbY291bnRdLnNyYztcclxuXHJcblx0XHRcdFx0XHRpbWFnZXNfbG9vcCgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSwgNTApO1xyXG5cdFx0fVxyXG5cclxuXHRcdCQoXCIqXCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG5cdFx0XHR2YXIgZWxlbWVudCA9ICQodGhpcyk7XHJcblxyXG5cdFx0XHRpZiAoZWxlbWVudC5pcyhcImltZ1wiKSAmJiBlbGVtZW50LmF0dHIoXCJzcmNcIikpIHtcclxuXHRcdFx0XHRhbGxfaW1hZ2VzLnB1c2goe1xyXG5cdFx0XHRcdFx0c3JjOiBlbGVtZW50LmF0dHIoXCJzcmNcIiksXHJcblx0XHRcdFx0XHRlbGVtZW50OiBlbGVtZW50WzBdXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdCQuZWFjaChoYXNJbWFnZVByb3BlcnRpZXMsIGZ1bmN0aW9uIChpLCBwcm9wZXJ0eSkge1xyXG5cdFx0XHRcdHZhciBwcm9wZXJ0eVZhbHVlID0gZWxlbWVudC5jc3MocHJvcGVydHkpO1xyXG5cdFx0XHRcdHZhciBtYXRjaDtcclxuXHJcblx0XHRcdFx0aWYgKCFwcm9wZXJ0eVZhbHVlKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdG1hdGNoID0gbWF0Y2hfdXJsLmV4ZWMocHJvcGVydHlWYWx1ZSk7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYgKG1hdGNoKSB7XHJcblx0XHRcdFx0XHRhbGxfaW1hZ2VzLnB1c2goe1xyXG5cdFx0XHRcdFx0XHRzcmM6IG1hdGNoWzJdLFxyXG5cdFx0XHRcdFx0XHRlbGVtZW50OiBlbGVtZW50WzBdXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0JC5lYWNoKGhhc0ltYWdlQXR0cmlidXRlcywgZnVuY3Rpb24gKGksIGF0dHJpYnV0ZSkge1xyXG5cdFx0XHRcdHZhciBhdHRyaWJ1dGVWYWx1ZSA9IGVsZW1lbnQuYXR0cihhdHRyaWJ1dGUpO1xyXG5cclxuXHRcdFx0XHRpZiAoIWF0dHJpYnV0ZVZhbHVlKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGFsbF9pbWFnZXMucHVzaCh7XHJcblx0XHRcdFx0XHRzcmM6IGVsZW1lbnQuYXR0cihcInNyY1wiKSxcclxuXHRcdFx0XHRcdHNyY3NldDogZWxlbWVudC5hdHRyKFwic3Jjc2V0XCIpLFxyXG5cdFx0XHRcdFx0ZWxlbWVudDogZWxlbWVudFswXVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdHRvdGFsID0gYWxsX2ltYWdlcy5sZW5ndGg7XHJcblxyXG5cdFx0aWYgKHRvdGFsID09PSAwKSB7XHJcblx0XHRcdGRvbmVfbG9hZGluZygpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cHJlbG9hZGVyX3N0YXQuY3NzKHtvcGFjaXR5OiAxfSk7XHJcblx0XHRcdGltYWdlc19sb29wKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZm9yKHZhciBpPTA7IGk8dG90YWw7IGkrKyl7XHJcblx0XHQvLyBcdHZhciB0ZXN0X2ltYWdlID0gbmV3IEltYWdlKCk7XHJcblxyXG5cclxuXHRcdC8vIFx0dGVzdF9pbWFnZS5vbmxvYWQgPSBpbWdfbG9hZGVkO1xyXG5cdFx0Ly8gXHR0ZXN0X2ltYWdlLm9uZXJyb3IgPSBpbWdfbG9hZGVkO1xyXG5cclxuXHRcdC8vIFx0aWYgKGFsbF9pbWFnZXNbaV0uc3Jjc2V0KSB7XHJcblx0XHQvLyBcdFx0dGVzdF9pbWFnZS5zcmNzZXQgPSBhbGxfaW1hZ2VzW2ldLnNyY3NldDtcclxuXHRcdC8vIFx0fVxyXG5cdFx0Ly8gXHR0ZXN0X2ltYWdlLnNyYyA9IGFsbF9pbWFnZXNbaV0uc3JjO1xyXG5cdFx0Ly8gfVxyXG5cdH1cclxuXHJcblx0cHJlbG9hZGVyKCk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBQYWdlIGNoYW5nZXJcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQkKGRvY3VtZW50KS5vbihcImNsaWNrXCIsIFwiYS5wcmVsb2FkLWxpbmtcIiwgZnVuY3Rpb24oZSkge1xyXG5cdFx0dmFyIGhyZWYgPSAkKHRoaXMpLmF0dHIoXCJocmVmXCIpO1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdHJldHVybiAkKFwiI3ByZWxvYWRlclwiKVxyXG5cdFx0XHQuZmFkZUluKDMwMCwgZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRyZXR1cm4gZG9jdW1lbnQubG9jYXRpb24gPSBocmVmICE9IG51bGwgPyBocmVmIDogXCIvXCI7XHJcblx0XHRcdH0pO1xyXG5cdH0pO1xyXG5cclxuXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBBbmltYXRpb25zXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0JC5mbi5hbmltYXRlZCA9IGZ1bmN0aW9uKGluRWZmZWN0KSB7XHJcblx0XHQkKHRoaXMpLmVhY2goZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciB0aHMgPSAkKHRoaXMpO1xyXG5cdFx0XHR0aHMuY3NzKHtvcGFjaXR5OjB9KVxyXG5cdFx0XHRcdC5hZGRDbGFzcyhcImFuaW1hdGVkXCIpXHJcblx0XHRcdFx0LndheXBvaW50KGZ1bmN0aW9uKGRpcikge1xyXG5cdFx0XHRcdFx0aWYgKGRpciA9PT0gXCJkb3duXCIpIHtcclxuXHRcdFx0XHRcdFx0dGhzLmFkZENsYXNzKGluRWZmZWN0KS5jc3Moe29wYWNpdHk6MX0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0b2Zmc2V0OiBcIjkwJVwiXHJcblx0XHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9O1xyXG5cclxuXHQkKFwiaGVhZGVyIC5zdmctaGVhZGluZywgLnRhbGtzIC5zdmctaGVhZGluZywgLnRhbGtzIC50ZXN0aW1vbmlhbFwiKS5hbmltYXRlZChcImZhZGVJblVwXCIpO1xyXG5cdCQoXCIuYWJvdXQtbWVfX3NraWxscz5kaXZcIikuYW5pbWF0ZWQoXCJmYWRlSW5VcFwiKTtcclxuXHQkKFwiLmFydGljbGUsIC5wb3J0Zm9saW8tc2xpZGVyX19uYXZpZ2F0aW9uLWNvbnRhaW5lciwgLnBvcnRmb2xpby1zbGlkZXJfX3ByZXZpZXctY29udGFpbmVyXCIpLmFuaW1hdGVkKFwiZmFkZUluXCIpO1xyXG5cdCQoXCIucG9ydGZvbGlvLXNsaWRlcl9fcHJvamVjdHMtY29udGFpbmVyXCIpLmFuaW1hdGVkKFwiZmFkZUluXCIpO1xyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gUGllY2hhcnRzIGFuaW1hdGlvblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGlmKCQoXCIucGllY2hhcnRcIikubGVuZ3RoKXtcclxuXHRcdCQoXCIucGllY2hhcnQgLnBpZWNoYXJ0X19maWxsXCIpLmVhY2goZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIHBpZSA9ICQodGhpcyk7XHJcblx0XHRcdHBpZS53YXlwb2ludChmdW5jdGlvbihkaXIpIHtcclxuXHRcdFx0XHRpZiAoZGlyID09PSBcImRvd25cIikge1xyXG5cdFx0XHRcdFx0cGllLmNzcyh7c3Ryb2tlRGFzaG9mZnNldDpwaWUuZGF0YShcInBlcmNlbnRhZ2VcIil9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0b2Zmc2V0OiBcIjkwJVwiXHJcblx0XHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBQYXJhbGxheFxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdHZhciBpc190aGlzX2llID0gZGV0ZWN0X0lFKCk7XHJcblxyXG5cdC8vIElFIHNjcm9sbCBqdW1wIGZpeFxyXG5cdGlmKGlzX3RoaXNfaWUpIHtcclxuXHRcdCQoXCIubGF5ZXJcIikuY3NzKHt0cmFuc2l0aW9uOlwidG9wIC4xNXMgbGluZWFyXCJ9KTtcclxuXHRcdCQoXCIjc2NlbmUudmVydGljYWxcIikuY3NzKHt0cmFuc2l0aW9uOlwib3BhY2l0eSAuMTVzIGxpbmVhclwifSk7XHJcblxyXG5cdFx0JChcImJvZHlcIikub24oXCJtb3VzZXdoZWVsXCIsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTsgXHJcblxyXG5cdFx0XHR2YXIgd2hlZWxEZWx0YSA9IGV2ZW50LndoZWVsRGVsdGEsXHJcblx0XHRcdFx0Y3VycmVudFNjcm9sbFBvc2l0aW9uID0gd2luZG93LnBhZ2VZT2Zmc2V0O1xyXG5cclxuXHRcdFx0d2luZG93LnNjcm9sbFRvKDAsIGN1cnJlbnRTY3JvbGxQb3NpdGlvbiAtIHdoZWVsRGVsdGEpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRpZigkKFwiI3NjZW5lLmF4aXNcIikubGVuZ3RoKXtcclxuXHRcdCQoXCIjc2NlbmUuYXhpc1wiKS5wYXJhbGxheCh7XHJcblx0XHRcdHNjYWxhclg6IDMsXHJcblx0XHRcdHNjYWxhclk6IDMsXHJcblx0XHRcdGZyaWN0aW9uWDogMC41LFxyXG5cdFx0XHRmcmljdGlvblk6IDAuNVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRpZigkKFwiI3NjZW5lLnZlcnRpY2FsXCIpLmxlbmd0aCl7XHJcblx0XHQkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgc2Nyb2xsUG9zID0gJCh0aGlzKS5zY3JvbGxUb3AoKSxcclxuXHRcdFx0XHRsYXllcnMgPSAkKFwiI3NjZW5lLnZlcnRpY2FsIC5sYXllclwiKTtcclxuXHJcblx0XHRcdGxheWVycy5jc3Moe1wid2lsbC1jaGFuZ2VcIjpcInRyYW5zZm9ybVwifSk7XHJcblxyXG5cdFx0XHRsYXllcnMuZWFjaChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHZhciBsYXllciA9ICQodGhpcyk7XHJcblxyXG5cdFx0XHRcdGlmKGxheWVyLmluZGV4KCkgIT0wICkge1xyXG5cdFx0XHRcdFx0bGF5ZXIuY3NzKHtcclxuXHRcdFx0XHRcdFx0XCJ0cmFuc2Zvcm1cIiA6IFwidHJhbnNsYXRlM2QoMCxcIiArICggKHNjcm9sbFBvcy8oNSArIDIqbGF5ZXIuaW5kZXgoKSkpICkgKyBcInB4LDApXCJcclxuXHRcdFx0XHRcdFx0Ly8gXCJ0b3BcIiA6ICggKHNjcm9sbFBvcy8oNSArIDIqbGF5ZXIuaW5kZXgoKSkpICkgKyBcInB4XCJcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRcdCQoXCIjc2NlbmUudmVydGljYWxcIikuY3NzKHtcclxuXHRcdFx0XHRcIm9wYWNpdHlcIiA6IDEtKHNjcm9sbFBvcy83MjApXHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBMb2dpbiBjYXJkIGZsaXBcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQkKFwiLmxvZ2luLWJ1dHRvblwiKS5jbGljayhmdW5jdGlvbigpIHtcclxuXHRcdCQoXCJib2R5XCIpLmFkZENsYXNzKFwiY2FyZF9mbGlwcGVkXCIpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiI3VuZmxpcC1jYXJkXCIpLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG5cdFx0JChcImJvZHlcIikucmVtb3ZlQ2xhc3MoXCJjYXJkX2ZsaXBwZWRcIik7XHJcblx0fSk7XHJcblxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gTWFpbiBtZW51XHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0JChcIiNtZW51LXRvZ2dsZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0JCh0aGlzKS5hZGQoXCIubWFpbi1tZW51XCIpLnRvZ2dsZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiLm1haW4tbWVudV9faXRlbVwiKS5lYWNoKGZ1bmN0aW9uKGluZGV4KSB7XHJcblx0XHQkKHRoaXMpLmNzcyhcInRyYW5zaXRpb24tZGVsYXlcIiwgMC4zKzAuMSppbmRleCArIFwic1wiKTtcclxuXHR9KTtcclxuXHJcblxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gQnV0dG9uc1xyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdCQoXCJidXR0b24uZ28tZG93blwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0dmFyIGdvID0gJCh0aGlzKS5kYXRhKFwibGlua1wiKTtcclxuXHRcdCQoXCJodG1sLCBib2R5XCIpLnN0b3AoKS5hbmltYXRlKHtcclxuXHRcdFx0c2Nyb2xsVG9wOiAkKGdvKS5vZmZzZXQoKS50b3BcclxuXHRcdH0sIDcwMCwgXCJzd2luZ1wiKTtcclxuXHR9KTtcclxuXHJcblx0JChcImJ1dHRvbi5nby11cFwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0JChcImh0bWwsIGJvZHlcIikuc3RvcCgpLmFuaW1hdGUoe1xyXG5cdFx0XHRzY3JvbGxUb3A6IDBcclxuXHRcdH0sIDcwMCwgXCJzd2luZ1wiKTtcclxuXHR9KTtcclxuXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBTbGlkZXJcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRmdW5jdGlvbiBwcmVwYXJlX3RpdGxlKHRpdGxlX2NvbnRhaW5lcil7XHJcblx0XHR2YXIgbGV0dGVycyA9ICQudHJpbSh0aXRsZV9jb250YWluZXIudGV4dCgpKSxcclxuXHRcdFx0bmV3X3RpdGxlID0gXCJcIjtcclxuXHJcblx0XHR0aXRsZV9jb250YWluZXIuaHRtbChcIlwiKTtcclxuXHJcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbGV0dGVycy5sZW5ndGg7IGkrKyl7XHJcblx0XHRcdHZhciBjc3NfZGVsYXkgPSBcInN0eWxlPSdhbmltYXRpb24tZGVsYXk6IFwiICsgKDAuNy9sZXR0ZXJzLmxlbmd0aCkqKGkrMSkgKyBcInMnXCIsXHJcblx0XHRcdFx0dGV4dCA9IFwiPHNwYW4gY2xhc3M9J2xldHRlcicgXCIgKyBjc3NfZGVsYXkgKyBcIj5cIiArIGxldHRlcnNbaV0gKyBcIjwvc3Bhbj5cIjtcclxuXHJcblx0XHRcdGlmKGk9PTApe1xyXG5cdFx0XHRcdHRleHQgPSBcIjxzcGFuIGNsYXNzPSd3b3JkJz5cIiArIHRleHQ7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYobGV0dGVyc1tpXSA9PSBcIiBcIiB8fCBsZXR0ZXJzW2ldID09IFwiJm5ic3A7XCIpe1xyXG5cdFx0XHRcdHRleHQgPSBcIjwvc3Bhbj5cXG48c3BhbiBjbGFzcz0nd29yZCc+XCI7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoaSA9PSBsZXR0ZXJzLmxlbmd0aC0xKSB7XHJcblx0XHRcdFx0dGV4dCA9IHRleHQgKyBcIjwvc3Bhbj5cIjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bmV3X3RpdGxlICs9IHRleHQ7XHJcblx0XHR9XHJcblxyXG5cdFx0dGl0bGVfY29udGFpbmVyLmFwcGVuZChuZXdfdGl0bGUpO1xyXG5cdH1cclxuXHJcblx0aWYoJChcIi5wb3J0Zm9saW8tc2xpZGVyXCIpLmxlbmd0aCl7XHJcblxyXG5cdFx0Ly8gY29uc29sZS50aW1lKFwiU2xpZGVyIHByZXBhcmVcIik7XHJcblxyXG5cdFx0JChcIi5wb3J0Zm9saW8tcHJvamVjdHMgLnByb2plY3RfX3RpdGxlXCIpXHJcblx0XHRcdC5hZGQoXCIucG9ydGZvbGlvLXByb2plY3RzIC5wcm9qZWN0X190ZWNoXCIpXHJcblx0XHRcdC5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHByZXBhcmVfdGl0bGUoJCh0aGlzKSk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHJcblx0XHQkKFwiLnBvcnRmb2xpby1wcm9qZWN0cyAuYWN0aXZlIC5wcm9qZWN0X190aXRsZSAubGV0dGVyXCIpXHJcblx0XHRcdC5hZGQoXCIucG9ydGZvbGlvLXByb2plY3RzIC5hY3RpdmUgLnByb2plY3RfX3RlY2ggLmxldHRlclwiKVxyXG5cdFx0XHQuYWRkQ2xhc3MoXCJzaG93XCIpO1xyXG5cclxuXHJcblx0XHR2YXIgc2xpZGVyID0gJChcIi5wb3J0Zm9saW8tc2xpZGVyXCIpLFxyXG5cdFx0XHRwcmV2aWV3cyA9IHNsaWRlci5maW5kKFwiLnBvcnRmb2xpby1wcmV2aWV3XCIpLFxyXG5cdFx0XHRwcm9qZWN0cyA9IHNsaWRlci5maW5kKFwiLnBvcnRmb2xpby1wcm9qZWN0cyAucHJvamVjdFwiKTtcclxuXHJcblx0XHQvLyBjb25zb2xlLnRpbWVFbmQoXCJTbGlkZXIgcHJlcGFyZVwiKTtcclxuXHJcblx0XHQkKFwiLnBvcnRmb2xpby1idXR0b25cIikub24oXCJjbGlja1wiLCBmdW5jdGlvbihlKXtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHQvLyBjb25zb2xlLnRpbWUoXCJTbGlkZXIgY2xpY2tcIik7XHJcblxyXG5cdFx0XHR2YXIgdGhpc19idXR0b24gPSAkKHRoaXMpLFxyXG5cdFx0XHRcdHRoaXNfdGh1bWJuYWlscyA9IHRoaXNfYnV0dG9uLm5leHQoKS5maW5kKFwiLnBvcnRmb2xpby10aHVtYm5haWxzX190aHVtYm5haWxcIiksXHJcblx0XHRcdFx0dGhpc19hY3RpdmVfdGh1bWIgPSB0aGlzX3RodW1ibmFpbHMuZmlsdGVyKFwiLmFjdGl2ZVwiKSxcclxuXHRcdFx0XHR0aGlzX25leHRfaW5kZXggPSB0aGlzX3RodW1ibmFpbHMuaW5kZXgodGhpc19hY3RpdmVfdGh1bWIpO1xyXG5cclxuXHRcdFx0dmFyIG90aGVyX2J1dHRvbiA9IHRoaXNfYnV0dG9uLnBhcmVudCgpLnNpYmxpbmdzKCkuZmluZChcIi5wb3J0Zm9saW8tYnV0dG9uXCIpLFxyXG5cdFx0XHRcdG90aGVyX3RodW1ibmFpbHMgPSBvdGhlcl9idXR0b24ubmV4dCgpLmZpbmQoXCIucG9ydGZvbGlvLXRodW1ibmFpbHNfX3RodW1ibmFpbFwiKSxcclxuXHRcdFx0XHRvdGhlcl9hY3RpdmVfdGh1bWIgPSBvdGhlcl90aHVtYm5haWxzLmZpbHRlcihcIi5hY3RpdmVcIiksXHJcblx0XHRcdFx0b3RoZXJfbmV4dF9pbmRleCA9IG90aGVyX3RodW1ibmFpbHMuaW5kZXgob3RoZXJfYWN0aXZlX3RodW1iKTtcclxuXHJcblx0XHRcdHZhciBhY3RpdmVfcHJldmlldyA9IHByZXZpZXdzLmZpbHRlcihcIi5hY3RpdmVcIiksXHJcblx0XHRcdFx0bmV4dF9wcmV2aWV3X2luZGV4ID0gcHJldmlld3MuaW5kZXgoYWN0aXZlX3ByZXZpZXcpLFxyXG5cdFx0XHRcdGFjdGl2ZV9wcm9qZWN0ID0gcHJvamVjdHMuZmlsdGVyKFwiLmFjdGl2ZVwiKSxcclxuXHRcdFx0XHRuZXh0X3Byb2plY3RfaW5kZXggPSBwcm9qZWN0cy5pbmRleChhY3RpdmVfcHJvamVjdCk7XHJcblxyXG5cclxuXHJcblx0XHRcdGlmKHRoaXNfYnV0dG9uLmhhc0NsYXNzKFwicG9ydGZvbGlvLWJ1dHRvbl9uZXh0XCIpKSB7XHJcblx0XHRcdFx0bmV4dF9wcm9qZWN0X2luZGV4ID0gKG5leHRfcHJvamVjdF9pbmRleCA+PSBwcm9qZWN0cy5sZW5ndGgtMSkgPyAwIDogbmV4dF9wcm9qZWN0X2luZGV4KzE7XHJcblx0XHRcdFx0dGhpc19uZXh0X2luZGV4ID0gdGhpc19uZXh0X2luZGV4ID49IHRoaXNfdGh1bWJuYWlscy5sZW5ndGgtMSA/IDAgOiB0aGlzX25leHRfaW5kZXgrMTtcclxuXHRcdFx0XHRvdGhlcl9uZXh0X2luZGV4ID0gKG90aGVyX25leHRfaW5kZXggPj0gb3RoZXJfdGh1bWJuYWlscy5sZW5ndGgtMSkgPyAwIDogb3RoZXJfbmV4dF9pbmRleCsxO1xyXG5cclxuXHRcdFx0XHRuZXh0X3ByZXZpZXdfaW5kZXggPSAobmV4dF9wcmV2aWV3X2luZGV4ID49IHByZXZpZXdzLmxlbmd0aC0xKSA/IDAgOiBuZXh0X3ByZXZpZXdfaW5kZXgrMTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRuZXh0X3Byb2plY3RfaW5kZXgtLTtcclxuXHRcdFx0XHR0aGlzX25leHRfaW5kZXgtLTtcclxuXHRcdFx0XHRvdGhlcl9uZXh0X2luZGV4LS07XHJcblxyXG5cdFx0XHRcdG5leHRfcHJldmlld19pbmRleC0tO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBsb2NrX2J1dHRvbnMoKXtcclxuXHRcdFx0XHR0aGlzX2J1dHRvbi5wcm9wKFwiZGlzYWJsZWRcIiwgdHJ1ZSk7XHJcblx0XHRcdFx0b3RoZXJfYnV0dG9uLnByb3AoXCJkaXNhYmxlZFwiLCB0cnVlKTtcclxuXHJcblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0dGhpc19idXR0b24ucHJvcChcImRpc2FibGVkXCIsIGZhbHNlKTtcclxuXHRcdFx0XHRcdG90aGVyX2J1dHRvbi5wcm9wKFwiZGlzYWJsZWRcIiwgZmFsc2UpO1xyXG5cdFx0XHRcdH0sIDcwMCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZ1bmN0aW9uIGNoYW5nZV90aHVtYnMoKXtcclxuXHRcdFx0XHR2YXIgdGhpc19uZXh0X3RodW1iID0gdGhpc190aHVtYm5haWxzLmVxKHRoaXNfbmV4dF9pbmRleCksXHJcblx0XHRcdFx0XHRvdGhlcl9uZXh0X3RodW1iID0gb3RoZXJfdGh1bWJuYWlscy5lcShvdGhlcl9uZXh0X2luZGV4KTtcclxuXHJcblx0XHRcdFx0dGhpc19uZXh0X3RodW1iLnJlbW92ZUNsYXNzKFwibW92ZS1kb3duXCIpLmFkZENsYXNzKFwiYWN0aXZlIG1vdmUtdXBcIik7XHJcblx0XHRcdFx0dGhpc19hY3RpdmVfdGh1bWIucmVtb3ZlQ2xhc3MoXCJhY3RpdmUgbW92ZS1kb3duXCIpLmFkZENsYXNzKFwibW92ZS11cFwiKTtcclxuXHJcblx0XHRcdFx0b3RoZXJfbmV4dF90aHVtYi5yZW1vdmVDbGFzcyhcIm1vdmUtdXBcIikuYWRkQ2xhc3MoXCJhY3RpdmUgbW92ZS1kb3duXCIpO1xyXG5cdFx0XHRcdG90aGVyX2FjdGl2ZV90aHVtYi5yZW1vdmVDbGFzcyhcImFjdGl2ZSBtb3ZlLXVwXCIpLmFkZENsYXNzKFwibW92ZS1kb3duXCIpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBjaGFuZ2VfcHJldmlldygpe1xyXG5cdFx0XHRcdHZhciBuZXh0X3ByZXZpZXcgPSBwcmV2aWV3cy5lcShuZXh0X3ByZXZpZXdfaW5kZXgpO1xyXG5cclxuXHRcdFx0XHRhY3RpdmVfcHJldmlldy5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0XHRuZXh0X3ByZXZpZXcuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZ1bmN0aW9uIGNoYW5nZV9wcm9qZWN0KCl7XHJcblx0XHRcdFx0dmFyIG5leHRfcHJvamVjdCA9IHByb2plY3RzLmVxKG5leHRfcHJvamVjdF9pbmRleCksXHJcblx0XHRcdFx0XHR0aXRsZV9sZXR0ZXJzID0gbmV4dF9wcm9qZWN0LmZpbmQoXCIucHJvamVjdF9fdGl0bGUgc3Bhbi5sZXR0ZXJcIiksXHJcblx0XHRcdFx0XHR0ZWNoX2xldHRlcnMgPSBuZXh0X3Byb2plY3QuZmluZChcIi5wcm9qZWN0X190ZWNoIHNwYW4ubGV0dGVyXCIpO1xyXG5cclxuXHRcdFx0XHRhY3RpdmVfcHJvamVjdFxyXG5cdFx0XHRcdFx0LnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpXHJcblx0XHRcdFx0XHQuZmluZChcInNwYW4ubGV0dGVyLCBzcGFuLmxldHRlclwiKVxyXG5cdFx0XHRcdFx0LnJlbW92ZUNsYXNzKFwic2hvd1wiKTtcclxuXHRcdFx0XHRuZXh0X3Byb2plY3QuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcblxyXG5cdFx0XHRcdHRpdGxlX2xldHRlcnMuYWRkQ2xhc3MoXCJzaG93XCIpO1xyXG5cdFx0XHRcdHRlY2hfbGV0dGVycy5hZGRDbGFzcyhcInNob3dcIik7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIGNvbnNvbGUudGltZUVuZChcIlNsaWRlciBjbGlja1wiKTtcclxuXHJcblx0XHRcdGNoYW5nZV90aHVtYnMoKTtcclxuXHRcdFx0Y2hhbmdlX3Byb2plY3QoKTtcclxuXHRcdFx0Y2hhbmdlX3ByZXZpZXcoKTtcclxuXHRcdFx0bG9ja19idXR0b25zKCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gQmxvZyBzY3JvbGwgZXZlbnRzXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0aWYoJChcIi5ibG9nLW5hdmlnYXRpb25cIikubGVuZ3RoKXtcclxuXHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uX190b2dnbGVcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25cIikudG9nZ2xlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHR9KTtcclxuXHJcblx0XHR2YXIgbGFzdElkLFxyXG5cdFx0XHRtZW51ID0gJChcIi5ibG9nLW5hdmlnYXRpb25cIiksXHJcblx0XHRcdG1lbnVJdGVtcyA9IG1lbnUuZmluZChcImxpIGFcIiksXHJcblx0XHRcdHNjcm9sbEl0ZW1zID0gbWVudUl0ZW1zLm1hcChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHZhciBpdGVtID0gJCgkKHRoaXMpLmF0dHIoXCJocmVmXCIpKTtcclxuXHRcdFx0XHRpZiAoaXRlbS5sZW5ndGgpIHJldHVybiBpdGVtO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRtZW51SXRlbXMuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0XHRcdHZhciBocmVmID0gJCh0aGlzKS5hdHRyKFwiaHJlZlwiKSxcclxuXHRcdFx0XHRvZmZzZXRUb3AgPSAoaHJlZiA9PT0gXCIjXCIpID8gMCA6ICQoaHJlZikub2Zmc2V0KCkudG9wLTYwO1xyXG5cdFx0XHRcclxuXHRcdFx0JChcImh0bWwsIGJvZHlcIikuc3RvcCgpLmFuaW1hdGUoeyBcclxuXHRcdFx0XHRzY3JvbGxUb3A6IG9mZnNldFRvcFxyXG5cdFx0XHR9LCA3MDAsIFwic3dpbmdcIik7XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdCQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBmcm9tVG9wID0gJCh0aGlzKS5zY3JvbGxUb3AoKSxcclxuXHRcdFx0XHRibG9nTmF2T2Zmc2V0ID0gJChcIi5ibG9nLW5hdmlnYXRpb25cIikub2Zmc2V0KCkudG9wLFxyXG5cdFx0XHRcdGJsb2dOYXZMaW1pdCA9ICQoXCIuZm9vdGVyX193cmFwcGVyXCIpLm9mZnNldCgpLnRvcCAtICQoXCIuYmxvZy1uYXZpZ2F0aW9uX193cmFwcGVyXCIpLm91dGVySGVpZ2h0KCksXHJcblx0XHRcdFx0Y3VycmVudCA9IHNjcm9sbEl0ZW1zLm1hcChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0aWYgKCQodGhpcykub2Zmc2V0KCkudG9wIDwgZnJvbVRvcCsxNDQpXHJcblx0XHRcdFx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0Y3VycmVudCA9IGN1cnJlbnRbY3VycmVudC5sZW5ndGgtMV07XHJcblx0XHRcdHZhciBpZCA9IGN1cnJlbnQgJiYgY3VycmVudC5sZW5ndGggPyBjdXJyZW50WzBdLmlkIDogXCJcIjtcclxuXHJcblx0XHRcdGlmIChsYXN0SWQgIT09IGlkKSB7XHJcblx0XHRcdFx0bGFzdElkID0gaWQ7XHJcblx0XHRcdFx0bWVudUl0ZW1zLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpLmZpbHRlcihcIltocmVmPSNcIitpZCtcIl1cIikuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKGZyb21Ub3AgPj0gYmxvZ05hdkxpbWl0ICYmICQod2luZG93KS53aWR0aCgpID4gKDc2OCAtIHdpbmRvdy5obS5zY3JvbGxCYXJXaWR0aCkpIHtcclxuXHRcdFx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5jc3Moe1wicG9zaXRpb25cIjpcImFic29sdXRlXCIsIFwidG9wXCI6YmxvZ05hdkxpbWl0ICsgXCJweFwifSk7XHJcblx0XHRcdH0gZWxzZSBpZiAoZnJvbVRvcCA+PSBibG9nTmF2T2Zmc2V0ICYmICQod2luZG93KS53aWR0aCgpID4gKDc2OCAtIHdpbmRvdy5obS5zY3JvbGxCYXJXaWR0aCkpIHtcclxuXHRcdFx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5jc3Moe1wicG9zaXRpb25cIjpcImZpeGVkXCIsIFwidG9wXCI6MH0pO1xyXG5cdFx0XHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uX193cmFwcGVyXCIpLmFkZENsYXNzKFwibmF2LWZpeGVkXCIpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uX193cmFwcGVyXCIpLmNzcyh7XCJwb3NpdGlvblwiOlwicmVsYXRpdmVcIn0pO1xyXG5cdFx0XHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uX193cmFwcGVyXCIpLnJlbW92ZUNsYXNzKFwibmF2LWZpeGVkXCIpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSk7XHJcblxyXG5cdFx0JCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbigpIHtcclxuXHRcdFx0aWYoJCh3aW5kb3cpLndpZHRoKCkgPD0gKDc2OCAtIHdpbmRvdy5obS5zY3JvbGxCYXJXaWR0aCkpe1xyXG5cdFx0XHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uX193cmFwcGVyXCIpLnJlbW92ZUNsYXNzKFwibmF2LWZpeGVkXCIpO1xyXG5cdFx0XHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uX193cmFwcGVyXCIpLmNzcyh7XCJwb3NpdGlvblwiOlwicmVsYXRpdmVcIn0pO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlmKCQoXCJib2R5XCIpLnNjcm9sbFRvcCgpID49ICQoXCIuYmxvZ1wiKS5vZmZzZXQoKS50b3Ape1xyXG5cdFx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikuY3NzKHtcInBvc2l0aW9uXCI6XCJmaXhlZFwiLCBcInRvcFwiOjB9KTtcclxuXHRcdFx0XHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uX193cmFwcGVyXCIpLmFkZENsYXNzKFwibmF2LWZpeGVkXCIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFRhbGtzIGJsdXIgYmFzZWQgb24ganNcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRmdW5jdGlvbiBzZXRfYmcoKXtcclxuXHRcdHZhciBzZWN0aW9uID0gJChcIi50YWxrc1wiKSxcclxuXHRcdFx0Zm9ybSA9IHNlY3Rpb24uZmluZChcIi5jb250YWN0LWZvcm1cIiksXHJcblx0XHRcdGZvcm1fYmcgPSBmb3JtLmZpbmQoXCIuY29udGFjdC1mb3JtX19iZ1wiKSxcclxuXHRcdFx0Ymdfb2Zmc2V0ID0gc2VjdGlvbi5vZmZzZXQoKS50b3AgLSBmb3JtX2JnLm9mZnNldCgpLnRvcDtcclxuXHJcblx0XHRmb3JtX2JnLmNzcyh7XHJcblx0XHRcdFwiYmFja2dyb3VuZC1wb3NpdGlvblwiIDogXCJjZW50ZXIgXCIgKyBiZ19vZmZzZXQgKyBcInB4XCJcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0aWYoJChcIi50YWxrc1wiKS5sZW5ndGgpe1xyXG5cdFx0JCh3aW5kb3cpLmxvYWQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdHNldF9iZygpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0JCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbigpIHtcclxuXHRcdFx0c2V0X2JnKCk7XHJcblxyXG5cdFx0XHRpZiggJCh3aW5kb3cpLndpZHRoKCk+MjAwMCAtIHdpbmRvdy5obS5zY3JvbGxCYXJXaWR0aCl7XHJcblx0XHRcdFx0JChcIi50YWxrcywgLmNvbnRhY3QtZm9ybV9fYmdcIikuY3NzKFwiYmFja2dyb3VuZC1zaXplXCIsICQod2luZG93KS53aWR0aCgpICsgXCJweFwiKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxufSkoalF1ZXJ5KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
