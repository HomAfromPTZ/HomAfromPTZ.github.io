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

	// FLIP PAGE ANIMATION
	$(document).on('click', 'a', function(e) {
		var href = $(this).attr('href');
		e.preventDefault();

		return $(".preloader")
			.fadeIn(500, function(){
				return document.location = href != null ? href : '/';
			});
	});

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oJCkge1xyXG5cdFwidXNlIHN0cmljdFwiO1xyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBBeGlzIFBhcmFsbGF4XHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0JChcIiNzY2VuZVwiKS5wYXJhbGxheCh7XHJcblx0XHRzY2FsYXJYOiAzLFxyXG5cdFx0c2NhbGFyWTogMyxcclxuXHRcdGZyaWN0aW9uWDogMC41LFxyXG5cdFx0ZnJpY3Rpb25ZOiAwLjVcclxuXHR9KTtcclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIExvZ2luIGNhcmQgZmxpcFxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdCQoXCIubG9naW4tYnV0dG9uXCIpLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG5cdFx0JChcImJvZHlcIikuYWRkQ2xhc3MoXCJjYXJkX2ZsaXBwZWRcIik7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjdW5mbGlwLWNhcmRcIikuY2xpY2soZnVuY3Rpb24oKSB7XHJcblx0XHQkKFwiYm9keVwiKS5yZW1vdmVDbGFzcyhcImNhcmRfZmxpcHBlZFwiKTtcclxuXHR9KTtcclxuXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBNYWluIG1lbnVcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQkKFwiI21lbnUtdG9nZ2xlXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcblx0XHQkKHRoaXMpLmFkZChcIi5tYWluLW1lbnVcIikudG9nZ2xlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIubWFpbi1tZW51X19pdGVtXCIpLmVhY2goZnVuY3Rpb24oaW5kZXgpIHtcclxuXHRcdCQodGhpcykuY3NzKFwidHJhbnNpdGlvbi1kZWxheVwiLCAwLjMrMC4xKmluZGV4ICsgXCJzXCIpO1xyXG5cdH0pO1xyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gQnV0dG9uc1xyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdCQoXCJidXR0b24uZ28tZG93blwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0JChcImh0bWwsIGJvZHlcIikuc3RvcCgpLmFuaW1hdGUoe1xyXG5cdFx0XHRzY3JvbGxUb3A6ICQoXCIucG9ydGZvbGlvLXNsaWRlclwiKS5vZmZzZXQoKS50b3BcclxuXHRcdH0sIDcwMCwgXCJzd2luZ1wiKTtcclxuXHR9KTtcclxuXHJcblx0JChcImJ1dHRvbi5nby11cFwiKS5jbGljayhmdW5jdGlvbigpe1xyXG5cdFx0JChcImh0bWwsIGJvZHlcIikuc3RvcCgpLmFuaW1hdGUoe1xyXG5cdFx0XHRzY3JvbGxUb3A6IDBcclxuXHRcdH0sIDcwMCwgXCJzd2luZ1wiKTtcclxuXHR9KTtcclxuXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBGYWtlIHByZWxvYWRlclxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHRcdCQoXCIucHJlbG9hZGVyXCIpXHJcblx0XHRcdC5mYWRlT3V0KDQwMCwgZnVuY3Rpb24oKXtcclxuXHRcdFx0XHQkKFwiLmZsaXAtY2FyZFwiKS5hZGRDbGFzcyhcImxvYWRlZFwiKTtcclxuXHRcdFx0fSk7XHJcblx0fSwgNTAwKTtcclxuXHJcblx0Ly8gRkxJUCBQQUdFIEFOSU1BVElPTlxyXG5cdCQoZG9jdW1lbnQpLm9uKCdjbGljaycsICdhJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0dmFyIGhyZWYgPSAkKHRoaXMpLmF0dHIoJ2hyZWYnKTtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRyZXR1cm4gJChcIi5wcmVsb2FkZXJcIilcclxuXHRcdFx0LmZhZGVJbig1MDAsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0cmV0dXJuIGRvY3VtZW50LmxvY2F0aW9uID0gaHJlZiAhPSBudWxsID8gaHJlZiA6ICcvJztcclxuXHRcdFx0fSk7XHJcblx0fSk7XHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFRlc3RpbW9uaWFscyBzZWN0aW9uIGJnIHNpemVcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHRpZiggJCh3aW5kb3cpLndpZHRoKCk+MTIwMCl7XHJcblx0XHQkKFwiLnRhbGtzLCAuY29udGFjdC1mb3JtX19iZ1wiKS5jc3MoXCJiYWNrZ3JvdW5kLXNpemVcIiwgJCh3aW5kb3cpLndpZHRoKCkgKyBcInB4XCIpO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBDb250YWN0IGZvcm0gYmx1ciBwb3NpdGlvblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIHZhciB0YWxrc19vZmZzZXQgPSAkKFwic2VjdGlvbi50YWxrc1wiKS5vZmZzZXQoKSxcclxuXHQvLyBcdGNmb3JtX29mZnNldCA9ICQoXCIuY29udGFjdC1mb3JtX19iZ1wiKS5vZmZzZXQoKTtcclxuXHJcblx0Ly8gJChcIi5jb250YWN0LWZvcm1fX2JnXCIpLmNzcyhcImJhY2tncm91bmQtcG9zaXRpb25cIiwgXCJjZW50ZXIgLVwiICsgKGNmb3JtX29mZnNldC50b3AgLSB0YWxrc19vZmZzZXQudG9wKSArXCJweFwiKTtcclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFNDUk9MTCBFVkVOVFNcclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyAkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKCkge1xyXG5cdC8vIFx0Ly8gdmFyIHNjcm9sbFBvcyA9ICQodGhpcykuc2Nyb2xsVG9wKCk7XHJcblx0Ly8gfSk7XHJcblxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gUkVTSVpFIEVWRU5UU1xyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdCQod2luZG93KS5yZXNpemUoZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0Ly8gVGVzdGltb25pYWxzIHNlY3Rpb24gYmcgc2l6ZVxyXG5cdFx0aWYoICQod2luZG93KS53aWR0aCgpPjEyMDApe1xyXG5cdFx0XHQkKFwiLnRhbGtzLCAuY29udGFjdC1mb3JtX19iZ1wiKS5jc3MoXCJiYWNrZ3JvdW5kLXNpemVcIiwgJCh3aW5kb3cpLndpZHRoKCkgKyBcInB4XCIpO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBDb250YWN0IGZvcm0gYmx1ciBwb3NpdGlvblxyXG5cdFx0Ly8gdGFsa3Nfb2Zmc2V0ID0gJChcInNlY3Rpb24udGFsa3NcIikub2Zmc2V0KCk7XHJcblx0XHQvLyBjZm9ybV9vZmZzZXQgPSAkKFwiLmNvbnRhY3QtZm9ybV9fYmdcIikub2Zmc2V0KCk7XHJcblx0XHQvLyAkKFwiLmNvbnRhY3QtZm9ybV9fYmdcIikuY3NzKFwiYmFja2dyb3VuZC1wb3NpdGlvblwiLCBcImNlbnRlciAtXCIgKyAoY2Zvcm1fb2Zmc2V0LnRvcCAtIHRhbGtzX29mZnNldC50b3ApICtcInB4XCIpO1xyXG5cdH0pO1xyXG59KShqUXVlcnkpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
