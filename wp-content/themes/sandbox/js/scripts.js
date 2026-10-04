( function( $ ) {
    'use strict';

  /* rtl check */
  function rtl_owl(){
  if ($('body').hasClass("rtl")) {
    return true;
  } else {
    return false;
  }};

  /* --------------------------------------------------
  * sticky header
  * --------------------------------------------------*/
  $('.header-desktop .is-fixed').parent().append('<div class="dheader-clone"></div>');
  $('.header-mobile .is-fixed').parent().append('<div class="mheader-clone"></div>');
 	var dclone = $('.dheader-clone'),
 	    mclone = $('.mheader-clone'),
      fixed  = $('#site-header .is-fixed');
  $(window).on("scroll", function(){
    var site_header = $('#site-header').outerHeight() + 200;  
      
    if ($(window).scrollTop() >= site_header) {
      fixed.addClass('is-stuck');
      fixed.find('.hitem').addClass('scrolled');
      dclone.height($('.header-desktop .is-fixed').outerHeight());
      mclone.height($('.header-mobile .is-fixed').outerHeight());
    }else{
      fixed.removeClass('is-stuck');                  
      fixed.find('.hitem').removeClass('scrolled');
      dclone.height('0');
      mclone.height('0');
    }
  });

  /* --------------------------------------------------
  * mobile menu
  * --------------------------------------------------*/
  $('.mmenu_wrapper li:has(ul)').prepend('<span class="arrow"><i class="uil-angle-down"></i></span>');
  $(".mmenu_wrapper .mobile_mainmenu > li span.arrow").on('click',function() {
      $(this).parent().find("> ul").stop(true, true).slideToggle()
      $(this).toggleClass( "active" ); 
  });

	$( "#mmenu_toggle" ).on('click', function() {
		$(this).toggleClass( "active" );
		$(this).parents('.header_mobile').toggleClass( "open" );
		if ($(this).hasClass( "active" )) {
			$('.mobile_nav').stop(true, true).slideDown(100);
		}else{
			$('.mobile_nav').stop(true, true).slideUp(100);
		}		
	});

  /* --------------------------------------------------
  * popup promo
  * --------------------------------------------------*/
  var popup = $('.popup-form'),
      news  = $('.popup-newsletter');

  function popupOpen() {
    $('.error').parents('.popup-form').addClass('popup-open');
    news.addClass('popup-open');
    news.parents('body').addClass('popup-active');
  }

  $(window).on('load', function() {
    setTimeout(popupOpen(), 400);
  });

  $('.elementor-button-wrapper a[href=#promo], .ot-button-wrapper a[href=#promo]').on('click', function(){
    popupOpen();
    return false;
  });

  /* --------------------------------------------------
  * popup login/register
  * --------------------------------------------------*/
  var login = $('.popup-login');
  var regis = $('.popup-regis');

  $('.popup-form a[href=#signin], .elementor-button-wrapper a[href=#signin], .ot-button-wrapper a[href=#signin]').on('click', function(){
    popup.removeClass('popup-open');
    login.addClass('popup-open');
    $('body').addClass('popup-active');
    return false;
  });


  $('.popup-form a[href=#signup], .elementor-button-wrapper a[href=#signup], .ot-button-wrapper a[href=#signup]').on('click', function(){
    popup.removeClass('popup-open');
    regis.addClass('popup-open');
    $('body').addClass('popup-active');
    return false;
  });

  $('.popup-close, .popup-overlay').on('click', function(){
    popup.removeClass('popup-open');
    $('body').removeClass('popup-active');
    return false;
  });

  /* --------------------------------------------------
  * gallery post
  * --------------------------------------------------*/
  $('.gallery-post').each( function () {
    var selector = $(this);
    selector.owlCarousel({
      rtl: rtl_owl(),
      loop:false,
      margin:0,
      responsiveClass:true,
      items:1,
      dots:true,
      nav:true,
      dotsClass: 'owl-dots dots-over',
      navText:['<i class="uil uil-arrow-left"></i>', '<i class="uil uil-arrow-right"></i>']
    });
  });

  /* --------------------------------------------------
  * slide posts
  * --------------------------------------------------*/
  $('.slide-posts').each( function () {
    var selector = $(this);
    selector.owlCarousel({
      rtl: rtl_owl(),
      loop:false,
      margin:30,
      responsiveClass:true,
      dots:true,
      nav:false,
      responsive : {
        0 : {
          items: 1,
        },
        992 : {
          items: 2,
        }
      }
    });
  });

  /* --------------------------------------------------
  * share toggle
  * --------------------------------------------------*/
  $(document).on('click', 'body', function(){
    $('.sdropdown').hide();
  });
  $(document).on('click', '.share-btn', function(){
    $(this).next().toggle();
    return false;
  });
  

  /* --------------------------------------------------
    * back to top
    * --------------------------------------------------*/
  var theme = {
    init: function () {
      theme.passVisibility();
      theme.pageProgress();
      theme.bsModal();
      theme.singlePostGLightbox();
      theme.rellax();
      theme.backgroundImageMobile();
      theme.scrollCue();
      theme.textRotator();
      theme.loader();
    },

    /**
     * scrollCue.js
     * Enables showing elements by scrolling
     * Requires assets/js/vendor/scrollCue.min.js
     */
    scrollCue: () => {
      scrollCue.init({
        interval: -400,
        duration: 700,
        percentage: 0.9
      });
      scrollCue.update();
    },

    passVisibility: () => {
      let pass = document.querySelectorAll('.password-field');
      for (let i = 0; i < pass.length; i++) {
        let passInput = pass[i].querySelector('.form-control');
        let passToggle = pass[i].querySelector('.password-toggle > i');
        passToggle.addEventListener('click', (e) => {
          if (passInput.type === "password") {
            passInput.type = "text";
            passToggle.classList.remove('uil-eye');
            passToggle.classList.add('uil-eye-slash');
          } else {
            passInput.type = "password";
            passToggle.classList.remove('uil-eye-slash'); 
            passToggle.classList.add('uil-eye');
          } 
        }, false);
      }
    },

    bsModal: () => {
      if(document.querySelector(".modal-popup") != null) {
        var myModalPopup = new bootstrap.Modal(document.querySelector('.modal-popup'));
        setTimeout(function() {
          myModalPopup.show();
        }, 200);
      }
      // Fixes jumping of page progress caused by modal
      var innerWidth = window.innerWidth;
      var clientWidth = document.body.clientWidth;
      var scrollSize = innerWidth - clientWidth;
      var myModalEl = document.querySelectorAll('.modal');
      var navbarFixed = document.querySelector('.navbar.fixed');
      var pageProgress = document.querySelector('.progress-wrap');
      function setPadding() {
        if(navbarFixed != null) {
          navbarFixed.style.paddingRight = scrollSize + 'px';
        }
        if(pageProgress != null) {
          pageProgress.style.marginRight = scrollSize + 'px';
        }
      }
      function removePadding() {
        if(navbarFixed != null) {
          navbarFixed.style.paddingRight = '';
        }
        if(pageProgress != null) {
         pageProgress.style.marginRight = '';
        }
      }
      myModalEl.forEach(myModalEl => {
        myModalEl.addEventListener('show.bs.modal', function(e) {
          setPadding();
        })
        myModalEl.addEventListener('hidden.bs.modal', function(e) {
          removePadding();
        })
      });
    } ,

    pageProgress: () => {
      var progressWrap = document.querySelector('.progress-wrap');
      var progressPath = document.querySelector('.progress-wrap path');
      var pathLength = progressPath.getTotalLength();
      var offset = 50;
      if(progressWrap != null) {
        progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
        progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
        progressPath.style.strokeDashoffset = pathLength;
        progressPath.getBoundingClientRect();
        progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';
        window.addEventListener("scroll", function(event) {
          var scroll = document.body.scrollTop || document.documentElement.scrollTop;
          var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          var progress = pathLength - (scroll * pathLength / height);
          progressPath.style.strokeDashoffset = progress;
          var scrollElementPos = document.body.scrollTop || document.documentElement.scrollTop;
          if(scrollElementPos >= offset) {
            progressWrap.classList.add("active-progress")
          } else {
            progressWrap.classList.remove("active-progress")
          }
        });
        progressWrap.addEventListener('click', function(e) {
          e.preventDefault();
          window.scroll({
            top: 0, 
            left: 0,
            behavior: 'smooth'
          });
        });
      }
    },
    singlePostGLightbox: () => {
      const singlePostGlightbox = GLightbox({
        selector: '.single-post-gallery',
      });
    },

    /**
     * Background Image Mobile
     * Adds .mobile class to background images on mobile devices for styling purposes
     */
    backgroundImageMobile: () => {
      var isMobile = (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i)) ? true : false;
      if(isMobile) {
        document.querySelectorAll(".elementor-section.image-wrapper").forEach(e => {
          e.classList.add("mobile")
        })
      }
    },

    /**
     * ReplaceMe.js
     * Enables text rotator
     * Requires assets/js/vendor/replaceme.min.js
     */
    textRotator: () => {
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
    },

    /**
     * Rellax.js
     * Adds parallax animation to shapes and elements
     * Requires assets/js/vendor/rellax.min.js
     */
    rellax: () => {
      if(document.querySelector(".rellax") != null) {
        window.onload = function() {
          var rellax = new Rellax('.rellax', {
            speed: 2,
            center: true,
            breakpoints: [576, 992, 1201]
          });
          var projects_overflow = document.querySelectorAll('.projects-overflow');
          imagesLoaded(projects_overflow, function() {
            rellax.refresh();
          });
        }
      }
    },

    /**
     * Loader
     * 
     */
    loader: () => {
      var preloader = document.querySelector('.page-loader');
      if(preloader != null) {
        document.body.onload = function(){
          setTimeout(function() {
            if( !preloader.classList.contains('done') )
            {
              preloader.classList.add('done');
            }
          }, 300)
        }
      }
    },

  }
  theme.init();

} )( jQuery );
