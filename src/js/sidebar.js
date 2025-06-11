(function($) {
/**
   * This file contains the logic for the sidebar menu only.
   * It has been cleaned of all other component initializations.
   */
  function init_sidebar() {
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

    // Sidebar menu click handler
    $SIDEBAR_MENU.find('a').on('click', function(ev) {
        var $li = $(this).parent();

        if (!$li.children('ul').length) {
            return;
        }

        ev.preventDefault();

        if ($li.hasClass('active')) {
            $li.removeClass('active');
            $li.children('ul').slideUp(function() {
                setContentHeight();
            });
        } else {
            var $activeLi = $SIDEBAR_MENU.find('li.active');
            
            if ($activeLi.length) {
                $activeLi.children('ul').slideUp(function() {
                    $activeLi.removeClass('active');
                    $li.addClass('active');
                    $li.children('ul').slideDown(function() {
                        setContentHeight();
                    });
                });
            } else {
            $li.addClass('active');
                $li.children('ul').slideDown(function() {
                setContentHeight();
            });
            }
        }
    });

    // Menu toggle (hamburger menu)
    var $MENU_TOGGLE = $('#menu_toggle');
    $MENU_TOGGLE.on('click', function() {
        if ($BODY.hasClass('nav-md')) {
            $SIDEBAR_MENU.find('li.active ul').hide();
            $BODY.toggleClass('nav-md nav-sm');
        } else {
            $SIDEBAR_MENU.find('li.active ul').show();
            $BODY.toggleClass('nav-md nav-sm');
        }
        setContentHeight();
    });

    // Set current page as active and open the menu
    $SIDEBAR_MENU.find('a[href="' + CURRENT_URL + '"]').parent('li').addClass('current-page');
    $SIDEBAR_MENU.find('a').filter(function () {
        return this.href == CURRENT_URL;
    }).parent('li').addClass('active').parents('ul').slideDown(function() {
        setContentHeight();
    }).parent().addClass('active');

    // Recalculate content height on window resize
    $(window).smartresize(function() {
        setContentHeight();
    });

    // Set initial height
    setContentHeight();
  }

  // Initialize the sidebar when the document is ready
  $(document).ready(function() {
    init_sidebar();
});
})(jQuery);
