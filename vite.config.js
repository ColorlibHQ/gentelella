import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { renderShell, parseShellAttrs } from './src/v4/shell-render.js';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Auto-detect every entry HTML in production/ and register it as a Rollup
// input. Replaces the old hand-maintained 60-entry list — adding a new page
// is now just dropping a file into production/.
function discoverEntries() {
  const dir = resolve(import.meta.dirname, 'production');
  const out = {};
  for (const file of readdirSync(dir)) {
    if (!file.endsWith('.html')) continue;
    // Vite wants a unique chunk name per entry. `index.html` is special:
    // historical name was `main` so we keep that for the dashboard chunk;
    // everything else uses the filename stem.
    const stem = file === 'index.html' ? 'main' : file.replace(/\.html$/, '');
    out[stem] = `production/${file}`;
  }
  return out;
}

// JSON-LD structured data for the marketing landing page.
//
// The FAQ entries are parsed out of the page's own <details>/<summary> markup
// at build time rather than hand-maintained here. Google requires FAQ markup to
// match the visible answers exactly, and a hand-copied block silently drifts the
// first time someone edits the page — this can't.
//
// Deliberately NO aggregateRating/Review: the testimonials on the landing page
// are placeholder demo content, and emitting review markup for invented praise
// is both dishonest and a structured-data violation.
function structuredDataPlugin() {
  const pkg = JSON.parse(readFileSync(resolve(import.meta.dirname, 'package.json'), 'utf8'));
  const SITE = 'https://gentelella.colorlib.com/';
  const ENTITIES = {
    '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'",
    '&mdash;': '\u2014', '&ndash;': '\u2013', '&nbsp;': ' ', '&hellip;': '\u2026'
  };
  const plain = (frag) =>
    frag
      .replace(/<[^>]+>/g, ' ')
      .replace(/&[a-z#0-9]+;/gi, (e) => ENTITIES[e] ?? e)
      .replace(/\s+/g, ' ')
      .trim();

  return {
    name: 'gentelella-structured-data',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (!/landing\.html$/.test(ctx?.filename || ctx?.path || '')) return html;

        const faq = [];
        const blocks = /<details[^>]*>([\s\S]*?)<\/details>/g;
        let block;
        while ((block = blocks.exec(html)) !== null) {
          const summary = /<summary[^>]*>([\s\S]*?)<\/summary>/.exec(block[1]);
          if (!summary) continue;
          // Trailing "+" is the open/close affordance, not part of the question.
          const question = plain(summary[1]).replace(/\s*\+$/, '');
          const answer = plain(block[1].slice(summary.index + summary[0].length));
          if (question && answer) {
            faq.push({
              '@type': 'Question',
              name: question,
              acceptedAnswer: { '@type': 'Answer', text: answer }
            });
          }
        }

        const graph = [
          {
            '@type': 'SoftwareApplication',
            name: 'Gentelella',
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Any',
            softwareVersion: pkg.version,
            url: SITE,
            description: pkg.description,
            license: 'https://opensource.org/licenses/MIT',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            author: { '@type': 'Organization', name: 'Colorlib', url: 'https://colorlib.com' }
          }
        ];
        if (faq.length) graph.push({ '@type': 'FAQPage', mainEntity: faq });

        const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })
          .replace(/</g, '\\u003c'); // never let a "</script>" escape the block
        return html.replace(
          /<\/head>/i,
          `<script type="application/ld+json">${json}</script>\n</head>`
        );
      }
    }
  };
}

// Emit sitemap.xml from the discovered entry pages. Opt-in via SITE_URL,
// because a sitemap has to carry absolute URLs and guessing the deploy host
// would ship a file pointing at somewhere the site isn't. No SITE_URL, no
// sitemap — better than a confidently wrong one.
//
//   SITE_URL=https://example.com/ npm run build
//
// Pages that shouldn't be indexed (auth, error, and placeholder screens) are
// excluded — they're real pages in the template, but nobody wants a login
// form or a 404 mockup as a search result.
const SITEMAP_EXCLUDE = new Set([
  'coming_soon', 'forgot_password', 'lock_screen', 'login', 'maintenance',
  'offline', 'page_403', 'page_404', 'page_500', 'register', 'verify_2fa'
]);

function sitemapPlugin() {
  return {
    name: 'gentelella-sitemap',
    apply: 'build',
    generateBundle() {
      const site = process.env.SITE_URL;
      if (!site) return;
      const origin = site.endsWith('/') ? site : `${site}/`;
      const urls = Object.keys(discoverEntries())
        .map((stem) => (stem === 'main' ? 'index' : stem))
        .filter((stem) => !SITEMAP_EXCLUDE.has(stem))
        .sort()
        // index.html is the site root; the rest keep their filename.
        .map((stem) => (stem === 'index' ? origin : `${origin}production/${stem}.html`));

      const body = urls
        .map((loc) => `  <url><loc>${loc.replace(/&/g, '&amp;')}</loc></url>`)
        .join('\n');
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
      });
    }
  };
}

// Emit a root index.html that forwards to the dashboard. Entry pages all live
// under production/, so without this the bare deploy root (GitHub Pages, R2,
// `npm run preview`) has no front door and 404s. The redirect target is
// relative, so it resolves the same whether the site is served from / or from
// a subpath like /gentelella/ or /theme/gentelella/.
function rootRedirectPlugin() {
  return {
    name: 'gentelella-root-redirect',
    apply: 'build',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'index.html',
        source: [
          '<!DOCTYPE html>',
          '<meta http-equiv="refresh" content="0;url=production/index.html">',
          '<link rel="canonical" href="production/index.html">',
          '<title>Gentelella v4</title>',
          ''
        ].join('\n')
      });
    }
  };
}

// Inject sidebar/topbar/footer into pages with body[data-shell="admin"] at
// dev/build time so the shell paints on the first frame (no FOUC). The
// runtime mountShell() detects already-injected shells and skips re-rendering;
// it still wires up event handlers either way.
function shellInjectionPlugin() {
  let base = '/'; // Resolved from Vite config — used for subpath-safe URLs.
  return {
    name: 'gentelella-shell-injection',
    configResolved(config) { base = config.base || '/'; },
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        let out = html;

        // PWA + meta tags for every page (admin-shell or not).
        // Asset URLs are prefixed with the resolved base so deploys under a
        // subpath (e.g. /theme/gentelella-v4-rc1/) resolve correctly.
        // Both the modern `mobile-web-app-capable` and the older
        // `apple-mobile-web-app-capable` are emitted for max compatibility —
        // newer Chrome/Edge prefer the unprefixed name.
        const metaPwa = `<link rel="manifest" href="${base}site.webmanifest">
<meta name="theme-color" content="#1ABB9C" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#1a2332" media="(prefers-color-scheme: dark)">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<link rel="apple-touch-icon" href="${base}images/apple-touch-icon.svg">`;
        out = out.replace(/<\/head>/i, `${metaPwa}\n</head>`);

        // SEO + Open Graph meta. Skip if the page already declares a
        // description (page-specific copy wins). Title falls back to "Gentelella v4"
        // if the page has none. The description is derived from the breadcrumb
        // when present so each page gets distinct copy without per-page edits.
        if (!/name=["']description["']/i.test(out)) {
          const titleMatch = /<title>([^<]+)<\/title>/i.exec(out);
          const title = titleMatch ? titleMatch[1].replace(/\s+\|\s+.*$/, '').trim() : 'Gentelella v4';
          const bcMatch = /data-breadcrumb=["']([^"']+)["']/i.exec(out);
          // Strip any "|href" targets — the description wants labels only.
          const breadcrumb = bcMatch
            ? bcMatch[1].replace(/\|[^>]*/g, '').replace(/^Home\s*>\s*/, '').replace(/\s*>\s*/g, ' > ').trim()
            : '';
          const desc = breadcrumb
            ? `${title} — ${breadcrumb}. Free admin template by Colorlib. 60 pages, 20 chart variants, dark mode, PWA-ready.`
            : 'Gentelella v4 — free admin dashboard template. 60 pages, 20 chart variants, vanilla JS, no Bootstrap, no jQuery. By Colorlib.';
          const seo = `<meta name="description" content="${desc.replace(/"/g, '&quot;')}">
<meta property="og:type" content="website">
<meta property="og:title" content="${title.replace(/"/g, '&quot;')}">
<meta property="og:description" content="${desc.replace(/"/g, '&quot;')}">
<meta property="og:image" content="${base}images/android-chrome-512x512.svg">
<meta property="og:site_name" content="Gentelella v4">
<meta name="twitter:card" content="summary_large_image">`;
          out = out.replace(/<\/head>/i, `${seo}\n</head>`);
        }

        // Pre-paint theme + direction script: read stored theme and text
        // direction and apply them to <html> before the body renders, so
        // neither dark mode nor RTL flashes the wrong way round.
        const prePaint = `<script>(function(){try{var t=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;var theme=t||(d?'dark':'light');document.documentElement.setAttribute('data-theme',theme);var dir=localStorage.getItem('dir');if(dir==='rtl'||dir==='ltr'){document.documentElement.setAttribute('dir',dir);}}catch(e){}})();</script>`;
        out = out.replace(/<\/head>/i, `${prePaint}\n</head>`);

        // Admin-shell injection only fires for pages with body[data-shell="admin"].
        // Quote-aware match: data-breadcrumb values contain a literal ">"
        // ("Home > Dashboard"), so a naive [^>]* would truncate mid-attribute.
        const bodyTag = /<body\b((?:"[^"]*"|'[^']*'|[^>"'])*)>/i.exec(out);
        if (!bodyTag) return out;
        const parsed = parseShellAttrs(bodyTag[1]);
        if (!parsed) return out;

        const { sidebar, topbar, footer } = renderShell(parsed);
        const skipLink = `<a class="skip-link" href="#main-content">Skip to main content</a>`;

        out = out.replace(
          /<main\s+class=["']main["']/i,
          `${skipLink}\n${sidebar}\n${topbar}\n<main id="main-content" tabindex="-1" class="main"`
        );
        out = out.replace(/<\/main>/i, `${footer}\n</main>`);
        return out;
      }
    }
  };
}

// `base` is the public path the built site is served from. Defaults to root.
// Set BASE_PATH to test a subpath build (or to deploy under a subpath):
//   BASE_PATH=/admin/ npm run build
// `preview` also honors BASE_PATH so you can verify the built site at the
// real path it'll be served from. `dev` always runs at `/` since the dev
// server doesn't read built artifacts.
export default defineConfig(({ command }) => ({
  root: '.',
  base: command === 'serve' ? '/' : (process.env.BASE_PATH ?? '/'),
  publicDir: 'public',
  plugins: [shellInjectionPlugin(), rootRedirectPlugin(), sitemapPlugin(), structuredDataPlugin()],
  logLevel: 'info',
  clearScreen: false,
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
    // Optimize source maps: 'hidden' for production (generates but doesn't reference in bundle)
    // This allows debugging in production without exposing source maps to users
    sourcemap: process.env.NODE_ENV === 'production' ? 'hidden' : true,
    target: 'es2022',
    rollupOptions: {
      plugins: [
        // Bundle analyzer - generates stats.html file
        visualizer({
          filename: 'dist/stats.html',
          open: false,
          gzipSize: true,
          brotliSize: true,
          template: 'treemap' // 'treemap', 'sunburst', 'network'
        })
      ],
      output: {
        // Function form required by Rolldown (Vite 8+). Matches by
        // node_modules path because rolldown doesn't resolve package names.
        manualChunks(id) {
          // Only chunk what v4 actually uses: ECharts (lazy on chart pages),
          // DataTables (lazy on tables pages), Leaflet (lazy on map page).
          if (!id.includes('node_modules')) return;
          if (/node_modules\/echarts\//.test(id)) return 'vendor-echarts';
          if (/node_modules\/datatables\.net\//.test(id)) return 'vendor-tables';
          if (/node_modules\/leaflet\//.test(id)) return 'vendor-maps';
        },
        assetFileNames: (assetInfo) => {
          // Rolldown (Vite 8+) passes `names` (array); Rollup passes `name`.
          const name = assetInfo.name ?? assetInfo.names?.[0] ?? '';
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(name)) {
            return `images/[name]-[hash][extname]`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(name)) {
            return `fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js'
      },
      // Auto-discovered from production/*.html. Add a new page by just
      // dropping the file in — no config edit needed.
      input: discoverEntries()
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        unsafe_comps: true,
        passes: 3,
        pure_getters: true,
        reduce_vars: true,
        collapse_vars: true,
        dead_code: true,
        unused: true
      },
      mangle: {
        safari10: true
      },
      format: {
        comments: false
      }
    }
  },
  esbuild: {
    target: 'es2022'
  },
  server: {
    // Entry HTMLs live in production/, not at the project root.
    // Default to an uncommon port so we don't collide with the dozen tools
    // that grab 3000/4000/5173/8000/8080. Override with PORT env if needed.
    // strictPort defaults to false → Vite auto-increments on collision.
    open: '/production/index.html',
    port: Number(process.env.PORT) || 9173,
    host: true,
    // /api/* → examples/express-sqlite (when running). Falls through 404 if
    // the example backend isn't up — frontend pages stay on seed data.
    // Override the target with API_URL if your backend lives elsewhere.
    proxy: {
      '/api': {
        target: process.env.API_URL || 'http://localhost:8080',
        changeOrigin: true
      }
    },
    watch: {
      usePolling: false,
      interval: 100,
      ignored: ['**/node_modules/**', '**/dist/**', '**/examples/**']
    },
    hmr: {
      overlay: false
    }
  },
  preview: {
    open: '/production/index.html',
    port: Number(process.env.PREVIEW_PORT) || 9174,
    host: true
  },
  optimizeDeps: {
    include: ['echarts', 'datatables.net', 'leaflet'],
    force: false
  },
  resolve: {
    // Modern build without jQuery aliases
  },
  css: {
    // Enable CSS source maps only in development (saves ~8MB in production build)
    devSourcemap: process.env.NODE_ENV !== 'production',
    preprocessorOptions: {
      scss: {
        // Silence Sass deprecation warnings
        silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin', 'color-functions'],
        // Additional settings for better performance
        includePaths: ['node_modules'],
        // Generate source maps only in development
        sourceMap: process.env.NODE_ENV !== 'production',
        sourceMapContents: process.env.NODE_ENV !== 'production'
      }
    }
  },
  define: {
    global: 'globalThis',
    process: JSON.stringify({
      env: {
        NODE_ENV: 'production'
      }
    }),
    'process.env': JSON.stringify({
      NODE_ENV: 'production'
    }),
    'process.env.NODE_ENV': '"production"'
  }
}));
