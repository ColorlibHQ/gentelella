# Express + SQLite — Gentelella v4 example backend

Tiny REST API serving the inbox and orders pages. ~150 lines of code, three deps (`express`, `cors`, `better-sqlite3`).

## Why this stack

- **Express** — the path-of-least-surprise Node web framework. Anyone who's touched Node knows how to read this.
- **SQLite via better-sqlite3** — synchronous, zero-config, single-file database. Perfect for examples and small apps. Swap for Postgres / Turso / Cloudflare D1 with ~30 lines of changes.
- **No ORM** — raw prepared statements so the SQL is visible and copy-pasteable. ORMs add learning curve that defeats the "this is a starting point" purpose.

## Run it

```bash
cd examples/express-sqlite
npm install
npm start                # listens on :8080
```

In another terminal, from the project root:

```bash
npm run dev              # frontend on :9173 (proxies /api/* to :8080)
```

Open one of the API-aware pages:

- http://localhost:9173/production/orders.html?api=1
- http://localhost:9173/production/inbox.html?api=1

The first time you start the server, [`seed.js`](./seed.js) populates the database with 20 orders and 10 messages so the pages look populated immediately.

## Endpoints

### Orders

```
GET    /api/orders                  ?status=paid&limit=50&offset=0
PATCH  /api/orders/:id              { status: "processing" }
DELETE /api/orders/:id
```

Response shape:
```json
{
  "orders": [{ "id": "#7841", "customer": "John Doe", "items": 3, "total": 245, "status": "paid", ... }],
  "total": 20,
  "limit": 50,
  "offset": 0
}
```

### Messages

```
GET    /api/messages                ?folder=inbox&q=design
PATCH  /api/messages/:id            { unread: 0 }  or  { starred: 1 }  or  { folder: "trash" }
POST   /api/messages                { folder: "sent", to: "...", subject: "...", body: "..." }
```

Response shape:
```json
{
  "messages": [{ "id": 12, "folder": "inbox", "fromName": "Sarah K.", "subject": "...", "body": "...", "unread": 1, ... }],
  "counts": [{ "folder": "inbox", "unread": 3, "total": 7 }, ...]
}
```

### Health

```
GET /api/health   →   { "ok": true, "orders": 20, "messages": 10, "uptime": 12.3 }
```

## File layout

```
examples/express-sqlite/
├── package.json     — 3 deps, 4 npm scripts
├── server.js        — Express app, route handlers
├── db.js            — SQLite connection + idempotent migrations
├── seed.js          — One-shot data load on first run
├── data.sqlite      — Created on first run (gitignored)
└── README.md        — this file
```

## Common ops

```bash
npm run dev          # auto-restart on edits (node --watch)
npm run reset        # delete data.sqlite + reseed (clean slate)
npm run seed         # add seed data to an existing db (no-op if rows exist)
```

To inspect the database:

```bash
sqlite3 data.sqlite
.tables               # orders, messages, migrations
.schema orders
SELECT id, customer, status FROM orders WHERE status='paid' LIMIT 5;
```

## Deploying for real

This file isn't a production server — it's a teaching example. For real deployment:

1. **Replace SQLite** with Postgres (`pg` driver), Turso (`@libsql/client`), or Cloudflare D1.
2. **Add auth.** Currently anyone hitting `/api/*` can mutate everything. Add a `req.user` middleware (JWT, session cookie, OAuth) and gate writes.
3. **Add input validation.** Swap the inline `if (!body.x) return 400` checks for `zod` or `valibot` schemas.
4. **Configure CORS for your domain** instead of `cors()` open-allow.
5. **Add rate limiting** (`express-rate-limit`) on POST/PATCH endpoints.
6. **Behind a reverse proxy** (nginx, Caddy, Cloudflare). Don't expose Express directly.
7. **Process manager** like systemd, PM2, or just a Docker container.

The template's data-adapter ([`src/v4/data-adapter.js`](../../src/v4/data-adapter.js)) doesn't care about any of these — it just wants a JSON endpoint. Stack swaps happen at the edges, not in the frontend.
