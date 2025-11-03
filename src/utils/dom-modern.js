/**
 * Modern DOM Utilities - jQuery-free DOM manipulation
 * Provides a consistent API for DOM operations across the codebase
 */

const DOM = {
  // Basic selection
  select: selector => document.querySelector(selector),
  selectAll: selector => [...document.querySelectorAll(selector)],
  exists: selector => document.querySelector(selector) !== null,

  // Event handling
  on: (element, event, handler) => element.addEventListener(event, handler),
  off: (element, event, handler) => element.removeEventListener(event, handler),
  trigger: (element, event, data = {}) => {
    const customEvent = new CustomEvent(event, { detail: data });
    element.dispatchEvent(customEvent);
  },

  // DOM traversal
  find: (element, selector) => element.querySelector(selector),
  findAll: (element, selector) => [...element.querySelectorAll(selector)],
  closest: (element, selector) => element.closest(selector),
  parent: element => element.parentElement,
  children: element => [...element.children],
  siblings: element => [...element.parentElement.children].filter(el => el !== element),

  // Class manipulation
  hasClass: (element, className) => element.classList.contains(className),
  addClass: (element, className) => element.classList.add(className),
  removeClass: (element, className) => element.classList.remove(className),
  toggleClass: (element, className) => element.classList.toggle(className),

  // Style manipulation
  css: (element, property, value) => {
    if (typeof property === 'object') {
      // Set multiple styles: DOM.css(el, {color: 'red', fontSize: '14px'})
      Object.entries(property).forEach(([prop, val]) => {
        element.style[prop] = val;
      });
    } else if (value !== undefined) {
      // Set single style: DOM.css(el, 'color', 'red')
      element.style[property] = value;
    } else {
      // Get style: DOM.css(el, 'color')
      return getComputedStyle(element)[property];
    }
  },

  // Dimensions
  width: element => element.offsetWidth,
  height: element => element.offsetHeight,
  outerWidth: element => {
    const rect = element.getBoundingClientRect();
    const computedStyle = getComputedStyle(element);
    return (
      rect.width + parseFloat(computedStyle.marginLeft) + parseFloat(computedStyle.marginRight)
    );
  },
  outerHeight: element => {
    const rect = element.getBoundingClientRect();
    const computedStyle = getComputedStyle(element);
    return (
      rect.height + parseFloat(computedStyle.marginTop) + parseFloat(computedStyle.marginBottom)
    );
  },

  // Content manipulation
  html: (element, content) => {
    if (content !== undefined) {
      element.innerHTML = content;
    } else {
      return element.innerHTML;
    }
  },
  text: (element, content) => {
    if (content !== undefined) {
      element.textContent = content;
    } else {
      return element.textContent;
    }
  },
  val: (element, value) => {
    if (value !== undefined) {
      element.value = value;
    } else {
      return element.value;
    }
  },

  // Attributes
  attr: (element, name, value) => {
    if (value !== undefined) {
      element.setAttribute(name, value);
    } else {
      return element.getAttribute(name);
    }
  },
  removeAttr: (element, name) => element.removeAttribute(name),
  data: (element, key, value) => {
    const dataKey = `data-${key}`;
    if (value !== undefined) {
      element.setAttribute(dataKey, value);
    } else {
      return element.getAttribute(dataKey);
    }
  },

  // DOM manipulation
  append: (parent, child) => {
    if (typeof child === 'string') {
      parent.insertAdjacentHTML('beforeend', child);
    } else {
      parent.appendChild(child);
    }
  },
  prepend: (parent, child) => {
    if (typeof child === 'string') {
      parent.insertAdjacentHTML('afterbegin', child);
    } else {
      parent.insertBefore(child, parent.firstChild);
    }
  },
  after: (element, newElement) => {
    if (typeof newElement === 'string') {
      element.insertAdjacentHTML('afterend', newElement);
    } else {
      element.parentNode.insertBefore(newElement, element.nextSibling);
    }
  },
  before: (element, newElement) => {
    if (typeof newElement === 'string') {
      element.insertAdjacentHTML('beforebegin', newElement);
    } else {
      element.parentNode.insertBefore(newElement, element);
    }
  },
  remove: element => element.remove(),
  clone: (element, deep = true) => element.cloneNode(deep),

  // Visibility
  show: element => {
    element.style.display = '';
  },
  hide: element => {
    element.style.display = 'none';
  },
  toggle: element => {
    element.style.display = element.style.display === 'none' ? '' : 'none';
  },

  // Animations (jQuery-like slide effects)
  slideDown: (element, duration = 300) => {
    element.style.height = '0px';
    element.style.overflow = 'hidden';
    element.style.transition = `height ${duration}ms ease`;
    element.style.display = 'block';

    // Get the natural height
    const height = element.scrollHeight + 'px';

    // Animate to natural height
    requestAnimationFrame(() => {
      element.style.height = height;
    });

    // Clean up after animation
    setTimeout(() => {
      element.style.height = 'auto';
      element.style.overflow = '';
      element.style.transition = '';
    }, duration);
  },

  slideUp: (element, duration = 300) => {
    element.style.height = element.scrollHeight + 'px';
    element.style.overflow = 'hidden';
    element.style.transition = `height ${duration}ms ease`;

    // Animate to zero height
    requestAnimationFrame(() => {
      element.style.height = '0px';
    });

    // Hide element after animation
    setTimeout(() => {
      element.style.display = 'none';
      element.style.height = '';
      element.style.overflow = '';
      element.style.transition = '';
    }, duration);
  },

  slideToggle: (element, duration = 300) => {
    if (element.style.display === 'none' || element.offsetHeight === 0) {
      DOM.slideDown(element, duration);
    } else {
      DOM.slideUp(element, duration);
    }
  },

  fadeIn: (element, duration = 300) => {
    element.style.opacity = '0';
    element.style.display = 'block';
    element.style.transition = `opacity ${duration}ms ease`;

    requestAnimationFrame(() => {
      element.style.opacity = '1';
    });

    setTimeout(() => {
      element.style.transition = '';
    }, duration);
  },

  fadeOut: (element, duration = 300) => {
    element.style.transition = `opacity ${duration}ms ease`;
    element.style.opacity = '0';

    setTimeout(() => {
      element.style.display = 'none';
      element.style.transition = '';
      element.style.opacity = '';
    }, duration);
  },

  // Ready state
  ready: callback => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  },

  // Position and offset
  offset: element => {
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX
    };
  },

  position: element => {
    return {
      top: element.offsetTop,
      left: element.offsetLeft
    };
  },

  // Scroll
  scrollTop: (element, value) => {
    if (value !== undefined) {
      element.scrollTop = value;
    } else {
      return element.scrollTop;
    }
  },

  scrollLeft: (element, value) => {
    if (value !== undefined) {
      element.scrollLeft = value;
    } else {
      return element.scrollLeft;
    }
  }
};

// Make it available globally
window.DOM = DOM;
globalThis.DOM = DOM;

// Export for module usage
export default DOM;
