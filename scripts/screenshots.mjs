// scripts/screenshots.mjs
//
// Capture hero screenshots of every key page in light + dark themes.
// Boots `vite preview` (or reuses one already running on PREVIEW_PORT) and
// uses Playwright to crawl + capture. Outputs to docs/screenshots/.
//
// Usage:
//   npm run build && npm run screenshots
//
// Optional env:
//   PREVIEW_URL  full origin to capture against (skips spawning the server)
//   THEMES       comma list — defaults to "light,dark"
//   PAGES        comma list of page slugs (matches keys below) — default: all

import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.resolve('docs/screenshots');
const VIEWPORT = { width: 1440, height: 900 };

// Pages to capture, ordered for the README/showcase reel.
const PAGES = [
  ['dashboard',    '/production/index.html'],
  ['analytics',    '/production/index2.html'],
  ['sales',        '/production/index3.html'],
  ['operations',   '/production/index4.html'],
  ['inbox',        '/production/inbox.html'],
  ['kanban',       '/production/kanban.html'],
  ['calendar',     '/production/calendar.html'],
  ['chat',         '/production/chat.html'],
  ['file-manager', '/production/file_manager.html'],
  ['charts',       '/production/chartjs.html'],
  ['echarts',      '/production/echarts.html'],
  ['tables',       '/production/tables.html'],
  ['form',         '/production/form.html'],
  ['playground',   '/production/playground.html'],
  ['theme',        '/production/theme.html'],
  ['icons',        '/production/icons.html'],
  ['typography',   '/production/typography.html'],
  ['profile',      '/production/profile.html'],
  ['settings',     '/production/settings.html'],
  ['invoice',      '/production/invoice.html'],
  ['login',        '/production/login.html'],
  ['landing',      '/production/landing.html']
];

function spawnPreview() {
  if (process.env.PREVIEW_URL) {return { url: process.env.PREVIEW_URL, kill: () => {} };}
  if (!existsSync('dist/production/index.html')) {
    console.error('No dist/ — run `npm run build` first.');
    process.exit(1);
  }
  const port = process.env.PREVIEW_PORT || '9174';
  console.log(`→ starting vite preview on :${port}`);
  const proc = spawn('npx', ['vite', 'preview', '--port', port, '--host'], {
    stdio: ['ignore', 'pipe', 'inherit'],
    env: { ...process.env, PREVIEW_PORT: port }
  });
  return new Promise((resolve, reject) => {
    let url = '';
    const onData = (chunk) => {
      const s = chunk.toString();
      const m = s.match(/Local:\s+(https?:\/\/[^\s]+)/);
      if (m) {
        url = m[1].replace(/\/$/, '');
        proc.stdout.off('data', onData);
        // Give it a beat to actually be ready.
        setTimeout(() => resolve({ url, kill: () => proc.kill() }), 400);
      }
    };
    proc.stdout.on('data', onData);
    proc.on('exit', (code) => { if (!url) {reject(new Error(`preview exited with code ${code}`));} });
  });
}

async function shoot(page, url, slug, theme) {
  await page.emulateMedia({ colorScheme: theme });
  await page.goto(url, { waitUntil: 'networkidle' });
  // Apply the saved-theme dance: the pre-paint script reads localStorage.
  await page.evaluate((t) => {
    try { localStorage.setItem('theme', t); } catch (_e) {}
    document.documentElement.setAttribute('data-theme', t);
  }, theme);
  // Wait for charts/animations to settle.
  await page.waitForTimeout(900);
  const file = path.join(OUT_DIR, theme, `${slug}.png`);
  await page.screenshot({ path: file, fullPage: false });
  return file;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(path.join(OUT_DIR, 'light'), { recursive: true });
  await mkdir(path.join(OUT_DIR, 'dark'), { recursive: true });

  const themes = (process.env.THEMES || 'light,dark').split(',').map((s) => s.trim());
  const filter = process.env.PAGES ? new Set(process.env.PAGES.split(',').map((s) => s.trim())) : null;
  const targets = filter ? PAGES.filter(([slug]) => filter.has(slug)) : PAGES;

  const { url: baseUrl, kill } = await spawnPreview();
  console.log(`→ capturing ${targets.length} pages × ${themes.length} themes against ${baseUrl}`);

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 2 });
  const page = await ctx.newPage();

  const manifest = [];
  for (const [slug, urlPath] of targets) {
    for (const theme of themes) {
      try {
        const file = await shoot(page, baseUrl + urlPath, slug, theme);
        console.log(`  ✓ ${slug} (${theme})`);
        manifest.push({ slug, theme, url: urlPath, file: path.relative(process.cwd(), file) });
      } catch (e) {
        console.log(`  ✗ ${slug} (${theme}) — ${e.message}`);
      }
    }
  }

  await writeFile(path.join(OUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));

  await browser.close();
  kill();
  console.log(`\n→ wrote ${manifest.length} screenshots to docs/screenshots/`);
}

main().catch((e) => { console.error(e); process.exit(1); });
