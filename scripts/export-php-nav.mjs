#!/usr/bin/env node
// Export NAV + ICONS to PHP for the Laravel edition (colorlibhq/gentelella-laravel).
//
// src/v4/shell-render.js is the single source of truth for the sidebar structure
// and the icon set. Hand-copying either into PHP guarantees silent drift, so the
// Laravel package consumes generated files instead:
//
//   resources/menu.php    <- NAV    (sidebar groups, items, submenus, badges)
//   resources/icons.php   <- ICONS  (28 inline SVG strings)
//
// Both are committed in the Laravel package. Re-run this after any NAV/ICONS edit.
//
// Usage:
//   node scripts/export-php-nav.mjs [options]
//   npm run export:php -- [options]
//
// Options:
//   --out <dir>   Laravel package root. Default: ../gentelella-laravel
//   --dry-run     Print the generated PHP to stdout; write nothing.
//   --help, -h    Show this help.
//
// href mapping: NAV hrefs are static-site paths ("form_advanced.html"). The
// generated menu carries `page` (the slug) rather than a URL, so the PHP side
// owns the routing policy — HrefFilter resolves `page` against the demo routes
// when demo mode is on, and a consumer app overrides with its own `route`/`url`.
//
// Exit codes: 0 success · 1 validation error.

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { NAV, ICONS } from '../src/v4/shell-render.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_OUT = resolve(ROOT, '..', 'gentelella-laravel');

const HELP = (extra) => {
  if (extra) {process.stderr.write(`error: ${extra}\n\n`);}
  process.stderr.write(
    'Usage: node scripts/export-php-nav.mjs [--out <dir>] [--dry-run]\n' +
    '       npm run export:php -- --dry-run\n\n' +
    'Writes <out>/resources/menu.php and <out>/resources/icons.php\n' +
    'from NAV and ICONS in src/v4/shell-render.js.\n'
  );
};

function parseArgs(argv) {
  const opts = { out: DEFAULT_OUT, dryRun: false, help: false };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--help' || a === '-h') {opts.help = true;}
    else if (a === '--dry-run') {opts.dryRun = true;}
    else if (a === '--out') {opts.out = resolve(argv[++i] ?? '');}
    else {return { error: `unknown argument: ${a}` };}
  }
  return opts;
}

// ── PHP emitters ──────────────────────────────────────────────────────────
// Single-quoted PHP strings: only \ and ' are special. The SVGs use double
// quotes throughout, but escape defensively so a future icon can't break the
// generated file.
const php = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
const pad = (n) => ' '.repeat(n);

// "form_advanced.html" -> "form_advanced". Anything without .html passes through
// untouched so an absolute URL in NAV survives as-is.
function hrefToPage(href) {
  return href.endsWith('.html') ? href.slice(0, -'.html'.length) : href;
}

function emitEntry(entry, indent) {
  const p = pad(indent);
  const lines = [`${p}[`];
  const kv = (k, v) => lines.push(`${p}    ${php(k)} => ${v},`);

  if (entry.key) {kv('key', php(entry.key));}
  kv('text', php(entry.text));
  if (entry.icon) {kv('icon', php(entry.icon));}
  if (entry.href) {kv('page', php(hrefToPage(entry.href)));}
  if (entry.badge) {
    kv('badge', `[${php('text')} => ${php(entry.badge.text)}, ${php('class')} => ${php(entry.badge.cls)}]`);
  }
  if (entry.children) {
    lines.push(`${p}    ${php('children')} => [`);
    for (const child of entry.children) {lines.push(emitEntry(child, indent + 8));}
    lines.push(`${p}    ],`);
  }
  lines.push(`${p}],`);
  return lines.join('\n');
}

function emitMenu() {
  const groups = NAV.map((group) => {
    const items = group.items.map((item) => emitEntry(item, 12)).join('\n');
    return [
      '    [',
      `        ${php('label')} => ${php(group.label)},`,
      `        ${php('items')} => [`,
      items,
      '        ],',
      '    ],'
    ].join('\n');
  }).join('\n');

  return `<?php

declare(strict_types=1);

/*
 * GENERATED FILE — DO NOT EDIT.
 *
 * Source: src/v4/shell-render.js (NAV) in ColorlibHQ/gentelella.
 * Regenerate: npm run export:php
 *
 * The default demo sidebar. Consumer apps set their own menu in
 * config/gentelella.php; this ships as the fallback so a fresh install has a
 * populated sidebar out of the box.
 */

return [
${groups}
];
`;
}

function emitIcons() {
  const entries = Object.entries(ICONS)
    .map(([name, svg]) => `    ${php(name)} => ${php(svg)},`)
    .join('\n');

  return `<?php

declare(strict_types=1);

/*
 * GENERATED FILE — DO NOT EDIT.
 *
 * Source: src/v4/shell-render.js (ICONS) in ColorlibHQ/gentelella.
 * Regenerate: npm run export:php
 *
 * Inline SVG sidebar icons, currentColor stroke. Keyed by the \`icon\` value
 * used in the menu. Rendered unescaped — these are package-controlled strings,
 * never user input.
 */

return [
${entries}
];
`;
}

// ── main ──────────────────────────────────────────────────────────────────
const opts = parseArgs(process.argv.slice(2));
if (opts.error) {HELP(opts.error); process.exit(1);}
if (opts.help) {HELP(); process.exit(0);}

const menu = emitMenu();
const icons = emitIcons();
const iconCount = Object.keys(ICONS).length;
const itemCount = NAV.reduce(
  (n, g) => n + g.items.reduce((m, i) => m + 1 + (i.children?.length ?? 0), 0),
  0
);

if (opts.dryRun) {
  process.stdout.write(`${'='.repeat(60)}\nresources/menu.php\n${'='.repeat(60)}\n${menu}`);
  process.stdout.write(`\n${'='.repeat(60)}\nresources/icons.php\n${'='.repeat(60)}\n${icons}`);
  process.stderr.write(`\ndry run — ${NAV.length} groups, ${itemCount} items, ${iconCount} icons\n`);
  process.exit(0);
}

if (!existsSync(opts.out)) {
  HELP(`output directory does not exist: ${opts.out}`);
  process.exit(1);
}

const dir = resolve(opts.out, 'resources');
mkdirSync(dir, { recursive: true });
writeFileSync(resolve(dir, 'menu.php'), menu);
writeFileSync(resolve(dir, 'icons.php'), icons);

process.stdout.write(
  `wrote ${NAV.length} groups / ${itemCount} items -> ${resolve(dir, 'menu.php')}\n` +
  `wrote ${iconCount} icons -> ${resolve(dir, 'icons.php')}\n`
);
