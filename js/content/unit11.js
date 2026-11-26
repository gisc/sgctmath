// Unit 11 · Overlapping Groups (inclusion–exclusion) — original content, Singapore context.
import * as A from '../art.js';
const { svg, kid, leo } = A;
const INK = A.ink, S = A.stroke;
const F = 'font-family="Nunito, sans-serif" font-weight="800"';
const FB = 'font-family="Baloo 2, sans-serif" font-weight="800"';
const tx = (x, y, t, { size = 14, fill = INK, anchor = 'middle', b = false, extra = '' } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" ${b ? FB : F} font-size="${size}" fill="${fill}" ${extra}>${t}</text>`;
const r1 = v => Math.round(v * 10) / 10;
let uid = 0;
const nid = p => `u11${p}${++uid}`;

const TEAL = '#0f9d94', CORAL = '#ff6b5b', GRAPE = '#7b61ff', SUN = '#ffc94a';
// set colours: fill colour and a darker shade for text
const SETC = [{ c: TEAL, d: '#0b6f69' }, { c: CORAL, d: '#c9372b' }, { c: GRAPE, d: '#5a43d6' }];

// rounded panel with clipped contents
function panel(W, H, inner, bg = '#f3faff') {
  const c = nid('pc');
  return `<defs><clipPath id="${c}"><rect width="${W}" height="${H}" rx="16"/></clipPath></defs><g clip-path="url(#${c})"><rect width="${W}" height="${H}" fill="${bg}"/>${inner}</g>`;
}
function pill(x, y, text, { fill = '#fff', color = INK, size = 14, stroke = INK } = {}) {
  const w = r1(text.replace(/<[^>]+>/g, '').length * size * .56 + 18), h = size + 10;
  return `<rect x="${r1(x - w / 2)}" y="${r1(y - h / 2)}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${stroke}" stroke-width="2.4"/>` + tx(x, r1(y + size * .36), text, { size, fill: color });
}

/* ================= Venn-diagram helper =================
   Regions are named by the sets they are inside: 'a', 'b', 'c', 'ab', 'ac', 'bc', 'abc', and 'none'
   (inside the rectangle but outside every circle). Set a = first circle, b = second, c = third. */
function centres(n, r) {
  if (n === 2) { const h = r * .62; return [{ x: -h, y: 0 }, { x: h, y: 0 }]; }
  const s = r; // distance between centres
  return [{ x: -s / 2, y: -s / (2 * Math.sqrt(3)) }, { x: s / 2, y: -s / (2 * Math.sqrt(3)) }, { x: 0, y: s / Math.sqrt(3) }];
}
const regionAt = (cs, r, x, y) => cs.reduce((k, c, i) => k + ((x - c.x) ** 2 + (y - c.y) ** 2 < r * r ? 'abc'[i] : ''), '') || 'none';
// best place for a number inside each region: the point furthest from every circle edge
const POLE = {};
function poles(n, r) {
  const key = n + '_' + r;
  if (POLE[key]) return POLE[key];
  const cs = centres(n, r), best = {}, pts = [], cen = {};
  const x0 = Math.min(...cs.map(c => c.x)) - r, x1 = Math.max(...cs.map(c => c.x)) + r;
  const y0 = Math.min(...cs.map(c => c.y)) - r, y1 = Math.max(...cs.map(c => c.y)) + r;
  for (let x = x0; x <= x1; x += 1.5) for (let y = y0; y <= y1; y += 1.5) {
    const k = regionAt(cs, r, x, y);
    if (k === 'none') continue;
    const d = Math.min(...cs.map(c => Math.abs(r - Math.hypot(x - c.x, y - c.y))));
    pts.push({ k, x, y, d });
    const m = cen[k] || (cen[k] = { x: 0, y: 0, n: 0 }); m.x += x; m.y += y; m.n++;
  }
  // roomy spot, nudged towards the middle of the region (breaks ties in long, thin crescents)
  for (const p of pts) {
    const m = cen[p.k], sc = p.d - .25 * Math.hypot(p.x - m.x / m.n, p.y - m.y / m.n);
    if (!best[p.k] || sc > best[p.k].sc) best[p.k] = { x: p.x, y: p.y, d: p.d, sc };
  }
  return (POLE[key] = best);
}
// the shape of one region, painted with the highlight colour (clip to the circles it is in, mask out the others)
function regionPaint(code, cs, r, clipIds, area, color) {
  const inc = code === 'none' ? [] : [...code].map(ch => 'abc'.indexOf(ch));
  const exc = cs.map((_, i) => i).filter(i => !inc.includes(i));
  const [ax, ay, aw, ah] = area;
  let defs = '', m = '';
  if (exc.length) {
    const mid = nid('m');
    defs = `<mask id="${mid}" maskUnits="userSpaceOnUse" x="${ax}" y="${ay}" width="${aw}" height="${ah}"><rect x="${ax}" y="${ay}" width="${aw}" height="${ah}" fill="#fff"/>${exc.map(i => `<circle cx="${r1(cs[i].x)}" cy="${r1(cs[i].y)}" r="${r}" fill="#000"/>`).join('')}</mask>`;
    m = ` mask="url(#${mid})"`;
  }
  const soft = code === 'none' ? ' rx="14" fill-opacity=".45"' : '';
  let shape = `<rect x="${ax}" y="${ay}" width="${aw}" height="${ah}" fill="${color}"${soft}${m}/>`;
  for (const i of inc) shape = `<g clip-path="url(#${clipIds[i]})">${shape}</g>`;
  return defs + shape;
}
function vtext(x, y, v, size) {
  const s = String(v);
  if (s === '?') return tx(x, r1(y + size * .36), '?', { size, fill: '#d6453a', b: true });
  if (/^[a-z]$/.test(s)) return tx(x, r1(y + size * .36), s, { size: size + 2, fill: '#5a43d6', b: true, extra: 'font-style="italic"' });
  return tx(x, r1(y + size * .36), s, { size, b: true });
}
/* venn({ n: 2|3, names: ['Satay (19)', …], vals: { a: 8, ab: 5, …, none: 1 }, hi: ['abc'], box: true, title: '…', label }) */
function venn({ n = 3, names = [], vals = {}, hi = [], hiSoft = [], hiColor = SUN, box = false, title = '', r, W = 340, label = 'Venn diagram', maxw = 380, fs = 21 } = {}) {
  r = r || (n === 3 ? 64 : 66);
  const rel = centres(n, r), P = poles(n, r);
  const minY = Math.min(...rel.map(c => c.y)), maxY = Math.max(...rel.map(c => c.y));
  const top0 = (box ? 12 : 4) + (title ? 22 : 0);
  const circleTop = top0 + (names.length ? 26 : 4);
  const cx = W / 2, cy = circleTop - minY + r;
  let bottom = cy + maxY + r + (n === 3 && names[2] ? 26 : 4);
  const H = Math.round(bottom + (box ? 14 : 4));
  const cs = rel.map(c => ({ x: cx + c.x, y: cy + c.y }));
  const area = box ? [6, 6, W - 12, H - 12] : [0, 0, W, H];
  const clipIds = cs.map(() => nid('c'));
  let g = `<defs>${cs.map((c, i) => `<clipPath id="${clipIds[i]}"><circle cx="${r1(c.x)}" cy="${r1(c.y)}" r="${r}"/></clipPath>`).join('')}</defs>`;
  if (box) g += `<rect x="6" y="6" width="${W - 12}" height="${H - 12}" rx="14" fill="#fffdf5"/>`;
  g += cs.map((c, i) => `<circle cx="${r1(c.x)}" cy="${r1(c.y)}" r="${r}" fill="${SETC[i].c}" fill-opacity=".2"/>`).join('');
  for (const code of hi) if (code !== 'none' || box) g += regionPaint(code, cs, r, clipIds, area, hiColor);
  for (const code of hiSoft) g += regionPaint(code, cs, r, clipIds, area, '#ffe7a3');
  if (box) g += `<rect x="6" y="6" width="${W - 12}" height="${H - 12}" rx="14" fill="none" stroke="${INK}" stroke-width="2.5"/>`;
  if (title) g += tx(18, 28, title, { size: 14, anchor: 'start', fill: '#56627a' });
  g += cs.map((c, i) => `<circle cx="${r1(c.x)}" cy="${r1(c.y)}" r="${r}" fill="none" stroke="${SETC[i].c}" stroke-width="3.5"/>`).join('');
  // set names
  names.forEach((nm, i) => {
    if (!nm) return;
    const c = cs[i];
    if (i === 2) g += tx(r1(c.x), r1(c.y + r + 20), nm, { size: 15, fill: SETC[i].d, b: true });
    else g += tx(r1(c.x + (i === 0 ? 1 : -1) * r * .3), r1(circleTop - 9), nm, { size: 15, fill: SETC[i].d, b: true, anchor: i === 0 ? 'end' : 'start' });
  });
  // numbers in the regions
  for (const [code, v] of Object.entries(vals)) {
    if (v === '' || v == null) continue;
    if (code === 'none') {
      const x = W - 36, y = H - 28;
      g += tx(x, y - 16, 'none', { size: 12, fill: '#56627a' }) + vtext(x, y, v, 20);
      continue;
    }
    const p = P[code];
    if (!p) continue;
    g += vtext(r1(cx + p.x), r1(cy + p.y), v, Math.min(fs, Math.max(14, Math.round(p.d * 1.15))));
  }
  return svg(`0 0 ${W} ${H}`, g, label, `style="max-width:${maxw}px"`);
}

/* ================= other pictures ================= */
function tally(x, y, n, h = 18) {
  let g = '', px = x;
  for (let i = 0; i < n; i++) {
    const inGroup = i % 5;
    if (inGroup === 4) { g += `<path d="M${px - 24} ${y + h - 3} L${px + 1} ${y + 3}" stroke="#d6453a" stroke-width="2.6" stroke-linecap="round"/>`; px += 12; }
    else { g += `<path d="M${px} ${y} v${h}" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`; px += 6; }
  }
  return g;
}
function hoop(x, y, rx, ry, c, op = .22) {
  return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${c}" fill-opacity="${op}"/>`;
}
function hoopRing(x, y, rx, ry, c) {
  return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="none" stroke="${INK}" stroke-width="8"/><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="none" stroke="${c}" stroke-width="4.5"/>`;
}
// three overlapping square cards on a 1 cm grid (for the area question)
function cardsArt() {
  const u = 18, ox = 34, oy = 28, N = 14;
  const X = v => ox + v * u, Y = v => oy + v * u;
  let g = '';
  for (let i = 0; i <= N; i++) g += `<path d="M${X(i)} ${Y(0)} V${Y(N)} M${X(0)} ${Y(i)} H${X(N)}" stroke="#d9e3f0" stroke-width="1.2"/>`;
  const cards = [{ x: 0, y: 0, s: 10, i: 0, n: 'A' }, { x: 6, y: 4, s: 8, i: 1, n: 'B' }, { x: 4, y: 8, s: 6, i: 2, n: 'C' }];
  g += cards.map(k => `<rect x="${X(k.x)}" y="${Y(k.y)}" width="${k.s * u}" height="${k.s * u}" fill="${SETC[k.i].c}" fill-opacity=".24"/>`).join('');
  g += cards.map(k => `<rect x="${X(k.x)}" y="${Y(k.y)}" width="${k.s * u}" height="${k.s * u}" fill="none" stroke="${SETC[k.i].c}" stroke-width="3.5" stroke-linejoin="round"/>`).join('');
  // card letters, in a part only that card covers
  g += tx(X(2), Y(2) + 8, 'A', { size: 24, fill: SETC[0].d, b: true }) + tx(X(12), Y(8) + 8, 'B', { size: 24, fill: SETC[1].d, b: true }) + tx(X(5), Y(12.6) + 8, 'C', { size: 22, fill: SETC[2].d, b: true });
  // side lengths
  g += `<path d="M${X(0)} ${Y(0) - 12} H${X(10)}" stroke="${SETC[0].d}" stroke-width="2"/><path d="M${X(0)} ${Y(0) - 17} v10 M${X(10)} ${Y(0) - 17} v10" stroke="${SETC[0].d}" stroke-width="2"/>` +
    pill(X(5), Y(0) - 12, '10 cm', { size: 13, color: SETC[0].d, stroke: SETC[0].c });
  g += `<path d="M${X(14) + 12} ${Y(4)} V${Y(12)}" stroke="${SETC[1].d}" stroke-width="2"/><path d="M${X(14) + 7} ${Y(4)} h10 M${X(14) + 7} ${Y(12)} h10" stroke="${SETC[1].d}" stroke-width="2"/>` +
    `<g transform="translate(${X(14) + 12} ${Y(8)}) rotate(90)">${pill(0, 0, '8 cm', { size: 13, color: SETC[1].d, stroke: SETC[1].c })}</g>`;
  g += `<path d="M${X(4)} ${Y(14) + 12} H${X(10)}" stroke="${SETC[2].d}" stroke-width="2"/><path d="M${X(4)} ${Y(14) + 7} v10 M${X(10)} ${Y(14) + 7} v10" stroke="${SETC[2].d}" stroke-width="2"/>` +
    pill(X(7), Y(14) + 12, '6 cm', { size: 13, color: SETC[2].d, stroke: SETC[2].c });
  const W = X(N) + 34, H = Y(N) + 30;
  return svg(`0 0 ${W} ${H}`, panel(W, H, g, '#fbf7ee'), 'Three overlapping square cards on a grid: card A is 10 cm, card B is 8 cm and card C is 6 cm', 'style="max-width:360px"');
}

// a row of lucky draw tickets 1 to 10, then "… 100"; winners (divisible by 2, 3 or 5) get a star
function ticketsArt() {
  const W = 370, H = 112, tw = 27, gap = 3;
  let g = '';
  for (let k = 1; k <= 10; k++) {
    const x = 8 + (k - 1) * (tw + gap), y = 30, win = k % 2 === 0 || k % 3 === 0 || k % 5 === 0;
    g += `<rect x="${x}" y="${y}" width="${tw}" height="44" rx="5" fill="${win ? '#fff4d1' : '#fff'}" stroke="${INK}" stroke-width="2.2"/>` +
      `<path d="M${x + 4} ${y + 30} h${tw - 8}" stroke="#cfd8e6" stroke-width="2" stroke-dasharray="3 3"/>` +
      tx(x + tw / 2, y + 23, k, { size: k === 10 ? 13 : 15, b: true }) + (win ? tx(x + tw / 2, y + 42, '★', { size: 12, fill: '#e0a100' }) : '');
  }
  g += tx(8 + 10 * (tw + gap) + 2, 60, '…', { size: 20, anchor: 'start' });
  const x = 8 + 10 * (tw + gap) + 20;
  g += `<rect x="${x}" y="30" width="${tw + 4}" height="44" rx="5" fill="#fff4d1" stroke="${INK}" stroke-width="2.2"/>` + tx(x + 17, 53, '100', { size: 13, b: true }) + tx(x + 17, 72, '★', { size: 12, fill: '#e0a100' });
  g += tx(W / 2, 20, 'Lucky draw: ★ = wins a prize', { size: 14, fill: '#56627a' }) + tx(W / 2, 100, 'Ticket 1 and ticket 7 do not win. 2, 3, 4, 5, 6, 8, 9 and 10 do.', { size: 12, fill: '#56627a' });
  return svg(`0 0 ${W} ${H}`, panel(W, H, g, '#fff9ef'), 'Lucky draw tickets 1 to 10 and 100; tickets divisible by 2, 3 or 5 are starred', 'style="max-width:420px"');
}

// Uncle Ahmad's stamp card and the day totals
function stampArt() {
  const W = 340, H = 150;
  let g = `<g transform="translate(18 22) rotate(-3)"><rect width="150" height="100" rx="10" fill="#fff" stroke="${INK}" stroke-width="2.6"/>` +
    `<rect width="150" height="26" rx="10" fill="${CORAL}" stroke="${INK}" stroke-width="2.6"/><rect y="14" width="150" height="12" fill="${CORAL}"/>` +
    tx(75, 18, 'TEH TARIK REGULAR', { size: 11, fill: '#fff', b: true });
  ['Mon', 'Tue', 'Wed'].forEach((d, i) => {
    const x = 12 + i * 46;
    g += `<rect x="${x}" y="38" width="38" height="38" rx="6" fill="#fffaf0" stroke="${INK}" stroke-width="2"/>` + tx(x + 19, 92, d, { size: 12 });
    if (i !== 1) g += `<circle cx="${x + 19}" cy="57" r="13" fill="none" stroke="${TEAL}" stroke-width="3"/>` + tx(x + 19, 62, '✓', { size: 14, fill: TEAL });
  });
  g += '</g>';
  g += tx(258, 30, 'Cards stamped', { size: 14, fill: '#56627a' });
  [['Monday', 18], ['Tuesday', 14], ['Wednesday', 11]].forEach(([d, n], i) => {
    g += tx(196, 56 + i * 24, d, { size: 14, anchor: 'start' }) + tx(320, 56 + i * 24, n, { size: 15, anchor: 'end', fill: '#c9372b', b: true });
  });
  g += `<path d="M194 118 h128" stroke="${INK}" stroke-width="2"/>` + tx(196, 138, 'Regulars', { size: 14, anchor: 'start' }) + tx(320, 138, '24', { size: 15, anchor: 'end', fill: '#5a43d6', b: true });
  return svg(`0 0 ${W} ${H}`, panel(W, H, g, '#fff7ec'), 'A stamp card with boxes for Monday, Tuesday and Wednesday; 18, 14 and 11 cards stamped; 24 different regulars', 'style="max-width:400px"');
}

/* ================= Explore pictures ================= */
const ANSW = { a: 8, b: 4, c: 4, ab: 5, bc: 2, ac: 3, abc: 3 }; // satay, mee siam, kueh survey
const partyNames = ['Satay (19)', 'Mee siam (14)', 'Kueh (12)'];
const classroom = () => svg('0 0 340 300', panel(340, 300, `
  <rect width="340" height="226" fill="#fff4e0"/><rect y="226" width="340" height="74" fill="#e8d3b4"/>
  ${[0, 1, 2, 3, 4, 5, 6].map(i => `<path d="M${i * 56} 226 l-30 74" stroke="#d8c09c" stroke-width="2"/>`).join('')}
  <rect x="22" y="14" width="296" height="136" rx="10" fill="#fff" ${S}/><rect x="22" y="146" width="296" height="8" rx="3" fill="#cfd8e6" ${S} stroke-width="2"/>
  ${tx(170, 38, 'Class party: what shall we order?', { size: 15, fill: TEAL, b: true })}
  ${tx(40, 70, 'Satay', { size: 15, anchor: 'start' })}${tally(130, 56, 19)}${tx(300, 70, '19', { size: 16, anchor: 'end', fill: '#d6453a', b: true })}
  ${tx(40, 102, 'Mee siam', { size: 15, anchor: 'start' })}${tally(130, 88, 14)}${tx(300, 102, '14', { size: 16, anchor: 'end', fill: '#d6453a', b: true })}
  ${tx(40, 134, 'Kueh', { size: 15, anchor: 'start' })}${tally(130, 120, 12)}${tx(300, 134, '12', { size: 16, anchor: 'end', fill: '#d6453a', b: true })}
  ${kid('chloe', { x: 58, y: 196, s: .68, mood: 'think', pose: 'think' })}
  <g transform="translate(78 236) rotate(8)"><rect x="-14" y="-18" width="28" height="36" rx="3" fill="#c98b55" ${S} stroke-width="2.2"/><rect x="-10" y="-12" width="20" height="26" fill="#fff"/><path d="M-6 -5 h12 M-6 1 h12 M-6 7 h8" stroke="${INK}" stroke-width="1.6"/></g>
  ${kid('weiming', { x: 148, y: 206, s: .64, pose: 'wave' })}
  ${kid('aisyah', { x: 220, y: 206, s: .64, pose: 'wave' })}
  ${kid('arjun', { x: 290, y: 206, s: .64, pose: 'wave', flip: true })}`, '#fff4e0'),
  'Chloe with a clipboard in the classroom; Wei Ming, Aisyah and Arjun put up their hands; the whiteboard shows tallies for satay 19, mee siam 14 and kueh 12');

/* ===================== Topic 25 ===================== */
const t25 = {
  id: 't25',
  title: 'Overlapping Groups: Venn Diagrams',
  intro: 'When some people belong to two or three groups at once, simply adding up the groups counts them more than once! Learn to sort everyone into a Venn diagram, fill it from the middle outwards, and count each person exactly once.',
  skills: ['Venn diagrams', 'Counting without double-counting', 'Working from the middle'],
  art: () => svg('0 0 360 220', panel(360, 220, `
    <rect width="360" height="110" fill="#dff3ff"/>${A.cloud(18, 12, .7)}${A.cloud(250, 20, .55)}
    <circle cx="326" cy="34" r="18" fill="#ffd45c"/>
    ${A.hdb(96, 34, 54, 78, '#ffe3b3', 5)}${A.hdb(210, 46, 50, 66, '#d7f0e4', 4)}
    <rect y="104" width="360" height="116" fill="#9edcaa"/><path d="M0 112 q180 -14 360 0" fill="none" stroke="#86cf94" stroke-width="5"/>
    ${hoop(132, 150, 70, 30, TEAL)}${hoop(228, 150, 70, 30, CORAL)}${hoop(180, 178, 70, 30, GRAPE)}
    ${hoopRing(132, 150, 70, 30, TEAL)}${hoopRing(228, 150, 70, 30, CORAL)}${hoopRing(180, 178, 70, 30, GRAPE)}
    ${kid('aisyah', { x: 96, y: 98, s: .42, pose: 'wave' })}
    ${kid('weiming', { x: 252, y: 100, s: .42, pose: 'cheer' })}
    ${kid('arjun', { x: 128, y: 128, s: .42, pose: 'think', mood: 'think' })}
    ${leo({ x: 180, y: 120, s: .4, pose: 'wave' })}
    ${kid('chloe', { x: 210, y: 156, s: .42, pose: 'wave', flip: true })}
    ${pill(46, 126, 'Choir', { size: 14, fill: '#e3f7f5', color: SETC[0].d, stroke: TEAL })}
    ${pill(310, 98, 'Badminton', { size: 14, fill: '#ffe9e6', color: SETC[1].d, stroke: CORAL })}
    ${pill(302, 196, 'Robotics', { size: 14, fill: '#efebff', color: SETC[2].d, stroke: GRAPE })}`, '#dff3ff'),
    'Three overlapping hula hoops on a school field labelled Choir, Badminton and Robotics, with pupils and Leo standing inside the overlaps'),
  explore: {
    setup: 'Mr Rahman\'s class, 4 Kindness, has <b>30</b> pupils. For the end-of-year class party, class monitor Chloe asks, "Hands up if you want <b>satay</b>!" and then, "Hands up if you want <b>mee siam</b>!" Pupils may put up their hands both times.',
    art: classroom,
    steps: [
      { who: 'chloe', mood: 'think', text: 'Satay: <b>19</b> hands. Mee siam: <b>14</b> hands. So 19 + 14 = 33 pupils want food… but our class has only <b>30</b> pupils! How can that be?' },
      { who: 'weiming', text: 'I put up my hand both times. I love satay <i>and</i> mee siam! So I was counted <b>twice</b>. Chloe asked again, "Hands up if you chose <b>both</b>," and <b>8</b> of us put up our hands.' },
      { who: 'leo', mood: 'teach', text: 'Let\'s draw it! A rectangle stands for the whole class, and each circle is one group. The <b>8</b> pupils who chose both go where the circles <b>overlap</b>. That leaves 19 − 8 = <b>11</b> for satay only and 14 − 8 = <b>6</b> for mee siam only. So 11 + 8 + 6 = <b>25</b> pupils want at least one, and 30 − 25 = <b>5</b> want neither. Quick way: 19 + 14 − 8 = 25, because the 8 were counted twice.',
        art: () => venn({ n: 2, names: ['Satay (19)', 'Mee siam (14)'], vals: { a: 11, ab: 8, b: 6, none: 5 }, hi: ['ab'], box: true, title: '4 Kindness: 30 pupils', label: 'Two-circle Venn diagram: satay only 11, both 8, mee siam only 6, neither 5' }) },
      { who: 'arjun', text: 'Now kueh: <b>12</b> hands. Chloe also counted the pupils in two groups: satay and mee siam <b>8</b>, mee siam and kueh <b>5</b>, satay and kueh <b>6</b>. And <b>3</b> pupils want all three! (Those 3 are included in the 8, the 5 and the 6.)' },
      { who: 'aisyah', text: 'With three circles, fill the diagram <b>from the middle outwards</b>. The 3 pupils who chose all three go in the very centre. Next, the parts where exactly two circles overlap: satay and mee siam has 8 pupils, but 3 of them are already in the middle, so 8 − 3 = <b>5</b> go there. In the same way, 5 − 3 = <b>2</b> and 6 − 3 = <b>3</b>.',
        art: () => venn({ n: 3, names: partyNames, vals: { abc: 3, ab: 5, bc: 2, ac: 3 }, hi: ['abc', 'ab', 'bc', 'ac'], label: 'Three-circle Venn diagram: centre 3; satay and mee siam only 5; mee siam and kueh only 2; satay and kueh only 3' }) },
      { who: 'weiming', text: 'Last, the "only" parts. Take away everything already inside each circle: satay only = 19 − 5 − 3 − 3 = <b>8</b>, mee siam only = 14 − 5 − 2 − 3 = <b>4</b>, kueh only = 12 − 3 − 2 − 3 = <b>4</b>. Add all seven parts: 8 + 4 + 4 + 5 + 2 + 3 + 3 = <b>29</b>. So only 30 − 29 = <b>1</b> pupil wants none of them!',
        art: () => venn({ n: 3, names: partyNames, vals: { ...ANSW, none: 1 }, hi: ['a', 'b', 'c'], box: true, title: '4 Kindness: 30 pupils', label: 'Completed Venn diagram: satay only 8, mee siam only 4, kueh only 4, pairs 5, 2 and 3, centre 3, none 1' }) },
      { who: 'leo', mood: 'teach', text: 'Here is the shortcut. 19 + 14 + 12 = 45 counts the "two-group" pupils <b>twice</b> and the centre pupils <b>3 times</b> (see the picture). Take away the pairs: 45 − (8 + 5 + 6) = 26. But each pair number includes the centre, so now the centre pupils have been taken away 3 times and are not counted at all! Add them back once: 26 + 3 = <b>29</b> ✓<br><b>Total = A + B + C − (AB + BC + CA) + ABC</b>',
        art: () => venn({ n: 3, names: ['Satay', 'Mee siam', 'Kueh'], vals: { a: '1', b: '1', c: '1', ab: '2', bc: '2', ac: '2', abc: '3' }, hi: ['abc'], hiSoft: ['ab', 'bc', 'ac'], label: 'How many times each part is counted in 19 + 14 + 12: once in the only parts, twice in the pair parts, three times in the centre' }) +
          `<small>How many times each part is counted in 19 + 14 + 12</small>` },
    ],
  },
  keys: [
    { title: 'Two groups', text: 'People in <b>both</b> groups are counted twice when you add, so take them away once.<br><b>Total = A + B − both</b>' },
    { title: 'Fill from the middle', text: 'Start with the people in <b>all three</b> groups. Then work out the "exactly two" parts (pair number − centre). Last, the "only one" parts.' },
    { title: 'Three groups', text: '<b>Total = A + B + C − (AB + BC + CA) + ABC</b><br>The centre is added 3 times and taken away 3 times, so it must be added back once.' },
    { title: 'Don\'t forget "none"', text: 'The rectangle is everybody. <b>Everybody = (in at least one group) + (in none)</b>. Always check that the parts add up.' },
  ],
  practice: [
    { id: 'a', level: 1, type: 'mcq', prompt: 'Every pupil in Mrs Pillai\'s class, 4 Courage, goes for at least one Saturday enrichment class: swimming or art. <b>18</b> pupils go for swimming, <b>15</b> go for art, and <b>7</b> go for both. How many pupils are there in 4 Courage?',
      art: venn({ n: 2, names: ['Swimming (18)', 'Art (15)'], vals: { ab: 7 }, label: 'Two circles, swimming 18 and art 15, with 7 in the overlap' }),
      options: ['26', '33', '40', '19'], answer: 0,
      hint: 'The 7 pupils who go for both are inside the 18 <b>and</b> inside the 15. How many times have they been counted in 18 + 15?',
      solution: ['18 + 15 = 33 counts the 7 "both" pupils twice.', 'Take them away once: 33 − 7 = 26.', 'Check with the diagram: swimming only = 18 − 7 = 11, art only = 15 − 7 = 8, and 11 + 7 + 8 = 26 ✓',
        venn({ n: 2, names: ['Swimming (18)', 'Art (15)'], vals: { a: 11, ab: 7, b: 8 }, hi: ['ab'], label: 'Swimming only 11, both 7, art only 8' }),
        'There are <b>26</b> pupils. (33 counts some pupils twice, 40 adds the "both" pupils a third time, and 19 takes them away twice.)'] },
    { id: 'b', level: 1, type: 'blanks', prompt: 'Hafiz asked the <b>40</b> pupils in his class which MRT lines they rode during the school holidays. <b>24</b> rode the Thomson–East Coast Line (TEL), <b>19</b> rode the Circle Line (CCL) and <b>9</b> rode both lines. Find the missing numbers <i>p</i>, <i>q</i> and <i>r</i> in the Venn diagram.',
      art: venn({ n: 2, names: ['TEL (24)', 'CCL (19)'], vals: { a: 'p', ab: 9, b: 'q', none: 'r' }, box: true, title: 'Hafiz\'s class: 40 pupils', label: 'Venn diagram in a rectangle of 40 pupils: TEL only p, both 9, CCL only q, neither r' }),
      template: '<i>p</i> = {0} &nbsp;&nbsp; <i>q</i> = {1} &nbsp;&nbsp; <i>r</i> = {2}', blanks: [{ answer: 15 }, { answer: 10 }, { answer: 6 }],
      hint: '<i>p</i> is the part of the TEL circle that is <b>not</b> in the overlap. For <i>r</i>, first find how many pupils rode at least one of the lines.',
      solution: ['TEL only: <i>p</i> = 24 − 9 = 15', 'CCL only: <i>q</i> = 19 − 9 = 10', 'Rode at least one line: 15 + 9 + 10 = 34 (or 24 + 19 − 9 = 34)', 'Rode neither line: <i>r</i> = 40 − 34 = 6',
        venn({ n: 2, names: ['TEL (24)', 'CCL (19)'], vals: { a: 15, ab: 9, b: 10, none: 6 }, hi: ['a', 'b', 'none'], box: true, title: 'Hafiz\'s class: 40 pupils', label: 'TEL only 15, both 9, CCL only 10, neither 6' }),
        '<i>p</i> = <b>15</b>, <i>q</i> = <b>10</b>, <i>r</i> = <b>6</b>'] },
    { id: 'c', level: 1, type: 'blanks', prompt: 'For the school\'s National Day celebration, every Primary 4 pupil took part in at least one item: the mass dance, the choir or the drum troupe. <b>46</b> pupils were in the dance, <b>38</b> in the choir and <b>29</b> in the drum troupe. <b>12</b> were in the dance and the choir, <b>9</b> in the choir and the drum troupe, <b>10</b> in the dance and the drum troupe, and <b>4</b> were in all three. How many Primary 4 pupils are there? <small>(Numbers for two groups include anyone in all three.)</small>',
      art: venn({ n: 3, names: ['Dance (46)', 'Choir (38)', 'Drums (29)'], vals: { abc: 4 }, hi: ['abc'], label: 'Three circles: dance 46, choir 38, drums 29, with 4 in the centre' }),
      template: '{0} pupils', blanks: [{ answer: 86 }],
      hint: 'Add the three groups, take away the three pair numbers, then add back the pupils who are in all three.',
      solution: ['Add the three groups: 46 + 38 + 29 = 113', 'Take away the pairs: 113 − (12 + 9 + 10) = 113 − 31 = 82', 'The 4 pupils in all three were added 3 times and taken away 3 times, so add them back: 82 + 4 = 86',
        'Check by filling from the middle: pairs only are 12 − 4 = 8, 9 − 4 = 5 and 10 − 4 = 6. Dance only = 46 − 8 − 6 − 4 = 28, choir only = 38 − 8 − 5 − 4 = 21, drums only = 29 − 6 − 5 − 4 = 14. 28 + 21 + 14 + 8 + 5 + 6 + 4 = 86 ✓',
        venn({ n: 3, names: ['Dance (46)', 'Choir (38)', 'Drums (29)'], vals: { a: 28, b: 21, c: 14, ab: 8, bc: 5, ac: 6, abc: 4 }, hi: ['abc'], label: 'Filled diagram: dance only 28, choir only 21, drums only 14, pairs 8, 5 and 6, centre 4' }),
        'There are <b>86</b> Primary 4 pupils.'] },
    { id: 'd', level: 2, type: 'blanks', prompt: 'Jun Jie asked some P4 pupils where they went during the school holidays. <b>27</b> went to Sentosa, <b>18</b> went to Gardens by the Bay and <b>22</b> went to the Singapore Zoo. <b>8</b> went to Sentosa and Gardens by the Bay, <b>7</b> went to Gardens by the Bay and the Zoo, and <b>11</b> went to Sentosa and the Zoo. <b>5</b> pupils went to all three places. (Each "two places" number includes these 5 pupils.) Find <i>p</i>, <i>q</i> and <i>r</i>.',
      art: venn({ n: 3, names: ['Sentosa (27)', 'Gardens (18)', 'Zoo (22)'], vals: { abc: 5, a: 'p', bc: 'q', c: 'r' }, hi: ['abc'], label: 'Three circles: Sentosa 27, Gardens by the Bay 18, Zoo 22; centre 5; p is Sentosa only, q is Gardens and Zoo but not Sentosa, r is Zoo only' }),
      template: '<i>p</i> = {0} &nbsp;&nbsp; <i>q</i> = {1} &nbsp;&nbsp; <i>r</i> = {2}', blanks: [{ answer: 13 }, { answer: 2 }, { answer: 9 }],
      hint: 'Fill from the middle outwards. First work out the three "exactly two places" parts by taking 5 away from each pair number. Then do the "only" parts.',
      solution: ['Centre (all three): 5', 'Exactly two places: Sentosa and Gardens 8 − 5 = 3, Gardens and Zoo <i>q</i> = 7 − 5 = 2, Sentosa and Zoo 11 − 5 = 6',
        'Sentosa only: <i>p</i> = 27 − 3 − 6 − 5 = 13', 'Zoo only: <i>r</i> = 22 − 2 − 6 − 5 = 9',
        venn({ n: 3, names: ['Sentosa (27)', 'Gardens (18)', 'Zoo (22)'], vals: { a: 13, b: 8, c: 9, ab: 3, bc: 2, ac: 6, abc: 5 }, hi: ['a', 'bc', 'c'], label: 'Filled diagram: Sentosa only 13, Gardens only 8, Zoo only 9, pairs 3, 2 and 6, centre 5' }),
        'Check: Gardens only = 18 − 3 − 2 − 5 = 8, and the Sentosa circle is 13 + 3 + 6 + 5 = 27 ✓', '<i>p</i> = <b>13</b>, <i>q</i> = <b>2</b>, <i>r</i> = <b>9</b>'] },
    { id: 'e', level: 2, type: 'blanks', prompt: 'Mr Rodrigues asked the <b>40</b> pupils of 4 Integrity which June holiday workshops they joined at their community centre. <b>17</b> joined cooking, <b>14</b> joined kayaking and <b>16</b> joined robotics. <b>6</b> joined cooking and kayaking, <b>5</b> joined kayaking and robotics, <b>7</b> joined cooking and robotics, and <b>3</b> joined all three. How many pupils joined <b>none</b> of the workshops? <small>(Numbers for two groups include anyone in all three.)</small>',
      art: venn({ n: 3, names: ['Cooking (17)', 'Kayaking (14)', 'Robotics (16)'], vals: { abc: 3, none: '?' }, hi: ['none'], box: true, title: '4 Integrity: 40 pupils', label: 'Three circles in a rectangle of 40 pupils: cooking 17, kayaking 14, robotics 16; centre 3; none unknown' }),
      template: '{0} pupils joined none.', blanks: [{ answer: 8 }],
      hint: 'First find how many pupils joined <b>at least one</b> workshop. Then think about the rectangle: it holds all 40 pupils.',
      solution: ['At least one workshop: 17 + 14 + 16 − (6 + 5 + 7) + 3 = 47 − 18 + 3 = 32',
        'Check by filling from the middle: pairs only are 3, 2 and 4. Cooking only = 17 − 3 − 4 − 3 = 7, kayaking only = 14 − 3 − 2 − 3 = 6, robotics only = 16 − 4 − 2 − 3 = 7. 7 + 6 + 7 + 3 + 2 + 4 + 3 = 32 ✓',
        venn({ n: 3, names: ['Cooking (17)', 'Kayaking (14)', 'Robotics (16)'], vals: { a: 7, b: 6, c: 7, ab: 3, bc: 2, ac: 4, abc: 3, none: 8 }, hi: ['none'], box: true, title: '4 Integrity: 40 pupils', label: 'Filled diagram: cooking only 7, kayaking only 6, robotics only 7, pairs 3, 2 and 4, centre 3, none 8' }),
        'None of the workshops: 40 − 32 = <b>8</b> pupils.'] },
    { id: 'f', level: 2, type: 'blanks', prompt: 'At the school carnival, the lucky draw tickets are numbered from <b>1 to 100</b>. A ticket wins a prize if its number can be divided exactly by <b>2</b>, by <b>3</b> or by <b>5</b> (or by more than one of them). How many tickets win a prize?',
      art: ticketsArt(),
      template: '{0} tickets', blanks: [{ answer: 74 }],
      hint: 'Count the multiples of 2, of 3 and of 5 up to 100. A number in two groups is a multiple of both, for example 2 and 3 means a multiple of 6. A number in all three groups is a multiple of 30.',
      solution: ['Multiples of 2: 100 ÷ 2 = 50. Multiples of 3: 100 ÷ 3 = 33 remainder 1, so 33. Multiples of 5: 100 ÷ 5 = 20.',
        'Multiples of both 2 and 3 are multiples of 6: 100 ÷ 6 = 16 remainder 4, so 16. Both 3 and 5: multiples of 15, so 6. Both 2 and 5: multiples of 10, so 10.',
        'All three: multiples of 30 (30, 60, 90), so 3.',
        `<table class="tbl" style="font-size:15px"><thead><tr><th>Group</th><th>÷2</th><th>÷3</th><th>÷5</th><th>÷6</th><th>÷15</th><th>÷10</th><th>÷30</th></tr></thead><tbody><tr><th>How many</th><td>50</td><td>33</td><td>20</td><td>16</td><td>6</td><td>10</td><td>3</td></tr></tbody></table>`,
        'Winning tickets: 50 + 33 + 20 − (16 + 6 + 10) + 3 = 103 − 32 + 3 = 74',
        venn({ n: 3, names: ['÷ 2 (50)', '÷ 3 (33)', '÷ 5 (20)'], vals: { a: 27, b: 14, c: 7, ab: 13, bc: 3, ac: 7, abc: 3, none: 26 }, box: true, title: 'Tickets 1 to 100', label: 'Venn diagram of tickets: divisible by 2 only 27, by 3 only 14, by 5 only 7, by 2 and 3 only 13, by 3 and 5 only 3, by 2 and 5 only 7, all three 3, none 26' }),
        '<b>74</b> tickets win a prize. (The other 26, such as 1, 7 and 49, do not.)'] },
    { id: 'g', level: 3, type: 'blanks', prompt: 'On Racial Harmony Day, Ms Chua\'s class, 4 Harmony, has <b>38</b> pupils. Every pupil can say "thank you" in at least one of Malay ("terima kasih"), Mandarin ("xie xie") and Tamil ("nandri"). <b>26</b> can say it in Malay, <b>24</b> in Mandarin and <b>15</b> in Tamil. <b>14</b> can say it in Malay and Mandarin, <b>7</b> in Mandarin and Tamil, and <b>9</b> in Malay and Tamil. How many pupils can say "thank you" in <b>all three</b> languages? <small>(Numbers for two groups include anyone in all three.)</small>',
      art: venn({ n: 3, names: ['Malay (26)', 'Mandarin (24)', 'Tamil (15)'], vals: { abc: '?' }, hi: ['abc'], label: 'Three circles: Malay 26, Mandarin 24, Tamil 15; the centre is unknown' }),
      template: '{0} pupils', blanks: [{ answer: 3 }],
      hint: 'Use Total = A + B + C − (AB + BC + CA) + ABC. You know the total is 38. Which number is missing?',
      solution: ['Every pupil is in at least one circle, so the total is 38.', 'A + B + C − (AB + BC + CA) = 26 + 24 + 15 − (14 + 7 + 9) = 65 − 30 = 35',
        'The formula says 35 + (all three) = 38, so all three = 38 − 35 = 3.',
        'Check by filling from the middle with 3 in the centre: pairs only are 11, 4 and 6. Malay only = 26 − 11 − 6 − 3 = 6, Mandarin only = 24 − 11 − 4 − 3 = 6, Tamil only = 15 − 6 − 4 − 3 = 2. 6 + 6 + 2 + 11 + 4 + 6 + 3 = 38 ✓',
        venn({ n: 3, names: ['Malay (26)', 'Mandarin (24)', 'Tamil (15)'], vals: { a: 6, b: 6, c: 2, ab: 11, bc: 4, ac: 6, abc: 3 }, hi: ['abc'], label: 'Filled diagram: Malay only 6, Mandarin only 6, Tamil only 2, pairs 11, 4 and 6, centre 3' }),
        '<b>3</b> pupils can say it in all three languages.'] },
    { id: 'h', level: 3, type: 'blanks', prompt: 'For Deepavali, Priya pins three square greeting cards, A, B and C, on the class noticeboard so that they overlap, as shown. The grid lines are 1 cm apart. What area of the noticeboard do the three cards cover altogether?',
      art: cardsArt(),
      template: '{0} cm²', blanks: [{ answer: 156 }],
      hint: 'Add the areas of the three cards. Then find the four overlap rectangles on the grid: A and B, B and C, A and C, and the small part under all three cards.',
      solution: ['Areas of the cards: A = 10 × 10 = 100 cm², B = 8 × 8 = 64 cm², C = 6 × 6 = 36 cm². Together: 200 cm².',
        'Overlaps (read them from the grid): A and B: 4 cm × 6 cm = 24 cm². B and C: 4 cm × 4 cm = 16 cm². A and C: 6 cm × 2 cm = 12 cm².',
        'Under all three cards: 4 cm × 2 cm = 8 cm².',
        'Just like counting people: 200 − (24 + 16 + 12) + 8 = 200 − 52 + 8 = 156',
        'The cards cover <b>156 cm²</b>.'] },
    { id: 'i', level: 3, type: 'blanks', prompt: 'Uncle Ahmad runs a teh tarik stall at a hawker centre in Tampines. Each regular customer has a stamp card, and Uncle Ahmad stamps a card at most once a day. On Monday he stamped <b>18</b> cards, on Tuesday <b>14</b> cards and on Wednesday <b>11</b> cards. Altogether, <b>24</b> different regulars got at least one stamp. What is the <b>greatest</b> possible number of regulars who came on <b>all three</b> days?',
      art: stampArt(),
      template: 'At most {0} regulars', blanks: [{ answer: 9 }],
      hint: 'Use supposition: suppose each of the 24 regulars got only <b>one</b> stamp. How many of the stamps are left over? How many extra stamps does a regular who came on all three days use?',
      solution: ['Total stamps: 18 + 14 + 11 = 43.', 'Suppose each of the 24 regulars got just 1 stamp. That uses 24 stamps, so 43 − 24 = 19 stamps are "extra".',
        'A regular who came on all three days got 2 extra stamps. A regular who came on two days got 1 extra stamp.', 'So 2 × (number who came all three days) is at most 19. 19 ÷ 2 = 9 remainder 1, so at most 9.',
        'Check that 9 really works: 9 came on all three days, 1 came on Monday and Tuesday only, 8 on Monday only, 4 on Tuesday only and 2 on Wednesday only. Monday 9 + 1 + 8 = 18 ✓, Tuesday 9 + 1 + 4 = 14 ✓, Wednesday 9 + 2 = 11 ✓, regulars 9 + 1 + 8 + 4 + 2 = 24 ✓',
        venn({ n: 3, names: ['Monday (18)', 'Tuesday (14)', 'Wednesday (11)'], vals: { a: 8, b: 4, c: 2, ab: 1, bc: 0, ac: 0, abc: 9 }, hi: ['abc'], label: 'One possible diagram: all three days 9, Monday and Tuesday only 1, Monday only 8, Tuesday only 4, Wednesday only 2' }),
        'The greatest possible number is <b>9</b>.'] },
  ],
  adult: '<b>Syllabus fit:</b> Venn diagrams and the inclusion–exclusion principle are <b>not</b> in the MOE primary mathematics syllabus. Set notation and Venn diagrams are met in secondary school, so this topic is <b>enrichment</b> (P5/P6 challenge and olympiad style). It does build on P4 skills: whole-number addition and subtraction, multiples (question 6), area of squares and rectangles (question 8), and the heuristics "draw a diagram", "make a list" and the <b>supposition method</b> (question 9). Questions 1 and 2 (two groups) are a good starting point for any P4 pupil. <b>Common mistakes:</b> adding the groups without taking away the overlaps; forgetting that a "two groups" number already <i>includes</i> the people in all three groups (so the "exactly two" part is the pair number minus the centre); forgetting to add the centre back after taking away the pairs; and forgetting the "none" group outside the circles. <b>Tip:</b> always fill a three-circle diagram from the middle outwards, then check that the seven parts inside each circle add up to that circle\'s total.',
};

export default { t25 };
