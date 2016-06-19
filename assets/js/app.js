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

	$(".svg-heading, .testimonial, .portfolio-slider__module>div, .about-me>div div").animated("fadeInUp");



	// ==============================
	// Equal Heights
	// ==============================
	$.fn.equalHeights = function() {
		var maxHeight = 0,
			$this = $(this);
		$this.each( function() {
			var height = $(this).innerHeight();
			if ( height > maxHeight ) {
				maxHeight = height;
			}
		});

		return $this.css("height", maxHeight);
	};

	$(".about-me>div").equalHeights();

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
	// Testimonials section bg size
	// ==============================
	// if( $(window).width()>2000){
	// 	$(".talks, .contact-form__bg").css("background-size", $(window).width() + "px");
	// }



	// ==============================
	// Contact form blur position
	// ==============================
	// document.addEventListener("DOMContentLoaded", blurPosition);
	// function blurPosition(){
	// 	var talks_offset = $("section.talks").offset(),
	// 		cform_offset = $(".contact-form__bg").offset();

	// 	$(".contact-form__bg").css("background-position", "center -" + (cform_offset.top - talks_offset.top) +"px");
	// };

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

		$(".about-me__bio, .about-me__skills").css("height","auto").equalHeights();

		// Contact form blur position
		// var talks_offset = $("section.talks").offset(),
		// 	cform_offset = $(".contact-form__bg").offset();
		// $(".contact-form__bg").css("background-position", "center -" + (cform_offset.top - talks_offset.top) +"px");
	});
})(jQuery);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCQpIHtcclxuXHRcInVzZSBzdHJpY3RcIjtcclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gQW5pbWF0aW9uc1xyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdCQuZm4uYW5pbWF0ZWQgPSBmdW5jdGlvbihpbkVmZmVjdCkge1xyXG5cdFx0JCh0aGlzKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgdGhzID0gJCh0aGlzKTtcclxuXHRcdFx0dGhzLmNzcyhcIm9wYWNpdHlcIiwgXCIwXCIpXHJcblx0XHRcdFx0LmFkZENsYXNzKFwiYW5pbWF0ZWRcIilcclxuXHRcdFx0XHQud2F5cG9pbnQoZnVuY3Rpb24oZGlyKSB7XHJcblx0XHRcdFx0XHRpZiAoZGlyID09PSBcImRvd25cIikge1xyXG5cdFx0XHRcdFx0XHR0aHMuYWRkQ2xhc3MoaW5FZmZlY3QpLmNzcyhcIm9wYWNpdHlcIiwgXCIxXCIpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0b2Zmc2V0OiBcIjkwJVwiXHJcblx0XHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9O1xyXG5cclxuXHQkKFwiLnN2Zy1oZWFkaW5nLCAudGVzdGltb25pYWwsIC5wb3J0Zm9saW8tc2xpZGVyX19tb2R1bGU+ZGl2LCAuYWJvdXQtbWU+ZGl2IGRpdlwiKS5hbmltYXRlZChcImZhZGVJblVwXCIpO1xyXG5cclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIEVxdWFsIEhlaWdodHNcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQkLmZuLmVxdWFsSGVpZ2h0cyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIG1heEhlaWdodCA9IDAsXHJcblx0XHRcdCR0aGlzID0gJCh0aGlzKTtcclxuXHRcdCR0aGlzLmVhY2goIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgaGVpZ2h0ID0gJCh0aGlzKS5pbm5lckhlaWdodCgpO1xyXG5cdFx0XHRpZiAoIGhlaWdodCA+IG1heEhlaWdodCApIHtcclxuXHRcdFx0XHRtYXhIZWlnaHQgPSBoZWlnaHQ7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiAkdGhpcy5jc3MoXCJoZWlnaHRcIiwgbWF4SGVpZ2h0KTtcclxuXHR9O1xyXG5cclxuXHQkKFwiLmFib3V0LW1lPmRpdlwiKS5lcXVhbEhlaWdodHMoKTtcclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gQXhpcyBQYXJhbGxheFxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdCQoXCIjc2NlbmVcIikucGFyYWxsYXgoe1xyXG5cdFx0c2NhbGFyWDogMyxcclxuXHRcdHNjYWxhclk6IDMsXHJcblx0XHRmcmljdGlvblg6IDAuNSxcclxuXHRcdGZyaWN0aW9uWTogMC41XHJcblx0fSk7XHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBMb2dpbiBjYXJkIGZsaXBcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQkKFwiLmxvZ2luLWJ1dHRvblwiKS5jbGljayhmdW5jdGlvbigpIHtcclxuXHRcdCQoXCJib2R5XCIpLmFkZENsYXNzKFwiY2FyZF9mbGlwcGVkXCIpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiI3VuZmxpcC1jYXJkXCIpLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG5cdFx0JChcImJvZHlcIikucmVtb3ZlQ2xhc3MoXCJjYXJkX2ZsaXBwZWRcIik7XHJcblx0fSk7XHJcblxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gTWFpbiBtZW51XHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0JChcIiNtZW51LXRvZ2dsZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0JCh0aGlzKS5hZGQoXCIubWFpbi1tZW51XCIpLnRvZ2dsZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiLm1haW4tbWVudV9faXRlbVwiKS5lYWNoKGZ1bmN0aW9uKGluZGV4KSB7XHJcblx0XHQkKHRoaXMpLmNzcyhcInRyYW5zaXRpb24tZGVsYXlcIiwgMC4zKzAuMSppbmRleCArIFwic1wiKTtcclxuXHR9KTtcclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIEJ1dHRvbnNcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQkKFwiYnV0dG9uLmdvLWRvd25cIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdHZhciBnbyA9ICQodGhpcykuZGF0YShcImxpbmtcIik7XHJcblx0XHQkKFwiaHRtbCwgYm9keVwiKS5zdG9wKCkuYW5pbWF0ZSh7XHJcblx0XHRcdHNjcm9sbFRvcDogJChnbykub2Zmc2V0KCkudG9wXHJcblx0XHR9LCA3MDAsIFwic3dpbmdcIik7XHJcblx0fSk7XHJcblxyXG5cdCQoXCJidXR0b24uZ28tdXBcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdCQoXCJodG1sLCBib2R5XCIpLnN0b3AoKS5hbmltYXRlKHtcclxuXHRcdFx0c2Nyb2xsVG9wOiAwXHJcblx0XHR9LCA3MDAsIFwic3dpbmdcIik7XHJcblx0fSk7XHJcblxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gRmFrZSBwcmVsb2FkZXJcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHQkKFwiLnByZWxvYWRlclwiKVxyXG5cdFx0XHQuZmFkZU91dCg0MDAsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0JChcIi5mbGlwLWNhcmRcIikuYWRkQ2xhc3MoXCJsb2FkZWRcIik7XHJcblx0XHRcdH0pO1xyXG5cdH0sIDUwMCk7XHJcblxyXG5cdC8vIFBhZ2UgY2hhbmdlXHJcblx0JChkb2N1bWVudCkub24oXCJjbGlja1wiLCBcImFcIiwgZnVuY3Rpb24oZSkge1xyXG5cdFx0dmFyIGhyZWYgPSAkKHRoaXMpLmF0dHIoXCJocmVmXCIpO1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdHJldHVybiAkKFwiLnByZWxvYWRlclwiKVxyXG5cdFx0XHQuZmFkZUluKDUwMCwgZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRyZXR1cm4gZG9jdW1lbnQubG9jYXRpb24gPSBocmVmICE9IG51bGwgPyBocmVmIDogXCIvXCI7XHJcblx0XHRcdH0pO1xyXG5cdH0pO1xyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBUZXN0aW1vbmlhbHMgc2VjdGlvbiBiZyBzaXplXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gaWYoICQod2luZG93KS53aWR0aCgpPjIwMDApe1xyXG5cdC8vIFx0JChcIi50YWxrcywgLmNvbnRhY3QtZm9ybV9fYmdcIikuY3NzKFwiYmFja2dyb3VuZC1zaXplXCIsICQod2luZG93KS53aWR0aCgpICsgXCJweFwiKTtcclxuXHQvLyB9XHJcblxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gQ29udGFjdCBmb3JtIGJsdXIgcG9zaXRpb25cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBibHVyUG9zaXRpb24pO1xyXG5cdC8vIGZ1bmN0aW9uIGJsdXJQb3NpdGlvbigpe1xyXG5cdC8vIFx0dmFyIHRhbGtzX29mZnNldCA9ICQoXCJzZWN0aW9uLnRhbGtzXCIpLm9mZnNldCgpLFxyXG5cdC8vIFx0XHRjZm9ybV9vZmZzZXQgPSAkKFwiLmNvbnRhY3QtZm9ybV9fYmdcIikub2Zmc2V0KCk7XHJcblxyXG5cdC8vIFx0JChcIi5jb250YWN0LWZvcm1fX2JnXCIpLmNzcyhcImJhY2tncm91bmQtcG9zaXRpb25cIiwgXCJjZW50ZXIgLVwiICsgKGNmb3JtX29mZnNldC50b3AgLSB0YWxrc19vZmZzZXQudG9wKSArXCJweFwiKTtcclxuXHQvLyB9O1xyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBTQ1JPTEwgRVZFTlRTXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpIHtcclxuXHQvLyBcdC8vIHZhciBzY3JvbGxQb3MgPSAkKHRoaXMpLnNjcm9sbFRvcCgpO1xyXG5cdC8vIH0pO1xyXG5cclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFJFU0laRSBFVkVOVFNcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcblxyXG5cdCQod2luZG93KS5yZXNpemUoZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0Ly8gVGVzdGltb25pYWxzIHNlY3Rpb24gYmcgc2l6ZVxyXG5cdFx0aWYoICQod2luZG93KS53aWR0aCgpPjIwMDApe1xyXG5cdFx0XHQkKFwiLnRhbGtzLCAuY29udGFjdC1mb3JtX19iZ1wiKS5jc3MoXCJiYWNrZ3JvdW5kLXNpemVcIiwgJCh3aW5kb3cpLndpZHRoKCkgKyBcInB4XCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdCQoXCIuYWJvdXQtbWVfX2JpbywgLmFib3V0LW1lX19za2lsbHNcIikuY3NzKFwiaGVpZ2h0XCIsXCJhdXRvXCIpLmVxdWFsSGVpZ2h0cygpO1xyXG5cclxuXHRcdC8vIENvbnRhY3QgZm9ybSBibHVyIHBvc2l0aW9uXHJcblx0XHQvLyB2YXIgdGFsa3Nfb2Zmc2V0ID0gJChcInNlY3Rpb24udGFsa3NcIikub2Zmc2V0KCksXHJcblx0XHQvLyBcdGNmb3JtX29mZnNldCA9ICQoXCIuY29udGFjdC1mb3JtX19iZ1wiKS5vZmZzZXQoKTtcclxuXHRcdC8vICQoXCIuY29udGFjdC1mb3JtX19iZ1wiKS5jc3MoXCJiYWNrZ3JvdW5kLXBvc2l0aW9uXCIsIFwiY2VudGVyIC1cIiArIChjZm9ybV9vZmZzZXQudG9wIC0gdGFsa3Nfb2Zmc2V0LnRvcCkgK1wicHhcIik7XHJcblx0fSk7XHJcbn0pKGpRdWVyeSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
