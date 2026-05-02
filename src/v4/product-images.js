// Inline SVG product illustrations for production/e_commerce.html.
// Replaces emoji placeholders with consistent minimalist line/fill drawings
// over soft gradient backgrounds. Same visual style across all 9 products.

// Background gradient keyed by product slug — paired with the foreground
// illustration colors to keep the palette balanced.
const BG = {
  hoodie:    '<defs><linearGradient id="bg-hoodie" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fef2f2"/><stop offset="1" stop-color="#fee2e2"/></linearGradient></defs><rect width="280" height="210" fill="url(#bg-hoodie)"/>',
  shirt:     '<defs><linearGradient id="bg-shirt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ecfdf5"/><stop offset="1" stop-color="#d1fae5"/></linearGradient></defs><rect width="280" height="210" fill="url(#bg-shirt)"/>',
  sneakers:  '<defs><linearGradient id="bg-sneakers" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff7ed"/><stop offset="1" stop-color="#ffedd5"/></linearGradient></defs><rect width="280" height="210" fill="url(#bg-sneakers)"/>',
  bag:       '<defs><linearGradient id="bg-bag" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fef9c3"/><stop offset="1" stop-color="#fde68a"/></linearGradient></defs><rect width="280" height="210" fill="url(#bg-bag)"/>',
  earbuds:   '<defs><linearGradient id="bg-earbuds" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#eff6ff"/><stop offset="1" stop-color="#dbeafe"/></linearGradient></defs><rect width="280" height="210" fill="url(#bg-earbuds)"/>',
  pourover:  '<defs><linearGradient id="bg-pourover" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fefce8"/><stop offset="1" stop-color="#fef3c7"/></linearGradient></defs><rect width="280" height="210" fill="url(#bg-pourover)"/>',
  mat:       '<defs><linearGradient id="bg-mat" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#faf5ff"/><stop offset="1" stop-color="#e9d5ff"/></linearGradient></defs><rect width="280" height="210" fill="url(#bg-mat)"/>',
  keyboard:  '<defs><linearGradient id="bg-kbd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f0fdfa"/><stop offset="1" stop-color="#ccfbf1"/></linearGradient></defs><rect width="280" height="210" fill="url(#bg-kbd)"/>',
  baselayer: '<defs><linearGradient id="bg-base" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ecfeff"/><stop offset="1" stop-color="#cffafe"/></linearGradient></defs><rect width="280" height="210" fill="url(#bg-base)"/>'
};

// Subtle decorative dots scattered behind the product
function dots(color) {
  return `<g fill="${color}" opacity="0.18">
    <circle cx="30" cy="40" r="2"/>
    <circle cx="50" cy="170" r="2.5"/>
    <circle cx="240" cy="60" r="2"/>
    <circle cx="260" cy="170" r="3"/>
    <circle cx="220" cy="30" r="1.5"/>
    <circle cx="20" cy="120" r="1.5"/>
  </g>`;
}

// 280×210 viewBox (4:3). preserveAspectRatio so they fill the thumb cleanly.
const SVG_OPEN = '<svg viewBox="0 0 280 210" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block">';
const SVG_CLOSE = '</svg>';

// 1. Aurora hoodie — fitted hoodie silhouette with drawstrings, pocket
const hoodie = SVG_OPEN + BG.hoodie + dots('#dc2626') + `
  <g>
    <!-- Body -->
    <path d="M90 80 L90 175 Q90 180 95 180 L185 180 Q190 180 190 175 L190 80 L210 70 L195 50 L165 45 Q140 60 115 45 L85 50 L70 70 Z"
          fill="#fff" stroke="#dc2626" stroke-width="2" stroke-linejoin="round"/>
    <!-- Hood -->
    <path d="M115 45 Q140 35 165 45 Q160 60 140 60 Q120 60 115 45 Z"
          fill="#fee2e2" stroke="#dc2626" stroke-width="2" stroke-linejoin="round"/>
    <!-- Hood inner -->
    <path d="M122 49 Q140 45 158 49 Q155 56 140 56 Q125 56 122 49 Z" fill="#dc2626" opacity="0.2"/>
    <!-- Drawstrings -->
    <line x1="130" y1="55" x2="125" y2="95" stroke="#dc2626" stroke-width="1.8" stroke-linecap="round"/>
    <line x1="150" y1="55" x2="155" y2="95" stroke="#dc2626" stroke-width="1.8" stroke-linecap="round"/>
    <circle cx="124" cy="98" r="2.5" fill="#dc2626"/>
    <circle cx="156" cy="98" r="2.5" fill="#dc2626"/>
    <!-- Kangaroo pocket -->
    <path d="M115 130 L115 160 L165 160 L165 130 Q140 122 115 130 Z" fill="none" stroke="#dc2626" stroke-width="1.5" stroke-linejoin="round"/>
    <!-- Cuffs / hem ribbing -->
    <line x1="92" y1="172" x2="188" y2="172" stroke="#dc2626" stroke-width="1" stroke-dasharray="2,1.5" opacity="0.6"/>
    <line x1="76" y1="68" x2="84" y2="62" stroke="#dc2626" stroke-width="1" stroke-dasharray="2,1.5" opacity="0.6"/>
    <line x1="204" y1="68" x2="196" y2="62" stroke="#dc2626" stroke-width="1" stroke-dasharray="2,1.5" opacity="0.6"/>
  </g>` + SVG_CLOSE;

// 2. Linen field shirt — button-up with collar
const shirt = SVG_OPEN + BG.shirt + dots('#059669') + `
  <g>
    <!-- Body -->
    <path d="M90 70 L90 175 Q90 180 95 180 L185 180 Q190 180 190 175 L190 70 L215 80 L200 50 L165 50 L155 60 Q140 68 125 60 L115 50 L80 50 L65 80 Z"
          fill="#fff" stroke="#059669" stroke-width="2" stroke-linejoin="round"/>
    <!-- Collar -->
    <path d="M115 50 L130 70 L140 60 L150 70 L165 50 Q150 64 140 64 Q130 64 115 50 Z"
          fill="#d1fae5" stroke="#059669" stroke-width="1.8" stroke-linejoin="round"/>
    <!-- Button placket -->
    <line x1="140" y1="68" x2="140" y2="175" stroke="#059669" stroke-width="1.3" opacity="0.7"/>
    <!-- Buttons -->
    <circle cx="140" cy="86" r="2" fill="#059669"/>
    <circle cx="140" cy="108" r="2" fill="#059669"/>
    <circle cx="140" cy="130" r="2" fill="#059669"/>
    <circle cx="140" cy="152" r="2" fill="#059669"/>
    <!-- Chest pocket -->
    <rect x="105" y="92" width="22" height="26" fill="none" stroke="#059669" stroke-width="1.3" rx="1"/>
    <!-- Cuff stitching -->
    <line x1="74" y1="78" x2="80" y2="74" stroke="#059669" stroke-width="1" stroke-dasharray="2,1.5" opacity="0.5"/>
    <line x1="206" y1="78" x2="200" y2="74" stroke="#059669" stroke-width="1" stroke-dasharray="2,1.5" opacity="0.5"/>
  </g>` + SVG_CLOSE;

// 3. Trail runner sneakers — side view
const sneakers = SVG_OPEN + BG.sneakers + dots('#ea580c') + `
  <g>
    <!-- Sole -->
    <path d="M40 145 Q40 130 60 128 L210 125 Q235 125 240 140 Q240 158 230 162 L60 165 Q40 162 40 145 Z"
          fill="#fff" stroke="#ea580c" stroke-width="2" stroke-linejoin="round"/>
    <!-- Sole tread pattern -->
    <line x1="50" y1="158" x2="230" y2="158" stroke="#ea580c" stroke-width="1.5" opacity="0.5"/>
    <line x1="60" y1="160" x2="62" y2="166" stroke="#ea580c" stroke-width="1.5" opacity="0.5"/>
    <line x1="90" y1="160" x2="92" y2="166" stroke="#ea580c" stroke-width="1.5" opacity="0.5"/>
    <line x1="120" y1="160" x2="122" y2="166" stroke="#ea580c" stroke-width="1.5" opacity="0.5"/>
    <line x1="150" y1="160" x2="152" y2="166" stroke="#ea580c" stroke-width="1.5" opacity="0.5"/>
    <line x1="180" y1="160" x2="182" y2="166" stroke="#ea580c" stroke-width="1.5" opacity="0.5"/>
    <line x1="210" y1="160" x2="212" y2="166" stroke="#ea580c" stroke-width="1.5" opacity="0.5"/>
    <!-- Upper -->
    <path d="M50 130 Q50 95 90 78 L165 78 Q210 80 230 110 L230 128 L50 128 Z"
          fill="#ffedd5" stroke="#ea580c" stroke-width="2" stroke-linejoin="round"/>
    <!-- Toe cap -->
    <path d="M50 130 Q50 110 75 95 L100 92 L100 128 L50 128 Z" fill="#fff" stroke="#ea580c" stroke-width="1.5"/>
    <!-- Lacing area -->
    <path d="M115 78 L110 122 L155 124 L160 78 Z" fill="#fff" stroke="#ea580c" stroke-width="1.5"/>
    <!-- Laces -->
    <line x1="118" y1="90"  x2="155" y2="92" stroke="#ea580c" stroke-width="1.5"/>
    <line x1="116" y1="100" x2="155" y2="102" stroke="#ea580c" stroke-width="1.5"/>
    <line x1="114" y1="110" x2="155" y2="112" stroke="#ea580c" stroke-width="1.5"/>
    <!-- Heel logo swoosh -->
    <path d="M170 95 Q190 100 210 115" fill="none" stroke="#ea580c" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Ankle padding -->
    <ellipse cx="200" cy="86" rx="14" ry="10" fill="#fff" stroke="#ea580c" stroke-width="1.5"/>
  </g>` + SVG_CLOSE;

// 4. Canvas weekend bag — duffle bag with strap
const bag = SVG_OPEN + BG.bag + dots('#a16207') + `
  <g>
    <!-- Strap -->
    <path d="M70 80 Q140 50 210 80" fill="none" stroke="#a16207" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Body -->
    <rect x="50" y="80" width="180" height="90" rx="14" fill="#fff" stroke="#a16207" stroke-width="2"/>
    <!-- Mid stitching -->
    <line x1="60" y1="100" x2="220" y2="100" stroke="#a16207" stroke-width="1" stroke-dasharray="2,2" opacity="0.6"/>
    <line x1="60" y1="150" x2="220" y2="150" stroke="#a16207" stroke-width="1" stroke-dasharray="2,2" opacity="0.6"/>
    <!-- Center zipper -->
    <line x1="80" y1="125" x2="200" y2="125" stroke="#a16207" stroke-width="1.5"/>
    <rect x="135" y="120" width="10" height="10" rx="2" fill="#a16207"/>
    <line x1="140" y1="125" x2="140" y2="138" stroke="#a16207" stroke-width="1.5"/>
    <circle cx="140" cy="142" r="2.5" fill="#a16207"/>
    <!-- Side handles where strap meets bag -->
    <rect x="65"  y="76" width="10" height="14" rx="3" fill="#fde68a" stroke="#a16207" stroke-width="1.5"/>
    <rect x="205" y="76" width="10" height="14" rx="3" fill="#fde68a" stroke="#a16207" stroke-width="1.5"/>
    <!-- Brand patch -->
    <rect x="110" y="155" width="60" height="10" rx="2" fill="#fef3c7" stroke="#a16207" stroke-width="1"/>
  </g>` + SVG_CLOSE;

// 5. Wireless earbuds Pro — pair of stem-style earbuds
const earbuds = SVG_OPEN + BG.earbuds + dots('#2563eb') + `
  <g>
    <!-- Left earbud -->
    <g transform="translate(80, 60)">
      <!-- Stem -->
      <rect x="20" y="38" width="14" height="60" rx="6" fill="#fff" stroke="#2563eb" stroke-width="2"/>
      <!-- Bud body -->
      <path d="M5 32 Q5 12 27 12 Q49 12 49 32 Q49 50 27 52 Q5 50 5 32 Z"
            fill="#fff" stroke="#2563eb" stroke-width="2" stroke-linejoin="round"/>
      <!-- Speaker grille -->
      <circle cx="27" cy="32" r="6" fill="#dbeafe" stroke="#2563eb" stroke-width="1.2"/>
      <circle cx="27" cy="32" r="2" fill="#2563eb"/>
      <!-- Stem tip detail -->
      <line x1="27" y1="92" x2="27" y2="98" stroke="#2563eb" stroke-width="1.5"/>
    </g>
    <!-- Right earbud (mirrored) -->
    <g transform="translate(155, 60)">
      <rect x="20" y="38" width="14" height="60" rx="6" fill="#fff" stroke="#2563eb" stroke-width="2"/>
      <path d="M5 32 Q5 12 27 12 Q49 12 49 32 Q49 50 27 52 Q5 50 5 32 Z"
            fill="#fff" stroke="#2563eb" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="27" cy="32" r="6" fill="#dbeafe" stroke="#2563eb" stroke-width="1.2"/>
      <circle cx="27" cy="32" r="2" fill="#2563eb"/>
      <line x1="27" y1="92" x2="27" y2="98" stroke="#2563eb" stroke-width="1.5"/>
    </g>
    <!-- Bluetooth wave hint between them -->
    <path d="M125 120 Q140 115 155 120" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="3,2" opacity="0.5"/>
    <path d="M120 130 Q140 122 160 130" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="3,2" opacity="0.4"/>
  </g>` + SVG_CLOSE;

// 6. Pour-over coffee set — dripper on top of carafe
const pourover = SVG_OPEN + BG.pourover + dots('#a16207') + `
  <g>
    <!-- Steam -->
    <path d="M125 30 Q120 22 125 14" fill="none" stroke="#a16207" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
    <path d="M140 28 Q145 18 140 10" fill="none" stroke="#a16207" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
    <path d="M155 30 Q150 22 155 14" fill="none" stroke="#a16207" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
    <!-- Dripper top rim -->
    <ellipse cx="140" cy="46" rx="40" ry="6" fill="#fff" stroke="#a16207" stroke-width="2"/>
    <!-- Dripper cone -->
    <path d="M100 46 L130 110 L150 110 L180 46 Z" fill="#fff" stroke="#a16207" stroke-width="2" stroke-linejoin="round"/>
    <!-- Filter ridges -->
    <line x1="110" y1="55" x2="115" y2="105" stroke="#a16207" stroke-width="1" opacity="0.5"/>
    <line x1="125" y1="55" x2="125" y2="108" stroke="#a16207" stroke-width="1" opacity="0.5"/>
    <line x1="155" y1="55" x2="155" y2="108" stroke="#a16207" stroke-width="1" opacity="0.5"/>
    <line x1="170" y1="55" x2="165" y2="105" stroke="#a16207" stroke-width="1" opacity="0.5"/>
    <!-- Drip -->
    <ellipse cx="140" cy="118" rx="3" ry="5" fill="#a16207" opacity="0.7"/>
    <!-- Carafe body -->
    <path d="M105 130 L110 180 Q110 188 118 188 L162 188 Q170 188 170 180 L175 130 Z"
          fill="#fff" stroke="#a16207" stroke-width="2" stroke-linejoin="round"/>
    <!-- Coffee level -->
    <path d="M112 165 L112 180 Q112 184 116 184 L164 184 Q168 184 168 180 L168 165 Q140 170 112 165 Z" fill="#a16207" opacity="0.3"/>
    <!-- Carafe handle -->
    <path d="M170 145 Q190 145 190 165 Q190 180 170 178" fill="none" stroke="#a16207" stroke-width="2" stroke-linecap="round"/>
    <!-- Carafe top opening line -->
    <line x1="105" y1="130" x2="175" y2="130" stroke="#a16207" stroke-width="1" opacity="0.5"/>
  </g>` + SVG_CLOSE;

// 7. Standing desk mat — top-down view with grid texture
const mat = SVG_OPEN + BG.mat + dots('#7e22ce') + `
  <g>
    <!-- Mat shadow -->
    <rect x="36" y="48" width="208" height="120" rx="16" fill="#000" opacity="0.06"/>
    <!-- Mat body -->
    <rect x="32" y="44" width="208" height="120" rx="16" fill="#fff" stroke="#7e22ce" stroke-width="2"/>
    <!-- Inner border -->
    <rect x="42" y="54" width="188" height="100" rx="11" fill="none" stroke="#7e22ce" stroke-width="1" opacity="0.4"/>
    <!-- Foot zones (subtle ovals) -->
    <ellipse cx="105" cy="104" rx="32" ry="22" fill="#7e22ce" opacity="0.06"/>
    <ellipse cx="167" cy="104" rx="32" ry="22" fill="#7e22ce" opacity="0.06"/>
    <ellipse cx="105" cy="104" rx="32" ry="22" fill="none" stroke="#7e22ce" stroke-width="1" stroke-dasharray="3,2" opacity="0.5"/>
    <ellipse cx="167" cy="104" rx="32" ry="22" fill="none" stroke="#7e22ce" stroke-width="1" stroke-dasharray="3,2" opacity="0.5"/>
    <!-- Massage points -->
    <circle cx="92"  cy="104" r="2" fill="#7e22ce"/>
    <circle cx="105" cy="100" r="2" fill="#7e22ce"/>
    <circle cx="118" cy="104" r="2" fill="#7e22ce"/>
    <circle cx="105" cy="110" r="2" fill="#7e22ce"/>
    <circle cx="155" cy="104" r="2" fill="#7e22ce"/>
    <circle cx="167" cy="100" r="2" fill="#7e22ce"/>
    <circle cx="180" cy="104" r="2" fill="#7e22ce"/>
    <circle cx="167" cy="110" r="2" fill="#7e22ce"/>
    <!-- Brand tag -->
    <rect x="124" y="146" width="24" height="6" rx="2" fill="#e9d5ff" stroke="#7e22ce" stroke-width="0.8"/>
    <!-- Beveled edge highlight -->
    <line x1="48" y1="58" x2="224" y2="58" stroke="#fff" stroke-width="1" opacity="0.7"/>
  </g>` + SVG_CLOSE;

// 8. Mechanical keyboard — top-down with key grid
const keyboard = SVG_OPEN + BG.keyboard + dots('#0d9488') + `
  <g>
    <!-- Shadow -->
    <rect x="32" y="62" width="216" height="92" rx="8" fill="#000" opacity="0.07"/>
    <!-- Body -->
    <rect x="28" y="58" width="216" height="92" rx="8" fill="#fff" stroke="#0d9488" stroke-width="2"/>
    <!-- Function row -->
    <g fill="#ccfbf1" stroke="#0d9488" stroke-width="1">
      ${Array.from({ length: 13 }, (_, i) => `<rect x="${36 + i * 16}" y="66" width="13" height="11" rx="2"/>`).join('')}
    </g>
    <!-- Number row -->
    <g fill="#fff" stroke="#0d9488" stroke-width="1">
      ${Array.from({ length: 13 }, (_, i) => `<rect x="${36 + i * 16}" y="80" width="13" height="13" rx="2"/>`).join('')}
      <rect x="244" y="80" width="0" height="0"/>
    </g>
    <!-- Letter rows -->
    ${[97, 114, 131].map((y) => `
      <g fill="#fff" stroke="#0d9488" stroke-width="1">
        ${Array.from({ length: 13 }, (_, i) => `<rect x="${36 + i * 16}" y="${y}" width="13" height="13" rx="2"/>`).join('')}
      </g>
    `).join('')}
    <!-- Highlight WASD-style cluster -->
    <rect x="68"  y="97"  width="13" height="13" rx="2" fill="#0d9488" opacity="0.85"/>
    <rect x="52"  y="114" width="13" height="13" rx="2" fill="#0d9488" opacity="0.85"/>
    <rect x="68"  y="114" width="13" height="13" rx="2" fill="#0d9488" opacity="0.85"/>
    <rect x="84"  y="114" width="13" height="13" rx="2" fill="#0d9488" opacity="0.85"/>
    <!-- Arrow keys -->
    <rect x="196" y="131" width="13" height="6" rx="1" fill="#ccfbf1" stroke="#0d9488" stroke-width="1"/>
    <rect x="180" y="138" width="13" height="6" rx="1" fill="#ccfbf1" stroke="#0d9488" stroke-width="1"/>
    <rect x="196" y="138" width="13" height="6" rx="1" fill="#ccfbf1" stroke="#0d9488" stroke-width="1"/>
    <rect x="212" y="138" width="13" height="6" rx="1" fill="#ccfbf1" stroke="#0d9488" stroke-width="1"/>
    <!-- Subtle RGB glow on the bottom edge -->
    <rect x="32" y="146" width="50"  height="3" rx="1.5" fill="#1ABB9C" opacity="0.6"/>
    <rect x="86" y="146" width="50"  height="3" rx="1.5" fill="#4299e1" opacity="0.6"/>
    <rect x="140" y="146" width="50" height="3" rx="1.5" fill="#ae3ec9" opacity="0.6"/>
    <rect x="194" y="146" width="46" height="3" rx="1.5" fill="#f59f00" opacity="0.6"/>
  </g>` + SVG_CLOSE;

// 9. Merino base layer — long-sleeve shirt outline
const baselayer = SVG_OPEN + BG.baselayer + dots('#0891b2') + `
  <g>
    <!-- Body silhouette (tighter fit than the field shirt) -->
    <path d="M105 65 L105 175 Q105 180 110 180 L170 180 Q175 180 175 175 L175 65 L210 78 L195 50 L165 48 Q140 56 115 48 L85 50 L70 78 Z"
          fill="#fff" stroke="#0891b2" stroke-width="2" stroke-linejoin="round"/>
    <!-- Crew neck collar -->
    <path d="M115 48 Q140 58 165 48 Q160 64 140 64 Q120 64 115 48 Z" fill="#cffafe" stroke="#0891b2" stroke-width="1.8"/>
    <!-- Long sleeves (extend to wrists) -->
    <path d="M70 78 L60 165 Q60 170 65 170 L80 170 Q85 170 85 165 L100 78 Z"
          fill="#fff" stroke="#0891b2" stroke-width="2" stroke-linejoin="round"/>
    <path d="M210 78 L220 165 Q220 170 215 170 L200 170 Q195 170 195 165 L180 78 Z"
          fill="#fff" stroke="#0891b2" stroke-width="2" stroke-linejoin="round"/>
    <!-- Wrist cuff ribbing -->
    <line x1="62" y1="166" x2="83" y2="166" stroke="#0891b2" stroke-width="1" stroke-dasharray="2,1" opacity="0.6"/>
    <line x1="197" y1="166" x2="218" y2="166" stroke="#0891b2" stroke-width="1" stroke-dasharray="2,1" opacity="0.6"/>
    <!-- Hem ribbing -->
    <line x1="107" y1="174" x2="173" y2="174" stroke="#0891b2" stroke-width="1" stroke-dasharray="2,1" opacity="0.6"/>
    <!-- Merino texture (subtle vertical lines) -->
    <line x1="120" y1="80" x2="120" y2="170" stroke="#0891b2" stroke-width="0.5" opacity="0.3"/>
    <line x1="135" y1="78" x2="135" y2="170" stroke="#0891b2" stroke-width="0.5" opacity="0.3"/>
    <line x1="145" y1="78" x2="145" y2="170" stroke="#0891b2" stroke-width="0.5" opacity="0.3"/>
    <line x1="160" y1="80" x2="160" y2="170" stroke="#0891b2" stroke-width="0.5" opacity="0.3"/>
    <!-- Brand mark -->
    <circle cx="140" cy="100" r="5" fill="none" stroke="#0891b2" stroke-width="1.2"/>
    <line x1="140" y1="97" x2="140" y2="103" stroke="#0891b2" stroke-width="1.2"/>
  </g>` + SVG_CLOSE;

export const PRODUCT_IMAGES = {
  hoodie, shirt, sneakers, bag, earbuds, pourover, mat, keyboard, baselayer
};
