// Gentelella v4 — data-adapter pattern
//
// Every interactive page in the template has hardcoded seed data. Replacing
// that with a real API call is the most common first task for someone using
// this template as a starter. This module gives that task a name and a shape.
//
// Usage:
//   const adapter = useApiMode()
//     ? httpAdapter('/api/messages')
//     : seedAdapter(SEED);
//
//   // both have the same surface:
//   const items = await adapter.list({ folder: 'inbox' });
//   await adapter.update(id, { unread: 0 });
//   await adapter.create({ ... });
//   await adapter.remove(id);
//
// The flag can be flipped via `?api=1` URL param (handy for live demos that
// switch between "static preview" and "real backend") OR by setting
// `window.__GENTELELLA_API__ = true` before module load.

/**
 * Returns true when the page is in API mode. Two ways to opt in:
 *   ?api=1 in the URL (one-shot demo trigger)
 *   window.__GENTELELLA_API__ = true (set in a build script for prod)
 */
export function useApiMode() {
  if (typeof window === 'undefined') {return false;}
  if (window.__GENTELELLA_API__) {return true;}
  return new URLSearchParams(window.location.search).has('api');
}

/**
 * Adapter that returns hardcoded data — what every demo page uses by default.
 * Mirrors the shape of httpAdapter so swapping is one line.
 *
 * @param {Array} seed
 * @param {(item: object, query: object) => boolean} [filter]
 *   Optional filter to apply when `list({...})` is called.
 */
export function seedAdapter(seed, filter) {
  let store = seed.slice();
  let nextId = Math.max(0, ...store.map((x) => Number(x.id) || 0)) + 1;
  return {
    async list(query = {}) {
      return filter ? store.filter((x) => filter(x, query)) : store.slice();
    },
    async get(id) {
      return store.find((x) => String(x.id) === String(id)) || null;
    },
    async create(data) {
      const item = { id: nextId++, ...data };
      store.unshift(item);
      return item;
    },
    async update(id, patch) {
      const i = store.findIndex((x) => String(x.id) === String(id));
      if (i < 0) {return null;}
      store[i] = { ...store[i], ...patch };
      return store[i];
    },
    async remove(id) {
      const before = store.length;
      store = store.filter((x) => String(x.id) !== String(id));
      return store.length < before;
    },
    /** Reset to the original seed — useful for tests / demos. */
    reset() { store = seed.slice(); }
  };
}

/**
 * Adapter that talks to a JSON REST endpoint. Conventions:
 *   GET    `${baseUrl}` (with `?key=value` for query)        → { items, ... } or items[]
 *   GET    `${baseUrl}/:id`                                   → item
 *   POST   `${baseUrl}`        body: data                     → item
 *   PATCH  `${baseUrl}/:id`    body: patch                    → { ok: true } or item
 *   DELETE `${baseUrl}/:id`                                   → { ok: true }
 *
 * The list endpoint may return either a bare array or `{ <key>: [...] }`;
 * pass `listKey` to extract the array from the wrapped form.
 *
 * @param {string} baseUrl
 * @param {{ listKey?: string, fetch?: typeof fetch }} [opts]
 */
export function httpAdapter(baseUrl, opts = {}) {
  const f = opts.fetch || ((...a) => globalThis.fetch(...a));
  const listKey = opts.listKey;

  const json = async (res) => {
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new HttpError(res.status, body || res.statusText);
    }
    return res.json();
  };

  return {
    async list(query = {}) {
      const qs = new URLSearchParams(query).toString();
      const url = qs ? `${baseUrl}?${qs}` : baseUrl;
      const data = await json(await f(url));
      return listKey ? (data[listKey] ?? []) : data;
    },
    async get(id) {
      return json(await f(`${baseUrl}/${encodeURIComponent(id)}`));
    },
    async create(data) {
      return json(await f(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }));
    },
    async update(id, patch) {
      return json(await f(`${baseUrl}/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch)
      }));
    },
    async remove(id) {
      return json(await f(`${baseUrl}/${encodeURIComponent(id)}`, { method: 'DELETE' }));
    }
  };
}

/**
 * HTTP error with the response status code attached. Use in catch blocks to
 * differentiate "user typo" (400, 404) from "server down" (5xx, network).
 */
export class HttpError extends Error {
  constructor(status, message) {
    super(`HTTP ${status}: ${message}`);
    this.name = 'HttpError';
    this.status = status;
  }
}
