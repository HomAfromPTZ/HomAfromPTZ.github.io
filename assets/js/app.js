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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCQpIHtcclxuXHRcInVzZSBzdHJpY3RcIjtcclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gQ2hlY2sgc2Nyb2xsYmFyIHdpZHRoXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0dmFyIHdpZHRoQ29udGVudEEgPSAkKFwiI3Njcm9sbF9iYXJfY2hlY2tfQVwiKS53aWR0aCgpLFxyXG5cdFx0d2lkdGhDb250ZW50QiA9ICQoXCIjc2Nyb2xsX2Jhcl9jaGVja19CXCIpLndpZHRoKCk7XHJcblxyXG5cdHZhciBzY3JvbGxCYXJXaWR0aCA9IHdpZHRoQ29udGVudEEgLSB3aWR0aENvbnRlbnRCO1xyXG5cclxuXHQkKFwiI3Njcm9sbF9iYXJfY2hlY2tfQVwiKS5jc3MoXCJkaXNwbGF5XCIsXCJub25lXCIpO1xyXG5cclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIENoZWNrIElFIHZlcnNpb25cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRmdW5jdGlvbiBkZXRlY3RfSUUoKSB7XHJcblx0XHR2YXIgdWEgPSB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudDtcclxuXHJcblx0XHR2YXIgbXNpZSA9IHVhLmluZGV4T2YoXCJNU0lFIFwiKTtcclxuXHRcdGlmIChtc2llID4gMCkge1xyXG5cdFx0XHQvLyBJRSAxMCBvciBvbGRlciA9PiByZXR1cm4gdmVyc2lvbiBudW1iZXJcclxuXHRcdFx0cmV0dXJuIHBhcnNlSW50KHVhLnN1YnN0cmluZyhtc2llICsgNSwgdWEuaW5kZXhPZihcIi5cIiwgbXNpZSkpLCAxMCk7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIHRyaWRlbnQgPSB1YS5pbmRleE9mKFwiVHJpZGVudC9cIik7XHJcblx0XHRpZiAodHJpZGVudCA+IDApIHtcclxuXHRcdFx0Ly8gSUUgMTEgPT4gcmV0dXJuIHZlcnNpb24gbnVtYmVyXHJcblx0XHRcdHZhciBydiA9IHVhLmluZGV4T2YoXCJydjpcIik7XHJcblx0XHRcdHJldHVybiBwYXJzZUludCh1YS5zdWJzdHJpbmcocnYgKyAzLCB1YS5pbmRleE9mKFwiLlwiLCBydikpLCAxMCk7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIGVkZ2UgPSB1YS5pbmRleE9mKFwiRWRnZS9cIik7XHJcblx0XHRpZiAoZWRnZSA+IDApIHtcclxuXHRcdFx0Ly8gRWRnZSAoSUUgMTIrKSA9PiByZXR1cm4gdmVyc2lvbiBudW1iZXJcclxuXHRcdFx0cmV0dXJuIHBhcnNlSW50KHVhLnN1YnN0cmluZyhlZGdlICsgNSwgdWEuaW5kZXhPZihcIi5cIiwgZWRnZSkpLCAxMCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gb3RoZXIgYnJvd3NlclxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBQcmVsb2FkZXIgd2l0aCBwZXJjZW50YWdlIGJ5IGltYWdlIGNvdW50XHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0ZnVuY3Rpb24gcHJlbG9hZGVyKCkge1xyXG5cdFx0dmFyIHByZWxvYWRlcl9zdGF0ID0gJChcIiNwcmVsb2FkZXItc3ZnX19wZXJjZW50YWdlXCIpLFxyXG5cdFx0XHRoYXNJbWFnZVByb3BlcnRpZXMgPSBbXCJiYWNrZ3JvdW5kXCIsIFwiYmFja2dyb3VuZEltYWdlXCIsIFwibGlzdFN0eWxlSW1hZ2VcIiwgXCJib3JkZXJJbWFnZVwiLCBcImJvcmRlckNvcm5lckltYWdlXCIsIFwiY3Vyc29yXCJdLFxyXG5cdFx0XHRoYXNJbWFnZUF0dHJpYnV0ZXMgPSBbXCJzcmNzZXRcIl0sXHJcblx0XHRcdG1hdGNoX3VybCA9IC91cmxcXChcXHMqKFsnXCJdPykoLio/KVxcMVxccypcXCkvZyxcclxuXHRcdFx0YWxsX2ltYWdlcyA9IFtdLFxyXG5cdFx0XHR0b3RhbCA9IDAsXHJcblx0XHRcdGNvdW50ID0gMDtcclxuXHJcblx0XHR2YXIgY2lyY2xlX28gPSAkKFwiI3ByZWxvYWRlci1zdmdfX2ltZyAuYmFyX19vdXRlclwiKSxcclxuXHRcdFx0Y2lyY2xlX2MgPSAkKFwiI3ByZWxvYWRlci1zdmdfX2ltZyAuYmFyX19jZW50ZXJcIiksXHJcblx0XHRcdGNpcmNsZV9pID0gJChcIiNwcmVsb2FkZXItc3ZnX19pbWcgLmJhcl9faW5uZXJcIiksXHJcblx0XHRcdGxlbmd0aF9vID0gTWF0aC5QSSooY2lyY2xlX28uYXR0cihcInJcIikgKiAyKSxcclxuXHRcdFx0bGVuZ3RoX2MgPSBNYXRoLlBJKihjaXJjbGVfYy5hdHRyKFwiclwiKSAqIDIpLFxyXG5cdFx0XHRsZW5ndGhfaSA9IE1hdGguUEkqKGNpcmNsZV9pLmF0dHIoXCJyXCIpICogMik7XHJcblxyXG5cclxuXHRcdGZ1bmN0aW9uIGltZ19sb2FkZWQoKXtcclxuXHRcdFx0dmFyIHBlcmNlbnRhZ2UgPSBNYXRoLmNlaWwoICsrY291bnQgLyB0b3RhbCAqIDEwMCApO1xyXG5cclxuXHRcdFx0cGVyY2VudGFnZSA9IHBlcmNlbnRhZ2UgPiAxMDAgPyAxMDAgOiBwZXJjZW50YWdlO1xyXG5cclxuXHRcdFx0Ly8gRHJhdyBvZmZzZXRzXHJcblx0XHRcdGNpcmNsZV9vLmNzcyh7c3Ryb2tlRGFzaG9mZnNldDogKCgxMDAtcGVyY2VudGFnZSkvMTAwKSpsZW5ndGhfbyB9KTtcclxuXHJcblx0XHRcdGlmKHBlcmNlbnRhZ2UgPiA1MCkge1xyXG5cdFx0XHRcdGNpcmNsZV9jLmNzcyh7c3Ryb2tlRGFzaG9mZnNldDogKCgxMDAtcGVyY2VudGFnZSkvMTAwKSpsZW5ndGhfYyB9KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYocGVyY2VudGFnZSA9PSAxMDApIHtcclxuXHRcdFx0XHRjaXJjbGVfaS5jc3Moe3N0cm9rZURhc2hvZmZzZXQ6ICgoMTAwLXBlcmNlbnRhZ2UpLzEwMCkqbGVuZ3RoX2kgfSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHByZWxvYWRlcl9zdGF0Lmh0bWwocGVyY2VudGFnZSk7XHJcblxyXG5cdFx0XHRpZihjb3VudCA9PT0gdG90YWwpIHJldHVybiBkb25lX2xvYWRpbmcoKTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBkb25lX2xvYWRpbmcoKXtcclxuXHRcdFx0JChcIiNwcmVsb2FkZXJcIikuZGVsYXkoNzAwKS5mYWRlT3V0KDcwMCwgZnVuY3Rpb24oKXtcclxuXHRcdFx0XHQkKFwiI3ByZWxvYWRlcl9fcHJvZ3Jlc3NcIikucmVtb3ZlKCk7XHJcblxyXG5cdFx0XHRcdGlmKCQoXCIuZmxpcC1jYXJkXCIpLmxlbmd0aCl7XHJcblx0XHRcdFx0XHQkKFwiLmZsaXAtY2FyZFwiKS5hZGRDbGFzcyhcImxvYWRlZFwiKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIGltYWdlc19sb29wICgpIHtcclxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0dmFyIHRlc3RfaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuXHJcblx0XHRcdFx0dGVzdF9pbWFnZS5vbmxvYWQgPSBpbWdfbG9hZGVkO1xyXG5cdFx0XHRcdHRlc3RfaW1hZ2Uub25lcnJvciA9IGltZ19sb2FkZWQ7XHJcblxyXG5cdFx0XHRcdC8vIGNvbnNvbGUubG9nKFwiQzogXCIgKyBjb3VudCwgXCIgVDogXCIgKyB0b3RhbCk7XHJcblxyXG5cdFx0XHRcdGlmIChjb3VudCAhPSB0b3RhbCkge1xyXG5cdFx0XHRcdFx0aWYgKGFsbF9pbWFnZXNbY291bnRdLnNyY3NldCkge1xyXG5cdFx0XHRcdFx0XHR0ZXN0X2ltYWdlLnNyY3NldCA9IGFsbF9pbWFnZXNbY291bnRdLnNyY3NldDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHRlc3RfaW1hZ2Uuc3JjID0gYWxsX2ltYWdlc1tjb3VudF0uc3JjO1xyXG5cclxuXHRcdFx0XHRcdGltYWdlc19sb29wKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LCA1MCk7XHJcblx0XHR9XHJcblxyXG5cdFx0JChcIipcIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHZhciBlbGVtZW50ID0gJCh0aGlzKTtcclxuXHJcblx0XHRcdGlmIChlbGVtZW50LmlzKFwiaW1nXCIpICYmIGVsZW1lbnQuYXR0cihcInNyY1wiKSkge1xyXG5cdFx0XHRcdGFsbF9pbWFnZXMucHVzaCh7XHJcblx0XHRcdFx0XHRzcmM6IGVsZW1lbnQuYXR0cihcInNyY1wiKSxcclxuXHRcdFx0XHRcdGVsZW1lbnQ6IGVsZW1lbnRbMF1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0JC5lYWNoKGhhc0ltYWdlUHJvcGVydGllcywgZnVuY3Rpb24gKGksIHByb3BlcnR5KSB7XHJcblx0XHRcdFx0dmFyIHByb3BlcnR5VmFsdWUgPSBlbGVtZW50LmNzcyhwcm9wZXJ0eSk7XHJcblx0XHRcdFx0dmFyIG1hdGNoO1xyXG5cclxuXHRcdFx0XHRpZiAoIXByb3BlcnR5VmFsdWUpIHtcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0bWF0Y2ggPSBtYXRjaF91cmwuZXhlYyhwcm9wZXJ0eVZhbHVlKTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRpZiAobWF0Y2gpIHtcclxuXHRcdFx0XHRcdGFsbF9pbWFnZXMucHVzaCh7XHJcblx0XHRcdFx0XHRcdHNyYzogbWF0Y2hbMl0sXHJcblx0XHRcdFx0XHRcdGVsZW1lbnQ6IGVsZW1lbnRbMF1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQkLmVhY2goaGFzSW1hZ2VBdHRyaWJ1dGVzLCBmdW5jdGlvbiAoaSwgYXR0cmlidXRlKSB7XHJcblx0XHRcdFx0dmFyIGF0dHJpYnV0ZVZhbHVlID0gZWxlbWVudC5hdHRyKGF0dHJpYnV0ZSk7XHJcblxyXG5cdFx0XHRcdGlmICghYXR0cmlidXRlVmFsdWUpIHtcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0YWxsX2ltYWdlcy5wdXNoKHtcclxuXHRcdFx0XHRcdHNyYzogZWxlbWVudC5hdHRyKFwic3JjXCIpLFxyXG5cdFx0XHRcdFx0c3Jjc2V0OiBlbGVtZW50LmF0dHIoXCJzcmNzZXRcIiksXHJcblx0XHRcdFx0XHRlbGVtZW50OiBlbGVtZW50WzBdXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0dG90YWwgPSBhbGxfaW1hZ2VzLmxlbmd0aDtcclxuXHJcblx0XHRpZiAodG90YWwgPT09IDApIHtcclxuXHRcdFx0ZG9uZV9sb2FkaW5nKCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRwcmVsb2FkZXJfc3RhdC5jc3Moe29wYWNpdHk6IDF9KTtcclxuXHRcdFx0aW1hZ2VzX2xvb3AoKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBmb3IodmFyIGk9MDsgaTx0b3RhbDsgaSsrKXtcclxuXHRcdC8vIFx0dmFyIHRlc3RfaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuXHJcblxyXG5cdFx0Ly8gXHR0ZXN0X2ltYWdlLm9ubG9hZCA9IGltZ19sb2FkZWQ7XHJcblx0XHQvLyBcdHRlc3RfaW1hZ2Uub25lcnJvciA9IGltZ19sb2FkZWQ7XHJcblxyXG5cdFx0Ly8gXHRpZiAoYWxsX2ltYWdlc1tpXS5zcmNzZXQpIHtcclxuXHRcdC8vIFx0XHR0ZXN0X2ltYWdlLnNyY3NldCA9IGFsbF9pbWFnZXNbaV0uc3Jjc2V0O1xyXG5cdFx0Ly8gXHR9XHJcblx0XHQvLyBcdHRlc3RfaW1hZ2Uuc3JjID0gYWxsX2ltYWdlc1tpXS5zcmM7XHJcblx0XHQvLyB9XHJcblx0fVxyXG5cclxuXHRwcmVsb2FkZXIoKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFBhZ2UgY2hhbmdlclxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdCQoZG9jdW1lbnQpLm9uKFwiY2xpY2tcIiwgXCJhLnByZWxvYWQtbGlua1wiLCBmdW5jdGlvbihlKSB7XHJcblx0XHR2YXIgaHJlZiA9ICQodGhpcykuYXR0cihcImhyZWZcIik7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0cmV0dXJuICQoXCIjcHJlbG9hZGVyXCIpXHJcblx0XHRcdC5mYWRlSW4oMzAwLCBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHJldHVybiBkb2N1bWVudC5sb2NhdGlvbiA9IGhyZWYgIT0gbnVsbCA/IGhyZWYgOiBcIi9cIjtcclxuXHRcdFx0fSk7XHJcblx0fSk7XHJcblxyXG5cclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIEFuaW1hdGlvbnNcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQkLmZuLmFuaW1hdGVkID0gZnVuY3Rpb24oaW5FZmZlY3QpIHtcclxuXHRcdCQodGhpcykuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHRocyA9ICQodGhpcyk7XHJcblx0XHRcdHRocy5jc3Moe29wYWNpdHk6MH0pXHJcblx0XHRcdFx0LmFkZENsYXNzKFwiYW5pbWF0ZWRcIilcclxuXHRcdFx0XHQud2F5cG9pbnQoZnVuY3Rpb24oZGlyKSB7XHJcblx0XHRcdFx0XHRpZiAoZGlyID09PSBcImRvd25cIikge1xyXG5cdFx0XHRcdFx0XHR0aHMuYWRkQ2xhc3MoaW5FZmZlY3QpLmNzcyh7b3BhY2l0eToxfSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRvZmZzZXQ6IFwiOTAlXCJcclxuXHRcdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH07XHJcblxyXG5cdCQoXCJoZWFkZXIgLnN2Zy1oZWFkaW5nLCAudGFsa3MgLnN2Zy1oZWFkaW5nLCAudGFsa3MgLnRlc3RpbW9uaWFsXCIpLmFuaW1hdGVkKFwiZmFkZUluVXBcIik7XHJcblx0JChcIi5hYm91dC1tZV9fc2tpbGxzPmRpdlwiKS5hbmltYXRlZChcImZhZGVJblVwXCIpO1xyXG5cdCQoXCIuYXJ0aWNsZSwgLnBvcnRmb2xpby1zbGlkZXJfX25hdmlnYXRpb24tY29udGFpbmVyLCAucG9ydGZvbGlvLXNsaWRlcl9fcHJldmlldy1jb250YWluZXJcIikuYW5pbWF0ZWQoXCJmYWRlSW5cIik7XHJcblx0JChcIi5wb3J0Zm9saW8tc2xpZGVyX19wcm9qZWN0cy1jb250YWluZXJcIikuYW5pbWF0ZWQoXCJmYWRlSW5cIik7XHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBQaWVjaGFydHMgYW5pbWF0aW9uXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0JChcIi5waWVjaGFydCAucGllY2hhcnRfX2ZpbGxcIikuZWFjaChmdW5jdGlvbigpe1xyXG5cdFx0dmFyIHBpZSA9ICQodGhpcyk7XHJcblx0XHRwaWUud2F5cG9pbnQoZnVuY3Rpb24oZGlyKSB7XHJcblx0XHRcdGlmIChkaXIgPT09IFwiZG93blwiKSB7XHJcblx0XHRcdFx0cGllLmNzcyh7c3Ryb2tlRGFzaG9mZnNldDpwaWUuZGF0YShcInBlcmNlbnRhZ2VcIil9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdG9mZnNldDogXCI5MCVcIlxyXG5cdFx0XHR9KTtcclxuXHR9KTtcclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFBhcmFsbGF4XHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0dmFyIGlzX3RoaXNfaWUgPSBkZXRlY3RfSUUoKTtcclxuXHJcblx0Ly8gSUUgc2Nyb2xsIGp1bXAgZml4XHJcblx0aWYoaXNfdGhpc19pZSkge1xyXG5cdFx0JChcIi5sYXllclwiKS5jc3Moe3RyYW5zaXRpb246XCJ0b3AgLjE1cyBsaW5lYXJcIn0pO1xyXG5cdFx0JChcIiNzY2VuZS52ZXJ0aWNhbFwiKS5jc3Moe3RyYW5zaXRpb246XCJvcGFjaXR5IC4xNXMgbGluZWFyXCJ9KTtcclxuXHJcblx0XHQkKFwiYm9keVwiKS5vbihcIm1vdXNld2hlZWxcIiwgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpOyBcclxuXHJcblx0XHRcdHZhciB3aGVlbERlbHRhID0gZXZlbnQud2hlZWxEZWx0YSxcclxuXHRcdFx0XHRjdXJyZW50U2Nyb2xsUG9zaXRpb24gPSB3aW5kb3cucGFnZVlPZmZzZXQ7XHJcblxyXG5cdFx0XHR3aW5kb3cuc2Nyb2xsVG8oMCwgY3VycmVudFNjcm9sbFBvc2l0aW9uIC0gd2hlZWxEZWx0YSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGlmKCQoXCIjc2NlbmUuYXhpc1wiKS5sZW5ndGgpe1xyXG5cdFx0JChcIiNzY2VuZS5heGlzXCIpLnBhcmFsbGF4KHtcclxuXHRcdFx0c2NhbGFyWDogMyxcclxuXHRcdFx0c2NhbGFyWTogMyxcclxuXHRcdFx0ZnJpY3Rpb25YOiAwLjUsXHJcblx0XHRcdGZyaWN0aW9uWTogMC41XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGlmKCQoXCIjc2NlbmUudmVydGljYWxcIikpe1xyXG5cdFx0JCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHNjcm9sbFBvcyA9ICQodGhpcykuc2Nyb2xsVG9wKCk7XHJcblxyXG5cdFx0XHQkKFwiI3NjZW5lLnZlcnRpY2FsIC5sYXllclwiKS5lYWNoKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dmFyIGxheWVyID0gJCh0aGlzKTtcclxuXHJcblx0XHRcdFx0aWYobGF5ZXIuaW5kZXgoKSAhPTAgKSB7XHJcblx0XHRcdFx0XHRsYXllci5jc3Moe1xyXG5cdFx0XHRcdFx0XHQvLyBcInRyYW5zZm9ybVwiIDogXCJ0cmFuc2xhdGUzZCgwLFwiICsgKCAoc2Nyb2xsUG9zLyg1ICsgMipsYXllci5pbmRleCgpKSkgKSArIFwicHgsMClcIlxyXG5cdFx0XHRcdFx0XHRcInRvcFwiIDogKCAoc2Nyb2xsUG9zLyg1ICsgMipsYXllci5pbmRleCgpKSkgKSArIFwicHhcIlxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0JChcIiNzY2VuZS52ZXJ0aWNhbFwiKS5jc3Moe1xyXG5cdFx0XHRcdFwib3BhY2l0eVwiIDogMS0oc2Nyb2xsUG9zLzcyMClcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIExvZ2luIGNhcmQgZmxpcFxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdCQoXCIubG9naW4tYnV0dG9uXCIpLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG5cdFx0JChcImJvZHlcIikuYWRkQ2xhc3MoXCJjYXJkX2ZsaXBwZWRcIik7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjdW5mbGlwLWNhcmRcIikuY2xpY2soZnVuY3Rpb24oKSB7XHJcblx0XHQkKFwiYm9keVwiKS5yZW1vdmVDbGFzcyhcImNhcmRfZmxpcHBlZFwiKTtcclxuXHR9KTtcclxuXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBNYWluIG1lbnVcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQkKFwiI21lbnUtdG9nZ2xlXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHQkKHRoaXMpLmFkZChcIi5tYWluLW1lbnVcIikudG9nZ2xlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIubWFpbi1tZW51X19pdGVtXCIpLmVhY2goZnVuY3Rpb24oaW5kZXgpIHtcclxuXHRcdCQodGhpcykuY3NzKFwidHJhbnNpdGlvbi1kZWxheVwiLCAwLjMrMC4xKmluZGV4ICsgXCJzXCIpO1xyXG5cdH0pO1xyXG5cclxuXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBCdXR0b25zXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0JChcImJ1dHRvbi5nby1kb3duXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgZ28gPSAkKHRoaXMpLmRhdGEoXCJsaW5rXCIpO1xyXG5cdFx0JChcImh0bWwsIGJvZHlcIikuc3RvcCgpLmFuaW1hdGUoe1xyXG5cdFx0XHRzY3JvbGxUb3A6ICQoZ28pLm9mZnNldCgpLnRvcFxyXG5cdFx0fSwgNzAwLCBcInN3aW5nXCIpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiYnV0dG9uLmdvLXVwXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHQkKFwiaHRtbCwgYm9keVwiKS5zdG9wKCkuYW5pbWF0ZSh7XHJcblx0XHRcdHNjcm9sbFRvcDogMFxyXG5cdFx0fSwgNzAwLCBcInN3aW5nXCIpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fdG9nZ2xlXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvblwiKS50b2dnbGVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHR9KTtcclxuXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBTbGlkZXJcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRmdW5jdGlvbiBwcmVwYXJlX3RpdGxlKHRpdGxlX2NvbnRhaW5lcil7XHJcblx0XHR2YXIgbGV0dGVycyA9ICQudHJpbSh0aXRsZV9jb250YWluZXIudGV4dCgpKSxcclxuXHRcdFx0bmV3X3RpdGxlID0gXCJcIjtcclxuXHJcblx0XHR0aXRsZV9jb250YWluZXIuaHRtbChcIlwiKTtcclxuXHJcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbGV0dGVycy5sZW5ndGg7IGkrKyl7XHJcblx0XHRcdHZhciB0ZXh0ID0gXCI8c3BhbiBjbGFzcz0nbGV0dGVyJz5cIiArIGxldHRlcnNbaV0gKyBcIjwvc3Bhbj5cIjtcclxuXHJcblx0XHRcdGlmKGk9PTApe1xyXG5cdFx0XHRcdHRleHQgPSBcIjxzcGFuIGNsYXNzPSd3b3JkJz5cIiArIHRleHQ7XHJcblx0XHRcdH1cclxuXHJcblxyXG5cdFx0XHRpZihsZXR0ZXJzW2ldID09IFwiIFwiIHx8IGxldHRlcnNbaV0gPT0gXCImbmJzcDtcIil7XHJcblx0XHRcdFx0dGV4dCA9IFwiPC9zcGFuPjxzcGFuIGNsYXNzPSdsZXR0ZXInPiZuYnNwOzwvc3Bhbj48c3BhbiBjbGFzcz0nd29yZCc+XCI7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKGkgPT0gbGV0dGVycy5sZW5ndGgtMSkge1xyXG5cdFx0XHRcdHRleHQgPSB0ZXh0ICsgXCI8L3NwYW4+XCI7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdG5ld190aXRsZSArPSB0ZXh0O1xyXG5cdFx0fVxyXG5cclxuXHRcdHRpdGxlX2NvbnRhaW5lci5hcHBlbmQobmV3X3RpdGxlKTtcclxuXHR9XHJcblxyXG5cdGlmKCQoXCIucG9ydGZvbGlvLXNsaWRlclwiKS5sZW5ndGgpe1xyXG5cdFx0JChcIi5wb3J0Zm9saW8tcHJvamVjdHMgLnByb2plY3RfX3RpdGxlXCIpLmVhY2goZnVuY3Rpb24oKSB7XHJcblx0XHRcdHByZXBhcmVfdGl0bGUoJCh0aGlzKSk7XHJcblx0XHR9KTtcclxuXHJcblx0XHQkKFwiLnBvcnRmb2xpby1wcm9qZWN0cyAucHJvamVjdFwiKS5ub3QoXCIuYWN0aXZlXCIpLmNzcyh7ZGlzcGxheTpcIm5vbmVcIn0pO1xyXG5cdFx0JChcIi5wb3J0Zm9saW8tcHJvamVjdHMgLmFjdGl2ZSAucHJvamVjdF9fdGl0bGUgLmxldHRlclwiKS5hZGRDbGFzcyhcInNob3dcIik7XHJcblx0fVxyXG5cclxuXHJcblx0JChcIi5wb3J0Zm9saW8tYnV0dG9uXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgdGhpc19idXR0b24gPSAkKHRoaXMpLFxyXG5cdFx0XHR0aGlzX3RodW1ibmFpbHMgPSB0aGlzX2J1dHRvbi5uZXh0KCkuZmluZChcIi5wb3J0Zm9saW8tdGh1bWJuYWlsc19fdGh1bWJuYWlsXCIpLFxyXG5cdFx0XHR0aGlzX2FjdGl2ZV90aHVtYiA9IHRoaXNfdGh1bWJuYWlscy5maWx0ZXIoXCIuYWN0aXZlXCIpLFxyXG5cdFx0XHR0aGlzX25leHRfaW5kZXggPSB0aGlzX3RodW1ibmFpbHMuaW5kZXgodGhpc19hY3RpdmVfdGh1bWIpO1xyXG5cclxuXHRcdHZhciBvdGhlcl9idXR0b24gPSB0aGlzX2J1dHRvbi5wYXJlbnQoKS5zaWJsaW5ncygpLmZpbmQoXCIucG9ydGZvbGlvLWJ1dHRvblwiKSxcclxuXHRcdFx0b3RoZXJfdGh1bWJuYWlscyA9IG90aGVyX2J1dHRvbi5uZXh0KCkuZmluZChcIi5wb3J0Zm9saW8tdGh1bWJuYWlsc19fdGh1bWJuYWlsXCIpLFxyXG5cdFx0XHRvdGhlcl9hY3RpdmVfdGh1bWIgPSBvdGhlcl90aHVtYm5haWxzLmZpbHRlcihcIi5hY3RpdmVcIiksXHJcblx0XHRcdG90aGVyX25leHRfaW5kZXggPSBvdGhlcl90aHVtYm5haWxzLmluZGV4KG90aGVyX2FjdGl2ZV90aHVtYik7XHJcblxyXG5cdFx0dmFyIGFjdGl2ZV9wcmV2aWV3ID0gdGhpc19idXR0b24uY2xvc2VzdChcIi5wb3J0Zm9saW8tc2xpZGVyXCIpLmZpbmQoXCIucG9ydGZvbGlvLXByZXZpZXdcIiksXHJcblx0XHRcdG5leHRfcHJldmlldyA9IHRoaXNfYWN0aXZlX3RodW1iLmZpbmQoXCJpbWdcIikuYXR0cihcInNyY1wiKSxcclxuXHRcdFx0cHJvamVjdHMgPSB0aGlzX2J1dHRvbi5jbG9zZXN0KFwiLnBvcnRmb2xpby1zbGlkZXJcIikuZmluZChcIi5wb3J0Zm9saW8tcHJvamVjdHMgLnByb2plY3RcIiksXHJcblx0XHRcdGFjdGl2ZV9wcm9qZWN0ID0gcHJvamVjdHMuZmlsdGVyKFwiLmFjdGl2ZVwiKSxcclxuXHRcdFx0bmV4dF9wcm9qZWN0X2luZGV4ID0gcHJvamVjdHMuaW5kZXgoYWN0aXZlX3Byb2plY3QpO1xyXG5cclxuXHRcdGlmKHRoaXNfYnV0dG9uLmhhc0NsYXNzKFwicG9ydGZvbGlvLWJ1dHRvbl9uZXh0XCIpKSB7XHJcblx0XHRcdG5leHRfcHJvamVjdF9pbmRleCsrO1xyXG5cdFx0XHR0aGlzX25leHRfaW5kZXgrKztcclxuXHRcdFx0b3RoZXJfbmV4dF9pbmRleCsrO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0bmV4dF9wcm9qZWN0X2luZGV4LS07XHJcblx0XHRcdHRoaXNfbmV4dF9pbmRleC0tO1xyXG5cdFx0XHRvdGhlcl9uZXh0X2luZGV4LS07XHJcblx0XHR9XHJcblxyXG5cdFx0aWYodGhpc19uZXh0X2luZGV4ID49IHRoaXNfdGh1bWJuYWlscy5sZW5ndGgpe1xyXG5cdFx0XHR0aGlzX25leHRfaW5kZXggPSAwO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmKG90aGVyX25leHRfaW5kZXggPj0gb3RoZXJfdGh1bWJuYWlscy5sZW5ndGgpe1xyXG5cdFx0XHRvdGhlcl9uZXh0X2luZGV4ID0gMDtcclxuXHRcdH1cclxuXHJcblx0XHRpZihuZXh0X3Byb2plY3RfaW5kZXggPj0gcHJvamVjdHMubGVuZ3RoKXtcclxuXHRcdFx0bmV4dF9wcm9qZWN0X2luZGV4ID0gMDtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgdGhpc19uZXh0X3RodW1iID0gdGhpc190aHVtYm5haWxzLmVxKHRoaXNfbmV4dF9pbmRleCksXHJcblx0XHRcdG90aGVyX25leHRfdGh1bWIgPSBvdGhlcl90aHVtYm5haWxzLmVxKG90aGVyX25leHRfaW5kZXgpLFxyXG5cdFx0XHRuZXh0X3Byb2plY3QgPSBwcm9qZWN0cy5lcShuZXh0X3Byb2plY3RfaW5kZXgpLFxyXG5cdFx0XHRuZXh0X3Byb2plY3RfdGl0bGUgPSBuZXh0X3Byb2plY3QuZmluZChcIi5wcm9qZWN0X190aXRsZVwiKTtcclxuXHJcblxyXG5cdFx0dGhpc19idXR0b24ucHJvcChcImRpc2FibGVkXCIsIHRydWUpO1xyXG5cdFx0b3RoZXJfYnV0dG9uLnByb3AoXCJkaXNhYmxlZFwiLCB0cnVlKTtcclxuXHJcblx0XHRmdW5jdGlvbiBjaGFuZ2VfdGhpc190aHVtYigpe1xyXG5cdFx0XHR0aGlzX2FjdGl2ZV90aHVtYi5hbmltYXRlKHtcclxuXHRcdFx0XHR0b3A6IFwiLTEwMCVcIlxyXG5cdFx0XHR9LCA3MDApO1xyXG5cclxuXHRcdFx0dGhpc19uZXh0X3RodW1iLmNzcyh7dG9wOlwiMTAwJVwifSk7XHJcblx0XHRcdHRoaXNfbmV4dF90aHVtYi5hbmltYXRlKHtcclxuXHRcdFx0XHR0b3A6IDBcclxuXHRcdFx0fSwgNzAwLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR0aGlzX2FjdGl2ZV90aHVtYi5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKS5jc3Moe3RvcDpcIjEwMCVcIn0pO1xyXG5cdFx0XHRcdCQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHRcdFx0dGhpc19idXR0b24ucHJvcChcImRpc2FibGVkXCIsIGZhbHNlKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gY2hhbmdlX290aGVyX3RodW1iKCl7XHJcblx0XHRcdG90aGVyX2FjdGl2ZV90aHVtYi5hbmltYXRlKHtcclxuXHRcdFx0XHR0b3A6IFwiMTAwJVwiXHJcblx0XHRcdH0sIDcwMCk7XHJcblxyXG5cdFx0XHRvdGhlcl9uZXh0X3RodW1iLmNzcyh7dG9wOlwiLTEwMCVcIn0pO1xyXG5cdFx0XHRvdGhlcl9uZXh0X3RodW1iLmFuaW1hdGUoe1xyXG5cdFx0XHRcdHRvcDogMFxyXG5cdFx0XHR9LCA3MDAsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdG90aGVyX2FjdGl2ZV90aHVtYi5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKS5jc3Moe3RvcDpcIi0xMDAlXCJ9KTtcclxuXHRcdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHRcdG90aGVyX2J1dHRvbi5wcm9wKFwiZGlzYWJsZWRcIiwgZmFsc2UpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBjaGFuZ2VfcHJldmlldygpe1xyXG5cdFx0XHRhY3RpdmVfcHJldmlldy5mYWRlT3V0KDM1MCwgZnVuY3Rpb24oKXtcclxuXHRcdFx0XHQkKHRoaXMpLmF0dHIoXCJzcmNcIiwgbmV4dF9wcmV2aWV3KS5mYWRlSW4oMzUwKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdGZ1bmN0aW9uIGNoYW5nZV9wcm9qZWN0KCl7XHJcblx0XHRcdHZhciBwcmpfbGV0dGVycyA9IG5leHRfcHJvamVjdF90aXRsZS5maW5kKFwic3Bhbi5sZXR0ZXJcIikucmVtb3ZlQ2xhc3MoXCJzaG93XCIpO1xyXG5cclxuXHRcdFx0YWN0aXZlX3Byb2plY3QuZmFkZU91dCgzNTAsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0XHRuZXh0X3Byb2plY3QuYWRkQ2xhc3MoXCJhY3RpdmVcIikuZmFkZUluKDM1MCk7XHJcblxyXG5cdFx0XHRcdHByal9sZXR0ZXJzLmVhY2goZnVuY3Rpb24oaW5kZXgpe1xyXG5cdFx0XHRcdFx0JCh0aGlzKS5jc3Moe1widHJhbnNpdGlvbi1kZWxheVwiOiAoMC4zNS9wcmpfbGV0dGVycy5sZW5ndGgpKihpbmRleCsxKSArIFwic1wifSlcclxuXHRcdFx0XHRcdFx0XHQuYWRkQ2xhc3MoXCJzaG93XCIpO1xyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRjaGFuZ2VfdGhpc190aHVtYigpO1xyXG5cdFx0Y2hhbmdlX290aGVyX3RodW1iKCk7XHJcblx0XHRjaGFuZ2VfcHJldmlldygpO1xyXG5cdFx0Y2hhbmdlX3Byb2plY3QoKTtcclxuXHR9KTtcclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFNDUk9MTCBFVkVOVFNcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcblx0Ly8gU0NST0xMIE5BVklHQVRJT04gQkVHSU5cclxuXHR2YXIgbGFzdElkLFxyXG5cdFx0bWVudSA9ICQoXCIuYmxvZy1uYXZpZ2F0aW9uXCIpLFxyXG5cdFx0bWVudUl0ZW1zID0gbWVudS5maW5kKFwibGkgYVwiKSxcclxuXHRcdHNjcm9sbEl0ZW1zID0gbWVudUl0ZW1zLm1hcChmdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgaXRlbSA9ICQoJCh0aGlzKS5hdHRyKFwiaHJlZlwiKSk7XHJcblx0XHRcdGlmIChpdGVtLmxlbmd0aCkgcmV0dXJuIGl0ZW07XHJcblx0XHR9KTtcclxuXHJcblx0Ly8gQmluZCBjbGljayBoYW5kbGVyIHRvIG1lbnUgaXRlbXNcclxuXHQvLyBzbyB3ZSBjYW4gZ2V0IGEgZmFuY3kgc2Nyb2xsIGFuaW1hdGlvblxyXG5cdG1lbnVJdGVtcy5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdHZhciBocmVmID0gJCh0aGlzKS5hdHRyKFwiaHJlZlwiKSxcclxuXHRcdFx0b2Zmc2V0VG9wID0gKGhyZWYgPT09IFwiI1wiKSA/IDAgOiAkKGhyZWYpLm9mZnNldCgpLnRvcC02MDtcclxuXHRcdFxyXG5cdFx0JChcImh0bWwsIGJvZHlcIikuc3RvcCgpLmFuaW1hdGUoeyBcclxuXHRcdFx0c2Nyb2xsVG9wOiBvZmZzZXRUb3BcclxuXHRcdH0sIDcwMCwgXCJzd2luZ1wiKTtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHR9KTtcclxuXHJcblx0Ly8gQmluZCB0byBzY3JvbGxcclxuXHRpZigkKFwiLmJsb2ctbmF2aWdhdGlvblwiKS5vZmZzZXQoKSl7XHJcblx0XHQkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQvLyBHZXQgY29udGFpbmVyIHNjcm9sbCBwb3NpdGlvblxyXG5cdFx0XHR2YXIgZnJvbVRvcCA9ICQodGhpcykuc2Nyb2xsVG9wKCksXHJcblx0XHRcdFx0YmxvZ05hdk9mZnNldCA9ICQoXCIuYmxvZy1uYXZpZ2F0aW9uXCIpLm9mZnNldCgpLnRvcCxcclxuXHRcdFx0XHRibG9nTmF2TGltaXQgPSAkKFwiLmZvb3Rlcl9fd3JhcHBlclwiKS5vZmZzZXQoKS50b3AgLSAkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5vdXRlckhlaWdodCgpO1xyXG5cclxuXHRcdFx0Ly8gR2V0IGlkIG9mIGN1cnJlbnQgc2Nyb2xsIGl0ZW1cclxuXHRcdFx0dmFyIGN1ciA9IHNjcm9sbEl0ZW1zLm1hcChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdGlmICgkKHRoaXMpLm9mZnNldCgpLnRvcCA8IGZyb21Ub3ArMTQ0KVxyXG5cdFx0XHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHQvLyBHZXQgdGhlIGlkIG9mIHRoZSBjdXJyZW50IGVsZW1lbnRcclxuXHRcdFx0Y3VyID0gY3VyW2N1ci5sZW5ndGgtMV07XHJcblx0XHRcdHZhciBpZCA9IGN1ciAmJiBjdXIubGVuZ3RoID8gY3VyWzBdLmlkIDogXCJcIjtcclxuXHJcblx0XHRcdGlmIChsYXN0SWQgIT09IGlkKSB7XHJcblx0XHRcdFx0bGFzdElkID0gaWQ7XHJcblx0XHRcdFx0Ly8gU2V0L3JlbW92ZSBhY3RpdmUgY2xhc3NcclxuXHRcdFx0XHRtZW51SXRlbXNcclxuXHRcdFx0XHQucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIilcclxuXHRcdFx0XHQuZmlsdGVyKFwiW2hyZWY9I1wiK2lkK1wiXVwiKVxyXG5cdFx0XHRcdC5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYoZnJvbVRvcCA+PSBibG9nTmF2TGltaXQgJiYgJCh3aW5kb3cpLndpZHRoKCkgPiAoNzY4IC0gc2Nyb2xsQmFyV2lkdGgpKSB7XHJcblx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikuY3NzKHtcInBvc2l0aW9uXCI6XCJhYnNvbHV0ZVwiLCBcInRvcFwiOmJsb2dOYXZMaW1pdCArIFwicHhcIn0pO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGZyb21Ub3AgPj0gYmxvZ05hdk9mZnNldCAmJiAkKHdpbmRvdykud2lkdGgoKSA+ICg3NjggLSBzY3JvbGxCYXJXaWR0aCkpIHtcclxuXHRcdFx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5jc3Moe1wicG9zaXRpb25cIjpcImZpeGVkXCIsIFwidG9wXCI6MH0pO1xyXG5cdFx0XHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uX193cmFwcGVyXCIpLmFkZENsYXNzKFwibmF2LWZpeGVkXCIpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uX193cmFwcGVyXCIpLmNzcyh7XCJwb3NpdGlvblwiOlwicmVsYXRpdmVcIn0pO1xyXG5cdFx0XHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uX193cmFwcGVyXCIpLnJlbW92ZUNsYXNzKFwibmF2LWZpeGVkXCIpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSk7XHJcblx0fVxyXG5cdC8vIFNDUk9MTCBOQVZJR0FUSU9OIEVORFxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gUkVTSVpFIEVWRU5UU1xyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGlmKCQoXCIuYmxvZy1uYXZpZ2F0aW9uXCIpLm9mZnNldCgpKXtcclxuXHRcdCQod2luZG93KS5yZXNpemUoZnVuY3Rpb24oKSB7XHJcblx0XHRcdGlmKCQod2luZG93KS53aWR0aCgpIDw9ICg3NjggLSBzY3JvbGxCYXJXaWR0aCkpe1xyXG5cdFx0XHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uX193cmFwcGVyXCIpLnJlbW92ZUNsYXNzKFwibmF2LWZpeGVkXCIpO1xyXG5cdFx0XHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uX193cmFwcGVyXCIpLmNzcyh7XCJwb3NpdGlvblwiOlwicmVsYXRpdmVcIn0pO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlmKCQoXCJib2R5XCIpLnNjcm9sbFRvcCgpID49ICQoXCIuYmxvZ1wiKS5vZmZzZXQoKS50b3Ape1xyXG5cdFx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikuY3NzKHtcInBvc2l0aW9uXCI6XCJmaXhlZFwiLCBcInRvcFwiOjB9KTtcclxuXHRcdFx0XHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uX193cmFwcGVyXCIpLmFkZENsYXNzKFwibmF2LWZpeGVkXCIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHJcblx0JCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbigpIHtcclxuXHRcdC8vIFRlc3RpbW9uaWFscyBzZWN0aW9uIGJnIHNpemVcclxuXHRcdGlmKCAkKHdpbmRvdykud2lkdGgoKT4yMDAwIC0gc2Nyb2xsQmFyV2lkdGgpe1xyXG5cdFx0XHQkKFwiLnRhbGtzLCAuY29udGFjdC1mb3JtX19iZ1wiKS5jc3MoXCJiYWNrZ3JvdW5kLXNpemVcIiwgJCh3aW5kb3cpLndpZHRoKCkgKyBcInB4XCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gQmx1ciBidWcgZXhhbXBsZVxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIHNldF9iZygpe1xyXG5cdFx0aWYoJChcIi5ibHVyX2V4YW1wbGVfcGFnZVwiKS5sZW5ndGgpe1xyXG5cdFx0XHR2YXIgZm9ybSA9ICQoXCIuYmx1cl9leGFtcGxlX3BhZ2UgLnRhbGtzIC5jb250YWN0LWZvcm1cIiksXHJcblx0XHRcdFx0Zm9ybV9iZyA9IGZvcm0uZmluZChcIi5jb250YWN0LWZvcm1fX2JnXCIpLFxyXG5cdFx0XHRcdHRhbGtzX3RvcCA9ICQoXCIuYmx1cl9leGFtcGxlX3BhZ2UgLnRhbGtzXCIpLm9mZnNldCgpLnRvcCxcclxuXHRcdFx0XHRmb3JtX2JnX3RvcCA9IGZvcm1fYmcub2Zmc2V0KCkudG9wLFxyXG5cdFx0XHRcdGJnX29mZnNldCA9IHRhbGtzX3RvcCAtIGZvcm1fYmdfdG9wO1xyXG5cclxuXHRcdFx0Zm9ybV9iZy5jc3Moe1xyXG5cdFx0XHRcdFwiYmFja2dyb3VuZC1wb3NpdGlvblwiIDogXCJjZW50ZXIgXCIgKyBiZ19vZmZzZXQgKyBcInB4XCJcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQkKHdpbmRvdykubG9hZChmdW5jdGlvbigpIHtcclxuXHRcdHNldF9iZygpO1xyXG5cdH0pO1xyXG5cclxuXHQkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCkge1xyXG5cdFx0c2V0X2JnKCk7XHJcblx0fSk7XHJcblxyXG59KShqUXVlcnkpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
