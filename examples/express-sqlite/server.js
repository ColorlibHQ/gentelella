// examples/express-sqlite/server.js
//
// Tiny Express app demonstrating how the Gentelella v4 frontend pages can
// fetch real data instead of hardcoded seed arrays. Endpoints intentionally
// match what `src/v4/inbox.js` and `production/orders.html` would expect if
// you flipped them from seed mode to API mode.
//
// Run:  npm install && npm run seed && npm start
// Dev:  npm install && npm run seed && npm run dev    (auto-restart on edits)
//
// Then open the frontend with `?api=1` to use this backend, e.g.:
//   http://localhost:9173/production/orders.html?api=1
//   http://localhost:9173/production/inbox.html?api=1
//
// In `npm run dev` (Vite), /api/* is proxied to this server. In `npm run
// preview` or production, you'd need a reverse proxy / CORS — CORS is
// enabled below for ad-hoc cross-origin testing.

import express from 'express';
import cors from 'cors';
import { db } from './db.js';

// On boot, run seed if the DB is empty (skipped silently otherwise).
import './seed.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: '256kb' }));

// Tiny logger so dev sees requests in the terminal.
app.use((req, _res, next) => {
  const t = new Date().toISOString().slice(11, 19);
  process.stdout.write(`${t}  ${req.method} ${req.url}\n`);
  next();
});

// ── /api/orders ───────────────────────────────────────────────────────────

// GET /api/orders?status=paid&limit=20&offset=0
app.get('/api/orders', (req, res) => {
  const { status } = req.query;
  const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);
  const offset = parseInt(req.query.offset, 10) || 0;

  const where = [];
  const params = {};
  if (status) { where.push('status = @status'); params.status = status; }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const rows = db.prepare(`
    SELECT id, customer, initials, avatar_color AS avatarColor,
           items, total, status, payment, created_at AS createdAt
    FROM orders
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT @limit OFFSET @offset
  `).all({ ...params, limit, offset });

  const total = db.prepare(`SELECT COUNT(*) AS n FROM orders ${whereClause}`).get(params).n;
  res.json({ orders: rows, total, limit, offset });
});

// PATCH /api/orders/:id   { status: 'paid' }
app.patch('/api/orders/:id', (req, res) => {
  const { status } = req.body;
  if (!['paid', 'processing', 'pending', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'invalid status' });
  }
  const result = db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);
  if (!result.changes) return res.status(404).json({ error: 'not found' });
  res.json({ ok: true });
});

// DELETE /api/orders/:id
app.delete('/api/orders/:id', (req, res) => {
  const result = db.prepare('DELETE FROM orders WHERE id = ?').run(req.params.id);
  if (!result.changes) return res.status(404).json({ error: 'not found' });
  res.json({ ok: true });
});

// ── /api/messages ─────────────────────────────────────────────────────────

// GET /api/messages?folder=inbox&q=design
app.get('/api/messages', (req, res) => {
  const folder = req.query.folder || 'inbox';
  const q = req.query.q;

  const where = [];
  const params = { folder };
  if (folder === 'starred') {
    where.push('starred = 1');
  } else if (folder === 'trash') {
    where.push("folder = 'trash'");
  } else {
    where.push('folder = @folder AND folder != \'trash\'');
  }
  if (q) {
    where.push('(subject LIKE @q OR body LIKE @q OR from_name LIKE @q)');
    params.q = `%${q}%`;
  }

  const rows = db.prepare(`
    SELECT id, folder, starred, unread, label,
           from_name AS fromName, from_email AS fromEmail,
           to_email AS toEmail, subject, preview, body,
           created_at AS createdAt
    FROM messages
    WHERE ${where.join(' AND ')}
    ORDER BY created_at DESC
  `).all(params);

  const counts = db.prepare(`
    SELECT folder, SUM(unread) AS unread, COUNT(*) AS total
    FROM messages
    WHERE folder != 'trash'
    GROUP BY folder
  `).all();

  res.json({ messages: rows, counts });
});

// PATCH /api/messages/:id   { unread?: 0|1, starred?: 0|1, folder?: 'trash' }
app.patch('/api/messages/:id', (req, res) => {
  const fields = [];
  const params = [];
  for (const key of ['unread', 'starred', 'folder']) {
    if (key in req.body) {
      fields.push(`${key === 'folder' ? 'folder' : key} = ?`);
      params.push(req.body[key]);
    }
  }
  if (!fields.length) return res.status(400).json({ error: 'nothing to update' });
  params.push(req.params.id);
  const result = db.prepare(`UPDATE messages SET ${fields.join(', ')} WHERE id = ?`).run(...params);
  if (!result.changes) return res.status(404).json({ error: 'not found' });
  res.json({ ok: true });
});

// POST /api/messages   { folder, to, subject, body }
app.post('/api/messages', (req, res) => {
  const { folder = 'sent', to, subject, body } = req.body;
  if (!['sent', 'drafts'].includes(folder)) {
    return res.status(400).json({ error: 'folder must be sent or drafts' });
  }
  if (!to && folder === 'sent') return res.status(400).json({ error: 'to is required for sent' });
  const preview = (body || '').split('\n')[0].slice(0, 140);
  const info = db.prepare(`
    INSERT INTO messages (folder, unread, label, from_name, from_email, to_email, subject, preview, body)
    VALUES (?, 0, NULL, 'Me', NULL, ?, ?, ?, ?)
  `).run(folder, to || '', subject || '(no subject)', preview, body || '');
  res.status(201).json({ id: info.lastInsertRowid });
});

// ── Health ────────────────────────────────────────────────────────────────

app.get('/api/health', (_req, res) => {
  const orders = db.prepare('SELECT COUNT(*) AS n FROM orders').get().n;
  const messages = db.prepare('SELECT COUNT(*) AS n FROM messages').get().n;
  res.json({ ok: true, orders, messages, uptime: process.uptime() });
});

// 404 — JSON, never HTML.
app.use((req, res) => res.status(404).json({ error: 'not found', path: req.path }));

app.listen(PORT, () => {
  console.log(`\n→ Gentelella example API running on http://localhost:${PORT}`);
  console.log(`  endpoints: GET /api/orders   POST /api/messages   GET /api/health\n`);
  console.log(`  point your frontend at it:`);
  console.log(`    http://localhost:9173/production/orders.html?api=1`);
  console.log(`    http://localhost:9173/production/inbox.html?api=1\n`);
});
