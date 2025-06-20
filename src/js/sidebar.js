(function($) {
/**
   * This file contains the logic for the sidebar menu only.
   * It has been cleaned of all other component initializations.
   */
  function init_sidebar() {
    console.log('🔧 Initializing sidebar...');
    
    // Helper function to set the content height
    var setContentHeight = function () {
        var $BODY = $('body'),
            $RIGHT_COL = $('.right_col'),
    $SIDEBAR_FOOTER = $('.sidebar-footer'),
    $LEFT_COL = $('.left_col'),
    $NAV_MENU = $('.nav_menu'),
    $FOOTER = $('footer');

        // reset height
        $RIGHT_COL.css('min-height', $(window).height());

        var bodyHeight = $BODY.outerHeight(),
            footerHeight = $BODY.hasClass('footer_fixed') ? -10 : $FOOTER.height(),
            leftColHeight = $LEFT_COL.eq(1).height() + $SIDEBAR_FOOTER.height(),
            contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight;

        // normalize content
        contentHeight -= $NAV_MENU.height() + footerHeight;

        $RIGHT_COL.css('min-height', contentHeight);
    };

    var $SIDEBAR_MENU = $('#sidebar-menu'),
        $BODY = $('body'),
        CURRENT_URL = window.location.href.split('#')[0].split('?')[0];

    console.log('🔧 Sidebar menu found:', $SIDEBAR_MENU.length > 0);
    console.log('🔧 Current URL:', CURRENT_URL);

    // Sidebar menu click handler
    $SIDEBAR_MENU.find('a').on('click', function(ev) {
        console.log('🔧 Menu item clicked:', $(this).text().trim());
        
        var $li = $(this).parent();

        if (!$li.children('ul').length) {
            console.log('🔧 No submenu found, allowing default action');
            return;
        }

        ev.preventDefault();
        console.log('🔧 Submenu found, toggling...');

        if ($li.hasClass('active')) {
            console.log('🔧 Closing active menu');
            $li.removeClass('active');
            $li.children('ul').hide(200, function() {
                setContentHeight();
            });
        } else {
            console.log('🔧 Opening menu');
            var $activeLi = $SIDEBAR_MENU.find('li.active');
            
            if ($activeLi.length) {
                console.log('🔧 Closing other active menus first');
                $activeLi.removeClass('active');
                $activeLi.children('ul').hide(200, function() {
                    $li.addClass('active');
                    $li.children('ul').show(200, function() {
                        setContentHeight();
                    });
                });
            } else {
                console.log('🔧 No other active menus, opening directly');
                $li.addClass('active');
                $li.children('ul').show(200, function() {
                    setContentHeight();
                });
            }
        }
    });

    // Menu toggle (hamburger menu)
    var $MENU_TOGGLE = $('#menu_toggle');
    console.log('🔧 Menu toggle found:', $MENU_TOGGLE.length > 0);
    
    $MENU_TOGGLE.on('click', function() {
        console.log('🔧 Menu toggle clicked');
        if ($BODY.hasClass('nav-md')) {
            $SIDEBAR_MENU.find('li.active ul').hide();
            $BODY.removeClass('nav-md').addClass('nav-sm');
        } else {
            $SIDEBAR_MENU.find('li.active ul').show();
            $BODY.removeClass('nav-sm').addClass('nav-md');
        }
        setContentHeight();
    });

    // Set current page as active and open the menu
    $SIDEBAR_MENU.find('a[href="' + CURRENT_URL + '"]').parent('li').addClass('current-page');
    $SIDEBAR_MENU.find('a').filter(function () {
        return this.href == CURRENT_URL;
    }).parent('li').addClass('active').parents('ul').show().parent().addClass('active');

    // Recalculate content height on window resize
    $(window).smartresize(function() {
        setContentHeight();
    });

    // Set initial height
    setContentHeight();
    
    console.log('✅ Sidebar initialization complete');
  }

  // Initialize the sidebar when the document is ready
  $(document).ready(function() {
    console.log('🔧 Document ready, initializing sidebar...');
    init_sidebar();
  });
  
  // Also try to initialize immediately if jQuery is available
  if (typeof $ !== 'undefined') {
    console.log('🔧 jQuery available, trying immediate init...');
    $(function() {
      init_sidebar();
    });
  }
})(window.jQuery || window.$);
