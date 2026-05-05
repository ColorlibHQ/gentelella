// examples/express-sqlite/db.js
//
// Single SQLite connection + schema migrations. Idempotent — safe to require
// multiple times. better-sqlite3 is synchronous (no callbacks) which keeps
// example code readable; for a real prod app you'd reach for postgres or
// libSQL instead.

import Database from 'better-sqlite3';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
export const db = new Database(resolve(here, 'data.sqlite'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ── Schema ────────────────────────────────────────────────────────────────
// Each migration runs at most once (the migrations table is the source of
// truth). Add a new entry below; never edit existing ones.

const MIGRATIONS = [
  {
    name: '001-orders-and-messages',
    sql: `
      CREATE TABLE IF NOT EXISTS orders (
        id          TEXT PRIMARY KEY,
        customer    TEXT NOT NULL,
        initials    TEXT NOT NULL,
        avatar_color TEXT NOT NULL,
        items       INTEGER NOT NULL,
        total       INTEGER NOT NULL,
        status      TEXT NOT NULL CHECK (status IN ('paid','processing','pending','cancelled')),
        payment     TEXT NOT NULL,
        created_at  TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS messages (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        folder      TEXT NOT NULL CHECK (folder IN ('inbox','sent','drafts','trash')),
        starred     INTEGER NOT NULL DEFAULT 0,
        unread      INTEGER NOT NULL DEFAULT 1,
        label       TEXT,
        from_name   TEXT NOT NULL,
        from_email  TEXT,
        to_email    TEXT,
        subject     TEXT NOT NULL,
        preview     TEXT,
        body        TEXT NOT NULL,
        created_at  TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
      CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_messages_folder ON messages(folder);
      CREATE INDEX IF NOT EXISTS idx_messages_unread ON messages(unread);
    `
  }
];

db.exec(`CREATE TABLE IF NOT EXISTS migrations (name TEXT PRIMARY KEY, applied_at TEXT NOT NULL DEFAULT (datetime('now')))`);

const applied = new Set(db.prepare('SELECT name FROM migrations').all().map((r) => r.name));
const insertMigration = db.prepare('INSERT INTO migrations (name) VALUES (?)');

for (const m of MIGRATIONS) {
  if (applied.has(m.name)) continue;
  db.transaction(() => {
    db.exec(m.sql);
    insertMigration.run(m.name);
  })();
  console.log(`✓ migration ${m.name}`);
}
