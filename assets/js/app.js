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

		$(".portfolio-projects .project").fadeOut(0);
		$(".portfolio-projects .project.active").fadeIn(700);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oJCkge1xyXG5cdFwidXNlIHN0cmljdFwiO1xyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBDaGVjayBzY3JvbGxiYXIgd2lkdGhcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHR2YXIgd2lkdGhDb250ZW50QSA9ICQoXCIjc2Nyb2xsX2Jhcl9jaGVja19BXCIpLndpZHRoKCksXHJcblx0XHR3aWR0aENvbnRlbnRCID0gJChcIiNzY3JvbGxfYmFyX2NoZWNrX0JcIikud2lkdGgoKTtcclxuXHJcblx0dmFyIHNjcm9sbEJhcldpZHRoID0gd2lkdGhDb250ZW50QSAtIHdpZHRoQ29udGVudEI7XHJcblxyXG5cdCQoXCIjc2Nyb2xsX2Jhcl9jaGVja19BXCIpLmNzcyhcImRpc3BsYXlcIixcIm5vbmVcIik7XHJcblxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gQ2hlY2sgSUUgdmVyc2lvblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIGRldGVjdF9JRSgpIHtcclxuXHRcdHZhciB1YSA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50O1xyXG5cclxuXHRcdHZhciBtc2llID0gdWEuaW5kZXhPZihcIk1TSUUgXCIpO1xyXG5cdFx0aWYgKG1zaWUgPiAwKSB7XHJcblx0XHRcdC8vIElFIDEwIG9yIG9sZGVyID0+IHJldHVybiB2ZXJzaW9uIG51bWJlclxyXG5cdFx0XHRyZXR1cm4gcGFyc2VJbnQodWEuc3Vic3RyaW5nKG1zaWUgKyA1LCB1YS5pbmRleE9mKFwiLlwiLCBtc2llKSksIDEwKTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgdHJpZGVudCA9IHVhLmluZGV4T2YoXCJUcmlkZW50L1wiKTtcclxuXHRcdGlmICh0cmlkZW50ID4gMCkge1xyXG5cdFx0XHQvLyBJRSAxMSA9PiByZXR1cm4gdmVyc2lvbiBudW1iZXJcclxuXHRcdFx0dmFyIHJ2ID0gdWEuaW5kZXhPZihcInJ2OlwiKTtcclxuXHRcdFx0cmV0dXJuIHBhcnNlSW50KHVhLnN1YnN0cmluZyhydiArIDMsIHVhLmluZGV4T2YoXCIuXCIsIHJ2KSksIDEwKTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgZWRnZSA9IHVhLmluZGV4T2YoXCJFZGdlL1wiKTtcclxuXHRcdGlmIChlZGdlID4gMCkge1xyXG5cdFx0XHQvLyBFZGdlIChJRSAxMispID0+IHJldHVybiB2ZXJzaW9uIG51bWJlclxyXG5cdFx0XHRyZXR1cm4gcGFyc2VJbnQodWEuc3Vic3RyaW5nKGVkZ2UgKyA1LCB1YS5pbmRleE9mKFwiLlwiLCBlZGdlKSksIDEwKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBvdGhlciBicm93c2VyXHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFByZWxvYWRlciB3aXRoIHBlcmNlbnRhZ2UgYnkgaW1hZ2UgY291bnRcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRmdW5jdGlvbiBwcmVsb2FkZXIoKSB7XHJcblx0XHR2YXIgcHJlbG9hZGVyX3N0YXQgPSAkKFwiI3ByZWxvYWRlci1zdmdfX3BlcmNlbnRhZ2VcIiksXHJcblx0XHRcdGhhc0ltYWdlUHJvcGVydGllcyA9IFtcImJhY2tncm91bmRJbWFnZVwiLCBcImxpc3RTdHlsZUltYWdlXCIsIFwiYm9yZGVySW1hZ2VcIiwgXCJib3JkZXJDb3JuZXJJbWFnZVwiLCBcImN1cnNvclwiXSxcclxuXHRcdFx0aGFzSW1hZ2VBdHRyaWJ1dGVzID0gW1wic3Jjc2V0XCJdLFxyXG5cdFx0XHRtYXRjaF91cmwgPSAvdXJsXFwoXFxzKihbJ1wiXT8pKC4qPylcXDFcXHMqXFwpL2csXHJcblx0XHRcdGFsbF9pbWFnZXMgPSBbXSxcclxuXHRcdFx0dG90YWwgPSAwLFxyXG5cdFx0XHRjb3VudCA9IDA7XHJcblxyXG5cdFx0dmFyIGNpcmNsZV9vID0gJChcIiNwcmVsb2FkZXItc3ZnX19pbWcgLmJhcl9fb3V0ZXJcIiksXHJcblx0XHRcdGNpcmNsZV9jID0gJChcIiNwcmVsb2FkZXItc3ZnX19pbWcgLmJhcl9fY2VudGVyXCIpLFxyXG5cdFx0XHRjaXJjbGVfaSA9ICQoXCIjcHJlbG9hZGVyLXN2Z19faW1nIC5iYXJfX2lubmVyXCIpLFxyXG5cdFx0XHRsZW5ndGhfbyA9IE1hdGguUEkqKGNpcmNsZV9vLmF0dHIoXCJyXCIpICogMiksXHJcblx0XHRcdGxlbmd0aF9jID0gTWF0aC5QSSooY2lyY2xlX2MuYXR0cihcInJcIikgKiAyKSxcclxuXHRcdFx0bGVuZ3RoX2kgPSBNYXRoLlBJKihjaXJjbGVfaS5hdHRyKFwiclwiKSAqIDIpO1xyXG5cclxuXHJcblx0XHRmdW5jdGlvbiBpbWdfbG9hZGVkKCl7XHJcblx0XHRcdHZhciBwZXJjZW50YWdlID0gTWF0aC5jZWlsKCArK2NvdW50IC8gdG90YWwgKiAxMDAgKTtcclxuXHJcblx0XHRcdHBlcmNlbnRhZ2UgPSBwZXJjZW50YWdlID4gMTAwID8gMTAwIDogcGVyY2VudGFnZTtcclxuXHJcblx0XHRcdC8vIERyYXcgb2Zmc2V0c1xyXG5cdFx0XHRjaXJjbGVfby5jc3Moe3N0cm9rZURhc2hvZmZzZXQ6ICgoMTAwLXBlcmNlbnRhZ2UpLzEwMCkqbGVuZ3RoX28gfSk7XHJcblxyXG5cdFx0XHRpZihwZXJjZW50YWdlID4gNTApIHtcclxuXHRcdFx0XHRjaXJjbGVfYy5jc3Moe3N0cm9rZURhc2hvZmZzZXQ6ICgoMTAwLXBlcmNlbnRhZ2UpLzEwMCkqbGVuZ3RoX2MgfSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKHBlcmNlbnRhZ2UgPT0gMTAwKSB7XHJcblx0XHRcdFx0Y2lyY2xlX2kuY3NzKHtzdHJva2VEYXNob2Zmc2V0OiAoKDEwMC1wZXJjZW50YWdlKS8xMDApKmxlbmd0aF9pIH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRwcmVsb2FkZXJfc3RhdC5odG1sKHBlcmNlbnRhZ2UpO1xyXG5cclxuXHRcdFx0aWYoY291bnQgPT09IHRvdGFsKSByZXR1cm4gZG9uZV9sb2FkaW5nKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gZG9uZV9sb2FkaW5nKCl7XHJcblx0XHRcdCQoXCIjcHJlbG9hZGVyXCIpLmRlbGF5KDcwMCkuZmFkZU91dCg3MDAsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0JChcIiNwcmVsb2FkZXJfX3Byb2dyZXNzXCIpLnJlbW92ZSgpO1xyXG5cclxuXHRcdFx0XHRpZigkKFwiLmZsaXAtY2FyZFwiKS5sZW5ndGgpe1xyXG5cdFx0XHRcdFx0JChcIi5mbGlwLWNhcmRcIikuYWRkQ2xhc3MoXCJsb2FkZWRcIik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBpbWFnZXNfbG9vcCAoKSB7XHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHZhciB0ZXN0X2ltYWdlID0gbmV3IEltYWdlKCk7XHJcblxyXG5cdFx0XHRcdHRlc3RfaW1hZ2Uub25sb2FkID0gaW1nX2xvYWRlZDtcclxuXHRcdFx0XHR0ZXN0X2ltYWdlLm9uZXJyb3IgPSBpbWdfbG9hZGVkO1xyXG5cclxuXHRcdFx0XHQvLyBjb25zb2xlLmxvZyhcIkM6IFwiICsgY291bnQsIFwiIFQ6IFwiICsgdG90YWwpO1xyXG5cclxuXHRcdFx0XHRpZiAoY291bnQgIT0gdG90YWwpIHtcclxuXHRcdFx0XHRcdGlmIChhbGxfaW1hZ2VzW2NvdW50XS5zcmNzZXQpIHtcclxuXHRcdFx0XHRcdFx0dGVzdF9pbWFnZS5zcmNzZXQgPSBhbGxfaW1hZ2VzW2NvdW50XS5zcmNzZXQ7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR0ZXN0X2ltYWdlLnNyYyA9IGFsbF9pbWFnZXNbY291bnRdLnNyYztcclxuXHJcblx0XHRcdFx0XHRpbWFnZXNfbG9vcCgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSwgNTApO1xyXG5cdFx0fVxyXG5cclxuXHRcdCQoXCIqXCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG5cdFx0XHR2YXIgZWxlbWVudCA9ICQodGhpcyk7XHJcblxyXG5cdFx0XHRpZiAoZWxlbWVudC5pcyhcImltZ1wiKSAmJiBlbGVtZW50LmF0dHIoXCJzcmNcIikpIHtcclxuXHRcdFx0XHRhbGxfaW1hZ2VzLnB1c2goe1xyXG5cdFx0XHRcdFx0c3JjOiBlbGVtZW50LmF0dHIoXCJzcmNcIiksXHJcblx0XHRcdFx0XHRlbGVtZW50OiBlbGVtZW50WzBdXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdCQuZWFjaChoYXNJbWFnZVByb3BlcnRpZXMsIGZ1bmN0aW9uIChpLCBwcm9wZXJ0eSkge1xyXG5cdFx0XHRcdHZhciBwcm9wZXJ0eVZhbHVlID0gZWxlbWVudC5jc3MocHJvcGVydHkpO1xyXG5cdFx0XHRcdHZhciBtYXRjaDtcclxuXHJcblx0XHRcdFx0aWYgKCFwcm9wZXJ0eVZhbHVlKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdG1hdGNoID0gbWF0Y2hfdXJsLmV4ZWMocHJvcGVydHlWYWx1ZSk7XHJcblxyXG5cdFx0XHRcdGlmIChtYXRjaCkge1xyXG5cdFx0XHRcdFx0YWxsX2ltYWdlcy5wdXNoKHtcclxuXHRcdFx0XHRcdFx0c3JjOiBtYXRjaFsyXSxcclxuXHRcdFx0XHRcdFx0ZWxlbWVudDogZWxlbWVudFswXVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdCQuZWFjaChoYXNJbWFnZUF0dHJpYnV0ZXMsIGZ1bmN0aW9uIChpLCBhdHRyaWJ1dGUpIHtcclxuXHRcdFx0XHR2YXIgYXR0cmlidXRlVmFsdWUgPSBlbGVtZW50LmF0dHIoYXR0cmlidXRlKTtcclxuXHJcblx0XHRcdFx0aWYgKCFhdHRyaWJ1dGVWYWx1ZSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRhbGxfaW1hZ2VzLnB1c2goe1xyXG5cdFx0XHRcdFx0c3JjOiBlbGVtZW50LmF0dHIoXCJzcmNcIiksXHJcblx0XHRcdFx0XHRzcmNzZXQ6IGVsZW1lbnQuYXR0cihcInNyY3NldFwiKSxcclxuXHRcdFx0XHRcdGVsZW1lbnQ6IGVsZW1lbnRbMF1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHJcblx0XHR0b3RhbCA9IGFsbF9pbWFnZXMubGVuZ3RoO1xyXG5cclxuXHRcdGlmICh0b3RhbCA9PT0gMCkge1xyXG5cdFx0XHRkb25lX2xvYWRpbmcoKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHByZWxvYWRlcl9zdGF0LmNzcyh7b3BhY2l0eTogMX0pO1xyXG5cdFx0XHRpbWFnZXNfbG9vcCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGZvcih2YXIgaT0wOyBpPHRvdGFsOyBpKyspe1xyXG5cdFx0Ly8gXHR2YXIgdGVzdF9pbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG5cclxuXHJcblx0XHQvLyBcdHRlc3RfaW1hZ2Uub25sb2FkID0gaW1nX2xvYWRlZDtcclxuXHRcdC8vIFx0dGVzdF9pbWFnZS5vbmVycm9yID0gaW1nX2xvYWRlZDtcclxuXHJcblx0XHQvLyBcdGlmIChhbGxfaW1hZ2VzW2ldLnNyY3NldCkge1xyXG5cdFx0Ly8gXHRcdHRlc3RfaW1hZ2Uuc3Jjc2V0ID0gYWxsX2ltYWdlc1tpXS5zcmNzZXQ7XHJcblx0XHQvLyBcdH1cclxuXHRcdC8vIFx0dGVzdF9pbWFnZS5zcmMgPSBhbGxfaW1hZ2VzW2ldLnNyYztcclxuXHRcdC8vIH1cclxuXHR9XHJcblxyXG5cdHByZWxvYWRlcigpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gUGFnZSBjaGFuZ2VyXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0JChkb2N1bWVudCkub24oXCJjbGlja1wiLCBcImEucHJlbG9hZC1saW5rXCIsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdHZhciBocmVmID0gJCh0aGlzKS5hdHRyKFwiaHJlZlwiKTtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRyZXR1cm4gJChcIiNwcmVsb2FkZXJcIilcclxuXHRcdFx0LmZhZGVJbigzMDAsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0cmV0dXJuIGRvY3VtZW50LmxvY2F0aW9uID0gaHJlZiAhPSBudWxsID8gaHJlZiA6IFwiL1wiO1xyXG5cdFx0XHR9KTtcclxuXHR9KTtcclxuXHJcblxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gQW5pbWF0aW9uc1xyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdCQuZm4uYW5pbWF0ZWQgPSBmdW5jdGlvbihpbkVmZmVjdCkge1xyXG5cdFx0JCh0aGlzKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgdGhzID0gJCh0aGlzKTtcclxuXHRcdFx0dGhzLmNzcyh7b3BhY2l0eTowfSlcclxuXHRcdFx0XHQuYWRkQ2xhc3MoXCJhbmltYXRlZFwiKVxyXG5cdFx0XHRcdC53YXlwb2ludChmdW5jdGlvbihkaXIpIHtcclxuXHRcdFx0XHRcdGlmIChkaXIgPT09IFwiZG93blwiKSB7XHJcblx0XHRcdFx0XHRcdHRocy5hZGRDbGFzcyhpbkVmZmVjdCkuY3NzKHtvcGFjaXR5OjF9KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdG9mZnNldDogXCI5MCVcIlxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fTtcclxuXHJcblx0JChcImhlYWRlciAuc3ZnLWhlYWRpbmcsIC50YWxrcyAuc3ZnLWhlYWRpbmcsIC50YWxrcyAudGVzdGltb25pYWxcIikuYW5pbWF0ZWQoXCJmYWRlSW5VcFwiKTtcclxuXHQkKFwiLmFib3V0LW1lX19za2lsbHM+ZGl2XCIpLmFuaW1hdGVkKFwiZmFkZUluVXBcIik7XHJcblx0JChcIi5hcnRpY2xlLCAucG9ydGZvbGlvLXNsaWRlcl9fbmF2aWdhdGlvbi1jb250YWluZXIsIC5wb3J0Zm9saW8tc2xpZGVyX19wcmV2aWV3LWNvbnRhaW5lclwiKS5hbmltYXRlZChcImZhZGVJblwiKTtcclxuXHQkKFwiLnBvcnRmb2xpby1zbGlkZXJfX3Byb2plY3RzLWNvbnRhaW5lclwiKS5hbmltYXRlZChcImZhZGVJblwiKTtcclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFBpZWNoYXJ0cyBhbmltYXRpb25cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQkKFwiLnBpZWNoYXJ0IC5waWVjaGFydF9fZmlsbFwiKS5lYWNoKGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgcGllID0gJCh0aGlzKTtcclxuXHRcdHBpZS53YXlwb2ludChmdW5jdGlvbihkaXIpIHtcclxuXHRcdFx0aWYgKGRpciA9PT0gXCJkb3duXCIpIHtcclxuXHRcdFx0XHRwaWUuY3NzKHtzdHJva2VEYXNob2Zmc2V0OnBpZS5kYXRhKFwicGVyY2VudGFnZVwiKX0pO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0b2Zmc2V0OiBcIjkwJVwiXHJcblx0XHRcdH0pO1xyXG5cdH0pO1xyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gUGFyYWxsYXhcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHR2YXIgaXNfdGhpc19pZSA9IGRldGVjdF9JRSgpO1xyXG5cclxuXHQvLyBJRSBzY3JvbGwganVtcCBmaXhcclxuXHRpZihpc190aGlzX2llKSB7XHJcblx0XHQkKFwiLmxheWVyXCIpLmNzcyh7dHJhbnNpdGlvbjpcInRvcCAuMTVzIGxpbmVhclwifSk7XHJcblx0XHQkKFwiI3NjZW5lLnZlcnRpY2FsXCIpLmNzcyh7dHJhbnNpdGlvbjpcIm9wYWNpdHkgLjE1cyBsaW5lYXJcIn0pO1xyXG5cclxuXHRcdCQoXCJib2R5XCIpLm9uKFwibW91c2V3aGVlbFwiLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IFxyXG5cclxuXHRcdFx0dmFyIHdoZWVsRGVsdGEgPSBldmVudC53aGVlbERlbHRhLFxyXG5cdFx0XHRcdGN1cnJlbnRTY3JvbGxQb3NpdGlvbiA9IHdpbmRvdy5wYWdlWU9mZnNldDtcclxuXHJcblx0XHRcdHdpbmRvdy5zY3JvbGxUbygwLCBjdXJyZW50U2Nyb2xsUG9zaXRpb24gLSB3aGVlbERlbHRhKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0aWYoJChcIiNzY2VuZS5heGlzXCIpLmxlbmd0aCl7XHJcblx0XHQkKFwiI3NjZW5lLmF4aXNcIikucGFyYWxsYXgoe1xyXG5cdFx0XHRzY2FsYXJYOiAzLFxyXG5cdFx0XHRzY2FsYXJZOiAzLFxyXG5cdFx0XHRmcmljdGlvblg6IDAuNSxcclxuXHRcdFx0ZnJpY3Rpb25ZOiAwLjVcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0aWYoJChcIiNzY2VuZS52ZXJ0aWNhbFwiKSl7XHJcblx0XHQkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgc2Nyb2xsUG9zID0gJCh0aGlzKS5zY3JvbGxUb3AoKTtcclxuXHJcblx0XHRcdCQoXCIjc2NlbmUudmVydGljYWwgLmxheWVyXCIpLmVhY2goZnVuY3Rpb24oKXtcclxuXHRcdFx0XHR2YXIgbGF5ZXIgPSAkKHRoaXMpO1xyXG5cclxuXHRcdFx0XHRpZihsYXllci5pbmRleCgpICE9MCApIHtcclxuXHRcdFx0XHRcdGxheWVyLmNzcyh7XHJcblx0XHRcdFx0XHRcdFwidG9wXCIgOiAoIChzY3JvbGxQb3MvKDUgKyAyKmxheWVyLmluZGV4KCkpKSApK1wicHhcIlxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0JChcIiNzY2VuZS52ZXJ0aWNhbFwiKS5jc3Moe1xyXG5cdFx0XHRcdFwib3BhY2l0eVwiIDogMS0oc2Nyb2xsUG9zLzcwMClcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIExvZ2luIGNhcmQgZmxpcFxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdCQoXCIubG9naW4tYnV0dG9uXCIpLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG5cdFx0JChcImJvZHlcIikuYWRkQ2xhc3MoXCJjYXJkX2ZsaXBwZWRcIik7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjdW5mbGlwLWNhcmRcIikuY2xpY2soZnVuY3Rpb24oKSB7XHJcblx0XHQkKFwiYm9keVwiKS5yZW1vdmVDbGFzcyhcImNhcmRfZmxpcHBlZFwiKTtcclxuXHR9KTtcclxuXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBNYWluIG1lbnVcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQkKFwiI21lbnUtdG9nZ2xlXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHQkKHRoaXMpLmFkZChcIi5tYWluLW1lbnVcIikudG9nZ2xlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIubWFpbi1tZW51X19pdGVtXCIpLmVhY2goZnVuY3Rpb24oaW5kZXgpIHtcclxuXHRcdCQodGhpcykuY3NzKFwidHJhbnNpdGlvbi1kZWxheVwiLCAwLjMrMC4xKmluZGV4ICsgXCJzXCIpO1xyXG5cdH0pO1xyXG5cclxuXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBCdXR0b25zXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0JChcImJ1dHRvbi5nby1kb3duXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgZ28gPSAkKHRoaXMpLmRhdGEoXCJsaW5rXCIpO1xyXG5cdFx0JChcImh0bWwsIGJvZHlcIikuc3RvcCgpLmFuaW1hdGUoe1xyXG5cdFx0XHRzY3JvbGxUb3A6ICQoZ28pLm9mZnNldCgpLnRvcFxyXG5cdFx0fSwgNzAwLCBcInN3aW5nXCIpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiYnV0dG9uLmdvLXVwXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHQkKFwiaHRtbCwgYm9keVwiKS5zdG9wKCkuYW5pbWF0ZSh7XHJcblx0XHRcdHNjcm9sbFRvcDogMFxyXG5cdFx0fSwgNzAwLCBcInN3aW5nXCIpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fdG9nZ2xlXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvblwiKS50b2dnbGVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHR9KTtcclxuXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBTbGlkZXJcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRmdW5jdGlvbiBwcmVwYXJlX3RpdGxlKHRpdGxlX2NvbnRhaW5lcil7XHJcblx0XHR2YXIgbGV0dGVycyA9ICQudHJpbSh0aXRsZV9jb250YWluZXIudGV4dCgpKSxcclxuXHRcdFx0bmV3X3RpdGxlID0gXCJcIjtcclxuXHJcblx0XHR0aXRsZV9jb250YWluZXIuaHRtbChcIlwiKTtcclxuXHJcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbGV0dGVycy5sZW5ndGg7IGkrKyl7XHJcblx0XHRcdHZhciB0ZXh0ID0gXCI8c3BhbiBjbGFzcz0nbGV0dGVyJz5cIiArIGxldHRlcnNbaV0gKyBcIjwvc3Bhbj5cIjtcclxuXHJcblx0XHRcdGlmKGk9PTApe1xyXG5cdFx0XHRcdHRleHQgPSBcIjxzcGFuIGNsYXNzPSd3b3JkJz5cIiArIHRleHQ7XHJcblx0XHRcdH1cclxuXHJcblxyXG5cdFx0XHRpZihsZXR0ZXJzW2ldID09IFwiIFwiIHx8IGxldHRlcnNbaV0gPT0gXCImbmJzcDtcIil7XHJcblx0XHRcdFx0dGV4dCA9IFwiPC9zcGFuPjxzcGFuIGNsYXNzPSdsZXR0ZXInPiZuYnNwOzwvc3Bhbj48c3BhbiBjbGFzcz0nd29yZCc+XCI7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKGkgPT0gbGV0dGVycy5sZW5ndGgtMSkge1xyXG5cdFx0XHRcdHRleHQgPSB0ZXh0ICsgXCI8L3NwYW4+XCI7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdG5ld190aXRsZSArPSB0ZXh0O1xyXG5cdFx0fVxyXG5cclxuXHRcdHRpdGxlX2NvbnRhaW5lci5hcHBlbmQobmV3X3RpdGxlKTtcclxuXHR9XHJcblxyXG5cdGlmKCQoXCIucG9ydGZvbGlvLXNsaWRlclwiKS5sZW5ndGgpe1xyXG5cdFx0JChcIi5wb3J0Zm9saW8tcHJvamVjdHMgLnByb2plY3RfX3RpdGxlXCIpLmVhY2goZnVuY3Rpb24oKSB7XHJcblx0XHRcdHByZXBhcmVfdGl0bGUoJCh0aGlzKSk7XHJcblx0XHR9KTtcclxuXHJcblx0XHQkKFwiLnBvcnRmb2xpby1wcm9qZWN0cyAucHJvamVjdFwiKS5mYWRlT3V0KDApO1xyXG5cdFx0JChcIi5wb3J0Zm9saW8tcHJvamVjdHMgLnByb2plY3QuYWN0aXZlXCIpLmZhZGVJbig3MDApO1xyXG5cclxuXHRcdCQoXCIucG9ydGZvbGlvLXByb2plY3RzIC5hY3RpdmUgLnByb2plY3RfX3RpdGxlIC5sZXR0ZXJcIikuYWRkQ2xhc3MoXCJzaG93XCIpO1xyXG5cdH1cclxuXHJcblxyXG5cdCQoXCIucG9ydGZvbGlvLWJ1dHRvblwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0dmFyIHRoaXNfYnV0dG9uID0gJCh0aGlzKSxcclxuXHRcdFx0dGhpc190aHVtYm5haWxzID0gdGhpc19idXR0b24ubmV4dCgpLmZpbmQoXCIucG9ydGZvbGlvLXRodW1ibmFpbHNfX3RodW1ibmFpbFwiKSxcclxuXHRcdFx0dGhpc19hY3RpdmVfdGh1bWIgPSB0aGlzX3RodW1ibmFpbHMuZmlsdGVyKFwiLmFjdGl2ZVwiKSxcclxuXHRcdFx0dGhpc19uZXh0X2luZGV4ID0gdGhpc190aHVtYm5haWxzLmluZGV4KHRoaXNfYWN0aXZlX3RodW1iKTtcclxuXHJcblx0XHR2YXIgb3RoZXJfYnV0dG9uID0gdGhpc19idXR0b24ucGFyZW50KCkuc2libGluZ3MoKS5maW5kKFwiLnBvcnRmb2xpby1idXR0b25cIiksXHJcblx0XHRcdG90aGVyX3RodW1ibmFpbHMgPSBvdGhlcl9idXR0b24ubmV4dCgpLmZpbmQoXCIucG9ydGZvbGlvLXRodW1ibmFpbHNfX3RodW1ibmFpbFwiKSxcclxuXHRcdFx0b3RoZXJfYWN0aXZlX3RodW1iID0gb3RoZXJfdGh1bWJuYWlscy5maWx0ZXIoXCIuYWN0aXZlXCIpLFxyXG5cdFx0XHRvdGhlcl9uZXh0X2luZGV4ID0gb3RoZXJfdGh1bWJuYWlscy5pbmRleChvdGhlcl9hY3RpdmVfdGh1bWIpO1xyXG5cclxuXHRcdHZhciBhY3RpdmVfcHJldmlldyA9IHRoaXNfYnV0dG9uLmNsb3Nlc3QoXCIucG9ydGZvbGlvLXNsaWRlclwiKS5maW5kKFwiLnBvcnRmb2xpby1wcmV2aWV3XCIpLFxyXG5cdFx0XHRuZXh0X3ByZXZpZXcgPSB0aGlzX2FjdGl2ZV90aHVtYi5maW5kKFwiaW1nXCIpLmF0dHIoXCJzcmNcIiksXHJcblx0XHRcdHByb2plY3RzID0gdGhpc19idXR0b24uY2xvc2VzdChcIi5wb3J0Zm9saW8tc2xpZGVyXCIpLmZpbmQoXCIucG9ydGZvbGlvLXByb2plY3RzIC5wcm9qZWN0XCIpLFxyXG5cdFx0XHRhY3RpdmVfcHJvamVjdCA9IHByb2plY3RzLmZpbHRlcihcIi5hY3RpdmVcIiksXHJcblx0XHRcdG5leHRfcHJvamVjdF9pbmRleCA9IHByb2plY3RzLmluZGV4KGFjdGl2ZV9wcm9qZWN0KTtcclxuXHJcblx0XHRpZih0aGlzX2J1dHRvbi5oYXNDbGFzcyhcInBvcnRmb2xpby1idXR0b25fbmV4dFwiKSkge1xyXG5cdFx0XHRuZXh0X3Byb2plY3RfaW5kZXgrKztcclxuXHRcdFx0dGhpc19uZXh0X2luZGV4Kys7XHJcblx0XHRcdG90aGVyX25leHRfaW5kZXgrKztcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdG5leHRfcHJvamVjdF9pbmRleC0tO1xyXG5cdFx0XHR0aGlzX25leHRfaW5kZXgtLTtcclxuXHRcdFx0b3RoZXJfbmV4dF9pbmRleC0tO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmKHRoaXNfbmV4dF9pbmRleCA+PSB0aGlzX3RodW1ibmFpbHMubGVuZ3RoKXtcclxuXHRcdFx0dGhpc19uZXh0X2luZGV4ID0gMDtcclxuXHRcdH1cclxuXHJcblx0XHRpZihvdGhlcl9uZXh0X2luZGV4ID49IG90aGVyX3RodW1ibmFpbHMubGVuZ3RoKXtcclxuXHRcdFx0b3RoZXJfbmV4dF9pbmRleCA9IDA7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYobmV4dF9wcm9qZWN0X2luZGV4ID49IHByb2plY3RzLmxlbmd0aCl7XHJcblx0XHRcdG5leHRfcHJvamVjdF9pbmRleCA9IDA7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIHRoaXNfbmV4dF90aHVtYiA9IHRoaXNfdGh1bWJuYWlscy5lcSh0aGlzX25leHRfaW5kZXgpLFxyXG5cdFx0XHRvdGhlcl9uZXh0X3RodW1iID0gb3RoZXJfdGh1bWJuYWlscy5lcShvdGhlcl9uZXh0X2luZGV4KSxcclxuXHRcdFx0bmV4dF9wcm9qZWN0ID0gcHJvamVjdHMuZXEobmV4dF9wcm9qZWN0X2luZGV4KSxcclxuXHRcdFx0bmV4dF9wcm9qZWN0X3RpdGxlID0gbmV4dF9wcm9qZWN0LmZpbmQoXCIucHJvamVjdF9fdGl0bGVcIik7XHJcblxyXG5cclxuXHRcdHRoaXNfYnV0dG9uLnByb3AoXCJkaXNhYmxlZFwiLCB0cnVlKTtcclxuXHRcdG90aGVyX2J1dHRvbi5wcm9wKFwiZGlzYWJsZWRcIiwgdHJ1ZSk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gY2hhbmdlX3RoaXNfdGh1bWIoKXtcclxuXHRcdFx0dGhpc19hY3RpdmVfdGh1bWIuYW5pbWF0ZSh7XHJcblx0XHRcdFx0dG9wOiBcIi0xMDAlXCJcclxuXHRcdFx0fSwgNzAwKTtcclxuXHJcblx0XHRcdHRoaXNfbmV4dF90aHVtYi5jc3Moe3RvcDpcIjEwMCVcIn0pO1xyXG5cdFx0XHR0aGlzX25leHRfdGh1bWIuYW5pbWF0ZSh7XHJcblx0XHRcdFx0dG9wOiAwXHJcblx0XHRcdH0sIDcwMCwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dGhpc19hY3RpdmVfdGh1bWIucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIikuY3NzKHt0b3A6XCIxMDAlXCJ9KTtcclxuXHRcdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHRcdHRoaXNfYnV0dG9uLnByb3AoXCJkaXNhYmxlZFwiLCBmYWxzZSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIGNoYW5nZV9vdGhlcl90aHVtYigpe1xyXG5cdFx0XHRvdGhlcl9hY3RpdmVfdGh1bWIuYW5pbWF0ZSh7XHJcblx0XHRcdFx0dG9wOiBcIjEwMCVcIlxyXG5cdFx0XHR9LCA3MDApO1xyXG5cclxuXHRcdFx0b3RoZXJfbmV4dF90aHVtYi5jc3Moe3RvcDpcIi0xMDAlXCJ9KTtcclxuXHRcdFx0b3RoZXJfbmV4dF90aHVtYi5hbmltYXRlKHtcclxuXHRcdFx0XHR0b3A6IDBcclxuXHRcdFx0fSwgNzAwLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRvdGhlcl9hY3RpdmVfdGh1bWIucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIikuY3NzKHt0b3A6XCItMTAwJVwifSk7XHJcblx0XHRcdFx0JCh0aGlzKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0XHRvdGhlcl9idXR0b24ucHJvcChcImRpc2FibGVkXCIsIGZhbHNlKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gY2hhbmdlX3ByZXZpZXcoKXtcclxuXHRcdFx0YWN0aXZlX3ByZXZpZXcuZmFkZU91dCgzNTAsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0JCh0aGlzKS5hdHRyKFwic3JjXCIsIG5leHRfcHJldmlldykuZmFkZUluKDM1MCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRmdW5jdGlvbiBjaGFuZ2VfcHJvamVjdCgpe1xyXG5cdFx0XHR2YXIgcHJqX2xldHRlcnMgPSBuZXh0X3Byb2plY3RfdGl0bGUuZmluZChcInNwYW4ubGV0dGVyXCIpLnJlbW92ZUNsYXNzKFwic2hvd1wiKTtcclxuXHJcblx0XHRcdGFjdGl2ZV9wcm9qZWN0LmZhZGVPdXQoMzUwLCBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHRcdFx0bmV4dF9wcm9qZWN0LmFkZENsYXNzKFwiYWN0aXZlXCIpLmZhZGVJbigzNTApO1xyXG5cclxuXHRcdFx0XHRwcmpfbGV0dGVycy5lYWNoKGZ1bmN0aW9uKGluZGV4KXtcclxuXHRcdFx0XHRcdCQodGhpcykuY3NzKHtcInRyYW5zaXRpb24tZGVsYXlcIjogKDAuMzUvcHJqX2xldHRlcnMubGVuZ3RoKSooaW5kZXgrMSkgKyBcInNcIn0pXHJcblx0XHRcdFx0XHRcdFx0LmFkZENsYXNzKFwic2hvd1wiKTtcclxuXHRcdFx0XHR9KTtcclxuXHJcblxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Y2hhbmdlX3RoaXNfdGh1bWIoKTtcclxuXHRcdGNoYW5nZV9vdGhlcl90aHVtYigpO1xyXG5cdFx0Y2hhbmdlX3ByZXZpZXcoKTtcclxuXHRcdGNoYW5nZV9wcm9qZWN0KCk7XHJcblx0fSk7XHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBTQ1JPTEwgRVZFTlRTXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG5cdC8vIFNDUk9MTCBOQVZJR0FUSU9OIEJFR0lOXHJcblx0dmFyIGxhc3RJZCxcclxuXHRcdG1lbnUgPSAkKFwiLmJsb2ctbmF2aWdhdGlvblwiKSxcclxuXHRcdG1lbnVJdGVtcyA9IG1lbnUuZmluZChcImxpIGFcIiksXHJcblx0XHRzY3JvbGxJdGVtcyA9IG1lbnVJdGVtcy5tYXAoZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIGl0ZW0gPSAkKCQodGhpcykuYXR0cihcImhyZWZcIikpO1xyXG5cdFx0XHRpZiAoaXRlbS5sZW5ndGgpIHJldHVybiBpdGVtO1xyXG5cdFx0fSk7XHJcblxyXG5cdC8vIEJpbmQgY2xpY2sgaGFuZGxlciB0byBtZW51IGl0ZW1zXHJcblx0Ly8gc28gd2UgY2FuIGdldCBhIGZhbmN5IHNjcm9sbCBhbmltYXRpb25cclxuXHRtZW51SXRlbXMuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0XHR2YXIgaHJlZiA9ICQodGhpcykuYXR0cihcImhyZWZcIiksXHJcblx0XHRcdG9mZnNldFRvcCA9IChocmVmID09PSBcIiNcIikgPyAwIDogJChocmVmKS5vZmZzZXQoKS50b3AtNjA7XHJcblx0XHRcclxuXHRcdCQoXCJodG1sLCBib2R5XCIpLnN0b3AoKS5hbmltYXRlKHsgXHJcblx0XHRcdHNjcm9sbFRvcDogb2Zmc2V0VG9wXHJcblx0XHR9LCA3MDAsIFwic3dpbmdcIik7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0fSk7XHJcblxyXG5cdC8vIEJpbmQgdG8gc2Nyb2xsXHJcblx0aWYoJChcIi5ibG9nLW5hdmlnYXRpb25cIikub2Zmc2V0KCkpe1xyXG5cdFx0JCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpIHtcclxuXHRcdFx0Ly8gR2V0IGNvbnRhaW5lciBzY3JvbGwgcG9zaXRpb25cclxuXHRcdFx0dmFyIGZyb21Ub3AgPSAkKHRoaXMpLnNjcm9sbFRvcCgpLFxyXG5cdFx0XHRcdGJsb2dOYXZPZmZzZXQgPSAkKFwiLmJsb2ctbmF2aWdhdGlvblwiKS5vZmZzZXQoKS50b3AsXHJcblx0XHRcdFx0YmxvZ05hdkxpbWl0ID0gJChcIi5mb290ZXJfX3dyYXBwZXJcIikub2Zmc2V0KCkudG9wIC0gJChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikub3V0ZXJIZWlnaHQoKTtcclxuXHJcblx0XHRcdC8vIEdldCBpZCBvZiBjdXJyZW50IHNjcm9sbCBpdGVtXHJcblx0XHRcdHZhciBjdXIgPSBzY3JvbGxJdGVtcy5tYXAoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRpZiAoJCh0aGlzKS5vZmZzZXQoKS50b3AgPCBmcm9tVG9wKzE0NClcclxuXHRcdFx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0Ly8gR2V0IHRoZSBpZCBvZiB0aGUgY3VycmVudCBlbGVtZW50XHJcblx0XHRcdGN1ciA9IGN1cltjdXIubGVuZ3RoLTFdO1xyXG5cdFx0XHR2YXIgaWQgPSBjdXIgJiYgY3VyLmxlbmd0aCA/IGN1clswXS5pZCA6IFwiXCI7XHJcblxyXG5cdFx0XHRpZiAobGFzdElkICE9PSBpZCkge1xyXG5cdFx0XHRcdGxhc3RJZCA9IGlkO1xyXG5cdFx0XHRcdC8vIFNldC9yZW1vdmUgYWN0aXZlIGNsYXNzXHJcblx0XHRcdFx0bWVudUl0ZW1zXHJcblx0XHRcdFx0LnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpXHJcblx0XHRcdFx0LmZpbHRlcihcIltocmVmPSNcIitpZCtcIl1cIilcclxuXHRcdFx0XHQuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKGZyb21Ub3AgPj0gYmxvZ05hdkxpbWl0ICYmICQod2luZG93KS53aWR0aCgpID4gKDc2OCAtIHNjcm9sbEJhcldpZHRoKSkge1xyXG5cdFx0XHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uX193cmFwcGVyXCIpLmNzcyh7XCJwb3NpdGlvblwiOlwiYWJzb2x1dGVcIiwgXCJ0b3BcIjpibG9nTmF2TGltaXQgKyBcInB4XCJ9KTtcclxuXHRcdFx0fSBlbHNlIGlmIChmcm9tVG9wID49IGJsb2dOYXZPZmZzZXQgJiYgJCh3aW5kb3cpLndpZHRoKCkgPiAoNzY4IC0gc2Nyb2xsQmFyV2lkdGgpKSB7XHJcblx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikuY3NzKHtcInBvc2l0aW9uXCI6XCJmaXhlZFwiLCBcInRvcFwiOjB9KTtcclxuXHRcdFx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5hZGRDbGFzcyhcIm5hdi1maXhlZFwiKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5jc3Moe1wicG9zaXRpb25cIjpcInJlbGF0aXZlXCJ9KTtcclxuXHRcdFx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5yZW1vdmVDbGFzcyhcIm5hdi1maXhlZFwiKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH0pO1xyXG5cdH1cclxuXHQvLyBTQ1JPTEwgTkFWSUdBVElPTiBFTkRcclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFJFU0laRSBFVkVOVFNcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRpZigkKFwiLmJsb2ctbmF2aWdhdGlvblwiKS5vZmZzZXQoKSl7XHJcblx0XHQkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpZigkKHdpbmRvdykud2lkdGgoKSA8PSAoNzY4IC0gc2Nyb2xsQmFyV2lkdGgpKXtcclxuXHRcdFx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5yZW1vdmVDbGFzcyhcIm5hdi1maXhlZFwiKTtcclxuXHRcdFx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5jc3Moe1wicG9zaXRpb25cIjpcInJlbGF0aXZlXCJ9KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpZigkKFwiYm9keVwiKS5zY3JvbGxUb3AoKSA+PSAkKFwiLmJsb2dcIikub2Zmc2V0KCkudG9wKXtcclxuXHRcdFx0XHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uX193cmFwcGVyXCIpLmNzcyh7XCJwb3NpdGlvblwiOlwiZml4ZWRcIiwgXCJ0b3BcIjowfSk7XHJcblx0XHRcdFx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5hZGRDbGFzcyhcIm5hdi1maXhlZFwiKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblxyXG5cdCQod2luZG93KS5yZXNpemUoZnVuY3Rpb24oKSB7XHJcblx0XHQvLyBUZXN0aW1vbmlhbHMgc2VjdGlvbiBiZyBzaXplXHJcblx0XHRpZiggJCh3aW5kb3cpLndpZHRoKCk+MjAwMCAtIHNjcm9sbEJhcldpZHRoKXtcclxuXHRcdFx0JChcIi50YWxrcywgLmNvbnRhY3QtZm9ybV9fYmdcIikuY3NzKFwiYmFja2dyb3VuZC1zaXplXCIsICQod2luZG93KS53aWR0aCgpICsgXCJweFwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFByZWxvYWRlciB3aXRoIHBlcmNlbnRhZ2UgYnkgaW50ZXJ2YWxcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBmdW5jdGlvbiBwcmVsb2FkZXIoKSB7XHJcblx0Ly8gXHR2YXIgZHVyYXRpb24gPSAxMDAwO1xyXG5cdC8vIFx0dmFyIHN0ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcblxyXG5cdC8vIFx0dmFyICRjaXJjbGVfX28gPSAkKFwiI3ByZWxvYWRlci1zdmdfX2ltZyAuYmFyX19vdXRlclwiKSxcclxuXHQvLyBcdFx0JGNpcmNsZV9fYyA9ICQoXCIjcHJlbG9hZGVyLXN2Z19faW1nIC5iYXJfX2NlbnRlclwiKSxcclxuXHQvLyBcdFx0JGNpcmNsZV9faSA9ICQoXCIjcHJlbG9hZGVyLXN2Z19faW1nIC5iYXJfX2lubmVyXCIpO1xyXG5cclxuXHQvLyBcdHZhciBjX28gPSBNYXRoLlBJKigkY2lyY2xlX19vLmF0dHIoXCJyXCIpICogMiksXHJcblx0Ly8gXHRcdGNfYyA9IE1hdGguUEkqKCRjaXJjbGVfX2MuYXR0cihcInJcIikgKiAyKSxcclxuXHQvLyBcdFx0Y19pID0gTWF0aC5QSSooJGNpcmNsZV9faS5hdHRyKFwiclwiKSAqIDIpO1xyXG5cclxuXHJcblx0Ly8gXHR2YXIgaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcclxuXHQvLyBcdFx0dmFyIGRpZmYgPSBNYXRoLnJvdW5kKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gc3QpLFxyXG5cdC8vIFx0XHRcdHZhbCA9IE1hdGgucm91bmQoZGlmZiAvIGR1cmF0aW9uICogMTAwKTtcclxuXHJcblx0Ly8gXHRcdHZhbCA9IHZhbCA+IDEwMCA/IDEwMCA6IHZhbDtcclxuXHJcblx0Ly8gXHRcdHZhciBwY3RfbyA9ICgoMTAwLXZhbCkvMTAwKSpjX28sXHJcblx0Ly8gXHRcdFx0cGN0X2MgPSAoKDEwMC12YWwpLzEwMCkqY19jLFxyXG5cdC8vIFx0XHRcdHBjdF9pID0gKCgxMDAtdmFsKS8xMDApKmNfaTtcclxuXHJcblx0Ly8gXHRcdCRjaXJjbGVfX28uY3NzKHtzdHJva2VEYXNob2Zmc2V0OiBwY3Rfb30pO1xyXG5cdC8vIFx0XHQkY2lyY2xlX19jLmNzcyh7c3Ryb2tlRGFzaG9mZnNldDogcGN0X2N9KTtcclxuXHQvLyBcdFx0JGNpcmNsZV9faS5jc3Moe3N0cm9rZURhc2hvZmZzZXQ6IHBjdF9pfSk7XHJcblxyXG5cdC8vIFx0XHQkKFwiI3ByZWxvYWRlci1zdmdfX3BlcmNlbnRhZ2VcIikudGV4dCh2YWwpO1xyXG5cdC8vIFx0XHQkKFwiI3ByZWxvYWRlci1zdmdfX2ltZ1wiKS5jc3Moe29wYWNpdHk6MX0pO1xyXG5cclxuXHQvLyBcdFx0aWYgKGRpZmYgPj0gZHVyYXRpb24pIHtcclxuXHQvLyBcdFx0XHRjbGVhckludGVydmFsKGludGVydmFsKTtcclxuXHJcblx0Ly8gXHRcdFx0aWYoJChcIi5mbGlwLWNhcmRcIikubGVuZ3RoKXtcclxuXHQvLyBcdFx0XHRcdCQoXCIjcHJlbG9hZGVyXCIpLmRlbGF5KDEwMDApLmZhZGVPdXQoNzAwLCBmdW5jdGlvbigpe1xyXG5cdC8vIFx0XHRcdFx0XHQkKFwiI3ByZWxvYWRlcl9fcHJvZ3Jlc3NcIikucmVtb3ZlKCk7XHJcblx0Ly8gXHRcdFx0XHRcdCQoXCIuZmxpcC1jYXJkXCIpLmFkZENsYXNzKFwibG9hZGVkXCIpO1xyXG5cdC8vIFx0XHRcdFx0fSk7XHJcblx0Ly8gXHRcdFx0fSBlbHNlIHtcclxuXHQvLyBcdFx0XHRcdCQoXCIjcHJlbG9hZGVyXCIpLmRlbGF5KDEwMDApLmZhZGVPdXQoNzAwLCBmdW5jdGlvbigpe1xyXG5cdC8vIFx0XHRcdFx0XHQkKFwiI3ByZWxvYWRlcl9fcHJvZ3Jlc3NcIikucmVtb3ZlKCk7XHJcblx0Ly8gXHRcdFx0XHR9KTtcclxuXHQvLyBcdFx0XHR9XHJcblx0Ly8gXHRcdH1cclxuXHQvLyBcdH0sIDIwMCk7XHJcblx0Ly8gfVxyXG5cdC8vIHByZWxvYWRlcigpO1xyXG5cclxuXHJcbn0pKGpRdWVyeSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
