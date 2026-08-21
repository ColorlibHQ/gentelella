// Syntax highlighting for the component playground's HTML snippets.
//
// Loaded ONLY by production/playground.html, via a dynamic import, so it lands
// in its own chunk and costs every other page nothing. Its colours live in that
// page's own <style> block for the same reason.
//
// Purpose-built rather than a library: the playground only ever shows HTML, and
// a general highlighter (Prism, highlight.js, Shiki) would mean a new production
// dependency and a far larger chunk for grammars this page never uses.
//
// The code blocks are `contenteditable` and drive a live preview from
// `textContent`, so highlighting must be invisible to the rest of the page:
// injecting <span> wrappers leaves `textContent` byte-identical, which keeps
// the preview, the Copy button, and Reset all working untouched.

const ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };
const esc = s => s.replace(/[&<>]/g, c => ENTITIES[c]);
const wrap = (cls, text) => `<span class="tok-${cls}">${esc(text)}</span>`;

// Attributes, bare attributes, whitespace, then any single leftover character.
const ATTR_RE =
  /([a-zA-Z_:][-\w:.]*)(\s*=\s*)("[^"]*"|'[^']*'|[^\s"'>]+)|([a-zA-Z_:][-\w:.]*)|(\s+)|([\s\S])/g;

function highlightTag(tag) {
  const name = /^<\/?([a-zA-Z][-\w:.]*)/.exec(tag);
  if (!name) {
    return esc(tag);
  }

  const openLen = name[0].length - name[1].length; // "<" or "</"
  let out = wrap('punct', tag.slice(0, openLen)) + wrap('tag', name[1]);

  ATTR_RE.lastIndex = 0;
  const rest = tag.slice(name[0].length);
  let m;
  while ((m = ATTR_RE.exec(rest)) !== null) {
    const [, attr, eq, value, bare, space, other] = m;
    if (attr) {
      out += wrap('attr', attr) + wrap('punct', eq) + wrap('value', value);
    } else if (bare) {
      out += wrap('attr', bare);
    } else if (space) {
      out += esc(space);
    } else {
      out += other === '>' || other === '/' ? wrap('punct', other) : esc(other);
    }
  }
  return out;
}

/** Turn an HTML source string into highlighted markup. */
export function highlightHtml(source) {
  let out = '';
  let i = 0;
  while (i < source.length) {
    if (source.startsWith('<!--', i)) {
      const end = source.indexOf('-->', i + 4);
      const stop = end === -1 ? source.length : end + 3;
      out += wrap('comment', source.slice(i, stop));
      i = stop;
    } else if (source[i] === '<') {
      const end = source.indexOf('>', i);
      const stop = end === -1 ? source.length : end + 1;
      out += highlightTag(source.slice(i, stop));
      i = stop;
    } else {
      const next = source.indexOf('<', i);
      const stop = next === -1 ? source.length : next;
      out += esc(source.slice(i, stop));
      i = stop;
    }
  }
  return out;
}

// --- caret preservation -----------------------------------------------------
// Repainting innerHTML destroys the selection, so record the caret as a plain
// text offset first and walk the new text nodes to put it back. Offsets are
// measured on text, which the repaint leaves identical.

function caretOffset(root) {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount) {
    return null;
  }
  const range = sel.getRangeAt(0);
  if (!root.contains(range.startContainer)) {
    return null;
  }
  const probe = range.cloneRange();
  probe.selectNodeContents(root);
  probe.setEnd(range.startContainer, range.startOffset);
  return probe.toString().length;
}

function restoreCaret(root, offset) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  let seen = 0;
  let node;
  while ((node = walker.nextNode()) !== null) {
    const len = node.nodeValue.length;
    if (seen + len >= offset) {
      range.setStart(node, Math.max(0, offset - seen));
      range.collapse(true);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      return;
    }
    seen += len;
  }
  range.selectNodeContents(root);
  range.collapse(false);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

/**
 * Repaint one block from its own textContent. Safe to call while the block has
 * focus — the caret is restored to the same text offset afterwards.
 */
export function paintBlock(el) {
  if (!el) {
    return;
  }
  const focused = document.activeElement === el;
  const offset = focused ? caretOffset(el) : null;
  el.innerHTML = highlightHtml(el.textContent);
  if (offset !== null) {
    restoreCaret(el, offset);
  }
}

/** Paint every matching block. Idempotent — repainting is a no-op visually. */
export function highlightAll(selector = '.pg-code') {
  document.querySelectorAll(selector).forEach(paintBlock);
}
