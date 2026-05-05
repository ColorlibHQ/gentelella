# Gentelella v4 examples

Self-contained, runnable starting points for wiring the template to a real backend. Each example is a separate npm project — install once, run alongside the main template.

## What's here

| Directory | What it shows |
|---|---|
| [`express-sqlite/`](./express-sqlite) | Tiny Express + SQLite server with `GET /api/orders` and `GET /api/messages`. Demonstrates the data-adapter pattern: same frontend, swap seed → fetch with one URL flag (`?api=1`). |

More examples coming — Cloudflare Workers (edge), Supabase (auth + RLS), Hono on Bun. PRs welcome.

## How the data-adapter pattern works

Every interactive page in the template uses hardcoded seed data so it works offline as a static demo. Real apps fetch from an API. The shim that lets both modes coexist is [`src/v4/data-adapter.js`](../src/v4/data-adapter.js):

```js
import { useApiMode, seedAdapter, httpAdapter } from '/src/v4/data-adapter.js';

const adapter = useApiMode()
  ? httpAdapter('/api/orders', { listKey: 'orders' })
  : seedAdapter(SEED);

const items = await adapter.list();      // same call either way
await adapter.update(id, { status: 'paid' });
await adapter.create({ ... });
await adapter.remove(id);
```

`useApiMode()` flips on when the URL has `?api=1` or when you set `window.__GENTELELLA_API__ = true` before module load (do that in production builds where you always want the API).

Both adapters share the same surface (`list / get / create / update / remove`), so swapping between them never touches your render code.

See [`production/orders.html`](../production/orders.html) for a complete page that uses this pattern with loading + error + empty states wired in.

## Running an example end-to-end

Start the **backend** (one terminal):

```bash
cd examples/express-sqlite
npm install
npm start
# → API listening on http://localhost:8080
```

Start the **frontend** in dev mode (other terminal, from the project root):

```bash
npm run dev
# → http://localhost:9173
```

Vite proxies `/api/*` to `http://localhost:8080` automatically (configured in `vite.config.js`). Open the orders or inbox page with `?api=1` to use the backend:

- http://localhost:9173/production/orders.html?api=1
- http://localhost:9173/production/inbox.html?api=1

You'll see a quick loading flash, then real data from SQLite. Drop `?api=1` to flip back to the offline seed.

To kick the tires on the backend without the frontend:

```bash
curl http://localhost:8080/api/orders | jq
curl http://localhost:8080/api/messages?folder=inbox | jq
curl -X PATCH http://localhost:8080/api/orders/%237841 \
     -H 'Content-Type: application/json' \
     -d '{"status":"processing"}'
```

## Building your own integration

The fastest path to wiring the template to your stack:

1. **Pick one page** to migrate first — `orders.html` is the cleanest demo (the inline script does almost nothing).
2. **Replace the SEED array** with a `httpAdapter('/your/endpoint')` call.
3. **Keep the loading + error states** that the example already wires (skeleton rows + retry banner) — they work for any data source.
4. **Iterate page-by-page.** Pages that don't talk to the backend stay on `seedAdapter` for offline preview.

For pages with rich client-side state (inbox, kanban, calendar), the pattern is "fetch initial state from the API at init, mutate locally, optionally PATCH back". `inbox.js`'s `hydrateFromApi()` shows the fetch part; extending it to push mutations back is `await adapter.update(...)` inside each toggle/trash/send handler.
