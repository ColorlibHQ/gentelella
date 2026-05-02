// Inline SVG dashboard mockups used as product gallery imagery in
// production/product_detail.html. Hand-crafted to mirror the actual v4
// design system (sidebar, topbar, cards, charts) so the product page sells
// the template using its own UI rather than emoji placeholders.

const COLORS = {
  bg:        '#f5f7fb',
  bgDark:    '#0f1623',
  surface:   '#ffffff',
  surfaceDark: '#1a2332',
  surfaceDk2: '#141d2b',
  border:    '#e6e7eb',
  borderDark: 'rgba(255,255,255,0.1)',
  text:      '#1e2633',
  textDark:  '#e6ebf2',
  muted:     '#9ba5b1',
  mutedDark: '#8a93a3',
  primary:   '#1ABB9C',
  azure:     '#4299e1',
  yellow:    '#f59f00',
  red:       '#d63939',
  purple:    '#ae3ec9',
  green:     '#2fb344',
  blue:      '#066fd1'
};

// Shared shell for dashboard mockups — sidebar, topbar, and brand mark.
function shell(t) {
  return `
    <!-- Sidebar -->
    <rect width="60" height="300" fill="${COLORS.surfaceDark}"/>
    <rect x="6" y="9" width="14" height="14" rx="3" fill="${COLORS.primary}"/>
    <text x="13" y="20" font-size="9" font-weight="700" fill="white" text-anchor="middle" font-family="Inter,sans-serif">G</text>
    <rect x="24" y="13" width="24" height="6" rx="1" fill="rgba(255,255,255,0.95)"/>

    <rect x="6" y="38" width="20" height="3" rx="1" fill="rgba(255,255,255,0.18)"/>
    <rect x="6" y="48" width="48" height="7" rx="2" fill="rgba(26,187,156,0.22)"/>
    <rect x="6" y="60" width="48" height="6" rx="2" fill="rgba(255,255,255,0.05)"/>
    <rect x="6" y="71" width="48" height="6" rx="2" fill="rgba(255,255,255,0.05)"/>
    <rect x="6" y="82" width="48" height="6" rx="2" fill="rgba(255,255,255,0.05)"/>
    <rect x="6" y="93" width="48" height="6" rx="2" fill="rgba(255,255,255,0.05)"/>

    <rect x="6" y="113" width="20" height="3" rx="1" fill="rgba(255,255,255,0.18)"/>
    <rect x="6" y="123" width="48" height="6" rx="2" fill="rgba(255,255,255,0.05)"/>
    <rect x="6" y="134" width="48" height="6" rx="2" fill="rgba(255,255,255,0.05)"/>
    <rect x="6" y="145" width="48" height="6" rx="2" fill="rgba(255,255,255,0.05)"/>

    <rect x="6" y="280" width="48" height="13" rx="3" fill="rgba(255,255,255,0.04)"/>
    <circle cx="13" cy="286.5" r="4" fill="${COLORS.primary}"/>

    <!-- Topbar -->
    <rect x="60" width="340" height="22" fill="${t === 'dark' ? COLORS.surfaceDk2 : COLORS.surface}"/>
    <line x1="60" y1="22" x2="400" y2="22" stroke="${t === 'dark' ? COLORS.borderDark : COLORS.border}"/>
    <rect x="70" y="8" width="38" height="4" rx="1" fill="${t === 'dark' ? COLORS.mutedDark : COLORS.muted}"/>
    <circle cx="115" cy="10" r="1.2" fill="${t === 'dark' ? COLORS.mutedDark : COLORS.muted}"/>
    <rect x="120" y="8" width="40" height="4" rx="1" fill="${t === 'dark' ? COLORS.textDark : COLORS.text}"/>
    <rect x="240" y="6" width="60" height="11" rx="3" fill="${t === 'dark' ? '#0f1623' : COLORS.bg}"/>
    <circle cx="320" cy="11" r="4" fill="none" stroke="${t === 'dark' ? COLORS.mutedDark : COLORS.muted}" stroke-width="1.2"/>
    <circle cx="340" cy="11" r="4" fill="none" stroke="${t === 'dark' ? COLORS.mutedDark : COLORS.muted}" stroke-width="1.2"/>
    <circle cx="362" cy="11" r="6" fill="${COLORS.primary}"/>
    <text x="362" y="14" font-size="6" font-weight="700" fill="white" text-anchor="middle" font-family="Inter,sans-serif">A</text>

    <!-- Page header -->
    <rect x="70" y="32" width="50" height="4" rx="1" fill="${t === 'dark' ? COLORS.mutedDark : COLORS.muted}"/>
    <rect x="70" y="40" width="80" height="6" rx="1" fill="${t === 'dark' ? COLORS.textDark : COLORS.text}"/>
  `;
}

function statCard(x, y, accent, theme) {
  const surface = theme === 'dark' ? COLORS.surfaceDk2 : COLORS.surface;
  const border = theme === 'dark' ? COLORS.borderDark : COLORS.border;
  const text = theme === 'dark' ? COLORS.textDark : COLORS.text;
  const muted = theme === 'dark' ? COLORS.mutedDark : COLORS.muted;
  return `
    <g transform="translate(${x}, ${y})">
      <rect width="105" height="56" rx="4" fill="${surface}" stroke="${border}"/>
      <circle cx="20" cy="20" r="11" fill="${accent}" fill-opacity="0.14"/>
      <rect x="14" y="16" width="12" height="8" rx="1.5" fill="${accent}"/>
      <rect x="38" y="14" width="44" height="4" rx="1" fill="${muted}"/>
      <rect x="38" y="24" width="32" height="8" rx="1" fill="${text}"/>
      <rect x="38" y="38" width="56" height="3" rx="1" fill="${muted}"/>
      <!-- mini sparkline -->
      <polyline points="14,46 22,42 30,44 38,38 46,40" fill="none" stroke="${accent}" stroke-width="1.2"/>
    </g>
  `;
}

// Overview dashboard (light)
const overview = `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%">
  <rect width="400" height="300" fill="${COLORS.bg}"/>
  ${shell('light')}
  ${statCard(70,  56, COLORS.primary, 'light')}
  ${statCard(180, 56, COLORS.azure,   'light')}
  ${statCard(290, 56, COLORS.yellow,  'light')}

  <!-- Big chart card -->
  <g transform="translate(70, 122)">
    <rect width="215" height="170" rx="4" fill="${COLORS.surface}" stroke="${COLORS.border}"/>
    <rect x="12" y="12" width="80" height="6" rx="1" fill="${COLORS.text}"/>
    <rect x="12" y="22" width="50" height="3" rx="1" fill="${COLORS.muted}"/>
    <rect x="170" y="12" width="34" height="11" rx="3" fill="${COLORS.bg}"/>
    <rect x="173" y="15" width="10" height="5" rx="1" fill="${COLORS.primary}"/>
    <!-- Grid lines -->
    <line x1="20" y1="60"  x2="200" y2="60"  stroke="${COLORS.border}" stroke-dasharray="2,2"/>
    <line x1="20" y1="90"  x2="200" y2="90"  stroke="${COLORS.border}" stroke-dasharray="2,2"/>
    <line x1="20" y1="120" x2="200" y2="120" stroke="${COLORS.border}" stroke-dasharray="2,2"/>
    <!-- Area fill -->
    <polygon points="20,128 50,108 80,118 110,88 140,98 170,68 200,58 200,150 20,150" fill="${COLORS.primary}" fill-opacity="0.15"/>
    <!-- Primary line -->
    <polyline points="20,128 50,108 80,118 110,88 140,98 170,68 200,58" fill="none" stroke="${COLORS.primary}" stroke-width="2" stroke-linejoin="round"/>
    <!-- Dashed secondary line -->
    <polyline points="20,138 50,128 80,132 110,118 140,122 170,108 200,103" fill="none" stroke="${COLORS.azure}" stroke-width="1.5" stroke-dasharray="3,2"/>
    <!-- X axis -->
    <line x1="20" y1="150" x2="200" y2="150" stroke="${COLORS.border}"/>
    <text x="22"  y="160" font-size="5.5" fill="${COLORS.muted}">Mon</text>
    <text x="50"  y="160" font-size="5.5" fill="${COLORS.muted}">Tue</text>
    <text x="80"  y="160" font-size="5.5" fill="${COLORS.muted}">Wed</text>
    <text x="110" y="160" font-size="5.5" fill="${COLORS.muted}">Thu</text>
    <text x="140" y="160" font-size="5.5" fill="${COLORS.muted}">Fri</text>
    <text x="170" y="160" font-size="5.5" fill="${COLORS.muted}">Sat</text>
    <text x="195" y="160" font-size="5.5" fill="${COLORS.muted}" text-anchor="end">Sun</text>
  </g>

  <!-- Activity list -->
  <g transform="translate(295, 122)">
    <rect width="100" height="170" rx="4" fill="${COLORS.surface}" stroke="${COLORS.border}"/>
    <rect x="10" y="12" width="55" height="6" rx="1" fill="${COLORS.text}"/>
    ${[
    { y: 28, c: COLORS.primary, w: 60 },
    { y: 50, c: COLORS.azure,   w: 50 },
    { y: 72, c: COLORS.green,   w: 56 },
    { y: 94, c: COLORS.yellow,  w: 48 },
    { y: 116, c: COLORS.purple, w: 52 },
    { y: 138, c: COLORS.red,    w: 56 }
  ].map((a) => `
      <g transform="translate(10, ${a.y})">
        <circle cx="9" cy="9" r="7" fill="${a.c}" fill-opacity="0.85"/>
        <rect x="22" y="5" width="${a.w}" height="3" rx="1" fill="${COLORS.text}"/>
        <rect x="22" y="11" width="${Math.round(a.w * 0.6)}" height="2.5" rx="1" fill="${COLORS.muted}"/>
      </g>
    `).join('')}
  </g>
</svg>`;

// Analytics — multi-chart layout (light)
const analytics = `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%">
  <rect width="400" height="300" fill="${COLORS.bg}"/>
  ${shell('light')}

  <!-- Two chart cards -->
  <g transform="translate(70, 56)">
    <rect width="160" height="115" rx="4" fill="${COLORS.surface}" stroke="${COLORS.border}"/>
    <rect x="10" y="10" width="80" height="6" rx="1" fill="${COLORS.text}"/>
    <rect x="10" y="20" width="40" height="14" rx="1" fill="${COLORS.text}"/>
    <rect x="55" y="24" width="40" height="6" rx="1" fill="${COLORS.green}" fill-opacity="0.8"/>
    <!-- Bar chart -->
    ${[20, 35, 28, 50, 42, 58, 70, 65].map((h, i) => `
      <rect x="${14 + i * 18}" y="${100 - h}" width="11" height="${h}" rx="2" fill="${[COLORS.primary, COLORS.azure, COLORS.yellow, COLORS.green, COLORS.purple, COLORS.red, COLORS.primary, COLORS.azure][i]}"/>
    `).join('')}
  </g>

  <g transform="translate(240, 56)">
    <rect width="155" height="115" rx="4" fill="${COLORS.surface}" stroke="${COLORS.border}"/>
    <rect x="10" y="10" width="60" height="6" rx="1" fill="${COLORS.text}"/>
    <!-- Donut -->
    <circle cx="80" cy="68" r="32" fill="none" stroke="${COLORS.bg}" stroke-width="14"/>
    <circle cx="80" cy="68" r="32" fill="none" stroke="${COLORS.primary}" stroke-width="14" stroke-dasharray="80 200" transform="rotate(-90 80 68)"/>
    <circle cx="80" cy="68" r="32" fill="none" stroke="${COLORS.azure}"   stroke-width="14" stroke-dasharray="40 200" stroke-dashoffset="-80" transform="rotate(-90 80 68)"/>
    <circle cx="80" cy="68" r="32" fill="none" stroke="${COLORS.yellow}"  stroke-width="14" stroke-dasharray="30 200" stroke-dashoffset="-120" transform="rotate(-90 80 68)"/>
    <circle cx="80" cy="68" r="32" fill="none" stroke="${COLORS.purple}"  stroke-width="14" stroke-dasharray="24 200" stroke-dashoffset="-150" transform="rotate(-90 80 68)"/>
    <text x="80" y="65" font-size="8" font-weight="700" fill="${COLORS.text}" text-anchor="middle" font-family="Inter,sans-serif">8.4k</text>
    <text x="80" y="75" font-size="5" fill="${COLORS.muted}" text-anchor="middle" font-family="Inter,sans-serif">devices</text>
    <!-- Legend -->
    <g transform="translate(118, 50)" font-family="Inter,sans-serif" font-size="5.5">
      <rect width="6" height="6" rx="1" fill="${COLORS.primary}"/><text x="9" y="5" fill="${COLORS.text}">iOS</text><text x="35" y="5" fill="${COLORS.muted}" text-anchor="end">30%</text>
      <g transform="translate(0, 11)"><rect width="6" height="6" rx="1" fill="${COLORS.azure}"/><text x="9" y="5" fill="${COLORS.text}">Android</text><text x="35" y="5" fill="${COLORS.muted}" text-anchor="end">25%</text></g>
      <g transform="translate(0, 22)"><rect width="6" height="6" rx="1" fill="${COLORS.yellow}"/><text x="9" y="5" fill="${COLORS.text}">Desktop</text><text x="35" y="5" fill="${COLORS.muted}" text-anchor="end">20%</text></g>
      <g transform="translate(0, 33)"><rect width="6" height="6" rx="1" fill="${COLORS.purple}"/><text x="9" y="5" fill="${COLORS.text}">Tablet</text><text x="35" y="5" fill="${COLORS.muted}" text-anchor="end">15%</text></g>
    </g>
  </g>

  <!-- Wide line chart -->
  <g transform="translate(70, 178)">
    <rect width="325" height="115" rx="4" fill="${COLORS.surface}" stroke="${COLORS.border}"/>
    <rect x="10" y="10" width="80" height="6" rx="1" fill="${COLORS.text}"/>
    <rect x="10" y="20" width="50" height="3" rx="1" fill="${COLORS.muted}"/>
    <line x1="14" y1="60" x2="315" y2="60" stroke="${COLORS.border}" stroke-dasharray="2,2"/>
    <line x1="14" y1="80" x2="315" y2="80" stroke="${COLORS.border}" stroke-dasharray="2,2"/>
    <polygon points="14,95 50,80 86,82 122,68 158,72 194,55 230,60 266,42 302,38 314,40 314,100 14,100" fill="${COLORS.primary}" fill-opacity="0.12"/>
    <polyline points="14,95 50,80 86,82 122,68 158,72 194,55 230,60 266,42 302,38 314,40" fill="none" stroke="${COLORS.primary}" stroke-width="2" stroke-linejoin="round"/>
    <polyline points="14,98 50,90 86,89 122,82 158,84 194,75 230,78 266,70 302,68 314,72" fill="none" stroke="${COLORS.azure}" stroke-width="1.5" stroke-dasharray="3,2"/>
  </g>
</svg>`;

// Tables view (light)
const tables = `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%">
  <rect width="400" height="300" fill="${COLORS.bg}"/>
  ${shell('light')}

  <g transform="translate(70, 56)">
    <rect width="325" height="237" rx="4" fill="${COLORS.surface}" stroke="${COLORS.border}"/>
    <!-- Header -->
    <rect x="14" y="12" width="60" height="6" rx="1" fill="${COLORS.text}"/>
    <rect x="14" y="22" width="40" height="3" rx="1" fill="${COLORS.muted}"/>
    <!-- Search -->
    <rect x="220" y="12" width="90" height="14" rx="3" fill="${COLORS.bg}"/>
    <rect x="226" y="17" width="60" height="4" rx="1" fill="${COLORS.muted}"/>
    <!-- Table head -->
    <rect x="14" y="40" width="297" height="18" rx="2" fill="${COLORS.bg}"/>
    ${['Order', 'Customer', 'Product', 'Status', 'Date'].map((h, i) => `
      <text x="${22 + i * 60}" y="51" font-size="6" font-weight="600" fill="${COLORS.muted}" font-family="Inter,sans-serif">${h}</text>
    `).join('')}
    <!-- Rows -->
    ${[
    { id: '#7841', c: 'JD', cb: COLORS.primary, p: 'AdminLTE Pro',     s: 'Paid',       sb: COLORS.green,  d: 'Apr 28' },
    { id: '#7840', c: 'AS', cb: COLORS.azure,   p: 'Gentelella Theme', s: 'Processing', sb: COLORS.blue,   d: 'Apr 27' },
    { id: '#7839', c: 'RJ', cb: COLORS.purple,  p: 'Dashboard Pack',   s: 'Paid',       sb: COLORS.green,  d: 'Apr 27' },
    { id: '#7838', c: 'EW', cb: COLORS.yellow,  p: 'ArchitectUI',      s: 'Pending',    sb: COLORS.yellow, d: 'Apr 26' },
    { id: '#7837', c: 'MK', cb: COLORS.red,     p: 'Bootstrap Bundle', s: 'Cancelled',  sb: COLORS.red,    d: 'Apr 25' },
    { id: '#7836', c: 'LP', cb: COLORS.green,   p: 'UI Kit Pro',       s: 'Paid',       sb: COLORS.green,  d: 'Apr 25' },
    { id: '#7835', c: 'DR', cb: COLORS.blue,    p: 'Vue Admin',        s: 'Paid',       sb: COLORS.green,  d: 'Apr 24' },
    { id: '#7834', c: 'YT', cb: COLORS.primary, p: 'React Dash',       s: 'Processing', sb: COLORS.blue,   d: 'Apr 24' }
  ].map((r, i) => `
      <g transform="translate(0, ${68 + i * 21})">
        <text x="22" y="7" font-size="6" font-weight="600" fill="${COLORS.primary}" font-family="Inter,sans-serif">${r.id}</text>
        <circle cx="84" cy="5" r="5" fill="${r.cb}"/>
        <text x="84" y="7" font-size="4.5" font-weight="700" fill="white" text-anchor="middle" font-family="Inter,sans-serif">${r.c}</text>
        <text x="142" y="7" font-size="6" fill="${COLORS.text}" font-family="Inter,sans-serif">${r.p}</text>
        <rect x="200" y="0" width="40" height="11" rx="3" fill="${r.sb}" fill-opacity="0.16"/>
        <text x="220" y="7.5" font-size="5.5" font-weight="600" fill="${r.sb}" text-anchor="middle" font-family="Inter,sans-serif">${r.s}</text>
        <text x="262" y="7" font-size="5.5" fill="${COLORS.muted}" font-family="Inter,sans-serif">${r.d}</text>
        <line x1="14" y1="14" x2="311" y2="14" stroke="${COLORS.border}" stroke-opacity="0.5"/>
      </g>
    `).join('')}
  </g>
</svg>`;

// Dark mode dashboard
const dark = `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%">
  <rect width="400" height="300" fill="${COLORS.bgDark}"/>
  ${shell('dark')}
  ${statCard(70,  56, COLORS.primary, 'dark')}
  ${statCard(180, 56, COLORS.azure,   'dark')}
  ${statCard(290, 56, COLORS.purple,  'dark')}

  <g transform="translate(70, 122)">
    <rect width="215" height="170" rx="4" fill="${COLORS.surfaceDk2}" stroke="${COLORS.borderDark}"/>
    <rect x="12" y="12" width="80" height="6" rx="1" fill="${COLORS.textDark}"/>
    <rect x="12" y="22" width="50" height="3" rx="1" fill="${COLORS.mutedDark}"/>
    <line x1="20" y1="60"  x2="200" y2="60"  stroke="${COLORS.borderDark}" stroke-dasharray="2,2"/>
    <line x1="20" y1="90"  x2="200" y2="90"  stroke="${COLORS.borderDark}" stroke-dasharray="2,2"/>
    <line x1="20" y1="120" x2="200" y2="120" stroke="${COLORS.borderDark}" stroke-dasharray="2,2"/>
    <polygon points="20,128 50,108 80,118 110,88 140,98 170,68 200,58 200,150 20,150" fill="${COLORS.primary}" fill-opacity="0.22"/>
    <polyline points="20,128 50,108 80,118 110,88 140,98 170,68 200,58" fill="none" stroke="${COLORS.primary}" stroke-width="2" stroke-linejoin="round"/>
    <polyline points="20,138 50,128 80,132 110,118 140,122 170,108 200,103" fill="none" stroke="${COLORS.azure}" stroke-width="1.5" stroke-dasharray="3,2"/>
  </g>

  <g transform="translate(295, 122)">
    <rect width="100" height="170" rx="4" fill="${COLORS.surfaceDk2}" stroke="${COLORS.borderDark}"/>
    <rect x="10" y="12" width="55" height="6" rx="1" fill="${COLORS.textDark}"/>
    ${[
    { y: 28, c: COLORS.primary, w: 60 },
    { y: 50, c: COLORS.azure,   w: 50 },
    { y: 72, c: COLORS.green,   w: 56 },
    { y: 94, c: COLORS.yellow,  w: 48 },
    { y: 116, c: COLORS.purple, w: 52 },
    { y: 138, c: COLORS.red,    w: 56 }
  ].map((a) => `
      <g transform="translate(10, ${a.y})">
        <circle cx="9" cy="9" r="7" fill="${a.c}" fill-opacity="0.85"/>
        <rect x="22" y="5" width="${a.w}" height="3" rx="1" fill="${COLORS.textDark}"/>
        <rect x="22" y="11" width="${Math.round(a.w * 0.6)}" height="2.5" rx="1" fill="${COLORS.mutedDark}"/>
      </g>
    `).join('')}
  </g>
</svg>`;

// Mobile mockup — phone frame containing scaled dashboard
const mobile = `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${COLORS.primary}" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="${COLORS.azure}" stop-opacity="0.06"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#bgGrad)"/>
  <rect width="400" height="300" fill="${COLORS.bg}" fill-opacity="0.7"/>

  <!-- Phone frame -->
  <g transform="translate(140, 16)">
    <rect width="120" height="268" rx="18" fill="#0f1623" stroke="#1a2332" stroke-width="2"/>
    <rect x="6" y="6" width="108" height="256" rx="12" fill="${COLORS.bg}"/>
    <!-- Notch -->
    <rect x="50" y="6" width="20" height="4" rx="2" fill="#0f1623"/>

    <!-- Mobile topbar -->
    <rect x="6" y="14" width="108" height="20" fill="${COLORS.surface}"/>
    <line x1="6" y1="34" x2="114" y2="34" stroke="${COLORS.border}"/>
    <rect x="12" y="22" width="16" height="3" rx="1" fill="${COLORS.muted}"/>
    <rect x="32" y="20" width="36" height="6" rx="1" fill="${COLORS.text}"/>
    <circle cx="100" cy="24" r="5" fill="${COLORS.primary}"/>

    <!-- Stat cards stacked -->
    <g transform="translate(12, 42)">
      <rect width="96" height="36" rx="3" fill="${COLORS.surface}" stroke="${COLORS.border}"/>
      <circle cx="14" cy="18" r="8" fill="${COLORS.primary}" fill-opacity="0.14"/>
      <rect x="8" y="14" width="12" height="8" rx="1" fill="${COLORS.primary}"/>
      <rect x="28" y="11" width="36" height="3" rx="1" fill="${COLORS.muted}"/>
      <rect x="28" y="19" width="24" height="7" rx="1" fill="${COLORS.text}"/>
      <rect x="28" y="29" width="44" height="2.5" rx="1" fill="${COLORS.muted}"/>
    </g>
    <g transform="translate(12, 84)">
      <rect width="96" height="36" rx="3" fill="${COLORS.surface}" stroke="${COLORS.border}"/>
      <circle cx="14" cy="18" r="8" fill="${COLORS.azure}" fill-opacity="0.14"/>
      <rect x="8" y="14" width="12" height="8" rx="1" fill="${COLORS.azure}"/>
      <rect x="28" y="11" width="36" height="3" rx="1" fill="${COLORS.muted}"/>
      <rect x="28" y="19" width="28" height="7" rx="1" fill="${COLORS.text}"/>
      <rect x="28" y="29" width="44" height="2.5" rx="1" fill="${COLORS.muted}"/>
    </g>

    <!-- Chart card -->
    <g transform="translate(12, 126)">
      <rect width="96" height="80" rx="3" fill="${COLORS.surface}" stroke="${COLORS.border}"/>
      <rect x="6" y="8" width="56" height="4" rx="1" fill="${COLORS.text}"/>
      <rect x="6" y="16" width="40" height="2.5" rx="1" fill="${COLORS.muted}"/>
      <polygon points="6,68 18,58 30,62 42,48 54,52 66,38 78,32 90,28 90,72 6,72" fill="${COLORS.primary}" fill-opacity="0.16"/>
      <polyline points="6,68 18,58 30,62 42,48 54,52 66,38 78,32 90,28" fill="none" stroke="${COLORS.primary}" stroke-width="1.5" stroke-linejoin="round"/>
    </g>

    <!-- Activity rows -->
    <g transform="translate(12, 212)">
      ${[COLORS.azure, COLORS.yellow, COLORS.purple].map((c, i) => `
        <g transform="translate(0, ${i * 14})">
          <circle cx="6" cy="6" r="4" fill="${c}"/>
          <rect x="14" y="3" width="60" height="2.5" rx="1" fill="${COLORS.text}"/>
          <rect x="14" y="8" width="40" height="2" rx="1" fill="${COLORS.muted}"/>
        </g>
      `).join('')}
    </g>

    <!-- Home indicator -->
    <rect x="46" y="252" width="28" height="3" rx="1.5" fill="#0f1623" fill-opacity="0.4"/>
  </g>

  <!-- Decorative scattered dots -->
  <g fill="${COLORS.primary}" fill-opacity="0.15">
    <circle cx="40" cy="60" r="3"/>
    <circle cx="80" cy="240" r="2.5"/>
    <circle cx="320" cy="80" r="3"/>
    <circle cx="360" cy="220" r="2"/>
    <circle cx="50" cy="200" r="2"/>
  </g>
</svg>`;

export const MOCKUPS = { overview, analytics, tables, dark, mobile };

// Smaller related-product thumbnails — abstract dashboard miniatures.
export const RELATED = {
  bars: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%">
    <rect width="200" height="150" fill="${COLORS.surface}"/>
    <rect width="200" height="22" fill="${COLORS.surfaceDark}"/>
    <rect x="10" y="8" width="6" height="6" rx="1" fill="${COLORS.primary}"/>
    <rect x="20" y="9" width="40" height="4" rx="1" fill="white" fill-opacity="0.9"/>
    <circle cx="186" cy="11" r="4" fill="${COLORS.primary}"/>
    <rect x="10" y="34" width="50" height="14" rx="2" fill="${COLORS.text}"/>
    ${[24, 38, 30, 56, 48, 70, 60, 80].map((h, i) => `
      <rect x="${12 + i * 22}" y="${136 - h}" width="16" height="${h}" rx="2" fill="${[COLORS.primary, COLORS.azure, COLORS.yellow, COLORS.green, COLORS.purple, COLORS.red, COLORS.primary, COLORS.azure][i]}"/>
    `).join('')}
  </svg>`,
  donut: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%">
    <rect width="200" height="150" fill="${COLORS.surface}"/>
    <rect width="200" height="22" fill="${COLORS.surfaceDark}"/>
    <rect x="10" y="8" width="6" height="6" rx="1" fill="${COLORS.primary}"/>
    <rect x="20" y="9" width="40" height="4" rx="1" fill="white" fill-opacity="0.9"/>
    <circle cx="186" cy="11" r="4" fill="${COLORS.primary}"/>
    <circle cx="100" cy="86" r="42" fill="none" stroke="${COLORS.bg}" stroke-width="18"/>
    <circle cx="100" cy="86" r="42" fill="none" stroke="${COLORS.primary}" stroke-width="18" stroke-dasharray="105 264" transform="rotate(-90 100 86)"/>
    <circle cx="100" cy="86" r="42" fill="none" stroke="${COLORS.azure}"   stroke-width="18" stroke-dasharray="55 264" stroke-dashoffset="-105" transform="rotate(-90 100 86)"/>
    <circle cx="100" cy="86" r="42" fill="none" stroke="${COLORS.yellow}"  stroke-width="18" stroke-dasharray="40 264" stroke-dashoffset="-160" transform="rotate(-90 100 86)"/>
    <text x="100" y="84" font-size="14" font-weight="700" fill="${COLORS.text}" text-anchor="middle" font-family="Inter,sans-serif">8.4k</text>
    <text x="100" y="96" font-size="6" fill="${COLORS.muted}" text-anchor="middle" font-family="Inter,sans-serif">devices</text>
  </svg>`,
  table: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%">
    <rect width="200" height="150" fill="${COLORS.surface}"/>
    <rect width="200" height="22" fill="${COLORS.surfaceDark}"/>
    <rect x="10" y="8" width="6" height="6" rx="1" fill="${COLORS.primary}"/>
    <rect x="20" y="9" width="40" height="4" rx="1" fill="white" fill-opacity="0.9"/>
    <circle cx="186" cy="11" r="4" fill="${COLORS.primary}"/>
    <rect x="10" y="32" width="180" height="10" rx="2" fill="${COLORS.bg}"/>
    ${[0, 1, 2, 3, 4, 5].map((i) => `
      <g transform="translate(10, ${48 + i * 16})">
        <circle cx="6" cy="6" r="5" fill="${[COLORS.primary, COLORS.azure, COLORS.purple, COLORS.yellow, COLORS.red, COLORS.green][i]}"/>
        <rect x="16" y="3" width="50" height="3" rx="1" fill="${COLORS.text}"/>
        <rect x="16" y="9" width="36" height="2.5" rx="1" fill="${COLORS.muted}"/>
        <rect x="120" y="2" width="38" height="9" rx="2" fill="${[COLORS.green, COLORS.blue, COLORS.green, COLORS.yellow, COLORS.red, COLORS.green][i]}" fill-opacity="0.18"/>
        <rect x="170" y="5" width="14" height="3" rx="1" fill="${COLORS.muted}"/>
      </g>
    `).join('')}
  </svg>`,
  forms: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%">
    <rect width="200" height="150" fill="${COLORS.surface}"/>
    <rect width="200" height="22" fill="${COLORS.surfaceDark}"/>
    <rect x="10" y="8" width="6" height="6" rx="1" fill="${COLORS.primary}"/>
    <rect x="20" y="9" width="40" height="4" rx="1" fill="white" fill-opacity="0.9"/>
    <circle cx="186" cy="11" r="4" fill="${COLORS.primary}"/>
    <rect x="10" y="32" width="60" height="6" rx="1" fill="${COLORS.text}"/>
    <rect x="10" y="46" width="180" height="14" rx="2" fill="${COLORS.bg}" stroke="${COLORS.border}"/>
    <rect x="10" y="66" width="40" height="3" rx="1" fill="${COLORS.muted}"/>
    <rect x="10" y="74" width="180" height="14" rx="2" fill="${COLORS.bg}" stroke="${COLORS.border}"/>
    <rect x="10" y="94" width="50" height="3" rx="1" fill="${COLORS.muted}"/>
    <rect x="10" y="102" width="180" height="24" rx="2" fill="${COLORS.bg}" stroke="${COLORS.border}"/>
    <rect x="10" y="132" width="60" height="12" rx="2" fill="${COLORS.primary}"/>
    <text x="40" y="141" font-size="6" font-weight="600" fill="white" text-anchor="middle" font-family="Inter,sans-serif">Submit</text>
  </svg>`
};
