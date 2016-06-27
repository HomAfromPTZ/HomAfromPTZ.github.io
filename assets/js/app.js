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

			var previews = this_button.closest(".portfolio-slider").find(".portfolio-preview"),
				active_preview = previews.filter(".active"),
				next_preview_index = previews.index(active_preview),
				// next_preview = this_active_thumb.find("img").attr("src"),
				projects = this_button.closest(".portfolio-slider").find(".portfolio-projects .project"),
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


			var this_next_thumb = this_thumbnails.eq(this_next_index),
				other_next_thumb = other_thumbnails.eq(other_next_index),
				next_project = projects.eq(next_project_index),
				next_preview = previews.eq(next_preview_index),
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
				// active_preview.fadeTo(300, 0, function(){
				// 	$(this).attr("src", next_preview).fadeTo(300, 1);
				// });
				// active_preview.attr("src", next_preview)

				active_preview.removeClass("active");
				next_preview.addClass("active");
			}

			function show_letters(letters){
				var i = 0;
				var loop = setInterval(function(){
					letters.eq(i++).addClass("show");
					if(i >= letters.length) clearInterval(loop);
				},10);
				// },300/letters.length);
			}

			function change_project(){
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

			lock_buttons();
			change_preview();
			change_project();
			change_thumbs();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigkKSB7XHJcblx0XCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIENoZWNrIHNjcm9sbGJhciB3aWR0aFxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdHZhciB3aWR0aENvbnRlbnRBID0gJChcIiNzY3JvbGxfYmFyX2NoZWNrX0FcIikud2lkdGgoKSxcclxuXHRcdHdpZHRoQ29udGVudEIgPSAkKFwiI3Njcm9sbF9iYXJfY2hlY2tfQlwiKS53aWR0aCgpO1xyXG5cclxuXHR2YXIgc2Nyb2xsQmFyV2lkdGggPSB3aWR0aENvbnRlbnRBIC0gd2lkdGhDb250ZW50QjtcclxuXHJcblx0JChcIiNzY3JvbGxfYmFyX2NoZWNrX0FcIikuY3NzKFwiZGlzcGxheVwiLFwibm9uZVwiKTtcclxuXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBDaGVjayBJRSB2ZXJzaW9uXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0ZnVuY3Rpb24gZGV0ZWN0X0lFKCkge1xyXG5cdFx0dmFyIHVhID0gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQ7XHJcblxyXG5cdFx0dmFyIG1zaWUgPSB1YS5pbmRleE9mKFwiTVNJRSBcIik7XHJcblx0XHRpZiAobXNpZSA+IDApIHtcclxuXHRcdFx0Ly8gSUUgMTAgb3Igb2xkZXIgPT4gcmV0dXJuIHZlcnNpb24gbnVtYmVyXHJcblx0XHRcdHJldHVybiBwYXJzZUludCh1YS5zdWJzdHJpbmcobXNpZSArIDUsIHVhLmluZGV4T2YoXCIuXCIsIG1zaWUpKSwgMTApO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciB0cmlkZW50ID0gdWEuaW5kZXhPZihcIlRyaWRlbnQvXCIpO1xyXG5cdFx0aWYgKHRyaWRlbnQgPiAwKSB7XHJcblx0XHRcdC8vIElFIDExID0+IHJldHVybiB2ZXJzaW9uIG51bWJlclxyXG5cdFx0XHR2YXIgcnYgPSB1YS5pbmRleE9mKFwicnY6XCIpO1xyXG5cdFx0XHRyZXR1cm4gcGFyc2VJbnQodWEuc3Vic3RyaW5nKHJ2ICsgMywgdWEuaW5kZXhPZihcIi5cIiwgcnYpKSwgMTApO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBlZGdlID0gdWEuaW5kZXhPZihcIkVkZ2UvXCIpO1xyXG5cdFx0aWYgKGVkZ2UgPiAwKSB7XHJcblx0XHRcdC8vIEVkZ2UgKElFIDEyKykgPT4gcmV0dXJuIHZlcnNpb24gbnVtYmVyXHJcblx0XHRcdHJldHVybiBwYXJzZUludCh1YS5zdWJzdHJpbmcoZWRnZSArIDUsIHVhLmluZGV4T2YoXCIuXCIsIGVkZ2UpKSwgMTApO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIG90aGVyIGJyb3dzZXJcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gUHJlbG9hZGVyIHdpdGggcGVyY2VudGFnZSBieSBpbWFnZSBjb3VudFxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIHByZWxvYWRlcigpIHtcclxuXHRcdHZhciBwcmVsb2FkZXJfc3RhdCA9ICQoXCIjcHJlbG9hZGVyLXN2Z19fcGVyY2VudGFnZVwiKSxcclxuXHRcdFx0aGFzSW1hZ2VQcm9wZXJ0aWVzID0gW1wiYmFja2dyb3VuZFwiLCBcImJhY2tncm91bmRJbWFnZVwiLCBcImxpc3RTdHlsZUltYWdlXCIsIFwiYm9yZGVySW1hZ2VcIiwgXCJib3JkZXJDb3JuZXJJbWFnZVwiLCBcImN1cnNvclwiXSxcclxuXHRcdFx0aGFzSW1hZ2VBdHRyaWJ1dGVzID0gW1wic3Jjc2V0XCJdLFxyXG5cdFx0XHRtYXRjaF91cmwgPSAvdXJsXFwoXFxzKihbJ1wiXT8pKC4qPylcXDFcXHMqXFwpL2csXHJcblx0XHRcdGFsbF9pbWFnZXMgPSBbXSxcclxuXHRcdFx0dG90YWwgPSAwLFxyXG5cdFx0XHRjb3VudCA9IDA7XHJcblxyXG5cdFx0dmFyIGNpcmNsZV9vID0gJChcIiNwcmVsb2FkZXItc3ZnX19pbWcgLmJhcl9fb3V0ZXJcIiksXHJcblx0XHRcdGNpcmNsZV9jID0gJChcIiNwcmVsb2FkZXItc3ZnX19pbWcgLmJhcl9fY2VudGVyXCIpLFxyXG5cdFx0XHRjaXJjbGVfaSA9ICQoXCIjcHJlbG9hZGVyLXN2Z19faW1nIC5iYXJfX2lubmVyXCIpLFxyXG5cdFx0XHRsZW5ndGhfbyA9IE1hdGguUEkqKGNpcmNsZV9vLmF0dHIoXCJyXCIpICogMiksXHJcblx0XHRcdGxlbmd0aF9jID0gTWF0aC5QSSooY2lyY2xlX2MuYXR0cihcInJcIikgKiAyKSxcclxuXHRcdFx0bGVuZ3RoX2kgPSBNYXRoLlBJKihjaXJjbGVfaS5hdHRyKFwiclwiKSAqIDIpO1xyXG5cclxuXHJcblx0XHRmdW5jdGlvbiBpbWdfbG9hZGVkKCl7XHJcblx0XHRcdHZhciBwZXJjZW50YWdlID0gTWF0aC5jZWlsKCArK2NvdW50IC8gdG90YWwgKiAxMDAgKTtcclxuXHJcblx0XHRcdHBlcmNlbnRhZ2UgPSBwZXJjZW50YWdlID4gMTAwID8gMTAwIDogcGVyY2VudGFnZTtcclxuXHJcblx0XHRcdC8vIERyYXcgb2Zmc2V0c1xyXG5cdFx0XHRjaXJjbGVfby5jc3Moe3N0cm9rZURhc2hvZmZzZXQ6ICgoMTAwLXBlcmNlbnRhZ2UpLzEwMCkqbGVuZ3RoX28gfSk7XHJcblxyXG5cdFx0XHRpZihwZXJjZW50YWdlID4gNTApIHtcclxuXHRcdFx0XHRjaXJjbGVfYy5jc3Moe3N0cm9rZURhc2hvZmZzZXQ6ICgoMTAwLXBlcmNlbnRhZ2UpLzEwMCkqbGVuZ3RoX2MgfSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKHBlcmNlbnRhZ2UgPT0gMTAwKSB7XHJcblx0XHRcdFx0Y2lyY2xlX2kuY3NzKHtzdHJva2VEYXNob2Zmc2V0OiAoKDEwMC1wZXJjZW50YWdlKS8xMDApKmxlbmd0aF9pIH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRwcmVsb2FkZXJfc3RhdC5odG1sKHBlcmNlbnRhZ2UpO1xyXG5cclxuXHRcdFx0aWYoY291bnQgPT09IHRvdGFsKSByZXR1cm4gZG9uZV9sb2FkaW5nKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gZG9uZV9sb2FkaW5nKCl7XHJcblx0XHRcdCQoXCIjcHJlbG9hZGVyXCIpLmRlbGF5KDcwMCkuZmFkZU91dCg3MDAsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0JChcIiNwcmVsb2FkZXJfX3Byb2dyZXNzXCIpLnJlbW92ZSgpO1xyXG5cclxuXHRcdFx0XHRpZigkKFwiLmZsaXAtY2FyZFwiKS5sZW5ndGgpe1xyXG5cdFx0XHRcdFx0JChcIi5mbGlwLWNhcmRcIikuYWRkQ2xhc3MoXCJsb2FkZWRcIik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBpbWFnZXNfbG9vcCAoKSB7XHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHZhciB0ZXN0X2ltYWdlID0gbmV3IEltYWdlKCk7XHJcblxyXG5cdFx0XHRcdHRlc3RfaW1hZ2Uub25sb2FkID0gaW1nX2xvYWRlZDtcclxuXHRcdFx0XHR0ZXN0X2ltYWdlLm9uZXJyb3IgPSBpbWdfbG9hZGVkO1xyXG5cclxuXHRcdFx0XHQvLyBjb25zb2xlLmxvZyhcIkM6IFwiICsgY291bnQsIFwiIFQ6IFwiICsgdG90YWwpO1xyXG5cclxuXHRcdFx0XHRpZiAoY291bnQgIT0gdG90YWwpIHtcclxuXHRcdFx0XHRcdGlmIChhbGxfaW1hZ2VzW2NvdW50XS5zcmNzZXQpIHtcclxuXHRcdFx0XHRcdFx0dGVzdF9pbWFnZS5zcmNzZXQgPSBhbGxfaW1hZ2VzW2NvdW50XS5zcmNzZXQ7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR0ZXN0X2ltYWdlLnNyYyA9IGFsbF9pbWFnZXNbY291bnRdLnNyYztcclxuXHJcblx0XHRcdFx0XHRpbWFnZXNfbG9vcCgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSwgNTApO1xyXG5cdFx0fVxyXG5cclxuXHRcdCQoXCIqXCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG5cdFx0XHR2YXIgZWxlbWVudCA9ICQodGhpcyk7XHJcblxyXG5cdFx0XHRpZiAoZWxlbWVudC5pcyhcImltZ1wiKSAmJiBlbGVtZW50LmF0dHIoXCJzcmNcIikpIHtcclxuXHRcdFx0XHRhbGxfaW1hZ2VzLnB1c2goe1xyXG5cdFx0XHRcdFx0c3JjOiBlbGVtZW50LmF0dHIoXCJzcmNcIiksXHJcblx0XHRcdFx0XHRlbGVtZW50OiBlbGVtZW50WzBdXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdCQuZWFjaChoYXNJbWFnZVByb3BlcnRpZXMsIGZ1bmN0aW9uIChpLCBwcm9wZXJ0eSkge1xyXG5cdFx0XHRcdHZhciBwcm9wZXJ0eVZhbHVlID0gZWxlbWVudC5jc3MocHJvcGVydHkpO1xyXG5cdFx0XHRcdHZhciBtYXRjaDtcclxuXHJcblx0XHRcdFx0aWYgKCFwcm9wZXJ0eVZhbHVlKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdG1hdGNoID0gbWF0Y2hfdXJsLmV4ZWMocHJvcGVydHlWYWx1ZSk7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYgKG1hdGNoKSB7XHJcblx0XHRcdFx0XHRhbGxfaW1hZ2VzLnB1c2goe1xyXG5cdFx0XHRcdFx0XHRzcmM6IG1hdGNoWzJdLFxyXG5cdFx0XHRcdFx0XHRlbGVtZW50OiBlbGVtZW50WzBdXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0JC5lYWNoKGhhc0ltYWdlQXR0cmlidXRlcywgZnVuY3Rpb24gKGksIGF0dHJpYnV0ZSkge1xyXG5cdFx0XHRcdHZhciBhdHRyaWJ1dGVWYWx1ZSA9IGVsZW1lbnQuYXR0cihhdHRyaWJ1dGUpO1xyXG5cclxuXHRcdFx0XHRpZiAoIWF0dHJpYnV0ZVZhbHVlKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGFsbF9pbWFnZXMucHVzaCh7XHJcblx0XHRcdFx0XHRzcmM6IGVsZW1lbnQuYXR0cihcInNyY1wiKSxcclxuXHRcdFx0XHRcdHNyY3NldDogZWxlbWVudC5hdHRyKFwic3Jjc2V0XCIpLFxyXG5cdFx0XHRcdFx0ZWxlbWVudDogZWxlbWVudFswXVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdHRvdGFsID0gYWxsX2ltYWdlcy5sZW5ndGg7XHJcblxyXG5cdFx0aWYgKHRvdGFsID09PSAwKSB7XHJcblx0XHRcdGRvbmVfbG9hZGluZygpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cHJlbG9hZGVyX3N0YXQuY3NzKHtvcGFjaXR5OiAxfSk7XHJcblx0XHRcdGltYWdlc19sb29wKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZm9yKHZhciBpPTA7IGk8dG90YWw7IGkrKyl7XHJcblx0XHQvLyBcdHZhciB0ZXN0X2ltYWdlID0gbmV3IEltYWdlKCk7XHJcblxyXG5cclxuXHRcdC8vIFx0dGVzdF9pbWFnZS5vbmxvYWQgPSBpbWdfbG9hZGVkO1xyXG5cdFx0Ly8gXHR0ZXN0X2ltYWdlLm9uZXJyb3IgPSBpbWdfbG9hZGVkO1xyXG5cclxuXHRcdC8vIFx0aWYgKGFsbF9pbWFnZXNbaV0uc3Jjc2V0KSB7XHJcblx0XHQvLyBcdFx0dGVzdF9pbWFnZS5zcmNzZXQgPSBhbGxfaW1hZ2VzW2ldLnNyY3NldDtcclxuXHRcdC8vIFx0fVxyXG5cdFx0Ly8gXHR0ZXN0X2ltYWdlLnNyYyA9IGFsbF9pbWFnZXNbaV0uc3JjO1xyXG5cdFx0Ly8gfVxyXG5cdH1cclxuXHJcblx0cHJlbG9hZGVyKCk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBQYWdlIGNoYW5nZXJcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQkKGRvY3VtZW50KS5vbihcImNsaWNrXCIsIFwiYS5wcmVsb2FkLWxpbmtcIiwgZnVuY3Rpb24oZSkge1xyXG5cdFx0dmFyIGhyZWYgPSAkKHRoaXMpLmF0dHIoXCJocmVmXCIpO1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdHJldHVybiAkKFwiI3ByZWxvYWRlclwiKVxyXG5cdFx0XHQuZmFkZUluKDMwMCwgZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRyZXR1cm4gZG9jdW1lbnQubG9jYXRpb24gPSBocmVmICE9IG51bGwgPyBocmVmIDogXCIvXCI7XHJcblx0XHRcdH0pO1xyXG5cdH0pO1xyXG5cclxuXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBBbmltYXRpb25zXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0JC5mbi5hbmltYXRlZCA9IGZ1bmN0aW9uKGluRWZmZWN0KSB7XHJcblx0XHQkKHRoaXMpLmVhY2goZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciB0aHMgPSAkKHRoaXMpO1xyXG5cdFx0XHR0aHMuY3NzKHtvcGFjaXR5OjB9KVxyXG5cdFx0XHRcdC5hZGRDbGFzcyhcImFuaW1hdGVkXCIpXHJcblx0XHRcdFx0LndheXBvaW50KGZ1bmN0aW9uKGRpcikge1xyXG5cdFx0XHRcdFx0aWYgKGRpciA9PT0gXCJkb3duXCIpIHtcclxuXHRcdFx0XHRcdFx0dGhzLmFkZENsYXNzKGluRWZmZWN0KS5jc3Moe29wYWNpdHk6MX0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0b2Zmc2V0OiBcIjkwJVwiXHJcblx0XHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9O1xyXG5cclxuXHQkKFwiaGVhZGVyIC5zdmctaGVhZGluZywgLnRhbGtzIC5zdmctaGVhZGluZywgLnRhbGtzIC50ZXN0aW1vbmlhbFwiKS5hbmltYXRlZChcImZhZGVJblVwXCIpO1xyXG5cdCQoXCIuYWJvdXQtbWVfX3NraWxscz5kaXZcIikuYW5pbWF0ZWQoXCJmYWRlSW5VcFwiKTtcclxuXHQkKFwiLmFydGljbGUsIC5wb3J0Zm9saW8tc2xpZGVyX19uYXZpZ2F0aW9uLWNvbnRhaW5lciwgLnBvcnRmb2xpby1zbGlkZXJfX3ByZXZpZXctY29udGFpbmVyXCIpLmFuaW1hdGVkKFwiZmFkZUluXCIpO1xyXG5cdCQoXCIucG9ydGZvbGlvLXNsaWRlcl9fcHJvamVjdHMtY29udGFpbmVyXCIpLmFuaW1hdGVkKFwiZmFkZUluXCIpO1xyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gUGllY2hhcnRzIGFuaW1hdGlvblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdCQoXCIucGllY2hhcnQgLnBpZWNoYXJ0X19maWxsXCIpLmVhY2goZnVuY3Rpb24oKXtcclxuXHRcdHZhciBwaWUgPSAkKHRoaXMpO1xyXG5cdFx0cGllLndheXBvaW50KGZ1bmN0aW9uKGRpcikge1xyXG5cdFx0XHRpZiAoZGlyID09PSBcImRvd25cIikge1xyXG5cdFx0XHRcdHBpZS5jc3Moe3N0cm9rZURhc2hvZmZzZXQ6cGllLmRhdGEoXCJwZXJjZW50YWdlXCIpfSk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRvZmZzZXQ6IFwiOTAlXCJcclxuXHRcdFx0fSk7XHJcblx0fSk7XHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBQYXJhbGxheFxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdHZhciBpc190aGlzX2llID0gZGV0ZWN0X0lFKCk7XHJcblxyXG5cdC8vIElFIHNjcm9sbCBqdW1wIGZpeFxyXG5cdGlmKGlzX3RoaXNfaWUpIHtcclxuXHRcdCQoXCIubGF5ZXJcIikuY3NzKHt0cmFuc2l0aW9uOlwidG9wIC4xNXMgbGluZWFyXCJ9KTtcclxuXHRcdCQoXCIjc2NlbmUudmVydGljYWxcIikuY3NzKHt0cmFuc2l0aW9uOlwib3BhY2l0eSAuMTVzIGxpbmVhclwifSk7XHJcblxyXG5cdFx0JChcImJvZHlcIikub24oXCJtb3VzZXdoZWVsXCIsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTsgXHJcblxyXG5cdFx0XHR2YXIgd2hlZWxEZWx0YSA9IGV2ZW50LndoZWVsRGVsdGEsXHJcblx0XHRcdFx0Y3VycmVudFNjcm9sbFBvc2l0aW9uID0gd2luZG93LnBhZ2VZT2Zmc2V0O1xyXG5cclxuXHRcdFx0d2luZG93LnNjcm9sbFRvKDAsIGN1cnJlbnRTY3JvbGxQb3NpdGlvbiAtIHdoZWVsRGVsdGEpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRpZigkKFwiI3NjZW5lLmF4aXNcIikubGVuZ3RoKXtcclxuXHRcdCQoXCIjc2NlbmUuYXhpc1wiKS5wYXJhbGxheCh7XHJcblx0XHRcdHNjYWxhclg6IDMsXHJcblx0XHRcdHNjYWxhclk6IDMsXHJcblx0XHRcdGZyaWN0aW9uWDogMC41LFxyXG5cdFx0XHRmcmljdGlvblk6IDAuNVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRpZigkKFwiI3NjZW5lLnZlcnRpY2FsXCIpKXtcclxuXHRcdCQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBzY3JvbGxQb3MgPSAkKHRoaXMpLnNjcm9sbFRvcCgpO1xyXG5cclxuXHRcdFx0JChcIiNzY2VuZS52ZXJ0aWNhbCAubGF5ZXJcIikuZWFjaChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHZhciBsYXllciA9ICQodGhpcyk7XHJcblxyXG5cdFx0XHRcdGlmKGxheWVyLmluZGV4KCkgIT0wICkge1xyXG5cdFx0XHRcdFx0bGF5ZXIuY3NzKHtcclxuXHRcdFx0XHRcdFx0Ly8gXCJ0cmFuc2Zvcm1cIiA6IFwidHJhbnNsYXRlM2QoMCxcIiArICggKHNjcm9sbFBvcy8oNSArIDIqbGF5ZXIuaW5kZXgoKSkpICkgKyBcInB4LDApXCJcclxuXHRcdFx0XHRcdFx0XCJ0b3BcIiA6ICggKHNjcm9sbFBvcy8oNSArIDIqbGF5ZXIuaW5kZXgoKSkpICkgKyBcInB4XCJcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRcdCQoXCIjc2NlbmUudmVydGljYWxcIikuY3NzKHtcclxuXHRcdFx0XHRcIm9wYWNpdHlcIiA6IDEtKHNjcm9sbFBvcy83MjApXHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBMb2dpbiBjYXJkIGZsaXBcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQkKFwiLmxvZ2luLWJ1dHRvblwiKS5jbGljayhmdW5jdGlvbigpIHtcclxuXHRcdCQoXCJib2R5XCIpLmFkZENsYXNzKFwiY2FyZF9mbGlwcGVkXCIpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiI3VuZmxpcC1jYXJkXCIpLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG5cdFx0JChcImJvZHlcIikucmVtb3ZlQ2xhc3MoXCJjYXJkX2ZsaXBwZWRcIik7XHJcblx0fSk7XHJcblxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gTWFpbiBtZW51XHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0JChcIiNtZW51LXRvZ2dsZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0JCh0aGlzKS5hZGQoXCIubWFpbi1tZW51XCIpLnRvZ2dsZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiLm1haW4tbWVudV9faXRlbVwiKS5lYWNoKGZ1bmN0aW9uKGluZGV4KSB7XHJcblx0XHQkKHRoaXMpLmNzcyhcInRyYW5zaXRpb24tZGVsYXlcIiwgMC4zKzAuMSppbmRleCArIFwic1wiKTtcclxuXHR9KTtcclxuXHJcblxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gQnV0dG9uc1xyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdCQoXCJidXR0b24uZ28tZG93blwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0dmFyIGdvID0gJCh0aGlzKS5kYXRhKFwibGlua1wiKTtcclxuXHRcdCQoXCJodG1sLCBib2R5XCIpLnN0b3AoKS5hbmltYXRlKHtcclxuXHRcdFx0c2Nyb2xsVG9wOiAkKGdvKS5vZmZzZXQoKS50b3BcclxuXHRcdH0sIDcwMCwgXCJzd2luZ1wiKTtcclxuXHR9KTtcclxuXHJcblx0JChcImJ1dHRvbi5nby11cFwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0JChcImh0bWwsIGJvZHlcIikuc3RvcCgpLmFuaW1hdGUoe1xyXG5cdFx0XHRzY3JvbGxUb3A6IDBcclxuXHRcdH0sIDcwMCwgXCJzd2luZ1wiKTtcclxuXHR9KTtcclxuXHJcblx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3RvZ2dsZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0JChcIi5ibG9nLW5hdmlnYXRpb25cIikudG9nZ2xlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0fSk7XHJcblxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gU2xpZGVyXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0ZnVuY3Rpb24gcHJlcGFyZV90aXRsZSh0aXRsZV9jb250YWluZXIpe1xyXG5cdFx0dmFyIGxldHRlcnMgPSAkLnRyaW0odGl0bGVfY29udGFpbmVyLnRleHQoKSksXHJcblx0XHRcdG5ld190aXRsZSA9IFwiXCI7XHJcblxyXG5cdFx0dGl0bGVfY29udGFpbmVyLmh0bWwoXCJcIik7XHJcblxyXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IGxldHRlcnMubGVuZ3RoOyBpKyspe1xyXG5cdFx0XHR2YXIgdGV4dCA9IFwiPHNwYW4gY2xhc3M9J2xldHRlcic+XCIgKyBsZXR0ZXJzW2ldICsgXCI8L3NwYW4+XCI7XHJcblxyXG5cdFx0XHRpZihpPT0wKXtcclxuXHRcdFx0XHR0ZXh0ID0gXCI8c3BhbiBjbGFzcz0nd29yZCc+XCIgKyB0ZXh0O1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGxldHRlcnNbaV0gPT0gXCIgXCIgfHwgbGV0dGVyc1tpXSA9PSBcIiZuYnNwO1wiKXtcclxuXHRcdFx0XHR0ZXh0ID0gXCI8L3NwYW4+PHNwYW4gY2xhc3M9J2xldHRlcic+Jm5ic3A7PC9zcGFuPjxzcGFuIGNsYXNzPSd3b3JkJz5cIjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihpID09IGxldHRlcnMubGVuZ3RoLTEpIHtcclxuXHRcdFx0XHR0ZXh0ID0gdGV4dCArIFwiPC9zcGFuPlwiO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRuZXdfdGl0bGUgKz0gdGV4dDtcclxuXHRcdH1cclxuXHJcblx0XHR0aXRsZV9jb250YWluZXIuYXBwZW5kKG5ld190aXRsZSk7XHJcblx0fVxyXG5cclxuXHRpZigkKFwiLnBvcnRmb2xpby1zbGlkZXJcIikubGVuZ3RoKXtcclxuXHRcdCQoXCIucG9ydGZvbGlvLXByb2plY3RzIC5wcm9qZWN0X190aXRsZVwiKVxyXG5cdFx0LmFkZChcIi5wb3J0Zm9saW8tcHJvamVjdHMgLnByb2plY3RfX3RlY2hcIilcclxuXHRcdC5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRwcmVwYXJlX3RpdGxlKCQodGhpcykpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0JChcIi5wb3J0Zm9saW8tcHJvamVjdHMgLmFjdGl2ZSAucHJvamVjdF9fdGl0bGUgLmxldHRlclwiKVxyXG5cdFx0XHQuYWRkKFwiLnBvcnRmb2xpby1wcm9qZWN0cyAuYWN0aXZlIC5wcm9qZWN0X190ZWNoIC5sZXR0ZXJcIilcclxuXHRcdFx0LmFkZENsYXNzKFwic2hvd1wiKTtcclxuXHJcblxyXG5cclxuXHRcdCQoXCIucG9ydGZvbGlvLWJ1dHRvblwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgdGhpc19idXR0b24gPSAkKHRoaXMpLFxyXG5cdFx0XHRcdHRoaXNfdGh1bWJuYWlscyA9IHRoaXNfYnV0dG9uLm5leHQoKS5maW5kKFwiLnBvcnRmb2xpby10aHVtYm5haWxzX190aHVtYm5haWxcIiksXHJcblx0XHRcdFx0dGhpc19hY3RpdmVfdGh1bWIgPSB0aGlzX3RodW1ibmFpbHMuZmlsdGVyKFwiLmFjdGl2ZVwiKSxcclxuXHRcdFx0XHR0aGlzX25leHRfaW5kZXggPSB0aGlzX3RodW1ibmFpbHMuaW5kZXgodGhpc19hY3RpdmVfdGh1bWIpO1xyXG5cclxuXHRcdFx0dmFyIG90aGVyX2J1dHRvbiA9IHRoaXNfYnV0dG9uLnBhcmVudCgpLnNpYmxpbmdzKCkuZmluZChcIi5wb3J0Zm9saW8tYnV0dG9uXCIpLFxyXG5cdFx0XHRcdG90aGVyX3RodW1ibmFpbHMgPSBvdGhlcl9idXR0b24ubmV4dCgpLmZpbmQoXCIucG9ydGZvbGlvLXRodW1ibmFpbHNfX3RodW1ibmFpbFwiKSxcclxuXHRcdFx0XHRvdGhlcl9hY3RpdmVfdGh1bWIgPSBvdGhlcl90aHVtYm5haWxzLmZpbHRlcihcIi5hY3RpdmVcIiksXHJcblx0XHRcdFx0b3RoZXJfbmV4dF9pbmRleCA9IG90aGVyX3RodW1ibmFpbHMuaW5kZXgob3RoZXJfYWN0aXZlX3RodW1iKTtcclxuXHJcblx0XHRcdHZhciBwcmV2aWV3cyA9IHRoaXNfYnV0dG9uLmNsb3Nlc3QoXCIucG9ydGZvbGlvLXNsaWRlclwiKS5maW5kKFwiLnBvcnRmb2xpby1wcmV2aWV3XCIpLFxyXG5cdFx0XHRcdGFjdGl2ZV9wcmV2aWV3ID0gcHJldmlld3MuZmlsdGVyKFwiLmFjdGl2ZVwiKSxcclxuXHRcdFx0XHRuZXh0X3ByZXZpZXdfaW5kZXggPSBwcmV2aWV3cy5pbmRleChhY3RpdmVfcHJldmlldyksXHJcblx0XHRcdFx0Ly8gbmV4dF9wcmV2aWV3ID0gdGhpc19hY3RpdmVfdGh1bWIuZmluZChcImltZ1wiKS5hdHRyKFwic3JjXCIpLFxyXG5cdFx0XHRcdHByb2plY3RzID0gdGhpc19idXR0b24uY2xvc2VzdChcIi5wb3J0Zm9saW8tc2xpZGVyXCIpLmZpbmQoXCIucG9ydGZvbGlvLXByb2plY3RzIC5wcm9qZWN0XCIpLFxyXG5cdFx0XHRcdGFjdGl2ZV9wcm9qZWN0ID0gcHJvamVjdHMuZmlsdGVyKFwiLmFjdGl2ZVwiKSxcclxuXHRcdFx0XHRuZXh0X3Byb2plY3RfaW5kZXggPSBwcm9qZWN0cy5pbmRleChhY3RpdmVfcHJvamVjdCk7XHJcblxyXG5cclxuXHJcblx0XHRcdGlmKHRoaXNfYnV0dG9uLmhhc0NsYXNzKFwicG9ydGZvbGlvLWJ1dHRvbl9uZXh0XCIpKSB7XHJcblx0XHRcdFx0bmV4dF9wcm9qZWN0X2luZGV4ID0gKG5leHRfcHJvamVjdF9pbmRleCA+PSBwcm9qZWN0cy5sZW5ndGgtMSkgPyAwIDogbmV4dF9wcm9qZWN0X2luZGV4KzE7XHJcblx0XHRcdFx0dGhpc19uZXh0X2luZGV4ID0gdGhpc19uZXh0X2luZGV4ID49IHRoaXNfdGh1bWJuYWlscy5sZW5ndGgtMSA/IDAgOiB0aGlzX25leHRfaW5kZXgrMTtcclxuXHRcdFx0XHRvdGhlcl9uZXh0X2luZGV4ID0gKG90aGVyX25leHRfaW5kZXggPj0gb3RoZXJfdGh1bWJuYWlscy5sZW5ndGgtMSkgPyAwIDogb3RoZXJfbmV4dF9pbmRleCsxO1xyXG5cclxuXHRcdFx0XHRuZXh0X3ByZXZpZXdfaW5kZXggPSAobmV4dF9wcmV2aWV3X2luZGV4ID49IHByZXZpZXdzLmxlbmd0aC0xKSA/IDAgOiBuZXh0X3ByZXZpZXdfaW5kZXgrMTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRuZXh0X3Byb2plY3RfaW5kZXgtLTtcclxuXHRcdFx0XHR0aGlzX25leHRfaW5kZXgtLTtcclxuXHRcdFx0XHRvdGhlcl9uZXh0X2luZGV4LS07XHJcblxyXG5cdFx0XHRcdG5leHRfcHJldmlld19pbmRleC0tO1xyXG5cdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0dmFyIHRoaXNfbmV4dF90aHVtYiA9IHRoaXNfdGh1bWJuYWlscy5lcSh0aGlzX25leHRfaW5kZXgpLFxyXG5cdFx0XHRcdG90aGVyX25leHRfdGh1bWIgPSBvdGhlcl90aHVtYm5haWxzLmVxKG90aGVyX25leHRfaW5kZXgpLFxyXG5cdFx0XHRcdG5leHRfcHJvamVjdCA9IHByb2plY3RzLmVxKG5leHRfcHJvamVjdF9pbmRleCksXHJcblx0XHRcdFx0bmV4dF9wcmV2aWV3ID0gcHJldmlld3MuZXEobmV4dF9wcmV2aWV3X2luZGV4KSxcclxuXHRcdFx0XHR0aXRsZV9sZXR0ZXJzID0gbmV4dF9wcm9qZWN0LmZpbmQoXCIucHJvamVjdF9fdGl0bGUgc3Bhbi5sZXR0ZXJcIiksXHJcblx0XHRcdFx0dGVjaF9sZXR0ZXJzID0gbmV4dF9wcm9qZWN0LmZpbmQoXCIucHJvamVjdF9fdGVjaCBzcGFuLmxldHRlclwiKTtcclxuXHJcblx0XHRcdGZ1bmN0aW9uIGxvY2tfYnV0dG9ucygpe1xyXG5cdFx0XHRcdHRoaXNfYnV0dG9uLnByb3AoXCJkaXNhYmxlZFwiLCB0cnVlKTtcclxuXHRcdFx0XHRvdGhlcl9idXR0b24ucHJvcChcImRpc2FibGVkXCIsIHRydWUpO1xyXG5cclxuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHR0aGlzX2J1dHRvbi5wcm9wKFwiZGlzYWJsZWRcIiwgZmFsc2UpO1xyXG5cdFx0XHRcdFx0b3RoZXJfYnV0dG9uLnByb3AoXCJkaXNhYmxlZFwiLCBmYWxzZSk7XHJcblx0XHRcdFx0fSwgNjAwKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZnVuY3Rpb24gY2hhbmdlX3RodW1icygpe1xyXG5cdFx0XHRcdHRoaXNfbmV4dF90aHVtYi5yZW1vdmVDbGFzcyhcIm1vdmUtZG93blwiKS5hZGRDbGFzcyhcImFjdGl2ZSBtb3ZlLXVwXCIpO1xyXG5cdFx0XHRcdHRoaXNfYWN0aXZlX3RodW1iLnJlbW92ZUNsYXNzKFwiYWN0aXZlIG1vdmUtZG93blwiKS5hZGRDbGFzcyhcIm1vdmUtdXBcIik7XHJcblxyXG5cdFx0XHRcdG90aGVyX25leHRfdGh1bWIucmVtb3ZlQ2xhc3MoXCJtb3ZlLXVwXCIpLmFkZENsYXNzKFwiYWN0aXZlIG1vdmUtZG93blwiKTtcclxuXHRcdFx0XHRvdGhlcl9hY3RpdmVfdGh1bWIucmVtb3ZlQ2xhc3MoXCJhY3RpdmUgbW92ZS11cFwiKS5hZGRDbGFzcyhcIm1vdmUtZG93blwiKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZnVuY3Rpb24gY2hhbmdlX3ByZXZpZXcoKXtcclxuXHRcdFx0XHQvLyBhY3RpdmVfcHJldmlldy5mYWRlVG8oMzAwLCAwLCBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdC8vIFx0JCh0aGlzKS5hdHRyKFwic3JjXCIsIG5leHRfcHJldmlldykuZmFkZVRvKDMwMCwgMSk7XHJcblx0XHRcdFx0Ly8gfSk7XHJcblx0XHRcdFx0Ly8gYWN0aXZlX3ByZXZpZXcuYXR0cihcInNyY1wiLCBuZXh0X3ByZXZpZXcpXHJcblxyXG5cdFx0XHRcdGFjdGl2ZV9wcmV2aWV3LnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHRcdG5leHRfcHJldmlldy5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZnVuY3Rpb24gc2hvd19sZXR0ZXJzKGxldHRlcnMpe1xyXG5cdFx0XHRcdHZhciBpID0gMDtcclxuXHRcdFx0XHR2YXIgbG9vcCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHRsZXR0ZXJzLmVxKGkrKykuYWRkQ2xhc3MoXCJzaG93XCIpO1xyXG5cdFx0XHRcdFx0aWYoaSA+PSBsZXR0ZXJzLmxlbmd0aCkgY2xlYXJJbnRlcnZhbChsb29wKTtcclxuXHRcdFx0XHR9LDEwKTtcclxuXHRcdFx0XHQvLyB9LDMwMC9sZXR0ZXJzLmxlbmd0aCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZ1bmN0aW9uIGNoYW5nZV9wcm9qZWN0KCl7XHJcblx0XHRcdFx0YWN0aXZlX3Byb2plY3RcclxuXHRcdFx0XHRcdC5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKVxyXG5cdFx0XHRcdFx0LmZpbmQoXCJzcGFuLmxldHRlciwgc3Bhbi5sZXR0ZXJcIilcclxuXHRcdFx0XHRcdC5yZW1vdmVDbGFzcyhcInNob3dcIik7XHJcblx0XHRcdFx0bmV4dF9wcm9qZWN0LmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG5cclxuXHRcdFx0XHRzaG93X2xldHRlcnModGl0bGVfbGV0dGVycyk7XHJcblx0XHRcdFx0c2hvd19sZXR0ZXJzKHRlY2hfbGV0dGVycyk7XHJcblxyXG5cdFx0XHRcdC8vIHRpdGxlX2xldHRlcnMuZWFjaChmdW5jdGlvbihpbmRleCl7XHJcblx0XHRcdFx0Ly8gXHQkKHRoaXMpXHJcblx0XHRcdFx0Ly8gXHRcdC5jc3Moe1wiYW5pbWF0aW9uLWRlbGF5XCI6ICgwLjYvdGl0bGVfbGV0dGVycy5sZW5ndGgpKihpbmRleCsxKSArIFwic1wifSlcclxuXHRcdFx0XHQvLyBcdFx0LmFkZENsYXNzKFwic2hvd1wiKTtcclxuXHRcdFx0XHQvLyB9KTtcclxuXHJcblx0XHRcdFx0Ly8gdGVjaF9sZXR0ZXJzLmVhY2goZnVuY3Rpb24oaW5kZXgpe1xyXG5cdFx0XHRcdC8vIFx0JCh0aGlzKVxyXG5cdFx0XHRcdC8vIFx0XHQuY3NzKHtcImFuaW1hdGlvbi1kZWxheVwiOiAoMC42L3RlY2hfbGV0dGVycy5sZW5ndGgpKihpbmRleCsxKSArIFwic1wifSlcclxuXHRcdFx0XHQvLyBcdFx0LmFkZENsYXNzKFwic2hvd1wiKTtcclxuXHRcdFx0XHQvLyB9KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bG9ja19idXR0b25zKCk7XHJcblx0XHRcdGNoYW5nZV9wcmV2aWV3KCk7XHJcblx0XHRcdGNoYW5nZV9wcm9qZWN0KCk7XHJcblx0XHRcdGNoYW5nZV90aHVtYnMoKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBCTE9HIFNDUk9MTCBFVkVOVFNcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRpZigkKFwiLmJsb2ctbmF2aWdhdGlvblwiKS5sZW5ndGgpe1xyXG5cdFx0dmFyIGxhc3RJZCxcclxuXHRcdFx0bWVudSA9ICQoXCIuYmxvZy1uYXZpZ2F0aW9uXCIpLFxyXG5cdFx0XHRtZW51SXRlbXMgPSBtZW51LmZpbmQoXCJsaSBhXCIpLFxyXG5cdFx0XHRzY3JvbGxJdGVtcyA9IG1lbnVJdGVtcy5tYXAoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHR2YXIgaXRlbSA9ICQoJCh0aGlzKS5hdHRyKFwiaHJlZlwiKSk7XHJcblx0XHRcdFx0aWYgKGl0ZW0ubGVuZ3RoKSByZXR1cm4gaXRlbTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0bWVudUl0ZW1zLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHR2YXIgaHJlZiA9ICQodGhpcykuYXR0cihcImhyZWZcIiksXHJcblx0XHRcdFx0b2Zmc2V0VG9wID0gKGhyZWYgPT09IFwiI1wiKSA/IDAgOiAkKGhyZWYpLm9mZnNldCgpLnRvcC02MDtcclxuXHRcdFx0XHJcblx0XHRcdCQoXCJodG1sLCBib2R5XCIpLnN0b3AoKS5hbmltYXRlKHsgXHJcblx0XHRcdFx0c2Nyb2xsVG9wOiBvZmZzZXRUb3BcclxuXHRcdFx0fSwgNzAwLCBcInN3aW5nXCIpO1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHQkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgZnJvbVRvcCA9ICQodGhpcykuc2Nyb2xsVG9wKCksXHJcblx0XHRcdFx0YmxvZ05hdk9mZnNldCA9ICQoXCIuYmxvZy1uYXZpZ2F0aW9uXCIpLm9mZnNldCgpLnRvcCxcclxuXHRcdFx0XHRibG9nTmF2TGltaXQgPSAkKFwiLmZvb3Rlcl9fd3JhcHBlclwiKS5vZmZzZXQoKS50b3AgLSAkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5vdXRlckhlaWdodCgpLFxyXG5cdFx0XHRcdGN1cnJlbnQgPSBzY3JvbGxJdGVtcy5tYXAoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdGlmICgkKHRoaXMpLm9mZnNldCgpLnRvcCA8IGZyb21Ub3ArMTQ0KVxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdGN1cnJlbnQgPSBjdXJyZW50W2N1cnJlbnQubGVuZ3RoLTFdO1xyXG5cdFx0XHR2YXIgaWQgPSBjdXJyZW50ICYmIGN1cnJlbnQubGVuZ3RoID8gY3VycmVudFswXS5pZCA6IFwiXCI7XHJcblxyXG5cdFx0XHRpZiAobGFzdElkICE9PSBpZCkge1xyXG5cdFx0XHRcdGxhc3RJZCA9IGlkO1xyXG5cdFx0XHRcdG1lbnVJdGVtcy5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKS5maWx0ZXIoXCJbaHJlZj0jXCIraWQrXCJdXCIpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZihmcm9tVG9wID49IGJsb2dOYXZMaW1pdCAmJiAkKHdpbmRvdykud2lkdGgoKSA+ICg3NjggLSBzY3JvbGxCYXJXaWR0aCkpIHtcclxuXHRcdFx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5jc3Moe1wicG9zaXRpb25cIjpcImFic29sdXRlXCIsIFwidG9wXCI6YmxvZ05hdkxpbWl0ICsgXCJweFwifSk7XHJcblx0XHRcdH0gZWxzZSBpZiAoZnJvbVRvcCA+PSBibG9nTmF2T2Zmc2V0ICYmICQod2luZG93KS53aWR0aCgpID4gKDc2OCAtIHNjcm9sbEJhcldpZHRoKSkge1xyXG5cdFx0XHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uX193cmFwcGVyXCIpLmNzcyh7XCJwb3NpdGlvblwiOlwiZml4ZWRcIiwgXCJ0b3BcIjowfSk7XHJcblx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikuYWRkQ2xhc3MoXCJuYXYtZml4ZWRcIik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikuY3NzKHtcInBvc2l0aW9uXCI6XCJyZWxhdGl2ZVwifSk7XHJcblx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikucmVtb3ZlQ2xhc3MoXCJuYXYtZml4ZWRcIik7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9KTtcclxuXHJcblx0XHQkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpZigkKHdpbmRvdykud2lkdGgoKSA8PSAoNzY4IC0gc2Nyb2xsQmFyV2lkdGgpKXtcclxuXHRcdFx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5yZW1vdmVDbGFzcyhcIm5hdi1maXhlZFwiKTtcclxuXHRcdFx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5jc3Moe1wicG9zaXRpb25cIjpcInJlbGF0aXZlXCJ9KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpZigkKFwiYm9keVwiKS5zY3JvbGxUb3AoKSA+PSAkKFwiLmJsb2dcIikub2Zmc2V0KCkudG9wKXtcclxuXHRcdFx0XHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uX193cmFwcGVyXCIpLmNzcyh7XCJwb3NpdGlvblwiOlwiZml4ZWRcIiwgXCJ0b3BcIjowfSk7XHJcblx0XHRcdFx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5hZGRDbGFzcyhcIm5hdi1maXhlZFwiKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBSRVNJWkUgRVZFTlRTXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0aWYoJChcIi50YWxrc1wiKS5sZW5ndGgpe1xyXG5cdFx0JCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbigpIHtcclxuXHRcdFx0Ly8gVGVzdGltb25pYWxzIHNlY3Rpb24gYmcgc2l6ZVxyXG5cdFx0XHRpZiggJCh3aW5kb3cpLndpZHRoKCk+MjAwMCAtIHNjcm9sbEJhcldpZHRoKXtcclxuXHRcdFx0XHQkKFwiLnRhbGtzLCAuY29udGFjdC1mb3JtX19iZ1wiKS5jc3MoXCJiYWNrZ3JvdW5kLXNpemVcIiwgJCh3aW5kb3cpLndpZHRoKCkgKyBcInB4XCIpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBCbHVyIGJ1ZyBleGFtcGxlXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0ZnVuY3Rpb24gc2V0X2JnKCl7XHJcblx0XHRpZigkKFwiLmJsdXJfZXhhbXBsZV9wYWdlXCIpLmxlbmd0aCl7XHJcblx0XHRcdHZhciBmb3JtID0gJChcIi5ibHVyX2V4YW1wbGVfcGFnZSAudGFsa3MgLmNvbnRhY3QtZm9ybVwiKSxcclxuXHRcdFx0XHRmb3JtX2JnID0gZm9ybS5maW5kKFwiLmNvbnRhY3QtZm9ybV9fYmdcIiksXHJcblx0XHRcdFx0dGFsa3NfdG9wID0gJChcIi5ibHVyX2V4YW1wbGVfcGFnZSAudGFsa3NcIikub2Zmc2V0KCkudG9wLFxyXG5cdFx0XHRcdGZvcm1fYmdfdG9wID0gZm9ybV9iZy5vZmZzZXQoKS50b3AsXHJcblx0XHRcdFx0Ymdfb2Zmc2V0ID0gdGFsa3NfdG9wIC0gZm9ybV9iZ190b3A7XHJcblxyXG5cdFx0XHRmb3JtX2JnLmNzcyh7XHJcblx0XHRcdFx0XCJiYWNrZ3JvdW5kLXBvc2l0aW9uXCIgOiBcImNlbnRlciBcIiArIGJnX29mZnNldCArIFwicHhcIlxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdCQod2luZG93KS5sb2FkKGZ1bmN0aW9uKCkge1xyXG5cdFx0c2V0X2JnKCk7XHJcblx0fSk7XHJcblxyXG5cdCQod2luZG93KS5yZXNpemUoZnVuY3Rpb24oKSB7XHJcblx0XHRzZXRfYmcoKTtcclxuXHR9KTtcclxuXHJcbn0pKGpRdWVyeSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
