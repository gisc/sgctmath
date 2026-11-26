// Unit 3 · Seeing Shapes — original content, Singapore context.
import * as A from '../art.js';
const { svg, kid, leo } = A;
const ink = A.ink, S = A.stroke;

/* ===================== shared drawing helpers ===================== */
const HF = 'font-family="Baloo 2, sans-serif" font-weight="800"';
const NF = 'font-family="Nunito, sans-serif" font-weight="800"';
const COL = { teal: '#0f9d94', coral: '#ff6b5b', sun: '#ffc94a', grape: '#7b61ff', leaf: '#3dbb6b', sky: '#4aa8ff' };
const FILL = { '#': '#fff3cf', a: '#ffd66b', b: '#8fc8ff', c: '#ff9d92', d: '#86dca0', e: '#b9a8ff', f: '#7fd6cf', '?': '#ffe0ea' };
let uidN = 0;
const uid = p => `u3${p}${++uidN}`;
const r1 = n => Math.round(n * 10) / 10;
const rad = d => d * Math.PI / 180;
// point at distance r from (cx,cy) in direction d degrees (maths convention: 0° = east, counter-clockwise; SVG y points down)
const P = (cx, cy, r, d) => [r1(cx + r * Math.cos(rad(d))), r1(cy - r * Math.sin(rad(d)))];
const dirOf = (a, b) => Math.atan2(-(b[1] - a[1]), b[0] - a[0]) * 180 / Math.PI;
const mod360 = d => ((d % 360) + 360) % 360;
const txt = (x, y, t, { size = 16, fill = ink, anchor = 'middle', font = NF, extra = '' } = {}) =>
  `<text x="${r1(x)}" y="${r1(y)}" text-anchor="${anchor}" dominant-baseline="central" ${font} font-size="${size}" fill="${fill}" ${extra}>${t}</text>`;
const it = t => `<tspan font-style="italic">${t}</tspan>`;
const seg = (a, b, { w = 3, col = ink, dash = '' } = {}) =>
  `<line x1="${r1(a[0])}" y1="${r1(a[1])}" x2="${r1(b[0])}" y2="${r1(b[1])}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
const poly = (pts, fill, extra = '') => `<path d="M${pts.map(p => `${r1(p[0])} ${r1(p[1])}`).join(' L')}Z" fill="${fill}" ${extra}/>`;
// angle mark from direction d0 counter-clockwise to d1
function arc(cx, cy, r, d0, d1, { col = COL.coral, fill = '', w = 2.5 } = {}) {
  const diff = mod360(d1 - d0), large = diff > 180 ? 1 : 0;
  const [x0, y0] = P(cx, cy, r, d0), [x1, y1] = P(cx, cy, r, d0 + diff);
  const f = fill ? `<path d="M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 ${large} 0 ${x1} ${y1}Z" fill="${fill}" opacity=".45"/>` : '';
  return `${f}<path d="M${x0} ${y0} A${r} ${r} 0 ${large} 0 ${x1} ${y1}" fill="none" stroke="${col}" stroke-width="${w}"/>`;
}
const angLab = (cx, cy, r, d0, d1, t, o = {}) => { const [x, y] = P(cx, cy, r, d0 + mod360(d1 - d0) / 2); return txt(x, y, t, o); };
function rightMark(cx, cy, s, d0, col = COL.coral) {
  const a = P(cx, cy, s, d0), b = P(cx, cy, s, d0 + 90), c = [r1(a[0] + b[0] - cx), r1(a[1] + b[1] - cy)];
  return `<path d="M${a[0]} ${a[1]} L${c[0]} ${c[1]} L${b[0]} ${b[1]}" fill="none" stroke="${col}" stroke-width="2.5"/>`;
}
// interior angle at V of polygon with neighbours Pa, Pb: returns [d0, d1] (counter-clockwise, < 180°)
function angAt(V, Pa, Pb) {
  let d0 = dirOf(V, Pa), d1 = dirOf(V, Pb);
  if (mod360(d1 - d0) > 180) [d0, d1] = [d1, d0];
  return [d0, d1];
}
const dot = (x, y, r = 5, fill = ink) => `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r}" fill="${fill}"/>`;

/* ---------- squares on a grid (polyominoes) ---------- */
// spec: array of strings; '.' = empty, any other character = a square. Same character = same piece.
function grid(spec, { u = 34, pad = 6, ox = 0, oy = 0, fills = FILL, nums = false, thin = '#b3bdd1' } = {}) {
  const at = (x, y) => (spec[y] && spec[y][x] && spec[y][x] !== '.') ? spec[y][x] : null;
  let s = '', d = '', n = 0;
  spec.forEach((row, y) => [...row].forEach((ch, x) => {
    if (ch === '.') return;
    const X = ox + pad + x * u, Y = oy + pad + y * u;
    s += `<rect x="${X}" y="${Y}" width="${u}" height="${u}" fill="${fills[ch] || '#fff'}" stroke="${thin}" stroke-width="1.5"/>`;
    if (ch === '?') s += txt(X + u / 2, Y + u / 2 + 1, '?', { size: u * .5, fill: '#d6453a', font: HF });
    else if (nums) s += txt(X + u / 2, Y + u / 2 + 1, ++n, { size: u * .42, fill: '#5d6b88' });
    if (at(x, y - 1) !== ch) d += `M${X} ${Y}h${u}`;
    if (at(x, y + 1) !== ch) d += `M${X} ${Y + u}h${u}`;
    if (at(x - 1, y) !== ch) d += `M${X} ${Y}v${u}`;
    if (at(x + 1, y) !== ch) d += `M${X + u} ${Y}v${u}`;
  }));
  const W = Math.max(...spec.map(r => r.length)) * u + 2 * pad, H = spec.length * u + 2 * pad;
  return { inner: s + `<path d="${d}" fill="none" stroke="${ink}" stroke-width="3.5" stroke-linecap="round"/>`, W, H };
}
const gridSvg = (spec, o = {}) => { const g = grid(spec, o); return svg(`0 0 ${g.W} ${g.H}`, g.inner, o.label || 'Shape made of squares', `style="max-width:${o.maxw || Math.round(g.W * 1.25)}px"`); };
// faint square-centimetre grid
function cmGrid(x0, y0, cols, rows, u) {
  let s = `<rect x="${x0}" y="${y0}" width="${cols * u}" height="${rows * u}" fill="#fbfdff"/>`;
  for (let i = 0; i <= cols; i++) s += `<line x1="${x0 + i * u}" y1="${y0}" x2="${x0 + i * u}" y2="${y0 + rows * u}" stroke="#cdd6e6" stroke-width="1.3"/>`;
  for (let j = 0; j <= rows; j++) s += `<line x1="${x0}" y1="${y0 + j * u}" x2="${x0 + cols * u}" y2="${y0 + j * u}" stroke="#cdd6e6" stroke-width="1.3"/>`;
  return s;
}
const gp = (x0, y0, u) => ([x, y]) => [x0 + x * u, y0 + y * u];

function scissors(x, y, rot = 0, s = 1) {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
    <path d="M0 -4 L64 -14 Q72 -12 66 -6 Z" fill="#dfe6f2" ${S} stroke-width="2.5"/>
    <path d="M0 4 L64 14 Q72 12 66 6 Z" fill="#dfe6f2" ${S} stroke-width="2.5"/>
    <path d="M0 -2 L-18 -14" stroke="${ink}" stroke-width="8" stroke-linecap="round"/><path d="M0 2 L-18 14" stroke="${ink}" stroke-width="8" stroke-linecap="round"/>
    <circle cx="-28" cy="-18" r="11" fill="none" stroke="${ink}" stroke-width="9"/><circle cx="-28" cy="-18" r="11" fill="none" stroke="${COL.coral}" stroke-width="5"/>
    <circle cx="-28" cy="18" r="11" fill="none" stroke="${ink}" stroke-width="9"/><circle cx="-28" cy="18" r="11" fill="none" stroke="${COL.coral}" stroke-width="5"/>
    <circle cx="0" cy="0" r="3.5" fill="${ink}"/></g>`;
}

/* ---------- regular polygons and tilings ---------- */
// walk a regular n-gon with side s starting at vertex O in direction th (counter-clockwise).
// At O it fills the angle from th to th + (180 - 360/n).
function regPoly(O, s, n, th) {
  const pts = [O];
  for (let k = 0; k < n - 1; k++) { const p = pts[pts.length - 1]; pts.push(P(p[0], p[1], s, th + k * 360 / n)); }
  return pts;
}
const interior = n => 180 - 360 / n;
// several regular polygons placed corner-to-corner around point O
function vertexFig(O, s, ns, th0, { fills = [FILL.a, FILL.b, FILL.c, FILL.d, FILL.e, FILL.f], labels = [], arcs = true, r = 22, labR = 0, size = 15 } = {}) {
  let g = '', a = '', th = th0;
  ns.forEach((n, i) => {
    const pts = regPoly(O, s, n, th);
    g += poly(pts, fills[i % fills.length], `${S}`);
    if (arcs) a += arc(O[0], O[1], n === 4 ? r * .8 : r, th, th + interior(n), { col: ink, w: 2 });
    if (labels[i]) {
      if (labR) a += angLab(O[0], O[1], labR, th, th + interior(n), labels[i], { size });
      else a += txt(pts.reduce((t, p) => t + p[0], 0) / n, pts.reduce((t, p) => t + p[1], 0) / n, labels[i], { size });
    }
    th += interior(n);
  });
  return { inner: g + a + dot(O[0], O[1], 4.5, COL.coral), end: th };
}
// clipped patches of tilings, for pictures
function clipBox(x, y, w, h, inner, rx = 12) {
  const id = uid('c');
  return `<defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"/></clipPath></defs><g clip-path="url(#${id})">${inner}</g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="none" ${S}/>`;
}
function triPatch(x, y, w, h, s, cols = ['#8fc8ff', '#e3f1ff']) {
  const e1 = [s, 0], e2 = [s / 2, -s * Math.sqrt(3) / 2];
  let g = '';
  const n = Math.ceil((w + h) / s) + 2;
  for (let a = -n; a <= n; a++) for (let b = -n; b <= n; b++) {
    const p = [x + a * e1[0] + b * e2[0], y + h + a * e1[1] + b * e2[1]];
    if (p[0] < x - 2 * s || p[0] > x + w + s || p[1] < y - s || p[1] > y + h + 2 * s) continue;
    const q = [p[0] + e1[0], p[1]], r = [p[0] + e2[0], p[1] + e2[1]], t = [q[0] + e2[0], q[1] + e2[1]];
    g += poly([p, q, r], cols[0], 'stroke="#23304a" stroke-width="2"') + poly([q, t, r], cols[1], 'stroke="#23304a" stroke-width="2"');
  }
  return clipBox(x, y, w, h, g);
}
function sqPatch(x, y, w, h, s, cols = ['#ffd66b', '#fff3cf']) {
  let g = '';
  for (let i = 0; i * s < w; i++) for (let j = 0; j * s < h; j++)
    g += `<rect x="${x + i * s}" y="${y + j * s}" width="${s}" height="${s}" fill="${cols[(i + j) % 2]}" stroke="${ink}" stroke-width="2"/>`;
  return clipBox(x, y, w, h, g);
}
function hexPatch(x, y, w, h, s, cols = ['#86dca0', '#c9f0d4', '#e9f9ee'], ox = 0, oy = 0) {
  let g = '';
  for (let i = -1; i * 1.5 * s < w + 2 * s; i++) for (let j = -1; j * Math.sqrt(3) * s < h + 2 * s; j++) {
    const cx = x + ox + i * 1.5 * s, cy = y + oy + Math.sqrt(3) * s * (j + (i & 1) / 2);
    const pts = [0, 60, 120, 180, 240, 300].map(d => P(cx, cy, s, d));
    g += poly(pts, cols[((i % 3) + 3 + 2 * j) % 3], 'stroke="#23304a" stroke-width="2"');
  }
  return clipBox(x, y, w, h, g);
}
function octPatch(x, y, w, h, s, cols = ['#ffd66b', '#7fd6cf']) {
  const d = s * (1 + Math.SQRT2), R = s / (2 * Math.sin(rad(22.5)));
  let g = '';
  for (let i = -1; i * d < w + d; i++) for (let j = -1; j * d < h + d; j++) {
    const cx = x + i * d, cy = y + j * d;
    g += poly([0, 1, 2, 3, 4, 5, 6, 7].map(k => P(cx, cy, R, 22.5 + 45 * k)), cols[0], 'stroke="#23304a" stroke-width="2"');
    const qx = cx + d / 2, qy = cy + d / 2, hd = s / Math.SQRT2;
    g += poly([[qx, qy - hd], [qx + hd, qy], [qx, qy + hd], [qx - hd, qy]], cols[1], 'stroke="#23304a" stroke-width="2"');
  }
  return clipBox(x, y, w, h, g);
}
const ngonIcon = (n, fill) => {
  const pts = [...Array(n)].map((_, k) => P(20, 21, 16, 90 + k * 360 / n + (n % 2 ? 0 : 180 / n)));
  return svg('0 0 40 40', poly(pts, fill, `${S} stroke-width="2.5"`), '', 'width="34" height="34" style="flex:none"');
};
const optIcon = (n, fill, label) => `<span style="display:inline-flex;flex-direction:column;align-items:flex-start;gap:4px;min-width:0">${ngonIcon(n, fill)}<span>${label}</span></span>`;

/* ---------- clock ---------- */
function clock(cx, cy, r, h, m = 0, { shade = true, nums = true } = {}) {
  let s = `<circle cx="${cx}" cy="${cy}" r="${r + 6}" fill="${COL.grape}" ${S}/><circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" ${S}/>`;
  for (let i = 0; i < 12; i++) {
    s += seg(P(cx, cy, r - 3, 90 - 30 * i), P(cx, cy, r - 10, 90 - 30 * i), { w: 3 });
    if (nums) { const [x, y] = P(cx, cy, r - 19, 90 - 30 * i); s += txt(x, y + 1, i === 0 ? 12 : i, { size: r * .19, fill: '#5d6b88' }); }
  }
  const hd = 90 - (30 * (h % 12) + m / 2), md = 90 - 6 * m;
  if (shade) { let d0 = hd, d1 = md; if (mod360(d1 - d0) > 180) [d0, d1] = [d1, d0]; s += arc(cx, cy, r * .3, d0, d1, { col: COL.coral, fill: '#ffb3a9', w: 3 }); }
  s += seg([cx, cy], P(cx, cy, r * .4, hd), { w: 7 }) + seg([cx, cy], P(cx, cy, r * .54, md), { w: 4.5 });
  return s + dot(cx, cy, 5, COL.coral);
}

/* ---------- triangle lattice (for counting) ---------- */
function bigTri(x0, y0, n, s, { fills = ['#fff3cf', '#ffd66b'] } = {}) {
  // equilateral triangle of side n·s, bottom-left corner at (x0, y0), cut into n² small triangles
  const h = s * Math.sqrt(3) / 2;
  let g = '';
  for (let r = 0; r < n; r++) for (let i = 0; i < n - r; i++) {
    const bx = x0 + (i + r / 2) * s, by = y0 - r * h;
    g += poly([[bx, by], [bx + s, by], [bx + s / 2, by - h]], fills[0], 'stroke="#23304a" stroke-width="2.5"');
    if (i < n - r - 1) g += poly([[bx + s, by], [bx + s / 2, by - h], [bx + 1.5 * s, by - h]], fills[1], 'stroke="#23304a" stroke-width="2.5"');
  }
  return g + poly([[x0, y0], [x0 + n * s, y0], [x0 + n * s / 2, y0 - n * h]], 'none', `${S} stroke-width="3.5"`);
}

/* ===================== Topic 7: Cutting Up Shapes ===================== */
const STAIR = ['##..', '###.', '####', '.###'];
const STAIR_L = ['aa..', 'abb.', 'ccbd', '.cdd'];
const STAIR_I = ['ab..', 'abc.', 'abc?', '.?c?'];
const PIN = ['abbb', 'abcc', 'aadc', 'dddc'];

function t07banner() {
  const sq = 66, y = 58, xs = [18, 103, 188, 273];
  const k = [FILL.a, FILL.b, FILL.c, FILL.d];
  let g = '';
  // 1. four strips
  for (let i = 0; i < 4; i++) g += `<rect x="${xs[0] + i * sq / 4}" y="${y}" width="${sq / 4}" height="${sq}" fill="${k[i]}" ${S}/>`;
  // 2. four small squares
  for (let i = 0; i < 4; i++) g += `<rect x="${xs[1] + (i % 2) * sq / 2}" y="${y + Math.floor(i / 2) * sq / 2}" width="${sq / 2}" height="${sq / 2}" fill="${k[i]}" ${S}/>`;
  // 3. both diagonals
  const x3 = xs[2], c = [x3 + sq / 2, y + sq / 2], cn = [[x3, y], [x3 + sq, y], [x3 + sq, y + sq], [x3, y + sq]];
  for (let i = 0; i < 4; i++) g += poly([cn[i], cn[(i + 1) % 4], c], k[i], S);
  // 4. pinwheel of L pieces
  g += grid(PIN, { u: sq / 4, pad: 0, ox: xs[3], oy: y, thin: 'none' }).inner;
  ['strips', 'squares', 'triangles', 'L shapes'].forEach((t, i) => { g += txt(xs[i] + sq / 2, y + sq + 18, t, { size: 14 }); });
  return svg('0 0 360 220', `<rect width="360" height="220" rx="20" fill="#f1edff"/>
    ${txt(180, 30, '1 square → 4 identical pieces', { size: 21, font: HF, fill: COL.grape })}${g}
    ${scissors(56, 182, -12, .85)}
    ${txt(240, 180, 'Same shape, same size!', { size: 17, fill: COL.teal })}`, 'A square cut into 4 identical pieces in four different ways: strips, small squares, triangles and L shapes');
}

const t07 = {
  id: 't07',
  title: 'Cutting Up Shapes',
  intro: 'Can you cut a shape into pieces that are exactly the same? It\'s like a puzzle in reverse! You\'ll also learn to find areas by cutting a shape up and moving the pieces.',
  skills: ['Identical pieces', 'Area', 'Spatial sense'],
  art: t07banner,
  explore: {
    setup: 'At the community centre craft corner, Mdm Rahimah gives Wei Ming, Aisyah, Arjun and Chloe <b>one</b> piece of card made of small squares. They must cut it along the lines into <b>4 identical pieces</b>, one each.',
    art: () => {
      const g = grid(STAIR, { u: 26, pad: 0, ox: 118, oy: 46 });
      return svg('0 0 340 300', `<rect width="340" height="300" rx="20" fill="#fff6e4"/>
        <rect x="100" y="28" width="140" height="140" rx="10" fill="#fff" ${S}/>${g.inner}
        <path d="M128 168 l-14 52 M212 168 l14 52" stroke="#a86f3f" stroke-width="6" stroke-linecap="round"/>
        ${kid('weiming', { x: 52, y: 150, s: .78, pose: 'think', mood: 'think' })}${kid('aisyah', { x: 290, y: 150, s: .78, pose: 'wave' })}
        ${A.table(16, 236, 308)}${scissors(150, 226, -8, .8)}`, 'Wei Ming and Aisyah with a card made of 12 squares');
    },
    steps: [
      { who: 'chloe', text: 'First, how big must each piece be? I count <b>12</b> small squares. 12 ÷ 4 = <b>3</b>, so every piece has exactly 3 squares.',
        art: () => gridSvg(STAIR, { u: 34, nums: true, maxw: 170, label: 'The card with its 12 squares numbered' }) },
      { who: 'arjun', mood: 'think', text: 'How many different pieces can 3 squares make, if they join edge to edge? Only <b>two</b>: a <b>straight</b> piece and an <b>L</b> piece. An L that is turned or flipped is still the same L.',
        art: () => {
          const a = grid(['aaa'], { u: 26, pad: 4, ox: 0, oy: 30 }), b = grid(['b.', 'bb'], { u: 26, pad: 4, ox: 110, oy: 4 }),
            c = grid(['bb', 'b.'], { u: 26, pad: 4, ox: 180, oy: 4 }), d = grid(['bb', '.b'], { u: 26, pad: 4, ox: 250, oy: 4 });
          return svg('0 0 320 96', a.inner + b.inner + c.inner + d.inner + txt(44, 80, 'straight', { size: 14 }) + txt(215, 80, 'L (the same piece, turned)', { size: 14 }), 'A straight piece of 3 squares, and three copies of the same L piece turned different ways', 'style="max-width:340px"');
        } },
      { who: 'weiming', mood: 'think', text: 'Let me try straight pieces… Three of them fit, but the last 3 squares (marked ?) are split apart, so they can\'t make one piece. <b>Stuck!</b>',
        art: () => gridSvg(STAIR_I, { u: 34, maxw: 170, label: 'Three straight pieces fit, leaving three loose squares' }) },
      { who: 'leo', mood: 'teach', text: 'Start with the <b>tricky corner</b>. The top-left square only touches the square beside it and the square below it. An <b>L</b> piece hugs that corner perfectly, so let\'s begin there.' },
      { who: 'aisyah', text: 'Then I keep filling the next uncovered corner with an L… It works! Four L pieces, each turned a different way.',
        art: () => gridSvg(STAIR_L, { u: 34, maxw: 170, label: 'The card cut into 4 identical L pieces' }) },
      { who: 'leo', text: '<b>Check:</b> 4 pieces × 3 squares = 12 squares ✓. If you lift one piece and turn it, it fits exactly on top of any other piece, so they are <b>identical</b>. And notice: cutting and moving pieces never changes the total area. That idea will help us find areas too!' },
    ],
  },
  keys: [
    { title: 'Count, then divide', text: 'Count the small squares. Total ÷ number of pieces = how many squares go in each piece. 12 squares into 4 pieces → 3 squares each.' },
    { title: 'Identical means…', text: 'Same shape <b>and</b> same size: one piece fits exactly on top of another, even if you turn it or flip it over. Equal area alone is <b>not</b> enough!' },
    { title: 'Start at a tricky corner', text: 'A square that sticks out can only be covered in a few ways. Fill it first, then keep going.' },
    { title: 'Cut and move', text: 'Cutting a shape and moving the pieces keeps the area the same. Turn a slanted shape into a rectangle, then use length × breadth.' },
  ],
  practice: [
    { id: 'a', level: 1, type: 'blanks', prompt: 'Uncle Tan has a tray of kueh shaped like this. He wants to cut it along the lines into <b>5 identical pieces</b>. How many squares are there altogether, and how many squares go in each piece?',
      art: gridSvg(['##...', '####.', '#####', '.####'], { u: 32, maxw: 190, label: 'A shape made of 15 squares' }),
      template: 'Altogether: {0} squares<br>Each piece: {1} squares', blanks: [{ answer: 15, size: 'sm' }, { answer: 3, size: 'sm' }],
      hint: 'Count row by row. Then share the squares equally among 5 pieces.',
      solution: ['Row by row: 2 + 4 + 5 + 4 = <b>15</b> squares.', '15 ÷ 5 = <b>3</b> squares in each piece.', '(It really can be done, using 5 L pieces!)'] },
    { id: 'b', level: 1, type: 'blanks', prompt: 'This shape is made of 4 equal squares. Wei Ming draws both diagonals in one square, which cuts it into 4 identical triangles. If he does the same in <b>every</b> square, how many identical triangles will there be?',
      art: (() => {
        const u = 58, o = 6, g = grid(['###', '.#.'], { u, pad: o });
        return svg(`0 0 ${g.W} ${g.H}`, g.inner + seg([o, o], [o + u, o + u], { w: 2.5, col: COL.coral, dash: '6 5' }) + seg([o + u, o], [o, o + u], { w: 2.5, col: COL.coral, dash: '6 5' }), 'A T shape of 4 squares with both diagonals drawn in one square', 'style="max-width:220px"');
      })(),
      template: '{0} triangles', blanks: [{ answer: 16 }],
      hint: 'How many triangles does one square give? How many squares are there?',
      solution: ['Both diagonals cut one square into 4 identical triangles.', 'There are 4 squares, so 4 × 4 = <b>16</b> triangles.'] },
    { id: 'c', level: 1, type: 'blanks', prompt: 'Each small square is 1 cm by 1 cm. Chloe cuts off the shaded triangle along the dotted line and moves it to the other side. What is the <b>area</b> of the slanted shape?',
      art: (() => {
        const u = 26, x0 = 8, y0 = 8, g = gp(x0, y0, u);
        const shape = [[0, 4], [2, 0], [8, 0], [6, 4]].map(g);
        return svg(`0 0 ${9 * u + 16} ${5 * u + 16}`, cmGrid(x0, y0, 9, 5, u) +
          poly(shape, '#c7e6ff', S) + poly([[0, 4], [2, 0], [2, 4]].map(g), FILL.a, S) +
          poly([[6, 4], [8, 0], [8, 4]].map(g), 'none', `stroke="${COL.coral}" stroke-width="2.5" stroke-dasharray="6 5"`) +
          seg(g([2, 0]), g([2, 4]), { w: 2.5, col: COL.coral, dash: '6 5' }) +
          `<path d="M${g([1.2, 4.55])[0]} ${g([1.2, 4.55])[1]} Q${g([4, 5.1])[0]} ${g([4, 5.1])[1]} ${g([6.8, 4.55])[0]} ${g([6.8, 4.55])[1]}" fill="none" stroke="${COL.coral}" stroke-width="2.5" marker-end="url(#u3arr)"/>` +
          `<defs><marker id="u3arr" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="${COL.coral}"/></marker></defs>`,
          'A slanted four-sided shape on a 1 cm grid; a triangle is cut off one end and moved to the other end', 'style="max-width:300px"');
      })(),
      template: 'Area = {0} cm²', blanks: [{ answer: 24 }],
      hint: 'After the move, the shape becomes a rectangle. How long and how wide is it?',
      solution: ['Moving the triangle does not change the area.', 'The new shape is a rectangle 6 cm long and 4 cm wide.', 'Area = 6 × 4 = <b>24 cm²</b>.'] },
    { id: 'd', level: 2, type: 'mcq', prompt: 'Each rectangle below is cut into 4 pieces. In which rectangles are the 4 pieces <b>identical</b>?',
      options: (() => {
        const W = 120, H = 60, o = 4, k = [FILL.a, FILL.b, FILL.c, FILL.d];
        const wrap = (inner, lab) => svg(`0 0 ${W + 2 * o} ${H + 2 * o}`, inner, lab, 'width="112" style="width:112px;max-width:100%;height:auto;flex:none"');
        const R = (x, y, w, h, f) => `<rect x="${o + x}" y="${o + y}" width="${w}" height="${h}" fill="${f}" ${S}/>`;
        const T = (pts, f) => poly(pts.map(([x, y]) => [o + x, o + y]), f, S);
        return [
          wrap([0, 1, 2, 3].map(i => R(i * 30, 0, 30, 60, k[i])).join(''), 'Four upright strips'),
          wrap(R(0, 0, 60, 30, k[0]) + R(60, 0, 60, 30, k[1]) + R(0, 30, 60, 30, k[2]) + R(60, 30, 60, 30, k[3]), 'Four quarters'),
          wrap(T([[0, 0], [120, 0], [60, 30]], k[0]) + T([[120, 0], [120, 60], [60, 30]], k[1]) + T([[120, 60], [0, 60], [60, 30]], k[2]) + T([[0, 60], [0, 0], [60, 30]], k[3]), 'Both diagonals drawn'),
          wrap(R(0, 0, 60, 30, k[0]) + R(0, 30, 60, 30, k[1]) + R(60, 0, 30, 60, k[2]) + R(90, 0, 30, 60, k[3]), 'Left half cut across, right half cut down'),
        ];
      })(), answer: [0, 1, 3],
      hint: 'Identical pieces must fit exactly on top of each other (you may turn them). Equal area is not enough. Look closely at the triangles: are they all the same shape?',
      solution: ['A: 4 strips, each 30 by 60 ✓', 'B: 4 rectangles, each 60 by 30 ✓', 'C: the diagonals make 2 long flat triangles and 2 short tall triangles. They have the same <b>area</b>, but not the same <b>shape</b> ✗', 'D: every piece is a 60 by 30 rectangle. Two of them are just turned on their side ✓', 'So the answer is <b>A, B and D</b>.'] },
    { id: 'e', level: 2, type: 'mcq', prompt: 'Aisyah wants to cut this shape along the lines into <b>4 identical pieces</b>. Which piece could she use? (She may turn or flip the piece.)',
      art: (() => {
        const sh = grid(['#....', '#####', '#####', '....#'], { u: 30, pad: 6, ox: 70 });
        const pa = grid(['aaa'], { u: 24, pad: 0, ox: 14, oy: 176 }), pb = grid(['b.', 'bb'], { u: 24, pad: 0, ox: 128, oy: 152 }), pc = grid(['cc', 'cc'], { u: 24, pad: 0, ox: 226, oy: 152 });
        return svg('0 0 300 236', sh.inner + pa.inner + pb.inner + pc.inner + txt(50, 220, 'Piece A', { size: 15 }) + txt(152, 220, 'Piece B', { size: 15 }) + txt(250, 220, 'Piece C', { size: 15 }), 'A shape of 12 squares, and three pieces: A straight 3 squares, B an L of 3 squares, C a 2 by 2 square', 'style="max-width:320px"');
      })(),
      options: ['Piece A', 'Piece B', 'Piece C'], answer: [0],
      hint: 'First work out how many squares each piece must have. Then try covering the top-left square.',
      solution: ['There are 12 squares, so each piece has 12 ÷ 4 = 3 squares. Piece C has 4 squares, so it cannot work.',
        'Piece B (the L): the top-left square has only one neighbour (the square below it), so its L must be that square, the one below, and the one to the right of that. Now the left square in the bottom full row can only join the square beside it, and no L fits there. Stuck ✗',
        'Piece A (straight) works:' + gridSvg(['a....', 'abbbd', 'acccd', '....d'], { u: 26, maxw: 150, label: 'The shape cut into 4 straight pieces' }), 'The answer is <b>Piece A</b> only.'] },
    { id: 'f', level: 2, type: 'blanks', prompt: 'A sign at the MRT station has this arrow on a 1 cm grid. Find the area of the arrow.',
      art: (() => {
        const u = 28, x0 = 8, y0 = 8, g = gp(x0, y0, u);
        return svg(`0 0 ${7 * u + 16} ${4 * u + 16}`, cmGrid(x0, y0, 7, 4, u) + poly([[0, 1], [4, 1], [4, 0], [6, 2], [4, 4], [4, 3], [0, 3]].map(g), '#86dca0', S), 'An arrow on a 1 cm grid', 'style="max-width:240px"');
      })(),
      template: 'Area = {0} cm²', blanks: [{ answer: 12 }],
      hint: 'Split the arrow into the rectangle and the triangle. Cut the triangle in half along the middle line: can the two halves make a square?',
      solution: ['The rectangle part is 4 cm by 2 cm: 4 × 2 = 8 cm².', 'Cut the triangle along its middle line into 2 halves. Put them together and they make a 2 cm by 2 cm square: 4 cm².', 'Area = 8 + 4 = <b>12 cm²</b>.'] },
    { id: 'g', level: 2, type: 'blanks', prompt: 'A rectangle of card is 9 cm long and 4 cm wide. Arjun cuts it along the thick zig-zag line into 2 identical pieces. He fits the 2 pieces together to make a <b>square</b>. Find the area and the side of the square.',
      art: gridSvg(['aaabbbbbb', 'aaabbbbbb', 'aaaaaabbb', 'aaaaaabbb'], { u: 26, maxw: 280, label: 'A 9 by 4 rectangle cut along a zig-zag line into two pieces' }),
      template: 'Area = {0} cm² &nbsp;&nbsp; Side = {1} cm', blanks: [{ answer: 36 }, { answer: 6, size: 'sm' }],
      hint: 'Cutting and moving does not change the area. Which number times itself gives the area?',
      solution: ['Area of the rectangle = 9 × 4 = <b>36 cm²</b>. The square has the same area.', '6 × 6 = 36, so each side of the square is <b>6 cm</b>.', 'Slide the blue piece up 2 cm and left 3 cm:' + gridSvg(['bbbbbb', 'bbbbbb', 'aaabbb', 'aaabbb', 'aaaaaa', 'aaaaaa'], { u: 22, maxw: 160, label: 'The two pieces fitted together as a 6 by 6 square' })] },
    { id: 'h', level: 3, type: 'blanks', prompt: 'This L shape is made of 3 squares, each 4 cm by 4 cm. Chloe cuts it into <b>4 identical smaller L shapes</b>, each the same shape as the big L. Each small L is made of 3 small squares. Find the side of a small square and the area of one small L.',
      art: (() => {
        const u = 17, o = 30, g = gp(o, 10, u);
        return svg('0 0 190 170', poly([[0, 0], [4, 0], [4, 4], [8, 4], [8, 8], [0, 8]].map(g), '#c7e6ff', S) +
          seg(g([0, 4]), g([4, 4]), { w: 1.5, col: '#8aa0c0', dash: '4 4' }) + seg(g([4, 4]), g([4, 8]), { w: 1.5, col: '#8aa0c0', dash: '4 4' }) +
          txt(o - 16, 10 + 2 * u, '4 cm', { size: 13, extra: `transform="rotate(-90 ${o - 16} ${10 + 2 * u})"` }) + txt(o + 2 * u, 10 + 8 * u + 14, '4 cm', { size: 13 }) + txt(o + 6 * u, 10 + 8 * u + 14, '4 cm', { size: 13 }),
          'An L shape made of three 4 cm squares', 'style="max-width:200px"');
      })(),
      template: 'Small square side = {0} cm<br>Area of one small L = {1} cm²', blanks: [{ answer: 2, size: 'sm' }, { answer: 12 }],
      hint: 'Area of the big L = 3 × 4 × 4. Share it among 4 small L shapes. Each small L has 3 small squares.',
      solution: ['Area of the big L = 3 × (4 × 4) = 48 cm².', 'Each small L = 48 ÷ 4 = <b>12 cm²</b>.', 'Each small L has 3 small squares, so one small square = 12 ÷ 3 = 4 cm². Since 2 × 2 = 4, its side is <b>2 cm</b>.', 'Here is the cut:' + gridSvg(['aa..', 'ab..', 'cbbd', 'ccdd'], { u: 26, maxw: 130, label: 'The L cut into 4 smaller L shapes' })] },
    { id: 'i', level: 3, type: 'blanks', prompt: 'A big triangle is cut into small identical triangles as shown. How many triangles <b>of any size</b> can you find altogether?',
      art: svg('0 0 230 200', bigTri(15, 188, 3, 66), 'A big triangle cut into 9 small triangles', 'style="max-width:230px"'),
      template: '{0} triangles', blanks: [{ answer: 13 }],
      hint: 'Count in groups: the smallest triangles (pointing up and pointing down), then triangles made of 4 small ones, then the whole big triangle.',
      solution: ['Smallest triangles: 6 pointing up + 3 pointing down = 9.', 'Middle-sized triangles (each made of 4 small ones): 3.', 'The whole big triangle: 1.', 'Total: 9 + 3 + 1 = <b>13</b> triangles.'] },
  ],
  adult: 'Links to school work: P4 area of squares and rectangles and composite figures made of rectangles. Cutting a shape into <b>identical</b> (congruent) pieces is <b>enrichment</b>: it builds spatial sense and careful checking. Common mistakes: thinking pieces with the same area are identical (question D), and forgetting that a turned or flipped piece is still the same piece. Tip: let your child draw the shape on squared paper and colour each piece; real scissors help a lot!',
};

/* ===================== Topic 8: Finding Angles Smartly ===================== */
// two straight lines crossing at O, directions d1 and d2 (d1 < d2 < d1 + 180)
function crossFig(O, L, d1, d2, labels = [], { fills = ['#ffb3a9', '#bfe3ff', '#ffb3a9', '#bfe3ff'], r = 30, labR = 52, size = 16 } = {}) {
  const dirs = [d1, d2, d1 + 180, d2 + 180, d1 + 360];
  let s = '';
  for (let i = 0; i < 4; i++) if (labels[i]) s += arc(O[0], O[1], r, dirs[i], dirs[i + 1], { fill: fills[i], col: ink, w: 2 }) + angLab(O[0], O[1], labR, dirs[i], dirs[i + 1], labels[i], { size });
  s += seg(P(O[0], O[1], L, d1), P(O[0], O[1], L, d1 + 180), { w: 3.5 }) + seg(P(O[0], O[1], L, d2), P(O[0], O[1], L, d2 + 180), { w: 3.5 });
  return s + dot(O[0], O[1], 4.5);
}

function t08banner() {
  // scissors: blades 30° apart, handles 30° apart (vertically opposite)
  const O = [258, 112], b1 = 15, b2 = -15;
  const blade = d => { const a = P(O[0], O[1], 6, d + 90), b = P(O[0], O[1], 6, d - 90), t = P(O[0], O[1], 92, d); return poly([a, t, b], '#e3e9f4', `${S} stroke-width="2.5"`); };
  const handle = d => { const e = P(O[0], O[1], 54, d), c = P(O[0], O[1], 70, d); return seg(O, e, { w: 9, col: ink }) + seg(O, e, { w: 5, col: COL.coral }) + `<circle cx="${c[0]}" cy="${c[1]}" r="15" fill="none" stroke="${ink}" stroke-width="10"/><circle cx="${c[0]}" cy="${c[1]}" r="15" fill="none" stroke="${COL.coral}" stroke-width="6"/>`; };
  return svg('0 0 360 220', `<rect width="360" height="220" rx="20" fill="#eef8ff"/>
    ${clock(86, 100, 62, 4)}
    ${txt(86, 196, '4 o\'clock: 120°', { size: 17, font: HF, fill: COL.coral })}
    ${handle(195)}${handle(165)}${blade(b1)}${blade(b2)}
    ${arc(O[0], O[1], 44, b2, b1, { col: COL.teal, fill: '#9fe3dc', w: 3 })}${arc(O[0], O[1], 30, 165, 195, { col: COL.teal, fill: '#9fe3dc', w: 3 })}
    ${dot(O[0], O[1], 5)}
    ${txt(325, 112, '30°', { size: 15, fill: COL.teal })}${txt(258, 60, 'Opposite angles', { size: 15, fill: COL.teal })}${txt(258, 78, 'are equal!', { size: 15, fill: COL.teal })}
    ${txt(248, 172, '30°', { size: 15, fill: COL.teal })}<path d="M244 160 Q236 140 230 118" fill="none" stroke="${COL.teal}" stroke-width="2" stroke-dasharray="4 4"/>`,
    'A clock at 4 o\'clock showing a 120° angle, and open scissors showing two equal opposite angles of 30°');
}

// triangle with given base angles, base from (x0,y0) length L
function triAngles(x0, y0, L, a, b) {
  const B = [x0 + L, y0], AC = L * Math.sin(rad(b)) / Math.sin(rad(a + b));
  return [[x0, y0], B, P(x0, y0, AC, a)];
}

const t08 = {
  id: 't08',
  title: 'Finding Angles Smartly',
  intro: 'No protractor? No problem! A few angle facts let you work out angles you can\'t measure: on straight roads, on clocks, in triangles and even in folded paper.',
  skills: ['Angles', 'Straight lines', 'Triangles'],
  art: t08banner,
  explore: {
    setup: 'During a maths lesson, Leo draws two straight lines crossing on the whiteboard. Chloe measures <b>one</b> of the four angles with her protractor. It is <b>40°</b>.',
    art: () => {
      const O = [170, 95];
      return svg('0 0 340 300', `<rect width="340" height="300" rx="20" fill="#eafaf0"/>
        <rect x="24" y="16" width="292" height="160" rx="10" fill="#fff" ${S}/><rect x="120" y="176" width="100" height="8" rx="3" fill="#c9cfdc" ${S} stroke-width="2"/>
        ${crossFig(O, 88, 15, 55, ['40°', '?', '?', '?'], { r: 26, labR: 44, size: 17 })}
        ${kid('chloe', { x: 88, y: 210, s: .66, pose: 'think', mood: 'think' })}${leo({ x: 250, y: 214, s: .6, pose: 'point' })}`, 'Chloe and Leo at a whiteboard with two crossing lines; one angle is 40°');
    },
    steps: [
      { who: 'chloe', mood: 'think', text: 'I measured one angle: 40°. Do I really have to measure the other three?',
        art: () => svg('0 0 300 170', crossFig([150, 85], 120, 15, 55, ['40°', 'a', 'b', 'c']), 'Two crossing lines with one angle 40° and the others a, b, c', 'style="max-width:300px"') },
      { who: 'arjun', text: 'No! Angle <i>a</i> and the 40° sit together on one <b>straight line</b>, and the angles on a straight line add up to <b>180°</b>. So <i>a</i> = 180° − 40° = <b>140°</b>.',
        art: () => { const O = [150, 100]; return svg('0 0 300 150', arc(O[0], O[1], 30, 15, 55, { fill: '#ffb3a9', col: ink, w: 2 }) + arc(O[0], O[1], 30, 55, 195, { fill: '#bfe3ff', col: ink, w: 2 }) + seg(P(O[0], O[1], 130, 15), P(O[0], O[1], 130, 195), { w: 3.5 }) + seg(O, P(O[0], O[1], 100, 55), { w: 3.5 }) + angLab(O[0], O[1], 50, 15, 55, '40°') + angLab(O[0], O[1], 50, 55, 195, '140°') + dot(O[0], O[1], 4.5) + txt(228, 134, '40° + 140° = 180°', { size: 15, fill: COL.teal }), 'Angles on a straight line: 40° and 140° make 180°', 'style="max-width:300px"'); } },
      { who: 'leo', text: 'Now look at angle <i>b</i>, straight across from the 40°. Angles opposite each other at a crossing are called <b>vertically opposite angles</b>, and they are always <b>equal</b>. So <i>b</i> = 40°, and in the same way <i>c</i> = <i>a</i> = 140°.',
        art: () => svg('0 0 300 170', crossFig([150, 85], 120, 15, 55, ['40°', '140°', '40°', '140°']), 'All four angles: 40°, 140°, 40°, 140°', 'style="max-width:300px"') },
      { who: 'weiming', text: 'Check: 40° + 140° + 40° + 140° = 360°. That\'s a full turn! The angles <b>at a point</b> always add up to <b>360°</b>.' },
      { who: 'aisyah', text: 'Here\'s another fact. I cut out a paper triangle, tore off its 3 corners and put them side by side. They made a straight line! So the angles in a <b>triangle</b> add up to <b>180°</b>.',
        art: () => {
          const T = triAngles(14, 120, 150, 70, 50), O = [250, 120];
          const [a0, a1] = angAt(T[0], T[1], T[2]), [b0, b1] = angAt(T[1], T[2], T[0]), [c0, c1] = angAt(T[2], T[0], T[1]);
          const fa = '#ffb3a9', fb = '#9fd0ff', fc = '#ffe08a';
          return svg('0 0 340 150', poly(T, '#fff', S) + arc(T[0][0], T[0][1], 26, a0, a1, { fill: fa, col: ink, w: 2 }) + arc(T[1][0], T[1][1], 26, b0, b1, { fill: fb, col: ink, w: 2 }) + arc(T[2][0], T[2][1], 26, c0, c1, { fill: fc, col: ink, w: 2 }) +
            arc(O[0], O[1], 40, 0, 50, { fill: fb, col: ink, w: 2 }) + arc(O[0], O[1], 40, 50, 110, { fill: fc, col: ink, w: 2 }) + arc(O[0], O[1], 40, 110, 180, { fill: fa, col: ink, w: 2 }) +
            seg([O[0] - 70, O[1]], [O[0] + 70, O[1]], { w: 3 }) + seg(O, P(O[0], O[1], 60, 50), { w: 2, dash: '5 4' }) + seg(O, P(O[0], O[1], 60, 110), { w: 2, dash: '5 4' }) + dot(O[0], O[1], 4) +
            txt(O[0], 138, '= 180°', { size: 15, fill: COL.teal }) + txt(188, 105, '→', { size: 26, font: HF, fill: COL.coral }), 'The three corners of a triangle placed together fill a straight line', 'style="max-width:340px"');
        } },
      { who: 'leo', mood: 'teach', text: '<b>The smart way:</b> find what is missing. A straight line is 180°, a full turn is 360°, a triangle is 180°. Take away the angles you know, and the rest is your answer!' },
    ],
  },
  keys: [
    { title: 'Angles on a straight line', text: 'They add up to <b>180°</b>. If one is 65°, the other is 180° − 65° = 115°.' },
    { title: 'Angles at a point', text: 'All the angles around one point add up to <b>360°</b>, a full turn.' },
    { title: 'Vertically opposite angles', text: 'When two straight lines cross, the angles opposite each other are <b>equal</b>.' },
    { title: 'Angles in a triangle', text: 'The 3 angles of any triangle add up to <b>180°</b>.' },
  ],
  practice: [
    { id: 'a', level: 1, type: 'blanks', prompt: 'A line is drawn from a point on a straight line. Find ∠<i>a</i>.',
      art: (() => { const O = [180, 130]; return svg('0 0 340 160', seg([30, O[1]], [330, O[1]], { w: 3.5 }) + seg(O, P(O[0], O[1], 120, 58), { w: 3.5 }) + arc(O[0], O[1], 32, 0, 58, { col: ink, fill: '#ffb3a9', w: 2 }) + arc(O[0], O[1], 26, 58, 180, { col: ink, fill: '#bfe3ff', w: 2 }) + angLab(O[0], O[1], 56, 0, 58, '58°') + angLab(O[0], O[1], 48, 58, 180, it('a'), { size: 18 }) + dot(O[0], O[1], 4.5), 'A straight line with a ray making 58° on one side and angle a on the other', 'style="max-width:320px"'); })(),
      template: '∠<i>a</i> = {0}°', blanks: [{ answer: 122 }],
      hint: 'Angles on a straight line add up to 180°.',
      solution: ['∠<i>a</i> + 58° = 180°', '∠<i>a</i> = 180° − 58° = <b>122°</b>'] },
    { id: 'b', level: 1, type: 'blanks', prompt: 'Two straight roads cross at a junction. One angle is 47°. Find ∠<i>p</i> and ∠<i>q</i>.',
      art: svg('0 0 320 190', crossFig([160, 95], 130, 15, 62, ['47°', it('q'), it('p'), '']), 'Two crossing lines: angle 47°, angle q next to it and angle p opposite it', 'style="max-width:320px"'),
      template: '∠<i>p</i> = {0}° &nbsp;&nbsp; ∠<i>q</i> = {1}°', blanks: [{ answer: 47 }, { answer: 133 }],
      hint: '∠<i>p</i> is straight across from the 47°. ∠<i>q</i> shares a straight line with the 47°.',
      solution: ['∠<i>p</i> and 47° are vertically opposite angles, so ∠<i>p</i> = <b>47°</b>.', '∠<i>q</i> and 47° are on a straight line, so ∠<i>q</i> = 180° − 47° = <b>133°</b>.'] },
    { id: 'c', level: 1, type: 'blanks', prompt: 'A triangular flag for National Day has two angles of 65° and 48°. Find the third angle, ∠<i>c</i>.',
      art: (() => {
        const T = triAngles(30, 175, 240, 65, 48);
        const [a0, a1] = angAt(T[0], T[1], T[2]), [b0, b1] = angAt(T[1], T[2], T[0]), [c0, c1] = angAt(T[2], T[0], T[1]);
        return svg('0 0 300 195', poly(T, '#ffd9d6', S) + arc(T[0][0], T[0][1], 28, a0, a1, { col: ink, w: 2 }) + arc(T[1][0], T[1][1], 28, b0, b1, { col: ink, w: 2 }) + arc(T[2][0], T[2][1], 22, c0, c1, { col: ink, w: 2 }) +
          angLab(T[0][0], T[0][1], 48, a0, a1, '65°') + angLab(T[1][0], T[1][1], 50, b0, b1, '48°') + angLab(T[2][0], T[2][1], 40, c0, c1, it('c'), { size: 18 }), 'A triangle with angles 65°, 48° and c', 'style="max-width:300px"');
      })(),
      template: '∠<i>c</i> = {0}°', blanks: [{ answer: 67 }],
      hint: 'The 3 angles of a triangle add up to 180°.',
      solution: ['65° + 48° = 113°', '∠<i>c</i> = 180° − 113° = <b>67°</b>'] },
    { id: 'd', level: 2, type: 'blanks', prompt: 'Three paths meet at a point in a park. Find ∠<i>d</i>.',
      art: (() => { const O = [160, 84], ds = [20, 160, 255]; return svg('0 0 320 200', ds.map(d => seg(O, P(O[0], O[1], 112, d), { w: 3.5 })).join('') + arc(O[0], O[1], 34, 20, 160, { col: ink, fill: '#ffb3a9', w: 2 }) + arc(O[0], O[1], 42, 160, 255, { col: ink, fill: '#bfe3ff', w: 2 }) + arc(O[0], O[1], 30, 255, 380, { col: ink, fill: '#ffe08a', w: 2 }) + angLab(O[0], O[1], 54, 20, 160, '140°', { size: 17 }) + angLab(O[0], O[1], 66, 160, 255, '95°', { size: 17 }) + angLab(O[0], O[1], 54, 255, 380, it('d'), { size: 20 }) + dot(O[0], O[1], 4.5), 'Three lines from one point making angles 140°, 95° and d', 'style="max-width:300px"'); })(),
      template: '∠<i>d</i> = {0}°', blanks: [{ answer: 125 }],
      hint: 'The angles all the way round a point add up to 360°.',
      solution: ['140° + 95° = 235°', '∠<i>d</i> = 360° − 235° = <b>125°</b>'] },
    { id: 'e', level: 2, type: 'blanks', prompt: 'What is the <b>smaller</b> angle between the hour hand and the minute hand at each time?',
      art: svg('0 0 340 170', clock(85, 80, 62, 5) + clock(255, 80, 62, 10) + txt(85, 160, '5 o\'clock', { size: 15 }) + txt(255, 160, '10 o\'clock', { size: 15 }), 'Two clocks showing 5 o\'clock and 10 o\'clock', 'style="max-width:340px"'),
      template: '5 o\'clock: {0}°<br>10 o\'clock: {1}°', blanks: [{ answer: 150 }, { answer: 60 }],
      hint: 'A full turn is 360° and there are 12 numbers, so the gap from one number to the next is 360° ÷ 12 = 30°.',
      solution: ['From one number to the next is 360° ÷ 12 = 30°.', '5 o\'clock: the hands are 5 gaps apart, 5 × 30° = <b>150°</b>.', '10 o\'clock: going the short way from 10 to 12 is 2 gaps, 2 × 30° = <b>60°</b>.'] },
    { id: 'f', level: 2, type: 'blanks', prompt: 'Five rays OA, OB, OC, OD and OE start from the same point O. How many angles smaller than 180° can you find in the picture?',
      art: (() => { const O = [160, 175], ds = [8, 40, 78, 115, 152], L = ['A', 'B', 'C', 'D', 'E']; return svg('0 0 320 200', ds.map((d, i) => { const e = P(O[0], O[1], 130, d), t = P(O[0], O[1], 146, d); return seg(O, e, { w: 3.5 }) + txt(t[0], t[1], L[i], { size: 17, font: HF, fill: COL.grape }); }).join('') + dot(O[0], O[1], 5) + txt(O[0], O[1] + 15, 'O', { size: 16, font: HF }), 'Five rays from point O, labelled A to E', 'style="max-width:300px"'); })(),
      template: '{0} angles', blanks: [{ answer: 10 }],
      hint: 'Count in order. Start with OA: it makes an angle with OB, OC, OD and OE. Then go on with OB, but don\'t count the same angle twice.',
      solution: ['Angles that use OA: ∠AOB, ∠AOC, ∠AOD, ∠AOE → 4', 'Angles that use OB (but not OA): ∠BOC, ∠BOD, ∠BOE → 3', 'New angles that use OC: ∠COD, ∠COE → 2', 'New angles that use OD: ∠DOE → 1', 'Total: 4 + 3 + 2 + 1 = <b>10</b> angles.'] },
    { id: 'g', level: 3, type: 'blanks', prompt: 'The three angles on the straight line are <i>a</i>, <i>b</i> and <i>c</i>. ∠<i>b</i> is <b>twice</b> ∠<i>a</i>, and ∠<i>c</i> is <b>20° more</b> than ∠<i>a</i>. Find ∠<i>b</i> and ∠<i>c</i>.',
      art: (() => { const O = [170, 150]; return svg('0 0 340 170', seg([20, O[1]], [320, O[1]], { w: 3.5 }) + seg(O, P(O[0], O[1], 125, 60), { w: 3.5 }) + seg(O, P(O[0], O[1], 125, 140), { w: 3.5 }) + arc(O[0], O[1], 36, 0, 60, { col: ink, fill: '#ffe08a', w: 2 }) + arc(O[0], O[1], 42, 60, 140, { col: ink, fill: '#bfe3ff', w: 2 }) + arc(O[0], O[1], 36, 140, 180, { col: ink, fill: '#ffb3a9', w: 2 }) + angLab(O[0], O[1], 58, 0, 60, it('c'), { size: 19 }) + angLab(O[0], O[1], 64, 60, 140, it('b'), { size: 19 }) + angLab(O[0], O[1], 58, 140, 180, it('a'), { size: 19 }) + dot(O[0], O[1], 4.5), 'Three angles a, b and c on a straight line', 'style="max-width:320px"'); })(),
      template: '∠<i>b</i> = {0}° &nbsp;&nbsp; ∠<i>c</i> = {1}°', blanks: [{ answer: 80 }, { answer: 60 }],
      hint: 'Let ∠<i>a</i> be 1 unit. Then ∠<i>b</i> is 2 units and ∠<i>c</i> is 1 unit + 20°. All together they make 180°.',
      solution: ['∠<i>a</i> = 1 unit, ∠<i>b</i> = 2 units, ∠<i>c</i> = 1 unit + 20°.', 'Altogether: 4 units + 20° = 180°, so 4 units = 160°.', '1 unit = 160° ÷ 4 = 40°, so ∠<i>a</i> = 40°.', '∠<i>b</i> = 2 × 40° = <b>80°</b> and ∠<i>c</i> = 40° + 20° = <b>60°</b>.', 'Check: 40° + 80° + 60° = 180° ✓'] },
    { id: 'h', level: 3, type: 'blanks', prompt: 'Siti folds down the top-left corner of a rectangular card along the crease PQ. The corner lands on the card, and the folded edge makes an angle of 35° with the crease, as shown. Find ∠<i>y</i>.',
      art: (() => {
        const Pp = [190, 30], A0 = [20, 30], t = (190 - 20) / Math.cos(rad(35)), Q = [20, r1(30 + t * Math.sin(rad(35)))], A1 = P(Pp[0], Pp[1], 170, 250);
        const card = `<path d="M${Pp[0]} ${Pp[1]} L330 30 L330 200 L20 200 L${Q[0]} ${Q[1]} Z" fill="#fff6e4" ${S}/>`;
        const ghost = poly([A0, Pp, Q], 'none', `stroke="#9aa6bd" stroke-width="2" stroke-dasharray="6 5"`);
        const flap = poly([Pp, Q, A1], '#ffd66b', S);
        return svg('0 0 350 220', card + ghost + flap + arc(Pp[0], Pp[1], 56, 215, 250, { col: ink, fill: '#ffb3a9', w: 2 }) + arc(Pp[0], Pp[1], 34, 250, 360, { col: ink, fill: '#bfe3ff', w: 2 }) +
          angLab(Pp[0], Pp[1], 74, 215, 250, '35°', { size: 15 }) + angLab(Pp[0], Pp[1], 54, 250, 360, it('y'), { size: 20 }) +
          txt(Pp[0], Pp[1] - 13, 'P', { size: 16, font: HF }) + txt(Q[0] - 11, Q[1], 'Q', { size: 16, font: HF }), 'A card with its top-left corner folded down along crease PQ', 'style="max-width:340px"');
      })(),
      template: '∠<i>y</i> = {0}°', blanks: [{ answer: 110 }],
      hint: 'Folding does not change angles. Look at the dotted part where the corner used to be: which angle at P must also be 35°? Then use the straight top edge.',
      solution: ['Before folding, the corner flap lay along the top edge. Folding does not change its angle, so the angle between PQ and the dotted top edge is also <b>35°</b>.', 'The top edge is a straight line, so the angles at P add up to 180°.', '∠<i>y</i> = 180° − 35° − 35° = <b>110°</b>.'] },
    { id: 'i', level: 3, type: 'blanks', prompt: 'In triangle ABC, the side BC is made longer to the point D, along a straight line. ∠BAC = 57° and ∠ACD = 128°. Find ∠<i>m</i>.',
      art: (() => {
        const B = [40, 175], C = [215, 175], D = [320, 175], AB = 175 * Math.sin(rad(52)) / Math.sin(rad(57)), Ap = P(B[0], B[1], AB, 71);
        const [a0, a1] = angAt(Ap, B, C), [b0, b1] = angAt(B, C, Ap);
        return svg('0 0 340 200', poly([Ap, B, C], '#e3f1ff', S) + seg(C, D, { w: 3, dash: '' }) + arc(Ap[0], Ap[1], 24, a0, a1, { col: ink, w: 2 }) + arc(B[0], B[1], 28, b0, b1, { col: ink, w: 2, fill: '#ffe08a' }) + arc(C[0], C[1], 24, 0, 128, { col: ink, w: 2, fill: '#ffb3a9' }) +
          angLab(Ap[0], Ap[1], 44, a0, a1, '57°', { size: 14 }) + angLab(B[0], B[1], 46, b0, b1, it('m'), { size: 18 }) + angLab(C[0], C[1], 44, 0, 128, '128°', { size: 14 }) +
          txt(Ap[0], Ap[1] - 14, 'A', { size: 16, font: HF }) + txt(B[0] - 12, B[1] + 10, 'B', { size: 16, font: HF }) + txt(C[0], C[1] + 15, 'C', { size: 16, font: HF }) + txt(D[0], D[1] + 15, 'D', { size: 16, font: HF }),
          'Triangle ABC with side BC extended to D; angle A is 57°, angle ACD is 128°, angle B is m', 'style="max-width:330px"');
      })(),
      template: '∠<i>m</i> = {0}°', blanks: [{ answer: 71 }],
      hint: 'First find ∠ACB using the straight line BCD. Then use the angles in triangle ABC.',
      solution: ['B, C and D are on a straight line, so ∠ACB = 180° − 128° = 52°.', 'In triangle ABC: ∠<i>m</i> = 180° − 57° − 52° = <b>71°</b>.', 'Smart shortcut: 57° + 71° = 128°. The outside angle at C equals the two far inside angles added together!'] },
  ],
  adult: 'Links to school work: P4 measuring and drawing angles, and turns on a clock face. The angle facts here (angles on a straight line, at a point, vertically opposite, and angles in a triangle) are taught in <b>P5</b>, so this topic is <b>enrichment</b> for P4. Common mistakes: reading the bigger angle on a clock, counting an angle twice when there are many rays, and forgetting that folding keeps angles the same size. Tip: tear the corners off a paper triangle together to see why they make 180°.',
};

/* ===================== Maths in Life: Beautiful Tessellations ===================== */
function peranakanTile(x, y, u, scheme) {
  const [bg, corner, petal, mid] = scheme, c = u / 2, q = u * .3;
  const cq = (cx, cy, a0) => { const p0 = P(cx, cy, q, a0), p1 = P(cx, cy, q, a0 - 90); return `<path d="M${cx} ${cy} L${p0[0]} ${p0[1]} A${q} ${q} 0 0 1 ${p1[0]} ${p1[1]}Z" fill="${corner}"/>`; };
  let s = `<rect x="${x}" y="${y}" width="${u}" height="${u}" fill="${bg}"/>`;
  s += cq(x, y, 0) + cq(x + u, y, 270) + cq(x + u, y + u, 180) + cq(x, y + u, 90);
  s += `<path d="M${x + c} ${y + 4} L${x + u - 4} ${y + c} L${x + c} ${y + u - 4} L${x + 4} ${y + c}Z" fill="none" stroke="${corner}" stroke-width="2"/>`;
  for (let k = 0; k < 4; k++) s += `<ellipse cx="${x + c}" cy="${y + c - u * .17}" rx="${u * .09}" ry="${u * .16}" fill="${petal}" transform="rotate(${45 + 90 * k} ${x + c} ${y + c})"/>`;
  s += `<circle cx="${x + c}" cy="${y + c}" r="${u * .08}" fill="${mid}"/>`;
  return s + `<rect x="${x}" y="${y}" width="${u}" height="${u}" fill="none" stroke="${ink}" stroke-width="1.6"/>`;
}
function L2banner() {
  const u = 54, x0 = 18, y0 = 16, schemes = [['#fdf3e1', '#0f9d94', '#ff6b5b', '#ffc94a'], ['#eef4ff', '#7b61ff', '#3dbb6b', '#ff6b5b']];
  let g = '';
  for (let i = 0; i < 6; i++) for (let j = 0; j < 3; j++) g += peranakanTile(x0 + i * u, y0 + j * u, u, schemes[(i + j) % 2]);
  return svg('0 0 360 220', `<rect width="360" height="220" rx="20" fill="#fff0f5"/>${g}<rect x="${x0}" y="${y0}" width="${6 * u}" height="${3 * u}" fill="none" ${S}/>
    ${txt(180, 198, 'No gaps, no overlaps!', { size: 20, font: HF, fill: COL.coral })}`, 'A floor of colourful Peranakan-style square tiles');
}
const L2 = {
  id: 'L2',
  title: 'Beautiful Tessellations',
  intro: 'Look down at the floor of a kopitiam, a void deck or an old shophouse. The tiles fit together perfectly, with no gaps! What is the secret? It\'s all about angles.',
  skills: ['Tiling patterns', 'Angles at a point', 'Real life'],
  art: L2banner,
  explore: {
    setup: 'Aisyah visits her grandmother\'s shophouse in Joo Chiat, which has beautiful <b>Peranakan tiles</b>. On the way home, she notices that the void deck of her HDB block has <b>hexagon</b> tiles.',
    art: () => svg('0 0 340 300', `<rect width="340" height="300" rx="20" fill="#eef4ff"/>
      <rect x="0" y="0" width="340" height="40" rx="20" fill="#d4dbe8"/><rect x="0" y="28" width="340" height="14" fill="#c2cadb" ${S}/>
      <rect x="22" y="42" width="34" height="168" fill="#f3e3c3" ${S}/><rect x="284" y="42" width="34" height="168" fill="#f3e3c3" ${S}/>
      ${hexPatch(0, 205, 340, 95, 22, ['#86dca0', '#c9f0d4', '#e9f9ee'])}
      ${kid('aisyah', { x: 115, y: 105, s: .82, pose: 'wave' })}${kid('arjun', { x: 225, y: 108, s: .8, pose: 'think', mood: 'think' })}`, 'Aisyah and Arjun at a void deck with a hexagon-tiled floor'),
    steps: [
      { who: 'aisyah', text: 'The tiles cover the whole floor. There are no gaps between them and none of them overlap. How do they fit so well?' },
      { who: 'leo', text: 'A pattern of shapes that covers a flat surface with <b>no gaps and no overlaps</b> is called a <b>tessellation</b>. The secret is at the <b>corners</b>. Look at a point where tiles meet: square tiles have 4 corners of 90° meeting there.',
        art: () => { const v = vertexFig([90, 86], 60, [4, 4, 4, 4], 0, { labels: ['90°', '90°', '90°', '90°'], size: 15 }); return svg('0 0 340 172', v.inner + txt(250, 76, '4 × 90°', { size: 20, font: HF, fill: COL.grape }) + txt(250, 104, '= 360°', { size: 20, font: HF, fill: COL.grape }), 'Four squares meeting at a point: 4 × 90° = 360°', 'style="max-width:340px"'); } },
      { who: 'chloe', text: 'Equilateral triangles have 60° corners: 6 of them meet at a point. Regular hexagons have 120° corners: 3 of them meet at a point. Both make exactly <b>360°</b>, a full turn!',
        art: () => { const a = vertexFig([82, 96], 70, [3, 3, 3, 3, 3, 3], 0, { labels: Array(6).fill('60°'), size: 13 }), b = vertexFig([252, 100], 46, [6, 6, 6], 90, { labels: ['120°', '120°', '120°'], size: 14 });
          return svg('0 0 340 226', a.inner + b.inner + txt(82, 212, '6 × 60° = 360°', { size: 15, fill: COL.grape }) + txt(252, 212, '3 × 120° = 360°', { size: 15, fill: COL.grape }), 'Six triangles meet at a point, and three hexagons meet at a point', 'style="max-width:340px"'); } },
      { who: 'weiming', mood: 'think', text: 'So why are there no floors of regular <b>pentagons</b>? Each corner is 108°. Three of them make 324°, which leaves a <b>36° gap</b>. Four would need 432°, which is too much: they would overlap.',
        art: () => { const v = vertexFig([170, 100], 62, [5, 5, 5], 288, { labels: ['108°', '108°', '108°'], size: 15 }); const O = [170, 100];
          return svg('0 0 340 200', v.inner + arc(O[0], O[1], 50, 252, 288, { col: COL.coral, fill: '#ff6b5b', w: 2.5 }) + txt(170, 188, 'gap: 360° − 324° = 36°', { size: 15, fill: '#d6453a' }), 'Three regular pentagons around a point leave a 36° gap', 'style="max-width:340px"'); } },
      { who: 'arjun', text: 'Our kopitiam floor mixes two shapes: <b>octagons</b> with 135° corners and small <b>squares</b>. At each point: 135° + 135° + 90° = 360°. It works!',
        art: () => { const v = vertexFig([110, 104], 44, [8, 8, 4], 90, { labels: ['135°', '135°', '90°'], size: 14, fills: [FILL.a, FILL.a, FILL.f] });
          return svg('0 0 340 222', octPatch(212, 36, 116, 150, 26) + v.inner, 'Octagons and squares: two octagons and a square meet at a point', 'style="max-width:340px"'); } },
      { who: 'leo', mood: 'teach', text: '<b>The tessellation rule:</b> wherever tiles meet at a point, their angles must add up to exactly <b>360°</b>. Less leaves a gap; more makes an overlap. Artists like M. C. Escher even changed the edges of shapes to tile with birds and fish!' },
    ],
  },
  keys: [
    { title: 'Tessellation', text: 'Shapes that cover a flat surface with <b>no gaps</b> and <b>no overlaps</b>, like floor tiles.' },
    { title: 'The 360° rule', text: 'Where tiles meet at a point, their angles must add up to exactly <b>360°</b>.' },
    { title: 'Regular shapes that tile alone', text: 'Only 3: equilateral triangles (6 × 60°), squares (4 × 90°) and regular hexagons (3 × 120°).' },
    { title: 'Mix and match', text: 'Different shapes can tile together: octagon + octagon + square = 135° + 135° + 90° = 360°.' },
  ],
  practice: [
    { id: 'a', level: 1, type: 'mcq', prompt: 'Which <b>regular</b> shapes can tile a floor <b>on their own</b>, with no gaps and no overlaps?',
      options: [optIcon(3, FILL.b, 'Equilateral triangle'), optIcon(4, FILL.a, 'Square'), optIcon(5, FILL.c, 'Regular pentagon'), optIcon(6, FILL.d, 'Regular hexagon'), optIcon(8, FILL.e, 'Regular octagon')], answer: [0, 1, 3],
      hint: 'Corners of 60°, 90°, 108°, 120° and 135°. Which of these fit into 360° an exact number of times?',
      solution: ['Triangle: 360° ÷ 60° = 6 ✓', 'Square: 360° ÷ 90° = 4 ✓', 'Pentagon: 3 × 108° = 324° (gap), 4 × 108° = 432° (overlap) ✗', 'Hexagon: 360° ÷ 120° = 3 ✓', 'Octagon: 2 × 135° = 270° (gap), 3 × 135° = 405° (overlap) ✗', 'The answer is <b>triangle, square and hexagon</b>.'] },
    { id: 'b', level: 1, type: 'blanks', prompt: 'How many tiles meet at the red dot in each pattern?',
      art: (() => {
        const s3 = 40, e2 = [s3 / 2, -s3 * Math.sqrt(3) / 2];
        const tri = triPatch(8, 10, 100, 100, s3), tdot = [8 + s3 + e2[0], 10 + 100 + e2[1]];
        const sq = sqPatch(128, 10, 100, 100, 33), sdot = [128 + 66, 10 + 66];
        const hs = 24, hx = hexPatch(248, 10, 100, 100, hs), hcx = 248 + 1.5 * hs, hcy = 10 + Math.sqrt(3) * hs * 1.5;
        const hdot = P(hcx, hcy, hs, 0);
        return svg('0 0 356 140', tri + sq + hx + dot(tdot[0], tdot[1], 6, '#e1282e') + dot(sdot[0], sdot[1], 6, '#e1282e') + dot(hdot[0], hdot[1], 6, '#e1282e') +
          txt(58, 128, 'triangles', { size: 14 }) + txt(178, 128, 'squares', { size: 14 }) + txt(298, 128, 'hexagons', { size: 14 }), 'Three tile patterns: triangles, squares and hexagons, each with a red dot at a corner', 'style="max-width:380px"');
      })(),
      template: 'Triangles: {0}<br>Squares: {1}<br>Hexagons: {2}', blanks: [{ answer: 6, size: 'sm' }, { answer: 4, size: 'sm' }, { answer: 3, size: 'sm' }],
      hint: 'Count the tiles touching the red dot, or use 360° ÷ the size of one corner.',
      solution: ['Triangles: 360° ÷ 60° = <b>6</b>', 'Squares: 360° ÷ 90° = <b>4</b>', 'Hexagons: 360° ÷ 120° = <b>3</b>'] },
    { id: 'c', level: 1, type: 'blanks', prompt: 'Three identical regular hexagon tiles meet at a point on a void deck floor. Find ∠<i>h</i>, the size of one corner of a hexagon.',
      art: svg('0 0 220 200', vertexFig([110, 98], 50, [6, 6, 6], 90, { labels: [it('h'), '', ''], labR: 40, size: 18 }).inner, 'Three regular hexagons meeting at a point', 'style="max-width:220px"'),
      template: '∠<i>h</i> = {0}°', blanks: [{ answer: 120 }],
      hint: 'The 3 equal angles at the point make a full turn.',
      solution: ['The 3 equal corners make 360°.', '360° ÷ 3 = <b>120°</b>'] },
    { id: 'd', level: 2, type: 'blanks', prompt: 'Each corner of a regular pentagon is 108°. Farah puts 3 pentagon tiles around a point. How big is the gap?',
      art: (() => { const O = [130, 105], v = vertexFig(O, 62, [5, 5, 5], 288, { labels: ['108°', '108°', '108°'], size: 15 }); return svg('0 0 260 220', v.inner + arc(O[0], O[1], 48, 252, 288, { col: COL.coral, fill: '#ff6b5b', w: 2.5 }) + txt(O[0], 206, 'gap = ?', { size: 15, fill: '#d6453a' }), 'Three pentagons around a point with a gap', 'style="max-width:250px"'); })(),
      template: 'Gap = {0}°', blanks: [{ answer: 36 }],
      hint: 'Add up the 3 corners, then see how much is missing from 360°.',
      solution: ['3 × 108° = 324°', 'Gap = 360° − 324° = <b>36°</b>', 'That is why regular pentagons can\'t tile a floor on their own.'] },
    { id: 'e', level: 2, type: 'blanks', prompt: 'A kopitiam floor uses regular octagons and small squares. At every point, <b>2 octagons</b> and <b>1 square</b> meet. Find the size of one corner of the octagon.',
      art: svg('0 0 200 150', octPatch(10, 10, 180, 130, 30), 'A floor of octagons and small squares', 'style="max-width:220px"'),
      template: 'Octagon corner = {0}°', blanks: [{ answer: 135 }],
      hint: 'The square\'s corner is 90°. The rest of the 360° is shared equally by 2 octagon corners.',
      solution: ['360° − 90° = 270° for the 2 octagon corners.', '270° ÷ 2 = <b>135°</b>'] },
    { id: 'f', level: 2, type: 'blanks', prompt: 'Mr Rahman designs a floor with squares and equilateral triangles. At one point, <b>2 squares</b> meet, and equilateral triangles fill the rest of the space. How many triangles meet at that point?',
      art: (() => { const O = [120, 110], v = vertexFig(O, 60, [4, 4], 0, { labels: ['90°', '90°'], size: 15 }); return svg('0 0 240 200', v.inner + arc(O[0], O[1], 40, 180, 360, { col: '#9aa6bd', w: 2 }) + txt(O[0], 168, '? triangles here', { size: 15, fill: COL.grape }), 'Two squares at a point, with the bottom half empty', 'style="max-width:240px"'); })(),
      template: '{0} triangles', blanks: [{ answer: 3, size: 'sm' }],
      hint: 'How many degrees do the 2 squares use? How many 60° corners fit into what is left?',
      solution: ['2 squares use 2 × 90° = 180°.', '360° − 180° = 180° is left.', '180° ÷ 60° = <b>3</b> triangles.'] },
    { id: 'g', level: 2, type: 'blanks', prompt: 'The floor of a void deck room is a rectangle 6 m long and 4 m wide. It is covered with square tiles of side <b>50 cm</b>. How many tiles are needed?',
      art: (() => { const u = 22; let g = ''; for (let i = 0; i < 12; i++) for (let j = 0; j < 8; j++) if (i < 3 && j < 2 || (i === 0 && j < 8) || (j === 0)) g += `<rect x="${20 + i * u}" y="${14 + j * u}" width="${u}" height="${u}" fill="${(i + j) % 2 ? '#fff3cf' : '#ffd66b'}" stroke="${ink}" stroke-width="1.4"/>`;
        return svg('0 0 330 220', `<rect x="20" y="14" width="${12 * u}" height="${8 * u}" fill="#fbfdff" ${S}/>` + g + `<rect x="20" y="14" width="${12 * u}" height="${8 * u}" fill="none" ${S}/>` + txt(20 + 6 * u, 14 + 8 * u + 16, '6 m', { size: 15 }) + txt(20 + 12 * u + 8, 14 + 4 * u, '4 m', { size: 15, anchor: 'start' }), 'A 6 m by 4 m floor partly covered with square tiles', 'style="max-width:300px"'); })(),
      template: '{0} tiles', blanks: [{ answer: 96 }],
      hint: '50 cm is half a metre, so 2 tiles fit in 1 m. How many tiles fit along the length? Along the width?',
      solution: ['1 m = 100 cm, so 2 tiles fit along every metre.', 'Along 6 m: 6 × 2 = 12 tiles. Along 4 m: 4 × 2 = 8 tiles.', 'Number of tiles = 12 × 8 = <b>96</b>.'] },
    { id: 'h', level: 3, type: 'blanks', prompt: 'Any four-sided shape can tessellate! Four copies of this tile meet at a point, with its four <b>different</b> corners all meeting there. Three of its corners are 70°, 85° and 110°. Find the fourth corner, ∠<i>k</i>.',
      art: (() => {
        const Aq = [40, 170], B = [240, 170], C = P(B[0], B[1], 120, 95);
        // D is where the line from A at 70° meets the line from C at 165°
        const ca = Math.cos(rad(70)), sa = Math.sin(rad(70)), cc = Math.cos(rad(165)), sc = Math.sin(rad(165));
        const dx = C[0] - Aq[0], dy = -(C[1] - Aq[1]), det = ca * (-sc) - (-cc) * sa, w = (dx * (-sc) - (-cc) * dy) / det;
        const D = P(Aq[0], Aq[1], w, 70), Q = [Aq, B, C, D];
        const labs = ['70°', '85°', '110°', it('k')];
        let g = poly(Q, '#c9f0d4', S);
        Q.forEach((V, i) => { const [d0, d1] = angAt(V, Q[(i + 1) % 4], Q[(i + 3) % 4]); g += arc(V[0], V[1], 22, d0, d1, { col: ink, w: 2 }) + angLab(V[0], V[1], 40, d0, d1, labs[i], { size: i === 3 ? 18 : 14 }); });
        return svg('0 -6 280 196', g, 'A four-sided tile with corners 70°, 85°, 110° and k', 'style="max-width:280px"');
      })(),
      template: '∠<i>k</i> = {0}°', blanks: [{ answer: 95 }],
      hint: 'The four different corners meet at one point with no gaps. What must they add up to?',
      solution: ['The 4 corners meet at a point, so they add up to 360°.', '70° + 85° + 110° = 265°', '∠<i>k</i> = 360° − 265° = <b>95°</b>', 'This also shows that the angles of <b>any</b> four-sided shape add up to 360°!'] },
    { id: 'i', level: 3, type: 'blanks', prompt: 'A large hexagon tile at the Botanic Gardens is made of small equilateral triangles. Each side of the large hexagon is as long as <b>2</b> small triangle sides. How many small triangles are there?',
      art: (() => {
        const O = [110, 100], s = 42, e1 = [s, 0], e2 = [s / 2, -s * Math.sqrt(3) / 2], ap = 2 * s * Math.sqrt(3) / 2 + .01;
        const inside = (x, y) => [30, 90, 150].every(d => Math.abs((x - O[0]) * Math.cos(rad(d)) - (y - O[1]) * Math.sin(rad(d))) <= ap);
        let g = '';
        for (let a = -4; a <= 4; a++) for (let b = -4; b <= 4; b++) {
          const p = [O[0] + a * e1[0] + b * e2[0], O[1] + b * e2[1]], q = [p[0] + s, p[1]], r = [p[0] + e2[0], p[1] + e2[1]], t = [q[0] + e2[0], q[1] + e2[1]];
          if (inside((p[0] + q[0] + r[0]) / 3, (p[1] + q[1] + r[1]) / 3)) g += poly([p, q, r], '#ffd66b', 'stroke="#23304a" stroke-width="2"');
          if (inside((q[0] + t[0] + r[0]) / 3, (q[1] + t[1] + r[1]) / 3)) g += poly([q, t, r], '#ff9d92', 'stroke="#23304a" stroke-width="2"');
        }
        return svg('0 0 220 200', g + poly([0, 60, 120, 180, 240, 300].map(d => P(O[0], O[1], 2 * s, d)), 'none', `${S} stroke-width="3.5"`), 'A large hexagon made of small equilateral triangles', 'style="max-width:220px"');
      })(),
      template: '{0} small triangles', blanks: [{ answer: 24 }],
      hint: 'Lines from the centre to the 6 corners split the hexagon into 6 big triangles. How many small triangles are in each big one?',
      solution: ['Lines from the centre to the 6 corners cut the hexagon into 6 big equilateral triangles.', 'Each big triangle has sides of 2 small sides, so it holds 4 small triangles (3 pointing one way, 1 the other).', '6 × 4 = <b>24</b> small triangles.'] },
  ],
  adult: 'This "Maths in Life" page connects shapes, angles and art. It uses the fact that angles at a point add up to 360° (formally taught in P5), so it is <b>enrichment</b> that also links to P4 work on angles, squares and rectangles, and area (question G). Ask your child to spot tessellations around Singapore: HDB void decks, kopitiam floors, Peranakan shophouse tiles in Joo Chiat and Katong, and MRT station walls. A fun project: cut a shape out of one side of a square and stick it on the opposite side, then trace it again and again to make an Escher-style pattern.',
};

export default { t07, t08, L2 };
