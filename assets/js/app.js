(function($) {
	"use strict";

	// ==============================
	// Animations
	// ==============================
	$.fn.animated = function(inEffect) {
		$(this).each(function() {
			var ths = $(this);
			ths.css("opacity", "0")
				.addClass("animated")
				.waypoint(function(dir) {
					if (dir === "down") {
						ths.addClass(inEffect).css("opacity", "1");
					}
				},
				{
					offset: "90%"
				});
		});
	};

	$("header .svg-heading, .talks .svg-heading, .talks .testimonial, .portfolio-slider__module>div, .about-me__skills>div").animated("fadeInUp");



	// ==============================
	// Axis Parallax
	// ==============================
	$("#scene").parallax({
		scalarX: 3,
		scalarY: 3,
		frictionX: 0.5,
		frictionY: 0.5
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



	// ==============================
	// Fake preloader
	// ==============================
	setTimeout(function(){
		$(".preloader")
			.fadeOut(400, function(){
				$(".flip-card").addClass("loaded");
			});
	}, 500);

	// Page change
	$(document).on("click", "a", function(e) {
		var href = $(this).attr("href");
		e.preventDefault();

		return $(".preloader")
			.fadeIn(500, function(){
				return document.location = href != null ? href : "/";
			});
	});



	// ==============================
	// SCROLL EVENTS
	// ==============================
	// $(window).scroll(function() {
	// 	// var scrollPos = $(this).scrollTop();
	// });



	// ==============================
	// RESIZE EVENTS
	// ==============================


	$(window).resize(function() {

		// Testimonials section bg size
		if( $(window).width()>2000){
			$(".talks, .contact-form__bg").css("background-size", $(window).width() + "px");
		}

	});
})(jQuery);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCQpIHtcclxuXHRcInVzZSBzdHJpY3RcIjtcclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gQW5pbWF0aW9uc1xyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdCQuZm4uYW5pbWF0ZWQgPSBmdW5jdGlvbihpbkVmZmVjdCkge1xyXG5cdFx0JCh0aGlzKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgdGhzID0gJCh0aGlzKTtcclxuXHRcdFx0dGhzLmNzcyhcIm9wYWNpdHlcIiwgXCIwXCIpXHJcblx0XHRcdFx0LmFkZENsYXNzKFwiYW5pbWF0ZWRcIilcclxuXHRcdFx0XHQud2F5cG9pbnQoZnVuY3Rpb24oZGlyKSB7XHJcblx0XHRcdFx0XHRpZiAoZGlyID09PSBcImRvd25cIikge1xyXG5cdFx0XHRcdFx0XHR0aHMuYWRkQ2xhc3MoaW5FZmZlY3QpLmNzcyhcIm9wYWNpdHlcIiwgXCIxXCIpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0b2Zmc2V0OiBcIjkwJVwiXHJcblx0XHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9O1xyXG5cclxuXHQkKFwiaGVhZGVyIC5zdmctaGVhZGluZywgLnRhbGtzIC5zdmctaGVhZGluZywgLnRhbGtzIC50ZXN0aW1vbmlhbCwgLnBvcnRmb2xpby1zbGlkZXJfX21vZHVsZT5kaXYsIC5hYm91dC1tZV9fc2tpbGxzPmRpdlwiKS5hbmltYXRlZChcImZhZGVJblVwXCIpO1xyXG5cclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIEF4aXMgUGFyYWxsYXhcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQkKFwiI3NjZW5lXCIpLnBhcmFsbGF4KHtcclxuXHRcdHNjYWxhclg6IDMsXHJcblx0XHRzY2FsYXJZOiAzLFxyXG5cdFx0ZnJpY3Rpb25YOiAwLjUsXHJcblx0XHRmcmljdGlvblk6IDAuNVxyXG5cdH0pO1xyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gTG9naW4gY2FyZCBmbGlwXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0JChcIi5sb2dpbi1idXR0b25cIikuY2xpY2soZnVuY3Rpb24oKSB7XHJcblx0XHQkKFwiYm9keVwiKS5hZGRDbGFzcyhcImNhcmRfZmxpcHBlZFwiKTtcclxuXHR9KTtcclxuXHJcblx0JChcIiN1bmZsaXAtY2FyZFwiKS5jbGljayhmdW5jdGlvbigpIHtcclxuXHRcdCQoXCJib2R5XCIpLnJlbW92ZUNsYXNzKFwiY2FyZF9mbGlwcGVkXCIpO1xyXG5cdH0pO1xyXG5cclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIE1haW4gbWVudVxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdCQoXCIjbWVudS10b2dnbGVcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdCQodGhpcykuYWRkKFwiLm1haW4tbWVudVwiKS50b2dnbGVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHR9KTtcclxuXHJcblx0JChcIi5tYWluLW1lbnVfX2l0ZW1cIikuZWFjaChmdW5jdGlvbihpbmRleCkge1xyXG5cdFx0JCh0aGlzKS5jc3MoXCJ0cmFuc2l0aW9uLWRlbGF5XCIsIDAuMyswLjEqaW5kZXggKyBcInNcIik7XHJcblx0fSk7XHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBCdXR0b25zXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0JChcImJ1dHRvbi5nby1kb3duXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgZ28gPSAkKHRoaXMpLmRhdGEoXCJsaW5rXCIpO1xyXG5cdFx0JChcImh0bWwsIGJvZHlcIikuc3RvcCgpLmFuaW1hdGUoe1xyXG5cdFx0XHRzY3JvbGxUb3A6ICQoZ28pLm9mZnNldCgpLnRvcFxyXG5cdFx0fSwgNzAwLCBcInN3aW5nXCIpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiYnV0dG9uLmdvLXVwXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHQkKFwiaHRtbCwgYm9keVwiKS5zdG9wKCkuYW5pbWF0ZSh7XHJcblx0XHRcdHNjcm9sbFRvcDogMFxyXG5cdFx0fSwgNzAwLCBcInN3aW5nXCIpO1xyXG5cdH0pO1xyXG5cclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIEZha2UgcHJlbG9hZGVyXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0c2V0VGltZW91dChmdW5jdGlvbigpe1xyXG5cdFx0JChcIi5wcmVsb2FkZXJcIilcclxuXHRcdFx0LmZhZGVPdXQoNDAwLCBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdCQoXCIuZmxpcC1jYXJkXCIpLmFkZENsYXNzKFwibG9hZGVkXCIpO1xyXG5cdFx0XHR9KTtcclxuXHR9LCA1MDApO1xyXG5cclxuXHQvLyBQYWdlIGNoYW5nZVxyXG5cdCQoZG9jdW1lbnQpLm9uKFwiY2xpY2tcIiwgXCJhXCIsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdHZhciBocmVmID0gJCh0aGlzKS5hdHRyKFwiaHJlZlwiKTtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRyZXR1cm4gJChcIi5wcmVsb2FkZXJcIilcclxuXHRcdFx0LmZhZGVJbig1MDAsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0cmV0dXJuIGRvY3VtZW50LmxvY2F0aW9uID0gaHJlZiAhPSBudWxsID8gaHJlZiA6IFwiL1wiO1xyXG5cdFx0XHR9KTtcclxuXHR9KTtcclxuXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBTQ1JPTEwgRVZFTlRTXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpIHtcclxuXHQvLyBcdC8vIHZhciBzY3JvbGxQb3MgPSAkKHRoaXMpLnNjcm9sbFRvcCgpO1xyXG5cdC8vIH0pO1xyXG5cclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFJFU0laRSBFVkVOVFNcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcblxyXG5cdCQod2luZG93KS5yZXNpemUoZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0Ly8gVGVzdGltb25pYWxzIHNlY3Rpb24gYmcgc2l6ZVxyXG5cdFx0aWYoICQod2luZG93KS53aWR0aCgpPjIwMDApe1xyXG5cdFx0XHQkKFwiLnRhbGtzLCAuY29udGFjdC1mb3JtX19iZ1wiKS5jc3MoXCJiYWNrZ3JvdW5kLXNpemVcIiwgJCh3aW5kb3cpLndpZHRoKCkgKyBcInB4XCIpO1xyXG5cdFx0fVxyXG5cclxuXHR9KTtcclxufSkoalF1ZXJ5KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
