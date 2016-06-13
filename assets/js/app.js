(function($) {
	'use strict';

	$("#scene").parallax({
		scalarX: 3,
		scalarY: 3,
		frictionX: 0.5,
		frictionY: 0.5
	});

	$(".welcome-page .login-button").click(function() {
		$("body").addClass("welcome-page_flipped");
	});

	$(window).click(function(e) {
		$("body").removeClass("welcome-page_flipped");
	});

	$(".welcome-page .flip-card, .welcome-page .login-button").click(function(e){
		e.stopPropagation();
	});

	setTimeout(function(){
		$(".preloader")
			.fadeOut(400, function(){
				$(".flip-card").addClass("loaded");
			});
	}, 1000);
})(jQuery);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigkKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHQkKFwiI3NjZW5lXCIpLnBhcmFsbGF4KHtcclxuXHRcdHNjYWxhclg6IDMsXHJcblx0XHRzY2FsYXJZOiAzLFxyXG5cdFx0ZnJpY3Rpb25YOiAwLjUsXHJcblx0XHRmcmljdGlvblk6IDAuNVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiLndlbGNvbWUtcGFnZSAubG9naW4tYnV0dG9uXCIpLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG5cdFx0JChcImJvZHlcIikuYWRkQ2xhc3MoXCJ3ZWxjb21lLXBhZ2VfZmxpcHBlZFwiKTtcclxuXHR9KTtcclxuXHJcblx0JCh3aW5kb3cpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcclxuXHRcdCQoXCJib2R5XCIpLnJlbW92ZUNsYXNzKFwid2VsY29tZS1wYWdlX2ZsaXBwZWRcIik7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIud2VsY29tZS1wYWdlIC5mbGlwLWNhcmQsIC53ZWxjb21lLXBhZ2UgLmxvZ2luLWJ1dHRvblwiKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0fSk7XHJcblxyXG5cdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHRcdCQoXCIucHJlbG9hZGVyXCIpXHJcblx0XHRcdC5mYWRlT3V0KDQwMCwgZnVuY3Rpb24oKXtcclxuXHRcdFx0XHQkKFwiLmZsaXAtY2FyZFwiKS5hZGRDbGFzcyhcImxvYWRlZFwiKTtcclxuXHRcdFx0fSk7XHJcblx0fSwgMTAwMCk7XHJcbn0pKGpRdWVyeSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
