var $ = jQuery.noConflict();

$.fn.inlineStyle = function (prop) {
    "use strict";
	return this.prop("style")[$.camelCase(prop)];
};

$.fn.doOnce = function (func) {
    "use strict";
	this.length && func.apply(this);
	return this;
};
// tab
jQuery(function ($) {

	//region Tabs
    "use strict";
	if ($.fn.tab) {
		$('.pi-tabs-navigation a').click(function (e) {
			$(this).tab('show');
			e.preventDefault();
		});

		$('.pi-tabs-vertical').each(function () {
			var $parent = $(this),
				$nav = $parent.find('.pi-tabs-navigation'),
				$content = $parent.find('.pi-tabs-content'),
				navHeight = $nav.height();
			$content.css({
				minHeight: Math.abs(navHeight) + 1
			});
		});
    }

});
// +++++++++++++++++++
// Basket+Search document load
// Look to optimize search
// +++++++++++++++++++
$(document).ready(function () {
    if ($('#basket .qty').length) {
        count = 0;
        $('#basket .qty').each(function(){
           thiscount = $(this).text().match(/[0-9]+/g);
            thiscount = parseInt(thiscount);
            count = count + thiscount;
        });
        $('#basket-wrapper').append('<span class="itemcount">' + count + '</span>');
    };
    var $searchdata;
    var $searchbox = $('#searchfield');
    var timeoutID;
    $searchbox.attr('placeholder', 'Start searching...');
    // Load in search data - format= (<li><a>[searchable text]</a></li>)
    $('#searchdata').load('/web/search/ #skin_Blank', function () {
        $searchdata = $('#searchdata');
    });
    jQuery.expr[':'].Contains = function (a, i, m) {
        return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
    };
    //When typed in, filter the list if the text length is >2
    $searchbox.keyup(function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            var searchText = $searchbox.val().trim();
            var searchQuery = '?q=' + searchText.replace(/\s+/g, '+');
            window.location = 'http://www.upsu.com/search/' + searchQuery;
        }
        clearTimeout(timeoutID);
        timeoutID = setTimeout(function () {
            var filter = $searchbox.val();
            if (filter.length >= 2) {
                //Search the link name and the attributes (if shown) using the Contains function
                var $visible = $searchdata.find('a:Contains("' + filter + '")');
                $visible.parent().show();
                $searchdata.find('a:not(:Contains("' + filter + '"))').parent().hide();
                if ($visible.length != 0) {
                    $searchdata.slideDown('fast');
                }
                else { $searchdata.fadeOut('fast'); }
            }
            else {
                $searchdata.fadeOut('fast');
                $('p#nothing').show();
                $searchdata.find('li').hide();
            }
        });
    });
});

(function () {
    "use strict";
	var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
									|| window[vendors[x]+'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() { callback(currTime + timeToCall); },
			  timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};

	if (!window.cancelAnimationFrame)
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
}());

(function ($) {
    $.fn.countdown = function (options, callback) {

        var thisEl = $(this);

        var settings = {
            'date': null,
            'format': null
        };

        if (options) {
            $.extend(settings, options);
        }

        //main countdown function
        var countdown_proc = function () {

            var eventDate = Date.parse(settings['date']) / 1000;
            var currentDate = Math.floor($.now() / 1000);

            if (eventDate <= currentDate) {
                callback.call(this);
                clearInterval(interval);
            };

            var seconds = eventDate - currentDate;

            var days = Math.floor(seconds / (60 * 60 * 24)); //calculate the number of days
            seconds -= days * 60 * 60 * 24; //update the seconds variable with no. of days removed

            var hours = Math.floor(seconds / (60 * 60));
            seconds -= hours * 60 * 60; //update the seconds variable with no. of hours removed

            var minutes = Math.floor(seconds / 60);
            seconds -= minutes * 60; //update the seconds variable with no. of minutes removed

            //conditional Ss
            if (days == 1) { thisEl.find(".timeRefDays").text("Day"); } else { thisEl.find(".timeRefDays").text("Days"); }
            if (hours == 1) { thisEl.find(".timeRefHours").text("Hour"); } else { thisEl.find(".timeRefHours").text("Hours"); }
            if (minutes == 1) { thisEl.find(".timeRefMinutes").text("Minute"); } else { thisEl.find(".timeRefMinutes").text("Minutes"); }
            if (seconds == 1) { thisEl.find(".timeRefSeconds").text("Second"); } else { thisEl.find(".timeRefSeconds").text("Seconds"); }

            //logic for the two_digits ON setting
            if (settings['format'] == "on") {
                days = (String(days).length >= 2) ? days : "0" + days;
                hours = (String(hours).length >= 2) ? hours : "0" + hours;
                minutes = (String(minutes).length >= 2) ? minutes : "0" + minutes;
                seconds = (String(seconds).length >= 2) ? seconds : "0" + seconds;
            }

            //update the countdown's html values.
            if (!isNaN(eventDate)) {
                thisEl.find(".days").text(days);
                thisEl.find(".hours").text(hours);
                thisEl.find(".minutes").text(minutes);
                thisEl.find(".seconds").text(seconds);
            } else {
                alert("Invalid date. Here's an example: 12 Tuesday 2012 17:30:00");
                clearInterval(interval);
            }
        }

        countdown_proc();

        //loop the function
        interval = setInterval(countdown_proc, 1000);

    }
})(jQuery);


//Call countdown plugin
$(".countdown").countdown({
    date: "3 june 2018 19:00:00", // add the countdown's end date (i.e. 3 november 2017 12:00:00)
    format: "on" // on (03:07:52) | off (3:7:52) - two_digits set to ON maintains layout consistency
},

function debounce(func, wait, immediate) {
	var timeout, args, context, timestamp, result;
	return function() {
		context = this;
		args = arguments;
		timestamp = new Date();
		var later = function() {
			var last = (new Date()) - timestamp;
			if (last < wait) {
				timeout = setTimeout(later, wait - last);
			} else {
				timeout = null;
				if (!immediate) result = func.apply(context, args);
			}
		};
		var callNow = immediate && !timeout;
		if (!timeout) {
			timeout = setTimeout(later, wait);
		}
		if (callNow) result = func.apply(context, args);
		return result;
	};
}

(function($){

	"use strict";

	SU.initialize = {

		init: function(){

			SU.initialize.responsiveClasses();
			SU.initialize.imagePreload( '.portfolio-item:not(:has(.fslider)) img' );
			SU.initialize.stickyElements();
			SU.initialize.goToTop();
			SU.initialize.fullScreen();
			SU.initialize.verticalMiddle();
			SU.initialize.lightbox();
			SU.initialize.resizeVideos();
			SU.initialize.imageFade();
			SU.initialize.pageTransition();
			SU.initialize.dataStyles();
			SU.initialize.dataResponsiveHeights();

			$('.fslider').addClass('preloader2');

		},

		responsiveClasses: function(){
			var jRes = jRespond([
				{
					label: 'smallest',
					enter: 0,
					exit: 479
				},{
					label: 'handheld',
					enter: 480,
					exit: 767
				},{
					label: 'tablet',
					enter: 768,
					exit: 991
				},{
					label: 'laptop',
					enter: 992,
					exit: 1199
				},{
					label: 'desktop',
					enter: 1200,
					exit: 10000
				}
			]);
			jRes.addFunc([
				{
					breakpoint: 'desktop',
					enter: function() { $body.addClass('device-lg'); },
					exit: function() { $body.removeClass('device-lg'); }
				},{
					breakpoint: 'laptop',
					enter: function() { $body.addClass('device-md'); },
					exit: function() { $body.removeClass('device-md'); }
				},{
					breakpoint: 'tablet',
					enter: function() { $body.addClass('device-sm'); },
					exit: function() { $body.removeClass('device-sm'); }
				},{
					breakpoint: 'handheld',
					enter: function() { $body.addClass('device-xs'); },
					exit: function() { $body.removeClass('device-xs'); }
				},{
					breakpoint: 'smallest',
					enter: function() { $body.addClass('device-xxs'); },
					exit: function() { $body.removeClass('device-xxs'); }
				}
			]);
		},

		imagePreload: function(selector, parameters){
			var params = {
				delay: 100,
				transition: 100,
				easing: 'linear'
			};
			$.extend(params, parameters);

			$(selector).each(function() {
				var image = $(this);
				image.css({visibility:'hidden', opacity: 0, display:'block'});
				image.wrap('<span class="preloader" />');
				image.one("load", function(evt) {
					$(this).delay(params.delay).css({visibility:'visible'}).animate({opacity: 1}, params.transition, params.easing, function() {
						$(this).unwrap('<span class="preloader" />');
					});
				}).each(function() {
					if(this.complete) $(this).trigger("load");
				});
			});
		},

		verticalMiddle: function(){
			if( $verticalMiddleEl.length > 0 ) {
				$verticalMiddleEl.each( function(){
					var element = $(this),
						verticalMiddleH = element.outerHeight(),
						headerHeight = $header.outerHeight();

					if( element.parents('#slider').length > 0 && !element.hasClass('ignore-header') ) {
						if( $header.hasClass('transparent-header') && ( $body.hasClass('device-lg') || $body.hasClass('device-md') ) ) {
							verticalMiddleH = verticalMiddleH - 70;
							if( $slider.next('#header').length > 0 ) { verticalMiddleH = verticalMiddleH + headerHeight; }
						}
					}

					if( $body.hasClass('device-xs') || $body.hasClass('device-xxs') ) {
						if( element.parents('.full-screen').length && !element.parents('.force-full-screen').length ){
							element.css({ position: 'relative', top: '0', width: 'auto', marginTop: '0', padding: '40px 0' }).addClass('clearfix');
						} else {
							element.css({ position: 'absolute', top: '50%', width: '100%', marginTop: -(verticalMiddleH/2)+'px' });
						}
					} else {
						element.css({ position: 'absolute', top: '50%', width: '100%', marginTop: -(verticalMiddleH/2)+'px' });
					}
				});
			}
		},

		stickyElements: function(){
			if( $siStickyEl.length > 0 ) {
				var siStickyH = $siStickyEl.outerHeight();
				$siStickyEl.css({ marginTop: -(siStickyH/2)+'px' });
			}

			if( $dotsMenuEl.length > 0 ) {
				var opmdStickyH = $dotsMenuEl.outerHeight();
				$dotsMenuEl.css({ marginTop: -(opmdStickyH/2)+'px' });
			}
		},

		goToTop: function(){
			$goToTopEl.click(function() {
				$('body,html').stop(true).animate({scrollTop:0},200);
				return false;
			});
		},

		goToTopScroll: function(){
			if( $body.hasClass('device-lg') || $body.hasClass('device-md') || $body.hasClass('device-sm') || $body.hasClass('device-xs') ) {
				if($window.scrollTop() > 50) {
					$goToTopEl.fadeIn();
				} else {
					$goToTopEl.fadeOut();
				}
			}
		},

		fullScreen: function(){
			if( $fullScreenEl.length > 0 ) {
				$fullScreenEl.each( function(){
					var element = $(this),
						scrHeight = $window.height();
					if( element.attr('id') == 'slider' ) {
						var sliderHeightOff = $slider.offset().top;
						scrHeight = scrHeight - sliderHeightOff;
						if( element.hasClass('slider-parallax') ) {
							var transformVal = element.css('transform'),
								transformX = transformVal.match(/-?[\d\.]+/g);
							if( !transformX ) { var transformXvalue = 0; } else { var transformXvalue = transformX[5]; }
							scrHeight = ( $window.height() + Number( transformXvalue ) ) - sliderHeightOff;
						}
						if( $('#slider.with-header').next('#header:not(.transparent-header)').length > 0 && ( $body.hasClass('device-lg') || $body.hasClass('device-md') ) ) {
							var headerHeightOff = $header.outerHeight();
							scrHeight = scrHeight - headerHeightOff;
						}
					}
					if( element.parents('.full-screen').length > 0 ) { scrHeight = element.parents('.full-screen').height(); }

					if( $body.hasClass('device-xs') || $body.hasClass('device-xxs') ) {
						if( !element.hasClass('force-full-screen') ){ scrHeight = 'auto'; }
					}

					element.css('height', scrHeight);
					if( element.attr('id') == 'slider' && !element.hasClass('canvas-slider-grid') ) { if( element.has('.swiper-slide') ) { element.find('.swiper-slide').css('height', scrHeight); } }
				});
			}
		},

		maxHeight: function(){
			if( $commonHeightEl.length > 0 ) {
				$commonHeightEl.each( function(){
					var element = $(this);
					if( element.has('.common-height') ) {
						SU.initialize.commonHeight( element.find('.common-height') );
					}

					SU.initialize.commonHeight( element );
				});
			}
		},

		commonHeight: function( element ){
			var maxHeight = 0;
			element.children('[class^=col-]').each(function() {
				var element = $(this).children('div');
				if( element.hasClass('max-height') ){
					maxHeight = element.outerHeight();
				} else {
					if (element.outerHeight() > maxHeight)
					maxHeight = element.outerHeight();
				}
			});

			element.children('[class^=col-]').each(function() {
				$(this).height(maxHeight);
			});
		},

		testimonialsGrid: function(){
			if( $testimonialsGridEl.length > 0 ) {
				if( $body.hasClass('device-sm') || $body.hasClass('device-md') || $body.hasClass('device-lg') ) {
					var maxHeight = 0;
					$testimonialsGridEl.each( function(){
						$(this).find("li > .testimonial").each(function(){
						   if ($(this).height() > maxHeight) { maxHeight = $(this).height(); }
						});
						$(this).find("li").height(maxHeight);
						maxHeight = 0;
					});
				} else {
					$testimonialsGridEl.find("li").css({ 'height': 'auto' });
				}
			}
		},

		lightbox: function(){
			var $lightboxImageEl = $('[data-lightbox="image"]'),
				$lightboxGalleryEl = $('[data-lightbox="gallery"]'),
				$lightboxIframeEl = $('[data-lightbox="iframe"]'),
				$lightboxAjaxEl = $('[data-lightbox="ajax"]'),
				$lightboxAjaxGalleryEl = $('[data-lightbox="ajax-gallery"]');

			if( $lightboxImageEl.length > 0 ) {
				$lightboxImageEl.magnificPopup({
					type: 'image',
					closeOnContentClick: true,
					closeBtnInside: false,
					fixedContentPos: true,
					mainClass: 'mfp-no-margins mfp-fade', // class to remove default margin from left and right side
					image: {
						verticalFit: true
					}
				});
			}

			if( $lightboxGalleryEl.length > 0 ) {
				$lightboxGalleryEl.each(function() {
					var element = $(this);

					if( element.find('a[data-lightbox="gallery-item"]').parent('.clone').hasClass('clone') ) {
						element.find('a[data-lightbox="gallery-item"]').parent('.clone').find('a[data-lightbox="gallery-item"]').attr('data-lightbox','');
					}

					element.magnificPopup({
						delegate: 'a[data-lightbox="gallery-item"]',
						type: 'image',
						closeOnContentClick: true,
						closeBtnInside: false,
						fixedContentPos: true,
						mainClass: 'mfp-no-margins mfp-fade', // class to remove default margin from left and right side
						image: {
							verticalFit: true
						},
						gallery: {
							enabled: true,
							navigateByImgClick: true,
							preload: [0,1] // Will preload 0 - before current, and 1 after the current image
						}
					});
				});
			}

			if( $lightboxIframeEl.length > 0 ) {
				$lightboxIframeEl.magnificPopup({
					disableOn: 100,
					type: 'iframe',
					removalDelay: 100,
					preloader: false,
					fixedContentPos: false
				});
			}

			if( $lightboxAjaxEl.length > 0 ) {
				$lightboxAjaxEl.magnificPopup({
					type: 'ajax',
					closeBtnInside: false,
					callbacks: {
						ajaxContentAdded: function(mfpResponse) {
							SU.widget.loadFlexSlider();
							SU.initialize.resizeVideos();
							SU.widget.masonryThumbs();
						},
						open: function() {
							$body.addClass('ohidden');
						},
						close: function() {
							$body.removeClass('ohidden');
						}
					}
				});
			}

			if( $lightboxAjaxGalleryEl.length > 0 ) {
				$lightboxAjaxGalleryEl.magnificPopup({
					delegate: 'a[data-lightbox="ajax-gallery-item"]',
					type: 'ajax',
					closeBtnInside: false,
					gallery: {
						enabled: true,
						preload: 0,
						navigateByImgClick: false
					},
					callbacks: {
						ajaxContentAdded: function(mfpResponse) {
							SU.widget.loadFlexSlider();
							SU.initialize.resizeVideos();
							SU.widget.masonryThumbs();
						},
						open: function() {
							$body.addClass('ohidden');
						},
						close: function() {
							$body.removeClass('ohidden');
						}
					}
				});
			}
		},
        
        // NEW modal windows for staff pages + ads, mentions, imp cases, notifications.
        modal: function(){
			var $modal = $('.modal-on-load:not(.customjs)');
			if( $modal.length > 0 ) {
				$modal.each( function(){
					var element				= $(this),
						elementTarget		= element.attr('data-target'),
						elementTargetValue	= elementTarget.split('#')[1],
						elementDelay		= element.attr('data-delay'),
						elementTimeout		= element.attr('data-timeout'),
						elementAnimateIn	= element.attr('data-animate-in'),
						elementAnimateOut	= element.attr('data-animate-out');

					if( !element.hasClass('enable-cookie') ) { $.removeCookie( elementTargetValue ); }

					if( element.hasClass('enable-cookie') ) {
						var elementCookie = $.cookie( elementTargetValue );

						if( typeof elementCookie !== 'undefined' && elementCookie == '0' ) {
							return true;
						}
					}

					if( !elementDelay ) {
						elementDelay = 1500;
					} else {
						elementDelay = Number(elementDelay) + 1500;
					}

					var t = setTimeout(function() {
						$.magnificPopup.open({
							items: { src: elementTarget },
							type: 'inline',
							mainClass: 'mfp-no-margins mfp-fade',
							closeBtnInside: false,
							fixedContentPos: true,
							removalDelay: 500,
							callbacks: {
								open: function(){
									if( elementAnimateIn != '' ) {
										$(elementTarget).addClass( elementAnimateIn + ' animated' );
									}
								},
								beforeClose: function(){
									if( elementAnimateOut != '' ) {
										$(elementTarget).removeClass( elementAnimateIn ).addClass( elementAnimateOut );
									}
								},
								afterClose: function() {
									if( elementAnimateIn != '' || elementAnimateOut != '' ) {
										$(elementTarget).removeClass( elementAnimateIn + ' ' + elementAnimateOut + ' animated' );
									}
									if( element.hasClass('enable-cookie') ) {
										$.cookie( elementTargetValue, '0' );
									}
								}
							}
						}, 0);
					}, Number(elementDelay) );

					if( elementTimeout != '' ) {
						var to = setTimeout(function() {
							$.magnificPopup.close();
						}, Number(elementDelay) + Number(elementTimeout) );
					}
				});
			}
		},

		resizeVideos: function(){
			if ( $().fitVids ) {
				$("#content,#footer,#slider:not(.revslider-wrap),.landing-offer-media,.portfolio-ajax-modal").fitVids({
					customSelector: "iframe[src^='http://www.dailymotion.com/embed']",
					ignore: '.no-fv'
				});
			}
        },

		imageFade: function(){
			$('.image_fade').hover( function(){
				$(this).filter(':not(:animated)').animate({opacity: 0.7}, 400);
			}, function() {
				$(this).animate({opacity: 1}, 400);
			});
		},

		pageTransition: function(){
			if( !$body.hasClass('no-transition') ){
				var animationIn = $body.attr('data-animation-in'),
					animationOut = $body.attr('data-animation-out'),
					durationIn = $body.attr('data-speed-in'),
					durationOut = $body.attr('data-speed-out'),
					loaderStyle = $body.attr('data-loader'),
					loaderColor = $body.attr('data-loader-color'),
					loaderStyleHtml = '<div class="css3-spinner-bounce1"></div><div class="css3-spinner-bounce2"></div><div class="css3-spinner-bounce3"></div>',
					loaderBgStyle = '',
					loaderBorderStyle = '',
					loaderBgClass = '',
					loaderBorderClass = '',
					loaderBgClass2 = '',
					loaderBorderClass2 = '';

				if( !animationIn ) { animationIn = 'fadeIn'; }
				if( !animationOut ) { animationOut = 'fadeOut'; }
				if( !durationIn ) { durationIn = 1500; }
				if( !durationOut ) { durationOut = 800; }
			}
		},

		topScrollOffset: function() {
			var topOffsetScroll = 0;

			if( ( $body.hasClass('device-lg') || $body.hasClass('device-md') ) && !SU.isMobile.any() ) {
				if( $header.hasClass('sticky-header') ) {
					if( $pagemenu.hasClass('dots-menu') ) { topOffsetScroll = 100; } else { topOffsetScroll = 144; }
				} else {
					if( $pagemenu.hasClass('dots-menu') ) { topOffsetScroll = 140; } else { topOffsetScroll = 184; }
				}

				if( !$pagemenu.length ) {
					if( $header.hasClass('sticky-header') ) { topOffsetScroll = 100; } else { topOffsetScroll = 140; }
				}
			} else {
				topOffsetScroll = 40;
			}

			return topOffsetScroll;
		},

		defineColumns: function( element ){
			var column = 4;

			if( element.hasClass('portfolio-full') ) {
				if( element.hasClass('portfolio-3') ) column = 3;
				else if( element.hasClass('portfolio-5') ) column = 5;
				else if( element.hasClass('portfolio-6') ) column = 6;
				else column = 4;

				if( $body.hasClass('device-sm') && ( column == 4 || column == 5 || column == 6 ) ) {
					column = 3;
				} else if( $body.hasClass('device-xs') && ( column == 3 || column == 4 || column == 5 || column == 6 ) ) {
					column = 2;
				} else if( $body.hasClass('device-xxs') ) {
					column = 1;
				}
			} else if( element.hasClass('masonry-thumbs') ) {

				var lgCol = element.attr('data-lg-col'),
					mdCol = element.attr('data-md-col'),
					smCol = element.attr('data-sm-col'),
					xsCol = element.attrvideo('data-xs-col'),
					xxsCol = element.attr('data-xxs-col');

				if( element.hasClass('col-2') ) column = 2;
				else if( element.hasClass('col-3') ) column = 3;
				else if( element.hasClass('col-5') ) column = 5;
				else if( element.hasClass('col-6') ) column = 6;
				else column = 4;

				if( $body.hasClass('device-lg') ) {
					if( lgCol ) { column = Number(lgCol); }
				} else if( $body.hasClass('device-md') ) {
					if( mdCol ) { column = Number(mdCol); }
				} else if( $body.hasClass('device-sm') ) {
					if( smCol ) { column = Number(smCol); }
				} else if( $body.hasClass('device-xs') ) {
					if( xsCol ) { column = Number(xsCol); }
				} else if( $body.hasClass('device-xxs') ) {
					if( xxsCol ) { column = Number(xxsCol); }
				}

			}

			return column;
		},

		setFullColumnWidth: function( element ){

			if( element.hasClass('portfolio-full') ) {
				var columns = SU.initialize.defineColumns( element );
				var containerWidth = element.width();
				if( containerWidth == ( Math.floor(containerWidth/columns) * columns ) ) { containerWidth = containerWidth - 1; }
				var postWidth = Math.floor(containerWidth/columns);
				if( $body.hasClass('device-xxs') ) { var deviceSmallest = 1; } else { var deviceSmallest = 0; }
				element.find(".portfolio-item").each(function(index){
					if( deviceSmallest == 0 && $(this).hasClass('wide') ) { var elementSize = ( postWidth*2 ); } else { var elementSize = postWidth; }
					$(this).css({"width":elementSize+"px"});
				});
			} else if( element.hasClass('masonry-thumbs') ) {
				var columns = SU.initialize.defineColumns( element ),
					containerWidth = element.innerWidth(),
					windowWidth = $window.width();
				if( containerWidth == windowWidth ){
					containerWidth = windowWidth*1.004;
					element.css({ 'width': containerWidth+'px' });
				}
				var postWidth = (containerWidth/columns);

				postWidth = Math.floor(postWidth);

				if( ( postWidth * columns ) >= containerWidth ) { element.css({ 'margin-right': '-1px' }); }

				element.children('a').css({"width":postWidth+"px"});

				var firstElementWidth = element.find('a:eq(0)').outerWidth();

				element.isotope({
					masonry: {
						columnWidth: firstElementWidth
					}
				});

				var bigImageNumbers = element.attr('data-big');
				if( bigImageNumbers ) {
					bigImageNumbers = bigImageNumbers.split(",");
					var bigImageNumber = '',
						bigi = '';
					for( bigi = 0; bigi < bigImageNumbers.length; bigi++ ){
						bigImageNumber = Number(bigImageNumbers[bigi]) - 1;
						element.find('a:eq('+bigImageNumber+')').css({ width: firstElementWidth*2 + 'px' });
					}
					var t = setTimeout( function(){
						element.isotope('layout');
					}, 1000 );
				}
			}

		},

		aspectResizer: function(){
			var $aspectResizerEl = $('.aspect-resizer');
			if( $aspectResizerEl.length > 0 ) {
				$aspectResizerEl.each( function(){
					var element = $(this),
						elementW = element.inlineStyle('width'),
						elementH = element.inlineStyle('height'),
						elementPW = element.parent().innerWidth();
				});
			}
		},

		dataStyles: function(){
			var $dataStyleXxs = $('[data-style-xxs]'),
				$dataStyleXs = $('[data-style-xs]'),
				$dataStyleSm = $('[data-style-sm]'),
				$dataStyleMd = $('[data-style-md]'),
				$dataStyleLg = $('[data-style-lg]');

			if( $dataStyleXxs.length > 0 ) {
				$dataStyleXxs.each( function(){
					var element = $(this),
						elementStyle = element.attr('data-style-xxs');

					if( $body.hasClass('device-xxs') ) {
						if( elementStyle != '' ) { element.attr( 'style', elementStyle ); }
					}
				});
			}

			if( $dataStyleXs.length > 0 ) {
				$dataStyleXs.each( function(){
					var element = $(this),
						elementStyle = element.attr('data-style-xs');

					if( $body.hasClass('device-xs') ) {
						if( elementStyle != '' ) { element.attr( 'style', elementStyle ); }
					}
				});
			}

			if( $dataStyleSm.length > 0 ) {
				$dataStyleSm.each( function(){
					var element = $(this),
						elementStyle = element.attr('data-style-sm');

					if( $body.hasClass('device-sm') ) {
						if( elementStyle != '' ) { element.attr( 'style', elementStyle ); }
					}
				});
			}

			if( $dataStyleMd.length > 0 ) {
				$dataStyleMd.each( function(){
					var element = $(this),
						elementStyle = element.attr('data-style-md');

					if( $body.hasClass('device-md') ) {
						if( elementStyle != '' ) { element.attr( 'style', elementStyle ); }
					}
				});
			}

			if( $dataStyleLg.length > 0 ) {
				$dataStyleLg.each( function(){
					var element = $(this),
						elementStyle = element.attr('data-style-lg');

					if( $body.hasClass('device-lg') ) {
						if( elementStyle != '' ) { element.attr( 'style', elementStyle ); }
					}
				});
			}
		},

		dataResponsiveHeights: function(){
			var $dataHeightXxs = $('[data-height-xxs]'),
				$dataHeightXs = $('[data-height-xs]'),
				$dataHeightSm = $('[data-height-sm]'),
				$dataHeightMd = $('[data-height-md]'),
				$dataHeightLg = $('[data-height-lg]');

			if( $dataHeightXxs.length > 0 ) {
				$dataHeightXxs.each( function(){
					var element = $(this),
						elementHeight = element.attr('data-height-xxs');

					if( $body.hasClass('device-xxs') ) {
						if( elementHeight != '' ) { element.css( 'height', elementHeight ); }
					}
				});
			}

			if( $dataHeightXs.length > 0 ) {
				$dataHeightXs.each( function(){
					var element = $(this),
						elementHeight = element.attr('data-height-xs');

					if( $body.hasClass('device-xs') ) {
						if( elementHeight != '' ) { element.css( 'height', elementHeight ); }
					}
				});
			}

			if( $dataHeightSm.length > 0 ) {
				$dataHeightSm.each( function(){
					var element = $(this),
						elementHeight = element.attr('data-height-sm');

					if( $body.hasClass('device-sm') ) {
						if( elementHeight != '' ) { element.css( 'height', elementHeight ); }
					}
				});
			}

			if( $dataHeightMd.length > 0 ) {
				$dataHeightMd.each( function(){
					var element = $(this),
						elementHeight = element.attr('data-height-md');

					if( $body.hasClass('device-md') ) {
						if( elementHeight != '' ) { element.css( 'height', elementHeight ); }
					}
				});
			}

			if( $dataHeightLg.length > 0 ) {
				$dataHeightLg.each( function(){
					var element = $(this),
						elementHeight = element.attr('data-height-lg');

					if( $body.hasClass('device-lg') ) {
						if( elementHeight != '' ) { element.css( 'height', elementHeight ); }
					}
				});
			}
		},

		stickFooterOnSmall: function(){
			var windowH = $window.height(),
				wrapperH = $wrapper.height();

			if( $footer.length > 0 && $wrapper.has('#footer') ) {
				if( windowH > wrapperH ) {
					$footer.css({ 'margin-top': ( windowH - wrapperH ) });
				}
			}
		}

	};

	SU.header = {

		init: function(){

			SU.header.superfish();
			SU.header.menufunctions();
			SU.header.fullWidthMenu();
			SU.header.overlayMenu();
			SU.header.stickyMenu();
			SU.header.sideHeader();
			SU.header.sidePanel();
			SU.header.onePageScroll();
			SU.header.onepageScroller();
			SU.header.darkLogo();
			SU.header.topsearch();
			SU.header.topcart();

		},

		superfish: function(){

			if ( $().superfish ) {
				if( $body.hasClass('device-lg') || $body.hasClass('device-md') ) {
					$('#primary-menu ul ul, #primary-menu ul .mega-menu-content').css('display', 'block');
					SU.header.menuInvert();
				}

				$('body:not(.side-header) #primary-menu > ul, body:not(.side-header) #primary-menu > div > ul,.top-links > ul').superfish({
					popUpSelector: 'ul,.mega-menu-content,.top-link-section',
					delay: 250,
					speed: 350,
					animation: {opacity:'show'},
					animationOut:  {opacity:'hide'},
					cssArrows: false
				});

				$('body.side-header #primary-menu > ul').superfish({
					popUpSelector: 'ul',
					delay: 250,
					speed: 350,
					animation: {opacity:'show',height:'show'},
					animationOut:  {opacity:'hide',height:'hide'},
					cssArrows: false
				});
			}

		},

		menuInvert: function() {

			$('#primary-menu .mega-menu-content, #primary-menu ul ul').each( function( index, element ){
				var $menuChildElement = $(element);
				var windowWidth = $window.width();
				var menuChildOffset = $menuChildElement.offset();
				var menuChildWidth = $menuChildElement.width();
				var menuChildLeft = menuChildOffset.left;

				if(windowWidth - (menuChildWidth + menuChildLeft) < 0) {
					$menuChildElement.addClass('menu-pos-invert');
				}
			});

		},

		menufunctions: function(){

			$( '#primary-menu ul li:has(ul)' ).addClass('sub-menu');
			$( '.top-links ul li:has(ul) > a' ).append( ' <i class="icon-angle-down"></i>' );
			$( '.top-links > ul' ).addClass( 'clearfix' );

			if( $body.hasClass('device-lg') || $body.hasClass('device-md') ) {
				$('#primary-menu.sub-title > ul > li').hover(function() {
					$(this).prev().css({ backgroundImage : 'none' });
				}, function() {
					$(this).prev().css({ backgroundImage : 'url("images/icons/menu-divider.png")' });
				});

				$('#primary-menu.sub-title').children('ul').children('.current').prev().css({ backgroundImage : 'none' });
			}

			if( SU.isMobile.Android() ) {
				$( '#primary-menu ul li.sub-menu' ).children('a').on('touchstart', function(e){
					if( !$(this).parent('li.sub-menu').hasClass('sfHover') ) {
						e.preventDefault();
					}
				});
			}

			if( SU.isMobile.Windows() ) {
				$('#primary-menu > ul, #primary-menu > div > ul,.top-links > ul').superfish('destroy').addClass('windows-mobile-menu');

				$( '#primary-menu ul li:has(ul)' ).append('<a href="#" class="wn-submenu-trigger"><i class="icon-angle-down"></i></a>');

				$( '#primary-menu ul li.sub-menu' ).children('a.wn-submenu-trigger').click( function(e){
					$(this).parent().toggleClass('open');
					$(this).parent().find('> ul, > .mega-menu-content').stop(true,true).toggle();
					return false;
				});
			}

		},

		fullWidthMenu: function(){
			if( $body.hasClass('stretched') ) {
				if( $header.find('.container-fullwidth').length > 0 ) { $('.mega-menu .mega-menu-content').css({ 'width': $wrapper.width() - 120 }); }
				if( $header.hasClass('full-header') ) { $('.mega-menu .mega-menu-content').css({ 'width': $wrapper.width() - 60 }); }
			} else {
				if( $header.find('.container-fullwidth').length > 0 ) { $('.mega-menu .mega-menu-content').css({ 'width': $wrapper.width() - 120 }); }
				if( $header.hasClass('full-header') ) { $('.mega-menu .mega-menu-content').css({ 'width': $wrapper.width() - 80 }); }
			}
		},

		overlayMenu: function(){
			if( $body.hasClass('overlay-menu') ) {
				var overlayMenuItem = $('#primary-menu').children('ul').children('li'),
					overlayMenuItemHeight = overlayMenuItem.outerHeight(),
					overlayMenuItemTHeight = overlayMenuItem.length * overlayMenuItemHeight,
					firstItemOffset = ( $window.height() - overlayMenuItemTHeight ) / 2;

				$('#primary-menu').children('ul').children('li:first-child').css({ 'margin-top': firstItemOffset+'px' });
			}
		},

		stickyMenu: function( headerOffset ){
			if ($window.scrollTop() > headerOffset) {
				if( $body.hasClass('device-lg') || $body.hasClass('device-md') ) {
					$('body:not(.side-header) #header:not(.no-sticky)').addClass('sticky-header');
					$('#page-menu:not(.dots-menu,.no-sticky)').addClass('sticky-page-menu');
					if( !$headerWrap.hasClass('force-not-dark') ) { $headerWrap.removeClass('not-dark'); }
					SU.header.stickyMenuClass();
				} else if( $body.hasClass('device-xs') || $body.hasClass('device-xxs') || $body.hasClass('device-sm') ) {
					if( $body.hasClass('sticky-responsive-menu') ) {
						$('#header:not(.no-sticky)').addClass('responsive-sticky-header');
						SU.header.stickyMenuClass();
					}
				}
			} else {
				SU.header.removeStickyness();
			}
		},

		removeStickyness: function(){
			if( $header.hasClass('sticky-header') ){
				$('body:not(.side-header) #header:not(.no-sticky)').removeClass('sticky-header');
				$header.removeClass().addClass(oldHeaderClasses);
				$headerWrap.removeClass().addClass(oldHeaderWrapClasses);
				if( !$headerWrap.hasClass('force-not-dark') ) { $headerWrap.removeClass('not-dark'); }
				SU.slider.swiperSliderMenu();
				SU.slider.revolutionSliderMenu();
			}
			if( $pagemenu.hasClass('sticky-page-menu') ){
				$('#page-menu:not(.dots-menu,.no-sticky)').removeClass('sticky-page-menu');
			}
			if( $header.hasClass('responsive-sticky-header') ){
				$('body.sticky-responsive-menu #header').removeClass('responsive-sticky-header');
			}
			if( ( $body.hasClass('device-xs') || $body.hasClass('device-xxs') || $body.hasClass('device-sm') ) && ( typeof responsiveMenuClasses === 'undefined' ) ) {
				$header.removeClass().addClass(oldHeaderClasses);
				$headerWrap.removeClass().addClass(oldHeaderWrapClasses);
				if( !$headerWrap.hasClass('force-not-dark') ) { $headerWrap.removeClass('not-dark'); }
			}
		},

		sideHeader: function(){
			$("#header-trigger").click(function(){
				$('body.open-header').toggleClass("side-header-open");
				return false;
			});
		},

		sidePanel: function(){
			$(".side-panel-trigger").click(function(){
				$body.toggleClass("side-panel-open");
				if( $body.hasClass('device-touch') ) {
					$body.toggleClass("ohidden");
				}
				return false;
			});
		},

		onePageScroll: function(){
			if( $onePageMenuEl.length > 0 ){
				var onePageSpeed = $onePageMenuEl.attr('data-speed'),
					onePageOffset = $onePageMenuEl.attr('data-offset'),
					onePageEasing = $onePageMenuEl.attr('data-easing');

				if( !onePageSpeed ) { onePageSpeed = 1000; }
				if( !onePageEasing ) { onePageEasing = 'easeOutQuad'; }

				$onePageMenuEl.find('a[data-href]').click(function(){
					var element = $(this),
						divScrollToAnchor = element.attr('data-href'),
						divScrollSpeed = element.attr('data-speed'),
						divScrollOffset = element.attr('data-offset'),
						divScrollEasing = element.attr('data-easing');

					if( $( divScrollToAnchor ).length > 0 ) {

						if( !onePageOffset ) {
							var onePageOffsetG = SU.initialize.topScrollOffset();
						} else {
							var onePageOffsetG = onePageOffset;
						}

						if( !divScrollSpeed ) { divScrollSpeed = onePageSpeed; }
						if( !divScrollOffset ) { divScrollOffset = onePageOffsetG; }
						if( !divScrollEasing ) { divScrollEasing = onePageEasing; }

						if( $onePageMenuEl.hasClass('no-offset') ) { divScrollOffset = 0; }

						onePageGlobalOffset = Number(divScrollOffset);

						$onePageMenuEl.find('li').removeClass('current');
						$onePageMenuEl.find('a[data-href="' + divScrollToAnchor + '"]').parent('li').addClass('current');

						$('#primary-menu > ul, #primary-menu > .container > ul').toggleClass('show', function() {
							$('html,body').stop(true).animate({
								'scrollTop': $( divScrollToAnchor ).offset().top - Number(divScrollOffset)
							}, Number(divScrollSpeed), divScrollEasing);
						}, false);

						onePageGlobalOffset = Number(divScrollOffset);
					}

					return false;
				});
			}
		},

		onepageScroller: function(){
			$onePageMenuEl.find('li').removeClass('current');
			$onePageMenuEl.find('a[data-href="#' + SU.header.onePageCurrentSection() + '"]').parent('li').addClass('current');
		},

		onePageCurrentSection: function(){
			var currentOnePageSection = 'home';

			$pageSectionEl.each(function(index) {
				var h = $(this).offset().top;
				var y = $window.scrollTop();

				var offsetScroll = 100 + onePageGlobalOffset;

				if( y + offsetScroll >= h && y < h + $(this).height() && $(this).attr('id') != currentOnePageSection ) {
					currentOnePageSection = $(this).attr('id');
				}
			});

			return currentOnePageSection;
		},

		darkLogo: function(){
			if( ( $header.hasClass('dark') || $body.hasClass('dark') ) && !$headerWrap.hasClass('not-dark') ) {
				if( defaultDarkLogo ){ defaultLogo.find('img').attr('src', defaultDarkLogo); }
				if( retinaDarkLogo ){ retinaLogo.find('img').attr('src', retinaDarkLogo); }
			} else {
				if( defaultLogoImg ){ defaultLogo.find('img').attr('src', defaultLogoImg); }
				if( retinaLogoImg ){ retinaLogo.find('img').attr('src', retinaLogoImg); }
			}
		},

		stickyMenuClass: function(){
			if( stickyMenuClasses ) { var newClassesArray = stickyMenuClasses.split(/ +/); } else { var newClassesArray = ''; }
			var noOfNewClasses = newClassesArray.length;

			if( noOfNewClasses > 0 ) {
				var i = 0;
				for( i=0; i<noOfNewClasses; i++ ) {
					if( newClassesArray[i] == 'not-dark' ) {
						$header.removeClass('dark');
						$headerWrap.addClass('not-dark');
					} else if( newClassesArray[i] == 'dark' ) {
						$headerWrap.removeClass('not-dark force-not-dark');
						if( !$header.hasClass( newClassesArray[i] ) ) {
							$header.addClass( newClassesArray[i] );
						}
					} else if( !$header.hasClass( newClassesArray[i] ) ) {
						$header.addClass( newClassesArray[i] );
					}
				}
			}
		},

		responsiveMenuClass: function(){
			if( $body.hasClass('device-xs') || $body.hasClass('device-xxs') || $body.hasClass('device-sm') ){
				if( responsiveMenuClasses ) { var newClassesArray = responsiveMenuClasses.split(/ +/); } else { var newClassesArray = ''; }
				var noOfNewClasses = newClassesArray.length;

				if( noOfNewClasses > 0 ) {
					var i = 0;
					for( i=0; i<noOfNewClasses; i++ ) {
						if( newClassesArray[i] == 'not-dark' ) {
							$header.removeClass('dark');
							$headerWrap.addClass('not-dark');
						} else if( newClassesArray[i] == 'dark' ) {
							$headerWrap.removeClass('not-dark force-not-dark');
							if( !$header.hasClass( newClassesArray[i] ) ) {
								$header.addClass( newClassesArray[i] );
							}
						} else if( !$header.hasClass( newClassesArray[i] ) ) {
							$header.addClass( newClassesArray[i] );
						}
					}
				}
				SU.header.darkLogo();
			}
		},

		topsearch: function(){

			$(document).on('click', function(event) {
				if (!$(event.target).closest('#top-search').length) { $body.toggleClass('top-search-open', false); }
				if (!$(event.target).closest('#top-cart').length) { $topCart.toggleClass('top-cart-open', false); }
				if (!$(event.target).closest('#page-menu').length) { $pagemenu.toggleClass('pagemenu-active', false); }
				if (!$(event.target).closest('#side-panel').length) { $body.toggleClass('side-panel-open', false); }
			});

			$("#top-search-trigger").click(function(e){
				$body.toggleClass('top-search-open');
				$topCart.toggleClass('top-cart-open', false);
				$( '#primary-menu > ul, #primary-menu > div > ul' ).toggleClass("show", false);
				$pagemenu.toggleClass('pagemenu-active', false);
				if ($body.hasClass('top-search-open')){
					$topSearch.find('input').focus();
				}
				e.stopPropagation();
				e.preventDefault();
			});

		},

		topcart: function(){

			$("#top-cart-trigger").click(function(e){
				$pagemenu.toggleClass('pagemenu-active', false);
				$topCart.toggleClass('top-cart-open');
				e.stopPropagation();
				e.preventDefault();
			});

		}

	};

	SU.slider = {

		init: function() {

            SU.slider.sliderParallaxDimensions();
			SU.slider.sliderRun();
			SU.slider.sliderParallax();
			SU.slider.sliderElementsFade();
			SU.slider.captionPosition();

		},
        
		sliderParallaxDimensions: function(){
			if( $sliderParallaxEl.find('.slider-parallax-inner').length < 1 ) { return true; }

			var parallaxElHeight = $sliderParallaxEl.outerHeight(),
				parallaxElWidth = $sliderParallaxEl.outerWidth();

			if( $sliderParallaxEl.hasClass('revslider-wrap') ) {
				parallaxElHeight = $sliderParallaxEl.find('.slider-parallax-inner').children().first().outerHeight();
				$sliderParallaxEl.height( parallaxElHeight );
			}

			$sliderParallaxEl.find('.slider-parallax-inner').height( parallaxElHeight );

			if( $body.hasClass('side-header') ) {
				$sliderParallaxEl.find('.slider-parallax-inner').width( parallaxElWidth );
			}

			if( !$body.hasClass('stretched') ) {
				parallaxElWidth = $wrapper.outerWidth();
				$sliderParallaxEl.find('.slider-parallax-inner').width( parallaxElWidth );
			}

			if( swiperSlider != '' ) { swiperSlider.update( true ); }
		},

		sliderRun: function(){

			if( typeof Swiper === 'undefined' ) {
				console.log('sliderRun: Swiper not Defined.');
				return true;
			}

			if( $slider.hasClass('customjs') ) { return true; }

			if( $slider.hasClass('swiper_wrapper') ) {

				var element = $slider.filter('.swiper_wrapper'),
					elementDirection = element.attr('data-direction'),
					elementSpeed = element.attr('data-speed'),
					elementAutoPlay = element.attr('data-autoplay'),
					elementLoop = element.attr('data-loop'),
					elementEffect = element.attr('data-effect'),
					elementGrabCursor = element.attr('data-grab'),
					slideNumberTotal = element.find('#slide-number-total'),
					slideNumberCurrent = element.find('#slide-number-current'),
					sliderVideoAutoPlay = element.attr('data-video-autoplay');

				if( !elementSpeed ) { elementSpeed = 300; }
				if( !elementDirection ) { elementDirection = 'horizontal'; }
				if( elementAutoPlay ) { elementAutoPlay = Number( elementAutoPlay ); }
				if( elementLoop == 'true' ) { elementLoop = true; } else { elementLoop = false; }
				if( !elementEffect ) { elementEffect = 'slide'; }
				if( elementGrabCursor == 'false' ) { elementGrabCursor = false; } else { elementGrabCursor = true; }
				if( sliderVideoAutoPlay == 'false' ) { sliderVideoAutoPlay = false; } else { sliderVideoAutoPlay = true; }

				if( element.find('.swiper-pagination').length > 0 ) {
					var elementPagination = '.swiper-pagination',
						elementPaginationClickable = true;
				} else {
					var elementPagination = '',
						elementPaginationClickable = false;
				}

				var elementNavNext = '#slider-arrow-right',
					elementNavPrev = '#slider-arrow-left';

				swiperSlider = new Swiper( element.find('.swiper-parent') ,{
					direction: elementDirection,
					speed: Number( elementSpeed ),
					autoplay: elementAutoPlay,
					loop: elementLoop,
					effect: elementEffect,
					slidesPerView: 1,
					grabCursor: elementGrabCursor,
					pagination: elementPagination,
					paginationClickable: elementPaginationClickable,
					prevButton: elementNavPrev,
					nextButton: elementNavNext,
					onInit: function(swiper){
						SU.slider.sliderParallaxDimensions();
						element.find('.yt-bg-player').removeClass('customjs');
						SU.widget.youtubeBgVideo();
						$('.swiper-slide-active [data-caption-animate]').each(function(){
							var $toAnimateElement = $(this),
								toAnimateDelay = $toAnimateElement.attr('data-caption-delay'),
								toAnimateDelayTime = 0;
							if( toAnimateDelay ) { toAnimateDelayTime = Number( toAnimateDelay ) + 750; } else { toAnimateDelayTime = 750; }
							if( !$toAnimateElement.hasClass('animated') ) {
								$toAnimateElement.addClass('not-animated');
								var elementAnimation = $toAnimateElement.attr('data-caption-animate');
								setTimeout(function() {
									$toAnimateElement.removeClass('not-animated').addClass( elementAnimation + ' animated');
								}, toAnimateDelayTime);
							}
						});
						$('[data-caption-animate]').each(function(){
							var $toAnimateElement = $(this),
								elementAnimation = $toAnimateElement.attr('data-caption-animate');
							if( $toAnimateElement.parents('.swiper-slide').hasClass('swiper-slide-active') ) { return true; }
							$toAnimateElement.removeClass('animated').removeClass(elementAnimation).addClass('not-animated');
						});
						SU.slider.swiperSliderMenu();
					},
					onSlideChangeStart: function(swiper){
						if( slideNumberCurrent.length > 0 ){
							if( elementLoop == true ) {
								slideNumberCurrent.html( Number( element.find('.swiper-slide.swiper-slide-active').attr('data-swiper-slide-index') ) + 1 );
							} else {
								slideNumberCurrent.html( swiperSlider.activeIndex + 1 );
							}
						}
						$('[data-caption-animate]').each(function(){
							var $toAnimateElement = $(this),
								elementAnimation = $toAnimateElement.attr('data-caption-animate');
							if( $toAnimateElement.parents('.swiper-slide').hasClass('swiper-slide-active') ) { return true; }
							$toAnimateElement.removeClass('animated').removeClass(elementAnimation).addClass('not-animated');
						});
						SU.slider.swiperSliderMenu();
					},
					onSlideChangeEnd: function(swiper){
						element.find('.swiper-slide').each(function(){
							if( element.find('video').length > 0 && sliderVideoAutoPlay == true ) { element.find('video').get(0).pause(); }
							if( element.find('.yt-bg-player:not(.customjs)').length > 0 ) { element.find('.yt-bg-player:not(.customjs)').YTPPause(); }
						});
						element.find('.swiper-slide:not(".swiper-slide-active")').each(function(){
							if( element.find('video').length > 0 ) {
								if( element.find('video').get(0).currentTime != 0 ) { element.find('video').get(0).currentTime = 0; }
							}
							if( element.find('.yt-bg-player:not(.customjs)').length > 0 ) {
								element.find('.yt-bg-player:not(.customjs)').getPlayer().seekTo( element.find('.yt-bg-player:not(.customjs)').attr('data-start') );
							}
						});
						if( element.find('.swiper-slide.swiper-slide-active').find('video').length > 0 && sliderVideoAutoPlay == true ) { element.find('.swiper-slide.swiper-slide-active').find('video').get(0).play(); }
						if( element.find('.swiper-slide.swiper-slide-active').find('.yt-bg-player:not(.customjs)').length > 0 ) { element.find('.swiper-slide.swiper-slide-active').find('.yt-bg-player:not(.customjs)').YTPPlay(); }

						element.find('.swiper-slide.swiper-slide-active [data-caption-animate]').each(function(){
							var $toAnimateElement = $(this),
								toAnimateDelay = $toAnimateElement.attr('data-caption-delay'),
								toAnimateDelayTime = 0;
							if( toAnimateDelay ) { toAnimateDelayTime = Number( toAnimateDelay ) + 300; } else { toAnimateDelayTime = 300; }
							if( !$toAnimateElement.hasClass('animated') ) {
								$toAnimateElement.addClass('not-animated');
								var elementAnimation = $toAnimateElement.attr('data-caption-animate');
								setTimeout(function() {
									$toAnimateElement.removeClass('not-animated').addClass( elementAnimation + ' animated');
								}, toAnimateDelayTime);
							}
						});
					}
				});

				if( slideNumberCurrent.length > 0 ) {
					if( elementLoop == true ) {
						slideNumberCurrent.html( Number( element.find('.swiper-slide.swiper-slide-active').attr('data-swiper-slide-index') ) + 1 );
					} else {
						slideNumberCurrent.html( swiperSlider.activeIndex + 1 );
					}
				}
				if( slideNumberTotal.length > 0 ) {
					slideNumberTotal.html( element.find('.swiper-slide:not(.swiper-slide-duplicate)').length );
				}

			}
		},
		sliderParallaxOffset: function(){
			var sliderParallaxOffsetTop = 0;
			var headerHeight = $header.outerHeight();
			if( $body.hasClass('side-header') || $header.hasClass('transparent-header') ) { headerHeight = 0; }
			if( $pageTitle.length > 0 ) {
				var pageTitleHeight = $pageTitle.outerHeight();
				sliderParallaxOffsetTop = pageTitleHeight + headerHeight;
			} else {
				sliderParallaxOffsetTop = headerHeight;
			}

			if( $slider.next('#header').length > 0 ) { sliderParallaxOffsetTop = 0; }

			return sliderParallaxOffsetTop;
		},

		sliderParallax: function(){
			if( $sliderParallaxEl.length > 0 ) {
				if( ( $body.hasClass('device-lg') || $body.hasClass('device-md') ) && !SU.isMobile.any() ) {
					var parallaxOffsetTop = SU.slider.sliderParallaxOffset(),
						parallaxElHeight = $sliderParallaxEl.outerHeight();

					if( ( parallaxElHeight + parallaxOffsetTop + 50 ) > $window.scrollTop() ){
						$sliderParallaxEl.find('.slider-inner').css({ 'display': 'block', 'visibility': 'visible' });
						if ($window.scrollTop() > parallaxOffsetTop) {
							var tranformAmount = (($window.scrollTop()-parallaxOffsetTop) / 1.5 ).toFixed(2);
							var tranformAmount2 = (($window.scrollTop()-parallaxOffsetTop) / 7 ).toFixed(2);
							$sliderParallaxEl.stop(true,true).transition({ y: tranformAmount },0);
							$('.slider-parallax .slider-caption,.ei-title').stop(true,true).transition({ y: -tranformAmount2 },0);
						} else {
							$('.slider-parallax,.slider-parallax .slider-caption,.ei-title').transition({ y: 0 },0);
						}
					} else {
						$sliderParallaxEl.find('.slider-inner').css({ 'display': 'none', 'visibility': 'hidden' });
					}
                    //  Fix anim issue when loading on tablets. see exec page - hidden - for example.
					if (requesting) {
						requestAnimationFrame(function(){
							SU.slider.sliderParallax();
							SU.slider.sliderElementsFade();
						});
					}
				} else {
					$('.slider-parallax,.slider-parallax .slider-caption,.ei-title').transition({ y: 0 },0);
				}
			}
		},
        
		sliderElementsFade: function(){
			if( $sliderParallaxEl.length > 0 ) {
				if( ( $body.hasClass('device-lg') || $body.hasClass('device-md') ) && !SU.isMobile.any() ) {
					var parallaxOffsetTop = SU.slider.sliderParallaxOffset();
					if( $slider.length > 0 ) {
						if( $header.hasClass('transparent-header') || $('body').hasClass('side-header') ) { var tHeaderOffset = 100; } else { var tHeaderOffset = 0; }
						$sliderParallaxEl.find('#slider-arrow-left,#slider-arrow-right,.vertical-middle:not(.no-fade),.slider-caption,.ei-title,.camera_prev,.camera_next').css({'opacity':( ( 100 + ( $slider.offset().top + parallaxOffsetTop + tHeaderOffset ) - $window.scrollTop() ) ) /90});
					}
				} else {
					$sliderParallaxEl.find('#slider-arrow-left,#slider-arrow-right,.vertical-middle:not(.no-fade),.slider-caption,.ei-title,.camera_prev,.camera_next').css({'opacity': 1});
				}
			}
		},

		captionPosition: function(){
			$slider.find('.slider-caption').each(function(){
				var scapHeight = $(this).outerHeight();
				var scapSliderHeight = $slider.outerHeight();
				if( $(this).parents('#slider').prev('#header').hasClass('transparent-header') && ( $body.hasClass('device-lg') || $body.hasClass('device-md') ) ) {
					if( $(this).parents('#slider').prev('#header').hasClass('floating-header') ) {
						$(this).css({ top: ( scapSliderHeight + 160 - scapHeight ) / 2 + 'px' });
					} else {
						$(this).css({ top: ( scapSliderHeight + 100 - scapHeight ) / 2 + 'px' });
					}
				} else {
					$(this).css({ top: ( scapSliderHeight - scapHeight ) / 2 + 'px' });
				}
			});
		},

		swiperSliderMenu: function(){
			if( $body.hasClass('device-lg') || $body.hasClass('device-md') ) {
				var activeSlide = $slider.find('.swiper-slide.swiper-slide-visible');
				SU.slider.headerSchemeChanger(activeSlide);
			}
		},
        // two variations. above old, below new. TEST.
        //swiperSliderMenu: function( onWinLoad ){
		//	onWinLoad = typeof onWinLoad !== 'undefined' ? onWinLoad : false;
		//	if( $body.hasClass('device-lg') || $body.hasClass('device-md') ) {
		//		var activeSlide = $slider.find('.swiper-slide.swiper-slide-active');
		//		SU.slider.headerSchemeChanger(activeSlide, onWinLoad);
		//	}
		//},

		headerSchemeChanger: function( activeSlide ){
			if( activeSlide.length > 0 ) {
				if( activeSlide.hasClass('dark') ){
					$('#header.transparent-header:not(.sticky-header,.semi-transparent,.floating-header)').addClass('dark');
					$('#header.transparent-header.sticky-header,#header.transparent-header.semi-transparent.sticky-header,#header.transparent-header.floating-header.sticky-header').removeClass('dark');
					$headerWrap.removeClass('not-dark');
				} else {
					if( $body.hasClass('dark') ) {
						activeSlide.addClass('not-dark');
						$('#header.transparent-header:not(.semi-transparent,.floating-header)').removeClass('dark');
						$('#header.transparent-header:not(.sticky-header,.semi-transparent,.floating-header)').find('#header-wrap').addClass('not-dark');
					} else {
						$('#header.transparent-header:not(.semi-transparent,.floating-header)').removeClass('dark');
						$headerWrap.removeClass('not-dark');
					}
				}
				SU.header.darkLogo();
			}
		},

		owlCaptionInit: function(){
			if( $owlCarouselEl.length > 0 ){
				$owlCarouselEl.each( function(){
					var element = $(this);
					if( element.find('.owl-dot').length > 0 ) {
						element.find('.owl-controls').addClass('with-carousel-dots');
					}
				});
			}
		}

	};

	SU.widget = {

		init: function(){

			SU.widget.animations();
			SU.widget.youtubeBgVideo();
			SU.widget.tabs();
			SU.widget.tabsJustify();
			SU.widget.toggles();
			SU.widget.accordions();
			SU.widget.counter();
			SU.widget.roundedSkill();
			SU.widget.progress();
			SU.widget.twitterFeed();
			SU.widget.flickrFeed();
			SU.widget.instagramPhotos( '36286274.b9e559e.4824cbc1d0c94c23827dc4a2267a9f6b', 'b9e559ec7c284375bf41e9a9fb72ae01' );
			SU.widget.dribbbleShots();
			SU.widget.navTree();
            SU.widget.navTreepage();
			SU.widget.textRotater();
			SU.widget.linkScroll();
			SU.widget.extras();

		},

		parallax: function(){
			if( !SU.isMobile.any() ){
				$.stellar({
					horizontalScrolling: false,
					verticalOffset: 250
                    //  was 150. testing on /elections/
				});
			} else {
				$parallaxEl.addClass('mobile-parallax');
				$parallaxPageTitleEl.addClass('mobile-parallax');
			}
		},

		animations: function(){
			var $dataAnimateEl = $('[data-animate]');
			if( $dataAnimateEl.length > 0 ){
				if( $body.hasClass('device-lg') || $body.hasClass('device-md') || $body.hasClass('device-sm') ){
					$dataAnimateEl.each(function(){
						var element = $(this),
							animationDelay = element.attr('data-delay'),
							animationDelayTime = 0;

						if( animationDelay ) { animationDelayTime = Number( animationDelay ) + 500; } else { animationDelayTime = 500; }

						if( !element.hasClass('animated') ) {
							element.addClass('not-animated');
							var elementAnimation = element.attr('data-animate');
							element.appear(function () {
								setTimeout(function() {
									element.removeClass('not-animated').addClass( elementAnimation + ' animated');
								}, animationDelayTime);
							},{accX: 0, accY: -120},'easeInCubic');
						}
					});
				}
			}
		},

		html5Video: function(){
			var videoEl = $('.video-wrap:has(video)');
			if( videoEl.length > 0 ) {
				videoEl.each(function(){
					var element = $(this),
						elementVideo = element.find('video'),
						outerContainerWidth = element.outerWidth(),
						outerContainerHeight = element.outerHeight(),
						innerVideoWidth = elementVideo.outerWidth(),
						innerVideoHeight = elementVideo.outerHeight();

					if( innerVideoHeight < outerContainerHeight ) {
						var videoAspectRatio = innerVideoWidth/innerVideoHeight,
							newVideoWidth = outerContainerHeight * videoAspectRatio,
							innerVideoPosition = (newVideoWidth - outerContainerWidth) / 2;
						elementVideo.css({ 'width': newVideoWidth+'px', 'height': outerContainerHeight+'px', 'left': -innerVideoPosition+'px' });
					} else {
						var innerVideoPosition = (innerVideoHeight - outerContainerHeight) / 2;
						elementVideo.css({ 'width': innerVideoWidth+'px', 'height': innerVideoHeight+'px', 'top': -innerVideoPosition+'px' });
					}

					if( SU.isMobile.any() ) {
						var placeholderImg = elementVideo.attr('poster');

						if( placeholderImg != '' ) {
							element.append('<div class="video-placeholder" style="background-image: url('+ placeholderImg +');"></div>')
						}
					}
				});
			}
		},

		youtubeBgVideo: function(){
			if( $youtubeBgPlayerEl.length > 0 ){
				$youtubeBgPlayerEl.each( function(){
					var element = $(this),
						ytbgVideo = element.attr('data-video'),
						ytbgMute = element.attr('data-mute'),
						ytbgRatio = element.attr('data-ratio'),
						ytbgQuality = element.attr('data-quality'),
						ytbgOpacity = element.attr('data-opacity'),
						ytbgContainer = element.attr('data-container'),
						ytbgOptimize = element.attr('data-optimize'),
						ytbgLoop = element.attr('data-loop'),
						ytbgVolume = element.attr('data-volume'),
						ytbgStart = element.attr('data-start'),
						ytbgStop = element.attr('data-stop'),
						ytbgAutoPlay = element.attr('data-autoplay'),
						ytbgFullScreen = element.attr('data-fullscreen');

					if( ytbgMute == 'false' ) { ytbgMute = false; } else { ytbgMute = true; }
					if( !ytbgRatio ) { ytbgRatio = '16/9'; }
					if( !ytbgQuality ) { ytbgQuality = 'hd720'; }
					if( !ytbgOpacity ) { ytbgOpacity = 1; }
					if( !ytbgContainer ) { ytbgContainer = 'self'; }
					if( ytbgOptimize == 'false' ) { ytbgOptimize = false; } else { ytbgOptimize = true; }
					if( ytbgLoop == 'false' ) { ytbgLoop = false; } else { ytbgLoop = true; }
					if( !ytbgVolume ) { ytbgVolume = 1; }
					if( !ytbgStart ) { ytbgStart = 0; }
					if( !ytbgStop ) { ytbgStop = 0; }
					if( ytbgAutoPlay == 'false' ) { ytbgAutoPlay = false; } else { ytbgAutoPlay = true; }
					if( ytbgFullScreen == 'true' ) { ytbgFullScreen = true; } else { ytbgFullScreen = false; }

					element.mb_YTPlayer({
						videoURL: ytbgVideo,
						mute: ytbgMute,
						ratio: ytbgRatio,
						quality: ytbgQuality,
						opacity: ytbgOpacity,
						containment: ytbgContainer,
						optimizeDisplay: ytbgOptimize,
						loop: ytbgLoop,
						vol: ytbgVolume,
						startAt: ytbgStart,
						stopAt: ytbgStop,
						autoplay: ytbgAutoPlay,
						realfullscreen: ytbgFullScreen,
						showYTLogo: false,
						showControls: false
					});
				});
			}
		},

		tabs: function(){
			var $tabs = $('.tabs:not(.customjs)');
			if( $tabs.length > 0 ) {
				$tabs.each( function(){
					var element = $(this),
						elementSpeed = element.attr('data-speed'),
						tabActive = element.attr('data-active');

					if( !elementSpeed ) { elementSpeed = 400; }
					if( !tabActive ) { tabActive = 0; } else { tabActive = tabActive - 1; }

					element.tabs({
						active: Number(tabActive),
						show: {
							effect: "fade",
							duration: Number(elementSpeed)
						}
					});
				});
			}
		},

		tabsJustify: function(){
			if( !$('body').hasClass('device-xxs') && !$('body').hasClass('device-xs') ){
				var $tabsJustify = $('.tabs.tabs-justify');
				if( $tabsJustify.length > 0 ) {
					$tabsJustify.each( function(){
						var element = $(this),
							elementTabs = element.find('.tab-nav > li'),
							elementTabsNo = elementTabs.length,
							elementContainer = 0,
							elementWidth = 0;

						if( element.hasClass('tabs-bordered') || element.hasClass('tabs-bb') ) {
							elementContainer = element.find('.tab-nav').outerWidth();
						} else {
							if( element.find('tab-nav').hasClass('tab-nav2') ) {
								elementContainer = element.find('.tab-nav').outerWidth() - (elementTabsNo * 10);
							} else {
								elementContainer = element.find('.tab-nav').outerWidth() - 30;
							}
						}

						elementWidth = Math.floor(elementContainer/elementTabsNo);
						elementTabs.css({ 'width': elementWidth + 'px' });

					});
				}
			} else { $('.tabs.tabs-justify').find('.tab-nav > li').css({ 'width': 'auto' }); }
		},

		toggles: function(){
			var $toggle = $('.toggle');
			if( $toggle.length > 0 ) {
				$toggle.each( function(){
					var element = $(this),
						elementState = element.attr('data-state');

					if( elementState != 'open' ){
						element.find('.togglec').hide();
					} else {
						element.find('.togglet').addClass("toggleta");
					}

					element.find('.togglet').click(function(){
						$(this).toggleClass('toggleta').next('.togglec').slideToggle(300);
						return true;
					});
				});
			}
		},

		accordions: function(){
			var $accordionEl = $('.accordion');
			if( $accordionEl.length > 0 ){
				$accordionEl.each( function(){
					var element = $(this),
						elementState = element.attr('data-state'),
						accordionActive = element.attr('data-active');

					if( !accordionActive ) { accordionActive = 0; } else { accordionActive = accordionActive - 1; }

					element.find('.acc_content').hide();

					if( elementState != 'closed' ) {
						element.find('.acctitle:eq('+ Number(accordionActive) +')').addClass('acctitlec').next().show();
					}

					element.find('.acctitle').click(function(){
						if( $(this).next().is(':hidden') ) {
							element.find('.acctitle').removeClass('acctitlec').next().slideUp("normal");
							$(this).toggleClass('acctitlec').next().slideDown("normal");
						}
						return false;
					});
				});
			}
		},

		counter: function(){
			var $counterEl = $('.counter:not(.counter-instant)');
			if( $counterEl.length > 0 ){
				$counterEl.each(function(){
					var element = $(this);
					var counterElementComma = $(this).find('span').attr('data-comma');
					if( !counterElementComma ) { counterElementComma = false; } else { counterElementComma = true; }
					if( $body.hasClass('device-lg') || $body.hasClass('device-md') ){
						element.appear( function(){
							SU.widget.runCounter( element, counterElementComma );
						},{accX: 0, accY: -120},'easeInCubic');
					} else {
						SU.widget.runCounter( element, counterElementComma );
					}
				});
			}
		},

		runCounter: function( counterElement,counterElementComma ){
			if( counterElementComma == true ) {
				counterElement.find('span').countTo({
					formatter: function (value, options) {
						value = value.toFixed(options.decimals);
						value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
						return value;
					}
				});
			} else {
				counterElement.find('span').countTo();
			}
		},

		roundedSkill: function(){
			var $roundedSkillEl = $('.rounded-skill');
			if( $roundedSkillEl.length > 0 ){
				$roundedSkillEl.each(function(){
					var element = $(this);

					var roundSkillSize = element.attr('data-size');
					var roundSkillAnimate = element.attr('data-animate');
					var roundSkillWidth = element.attr('data-width');
					var roundSkillColor = element.attr('data-color');
					var roundSkillTrackColor = element.attr('data-trackcolor');

					if( !roundSkillSize ) { roundSkillSize = 140; }
					if( !roundSkillAnimate ) { roundSkillAnimate = 2000; }
					if( !roundSkillWidth ) { roundSkillWidth = 8; }
					if( !roundSkillColor ) { roundSkillColor = '#0093BF'; }
					if( !roundSkillTrackColor ) { roundSkillTrackColor = 'rgba(0,0,0,0.04)'; }

					var properties = {roundSkillSize:roundSkillSize, roundSkillAnimate:roundSkillAnimate, roundSkillWidth:roundSkillWidth, roundSkillColor:roundSkillColor, roundSkillTrackColor:roundSkillTrackColor};

					if( $body.hasClass('device-lg') || $body.hasClass('device-md') ){
						element.css({'width':roundSkillSize+'px','height':roundSkillSize+'px'}).animate({opacity: '0'}, 10);
						element.appear( function(){
							if (!element.hasClass('skills-animated')) {
								element.css({opacity: '1'});
								SU.widget.runRoundedSkills( element, properties );
								element.addClass('skills-animated');
							}
						},{accX: 0, accY: -120},'easeInCubic');
					} else {
						SU.widget.runRoundedSkills( element, properties );
					}
				});
			}
		},

		runRoundedSkills: function( element, properties ){
			element.easyPieChart({
				size: Number(properties.roundSkillSize),
				animate: Number(properties.roundSkillAnimate),
				scaleColor: false,
				trackColor: properties.roundSkillTrackColor,
				lineWidth: Number(properties.roundSkillWidth),
				lineCap: 'square',
				barColor: properties.roundSkillColor
			});
		},

		progress: function(){
			var $progressEl = $('.progress');
			if( $progressEl.length > 0 ){
				$progressEl.each(function(){
					var element = $(this),
						skillsBar = element.parent('li'),
						skillValue = skillsBar.attr('data-percent');

					if( $body.hasClass('device-lg') || $body.hasClass('device-md') ){
						element.appear( function(){
							if (!skillsBar.hasClass('skills-animated')) {
								element.find('.counter-instant span').countTo();
								skillsBar.find('.progress').css({width: skillValue + "%"}).addClass('skills-animated');
							}
						},{accX: 0, accY: -120},'easeInCubic');
					} else {
						element.find('.counter-instant span').countTo();
						skillsBar.find('.progress').css({width: skillValue + "%"});
					}
				});
			}
		},
        
		navTree: function(){
			var $navTreeEl = $('.nav-tree');
            //var $navTreeEl = $('.nav-tree-page');
			if( $navTreeEl.length > 0 ){
				$navTreeEl.each( function(){
					var element = $(this),
						elementSpeed = element.attr('data-speed'),
						elementEasing = element.attr('data-easing');

					if( !elementSpeed ) { elementSpeed = 250; }
					if( !elementEasing ) { elementEasing = 'swing'; }
                    
                    element.find( 'ul li ul:has(li)' ).addClass('sub-li');
					element.find( 'ul li:has(ul)' ).addClass('sub-menu');
					element.find( 'ul li:has(li) > a' ).append( '<i class="icon-angle-right"></i>' );
                    //element.find( 'ul li ul li:has(ul) > a' ).append( '<i class="icon-angle-right"></i>' );

					element.find( 'ul li:has(ul) > a' ).click( function(e){
						var childElement = $(this);
						element.find( 'ul li' ).not(childElement.parents()).removeClass('active');
						childElement.parent().children('ul').slideToggle( Number(elementSpeed), elementEasing, function(){
							$(this).find('ul').hide();
							$(this).find('li.active').removeClass('active');
						});
						element.find( 'ul li > ul' ).not(childElement.parent().children('ul')).not(childElement.parents('ul')).slideUp( Number(elementSpeed), elementEasing );
						childElement.parent('li:has(ul)').toggleClass('active');
						e.preventDefault();
					});
				});
			}
		},
        navTreepage: function(){
            var $navTreeEl = $('.nav-tree-page');
			if( $navTreeEl.length > 0 ){
				$navTreeEl.each( function(){
					var element = $(this),
						elementSpeed = element.attr('data-speed'),
						elementEasing = element.attr('data-easing');

					if( !elementSpeed ) { elementSpeed = 250; }
					if( !elementEasing ) { elementEasing = 'swing'; }
                    
                    element.find( 'ul li ul:has(li)' ).addClass('sub-li');
					element.find( 'ul li:has(ul)' ).addClass('sub-menu');
					element.find( 'ul li:has(li) > a' ).append( '<i class="icon-angle-right"></i>' );
                    //element.find( 'ul li ul li:has(ul) > a' ).append( '<i class="icon-angle-right"></i>' );

					element.find( 'ul li:has(ul) > a' ).click( function(e){
						var childElement = $(this);
						element.find( 'ul li' ).not(childElement.parents()).removeClass('active');
						childElement.parent().children('ul').slideToggle( Number(elementSpeed), elementEasing, function(){
							$(this).find('ul').hide();
							$(this).find('li.active').removeClass('active');
						});
						element.find( 'ul li > ul' ).not(childElement.parent().children('ul')).not(childElement.parents('ul')).slideUp( Number(elementSpeed), elementEasing );
						childElement.parent('li:has(ul)').toggleClass('active');
						e.preventDefault();
					});
				});
			}
		},
        
		carousel: function(){

			if( !$().owlCarousel ) {
				console.log('carousel: Owl Carousel not Defined.');
				return true;
			}

			var $carousel = $('.carousel-widget:not(.customjs)');
			if( $carousel.length < 1 ){ return true; }

			$carousel.each( function(){
				var element = $(this),
					elementItems = element.attr('data-items'),
					elementItemsLg = element.attr('data-items-lg'),
					elementItemsMd = element.attr('data-items-md'),
					elementItemsSm = element.attr('data-items-sm'),
					elementItemsXs = element.attr('data-items-xs'),
					elementItemsXxs = element.attr('data-items-xxs'),
					elementLoop = element.attr('data-loop'),
					elementAutoPlay = element.attr('data-autoplay'),
					elementSpeed = element.attr('data-speed'),
					elementAnimateIn = element.attr('data-animate-in'),
					elementAnimateOut = element.attr('data-animate-out'),
					elementNav = element.attr('data-nav'),
					elementPagi = element.attr('data-pagi'),
					elementMargin = element.attr('data-margin'),
					elementStage = element.attr('data-stage-padding'),
					elementMerge = element.attr('data-merge'),
					elementStart = element.attr('data-start'),
					elementRewind = element.attr('data-rewind'),
					elementSlideBy = element.attr('data-slideby'),
					elementCenter = element.attr('data-center'),
					elementLazy = element.attr('data-lazyload'),
					elementVideo = element.attr('data-video'),
					elementRTL = element.attr('data-rtl');

				if( !elementItems ) { elementItems = 4; }
				if( !elementItemsLg ) { elementItemsLg = Number(elementItems); }
				if( !elementItemsMd ) { elementItemsMd = Number(elementItemsLg); }
				if( !elementItemsSm ) { elementItemsSm = Number(elementItemsMd); }
				if( !elementItemsXs ) { elementItemsXs = Number(elementItemsSm); }
				if( !elementItemsXxs ) { elementItemsXxs = Number(elementItemsXs); }
				if( !elementSpeed ) { elementSpeed = 250; }
				if( !elementMargin ) { elementMargin = 20; }
				if( !elementStage ) { elementStage = 0; }
				if( !elementStart ) { elementStart = 0; }

				if( !elementSlideBy ) { elementSlideBy = 1; }
				if( elementSlideBy == 'page' ) {
					elementSlideBy = 'page';
				} else {
					elementSlideBy = Number(elementSlideBy);
				}

				if( elementLoop == 'true' ){ elementLoop = true; } else { elementLoop = false; }
				if( !elementAutoPlay ){
					elementAutoPlay = false;
					var elementAutoPlayTime = 0;
				} else {
					var elementAutoPlayTime = Number(elementAutoPlay);
					elementAutoPlay = true;
				}
				if( !elementAnimateIn ) { elementAnimateIn = false; }
				if( !elementAnimateOut ) { elementAnimateOut = false; }
				if( elementNav == 'false' ){ elementNav = false; } else { elementNav = true; }
				if( elementPagi == 'false' ){ elementPagi = false; } else { elementPagi = true; }
				if( elementRewind == 'true' ){ elementRewind = true; } else { elementRewind = false; }
				if( elementMerge == 'true' ){ elementMerge = true; } else { elementMerge = false; }
				if( elementCenter == 'true' ){ elementCenter = true; } else { elementCenter = false; }
				if( elementLazy == 'true' ){ elementLazy = true; } else { elementLazy = false; }
				if( elementVideo == 'true' ){ elementVideo = true; } else { elementVideo = false; }
				if( elementRTL == 'true' || $body.hasClass('rtl') ){ elementRTL = true; } else { elementRTL = false; }

				element.owlCarousel({
					margin: Number(elementMargin),
					loop: elementLoop,
					stagePadding: Number(elementStage),
					merge: elementMerge,
					startPosition: Number(elementStart),
					rewind: elementRewind,
					slideBy: elementSlideBy,
					center: elementCenter,
					lazyLoad: elementLazy,
					nav: elementNav,
					navText: ['<i class="icon-angle-left"></i>','<i class="icon-angle-right"></i>'],
					autoplay: elementAutoPlay,
					autoplayTimeout: elementAutoPlayTime,
					autoplayHoverPause: true,
					dots: elementPagi,
					smartSpeed: Number(elementSpeed),
					fluidSpeed: Number(elementSpeed),
					video: elementVideo,
					animateIn: elementAnimateIn,
					animateOut: elementAnimateOut,
					rtl: elementRTL,
					responsive:{
						0:{ items:Number(elementItemsXxs) },
						480:{ items:Number(elementItemsXs) },
						768:{ items:Number(elementItemsSm) },
						992:{ items:Number(elementItemsMd) },
						1200:{ items:Number(elementItemsLg) }
					},
					onInitialized: function(){
						SU.slider.owlCaptionInit();
					}
				});
			});
		},

		masonryThumbs: function(){
			var $masonryThumbsEl = $('.masonry-thumbs');
			if( $masonryThumbsEl.length > 0 ){
				$masonryThumbsEl.each( function(){
					var masonryItemContainer = $(this);
					SU.widget.masonryThumbsArrange( masonryItemContainer );
				});
			}
		},

		masonryThumbsArrange: function( element ){
			SU.initialize.setFullColumnWidth( element );
			element.isotope('layout');
		},

		notifications: function( element ){
			toastr.clear();
			var notifyElement = $(element),
				notifyPosition = notifyElement.attr('data-notify-position'),
				notifyType = notifyElement.attr('data-notify-type'),
				notifyMsg = notifyElement.attr('data-notify-msg'),
				notifyCloseButton = notifyElement.attr('data-notify-close');

			if( !notifyPosition ) { notifyPosition = 'toast-top-right'; } else { notifyPosition = 'toast-' + notifyElement.attr('data-notify-position'); }
			if( !notifyMsg ) { notifyMsg = 'Please set a message!'; }
			if( notifyCloseButton == 'true' ) { notifyCloseButton = true; } else { notifyCloseButton = false; }

			toastr.options.positionClass = notifyPosition;
			toastr.options.closeButton = notifyCloseButton;
			toastr.options.closeHtml = '<button><i class="icon-remove"></i></button>';

			if( notifyType == 'warning' ) {
				toastr.warning(notifyMsg);
			} else if( notifyType == 'error' ) {
				toastr.error(notifyMsg);
			} else if( notifyType == 'success' ) {
				toastr.success(notifyMsg);
			} else {
				toastr.info(notifyMsg);
			}

			return false;
		},

		textRotater: function(){
			if( $textRotaterEl.length > 0 ){
				$textRotaterEl.each(function(){
					var element = $(this),
						trRotate = $(this).attr('data-rotate'),
						trSpeed = $(this).attr('data-speed'),
						trSeparator = $(this).attr('data-separator');

					if( !trRotate ) { trRotate = "fade"; }
					if( !trSpeed ) { trSpeed = 1200; }
					if( !trSeparator ) { trSeparator = ","; }

					var tRotater = $(this).find('.t-rotate');

					tRotater.Morphext({
						animation: trRotate,
						separator: trSeparator,
						speed: Number(trSpeed)
					});
				});
			}
		}, 

		linkScroll: function(){
			$("a[data-scrollto]").click(function(){
				var element = $(this),
					divScrollToAnchor = element.attr('data-scrollto'),
					divScrollSpeed = element.attr('data-speed'),
					divScrollOffset = element.attr('data-offset'),
					divScrollEasing = element.attr('data-easing');

					if( !divScrollSpeed ) { divScrollSpeed = 750; }
					if( !divScrollOffset ) { divScrollOffset = SU.initialize.topScrollOffset(); }
					if( !divScrollEasing ) { divScrollEasing = 'easeOutQuad'; }

				$('html,body').stop(true).animate({
					'scrollTop': $( divScrollToAnchor ).offset().top - Number(divScrollOffset)
				}, Number(divScrollSpeed), divScrollEasing);

				return false;
			});
		},

		extras: function(){
			$('[data-toggle="tooltip"]').tooltip({container: 'body'});
			$('#primary-menu-trigger,#overlay-menu-close').click(function() {
				$( '#primary-menu > ul, #primary-menu > div > ul' ).toggleClass("show");
				return false;
			});
			$('#page-submenu-trigger').click(function() {
				$body.toggleClass('top-search-open', false);
				$pagemenu.toggleClass("pagemenu-active");
				return false;
			});
			$pagemenu.find('nav').click(function(e){
				$body.toggleClass('top-search-open', false);
				$topCart.toggleClass('top-cart-open', false);
			});

			if( SU.isMobile.any() ){
				$body.addClass('device-touch');
			}
		}

	};

	SU.isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
		BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
		iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
		Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
		Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
		any: function() {
			return (SU.isMobile.Android() || SU.isMobile.BlackBerry() || SU.isMobile.iOS() || SU.isMobile.Opera() || SU.isMobile.Windows());
		}
	};

	SU.documentOnResize = {

		init: function(){

			var t = setTimeout( function(){
				SU.header.fullWidthMenu();
				SU.header.overlayMenu();
				SU.initialize.fullScreen();
				SU.initialize.verticalMiddle();
				SU.initialize.maxHeight();
				SU.initialize.testimonialsGrid();
				SU.slider.captionPosition();
				SU.portfolio.arrange();
				SU.widget.tabsJustify();
				SU.widget.html5Video();
				SU.widget.masonryThumbs();
				SU.initialize.dataStyles();
				SU.initialize.dataResponsiveHeights();
			}, 500 );

		}

	};

	SU.documentOnReady = {

		init: function(){
			SU.initialize.init();
			SU.header.init();
			if( $slider.length > 0 ) { SU.slider.init(); }
			SU.widget.init();
			SU.documentOnReady.windowscroll();
		},

        windowscroll: function () {

            var headerOffset = 0;
            var headerWrapOffset = 0;

            if ($header.length > 0) { headerOffset = $header.offset().top; }
            if ($header.length > 0) { headerWrapOffset = $headerWrap.offset().top; }

            var headerDefinedOffset = $header.attr('data-sticky-offset');
            if (typeof headerDefinedOffset !== 'undefined') {
                if (headerDefinedOffset == 'full') {
                    headerWrapOffset = $window.height();
                    var headerOffsetNegative = $header.attr('data-sticky-offset-negative');
                    if (typeof headerOffsetNegative !== 'undefined') { headerWrapOffset = headerWrapOffset - headerOffsetNegative - 1; }
                } else {
                    headerWrapOffset = Number(headerDefinedOffset);
                }
            }

            $window.on('scroll', function () {

                SU.initialize.goToTopScroll();
                //$('body.open-header.close-header-on-scroll').removeClass("side-header-open");
                SU.header.stickyMenu(headerWrapOffset);
                SU.header.darkLogo();

            });

            //window.addEventListener('scroll', onScrollSliderParallax, false);

            if ($onePageMenuEl.length > 0) {
                $window.scrolled(function () {
                    SU.header.onepageScroller();
                });
            }
        }

	};

	SU.documentOnLoad = {

		init: function(){
			SU.slider.captionPosition();
			SU.slider.swiperSliderMenu();
			SU.initialize.maxHeight();
			SU.initialize.verticalMiddle();
			SU.initialize.stickFooterOnSmall();
			SU.portfolio.arrange();
			SU.widget.parallax();
			SU.widget.html5Video();
			SU.widget.masonryThumbs();
			SU.slider.owlCaptionInit();
			SU.header.responsiveMenuClass();
            SU.initialize.modal();
		}

	};

	var $window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$headerWrap = $('#header-wrap'),
		$footer = $('#footer'),
		oldHeaderClasses = $header.attr('class'),
		oldHeaderWrapClasses = $headerWrap.attr('class'),
		stickyMenuClasses = $header.attr('data-sticky-class'),
		responsiveMenuClasses = $header.attr('data-responsive-class'),
		defaultLogo = $('#logo').find('.standard-logo'),
		defaultLogoWidth = defaultLogo.find('img').outerWidth(),
		retinaLogo = $('#logo').find('.retina-logo'),
		defaultLogoImg = defaultLogo.find('img').attr('src'),
		retinaLogoImg = retinaLogo.find('img').attr('src'),
		defaultDarkLogo = defaultLogo.attr('data-dark-logo'),
		retinaDarkLogo = retinaLogo.attr('data-dark-logo'),
		$pagemenu = $('#page-menu'),
		$onePageMenuEl = $('.one-page-menu'),
		onePageGlobalOffset = 0,
		$portfolio = $('#portfolio'),
		$slider = $('#slider'),
		$sliderParallaxEl = $('.slider-parallax'),
		$pageTitle = $('#page-title'),
		$portfolioItems = $('.portfolio-ajax').find('.portfolio-item'),
		$portfolioDetails = $('#portfolio-ajax-wrap'),
		$portfolioDetailsContainer = $('#portfolio-ajax-container'),
		$portfolioAjaxLoader = $('#portfolio-ajax-loader'),
		prevPostPortId = '',
		$topSearch = $('#top-search'),
		$topCart = $('#top-cart'),
		$verticalMiddleEl = $('.vertical-middle'),
		$siStickyEl = $('.si-sticky'),
		$dotsMenuEl = $('.dots-menu'),
		$goToTopEl = $('#gotoTop'),
		$fullScreenEl = $('.full-screen'),
		$commonHeightEl = $('.common-height'),
		$testimonialsGridEl = $('.testimonials-grid'),
		$pageSectionEl = $('.page-section'),
		$owlCarouselEl = $('.owl-carousel'),
		$parallaxEl = $('.parallax'),
		$parallaxPageTitleEl = $('.page-title-parallax'),
		$youtubeBgPlayerEl = $('.yt-bg-player'),
		$textRotaterEl = $('.text-rotater');

	$(document).ready( SU.documentOnReady.init );
	$window.load( SU.documentOnLoad.init );
	$window.on( 'resize', SU.documentOnResize.init );

})(jQuery));