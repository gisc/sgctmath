// Unit 6 · Draw a Model (t16 Average, t17 Excess and Shortage) — original content, Singapore context.
import * as A from '../art.js';
const { svg, kid, leo } = A;
const INK = A.ink, S = A.stroke;
const HEAD = 'font-family="Baloo 2, sans-serif" font-weight="800"';
const BODY = 'font-family="Nunito, sans-serif" font-weight="800"';
const TEAL = '#0f9d94', CORAL = '#ff6b5b', SUN = '#ffc94a', GRAPE = '#7b61ff', LEAF = '#3dbb6b', SKY = '#4aa8ff';
const GOLD = '#b9780b';

let hid = 0;
const pid = p => `${p}u6x${++hid}`;
// diagonal hatch: used for the "extra" part above an average line
const hatch = id => `<defs><pattern id="${id}" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="#ffe1dc"/><line x1="0" y1="0" x2="0" y2="8" stroke="${CORAL}" stroke-width="3"/></pattern></defs>`;
const arrowDef = (id, c = CORAL) => `<defs><marker id="${id}" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10z" fill="${c}"/></marker></defs>`;

/* ---------- unit helpers (same flat style as art.js) ---------- */

// Column graph for levelling. vals: numbers. blocks: draw unit blocks (small values) or solid columns.
// level: show the part above `avg` hatched and the gaps below `avg` dashed. moves: [[from, to, n]] curved arrows.
function cols(vals, o = {}) {
  const { names = [], avg = null, unit = 14, w = 44, gap = 20, colors = [SKY, SUN, LEAF, CORAL, GRAPE], level = false, blocks = true,
    label = 'Column graph', max = 420, avgText = null, moves = [], valText = v => String(v) } = o;
  const below = level || moves.length;              // value labels under the names when levelling
  const top = moves.length ? 62 : 34;
  const maxV = Math.max(...vals, avg || 0);
  const base = top + maxV * unit;
  const x0 = 16;
  const hp = pid('h'), ap = pid('a');
  let g = hatch(hp) + arrowDef(ap);
  const cx = i => x0 + i * (w + gap) + w / 2;
  vals.forEach((v, i) => {
    const x = x0 + i * (w + gap), c = colors[i % colors.length];
    const lv = level && avg != null;
    if (blocks) {
      for (let k = 0; k < v; k++) g += `<rect x="${x}" y="${base - (k + 1) * unit}" width="${w}" height="${unit}" fill="${lv && k >= avg ? `url(#${hp})` : c}" ${S} stroke-width="2"/>`;
      if (lv) for (let k = v; k < avg; k++) g += `<rect x="${x + 2}" y="${base - (k + 1) * unit + 2}" width="${w - 4}" height="${unit - 4}" rx="2" fill="#fff6d6" stroke="#e0a400" stroke-width="2" stroke-dasharray="5 3"/>`;
    } else {
      const keep = lv ? Math.min(v, avg) : v;
      g += `<rect x="${x}" y="${base - keep * unit}" width="${w}" height="${keep * unit}" fill="${c}" ${S} stroke-width="2.5"/>`;
      if (lv && v > avg) g += `<rect x="${x}" y="${base - v * unit}" width="${w}" height="${(v - avg) * unit}" fill="url(#${hp})" stroke="${CORAL}" stroke-width="2.5"/>`;
      if (lv && v < avg) g += `<rect x="${x}" y="${base - avg * unit}" width="${w}" height="${(avg - v) * unit}" fill="#fff6d6" stroke="#e0a400" stroke-width="2.5" stroke-dasharray="6 4"/>`;
    }
    if (names[i]) g += `<text x="${x + w / 2}" y="${base + 20}" text-anchor="middle" ${BODY} font-size="15" fill="${INK}">${names[i]}</text>`;
    if (below) g += `<text x="${x + w / 2}" y="${base + (names.length ? 40 : 20)}" text-anchor="middle" ${HEAD} font-size="16" fill="${INK}">${valText(v)}</text>`;
    else g += `<text x="${x + w / 2}" y="${base - v * unit - 8}" text-anchor="middle" ${HEAD} font-size="16" fill="${INK}">${valText(v)}</text>`;
  });
  g += `<path d="M${x0 - 8} ${base} H${x0 + vals.length * (w + gap) - gap + 8}" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
  const xEnd = x0 + vals.length * (w + gap) - gap;
  if (avg != null) {
    const ya = base - avg * unit;
    g += `<path d="M${x0 - 8} ${ya} H${xEnd + 10}" stroke="${TEAL}" stroke-width="3" stroke-dasharray="9 6"/>
      <text x="${xEnd + 16}" y="${ya + 6}" ${HEAD} font-size="16" fill="#0f7a73">${avgText || 'average ' + avg}</text>`;
  }
  moves.forEach(([f, t, n], j) => {
    const x1 = cx(f) + (t > f ? 6 : -6), y1 = base - vals[f] * unit - 4, x2 = cx(t), y2 = base - avg * unit - 4;
    const cyy = Math.max(10, Math.min(y1, y2) - 36 - j * 16);
    g += `<path d="M${x1} ${y1} Q${(x1 + x2) / 2} ${cyy} ${x2} ${y2}" fill="none" stroke="${CORAL}" stroke-width="3" stroke-dasharray="7 4" marker-end="url(#${ap})"/>`;
    const mx = (x1 + 2 * ((x1 + x2) / 2) + x2) / 4, my = (y1 + 2 * cyy + y2) / 4;
    g += `<circle cx="${mx}" cy="${my}" r="12" fill="#fff" stroke="${CORAL}" stroke-width="2.5"/><text x="${mx}" y="${my + 5}" text-anchor="middle" ${HEAD} font-size="15" fill="#d6453a">${n}</text>`;
  });
  const W = xEnd + (avg != null ? 112 : 20), H = base + (below && names.length ? 50 : 30);
  return svg(`0 0 ${W} ${H}`, g, label, `style="max-width:${max}px"`);
}

// Rectangle model for groups: width = how many, height = average, so area = total.
// groups: [{name, sub, n, v, vText, color, note}]
function rects(groups, o = {}) {
  const { avg = null, floor = 0, k = 10, per = 9, baseH = 0, label = 'Rectangle model', max = 420, avgText = null } = o;
  const x0 = 20, top = groups.some(gr => gr.note) ? 46 : 16;
  const hOf = v => baseH + (v - floor) * k;
  const maxH = Math.max(...groups.map(gr => hOf(gr.v)), avg != null ? hOf(avg) : 0);
  const base = top + maxH;
  const hp = pid('h');
  let g = hatch(hp), x = x0;
  const ya = avg != null ? base - hOf(avg) : null;
  groups.forEach(gr => {
    const w = gr.n * per, hh = hOf(gr.v), y = base - hh;
    g += `<rect x="${x}" y="${y}" width="${w}" height="${hh}" fill="${gr.color}" ${S}/>`;
    if (floor > 0) g += `<path d="M${x - 3} ${base - 14} l${w + 6} -5" stroke="#fff" stroke-width="7"/><path d="M${x - 3} ${base - 17.5} l${w + 6} -5 M${x - 3} ${base - 10.5} l${w + 6} -5" stroke="${INK}" stroke-width="1.8"/>`;
    if (avg != null && gr.v > avg) g += `<rect x="${x}" y="${y}" width="${w}" height="${ya - y}" fill="url(#${hp})" stroke="${CORAL}" stroke-width="2.5"/>`;
    if (avg != null && gr.v < avg) g += `<rect x="${x}" y="${ya}" width="${w}" height="${y - ya}" fill="#fff6d6" stroke="#e0a400" stroke-width="2.5" stroke-dasharray="6 4"/>`;
    const inside = Math.max(y, ya ?? y) + 24;
    g += `<text x="${x + w / 2}" y="${inside}" text-anchor="middle" ${HEAD} font-size="18" fill="${INK}">${gr.vText || gr.v}</text>`;
    g += `<text x="${x + w / 2}" y="${base + 21}" text-anchor="middle" ${HEAD} font-size="17" fill="${INK}">${gr.name}</text>`;
    if (gr.sub) g += `<text x="${x + w / 2}" y="${base + 40}" text-anchor="middle" ${BODY} font-size="15" fill="${INK}">${gr.sub}</text>`;
    if (gr.note) g += `<text x="${x + w / 2}" y="${Math.min(y, ya ?? y) - 9}" text-anchor="middle" ${BODY} font-size="15" fill="${gr.v > avg ? '#d6453a' : GOLD}">${gr.note}</text>`;
    x += w;
  });
  if (avg != null) g += `<path d="M${x0 - 8} ${ya} H${x + 8}" stroke="${TEAL}" stroke-width="3" stroke-dasharray="9 6"/><text x="${x + 14}" y="${ya + 6}" ${HEAD} font-size="17" fill="#0f7a73">${avgText || 'average ' + avg}</text>`;
  const W = x + (avg != null ? 124 : 20), H = base + 50;
  return svg(`0 0 ${W} ${H}`, g, label, `style="max-width:${max}px"`);
}

// Sharing model: one box per person (with "…" because we don't know how many), then what is left over or short.
// rows: [{name, each, left?, short?, exact?}]
function shareRows(rows, { label = 'Sharing model', max = 430, item = '' } = {}) {
  const x0 = 88, bw = 44, bh = 40, gp = 8, rh = 62;
  let g = '';
  rows.forEach((r, j) => {
    const y = 12 + j * rh;
    g += `<text x="${x0 - 12}" y="${y + 27}" text-anchor="end" ${HEAD} font-size="18" fill="${INK}">${r.name}</text>`;
    const xs = [0, 1, 2].map(i => x0 + i * (bw + gp));
    xs.push(x0 + 3 * (bw + gp) + 26);
    g += `<text x="${x0 + 3 * (bw + gp) + 9}" y="${y + 27}" text-anchor="middle" ${HEAD} font-size="20" fill="${INK}">…</text>`;
    xs.forEach(x => {
      g += `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="7" fill="${j ? '#d9ecff' : '#fff1c7'}" ${S} stroke-width="2.5"/>
        <text x="${x + bw / 2}" y="${y + 27}" text-anchor="middle" ${HEAD} font-size="19" fill="${INK}">${r.each}</text>`;
    });
    const tx = xs[3] + bw + 14;
    if (r.left != null || r.exact) {
      const t = r.exact ? 'none left' : `${r.left} left over`;
      g += `<rect x="${tx}" y="${y + 4}" width="112" height="${bh - 8}" rx="16" fill="#d9f5e3" stroke="${LEAF}" stroke-width="2.5"/><text x="${tx + 56}" y="${y + 26}" text-anchor="middle" ${BODY} font-size="15" fill="#23794a">${r.exact ? '' : '+ '}${t}</text>`;
    } else {
      g += `<rect x="${tx}" y="${y + 4}" width="112" height="${bh - 8}" rx="16" fill="#fff" stroke="${CORAL}" stroke-width="2.5" stroke-dasharray="6 4"/><text x="${tx + 56}" y="${y + 26}" text-anchor="middle" ${BODY} font-size="15" fill="#d6453a">${r.short} short</text>`;
    }
  });
  const W = x0 + 4 * (bw + gp) + 26 + 14 + 120, H = 12 + rows.length * rh;
  return svg(`0 0 ${W} ${H}`, g, label, `style="max-width:${max}px"`);
}

// horizontal curly brace from x1 to x2 at height y (opening downwards)
const brace = (x1, x2, y) => { const m = (x1 + x2) / 2; return `<path d="M${x1} ${y + 8} q0 -8 8 -8 H${m - 8} q8 0 8 -8 q0 8 8 8 H${x2 - 8} q8 0 8 8" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>`; };

// Honest bar model of both plans: n people, a or b each, E left over in plan 1, Sh short in plan 2.
function planBars(n, a, b, E, Sh, { names = [], label = 'Bar model of both plans', max = 460, s = 8, topText = 'all the tarts', extraText = '' } = {}) {
  const x0 = 82, h = 32, y1 = 50, y2 = 118, T = n * a + E;
  let g = '';
  g += brace(x0, x0 + T * s, y1 - 22) + `<text x="${x0 + T * s / 2}" y="${y1 - 37}" text-anchor="middle" ${BODY} font-size="15" fill="${INK}">${topText}</text>`;
  for (let i = 0; i < n; i++) g += `<rect x="${x0 + i * a * s}" y="${y1}" width="${a * s}" height="${h}" fill="${SUN}" ${S} stroke-width="2"/><text x="${x0 + i * a * s + a * s / 2}" y="${y1 + 22}" text-anchor="middle" ${BODY} font-size="13" fill="${INK}">${a}</text>`;
  g += `<rect x="${x0 + n * a * s}" y="${y1}" width="${E * s}" height="${h}" fill="#bdeccb" stroke="${LEAF}" stroke-width="2.5"/><text x="${x0 + n * a * s + E * s / 2}" y="${y1 + 22}" text-anchor="middle" ${BODY} font-size="14" fill="#23794a">${E} left</text>`;
  for (let i = 0; i < n; i++) {
    const x = x0 + i * b * s;
    g += `<rect x="${x}" y="${y2}" width="${a * s}" height="${h}" fill="#ffe9a8" ${S} stroke-width="2"/><rect x="${x + a * s}" y="${y2}" width="${(b - a) * s}" height="${h}" fill="#cfc4ff" ${S} stroke-width="2"/>`;
  }
  const xt = x0 + T * s, xe = x0 + n * b * s;
  g += `<rect x="${xt}" y="${y2 - 2}" width="${xe - xt + 2}" height="${h + 4}" fill="#fff" opacity=".8"/><rect x="${xt}" y="${y2}" width="${xe - xt}" height="${h}" fill="none" stroke="${CORAL}" stroke-width="2.5" stroke-dasharray="6 4"/>
    <text x="${(xt + xe) / 2}" y="${y2 + h + 20}" text-anchor="middle" ${BODY} font-size="14" fill="#d6453a">${Sh} short</text>
    <path d="M${xt} ${y1 - 6} V${y2 + h + 6}" stroke="${TEAL}" stroke-width="2.5" stroke-dasharray="5 4"/>`;
  names.forEach((nm, i) => { g += `<text x="${x0 - 10}" y="${(i ? y2 : y1) + 22}" text-anchor="end" ${HEAD} font-size="17" fill="${INK}">${nm}</text>`; });
  if (extraText) g += `<rect x="${x0}" y="${y2 + h + 34}" width="${(b - a) * s}" height="16" fill="#cfc4ff" ${S} stroke-width="2"/><text x="${x0 + (b - a) * s + 8}" y="${y2 + h + 47}" ${BODY} font-size="14" fill="${INK}">${extraText}</text>`;
  const W = Math.max(xe, x0 + T * s) + 20, H = y2 + h + (extraText ? 58 : 30);
  return svg(`0 0 ${W} ${H}`, g, label, `style="max-width:${max}px"`);
}

// small props
const can = (x, y, c = '#e1484b') => `<g transform="translate(${x} ${y})"><rect x="-6" y="-16" width="12" height="16" rx="2" fill="${c}" stroke="${INK}" stroke-width="2"/><ellipse cx="0" cy="-16" rx="6" ry="2" fill="#dfe4ee" stroke="${INK}" stroke-width="1.6"/></g>`;
function pencil(x, y, len = 34, c = SKY, ghost = false) {
  if (ghost) return `<path d="M${x} ${y} v-${len - 8} l3 -8 l3 8 v${len - 8}z" fill="#fff" stroke="${CORAL}" stroke-width="2" stroke-dasharray="4 3"/>`;
  return `<path d="M${x} ${y} v-${len - 8} l3 -8 l3 8 v${len - 8}z" fill="${c}" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/><path d="M${x + 1.5} ${y - len + 4} l1.5 -4 l1.5 4z" fill="#f6c779"/>`;
}
const pencilCup = (x, y, n, ghost = 0) => {
  const cs = [SKY, CORAL, LEAF, GRAPE, SUN];
  let g = '';
  const tot = n + ghost, sp = 6.5, sx = x + 17 - (tot * sp) / 2 + 0.5;
  for (let i = 0; i < tot; i++) g += pencil(sx + i * sp, y + 6, 36 + (i % 2) * 6, cs[i % 5], i >= n);
  return g + `<path d="M${x} ${y} h34 l-4 32 h-26z" fill="#ffe9a8" ${S} stroke-width="2.5"/>`;
};
function lantern(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -26 v8" stroke="${INK}" stroke-width="2.5"/>
    <ellipse cx="0" cy="0" rx="24" ry="19" fill="#e1484b" ${S}/><path d="M-12 -17 q-6 17 0 34 M12 -17 q6 17 0 34 M0 -19 v38" fill="none" stroke="#b81d23" stroke-width="2"/>
    <rect x="-10" y="-22" width="20" height="6" rx="2" fill="${SUN}" ${S} stroke-width="2"/><rect x="-10" y="16" width="20" height="6" rx="2" fill="${SUN}" ${S} stroke-width="2"/>
    <path d="M-4 22 v12 M0 22 v14 M4 22 v12" stroke="${SUN}" stroke-width="2.5" stroke-linecap="round"/></g>`;
}
const orange = (x, y, r = 9) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#ff9b2f" ${S} stroke-width="2"/><path d="M${x} ${y - r} q3 -5 8 -4" fill="none" stroke="${LEAF}" stroke-width="2.5" stroke-linecap="round"/>`;
function tartJar(x, y) {
  let tarts = '';
  [[12, 46], [26, 48], [40, 46], [18, 34], [34, 34], [26, 22]].forEach(([dx, dy]) => { tarts += A.KUEH.tart(x + dx, y + dy, 7); });
  return `<rect x="${x}" y="${y}" width="52" height="58" rx="10" fill="#eaf6ff" ${S}/>${tarts}<rect x="${x - 3}" y="${y - 10}" width="58" height="13" rx="5" fill="#e1484b" ${S} stroke-width="2.5"/>
    <rect x="${x + 6}" y="${y + 8}" width="6" height="30" rx="3" fill="#fff" opacity=".7"/>`;
}
const COUSIN1 = { skin: '#f3cfae', hair: 'short', hairC: '#2b2321', shirt: '#e1484b', bottom: '#3b3f58' };
const COUSIN2 = { skin: '#f6d2b0', hair: 'ponytail', hairC: '#2b2321', shirt: '#ffc94a', bottom: '#e1484b' };

/* ===================== Topic 16: Average ===================== */
const t16art = () => {
  const stacks = [6, 2, 5, 3], base = 186, pw = 22, xs = [44, 112, 180, 248];
  const ap = pid('a');
  let g = '';
  stacks.forEach((n, i) => {
    g += `<ellipse cx="${xs[i] + 11}" cy="${base + 6}" rx="30" ry="7" fill="#fff" ${S} stroke-width="2.5"/>`;
    for (let k = 0; k < n; k++) {
      const op = k >= 4 ? ' opacity=".55"' : '';
      g += `<g${op}>${A.KUEH.lapis(xs[i] + 11, base - 11 - k * pw, 11)}</g>`;
    }
    for (let k = n; k < 4; k++) g += `<rect x="${xs[i]}" y="${base - 22 - k * pw}" width="22" height="22" rx="3" fill="#fff" stroke="#e0a400" stroke-width="2" stroke-dasharray="4 3"/>`;
  });
  const ya = base - 4 * pw;
  g += `<path d="M26 ${ya} H290" stroke="${TEAL}" stroke-width="3" stroke-dasharray="9 6"/>`;
  g += `<path d="M58 ${base - 6 * pw - 6} Q90 ${base - 6 * pw - 22} 123 ${ya - 34}" fill="none" stroke="${CORAL}" stroke-width="3" stroke-dasharray="7 4" marker-end="url(#${ap})"/>`;
  g += `<path d="M194 ${base - 5 * pw - 6} Q228 ${base - 5 * pw - 30} 259 ${ya - 8}" fill="none" stroke="${CORAL}" stroke-width="3" stroke-dasharray="7 4" marker-end="url(#${ap})"/>`;
  return svg('0 0 360 220', `<rect width="360" height="220" rx="20" fill="#e9f8f4"/>${arrowDef(ap)}
    <text x="20" y="34" ${HEAD} font-size="21" fill="${INK}">Level it out!</text>
    ${g}
    <rect x="292" y="${ya - 14}" width="58" height="28" rx="14" fill="#fff" stroke="${TEAL}" stroke-width="2.5"/><text x="321" y="${ya + 6}" text-anchor="middle" ${HEAD} font-size="15" fill="#0f7a73">avg 4</text>
    ${leo({ x: 318, y: 132, s: .42, pose: 'point' })}`, 'Four stacks of kueh lapis with 6, 2, 5 and 3 pieces being levelled out to 4 pieces each');
};

const t16 = {
  id: 't16',
  title: 'Average',
  intro: 'Some stacks are tall and some are short. What if we shared everything out so that they were all the <b>same</b>? That fair-share level is called the <b>average</b>.',
  skills: ['Levelling out', 'Total = average × number', 'Rectangle models'],
  art: t16art,
  explore: {
    setup: 'After a recycling drive at the void deck, four friends count the drink cans each of them collected: Aisyah <b>12</b>, Arjun <b>7</b>, Chloe <b>9</b> and Mei Ling <b>8</b>.',
    art: () => svg('0 0 340 300', `<rect width="340" height="300" rx="20" fill="#eef3f8"/>
      <path d="M20 0 h300 q20 0 20 20 v24 h-340 v-24 q0 -20 20 -20z" fill="#cdd6e3"/>
      <rect x="70" y="10" width="200" height="28" rx="8" fill="${LEAF}" ${S} stroke-width="2.5"/><text x="170" y="30" text-anchor="middle" ${HEAD} font-size="16" fill="#fff">RECYCLING DRIVE</text>
      <rect x="12" y="44" width="20" height="200" fill="#d9e0ea" ${S} stroke-width="2.5"/><rect x="308" y="44" width="20" height="200" fill="#d9e0ea" ${S} stroke-width="2.5"/>
      <path d="M0 244 h340 v36 q0 20 -20 20 h-300 q-20 0 -20 -20z" fill="#d6dcc8"/>
      <rect x="244" y="160" width="58" height="84" rx="8" fill="${SKY}" ${S}/><rect x="238" y="150" width="70" height="14" rx="5" fill="#2a7fd4" ${S} stroke-width="2.5"/>
      <path d="M273 186 l10 17 h-20z" fill="none" stroke="#fff" stroke-width="3.5" stroke-linejoin="round"/><path d="M262 218 h22" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
      ${kid('aisyah', { x: 70, y: 140, s: .78, pose: 'cheer' })}${kid('arjun', { x: 150, y: 146, s: .74, pose: 'think', mood: 'think' })}${kid('chloe', { x: 214, y: 140, s: .76, pose: 'wave', flip: true })}
      ${[0, 1, 2, 3].map(i => can(38 + i * 13, 262, ['#e1484b', SUN, LEAF, SKY][i])).join('')}${[0, 1, 2, 3, 4, 5].map(i => can(44 + i * 12, 280, ['#e1484b', SKY, SUN, LEAF][i % 4])).join('')}
      ${[0, 1, 2].map(i => can(132 + i * 13, 274, [LEAF, '#e1484b', SUN][i])).join('')}
      ${[0, 1, 2, 3].map(i => can(190 + i * 13, 276, [SKY, SUN, '#e1484b', LEAF][i])).join('')}`, 'Aisyah, Arjun and Chloe at a void deck recycling drive with piles of drink cans and a blue recycling bin'),
    steps: [
      { who: 'arjun', mood: 'think', text: 'Aisyah collected the most and I collected the fewest. If we had all collected the <b>same</b> number of cans, how many would each of us have?',
        art: () => cols([12, 7, 9, 8], { names: ['Aisyah', 'Arjun', 'Chloe', 'Mei Ling'], unit: 13, w: 46, gap: 22, label: 'Columns of cans: Aisyah 12, Arjun 7, Chloe 9, Mei Ling 8', max: 330 }) },
      { who: 'leo', mood: 'teach', text: 'Let\'s <b>level out</b> the columns. Aisyah moves <b>2</b> cans to Arjun and <b>1</b> can to Mei Ling. Now every column is the same height!',
        art: () => cols([12, 7, 9, 8], { names: ['Aisyah', 'Arjun', 'Chloe', 'Mei Ling'], unit: 13, w: 46, gap: 22, avg: 9, level: true, moves: [[0, 1, 2], [0, 3, 1]], label: 'Levelling: the 3 cans above the line at 9 move into the gaps of Arjun and Mei Ling', max: 440 }) },
      { who: 'aisyah', text: 'Every column is now <b>9</b> cans high. That level is the <b>average</b>. There is a quicker way too: put all the cans together, then share them equally. Total = 12 + 7 + 9 + 8 = 36, and 36 ÷ 4 = <b>9</b>.' },
      { who: 'chloe', text: 'I notice something! The part <b>above</b> the line (3 cans) is exactly enough to fill the gaps <b>below</b> it (2 + 1 = 3 cans). Above the average = below the average, every time.' },
      { who: 'weiming', mood: 'think', text: 'Wait for me! I collected <b>14</b> cans. Does the average change now that there are 5 of us?' },
      { who: 'leo', mood: 'teach', text: 'Total = 36 + 14 = 50, and 50 ÷ 5 = <b>10</b>. Here is another way to see it: Wei Ming has 5 cans more than the old average of 9. Share those 5 extra cans among all 5 children, and the average goes up by 1.',
        art: () => cols([12, 7, 9, 8, 14], { names: ['Aisyah', 'Arjun', 'Chloe', 'Mei Ling', 'Wei Ming'], unit: 11, w: 42, gap: 28, avg: 10, level: true, label: 'Five columns 12, 7, 9, 8, 14 levelled to an average of 10', max: 440 }) },
      { who: 'arjun', text: 'For whole classes we can draw <b>rectangles</b>: width = number of pupils, height = average, so the area is the total. Class 4A (10 pupils) averaged 12 cans and Class 4B (20 pupils) averaged 9 cans. The extra on top of 4A, 10 × 2 = 20 cans, fills 4B\'s gap, 20 × 1 = 20 cans. So the overall average is <b>10</b>, not 10.5 halfway! Check: (120 + 180) ÷ 30 = 10 ✓',
        art: () => rects([{ name: '4A', sub: '10 pupils', n: 10, v: 12, vText: '12 cans', color: '#bfe9e6', note: '10 × 2 = 20' }, { name: '4B', sub: '20 pupils', n: 20, v: 9, vText: '9 cans', color: '#d9ecff', note: '20 × 1 = 20' }], { avg: 10, k: 13, per: 9, label: 'Rectangle model: 4A is 10 wide and 12 tall, 4B is 20 wide and 9 tall, the average line is at 10', max: 420 }) },
    ],
  },
  keys: [
    { title: 'Average = level it out', text: 'The average is the height every column would have if we moved the extra from the tall columns into the short ones.' },
    { title: 'Total ÷ number', text: 'Average = total ÷ number of items. Turn it round: <b>total = average × number of items</b>. This finds a missing value.' },
    { title: 'Above = below', text: 'The amounts above the average add up to exactly the same as the gaps below it. Example: 6, 2, 5, 3 has average 4: above 2 + 1 = 3, below 2 + 1 = 3.' },
    { title: 'Two groups? Draw rectangles', text: 'Width = how many, height = average. The extra on top of one rectangle fills the gap in the other. Only use the halfway value if the groups are the <b>same size</b>.' },
  ],
  practice: [
    { id: 'a', level: 1, type: 'blanks', prompt: 'Priya is learning a song on the piano for her school\'s Racial Harmony Day concert. The graph shows how many minutes she practised from Monday to Thursday. What is the <b>average</b> time she practised each day?',
      art: cols([35, 50, 40, 55], { names: ['Mon', 'Tue', 'Wed', 'Thu'], blocks: false, unit: 2.6, w: 50, gap: 22, label: 'Minutes of piano practice: Monday 35, Tuesday 50, Wednesday 40, Thursday 55', max: 300 }),
      template: 'Average = {0} minutes', blanks: [{ answer: 45 }],
      hint: 'Add up all four times, then share the total equally among the 4 days.',
      solution: ['Total = 35 + 50 + 40 + 55 = 180 minutes', 'Average = 180 ÷ 4 = <b>45 minutes</b>', 'Check by levelling: 50 and 55 are 5 and 10 above 45 (15 altogether). 35 and 40 are 10 and 5 below 45 (15 altogether). Above = below ✓'] },
    { id: 'b', level: 1, type: 'blanks', prompt: 'Kumar took 5 Tamil spelling tests this term. His <b>average</b> mark was <b>16</b>. His marks for the first four tests were 15, 18, 13 and 17. What did he score in the 5th test?',
      template: 'Total of all 5 tests = {0} marks<br>5th test = {1} marks', blanks: [{ answer: 80 }, { answer: 17 }],
      hint: 'If the average of 5 tests is 16, the total of all 5 marks is 16 × 5.',
      solution: ['Total of 5 tests = 16 × 5 = 80 marks', 'First four tests: 15 + 18 + 13 + 17 = 63 marks', '5th test = 80 − 63 = <b>17</b> marks'] },
    { id: 'c', level: 1, type: 'blanks', prompt: 'Mdm Lim has three plates of kueh lapis: <b>11</b> pieces on Plate A, <b>5</b> on Plate B and <b>8</b> on Plate C. She wants every plate to have the same number of pieces. She only moves kueh from Plate A to Plate B.',
      art: cols([11, 5, 8], { names: ['Plate A', 'Plate B', 'Plate C'], unit: 12, w: 46, gap: 28, colors: ['#ff8fb1', '#ff8fb1', '#ff8fb1'], label: 'Stacks of kueh lapis: Plate A 11, Plate B 5, Plate C 8', max: 260 }),
      template: 'Each plate will have {0} pieces.<br>She moves {1} pieces from Plate A to Plate B.', blanks: [{ answer: 8 }, { answer: 3 }],
      hint: 'Find the total number of pieces, then share it equally among the 3 plates.',
      solution: ['Total = 11 + 5 + 8 = 24 pieces', 'Each plate: 24 ÷ 3 = <b>8</b> pieces. This is the average.', 'Plate A has 11 − 8 = 3 too many. Plate B has 8 − 5 = 3 too few. Plate C already has 8.', 'She moves <b>3</b> pieces from Plate A to Plate B.'] },
    { id: 'd', level: 2, type: 'blanks', prompt: 'The 4 players in a school basketball team have an average height of <b>150 cm</b>. When Daniel joins the team for Sports Day, the average height of the 5 players becomes <b>152 cm</b>. How tall is Daniel?',
      template: 'Daniel is {0} cm tall.', blanks: [{ answer: 160 }],
      hint: 'Find the total height of the team before and after Daniel joins.',
      solution: ['Before: 150 × 4 = 600 cm', 'After: 152 × 5 = 760 cm', 'Daniel: 760 − 600 = <b>160 cm</b>', 'Levelling check: Daniel reaches the new average of 152 cm <b>and</b> has enough extra to lift the other 4 players by 2 cm each: 152 + 4 × 2 = 160 ✓'] },
    { id: 'e', level: 2, type: 'blanks', prompt: 'Farah did 5 science quizzes this term. Her average mark was <b>40</b>. Her teacher drops her <b>lowest</b> mark, and the average of the other 4 quizzes becomes <b>42</b>. What was Farah\'s lowest mark?',
      template: 'Her lowest mark was {0}.', blanks: [{ answer: 32 }],
      hint: 'Total of all 5 quizzes − total of the other 4 quizzes = the mark that was dropped.',
      solution: ['Total of 5 quizzes = 40 × 5 = 200', 'Total of the other 4 = 42 × 4 = 168', 'Lowest mark = 200 − 168 = <b>32</b>', 'Another way: the other 4 marks are, on average, 2 above 40, so together they are 4 × 2 = 8 above 40. Above = below, so the lowest mark is 8 below 40: 40 − 8 = 32 ✓'] },
    { id: 'f', level: 2, type: 'mcq', prompt: 'At a CCA open house quiz, the <b>12</b> Robotics Club members scored an average of <b>85</b> marks. The <b>18</b> Chess Club members scored an average of <b>75</b> marks. What is the average mark of all 30 pupils?',
      art: rects([{ name: 'Robotics', sub: '12 pupils', n: 12, v: 85, vText: '85', color: '#bfe9e6' }, { name: 'Chess', sub: '18 pupils', n: 18, v: 75, vText: '75', color: '#ffe9a8' }], { floor: 60, baseH: 30, k: 4, per: 9, label: 'Rectangle model: Robotics 12 wide and 85 tall, Chess 18 wide and 75 tall', max: 300 }),
      options: ['80', '79', '81', '77'], answer: 1,
      hint: 'The clubs are not the same size, so the answer is not simply halfway between 85 and 75. Find the total marks of each club first.',
      solution: ['Robotics total: 85 × 12 = 1020', 'Chess total: 75 × 18 = 1350', 'Average = (1020 + 1350) ÷ 30 = 2370 ÷ 30 = <b>79</b>', '80 is halfway between 85 and 75. But there are more Chess members, so the average is pulled closer to 75.'] },
    { id: 'g', level: 2, type: 'blanks', prompt: 'In the school library\'s June holiday reading challenge, the <b>18 girls</b> of a P4 class read an average of <b>14</b> books each. The boys read an average of <b>9</b> books each. The average for the whole class was <b>12</b> books. How many boys are in the class?',
      art: rects([{ name: 'Girls', sub: '18 pupils', n: 18, v: 14, vText: '14 books', color: '#ffd8e4' }, { name: 'Boys', sub: '? pupils', n: 12, v: 9, vText: '9 books', color: '#d9ecff' }], { avg: 12, avgText: 'class 12', k: 9, per: 9, label: 'Rectangle model: girls 14 tall, boys 9 tall, class average line at 12', max: 400 }),
      template: 'There are {0} boys.', blanks: [{ answer: 12 }],
      hint: 'The girls\' extra above the line at 12 must fill the boys\' gap below the line.',
      solution: ['Each girl read 14 − 12 = 2 books above the class average. Extra on top: 18 × 2 = 36 books.', 'Each boy read 12 − 9 = 3 books below the class average. The gap must also be 36 books.', 'Number of boys = 36 ÷ 3 = <b>12</b>', 'Check: (18 × 14 + 12 × 9) ÷ 30 = (252 + 108) ÷ 30 = 360 ÷ 30 = 12 ✓'] },
    { id: 'h', level: 3, type: 'blanks', prompt: 'In a swimming CCA, the boys swam an average of <b>32</b> laps and the girls swam an average of <b>26</b> laps. The average for everyone was <b>28</b> laps. There are <b>6 more girls than boys</b>. How many boys and how many girls are there?',
      template: 'Boys: {0} &nbsp;&nbsp; Girls: {1}', blanks: [{ answer: 6 }, { answer: 12 }],
      hint: 'Each boy is 4 laps above 28 and each girl is 2 laps below 28. Extra on top = gap below. What does that tell you about the number of girls compared with the number of boys?',
      solution: ['Each boy: 32 − 28 = 4 laps above. Each girl: 28 − 26 = 2 laps below.', 'Above = below: number of boys × 4 = number of girls × 2. So there are <b>2 times</b> as many girls as boys.', 'Boys = 1 unit, girls = 2 units. The difference is 1 unit = 6.', 'Boys = <b>6</b>, girls = 2 × 6 = <b>12</b>.', 'Check: (6 × 32 + 12 × 26) ÷ 18 = (192 + 312) ÷ 18 = 504 ÷ 18 = 28 ✓'] },
    { id: 'i', level: 3, type: 'blanks', prompt: '<b>24</b> pupils took part in a mental sums contest at the community centre. The top <b>8</b> pupils had an average score that was <b>6 marks higher</b> than the average of all 24 pupils. The average score of the other 16 pupils was lower than the average of all 24 pupils. By how many marks was it lower?',
      template: '{0} marks lower', blanks: [{ answer: 3 }],
      hint: 'You don\'t need the actual scores! Draw the average line for all 24 pupils. The top 8 pupils\' extra above the line must fill the gap of the other 16 pupils.',
      solution: ['Extra above the line: 8 pupils × 6 marks = 48 marks.', 'Above = below, so these 48 marks fill the gap below the line for the other 16 pupils.', 'Each of them is, on average, 48 ÷ 16 = <b>3</b> marks below.', 'Check with a made-up average of 50: top 8 average 56, other 16 average 47. (8 × 56 + 16 × 47) ÷ 24 = (448 + 752) ÷ 24 = 1200 ÷ 24 = 50 ✓'] },
  ],
  adult: 'Links to school work: Average is taught in <b>P5</b> in the MOE syllabus (finding the average, and the relationship total = average × number of items), so this topic previews P5 work. Questions on combining two groups (f to i) are <b>enrichment</b>. The key picture is "levelling out": the part above the average exactly fills the gaps below it. For two groups, draw each as a rectangle (width = number of people, height = average). Common mistakes: taking the halfway value of two averages when the groups are different sizes (80 instead of 79 in question f), and forgetting to multiply the average by the number of items before adding or subtracting. Tip: let your child level out stacks of coins or Lego bricks by hand before using the formula.',
};

/* ===================== Topic 17: Excess and Shortage ===================== */
const t17art = () => {
  let g = '';
  for (let i = 0; i < 4; i++) g += pencilCup(80 + i * 54, 74, 4);
  for (let i = 0; i < 4; i++) g += pencilCup(80 + i * 54, 172, i === 3 ? 4 : 5, i === 3 ? 1 : 0);
  const loose = [SKY, CORAL, LEAF].map((c, i) => `<g transform="translate(${306 + i * 9} ${112}) rotate(${-74 + i * 6})">${pencil(-3, 18, 36, c)}</g>`).join('');
  return svg('0 0 360 220', `<rect width="360" height="220" rx="20" fill="#fff6e4"/>
    <text x="18" y="96" ${HEAD} font-size="17" fill="${INK}">4 each</text><text x="18" y="194" ${HEAD} font-size="17" fill="${INK}">5 each</text>
    <path d="M14 128 h332" stroke="#ecd9b4" stroke-width="3" stroke-dasharray="8 8"/>
    ${g}${loose}
    <rect x="290" y="70" width="62" height="24" rx="12" fill="#d9f5e3" stroke="${LEAF}" stroke-width="2.5"/><text x="321" y="87" text-anchor="middle" ${BODY} font-size="13" fill="#23794a">3 left</text>
    <rect x="290" y="176" width="62" height="24" rx="12" fill="#fff" stroke="${CORAL}" stroke-width="2.5" stroke-dasharray="5 3"/><text x="321" y="193" text-anchor="middle" ${BODY} font-size="13" fill="#d6453a">1 short</text>
    <text x="180" y="24" text-anchor="middle" ${HEAD} font-size="17" fill="${INK}">Same pencils, two ways to share</text>`, 'Pencils shared into 4 cups: with 4 in each cup, 3 pencils are left over; with 5 in each cup, 1 pencil is missing');
};

const ruleTable = () => `<table class="tbl"><thead><tr><th>What happens</th><th>Number of people</th></tr></thead><tbody>
  <tr><td>left over once, short once</td><td>(left over <b>+</b> short) ÷ difference in share</td></tr>
  <tr><td>left over both times</td><td>(bigger <b>−</b> smaller left over) ÷ difference</td></tr>
  <tr><td>short both times</td><td>(bigger <b>−</b> smaller shortage) ÷ difference</td></tr></tbody></table>`;

const t17 = {
  id: 't17',
  title: 'Excess and Shortage',
  intro: 'Share things one way and some are left over. Share another way and there aren\'t enough! From just these two clues, a model lets you find how many people <i>and</i> how many things there are.',
  skills: ['Sharing', 'Model drawing', 'Checking both plans'],
  art: t17art,
  explore: {
    setup: 'On the second day of Chinese New Year, Chloe brings a jar of home-made pineapple tarts to her grandma\'s flat to share with her cousins. "If each cousin gets <b>3</b> tarts, there are <b>10</b> left over. If each cousin gets <b>5</b> tarts, I am <b>6</b> tarts short!"',
    art: () => svg('0 0 340 300', `<rect width="340" height="300" rx="20" fill="#fff0ea"/>
      <path d="M0 20 q170 34 340 0" fill="none" stroke="#c98b55" stroke-width="3"/>
      ${lantern(70, 52, .9)}${lantern(270, 52, .9)}${lantern(170, 64, .7)}
      ${kid('chloe', { x: 76, y: 136, s: .8, pose: 'wave' })}
      ${kid(COUSIN1, { x: 238, y: 146, s: .68, pose: 'cheer' })}${kid(COUSIN2, { x: 296, y: 150, s: .64, mood: 'think', pose: 'think', flip: true })}
      ${A.table(20, 238, 300)}
      ${tartJar(140, 180)}
      <ellipse cx="248" cy="234" rx="38" ry="7" fill="#fff" ${S} stroke-width="2.5"/>${orange(232, 224)}${orange(252, 222)}${orange(268, 226)}${orange(243, 210)}`, 'Chloe, her cousins and a jar of pineapple tarts at a Chinese New Year visit with red lanterns and mandarin oranges'),
    steps: [
      { who: 'chloe', mood: 'think', text: 'Oops, I didn\'t count my cousins <i>or</i> the tarts. Can we still work out both numbers from my two clues?' },
      { who: 'leo', mood: 'teach', text: 'Yes! Draw one box for each cousin. We don\'t know how many boxes yet, so put "…" in the middle. Then show what happens at the end of each plan.',
        art: () => shareRows([{ name: '3 each', each: 3, left: 10 }, { name: '5 each', each: 5, short: 6 }], { label: 'Sharing model: 3 each leaves 10 over; 5 each is 6 short', max: 430 }) },
      { who: 'arjun', text: 'Going from 3 each to 5 each, every cousin gets <b>2 more</b> tarts. Where do they come from? First the 10 left-over tarts get used up, and then we still need 6 more. So the extra 2 per cousin adds up to 10 + 6 = <b>16</b> tarts.' },
      { who: 'leo', mood: 'teach', text: '2 more tarts for each cousin makes 16 tarts, so there are 16 ÷ 2 = <b>8</b> cousins. Here is the whole bar model. The purple bits are the extra 2 tarts for each cousin:',
        art: () => planBars(8, 3, 5, 10, 6, { names: ['3 each', '5 each'], extraText: '= 2 more for each cousin', label: 'Bar model: 8 cousins with 3 tarts each and 10 left over, compared with 5 tarts each and 6 short', max: 460 }) },
      { who: 'aisyah', text: 'Number of tarts = 3 × 8 + 10 = <b>34</b>. Check with the other plan: 5 × 8 − 6 = 34 ✓. Both plans must give the <b>same</b> total.' },
      { who: 'weiming', mood: 'think', text: 'What if there are tarts left over <b>both</b> times? With 3 each, 10 are left. With 4 each, 2 are left.' },
      { who: 'leo', mood: 'teach', text: 'Then giving 1 more each used up 10 − 2 = 8 tarts, so there are 8 ÷ 1 = 8 cousins. (Check: 4 × 8 + 2 = 34 ✓) When both plans are on the same side, <b>subtract</b>. When one has extra and the other is short, <b>add</b>.', art: ruleTable },
    ],
  },
  keys: [
    { title: 'Excess and shortage', text: 'Left over = <b>excess</b>. Not enough = <b>shortage</b>. "Exactly enough" means 0 left over.' },
    { title: 'One left over, one short', text: 'Number of people = (left over + shortage) ÷ difference in each share.' },
    { title: 'Both left over, or both short', text: 'Subtract: (bigger − smaller) ÷ difference in each share.' },
    { title: 'Always check', text: 'Work out the total with <b>both</b> plans: share × people + left over = share × people − shortage. The two totals must match!' },
  ],
  practice: [
    { id: 'a', level: 1, type: 'blanks', prompt: 'Mr Rahman gives out colour pencils to his art group. If each pupil gets <b>4</b> pencils, <b>9</b> pencils are left over. If each pupil gets <b>6</b> pencils, he is <b>5</b> pencils short. Fill in the blanks.',
      art: shareRows([{ name: '4 each', each: 4, left: 9 }, { name: '6 each', each: 6, short: 5 }], { label: 'Sharing model: 4 each leaves 9 over; 6 each is 5 short', max: 420 }),
      template: 'Number of pupils = (9 + 5) ÷ (6 − 4) = {0}<br>Number of pencils = 4 × {1} + 9 = {2}', blanks: [{ answer: 7 }, { answer: 7 }, { answer: 37 }],
      hint: 'In the second plan every pupil gets 2 more pencils. Those extra pencils use up the 9 left over and still need 5 more.',
      solution: ['From 4 each to 6 each, every pupil needs 6 − 4 = 2 more pencils.', 'Those extra pencils are the 9 left over plus the 5 he doesn\'t have: 9 + 5 = 14 pencils.', 'Pupils = 14 ÷ 2 = <b>7</b>', 'Pencils = 4 × 7 + 9 = <b>37</b>. Check: 6 × 7 − 5 = 37 ✓'] },
    { id: 'b', level: 1, type: 'blanks', prompt: 'Residents plant seedlings at the community garden beside their HDB block. If each resident plants <b>6</b> seedlings, <b>20</b> seedlings are left. If each resident plants <b>8</b> seedlings, <b>4</b> seedlings are left. How many residents and how many seedlings are there?',
      art: shareRows([{ name: '6 each', each: 6, left: 20 }, { name: '8 each', each: 8, left: 4 }], { label: 'Sharing model: 6 each leaves 20; 8 each leaves 4', max: 420 }),
      template: 'Residents: {0}<br>Seedlings: {1}', blanks: [{ answer: 8 }, { answer: 68 }],
      hint: 'Seedlings are left over both times. When each resident plants 2 more, the pile of left-over seedlings shrinks from 20 to 4.',
      solution: ['From 6 each to 8 each, every resident plants 2 more.', 'The left-over seedlings drop from 20 to 4, so the extra planting used 20 − 4 = 16 seedlings.', 'Residents = 16 ÷ 2 = <b>8</b>', 'Seedlings = 6 × 8 + 20 = <b>68</b>. Check: 8 × 8 + 4 = 68 ✓'] },
    { id: 'c', level: 1, type: 'blanks', prompt: 'Mdm Lim packs curry puffs into boxes for a community centre event. If she puts <b>8</b> curry puffs in each box, she is <b>18</b> curry puffs short. If she puts <b>6</b> in each box, she is still <b>4</b> short. How many boxes and how many curry puffs does she have?',
      art: shareRows([{ name: '8 each', each: 8, short: 18 }, { name: '6 each', each: 6, short: 4 }], { label: 'Sharing model: 8 per box is 18 short; 6 per box is 4 short', max: 420 }),
      template: 'Boxes: {0}<br>Curry puffs: {1}', blanks: [{ answer: 7 }, { answer: 38 }],
      hint: 'She is short both times. Putting 2 fewer curry puffs in each box makes the shortage drop from 18 to 4.',
      solution: ['From 8 per box to 6 per box, each box needs 2 fewer.', 'The shortage drops by 18 − 4 = 14 curry puffs.', 'Boxes = 14 ÷ 2 = <b>7</b>', 'Curry puffs = 8 × 7 − 18 = <b>38</b>. Check: 6 × 7 − 4 = 38 ✓'] },
    { id: 'd', level: 2, type: 'mcq', prompt: 'Mrs Pillai shares stickers among the children at a Deepavali party. If each child gets <b>7</b> stickers, <b>11</b> are left over. If each child gets <b>9</b> stickers, she needs <b>5</b> more stickers. Which calculation gives the number of children?',
      options: ['(11 + 5) ÷ (9 − 7)', '(11 − 5) ÷ (9 − 7)', '(11 + 5) ÷ (9 + 7)', '(9 − 7) ÷ (11 + 5)'], answer: 0,
      hint: 'One plan has stickers left over and the other plan is short. Do you add or subtract 11 and 5?',
      solution: ['One plan has extra and the other is short, so <b>add</b>: 11 + 5 = 16 stickers.', 'Each child gets 9 − 7 = 2 more stickers in the second plan.', 'Children = <b>(11 + 5) ÷ (9 − 7)</b> = 16 ÷ 2 = 8.', 'Check: 7 × 8 + 11 = 67 and 9 × 8 − 5 = 67 ✓'] },
    { id: 'e', level: 2, type: 'blanks', prompt: 'Uncle Tan sets up chairs at the void deck for a National Day party. If he puts <b>10</b> chairs in each row, <b>24</b> chairs are left over. If he puts <b>13</b> chairs in each row, the chairs are <b>exactly enough</b>. How many rows are there, and how many chairs?',
      template: 'Rows: {0}<br>Chairs: {1}', blanks: [{ answer: 8 }, { answer: 104 }],
      hint: '"Exactly enough" means 0 left over. When each row gets 3 more chairs, all 24 extra chairs are used up.',
      solution: ['"Exactly enough" means 0 chairs left over.', 'From 10 to 13 chairs per row, each row takes 3 more chairs. The left-over chairs go from 24 to 0, so 24 chairs are used.', 'Rows = 24 ÷ 3 = <b>8</b>', 'Chairs = 13 × 8 = <b>104</b>. Check: 10 × 8 + 24 = 104 ✓'] },
    { id: 'f', level: 2, type: 'blanks', prompt: 'Nurul plans to fold paper cranes for her CCA\'s hospital visit, finishing on a certain day. If she folds <b>20</b> cranes a day, she will need <b>2 more days</b> than she planned. If she folds <b>30</b> cranes a day, she will finish <b>2 days early</b>. How many days did she plan, and how many cranes will she fold?',
      template: 'Planned days: {0}<br>Cranes: {1}', blanks: [{ answer: 10 }, { answer: 240 }],
      hint: 'Look at the planned last day. At 20 a day, how many cranes are still not done (2 more days of 20)? At 30 a day, how many more could she have folded (2 more days of 30)?',
      solution: ['At 20 a day, when the planned days are over she is still 2 × 20 = 40 cranes short.', 'At 30 a day she finishes 2 days early, so in the planned days she could fold 2 × 30 = 60 cranes <b>more</b> than needed.', 'One plan is short and one has extra: (40 + 60) ÷ (30 − 20) = 100 ÷ 10 = <b>10</b> planned days.', 'Cranes = 20 × 10 + 40 = <b>240</b>.', 'Check: 240 ÷ 20 = 12 days (2 more than 10) and 240 ÷ 30 = 8 days (2 fewer than 10) ✓'] },
    { id: 'g', level: 3, type: 'blanks', prompt: 'At a Children\'s Day party, Mrs Tan hands out stickers. If every pupil gets <b>5</b> stickers, <b>28</b> are left over. If <b>4</b> of the pupils get <b>6</b> stickers each and all the other pupils get <b>9</b> each, the stickers are used up exactly. How many pupils and how many stickers are there?',
      template: 'Pupils: {0}<br>Stickers: {1}', blanks: [{ answer: 10 }, { answer: 78 }],
      hint: 'Make the second plan "fair" first: if those 4 pupils also got 9 stickers each, how many stickers short would Mrs Tan be?',
      solution: ['Pretend every pupil gets 9. The 4 pupils would each need 9 − 6 = 3 more, so she would be 4 × 3 = 12 stickers short.', 'Now: 5 each → 28 left over; 9 each → 12 short.', 'Pupils = (28 + 12) ÷ (9 − 5) = 40 ÷ 4 = <b>10</b>', 'Stickers = 5 × 10 + 28 = <b>78</b>.', 'Check: 4 × 6 + 6 × 9 = 24 + 54 = 78 ✓'] },
    { id: 'h', level: 3, type: 'blanks', prompt: 'Mrs Lee, the Art Club teacher, buys pencils and erasers from the school bookshop. She has <b>3 times</b> as many pencils as erasers. She gives each member <b>4 pencils</b> and <b>1 eraser</b>. Then <b>14 pencils</b> and <b>10 erasers</b> are left. How many members are there, and how many pencils did she buy?',
      template: 'Members: {0}<br>Pencils: {1}', blanks: [{ answer: 16 }, { answer: 78 }],
      hint: 'Imagine there were 3 times as many erasers. Then there would be exactly as many erasers as pencils. Each member would get 3 erasers, and how many would be left?',
      solution: ['Imagine 3 times as many erasers. Then there are as many erasers as pencils. Each member would get 3 × 1 = 3, and 3 × 10 = 30 would be left.', 'So the same number of things can be shared in two ways: 3 each → 30 left over; 4 each → 14 left over.', 'Members = (30 − 14) ÷ (4 − 3) = <b>16</b>', 'Pencils = 4 × 16 + 14 = <b>78</b>.', 'Check: erasers = 16 + 10 = 26, and 3 × 26 = 78 ✓'] },
    { id: 'i', level: 3, type: 'mcq', prompt: 'At a class chalet stay in Pasir Ris, pupils share rooms. If <b>6</b> pupils sleep in each room, <b>4</b> pupils have no room. If <b>8</b> pupils sleep in each room, <b>2 rooms are left empty</b> and every other room is full. How many rooms and how many pupils are there?',
      options: ['10 rooms, 64 pupils', '3 rooms, 22 pupils', '8 rooms, 64 pupils', '6 rooms, 40 pupils'], answer: 0,
      hint: '2 empty rooms does <b>not</b> mean "2 short". How many more pupils would be needed to fill those 2 rooms?',
      solution: ['6 per room: 4 pupils are left over (excess 4).', '8 per room: the 2 empty rooms would need 2 × 8 = 16 more pupils (shortage 16).', 'Rooms = (4 + 16) ÷ (8 − 6) = 20 ÷ 2 = <b>10</b>', 'Pupils = 6 × 10 + 4 = <b>64</b>. Check: 64 ÷ 8 = 8 full rooms, so 10 − 8 = 2 rooms are empty ✓', '"8 rooms" counts only the rooms in use. "3 rooms" wrongly treats the 2 empty rooms as 2 pupils short.'] },
  ],
  adult: 'Excess-and-shortage problems are <b>not</b> in the MOE primary syllabus, so this topic is <b>enrichment</b> (olympiad style). It only needs P4 multiplication and division, plus careful reasoning with a model. The key idea: the change in each share × the number of people = the change in what is left over or short. Common mistakes: adding when both plans have leftovers (or both are short), forgetting that "exactly enough" means 0, and treating "2 empty rooms" as "2 short" when it really means 2 × 8 = 16 places. Questions g and h first turn an awkward plan into a "fair" one, a step that links to the supposition method in Unit 8. Tip: always find the total from <b>both</b> plans to check, and act a problem out with counters or sweets.',
};

export default { t16, t17 };
