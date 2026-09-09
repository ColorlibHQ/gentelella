// Gentelella 2026 v4 — host-supplied shell configuration.
//
// This design system runs in two very different places: as the static template,
// where the sidebar, the URLs and the notification data are all baked in at
// build time, and as the front end of a server-rendered app — Laravel, Django —
// where the server owns all three.
//
// Rather than hard-coding one and breaking the other, a host may drop a JSON
// island into the page:
//
//   <script type="application/json" id="gentelella-shell-config">
//     {"links": {"profile": "/profile", "logout": "/logout"},
//      "pages": [{"label": "Products", "section": "Catalogue", "href": "/admin/products"}],
//      "notifications": [...], "messages": [...]}
//   </script>
//
// Every key is optional, and the static template ships none of them — so with no
// island present the defaults are exactly what they always were.

let cache;

/**
 * The parsed host configuration, or an empty object.
 * Read once; malformed JSON is ignored rather than thrown, because a broken
 * island should cost you the palette's links, not the whole page.
 * @returns {Record<string, any>}
 */
export function shellConfig() {
  if (cache !== undefined) {return cache;}

  cache = {};
  const el = document.getElementById('gentelella-shell-config');

  if (el) {
    try {
      const parsed = JSON.parse(el.textContent || '{}');
      if (parsed && typeof parsed === 'object') {cache = parsed;}
    } catch { /* leave cache empty */ }
  }

  return cache;
}

/**
 * A named link from the host, falling back to the static template's own page.
 * @param {string} name
 * @param {string} fallback
 * @returns {string}
 */
export function shellLink(name, fallback) {
  const links = shellConfig().links;
  const value = links && links[name];

  return typeof value === 'string' && value ? value : fallback;
}

/** A host-supplied list, or null when the host did not provide one. */
export function shellList(name) {
  const value = shellConfig()[name];

  return Array.isArray(value) ? value : null;
}

/**
 * Sign out.
 *
 * A server-rendered host needs a POST — signing out on a GET is CSRF-able, and
 * frameworks refuse it for that reason — so when `links.logout` is present this
 * submits a form carrying the CSRF token from <meta name="csrf-token">. With no
 * such link it falls back to navigating, which is what the static demo wants.
 *
 * @param {string} fallback
 */
export function signOut(fallback) {
  const url = shellLink('logout', '');

  if (!url) {
    window.location.href = fallback;
    return;
  }

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = url;
  form.style.display = 'none';

  const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  if (token) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = '_token';
    input.value = token;
    form.appendChild(input);
  }

  document.body.appendChild(form);
  form.submit();
}
