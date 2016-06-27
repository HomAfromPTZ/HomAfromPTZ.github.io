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
						// "transform" : "translate3d(0," + ( (scrollPos/(5 + 2*layer.index())) ) + "px,0)"
						"top" : ( (scrollPos/(5 + 2*layer.index())) ) + "px"
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

	$(".blog-navigation__toggle").click(function(){
		$(".blog-navigation").toggleClass("active");
	});



	// ==============================
	// Slider
	// ==============================
	function prepare_title(title_container){
		var letters = $.trim(title_container.text()),
			new_title = "";

		title_container.html("");

		for(var i = 0; i < letters.length; i++){
			var text = "<span class='letter'>" + letters[i] + "</span>";

			if(i==0){
				text = "<span class='word'>" + text;
			}
			if(letters[i] == " " || letters[i] == "&nbsp;"){
				text = "</span><span class='letter'>&nbsp;</span><span class='word'>";
			}
			if(i == letters.length-1) {
				text = text + "</span>";
			}

			new_title += text;
		}

		title_container.append(new_title);
	}

	if($(".portfolio-slider").length){
		$(".portfolio-projects .project__title")
		.add(".portfolio-projects .project__tech")
		.each(function() {
			prepare_title($(this));
		});

		$(".portfolio-projects .active .project__title .letter")
			.add(".portfolio-projects .active .project__tech .letter")
			.addClass("show");



		$(".portfolio-button").click(function(){
			var this_button = $(this),
				this_thumbnails = this_button.next().find(".portfolio-thumbnails__thumbnail"),
				this_active_thumb = this_thumbnails.filter(".active"),
				this_next_index = this_thumbnails.index(this_active_thumb);

			var other_button = this_button.parent().siblings().find(".portfolio-button"),
				other_thumbnails = other_button.next().find(".portfolio-thumbnails__thumbnail"),
				other_active_thumb = other_thumbnails.filter(".active"),
				other_next_index = other_thumbnails.index(other_active_thumb);

			var active_preview = this_button.closest(".portfolio-slider").find(".portfolio-preview"),
				next_preview = this_active_thumb.find("img").attr("src"),
				projects = this_button.closest(".portfolio-slider").find(".portfolio-projects .project"),
				active_project = projects.filter(".active"),
				next_project_index = projects.index(active_project);

			if(this_button.hasClass("portfolio-button_next")) {
				next_project_index = (next_project_index >= projects.length-1) ? 0 : next_project_index+1;
				this_next_index = this_next_index >= this_thumbnails.length-1 ? 0 : this_next_index+1;
				other_next_index = (other_next_index >= other_thumbnails.length-1) ? 0 : other_next_index+1;
			} else {
				next_project_index--;
				this_next_index--;
				other_next_index--;
			}


			var this_next_thumb = this_thumbnails.eq(this_next_index),
				other_next_thumb = other_thumbnails.eq(other_next_index),
				next_project = projects.eq(next_project_index),
				title_letters = next_project.find(".project__title span.letter"),
				tech_letters = next_project.find(".project__tech span.letter");

			function lock_buttons(){
				this_button.prop("disabled", true);
				other_button.prop("disabled", true);

				setTimeout(function(){
					this_button.prop("disabled", false);
					other_button.prop("disabled", false);
				}, 600);
			}

			function change_thumbs(){
				this_next_thumb.removeClass("move-down").addClass("active move-up");
				this_active_thumb.removeClass("active move-down").addClass("move-up");

				other_next_thumb.removeClass("move-up").addClass("active move-down");
				other_active_thumb.removeClass("active move-up").addClass("move-down");
			}

			function change_preview(){
				active_preview.fadeOut(300, function(){
					$(this).attr("src", next_preview).fadeIn(300);
				});
				// active_preview.attr("src", next_preview)
			}


			function change_project(){
				active_project
					.removeClass("active")
					.find(".project__title span.letter")
					.add(".project__tech span.letter")
					.removeClass("show");
				next_project.addClass("active");

				title_letters.each(function(index){
					$(this)
						.css({"transition-delay": (0.3/title_letters.length)*(index+1) + "s"})
						.addClass("show");
				});

				tech_letters.each(function(index){
					$(this)
						.css({"transition-delay": (0.3/tech_letters.length)*(index+1) + "s"})
						.addClass("show");
				});
			}

			lock_buttons();
			change_thumbs();
			change_preview();
			change_project();
		});
	}



	// ==============================
	// BLOG SCROLL EVENTS
	// ==============================
	if($(".blog-navigation").length){
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



	// ==============================
	// RESIZE EVENTS
	// ==============================
	if($(".talks").length){
		$(window).resize(function() {
			// Testimonials section bg size
			if( $(window).width()>2000 - scrollBarWidth){
				$(".talks, .contact-form__bg").css("background-size", $(window).width() + "px");
			}
		});
	}


	// ==============================
	// Blur bug example
	// ==============================
	function set_bg(){
		if($(".blur_example_page").length){
			var form = $(".blur_example_page .talks .contact-form"),
				form_bg = form.find(".contact-form__bg"),
				talks_top = $(".blur_example_page .talks").offset().top,
				form_bg_top = form_bg.offset().top,
				bg_offset = talks_top - form_bg_top;

			form_bg.css({
				"background-position" : "center " + bg_offset + "px"
			});
		}
	}

	$(window).load(function() {
		set_bg();
	});

	$(window).resize(function() {
		set_bg();
	});

})(jQuery);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oJCkge1xyXG5cdFwidXNlIHN0cmljdFwiO1xyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBDaGVjayBzY3JvbGxiYXIgd2lkdGhcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHR2YXIgd2lkdGhDb250ZW50QSA9ICQoXCIjc2Nyb2xsX2Jhcl9jaGVja19BXCIpLndpZHRoKCksXHJcblx0XHR3aWR0aENvbnRlbnRCID0gJChcIiNzY3JvbGxfYmFyX2NoZWNrX0JcIikud2lkdGgoKTtcclxuXHJcblx0dmFyIHNjcm9sbEJhcldpZHRoID0gd2lkdGhDb250ZW50QSAtIHdpZHRoQ29udGVudEI7XHJcblxyXG5cdCQoXCIjc2Nyb2xsX2Jhcl9jaGVja19BXCIpLmNzcyhcImRpc3BsYXlcIixcIm5vbmVcIik7XHJcblxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gQ2hlY2sgSUUgdmVyc2lvblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIGRldGVjdF9JRSgpIHtcclxuXHRcdHZhciB1YSA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50O1xyXG5cclxuXHRcdHZhciBtc2llID0gdWEuaW5kZXhPZihcIk1TSUUgXCIpO1xyXG5cdFx0aWYgKG1zaWUgPiAwKSB7XHJcblx0XHRcdC8vIElFIDEwIG9yIG9sZGVyID0+IHJldHVybiB2ZXJzaW9uIG51bWJlclxyXG5cdFx0XHRyZXR1cm4gcGFyc2VJbnQodWEuc3Vic3RyaW5nKG1zaWUgKyA1LCB1YS5pbmRleE9mKFwiLlwiLCBtc2llKSksIDEwKTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgdHJpZGVudCA9IHVhLmluZGV4T2YoXCJUcmlkZW50L1wiKTtcclxuXHRcdGlmICh0cmlkZW50ID4gMCkge1xyXG5cdFx0XHQvLyBJRSAxMSA9PiByZXR1cm4gdmVyc2lvbiBudW1iZXJcclxuXHRcdFx0dmFyIHJ2ID0gdWEuaW5kZXhPZihcInJ2OlwiKTtcclxuXHRcdFx0cmV0dXJuIHBhcnNlSW50KHVhLnN1YnN0cmluZyhydiArIDMsIHVhLmluZGV4T2YoXCIuXCIsIHJ2KSksIDEwKTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgZWRnZSA9IHVhLmluZGV4T2YoXCJFZGdlL1wiKTtcclxuXHRcdGlmIChlZGdlID4gMCkge1xyXG5cdFx0XHQvLyBFZGdlIChJRSAxMispID0+IHJldHVybiB2ZXJzaW9uIG51bWJlclxyXG5cdFx0XHRyZXR1cm4gcGFyc2VJbnQodWEuc3Vic3RyaW5nKGVkZ2UgKyA1LCB1YS5pbmRleE9mKFwiLlwiLCBlZGdlKSksIDEwKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBvdGhlciBicm93c2VyXHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFByZWxvYWRlciB3aXRoIHBlcmNlbnRhZ2UgYnkgaW1hZ2UgY291bnRcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRmdW5jdGlvbiBwcmVsb2FkZXIoKSB7XHJcblx0XHR2YXIgcHJlbG9hZGVyX3N0YXQgPSAkKFwiI3ByZWxvYWRlci1zdmdfX3BlcmNlbnRhZ2VcIiksXHJcblx0XHRcdGhhc0ltYWdlUHJvcGVydGllcyA9IFtcImJhY2tncm91bmRcIiwgXCJiYWNrZ3JvdW5kSW1hZ2VcIiwgXCJsaXN0U3R5bGVJbWFnZVwiLCBcImJvcmRlckltYWdlXCIsIFwiYm9yZGVyQ29ybmVySW1hZ2VcIiwgXCJjdXJzb3JcIl0sXHJcblx0XHRcdGhhc0ltYWdlQXR0cmlidXRlcyA9IFtcInNyY3NldFwiXSxcclxuXHRcdFx0bWF0Y2hfdXJsID0gL3VybFxcKFxccyooWydcIl0/KSguKj8pXFwxXFxzKlxcKS9nLFxyXG5cdFx0XHRhbGxfaW1hZ2VzID0gW10sXHJcblx0XHRcdHRvdGFsID0gMCxcclxuXHRcdFx0Y291bnQgPSAwO1xyXG5cclxuXHRcdHZhciBjaXJjbGVfbyA9ICQoXCIjcHJlbG9hZGVyLXN2Z19faW1nIC5iYXJfX291dGVyXCIpLFxyXG5cdFx0XHRjaXJjbGVfYyA9ICQoXCIjcHJlbG9hZGVyLXN2Z19faW1nIC5iYXJfX2NlbnRlclwiKSxcclxuXHRcdFx0Y2lyY2xlX2kgPSAkKFwiI3ByZWxvYWRlci1zdmdfX2ltZyAuYmFyX19pbm5lclwiKSxcclxuXHRcdFx0bGVuZ3RoX28gPSBNYXRoLlBJKihjaXJjbGVfby5hdHRyKFwiclwiKSAqIDIpLFxyXG5cdFx0XHRsZW5ndGhfYyA9IE1hdGguUEkqKGNpcmNsZV9jLmF0dHIoXCJyXCIpICogMiksXHJcblx0XHRcdGxlbmd0aF9pID0gTWF0aC5QSSooY2lyY2xlX2kuYXR0cihcInJcIikgKiAyKTtcclxuXHJcblxyXG5cdFx0ZnVuY3Rpb24gaW1nX2xvYWRlZCgpe1xyXG5cdFx0XHR2YXIgcGVyY2VudGFnZSA9IE1hdGguY2VpbCggKytjb3VudCAvIHRvdGFsICogMTAwICk7XHJcblxyXG5cdFx0XHRwZXJjZW50YWdlID0gcGVyY2VudGFnZSA+IDEwMCA/IDEwMCA6IHBlcmNlbnRhZ2U7XHJcblxyXG5cdFx0XHQvLyBEcmF3IG9mZnNldHNcclxuXHRcdFx0Y2lyY2xlX28uY3NzKHtzdHJva2VEYXNob2Zmc2V0OiAoKDEwMC1wZXJjZW50YWdlKS8xMDApKmxlbmd0aF9vIH0pO1xyXG5cclxuXHRcdFx0aWYocGVyY2VudGFnZSA+IDUwKSB7XHJcblx0XHRcdFx0Y2lyY2xlX2MuY3NzKHtzdHJva2VEYXNob2Zmc2V0OiAoKDEwMC1wZXJjZW50YWdlKS8xMDApKmxlbmd0aF9jIH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZihwZXJjZW50YWdlID09IDEwMCkge1xyXG5cdFx0XHRcdGNpcmNsZV9pLmNzcyh7c3Ryb2tlRGFzaG9mZnNldDogKCgxMDAtcGVyY2VudGFnZSkvMTAwKSpsZW5ndGhfaSB9KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cHJlbG9hZGVyX3N0YXQuaHRtbChwZXJjZW50YWdlKTtcclxuXHJcblx0XHRcdGlmKGNvdW50ID09PSB0b3RhbCkgcmV0dXJuIGRvbmVfbG9hZGluZygpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIGRvbmVfbG9hZGluZygpe1xyXG5cdFx0XHQkKFwiI3ByZWxvYWRlclwiKS5kZWxheSg3MDApLmZhZGVPdXQoNzAwLCBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdCQoXCIjcHJlbG9hZGVyX19wcm9ncmVzc1wiKS5yZW1vdmUoKTtcclxuXHJcblx0XHRcdFx0aWYoJChcIi5mbGlwLWNhcmRcIikubGVuZ3RoKXtcclxuXHRcdFx0XHRcdCQoXCIuZmxpcC1jYXJkXCIpLmFkZENsYXNzKFwibG9hZGVkXCIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gaW1hZ2VzX2xvb3AgKCkge1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHR2YXIgdGVzdF9pbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG5cclxuXHRcdFx0XHR0ZXN0X2ltYWdlLm9ubG9hZCA9IGltZ19sb2FkZWQ7XHJcblx0XHRcdFx0dGVzdF9pbWFnZS5vbmVycm9yID0gaW1nX2xvYWRlZDtcclxuXHJcblx0XHRcdFx0Ly8gY29uc29sZS5sb2coXCJDOiBcIiArIGNvdW50LCBcIiBUOiBcIiArIHRvdGFsKTtcclxuXHJcblx0XHRcdFx0aWYgKGNvdW50ICE9IHRvdGFsKSB7XHJcblx0XHRcdFx0XHRpZiAoYWxsX2ltYWdlc1tjb3VudF0uc3Jjc2V0KSB7XHJcblx0XHRcdFx0XHRcdHRlc3RfaW1hZ2Uuc3Jjc2V0ID0gYWxsX2ltYWdlc1tjb3VudF0uc3Jjc2V0O1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0dGVzdF9pbWFnZS5zcmMgPSBhbGxfaW1hZ2VzW2NvdW50XS5zcmM7XHJcblxyXG5cdFx0XHRcdFx0aW1hZ2VzX2xvb3AoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sIDUwKTtcclxuXHRcdH1cclxuXHJcblx0XHQkKFwiKlwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0dmFyIGVsZW1lbnQgPSAkKHRoaXMpO1xyXG5cclxuXHRcdFx0aWYgKGVsZW1lbnQuaXMoXCJpbWdcIikgJiYgZWxlbWVudC5hdHRyKFwic3JjXCIpKSB7XHJcblx0XHRcdFx0YWxsX2ltYWdlcy5wdXNoKHtcclxuXHRcdFx0XHRcdHNyYzogZWxlbWVudC5hdHRyKFwic3JjXCIpLFxyXG5cdFx0XHRcdFx0ZWxlbWVudDogZWxlbWVudFswXVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQkLmVhY2goaGFzSW1hZ2VQcm9wZXJ0aWVzLCBmdW5jdGlvbiAoaSwgcHJvcGVydHkpIHtcclxuXHRcdFx0XHR2YXIgcHJvcGVydHlWYWx1ZSA9IGVsZW1lbnQuY3NzKHByb3BlcnR5KTtcclxuXHRcdFx0XHR2YXIgbWF0Y2g7XHJcblxyXG5cdFx0XHRcdGlmICghcHJvcGVydHlWYWx1ZSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRtYXRjaCA9IG1hdGNoX3VybC5leGVjKHByb3BlcnR5VmFsdWUpO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGlmIChtYXRjaCkge1xyXG5cdFx0XHRcdFx0YWxsX2ltYWdlcy5wdXNoKHtcclxuXHRcdFx0XHRcdFx0c3JjOiBtYXRjaFsyXSxcclxuXHRcdFx0XHRcdFx0ZWxlbWVudDogZWxlbWVudFswXVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdCQuZWFjaChoYXNJbWFnZUF0dHJpYnV0ZXMsIGZ1bmN0aW9uIChpLCBhdHRyaWJ1dGUpIHtcclxuXHRcdFx0XHR2YXIgYXR0cmlidXRlVmFsdWUgPSBlbGVtZW50LmF0dHIoYXR0cmlidXRlKTtcclxuXHJcblx0XHRcdFx0aWYgKCFhdHRyaWJ1dGVWYWx1ZSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRhbGxfaW1hZ2VzLnB1c2goe1xyXG5cdFx0XHRcdFx0c3JjOiBlbGVtZW50LmF0dHIoXCJzcmNcIiksXHJcblx0XHRcdFx0XHRzcmNzZXQ6IGVsZW1lbnQuYXR0cihcInNyY3NldFwiKSxcclxuXHRcdFx0XHRcdGVsZW1lbnQ6IGVsZW1lbnRbMF1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHJcblx0XHR0b3RhbCA9IGFsbF9pbWFnZXMubGVuZ3RoO1xyXG5cclxuXHRcdGlmICh0b3RhbCA9PT0gMCkge1xyXG5cdFx0XHRkb25lX2xvYWRpbmcoKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHByZWxvYWRlcl9zdGF0LmNzcyh7b3BhY2l0eTogMX0pO1xyXG5cdFx0XHRpbWFnZXNfbG9vcCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGZvcih2YXIgaT0wOyBpPHRvdGFsOyBpKyspe1xyXG5cdFx0Ly8gXHR2YXIgdGVzdF9pbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG5cclxuXHJcblx0XHQvLyBcdHRlc3RfaW1hZ2Uub25sb2FkID0gaW1nX2xvYWRlZDtcclxuXHRcdC8vIFx0dGVzdF9pbWFnZS5vbmVycm9yID0gaW1nX2xvYWRlZDtcclxuXHJcblx0XHQvLyBcdGlmIChhbGxfaW1hZ2VzW2ldLnNyY3NldCkge1xyXG5cdFx0Ly8gXHRcdHRlc3RfaW1hZ2Uuc3Jjc2V0ID0gYWxsX2ltYWdlc1tpXS5zcmNzZXQ7XHJcblx0XHQvLyBcdH1cclxuXHRcdC8vIFx0dGVzdF9pbWFnZS5zcmMgPSBhbGxfaW1hZ2VzW2ldLnNyYztcclxuXHRcdC8vIH1cclxuXHR9XHJcblxyXG5cdHByZWxvYWRlcigpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gUGFnZSBjaGFuZ2VyXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0JChkb2N1bWVudCkub24oXCJjbGlja1wiLCBcImEucHJlbG9hZC1saW5rXCIsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdHZhciBocmVmID0gJCh0aGlzKS5hdHRyKFwiaHJlZlwiKTtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRyZXR1cm4gJChcIiNwcmVsb2FkZXJcIilcclxuXHRcdFx0LmZhZGVJbigzMDAsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0cmV0dXJuIGRvY3VtZW50LmxvY2F0aW9uID0gaHJlZiAhPSBudWxsID8gaHJlZiA6IFwiL1wiO1xyXG5cdFx0XHR9KTtcclxuXHR9KTtcclxuXHJcblxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gQW5pbWF0aW9uc1xyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdCQuZm4uYW5pbWF0ZWQgPSBmdW5jdGlvbihpbkVmZmVjdCkge1xyXG5cdFx0JCh0aGlzKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgdGhzID0gJCh0aGlzKTtcclxuXHRcdFx0dGhzLmNzcyh7b3BhY2l0eTowfSlcclxuXHRcdFx0XHQuYWRkQ2xhc3MoXCJhbmltYXRlZFwiKVxyXG5cdFx0XHRcdC53YXlwb2ludChmdW5jdGlvbihkaXIpIHtcclxuXHRcdFx0XHRcdGlmIChkaXIgPT09IFwiZG93blwiKSB7XHJcblx0XHRcdFx0XHRcdHRocy5hZGRDbGFzcyhpbkVmZmVjdCkuY3NzKHtvcGFjaXR5OjF9KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdG9mZnNldDogXCI5MCVcIlxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fTtcclxuXHJcblx0JChcImhlYWRlciAuc3ZnLWhlYWRpbmcsIC50YWxrcyAuc3ZnLWhlYWRpbmcsIC50YWxrcyAudGVzdGltb25pYWxcIikuYW5pbWF0ZWQoXCJmYWRlSW5VcFwiKTtcclxuXHQkKFwiLmFib3V0LW1lX19za2lsbHM+ZGl2XCIpLmFuaW1hdGVkKFwiZmFkZUluVXBcIik7XHJcblx0JChcIi5hcnRpY2xlLCAucG9ydGZvbGlvLXNsaWRlcl9fbmF2aWdhdGlvbi1jb250YWluZXIsIC5wb3J0Zm9saW8tc2xpZGVyX19wcmV2aWV3LWNvbnRhaW5lclwiKS5hbmltYXRlZChcImZhZGVJblwiKTtcclxuXHQkKFwiLnBvcnRmb2xpby1zbGlkZXJfX3Byb2plY3RzLWNvbnRhaW5lclwiKS5hbmltYXRlZChcImZhZGVJblwiKTtcclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFBpZWNoYXJ0cyBhbmltYXRpb25cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQkKFwiLnBpZWNoYXJ0IC5waWVjaGFydF9fZmlsbFwiKS5lYWNoKGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgcGllID0gJCh0aGlzKTtcclxuXHRcdHBpZS53YXlwb2ludChmdW5jdGlvbihkaXIpIHtcclxuXHRcdFx0aWYgKGRpciA9PT0gXCJkb3duXCIpIHtcclxuXHRcdFx0XHRwaWUuY3NzKHtzdHJva2VEYXNob2Zmc2V0OnBpZS5kYXRhKFwicGVyY2VudGFnZVwiKX0pO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0b2Zmc2V0OiBcIjkwJVwiXHJcblx0XHRcdH0pO1xyXG5cdH0pO1xyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gUGFyYWxsYXhcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHR2YXIgaXNfdGhpc19pZSA9IGRldGVjdF9JRSgpO1xyXG5cclxuXHQvLyBJRSBzY3JvbGwganVtcCBmaXhcclxuXHRpZihpc190aGlzX2llKSB7XHJcblx0XHQkKFwiLmxheWVyXCIpLmNzcyh7dHJhbnNpdGlvbjpcInRvcCAuMTVzIGxpbmVhclwifSk7XHJcblx0XHQkKFwiI3NjZW5lLnZlcnRpY2FsXCIpLmNzcyh7dHJhbnNpdGlvbjpcIm9wYWNpdHkgLjE1cyBsaW5lYXJcIn0pO1xyXG5cclxuXHRcdCQoXCJib2R5XCIpLm9uKFwibW91c2V3aGVlbFwiLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IFxyXG5cclxuXHRcdFx0dmFyIHdoZWVsRGVsdGEgPSBldmVudC53aGVlbERlbHRhLFxyXG5cdFx0XHRcdGN1cnJlbnRTY3JvbGxQb3NpdGlvbiA9IHdpbmRvdy5wYWdlWU9mZnNldDtcclxuXHJcblx0XHRcdHdpbmRvdy5zY3JvbGxUbygwLCBjdXJyZW50U2Nyb2xsUG9zaXRpb24gLSB3aGVlbERlbHRhKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0aWYoJChcIiNzY2VuZS5heGlzXCIpLmxlbmd0aCl7XHJcblx0XHQkKFwiI3NjZW5lLmF4aXNcIikucGFyYWxsYXgoe1xyXG5cdFx0XHRzY2FsYXJYOiAzLFxyXG5cdFx0XHRzY2FsYXJZOiAzLFxyXG5cdFx0XHRmcmljdGlvblg6IDAuNSxcclxuXHRcdFx0ZnJpY3Rpb25ZOiAwLjVcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0aWYoJChcIiNzY2VuZS52ZXJ0aWNhbFwiKSl7XHJcblx0XHQkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgc2Nyb2xsUG9zID0gJCh0aGlzKS5zY3JvbGxUb3AoKTtcclxuXHJcblx0XHRcdCQoXCIjc2NlbmUudmVydGljYWwgLmxheWVyXCIpLmVhY2goZnVuY3Rpb24oKXtcclxuXHRcdFx0XHR2YXIgbGF5ZXIgPSAkKHRoaXMpO1xyXG5cclxuXHRcdFx0XHRpZihsYXllci5pbmRleCgpICE9MCApIHtcclxuXHRcdFx0XHRcdGxheWVyLmNzcyh7XHJcblx0XHRcdFx0XHRcdC8vIFwidHJhbnNmb3JtXCIgOiBcInRyYW5zbGF0ZTNkKDAsXCIgKyAoIChzY3JvbGxQb3MvKDUgKyAyKmxheWVyLmluZGV4KCkpKSApICsgXCJweCwwKVwiXHJcblx0XHRcdFx0XHRcdFwidG9wXCIgOiAoIChzY3JvbGxQb3MvKDUgKyAyKmxheWVyLmluZGV4KCkpKSApICsgXCJweFwiXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0XHQkKFwiI3NjZW5lLnZlcnRpY2FsXCIpLmNzcyh7XHJcblx0XHRcdFx0XCJvcGFjaXR5XCIgOiAxLShzY3JvbGxQb3MvNzIwKVxyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gTG9naW4gY2FyZCBmbGlwXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0JChcIi5sb2dpbi1idXR0b25cIikuY2xpY2soZnVuY3Rpb24oKSB7XHJcblx0XHQkKFwiYm9keVwiKS5hZGRDbGFzcyhcImNhcmRfZmxpcHBlZFwiKTtcclxuXHR9KTtcclxuXHJcblx0JChcIiN1bmZsaXAtY2FyZFwiKS5jbGljayhmdW5jdGlvbigpIHtcclxuXHRcdCQoXCJib2R5XCIpLnJlbW92ZUNsYXNzKFwiY2FyZF9mbGlwcGVkXCIpO1xyXG5cdH0pO1xyXG5cclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIE1haW4gbWVudVxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdCQoXCIjbWVudS10b2dnbGVcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdCQodGhpcykuYWRkKFwiLm1haW4tbWVudVwiKS50b2dnbGVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHR9KTtcclxuXHJcblx0JChcIi5tYWluLW1lbnVfX2l0ZW1cIikuZWFjaChmdW5jdGlvbihpbmRleCkge1xyXG5cdFx0JCh0aGlzKS5jc3MoXCJ0cmFuc2l0aW9uLWRlbGF5XCIsIDAuMyswLjEqaW5kZXggKyBcInNcIik7XHJcblx0fSk7XHJcblxyXG5cclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIEJ1dHRvbnNcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQkKFwiYnV0dG9uLmdvLWRvd25cIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdHZhciBnbyA9ICQodGhpcykuZGF0YShcImxpbmtcIik7XHJcblx0XHQkKFwiaHRtbCwgYm9keVwiKS5zdG9wKCkuYW5pbWF0ZSh7XHJcblx0XHRcdHNjcm9sbFRvcDogJChnbykub2Zmc2V0KCkudG9wXHJcblx0XHR9LCA3MDAsIFwic3dpbmdcIik7XHJcblx0fSk7XHJcblxyXG5cdCQoXCJidXR0b24uZ28tdXBcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdCQoXCJodG1sLCBib2R5XCIpLnN0b3AoKS5hbmltYXRlKHtcclxuXHRcdFx0c2Nyb2xsVG9wOiAwXHJcblx0XHR9LCA3MDAsIFwic3dpbmdcIik7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIuYmxvZy1uYXZpZ2F0aW9uX190b2dnbGVcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uXCIpLnRvZ2dsZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdH0pO1xyXG5cclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFNsaWRlclxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIHByZXBhcmVfdGl0bGUodGl0bGVfY29udGFpbmVyKXtcclxuXHRcdHZhciBsZXR0ZXJzID0gJC50cmltKHRpdGxlX2NvbnRhaW5lci50ZXh0KCkpLFxyXG5cdFx0XHRuZXdfdGl0bGUgPSBcIlwiO1xyXG5cclxuXHRcdHRpdGxlX2NvbnRhaW5lci5odG1sKFwiXCIpO1xyXG5cclxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBsZXR0ZXJzLmxlbmd0aDsgaSsrKXtcclxuXHRcdFx0dmFyIHRleHQgPSBcIjxzcGFuIGNsYXNzPSdsZXR0ZXInPlwiICsgbGV0dGVyc1tpXSArIFwiPC9zcGFuPlwiO1xyXG5cclxuXHRcdFx0aWYoaT09MCl7XHJcblx0XHRcdFx0dGV4dCA9IFwiPHNwYW4gY2xhc3M9J3dvcmQnPlwiICsgdGV4dDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihsZXR0ZXJzW2ldID09IFwiIFwiIHx8IGxldHRlcnNbaV0gPT0gXCImbmJzcDtcIil7XHJcblx0XHRcdFx0dGV4dCA9IFwiPC9zcGFuPjxzcGFuIGNsYXNzPSdsZXR0ZXInPiZuYnNwOzwvc3Bhbj48c3BhbiBjbGFzcz0nd29yZCc+XCI7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoaSA9PSBsZXR0ZXJzLmxlbmd0aC0xKSB7XHJcblx0XHRcdFx0dGV4dCA9IHRleHQgKyBcIjwvc3Bhbj5cIjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bmV3X3RpdGxlICs9IHRleHQ7XHJcblx0XHR9XHJcblxyXG5cdFx0dGl0bGVfY29udGFpbmVyLmFwcGVuZChuZXdfdGl0bGUpO1xyXG5cdH1cclxuXHJcblx0aWYoJChcIi5wb3J0Zm9saW8tc2xpZGVyXCIpLmxlbmd0aCl7XHJcblx0XHQkKFwiLnBvcnRmb2xpby1wcm9qZWN0cyAucHJvamVjdF9fdGl0bGVcIilcclxuXHRcdC5hZGQoXCIucG9ydGZvbGlvLXByb2plY3RzIC5wcm9qZWN0X190ZWNoXCIpXHJcblx0XHQuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFx0cHJlcGFyZV90aXRsZSgkKHRoaXMpKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdCQoXCIucG9ydGZvbGlvLXByb2plY3RzIC5hY3RpdmUgLnByb2plY3RfX3RpdGxlIC5sZXR0ZXJcIilcclxuXHRcdFx0LmFkZChcIi5wb3J0Zm9saW8tcHJvamVjdHMgLmFjdGl2ZSAucHJvamVjdF9fdGVjaCAubGV0dGVyXCIpXHJcblx0XHRcdC5hZGRDbGFzcyhcInNob3dcIik7XHJcblxyXG5cclxuXHJcblx0XHQkKFwiLnBvcnRmb2xpby1idXR0b25cIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIHRoaXNfYnV0dG9uID0gJCh0aGlzKSxcclxuXHRcdFx0XHR0aGlzX3RodW1ibmFpbHMgPSB0aGlzX2J1dHRvbi5uZXh0KCkuZmluZChcIi5wb3J0Zm9saW8tdGh1bWJuYWlsc19fdGh1bWJuYWlsXCIpLFxyXG5cdFx0XHRcdHRoaXNfYWN0aXZlX3RodW1iID0gdGhpc190aHVtYm5haWxzLmZpbHRlcihcIi5hY3RpdmVcIiksXHJcblx0XHRcdFx0dGhpc19uZXh0X2luZGV4ID0gdGhpc190aHVtYm5haWxzLmluZGV4KHRoaXNfYWN0aXZlX3RodW1iKTtcclxuXHJcblx0XHRcdHZhciBvdGhlcl9idXR0b24gPSB0aGlzX2J1dHRvbi5wYXJlbnQoKS5zaWJsaW5ncygpLmZpbmQoXCIucG9ydGZvbGlvLWJ1dHRvblwiKSxcclxuXHRcdFx0XHRvdGhlcl90aHVtYm5haWxzID0gb3RoZXJfYnV0dG9uLm5leHQoKS5maW5kKFwiLnBvcnRmb2xpby10aHVtYm5haWxzX190aHVtYm5haWxcIiksXHJcblx0XHRcdFx0b3RoZXJfYWN0aXZlX3RodW1iID0gb3RoZXJfdGh1bWJuYWlscy5maWx0ZXIoXCIuYWN0aXZlXCIpLFxyXG5cdFx0XHRcdG90aGVyX25leHRfaW5kZXggPSBvdGhlcl90aHVtYm5haWxzLmluZGV4KG90aGVyX2FjdGl2ZV90aHVtYik7XHJcblxyXG5cdFx0XHR2YXIgYWN0aXZlX3ByZXZpZXcgPSB0aGlzX2J1dHRvbi5jbG9zZXN0KFwiLnBvcnRmb2xpby1zbGlkZXJcIikuZmluZChcIi5wb3J0Zm9saW8tcHJldmlld1wiKSxcclxuXHRcdFx0XHRuZXh0X3ByZXZpZXcgPSB0aGlzX2FjdGl2ZV90aHVtYi5maW5kKFwiaW1nXCIpLmF0dHIoXCJzcmNcIiksXHJcblx0XHRcdFx0cHJvamVjdHMgPSB0aGlzX2J1dHRvbi5jbG9zZXN0KFwiLnBvcnRmb2xpby1zbGlkZXJcIikuZmluZChcIi5wb3J0Zm9saW8tcHJvamVjdHMgLnByb2plY3RcIiksXHJcblx0XHRcdFx0YWN0aXZlX3Byb2plY3QgPSBwcm9qZWN0cy5maWx0ZXIoXCIuYWN0aXZlXCIpLFxyXG5cdFx0XHRcdG5leHRfcHJvamVjdF9pbmRleCA9IHByb2plY3RzLmluZGV4KGFjdGl2ZV9wcm9qZWN0KTtcclxuXHJcblx0XHRcdGlmKHRoaXNfYnV0dG9uLmhhc0NsYXNzKFwicG9ydGZvbGlvLWJ1dHRvbl9uZXh0XCIpKSB7XHJcblx0XHRcdFx0bmV4dF9wcm9qZWN0X2luZGV4ID0gKG5leHRfcHJvamVjdF9pbmRleCA+PSBwcm9qZWN0cy5sZW5ndGgtMSkgPyAwIDogbmV4dF9wcm9qZWN0X2luZGV4KzE7XHJcblx0XHRcdFx0dGhpc19uZXh0X2luZGV4ID0gdGhpc19uZXh0X2luZGV4ID49IHRoaXNfdGh1bWJuYWlscy5sZW5ndGgtMSA/IDAgOiB0aGlzX25leHRfaW5kZXgrMTtcclxuXHRcdFx0XHRvdGhlcl9uZXh0X2luZGV4ID0gKG90aGVyX25leHRfaW5kZXggPj0gb3RoZXJfdGh1bWJuYWlscy5sZW5ndGgtMSkgPyAwIDogb3RoZXJfbmV4dF9pbmRleCsxO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdG5leHRfcHJvamVjdF9pbmRleC0tO1xyXG5cdFx0XHRcdHRoaXNfbmV4dF9pbmRleC0tO1xyXG5cdFx0XHRcdG90aGVyX25leHRfaW5kZXgtLTtcclxuXHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdHZhciB0aGlzX25leHRfdGh1bWIgPSB0aGlzX3RodW1ibmFpbHMuZXEodGhpc19uZXh0X2luZGV4KSxcclxuXHRcdFx0XHRvdGhlcl9uZXh0X3RodW1iID0gb3RoZXJfdGh1bWJuYWlscy5lcShvdGhlcl9uZXh0X2luZGV4KSxcclxuXHRcdFx0XHRuZXh0X3Byb2plY3QgPSBwcm9qZWN0cy5lcShuZXh0X3Byb2plY3RfaW5kZXgpLFxyXG5cdFx0XHRcdHRpdGxlX2xldHRlcnMgPSBuZXh0X3Byb2plY3QuZmluZChcIi5wcm9qZWN0X190aXRsZSBzcGFuLmxldHRlclwiKSxcclxuXHRcdFx0XHR0ZWNoX2xldHRlcnMgPSBuZXh0X3Byb2plY3QuZmluZChcIi5wcm9qZWN0X190ZWNoIHNwYW4ubGV0dGVyXCIpO1xyXG5cclxuXHRcdFx0ZnVuY3Rpb24gbG9ja19idXR0b25zKCl7XHJcblx0XHRcdFx0dGhpc19idXR0b24ucHJvcChcImRpc2FibGVkXCIsIHRydWUpO1xyXG5cdFx0XHRcdG90aGVyX2J1dHRvbi5wcm9wKFwiZGlzYWJsZWRcIiwgdHJ1ZSk7XHJcblxyXG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdHRoaXNfYnV0dG9uLnByb3AoXCJkaXNhYmxlZFwiLCBmYWxzZSk7XHJcblx0XHRcdFx0XHRvdGhlcl9idXR0b24ucHJvcChcImRpc2FibGVkXCIsIGZhbHNlKTtcclxuXHRcdFx0XHR9LCA2MDApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBjaGFuZ2VfdGh1bWJzKCl7XHJcblx0XHRcdFx0dGhpc19uZXh0X3RodW1iLnJlbW92ZUNsYXNzKFwibW92ZS1kb3duXCIpLmFkZENsYXNzKFwiYWN0aXZlIG1vdmUtdXBcIik7XHJcblx0XHRcdFx0dGhpc19hY3RpdmVfdGh1bWIucmVtb3ZlQ2xhc3MoXCJhY3RpdmUgbW92ZS1kb3duXCIpLmFkZENsYXNzKFwibW92ZS11cFwiKTtcclxuXHJcblx0XHRcdFx0b3RoZXJfbmV4dF90aHVtYi5yZW1vdmVDbGFzcyhcIm1vdmUtdXBcIikuYWRkQ2xhc3MoXCJhY3RpdmUgbW92ZS1kb3duXCIpO1xyXG5cdFx0XHRcdG90aGVyX2FjdGl2ZV90aHVtYi5yZW1vdmVDbGFzcyhcImFjdGl2ZSBtb3ZlLXVwXCIpLmFkZENsYXNzKFwibW92ZS1kb3duXCIpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBjaGFuZ2VfcHJldmlldygpe1xyXG5cdFx0XHRcdGFjdGl2ZV9wcmV2aWV3LmZhZGVPdXQoMzAwLCBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0JCh0aGlzKS5hdHRyKFwic3JjXCIsIG5leHRfcHJldmlldykuZmFkZUluKDMwMCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0Ly8gYWN0aXZlX3ByZXZpZXcuYXR0cihcInNyY1wiLCBuZXh0X3ByZXZpZXcpXHJcblx0XHRcdH1cclxuXHJcblxyXG5cdFx0XHRmdW5jdGlvbiBjaGFuZ2VfcHJvamVjdCgpe1xyXG5cdFx0XHRcdGFjdGl2ZV9wcm9qZWN0XHJcblx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIilcclxuXHRcdFx0XHRcdC5maW5kKFwiLnByb2plY3RfX3RpdGxlIHNwYW4ubGV0dGVyXCIpXHJcblx0XHRcdFx0XHQuYWRkKFwiLnByb2plY3RfX3RlY2ggc3Bhbi5sZXR0ZXJcIilcclxuXHRcdFx0XHRcdC5yZW1vdmVDbGFzcyhcInNob3dcIik7XHJcblx0XHRcdFx0bmV4dF9wcm9qZWN0LmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG5cclxuXHRcdFx0XHR0aXRsZV9sZXR0ZXJzLmVhY2goZnVuY3Rpb24oaW5kZXgpe1xyXG5cdFx0XHRcdFx0JCh0aGlzKVxyXG5cdFx0XHRcdFx0XHQuY3NzKHtcInRyYW5zaXRpb24tZGVsYXlcIjogKDAuMy90aXRsZV9sZXR0ZXJzLmxlbmd0aCkqKGluZGV4KzEpICsgXCJzXCJ9KVxyXG5cdFx0XHRcdFx0XHQuYWRkQ2xhc3MoXCJzaG93XCIpO1xyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHR0ZWNoX2xldHRlcnMuZWFjaChmdW5jdGlvbihpbmRleCl7XHJcblx0XHRcdFx0XHQkKHRoaXMpXHJcblx0XHRcdFx0XHRcdC5jc3Moe1widHJhbnNpdGlvbi1kZWxheVwiOiAoMC4zL3RlY2hfbGV0dGVycy5sZW5ndGgpKihpbmRleCsxKSArIFwic1wifSlcclxuXHRcdFx0XHRcdFx0LmFkZENsYXNzKFwic2hvd1wiKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bG9ja19idXR0b25zKCk7XHJcblx0XHRcdGNoYW5nZV90aHVtYnMoKTtcclxuXHRcdFx0Y2hhbmdlX3ByZXZpZXcoKTtcclxuXHRcdFx0Y2hhbmdlX3Byb2plY3QoKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBCTE9HIFNDUk9MTCBFVkVOVFNcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRpZigkKFwiLmJsb2ctbmF2aWdhdGlvblwiKS5sZW5ndGgpe1xyXG5cdFx0dmFyIGxhc3RJZCxcclxuXHRcdFx0bWVudSA9ICQoXCIuYmxvZy1uYXZpZ2F0aW9uXCIpLFxyXG5cdFx0XHRtZW51SXRlbXMgPSBtZW51LmZpbmQoXCJsaSBhXCIpLFxyXG5cdFx0XHRzY3JvbGxJdGVtcyA9IG1lbnVJdGVtcy5tYXAoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHR2YXIgaXRlbSA9ICQoJCh0aGlzKS5hdHRyKFwiaHJlZlwiKSk7XHJcblx0XHRcdFx0aWYgKGl0ZW0ubGVuZ3RoKSByZXR1cm4gaXRlbTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0bWVudUl0ZW1zLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHR2YXIgaHJlZiA9ICQodGhpcykuYXR0cihcImhyZWZcIiksXHJcblx0XHRcdFx0b2Zmc2V0VG9wID0gKGhyZWYgPT09IFwiI1wiKSA/IDAgOiAkKGhyZWYpLm9mZnNldCgpLnRvcC02MDtcclxuXHRcdFx0XHJcblx0XHRcdCQoXCJodG1sLCBib2R5XCIpLnN0b3AoKS5hbmltYXRlKHsgXHJcblx0XHRcdFx0c2Nyb2xsVG9wOiBvZmZzZXRUb3BcclxuXHRcdFx0fSwgNzAwLCBcInN3aW5nXCIpO1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHQkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgZnJvbVRvcCA9ICQodGhpcykuc2Nyb2xsVG9wKCksXHJcblx0XHRcdFx0YmxvZ05hdk9mZnNldCA9ICQoXCIuYmxvZy1uYXZpZ2F0aW9uXCIpLm9mZnNldCgpLnRvcCxcclxuXHRcdFx0XHRibG9nTmF2TGltaXQgPSAkKFwiLmZvb3Rlcl9fd3JhcHBlclwiKS5vZmZzZXQoKS50b3AgLSAkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5vdXRlckhlaWdodCgpLFxyXG5cdFx0XHRcdGN1cnJlbnQgPSBzY3JvbGxJdGVtcy5tYXAoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdGlmICgkKHRoaXMpLm9mZnNldCgpLnRvcCA8IGZyb21Ub3ArMTQ0KVxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdGN1cnJlbnQgPSBjdXJyZW50W2N1cnJlbnQubGVuZ3RoLTFdO1xyXG5cdFx0XHR2YXIgaWQgPSBjdXJyZW50ICYmIGN1cnJlbnQubGVuZ3RoID8gY3VycmVudFswXS5pZCA6IFwiXCI7XHJcblxyXG5cdFx0XHRpZiAobGFzdElkICE9PSBpZCkge1xyXG5cdFx0XHRcdGxhc3RJZCA9IGlkO1xyXG5cdFx0XHRcdG1lbnVJdGVtcy5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKS5maWx0ZXIoXCJbaHJlZj0jXCIraWQrXCJdXCIpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZihmcm9tVG9wID49IGJsb2dOYXZMaW1pdCAmJiAkKHdpbmRvdykud2lkdGgoKSA+ICg3NjggLSBzY3JvbGxCYXJXaWR0aCkpIHtcclxuXHRcdFx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5jc3Moe1wicG9zaXRpb25cIjpcImFic29sdXRlXCIsIFwidG9wXCI6YmxvZ05hdkxpbWl0ICsgXCJweFwifSk7XHJcblx0XHRcdH0gZWxzZSBpZiAoZnJvbVRvcCA+PSBibG9nTmF2T2Zmc2V0ICYmICQod2luZG93KS53aWR0aCgpID4gKDc2OCAtIHNjcm9sbEJhcldpZHRoKSkge1xyXG5cdFx0XHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uX193cmFwcGVyXCIpLmNzcyh7XCJwb3NpdGlvblwiOlwiZml4ZWRcIiwgXCJ0b3BcIjowfSk7XHJcblx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikuYWRkQ2xhc3MoXCJuYXYtZml4ZWRcIik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikuY3NzKHtcInBvc2l0aW9uXCI6XCJyZWxhdGl2ZVwifSk7XHJcblx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikucmVtb3ZlQ2xhc3MoXCJuYXYtZml4ZWRcIik7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9KTtcclxuXHJcblx0XHQkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpZigkKHdpbmRvdykud2lkdGgoKSA8PSAoNzY4IC0gc2Nyb2xsQmFyV2lkdGgpKXtcclxuXHRcdFx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5yZW1vdmVDbGFzcyhcIm5hdi1maXhlZFwiKTtcclxuXHRcdFx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5jc3Moe1wicG9zaXRpb25cIjpcInJlbGF0aXZlXCJ9KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpZigkKFwiYm9keVwiKS5zY3JvbGxUb3AoKSA+PSAkKFwiLmJsb2dcIikub2Zmc2V0KCkudG9wKXtcclxuXHRcdFx0XHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uX193cmFwcGVyXCIpLmNzcyh7XCJwb3NpdGlvblwiOlwiZml4ZWRcIiwgXCJ0b3BcIjowfSk7XHJcblx0XHRcdFx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5hZGRDbGFzcyhcIm5hdi1maXhlZFwiKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBSRVNJWkUgRVZFTlRTXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0aWYoJChcIi50YWxrc1wiKS5sZW5ndGgpe1xyXG5cdFx0JCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbigpIHtcclxuXHRcdFx0Ly8gVGVzdGltb25pYWxzIHNlY3Rpb24gYmcgc2l6ZVxyXG5cdFx0XHRpZiggJCh3aW5kb3cpLndpZHRoKCk+MjAwMCAtIHNjcm9sbEJhcldpZHRoKXtcclxuXHRcdFx0XHQkKFwiLnRhbGtzLCAuY29udGFjdC1mb3JtX19iZ1wiKS5jc3MoXCJiYWNrZ3JvdW5kLXNpemVcIiwgJCh3aW5kb3cpLndpZHRoKCkgKyBcInB4XCIpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBCbHVyIGJ1ZyBleGFtcGxlXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0ZnVuY3Rpb24gc2V0X2JnKCl7XHJcblx0XHRpZigkKFwiLmJsdXJfZXhhbXBsZV9wYWdlXCIpLmxlbmd0aCl7XHJcblx0XHRcdHZhciBmb3JtID0gJChcIi5ibHVyX2V4YW1wbGVfcGFnZSAudGFsa3MgLmNvbnRhY3QtZm9ybVwiKSxcclxuXHRcdFx0XHRmb3JtX2JnID0gZm9ybS5maW5kKFwiLmNvbnRhY3QtZm9ybV9fYmdcIiksXHJcblx0XHRcdFx0dGFsa3NfdG9wID0gJChcIi5ibHVyX2V4YW1wbGVfcGFnZSAudGFsa3NcIikub2Zmc2V0KCkudG9wLFxyXG5cdFx0XHRcdGZvcm1fYmdfdG9wID0gZm9ybV9iZy5vZmZzZXQoKS50b3AsXHJcblx0XHRcdFx0Ymdfb2Zmc2V0ID0gdGFsa3NfdG9wIC0gZm9ybV9iZ190b3A7XHJcblxyXG5cdFx0XHRmb3JtX2JnLmNzcyh7XHJcblx0XHRcdFx0XCJiYWNrZ3JvdW5kLXBvc2l0aW9uXCIgOiBcImNlbnRlciBcIiArIGJnX29mZnNldCArIFwicHhcIlxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdCQod2luZG93KS5sb2FkKGZ1bmN0aW9uKCkge1xyXG5cdFx0c2V0X2JnKCk7XHJcblx0fSk7XHJcblxyXG5cdCQod2luZG93KS5yZXNpemUoZnVuY3Rpb24oKSB7XHJcblx0XHRzZXRfYmcoKTtcclxuXHR9KTtcclxuXHJcbn0pKGpRdWVyeSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
