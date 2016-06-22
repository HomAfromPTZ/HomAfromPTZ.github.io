(function($) {
	"use strict";

	// ==============================
	// Check scrollbar width
	// ==============================
	var widthContentA = $("#scroll_bar_check_A").width(),
		widthContentB = $("#scroll_bar_check_B").width();

	var scrollBarWidth = widthContentA - widthContentB;

	$("#scroll_bar_check_A").css("display","none");




	console.log(window.location.pathname);
	if(window.location.pathname=="/xhrtest.html"){
		$.ajax({
			xhr: function() {
				var xhr = new window.XMLHttpRequest();

				// //Upload progress
				// xhr.upload.addEventListener("progress", function(evt){
				// 	if (evt.lengthComputable) {
				// 		var percentComplete = evt.loaded / evt.total;

				// 		//Do something with upload progress
				// 		console.log(percentComplete);
				// 	}
				// }, false);

				//Download progress
				xhr.addEventListener("progress", function(evt){
					if (evt.lengthComputable) {
						var percentComplete = evt.loaded / evt.total;

						//Do something with download progress
						console.time("Execution time took");
						console.log(percentComplete);
						console.timeEnd("Execution time took");
					}
				}, false);
				return xhr;
			},
			type: "POST",
			url: window.location.pathname,
			data: {},
			success: function(data){
				// $("#preloader").delay(700).fadeOut(700, function(){
				// 	$("#preloader__progress").remove();

				// 	if($(".flip-card").length){
				// 		$(".flip-card").addClass("loaded");
				// 	}
				// });
				console.log("Complete");
			}
		});
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigkKSB7XHJcblx0XCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIENoZWNrIHNjcm9sbGJhciB3aWR0aFxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdHZhciB3aWR0aENvbnRlbnRBID0gJChcIiNzY3JvbGxfYmFyX2NoZWNrX0FcIikud2lkdGgoKSxcclxuXHRcdHdpZHRoQ29udGVudEIgPSAkKFwiI3Njcm9sbF9iYXJfY2hlY2tfQlwiKS53aWR0aCgpO1xyXG5cclxuXHR2YXIgc2Nyb2xsQmFyV2lkdGggPSB3aWR0aENvbnRlbnRBIC0gd2lkdGhDb250ZW50QjtcclxuXHJcblx0JChcIiNzY3JvbGxfYmFyX2NoZWNrX0FcIikuY3NzKFwiZGlzcGxheVwiLFwibm9uZVwiKTtcclxuXHJcblxyXG5cclxuXHJcblx0Y29uc29sZS5sb2cod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lKTtcclxuXHRpZih3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU9PVwiL3hocnRlc3QuaHRtbFwiKXtcclxuXHRcdCQuYWpheCh7XHJcblx0XHRcdHhocjogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyIHhociA9IG5ldyB3aW5kb3cuWE1MSHR0cFJlcXVlc3QoKTtcclxuXHJcblx0XHRcdFx0Ly8gLy9VcGxvYWQgcHJvZ3Jlc3NcclxuXHRcdFx0XHQvLyB4aHIudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoXCJwcm9ncmVzc1wiLCBmdW5jdGlvbihldnQpe1xyXG5cdFx0XHRcdC8vIFx0aWYgKGV2dC5sZW5ndGhDb21wdXRhYmxlKSB7XHJcblx0XHRcdFx0Ly8gXHRcdHZhciBwZXJjZW50Q29tcGxldGUgPSBldnQubG9hZGVkIC8gZXZ0LnRvdGFsO1xyXG5cclxuXHRcdFx0XHQvLyBcdFx0Ly9EbyBzb21ldGhpbmcgd2l0aCB1cGxvYWQgcHJvZ3Jlc3NcclxuXHRcdFx0XHQvLyBcdFx0Y29uc29sZS5sb2cocGVyY2VudENvbXBsZXRlKTtcclxuXHRcdFx0XHQvLyBcdH1cclxuXHRcdFx0XHQvLyB9LCBmYWxzZSk7XHJcblxyXG5cdFx0XHRcdC8vRG93bmxvYWQgcHJvZ3Jlc3NcclxuXHRcdFx0XHR4aHIuYWRkRXZlbnRMaXN0ZW5lcihcInByb2dyZXNzXCIsIGZ1bmN0aW9uKGV2dCl7XHJcblx0XHRcdFx0XHRpZiAoZXZ0Lmxlbmd0aENvbXB1dGFibGUpIHtcclxuXHRcdFx0XHRcdFx0dmFyIHBlcmNlbnRDb21wbGV0ZSA9IGV2dC5sb2FkZWQgLyBldnQudG90YWw7XHJcblxyXG5cdFx0XHRcdFx0XHQvL0RvIHNvbWV0aGluZyB3aXRoIGRvd25sb2FkIHByb2dyZXNzXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUudGltZShcIkV4ZWN1dGlvbiB0aW1lIHRvb2tcIik7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKHBlcmNlbnRDb21wbGV0ZSk7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUudGltZUVuZChcIkV4ZWN1dGlvbiB0aW1lIHRvb2tcIik7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSwgZmFsc2UpO1xyXG5cdFx0XHRcdHJldHVybiB4aHI7XHJcblx0XHRcdH0sXHJcblx0XHRcdHR5cGU6IFwiUE9TVFwiLFxyXG5cdFx0XHR1cmw6IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSxcclxuXHRcdFx0ZGF0YToge30sXHJcblx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdC8vICQoXCIjcHJlbG9hZGVyXCIpLmRlbGF5KDcwMCkuZmFkZU91dCg3MDAsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0Ly8gXHQkKFwiI3ByZWxvYWRlcl9fcHJvZ3Jlc3NcIikucmVtb3ZlKCk7XHJcblxyXG5cdFx0XHRcdC8vIFx0aWYoJChcIi5mbGlwLWNhcmRcIikubGVuZ3RoKXtcclxuXHRcdFx0XHQvLyBcdFx0JChcIi5mbGlwLWNhcmRcIikuYWRkQ2xhc3MoXCJsb2FkZWRcIik7XHJcblx0XHRcdFx0Ly8gXHR9XHJcblx0XHRcdFx0Ly8gfSk7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJDb21wbGV0ZVwiKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gUHJlbG9hZGVyIHdpdGggcGVyY2VudGFnZSBieSBpbWFnZSBjb3VudFxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdGZ1bmN0aW9uIHByZWxvYWRlcigpIHtcclxuXHRcdHZhciBwcmVsb2FkZXJfc3RhdCA9ICQoXCIjcHJlbG9hZGVyLXN2Z19fcGVyY2VudGFnZVwiKSxcclxuXHRcdFx0aGFzSW1hZ2VQcm9wZXJ0aWVzID0gW1wiYmFja2dyb3VuZEltYWdlXCIsIFwibGlzdFN0eWxlSW1hZ2VcIiwgXCJib3JkZXJJbWFnZVwiLCBcImJvcmRlckNvcm5lckltYWdlXCIsIFwiY3Vyc29yXCJdLFxyXG5cdFx0XHRoYXNJbWFnZUF0dHJpYnV0ZXMgPSBbXCJzcmNzZXRcIl0sXHJcblx0XHRcdG1hdGNoX3VybCA9IC91cmxcXChcXHMqKFsnXCJdPykoLio/KVxcMVxccypcXCkvZyxcclxuXHRcdFx0YWxsX2ltYWdlcyA9IFtdLFxyXG5cdFx0XHR0b3RhbCA9IDAsXHJcblx0XHRcdGNvdW50ID0gMDtcclxuXHJcblx0XHR2YXIgY2lyY2xlX28gPSAkKFwiI3ByZWxvYWRlci1zdmdfX2ltZyAuYmFyX19vdXRlclwiKSxcclxuXHRcdFx0Y2lyY2xlX2MgPSAkKFwiI3ByZWxvYWRlci1zdmdfX2ltZyAuYmFyX19jZW50ZXJcIiksXHJcblx0XHRcdGNpcmNsZV9pID0gJChcIiNwcmVsb2FkZXItc3ZnX19pbWcgLmJhcl9faW5uZXJcIiksXHJcblx0XHRcdGxlbmd0aF9vID0gTWF0aC5QSSooY2lyY2xlX28uYXR0cihcInJcIikgKiAyKSxcclxuXHRcdFx0bGVuZ3RoX2MgPSBNYXRoLlBJKihjaXJjbGVfYy5hdHRyKFwiclwiKSAqIDIpLFxyXG5cdFx0XHRsZW5ndGhfaSA9IE1hdGguUEkqKGNpcmNsZV9pLmF0dHIoXCJyXCIpICogMik7XHJcblxyXG5cclxuXHRcdGZ1bmN0aW9uIGltZ19sb2FkZWQoKXtcclxuXHRcdFx0dmFyIHBlcmNlbnRhZ2UgPSBNYXRoLmNlaWwoICsrY291bnQgLyB0b3RhbCAqIDEwMCApO1xyXG5cclxuXHRcdFx0cGVyY2VudGFnZSA9IHBlcmNlbnRhZ2UgPiAxMDAgPyAxMDAgOiBwZXJjZW50YWdlO1xyXG5cclxuXHRcdFx0Ly8gRHJhdyBvZmZzZXRzXHJcblx0XHRcdGNpcmNsZV9vLmNzcyh7c3Ryb2tlRGFzaG9mZnNldDogKCgxMDAtcGVyY2VudGFnZSkvMTAwKSpsZW5ndGhfbyB9KTtcclxuXHJcblx0XHRcdGlmKHBlcmNlbnRhZ2UgPiA1MCkge1xyXG5cdFx0XHRcdGNpcmNsZV9jLmNzcyh7c3Ryb2tlRGFzaG9mZnNldDogKCgxMDAtcGVyY2VudGFnZSkvMTAwKSpsZW5ndGhfYyB9KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYocGVyY2VudGFnZSA9PSAxMDApIHtcclxuXHRcdFx0XHRjaXJjbGVfaS5jc3Moe3N0cm9rZURhc2hvZmZzZXQ6ICgoMTAwLXBlcmNlbnRhZ2UpLzEwMCkqbGVuZ3RoX2kgfSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHByZWxvYWRlcl9zdGF0Lmh0bWwocGVyY2VudGFnZSk7XHJcblxyXG5cdFx0XHRpZihjb3VudCA9PT0gdG90YWwpIHJldHVybiBkb25lX2xvYWRpbmcoKTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBkb25lX2xvYWRpbmcoKXtcclxuXHRcdFx0JChcIiNwcmVsb2FkZXJcIikuZGVsYXkoNzAwKS5mYWRlT3V0KDcwMCwgZnVuY3Rpb24oKXtcclxuXHRcdFx0XHQkKFwiI3ByZWxvYWRlcl9fcHJvZ3Jlc3NcIikucmVtb3ZlKCk7XHJcblxyXG5cdFx0XHRcdGlmKCQoXCIuZmxpcC1jYXJkXCIpLmxlbmd0aCl7XHJcblx0XHRcdFx0XHQkKFwiLmZsaXAtY2FyZFwiKS5hZGRDbGFzcyhcImxvYWRlZFwiKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQkKFwiKlwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0dmFyIGVsZW1lbnQgPSAkKHRoaXMpO1xyXG5cclxuXHRcdFx0aWYgKGVsZW1lbnQuaXMoXCJpbWdcIikgJiYgZWxlbWVudC5hdHRyKFwic3JjXCIpKSB7XHJcblx0XHRcdFx0YWxsX2ltYWdlcy5wdXNoKHtcclxuXHRcdFx0XHRcdHNyYzogZWxlbWVudC5hdHRyKFwic3JjXCIpLFxyXG5cdFx0XHRcdFx0ZWxlbWVudDogZWxlbWVudFswXVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQkLmVhY2goaGFzSW1hZ2VQcm9wZXJ0aWVzLCBmdW5jdGlvbiAoaSwgcHJvcGVydHkpIHtcclxuXHRcdFx0XHR2YXIgcHJvcGVydHlWYWx1ZSA9IGVsZW1lbnQuY3NzKHByb3BlcnR5KTtcclxuXHRcdFx0XHR2YXIgbWF0Y2g7XHJcblxyXG5cdFx0XHRcdGlmICghcHJvcGVydHlWYWx1ZSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRtYXRjaCA9IG1hdGNoX3VybC5leGVjKHByb3BlcnR5VmFsdWUpO1xyXG5cclxuXHRcdFx0XHRpZiAobWF0Y2gpIHtcclxuXHRcdFx0XHRcdGFsbF9pbWFnZXMucHVzaCh7XHJcblx0XHRcdFx0XHRcdHNyYzogbWF0Y2hbMl0sXHJcblx0XHRcdFx0XHRcdGVsZW1lbnQ6IGVsZW1lbnRbMF1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQkLmVhY2goaGFzSW1hZ2VBdHRyaWJ1dGVzLCBmdW5jdGlvbiAoaSwgYXR0cmlidXRlKSB7XHJcblx0XHRcdFx0dmFyIGF0dHJpYnV0ZVZhbHVlID0gZWxlbWVudC5hdHRyKGF0dHJpYnV0ZSk7XHJcblxyXG5cdFx0XHRcdGlmICghYXR0cmlidXRlVmFsdWUpIHtcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0YWxsX2ltYWdlcy5wdXNoKHtcclxuXHRcdFx0XHRcdHNyYzogZWxlbWVudC5hdHRyKFwic3JjXCIpLFxyXG5cdFx0XHRcdFx0c3Jjc2V0OiBlbGVtZW50LmF0dHIoXCJzcmNzZXRcIiksXHJcblx0XHRcdFx0XHRlbGVtZW50OiBlbGVtZW50WzBdXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblxyXG5cclxuXHRcdHRvdGFsID0gYWxsX2ltYWdlcy5sZW5ndGg7XHJcblxyXG5cdFx0aWYgKHRvdGFsID09PSAwKSB7XHJcblx0XHRcdGRvbmVfbG9hZGluZygpO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRwcmVsb2FkZXJfc3RhdC5jc3Moe29wYWNpdHk6IDF9KTtcclxuXHJcblx0XHR2YXIgaSA9IHRvdGFsO1xyXG5cdFx0ZnVuY3Rpb24gaW1hZ2VzX2xvb3AgKCkge1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHR2YXIgdGVzdF9pbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG5cclxuXHRcdFx0XHR0ZXN0X2ltYWdlLm9ubG9hZCA9IGltZ19sb2FkZWQ7XHJcblx0XHRcdFx0dGVzdF9pbWFnZS5vbmVycm9yID0gaW1nX2xvYWRlZDtcclxuXHRcdFx0XHRpLS07XHJcblxyXG5cdFx0XHRcdGlmIChhbGxfaW1hZ2VzW2ldLnNyY3NldCkge1xyXG5cdFx0XHRcdFx0dGVzdF9pbWFnZS5zcmNzZXQgPSBhbGxfaW1hZ2VzW2ldLnNyY3NldDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGVzdF9pbWFnZS5zcmMgPSBhbGxfaW1hZ2VzW2ldLnNyYztcclxuXHJcblx0XHRcdFx0aWYgKGkgPiAwKSB7XHJcblx0XHRcdFx0XHRpbWFnZXNfbG9vcCgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSwgNTApO1xyXG5cdFx0fVxyXG5cclxuXHRcdGltYWdlc19sb29wKCk7XHJcblxyXG5cdFx0Ly8gZm9yKHZhciBpPTA7IGk8dG90YWw7IGkrKyl7XHJcblx0XHQvLyBcdHZhciB0ZXN0X2ltYWdlID0gbmV3IEltYWdlKCk7XHJcblxyXG5cclxuXHRcdC8vIFx0dGVzdF9pbWFnZS5vbmxvYWQgPSBpbWdfbG9hZGVkO1xyXG5cdFx0Ly8gXHR0ZXN0X2ltYWdlLm9uZXJyb3IgPSBpbWdfbG9hZGVkO1xyXG5cclxuXHRcdC8vIFx0aWYgKGFsbF9pbWFnZXNbaV0uc3Jjc2V0KSB7XHJcblx0XHQvLyBcdFx0dGVzdF9pbWFnZS5zcmNzZXQgPSBhbGxfaW1hZ2VzW2ldLnNyY3NldDtcclxuXHRcdC8vIFx0fVxyXG5cdFx0Ly8gXHR0ZXN0X2ltYWdlLnNyYyA9IGFsbF9pbWFnZXNbaV0uc3JjO1xyXG5cdFx0Ly8gfVxyXG5cdH1cclxuXHJcblx0cHJlbG9hZGVyKCk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBQYWdlIGNoYW5nZXJcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQkKGRvY3VtZW50KS5vbihcImNsaWNrXCIsIFwiYS5wcmVsb2FkLWxpbmtcIiwgZnVuY3Rpb24oZSkge1xyXG5cdFx0dmFyIGhyZWYgPSAkKHRoaXMpLmF0dHIoXCJocmVmXCIpO1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdHJldHVybiAkKFwiI3ByZWxvYWRlclwiKVxyXG5cdFx0XHQuZmFkZUluKDMwMCwgZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRyZXR1cm4gZG9jdW1lbnQubG9jYXRpb24gPSBocmVmICE9IG51bGwgPyBocmVmIDogXCIvXCI7XHJcblx0XHRcdH0pO1xyXG5cdH0pO1xyXG5cclxuXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBBbmltYXRpb25zXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0JC5mbi5hbmltYXRlZCA9IGZ1bmN0aW9uKGluRWZmZWN0KSB7XHJcblx0XHQkKHRoaXMpLmVhY2goZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciB0aHMgPSAkKHRoaXMpO1xyXG5cdFx0XHR0aHMuY3NzKHtvcGFjaXR5OjB9KVxyXG5cdFx0XHRcdC5hZGRDbGFzcyhcImFuaW1hdGVkXCIpXHJcblx0XHRcdFx0LndheXBvaW50KGZ1bmN0aW9uKGRpcikge1xyXG5cdFx0XHRcdFx0aWYgKGRpciA9PT0gXCJkb3duXCIpIHtcclxuXHRcdFx0XHRcdFx0dGhzLmFkZENsYXNzKGluRWZmZWN0KS5jc3Moe29wYWNpdHk6MX0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0b2Zmc2V0OiBcIjkwJVwiXHJcblx0XHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9O1xyXG5cclxuXHQkKFwiaGVhZGVyIC5zdmctaGVhZGluZywgLnRhbGtzIC5zdmctaGVhZGluZywgLnRhbGtzIC50ZXN0aW1vbmlhbFwiKS5hbmltYXRlZChcImZhZGVJblVwXCIpO1xyXG5cdCQoXCIucG9ydGZvbGlvLXNsaWRlcl9fbW9kdWxlPmRpdiwgLmFib3V0LW1lX19za2lsbHM+ZGl2XCIpLmFuaW1hdGVkKFwiZmFkZUluVXBcIik7XHJcblx0JChcIi5hcnRpY2xlXCIpLmFuaW1hdGVkKFwiZmFkZUluXCIpO1xyXG5cclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFBpZWNoYXJ0cyBhbmltYXRpb25cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQkKFwiLnBpZWNoYXJ0IC5waWVjaGFydF9fZmlsbFwiKS5lYWNoKGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgcGllID0gJCh0aGlzKTtcclxuXHRcdHBpZS53YXlwb2ludChmdW5jdGlvbihkaXIpIHtcclxuXHRcdFx0aWYgKGRpciA9PT0gXCJkb3duXCIpIHtcclxuXHRcdFx0XHRwaWUuY3NzKHtzdHJva2VEYXNob2Zmc2V0OnBpZS5kYXRhKFwicGVyY2VudGFnZVwiKX0pO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0b2Zmc2V0OiBcIjkwJVwiXHJcblx0XHRcdH0pO1xyXG5cdH0pO1xyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gUGFyYWxsYXhcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcblx0Ly8gSUUgc2Nyb2xsIGp1bXAgZml4XHJcblx0aWYobmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvVHJpZGVudFxcLzdcXC4vKSkge1xyXG5cdFx0JChcIi5sYXllclwiKS5jc3Moe3RyYW5zaXRpb246XCJ0b3AgLjE1cyBsaW5lYXJcIn0pO1xyXG5cdFx0JChcIiNzY2VuZS52ZXJ0aWNhbFwiKS5jc3Moe3RyYW5zaXRpb246XCJvcGFjaXR5IC4xNXMgbGluZWFyXCJ9KTtcclxuXHJcblx0XHQkKFwiYm9keVwiKS5vbihcIm1vdXNld2hlZWxcIiwgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpOyBcclxuXHJcblx0XHRcdHZhciB3aGVlbERlbHRhID0gZXZlbnQud2hlZWxEZWx0YSxcclxuXHRcdFx0XHRjdXJyZW50U2Nyb2xsUG9zaXRpb24gPSB3aW5kb3cucGFnZVlPZmZzZXQ7XHJcblxyXG5cdFx0XHR3aW5kb3cuc2Nyb2xsVG8oMCwgY3VycmVudFNjcm9sbFBvc2l0aW9uIC0gd2hlZWxEZWx0YSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdCQoXCIjc2NlbmUuYXhpc1wiKS5wYXJhbGxheCh7XHJcblx0XHRzY2FsYXJYOiAzLFxyXG5cdFx0c2NhbGFyWTogMyxcclxuXHRcdGZyaWN0aW9uWDogMC41LFxyXG5cdFx0ZnJpY3Rpb25ZOiAwLjVcclxuXHR9KTtcclxuXHJcblx0JCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpIHtcclxuXHRcdHZhciBzY3JvbGxQb3MgPSAkKHRoaXMpLnNjcm9sbFRvcCgpO1xyXG5cclxuXHRcdCQoXCIjc2NlbmUudmVydGljYWwgLmxheWVyXCIpLmVhY2goZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIGxheWVyID0gJCh0aGlzKTtcclxuXHJcblx0XHRcdGlmKGxheWVyLmluZGV4KCkgIT0wICkge1xyXG5cdFx0XHRcdGxheWVyLmNzcyh7XHJcblx0XHRcdFx0XHRcInRvcFwiIDogKCAoc2Nyb2xsUG9zLyg1ICsgMipsYXllci5pbmRleCgpKSkgKStcInB4XCJcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHQkKFwiI3NjZW5lLnZlcnRpY2FsXCIpLmNzcyh7XHJcblx0XHRcdFwib3BhY2l0eVwiIDogMS0oc2Nyb2xsUG9zLzcwMClcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBMb2dpbiBjYXJkIGZsaXBcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQkKFwiLmxvZ2luLWJ1dHRvblwiKS5jbGljayhmdW5jdGlvbigpIHtcclxuXHRcdCQoXCJib2R5XCIpLmFkZENsYXNzKFwiY2FyZF9mbGlwcGVkXCIpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiI3VuZmxpcC1jYXJkXCIpLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG5cdFx0JChcImJvZHlcIikucmVtb3ZlQ2xhc3MoXCJjYXJkX2ZsaXBwZWRcIik7XHJcblx0fSk7XHJcblxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gTWFpbiBtZW51XHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0JChcIiNtZW51LXRvZ2dsZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0JCh0aGlzKS5hZGQoXCIubWFpbi1tZW51XCIpLnRvZ2dsZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiLm1haW4tbWVudV9faXRlbVwiKS5lYWNoKGZ1bmN0aW9uKGluZGV4KSB7XHJcblx0XHQkKHRoaXMpLmNzcyhcInRyYW5zaXRpb24tZGVsYXlcIiwgMC4zKzAuMSppbmRleCArIFwic1wiKTtcclxuXHR9KTtcclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIEJ1dHRvbnNcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQkKFwiYnV0dG9uLmdvLWRvd25cIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdHZhciBnbyA9ICQodGhpcykuZGF0YShcImxpbmtcIik7XHJcblx0XHQkKFwiaHRtbCwgYm9keVwiKS5zdG9wKCkuYW5pbWF0ZSh7XHJcblx0XHRcdHNjcm9sbFRvcDogJChnbykub2Zmc2V0KCkudG9wXHJcblx0XHR9LCA3MDAsIFwic3dpbmdcIik7XHJcblx0fSk7XHJcblxyXG5cdCQoXCJidXR0b24uZ28tdXBcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdCQoXCJodG1sLCBib2R5XCIpLnN0b3AoKS5hbmltYXRlKHtcclxuXHRcdFx0c2Nyb2xsVG9wOiAwXHJcblx0XHR9LCA3MDAsIFwic3dpbmdcIik7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIuYmxvZy1uYXZpZ2F0aW9uX190b2dnbGVcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uXCIpLnRvZ2dsZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdH0pO1xyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gU0NST0xMIEVWRU5UU1xyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuXHQvLyBTQ1JPTEwgTkFWSUdBVElPTiBCRUdJTlxyXG5cdHZhciBsYXN0SWQsXHJcblx0XHRtZW51ID0gJChcIi5ibG9nLW5hdmlnYXRpb25cIiksXHJcblx0XHRtZW51SXRlbXMgPSBtZW51LmZpbmQoXCJsaSBhXCIpLFxyXG5cdFx0c2Nyb2xsSXRlbXMgPSBtZW51SXRlbXMubWFwKGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciBpdGVtID0gJCgkKHRoaXMpLmF0dHIoXCJocmVmXCIpKTtcclxuXHRcdFx0aWYgKGl0ZW0ubGVuZ3RoKSByZXR1cm4gaXRlbTtcclxuXHRcdH0pO1xyXG5cclxuXHQvLyBCaW5kIGNsaWNrIGhhbmRsZXIgdG8gbWVudSBpdGVtc1xyXG5cdC8vIHNvIHdlIGNhbiBnZXQgYSBmYW5jeSBzY3JvbGwgYW5pbWF0aW9uXHJcblx0bWVudUl0ZW1zLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0dmFyIGhyZWYgPSAkKHRoaXMpLmF0dHIoXCJocmVmXCIpLFxyXG5cdFx0XHRvZmZzZXRUb3AgPSAoaHJlZiA9PT0gXCIjXCIpID8gMCA6ICQoaHJlZikub2Zmc2V0KCkudG9wLTYwO1xyXG5cdFx0XHJcblx0XHQkKFwiaHRtbCwgYm9keVwiKS5zdG9wKCkuYW5pbWF0ZSh7IFxyXG5cdFx0XHRzY3JvbGxUb3A6IG9mZnNldFRvcFxyXG5cdFx0fSwgNzAwLCBcInN3aW5nXCIpO1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdH0pO1xyXG5cclxuXHQvLyBCaW5kIHRvIHNjcm9sbFxyXG5cdGlmKCQoXCIuYmxvZy1uYXZpZ2F0aW9uXCIpLm9mZnNldCgpKXtcclxuXHRcdCQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oKSB7XHJcblx0XHRcdC8vIEdldCBjb250YWluZXIgc2Nyb2xsIHBvc2l0aW9uXHJcblx0XHRcdHZhciBmcm9tVG9wID0gJCh0aGlzKS5zY3JvbGxUb3AoKSxcclxuXHRcdFx0XHRibG9nTmF2T2Zmc2V0ID0gJChcIi5ibG9nLW5hdmlnYXRpb25cIikub2Zmc2V0KCkudG9wLFxyXG5cdFx0XHRcdGJsb2dOYXZMaW1pdCA9ICQoXCIuZm9vdGVyX193cmFwcGVyXCIpLm9mZnNldCgpLnRvcCAtICQoXCIuYmxvZy1uYXZpZ2F0aW9uX193cmFwcGVyXCIpLm91dGVySGVpZ2h0KCk7XHJcblxyXG5cdFx0XHQvLyBHZXQgaWQgb2YgY3VycmVudCBzY3JvbGwgaXRlbVxyXG5cdFx0XHR2YXIgY3VyID0gc2Nyb2xsSXRlbXMubWFwKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0aWYgKCQodGhpcykub2Zmc2V0KCkudG9wIDwgZnJvbVRvcCsxNDQpXHJcblx0XHRcdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdFx0fSk7XHJcblx0XHRcdC8vIEdldCB0aGUgaWQgb2YgdGhlIGN1cnJlbnQgZWxlbWVudFxyXG5cdFx0XHRjdXIgPSBjdXJbY3VyLmxlbmd0aC0xXTtcclxuXHRcdFx0dmFyIGlkID0gY3VyICYmIGN1ci5sZW5ndGggPyBjdXJbMF0uaWQgOiBcIlwiO1xyXG5cclxuXHRcdFx0aWYgKGxhc3RJZCAhPT0gaWQpIHtcclxuXHRcdFx0XHRsYXN0SWQgPSBpZDtcclxuXHRcdFx0XHQvLyBTZXQvcmVtb3ZlIGFjdGl2ZSBjbGFzc1xyXG5cdFx0XHRcdG1lbnVJdGVtc1xyXG5cdFx0XHRcdC5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKVxyXG5cdFx0XHRcdC5maWx0ZXIoXCJbaHJlZj0jXCIraWQrXCJdXCIpXHJcblx0XHRcdFx0LmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZihmcm9tVG9wID49IGJsb2dOYXZMaW1pdCAmJiAkKHdpbmRvdykud2lkdGgoKSA+ICg3NjggLSBzY3JvbGxCYXJXaWR0aCkpIHtcclxuXHRcdFx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5jc3Moe1wicG9zaXRpb25cIjpcImFic29sdXRlXCIsIFwidG9wXCI6YmxvZ05hdkxpbWl0ICsgXCJweFwifSk7XHJcblx0XHRcdH0gZWxzZSBpZiAoZnJvbVRvcCA+PSBibG9nTmF2T2Zmc2V0ICYmICQod2luZG93KS53aWR0aCgpID4gKDc2OCAtIHNjcm9sbEJhcldpZHRoKSkge1xyXG5cdFx0XHRcdCQoXCIuYmxvZy1uYXZpZ2F0aW9uX193cmFwcGVyXCIpLmNzcyh7XCJwb3NpdGlvblwiOlwiZml4ZWRcIiwgXCJ0b3BcIjowfSk7XHJcblx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikuYWRkQ2xhc3MoXCJuYXYtZml4ZWRcIik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikuY3NzKHtcInBvc2l0aW9uXCI6XCJyZWxhdGl2ZVwifSk7XHJcblx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikucmVtb3ZlQ2xhc3MoXCJuYXYtZml4ZWRcIik7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9KTtcclxuXHR9XHJcblx0Ly8gU0NST0xMIE5BVklHQVRJT04gRU5EXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBSRVNJWkUgRVZFTlRTXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0aWYoJChcIi5ibG9nLW5hdmlnYXRpb25cIikub2Zmc2V0KCkpe1xyXG5cdFx0JCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbigpIHtcclxuXHRcdFx0aWYoJCh3aW5kb3cpLndpZHRoKCkgPD0gKDc2OCAtIHNjcm9sbEJhcldpZHRoKSl7XHJcblx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikucmVtb3ZlQ2xhc3MoXCJuYXYtZml4ZWRcIik7XHJcblx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikuY3NzKHtcInBvc2l0aW9uXCI6XCJyZWxhdGl2ZVwifSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0aWYoJChcImJvZHlcIikuc2Nyb2xsVG9wKCkgPj0gJChcIi5ibG9nXCIpLm9mZnNldCgpLnRvcCl7XHJcblx0XHRcdFx0XHQkKFwiLmJsb2ctbmF2aWdhdGlvbl9fd3JhcHBlclwiKS5jc3Moe1wicG9zaXRpb25cIjpcImZpeGVkXCIsIFwidG9wXCI6MH0pO1xyXG5cdFx0XHRcdFx0JChcIi5ibG9nLW5hdmlnYXRpb25fX3dyYXBwZXJcIikuYWRkQ2xhc3MoXCJuYXYtZml4ZWRcIik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cclxuXHQkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCkge1xyXG5cdFx0Ly8gVGVzdGltb25pYWxzIHNlY3Rpb24gYmcgc2l6ZVxyXG5cdFx0aWYoICQod2luZG93KS53aWR0aCgpPjIwMDAgLSBzY3JvbGxCYXJXaWR0aCl7XHJcblx0XHRcdCQoXCIudGFsa3MsIC5jb250YWN0LWZvcm1fX2JnXCIpLmNzcyhcImJhY2tncm91bmQtc2l6ZVwiLCAkKHdpbmRvdykud2lkdGgoKSArIFwicHhcIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBQcmVsb2FkZXIgd2l0aCBwZXJjZW50YWdlIGJ5IGludGVydmFsXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gZnVuY3Rpb24gcHJlbG9hZGVyKCkge1xyXG5cdC8vIFx0dmFyIGR1cmF0aW9uID0gMTAwMDtcclxuXHQvLyBcdHZhciBzdCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG5cclxuXHQvLyBcdHZhciAkY2lyY2xlX19vID0gJChcIiNwcmVsb2FkZXItc3ZnX19pbWcgLmJhcl9fb3V0ZXJcIiksXHJcblx0Ly8gXHRcdCRjaXJjbGVfX2MgPSAkKFwiI3ByZWxvYWRlci1zdmdfX2ltZyAuYmFyX19jZW50ZXJcIiksXHJcblx0Ly8gXHRcdCRjaXJjbGVfX2kgPSAkKFwiI3ByZWxvYWRlci1zdmdfX2ltZyAuYmFyX19pbm5lclwiKTtcclxuXHJcblx0Ly8gXHR2YXIgY19vID0gTWF0aC5QSSooJGNpcmNsZV9fby5hdHRyKFwiclwiKSAqIDIpLFxyXG5cdC8vIFx0XHRjX2MgPSBNYXRoLlBJKigkY2lyY2xlX19jLmF0dHIoXCJyXCIpICogMiksXHJcblx0Ly8gXHRcdGNfaSA9IE1hdGguUEkqKCRjaXJjbGVfX2kuYXR0cihcInJcIikgKiAyKTtcclxuXHJcblxyXG5cdC8vIFx0dmFyIGludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XHJcblx0Ly8gXHRcdHZhciBkaWZmID0gTWF0aC5yb3VuZChuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHN0KSxcclxuXHQvLyBcdFx0XHR2YWwgPSBNYXRoLnJvdW5kKGRpZmYgLyBkdXJhdGlvbiAqIDEwMCk7XHJcblxyXG5cdC8vIFx0XHR2YWwgPSB2YWwgPiAxMDAgPyAxMDAgOiB2YWw7XHJcblxyXG5cdC8vIFx0XHR2YXIgcGN0X28gPSAoKDEwMC12YWwpLzEwMCkqY19vLFxyXG5cdC8vIFx0XHRcdHBjdF9jID0gKCgxMDAtdmFsKS8xMDApKmNfYyxcclxuXHQvLyBcdFx0XHRwY3RfaSA9ICgoMTAwLXZhbCkvMTAwKSpjX2k7XHJcblxyXG5cdC8vIFx0XHQkY2lyY2xlX19vLmNzcyh7c3Ryb2tlRGFzaG9mZnNldDogcGN0X299KTtcclxuXHQvLyBcdFx0JGNpcmNsZV9fYy5jc3Moe3N0cm9rZURhc2hvZmZzZXQ6IHBjdF9jfSk7XHJcblx0Ly8gXHRcdCRjaXJjbGVfX2kuY3NzKHtzdHJva2VEYXNob2Zmc2V0OiBwY3RfaX0pO1xyXG5cclxuXHQvLyBcdFx0JChcIiNwcmVsb2FkZXItc3ZnX19wZXJjZW50YWdlXCIpLnRleHQodmFsKTtcclxuXHQvLyBcdFx0JChcIiNwcmVsb2FkZXItc3ZnX19pbWdcIikuY3NzKHtvcGFjaXR5OjF9KTtcclxuXHJcblx0Ly8gXHRcdGlmIChkaWZmID49IGR1cmF0aW9uKSB7XHJcblx0Ly8gXHRcdFx0Y2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XHJcblxyXG5cdC8vIFx0XHRcdGlmKCQoXCIuZmxpcC1jYXJkXCIpLmxlbmd0aCl7XHJcblx0Ly8gXHRcdFx0XHQkKFwiI3ByZWxvYWRlclwiKS5kZWxheSgxMDAwKS5mYWRlT3V0KDcwMCwgZnVuY3Rpb24oKXtcclxuXHQvLyBcdFx0XHRcdFx0JChcIiNwcmVsb2FkZXJfX3Byb2dyZXNzXCIpLnJlbW92ZSgpO1xyXG5cdC8vIFx0XHRcdFx0XHQkKFwiLmZsaXAtY2FyZFwiKS5hZGRDbGFzcyhcImxvYWRlZFwiKTtcclxuXHQvLyBcdFx0XHRcdH0pO1xyXG5cdC8vIFx0XHRcdH0gZWxzZSB7XHJcblx0Ly8gXHRcdFx0XHQkKFwiI3ByZWxvYWRlclwiKS5kZWxheSgxMDAwKS5mYWRlT3V0KDcwMCwgZnVuY3Rpb24oKXtcclxuXHQvLyBcdFx0XHRcdFx0JChcIiNwcmVsb2FkZXJfX3Byb2dyZXNzXCIpLnJlbW92ZSgpO1xyXG5cdC8vIFx0XHRcdFx0fSk7XHJcblx0Ly8gXHRcdFx0fVxyXG5cdC8vIFx0XHR9XHJcblx0Ly8gXHR9LCAyMDApO1xyXG5cdC8vIH1cclxuXHQvLyBwcmVsb2FkZXIoKTtcclxuXHJcblxyXG59KShqUXVlcnkpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
