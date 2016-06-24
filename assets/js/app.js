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

	if(!$(".blur_example_page").length){
		preloader();
	}





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
						"top" : ( (scrollPos/(5 + 2*layer.index())) )+"px"
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
		$(".portfolio-projects .project__title").each(function() {
			prepare_title($(this));
		});

		$(".portfolio-projects .project").not(".active").css({display:"none"});
		$(".portfolio-projects .active .project__title .letter").addClass("show");
	}


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
			next_project_index++;
			this_next_index++;
			other_next_index++;
		} else {
			next_project_index--;
			this_next_index--;
			other_next_index--;
		}

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
			next_project = projects.eq(next_project_index),
			next_project_title = next_project.find(".project__title");


		this_button.prop("disabled", true);
		other_button.prop("disabled", true);

		function change_this_thumb(){
			this_active_thumb.animate({
				top: "-100%"
			}, 700);

			this_next_thumb.css({top:"100%"});
			this_next_thumb.animate({
				top: 0
			}, 700, function() {
				this_active_thumb.removeClass("active").css({top:"100%"});
				$(this).addClass("active");
				this_button.prop("disabled", false);
			});
		}

		function change_other_thumb(){
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
		}

		function change_preview(){
			active_preview.fadeOut(350, function(){
				$(this).attr("src", next_preview).fadeIn(350);
			});
		}


		function change_project(){
			var prj_letters = next_project_title.find("span.letter").removeClass("show");

			active_project.fadeOut(350, function(){
				$(this).removeClass("active");
				next_project.addClass("active").fadeIn(350);

				prj_letters.each(function(index){
					$(this).css({"transition-delay": (0.35/prj_letters.length)*(index+1) + "s"})
							.addClass("show");
				});


			});
		}


		change_this_thumb();
		change_other_thumb();
		change_preview();
		change_project();
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
	// Blur bug example
	// ==============================
	function set_bg(){
		if($(".blur_example_page").length){
			var form = $(".blur_example_page .talks .contact-form"),
				form_bg = form.find(".contact-form__bg"),
				talks_top = $(".blur_example_page .talks").offset().top,
				form_bg_top = form_bg.offset().top,
				bg_offset = talks_top - form_bg_top;

			// console.log("Bg top: " + form_bg_top, "Box top: " + talks_top);
			form_bg.css({
				"background-position" : "center " + bg_offset + "px"
			});
		}
	}

	$(window).ready(function() {
		set_bg();
	});

	$(window).resize(function() {
		set_bg();
	});

})(jQuery);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigkKSB7XHJcblx0XCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIENoZWNrIHNjcm9sbGJhciB3aWR0aFxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdHZhciB3aWR0aENvbnRlbnRBID0gJChcIiNzY3JvbGxfYmFyX2NoZWNrX0FcIikud2lkdGgoKSxcclxuXHRcdHdpZHRoQ29udGVudEIgPSAkKFwiI3Njcm9sbF9iYXJfY2hlY2tfQlwiKS53aWR0aCgpO1xyXG5cclxuXHR2YXIgc2Nyb2xsQmFyV2lkdGggPSB3aWR0aENvbnRlbnRBIC0gd2lkdGhDb250ZW50QjtcclxuXHJcblx0JChcIiNzY3JvbGxfYmFyX2NoZWNrX0FcIikuY3NzKFwiZGlzcGxheVwiLFwibm9uZVwiKTtcclxuXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBDaGVjayBJRSB2ZXJzaW9uXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0ZnVuY3Rpb24gZGV0ZWN0X0lFKCkge1xyXG5cdFx0dmFyIHVhID0gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQ7XHJcblxyXG5cdFx0dmFyIG1zaWUgPSB1YS5pbmRleE9mKFwiTVNJRSBcIik7XHJcblx0XHRpZiAobXNpZSA+IDApIHtcclxuXHRcdFx0Ly8gSUUgMTAgb3Igb2xkZXIgPT4gcmV0dXJuIHZlcnNpb24gbnVtYmVyXHJcblx0XHRcdHJldHVybiBwYXJzZUludCh1YS5zdWJzdHJpbmcobXNpZSArIDUsIHVhLmluZGV4T2YoXCIuXCIsIG1zaWUpKSwgMTApO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciB0cmlkZW50ID0gdWEuaW5kZXhPZihcIlRyaWRlbnQvXCIpO1xyXG5cdFx0aWYgKHRyaWRlbnQgPiAwKSB7XHJcblx0XHRcdC8vIElFIDExID0+IHJldHVybiB2ZXJzaW9uIG51bWJlclxyXG5cdFx0XHR2YXIgcnYgPSB1YS5pbmRleE9mKFwicnY6XCIpO1xyXG5cdFx0XHRyZXR1cm4gcGFyc2VJbnQodWEuc3Vic3RyaW5nKHJ2ICsgMywgdWEuaW5kZXhPZihcIi5cIiwgcnYpKSwgMTApO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBlZGdlID0gdWEuaW5kZXhPZihcIkVkZ2UvXCIpO1xyXG5cdFx0aWYgKGVkZ2UgPiAwKSB7XHJcblx0XHRcdC8vIEVkZ2UgKElFIDEyKykgPT4gcmV0dXJuIHZlcnNpb24gbnVtYmVyXHJcblx0XHRcdHJldHVybiBwYXJzZUludCh1YS5zdWJzdHJpbmcoZWRnZSArIDUsIHVhLmluZGV4T2YoXCIuXCIsIGVkZ2UpKSwgMTApO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIG90aGVyIGJyb3dzZXJcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gUHJlbG9hZGVyIHdpdGggcGVyY2VudGFnZSBieSBpbWFnZSBjb3VudFxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIHByZWxvYWRlcigpIHtcclxuXHRcdHZhciBwcmVsb2FkZXJfc3RhdCA9ICQoXCIjcHJlbG9hZGVyLXN2Z19fcGVyY2VudGFnZVwiKSxcclxuXHRcdFx0aGFzSW1hZ2VQcm9wZXJ0aWVzID0gW1wiYmFja2dyb3VuZFwiLCBcImJhY2tncm91bmRJbWFnZVwiLCBcImxpc3RTdHlsZUltYWdlXCIsIFwiYm9yZGVySW1hZ2VcIiwgXCJib3JkZXJDb3JuZXJJbWFnZVwiLCBcImN1cnNvclwiXSxcclxuXHRcdFx0aGFzSW1hZ2VBdHRyaWJ1dGVzID0gW1wic3Jjc2V0XCJdLFxyXG5cdFx0XHRtYXRjaF91cmwgPSAvdXJsXFwoXFxzKihbJ1wiXT8pKC4qPylcXDFcXHMqXFwpL2csXHJcblx0XHRcdGFsbF9pbWFnZXMgPSBbXSxcclxuXHRcdFx0dG90YWwgPSAwLFxyXG5cdFx0XHRjb3VudCA9IDA7XHJcblxyXG5cdFx0dmFyIGNpcmNsZV9vID0gJChcIiNwcmVsb2FkZXItc3ZnX19pbWcgLmJhcl9fb3V0ZXJcIiksXHJcblx0XHRcdGNpcmNsZV9jID0gJChcIiNwcmVsb2FkZXItc3ZnX19pbWcgLmJhcl9fY2VudGVyXCIpLFxyXG5cdFx0XHRjaXJjbGVfaSA9ICQoXCIjcHJlbG9hZGVyLXN2Z19faW1nIC5iYXJfX2lubmVyXCIpLFxyXG5cdFx0XHRsZW5ndGhfbyA9IE1hdGguUEkqKGNpcmNsZV9vLmF0dHIoXCJyXCIpICogMiksXHJcblx0XHRcdGxlbmd0aF9jID0gTWF0aC5QSSooY2lyY2xlX2MuYXR0cihcInJcIikgKiAyKSxcclxuXHRcdFx0bGVuZ3RoX2kgPSBNYXRoLlBJKihjaXJjbGVfaS5hdHRyKFwiclwiKSAqIDIpO1xyXG5cclxuXHJcblx0XHRmdW5jdGlvbiBpbWdfbG9hZGVkKCl7XHJcblx0XHRcdHZhciBwZXJjZW50YWdlID0gTWF0aC5jZWlsKCArK2NvdW50IC8gdG90YWwgKiAxMDAgKTtcclxuXHJcblx0XHRcdHBlcmNlbnRhZ2UgPSBwZXJjZW50YWdlID4gMTAwID8gMTAwIDogcGVyY2VudGFnZTtcclxuXHJcblx0XHRcdC8vIERyYXcgb2Zmc2V0c1xyXG5cdFx0XHRjaXJjbGVfby5jc3Moe3N0cm9rZURhc2hvZmZzZXQ6ICgoMTAwLXBlcmNlbnRhZ2UpLzEwMCkqbGVuZ3RoX28gfSk7XHJcblxyXG5cdFx0XHRpZihwZXJjZW50YWdlID4gNTApIHtcclxuXHRcdFx0XHRjaXJjbGVfYy5jc3Moe3N0cm9rZURhc2hvZmZzZXQ6ICgoMTAwLXBlcmNlbnRhZ2UpLzEwMCkqbGVuZ3RoX2MgfSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKHBlcmNlbnRhZ2UgPT0gMTAwKSB7XHJcblx0XHRcdFx0Y2lyY2xlX2kuY3NzKHtzdHJva2VEYXNob2Zmc2V0OiAoKDEwMC1wZXJjZW50YWdlKS8xMDApKmxlbmd0aF9pIH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRwcmVsb2FkZXJfc3RhdC5odG1sKHBlcmNlbnRhZ2UpO1xyXG5cclxuXHRcdFx0aWYoY291bnQgPT09IHRvdGFsKSByZXR1cm4gZG9uZV9sb2FkaW5nKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gZG9uZV9sb2FkaW5nKCl7XHJcblx0XHRcdCQoXCIjcHJlbG9hZGVyXCIpLmRlbGF5KDcwMCkuZmFkZU91dCg3MDAsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0JChcIiNwcmVsb2FkZXJfX3Byb2dyZXNzXCIpLnJlbW92ZSgpO1xyXG5cclxuXHRcdFx0XHRpZigkKFwiLmZsaXAtY2FyZFwiKS5sZW5ndGgpe1xyXG5cdFx0XHRcdFx0JChcIi5mbGlwLWNhcmRcIikuYWRkQ2xhc3MoXCJsb2FkZWRcIik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBpbWFnZXNfbG9vcCAoKSB7XHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHZhciB0ZXN0X2ltYWdlID0gbmV3IEltYWdlKCk7XHJcblxyXG5cdFx0XHRcdHRlc3RfaW1hZ2Uub25sb2FkID0gaW1nX2xvYWRlZDtcclxuXHRcdFx0XHR0ZXN0X2ltYWdlLm9uZXJyb3IgPSBpbWdfbG9hZGVkO1xyXG5cclxuXHRcdFx0XHQvLyBjb25zb2xlLmxvZyhcIkM6IFwiICsgY291bnQsIFwiIFQ6IFwiICsgdG90YWwpO1xyXG5cclxuXHRcdFx0XHRpZiAoY291bnQgIT0gdG90YWwpIHtcclxuXHRcdFx0XHRcdGlmIChhbGxfaW1hZ2VzW2NvdW50XS5zcmNzZXQpIHtcclxuXHRcdFx0XHRcdFx0dGVzdF9pbWFnZS5zcmNzZXQgPSBhbGxfaW1hZ2VzW2NvdW50XS5zcmNzZXQ7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR0ZXN0X2ltYWdlLnNyYyA9IGFsbF9pbWFnZXNbY291bnRdLnNyYztcclxuXHJcblx0XHRcdFx0XHRpbWFnZXNfbG9vcCgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSwgNTApO1xyXG5cdFx0fVxyXG5cclxuXHRcdCQoXCIqXCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG5cdFx0XHR2YXIgZWxlbWVudCA9ICQodGhpcyk7XHJcblxyXG5cdFx0XHRpZiAoZWxlbWVudC5pcyhcImltZ1wiKSAmJiBlbGVtZW50LmF0dHIoXCJzcmNcIikpIHtcclxuXHRcdFx0XHRhbGxfaW1hZ2VzLnB1c2goe1xyXG5cdFx0XHRcdFx0c3JjOiBlbGVtZW50LmF0dHIoXCJzcmNcIiksXHJcblx0XHRcdFx0XHRlbGVtZW50OiBlbGVtZW50WzBdXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdCQuZWFjaChoYXNJbWFnZVByb3BlcnRpZXMsIGZ1bmN0aW9uIChpLCBwcm9wZXJ0eSkge1xyXG5cdFx0XHRcdHZhciBwcm9wZXJ0eVZhbHVlID0gZWxlbWVudC5jc3MocHJvcGVydHkpO1xyXG5cdFx0XHRcdHZhciBtYXRjaDtcclxuXHJcblx0XHRcdFx0aWYgKCFwcm9wZXJ0eVZhbHVlKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdG1hdGNoID0gbWF0Y2hfdXJsLmV4ZWMocHJvcGVydHlWYWx1ZSk7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYgKG1hdGNoKSB7XHJcblx0XHRcdFx0XHRhbGxfaW1hZ2VzLnB1c2goe1xyXG5cdFx0XHRcdFx0XHRzcmM6IG1hdGNoWzJdLFxyXG5cdFx0XHRcdFx0XHRlbGVtZW50OiBlbGVtZW50WzBdXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0JC5lYWNoKGhhc0ltYWdlQXR0cmlidXRlcywgZnVuY3Rpb24gKGksIGF0dHJpYnV0ZSkge1xyXG5cdFx0XHRcdHZhciBhdHRyaWJ1dGVWYWx1ZSA9IGVsZW1lbnQuYXR0cihhdHRyaWJ1dGUpO1xyXG5cclxuXHRcdFx0XHRpZiAoIWF0dHJpYnV0ZVZhbHVlKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGFsbF9pbWFnZXMucHVzaCh7XHJcblx0XHRcdFx0XHRzcmM6IGVsZW1lbnQuYXR0cihcInNyY1wiKSxcclxuXHRcdFx0XHRcdHNyY3NldDogZWxlbWVudC5hdHRyKFwic3Jjc2V0XCIpLFxyXG5cdFx0XHRcdFx0ZWxlbWVudDogZWxlbWVudFswXVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdHRvdGFsID0gYWxsX2ltYWdlcy5sZW5ndGg7XHJcblxyXG5cdFx0aWYgKHRvdGFsID09PSAwKSB7XHJcblx0XHRcdGRvbmVfbG9hZGluZygpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cHJlbG9hZGVyX3N0YXQuY3NzKHtvcGFjaXR5OiAxfSk7XHJcblx0XHRcdGltYWdlc19sb29wKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZm9yKHZhciBpPTA7IGk8dG90YWw7IGkrKyl7XHJcblx0XHQvLyBcdHZhciB0ZXN0X2ltYWdlID0gbmV3IEltYWdlKCk7XHJcblxyXG5cclxuXHRcdC8vIFx0dGVzdF9pbWFnZS5vbmxvYWQgPSBpbWdfbG9hZGVkO1xyXG5cdFx0Ly8gXHR0ZXN0X2ltYWdlLm9uZXJyb3IgPSBpbWdfbG9hZGVkO1xyXG5cclxuXHRcdC8vIFx0aWYgKGFsbF9pbWFnZXNbaV0uc3Jjc2V0KSB7XHJcblx0XHQvLyBcdFx0dGVzdF9pbWFnZS5zcmNzZXQgPSBhbGxfaW1hZ2VzW2ldLnNyY3NldDtcclxuXHRcdC8vIFx0fVxyXG5cdFx0Ly8gXHR0ZXN0X2ltYWdlLnNyYyA9IGFsbF9pbWFnZXNbaV0uc3JjO1xyXG5cdFx0Ly8gfVxyXG5cdH1cclxuXHJcblx0aWYoISQoXCIuYmx1cl9leGFtcGxlX3BhZ2VcIikubGVuZ3RoKXtcclxuXHRcdHByZWxvYWRlcigpO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFBhZ2UgY2hhbmdlclxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdCQoZG9jdW1lbnQpLm9uKFwiY2xpY2tcIiwgXCJhLnByZWxvYWQtbGlua1wiLCBmdW5jdGlvbihlKSB7XHJcblx0XHR2YXIgaHJlZiA9ICQodGhpcykuYXR0cihcImhyZWZcIik7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0cmV0dXJuICQoXCIjcHJlbG9hZGVyXCIpXHJcblx0XHRcdC5mYWRlSW4oMzAwLCBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHJldHVybiBkb2N1bWVudC5sb2NhdGlvbiA9IGhyZWYgIT0gbnVsbCA/IGhyZWYgOiBcIi9cIjtcclxuXHRcdFx0fSk7XHJcblx0fSk7XHJcblxyXG5cclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIEFuaW1hdGlvbnNcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQkLmZuLmFuaW1hdGVkID0gZnVuY3Rpb24oaW5FZmZlY3QpIHtcclxuXHRcdCQodGhpcykuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHRocyA9ICQodGhpcyk7XHJcblx0XHRcdHRocy5jc3Moe29wYWNpdHk6MH0pXHJcblx0XHRcdFx0LmFkZENsYXNzKFwiYW5pbWF0ZWRcIilcclxuXHRcdFx0XHQud2F5cG9pbnQoZnVuY3Rpb24oZGlyKSB7XHJcblx0XHRcdFx0XHRpZiAoZGlyID09PSBcImRvd25cIikge1xyXG5cdFx0XHRcdFx0XHR0aHMuYWRkQ2xhc3MoaW5FZmZlY3QpLmNzcyh7b3BhY2l0eToxfSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRvZmZzZXQ6IFwiOTAlXCJcclxuXHRcdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH07XHJcblxyXG5cdCQoXCJoZWFkZXIgLnN2Zy1oZWFkaW5nLCAudGFsa3MgLnN2Zy1oZWFkaW5nLCAudGFsa3MgLnRlc3RpbW9uaWFsXCIpLmFuaW1hdGVkKFwiZmFkZUluVXBcIik7XHJcblx0JChcIi5hYm91dC1tZV9fc2tpbGxzPmRpdlwiKS5hbmltYXRlZChcImZhZGVJblVwXCIpO1xyXG5cdCQoXCIuYXJ0aWNsZSwgLnBvcnRmb2xpby1zbGlkZXJfX25hdmlnYXRpb24tY29udGFpbmVyLCAucG9ydGZvbGlvLXNsaWRlcl9fcHJldmlldy1jb250YWluZXJcIikuYW5pbWF0ZWQoXCJmYWRlSW5cIik7XHJcblx0JChcIi5wb3J0Zm9saW8tc2xpZGVyX19wcm9qZWN0cy1jb250YWluZXJcIikuYW5pbWF0ZWQoXCJmYWRlSW5cIik7XHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBQaWVjaGFydHMgYW5pbWF0aW9uXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0JChcIi5waWVjaGFydCAucGllY2hhcnRfX2ZpbGxcIikuZWFjaChmdW5jdGlvbigpe1xyXG5cdFx0dmFyIHBpZSA9ICQodGhpcyk7XHJcblx0XHRwaWUud2F5cG9pbnQoZnVuY3Rpb24oZGlyKSB7XHJcblx0XHRcdGlmIChkaXIgPT09IFwiZG93blwiKSB7XHJcblx0XHRcdFx0cGllLmNzcyh7c3Ryb2tlRGFzaG9mZnNldDpwaWUuZGF0YShcInBlcmNlbnRhZ2VcIil9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG9mZnNldDogXCI5MCVcIlxyXG5cdFx0XHR9KTtcclxuXHR9KTtcclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFBhcmFsbGF4XHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0dmFyIGlzX3RoaXNfaWUgPSBkZXRlY3RfSUUoKTtcclxuXHJcblx0Ly8gSUUgc2Nyb2xsIGp1bXAgZml4XHJcblx0aWYoaXNfdGhpc19pZSkge1xyXG5cdFx0JChcIi5sYXllclwiKS5jc3Moe3RyYW5zaXRpb246XCJ0b3AgLjE1cyBsaW5lYXJcIn0pO1xyXG5cdFx0JChcIiNzY2VuZS52ZXJ0aWNhbFwiKS5jc3Moe3RyYW5zaXRpb246XCJvcGFjaXR5IC4xNXMgbGluZWFyXCJ9KTtcclxuXHJcblx0XHQkKFwiYm9keVwiKS5vbihcIm1vdXNld2hlZWxcIiwgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpOyBcclxuXHJcblx0XHRcdHZhciB3aGVlbERlbHRhID0gZXZlbnQud2hlZWxEZWx0YSxcclxuXHRcdFx0XHRjdXJyZW50U2Nyb2xsUG9zaXRpb24gPSB3aW5kb3cucGFnZVlPZmZzZXQ7XHJcblxyXG5cdFx0XHR3aW5kb3cuc2Nyb2xsVG8oMCwgY3VycmVudFNjcm9sbFBvc2l0aW9uIC0gd2hlZWxEZWx0YSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGlmKCQoXCIjc2NlbmUuYXhpc1wiKS5sZW5ndGgpe1xyXG5cdFx0JChcIiNzY2VuZS5heGlzXCIpLnBhcmFsbGF4KHtcclxuXHRcdFx0c2NhbGFyWDogMyxcclxuXHRcdFx0c2NhbGFyWTogMyxcclxuXHRcdFx0ZnJpY3Rpb25YOiAwLjUsXHJcblx0XHRcdGZyaWN0aW9uWTogMC41XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGlmKCQoXCIjc2NlbmUudmVydGljYWxcIikpe1xyXG5cdFx0JCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHNjcm9sbFBvcyA9ICQodGhpcykuc2Nyb2xsVG9wKCk7XHJcblxyXG5cdFx0XHQkKFwiI3NjZW5lLnZlcnRpY2FsIC5sYXllclwiKS5lYWNoKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dmFyIGxheWVyID0gJCh0aGlzKTtcclxuXHJcblx0XHRcdFx0aWYobGF5ZXIuaW5kZXgoKSAhPTAgKSB7XHJcblx0XHRcdFx0XHRsYXllci5jc3Moe1xyXG5cdFx0XHRcdFx0XHRcInRvcFwiIDogKCAoc2Nyb2xsUG9zLyg1ICsgMipsYXllci5pbmRleCgpKSkgKStcInB4XCJcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRcdCQoXCIjc2NlbmUudmVydGljYWxcIikuY3NzKHtcclxuXHRcdFx0XHRcIm9wYWNpdHlcIiA6IDEtKHNjcm9sbFBvcy83MjApXHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBMb2dpbiBjYXJkIGZsaXBcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQkKFwiLmxvZ2luLWJ1dHRvblwiKS5jbGljayhmdW5jdGlvbigpIHtcclxuXHRcdCQoXCJib2R5XCIpLmFkZENsYXNzKFwiY2FyZF9mbGlwcGVkXCIpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiI3VuZmxpcC1jYXJkXCIpLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG5cdFx0JChcImJvZHlcIikucmVtb3ZlQ2xhc3MoXCJjYXJkX2ZsaXBwZWRcIik7XHJcblx0fSk7XHJcblxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gTWFpbiBtZW51XHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0JChcIiNtZW51LXRvZ2dsZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0JCh0aGlzKS5hZGQoXCIubWFpbi1tZW51XCIpLnRvZ2dsZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiLm1haW4tbWVudV9faXRlbVwiKS5lYWNoKGZ1bmN0aW9uKGluZGV4KSB7XHJcblx0XHQkKHRoaXMpLmNzcyhcInRyYW5zaXRpb24tZGVsYXlcIiwgMC4zKzAuMSppbmRleCArIFwic1wiKTtcclxuXHR9KTtcclxuXHJcblxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gQnV0dG9uc1xyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdCQoXCJidXR0b24uZ28tZG93blwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0dmFyIGdvID0gJCh0aGlzKS5kYXRhKFwibGlua1wiKTtcclxuXHRcdCQoXCJodG1sLCBib2R5XCIpLnN0b3AoKS5hbmltYXRlKHtcclxuXHRcdFx0c2Nyb2xsVG9wOiAkKGdvKS5vZmZzZXQoKS50b3BcclxuXHRcdH0sIDcwMCwgXCJzd2luZ1wiKTtcclxuXHR9KTtcclxuXHJcblx0JChcImJ1dHRvbi5nby11cFwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0JChcImh0bWwsIGJvZHlcIikuc3RvcCgpLmFuaW1hdGUoe1xyXG5cdFx0XHRzY3JvbGxUb3A6IDBcclxuXHRcdH0sIDcwMCwgXCJzd2luZ1wiKTtcclxuXHR9KTtcclxuXHJcblx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3RvZ2dsZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0JChcIi5ibG9nLW5hdmlnYXRpb25cIikudG9nZ2xlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0fSk7XHJcblxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gU2xpZGVyXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0ZnVuY3Rpb24gcHJlcGFyZV90aXRsZSh0aXRsZV9jb250YWluZXIpe1xyXG5cdFx0dmFyIGxldHRlcnMgPSAkLnRyaW0odGl0bGVfY29udGFpbmVyLnRleHQoKSksXHJcblx0XHRcdG5ld190aXRsZSA9IFwiXCI7XHJcblxyXG5cdFx0dGl0bGVfY29udGFpbmVyLmh0bWwoXCJcIik7XHJcblxyXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IGxldHRlcnMubGVuZ3RoOyBpKyspe1xyXG5cdFx0XHR2YXIgdGV4dCA9IFwiPHNwYW4gY2xhc3M9J2xldHRlcic+XCIgKyBsZXR0ZXJzW2ldICsgXCI8L3NwYW4+XCI7XHJcblxyXG5cdFx0XHRpZihpPT0wKXtcclxuXHRcdFx0XHR0ZXh0ID0gXCI8c3BhbiBjbGFzcz0nd29yZCc+XCIgKyB0ZXh0O1xyXG5cdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0aWYobGV0dGVyc1tpXSA9PSBcIiBcIiB8fCBsZXR0ZXJzW2ldID09IFwiJm5ic3A7XCIpe1xyXG5cdFx0XHRcdHRleHQgPSBcIjwvc3Bhbj48c3BhbiBjbGFzcz0nbGV0dGVyJz4mbmJzcDs8L3NwYW4+PHNwYW4gY2xhc3M9J3dvcmQnPlwiO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZihpID09IGxldHRlcnMubGVuZ3RoLTEpIHtcclxuXHRcdFx0XHR0ZXh0ID0gdGV4dCArIFwiPC9zcGFuPlwiO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRuZXdfdGl0bGUgKz0gdGV4dDtcclxuXHRcdH1cclxuXHJcblx0XHR0aXRsZV9jb250YWluZXIuYXBwZW5kKG5ld190aXRsZSk7XHJcblx0fVxyXG5cclxuXHRpZigkKFwiLnBvcnRmb2xpby1zbGlkZXJcIikubGVuZ3RoKXtcclxuXHRcdCQoXCIucG9ydGZvbGlvLXByb2plY3RzIC5wcm9qZWN0X190aXRsZVwiKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRwcmVwYXJlX3RpdGxlKCQodGhpcykpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0JChcIi5wb3J0Zm9saW8tcHJvamVjdHMgLnByb2plY3RcIikubm90KFwiLmFjdGl2ZVwiKS5jc3Moe2Rpc3BsYXk6XCJub25lXCJ9KTtcclxuXHRcdCQoXCIucG9ydGZvbGlvLXByb2plY3RzIC5hY3RpdmUgLnByb2plY3RfX3RpdGxlIC5sZXR0ZXJcIikuYWRkQ2xhc3MoXCJzaG93XCIpO1xyXG5cdH1cclxuXHJcblxyXG5cdCQoXCIucG9ydGZvbGlvLWJ1dHRvblwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0dmFyIHRoaXNfYnV0dG9uID0gJCh0aGlzKSxcclxuXHRcdFx0dGhpc190aHVtYm5haWxzID0gdGhpc19idXR0b24ubmV4dCgpLmZpbmQoXCIucG9ydGZvbGlvLXRodW1ibmFpbHNfX3RodW1ibmFpbFwiKSxcclxuXHRcdFx0dGhpc19hY3RpdmVfdGh1bWIgPSB0aGlzX3RodW1ibmFpbHMuZmlsdGVyKFwiLmFjdGl2ZVwiKSxcclxuXHRcdFx0dGhpc19uZXh0X2luZGV4ID0gdGhpc190aHVtYm5haWxzLmluZGV4KHRoaXNfYWN0aXZlX3RodW1iKTtcclxuXHJcblx0XHR2YXIgb3RoZXJfYnV0dG9uID0gdGhpc19idXR0b24ucGFyZW50KCkuc2libGluZ3MoKS5maW5kKFwiLnBvcnRmb2xpby1idXR0b25cIiksXHJcblx0XHRcdG90aGVyX3RodW1ibmFpbHMgPSBvdGhlcl9idXR0b24ubmV4dCgpLmZpbmQoXCIucG9ydGZvbGlvLXRodW1ibmFpbHNfX3RodW1ibmFpbFwiKSxcclxuXHRcdFx0b3RoZXJfYWN0aXZlX3RodW1iID0gb3RoZXJfdGh1bWJuYWlscy5maWx0ZXIoXCIuYWN0aXZlXCIpLFxyXG5cdFx0XHRvdGhlcl9uZXh0X2luZGV4ID0gb3RoZXJfdGh1bWJuYWlscy5pbmRleChvdGhlcl9hY3RpdmVfdGh1bWIpO1xyXG5cclxuXHRcdHZhciBhY3RpdmVfcHJldmlldyA9IHRoaXNfYnV0dG9uLmNsb3Nlc3QoXCIucG9ydGZvbGlvLXNsaWRlclwiKS5maW5kKFwiLnBvcnRmb2xpby1wcmV2aWV3XCIpLFxyXG5cdFx0XHRuZXh0X3ByZXZpZXcgPSB0aGlzX2FjdGl2ZV90aHVtYi5maW5kKFwiaW1nXCIpLmF0dHIoXCJzcmNcIiksXHJcblx0XHRcdHByb2plY3RzID0gdGhpc19idXR0b24uY2xvc2VzdChcIi5wb3J0Zm9saW8tc2xpZGVyXCIpLmZpbmQoXCIucG9ydGZvbGlvLXByb2plY3RzIC5wcm9qZWN0XCIpLFxyXG5cdFx0XHRhY3RpdmVfcHJvamVjdCA9IHByb2plY3RzLmZpbHRlcihcIi5hY3RpdmVcIiksXHJcblx0XHRcdG5leHRfcHJvamVjdF9pbmRleCA9IHByb2plY3RzLmluZGV4KGFjdGl2ZV9wcm9qZWN0KTtcclxuXHJcblx0XHRpZih0aGlzX2J1dHRvbi5oYXNDbGFzcyhcInBvcnRmb2xpby1idXR0b25fbmV4dFwiKSkge1xyXG5cdFx0XHRuZXh0X3Byb2plY3RfaW5kZXgrKztcclxuXHRcdFx0dGhpc19uZXh0X2luZGV4Kys7XHJcblx0XHRcdG90aGVyX25leHRfaW5kZXgrKztcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdG5leHRfcHJvamVjdF9pbmRleC0tO1xyXG5cdFx0XHR0aGlzX25leHRfaW5kZXgtLTtcclxuXHRcdFx0b3RoZXJfbmV4dF9pbmRleC0tO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmKHRoaXNfbmV4dF9pbmRleCA+PSB0aGlzX3RodW1ibmFpbHMubGVuZ3RoKXtcclxuXHRcdFx0dGhpc19uZXh0X2luZGV4ID0gMDtcclxuXHRcdH1cclxuXHJcblx0XHRpZihvdGhlcl9uZXh0X2luZGV4ID49IG90aGVyX3RodW1ibmFpbHMubGVuZ3RoKXtcclxuXHRcdFx0b3RoZXJfbmV4dF9pbmRleCA9IDA7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYobmV4dF9wcm9qZWN0X2luZGV4ID49IHByb2plY3RzLmxlbmd0aCl7XHJcblx0XHRcdG5leHRfcHJvamVjdF9pbmRleCA9IDA7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIHRoaXNfbmV4dF90aHVtYiA9IHRoaXNfdGh1bWJuYWlscy5lcSh0aGlzX25leHRfaW5kZXgpLFxyXG5cdFx0XHRvdGhlcl9uZXh0X3RodW1iID0gb3RoZXJfdGh1bWJuYWlscy5lcShvdGhlcl9uZXh0X2luZGV4KSxcclxuXHRcdFx0bmV4dF9wcm9qZWN0ID0gcHJvamVjdHMuZXEobmV4dF9wcm9qZWN0X2luZGV4KSxcclxuXHRcdFx0bmV4dF9wcm9qZWN0X3RpdGxlID0gbmV4dF9wcm9qZWN0LmZpbmQoXCIucHJvamVjdF9fdGl0bGVcIik7XHJcblxyXG5cclxuXHRcdHRoaXNfYnV0dG9uLnByb3AoXCJkaXNhYmxlZFwiLCB0cnVlKTtcclxuXHRcdG90aGVyX2J1dHRvbi5wcm9wKFwiZGlzYWJsZWRcIiwgdHJ1ZSk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gY2hhbmdlX3RoaXNfdGh1bWIoKXtcclxuXHRcdFx0dGhpc19hY3RpdmVfdGh1bWIuYW5pbWF0ZSh7XHJcblx0XHRcdFx0dG9wOiBcIi0xMDAlXCJcclxuXHRcdFx0fSwgNzAwKTtcclxuXHJcblx0XHRcdHRoaXNfbmV4dF90aHVtYi5jc3Moe3RvcDpcIjEwMCVcIn0pO1xyXG5cdFx0XHR0aGlzX25leHRfdGh1bWIuYW5pbWF0ZSh7XHJcblx0XHRcdFx0dG9wOiAwXHJcblx0XHRcdH0sIDcwMCwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dGhpc19hY3RpdmVfdGh1bWIucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIikuY3NzKHt0b3A6XCIxMDAlXCJ9KTtcclxuXHRcdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHRcdHRoaXNfYnV0dG9uLnByb3AoXCJkaXNhYmxlZFwiLCBmYWxzZSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIGNoYW5nZV9vdGhlcl90aHVtYigpe1xyXG5cdFx0XHRvdGhlcl9hY3RpdmVfdGh1bWIuYW5pbWF0ZSh7XHJcblx0XHRcdFx0dG9wOiBcIjEwMCVcIlxyXG5cdFx0XHR9LCA3MDApO1xyXG5cclxuXHRcdFx0b3RoZXJfbmV4dF90aHVtYi5jc3Moe3RvcDpcIi0xMDAlXCJ9KTtcclxuXHRcdFx0b3RoZXJfbmV4dF90aHVtYi5hbmltYXRlKHtcclxuXHRcdFx0XHR0b3A6IDBcclxuXHRcdFx0fSwgNzAwLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRvdGhlcl9hY3RpdmVfdGh1bWIucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIikuY3NzKHt0b3A6XCItMTAwJVwifSk7XHJcblx0XHRcdFx0JCh0aGlzKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0XHRvdGhlcl9idXR0b24ucHJvcChcImRpc2FibGVkXCIsIGZhbHNlKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gY2hhbmdlX3ByZXZpZXcoKXtcclxuXHRcdFx0YWN0aXZlX3ByZXZpZXcuZmFkZU91dCgzNTAsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0JCh0aGlzKS5hdHRyKFwic3JjXCIsIG5leHRfcHJldmlldykuZmFkZUluKDM1MCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRmdW5jdGlvbiBjaGFuZ2VfcHJvamVjdCgpe1xyXG5cdFx0XHR2YXIgcHJqX2xldHRlcnMgPSBuZXh0X3Byb2plY3RfdGl0bGUuZmluZChcInNwYW4ubGV0dGVyXCIpLnJlbW92ZUNsYXNzKFwic2hvd1wiKTtcclxuXHJcblx0XHRcdGFjdGl2ZV9wcm9qZWN0LmZhZGVPdXQoMzUwLCBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHRcdFx0bmV4dF9wcm9qZWN0LmFkZENsYXNzKFwiYWN0aXZlXCIpLmZhZGVJbigzNTApO1xyXG5cclxuXHRcdFx0XHRwcmpfbGV0dGVycy5lYWNoKGZ1bmN0aW9uKGluZGV4KXtcclxuXHRcdFx0XHRcdCQodGhpcykuY3NzKHtcInRyYW5zaXRpb24tZGVsYXlcIjogKDAuMzUvcHJqX2xldHRlcnMubGVuZ3RoKSooaW5kZXgrMSkgKyBcInNcIn0pXHJcblx0XHRcdFx0XHRcdFx0LmFkZENsYXNzKFwic2hvd1wiKTtcclxuXHRcdFx0XHR9KTtcclxuXHJcblxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Y2hhbmdlX3RoaXNfdGh1bWIoKTtcclxuXHRcdGNoYW5nZV9vdGhlcl90aHVtYigpO1xyXG5cdFx0Y2hhbmdlX3ByZXZpZXcoKTtcclxuXHRcdGNoYW5nZV9wcm9qZWN0KCk7XHJcblx0fSk7XHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBTQ1JPTEwgRVZFTlRTXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG5cdC8vIFNDUk9MTCBOQVZJR0FUSU9OIEJFR0lOXHJcblx0dmFyIGxhc3RJZCxcclxuXHRcdG1lbnUgPSAkKFwiLmJsb2ctbmF2aWdhdGlvblwiKSxcclxuXHRcdG1lbnVJdGVtcyA9IG1lbnUuZmluZChcImxpIGFcIiksXHJcblx0XHRzY3JvbGxJdGVtcyA9IG1lbnVJdGVtcy5tYXAoZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIGl0ZW0gPSAkKCQodGhpcykuYXR0cihcImhyZWZcIikpO1xyXG5cdFx0XHRpZiAoaXRlbS5sZW5ndGgpIHJldHVybiBpdGVtO1xyXG5cdFx0fSk7XHJcblxyXG5cdC8vIEJpbmQgY2xpY2sgaGFuZGxlciB0byBtZW51IGl0ZW1zXHJcblx0Ly8gc28gd2UgY2FuIGdldCBhIGZhbmN5IHNjcm9sbCBhbmltYXRpb25cclxuXHRtZW51SXRlbXMuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0XHR2YXIgaHJlZiA9ICQodGhpcykuYXR0cihcImhyZWZcIiksXHJcblx0XHRcdG9mZnNldFRvcCA9IChocmVmID09PSBcIiNcIikgPyAwIDogJChocmVmKS5vZmZzZXQoKS50b3AtNjA7XHJcblx0XHRcclxuXHRcdCQoXCJodG1sLCBib2R5XCIpLnN0b3AoKS5hbmltYXRlKHsgXHJcblx0XHRcdHNjcm9sbFRvcDogb2Zmc2V0VG9wXHJcblx0XHR9LCA3MDAsIFwic3dpbmdcIik7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0fSk7XHJcblxyXG5cdC8vIEJpbmQgdG8gc2Nyb2xsXHJcblx0aWYoJChcIi5ibG9nLW5hdmlnYXRpb25cIikub2Zmc2V0KCkpe1xyXG5cdFx0JCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpIHtcclxuXHRcdFx0Ly8gR2V0IGNvbnRhaW5lciBzY3JvbGwgcG9zaXRpb25cclxuXHRcdFx0dmFyIGZyb21Ub3AgPSAkKHRoaXMpLnNjcm9sbFRvcCgpLFxyXG5cdFx0XHRcdGJsb2dOYXZPZmZzZXQgPSAkKFwiLmJsb2ctbmF2aWdhdGlvblwiKS5vZmZzZXQoKS50b3AsXHJcblx0XHRcdFx0YmxvZ05hdkxpbWl0ID0gJChcIi5mb290ZXJfX3dyYXBwZXJcIikub2Zmc2V0KCkudG9wIC0gJChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikub3V0ZXJIZWlnaHQoKTtcclxuXHJcblx0XHRcdC8vIEdldCBpZCBvZiBjdXJyZW50IHNjcm9sbCBpdGVtXHJcblx0XHRcdHZhciBjdXIgPSBzY3JvbGxJdGVtcy5tYXAoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRpZiAoJCh0aGlzKS5vZmZzZXQoKS50b3AgPCBmcm9tVG9wKzE0NClcclxuXHRcdFx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0Ly8gR2V0IHRoZSBpZCBvZiB0aGUgY3VycmVudCBlbGVtZW50XHJcblx0XHRcdGN1ciA9IGN1cltjdXIubGVuZ3RoLTFdO1xyXG5cdFx0XHR2YXIgaWQgPSBjdXIgJiYgY3VyLmxlbmd0aCA/IGN1clswXS5pZCA6IFwiXCI7XHJcblxyXG5cdFx0XHRpZiAobGFzdElkICE9PSBpZCkge1xyXG5cdFx0XHRcdGxhc3RJZCA9IGlkO1xyXG5cdFx0XHRcdC8vIFNldC9yZW1vdmUgYWN0aXZlIGNsYXNzXHJcblx0XHRcdFx0bWVudUl0ZW1zXHJcblx0XHRcdFx0LnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpXHJcblx0XHRcdFx0LmZpbHRlcihcIltocmVmPSNcIitpZCtcIl1cIilcclxuXHRcdFx0XHQuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKGZyb21Ub3AgPj0gYmxvZ05hdkxpbWl0ICYmICQod2luZG93KS53aWR0aCgpID4gKDc2OCAtIHNjcm9sbEJhcldpZHRoKSkge1xyXG5cdFx0XHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uX193cmFwcGVyXCIpLmNzcyh7XCJwb3NpdGlvblwiOlwiYWJzb2x1dGVcIiwgXCJ0b3BcIjpibG9nTmF2TGltaXQgKyBcInB4XCJ9KTtcclxuXHRcdFx0fSBlbHNlIGlmIChmcm9tVG9wID49IGJsb2dOYXZPZmZzZXQgJiYgJCh3aW5kb3cpLndpZHRoKCkgPiAoNzY4IC0gc2Nyb2xsQmFyV2lkdGgpKSB7XHJcblx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikuY3NzKHtcInBvc2l0aW9uXCI6XCJmaXhlZFwiLCBcInRvcFwiOjB9KTtcclxuXHRcdFx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5hZGRDbGFzcyhcIm5hdi1maXhlZFwiKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5jc3Moe1wicG9zaXRpb25cIjpcInJlbGF0aXZlXCJ9KTtcclxuXHRcdFx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5yZW1vdmVDbGFzcyhcIm5hdi1maXhlZFwiKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH0pO1xyXG5cdH1cclxuXHQvLyBTQ1JPTEwgTkFWSUdBVElPTiBFTkRcclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFJFU0laRSBFVkVOVFNcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRpZigkKFwiLmJsb2ctbmF2aWdhdGlvblwiKS5vZmZzZXQoKSl7XHJcblx0XHQkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpZigkKHdpbmRvdykud2lkdGgoKSA8PSAoNzY4IC0gc2Nyb2xsQmFyV2lkdGgpKXtcclxuXHRcdFx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5yZW1vdmVDbGFzcyhcIm5hdi1maXhlZFwiKTtcclxuXHRcdFx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5jc3Moe1wicG9zaXRpb25cIjpcInJlbGF0aXZlXCJ9KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpZigkKFwiYm9keVwiKS5zY3JvbGxUb3AoKSA+PSAkKFwiLmJsb2dcIikub2Zmc2V0KCkudG9wKXtcclxuXHRcdFx0XHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uX193cmFwcGVyXCIpLmNzcyh7XCJwb3NpdGlvblwiOlwiZml4ZWRcIiwgXCJ0b3BcIjowfSk7XHJcblx0XHRcdFx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5hZGRDbGFzcyhcIm5hdi1maXhlZFwiKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblxyXG5cdCQod2luZG93KS5yZXNpemUoZnVuY3Rpb24oKSB7XHJcblx0XHQvLyBUZXN0aW1vbmlhbHMgc2VjdGlvbiBiZyBzaXplXHJcblx0XHRpZiggJCh3aW5kb3cpLndpZHRoKCk+MjAwMCAtIHNjcm9sbEJhcldpZHRoKXtcclxuXHRcdFx0JChcIi50YWxrcywgLmNvbnRhY3QtZm9ybV9fYmdcIikuY3NzKFwiYmFja2dyb3VuZC1zaXplXCIsICQod2luZG93KS53aWR0aCgpICsgXCJweFwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIEJsdXIgYnVnIGV4YW1wbGVcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRmdW5jdGlvbiBzZXRfYmcoKXtcclxuXHRcdGlmKCQoXCIuYmx1cl9leGFtcGxlX3BhZ2VcIikubGVuZ3RoKXtcclxuXHRcdFx0dmFyIGZvcm0gPSAkKFwiLmJsdXJfZXhhbXBsZV9wYWdlIC50YWxrcyAuY29udGFjdC1mb3JtXCIpLFxyXG5cdFx0XHRcdGZvcm1fYmcgPSBmb3JtLmZpbmQoXCIuY29udGFjdC1mb3JtX19iZ1wiKSxcclxuXHRcdFx0XHR0YWxrc190b3AgPSAkKFwiLmJsdXJfZXhhbXBsZV9wYWdlIC50YWxrc1wiKS5vZmZzZXQoKS50b3AsXHJcblx0XHRcdFx0Zm9ybV9iZ190b3AgPSBmb3JtX2JnLm9mZnNldCgpLnRvcCxcclxuXHRcdFx0XHRiZ19vZmZzZXQgPSB0YWxrc190b3AgLSBmb3JtX2JnX3RvcDtcclxuXHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKFwiQmcgdG9wOiBcIiArIGZvcm1fYmdfdG9wLCBcIkJveCB0b3A6IFwiICsgdGFsa3NfdG9wKTtcclxuXHRcdFx0Zm9ybV9iZy5jc3Moe1xyXG5cdFx0XHRcdFwiYmFja2dyb3VuZC1wb3NpdGlvblwiIDogXCJjZW50ZXIgXCIgKyBiZ19vZmZzZXQgKyBcInB4XCJcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQkKHdpbmRvdykucmVhZHkoZnVuY3Rpb24oKSB7XHJcblx0XHRzZXRfYmcoKTtcclxuXHR9KTtcclxuXHJcblx0JCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbigpIHtcclxuXHRcdHNldF9iZygpO1xyXG5cdH0pO1xyXG5cclxufSkoalF1ZXJ5KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
