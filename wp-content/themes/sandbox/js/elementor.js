( function( $ ) {
    'use strict';

    /* rtl check */
    function rtl_owl(){
        if ($('body').hasClass("rtl")) {
            return true;
        } else {
            return false;
        }
    };

    /* rtl for Isotop */
    function rtl_isotop(){
        if ($('body').hasClass("rtl")) {
            return false;
        } else {
            return true;
        }
    };

    /* change link of button login/register */
    var userForm = function ($scope, $) {
        $scope.find('.ot-userform').each( function () {
            var link_user = $(this).data('link');
            $(this).find('.user-btn').attr('href',link_user);
            $(this).find('.user-btn').on('click', function(){
                window.location.href = link_user;
            });
        });
    }

    /* OT Custom Nav Arrow Slider */
    var otNavText = [
        '<i class="uil-arrow-left"></i>',
        '<i class="uil-arrow-right"></i>'
    ];

    /* GLightbox */
    function lightbox() {
        const lightbox = GLightbox({
            selector: '*[data-glightbox]',
            touchNavigation: true,
            loop: false,
            zoomable: false,
            autoplayVideos: true,
            moreLength: 0,
            slideExtraAttributes: {
                poster: ''
            },
            plyr: {
                css: '',
                js: '',
                config: {
                    ratio: '',
                    fullscreen: {
                        enabled: false,
                        iosNative: false
                    },
                    youtube: {
                        noCookie: true,
                        rel: 0,
                        showinfo: 0,
                        iv_load_policy: 3
                    },
                    vimeo: {
                        byline: false,
                        portrait: false,
                        title: false,
                        transparent: false
                    }
                }
            },
        });
    }

    /* --------------------------------------------------
    * Accordions
    * --------------------------------------------------*/
    var customAccordions = function ($scope, $) {
        $scope.find('.ot-accordions-wrapper').each( function () {
            var selector = $(this),
                content = selector.find('.ot-acc-item__content'),
                header  = selector.find('.ot-acc-item__title');

            header.off("click");

            header.each(function(){
                if ($(this).data('default') == 'yes') {
                    $(this).next().addClass('active').slideDown(300);
                    $(this).parent().addClass('current');
                }
            });

            header.on('click', function(e){
                e.preventDefault();
                var $this = $(this);

                $this.next().toggleClass('active').slideToggle(300);
                $this.parent().toggleClass('current');
                content.not($this.next()).slideUp(300);
                header.not($this).parent().removeClass('current');
            });
        });
    };

    /* --------------------------------------------------
    * Tabs
    * --------------------------------------------------*/
    var customTabs = function ($scope, $) {

        $scope.find('.ot-tabs').each(function() {
            var selector = $(this),
                tabs     = selector.find('.ot-tabs__heading .ot-tabs__item'),
                content  = selector.find('.ot-tabs__content');
            
            tabs.first().addClass('current');
            content.first().addClass('current').show();
            
            tabs.on( 'click', function(e){
                e.preventDefault();
                if( $(this).hasClass('current') ) return false;
                var tab_id = $(this).attr('data-tab');
                $(this).siblings().removeClass('current');
                $(this).parents('.ot-tabs').find('.ot-tabs__content').removeClass('current').hide();
                $(this).addClass('current');
                $("#"+tab_id).addClass('current').fadeIn(500);
            });
        });
    };

    /* --------------------------------------------------
    * Big Tabs
    * --------------------------------------------------*/
    var otBigTabs = function ($scope, $) {
        $scope.find('.ot-tabs.tabs-justified').each( function () {
            var selector    = $(this),
                tabItem     = selector.find('.ot-tabs__heading .ot-tabs__item');

            tabItem.each(function() {
                var tab_id_each = $(this).attr('data-tab');
                $("#"+tab_id_each).hide();
            });
            tabItem.first().addClass('current');
            $("#"+tabItem.first().attr('data-tab')).show();

            tabItem.on( 'click', function(e){
                e.preventDefault();
                if( $(this).hasClass('current') ) return false;

                var tab_id_current = $(this).attr('data-tab');
                $(this).siblings().removeClass('current');
                tabItem.each(function() {
                    var tab_id_each = $(this).attr('data-tab');
                    $("#"+tab_id_each).hide();
                });
                $(this).addClass('current');
                $("#"+tab_id_current).fadeIn(500);
            });
        });
    }

    /**
    * Pricing Switcher
    * Enables monthly/yearly switcher seen on pricing tables
    */
    var pricingSwitcher = function ($scope, $) {
        $scope.find('.ot-switchs-wrap').each( function () {
            var selector    = $(this),
                switchers   = selector.find('.ot-switchs'),
                switcher_id = selector.attr('data-id');

            switchers.on( 'click', function(e){
                e.preventDefault();
                var switcher  = $(this).find('.ot-switch'),
                    prices_table_all = $("#"+switcher_id).find('.ot-pricing-table');
                switcher.each( function() {
                    $(this).toggleClass("ot-switch-active");
                });
                if( prices_table_all.length > 0 ){
                    prices_table_all.each( function() {
                        var price_item  = $(this),
                            price_inner = price_item.find('.price-inner');
                        price_inner.each( function() {
                            $(this).remove("price-hidden");
                            $(this).toggleClass("price-show");
                            $(this).toggleClass("price-hide");
                        });
                    });
                }else{
                    return false;
                }
            });
        });
    }

    /* --------------------------------------------------
    * Text Animation
    * --------------------------------------------------*/
    function textAnimation() {
        var typers = {};
        for (let e of $(".typer")) {
            typers[e.id] = new Typer(e);
        }
        for (let e of $(".typer-stop")) {
            let owner = typers[e.dataset.owner];
            e.onclick = () => owner.stop();
        }
        for (let e of $(".typer-start")) {
            let owner = typers[e.dataset.owner];
            e.onclick = () => owner.start();
        }
        for (let e of $(".cursor")) {
            let t = new Cursor(e);
            t.owner = typers[e.dataset.owner];
        }
    };

    function textRotator() {
        if(document.querySelector(".rotator-zoom") != null) {
            var replace = new ReplaceMe(document.querySelector('.rotator-zoom'), {
                animation: 'animate__animated animate__zoomIn',
                speed: 2500,
                separator: ',',
                clickChange: false,
                loopCount: 'infinite'
            });
            document.querySelector(".rotator-zoom").style.opacity = "1";
        }
        if(document.querySelector(".rotator-fade") != null) {
            var replace = new ReplaceMe(document.querySelector('.rotator-fade'), {
                animation: 'animate__animated animate__fadeInDown',
                speed: 2500,
                separator: ',',
                clickChange: false,
                loopCount: 'infinite'
            });
            document.querySelector(".rotator-fade").style.opacity = "1";
        }
    };

    /**
    * Progressbar
    * Enables animated progressbars
    * Requires assets/js/vendor/progressbar.min.js
    * Requires assets/js/vendor/noframework.waypoints.min.js
    */
    function otProgressBar() {
        const pline = document.querySelectorAll(".progressbar.line");
        const pcircle = document.querySelectorAll(".progressbar.semi-circle");

        pline.forEach(e => {
            var line = new ProgressBar.Line(e, {
                strokeWidth: 6,
                trailWidth: 6,
                duration: 3000,
                easing: 'easeInOut',
                text: {
                    style: {
                        color: 'inherit',
                        position: 'absolute',
                        right: '0',
                        top: '0',
                        padding: 0,
                        margin: 0,
                        transform: null
                    },
                    autoStyleContainer: false
                },
                step: (state, line) => {
                    line.setText(Math.round(line.value() * 100) + ' %');
                }
            });
            
            var value = e.getAttribute('data-value') / 100;
            new Waypoint({
                element: e,
                handler: function() {
                    line.animate(value);
                },
                offset: 'bottom-in-view',
            })
            
        });
        pcircle.forEach(e => {
            var circle = new ProgressBar.SemiCircle(e, {
                strokeWidth: 6,
                trailWidth: 6,
                duration: 2000,
                easing: 'easeInOut',
                step: (state, circle) => {
                    circle.setText(Math.round(circle.value() * 100));
                }
            });
            var value = e.getAttribute('data-value') / 100;
            new Waypoint({
                element: e,
                handler: function() {
                    circle.animate(value);
                },
                offset: 'bottom-in-view',
            })
        });
    }

    /**
    * Counter Up
    * Counts up to a targeted number when the number becomes visible
    * Requires assets/js/vendor/counterup.min.js
    * Requires assets/js/vendor/noframework.waypoints.min.js
    */
    function otCounter() {
        var counterUp = window.counterUp["default"];
        const counters = document.querySelectorAll(".counter");
        counters.forEach(el => {
            var duration = el.getAttribute('data-duration');
            new Waypoint({
                element: el,
                handler: function() {
                    counterUp(el, {
                        duration: duration,
                        delay: 50
                    })
                    this.destroy()
                },
                offset: 'bottom-in-view',
            })
        });
    }

    /* --------------------------------------------------
    * Countdown for coming soon
    * --------------------------------------------------*/
    var otCountDown = function($scope, $){
        $scope.find('.ot-countdown').each( function(){
            var selector = $(this),
                date     = selector.data('date'),
                zone     = selector.data('zone'),
                day      = selector.data('day'),
                days     = selector.data('days'),
                hour     = selector.data('hour'),
                hours    = selector.data('hours'),
                min      = selector.data('min'),
                mins     = selector.data('mins'),
                second   = selector.data('second'),
                seconds  = selector.data('seconds');
            selector.countdown({
                date: date,
                offset: zone,
                day: day,
                days: days,
                hour: hour,
                hours: hours,
                minute: min,
                minutes: mins,
                second: second,
                seconds: seconds
            }, function () {
                alert('Done!');
            });
        });
    };

    /* --------------------------------------------------
     * Team Slider
     * --------------------------------------------------*/
    var teamSlider = function ($scope, $) {
        $scope.find('.ot-team-carousel').each( function () {
            var selector     = $(this),
                sliderSettings = selector.data('slider_options');
                
            selector.find('.owl-carousel').owlCarousel({
                rtl: rtl_owl(),
                autoplay: 'yes' === sliderSettings.autoplay,
                autoplayTimeout: parseInt(sliderSettings.autoplay_time_out),
                loop: 'yes' === sliderSettings.loop,
                responsiveClass:true,
                dots: sliderSettings.dots,
                nav: sliderSettings.arrows,
                autoplayHoverPause: true,
                navText: otNavText,
                navContainerClass: 'owl-nav nav-outside',
                smartSpeed: 500,
                dotsSpeed: 350,
                responsive : {
                    0 : {
                        items: parseInt(sliderSettings.slides_show_mobile),
                        margin: parseInt(sliderSettings.margin_mobile),
                    },
                    576 : {
                        items: parseInt(sliderSettings.slides_show_mobile_extra),
                        margin: parseInt(sliderSettings.margin_mobile_extra),
                    },
                    768 : {
                        items: parseInt(sliderSettings.slides_show_tablet),
                        margin: parseInt(sliderSettings.margin_tablet),
                    },
                    992 : {
                        items: parseInt(sliderSettings.slides_show_tablet_extra),
                        margin: parseInt(sliderSettings.margin_tablet_extra),
                    },
                    1200 : {
                        items: parseInt(sliderSettings.slides_show_laptop),
                        margin: parseInt(sliderSettings.margin_laptop),
                    },
                    1400 : {
                        items: parseInt(sliderSettings.slides_show_desktop),
                        margin: parseInt(sliderSettings.margin_desktop),
                    }
                }
            });
        });
    };

    /* --------------------------------------------------
     * Testimonial Slider
     * --------------------------------------------------*/
    var testimonialSlider = function ($scope, $) {
        $scope.find('.ot-testimonial-carousel').each( function () {
            var selector     = $(this),
                sliderSettings = selector.data('slider_options');
                
            selector.find('.owl-carousel').owlCarousel({
                rtl: rtl_owl(),
                autoplay: 'yes' === sliderSettings.autoplay,
                autoplayTimeout: parseInt(sliderSettings.autoplay_time_out),
                loop: 'yes' === sliderSettings.loop,
                responsiveClass:true,
                dots: sliderSettings.dots,
                nav: sliderSettings.arrows,
                autoplayHoverPause: true,
                navText: otNavText,
                navContainerClass: 'owl-nav nav-outside',
                smartSpeed: 500,
                dotsSpeed: 350,
                responsive : {
                    0 : {
                        items: parseInt(sliderSettings.slides_show_mobile),
                        margin: parseInt(sliderSettings.margin_mobile),
                    },
                    576 : {
                        items: parseInt(sliderSettings.slides_show_mobile_extra),
                        margin: parseInt(sliderSettings.margin_mobile_extra),
                    },
                    768 : {
                        items: parseInt(sliderSettings.slides_show_tablet),
                        margin: parseInt(sliderSettings.margin_tablet),
                    },
                    992 : {
                        items: parseInt(sliderSettings.slides_show_tablet_extra),
                        margin: parseInt(sliderSettings.margin_tablet_extra),
                    },
                    1200 : {
                        items: parseInt(sliderSettings.slides_show_laptop),
                        margin: parseInt(sliderSettings.margin_laptop),
                    },
                    1400 : {
                        items: parseInt(sliderSettings.slides_show_desktop),
                        margin: parseInt(sliderSettings.margin_desktop),
                    }
                }
            });
        });
    };

    /* --------------------------------------------------
     * Clients Slider
     * --------------------------------------------------*/
    var clientsSlider = function ($scope, $) {
        $scope.find('.ot-clients-carousel').each( function () {
            var selector     = $(this),
                sliderSettings = selector.data('slider_options');
                
            selector.find('.owl-carousel').owlCarousel({
                rtl: rtl_owl(),
                autoplay: 'yes' === sliderSettings.autoplay,
                autoplayTimeout: parseInt(sliderSettings.autoplay_time_out),
                loop: 'yes' === sliderSettings.loop,
                responsiveClass:true,
                dots: sliderSettings.dots,
                nav: sliderSettings.arrows,
                autoplayHoverPause: true,
                navText: otNavText,
                navContainerClass: 'owl-nav nav-outside',
                smartSpeed: 500,
                dotsSpeed: 350,
                responsive : {
                    0 : {
                        items: parseInt(sliderSettings.slides_show_mobile),
                        margin: parseInt(sliderSettings.margin_mobile),
                    },
                    576 : {
                        items: parseInt(sliderSettings.slides_show_mobile_extra),
                        margin: parseInt(sliderSettings.margin_mobile_extra),
                    },
                    768 : {
                        items: parseInt(sliderSettings.slides_show_tablet),
                        margin: parseInt(sliderSettings.margin_tablet),
                    },
                    992 : {
                        items: parseInt(sliderSettings.slides_show_tablet_extra),
                        margin: parseInt(sliderSettings.margin_tablet_extra),
                    },
                    1200 : {
                        items: parseInt(sliderSettings.slides_show_laptop),
                        margin: parseInt(sliderSettings.margin_laptop),
                    },
                    1400 : {
                        items: parseInt(sliderSettings.slides_show_desktop),
                        margin: parseInt(sliderSettings.margin_desktop),
                    }
                }
            });
        });
    };

    /* --------------------------------------------------
     * Images Slider
     * --------------------------------------------------*/
    var imagesSlider = function ($scope, $) {
        $scope.find('.ot-images-carousel').each( function () {
            var selector     = $(this),
                sliderSettings = selector.data('slider_options'),
                navClass = 'yes' === sliderSettings.arrows_bottom ? 'owl-nav nav-bottom' : 'owl-nav nav-outside';
            selector.find('.owl-carousel').owlCarousel({
                rtl: rtl_owl(),
                autoplay: 'yes' === sliderSettings.autoplay,
                autoplayTimeout: parseInt(sliderSettings.autoplay_time_out),
                loop: 'yes' === sliderSettings.loop,
                center: 'yes' === sliderSettings.center,
                responsiveClass:true,
                dots: sliderSettings.dots,
                nav: sliderSettings.arrows,
                autoplayHoverPause: true,
                navText: otNavText,
                navContainerClass: String(navClass),
                smartSpeed: 500,
                dotsSpeed: 350,
                autoHeight: true,
                responsive : {
                    0 : {
                        items: parseInt(sliderSettings.slides_show_mobile),
                        margin: parseInt(sliderSettings.margin_mobile),
                    },
                    576 : {
                        items: parseInt(sliderSettings.slides_show_mobile_extra),
                        margin: parseInt(sliderSettings.margin_mobile_extra),
                    },
                    768 : {
                        items: parseInt(sliderSettings.slides_show_tablet),
                        margin: parseInt(sliderSettings.margin_tablet),
                    },
                    992 : {
                        items: parseInt(sliderSettings.slides_show_tablet_extra),
                        margin: parseInt(sliderSettings.margin_tablet_extra),
                    },
                    1200 : {
                        items: parseInt(sliderSettings.slides_show_laptop),
                        margin: parseInt(sliderSettings.margin_laptop),
                    },
                    1400 : {
                        items: parseInt(sliderSettings.slides_show_desktop),
                        margin: parseInt(sliderSettings.margin_desktop),
                    }
                }
            });
        });
    };

    /* --------------------------------------------------
     * Images Slider Marquee
     * --------------------------------------------------*/
    var imageSliderMarquee = function ($scope, $) {
        $scope.find('.ot-images-slider-marquee').each( function () {
            var swiperContainer  = $(this),
                sliderSettings = swiperContainer.data('slider_options');

            if ('yes' === sliderSettings.data_items_auto) {
                var slidesPerViewInit = "auto";
                var breakpointsInit = null;
            }else{
                var sliderItemsXs = sliderSettings.data_show_mobile;
                var sliderItemsSm = sliderSettings.data_show_mobile_extra;
                var sliderItemsMd = sliderSettings.data_show_tablet;
                var sliderItemsLg = sliderSettings.data_show_tablet_extra;
                var sliderItemsXl = sliderSettings.data_show_laptop;
                var sliderItemsXxl = sliderSettings.data_show_desktop; 
                var slidesPerViewInit = sliderItemsXxl;
                var breakpointsInit = {
                    0: {
                        slidesPerView: Number(sliderItemsXs)
                    },
                    576: {
                        slidesPerView: Number(sliderItemsSm)
                    },
                    768: {
                        slidesPerView: Number(sliderItemsMd)
                    },
                    992: {
                        slidesPerView: Number(sliderItemsLg)
                    },
                    1200: {
                        slidesPerView: Number(sliderItemsXl)
                    },
                    1400: {
                        slidesPerView: Number(sliderItemsXxl)
                    }
                }
            }
            var config = {
                slidesPerView: slidesPerViewInit,
                spaceBetween: parseInt(sliderSettings.data_margin),
                speed: parseInt(sliderSettings.data_speed),
                autoplay: {
                    delay: 1,
                    disableOnInteraction: false,
                    reverseDirection: 'yes' === sliderSettings.data_reverse,
                    pauseOnMouseEnter: false
                },
                centeredSlides: true,
                updateOnWindowResize: 'yes' === sliderSettings.data_resizeupdate,
                loop: true,
                allowTouchMove: false,
                disableOnInteraction: true,
                breakpoints: breakpointsInit,
            }

            /*Swiper Init*/
            OTInitSwiper( swiperContainer, config );                                   
        });
    };  

    function OTInitSwiper(swiperContainer, config) {
        if ( window.elementorFrontend
            && window.elementorFrontend.utils
            && window.elementorFrontend.utils.swiper 
        ) {
            const asyncSwiper = window.elementorFrontend.utils.swiper;
            new asyncSwiper( swiperContainer, config ).then( ( newSwiperInstance ) => {
                var mySwiper = newSwiperInstance;
            });
        } else if ('undefined' !== typeof Swiper) {
            var mySwiper = new Swiper( swiperContainer[0], config );
        }
    }

    /* --------------------------------------------------
    * Projects Slider
    * --------------------------------------------------*/
    var projectsSlider = function ($scope, $) {
        $scope.find('.ot-project-carousel').each( function () {
            var selector     = $(this),
                sliderSettings = selector.data('slider_options'),
                navClass = 'yes' === sliderSettings.arrows_bottom ? 'owl-nav nav-bottom' : 'owl-nav nav-outside';
            selector.find('.owl-carousel').owlCarousel({
                rtl: rtl_owl(),
                autoplay: 'yes' === sliderSettings.autoplay,
                autoplayTimeout: parseInt(sliderSettings.autoplay_time_out),
                loop: 'yes' === sliderSettings.loop,
                responsiveClass:true,
                dots: sliderSettings.dots,
                nav: sliderSettings.arrows,
                autoplayHoverPause: true,
                navText: otNavText,
                navContainerClass: String(navClass),
                smartSpeed: 500,
                dotsSpeed: 350,
                responsive : {
                    0 : {
                        items: parseInt(sliderSettings.slides_show_mobile),
                        margin: parseInt(sliderSettings.margin_mobile),
                    },
                    576 : {
                        items: parseInt(sliderSettings.slides_show_mobile_extra),
                        margin: parseInt(sliderSettings.margin_mobile_extra),
                    },
                    768 : {
                        items: parseInt(sliderSettings.slides_show_tablet),
                        margin: parseInt(sliderSettings.margin_tablet),
                    },
                    992 : {
                        items: parseInt(sliderSettings.slides_show_tablet_extra),
                        margin: parseInt(sliderSettings.margin_tablet_extra),
                    },
                    1200 : {
                        items: parseInt(sliderSettings.slides_show_laptop),
                        margin: parseInt(sliderSettings.margin_laptop),
                    },
                    1400 : {
                        items: parseInt(sliderSettings.slides_show_desktop),
                        margin: parseInt(sliderSettings.margin_desktop),
                    }
                }
            });
        });
    };
    /* --------------------------------------------------
    * Latest Post Slider
    * --------------------------------------------------*/
    var latestPostSlider = function ($scope, $) {
        $scope.find('.ot-latest-post-carousel, .ot-post-carousel').each( function () {
            var selector     = $(this),
                sliderSettings = selector.data('slider_options'),
                navClass = 'yes' === sliderSettings.arrows_bottom ? 'owl-nav nav-bottom' : 'owl-nav nav-outside';
            selector.find('.owl-carousel').owlCarousel({
                rtl: rtl_owl(),
                autoplay: 'yes' === sliderSettings.autoplay,
                autoplayTimeout: parseInt(sliderSettings.autoplay_time_out),
                loop: 'yes' === sliderSettings.loop,
                responsiveClass:true,
                dots: sliderSettings.dots,
                nav: sliderSettings.arrows,
                autoplayHoverPause: true,
                navText: otNavText,
                navContainerClass: String(navClass),
                smartSpeed: 500,
                dotsSpeed: 350,
                responsive : {
                    0 : {
                        items: parseInt(sliderSettings.slides_show_mobile),
                        margin: parseInt(sliderSettings.margin_mobile),
                    },
                    576 : {
                        items: parseInt(sliderSettings.slides_show_mobile_extra),
                        margin: parseInt(sliderSettings.margin_mobile_extra),
                    },
                    768 : {
                        items: parseInt(sliderSettings.slides_show_tablet),
                        margin: parseInt(sliderSettings.margin_tablet),
                    },
                    992 : {
                        items: parseInt(sliderSettings.slides_show_tablet_extra),
                        margin: parseInt(sliderSettings.margin_tablet_extra),
                    },
                    1200 : {
                        items: parseInt(sliderSettings.slides_show_laptop),
                        margin: parseInt(sliderSettings.margin_laptop),
                    },
                    1400 : {
                        items: parseInt(sliderSettings.slides_show_desktop),
                        margin: parseInt(sliderSettings.margin_desktop),
                    }
                }
            });
        });
    };
    /* --------------------------------------------------
    * Photo Collection Slider
    * --------------------------------------------------*/
    var photoCollectionSlider = function ($scope, $) {
        $scope.find('.ot-photo-collection-carousel').each( function () {
            var selector     = $(this),
                sliderSettings = selector.data('slider_options'),
                navClass = 'yes' === sliderSettings.arrows_bottom ? 'owl-nav nav-bottom' : 'owl-nav nav-outside';
            selector.find('.owl-carousel').owlCarousel({
                rtl: rtl_owl(),
                autoplay: 'yes' === sliderSettings.autoplay,
                autoplayTimeout: parseInt(sliderSettings.autoplay_time_out),
                loop: 'yes' === sliderSettings.loop,
                responsiveClass:true,
                dots: sliderSettings.dots,
                nav: sliderSettings.arrows,
                autoplayHoverPause: true,
                navText: otNavText,
                navContainerClass: String(navClass),
                smartSpeed: 500,
                dotsSpeed: 350,
                responsive : {
                    0 : {
                        items: parseInt(sliderSettings.slides_show_mobile),
                        margin: parseInt(sliderSettings.margin_mobile),
                    },
                    576 : {
                        items: parseInt(sliderSettings.slides_show_mobile_extra),
                        margin: parseInt(sliderSettings.margin_mobile_extra),
                    },
                    768 : {
                        items: parseInt(sliderSettings.slides_show_tablet),
                        margin: parseInt(sliderSettings.margin_tablet),
                    },
                    992 : {
                        items: parseInt(sliderSettings.slides_show_tablet_extra),
                        margin: parseInt(sliderSettings.margin_tablet_extra),
                    },
                    1200 : {
                        items: parseInt(sliderSettings.slides_show_laptop),
                        margin: parseInt(sliderSettings.margin_laptop),
                    },
                    1400 : {
                        items: parseInt(sliderSettings.slides_show_desktop),
                        margin: parseInt(sliderSettings.margin_desktop),
                    }
                }
            });
        });
    };
    /* --------------------------------------------------
    * Portfolio filter isotope
    * --------------------------------------------------*/

    function otIsotope() {
        $('.projects-masonry').each(function () {
            var $isotopeWrap = $(this);
            var properties = {
                itemSelector : '.project-item',
                animationEngine : 'css',
                layoutMode: 'masonry',
                percentPosition: true,
                masonry: {
                    columnWidth: '.grid-sizer'
                },
                isOriginLeft: rtl_isotop(),
                transitionDuration: '0.7s'
            };
            $isotopeWrap.imagesLoaded(function() {
                $isotopeWrap.isotope(properties);
                $isotopeWrap.isotope("layout");
            });
            otIsotopeFilterHandler(this);
        });
    }

    function otIsotopeFilterHandler(self){
        var filterBtn = $(self).closest('.projects-filter-wrapper').find('.isotope-filter .filter-item');

        /* Filter Handler */
        filterBtn.on('click', function (e) {
            e.preventDefault();

            var $this = $(this);
            if ( $this.hasClass('active') ) {
                return;
            }
            $this.addClass('active').parent().siblings().find('a').removeClass('active');

            var dataFilter  = $this.attr('data-filter'),
                isotopeWrap = $this.closest('.projects-filter-wrapper').find('.projects-masonry');
            isotopeWrap.isotope({ 
                filter: dataFilter 
            });
        });
    }
    
    /**
    * Plyr
    * Enables media player
    * Requires plyr.min.js
    */
    function plyr() {
        var players = Plyr.setup('.player', {
            loadSprite: true,
        });
    }

    /**
    * iTooltip
    * Enables custom tooltip style for image hover docs/elements/hover.html
    * Requires assets/js/vendor/itooltip.min.js
    */
    function otTooltip() {
        var tooltip = new iTooltip('.ot-tooltip');
        tooltip.init({
            className: 'itooltip-inner',
            indentX: 15,
            indentY: 15,
            positionX: 'right',
            positionY: 'bottom'
        });
    }

    $(window).on('load', function () {
        plyr();
        lightbox();
        otTooltip();
        otIsotope();
    });

    $(document).ready( function() {
        otProgressBar();
    });

    /**
     * Elementor JS Hooks
     */
    $(window).on("elementor/frontend/init", function () {

        if ( window.elementorFrontend.isEditMode() ) {
            /* Button play */
            window.elementorFrontend.hooks.addAction(
                "frontend/element_ready/ot-btn-play.default",
                function () {
                    lightbox();
                }
            );
            /* Text typer animation */
            window.elementorFrontend.hooks.addAction(
                "frontend/element_ready/ot-text-animation.default",
                function () {
                    textAnimation();
                    textRotator();
                }
            );
            /* Progressbar */
            window.elementorFrontend.hooks.addAction(
                "frontend/element_ready/ot-progress-bars.default",
                function () {
                    otProgressBar();
                }
            );
            /* Image GlightBox */
            window.elementorFrontend.hooks.addAction(
                "frontend/element_ready/ot-image-glightbox.default",
                function () {
                    otTooltip();
                    lightbox();
                }
            );
            /* Images carousel */
            window.elementorFrontend.hooks.addAction(
                "frontend/element_ready/ot-images-slider.default",
                function () {
                    lightbox();
                }
            );
            /* Project carousel 2 */
            window.elementorFrontend.hooks.addAction(
                "frontend/element_ready/ot-portfolio-carousel_2.default",
                function () {
                    lightbox();
                }
            );
            /* Portfolio filter isotop */
            window.elementorFrontend.hooks.addAction(
                "frontend/element_ready/ot-portfolio-filter.default",
                function () {
                    otIsotope();
                }
            );
            window.elementorFrontend.hooks.addAction(
                "frontend/element_ready/ot-portfolio-filter_2.default",
                function () {
                    otIsotope();
                }
            );
        }
    	/* Custom accordions */
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/ot-userform.default",
            userForm
        );

        elementorFrontend.hooks.addAction(
            "frontend/element_ready/ot-accordions.default",
            customAccordions
        );
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/ot-accordions-wicon.default",
            customAccordions
        );
        /* Custom tabs */
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/ot-tabs.default",
            customTabs
        );
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/ot-big-tabs.default",
            otBigTabs
        );
        /* Pricing Switcher */
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/ot-switchs.default",
            pricingSwitcher
        );
        /* Team carousel */
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/ot-team-slider.default",
            teamSlider
        );
        /* Testimonial carousel */
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/ot-testimonials-carousel.default",
            testimonialSlider
        );
        /* Clients carousel */
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/ot-clients-slider.default",
            clientsSlider
        );
        /* Images carousel */
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/ot-images-slider.default",
            imagesSlider
        );
        /* Images slide Marquee */
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/ot-images-slider-marquee.default",
            imageSliderMarquee
        );
        /* Counter */
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/ot-counter.default",
            function () {
                otCounter();
            }
        );
        /* Countdown */
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/ot-countdown.default",
            otCountDown
        );
        /* Project carousel */
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/ot-portfolio-carousel.default",
            projectsSlider
        );
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/ot-portfolio-carousel_2.default",
            projectsSlider
        );
        /* Post carousel */
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/ot-posts-carousel.default",
            latestPostSlider
        );
        /* Latest Post carousel */
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/ot-latest-posts-carousel.default",
            latestPostSlider
        );
        /* Latest Post carousel 2 */
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/ot-latest-posts-carousel_2.default",
            latestPostSlider
        );
        /* Photo Collection carousel */
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/ot-photo-collection-carousel.default",
            photoCollectionSlider
        );
        
    });

} )( jQuery );