(function($) {
	"use strict";

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
		$("html, body").stop().animate({
			scrollTop: $(".portfolio-slider").offset().top
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


	// ==============================
	// Testimonials section bg size
	// ==============================
	if( $(window).width()>1200){
		$(".talks, .contact-form__bg").css("background-size", $(window).width() + "px");
	}



	// ==============================
	// Contact form blur position
	// ==============================
	// var talks_offset = $("section.talks").offset(),
	// 	cform_offset = $(".contact-form__bg").offset();

	// $(".contact-form__bg").css("background-position", "center -" + (cform_offset.top - talks_offset.top) +"px");


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
		if( $(window).width()>1200){
			$(".talks, .contact-form__bg").css("background-size", $(window).width() + "px");
		}


		// Contact form blur position
		// talks_offset = $("section.talks").offset();
		// cform_offset = $(".contact-form__bg").offset();
		// $(".contact-form__bg").css("background-position", "center -" + (cform_offset.top - talks_offset.top) +"px");
	});
})(jQuery);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCQpIHtcclxuXHRcInVzZSBzdHJpY3RcIjtcclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gQXhpcyBQYXJhbGxheFxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdCQoXCIjc2NlbmVcIikucGFyYWxsYXgoe1xyXG5cdFx0c2NhbGFyWDogMyxcclxuXHRcdHNjYWxhclk6IDMsXHJcblx0XHRmcmljdGlvblg6IDAuNSxcclxuXHRcdGZyaWN0aW9uWTogMC41XHJcblx0fSk7XHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBMb2dpbiBjYXJkIGZsaXBcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQkKFwiLmxvZ2luLWJ1dHRvblwiKS5jbGljayhmdW5jdGlvbigpIHtcclxuXHRcdCQoXCJib2R5XCIpLmFkZENsYXNzKFwiY2FyZF9mbGlwcGVkXCIpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiI3VuZmxpcC1jYXJkXCIpLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG5cdFx0JChcImJvZHlcIikucmVtb3ZlQ2xhc3MoXCJjYXJkX2ZsaXBwZWRcIik7XHJcblx0fSk7XHJcblxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gTWFpbiBtZW51XHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0JChcIiNtZW51LXRvZ2dsZVwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0JCh0aGlzKS5hZGQoXCIubWFpbi1tZW51XCIpLnRvZ2dsZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiLm1haW4tbWVudV9faXRlbVwiKS5lYWNoKGZ1bmN0aW9uKGluZGV4KSB7XHJcblx0XHQkKHRoaXMpLmNzcyhcInRyYW5zaXRpb24tZGVsYXlcIiwgMC4zKzAuMSppbmRleCArIFwic1wiKTtcclxuXHR9KTtcclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIEJ1dHRvbnNcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQkKFwiYnV0dG9uLmdvLWRvd25cIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdCQoXCJodG1sLCBib2R5XCIpLnN0b3AoKS5hbmltYXRlKHtcclxuXHRcdFx0c2Nyb2xsVG9wOiAkKFwiLnBvcnRmb2xpby1zbGlkZXJcIikub2Zmc2V0KCkudG9wXHJcblx0XHR9LCA3MDAsIFwic3dpbmdcIik7XHJcblx0fSk7XHJcblxyXG5cdCQoXCJidXR0b24uZ28tdXBcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuXHRcdCQoXCJodG1sLCBib2R5XCIpLnN0b3AoKS5hbmltYXRlKHtcclxuXHRcdFx0c2Nyb2xsVG9wOiAwXHJcblx0XHR9LCA3MDAsIFwic3dpbmdcIik7XHJcblx0fSk7XHJcblxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gRmFrZSBwcmVsb2FkZXJcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHQkKFwiLnByZWxvYWRlclwiKVxyXG5cdFx0XHQuZmFkZU91dCg0MDAsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0JChcIi5mbGlwLWNhcmRcIikuYWRkQ2xhc3MoXCJsb2FkZWRcIik7XHJcblx0XHRcdH0pO1xyXG5cdH0sIDUwMCk7XHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBUZXN0aW1vbmlhbHMgc2VjdGlvbiBiZyBzaXplXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0aWYoICQod2luZG93KS53aWR0aCgpPjEyMDApe1xyXG5cdFx0JChcIi50YWxrcywgLmNvbnRhY3QtZm9ybV9fYmdcIikuY3NzKFwiYmFja2dyb3VuZC1zaXplXCIsICQod2luZG93KS53aWR0aCgpICsgXCJweFwiKTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gQ29udGFjdCBmb3JtIGJsdXIgcG9zaXRpb25cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyB2YXIgdGFsa3Nfb2Zmc2V0ID0gJChcInNlY3Rpb24udGFsa3NcIikub2Zmc2V0KCksXHJcblx0Ly8gXHRjZm9ybV9vZmZzZXQgPSAkKFwiLmNvbnRhY3QtZm9ybV9fYmdcIikub2Zmc2V0KCk7XHJcblxyXG5cdC8vICQoXCIuY29udGFjdC1mb3JtX19iZ1wiKS5jc3MoXCJiYWNrZ3JvdW5kLXBvc2l0aW9uXCIsIFwiY2VudGVyIC1cIiArIChjZm9ybV9vZmZzZXQudG9wIC0gdGFsa3Nfb2Zmc2V0LnRvcCkgK1wicHhcIik7XHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBTQ1JPTEwgRVZFTlRTXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpIHtcclxuXHQvLyBcdC8vIHZhciBzY3JvbGxQb3MgPSAkKHRoaXMpLnNjcm9sbFRvcCgpO1xyXG5cdC8vIH0pO1xyXG5cclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFJFU0laRSBFVkVOVFNcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdC8vIFRlc3RpbW9uaWFscyBzZWN0aW9uIGJnIHNpemVcclxuXHRcdGlmKCAkKHdpbmRvdykud2lkdGgoKT4xMjAwKXtcclxuXHRcdFx0JChcIi50YWxrcywgLmNvbnRhY3QtZm9ybV9fYmdcIikuY3NzKFwiYmFja2dyb3VuZC1zaXplXCIsICQod2luZG93KS53aWR0aCgpICsgXCJweFwiKTtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gQ29udGFjdCBmb3JtIGJsdXIgcG9zaXRpb25cclxuXHRcdC8vIHRhbGtzX29mZnNldCA9ICQoXCJzZWN0aW9uLnRhbGtzXCIpLm9mZnNldCgpO1xyXG5cdFx0Ly8gY2Zvcm1fb2Zmc2V0ID0gJChcIi5jb250YWN0LWZvcm1fX2JnXCIpLm9mZnNldCgpO1xyXG5cdFx0Ly8gJChcIi5jb250YWN0LWZvcm1fX2JnXCIpLmNzcyhcImJhY2tncm91bmQtcG9zaXRpb25cIiwgXCJjZW50ZXIgLVwiICsgKGNmb3JtX29mZnNldC50b3AgLSB0YWxrc19vZmZzZXQudG9wKSArXCJweFwiKTtcclxuXHR9KTtcclxufSkoalF1ZXJ5KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
