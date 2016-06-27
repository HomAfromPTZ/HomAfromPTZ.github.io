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

		$(".portfolio-button").on("click", function(){
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

			function show_letters(letters){
				// var i = 0;
				// var loop = setInterval(function(){
				// 	letters.eq(i++).addClass("show");
				// 	// if(i++ >= letters.length) clearInterval(loop);
				// // },20);
				// },300/letters.length);

				letters.each(function(index){
					$(this)
						.css({"animation-delay": (0.7/letters.length)*(index+1) + "s"})
						.addClass("show");
				});
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

				show_letters(title_letters);
				show_letters(tech_letters);

				// title_letters.each(function(index){
				// 	$(this)
				// 		.css({"animation-delay": (0.6/title_letters.length)*(index+1) + "s"})
				// 		.addClass("show");
				// });

				// tech_letters.each(function(index){
				// 	$(this)
				// 		.css({"animation-delay": (0.6/tech_letters.length)*(index+1) + "s"})
				// 		.addClass("show");
				// });
			}

			change_thumbs();
			change_project();
			change_preview();
			lock_buttons();
		});
	}



	// ==============================
	// BLOG SCROLL EVENTS
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigkKSB7XHJcblx0XCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIENoZWNrIHNjcm9sbGJhciB3aWR0aFxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdHZhciB3aWR0aENvbnRlbnRBID0gJChcIiNzY3JvbGxfYmFyX2NoZWNrX0FcIikud2lkdGgoKSxcclxuXHRcdHdpZHRoQ29udGVudEIgPSAkKFwiI3Njcm9sbF9iYXJfY2hlY2tfQlwiKS53aWR0aCgpO1xyXG5cclxuXHR2YXIgc2Nyb2xsQmFyV2lkdGggPSB3aWR0aENvbnRlbnRBIC0gd2lkdGhDb250ZW50QjtcclxuXHJcblx0JChcIiNzY3JvbGxfYmFyX2NoZWNrX0FcIikuY3NzKFwiZGlzcGxheVwiLFwibm9uZVwiKTtcclxuXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBDaGVjayBJRSB2ZXJzaW9uXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0ZnVuY3Rpb24gZGV0ZWN0X0lFKCkge1xyXG5cdFx0dmFyIHVhID0gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQ7XHJcblxyXG5cdFx0dmFyIG1zaWUgPSB1YS5pbmRleE9mKFwiTVNJRSBcIik7XHJcblx0XHRpZiAobXNpZSA+IDApIHtcclxuXHRcdFx0Ly8gSUUgMTAgb3Igb2xkZXIgPT4gcmV0dXJuIHZlcnNpb24gbnVtYmVyXHJcblx0XHRcdHJldHVybiBwYXJzZUludCh1YS5zdWJzdHJpbmcobXNpZSArIDUsIHVhLmluZGV4T2YoXCIuXCIsIG1zaWUpKSwgMTApO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciB0cmlkZW50ID0gdWEuaW5kZXhPZihcIlRyaWRlbnQvXCIpO1xyXG5cdFx0aWYgKHRyaWRlbnQgPiAwKSB7XHJcblx0XHRcdC8vIElFIDExID0+IHJldHVybiB2ZXJzaW9uIG51bWJlclxyXG5cdFx0XHR2YXIgcnYgPSB1YS5pbmRleE9mKFwicnY6XCIpO1xyXG5cdFx0XHRyZXR1cm4gcGFyc2VJbnQodWEuc3Vic3RyaW5nKHJ2ICsgMywgdWEuaW5kZXhPZihcIi5cIiwgcnYpKSwgMTApO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBlZGdlID0gdWEuaW5kZXhPZihcIkVkZ2UvXCIpO1xyXG5cdFx0aWYgKGVkZ2UgPiAwKSB7XHJcblx0XHRcdC8vIEVkZ2UgKElFIDEyKykgPT4gcmV0dXJuIHZlcnNpb24gbnVtYmVyXHJcblx0XHRcdHJldHVybiBwYXJzZUludCh1YS5zdWJzdHJpbmcoZWRnZSArIDUsIHVhLmluZGV4T2YoXCIuXCIsIGVkZ2UpKSwgMTApO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIG90aGVyIGJyb3dzZXJcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gUHJlbG9hZGVyIHdpdGggcGVyY2VudGFnZSBieSBpbWFnZSBjb3VudFxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIHByZWxvYWRlcigpIHtcclxuXHRcdHZhciBwcmVsb2FkZXJfc3RhdCA9ICQoXCIjcHJlbG9hZGVyLXN2Z19fcGVyY2VudGFnZVwiKSxcclxuXHRcdFx0aGFzSW1hZ2VQcm9wZXJ0aWVzID0gW1wiYmFja2dyb3VuZFwiLCBcImJhY2tncm91bmRJbWFnZVwiLCBcImxpc3RTdHlsZUltYWdlXCIsIFwiYm9yZGVySW1hZ2VcIiwgXCJib3JkZXJDb3JuZXJJbWFnZVwiLCBcImN1cnNvclwiXSxcclxuXHRcdFx0aGFzSW1hZ2VBdHRyaWJ1dGVzID0gW1wic3Jjc2V0XCJdLFxyXG5cdFx0XHRtYXRjaF91cmwgPSAvdXJsXFwoXFxzKihbJ1wiXT8pKC4qPylcXDFcXHMqXFwpL2csXHJcblx0XHRcdGFsbF9pbWFnZXMgPSBbXSxcclxuXHRcdFx0dG90YWwgPSAwLFxyXG5cdFx0XHRjb3VudCA9IDA7XHJcblxyXG5cdFx0dmFyIGNpcmNsZV9vID0gJChcIiNwcmVsb2FkZXItc3ZnX19pbWcgLmJhcl9fb3V0ZXJcIiksXHJcblx0XHRcdGNpcmNsZV9jID0gJChcIiNwcmVsb2FkZXItc3ZnX19pbWcgLmJhcl9fY2VudGVyXCIpLFxyXG5cdFx0XHRjaXJjbGVfaSA9ICQoXCIjcHJlbG9hZGVyLXN2Z19faW1nIC5iYXJfX2lubmVyXCIpLFxyXG5cdFx0XHRsZW5ndGhfbyA9IE1hdGguUEkqKGNpcmNsZV9vLmF0dHIoXCJyXCIpICogMiksXHJcblx0XHRcdGxlbmd0aF9jID0gTWF0aC5QSSooY2lyY2xlX2MuYXR0cihcInJcIikgKiAyKSxcclxuXHRcdFx0bGVuZ3RoX2kgPSBNYXRoLlBJKihjaXJjbGVfaS5hdHRyKFwiclwiKSAqIDIpO1xyXG5cclxuXHJcblx0XHRmdW5jdGlvbiBpbWdfbG9hZGVkKCl7XHJcblx0XHRcdHZhciBwZXJjZW50YWdlID0gTWF0aC5jZWlsKCArK2NvdW50IC8gdG90YWwgKiAxMDAgKTtcclxuXHJcblx0XHRcdHBlcmNlbnRhZ2UgPSBwZXJjZW50YWdlID4gMTAwID8gMTAwIDogcGVyY2VudGFnZTtcclxuXHJcblx0XHRcdC8vIERyYXcgb2Zmc2V0c1xyXG5cdFx0XHRjaXJjbGVfby5jc3Moe3N0cm9rZURhc2hvZmZzZXQ6ICgoMTAwLXBlcmNlbnRhZ2UpLzEwMCkqbGVuZ3RoX28gfSk7XHJcblxyXG5cdFx0XHRpZihwZXJjZW50YWdlID4gNTApIHtcclxuXHRcdFx0XHRjaXJjbGVfYy5jc3Moe3N0cm9rZURhc2hvZmZzZXQ6ICgoMTAwLXBlcmNlbnRhZ2UpLzEwMCkqbGVuZ3RoX2MgfSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKHBlcmNlbnRhZ2UgPT0gMTAwKSB7XHJcblx0XHRcdFx0Y2lyY2xlX2kuY3NzKHtzdHJva2VEYXNob2Zmc2V0OiAoKDEwMC1wZXJjZW50YWdlKS8xMDApKmxlbmd0aF9pIH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRwcmVsb2FkZXJfc3RhdC5odG1sKHBlcmNlbnRhZ2UpO1xyXG5cclxuXHRcdFx0aWYoY291bnQgPT09IHRvdGFsKSByZXR1cm4gZG9uZV9sb2FkaW5nKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gZG9uZV9sb2FkaW5nKCl7XHJcblx0XHRcdCQoXCIjcHJlbG9hZGVyXCIpLmRlbGF5KDcwMCkuZmFkZU91dCg3MDAsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0JChcIiNwcmVsb2FkZXJfX3Byb2dyZXNzXCIpLnJlbW92ZSgpO1xyXG5cclxuXHRcdFx0XHRpZigkKFwiLmZsaXAtY2FyZFwiKS5sZW5ndGgpe1xyXG5cdFx0XHRcdFx0JChcIi5mbGlwLWNhcmRcIikuYWRkQ2xhc3MoXCJsb2FkZWRcIik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBpbWFnZXNfbG9vcCAoKSB7XHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHZhciB0ZXN0X2ltYWdlID0gbmV3IEltYWdlKCk7XHJcblxyXG5cdFx0XHRcdHRlc3RfaW1hZ2Uub25sb2FkID0gaW1nX2xvYWRlZDtcclxuXHRcdFx0XHR0ZXN0X2ltYWdlLm9uZXJyb3IgPSBpbWdfbG9hZGVkO1xyXG5cclxuXHRcdFx0XHQvLyBjb25zb2xlLmxvZyhcIkM6IFwiICsgY291bnQsIFwiIFQ6IFwiICsgdG90YWwpO1xyXG5cclxuXHRcdFx0XHRpZiAoY291bnQgIT0gdG90YWwpIHtcclxuXHRcdFx0XHRcdGlmIChhbGxfaW1hZ2VzW2NvdW50XS5zcmNzZXQpIHtcclxuXHRcdFx0XHRcdFx0dGVzdF9pbWFnZS5zcmNzZXQgPSBhbGxfaW1hZ2VzW2NvdW50XS5zcmNzZXQ7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR0ZXN0X2ltYWdlLnNyYyA9IGFsbF9pbWFnZXNbY291bnRdLnNyYztcclxuXHJcblx0XHRcdFx0XHRpbWFnZXNfbG9vcCgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSwgNTApO1xyXG5cclxuXHJcblx0XHRcdC8vIGZvcih2YXIgaT0wOyBpPHRvdGFsOyBpKyspe1xyXG5cdFx0XHQvLyBcdHZhciB0ZXN0X2ltYWdlID0gbmV3IEltYWdlKCk7XHJcblxyXG5cclxuXHRcdFx0Ly8gXHR0ZXN0X2ltYWdlLm9ubG9hZCA9IGltZ19sb2FkZWQ7XHJcblx0XHRcdC8vIFx0dGVzdF9pbWFnZS5vbmVycm9yID0gaW1nX2xvYWRlZDtcclxuXHJcblx0XHRcdC8vIFx0aWYgKGFsbF9pbWFnZXNbaV0uc3Jjc2V0KSB7XHJcblx0XHRcdC8vIFx0XHR0ZXN0X2ltYWdlLnNyY3NldCA9IGFsbF9pbWFnZXNbaV0uc3Jjc2V0O1xyXG5cdFx0XHQvLyBcdH1cclxuXHRcdFx0Ly8gXHR0ZXN0X2ltYWdlLnNyYyA9IGFsbF9pbWFnZXNbaV0uc3JjO1xyXG5cdFx0XHQvLyB9XHJcblx0XHR9XHJcblxyXG5cdFx0JChcIipcIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHZhciBlbGVtZW50ID0gJCh0aGlzKTtcclxuXHJcblx0XHRcdGlmIChlbGVtZW50LmlzKFwiaW1nXCIpICYmIGVsZW1lbnQuYXR0cihcInNyY1wiKSkge1xyXG5cdFx0XHRcdGFsbF9pbWFnZXMucHVzaCh7XHJcblx0XHRcdFx0XHRzcmM6IGVsZW1lbnQuYXR0cihcInNyY1wiKSxcclxuXHRcdFx0XHRcdGVsZW1lbnQ6IGVsZW1lbnRbMF1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0JC5lYWNoKGhhc0ltYWdlUHJvcGVydGllcywgZnVuY3Rpb24gKGksIHByb3BlcnR5KSB7XHJcblx0XHRcdFx0dmFyIHByb3BlcnR5VmFsdWUgPSBlbGVtZW50LmNzcyhwcm9wZXJ0eSk7XHJcblx0XHRcdFx0dmFyIG1hdGNoO1xyXG5cclxuXHRcdFx0XHRpZiAoIXByb3BlcnR5VmFsdWUpIHtcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0bWF0Y2ggPSBtYXRjaF91cmwuZXhlYyhwcm9wZXJ0eVZhbHVlKTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRpZiAobWF0Y2gpIHtcclxuXHRcdFx0XHRcdGFsbF9pbWFnZXMucHVzaCh7XHJcblx0XHRcdFx0XHRcdHNyYzogbWF0Y2hbMl0sXHJcblx0XHRcdFx0XHRcdGVsZW1lbnQ6IGVsZW1lbnRbMF1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQkLmVhY2goaGFzSW1hZ2VBdHRyaWJ1dGVzLCBmdW5jdGlvbiAoaSwgYXR0cmlidXRlKSB7XHJcblx0XHRcdFx0dmFyIGF0dHJpYnV0ZVZhbHVlID0gZWxlbWVudC5hdHRyKGF0dHJpYnV0ZSk7XHJcblxyXG5cdFx0XHRcdGlmICghYXR0cmlidXRlVmFsdWUpIHtcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0YWxsX2ltYWdlcy5wdXNoKHtcclxuXHRcdFx0XHRcdHNyYzogZWxlbWVudC5hdHRyKFwic3JjXCIpLFxyXG5cdFx0XHRcdFx0c3Jjc2V0OiBlbGVtZW50LmF0dHIoXCJzcmNzZXRcIiksXHJcblx0XHRcdFx0XHRlbGVtZW50OiBlbGVtZW50WzBdXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0dG90YWwgPSBhbGxfaW1hZ2VzLmxlbmd0aDtcclxuXHJcblx0XHRpZiAodG90YWwgPT09IDApIHtcclxuXHRcdFx0ZG9uZV9sb2FkaW5nKCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRwcmVsb2FkZXJfc3RhdC5jc3Moe29wYWNpdHk6IDF9KTtcclxuXHRcdFx0aW1hZ2VzX2xvb3AoKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByZWxvYWRlcigpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gUGFnZSBjaGFuZ2VyXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0JChkb2N1bWVudCkub24oXCJjbGlja1wiLCBcImEucHJlbG9hZC1saW5rXCIsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdHZhciBocmVmID0gJCh0aGlzKS5hdHRyKFwiaHJlZlwiKTtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRyZXR1cm4gJChcIiNwcmVsb2FkZXJcIilcclxuXHRcdFx0LmZhZGVJbigzMDAsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0cmV0dXJuIGRvY3VtZW50LmxvY2F0aW9uID0gaHJlZiAhPSBudWxsID8gaHJlZiA6IFwiL1wiO1xyXG5cdFx0XHR9KTtcclxuXHR9KTtcclxuXHJcblxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gQW5pbWF0aW9uc1xyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdCQuZm4uYW5pbWF0ZWQgPSBmdW5jdGlvbihpbkVmZmVjdCkge1xyXG5cdFx0JCh0aGlzKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgdGhzID0gJCh0aGlzKTtcclxuXHRcdFx0dGhzLmNzcyh7b3BhY2l0eTowfSlcclxuXHRcdFx0XHQuYWRkQ2xhc3MoXCJhbmltYXRlZFwiKVxyXG5cdFx0XHRcdC53YXlwb2ludChmdW5jdGlvbihkaXIpIHtcclxuXHRcdFx0XHRcdGlmIChkaXIgPT09IFwiZG93blwiKSB7XHJcblx0XHRcdFx0XHRcdHRocy5hZGRDbGFzcyhpbkVmZmVjdCkuY3NzKHtvcGFjaXR5OjF9KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdG9mZnNldDogXCI5MCVcIlxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fTtcclxuXHJcblx0JChcImhlYWRlciAuc3ZnLWhlYWRpbmcsIC50YWxrcyAuc3ZnLWhlYWRpbmcsIC50YWxrcyAudGVzdGltb25pYWxcIikuYW5pbWF0ZWQoXCJmYWRlSW5VcFwiKTtcclxuXHQkKFwiLmFib3V0LW1lX19za2lsbHM+ZGl2XCIpLmFuaW1hdGVkKFwiZmFkZUluVXBcIik7XHJcblx0JChcIi5hcnRpY2xlLCAucG9ydGZvbGlvLXNsaWRlcl9fbmF2aWdhdGlvbi1jb250YWluZXIsIC5wb3J0Zm9saW8tc2xpZGVyX19wcmV2aWV3LWNvbnRhaW5lclwiKS5hbmltYXRlZChcImZhZGVJblwiKTtcclxuXHQkKFwiLnBvcnRmb2xpby1zbGlkZXJfX3Byb2plY3RzLWNvbnRhaW5lclwiKS5hbmltYXRlZChcImZhZGVJblwiKTtcclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFBpZWNoYXJ0cyBhbmltYXRpb25cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRpZigkKFwiLnBpZWNoYXJ0XCIpLmxlbmd0aCl7XHJcblx0XHQkKFwiLnBpZWNoYXJ0IC5waWVjaGFydF9fZmlsbFwiKS5lYWNoKGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciBwaWUgPSAkKHRoaXMpO1xyXG5cdFx0XHRwaWUud2F5cG9pbnQoZnVuY3Rpb24oZGlyKSB7XHJcblx0XHRcdFx0aWYgKGRpciA9PT0gXCJkb3duXCIpIHtcclxuXHRcdFx0XHRcdHBpZS5jc3Moe3N0cm9rZURhc2hvZmZzZXQ6cGllLmRhdGEoXCJwZXJjZW50YWdlXCIpfSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdG9mZnNldDogXCI5MCVcIlxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gUGFyYWxsYXhcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHR2YXIgaXNfdGhpc19pZSA9IGRldGVjdF9JRSgpO1xyXG5cclxuXHQvLyBJRSBzY3JvbGwganVtcCBmaXhcclxuXHRpZihpc190aGlzX2llKSB7XHJcblx0XHQkKFwiLmxheWVyXCIpLmNzcyh7dHJhbnNpdGlvbjpcInRvcCAuMTVzIGxpbmVhclwifSk7XHJcblx0XHQkKFwiI3NjZW5lLnZlcnRpY2FsXCIpLmNzcyh7dHJhbnNpdGlvbjpcIm9wYWNpdHkgLjE1cyBsaW5lYXJcIn0pO1xyXG5cclxuXHRcdCQoXCJib2R5XCIpLm9uKFwibW91c2V3aGVlbFwiLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IFxyXG5cclxuXHRcdFx0dmFyIHdoZWVsRGVsdGEgPSBldmVudC53aGVlbERlbHRhLFxyXG5cdFx0XHRcdGN1cnJlbnRTY3JvbGxQb3NpdGlvbiA9IHdpbmRvdy5wYWdlWU9mZnNldDtcclxuXHJcblx0XHRcdHdpbmRvdy5zY3JvbGxUbygwLCBjdXJyZW50U2Nyb2xsUG9zaXRpb24gLSB3aGVlbERlbHRhKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0aWYoJChcIiNzY2VuZS5heGlzXCIpLmxlbmd0aCl7XHJcblx0XHQkKFwiI3NjZW5lLmF4aXNcIikucGFyYWxsYXgoe1xyXG5cdFx0XHRzY2FsYXJYOiAzLFxyXG5cdFx0XHRzY2FsYXJZOiAzLFxyXG5cdFx0XHRmcmljdGlvblg6IDAuNSxcclxuXHRcdFx0ZnJpY3Rpb25ZOiAwLjVcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0aWYoJChcIiNzY2VuZS52ZXJ0aWNhbFwiKS5sZW5ndGgpe1xyXG5cdFx0JCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHNjcm9sbFBvcyA9ICQodGhpcykuc2Nyb2xsVG9wKCk7XHJcblxyXG5cdFx0XHQkKFwiI3NjZW5lLnZlcnRpY2FsIC5sYXllclwiKS5lYWNoKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dmFyIGxheWVyID0gJCh0aGlzKTtcclxuXHJcblx0XHRcdFx0aWYobGF5ZXIuaW5kZXgoKSAhPTAgKSB7XHJcblx0XHRcdFx0XHRsYXllci5jc3Moe1xyXG5cdFx0XHRcdFx0XHQvLyBcInRyYW5zZm9ybVwiIDogXCJ0cmFuc2xhdGUzZCgwLFwiICsgKCAoc2Nyb2xsUG9zLyg1ICsgMipsYXllci5pbmRleCgpKSkgKSArIFwicHgsMClcIlxyXG5cdFx0XHRcdFx0XHRcInRvcFwiIDogKCAoc2Nyb2xsUG9zLyg1ICsgMipsYXllci5pbmRleCgpKSkgKSArIFwicHhcIlxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0JChcIiNzY2VuZS52ZXJ0aWNhbFwiKS5jc3Moe1xyXG5cdFx0XHRcdFwib3BhY2l0eVwiIDogMS0oc2Nyb2xsUG9zLzcyMClcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIExvZ2luIGNhcmQgZmxpcFxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdCQoXCIubG9naW4tYnV0dG9uXCIpLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG5cdFx0JChcImJvZHlcIikuYWRkQ2xhc3MoXCJjYXJkX2ZsaXBwZWRcIik7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjdW5mbGlwLWNhcmRcIikuY2xpY2soZnVuY3Rpb24oKSB7XHJcblx0XHQkKFwiYm9keVwiKS5yZW1vdmVDbGFzcyhcImNhcmRfZmxpcHBlZFwiKTtcclxuXHR9KTtcclxuXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBNYWluIG1lbnVcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQkKFwiI21lbnUtdG9nZ2xlXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHQkKHRoaXMpLmFkZChcIi5tYWluLW1lbnVcIikudG9nZ2xlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIubWFpbi1tZW51X19pdGVtXCIpLmVhY2goZnVuY3Rpb24oaW5kZXgpIHtcclxuXHRcdCQodGhpcykuY3NzKFwidHJhbnNpdGlvbi1kZWxheVwiLCAwLjMrMC4xKmluZGV4ICsgXCJzXCIpO1xyXG5cdH0pO1xyXG5cclxuXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBCdXR0b25zXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0JChcImJ1dHRvbi5nby1kb3duXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgZ28gPSAkKHRoaXMpLmRhdGEoXCJsaW5rXCIpO1xyXG5cdFx0JChcImh0bWwsIGJvZHlcIikuc3RvcCgpLmFuaW1hdGUoe1xyXG5cdFx0XHRzY3JvbGxUb3A6ICQoZ28pLm9mZnNldCgpLnRvcFxyXG5cdFx0fSwgNzAwLCBcInN3aW5nXCIpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiYnV0dG9uLmdvLXVwXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHQkKFwiaHRtbCwgYm9keVwiKS5zdG9wKCkuYW5pbWF0ZSh7XHJcblx0XHRcdHNjcm9sbFRvcDogMFxyXG5cdFx0fSwgNzAwLCBcInN3aW5nXCIpO1xyXG5cdH0pO1xyXG5cclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFNsaWRlclxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIHByZXBhcmVfdGl0bGUodGl0bGVfY29udGFpbmVyKXtcclxuXHRcdHZhciBsZXR0ZXJzID0gJC50cmltKHRpdGxlX2NvbnRhaW5lci50ZXh0KCkpLFxyXG5cdFx0XHRuZXdfdGl0bGUgPSBcIlwiO1xyXG5cclxuXHRcdHRpdGxlX2NvbnRhaW5lci5odG1sKFwiXCIpO1xyXG5cclxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBsZXR0ZXJzLmxlbmd0aDsgaSsrKXtcclxuXHRcdFx0dmFyIHRleHQgPSBcIjxzcGFuIGNsYXNzPSdsZXR0ZXInPlwiICsgbGV0dGVyc1tpXSArIFwiPC9zcGFuPlwiO1xyXG5cclxuXHRcdFx0aWYoaT09MCl7XHJcblx0XHRcdFx0dGV4dCA9IFwiPHNwYW4gY2xhc3M9J3dvcmQnPlwiICsgdGV4dDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihsZXR0ZXJzW2ldID09IFwiIFwiIHx8IGxldHRlcnNbaV0gPT0gXCImbmJzcDtcIil7XHJcblx0XHRcdFx0dGV4dCA9IFwiPC9zcGFuPlxcbjxzcGFuIGNsYXNzPSd3b3JkJz5cIjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihpID09IGxldHRlcnMubGVuZ3RoLTEpIHtcclxuXHRcdFx0XHR0ZXh0ID0gdGV4dCArIFwiPC9zcGFuPlwiO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRuZXdfdGl0bGUgKz0gdGV4dDtcclxuXHRcdH1cclxuXHJcblx0XHR0aXRsZV9jb250YWluZXIuYXBwZW5kKG5ld190aXRsZSk7XHJcblx0fVxyXG5cclxuXHRpZigkKFwiLnBvcnRmb2xpby1zbGlkZXJcIikubGVuZ3RoKXtcclxuXHRcdCQoXCIucG9ydGZvbGlvLXByb2plY3RzIC5wcm9qZWN0X190aXRsZVwiKVxyXG5cdFx0XHQuYWRkKFwiLnBvcnRmb2xpby1wcm9qZWN0cyAucHJvamVjdF9fdGVjaFwiKVxyXG5cdFx0XHQuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRwcmVwYXJlX3RpdGxlKCQodGhpcykpO1xyXG5cdFx0XHR9KTtcclxuXHJcblxyXG5cdFx0JChcIi5wb3J0Zm9saW8tcHJvamVjdHMgLmFjdGl2ZSAucHJvamVjdF9fdGl0bGUgLmxldHRlclwiKVxyXG5cdFx0XHQuYWRkKFwiLnBvcnRmb2xpby1wcm9qZWN0cyAuYWN0aXZlIC5wcm9qZWN0X190ZWNoIC5sZXR0ZXJcIilcclxuXHRcdFx0LmFkZENsYXNzKFwic2hvd1wiKTtcclxuXHJcblxyXG5cdFx0dmFyIHNsaWRlciA9ICQoXCIucG9ydGZvbGlvLXNsaWRlclwiKSxcclxuXHRcdFx0cHJldmlld3MgPSBzbGlkZXIuZmluZChcIi5wb3J0Zm9saW8tcHJldmlld1wiKSxcclxuXHRcdFx0cHJvamVjdHMgPSBzbGlkZXIuZmluZChcIi5wb3J0Zm9saW8tcHJvamVjdHMgLnByb2plY3RcIik7XHJcblxyXG5cdFx0JChcIi5wb3J0Zm9saW8tYnV0dG9uXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIHRoaXNfYnV0dG9uID0gJCh0aGlzKSxcclxuXHRcdFx0XHR0aGlzX3RodW1ibmFpbHMgPSB0aGlzX2J1dHRvbi5uZXh0KCkuZmluZChcIi5wb3J0Zm9saW8tdGh1bWJuYWlsc19fdGh1bWJuYWlsXCIpLFxyXG5cdFx0XHRcdHRoaXNfYWN0aXZlX3RodW1iID0gdGhpc190aHVtYm5haWxzLmZpbHRlcihcIi5hY3RpdmVcIiksXHJcblx0XHRcdFx0dGhpc19uZXh0X2luZGV4ID0gdGhpc190aHVtYm5haWxzLmluZGV4KHRoaXNfYWN0aXZlX3RodW1iKTtcclxuXHJcblx0XHRcdHZhciBvdGhlcl9idXR0b24gPSB0aGlzX2J1dHRvbi5wYXJlbnQoKS5zaWJsaW5ncygpLmZpbmQoXCIucG9ydGZvbGlvLWJ1dHRvblwiKSxcclxuXHRcdFx0XHRvdGhlcl90aHVtYm5haWxzID0gb3RoZXJfYnV0dG9uLm5leHQoKS5maW5kKFwiLnBvcnRmb2xpby10aHVtYm5haWxzX190aHVtYm5haWxcIiksXHJcblx0XHRcdFx0b3RoZXJfYWN0aXZlX3RodW1iID0gb3RoZXJfdGh1bWJuYWlscy5maWx0ZXIoXCIuYWN0aXZlXCIpLFxyXG5cdFx0XHRcdG90aGVyX25leHRfaW5kZXggPSBvdGhlcl90aHVtYm5haWxzLmluZGV4KG90aGVyX2FjdGl2ZV90aHVtYik7XHJcblxyXG5cdFx0XHR2YXIgYWN0aXZlX3ByZXZpZXcgPSBwcmV2aWV3cy5maWx0ZXIoXCIuYWN0aXZlXCIpLFxyXG5cdFx0XHRcdG5leHRfcHJldmlld19pbmRleCA9IHByZXZpZXdzLmluZGV4KGFjdGl2ZV9wcmV2aWV3KSxcclxuXHRcdFx0XHRhY3RpdmVfcHJvamVjdCA9IHByb2plY3RzLmZpbHRlcihcIi5hY3RpdmVcIiksXHJcblx0XHRcdFx0bmV4dF9wcm9qZWN0X2luZGV4ID0gcHJvamVjdHMuaW5kZXgoYWN0aXZlX3Byb2plY3QpO1xyXG5cclxuXHJcblxyXG5cdFx0XHRpZih0aGlzX2J1dHRvbi5oYXNDbGFzcyhcInBvcnRmb2xpby1idXR0b25fbmV4dFwiKSkge1xyXG5cdFx0XHRcdG5leHRfcHJvamVjdF9pbmRleCA9IChuZXh0X3Byb2plY3RfaW5kZXggPj0gcHJvamVjdHMubGVuZ3RoLTEpID8gMCA6IG5leHRfcHJvamVjdF9pbmRleCsxO1xyXG5cdFx0XHRcdHRoaXNfbmV4dF9pbmRleCA9IHRoaXNfbmV4dF9pbmRleCA+PSB0aGlzX3RodW1ibmFpbHMubGVuZ3RoLTEgPyAwIDogdGhpc19uZXh0X2luZGV4KzE7XHJcblx0XHRcdFx0b3RoZXJfbmV4dF9pbmRleCA9IChvdGhlcl9uZXh0X2luZGV4ID49IG90aGVyX3RodW1ibmFpbHMubGVuZ3RoLTEpID8gMCA6IG90aGVyX25leHRfaW5kZXgrMTtcclxuXHJcblx0XHRcdFx0bmV4dF9wcmV2aWV3X2luZGV4ID0gKG5leHRfcHJldmlld19pbmRleCA+PSBwcmV2aWV3cy5sZW5ndGgtMSkgPyAwIDogbmV4dF9wcmV2aWV3X2luZGV4KzE7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bmV4dF9wcm9qZWN0X2luZGV4LS07XHJcblx0XHRcdFx0dGhpc19uZXh0X2luZGV4LS07XHJcblx0XHRcdFx0b3RoZXJfbmV4dF9pbmRleC0tO1xyXG5cclxuXHRcdFx0XHRuZXh0X3ByZXZpZXdfaW5kZXgtLTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZnVuY3Rpb24gbG9ja19idXR0b25zKCl7XHJcblx0XHRcdFx0dGhpc19idXR0b24ucHJvcChcImRpc2FibGVkXCIsIHRydWUpO1xyXG5cdFx0XHRcdG90aGVyX2J1dHRvbi5wcm9wKFwiZGlzYWJsZWRcIiwgdHJ1ZSk7XHJcblxyXG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdHRoaXNfYnV0dG9uLnByb3AoXCJkaXNhYmxlZFwiLCBmYWxzZSk7XHJcblx0XHRcdFx0XHRvdGhlcl9idXR0b24ucHJvcChcImRpc2FibGVkXCIsIGZhbHNlKTtcclxuXHRcdFx0XHR9LCA3MDApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBjaGFuZ2VfdGh1bWJzKCl7XHJcblx0XHRcdFx0dmFyIHRoaXNfbmV4dF90aHVtYiA9IHRoaXNfdGh1bWJuYWlscy5lcSh0aGlzX25leHRfaW5kZXgpLFxyXG5cdFx0XHRcdFx0b3RoZXJfbmV4dF90aHVtYiA9IG90aGVyX3RodW1ibmFpbHMuZXEob3RoZXJfbmV4dF9pbmRleCk7XHJcblxyXG5cdFx0XHRcdHRoaXNfbmV4dF90aHVtYi5yZW1vdmVDbGFzcyhcIm1vdmUtZG93blwiKS5hZGRDbGFzcyhcImFjdGl2ZSBtb3ZlLXVwXCIpO1xyXG5cdFx0XHRcdHRoaXNfYWN0aXZlX3RodW1iLnJlbW92ZUNsYXNzKFwiYWN0aXZlIG1vdmUtZG93blwiKS5hZGRDbGFzcyhcIm1vdmUtdXBcIik7XHJcblxyXG5cdFx0XHRcdG90aGVyX25leHRfdGh1bWIucmVtb3ZlQ2xhc3MoXCJtb3ZlLXVwXCIpLmFkZENsYXNzKFwiYWN0aXZlIG1vdmUtZG93blwiKTtcclxuXHRcdFx0XHRvdGhlcl9hY3RpdmVfdGh1bWIucmVtb3ZlQ2xhc3MoXCJhY3RpdmUgbW92ZS11cFwiKS5hZGRDbGFzcyhcIm1vdmUtZG93blwiKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZnVuY3Rpb24gY2hhbmdlX3ByZXZpZXcoKXtcclxuXHRcdFx0XHR2YXIgbmV4dF9wcmV2aWV3ID0gcHJldmlld3MuZXEobmV4dF9wcmV2aWV3X2luZGV4KTtcclxuXHJcblx0XHRcdFx0YWN0aXZlX3ByZXZpZXcucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHRcdFx0bmV4dF9wcmV2aWV3LmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBzaG93X2xldHRlcnMobGV0dGVycyl7XHJcblx0XHRcdFx0Ly8gdmFyIGkgPSAwO1xyXG5cdFx0XHRcdC8vIHZhciBsb29wID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHQvLyBcdGxldHRlcnMuZXEoaSsrKS5hZGRDbGFzcyhcInNob3dcIik7XHJcblx0XHRcdFx0Ly8gXHQvLyBpZihpKysgPj0gbGV0dGVycy5sZW5ndGgpIGNsZWFySW50ZXJ2YWwobG9vcCk7XHJcblx0XHRcdFx0Ly8gLy8gfSwyMCk7XHJcblx0XHRcdFx0Ly8gfSwzMDAvbGV0dGVycy5sZW5ndGgpO1xyXG5cclxuXHRcdFx0XHRsZXR0ZXJzLmVhY2goZnVuY3Rpb24oaW5kZXgpe1xyXG5cdFx0XHRcdFx0JCh0aGlzKVxyXG5cdFx0XHRcdFx0XHQuY3NzKHtcImFuaW1hdGlvbi1kZWxheVwiOiAoMC43L2xldHRlcnMubGVuZ3RoKSooaW5kZXgrMSkgKyBcInNcIn0pXHJcblx0XHRcdFx0XHRcdC5hZGRDbGFzcyhcInNob3dcIik7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZ1bmN0aW9uIGNoYW5nZV9wcm9qZWN0KCl7XHJcblx0XHRcdFx0dmFyIG5leHRfcHJvamVjdCA9IHByb2plY3RzLmVxKG5leHRfcHJvamVjdF9pbmRleCksXHJcblx0XHRcdFx0XHR0aXRsZV9sZXR0ZXJzID0gbmV4dF9wcm9qZWN0LmZpbmQoXCIucHJvamVjdF9fdGl0bGUgc3Bhbi5sZXR0ZXJcIiksXHJcblx0XHRcdFx0XHR0ZWNoX2xldHRlcnMgPSBuZXh0X3Byb2plY3QuZmluZChcIi5wcm9qZWN0X190ZWNoIHNwYW4ubGV0dGVyXCIpO1xyXG5cclxuXHRcdFx0XHRhY3RpdmVfcHJvamVjdFxyXG5cdFx0XHRcdFx0LnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpXHJcblx0XHRcdFx0XHQuZmluZChcInNwYW4ubGV0dGVyLCBzcGFuLmxldHRlclwiKVxyXG5cdFx0XHRcdFx0LnJlbW92ZUNsYXNzKFwic2hvd1wiKTtcclxuXHRcdFx0XHRuZXh0X3Byb2plY3QuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcblxyXG5cdFx0XHRcdHNob3dfbGV0dGVycyh0aXRsZV9sZXR0ZXJzKTtcclxuXHRcdFx0XHRzaG93X2xldHRlcnModGVjaF9sZXR0ZXJzKTtcclxuXHJcblx0XHRcdFx0Ly8gdGl0bGVfbGV0dGVycy5lYWNoKGZ1bmN0aW9uKGluZGV4KXtcclxuXHRcdFx0XHQvLyBcdCQodGhpcylcclxuXHRcdFx0XHQvLyBcdFx0LmNzcyh7XCJhbmltYXRpb24tZGVsYXlcIjogKDAuNi90aXRsZV9sZXR0ZXJzLmxlbmd0aCkqKGluZGV4KzEpICsgXCJzXCJ9KVxyXG5cdFx0XHRcdC8vIFx0XHQuYWRkQ2xhc3MoXCJzaG93XCIpO1xyXG5cdFx0XHRcdC8vIH0pO1xyXG5cclxuXHRcdFx0XHQvLyB0ZWNoX2xldHRlcnMuZWFjaChmdW5jdGlvbihpbmRleCl7XHJcblx0XHRcdFx0Ly8gXHQkKHRoaXMpXHJcblx0XHRcdFx0Ly8gXHRcdC5jc3Moe1wiYW5pbWF0aW9uLWRlbGF5XCI6ICgwLjYvdGVjaF9sZXR0ZXJzLmxlbmd0aCkqKGluZGV4KzEpICsgXCJzXCJ9KVxyXG5cdFx0XHRcdC8vIFx0XHQuYWRkQ2xhc3MoXCJzaG93XCIpO1xyXG5cdFx0XHRcdC8vIH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjaGFuZ2VfdGh1bWJzKCk7XHJcblx0XHRcdGNoYW5nZV9wcm9qZWN0KCk7XHJcblx0XHRcdGNoYW5nZV9wcmV2aWV3KCk7XHJcblx0XHRcdGxvY2tfYnV0dG9ucygpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIEJMT0cgU0NST0xMIEVWRU5UU1xyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGlmKCQoXCIuYmxvZy1uYXZpZ2F0aW9uXCIpLmxlbmd0aCl7XHJcblx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fdG9nZ2xlXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uXCIpLnRvZ2dsZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0dmFyIGxhc3RJZCxcclxuXHRcdFx0bWVudSA9ICQoXCIuYmxvZy1uYXZpZ2F0aW9uXCIpLFxyXG5cdFx0XHRtZW51SXRlbXMgPSBtZW51LmZpbmQoXCJsaSBhXCIpLFxyXG5cdFx0XHRzY3JvbGxJdGVtcyA9IG1lbnVJdGVtcy5tYXAoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHR2YXIgaXRlbSA9ICQoJCh0aGlzKS5hdHRyKFwiaHJlZlwiKSk7XHJcblx0XHRcdFx0aWYgKGl0ZW0ubGVuZ3RoKSByZXR1cm4gaXRlbTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0bWVudUl0ZW1zLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHR2YXIgaHJlZiA9ICQodGhpcykuYXR0cihcImhyZWZcIiksXHJcblx0XHRcdFx0b2Zmc2V0VG9wID0gKGhyZWYgPT09IFwiI1wiKSA/IDAgOiAkKGhyZWYpLm9mZnNldCgpLnRvcC02MDtcclxuXHRcdFx0XHJcblx0XHRcdCQoXCJodG1sLCBib2R5XCIpLnN0b3AoKS5hbmltYXRlKHsgXHJcblx0XHRcdFx0c2Nyb2xsVG9wOiBvZmZzZXRUb3BcclxuXHRcdFx0fSwgNzAwLCBcInN3aW5nXCIpO1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHQkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgZnJvbVRvcCA9ICQodGhpcykuc2Nyb2xsVG9wKCksXHJcblx0XHRcdFx0YmxvZ05hdk9mZnNldCA9ICQoXCIuYmxvZy1uYXZpZ2F0aW9uXCIpLm9mZnNldCgpLnRvcCxcclxuXHRcdFx0XHRibG9nTmF2TGltaXQgPSAkKFwiLmZvb3Rlcl9fd3JhcHBlclwiKS5vZmZzZXQoKS50b3AgLSAkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5vdXRlckhlaWdodCgpLFxyXG5cdFx0XHRcdGN1cnJlbnQgPSBzY3JvbGxJdGVtcy5tYXAoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdGlmICgkKHRoaXMpLm9mZnNldCgpLnRvcCA8IGZyb21Ub3ArMTQ0KVxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdGN1cnJlbnQgPSBjdXJyZW50W2N1cnJlbnQubGVuZ3RoLTFdO1xyXG5cdFx0XHR2YXIgaWQgPSBjdXJyZW50ICYmIGN1cnJlbnQubGVuZ3RoID8gY3VycmVudFswXS5pZCA6IFwiXCI7XHJcblxyXG5cdFx0XHRpZiAobGFzdElkICE9PSBpZCkge1xyXG5cdFx0XHRcdGxhc3RJZCA9IGlkO1xyXG5cdFx0XHRcdG1lbnVJdGVtcy5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKS5maWx0ZXIoXCJbaHJlZj0jXCIraWQrXCJdXCIpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZihmcm9tVG9wID49IGJsb2dOYXZMaW1pdCAmJiAkKHdpbmRvdykud2lkdGgoKSA+ICg3NjggLSBzY3JvbGxCYXJXaWR0aCkpIHtcclxuXHRcdFx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5jc3Moe1wicG9zaXRpb25cIjpcImFic29sdXRlXCIsIFwidG9wXCI6YmxvZ05hdkxpbWl0ICsgXCJweFwifSk7XHJcblx0XHRcdH0gZWxzZSBpZiAoZnJvbVRvcCA+PSBibG9nTmF2T2Zmc2V0ICYmICQod2luZG93KS53aWR0aCgpID4gKDc2OCAtIHNjcm9sbEJhcldpZHRoKSkge1xyXG5cdFx0XHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uX193cmFwcGVyXCIpLmNzcyh7XCJwb3NpdGlvblwiOlwiZml4ZWRcIiwgXCJ0b3BcIjowfSk7XHJcblx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikuYWRkQ2xhc3MoXCJuYXYtZml4ZWRcIik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikuY3NzKHtcInBvc2l0aW9uXCI6XCJyZWxhdGl2ZVwifSk7XHJcblx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikucmVtb3ZlQ2xhc3MoXCJuYXYtZml4ZWRcIik7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9KTtcclxuXHJcblx0XHQkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpZigkKHdpbmRvdykud2lkdGgoKSA8PSAoNzY4IC0gc2Nyb2xsQmFyV2lkdGgpKXtcclxuXHRcdFx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5yZW1vdmVDbGFzcyhcIm5hdi1maXhlZFwiKTtcclxuXHRcdFx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5jc3Moe1wicG9zaXRpb25cIjpcInJlbGF0aXZlXCJ9KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpZigkKFwiYm9keVwiKS5zY3JvbGxUb3AoKSA+PSAkKFwiLmJsb2dcIikub2Zmc2V0KCkudG9wKXtcclxuXHRcdFx0XHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uX193cmFwcGVyXCIpLmNzcyh7XCJwb3NpdGlvblwiOlwiZml4ZWRcIiwgXCJ0b3BcIjowfSk7XHJcblx0XHRcdFx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5hZGRDbGFzcyhcIm5hdi1maXhlZFwiKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBSRVNJWkUgRVZFTlRTXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0aWYoJChcIi50YWxrc1wiKS5sZW5ndGgpe1xyXG5cdFx0JCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbigpIHtcclxuXHRcdFx0Ly8gVGVzdGltb25pYWxzIHNlY3Rpb24gYmcgc2l6ZVxyXG5cdFx0XHRpZiggJCh3aW5kb3cpLndpZHRoKCk+MjAwMCAtIHNjcm9sbEJhcldpZHRoKXtcclxuXHRcdFx0XHQkKFwiLnRhbGtzLCAuY29udGFjdC1mb3JtX19iZ1wiKS5jc3MoXCJiYWNrZ3JvdW5kLXNpemVcIiwgJCh3aW5kb3cpLndpZHRoKCkgKyBcInB4XCIpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBCbHVyIGJ1ZyBleGFtcGxlXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0ZnVuY3Rpb24gc2V0X2JnKCl7XHJcblx0XHRpZigkKFwiLmJsdXJfZXhhbXBsZV9wYWdlXCIpLmxlbmd0aCl7XHJcblx0XHRcdHZhciBmb3JtID0gJChcIi5ibHVyX2V4YW1wbGVfcGFnZSAudGFsa3MgLmNvbnRhY3QtZm9ybVwiKSxcclxuXHRcdFx0XHRmb3JtX2JnID0gZm9ybS5maW5kKFwiLmNvbnRhY3QtZm9ybV9fYmdcIiksXHJcblx0XHRcdFx0dGFsa3NfdG9wID0gJChcIi5ibHVyX2V4YW1wbGVfcGFnZSAudGFsa3NcIikub2Zmc2V0KCkudG9wLFxyXG5cdFx0XHRcdGZvcm1fYmdfdG9wID0gZm9ybV9iZy5vZmZzZXQoKS50b3AsXHJcblx0XHRcdFx0Ymdfb2Zmc2V0ID0gdGFsa3NfdG9wIC0gZm9ybV9iZ190b3A7XHJcblxyXG5cdFx0XHRmb3JtX2JnLmNzcyh7XHJcblx0XHRcdFx0XCJiYWNrZ3JvdW5kLXBvc2l0aW9uXCIgOiBcImNlbnRlciBcIiArIGJnX29mZnNldCArIFwicHhcIlxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdCQod2luZG93KS5sb2FkKGZ1bmN0aW9uKCkge1xyXG5cdFx0c2V0X2JnKCk7XHJcblx0fSk7XHJcblxyXG5cdCQod2luZG93KS5yZXNpemUoZnVuY3Rpb24oKSB7XHJcblx0XHRzZXRfYmcoKTtcclxuXHR9KTtcclxuXHJcbn0pKGpRdWVyeSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
