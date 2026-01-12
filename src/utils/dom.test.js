/**
 * DOM Utilities Tests
 * Tests for jQuery-free DOM manipulation functions
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import DOM from './dom.js';

describe('DOM Selection', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="container">
        <p class="text">First paragraph</p>
        <p class="text">Second paragraph</p>
        <span class="highlight">Highlighted</span>
      </div>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('select', () => {
    it('should select element by id', () => {
      const el = DOM.select('#container');
      expect(el).not.toBeNull();
      expect(el.id).toBe('container');
    });

    it('should select element by class', () => {
      const el = DOM.select('.text');
      expect(el).not.toBeNull();
      expect(el.classList.contains('text')).toBe(true);
    });

    it('should return null for non-existent selector', () => {
      const el = DOM.select('.non-existent');
      expect(el).toBeNull();
    });
  });

  describe('selectAll', () => {
    it('should select all matching elements', () => {
      const elements = DOM.selectAll('.text');
      expect(elements).toHaveLength(2);
    });

    it('should return empty array for non-existent selector', () => {
      const elements = DOM.selectAll('.non-existent');
      expect(elements).toHaveLength(0);
    });
  });

  describe('exists', () => {
    it('should return true for existing element', () => {
      expect(DOM.exists('#container')).toBe(true);
      expect(DOM.exists('.text')).toBe(true);
    });

    it('should return false for non-existent element', () => {
      expect(DOM.exists('.non-existent')).toBe(false);
    });
  });
});

describe('DOM Event Handling', () => {
  let element;
  let handler;

  beforeEach(() => {
    element = document.createElement('button');
    handler = vi.fn();
  });

  describe('on', () => {
    it('should attach event listener', () => {
      DOM.on(element, 'click', handler);
      element.click();
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe('off', () => {
    it('should remove event listener', () => {
      DOM.on(element, 'click', handler);
      DOM.off(element, 'click', handler);
      element.click();
      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('trigger', () => {
    it('should dispatch custom event', () => {
      DOM.on(element, 'custom-event', handler);
      DOM.trigger(element, 'custom-event', { value: 42 });
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should pass data in event detail', () => {
      let receivedData;
      DOM.on(element, 'custom-event', e => {
        receivedData = e.detail;
      });
      DOM.trigger(element, 'custom-event', { value: 42 });
      expect(receivedData).toEqual({ value: 42 });
    });
  });
});

describe('DOM Traversal', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="parent">
        <div id="child1" class="child">Child 1</div>
        <div id="child2" class="child">
          <span id="grandchild">Grandchild</span>
        </div>
        <div id="child3" class="child">Child 3</div>
      </div>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('find', () => {
    it('should find child element', () => {
      const parent = DOM.select('#parent');
      const child = DOM.find(parent, '#child1');
      expect(child).not.toBeNull();
      expect(child.id).toBe('child1');
    });
  });

  describe('findAll', () => {
    it('should find all matching child elements', () => {
      const parent = DOM.select('#parent');
      const children = DOM.findAll(parent, '.child');
      expect(children).toHaveLength(3);
    });
  });

  describe('closest', () => {
    it('should find closest ancestor', () => {
      const grandchild = DOM.select('#grandchild');
      const parent = DOM.closest(grandchild, '#parent');
      expect(parent).not.toBeNull();
      expect(parent.id).toBe('parent');
    });
  });

  describe('parent', () => {
    it('should return parent element', () => {
      const child = DOM.select('#child1');
      const parent = DOM.parent(child);
      expect(parent.id).toBe('parent');
    });
  });

  describe('children', () => {
    it('should return child elements', () => {
      const parent = DOM.select('#parent');
      const children = DOM.children(parent);
      expect(children).toHaveLength(3);
    });
  });

  describe('siblings', () => {
    it('should return sibling elements', () => {
      const child = DOM.select('#child2');
      const siblings = DOM.siblings(child);
      expect(siblings).toHaveLength(2);
      expect(siblings.map(s => s.id)).toContain('child1');
      expect(siblings.map(s => s.id)).toContain('child3');
    });
  });
});

describe('DOM Class Manipulation', () => {
  let element;

  beforeEach(() => {
    element = document.createElement('div');
    element.className = 'initial-class';
  });

  describe('hasClass', () => {
    it('should return true if class exists', () => {
      expect(DOM.hasClass(element, 'initial-class')).toBe(true);
    });

    it('should return false if class does not exist', () => {
      expect(DOM.hasClass(element, 'non-existent')).toBe(false);
    });
  });

  describe('addClass', () => {
    it('should add class to element', () => {
      DOM.addClass(element, 'new-class');
      expect(element.classList.contains('new-class')).toBe(true);
    });
  });

  describe('removeClass', () => {
    it('should remove class from element', () => {
      DOM.removeClass(element, 'initial-class');
      expect(element.classList.contains('initial-class')).toBe(false);
    });
  });

  describe('toggleClass', () => {
    it('should toggle class on element', () => {
      DOM.toggleClass(element, 'initial-class');
      expect(element.classList.contains('initial-class')).toBe(false);
      DOM.toggleClass(element, 'initial-class');
      expect(element.classList.contains('initial-class')).toBe(true);
    });
  });
});

describe('DOM Style Manipulation', () => {
  let element;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  describe('css', () => {
    it('should set single style property', () => {
      DOM.css(element, 'color', 'red');
      expect(element.style.color).toBe('red');
    });

    it('should set multiple style properties', () => {
      DOM.css(element, { color: 'blue', fontSize: '16px' });
      expect(element.style.color).toBe('blue');
      expect(element.style.fontSize).toBe('16px');
    });

    it('should get computed style property', () => {
      element.style.display = 'block';
      const display = DOM.css(element, 'display');
      expect(display).toBe('block');
    });
  });
});

describe('DOM Content Manipulation', () => {
  let element;

  beforeEach(() => {
    element = document.createElement('div');
  });

  describe('html', () => {
    it('should set innerHTML', () => {
      DOM.html(element, '<span>Content</span>');
      expect(element.innerHTML).toBe('<span>Content</span>');
    });

    it('should get innerHTML', () => {
      element.innerHTML = '<span>Content</span>';
      expect(DOM.html(element)).toBe('<span>Content</span>');
    });
  });

  describe('text', () => {
    it('should set textContent', () => {
      DOM.text(element, 'Plain text');
      expect(element.textContent).toBe('Plain text');
    });

    it('should get textContent', () => {
      element.textContent = 'Plain text';
      expect(DOM.text(element)).toBe('Plain text');
    });
  });

  describe('val', () => {
    it('should set input value', () => {
      const input = document.createElement('input');
      DOM.val(input, 'test value');
      expect(input.value).toBe('test value');
    });

    it('should get input value', () => {
      const input = document.createElement('input');
      input.value = 'test value';
      expect(DOM.val(input)).toBe('test value');
    });
  });
});

describe('DOM Attributes', () => {
  let element;

  beforeEach(() => {
    element = document.createElement('div');
  });

  describe('attr', () => {
    it('should set attribute', () => {
      DOM.attr(element, 'data-id', '123');
      expect(element.getAttribute('data-id')).toBe('123');
    });

    it('should get attribute', () => {
      element.setAttribute('data-id', '456');
      expect(DOM.attr(element, 'data-id')).toBe('456');
    });
  });

  describe('removeAttr', () => {
    it('should remove attribute', () => {
      element.setAttribute('data-remove', 'value');
      DOM.removeAttr(element, 'data-remove');
      expect(element.hasAttribute('data-remove')).toBe(false);
    });
  });

  describe('data', () => {
    it('should set data attribute', () => {
      DOM.data(element, 'custom', 'value');
      expect(element.getAttribute('data-custom')).toBe('value');
    });

    it('should get data attribute', () => {
      element.setAttribute('data-custom', 'value');
      expect(DOM.data(element, 'custom')).toBe('value');
    });
  });
});

describe('DOM Manipulation', () => {
  let parent;

  beforeEach(() => {
    parent = document.createElement('div');
    parent.innerHTML = '<span>Initial</span>';
  });

  describe('append', () => {
    it('should append element', () => {
      const child = document.createElement('p');
      DOM.append(parent, child);
      expect(parent.lastChild).toBe(child);
    });

    it('should append HTML string', () => {
      DOM.append(parent, '<p>Appended</p>');
      expect(parent.innerHTML).toContain('Appended');
    });
  });

  describe('prepend', () => {
    it('should prepend element', () => {
      const child = document.createElement('p');
      child.textContent = 'First';
      DOM.prepend(parent, child);
      expect(parent.firstChild).toBe(child);
    });

    it('should prepend HTML string', () => {
      DOM.prepend(parent, '<p>Prepended</p>');
      expect(parent.innerHTML.startsWith('<p>Prepended</p>')).toBe(true);
    });
  });

  describe('remove', () => {
    it('should remove element from DOM', () => {
      document.body.appendChild(parent);
      DOM.remove(parent);
      expect(document.body.contains(parent)).toBe(false);
    });
  });

  describe('clone', () => {
    it('should clone element', () => {
      const clone = DOM.clone(parent);
      expect(clone.innerHTML).toBe(parent.innerHTML);
      expect(clone).not.toBe(parent);
    });
  });
});

describe('DOM Visibility', () => {
  let element;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
  });

  afterEach(() => {
    if (element.parentNode) {
      document.body.removeChild(element);
    }
  });

  describe('show', () => {
    it('should show hidden element', () => {
      element.style.display = 'none';
      DOM.show(element);
      expect(element.style.display).toBe('');
    });
  });

  describe('hide', () => {
    it('should hide element', () => {
      DOM.hide(element);
      expect(element.style.display).toBe('none');
    });
  });

  describe('toggle', () => {
    it('should toggle visibility', () => {
      DOM.toggle(element);
      expect(element.style.display).toBe('none');
      DOM.toggle(element);
      expect(element.style.display).toBe('');
    });
  });
});

describe('DOM Ready', () => {
  it('should execute callback when DOM is ready', () => {
    const callback = vi.fn();
    // Document is already loaded in test environment
    DOM.ready(callback);
    expect(callback).toHaveBeenCalled();
  });
});

describe('DOM Position and Offset', () => {
  let element;

  beforeEach(() => {
    element = document.createElement('div');
    element.style.position = 'absolute';
    element.style.top = '100px';
    element.style.left = '50px';
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  describe('offset', () => {
    it('should return element offset', () => {
      const offset = DOM.offset(element);
      expect(offset).toHaveProperty('top');
      expect(offset).toHaveProperty('left');
    });
  });

  describe('position', () => {
    it('should return element position', () => {
      const position = DOM.position(element);
      expect(position).toHaveProperty('top');
      expect(position).toHaveProperty('left');
    });
  });
});

describe('DOM Scroll', () => {
  let element;

  beforeEach(() => {
    element = document.createElement('div');
    element.style.height = '100px';
    element.style.overflow = 'auto';
    element.innerHTML = '<div style="height: 500px;">Content</div>';
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  describe('scrollTop', () => {
    it('should set scroll position', () => {
      DOM.scrollTop(element, 50);
      expect(element.scrollTop).toBe(50);
    });

    it('should get scroll position', () => {
      element.scrollTop = 30;
      expect(DOM.scrollTop(element)).toBe(30);
    });
  });
});

describe('DOM Dimensions', () => {
  let element;

  beforeEach(() => {
    element = document.createElement('div');
    element.style.width = '200px';
    element.style.height = '100px';
    element.style.padding = '10px';
    element.style.margin = '5px';
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  describe('width', () => {
    it('should return element width (returns 0 in JSDOM)', () => {
      // JSDOM doesn't render elements, so offsetWidth is always 0
      // In a real browser, this would return the actual width
      const width = DOM.width(element);
      expect(typeof width).toBe('number');
      expect(width).toBeGreaterThanOrEqual(0);
    });
  });

  describe('height', () => {
    it('should return element height (returns 0 in JSDOM)', () => {
      // JSDOM doesn't render elements, so offsetHeight is always 0
      // In a real browser, this would return the actual height
      const height = DOM.height(element);
      expect(typeof height).toBe('number');
      expect(height).toBeGreaterThanOrEqual(0);
    });
  });
});
