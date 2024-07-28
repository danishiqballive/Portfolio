(function ($) {


	var $window = $(window),
		$body = $('body'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		settings = {

			// Parallax background effect?
			parallax: true,

			// Parallax factor (lower = more intense, higher = less intense).
			parallaxFactor: 20

		};

	// Breakpoints.
	breakpoints({
		xlarge: ['1281px', '1800px'],
		large: ['981px', '1280px'],
		medium: ['737px', '980px'],
		small: ['481px', '736px'],
		xsmall: [null, '480px'],
	});

	// Play initial animations on page load.
	$window.on('load', function () {
		window.setTimeout(function () {
			$body.removeClass('is-preload');
		}, 100);
	});

	// Touch?
	if (browser.mobile) {

		// Turn on touch mode.
		$body.addClass('is-touch');

		// Height fix (mostly for iOS).
		window.setTimeout(function () {
			$window.scrollTop($window.scrollTop() + 1);
		}, 0);

	}

	// Footer.
	breakpoints.on('<=medium', function () {
		$footer.insertAfter($main);
	});

	breakpoints.on('>medium', function () {
		$footer.appendTo($header);
	});

	// Header.

	// Parallax background.

	// Disable parallax on IE (smooth scrolling is jerky), and on mobile platforms (= better performance).
	if (browser.name == 'ie' ||
		browser.mobile)
		settings.parallax = false;

	if (settings.parallax) {

		breakpoints.on('<=medium', function () {

			$window.off('scroll.strata_parallax');
			$header.css('background-position', '');

		});

		breakpoints.on('>medium', function () {

			$header.css('background-position', 'left 0px');

			$window.on('scroll.strata_parallax', function () {
				$header.css('background-position', 'left ' + (-1 * (parseInt($window.scrollTop()) / settings.parallaxFactor)) + 'px');
			});

		});

		$window.on('load', function () {
			$window.triggerHandler('scroll');
		});

	}

	// Main Sections: Two.

	// Lightbox gallery.
	$window.on('load', function () {

		$('#two').poptrox({
			caption: function ($a) {
				return $a.next('h3').text();
			},
			overlayColor: '#2c2c2c',
			overlayOpacity: 0.85,
			popupCloserText: '',
			popupLoaderText: '',
			selector: '.work-item a.image',
			usePopupCaption: true,
			usePopupDefaultStyling: false,
			usePopupEasyClose: false,
			usePopupNav: true,
			windowMargin: (breakpoints.active('<=small') ? 0 : 50)
		});

	});

	const form = $('#contactForm');
	const scriptURL = 'https://script.google.com/macros/s/AKfycbwrideRWt08E8qFSpS3KoKXnerkJpWDYgU1NFxC7b6Pd9jXWxXdA-5Fmx8BwBKwuPz1uQ/exec';

	form.on('submit', function (e) {
		e.preventDefault();

		var formData = new FormData(this);
		$(form).find('#responseMessage').empty();

		// Disable button and show loader
		// $(form).find('button').prop('disabled', true); // Use the correct selector for your button
		$(form).find('button .btn_msg').hide(); // Clear button text
		$(form).find('.contact_btn_loader').show();

		$.ajax({
			url: scriptURL,
			method: 'POST',
			data: formData,
			processData: false,
			contentType: false,
			success: function (response) {
				$(form).find('#responseMessage').html('<span class="text-success">Thank you! Your form has been submitted successfully.</span>');
				form.trigger('reset'); // Optionally reset the form
			},
			error: function (xhr, status, error) {
				console.error('Error!', error);
				$(form).find('#responseMessage').html('<span class="text-danger">Error: ' + error + '</span>'); // Display error message
			},
			complete: function () {
				// Enable button and hide loader
				// $(form).find('button').prop('disabled', false); // Re-enable button
				$(form).find('button .btn_msg').show(); // Reset button text
				$(form).find('.contact_btn_loader').hide(); // Hide loader
			}
		});
	});
})(jQuery);