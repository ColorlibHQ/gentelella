#!/usr/bin/env node
// Scaffold a new Gentelella page.
//
// Usage:
//   node scripts/new-page.mjs <slug> [options]
//   npm run new -- <slug> [options]
//
// Args:
//   <slug>             URL-safe page key (becomes <slug>.html). Required.
//                      Pattern: /^[a-z][a-z0-9_-]*$/ — no path traversal, no spaces.
//
// Options:
//   --title <text>     Page title. Defaults to title-cased slug.
//   --pretitle <text>  Section label above the title. Optional.
//   --breadcrumb <text>  Full breadcrumb. Defaults to "Home > <Title>".
//   --nav-group <name>   Add to a NAV group (e.g. "Apps", "Admin"). Case-insensitive.
//   --icon <name>      Sidebar icon. Default: "pages". See ICONS in shell-render.js.
//   --force            Overwrite if production/<slug>.html exists.
//   --dry-run          Print what would happen; don't write.
//   --help, -h         Show this help.
//
// Examples:
//   node scripts/new-page.mjs reports --title "Reports" --nav-group "Admin"
//   node scripts/new-page.mjs user-roles --title "User roles" --pretitle "Admin" \
//     --breadcrumb "Home > Admin > Roles" --nav-group "Admin" --icon profile
//
// The page is auto-discovered by Vite's `discoverEntries()` — no config update needed.
//
// Exit codes: 0 success · 1 validation error · 2 file exists (use --force) · 3 NAV group not found.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SLUG_RE = /^[a-z][a-z0-9_-]*$/;

const HELP = (extra) => {
  if (extra) {process.stderr.write(`error: ${extra}\n\n`);}
  process.stderr.write(readFileSync(fileURLToPath(import.meta.url), 'utf8')
    .split('\n')
    .filter((l) => l.startsWith('//'))
    .map((l) => l.slice(3))
    .slice(0, 30) // header comment block
    .join('\n') + '\n');
};

function parseArgs(argv) {
  const opts = { force: false, dryRun: false, help: false };
  const positional = [];
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--help' || a === '-h') {opts.help = true;}
    else if (a === '--force') {opts.force = true;}
    else if (a === '--dry-run') {opts.dryRun = true;}
    else if (a === '--title')      {opts.title      = argv[++i];}
    else if (a === '--pretitle')   {opts.pretitle   = argv[++i];}
    else if (a === '--breadcrumb') {opts.breadcrumb = argv[++i];}
    else if (a === '--nav-group')  {opts.navGroup   = argv[++i];}
    else if (a === '--icon')       {opts.icon       = argv[++i];}
    else if (a.startsWith('-')) {
      throw new Error(`unknown flag: ${a}`);
    } else {
      positional.push(a);
    }
  }
  opts.slug = positional[0];
  return opts;
}

function titleCase(slug) {
  return slug
    .split(/[-_]/)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function escapeSingleQuotes(s) {
  return String(s).replace(/'/g, "\\'");
}

function pageHtml({ slug, title, pretitle, breadcrumb }) {
  const t = escapeHtml(title);
  const pre = pretitle
    ? `\n        <div class="page-pretitle">${escapeHtml(pretitle)}</div>`
    : '';
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${t} | Gentelella 2026 v4</title>
<link rel="icon" href="../images/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<script type="module" src="/src/main-v4.js"></script>
</head>
<body data-shell="admin" data-page="${escapeHtml(slug)}" data-breadcrumb="${escapeHtml(breadcrumb)}">

<main class="main">
<div class="page-wrapper">

  <div class="page-header">
    <div class="page-header-row">
      <div>${pre}
        <h1 class="page-title">${t}</h1>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-body" style="padding:40px;text-align:center;color:var(--text-muted)">
      <div style="font-size:14px;margin-bottom:6px;color:var(--text)">${t} page</div>
      <div style="font-size:12.5px">Drop your content here. See the <a href="playground.html">playground</a> for components.</div>
    </div>
  </div>

</div>
</main>

</body>
</html>
`;
}

function insertNavLeaf(navSrc, groupName, leaf) {
  // Find the group by label (case-insensitive). Then find its `items: [` and
  // insert the new leaf right before the matching closing `]`. Match the
  // surrounding style: comma after the previous last item, no trailing comma
  // on the inserted entry (the project's lint config disallows trailing commas).
  const groupRe = new RegExp(`label:\\s*['"\`]${groupName}['"\`]\\s*,\\s*\\n\\s*items:\\s*\\[`, 'i');
  const m = navSrc.match(groupRe);
  if (!m) {return null;}

  // Walk from the `[` to find its matching `]`, skipping nested brackets and
  // string literals so commas in strings don't mislead us.
  const start = m.index + m[0].length;
  let depth = 1;
  let i = start;
  let inStr = null;
  while (i < navSrc.length && depth > 0) {
    const c = navSrc[i];
    if (inStr) {
      if (c === '\\') {i += 2; continue;}
      if (c === inStr) {inStr = null;}
    } else {
      if (c === "'" || c === '"' || c === '`') {inStr = c;}
      else if (c === '[' || c === '{') {depth += 1;}
      else if (c === ']' || c === '}') {
        depth -= 1;
        if (depth === 0 && c === ']') {break;}
      }
    }
    i += 1;
  }
  if (depth !== 0) {return null;}

  // i points at the closing `]`. Find the last non-whitespace char before it —
  // that's where the previous last item ends.
  let endOfLastItem = i - 1;
  while (endOfLastItem > start && /\s/.test(navSrc[endOfLastItem])) {endOfLastItem -= 1;}

  // The line containing `]` tells us its indentation, so we can match.
  const closingLineStart = navSrc.lastIndexOf('\n', i) + 1;
  const closingIndent = navSrc.slice(closingLineStart, i).match(/^[ \t]*/)[0];
  const itemIndent = closingIndent + '  ';

  // Insert: ensure comma after the previous last item (if it doesn't already
  // end in a comma), then a newline, indent, the new leaf with no trailing
  // comma, a newline, the original closing-bracket indent.
  const lastChar = navSrc[endOfLastItem];
  const beforeInsert = navSrc.slice(0, endOfLastItem + 1) + (lastChar === ',' ? '' : ',');
  const insertion = `\n${itemIndent}${leaf}\n${closingIndent}`;
  return beforeInsert + insertion + navSrc.slice(i);
}

function leafLine({ slug, title, icon }) {
  const k = escapeSingleQuotes(slug);
  const t = escapeSingleQuotes(title);
  return `{ key: '${k}', href: '${slug}.html', text: '${t}', icon: '${icon}' }`;
}

function main() {
  let opts;
  try {
    opts = parseArgs(process.argv.slice(2));
  } catch (e) {
    HELP(e.message);
    process.exit(1);
  }
  if (opts.help || !opts.slug) {
    HELP(opts.help ? null : 'missing required <slug> argument');
    process.exit(opts.help ? 0 : 1);
  }
  if (!SLUG_RE.test(opts.slug)) {
    HELP(`invalid slug "${opts.slug}" — must match /^[a-z][a-z0-9_-]*$/`);
    process.exit(1);
  }

  const title = opts.title ?? titleCase(opts.slug);
  const breadcrumb = opts.breadcrumb ?? `Home > ${title}`;
  const icon = opts.icon ?? 'pages';

  const htmlPath = resolve(ROOT, 'production', `${opts.slug}.html`);
  if (existsSync(htmlPath) && !opts.force) {
    process.stderr.write(`error: ${htmlPath} already exists. Use --force to overwrite.\n`);
    process.exit(2);
  }

  const html = pageHtml({ slug: opts.slug, title, pretitle: opts.pretitle, breadcrumb });

  // NAV update (optional)
  let navUpdate = null;
  if (opts.navGroup) {
    const navPath = resolve(ROOT, 'src/v4/shell-render.js');
    const navSrc = readFileSync(navPath, 'utf8');
    const leaf = leafLine({ slug: opts.slug, title, icon });
    const updated = insertNavLeaf(navSrc, opts.navGroup, leaf);
    if (!updated) {
      process.stderr.write(`error: nav group "${opts.navGroup}" not found in shell-render.js\n`);
      process.exit(3);
    }
    navUpdate = { path: navPath, content: updated };
  }

  if (opts.dryRun) {
    process.stdout.write(`[dry-run] would write ${htmlPath}\n`);
    process.stdout.write(`[dry-run] HTML preview (first 5 lines):\n`);
    process.stdout.write(html.split('\n').slice(0, 5).map((l) => `    ${l}`).join('\n') + '\n');
    if (navUpdate) {
      process.stdout.write(`[dry-run] would update ${navUpdate.path} (group "${opts.navGroup}")\n`);
    }
    return;
  }

  writeFileSync(htmlPath, html);
  process.stdout.write(`created ${basename(htmlPath)}\n`);
  if (navUpdate) {
    writeFileSync(navUpdate.path, navUpdate.content);
    process.stdout.write(`updated NAV group "${opts.navGroup}" in shell-render.js\n`);
  }
  process.stdout.write(`\nNext: npm run dev — your page is auto-discovered at /production/${opts.slug}.html\n`);
}

main();
