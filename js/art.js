// Original SVG illustration kit for SG Maths Thinkers.
// Flat, rounded, outlined style. All functions return SVG markup strings.
const INK = '#23304a';
const S = `stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
let uid = 0;
const limb = (d, c, w = 10) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w + 5}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
const id = p => `${p}${++uid}`;
export const svg = (vb, inner, label = '', extra = '') =>
  `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}" ${extra}>${label ? `<title>${label}</title>` : ''}${inner}</svg>`;

/* ---------------- Leo the lion cub (mascot) — Singapore red & white ---------------- */
const LN = { mane: '#e0282e', maneD: '#b81d23', face: '#fffaf4', fur: '#fffaf4', belly: '#ffffff', nose: '#7a2a2a', cheek: '#ff9b9b' };
function maneShape(r = 44, bumps = 12, depth = 7) {
  let d = '';
  for (let i = 0; i <= bumps * 2; i++) {
    const a = -Math.PI / 2 + i * Math.PI / bumps;
    const rr = i % 2 ? r : r - depth;
    const x = (rr * Math.cos(a)).toFixed(1), y = (rr * Math.sin(a) * .95).toFixed(1);
    if (i === 0) d += `M${x} ${y}`;
    else { const am = a - Math.PI / bumps / 2, rm = r + depth * .35; d += ` Q${(rm * Math.cos(am)).toFixed(1)} ${(rm * Math.sin(am) * .95).toFixed(1)} ${x} ${y}`; }
  }
  return d + 'Z';
}
function leoHead(mood = 'happy') {
  const eyes = mood === 'happy'
    ? `<path d="M-17 -2 q6 -7 12 0" fill="none" ${S}/><path d="M5 -2 q6 -7 12 0" fill="none" ${S}/>`
    : `<circle cx="-11" cy="-3" r="5" fill="${INK}"/><circle cx="11" cy="-3" r="5" fill="${INK}"/><circle cx="-9.5" cy="-5" r="1.8" fill="#fff"/><circle cx="12.5" cy="-5" r="1.8" fill="#fff"/>`;
  const brows = mood === 'think' ? `<path d="M-18 -14 l10 -3" ${S}/><path d="M8 -18 l10 4" ${S}/>` : '';
  const mouth = mood === 'think'
    ? `<path d="M0 11 v4 M-5 18 q5 -3 10 0" fill="none" ${S} stroke-width="2.6"/>`
    : `<path d="M0 11 v3 M-8 14 q8 10 16 0z" fill="#e9696b" ${S} stroke-width="2.6"/>`;
  return `<path d="${maneShape(50, 13, 9)}" fill="${LN.mane}" ${S}/>
    <path d="${maneShape(40, 13, 6)}" fill="${LN.maneD}" opacity=".35"/>
    <circle cx="-23" cy="-24" r="9" fill="${LN.face}" ${S}/><circle cx="23" cy="-24" r="9" fill="${LN.face}" ${S}/>
    <circle cx="-23" cy="-24" r="4.5" fill="${LN.cheek}"/><circle cx="23" cy="-24" r="4.5" fill="${LN.cheek}"/>
    <ellipse cx="0" cy="2" rx="31" ry="29" fill="${LN.face}" ${S}/>
    <path d="M-8 -26 q8 6 16 0" fill="none" stroke="${LN.mane}" stroke-width="5" stroke-linecap="round"/>
    ${eyes}${brows}
    <ellipse cx="0" cy="12" rx="15" ry="9" fill="#fff"/>
    <path d="M-6 4 h12 l-6 7z" fill="${LN.nose}" stroke="${LN.nose}" stroke-width="2" stroke-linejoin="round"/>
    ${mouth}
    <circle cx="-20" cy="9" r="5" fill="${LN.cheek}" opacity=".6"/><circle cx="20" cy="9" r="5" fill="${LN.cheek}" opacity=".6"/>
`;
}
export function leoFace(mood = 'happy') {
  return svg('-50 -50 100 100', `<circle r="48" fill="${mood === 'happy' ? '#ffe3e3' : mood === 'think' ? '#fff1c7' : '#dcecff'}"/><g transform="translate(0 3) scale(.86)">${leoHead(mood)}</g>`, 'Leo the lion cub');
}
// full-body Leo. pose: 'wave' | 'point' | 'stand'
export function leo({ x = 0, y = 0, s = 1, mood = 'happy', pose = 'wave' } = {}) {
  const armR = pose === 'wave'
    ? `${limb("M26 40 q22 -12 26 -40", LN.fur, 13)}<circle cx="52" cy="-2" r="8" fill="${LN.fur}" ${S}/>`
    : pose === 'point'
      ? `${limb("M26 44 l36 -12", LN.fur, 13)}<circle cx="64" cy="31" r="7.5" fill="${LN.fur}" ${S}/>`
      : `${limb("M28 44 q10 14 6 30", LN.fur, 13)}`;
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M22 92 q34 6 40 -26" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M22 92 q34 6 40 -26" fill="none" stroke="${LN.fur}" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M62 66 q-10 -14 2 -22 q12 6 6 20 q-2 4 -8 2z" fill="${LN.mane}" ${S} stroke-width="2.5"/>
    <path d="M-30 30 q-6 60 10 72 h40 q16 -12 10 -72 z" fill="${LN.fur}" ${S}/>
    <path d="M-15 52 q-2 34 6 44 h18 q8 -10 6 -44 q-15 -8 -30 0z" fill="#fde9e9"/>
    <ellipse cx="-14" cy="104" rx="13" ry="7" fill="${LN.fur}" ${S}/><ellipse cx="14" cy="104" rx="13" ry="7" fill="${LN.fur}" ${S}/>
    ${limb("M-27 44 q-14 14 -8 30", LN.fur, 13)}
    ${armR}
    <path d="M-28 30 q28 16 56 0 l2 12 q-30 16 -60 0z" fill="${LN.mane}" ${S} stroke-width="2.5"/>
    <path d="M6 40 l10 22 l8 -4 l-8 -20z" fill="${LN.mane}" ${S} stroke-width="2.5"/>
    <g fill="#fff"><circle cx="-14" cy="38" r="2"/><circle cx="-2" cy="41" r="2"/><circle cx="12" cy="39" r="2"/><path d="M13 50 l1.2 2.4 2.6.3-1.9 1.8.5 2.6-2.4-1.3-2.4 1.3.5-2.6-1.9-1.8 2.6-.3z"/></g>
    <g>${leoHead(mood)}</g></g>`;
}
/* ---------------- Kids ---------------- */
export const KIDS = {
  weiming: { name: 'Wei Ming', skin: '#f6d2b0', hair: 'short', hairC: '#2b2321', shirt: '#4aa8ff', bottom: '#2f4a7a' },
  aisyah: { name: 'Aisyah', skin: '#d9a77d', hair: 'tudung', hairC: '#ff8fa3', shirt: '#ffc94a', bottom: '#7b61ff' },
  arjun: { name: 'Arjun', skin: '#a8714f', hair: 'curly', hairC: '#1d1716', shirt: '#3dbb6b', bottom: '#3b3f58' },
  chloe: { name: 'Chloe', skin: '#f3cfae', hair: 'ponytail', hairC: '#4a2e22', shirt: '#ff6b5b', bottom: '#0f9d94' },
};
function kidHead(k, mood = 'happy') {
  const { skin, hair, hairC } = k;
  let back = '', front = '';
  if (hair === 'short') front = `<path d="M-30 -6 q-2 -34 30 -34 q32 0 30 34 q-8 -16 -22 -18 q-10 8 -26 4 q-8 4 -12 14z" fill="${hairC}" ${S}/>`;
  if (hair === 'curly') front = `<path d="M-31 -2 q-10 -14 0 -24 q2 -16 18 -16 q10 -10 24 -2 q16 -2 20 12 q12 8 0 30 q-6 -14 -16 -16 q-14 6 -30 0 q-10 4 -16 16z" fill="${hairC}" ${S}/>`;
  if (hair === 'ponytail') {
    back = `<path d="M24 -24 q30 -6 26 30 q-4 16 -14 18 q8 -20 -10 -32z" fill="${hairC}" ${S}/>`;
    front = `<path d="M-31 2 q-4 -40 31 -40 q34 0 31 38 q-10 -24 -30 -26 q-18 6 -32 28z" fill="${hairC}" ${S}/><circle cx="25" cy="-24" r="5" fill="#ffc94a" ${S}/>`;
  }
  if (hair === 'tudung') {
    back = `<path d="M-38 6 q-6 -52 38 -52 q44 0 38 52 q4 30 -8 44 h-60 q-12 -14 -8 -44z" fill="${hairC}" ${S}/>`;
    front = `<path d="M-30 -6 q2 -28 30 -28 q28 0 30 28" fill="none" stroke="${hairC}" stroke-width="8"/>`;
  }
  const eyes = mood === 'happy'
    ? `<path d="M-15 2 q5 -6 10 0 M5 2 q5 -6 10 0" fill="none" ${S}/>`
    : `<circle cx="-10" cy="2" r="4" fill="${INK}"/><circle cx="10" cy="2" r="4" fill="${INK}"/><circle cx="-8.6" cy=".6" r="1.4" fill="#fff"/><circle cx="11.4" cy=".6" r="1.4" fill="#fff"/>`;
  const mouth = mood === 'think' ? `<circle cx="4" cy="17" r="3.5" fill="#c0504d"/>` : `<path d="M-8 13 q8 9 16 0z" fill="#c0504d" ${S} stroke-width="2.4"/>`;
  return `${back}<circle r="31" fill="${skin}" ${S}/>${front}
    <circle cx="-31" cy="6" r="6" fill="${skin}" ${S} ${hair === 'tudung' ? 'opacity="0"' : ''}/><circle cx="31" cy="6" r="6" fill="${skin}" ${S} ${hair === 'tudung' ? 'opacity="0"' : ''}/>
    ${eyes}${mouth}<circle cx="-18" cy="11" r="5" fill="#ff8a7a" opacity=".45"/><circle cx="18" cy="11" r="5" fill="#ff8a7a" opacity=".45"/>`;
}
export function kid(key, { x = 0, y = 0, s = 1, mood = 'happy', pose = 'stand', flip = false } = {}) {
  const k = KIDS[key] || key;
  const armL = `${limb("M-20 44 q-14 16 -12 34", k.skin, 10)}`;
  const armR = pose === 'wave'
    ? `${limb("M20 44 q20 -8 22 -36", k.skin, 10)}<circle cx="42" cy="6" r="7" fill="${k.skin}" ${S}/>`
    : pose === 'cheer'
      ? `${limb("M20 44 q16 -16 14 -40", k.skin, 10)}${limb("M-20 44 q-16 -16 -14 -40", k.skin, 10)}`
      : pose === 'think'
        ? `${limb("M20 44 q14 4 -2 -18", k.skin, 10)}`
        : `${limb("M20 44 q14 16 12 34", k.skin, 10)}`;
  return `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">
    <rect x="-15" y="84" width="10" height="26" rx="4" fill="${k.skin}" ${S} stroke-width="2.4"/><rect x="5" y="84" width="10" height="26" rx="4" fill="${k.skin}" ${S} stroke-width="2.4"/>
    <ellipse cx="-11" cy="112" rx="10" ry="5" fill="#fff" ${S} stroke-width="2.4"/><ellipse cx="11" cy="112" rx="10" ry="5" fill="#fff" ${S} stroke-width="2.4"/>
    <path d="M-22 70 h44 l4 22 h-52z" fill="${k.bottom}" ${S}/>
    ${pose === 'cheer' ? '' : armL}${armR}
    <path d="M-24 36 q24 -10 48 0 l2 38 h-52z" fill="${k.shirt}" ${S}/>
    <path d="M-8 34 l8 8 l8 -8" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
    <g transform="translate(0 0)">${kidHead(k, mood)}</g></g>`;
}
export function kidFace(key, mood = 'happy') {
  const k = KIDS[key];
  return svg('-50 -50 100 100', `<circle r="48" fill="#eef5ff"/><g transform="translate(0 6) scale(.95)">${kidHead(k, mood)}</g>`, k.name);
}

/* ---------------- scenery bits ---------------- */
export function cloud(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})" opacity=".95"><path d="M0 20 q-2 -20 20 -18 q6 -16 26 -10 q16 -10 28 6 q18 0 16 22z" fill="#fff"/></g>`;
}
export function tree(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-5 0 q2 -30 -2 -50 h14 q-4 20 -2 50z" fill="#8a5a3c" ${S}/>
   <path d="M-52 -46 q-6 -26 22 -30 q8 -22 34 -16 q24 -12 40 8 q26 2 18 30 q-4 10 -20 10 h-80 q-14 0 -14 -2z" fill="#3dbb6b" ${S}/>
   <path d="M-30 -60 q10 -8 20 -4 M14 -66 q12 -4 22 6" fill="none" stroke="#2c9654" stroke-width="3" stroke-linecap="round"/></g>`;
}
export function hdb(x, y, w, h, c, floors) {
  let win = '';
  const fh = h / floors;
  for (let f = 0; f < floors - 1; f++) for (let i = 0; i < Math.floor(w / 18); i++)
    win += `<rect x="${x + 8 + i * 18}" y="${y + 10 + f * fh}" width="10" height="${fh * .45}" rx="2" fill="#cfe9ff"/>`;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${c}" ${S}/>${win}
    <rect x="${x - 4}" y="${y - 8}" width="${w + 8}" height="12" rx="4" fill="#fff" ${S}/>
    <rect x="${x + w / 2 - 12}" y="${y + h - 24}" width="24" height="24" fill="#5d6b88"/>`;
}
export function mrt(x, y, s = 1) {
  const car = cx => `<rect x="${cx}" y="0" width="96" height="36" rx="12" fill="#f4f6fb" ${S}/>
    <rect x="${cx}" y="22" width="96" height="6" fill="#e1484b"/>
    <rect x="${cx + 10}" y="7" width="20" height="12" rx="3" fill="#8fc8ff"/><rect x="${cx + 38}" y="7" width="20" height="12" rx="3" fill="#8fc8ff"/><rect x="${cx + 66}" y="7" width="20" height="12" rx="3" fill="#8fc8ff"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})">${car(0)}${car(100)}${car(200)}
    <path d="M296 0 q20 0 22 30 v6 h-24z" fill="#f4f6fb" ${S}/></g>`;
}

/* ---------------- Hero (home) ---------------- */
export function heroScene() {
  const g = id('sky');
  return svg('0 0 520 400', `
  <defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fdcff"/><stop offset="1" stop-color="#e9f9ff"/></linearGradient></defs>
  <rect width="520" height="400" rx="28" fill="url(#${g})"/>
  <circle cx="440" cy="70" r="34" fill="#ffd45c"/><circle cx="440" cy="70" r="46" fill="#ffd45c" opacity=".25"/>
  ${cloud(40, 50, 1.1)}${cloud(250, 30, .8)}${cloud(330, 100, .7)}
  ${hdb(30, 120, 90, 170, '#ffe3b3', 8)}${hdb(132, 90, 80, 200, '#cdeee0', 9)}${hdb(380, 130, 100, 160, '#ffd2cc', 7)}
  <rect x="0" y="246" width="520" height="16" fill="#c9cfdc" ${S}/>
  <rect x="80" y="262" width="16" height="40" fill="#c9cfdc" ${S}/><rect x="300" y="262" width="16" height="40" fill="#c9cfdc" ${S}/>
  ${mrt(150, 212, .72)}
  <path d="M0 300 q130 -20 260 0 t260 0 v100 h-520z" fill="#8edb9f"/>
  <path d="M0 330 q130 -14 260 0 t260 0 v70 h-520z" fill="#6fcf87"/>
  ${tree(470, 330, .8)}${tree(46, 335, .7)}
  ${kid('aisyah', { x: 72, y: 250, s: .95, pose: 'wave' })}
  ${kid('weiming', { x: 166, y: 258, s: .9, pose: 'cheer' })}
  ${kid('arjun', { x: 362, y: 254, s: .92, pose: 'think', mood: 'think' })}
  ${kid('chloe', { x: 452, y: 260, s: .88, pose: 'wave', flip: true })}
  <g class="float">${leo({ x: 264, y: 246, s: .98, pose: 'wave' })}</g>
  <g font-family="Baloo 2, sans-serif" font-weight="800">
    <text x="230" y="150" font-size="34" fill="#ff6b5b">+</text><text x="330" y="150" font-size="30" fill="#7b61ff">×</text>
    <text x="20" y="110" font-size="30" fill="#0f9d94">½</text><text x="292" y="120" font-size="34" fill="#ffb000">?</text>
    <text x="455" y="150" font-size="26" fill="#4aa8ff">0.5</text>
  </g>`, 'Pupils and Leo the lion cub in a Singapore estate');
}

/* ---------------- Unit icons ---------------- */
export const UNIT_ICONS = {
  number: () => svg('0 0 64 64', `<rect x="6" y="10" width="52" height="44" rx="10" fill="#fff"/><text x="32" y="42" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="22" fill="#0f9d94">1.5</text><circle cx="46" cy="20" r="3" fill="#ff6b5b"/>`, ''),
  calc: () => svg('0 0 64 64', `<rect x="10" y="6" width="44" height="52" rx="8" fill="#fff"/><rect x="16" y="12" width="32" height="12" rx="3" fill="#bfe9e6"/><g fill="#ff6b5b"><circle cx="22" cy="34" r="4"/><circle cx="32" cy="34" r="4"/><circle cx="42" cy="34" r="4"/><circle cx="22" cy="46" r="4"/><circle cx="32" cy="46" r="4"/></g><rect x="38" y="42" width="8" height="8" rx="2" fill="#ffc94a"/>`, ''),
  geometry: () => svg('0 0 64 64', `<polygon points="14,48 30,14 46,48" fill="#ffc94a" ${S} stroke-width="2.5"/><rect x="34" y="30" width="22" height="22" rx="3" fill="#4aa8ff" ${S} stroke-width="2.5"/><circle cx="16" cy="18" r="8" fill="#ff6b5b" ${S} stroke-width="2.5"/>`, ''),
  logic: () => svg('0 0 64 64', `<path d="M32 8 a18 18 0 0 1 10 33 v7 h-20 v-7 a18 18 0 0 1 10 -33z" fill="#ffe27a" ${S} stroke-width="2.5"/><rect x="24" y="50" width="16" height="6" rx="2" fill="#fff" ${S} stroke-width="2.5"/><path d="M28 30 l4 4 l4 -4" fill="none" ${S} stroke-width="2.5"/>`, ''),
  model: () => svg('0 0 64 64', `<path d="M8 42 h48 l-8 12 h-32z" fill="#ff6b5b" ${S} stroke-width="2.5"/><path d="M32 8 v34" ${S} stroke-width="2.5"/><path d="M33 10 l18 26 h-18z" fill="#fff" ${S} stroke-width="2.5"/><path d="M4 58 q8 -4 14 0 t14 0 t14 0 t14 0" fill="none" stroke="#fff" stroke-width="3"/>`, ''),
  bar: () => svg('0 0 64 64', `<rect x="6" y="14" width="40" height="14" rx="3" fill="#ffc94a" ${S} stroke-width="2.5"/><rect x="6" y="36" width="52" height="14" rx="3" fill="#4aa8ff" ${S} stroke-width="2.5"/><path d="M46 36 v14" ${S} stroke-width="2.5"/>`, ''),
  back: () => svg('0 0 64 64', `<path d="M50 34 a18 18 0 1 1 -6 -16" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/><path d="M46 8 l0 12 l-12 0" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`, ''),
  suppose: () => svg('0 0 64 64', `<rect x="8" y="10" width="48" height="36" rx="12" fill="#fff"/><path d="M20 46 l-4 10 l14 -10" fill="#fff"/><text x="32" y="38" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="24" fill="#7b61ff">if…</text>`, ''),
  add: () => svg('0 0 64 64', `<circle cx="32" cy="32" r="24" fill="#fff"/><path d="M32 18 v28 M18 32 h28" stroke="#3dbb6b" stroke-width="8" stroke-linecap="round"/>`, ''),
  mult: () => svg('0 0 64 64', `<g fill="#fff">${[0, 1, 2].map(r => [0, 1, 2, 3].map(c => `<circle cx="${14 + c * 12}" cy="${18 + r * 14}" r="5"/>`).join('')).join('')}</g>`, ''),
  venn: () => svg('0 0 64 64', `<circle cx="24" cy="26" r="15" fill="#ffc94a" opacity=".85"/><circle cx="40" cy="26" r="15" fill="#ff6b5b" opacity=".75"/><circle cx="32" cy="40" r="15" fill="#4aa8ff" opacity=".75"/>`, ''),
  pigeon: () => svg('0 0 64 64', `<rect x="6" y="30" width="16" height="22" rx="3" fill="#fff"/><rect x="24" y="30" width="16" height="22" rx="3" fill="#fff"/><rect x="42" y="30" width="16" height="22" rx="3" fill="#fff"/><circle cx="14" cy="22" r="6" fill="#ffc94a"/><circle cx="32" cy="22" r="6" fill="#ffc94a"/><circle cx="50" cy="22" r="6" fill="#ffc94a"/><circle cx="50" cy="10" r="6" fill="#ff6b5b"/>`, ''),
  star: () => svg('0 0 64 64', `<path d="M32 6 l8 17 l18 2 l-14 12 l4 19 l-16 -9 l-16 9 l4 -19 l-14 -12 l18 -2z" fill="#ffe27a" ${S} stroke-width="2.5"/>`, ''),
};

/* ---------------- Maths visuals ---------------- */
// circle cut into `parts`, first `shaded` parts filled
export function fractionCircle(parts, shaded, { r = 40, color = '#ffc94a', x = 0, y = 0 } = {}) {
  let p = '';
  for (let i = 0; i < parts; i++) {
    const a0 = -Math.PI / 2 + i * 2 * Math.PI / parts, a1 = a0 + 2 * Math.PI / parts;
    const big = parts === 1 ? 1 : 0;
    if (parts === 1) { p += `<circle cx="${x}" cy="${y}" r="${r}" fill="${i < shaded ? color : '#fff'}" ${S}/>`; break; }
    const x0 = x + r * Math.cos(a0), y0 = y + r * Math.sin(a0), x1 = x + r * Math.cos(a1), y1 = y + r * Math.sin(a1);
    p += `<path d="M${x} ${y} L${x0.toFixed(2)} ${y0.toFixed(2)} A${r} ${r} 0 ${big} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z" fill="${i < shaded ? color : '#fff'}" ${S} stroke-width="2.5"/>`;
  }
  return p;
}
// several circles each cut into `parts`, total shaded `num` parts
export function fractionCircles(parts, num, count, { color = '#ffc94a', label = '' } = {}) {
  const r = 38, gap = 96;
  let g = '';
  for (let i = 0; i < count; i++) g += fractionCircle(parts, Math.max(0, Math.min(parts, num - i * parts)), { r, color, x: 50 + i * gap, y: 50 });
  return svg(`0 0 ${count * gap + 4} 100`, g, label, `style="max-width:${count * 120}px"`);
}
// prata: round flatbread with crispy swirl, cut into parts, `eaten` parts missing
export function prata(x, y, parts, eaten = 0, r = 46) {
  let p = `<ellipse cx="${x}" cy="${y + 8}" rx="${r + 14}" ry="${r * .55 + 8}" fill="#fff" ${S}/>`;
  for (let i = eaten; i < parts; i++) {
    const a0 = -Math.PI / 2 + i * 2 * Math.PI / parts, a1 = a0 + 2 * Math.PI / parts;
    const pt = a => `${(x + r * Math.cos(a)).toFixed(1)} ${(y + r * .55 * Math.sin(a)).toFixed(1)}`;
    p += `<path d="M${x} ${y} L${pt(a0)} A${r} ${r * .55} 0 0 1 ${pt(a1)} Z" fill="#f2b65a" stroke="#b77a2a" stroke-width="2"/>`;
  }
  if (eaten < parts) p += `<path d="M${x - r * .5} ${y} q${r * .5} -${r * .32} ${r} 0 M${x - r * .3} ${y + 8} q${r * .3} -${r * .2} ${r * .6} 0" fill="none" stroke="#d8933b" stroke-width="2.2"/>`;
  return p;
}
export function cup(x, y, level, { w = 40, h = 56, color = '#ff8fb1' } = {}) {
  const c = id('cup');
  const d = `M${x} ${y} h${w} l-5 ${h} h-${w - 10}z`;
  return `<defs><clipPath id="${c}"><path d="${d}"/></clipPath></defs><path d="${d}" fill="#fff"/>
    <rect x="${x - 2}" y="${y + h * (1 - level)}" width="${w + 4}" height="${h * level + 2}" fill="${color}" clip-path="url(#${c})"/>
    <path d="${d}" fill="none" ${S}/>`;
}
export function bottle(x, y, { color = '#ff8fb1', label = '1 L' } = {}) {
  return `<g transform="translate(${x} ${y})"><path d="M14 0 h20 v14 q14 8 14 26 v66 q0 10 -10 10 h-32 q-10 0 -10 -10 v-66 q0 -18 14 -26z" fill="#fff" ${S}/>
    <path d="M3 50 h42 v56 q0 7 -7 7 h-28 q-7 0 -7 -7z" fill="${color}"/><path d="M14 0 h20 v14 q14 8 14 26 v66 q0 10 -10 10 h-32 q-10 0 -10 -10 v-66 q0 -18 14 -26z" fill="none" ${S}/>
    <rect x="12" y="-8" width="24" height="10" rx="3" fill="#0f9d94" ${S}/>
    <rect x="6" y="62" width="36" height="22" rx="5" fill="#fff"/><text x="24" y="78" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="14" fill="${INK}">${label}</text></g>`;
}
// matchstick squares in a row
export function matchSquares(n, { unit = 46, x0 = 14, y0 = 14 } = {}) {
  const stick = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#b98a4a" stroke-width="10" stroke-linecap="round"/><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#f3d29b" stroke-width="6.5" stroke-linecap="round"/>`;
  let s = '';
  for (let i = 0; i <= n; i++) s += stick(x0 + i * unit, y0 + unit - 4, x0 + i * unit, y0 + 4);
  for (let i = 0; i < n; i++) { s += stick(x0 + i * unit + 4, y0, x0 + (i + 1) * unit - 4, y0); s += stick(x0 + i * unit + 4, y0 + unit, x0 + (i + 1) * unit - 4, y0 + unit); }
  return s;
}
export function matchPattern(ns = [1, 2, 3]) {
  let x = 0, g = '';
  const u = 40;
  for (const n of ns) {
    g += `<g transform="translate(${x} 0)">${matchSquares(n, { unit: u })}<text x="${14 + n * u / 2}" y="${u + 48}" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="800" font-size="16" fill="${INK}">${n} square${n > 1 ? 's' : ''}</text></g>`;
    x += n * u + 50;
  }
  return svg(`0 0 ${x} ${u + 60}`, g, 'Squares made with ice-cream sticks', `style="max-width:${x * 1.15}px"`);
}
// labelled bar for simple bar models
export function bars(rows, { unitW = 26, label = '' } = {}) {
  // rows: [{name, units, color, extra:'text'}]
  const h = 30, gap = 16, x0 = 90;
  let g = '';
  rows.forEach((r, i) => {
    const y = 10 + i * (h + gap);
    g += `<text x="${x0 - 10}" y="${y + 21}" text-anchor="end" font-family="Nunito" font-weight="800" font-size="15" fill="${INK}">${r.name}</text>`;
    for (let u = 0; u < r.units; u++) g += `<rect x="${x0 + u * unitW}" y="${y}" width="${unitW}" height="${h}" fill="${r.color}" ${S} stroke-width="2.2"/>`;
    if (r.tail) g += `<rect x="${x0 + r.units * unitW}" y="${y}" width="${r.tail.w}" height="${h}" fill="${r.tail.color || '#fff'}" ${S} stroke-width="2.2" stroke-dasharray="${r.tail.dash ? '5 4' : ''}"/>`;
    if (r.extra) g += `<text x="${x0 + r.units * unitW + (r.tail ? r.tail.w : 0) + 10}" y="${y + 21}" font-family="Nunito" font-weight="800" font-size="15" fill="${INK}">${r.extra}</text>`;
  });
  const W = x0 + Math.max(...rows.map(r => r.units * unitW + (r.tail ? r.tail.w : 0))) + 120;
  return svg(`0 0 ${W} ${rows.length * (h + gap) + 10}`, g, label);
}
export const ink = INK;
export const stroke = S;

/* ---------------- extra props ---------------- */
export function balance(left, right, tilt = -8) {
  // tilt < 0: right side lower (right heavier)
  const r = tilt * Math.PI / 180, L = 120;
  const lx = 160 - L * Math.cos(r), ly = 70 - L * Math.sin(r), rx = 160 + L * Math.cos(r), ry = 70 + L * Math.sin(r);
  const pan = (x, y, t) => `<path d="M${x} ${y} l-34 50 M${x} ${y} l34 50" stroke="${INK}" stroke-width="2.5"/>
    <path d="M${x - 46} ${y + 50} h92 q-6 22 -46 22 q-40 0 -46 -22z" fill="#ffd45c" ${S}/>
    <rect x="${x - 40}" y="${y + 6}" width="80" height="38" rx="10" fill="#fff" ${S}/>
    <text x="${x}" y="${y + 33}" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="22" fill="${INK}">${t}</text>`;
  return `<path d="M130 230 h60 l-12 -150 h-36z" fill="#7b61ff" ${S}/><rect x="110" y="226" width="100" height="14" rx="6" fill="#5a43d6" ${S}/>
    <line x1="${lx}" y1="${ly}" x2="${rx}" y2="${ry}" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><line x1="${lx}" y1="${ly}" x2="${rx}" y2="${ry}" stroke="#b7a8ff" stroke-width="4" stroke-linecap="round"/>
    <circle cx="160" cy="70" r="10" fill="#ffd45c" ${S}/>${pan(lx, ly, left)}${pan(rx, ry, right)}`;
}
export function kopi(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 h44 l-6 46 h-32z" fill="#fff" ${S}/><path d="M3 8 h38 l-4 34 h-30z" fill="#a8693d"/>
   <path d="M44 12 q16 2 10 18 q-4 6 -12 4" fill="none" ${S}/><ellipse cx="22" cy="50" rx="34" ry="6" fill="#fff" ${S}/>
   <path d="M14 -10 q-6 -8 0 -14 M28 -10 q-6 -8 0 -14" fill="none" stroke="#b9c3d6" stroke-width="3" stroke-linecap="round"/></g>`;
}
export function kayaToast(x, y, s = 1) {
  const slice = dy => `<path d="M0 ${dy} h70 q8 0 8 -8 v-4 q0 -14 -14 -14 h-58 q-14 0 -14 14 v4 q0 8 8 8z" fill="#f6c779" ${S}/><path d="M4 ${dy - 9} h62" stroke="#3c9a5f" stroke-width="5" stroke-linecap="round"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="38" cy="8" rx="56" ry="10" fill="#fff" ${S}/>${slice(0)}${slice(-16)}</g>`;
}
export function eggs(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="0" rx="24" ry="9" fill="#fff" ${S}/><ellipse cx="-8" cy="-6" rx="9" ry="7" fill="#fff8e6" ${S} stroke-width="2"/><ellipse cx="9" cy="-6" rx="9" ry="7" fill="#fff8e6" ${S} stroke-width="2"/><circle cx="-8" cy="-6" r="3" fill="#f2b632"/><circle cx="9" cy="-6" r="3" fill="#f2b632"/></g>`;
}
export function mysteryBox(x, y, label = 'n', s = 1, color = '#7b61ff') {
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 14 l40 -14 l40 14 v52 l-40 14 l-40 -14z" fill="${color}" ${S}/><path d="M0 14 l40 14 l40 -14 M40 28 v52" fill="none" ${S}/>
    <path d="M0 14 l40 14 v52 l-40 -14z" fill="#fff" opacity=".18"/>
    <text x="20" y="62" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="30" fill="#fff" font-style="italic">${label}</text>
    <text x="60" y="62" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="26" fill="#fff">?</text></g>`;
}
// kueh pieces
export const KUEH = {
  ondeh: (x, y, r = 9) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#4fae5a" ${S} stroke-width="2"/><circle cx="${x - r * .3}" cy="${y - r * .35}" r="${r * .22}" fill="#fff" opacity=".8"/><circle cx="${x + r * .2}" cy="${y + r * .1}" r="${r * .18}" fill="#fff" opacity=".8"/>`,
  lapis: (x, y, r = 9) => `<rect x="${x - r}" y="${y - r}" width="${2 * r}" height="${2 * r}" rx="3" fill="#ff8fb1" ${S} stroke-width="2"/><path d="M${x - r} ${y - r / 3} h${2 * r} M${x - r} ${y + r / 3} h${2 * r}" stroke="#fff" stroke-width="2.4"/>`,
  tart: (x, y, r = 9) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#f3c46b" ${S} stroke-width="2"/><circle cx="${x}" cy="${y}" r="${r * .5}" fill="#e98a1f"/>`,
};
export function kuehBox(x, y, counts, { w = 120, h = 74, title = '' } = {}) {
  // counts: {ondeh, lapis, tart}
  let items = [];
  for (const k of ['ondeh', 'lapis', 'tart']) for (let i = 0; i < (counts[k] || 0); i++) items.push(k);
  const cols = Math.max(1, Math.ceil(Math.sqrt(items.length * w / h)));
  const sx = (w - 16) / cols, rows = Math.ceil(items.length / cols), sy = rows ? (h - 16) / rows : 0;
  const r = Math.min(9, sx * .42, sy * .42 || 9);
  let g = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="#fff6e4" ${S}/>`;
  items.forEach((k, i) => { const cx = x + 8 + sx * (i % cols) + sx / 2, cy = y + 8 + sy * Math.floor(i / cols) + sy / 2; g += KUEH[k](cx, cy, r); });
  if (title) g += `<text x="${x + w / 2}" y="${y + h + 20}" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="800" font-size="15" fill="${INK}">${title}</text>`;
  return g;
}

export function table(x, y, w = 260) {
  return `<rect x="${x}" y="${y}" width="${w}" height="14" rx="6" fill="#c98b55" ${S}/><rect x="${x + 20}" y="${y + 14}" width="12" height="60" fill="#a86f3f" ${S}/><rect x="${x + w - 32}" y="${y + 14}" width="12" height="60" fill="#a86f3f" ${S}/>`;
}
export function puddle(x, y, w = 90) {
  return `<ellipse cx="${x}" cy="${y}" rx="${w / 2}" ry="${w / 8}" fill="#8cc9ff" ${S} stroke-width="2"/><path d="M${x - w / 4} ${y - 2} q8 -4 16 0" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
}
