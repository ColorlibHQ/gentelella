(function($) {
/**
 * Enhanced sidebar menu with proper multilevel support
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

  // Clear any existing handlers to prevent conflicts
  $SIDEBAR_MENU.off('click.sidebar');

  // Enhanced sidebar menu click handler
  $SIDEBAR_MENU.on('click.sidebar', 'a', function(ev) {
    var $link = $(this);
    var $li = $link.parent('li');
    var $submenu = $li.children('ul.child_menu');

    // If this link has no submenu, allow normal navigation
    if (!$submenu.length) {
      return true;
    }

    // Prevent default for menu toggles
    ev.preventDefault();
    ev.stopPropagation();

    // Toggle submenu
    if ($li.hasClass('active')) {
      // Close this menu and all nested menus
      $li.removeClass('active');
      $submenu.slideUp(200, function() {
        setContentHeight();
      });
      // Close all nested active menus
      $submenu.find('li.active').removeClass('active').children('ul.child_menu').hide();
    } else {
      // Close sibling menus at the same level
      $li.siblings('li.active').each(function() {
        var $sibling = $(this);
        $sibling.removeClass('active');
        $sibling.children('ul.child_menu').slideUp(200);
        // Close nested menus in siblings
        $sibling.find('li.active').removeClass('active').children('ul.child_menu').hide();
      });
      
      // Open this menu
      $li.addClass('active');
      $submenu.slideDown(200, function() {
        setContentHeight();
      });
    }

    return false;
  });

  // Menu toggle (hamburger menu) handler
  var $MENU_TOGGLE = $('#menu_toggle');
  
  $MENU_TOGGLE.off('click.sidebar').on('click.sidebar', function() {
    if ($BODY.hasClass('nav-md')) {
      // Hide all active submenus when collapsing
      $SIDEBAR_MENU.find('li.active ul.child_menu').hide();
      $BODY.removeClass('nav-md').addClass('nav-sm');
    } else {
      // Show active submenus when expanding
      $SIDEBAR_MENU.find('li.active ul.child_menu').show();
      $BODY.removeClass('nav-sm').addClass('nav-md');
    }
    setContentHeight();
  });

  // Set current page as active and open parent menus
  var $currentPageLink = $SIDEBAR_MENU.find('a[href="' + CURRENT_URL + '"]');
  if ($currentPageLink.length) {
    var $currentLi = $currentPageLink.parent('li');
    $currentLi.addClass('current-page');
    
    // Open all parent menus
    $currentLi.parents('li').each(function() {
      var $parentLi = $(this);
      if ($parentLi.children('ul.child_menu').length) {
        $parentLi.addClass('active');
        $parentLi.children('ul.child_menu').show();
      }
    });
  }

  // Handle window resize
  $(window).off('resize.sidebar').on('resize.sidebar', function() {
    setContentHeight();
  });

  // Set initial height
  setContentHeight();
}

// Initialize the sidebar when the document is ready
$(document).ready(function() {
  init_sidebar();
});

// Also try to initialize immediately if jQuery is available
if (typeof $ !== 'undefined') {
  $(function() {
    init_sidebar();
  });
}

})(window.jQuery || window.$);
