# Data adapter

Every interactive page in v4 ships with **seed data** — hardcoded arrays of demo content (messages, kanban cards, orders, etc.). Replacing seed data with a real API call is the most common first task for someone using this template as a starter. The data adapter pattern gives that task a name and a shape.

Implementation: [`src/v4/data-adapter.js`](../src/v4/data-adapter.js).

## The contract

Two adapters with the same surface:

```js
const adapter = useApiMode()
  ? httpAdapter('/api/messages')
  : seedAdapter(SEED);

// Both have the same methods:
const items = await adapter.list({ folder: 'inbox' });
const item  = await adapter.get(id);
const created = await adapter.create({ subject: 'Hi' });
const updated = await adapter.update(id, { unread: false });
const removed = await adapter.remove(id);
```

The shape:

```ts
interface Adapter<T> {
  list(query?: object): Promise<T[]>;
  get(id: string | number): Promise<T | null>;
  create(data: Partial<T>): Promise<T>;
  update(id: string | number, patch: Partial<T>): Promise<T | null>;
  remove(id: string | number): Promise<boolean | { ok: true }>;
}
```

Your page code calls `adapter.list()` / `.update()` etc. without knowing whether the data is in-memory or coming from a backend.

## Switching modes

`useApiMode()` returns true when either:

1. The URL has `?api=1` (handy for live demo toggling)
2. `window.__GENTELELLA_API__ = true` is set before the module loads (handy for production builds)

```js
import { useApiMode } from './v4/data-adapter.js';

if (useApiMode()) {
  // hit real backend
} else {
  // use seed
}
```

### Forcing API mode in production

In your build / template:

```html
<script>window.__GENTELELLA_API__ = true;</script>
<script type="module" src="/src/main-v4.js"></script>
```

Or set it conditionally based on hostname:

```html
<script>
  if (location.hostname !== 'localhost') {
    window.__GENTELELLA_API__ = true;
  }
</script>
```

## `seedAdapter` — in-memory

```js
import { seedAdapter } from './v4/data-adapter.js';

const SEED = [
  { id: 1, subject: 'Welcome', folder: 'inbox', unread: true },
  { id: 2, subject: 'Q3 review', folder: 'inbox', unread: false }
];

const adapter = seedAdapter(SEED, (item, query) => {
  if (query.folder) return item.folder === query.folder;
  return true;
});

await adapter.list();                  // → both items
await adapter.list({ folder: 'inbox' }); // → both (filter passes)
await adapter.update(1, { unread: false });
await adapter.list();                  // → item 1 is now unread:false
adapter.reset();                       // back to original seed
```

The optional second arg is a filter function `(item, query) => boolean` so the seed can mimic backend query params (folder, status, search).

Mutations are persistent for the page lifetime but not across reloads. `adapter.reset()` restores the original seed — useful for testing.

## `httpAdapter` — REST backend

```js
import { httpAdapter } from './v4/data-adapter.js';

const adapter = httpAdapter('/api/messages');

await adapter.list({ folder: 'inbox' });
// GET /api/messages?folder=inbox
// → response body parsed as JSON

await adapter.get(1);
// GET /api/messages/1

await adapter.create({ subject: 'Hi' });
// POST /api/messages with JSON body

await adapter.update(1, { unread: false });
// PATCH /api/messages/1 with JSON body

await adapter.remove(1);
// DELETE /api/messages/1
```

### Endpoints expected

| Method | Path | Body | Response |
| --- | --- | --- | --- |
| GET | `${baseUrl}` (with `?key=value`) | — | `Item[]` or `{ items: Item[] }` |
| GET | `${baseUrl}/:id` | — | `Item` |
| POST | `${baseUrl}` | `Partial<Item>` | `Item` (with assigned id) |
| PATCH | `${baseUrl}/:id` | `Partial<Item>` | `Item` or `{ ok: true }` |
| DELETE | `${baseUrl}/:id` | — | `{ ok: true }` |

### Wrapped responses

If your backend returns `{ messages: [...] }` instead of a bare array, pass `listKey`:

```js
const adapter = httpAdapter('/api/messages', { listKey: 'messages' });
const items = await adapter.list();   // extracts data.messages
```

### Custom fetch

To inject auth tokens or a custom fetch wrapper:

```js
const authedFetch = (url, opts = {}) => fetch(url, {
  ...opts,
  headers: { ...opts.headers, Authorization: `Bearer ${TOKEN}` }
});

const adapter = httpAdapter('/api/messages', { fetch: authedFetch });
```

The default uses the global `fetch`.

### Error handling

`httpAdapter` throws `HttpError` on non-2xx responses:

```js
import { HttpError } from './v4/data-adapter.js';

try {
  await adapter.update(id, patch);
} catch (e) {
  if (e instanceof HttpError && e.status === 404) {
    showToast('Item not found', { variant: 'error' });
  } else if (e instanceof HttpError && e.status >= 500) {
    showToast('Server error — try again', { variant: 'error' });
  } else {
    throw e;
  }
}
```

`HttpError` carries `status` (the response code) and `message` (the response body text or status text).

## Wiring up the inbox (real example)

The inbox already has the pattern wired. Look at [`src/v4/inbox.js`](../src/v4/inbox.js):

```js
import { useApiMode, seedAdapter, httpAdapter } from './data-adapter.js';

const SEED = [/* ... */];

const adapter = useApiMode()
  ? httpAdapter('/api/messages')
  : seedAdapter(SEED, filterByFolder);

async function loadFolder(folder) {
  const messages = await adapter.list({ folder });
  renderList(messages);
}

async function markRead(id) {
  await adapter.update(id, { unread: false });
  // optimistically update DOM
}
```

Append `?api=1` to [http://localhost:9173/production/inbox.html?api=1](http://localhost:9173/production/inbox.html?api=1) and the inbox tries to fetch from `/api/messages`. If you have an Express backend running on :8080, the dev server proxies `/api/*` to it (see [`vite.config.js`](../vite.config.js) `server.proxy`).

[`examples/express-sqlite/`](../examples/) ships a sample backend that satisfies the contract for messages.

## Wiring up your own page

1. **Define the SEED**:

   ```js
   const SEED = [
     { id: 1, name: 'Acme', status: 'active' },
     { id: 2, name: 'Beta', status: 'churned' }
   ];
   ```

2. **Get an adapter**:

   ```js
   const adapter = useApiMode() ? httpAdapter('/api/customers') : seedAdapter(SEED);
   ```

3. **Replace direct array access**:

   ```js
   // before
   const items = SEED.filter(c => c.status === 'active');

   // after
   const items = await adapter.list({ status: 'active' });
   ```

4. **Route mutations through the adapter**:

   ```js
   // before
   item.status = 'churned';
   render();

   // after
   await adapter.update(item.id, { status: 'churned' });
   render();
   ```

That's it. Append `?api=1` to test against a real backend.

## Pagination, cursors, sorting

The default adapter is intentionally minimal — just `list / get / create / update / remove`. For pagination, sorting, or aggregates, extend the adapter:

```js
function customersAdapter(baseUrl) {
  const base = httpAdapter(baseUrl);
  return {
    ...base,
    async listPage({ cursor, limit = 50 }) {
      const data = await fetch(`${baseUrl}?cursor=${cursor || ''}&limit=${limit}`).then(r => r.json());
      return { items: data.items, nextCursor: data.nextCursor };
    }
  };
}
```

Same pattern for any query API — REST, GraphQL (wrap the GraphQL client), or RPC.

## Optimistic UI

The adapter doesn't enforce a strategy, but for the inbox / kanban patterns:

```js
// optimistic
async function move(id, column) {
  const card = cards.find(c => c.id === id);
  card.column = column;
  render();

  try {
    await adapter.update(id, { column });
  } catch (e) {
    card.column = previousColumn;
    render();
    showToast('Move failed', { variant: 'error' });
  }
}
```

## Where to look

- [`src/v4/data-adapter.js`](../src/v4/data-adapter.js) — full implementation (~140 lines)
- [`src/v4/inbox.js`](../src/v4/inbox.js) — real usage in a page module
- [`examples/express-sqlite/`](../examples/) — sample backend
