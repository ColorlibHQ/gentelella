// examples/express-sqlite/seed.js
//
// One-shot seed for fresh databases. Run via `npm run seed` or automatically
// the first time the server boots and finds an empty `orders` table.
//
// Data is intentionally a small slice — enough to make the dashboard / inbox /
// orders pages look populated. For more, expand the arrays.

import { db } from './db.js';

const ORDERS = [
  ['#7841', 'John Doe',       'JD', 'primary',  3, 245, 'paid',       'Visa •••• 4242'],
  ['#7840', 'Anna Smith',     'AS', 'azure',    1,  89, 'processing', 'Mastercard •••• 8841'],
  ['#7839', 'Robert Jones',   'RJ', 'purple',   5, 490, 'paid',       'PayPal'],
  ['#7838', 'Emily Wang',     'EW', 'yellow',   2, 125, 'pending',    'Stripe checkout'],
  ['#7837', 'Mark Kim',       'MK', 'red',      1,  67, 'cancelled',  'Visa •••• 1234'],
  ['#7836', 'Lina Park',      'LP', 'green',    4, 312, 'paid',       'Visa •••• 4242'],
  ['#7835', 'Diego Reyes',    'DR', 'blue',     2, 178, 'paid',       'Apple Pay'],
  ['#7834', 'Yuki Tanaka',    'YT', 'primary',  3, 234, 'processing', 'Mastercard •••• 7712'],
  ['#7833', 'Sarah Kowalski', 'SK', 'primary',  6, 549, 'paid',       'Stripe checkout'],
  ['#7832', 'Michael Reyes',  'MR', 'purple',   1,  45, 'pending',    'PayPal'],
  ['#7831', 'Tom Hardy',      'TH', 'purple',   2, 195, 'paid',       'Visa •••• 4242'],
  ['#7830', 'Anna Smith',     'AS', 'azure',    3, 220, 'paid',       'Mastercard •••• 8841'],
  ['#7829', 'John Doe',       'JD', 'primary',  1,  79, 'paid',       'Apple Pay'],
  ['#7828', 'Robert Jones',   'RJ', 'purple',   2, 168, 'cancelled',  'Visa •••• 5566'],
  ['#7827', 'Emily Wang',     'EW', 'yellow',   4, 388, 'paid',       'Stripe checkout'],
  ['#7826', 'Mark Kim',       'MK', 'red',      1, 112, 'paid',       'Google Pay'],
  ['#7825', 'Diego Reyes',    'DR', 'blue',     2, 156, 'processing', 'PayPal'],
  ['#7824', 'Lina Park',      'LP', 'green',    3, 247, 'paid',       'Visa •••• 4242'],
  ['#7823', 'Yuki Tanaka',    'YT', 'primary',  1,  58, 'paid',       'Apple Pay'],
  ['#7822', 'Sarah Kowalski', 'SK', 'primary',  2, 132, 'paid',       'Stripe checkout']
];

const MESSAGES = [
  ['inbox',  1, 'work',     'Sarah K.',  'sarah@design.co',     'Re: Q1 design review',     "I've added comments to the figma file…", "Hey,\n\nI've added comments to the figma file. The hero needs a tighter type scale.\n\nSarah"],
  ['inbox',  1, 'work',     'GitHub',    'noreply@github.com',  'PR #248 ready for review', 'feat(dashboard): wire chart tabs',     'Pull request #248 is ready for review.\n\n3 files changed, 47 additions, 12 deletions.'],
  ['inbox',  1, 'work',     'Stripe',    'invoicing@stripe.com', 'Your invoice is ready',    'Invoice #INV-04812 for $499.00',       "Invoice #INV-04812\nAmount: $499.00 USD\nDue: Apr 30, 2026"],
  ['inbox',  0, 'personal', 'Michael R.', 'mike@somewhere.io',  'Lunch tomorrow?',          'Hey, are you free for lunch?',         'Hey,\n\nAre you free for lunch tomorrow at the new place on 4th?\n\n— Mike'],
  ['inbox',  0, 'work',     'Emily W.',  'emily@design.co',     'Sprint retro notes',       "Posted the action items.",             "Posted retro notes — three action items."],
  ['inbox',  0, 'work',     'Linear',    'notifications@linear.app', 'You were assigned 3 issues', 'GEN-128, GEN-129, GEN-131',     'Three issues assigned to you.'],
  ['inbox',  0, null,       'Vercel',    'updates@vercel.com',  'Deployment succeeded',     'gentelella-v4.vercel.app · 28s',       'Production deployment succeeded.'],
  ['sent',   0, 'work',     'Me',        null,                  'Q1 design review',         'Sharing the figma link.',              "Hey Sarah,\n\nSharing the figma link.\n\n— A."],
  ['drafts', 0, null,       'Me',        null,                  'Re: landing copy',         'Two suggestions on the subhead…',      'Two suggestions on the subhead.'],
  ['trash',  0, 'promotions', 'AppSumo', 'deals@appsumo.com',   '90% off — today only',     'Today only — 90% off.',                'Today only — 90% off our top admin templates.']
];

// ── Insert ──────────────────────────────────────────────────────────────

const orderInsert = db.prepare(`
  INSERT INTO orders (id, customer, initials, avatar_color, items, total, status, payment, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '-' || ? || ' days'))
  ON CONFLICT(id) DO NOTHING
`);
const insertOrders = db.transaction(() => {
  ORDERS.forEach((row, i) => orderInsert.run(...row, Math.floor(i / 4)));
});

const msgInsert = db.prepare(`
  INSERT INTO messages (folder, unread, label, from_name, from_email, to_email, subject, preview, body, starred, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '-' || ? || ' hours'))
`);
const insertMessages = db.transaction(() => {
  MESSAGES.forEach(([folder, unread, label, from, fromEmail, subject, preview, body], i) => {
    const toEmail = folder === 'sent' || folder === 'drafts' ? 'recipient@example.com' : null;
    const starred = i === 0 || i === 4 ? 1 : 0;
    msgInsert.run(folder, unread, label, from, fromEmail, toEmail, subject, preview, body, starred, i);
  });
});

const ordersBefore = db.prepare('SELECT COUNT(*) AS n FROM orders').get().n;
const messagesBefore = db.prepare('SELECT COUNT(*) AS n FROM messages').get().n;

if (ordersBefore === 0) {
  insertOrders();
  console.log(`✓ seeded ${ORDERS.length} orders`);
}
if (messagesBefore === 0) {
  insertMessages();
  console.log(`✓ seeded ${MESSAGES.length} messages`);
}
if (ordersBefore && messagesBefore) {
  console.log('ℹ database already seeded — run `npm run reset` to start fresh');
}
