(function($) {
	"use strict";

	// ==============================
	// Check scrollbar width
	// ==============================
	var widthContentA = $("#scroll_bar_check_A").width(),
		widthContentB = $("#scroll_bar_check_B").width();

	var scrollBarWidth = widthContentA - widthContentB;

	$("#scroll_bar_check_A").css("display","none");





	// ==========================================
	// Preloader with percentage by image count
	// ==========================================
	function preloader() {
		// if($(window).width() <= (768 - scrollBarWidth)){
		// 	$("#preloader").remove();
		// 		if($(".flip-card").length){
		// 			$(".flip-card").addClass("loaded");
		// 		}
		// 		return;
		// }


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
		}


		preloader_stat.css({opacity: 1});

		var i = total;
		function images_loop () {
			setTimeout(function () {
				var test_image = new Image();

				test_image.onload = img_loaded;
				test_image.onerror = img_loaded;
				i--;

				if (all_images[i].srcset) {
					test_image.srcset = all_images[i].srcset;
				}
				test_image.src = all_images[i].src;

				if (i > 0) {
					images_loop();
				}
			}, 50);
		}

		images_loop();

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
			layer.css({
				"top" : ((scrollPos/30)*layer.index())+"px"
			});
		});
		// $("#scene.vertical").css({
		// 	'opacity' : 1-(scrollPos/700)
		// });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCQpIHtcclxuXHRcInVzZSBzdHJpY3RcIjtcclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gQ2hlY2sgc2Nyb2xsYmFyIHdpZHRoXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0dmFyIHdpZHRoQ29udGVudEEgPSAkKFwiI3Njcm9sbF9iYXJfY2hlY2tfQVwiKS53aWR0aCgpLFxyXG5cdFx0d2lkdGhDb250ZW50QiA9ICQoXCIjc2Nyb2xsX2Jhcl9jaGVja19CXCIpLndpZHRoKCk7XHJcblxyXG5cdHZhciBzY3JvbGxCYXJXaWR0aCA9IHdpZHRoQ29udGVudEEgLSB3aWR0aENvbnRlbnRCO1xyXG5cclxuXHQkKFwiI3Njcm9sbF9iYXJfY2hlY2tfQVwiKS5jc3MoXCJkaXNwbGF5XCIsXCJub25lXCIpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gUHJlbG9hZGVyIHdpdGggcGVyY2VudGFnZSBieSBpbWFnZSBjb3VudFxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIHByZWxvYWRlcigpIHtcclxuXHRcdC8vIGlmKCQod2luZG93KS53aWR0aCgpIDw9ICg3NjggLSBzY3JvbGxCYXJXaWR0aCkpe1xyXG5cdFx0Ly8gXHQkKFwiI3ByZWxvYWRlclwiKS5yZW1vdmUoKTtcclxuXHRcdC8vIFx0XHRpZigkKFwiLmZsaXAtY2FyZFwiKS5sZW5ndGgpe1xyXG5cdFx0Ly8gXHRcdFx0JChcIi5mbGlwLWNhcmRcIikuYWRkQ2xhc3MoXCJsb2FkZWRcIik7XHJcblx0XHQvLyBcdFx0fVxyXG5cdFx0Ly8gXHRcdHJldHVybjtcclxuXHRcdC8vIH1cclxuXHJcblxyXG5cdFx0dmFyIHByZWxvYWRlcl9zdGF0ID0gJChcIiNwcmVsb2FkZXItc3ZnX19wZXJjZW50YWdlXCIpLFxyXG5cdFx0XHRoYXNJbWFnZVByb3BlcnRpZXMgPSBbXCJiYWNrZ3JvdW5kSW1hZ2VcIiwgXCJsaXN0U3R5bGVJbWFnZVwiLCBcImJvcmRlckltYWdlXCIsIFwiYm9yZGVyQ29ybmVySW1hZ2VcIiwgXCJjdXJzb3JcIl0sXHJcblx0XHRcdGhhc0ltYWdlQXR0cmlidXRlcyA9IFtcInNyY3NldFwiXSxcclxuXHRcdFx0bWF0Y2hfdXJsID0gL3VybFxcKFxccyooWydcIl0/KSguKj8pXFwxXFxzKlxcKS9nLFxyXG5cdFx0XHRhbGxfaW1hZ2VzID0gW10sXHJcblx0XHRcdHRvdGFsID0gMCxcclxuXHRcdFx0Y291bnQgPSAwO1xyXG5cclxuXHRcdHZhciBjaXJjbGVfbyA9ICQoXCIjcHJlbG9hZGVyLXN2Z19faW1nIC5iYXJfX291dGVyXCIpLFxyXG5cdFx0XHRjaXJjbGVfYyA9ICQoXCIjcHJlbG9hZGVyLXN2Z19faW1nIC5iYXJfX2NlbnRlclwiKSxcclxuXHRcdFx0Y2lyY2xlX2kgPSAkKFwiI3ByZWxvYWRlci1zdmdfX2ltZyAuYmFyX19pbm5lclwiKSxcclxuXHRcdFx0bGVuZ3RoX28gPSBNYXRoLlBJKihjaXJjbGVfby5hdHRyKFwiclwiKSAqIDIpLFxyXG5cdFx0XHRsZW5ndGhfYyA9IE1hdGguUEkqKGNpcmNsZV9jLmF0dHIoXCJyXCIpICogMiksXHJcblx0XHRcdGxlbmd0aF9pID0gTWF0aC5QSSooY2lyY2xlX2kuYXR0cihcInJcIikgKiAyKTtcclxuXHJcblxyXG5cdFx0ZnVuY3Rpb24gaW1nX2xvYWRlZCgpe1xyXG5cdFx0XHR2YXIgcGVyY2VudGFnZSA9IE1hdGguY2VpbCggKytjb3VudCAvIHRvdGFsICogMTAwICk7XHJcblxyXG5cdFx0XHRwZXJjZW50YWdlID0gcGVyY2VudGFnZSA+IDEwMCA/IDEwMCA6IHBlcmNlbnRhZ2U7XHJcblxyXG5cdFx0XHQvLyBEcmF3IG9mZnNldHNcclxuXHRcdFx0Y2lyY2xlX28uY3NzKHtzdHJva2VEYXNob2Zmc2V0OiAoKDEwMC1wZXJjZW50YWdlKS8xMDApKmxlbmd0aF9vIH0pO1xyXG5cclxuXHRcdFx0aWYocGVyY2VudGFnZSA+IDUwKSB7XHJcblx0XHRcdFx0Y2lyY2xlX2MuY3NzKHtzdHJva2VEYXNob2Zmc2V0OiAoKDEwMC1wZXJjZW50YWdlKS8xMDApKmxlbmd0aF9jIH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZihwZXJjZW50YWdlID09IDEwMCkge1xyXG5cdFx0XHRcdGNpcmNsZV9pLmNzcyh7c3Ryb2tlRGFzaG9mZnNldDogKCgxMDAtcGVyY2VudGFnZSkvMTAwKSpsZW5ndGhfaSB9KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cHJlbG9hZGVyX3N0YXQuaHRtbChwZXJjZW50YWdlKTtcclxuXHJcblx0XHRcdGlmKGNvdW50ID09PSB0b3RhbCkgcmV0dXJuIGRvbmVfbG9hZGluZygpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIGRvbmVfbG9hZGluZygpe1xyXG5cdFx0XHQkKFwiI3ByZWxvYWRlclwiKS5kZWxheSg3MDApLmZhZGVPdXQoNzAwLCBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdCQoXCIjcHJlbG9hZGVyX19wcm9ncmVzc1wiKS5yZW1vdmUoKTtcclxuXHJcblx0XHRcdFx0aWYoJChcIi5mbGlwLWNhcmRcIikubGVuZ3RoKXtcclxuXHRcdFx0XHRcdCQoXCIuZmxpcC1jYXJkXCIpLmFkZENsYXNzKFwibG9hZGVkXCIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdCQoXCIqXCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG5cdFx0XHR2YXIgZWxlbWVudCA9ICQodGhpcyk7XHJcblxyXG5cdFx0XHRpZiAoZWxlbWVudC5pcyhcImltZ1wiKSAmJiBlbGVtZW50LmF0dHIoXCJzcmNcIikpIHtcclxuXHRcdFx0XHRhbGxfaW1hZ2VzLnB1c2goe1xyXG5cdFx0XHRcdFx0c3JjOiBlbGVtZW50LmF0dHIoXCJzcmNcIiksXHJcblx0XHRcdFx0XHRlbGVtZW50OiBlbGVtZW50WzBdXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdCQuZWFjaChoYXNJbWFnZVByb3BlcnRpZXMsIGZ1bmN0aW9uIChpLCBwcm9wZXJ0eSkge1xyXG5cdFx0XHRcdHZhciBwcm9wZXJ0eVZhbHVlID0gZWxlbWVudC5jc3MocHJvcGVydHkpO1xyXG5cdFx0XHRcdHZhciBtYXRjaDtcclxuXHJcblx0XHRcdFx0aWYgKCFwcm9wZXJ0eVZhbHVlKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdG1hdGNoID0gbWF0Y2hfdXJsLmV4ZWMocHJvcGVydHlWYWx1ZSk7XHJcblxyXG5cdFx0XHRcdGlmIChtYXRjaCkge1xyXG5cdFx0XHRcdFx0YWxsX2ltYWdlcy5wdXNoKHtcclxuXHRcdFx0XHRcdFx0c3JjOiBtYXRjaFsyXSxcclxuXHRcdFx0XHRcdFx0ZWxlbWVudDogZWxlbWVudFswXVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdCQuZWFjaChoYXNJbWFnZUF0dHJpYnV0ZXMsIGZ1bmN0aW9uIChpLCBhdHRyaWJ1dGUpIHtcclxuXHRcdFx0XHR2YXIgYXR0cmlidXRlVmFsdWUgPSBlbGVtZW50LmF0dHIoYXR0cmlidXRlKTtcclxuXHJcblx0XHRcdFx0aWYgKCFhdHRyaWJ1dGVWYWx1ZSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRhbGxfaW1hZ2VzLnB1c2goe1xyXG5cdFx0XHRcdFx0c3JjOiBlbGVtZW50LmF0dHIoXCJzcmNcIiksXHJcblx0XHRcdFx0XHRzcmNzZXQ6IGVsZW1lbnQuYXR0cihcInNyY3NldFwiKSxcclxuXHRcdFx0XHRcdGVsZW1lbnQ6IGVsZW1lbnRbMF1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHJcblxyXG5cdFx0dG90YWwgPSBhbGxfaW1hZ2VzLmxlbmd0aDtcclxuXHJcblx0XHRpZiAodG90YWwgPT09IDApIHtcclxuXHRcdFx0ZG9uZV9sb2FkaW5nKCk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHByZWxvYWRlcl9zdGF0LmNzcyh7b3BhY2l0eTogMX0pO1xyXG5cclxuXHRcdHZhciBpID0gdG90YWw7XHJcblx0XHRmdW5jdGlvbiBpbWFnZXNfbG9vcCAoKSB7XHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHZhciB0ZXN0X2ltYWdlID0gbmV3IEltYWdlKCk7XHJcblxyXG5cdFx0XHRcdHRlc3RfaW1hZ2Uub25sb2FkID0gaW1nX2xvYWRlZDtcclxuXHRcdFx0XHR0ZXN0X2ltYWdlLm9uZXJyb3IgPSBpbWdfbG9hZGVkO1xyXG5cdFx0XHRcdGktLTtcclxuXHJcblx0XHRcdFx0aWYgKGFsbF9pbWFnZXNbaV0uc3Jjc2V0KSB7XHJcblx0XHRcdFx0XHR0ZXN0X2ltYWdlLnNyY3NldCA9IGFsbF9pbWFnZXNbaV0uc3Jjc2V0O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0ZXN0X2ltYWdlLnNyYyA9IGFsbF9pbWFnZXNbaV0uc3JjO1xyXG5cclxuXHRcdFx0XHRpZiAoaSA+IDApIHtcclxuXHRcdFx0XHRcdGltYWdlc19sb29wKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LCA1MCk7XHJcblx0XHR9XHJcblxyXG5cdFx0aW1hZ2VzX2xvb3AoKTtcclxuXHJcblx0XHQvLyBmb3IodmFyIGk9MDsgaTx0b3RhbDsgaSsrKXtcclxuXHRcdC8vIFx0dmFyIHRlc3RfaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuXHJcblxyXG5cdFx0Ly8gXHR0ZXN0X2ltYWdlLm9ubG9hZCA9IGltZ19sb2FkZWQ7XHJcblx0XHQvLyBcdHRlc3RfaW1hZ2Uub25lcnJvciA9IGltZ19sb2FkZWQ7XHJcblxyXG5cdFx0Ly8gXHRpZiAoYWxsX2ltYWdlc1tpXS5zcmNzZXQpIHtcclxuXHRcdC8vIFx0XHR0ZXN0X2ltYWdlLnNyY3NldCA9IGFsbF9pbWFnZXNbaV0uc3Jjc2V0O1xyXG5cdFx0Ly8gXHR9XHJcblx0XHQvLyBcdHRlc3RfaW1hZ2Uuc3JjID0gYWxsX2ltYWdlc1tpXS5zcmM7XHJcblx0XHQvLyB9XHJcblx0fVxyXG5cclxuXHRwcmVsb2FkZXIoKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFBhZ2UgY2hhbmdlclxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdCQoZG9jdW1lbnQpLm9uKFwiY2xpY2tcIiwgXCJhLnByZWxvYWQtbGlua1wiLCBmdW5jdGlvbihlKSB7XHJcblx0XHR2YXIgaHJlZiA9ICQodGhpcykuYXR0cihcImhyZWZcIik7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0cmV0dXJuICQoXCIjcHJlbG9hZGVyXCIpXHJcblx0XHRcdC5mYWRlSW4oMzAwLCBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHJldHVybiBkb2N1bWVudC5sb2NhdGlvbiA9IGhyZWYgIT0gbnVsbCA/IGhyZWYgOiBcIi9cIjtcclxuXHRcdFx0fSk7XHJcblx0fSk7XHJcblxyXG5cclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIEFuaW1hdGlvbnNcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQkLmZuLmFuaW1hdGVkID0gZnVuY3Rpb24oaW5FZmZlY3QpIHtcclxuXHRcdCQodGhpcykuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHRocyA9ICQodGhpcyk7XHJcblx0XHRcdHRocy5jc3Moe29wYWNpdHk6MH0pXHJcblx0XHRcdFx0LmFkZENsYXNzKFwiYW5pbWF0ZWRcIilcclxuXHRcdFx0XHQud2F5cG9pbnQoZnVuY3Rpb24oZGlyKSB7XHJcblx0XHRcdFx0XHRpZiAoZGlyID09PSBcImRvd25cIikge1xyXG5cdFx0XHRcdFx0XHR0aHMuYWRkQ2xhc3MoaW5FZmZlY3QpLmNzcyh7b3BhY2l0eToxfSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRvZmZzZXQ6IFwiOTAlXCJcclxuXHRcdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH07XHJcblxyXG5cdCQoXCJoZWFkZXIgLnN2Zy1oZWFkaW5nLCAudGFsa3MgLnN2Zy1oZWFkaW5nLCAudGFsa3MgLnRlc3RpbW9uaWFsXCIpLmFuaW1hdGVkKFwiZmFkZUluVXBcIik7XHJcblx0JChcIi5wb3J0Zm9saW8tc2xpZGVyX19tb2R1bGU+ZGl2LCAuYWJvdXQtbWVfX3NraWxscz5kaXZcIikuYW5pbWF0ZWQoXCJmYWRlSW5VcFwiKTtcclxuXHQkKFwiLmFydGljbGVcIikuYW5pbWF0ZWQoXCJmYWRlSW5cIik7XHJcblxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gUGllY2hhcnRzIGFuaW1hdGlvblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdCQoXCIucGllY2hhcnQgLnBpZWNoYXJ0X19maWxsXCIpLmVhY2goZnVuY3Rpb24oKXtcclxuXHRcdHZhciBwaWUgPSAkKHRoaXMpO1xyXG5cdFx0cGllLndheXBvaW50KGZ1bmN0aW9uKGRpcikge1xyXG5cdFx0XHRpZiAoZGlyID09PSBcImRvd25cIikge1xyXG5cdFx0XHRcdHBpZS5jc3Moe3N0cm9rZURhc2hvZmZzZXQ6cGllLmRhdGEoXCJwZXJjZW50YWdlXCIpfSk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRvZmZzZXQ6IFwiOTAlXCJcclxuXHRcdFx0fSk7XHJcblx0fSk7XHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBQYXJhbGxheFxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdCQoXCIjc2NlbmUuYXhpc1wiKS5wYXJhbGxheCh7XHJcblx0XHRzY2FsYXJYOiAzLFxyXG5cdFx0c2NhbGFyWTogMyxcclxuXHRcdGZyaWN0aW9uWDogMC41LFxyXG5cdFx0ZnJpY3Rpb25ZOiAwLjVcclxuXHR9KTtcclxuXHJcblx0JCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpIHtcclxuXHRcdHZhciBzY3JvbGxQb3MgPSAkKHRoaXMpLnNjcm9sbFRvcCgpO1xyXG5cdFx0JChcIiNzY2VuZS52ZXJ0aWNhbCAubGF5ZXJcIikuZWFjaChmdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgbGF5ZXIgPSAkKHRoaXMpO1xyXG5cdFx0XHRsYXllci5jc3Moe1xyXG5cdFx0XHRcdFwidG9wXCIgOiAoKHNjcm9sbFBvcy8zMCkqbGF5ZXIuaW5kZXgoKSkrXCJweFwiXHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0XHQvLyAkKFwiI3NjZW5lLnZlcnRpY2FsXCIpLmNzcyh7XHJcblx0XHQvLyBcdCdvcGFjaXR5JyA6IDEtKHNjcm9sbFBvcy83MDApXHJcblx0XHQvLyB9KTtcclxuXHR9KTtcclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gTG9naW4gY2FyZCBmbGlwXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0JChcIi5sb2dpbi1idXR0b25cIikuY2xpY2soZnVuY3Rpb24oKSB7XHJcblx0XHQkKFwiYm9keVwiKS5hZGRDbGFzcyhcImNhcmRfZmxpcHBlZFwiKTtcclxuXHR9KTtcclxuXHJcblx0JChcIiN1bmZsaXAtY2FyZFwiKS5jbGljayhmdW5jdGlvbigpIHtcclxuXHRcdCQoXCJib2R5XCIpLnJlbW92ZUNsYXNzKFwiY2FyZF9mbGlwcGVkXCIpO1xyXG5cdH0pO1xyXG5cclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIE1haW4gbWVudVxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdCQoXCIjbWVudS10b2dnbGVcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdCQodGhpcykuYWRkKFwiLm1haW4tbWVudVwiKS50b2dnbGVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHR9KTtcclxuXHJcblx0JChcIi5tYWluLW1lbnVfX2l0ZW1cIikuZWFjaChmdW5jdGlvbihpbmRleCkge1xyXG5cdFx0JCh0aGlzKS5jc3MoXCJ0cmFuc2l0aW9uLWRlbGF5XCIsIDAuMyswLjEqaW5kZXggKyBcInNcIik7XHJcblx0fSk7XHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBCdXR0b25zXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0JChcImJ1dHRvbi5nby1kb3duXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgZ28gPSAkKHRoaXMpLmRhdGEoXCJsaW5rXCIpO1xyXG5cdFx0JChcImh0bWwsIGJvZHlcIikuc3RvcCgpLmFuaW1hdGUoe1xyXG5cdFx0XHRzY3JvbGxUb3A6ICQoZ28pLm9mZnNldCgpLnRvcFxyXG5cdFx0fSwgNzAwLCBcInN3aW5nXCIpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiYnV0dG9uLmdvLXVwXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHQkKFwiaHRtbCwgYm9keVwiKS5zdG9wKCkuYW5pbWF0ZSh7XHJcblx0XHRcdHNjcm9sbFRvcDogMFxyXG5cdFx0fSwgNzAwLCBcInN3aW5nXCIpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fdG9nZ2xlXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvblwiKS50b2dnbGVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHR9KTtcclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFNDUk9MTCBFVkVOVFNcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcblx0Ly8gU0NST0xMIE5BVklHQVRJT04gQkVHSU5cclxuXHR2YXIgbGFzdElkLFxyXG5cdFx0bWVudSA9ICQoXCIuYmxvZy1uYXZpZ2F0aW9uXCIpLFxyXG5cdFx0bWVudUl0ZW1zID0gbWVudS5maW5kKFwibGkgYVwiKSxcclxuXHRcdHNjcm9sbEl0ZW1zID0gbWVudUl0ZW1zLm1hcChmdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgaXRlbSA9ICQoJCh0aGlzKS5hdHRyKFwiaHJlZlwiKSk7XHJcblx0XHRcdGlmIChpdGVtLmxlbmd0aCkgcmV0dXJuIGl0ZW07XHJcblx0XHR9KTtcclxuXHJcblx0Ly8gQmluZCBjbGljayBoYW5kbGVyIHRvIG1lbnUgaXRlbXNcclxuXHQvLyBzbyB3ZSBjYW4gZ2V0IGEgZmFuY3kgc2Nyb2xsIGFuaW1hdGlvblxyXG5cdG1lbnVJdGVtcy5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdHZhciBocmVmID0gJCh0aGlzKS5hdHRyKFwiaHJlZlwiKSxcclxuXHRcdFx0b2Zmc2V0VG9wID0gKGhyZWYgPT09IFwiI1wiKSA/IDAgOiAkKGhyZWYpLm9mZnNldCgpLnRvcC02MDtcclxuXHRcdFxyXG5cdFx0JChcImh0bWwsIGJvZHlcIikuc3RvcCgpLmFuaW1hdGUoeyBcclxuXHRcdFx0c2Nyb2xsVG9wOiBvZmZzZXRUb3BcclxuXHRcdH0sIDcwMCwgXCJzd2luZ1wiKTtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHR9KTtcclxuXHJcblx0Ly8gQmluZCB0byBzY3JvbGxcclxuXHRpZigkKFwiLmJsb2ctbmF2aWdhdGlvblwiKS5vZmZzZXQoKSl7XHJcblx0XHQkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQvLyBHZXQgY29udGFpbmVyIHNjcm9sbCBwb3NpdGlvblxyXG5cdFx0XHR2YXIgZnJvbVRvcCA9ICQodGhpcykuc2Nyb2xsVG9wKCksXHJcblx0XHRcdFx0YmxvZ05hdk9mZnNldCA9ICQoXCIuYmxvZy1uYXZpZ2F0aW9uXCIpLm9mZnNldCgpLnRvcCxcclxuXHRcdFx0XHRibG9nTmF2TGltaXQgPSAkKFwiLmZvb3Rlcl9fd3JhcHBlclwiKS5vZmZzZXQoKS50b3AgLSAkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5vdXRlckhlaWdodCgpO1xyXG5cclxuXHRcdFx0Ly8gR2V0IGlkIG9mIGN1cnJlbnQgc2Nyb2xsIGl0ZW1cclxuXHRcdFx0dmFyIGN1ciA9IHNjcm9sbEl0ZW1zLm1hcChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdGlmICgkKHRoaXMpLm9mZnNldCgpLnRvcCA8IGZyb21Ub3ArMTQ0KVxyXG5cdFx0XHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHQvLyBHZXQgdGhlIGlkIG9mIHRoZSBjdXJyZW50IGVsZW1lbnRcclxuXHRcdFx0Y3VyID0gY3VyW2N1ci5sZW5ndGgtMV07XHJcblx0XHRcdHZhciBpZCA9IGN1ciAmJiBjdXIubGVuZ3RoID8gY3VyWzBdLmlkIDogXCJcIjtcclxuXHJcblx0XHRcdGlmIChsYXN0SWQgIT09IGlkKSB7XHJcblx0XHRcdFx0bGFzdElkID0gaWQ7XHJcblx0XHRcdFx0Ly8gU2V0L3JlbW92ZSBhY3RpdmUgY2xhc3NcclxuXHRcdFx0XHRtZW51SXRlbXNcclxuXHRcdFx0XHQucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIilcclxuXHRcdFx0XHQuZmlsdGVyKFwiW2hyZWY9I1wiK2lkK1wiXVwiKVxyXG5cdFx0XHRcdC5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYoZnJvbVRvcCA+PSBibG9nTmF2TGltaXQgJiYgJCh3aW5kb3cpLndpZHRoKCkgPiAoNzY4IC0gc2Nyb2xsQmFyV2lkdGgpKSB7XHJcblx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikuY3NzKHtcInBvc2l0aW9uXCI6XCJhYnNvbHV0ZVwiLCBcInRvcFwiOmJsb2dOYXZMaW1pdCArIFwicHhcIn0pO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGZyb21Ub3AgPj0gYmxvZ05hdk9mZnNldCAmJiAkKHdpbmRvdykud2lkdGgoKSA+ICg3NjggLSBzY3JvbGxCYXJXaWR0aCkpIHtcclxuXHRcdFx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5jc3Moe1wicG9zaXRpb25cIjpcImZpeGVkXCIsIFwidG9wXCI6MH0pO1xyXG5cdFx0XHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uX193cmFwcGVyXCIpLmFkZENsYXNzKFwibmF2LWZpeGVkXCIpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uX193cmFwcGVyXCIpLmNzcyh7XCJwb3NpdGlvblwiOlwicmVsYXRpdmVcIn0pO1xyXG5cdFx0XHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uX193cmFwcGVyXCIpLnJlbW92ZUNsYXNzKFwibmF2LWZpeGVkXCIpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSk7XHJcblx0fVxyXG5cdC8vIFNDUk9MTCBOQVZJR0FUSU9OIEVORFxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gUkVTSVpFIEVWRU5UU1xyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGlmKCQoXCIuYmxvZy1uYXZpZ2F0aW9uXCIpLm9mZnNldCgpKXtcclxuXHRcdCQod2luZG93KS5yZXNpemUoZnVuY3Rpb24oKSB7XHJcblx0XHRcdGlmKCQod2luZG93KS53aWR0aCgpIDw9ICg3NjggLSBzY3JvbGxCYXJXaWR0aCkpe1xyXG5cdFx0XHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uX193cmFwcGVyXCIpLnJlbW92ZUNsYXNzKFwibmF2LWZpeGVkXCIpO1xyXG5cdFx0XHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uX193cmFwcGVyXCIpLmNzcyh7XCJwb3NpdGlvblwiOlwicmVsYXRpdmVcIn0pO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlmKCQoXCJib2R5XCIpLnNjcm9sbFRvcCgpID49ICQoXCIuYmxvZ1wiKS5vZmZzZXQoKS50b3Ape1xyXG5cdFx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikuY3NzKHtcInBvc2l0aW9uXCI6XCJmaXhlZFwiLCBcInRvcFwiOjB9KTtcclxuXHRcdFx0XHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uX193cmFwcGVyXCIpLmFkZENsYXNzKFwibmF2LWZpeGVkXCIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHJcblx0JCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbigpIHtcclxuXHRcdC8vIFRlc3RpbW9uaWFscyBzZWN0aW9uIGJnIHNpemVcclxuXHRcdGlmKCAkKHdpbmRvdykud2lkdGgoKT4yMDAwIC0gc2Nyb2xsQmFyV2lkdGgpe1xyXG5cdFx0XHQkKFwiLnRhbGtzLCAuY29udGFjdC1mb3JtX19iZ1wiKS5jc3MoXCJiYWNrZ3JvdW5kLXNpemVcIiwgJCh3aW5kb3cpLndpZHRoKCkgKyBcInB4XCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gUHJlbG9hZGVyIHdpdGggcGVyY2VudGFnZSBieSBpbnRlcnZhbFxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIGZ1bmN0aW9uIHByZWxvYWRlcigpIHtcclxuXHQvLyBcdHZhciBkdXJhdGlvbiA9IDEwMDA7XHJcblx0Ly8gXHR2YXIgc3QgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuXHJcblx0Ly8gXHR2YXIgJGNpcmNsZV9fbyA9ICQoXCIjcHJlbG9hZGVyLXN2Z19faW1nIC5iYXJfX291dGVyXCIpLFxyXG5cdC8vIFx0XHQkY2lyY2xlX19jID0gJChcIiNwcmVsb2FkZXItc3ZnX19pbWcgLmJhcl9fY2VudGVyXCIpLFxyXG5cdC8vIFx0XHQkY2lyY2xlX19pID0gJChcIiNwcmVsb2FkZXItc3ZnX19pbWcgLmJhcl9faW5uZXJcIik7XHJcblxyXG5cdC8vIFx0dmFyIGNfbyA9IE1hdGguUEkqKCRjaXJjbGVfX28uYXR0cihcInJcIikgKiAyKSxcclxuXHQvLyBcdFx0Y19jID0gTWF0aC5QSSooJGNpcmNsZV9fYy5hdHRyKFwiclwiKSAqIDIpLFxyXG5cdC8vIFx0XHRjX2kgPSBNYXRoLlBJKigkY2lyY2xlX19pLmF0dHIoXCJyXCIpICogMik7XHJcblxyXG5cclxuXHQvLyBcdHZhciBpbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xyXG5cdC8vIFx0XHR2YXIgZGlmZiA9IE1hdGgucm91bmQobmV3IERhdGUoKS5nZXRUaW1lKCkgLSBzdCksXHJcblx0Ly8gXHRcdFx0dmFsID0gTWF0aC5yb3VuZChkaWZmIC8gZHVyYXRpb24gKiAxMDApO1xyXG5cclxuXHQvLyBcdFx0dmFsID0gdmFsID4gMTAwID8gMTAwIDogdmFsO1xyXG5cclxuXHQvLyBcdFx0dmFyIHBjdF9vID0gKCgxMDAtdmFsKS8xMDApKmNfbyxcclxuXHQvLyBcdFx0XHRwY3RfYyA9ICgoMTAwLXZhbCkvMTAwKSpjX2MsXHJcblx0Ly8gXHRcdFx0cGN0X2kgPSAoKDEwMC12YWwpLzEwMCkqY19pO1xyXG5cclxuXHQvLyBcdFx0JGNpcmNsZV9fby5jc3Moe3N0cm9rZURhc2hvZmZzZXQ6IHBjdF9vfSk7XHJcblx0Ly8gXHRcdCRjaXJjbGVfX2MuY3NzKHtzdHJva2VEYXNob2Zmc2V0OiBwY3RfY30pO1xyXG5cdC8vIFx0XHQkY2lyY2xlX19pLmNzcyh7c3Ryb2tlRGFzaG9mZnNldDogcGN0X2l9KTtcclxuXHJcblx0Ly8gXHRcdCQoXCIjcHJlbG9hZGVyLXN2Z19fcGVyY2VudGFnZVwiKS50ZXh0KHZhbCk7XHJcblx0Ly8gXHRcdCQoXCIjcHJlbG9hZGVyLXN2Z19faW1nXCIpLmNzcyh7b3BhY2l0eToxfSk7XHJcblxyXG5cdC8vIFx0XHRpZiAoZGlmZiA+PSBkdXJhdGlvbikge1xyXG5cdC8vIFx0XHRcdGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xyXG5cclxuXHQvLyBcdFx0XHRpZigkKFwiLmZsaXAtY2FyZFwiKS5sZW5ndGgpe1xyXG5cdC8vIFx0XHRcdFx0JChcIiNwcmVsb2FkZXJcIikuZGVsYXkoMTAwMCkuZmFkZU91dCg3MDAsIGZ1bmN0aW9uKCl7XHJcblx0Ly8gXHRcdFx0XHRcdCQoXCIjcHJlbG9hZGVyX19wcm9ncmVzc1wiKS5yZW1vdmUoKTtcclxuXHQvLyBcdFx0XHRcdFx0JChcIi5mbGlwLWNhcmRcIikuYWRkQ2xhc3MoXCJsb2FkZWRcIik7XHJcblx0Ly8gXHRcdFx0XHR9KTtcclxuXHQvLyBcdFx0XHR9IGVsc2Uge1xyXG5cdC8vIFx0XHRcdFx0JChcIiNwcmVsb2FkZXJcIikuZGVsYXkoMTAwMCkuZmFkZU91dCg3MDAsIGZ1bmN0aW9uKCl7XHJcblx0Ly8gXHRcdFx0XHRcdCQoXCIjcHJlbG9hZGVyX19wcm9ncmVzc1wiKS5yZW1vdmUoKTtcclxuXHQvLyBcdFx0XHRcdH0pO1xyXG5cdC8vIFx0XHRcdH1cclxuXHQvLyBcdFx0fVxyXG5cdC8vIFx0fSwgMjAwKTtcclxuXHQvLyB9XHJcblx0Ly8gcHJlbG9hZGVyKCk7XHJcblxyXG5cclxufSkoalF1ZXJ5KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
