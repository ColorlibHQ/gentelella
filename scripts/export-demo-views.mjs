#!/usr/bin/env node
// Convert the static pages in production/ into Blade demo views for the
// Laravel edition (colorlibhq/gentelella-laravel).
//
// Each page becomes resources/views/demo/<slug>.blade.php, extending the shell
// layout (or the blank layout for pages without data-shell="admin"), plus a
// manifest at resources/demo-pages.php that the package turns into routes.
//
// Usage:
//   node scripts/export-demo-views.mjs [options]
//   npm run export:demo -- [options]
//
// Options:
//   --out <dir>   Laravel package root. Default: ../gentelella-laravel
//   --dry-run     Report what would be written; write nothing.
//   --help, -h    Show this help.
//
// The page body is emitted inside a verbatim block. These pages are static
// markup, so nothing in them needs compiling — and without it Blade would eat
// the literal "@use" on the landing page and the "@media" rules inside the two
// pages that carry a <style> block. There is nothing to lose: no page contains
// "{{", and the only image reference is the favicon in <head>, which the layout
// owns.
//
// The generated header comment must never spell that directive out. Blade pulls
// verbatim blocks out of the source before it strips {{-- --}} comments, so a
// mention inside the comment opens a real block that swallows the @extends and
// every @section below it.
//
// Exit codes: 0 success · 1 validation error.

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PAGES = resolve(ROOT, 'production');
const DEFAULT_OUT = resolve(ROOT, '..', 'gentelella-laravel');

// Pages the Laravel package owns by hand, because a real CRUD panel backs them
// rather than static markup. Regenerating one would overwrite that work. Every
// other page is generated, so the sidebar never points at a route that is not
// there.
const CRUD_OWNED = new Set(['tables']);

const HELP = (extra) => {
  if (extra) {process.stderr.write(`error: ${extra}\n\n`);}
  process.stderr.write(
    'Usage: node scripts/export-demo-views.mjs [--out <dir>] [--dry-run]\n\n' +
    'Writes <out>/resources/views/demo/*.blade.php and <out>/resources/demo-pages.php\n' +
    'from the static pages in production/.\n'
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

const bladeString = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
const phpString = bladeString;

/** Pull the shell attributes off the <body> tag, quote-aware. */
function bodyAttrs(html) {
  const tag = /<body\b((?:"[^"]*"|'[^']*'|[^>"'])*)>/i.exec(html);
  if (!tag) {return null;}
  const attrs = tag[1];
  const read = (name) => {
    const m = new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`).exec(attrs);
    return m ? m[1] : '';
  };
  return { shell: read('data-shell'), page: read('data-page'), breadcrumb: read('data-breadcrumb') };
}

/**
 * Split a page into the part that belongs in @section('content') and the part
 * that belongs after it.
 *
 * For a shell page the content is the inside of .page-wrapper — the layout
 * supplies <main> and the wrapper itself — and `trailing` is whatever sits
 * between </main> and </body>. That tail is not decoration: 25 of the 58 pages
 * put their page-specific <script> there, and two put a <style> block there
 * too. Dropping it renders a page that looks right and does nothing.
 *
 * A bare page has no <main>, so its whole body is the content and there is no
 * tail to separate.
 */
function extractContent(html, isShell) {
  if (!isShell) {
    const body = /<body[^>]*>([\s\S]*)<\/body>/i.exec(html);
    return { content: body ? body[1].trim() : '', trailing: '' };
  }

  const main = /<main[^>]*class=["']main["'][^>]*>([\s\S]*)<\/main>/i.exec(html);
  if (!main) {return { content: '', trailing: '' };}

  let inner = main[1];
  const open = '<div class="page-wrapper">';
  const start = inner.indexOf(open);

  if (start !== -1) {
    inner = inner.slice(start + open.length);
    const close = inner.lastIndexOf('</div>');
    if (close !== -1) {inner = inner.slice(0, close);}
  }

  const after = html.slice(html.lastIndexOf('</main>') + '</main>'.length);
  const body = /^([\s\S]*?)<\/body>/i.exec(after);

  return { content: inner.trim(), trailing: body ? body[1].trim() : '' };
}

function titleOf(html, slug) {
  const m = /<title>([^<]*)<\/title>/i.exec(html);
  if (!m) {return slug;}
  // "Dashboard | Gentelella 2026 v4" -> "Dashboard"
  return m[1].split('|')[0].trim();
}

function render({ slug, title, attrs, content, trailing }) {
  const isShell = attrs.shell === 'admin';
  const layout = isShell ? 'gentelella::page' : 'gentelella::layouts.blank';

  const sections = [`@section('title', ${bladeString(title)})`];
  if (isShell) {
    sections.push(`@section('page_key', ${bladeString(attrs.page || slug)})`);
    if (attrs.breadcrumb) {
      sections.push(`@section('breadcrumb', ${bladeString(attrs.breadcrumb)})`);
    }
  }

  return `{{--
    GENERATED FILE — DO NOT EDIT.

    Source: production/${slug}.html in ColorlibHQ/gentelella.
    Regenerate: npm run export:demo

    Static markup: the body sits in a verbatim block and compiles to itself.
--}}
@extends('${layout}')

${sections.join('\n')}

@section('content')
@verbatim
${content}
@endverbatim
@endsection
${trailing ? `
@push('scripts')
@verbatim
${trailing}
@endverbatim
@endpush
` : ''}`;
}

const opts = parseArgs(process.argv.slice(2));
if (opts.error) {HELP(opts.error); process.exit(1);}
if (opts.help) {HELP(); process.exit(0);}

if (!existsSync(PAGES)) {HELP(`no production/ directory at ${PAGES}`); process.exit(1);}

const files = readdirSync(PAGES).filter((f) => f.endsWith('.html')).sort();
const written = [];
const skipped = [];
const manifest = [];

for (const file of files) {
  const slug = basename(file, '.html');
  const html = readFileSync(resolve(PAGES, file), 'utf8');
  const attrs = bodyAttrs(html);

  if (!attrs) {skipped.push(`${slug} (no <body>)`); continue;}

  const isShell = attrs.shell === 'admin';
  const { content, trailing } = extractContent(html, isShell);

  if (!content) {skipped.push(`${slug} (no content found)`); continue;}

  const title = titleOf(html, slug);
  manifest.push({ slug, title, shell: isShell, crud: CRUD_OWNED.has(slug), scripts: trailing !== '' });

  if (CRUD_OWNED.has(slug)) {skipped.push(`${slug} (CRUD-backed, package-owned)`); continue;}

  written.push({ slug, body: render({ slug, title, attrs, content, trailing }) });
}

const manifestPhp = `<?php

declare(strict_types=1);

/*
 * GENERATED FILE — DO NOT EDIT.
 *
 * Source: production/*.html in ColorlibHQ/gentelella.
 * Regenerate: npm run export:demo
 *
 * The demo page index. \`crud\` marks a page whose view the package writes by
 * hand because a real CRUD panel backs it; the route for those points at a
 * controller rather than a static view.
 */

return [
${manifest.map((p) => `    ${phpString(p.slug)} => ['title' => ${phpString(p.title)}, 'shell' => ${p.shell ? 'true' : 'false'}, 'crud' => ${p.crud ? 'true' : 'false'}, 'scripts' => ${p.scripts ? 'true' : 'false'}],`).join('\n')}
];
`;

if (opts.dryRun) {
  process.stderr.write(`would write ${written.length} views + manifest (${manifest.length} pages)\n`);
  for (const s of skipped) {process.stderr.write(`  skipped: ${s}\n`);}
  process.exit(0);
}

if (!existsSync(opts.out)) {HELP(`output directory does not exist: ${opts.out}`); process.exit(1);}

const viewDir = resolve(opts.out, 'resources', 'views', 'demo');
mkdirSync(viewDir, { recursive: true });
for (const { slug, body } of written) {
  writeFileSync(resolve(viewDir, `${slug}.blade.php`), body);
}
writeFileSync(resolve(opts.out, 'resources', 'demo-pages.php'), manifestPhp);

const withScripts = manifest.filter((p) => p.scripts).length;

process.stdout.write(
  `wrote ${written.length} demo views (${withScripts} carry page scripts) -> ${viewDir}\n` +
  `wrote ${manifest.length}-page manifest -> ${resolve(opts.out, 'resources', 'demo-pages.php')}\n`
);
for (const s of skipped) {process.stdout.write(`  skipped ${s}\n`);}
