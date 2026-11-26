// Unit 12 · Think About the Worst Case (t26 The Pigeonhole Principle) — original content, Singapore context.
import * as A from '../art.js';
const { svg, kid } = A;
const INK = A.ink, S = A.stroke;
const S2 = `stroke="${INK}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"`;
const HEAD = 'font-family="Baloo 2, sans-serif" font-weight="800"';
const BODY = 'font-family="Nunito, sans-serif" font-weight="800"';
const TEAL = '#0f9d94', CORAL = '#ff6b5b', SUN = '#ffc94a', GRAPE = '#7b61ff', LEAF = '#3dbb6b', SKY = '#4aa8ff';

const nb = t => t.replace(/ /g, '&nbsp;');   // keep a short sum on one line

// sweet flavours (colour + letter, so the picture works without colour too)
const FL = {
  S: { c: '#f25c8a', t: 'S', name: 'strawberry' },
  O: { c: '#ff9a2e', t: 'O', name: 'orange' },
  L: { c: '#ffe066', t: 'L', name: 'lemon' },
};
// ice-cream stick colours
const ST = { R: '#e8483f', Y: SUN, G: LEAF, B: SKY };
// sock colours
const SK = { W: '#ffffff', B: '#3b3f58' };

/* ---------- unit helpers (same flat style as art.js) ---------- */

// a pigeon facing right, sitting (or flying). About 46 × 34 at s = 1, centred on (x, y).
function pigeon(x, y, s = 1, { fly = false, hi = false, flip = false } = {}) {
  const wing = fly
    ? `<path d="M-8 -2 q-6 -26 14 -32 q-4 18 4 28z" fill="#7d8aa0" ${S2}/>`
    : `<path d="M-15 0 q12 -11 23 2 q-11 8 -23 -2z" fill="#7d8aa0" ${S2}/>`;
  return `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">
    ${hi ? `<circle cx="0" cy="0" r="25" fill="${SUN}" opacity=".6"/>` : ''}
    ${fly ? '' : `<path d="M-5 13 v6 M4 13 v6" stroke="#e8735f" stroke-width="2.6" stroke-linecap="round"/>`}
    <path d="M-16 2 l-12 -3 l4 11z" fill="#6c7891" ${S2}/>
    <ellipse cx="-2" cy="4" rx="17" ry="11" fill="#b3bdcd" ${S2}/>
    ${wing}
    <ellipse cx="9" cy="-1" rx="6" ry="6" fill="#7fc8a9"/>
    <circle cx="13" cy="-8" r="8" fill="#8f9bb0" ${S2}/>
    <circle cx="15.5" cy="-9.5" r="1.9" fill="${INK}"/>
    <path d="M20.5 -8.5 l6 2 l-6 2z" fill="#f2c38b" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round"/></g>`;
}
// a wrapped fruit sweet with its letter
function sweet(x, y, f, r = 14) {
  const F = FL[f];
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${F.c}" ${S2}/>
    <path d="M${x - r * .5} ${y - r * .45} q${r * .3} -${r * .25} ${r * .6} -${r * .2}" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".85"/>
    <text x="${x}" y="${y + r * .38}" text-anchor="middle" ${HEAD} font-size="${r * 1.05}" fill="${INK}">${F.t}</text>`;
}
// an ice-cream stick standing up
function stick(x, y, c, h = 40) {
  return `<rect x="${x - 6}" y="${y - h / 2}" width="12" height="${h}" rx="6" fill="${c}" ${S2}/>`;
}
// a sock
function sock(x, y, c, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-9 -20 h14 v17 q0 5 6 7 l6 2 q7 3 4 10 q-3 5 -9 3 l-15 -4 q-7 -2 -7 -9z" fill="${c}" ${S2}/>
    <path d="M-9 -15 h14" stroke="${c === SK.W ? '#c9d3e3' : '#6b7190'}" stroke-width="3" stroke-linecap="round"/></g>`;
}
// a curry puff
function puff(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-15 6 a15 14 0 0 1 30 0z" fill="#f2b65a" ${S2}/>
    <path d="M-12 -1 l-3 -2 M-7 -6 l-2 -3 M0 -8 v-3 M7 -6 l2 -3 M12 -1 l3 -2" stroke="#b77a2a" stroke-width="2.2" stroke-linecap="round"/></g>`;
}
function token(kind, x, y, it, r) {
  if (kind === 'stick') return stick(x, y, ST[it], r * 2.6);
  if (kind === 'sock') return sock(x - 2, y + 2, SK[it], r / 16);
  return sweet(x, y, it, r);
}

// Boxes in a row with items stacked inside. boxes: arrays of codes; 'n' = the item that is forced to share (highlighted).
function holes(boxes, { item = 'pigeon', labels = [], note = '', label = 'Items in boxes', max = 320, bw = 78, gap = 14 } = {}) {
  const most = Math.max(1, ...boxes.map(b => b.length)), slot = item === 'pigeon' ? 31 : 26;
  const bh = most * slot + 16, top = 8, W = boxes.length * bw + (boxes.length - 1) * gap + 20;
  let g = '';
  boxes.forEach((b, i) => {
    const x = 10 + i * (bw + gap), hi = b.includes('n');
    g += `<rect x="${x}" y="${top}" width="${bw}" height="${bh}" rx="10" fill="#fff7e8" stroke="${hi ? CORAL : INK}" stroke-width="3"/>`;
    b.forEach((it, j) => {
      const cy = top + bh - 8 - j * slot - slot / 2;
      g += item === 'pigeon' ? pigeon(x + bw / 2 - 2, cy, .6, { hi: it === 'n' }) : puff(x + bw / 2, cy + 2, .95);
    });
    g += `<text x="${x + bw / 2}" y="${top + bh + 24}" text-anchor="middle" ${HEAD} font-size="18" fill="${hi ? '#d6453a' : INK}">${labels[i] ? labels[i] + ': ' : ''}${b.length}</text>`;
  });
  const H = top + bh + 34 + (note ? 26 : 0);
  if (note) g += `<text x="${W / 2}" y="${H - 8}" text-anchor="middle" ${BODY} font-size="17" fill="${TEAL}">${note}</text>`;
  return svg(`0 0 ${W} ${H}`, g, label, `style="max-width:${max}px"`);
}

// The "worst case" row: the unlucky picks, then the pick that makes it sure.
function pickRow(items, { kind = 'sweet', sp = 46, r = 16, x0 = 44, label = 'Unlucky picks, then the pick that makes it sure', max = 340, under = 'any!' } = {}) {
  const n = items.length + 1, cy = 72, W = x0 * 2 + (n - 1) * sp;
  const xa = x0 - r - 4, xb = x0 + (n - 2) * sp + r + 4, xl = x0 + (n - 1) * sp;
  let g = `<path d="M${xa} 44 v-8 H${xb} v8" fill="none" stroke="${CORAL}" stroke-width="3" stroke-linecap="round"/>
    <text x="${(xa + xb) / 2}" y="26" text-anchor="middle" ${BODY} font-size="15" fill="#d6453a">unlucky picks</text>
    <text x="${xl}" y="26" text-anchor="middle" ${BODY} font-size="15" fill="#0f7a73">sure!</text>`;
  items.forEach((it, i) => {
    g += token(kind, x0 + i * sp, cy, it, r);
    g += `<text x="${x0 + i * sp}" y="122" text-anchor="middle" ${BODY} font-size="14" fill="#55607a">${i + 1}</text>`;
  });
  g += `<circle cx="${xl}" cy="${cy}" r="${r + 5}" fill="#e3f7f5" stroke="${TEAL}" stroke-width="3" stroke-dasharray="5 4"/>
    <text x="${xl}" y="${cy + 8}" text-anchor="middle" ${HEAD} font-size="${r + 6}" fill="${TEAL}">?</text>
    <text x="${xl}" y="122" text-anchor="middle" ${BODY} font-size="14" fill="#0f7a73">${n}${under ? ': ' + under : ''}</text>`;
  return svg(`0 0 ${W} 132`, g, label, `style="max-width:${max}px"`);
}

// Worst case in groups: [{f, n, sure}] → e.g. all the orange + all the lemon + 2 strawberry
function groupRow(groups, { label = 'Worst case in groups', max = 260 } = {}) {
  const cw = 70, pw = 16;
  let x = 6, g = '';
  groups.forEach((gr, i) => {
    const cx = x + cw / 2;
    g += gr.sure
      ? `<rect x="${x + 2}" y="6" width="${cw - 4}" height="104" rx="12" fill="#e3f7f5" stroke="${TEAL}" stroke-width="3"/>`
      : `<rect x="${x + 2}" y="6" width="${cw - 4}" height="104" rx="12" fill="#fff1ef" stroke="${CORAL}" stroke-width="2.5" stroke-dasharray="6 4"/>`;
    g += sweet(cx, 32, gr.f, 16) + `<text x="${cx}" y="74" text-anchor="middle" ${HEAD} font-size="24" fill="${INK}">×${gr.n}</text>`;
    g += `<text x="${cx}" y="98" text-anchor="middle" ${BODY} font-size="15" fill="${gr.sure ? '#0f7a73' : '#d6453a'}">${gr.sure ? 'sure!' : 'unlucky'}</text>`;
    x += cw;
    if (i < groups.length - 1) { g += `<text x="${x + pw / 2}" y="66" text-anchor="middle" ${HEAD} font-size="24" fill="${INK}">+</text>`; x += pw; }
  });
  return svg(`0 0 ${x + 6} 116`, g, label, `style="max-width:${max}px"`);
}

// a clear bag of sweets
function sweetBag(cx, y, list, { w = 124, h = 138 } = {}) {
  const x0 = cx - w / 2;
  let g = `<path d="M${x0 + 10} ${y + 24} H${x0 + w - 10} L${x0 + w} ${y + h - 12} Q${x0 + w} ${y + h} ${x0 + w - 12} ${y + h} H${x0 + 12} Q${x0} ${y + h} ${x0} ${y + h - 12}z" fill="#eef7ff" ${S}/>
    <path d="M${cx - 16} ${y + 24} l-10 -20 h18 l8 13 l8 -13 h18 l-10 20z" fill="#eef7ff" ${S}/>
    <rect x="${cx - 9}" y="${y + 12}" width="18" height="11" rx="4" fill="${CORAL}" ${S2}/>`;
  const cols = Math.floor((w - 16) / 25), r = 10.5;
  list.forEach((f, i) => {
    const c = i % cols, rw = Math.floor(i / cols);
    const jx = ((i * 37) % 7) - 3, jy = ((i * 53) % 5) - 2;
    g += sweet(x0 + 14 + r + c * 25 + (rw % 2 ? 6 : 0) + jx * .6, y + h - 18 - rw * 23 + jy, f, r);
  });
  return g;
}
// pairs of number cards that add up to 11
function pairBoxes() {
  let g = '';
  [[1, 10], [2, 9], [3, 8], [4, 7], [5, 6]].forEach(([a, b], i) => {
    const x = 8 + (i % 3) * 72 + (i >= 3 ? 36 : 0), y = 8 + Math.floor(i / 3) * 88;
    g += `<rect x="${x}" y="${y}" width="64" height="60" rx="10" fill="#fff7e8" ${S2}/>`;
    [a, b].forEach((n, j) => {
      g += `<rect x="${x + 6 + j * 27}" y="${y + 10}" width="25" height="38" rx="5" fill="#fff" ${S2}/>
        <text x="${x + 18.5 + j * 27}" y="${y + 36}" text-anchor="middle" ${HEAD} font-size="${n === 10 ? 15 : 19}" fill="${INK}">${n}</text>`;
    });
    g += `<text x="${x + 32}" y="${y + 80}" text-anchor="middle" ${BODY} font-size="15" fill="${TEAL}">= 11</text>`;
  });
  return svg('0 0 230 180', g, 'Five boxes, each holding two cards that add up to 11: 1 and 10, 2 and 9, 3 and 8, 4 and 7, 5 and 6', 'style="max-width:230px"');
}
// banner columns (top and bottom square), colours R / W / Y
const BC = { R: '#e0282e', W: '#ffffff', Y: SUN };
function column(x, y, top, bot, s = 30, letters = true) {
  const sq = (yy, c) => `<rect x="${x}" y="${yy}" width="${s}" height="${s}" fill="${BC[c]}" ${S2}/>` +
    (letters ? `<text x="${x + s / 2}" y="${yy + s / 2 + 6}" text-anchor="middle" ${BODY} font-size="15" fill="${c === 'R' ? '#fff' : INK}">${c}</text>` : '');
  return sq(y, top) + sq(y + s, bot);
}
function patterns() {
  const P = [['R', 'W'], ['R', 'Y'], ['W', 'R'], ['W', 'Y'], ['Y', 'R'], ['Y', 'W']];
  let g = '';
  P.forEach(([t, b], i) => { g += column(8 + i * 42, 8, t, b) + `<text x="${23 + i * 42}" y="88" text-anchor="middle" ${BODY} font-size="14" fill="#55607a">${i + 1}</text>`; });
  return svg('0 0 256 96', g, 'The 6 ways to colour a column: red over white, red over yellow, white over red, white over yellow, yellow over red, yellow over white', 'style="max-width:256px"');
}

/* ---------- pictures ---------- */
const bannerArt = () => {
  // a wooden pigeonhole cabinet with 3 holes, one pigeon in each, and a 4th flying in
  let cab = `<rect x="34" y="76" width="226" height="112" rx="10" fill="#c98b55" ${S}/>`;
  for (let i = 0; i < 3; i++) cab += `<rect x="${46 + i * 70}" y="88" width="62" height="86" rx="6" fill="#6e4a2c" ${S}/>
    <text x="${77 + i * 70}" y="207" text-anchor="middle" ${HEAD} font-size="16" fill="${INK}">hole ${i + 1}</text>`;
  return svg('0 0 360 220', `<rect width="360" height="220" rx="20" fill="#e4f5f3"/>
    ${A.cloud(250, 120, .8)}
    <text x="24" y="38" ${HEAD} font-size="22" fill="${INK}">4 pigeons, 3 holes…</text>
    <text x="24" y="62" ${BODY} font-size="15" fill="#d6453a">someone is sure to share!</text>
    ${cab}
    ${pigeon(77, 150, .95)}${pigeon(147, 150, .95)}${pigeon(217, 150, .95)}
    ${pigeon(300, 78, 1.05, { fly: true, flip: true })}
    <text x="318" y="46" ${HEAD} font-size="30" fill="${CORAL}">?</text>
    <path d="M276 98 q-18 14 -40 30" fill="none" stroke="${CORAL}" stroke-width="3" stroke-dasharray="6 5" stroke-linecap="round"/>
    <path d="M236 128 l2 -11 M236 128 l11 -3" stroke="${CORAL}" stroke-width="3" stroke-linecap="round"/>`,
  'A wooden cabinet with 3 pigeonholes, one pigeon in each, and a 4th pigeon flying towards it');
};

const exploreArt = () => {
  const sec = [61, 170, 279];
  return svg('0 0 340 300', `<rect width="340" height="300" rx="20" fill="#e6f4ff"/>
    ${A.hdb(26, 52, 86, 110, '#cdeee0', 5)}${A.hdb(220, 44, 96, 118, '#ffd2cc', 5)}${A.cloud(120, 46, .7)}
    <rect x="0" y="0" width="340" height="30" fill="#dfe6ee"/><path d="M0 30 h340" ${S}/>
    <rect x="0" y="236" width="340" height="64" fill="#e8dcc8"/>
    <rect x="0" y="160" width="340" height="76" fill="#f4efe6" ${S}/>
    <rect x="-4" y="150" width="348" height="12" rx="5" fill="#8fb5c9" ${S}/>
    ${[0, 108, 216, 324].map(x => `<rect x="${x}" y="28" width="16" height="208" fill="#f4efe6" ${S}/>`).join('')}
    ${sec.map((x, i) => `<circle cx="${x}" cy="184" r="12" fill="${TEAL}"/><text x="${x}" y="190" text-anchor="middle" ${HEAD} font-size="16" fill="#fff">${'ABC'[i]}</text>`).join('')}
    ${pigeon(60, 132, .72)}${pigeon(176, 132, .72, { flip: true })}${pigeon(258, 132, .72)}${pigeon(300, 132, .72, { flip: true })}
    <path d="M0 236 h340" ${S}/>
    ${kid('arjun', { x: 52, y: 230, s: .58, pose: 'think', mood: 'think' })}
    ${kid('aisyah', { x: 296, y: 230, s: .58, pose: 'wave', flip: true })}`,
  'An HDB corridor on the 9th floor: pillars split the railing into sections A, B and C. Four pigeons rest on it, two of them in section C. Arjun and Aisyah watch.');
};

const bagStep = () => {
  const list = ['S', 'O', 'L', 'S', 'O', 'S', 'L', 'O', 'S', 'L', 'O', 'S'];
  return svg('0 0 330 180', `${sweetBag(84, 14, list)}
    ${sweet(196, 62, 'S', 13)}<text x="216" y="68" ${BODY} font-size="16" fill="${INK}">5 strawberry</text>
    ${sweet(196, 100, 'O', 13)}<text x="216" y="106" ${BODY} font-size="16" fill="${INK}">4 orange</text>
    ${sweet(196, 138, 'L', 13)}<text x="216" y="144" ${BODY} font-size="16" fill="${INK}">3 lemon</text>`,
  'A clear bag of 12 fruit sweets: 5 strawberry, 4 orange and 3 lemon', 'style="max-width:330px"');
};

/* ---------- question pictures ---------- */
const puffArt = (() => {
  let g = '';
  for (let i = 0; i < 9; i++) g += puff(30 + (i % 3) * 34 + (Math.floor(i / 3) % 2) * 10, 32 + Math.floor(i / 3) * 28, 1.05);
  g += `<path d="M136 62 h24 l-6 -6 M160 62 l-6 6" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
  for (let i = 0; i < 4; i++) {
    const x = 174 + i * 46;
    g += `<path d="M${x} 46 h38 l-3 40 h-32z" fill="#fff" ${S2}/><path d="M${x} 46 l-6 -12 h38 l6 12" fill="#f1f4f9" ${S2}/>`;
  }
  g += `<text x="74" y="118" text-anchor="middle" ${BODY} font-size="15" fill="#55607a">9 curry puffs</text><text x="262" y="118" text-anchor="middle" ${BODY} font-size="15" fill="#55607a">4 boxes</text>`;
  return svg('0 0 362 128', g, 'Nine curry puffs and four empty boxes', 'style="max-width:362px"');
})();

const drawerArt = (() => {
  const socks = [['W', 30, 52, -10], ['B', 66, 48, 8], ['W', 100, 56, 4], ['B', 132, 50, -6], ['W', 162, 54, 12], ['B', 192, 50, -4]];
  return svg('0 0 236 120', `<rect width="236" height="120" rx="14" fill="#2f3b5c"/>
    <circle cx="208" cy="22" r="10" fill="#fff3b0"/><circle cx="214" cy="18" r="9" fill="#2f3b5c"/>
    <rect x="12" y="30" width="200" height="66" rx="6" fill="#a8774f" ${S}/><rect x="18" y="34" width="188" height="54" rx="4" fill="#5e4130"/>
    ${socks.map(([c, x, y, rot]) => `<g transform="rotate(${rot} ${x} ${y})">${sock(x, y, SK[c], .9)}</g>`).join('')}
    <rect x="12" y="84" width="200" height="22" rx="5" fill="#c08a5c" ${S}/><rect x="98" y="91" width="28" height="7" rx="3.5" fill="${INK}"/>`,
  'A drawer of white and black socks mixed together, in a dark room', 'style="max-width:240px"');
})();

const stickArt = (() => {
  const cols = ['R', 'Y', 'G', 'B', 'R', 'G', 'Y', 'B', 'R', 'Y', 'G', 'B'];
  return svg('0 0 200 140', `${cols.map((c, i) => `<g transform="rotate(${(i - 5.5) * 3.2} 100 120)">${stick(46 + i * 9.6, 52, ST[c], 70)}</g>`).join('')}
    <path d="M40 64 h120 l-10 70 h-100z" fill="${GRAPE}" ${S}/><text x="100" y="108" text-anchor="middle" ${HEAD} font-size="16" fill="#fff">ART</text>`,
  'A box of red, yellow, green and blue ice-cream sticks', 'style="max-width:190px"');
})();

const boardArt = (() => {
  const bag = (x, y, c) => `<path d="M${x - 11} ${y - 8} q11 -6 22 0 q4 8 0 16 q-11 6 -22 0 q-4 -8 0 -16z" fill="${c}" ${S2}/>`;
  return svg('0 0 350 130', `<rect x="10" y="10" width="262" height="104" rx="12" fill="${SKY}" ${S}/>
    ${[1, 2, 3].map((p, i) => `<circle cx="${54 + i * 87}" cy="52" r="24" fill="#23304a"/><circle cx="${54 + i * 87}" cy="52" r="24" fill="none" stroke="#fff" stroke-width="3"/>
      <text x="${54 + i * 87}" y="100" text-anchor="middle" ${HEAD} font-size="17" fill="#fff">${p} point${p > 1 ? 's' : ''}</text>`).join('')}
    ${bag(306, 40, CORAL)}${bag(322, 70, SUN)}${bag(300, 96, LEAF)}
    <text x="310" y="126" text-anchor="middle" ${BODY} font-size="13" fill="#55607a">3 bean bags</text>`,
  'A carnival board with three holes worth 1, 2 and 3 points, and three bean bags', 'style="max-width:350px"');
})();

const angbaoArt = (() => {
  let g = '';
  for (let i = 0; i < 12; i++) {
    const x = 10 + i * 26;
    g += `<rect x="${x}" y="10" width="20" height="32" rx="3" fill="#e0282e" ${S2}/><path d="M${x} 16 l10 7 l10 -7" fill="none" stroke="#ffd45c" stroke-width="2"/><circle cx="${x + 10}" cy="31" r="4" fill="#ffd45c"/>`;
  }
  g += `<text x="160" y="60" text-anchor="middle" ${BODY} font-size="13" fill="#55607a">12 ang baos</text>`;
  for (let i = 0; i < 3; i++) g += `<g transform="translate(${96 + i * 14} ${70 + i * 3})"><rect width="64" height="30" rx="3" fill="#b9a2e6" ${S2}/><text x="32" y="21" text-anchor="middle" ${HEAD} font-size="16" fill="${INK}">$2</text></g>`;
  g += `<text x="210" y="96" ${BODY} font-size="13" fill="#55607a">$2 notes</text>`;
  return svg('0 0 324 112', g, 'Twelve red ang bao packets and a stack of 2-dollar notes', 'style="max-width:330px"');
})();

const sweetsArt = (() => {
  // exact counts: 8 O, 6 L, 5 S
  const fixed = ['O', 'L', 'S', 'O', 'L', 'O', 'S', 'O', 'L', 'S', 'O', 'L', 'O', 'S', 'L', 'O', 'S', 'L', 'O'];
  return svg('0 0 330 190', `${sweetBag(86, 10, fixed, { w: 150, h: 160 })}
    ${sweet(196, 64, 'O', 13)}<text x="216" y="70" ${BODY} font-size="16" fill="${INK}">8 orange</text>
    ${sweet(196, 102, 'L', 13)}<text x="216" y="108" ${BODY} font-size="16" fill="${INK}">6 lemon</text>
    ${sweet(196, 140, 'S', 13)}<text x="216" y="146" ${BODY} font-size="16" fill="${INK}">5 strawberry</text>`,
  'A bag of 19 sweets: 8 orange, 6 lemon and 5 strawberry', 'style="max-width:330px"');
})();

const cardArt = (() => {
  let g = '';
  for (let n = 1; n <= 10; n++) {
    const x = 8 + (n - 1) * 33;
    g += `<rect x="${x}" y="8" width="28" height="40" rx="5" fill="#fff" ${S2}/><text x="${x + 14}" y="35" text-anchor="middle" ${HEAD} font-size="${n === 10 ? 15 : 18}" fill="${INK}">${n}</text>`;
  }
  return svg('0 0 344 56', g, 'Ten number cards, 1 to 10', 'style="max-width:344px"');
})();

const bannerStrip = (() => {
  const cols = [['R', 'W'], ['W', 'R'], ['Y', 'R'], ['R', 'Y'], ['W', 'Y'], ['R', 'W'], ['Y', 'W']];
  let g = cols.map(([t, b], i) => column(10 + i * 34, 10, t, b, 34, true)).join('');
  g += `<rect x="248" y="10" width="34" height="34" fill="#fff" stroke="#9aa6bd" stroke-width="2" stroke-dasharray="5 4"/><rect x="248" y="44" width="34" height="34" fill="#fff" stroke="#9aa6bd" stroke-width="2" stroke-dasharray="5 4"/>
    <text x="296" y="50" ${HEAD} font-size="22" fill="${INK}">…</text>`;
  return svg('0 0 326 88', g, 'Part of a banner with two rows of squares coloured red, white and yellow; in every column the two squares are different colours', 'style="max-width:330px"');
})();

/* ===================== Topic 26: The Pigeonhole Principle ===================== */
const t26 = {
  id: 't26',
  title: 'The Pigeonhole Principle',
  intro: 'Four pigeons, three holes: someone has to share! This simple idea lets you be <b>100% sure</b> of things without checking. The trick is to imagine the <b>unluckiest</b> case.',
  skills: ['Worst-case thinking', 'Division with remainder', 'Finding the boxes'],
  art: bannerArt,
  explore: {
    setup: 'On the 9th floor of an HDB block in Tampines, Arjun and Aisyah are waiting for the lift. Pillars split the corridor railing into <b>3 sections</b>, A, B and C, and pigeons like to rest there. (Remember: feeding pigeons is not allowed!)',
    art: exploreArt,
    steps: [
      { who: 'arjun', mood: 'think', text: 'Look, <b>4</b> pigeons have landed on the railing, and two of them are squeezed into section C. Was that just bad luck for them?' },
      { who: 'aisyah', text: 'Let\'s try to keep them apart. Put <b>1</b> pigeon in each section: that uses up 3 pigeons. The 4th pigeon has no empty section left, so it <b>must</b> share with someone!',
        art: () => holes([['g'], ['g'], ['g', 'n']], { labels: ['A', 'B', 'C'], note: 'the 4th pigeon has to share', label: 'Sections A, B and C with 1, 1 and 2 pigeons: the 4th pigeon has to share' }) },
      { who: 'leo', mood: 'teach', text: 'That is the <b>pigeonhole principle</b>: if there are <b>more items than boxes</b>, at least one box is <b>sure</b> to get 2 or more. We can\'t say <i>which</i> box, but we can be 100% sure it happens, every single time.' },
      { who: 'chloe', text: 'What if <b>7</b> pigeons land? Spread them as evenly as possible: 7&nbsp;÷&nbsp;3&nbsp;=&nbsp;2&nbsp;remainder&nbsp;1. Each section gets 2, and the 1 left over makes some section 3. (If every section had 2 or fewer, there could only be 3&nbsp;×&nbsp;2&nbsp;=&nbsp;6 pigeons.)',
        art: () => holes([['g', 'g'], ['g', 'g'], ['g', 'g', 'n']], { labels: ['A', 'B', 'C'], note: '7 ÷ 3 = 2 r 1, so at least 2 + 1 = 3', label: '7 pigeons in 3 sections spread as 2, 2 and 3' }) },
      { who: 'weiming', mood: 'think', text: 'Here\'s a sweeter puzzle! My bag has <b>5 strawberry, 4 orange and 3 lemon</b> sweets. Close your eyes and take some out. How many must you take to be <b>sure</b> of getting 2 of the same flavour?',
        art: bagStep },
      { who: 'leo', mood: 'teach', text: 'If you\'re lucky, 2 sweets might do. But <b>sure</b> means it must work even for the <b>unluckiest</b> person in Singapore! Unluckiest case: strawberry, orange, lemon, all different. The 3 flavours are the boxes, so the next sweet <b>must</b> match one of them. Answer: <b>4</b> sweets.',
        art: () => pickRow(['S', 'O', 'L'], { label: 'Unlucky picks strawberry, orange and lemon; the 4th sweet must match one of them' }) },
      { who: 'aisyah', text: 'And to be sure of <b>2 strawberry</b> sweets? Be very unlucky: all 4 orange and all 3 lemon come out first. Now only strawberries are left, so 2 more sweets give 2 strawberry. That makes 4&nbsp;+&nbsp;3&nbsp;+&nbsp;2&nbsp;=&nbsp;<b>9</b> sweets.',
        art: () => groupRow([{ f: 'O', n: 4 }, { f: 'L', n: 3 }, { f: 'S', n: 2, sure: true }], { label: 'Worst case: all 4 orange, all 3 lemon, then 2 strawberry' }) },
    ],
  },
  keys: [
    { title: 'More items than boxes', text: 'If there are more items than boxes, at least one box <b>must</b> get 2 or more. 13 pupils, 12 months: two of them share a birth month.' },
    { title: 'Share as evenly as you can', text: 'Items ÷ boxes = <i>q</i> remainder <i>r</i>. If <i>r</i> is not 0, some box has at least <b><i>q</i> + 1</b>. If <i>r</i> = 0, some box has at least <i>q</i>. 7 pigeons in 3 holes: 7 ÷ 3 = 2 r 1, so at least 3.' },
    { title: 'Be the unluckiest person', text: 'To be <b>sure</b> of something, imagine the worst possible picks first. Then the <b>next</b> pick makes it certain. Answer = unluckiest case + 1.' },
    { title: 'Find the boxes', text: 'Sometimes you must make the boxes yourself: months, days of the week, colours, possible scores, or pairs of numbers that add up to 11.' },
  ],
  practice: [
    { id: 'a', level: 1, type: 'mcq', prompt: 'Hafiz\'s mum packs <b>9</b> curry puffs into <b>4</b> boxes for a Hari Raya visit. She can pack them any way she likes. Which sentence is <b>sure</b> to be true, however she packs them?',
      art: puffArt,
      options: ['Every box has 2 or more.', 'Some box has 3 or more.', 'Some box is empty.', 'Some box has 4 or more.'], answer: 1,
      hint: 'Try to pack them as evenly as possible, so that no box gets too many. How full is the fullest box then?',
      solution: ['Share as evenly as possible: 9 ÷ 4 = 2 remainder 1. Every box gets 2, and the 1 left over makes one box 3.',
        holes([['p', 'p', 'p'], ['p', 'p'], ['p', 'p'], ['p', 'p']], { item: 'puff', bw: 56, gap: 10, label: 'Nine curry puffs packed 3, 2, 2, 2', max: 240 }),
        'Why is it sure? If every box had 2 or fewer, there would be at most 4 × 2 = 8 curry puffs. But there are 9! So <b>some box has 3 or more</b> curry puffs.',
        'The other sentences are not sure: she could pack 9, 0, 0, 0 (so not every box has 2), or 3, 2, 2, 2 (no box is empty, and no box has 4).'] },
    { id: 'b', level: 1, type: 'blanks', prompt: 'Mrs Pillai\'s P4 class has <b>38</b> pupils. Without knowing anyone\'s birthday, what is the <b>biggest</b> number that makes this sentence <b>sure</b> to be true?<br>"At least ☐ pupils in the class were born in the same month."',
      template: '38 ÷ 12 = {0} remainder {1}<br>At least {2} pupils were born in the same month.', blanks: [{ answer: 3, size: 'sm' }, { answer: 2, size: 'sm' }, { answer: 4, size: 'sm' }],
      hint: 'The 12 months are the boxes. Spread the 38 birthdays over the 12 months as evenly as possible.',
      solution: ['The 12 months are the boxes, and the 38 pupils are the items.', '38 ÷ 12 = 3 remainder 2. If every month had only 3 birthdays, that would be just 12 × 3 = 36 pupils.',
        'The 2 pupils left over must go into months that already have 3, so some month has at least 3 + 1 = <b>4</b> pupils.',
        'We cannot promise 5: the birthdays could be spread as 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, and then no month has 5.'] },
    { id: 'c', level: 1, type: 'blanks', prompt: 'It is 6.15 a.m. Jun Jie does not want to switch on the light and wake his little brother. His drawer has <b>12 white</b> socks and <b>10 black</b> socks, all mixed up, and in the dark he cannot tell the colours apart. What is the smallest number of socks he must take out to be <b>sure</b> of getting a matching pair (2 socks of the same colour)?',
      art: drawerArt,
      template: '{0} socks', blanks: [{ answer: 3, size: 'sm' }],
      hint: 'Be the unluckiest boy in Singapore! How many socks could he take out and still have no matching pair?',
      solution: ['There are only 2 colours, white and black. These are the boxes.', 'Unluckiest case: his first 2 socks are 1 white and 1 black. No pair yet!',
        pickRow(['W', 'B'], { kind: 'sock', sp: 70, r: 16, label: 'Unlucky picks: one white sock and one black sock; the 3rd sock must match one of them', max: 220 }),
        'The 3rd sock must be white or black, so it matches one of them.', 'He must take out <b>3</b> socks. (2 socks might be enough if he is lucky, but that is not <b>sure</b>.)'] },
    { id: 'd', level: 2, type: 'blanks', prompt: 'For a Racial Harmony Day art project, Mr Rahman puts ice-cream sticks in a box: <b>15 red, 15 yellow, 15 green and 15 blue</b>. Nurul takes sticks out without looking. How many must she take out to be <b>sure</b> of getting <b>3</b> sticks of the same colour?',
      art: stickArt,
      template: 'Unluckiest case: the most sticks she can take without getting 3 of one colour is {0}.<br>So she must take {1} sticks to be sure.', blanks: [{ answer: 8 }, { answer: 9 }],
      hint: 'In the unluckiest case she takes as many sticks as possible without 3 of any colour. How many of each colour can she have?',
      solution: ['To avoid 3 of the same colour, she can have at most 2 of each colour.', 'Unluckiest case: 2 red, 2 yellow, 2 green and 2 blue. That is 4 × 2 = <b>8</b> sticks, with no 3 the same.',
        pickRow(['R', 'R', 'Y', 'Y', 'G', 'G', 'B', 'B'], { kind: 'stick', sp: 31, r: 14, x0: 30, under: '', label: 'Unlucky picks: 2 red, 2 yellow, 2 green and 2 blue; the 9th stick must make 3 of one colour', max: 300 }),
        'Whatever colour the next stick is, that colour now has 3.', 'She must take 8 + 1 = <b>9</b> sticks.'] },
    { id: 'e', level: 2, type: 'blanks', prompt: 'At the Children\'s Day carnival at Kumar\'s school, each player throws <b>3</b> bean bags. Every bag lands in one of three holes, worth <b>1, 2 or 3</b> points, and the score is the total of the 3 throws. <b>30</b> pupils play. What is the <b>biggest</b> number that makes this sentence <b>sure</b> to be true?<br>"At least ☐ players got the same score."',
      art: boardArt,
      template: 'Number of different possible scores: {0}<br>At least {1} players got the same score.', blanks: [{ answer: 7 }, { answer: 5 }],
      hint: 'The boxes are the possible scores. What is the lowest score? The highest? Can every score in between happen?',
      solution: ['Lowest score: 1 + 1 + 1 = 3. Highest score: 3 + 3 + 3 = 9.',
        `Every score in between can happen: ${['4 = 1 + 1 + 2', '5 = 1 + 1 + 3', '6 = 1 + 2 + 3', '7 = 1 + 3 + 3', '8 = 2 + 3 + 3'].map(nb).join(', ')}.`,
        'So there are 9 − 3 + 1 = <b>7</b> possible scores. These are the 7 boxes.',
        '30 ÷ 7 = 4 remainder 2. Even if the scores are spread out as evenly as possible (4 players for each score), 2 players are left over.',
        'So at least 4 + 1 = <b>5</b> players got the same score.'] },
    { id: 'f', level: 2, type: 'blanks', prompt: 'At Chinese New Year, Ah Ma has a stack of <b>$2 notes</b> and <b>12</b> ang baos. Her grandchildren help to put every note into an ang bao, any way they like. Ah Ma says: "However you pack them, at least one ang bao will have <b>$10 or more</b>." She is right. What is the <b>smallest</b> number of $2 notes she could have?',
      art: angbaoArt,
      template: '$10 = {0} notes of $2<br>Smallest number of notes: {1}<br>That is ${2} altogether.', blanks: [{ answer: 5, size: 'sm' }, { answer: 49 }, { answer: 98 }],
      hint: 'Think of the unluckiest packing for Ah Ma: what is the greatest number of notes they could pack so that <b>every</b> ang bao has less than $10?',
      solution: ['$10 = 5 notes of $2. So Ah Ma is promising that some ang bao has at least 5 notes.',
        'Unluckiest case for Ah Ma: every ang bao gets only 4 notes ($8). That uses 12 × 4 = 48 notes, and no ang bao has $10.',
        'So with 48 notes (or fewer), Ah Ma could be wrong. With one more note, some ang bao must get a 5th note.',
        'The smallest number is 48 + 1 = <b>49</b> notes, which is 49 × $2 = <b>$98</b>.'] },
    { id: 'g', level: 3, type: 'blanks', prompt: 'Priya is packing Deepavali goodie bags. Her bag of sweets has <b>8 orange</b>, <b>6 lemon</b> and <b>5 strawberry</b> sweets. She takes sweets out without looking.<br>(i) How many must she take out to be <b>sure</b> of getting at least <b>2 strawberry</b> sweets?<br>(ii) How many must she take out to be <b>sure</b> of getting at least <b>one of each</b> flavour?',
      art: sweetsArt,
      template: '(i) {0} sweets<br>(ii) {1} sweets', blanks: [{ answer: 16 }, { answer: 15 }],
      hint: 'Be very unlucky! In (i), which sweets could all come out before any strawberry? In (ii), which flavour could be the very last one to appear?',
      solution: ['(i) Unluckiest case: all 8 orange and all 6 lemon come out first. That is 14 sweets, and still no strawberry.',
        groupRow([{ f: 'O', n: 8 }, { f: 'L', n: 6 }, { f: 'S', n: 2, sure: true }], { label: 'Worst case for (i): 8 orange, 6 lemon, then 2 strawberry' }),
        'Now only strawberry sweets are left, so the next 2 are both strawberry: 14 + 2 = <b>16</b> sweets.',
        '(ii) Unluckiest case: one flavour stays missing for as long as possible. That happens when she takes all of the <b>two biggest</b> groups first: 8 orange + 6 lemon = 14 sweets, with no strawberry.',
        groupRow([{ f: 'O', n: 8 }, { f: 'L', n: 6 }, { f: 'S', n: 1, sure: true }], { label: 'Worst case for (ii): 8 orange, 6 lemon, then 1 strawberry' }),
        'The 15th sweet must be strawberry, and then she has all three flavours: <b>15</b> sweets.',
        'Careful: 3 sweets is the <i>lucky</i> answer, not the <i>sure</i> one!'] },
    { id: 'h', level: 3, type: 'blanks', prompt: 'At a community centre games day, Daniel lays <b>10</b> number cards, 1 to 10, face down. Farah picks cards without looking. What is the <b>smallest</b> number of cards she must pick to be <b>sure</b> that two of her cards add up to <b>11</b>?',
      art: cardArt,
      template: '{0} cards', blanks: [{ answer: 6, size: 'sm' }],
      hint: 'Pair up the cards that add up to 11: 1 + 10, 2 + 9, … How many pairs are there? Make each pair a box.',
      solution: ['Make the boxes from pairs that add up to 11: (1, 10), (2, 9), (3, 8), (4, 7), (5, 6). That is 5 boxes, and every card is in exactly one box.',
        pairBoxes(),
        'Unluckiest case: she picks one card from each box, for example 1, 2, 3, 4 and 5. No two of these add up to 11.',
        'Her 6th card must go into a box that already has a card, and that completes a pair that adds up to 11.',
        'She must pick <b>6</b> cards.'] },
    { id: 'i', level: 3, type: 'blanks', prompt: 'For National Day, Chloe\'s class colours a long paper banner with <b>2 rows</b> of squares, so each column has a top square and a bottom square. They use <b>red, white and yellow</b>, and in every column the top and bottom squares must be <b>different</b> colours.<br>(i) How many different ways are there to colour one column?<br>(ii) What is the smallest number of columns a banner must have to be <b>sure</b> that two columns are coloured exactly the same way?<br>(iii) Chloe\'s banner has <b>20</b> columns. What is the <b>biggest</b> number that makes this sentence <b>sure</b> to be true? "At least ☐ columns are coloured exactly the same way."',
      art: bannerStrip,
      template: '(i) {0} ways<br>(ii) {1} columns<br>(iii) At least {2} columns', blanks: [{ answer: 6, size: 'sm' }, { answer: 7, size: 'sm' }, { answer: 4, size: 'sm' }],
      hint: 'The top square can be any of the 3 colours, and then the bottom square must be one of the other 2. The different column patterns are the boxes.',
      solution: ['(i) Top square: 3 choices. Bottom square: 2 choices (any colour except the top one). So there are 3 × 2 = <b>6</b> ways to colour one column.',
        patterns(),
        '(ii) Unluckiest case: the first 6 columns use all 6 different patterns. The 7th column must repeat one of them. So <b>7</b> columns make it sure.',
        '(iii) 20 columns in 6 boxes: 20 ÷ 6 = 3 remainder 2. Even if the patterns are shared out as evenly as possible (3 columns each), 2 columns are left over.',
        'So some pattern is used at least 3 + 1 = <b>4</b> times.'] },
  ],
  adult: 'Links to school work: the pigeonhole principle is <b>not</b> in the MOE primary syllabus, so this topic is <b>enrichment</b> (it appears often in primary maths olympiad-style competitions). It builds on <b>division with remainder</b> (P3–P4 Whole Numbers): items ÷ boxes = <i>q</i> remainder <i>r</i>, so some box has at least <i>q</i> + 1 when <i>r</i> is not 0 (and at least <i>q</i> when <i>r</i> = 0). The second big idea is <b>worst-case thinking</b>: to be <i>sure</i>, picture the unluckiest picks, then add one more. Common mistakes: giving the <i>lucky</i> answer (for example 2 socks instead of 3); forgetting the "+ 1"; adding 1 even when the remainder is 0 (12 items in 4 boxes only promises 3, not 4); in "sure of 2 strawberry" questions, forgetting that every sweet of the <i>other</i> flavours can come out first; and miscounting the boxes (scores from 3 to 9 give 7 boxes, not 6). Tips: as with model drawing, get your child to <b>draw the boxes</b> (months, colours, scores) and share the items out unit by unit, so the leftover "remainder" items can be seen. Then act it out with a real bag of sweets. Let your child play the "unlucky picker" who tries as hard as possible <i>not</i> to get a pair, and see that the next pick always breaks the streak.',
};

export default { t26 };
