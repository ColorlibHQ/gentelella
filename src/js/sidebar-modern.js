/**
 * Modern Sidebar - jQuery-free version
 * Enhanced sidebar menu with proper multilevel support
 */

// Define DOM utilities locally if not available globally
const DOM = window.DOM || {
  select: (selector) => document.querySelector(selector),
  selectAll: (selector) => [...document.querySelectorAll(selector)],
  addClass: (element, className) => element?.classList.add(className),
  removeClass: (element, className) => element?.classList.remove(className),
  toggleClass: (element, className) => element?.classList.toggle(className),
  hasClass: (element, className) => element?.classList.contains(className),
  closest: (element, selector) => element?.closest(selector),
  find: (element, selector) => element?.querySelector(selector),
  findAll: (element, selector) => [...(element?.querySelectorAll(selector) || [])],
  css: (element, property, value) => {
    if (element) {
      if (value !== undefined) {
        element.style[property] = value;
      } else {
        return window.getComputedStyle(element)[property];
      }
    }
  },
  height: (element) => element ? element.offsetHeight : 0,
  outerHeight: (element) => element ? element.offsetHeight : 0,
  slideUp: (element, duration = 300) => {
    if (element) {
      element.style.transition = `height ${duration}ms ease`;
      element.style.height = element.offsetHeight + 'px';
      element.style.overflow = 'hidden';

      requestAnimationFrame(() => {
        element.style.height = '0px';
        setTimeout(() => {
          element.style.display = 'none';
          element.style.transition = '';
          element.style.overflow = '';
        }, duration);
      });
    }
  },
  slideDown: (element, duration = 300) => {
    if (element) {
      element.style.display = '';
      element.style.overflow = 'hidden';
      element.style.height = '0px';
      element.style.transition = `height ${duration}ms ease`;

      requestAnimationFrame(() => {
        element.style.height = element.scrollHeight + 'px';
        setTimeout(() => {
          element.style.height = '';
          element.style.transition = '';
          element.style.overflow = '';
        }, duration);
      });
    }
  },
  slideToggle: (element, duration = 300) => {
    if (element) {
      const isVisible = element.offsetHeight > 0;
      if (isVisible) {
        DOM.slideUp(element, duration);
      } else {
        DOM.slideDown(element, duration);
      }
    }
  }
};

function initSidebar() {
  // Helper function to set the content height
  const setContentHeight = function () {
    const body = document.body;
    const rightCol = DOM.select('.right_col');
    const sidebarFooter = DOM.select('.sidebar-footer');
    const leftCol = DOM.select('.left_col');
    const navMenu = DOM.select('.nav_menu');
    const footer = DOM.select('footer');

    if (!rightCol) {
      return;
    }

    // reset height
    DOM.css(rightCol, 'min-height', window.innerHeight + 'px');

    const bodyHeight = DOM.outerHeight(body);
    const footerHeight = DOM.hasClass(body, 'footer_fixed') ? -10 : footer ? DOM.height(footer) : 0;
    const leftColHeight =
      (leftCol ? DOM.height(leftCol) : 0) + (sidebarFooter ? DOM.height(sidebarFooter) : 0);
    let contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight;

    // normalize content
    contentHeight -= (navMenu ? DOM.height(navMenu) : 0) + footerHeight;

    DOM.css(rightCol, 'min-height', contentHeight + 'px');
  };

  const sidebarMenu = DOM.select('#sidebar-menu');
  const body = document.body;
  const currentUrl = window.location.href.split('#')[0].split('?')[0];

  if (!sidebarMenu) {
    return;
  }

  // Enhanced sidebar menu click handler
  sidebarMenu.addEventListener('click', function (ev) {
    const target = ev.target.closest('a');
    if (!target) {
      return;
    }

    const li = target.parentElement;
    const submenu = li.querySelector('ul.child_menu');

    // If this link has no submenu, allow normal navigation
    if (!submenu) {
      return true;
    }

    // Prevent default for menu toggles
    ev.preventDefault();
    ev.stopPropagation();

    // Check if submenu is currently visible
    const isVisible = submenu.style.display !== 'none' && submenu.offsetHeight > 0;

    // Close all other submenus at the same level
    const parentMenu = li.parentElement;
    if (parentMenu) {
      DOM.selectAll('li', parentMenu).forEach(sibling => {
        if (sibling !== li) {
          const siblingSubmenu = sibling.querySelector('ul.child_menu');
          if (siblingSubmenu) {
            DOM.slideUp(siblingSubmenu);
            DOM.removeClass(sibling, 'active');
          }
        }
      });
    }

    // Toggle current submenu
    if (isVisible) {
      DOM.slideUp(submenu);
      DOM.removeClass(li, 'active');
    } else {
      DOM.slideDown(submenu);
      DOM.addClass(li, 'active');
    }

    setContentHeight();
  });

  // Menu toggle functionality
  const menuToggle = DOM.select('#menu_toggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', function (ev) {
      ev.preventDefault();

      if (DOM.hasClass(body, 'nav-md')) {
        DOM.removeClass(body, 'nav-md');
        DOM.addClass(body, 'nav-sm');

        // Hide full logo, show icon logo
        const logoFull = DOM.select('.logo-full');
        const logoIcon = DOM.select('.logo-icon');
        if (logoFull) {
          logoFull.style.display = 'none';
        }
        if (logoIcon) {
          logoIcon.style.display = 'inline-block';
        }

        // Close all submenus when collapsing
        DOM.selectAll('#sidebar-menu ul.child_menu').forEach(submenu => {
          submenu.style.display = 'none';
        });
        DOM.selectAll('#sidebar-menu li.active').forEach(li => {
          DOM.removeClass(li, 'active');
        });
      } else {
        DOM.removeClass(body, 'nav-sm');
        DOM.addClass(body, 'nav-md');

        // Show full logo, hide icon logo
        const logoFull = DOM.select('.logo-full');
        const logoIcon = DOM.select('.logo-icon');
        if (logoFull) {
          logoFull.style.display = 'inline-block';
        }
        if (logoIcon) {
          logoIcon.style.display = 'none';
        }
      }

      setContentHeight();
    });
  }

  // Highlight current page in menu
  if (currentUrl) {
    DOM.selectAll('#sidebar-menu a').forEach(link => {
      if (link.href && link.href === currentUrl) {
        DOM.addClass(link.parentElement, 'current-page');

        // Open parent menus if this is a submenu item
        let parent = link.closest('ul.child_menu');
        while (parent) {
          parent.style.display = 'block';
          const parentLi = parent.closest('li');
          if (parentLi) {
            DOM.addClass(parentLi, 'active');
          }
          parent = parent.parentElement.closest('ul.child_menu');
        }
      }
    });
  }

  // Initialize content height
  setContentHeight();

  // Recalculate on window resize
  window.addEventListener('resize', setContentHeight);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSidebar);
} else {
  initSidebar();
}

export default { initSidebar };
