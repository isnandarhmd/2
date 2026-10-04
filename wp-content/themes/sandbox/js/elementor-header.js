(function($) {
    "use strict";
  
    /* --------------------------------------------------
    * side panel
    * --------------------------------------------------*/
    var sidePanel  = function(){
      var element = $('#panel-btn'),
      sidebar = $('#side-panel');
  
      function panel_handler() {
          var isActive = !element.hasClass('active');
  
          element.toggleClass('active', isActive);
          sidebar.toggleClass('side-panel-open', isActive);
          $('body').toggleClass('side-panel-active', isActive);
          return false;
      }
  
      $('#panel-btn, .side-panel-close, .panel-overlay').on('click', panel_handler);
    };
  
    /* --------------------------------------------------
    * toggle search
    * --------------------------------------------------*/
    var stogg   = $('.toggle_search'),
        hsearch = $('#search-panel');

    function hsearch_handler() {
        var isActive = !stogg.hasClass('active');

        stogg.toggleClass('active', isActive);
        hsearch.toggleClass('search-open', isActive);
        $('body').toggleClass('search-active', isActive);
        document.getElementById("search-field").focus();
        return false;
    }

    $('.toggle_search, .search-close, .search-overlay').on('click', hsearch_handler);

    /* --------------------------------------------------
    * toggle cart
    * --------------------------------------------------*/
    var hCart  = function(){
      var ctogg   = $('.octf-cart'),
          hcart = $('.site-header-cart');
  
      function hcart_handler() {
          var isActive = !ctogg.hasClass('active');
  
          ctogg.toggleClass('active', isActive);
          hcart.toggleClass('cart-open', isActive);
          $('body').toggleClass('cart-active', isActive);
          return false;
      }
  
      $('.octf-cart, .cart-close, .cart-overlay').on('click', hcart_handler);
    };
  
    /* --------------------------------------------------
    * mobile menu
    * --------------------------------------------------*/
    var mmenuPanel  = function(){
          var element = $('#mmenu-toggle'),
              mmenu   = $('#mmenu-wrapper');
  
          function mmenu_handler() {
              var isActive = !element.hasClass('active');
  
              element.toggleClass('active', isActive);
              mmenu.toggleClass('mmenu-open', isActive);
              $('body').toggleClass('mmenu-active', isActive);
              return false;
          }
  
          $('#mmenu-toggle, .mmenu-close, .mmenu-overlay').on('click', mmenu_handler);
  
          $('.mmenu-wrapper li:has(ul)').prepend('<span class="arrow"><i class="uil uil-angle-down"></i></span>');
          $(".mmenu-wrapper .mobile_mainmenu > li span.arrow").on('click',function() {
              $(this).parent().find("> ul").stop(true, true).slideToggle()
              $(this).toggleClass( "active" ); 
          });
      };
  
      /**
       * Elementor JS Hooks
       */
      $(window).on("elementor/frontend/init", function () {
  
          /*mmenu*/
          elementorFrontend.hooks.addAction(
              "frontend/element_ready/imenu_mobile.default",
              mmenuPanel
          );
          /*sidepanel*/
          elementorFrontend.hooks.addAction(
              "frontend/element_ready/isidepanel.default",
              sidePanel
          );
          /*cart*/
          elementorFrontend.hooks.addAction(
              "frontend/element_ready/icart.default",
              hCart
          );
  
    });
  
  })(jQuery);