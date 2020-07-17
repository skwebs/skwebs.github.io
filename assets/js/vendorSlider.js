"use strict";

function is_touch_enabled() {
	return ('ontouchstart' in window) ||
		(navigator.maxTouchPoints > 0) ||
		(navigator.msMaxTouchPoints > 0);
}


$(() => {

	$(".vendor__credit .vendor__slider").slick({
		autoplay: true,
		autoplaySpeed: 2000,
		speed: 300,
		slidesToShow: 1,
		slidesToScroll: 1,
		pauseOnHover: false,
		pauseOnFocus: false ,
		dots: true ,
		cssEase: 'ease-in-out' ,
		// prevArrow: false,nextArrow: false,
		arrows: false ,
		responsive: [{
				breakpoint: 1400,
				settings: {
					slidesToShow: 11
				}
			},
			{
				breakpoint: 1200,
				settings: {
					slidesToShopw: 9
				}
			},
			{
				breakpoint: 992,
				settings: {
					slidesToShow: 7
				}
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 5
				}
			},
			{
				breakpoint: 576,
				settings: {
					slidesToShow: 3
				}
			}
		]
	});
	// ============== // vebdor__slider ================ //
});