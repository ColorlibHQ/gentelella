// scripts/smoke.mjs
//
// Visit every entry HTML in dist/ via vite preview, asserting:
//   • the page returns 2xx
//   • no console.error
//   • no unhandled promise rejection
//   • no failed network requests for same-origin resources
//
// Run after `npm run build`. Exits non-zero on any failure for CI.
//
// Usage:
//   npm run build && npm run smoke
//
// Optional env:
//   PREVIEW_URL  — full origin to test against (skips spawning a server)
//   FILTER       — substring; only test pages whose path includes it

import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const FILTER = process.env.FILTER || '';

async function listPages() {
  const dir = path.resolve('dist/production');
  const entries = await readdir(dir);
  return entries
    .filter((name) => name.endsWith('.html'))
    .filter((name) => name.includes(FILTER))
    .sort()
    .map((name) => `/production/${name}`);
}

function spawnPreview() {
  if (process.env.PREVIEW_URL) {return Promise.resolve({ url: process.env.PREVIEW_URL, kill: () => {} });}
  if (!existsSync('dist/production/index.html')) {
    console.error('No dist/ — run `npm run build` first.');
    process.exit(1);
  }
  const port = process.env.PREVIEW_PORT || '9174';
  const proc = spawn('npx', ['vite', 'preview', '--port', port, '--host'], {
    stdio: ['ignore', 'pipe', 'inherit'],
    env: { ...process.env, PREVIEW_PORT: port }
  });
  return new Promise((resolve, reject) => {
    let url = '';
    const onData = (chunk) => {
      const m = chunk.toString().match(/Local:\s+(https?:\/\/[^\s]+)/);
      if (m) {
        url = m[1].replace(/\/$/, '');
        proc.stdout.off('data', onData);
        setTimeout(() => resolve({ url, kill: () => proc.kill() }), 400);
      }
    };
    proc.stdout.on('data', onData);
    proc.on('exit', (code) => { if (!url) {reject(new Error(`preview exited ${code}`));} });
  });
}

async function checkPage(page, url) {
  const errors = [];
  const onConsole = (msg) => { if (msg.type() === 'error') {errors.push(`console: ${msg.text()}`);} };
  const onPageError = (err) => errors.push(`pageerror: ${err.message}`);
  const onFailed = (req) => {
    // Same-origin failures only — cross-origin (Google Fonts, CDN) are out of scope.
    if (req.url().startsWith(new URL(url).origin)) {
      errors.push(`failed: ${req.url()} (${req.failure()?.errorText || '?'})`);
    }
  };
  page.on('console', onConsole);
  page.on('pageerror', onPageError);
  page.on('requestfailed', onFailed);

  const resp = await page.goto(url, { waitUntil: 'networkidle' });
  if (!resp || !resp.ok()) {errors.push(`http: ${resp?.status() || '?'}`);}

  // Give async modules (charts, datatables) a beat to settle and surface any
  // late errors.
  await page.waitForTimeout(600);

  page.off('console', onConsole);
  page.off('pageerror', onPageError);
  page.off('requestfailed', onFailed);
  return errors;
}

async function main() {
  const { url: baseUrl, kill } = await spawnPreview();
  const pages = await listPages();
  console.log(`→ smoke-testing ${pages.length} pages against ${baseUrl}`);

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();

  let failed = 0;
  for (const urlPath of pages) {
    const errors = await checkPage(page, baseUrl + urlPath);
    const slug = urlPath.replace('/production/', '').replace('.html', '');
    if (errors.length) {
      failed += 1;
      console.log(`  ✗ ${slug}`);
      errors.forEach((e) => console.log(`      ${e}`));
    } else {
      console.log(`  ✓ ${slug}`);
    }
  }

  await browser.close();
  kill();

  if (failed) {
    console.log(`\n→ ${failed} page(s) failed`);
    process.exit(1);
  }
  console.log(`\n→ all ${pages.length} pages passed`);
}

main().catch((e) => { console.error(e); process.exit(1); });
