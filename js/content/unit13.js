// Unit 13 · Challenge Zone — original content, Singapore context.
// A capstone set: every question draws on a method from an earlier unit.
import * as A from '../art.js';
const { svg, kid, leo } = A;
const INK = A.ink, S = A.stroke;
const F = 'font-family="Nunito, sans-serif" font-weight="800"';
const FB = 'font-family="Baloo 2, sans-serif" font-weight="800"';
const r1 = v => Math.round(v * 10) / 10;
const tx = (x, y, t, { size = 14, fill = INK, anchor = 'middle', b = false } = {}) =>
  `<text x="${r1(x)}" y="${r1(y)}" text-anchor="${anchor}" ${b ? FB : F} font-size="${size}" fill="${fill}">${t}</text>`;
let uid = 0;
const nid = p => `u13${p}${++uid}`;

const TEAL = '#0f9d94', TEAL_D = '#0f7a73', TEAL_L = '#dff6f3';
const CORAL = '#ff6b5b', CORAL_D = '#d6453a', CORAL_L = '#ffe4e0';
const GRAPE = '#7b61ff', GRAPE_D = '#5a43d6', GRAPE_L = '#ece8ff';
const SUN = '#ffc94a', SUN_D = '#b07800', SUN_L = '#fff4d1';
const LEAF = '#3dbb6b', SKY = '#4aa8ff', SOFT = '#56627a';

// rounded panel with clipped contents
function panel(W, H, inner, bg = '#f3faff') {
  const c = nid('pc');
  return `<defs><clipPath id="${c}"><rect width="${W}" height="${H}" rx="16"/></clipPath></defs><g clip-path="url(#${c})"><rect width="${W}" height="${H}" fill="${bg}"/>${inner}</g>`;
}
// a small flat bus: w wide, h high, seen from the side
function bus(x, y, w, h, color, { sw = 2.4, label = '' } = {}) {
  const n = Math.max(1, Math.floor((w - 10) / Math.max(7, h * .45)));
  const gap = (w - 10) / n, ww = gap * .7, wy = y + h * .16, wh = h * .34;
  let win = '';
  for (let i = 0; i < n; i++) win += `<rect x="${r1(x + 5 + i * gap + gap * .15)}" y="${r1(wy)}" width="${r1(ww)}" height="${r1(wh)}" rx="${r1(h * .06)}" fill="#cfe9ff"/>`;
  const wr = h * .17;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r1(h * .2)}" fill="${color}" stroke="${INK}" stroke-width="${sw}" stroke-linejoin="round"/>${win}
    ${label ? '' : `<rect x="${x}" y="${r1(y + h * .62)}" width="${w}" height="${r1(h * .1)}" fill="#fff" opacity=".75"/>`}
    <circle cx="${r1(x + w * .22)}" cy="${r1(y + h)}" r="${r1(wr)}" fill="#3b3f58" stroke="${INK}" stroke-width="${sw * .8}"/><circle cx="${r1(x + w * .78)}" cy="${r1(y + h)}" r="${r1(wr)}" fill="#3b3f58" stroke="${INK}" stroke-width="${sw * .8}"/>
    ${label ? tx(x + w / 2, y + h * .8, label, { size: r1(h * .3), fill: '#fff', b: true }) : ''}`;
}
// Singapore flag (simplified: red over white, crescent and five stars)
function sgFlag(x, y, w = 60) {
  const h = w * 2 / 3, c = nid('fl');
  const st = [[0, -1], [.95, -.31], [.59, .81], [-.59, .81], [-.95, -.31]].map(([a, b]) => `<circle cx="${r1(x + w * .3 + a * w * .07)}" cy="${r1(y + h * .25 + b * w * .07)}" r="${r1(w * .022)}" fill="#fff"/>`).join('');
  return `<defs><clipPath id="${c}"><circle cx="${r1(x + w * .2)}" cy="${r1(y + h * .25)}" r="${r1(w * .12)}"/></clipPath></defs>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff" ${S} stroke-width="2"/><rect x="${x}" y="${y}" width="${w}" height="${r1(h / 2)}" fill="#e1282e"/>
    <circle cx="${r1(x + w * .2)}" cy="${r1(y + h * .25)}" r="${r1(w * .12)}" fill="#fff"/><circle cx="${r1(x + w * .25)}" cy="${r1(y + h * .25)}" r="${r1(w * .12)}" fill="#e1282e"/>${st}
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" ${S} stroke-width="2"/>`;
}
function firework(x, y, r, c) {
  let g = '';
  for (let i = 0; i < 12; i++) {
    const a = i * Math.PI / 6;
    g += `<path d="M${r1(x + Math.cos(a) * r * .35)} ${r1(y + Math.sin(a) * r * .35)} L${r1(x + Math.cos(a) * r)} ${r1(y + Math.sin(a) * r)}" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`;
  }
  return g + `<circle cx="${x}" cy="${y}" r="3" fill="${c}"/>`;
}

/* ---------- banner: Bukit Timah Hill, four checkpoints to the summit ---------- */
// the trail is a chain of cubic Bezier segments; checkpoints sit exactly on it
const TRAIL = [[[30, 212], [90, 204], [150, 196], [176, 160]], [[176, 160], [196, 132], [110, 140], [104, 118]],
  [[104, 118], [98, 96], [190, 100], [212, 74]], [[212, 74], [226, 58], [238, 52], [252, 48]]];
const onTrail = (seg, t) => {
  const [p0, p1, p2, p3] = TRAIL[seg], u = 1 - t;
  const f = i => u * u * u * p0[i] + 3 * u * u * t * p1[i] + 3 * u * t * t * p2[i] + t * t * t * p3[i];
  return [r1(f(0)), r1(f(1))];
};
const banner = () => {
  const path = 'M30 212 ' + TRAIL.map(([, a, b, c]) => `C${a.join(' ')} ${b.join(' ')} ${c.join(' ')}`).join(' ');
  const cp = [[onTrail(0, .4), '1', TEAL], [onTrail(1, .1), '2', CORAL], [onTrail(2, .05), '3', GRAPE], [onTrail(2, .95), '4', '#f2a516']];
  const [cx, cy] = onTrail(0, .8);
  return svg('0 0 360 220', panel(360, 220, `
    <circle cx="326" cy="70" r="18" fill="#ffd45c"/>
    ${A.cloud(20, 18, .7)}${A.cloud(150, 8, .55)}
    <path d="M-10 220 C40 150 120 120 180 70 C210 46 250 30 270 40 C300 60 330 120 370 150 V220Z" fill="#6fcf87" ${S}/>
    <path d="M-10 220 C40 170 90 160 140 140 C150 180 120 200 110 220Z" fill="#8edb9f"/>
    ${A.tree(318, 192, .5)}${A.tree(26, 182, .4)}${A.tree(272, 146, .36)}
    <path d="${path}" fill="none" stroke="#e9d8b8" stroke-width="12" stroke-linecap="round"/>
    <path d="${path}" fill="none" stroke="#c9a86f" stroke-width="2" stroke-dasharray="6 8" stroke-linecap="round"/>
    ${kid('chloe', { x: cx, y: cy - 32, s: .3, pose: 'cheer' })}
    ${cp.map(([[x, y], n, c]) => `<path d="M${x} ${y} v-32" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><path d="M${x} ${y - 32} l22 7 l-22 7z" fill="${c}" ${S} stroke-width="2"/>` +
      `<circle cx="${x}" cy="${y}" r="11" fill="#fff" ${S} stroke-width="2.4"/>` + tx(x, y + 5.5, n, { size: 15, b: true, fill: c })).join('')}
    <rect x="230" y="6" width="120" height="28" rx="8" fill="#7a5a3c" ${S} stroke-width="2.4"/>
    ${tx(290, 26, 'BUKIT TIMAH', { size: 15, fill: '#fff', b: true })}
    ${leo({ x: 266, y: 50, s: .34, pose: 'wave' })}`, '#dff1ff'),
    'A winding trail up Bukit Timah Hill with four numbered checkpoint flags; Leo waves from the summit and Chloe climbs');
};

/* ---------- explore pictures ---------- */
const exploreScene = () => svg('0 0 340 300', panel(340, 300, `
  <defs><linearGradient id="u13sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b2f6b"/><stop offset="1" stop-color="#7b61ff"/></linearGradient></defs>
  <rect width="340" height="300" fill="url(#u13sky)"/>
  ${firework(70, 50, 30, SUN)}${firework(250, 40, 26, CORAL)}${firework(160, 74, 20, '#8fe3ff')}
  <g fill="#3a3f78" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round">
    <rect x="206" y="92" width="22" height="88"/><rect x="236" y="92" width="22" height="88"/><rect x="266" y="92" width="22" height="88"/>
    <path d="M196 92 q50 -18 102 -6 v10 h-102z"/>
    <rect x="20" y="130" width="34" height="50"/><rect x="58" y="112" width="28" height="68"/><rect x="128" y="138" width="40" height="42"/>
  </g>
  <path d="M0 180 h340 v120 h-340z" fill="#c9cfdc"/>
  <path d="M0 184 h340" stroke="#fff" stroke-width="3" stroke-dasharray="20 14"/>
  ${bus(14, 196, 132, 46, CORAL, { label: '45 seats' })}${bus(176, 206, 92, 36, SKY, { label: '30 seats' })}
  ${sgFlag(278, 110, 48)}<path d="M278 110 v112" stroke="${INK}" stroke-width="3"/>
  ${kid('aisyah', { x: 296, y: 228, s: .42, pose: 'wave' })}`, '#2b2f6b'),
  'Evening at the National Day show: fireworks over the city, a big coach with 45 seats and a mini-bus with 30 seats, and Aisyah waving beside a Singapore flag');

// the four steps of problem solving, as a 2 x 2 card
const fourSteps = () => {
  const items = [['1', 'Understand', 'Facts and goal', TEAL, TEAL_L], ['2', 'Make a plan', 'Which unit helps?', CORAL, CORAL_L],
    ['3', 'Carry it out', 'Work step by step', GRAPE, GRAPE_L], ['4', 'Check', 'Does it fit?', '#f2a516', SUN_L]];
  const g = items.map(([n, t, s, c, l], i) => {
    const x = 6 + (i % 2) * 166, y = 6 + Math.floor(i / 2) * 70;
    return `<rect x="${x}" y="${y}" width="160" height="62" rx="12" fill="${l}" stroke="${c}" stroke-width="3"/>
      <circle cx="${x + 24}" cy="${y + 31}" r="15" fill="${c}"/>${tx(x + 24, y + 38, n, { size: 19, fill: '#fff', b: true })}
      ${tx(x + 46, y + 27, t, { size: 17, anchor: 'start', b: true })}${tx(x + 46, y + 48, s, { size: 12.5, anchor: 'start', fill: SOFT })}`;
  }).join('');
  return svg('0 0 338 146', g, 'Four steps: 1 Understand, 2 Make a plan, 3 Carry it out, 4 Check', 'style="max-width:380px"');
};
const factTable = () => {
  const P = 'style="padding:4px 8px;text-align:left"';
  const rows = [['Buses', '9, of 2 kinds'], ['Seats', 'coach 45, mini-bus 30'], ['People', '345, all seats taken'], ['Prices', 'coach $320, mini-bus $240'],
    ['Find', '<b>coaches?</b> <b>total cost?</b>', 'hl'], ['Not needed', '<s style="color:#9aa6bd">6.30 p.m. start</s>']];
  return `<table class="tbl" style="font-size:14px"><tbody>${rows.map(([h, d, c]) => `<tr><th ${P}>${h}</th><td ${P} class="${c || ''}">${d}</td></tr>`).join('')}</tbody></table>`;
};
const supposeDiag = () => {
  let g = tx(6, 18, 'Suppose all 9 are coaches: 405 seats', { size: 15, anchor: 'start', b: true, fill: CORAL_D });
  for (let i = 0; i < 9; i++) g += bus(6 + i * 36.5, 30, 32, 24, CORAL, { sw: 2 });
  g += tx(6, 92, 'Swap 4 for mini-buses: 15 fewer seats each', { size: 15, anchor: 'start', b: true, fill: TEAL_D });
  for (let i = 0; i < 9; i++) {
    const mini = i >= 5;
    g += bus(6 + i * 36.5 + (mini ? 4 : 0), mini ? 108 : 104, mini ? 24 : 32, mini ? 20 : 24, mini ? SKY : CORAL, { sw: 2 });
    if (mini) g += tx(6 + i * 36.5 + 16, 150, '−15', { size: 14, fill: TEAL_D, b: true });
  }
  g += tx(169, 176, '405 − 4 × 15 = 345 ✓', { size: 17, b: true });
  return svg('0 0 338 186', panel(338, 186, g, '#f7fbff'), 'Nine coaches give 405 seats; swapping 4 of them for mini-buses takes away 15 seats each, leaving 345', 'style="max-width:400px"');
};
const tryTable = () => `<table class="tbl" style="font-size:15px"><thead><tr><th>Coaches</th><th>Mini-buses</th><th>Seats</th></tr></thead><tbody>
  ${[9, 8, 7, 6, 5].map(c => `<tr><td>${c}</td><td>${9 - c}</td><td class="${c === 5 ? 'hl' : ''}">${c * 45 + (9 - c) * 30}${c === 5 ? ' ✓' : ''}</td></tr>`).join('')}</tbody></table>`;

/* ---------- question diagrams ---------- */
const tickets = svg('0 0 320 96', `
  ${[[6, 'ADULT', '$18', CORAL, CORAL_L, CORAL_D], [166, 'CHILD', '$12', TEAL, TEAL_L, TEAL_D]].map(([x, t, p, c, l, d]) => `<g>
    <path d="M${x} 10 h148 v28 a10 10 0 0 0 0 20 v28 h-148 v-28 a10 10 0 0 0 0 -20z" fill="${l}" stroke="${c}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M${x + 98} 16 v64" stroke="${c}" stroke-width="2" stroke-dasharray="4 4"/>
    ${tx(x + 54, 40, 'RIVER BOAT', { size: 12, fill: SOFT })}${tx(x + 54, 64, t, { size: 18, b: true, fill: d })}
    ${tx(x + 120, 54, p, { size: 18, b: true })}</g>`).join('')}`, 'An adult ticket costs 18 dollars and a child ticket costs 12 dollars', 'style="max-width:340px"');

const scoreboard = () => {
  const rows = [['Merlion', '?'], ['Hornbill', '?  (3 marks fewer)'], ['Otter', '13 → 21'], ['Pangolin', '?'], ['Kingfisher', '?']];
  let g = `<rect x="4" y="4" width="292" height="214" rx="14" fill="#23304a"/>` + tx(150, 32, 'MATHS WEEK QUIZ', { size: 18, b: true, fill: SUN });
  rows.forEach(([t, s], i) => {
    const y = 46 + i * 30;
    g += `<rect x="18" y="${y}" width="264" height="24" rx="6" fill="#36456a"/>` + tx(30, y + 18, 'Team ' + t, { size: 14, anchor: 'start', fill: '#fff' }) +
      tx(270, y + 18, s, { size: 14, anchor: 'end', fill: s === '?' ? '#9aa6bd' : '#8fe3ff', b: s !== '?' });
  });
  g += tx(150, 208, 'Average before re-marking: 18', { size: 15, b: true, fill: '#fff' });
  return svg('0 0 300 222', g, 'A scoreboard for five teams. The average was 18. Team Otter changes from 13 to 21 and Team Hornbill loses 3 marks', 'style="max-width:330px"');
};

// regular five-pointed star with its inner pentagon, marking angles
const pentagram = ({ ans = false } = {}) => {
  const cx = 170, cy = 130, R = 120, r = R * Math.cos(2 * Math.PI / 5) / Math.cos(Math.PI / 5);
  const P = (rad, deg) => ({ x: cx + rad * Math.cos(deg * Math.PI / 180), y: cy + rad * Math.sin(deg * Math.PI / 180) });
  const V = [0, 1, 2, 3, 4].map(k => P(R, -90 + 72 * k)), I = [0, 1, 2, 3, 4].map(k => P(r, -54 + 72 * k));
  // star outline: tip, inner, tip, inner, ...
  const pts = []; for (let k = 0; k < 5; k++) pts.push(V[k], I[k]);
  const poly = pts.map(p => `${r1(p.x)},${r1(p.y)}`).join(' ');
  const pent = I.map(p => `${r1(p.x)},${r1(p.y)}`).join(' ');
  // angle arc at Q between rays to A and B, radius rr
  const arc = (Q, Aa, B, rr, c) => {
    let a1 = Math.atan2(Aa.y - Q.y, Aa.x - Q.x), a2 = Math.atan2(B.y - Q.y, B.x - Q.x);
    let d = a2 - a1; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
    const s = { x: Q.x + rr * Math.cos(a1), y: Q.y + rr * Math.sin(a1) }, e = { x: Q.x + rr * Math.cos(a1 + d), y: Q.y + rr * Math.sin(a1 + d) };
    const m = a1 + d / 2;
    return { path: `<path d="M${r1(Q.x)} ${r1(Q.y)} L${r1(s.x)} ${r1(s.y)} A${rr} ${rr} 0 0 ${d > 0 ? 1 : 0} ${r1(e.x)} ${r1(e.y)}Z" fill="${c}" opacity=".85" stroke="${INK}" stroke-width="1.6"/>`, m };
  };
  const at = (Q, m, dist) => ({ x: Q.x + dist * Math.cos(m), y: Q.y + dist * Math.sin(m) });
  const top = V[0], Pr = I[0], Pl = I[4], Pn = I[1];
  const aA = arc(top, Pl, Pr, 46, SUN), aB = arc(Pr, top, Pl, 18, '#8fe3ff'), aP = arc(Pr, Pl, Pn, 20, GRAPE_L);
  const la = at(top, aA.m, 32), lb = at(Pr, aB.m, 28), lp = at(Pr, aP.m, 40);
  // dashed guide: the straight line through Pn, Pr and the top tip
  const ext = `<path d="M${r1(Pn.x)} ${r1(Pn.y)} L${r1(top.x)} ${r1(top.y)}" stroke="${CORAL}" stroke-width="3" stroke-dasharray="7 5"/>`;
  return svg('44 4 252 230', `
    <polygon points="${poly}" fill="#fff" ${S}/>
    <polygon points="${pent}" fill="#fde9e9" stroke="${INK}" stroke-width="2" stroke-dasharray="5 4"/>
    ${aA.path}${aB.path}${aP.path}${ans ? ext : ''}
    ${ans ? tx(top.x + 30, top.y + 30, '36°', { size: 16, anchor: 'start', b: true, fill: CORAL_D }) + `<path d="M${r1(top.x + 28)} ${r1(top.y + 25)} L${r1(la.x + 3)} ${r1(la.y - 2)}" stroke="${CORAL_D}" stroke-width="2"/>`
      : tx(la.x, la.y + 6, 'a', { size: 18, b: true, fill: CORAL_D })}
    ${ans ? tx(Pr.x + 26, Pr.y - 16, '72°', { size: 15, anchor: 'start', b: true, fill: '#1f6fb8' }) + `<path d="M${r1(Pr.x + 24)} ${r1(Pr.y - 20)} L${r1(lb.x + 2)} ${r1(lb.y - 1)}" stroke="#1f6fb8" stroke-width="2"/>`
      : tx(lb.x, lb.y + 5, 'b', { size: 16, b: true, fill: '#1f6fb8' })}
    ${tx(lp.x, lp.y + 5, '108°', { size: 15, b: true, fill: GRAPE_D })}`,
    ans ? 'Five-pointed star: the angle b next to the 108 degree pentagon corner is 72 degrees, and the point angle a is 36 degrees' : 'A five-pointed star around a regular pentagon. One pentagon corner is 108 degrees; angle b is next to it; angle a is at the top point',
    'style="max-width:300px"');
};

const STRIPE = { R: '#e1282e', W: '#ffffff', B: '#2f6fd6', Y: '#ffc94a' };
const bannerQ = svg('0 0 320 150', `
  <path d="M20 14 v120" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
  ${[0, 1, 2].map(i => `<rect x="24" y="${16 + i * 34}" width="160" height="34" fill="#f4f6fb" ${S} stroke-width="2.4"/>${tx(104, 39 + i * 34, i === 0 ? 'top' : i === 1 ? 'middle' : 'bottom', { size: 14, fill: '#9aa6bd' })}`).join('')}
  ${Object.entries(STRIPE).map(([k, c], i) => `<g transform="translate(${214 + (i % 2) * 56} ${20 + Math.floor(i / 2) * 68})">
    <path d="M-16 0 h32 l-3 34 h-26z" fill="${c}" ${S} stroke-width="2.4"/><rect x="-18" y="-6" width="36" height="8" rx="3" fill="#cfd8e6" ${S} stroke-width="2"/>
    ${tx(0, 50, { R: 'red', W: 'white', B: 'blue', Y: 'yellow' }[k], { size: 13 })}</g>`).join('')}`,
  'A banner with three blank stripes and four pots of paint: red, white, blue and yellow', 'style="max-width:340px"');
const bannerSol = svg('0 0 370 120', `
  ${[['4 choices', 'any colour'], ['3 choices', 'not the top colour'], ['3 choices', 'not the middle colour']].map(([a, b], i) => `<rect x="10" y="${8 + i * 34}" width="110" height="34" fill="${[STRIPE.R, STRIPE.W, STRIPE.R][i]}" ${S} stroke-width="2.4"/>
    ${tx(134, 30 + i * 34, `<tspan fill="${CORAL_D}" font-family="Baloo 2, sans-serif">${a}</tspan>  ${b}`, { size: 14, anchor: 'start' })}`).join('')}`,
  'Top stripe 4 choices, middle stripe 3 choices, bottom stripe 3 choices. Example banner: red, white, red', 'style="max-width:400px"');

// bar model for the kuih bangkit question
const kuihBar = svg('0 0 330 112', `
  <rect x="10" y="30" width="100" height="34" fill="${CORAL_L}" ${S} stroke-width="2.4"/>${tx(60, 53, '1 unit', { size: 14, b: true, fill: CORAL_D })}
  <rect x="110" y="30" width="22" height="34" fill="${CORAL_L}" ${S} stroke-width="2.4"/>${tx(121, 53, '2', { size: 14, b: true, fill: CORAL_D })}
  <rect x="132" y="30" width="178" height="34" fill="${TEAL_L}" ${S} stroke-width="2.4"/>
  <path d="M210 30 v34" stroke="${INK}" stroke-width="2.4"/>
  ${tx(71, 20, 'Mrs Pillai takes', { size: 13, b: true, fill: CORAL_D })}${tx(221, 20, '20 left', { size: 14, b: true, fill: TEAL_D })}
  <path d="M110 74 v8 h200 v-8" fill="none" stroke="${INK}" stroke-width="2.2"/>${tx(210, 102, '2 units = 2 + 20 = 22', { size: 15, b: true })}`,
  'Bar model: the whole is 3 equal units. Mrs Pillai takes 1 unit and 2 more; the 20 left and those 2 make up the other 2 units, which is 22', 'style="max-width:360px"');

const mulGrid = (vals = ['S', 'I', 'N', 'G'], res = ['G', 'N', 'I', 'S']) => {
  const cell = (x, y, t, c) => `<rect x="${x}" y="${y}" width="40" height="40" rx="8" fill="${c}" ${S} stroke-width="2.4"/>` + tx(x + 20, y + 29, t, { size: 22, b: true });
  const col = { S: SUN_L, I: GRAPE_L, N: TEAL_L, G: CORAL_L, 2: SUN_L, 1: GRAPE_L, 7: TEAL_L, 8: CORAL_L };
  let g = vals.map((v, i) => cell(70 + i * 46, 8, v, col[v])).join('');
  g += tx(48, 84, '×', { size: 24, b: true }) + cell(70 + 3 * 46, 56, '4', '#fff');
  g += `<path d="M40 106 h220" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
  g += res.map((v, i) => cell(70 + i * 46, 114, v, col[v])).join('');
  return svg('0 0 280 162', g, `A multiplication: ${vals.join('')} times 4 equals ${res.join('')}`, 'style="max-width:260px"');
};

// three-circle Venn diagram; nums = [CR only, L only, S only, CR&L, L&S, CR&S, all, none] or null
const venn = (nums = null) => {
  const C = [[120, 108, 'Chicken rice', CORAL], [210, 108, 'Laksa', SUN], [165, 184, 'Satay', SKY]], rr = 64;
  let g = `<rect x="6" y="6" width="318" height="268" rx="12" fill="#fff" ${S} stroke-width="2.4"/>`;
  g += C.map(([x, y, , c]) => `<circle cx="${x}" cy="${y}" r="${rr}" fill="${c}" opacity=".28"/>`).join('');
  g += C.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${rr}" fill="none" ${S} stroke-width="2.4"/>`).join('');
  g += tx(80, 32, 'Chicken rice', { size: 14, b: true, fill: CORAL_D }) + tx(252, 32, 'Laksa', { size: 14, b: true, fill: SUN_D }) + tx(165, 266, 'Satay', { size: 14, b: true, fill: '#1f6fb8' });
  g += tx(18, 264, '40 pupils', { size: 13, anchor: 'start', fill: SOFT });
  if (nums) {
    const pos = [[94, 96], [236, 96], [165, 222], [165, 86], [206, 158], [124, 158], [165, 130], [292, 238]];
    nums.forEach((n, i) => { g += tx(pos[i][0], pos[i][1] + 7, n, { size: 20, b: true, fill: i === 6 ? GRAPE_D : INK }); });
    g += tx(292, 214, 'none', { size: 12, fill: SOFT });
  } else g += tx(165, 137, '4', { size: 20, b: true, fill: GRAPE_D });
  return svg('0 0 330 280', g, nums ? 'Completed Venn diagram: chicken rice only 7, laksa only 6, satay only 7, chicken rice and laksa only 5, laksa and satay only 3, chicken rice and satay only 6, all three 4, none 2' : 'Three overlapping circles for chicken rice, laksa and satay; 4 pupils are in the middle where all three overlap', 'style="max-width:330px"');
};

const stickBag = () => {
  const sticks = [['red', 10, '#e1282e'], ['white', 8, '#ffffff'], ['blue', 6, '#2f6fd6'], ['green', 3, LEAF]];
  let g = `<path d="M78 54 q-66 40 -52 112 q3 14 20 14 h108 q17 0 20 -14 q14 -72 -52 -112z" fill="#3b3f58" ${S}/>
    <path d="M74 54 q-10 -22 4 -30 q10 10 6 30z M126 54 q10 -22 -4 -30 q-10 10 -6 30z" fill="#4c5277" ${S} stroke-width="2.4"/>
    <rect x="70" y="48" width="60" height="12" rx="6" fill="${SUN}" ${S} stroke-width="2.4"/>`;
  g += tx(100, 136, '?', { size: 44, b: true, fill: '#9aa6bd' });
  sticks.forEach(([n, k, c], i) => {
    const y = 34 + i * 40;
    g += `<rect x="208" y="${y}" width="40" height="11" rx="5.5" fill="${c}" ${S} stroke-width="2"/><rect x="212" y="${y + 2}" width="10" height="4" rx="2" fill="#fff" opacity=".7"/>`;
    g += tx(258, y + 11, `${k} ${n}`, { size: 16, anchor: 'start', b: true });
  });
  return svg('0 0 340 190', g, 'A dark bag holding 10 red, 8 white, 6 blue and 3 green light sticks', 'style="max-width:340px"');
};

/* ===================== Challenge Zone ===================== */
const CZ = {
  id: 'CZ',
  title: 'Mixed Challenge Problems',
  intro: 'You have learnt many problem-solving tools. Now the problems don\'t tell you which tool to use! Read carefully, pick a strategy, and climb to the top.',
  skills: ['Choosing a strategy', 'Mixed problems', 'Checking'],
  art: banner,
  explore: {
    title: 'How to Tackle a Tough Problem',
    setup: 'It is <b>Mathematics Week</b>! The "Problem of the Week" board outside the school hall is about the school\'s trip to the <b>NE Show</b>, a National Day Parade rehearsal that Primary 5 pupils go to watch:<br><i>"Our P5 pupils and teachers went to the show in <b>9</b> buses: coaches with <b>45</b> seats and mini-buses with <b>30</b> seats. There were <b>345</b> people, and every seat was taken. The show started at 6.30 p.m. A coach cost <b>$320</b> to hire and a mini-bus cost <b>$240</b>. How many coaches were there? How much did all the buses cost?"</i>',
    art: exploreScene,
    steps: [
      { who: 'leo', mood: 'teach', text: 'A long problem can look scary. Don\'t panic! Good problem solvers use the same <b>4 steps</b> every time. Let\'s try them on this bus problem.', art: fourSteps },
      { who: 'aisyah', text: '<b>Step 1: Understand.</b> I read it twice and sort out the facts. One fact is a <b>red herring</b>: the 6.30 p.m. start time doesn\'t help us at all! And the question asks for <b>two</b> things.', art: factTable },
      { who: 'arjun', mood: 'think', text: '<b>Step 2: Make a plan.</b> Which strategy fits? Hmm… two kinds of buses, the number of buses and the number of seats. That\'s just like chickens and rabbits! The buses are the <b>heads</b> and the seats are the <b>legs</b>. That\'s <b>Unit 8: make a supposition</b>.' },
      { who: 'chloe', mood: 'think', text: 'We could also <b>make a table</b> and try 9 coaches, 8 coaches, 7 coaches… That works too, but it may take longer if the numbers are big.' },
      { who: 'weiming', text: '<b>Step 3: Carry it out.</b> Suppose all 9 were coaches: 9 × 45 = 405 seats. That is 405 − 345 = <b>60</b> seats too many. Swapping one coach for a mini-bus takes away 45 − 30 = <b>15</b> seats. So we swap 60 ÷ 15 = <b>4</b> times: 4 mini-buses and 9 − 4 = <b>5</b> coaches.', art: supposeDiag },
      { who: 'aisyah', text: 'Don\'t stop yet! The question asks for the cost too. 5 coaches cost 5 × $320 = $1600, and 4 mini-buses cost 4 × $240 = $960. Altogether: $1600 + $960 = <b>$2560</b>.' },
      { who: 'leo', mood: 'teach', text: '<b>Step 4: Check.</b> Check with the <b>question</b>, not just your working: 5 + 4 = 9 buses ✓ and 5 × 45 + 4 × 30 = 225 + 120 = 345 seats ✓. Then look back. Chloe\'s table gives the same answer, and it shows <b>why</b> supposition works: each swap takes away 15 seats.', art: tryTable },
    ],
  },
  keys: [
    { title: 'Draw a model', text: 'Amounts compared, shared out or made equal ("more than", "times as many", average, excess and shortage)? Draw <b>bars</b> and find 1 unit. (Unit 6)' },
    { title: 'Make a list or table', text: 'Counting ways, or testing cases? List them <b>in order</b> so nothing is missed. Multiply when choices come one after another. (Units 4, 9, 10, 11)' },
    { title: 'Work backwards or suppose', text: 'Know how it <b>ends</b>? Undo the steps, last one first. (Unit 7) Two kinds of things with two totals? <b>Suppose</b> they are all one kind, then fix it. (Unit 8)' },
    { title: 'Pattern or worst case', text: 'Something repeats? Look for the <b>pattern</b> and use remainders. (Units 1, 6) "How many to be <b>sure</b>?" Imagine the unluckiest case, then add 1. (Unit 12)' },
  ],
  practice: [
    { id: 'a', level: 1, type: 'blanks', prompt: 'On a P4 learning journey, <b>37</b> parents and <b>37</b> children take a bumboat ride along the Singapore River. A ticket costs <b>$18</b> for an adult and <b>$12</b> for a child. How much do they pay altogether?',
      art: tickets,
      template: 'They pay ${0} altogether.', blanks: [{ answer: 1110 }],
      hint: 'Think <b>Unit 2 (smart calculation)</b>: put each parent with a child. How much does one pair of tickets cost? How many pairs are there?',
      solution: ['Put each parent with a child: one pair of tickets costs $18 + $12 = $30.', 'There are 37 pairs, so the total is 37 × $30 = $1110.', 'This is the distributive law: 37 × 18 + 37 × 12 = 37 × (18 + 12). Check: 37 × 18 = 666 and 37 × 12 = 444, and 666 + 444 = 1110 ✓', 'They pay <b>$1110</b> altogether.'] },
    { id: 'b', level: 1, type: 'blanks', prompt: 'Mei Ling helps to print the school magazine for Mathematics Week. It has <b>64</b> pages. Pages 1 to 7 are the cover and contents pages, and no page number is printed on them. Pages <b>8 to 64</b> each have their page number printed at the bottom. How many digits are printed altogether?',
      template: '{0} digits', blanks: [{ answer: 112 }],
      hint: 'Think <b>Unit 9 (page numbers)</b>: split the pages into those with 1-digit numbers and those with 2-digit numbers. Count each group carefully.',
      solution: ['1-digit page numbers: pages 8 and 9. That is 2 pages × 1 digit = 2 digits.', '2-digit page numbers: pages 10 to 64. That is 64 − 10 + 1 = 55 pages, and 55 × 2 = 110 digits.', 'Total: 2 + 110 = <b>112</b> digits.'] },
    { id: 'c', level: 2, type: 'blanks', prompt: 'Five teams took part in the Maths Week quiz. Their average score was <b>18</b>. When Ms Goh re-marked the papers, Team Otter\'s score went <b>up</b> from 13 to 21, and Team Hornbill\'s score went <b>down</b> by 3. The other scores did not change. What is the new average score?',
      art: scoreboard(),
      template: 'New average = {0}', blanks: [{ answer: 19 }],
      hint: 'Think <b>Unit 6 (average)</b>: you don\'t need every score. Average × number of teams = total. How much did the <b>total</b> change?',
      solution: ['Total before: 18 × 5 = 90.', 'Team Otter gained 21 − 13 = 8 marks. Team Hornbill lost 3 marks. So the total changed by 8 − 3 = 5 more marks.', 'New total: 90 + 5 = 95. New average: 95 ÷ 5 = 19.', 'Quick way: the extra 5 marks are shared by 5 teams, so the average goes up by 1.', 'The new average is <b>19</b>.'] },
    { id: 'd', level: 2, type: 'blanks', prompt: 'On National Day, Daniel looks at the five stars on the Singapore flag. He draws one big five-pointed star. In its middle is a regular pentagon, and each corner of a regular pentagon is <b>108°</b> (you met this in Unit 3). Each side of the star is a straight line. Find ∠<i>a</i>, the angle at one point of the star. Then find the <b>total</b> of the angles at all five points.',
      art: pentagram(),
      template: '∠<i>a</i> = {0}° &nbsp;&nbsp; Total of the 5 points = {1}°', blanks: [{ answer: 36 }, { answer: 180 }],
      hint: 'Think <b>Unit 3 (angles)</b>: ∠<i>b</i> and the 108° corner sit together on a straight line. Find ∠<i>b</i> first. Then use the triangle at the top point.',
      solution: ['∠<i>b</i> and the 108° corner of the pentagon make a straight line, so ∠<i>b</i> = 180° − 108° = 72°.', 'The other bottom angle of the top point\'s triangle (on the left) is also 72°, for the same reason.', 'The angles of a triangle add up to 180°, so ∠<i>a</i> = 180° − 72° − 72° = <b>36°</b>.', pentagram({ ans: true }), 'All 5 points are the same size, so their total is 5 × 36° = <b>180°</b>.'] },
    { id: 'e', level: 2, type: 'blanks', prompt: 'For National Day, Nurul paints a banner with <b>3</b> stripes to hang along her HDB corridor. She can use <b>red, white, blue</b> and <b>yellow</b> paint. Two stripes that touch must be <b>different</b> colours, but the top and bottom stripes may be the same colour. Each stripe is one colour. How many different banners can she paint?',
      art: bannerQ,
      template: '{0} different banners', blanks: [{ answer: 36 }],
      hint: 'Think <b>Unit 10 (multiplication principle)</b>: paint from the top down. How many choices are there for each stripe? Careful: the bottom stripe only has to be different from the <b>middle</b> stripe.',
      solution: ['Top stripe: any of the 4 colours, so 4 choices.', 'Middle stripe: any colour except the top colour, so 3 choices.', 'Bottom stripe: any colour except the middle colour, so 3 choices. (It may match the top stripe.)', bannerSol, 'Multiply the choices: 4 × 3 × 3 = <b>36</b> banners.', 'A common mistake is 4 × 3 × 2 = 24. That wrongly stops the bottom stripe from matching the top stripe.'] },
    { id: 'f', level: 3, type: 'blanks', prompt: 'After her Hari Raya open house, Mdm Rahimah has some kuih bangkit left in a tin. Her neighbour Mrs Pillai takes home <b>[[f:1/3]]</b> of the kuih bangkit and <b>2</b> more. Then Jun Jie takes <b>half</b> of the kuih bangkit left and <b>3</b> more. Now there are <b>7</b> kuih bangkit left in the tin. How many were in the tin at first?',
      template: '{0} kuih bangkit', blanks: [{ answer: 33 }],
      hint: 'Think <b>Unit 7 (working backwards)</b>: start from the 7 at the end and undo Jun Jie first. For Mrs Pillai\'s step, draw a model with 3 units (Unit 6).',
      solution: ['Undo Jun Jie: before his "3 more", there were 7 + 3 = 10 left. That was half of what he found, so he found 10 × 2 = <b>20</b> in the tin.', 'Undo Mrs Pillai: she took 1 unit and 2 more, leaving 20. So the other 2 units = 2 + 20 = 22.', kuihBar, '1 unit = 22 ÷ 2 = 11, so the tin had 3 × 11 = 33 at first.', 'Check forwards: Mrs Pillai takes 11 + 2 = 13, leaving 20. Jun Jie takes 10 + 3 = 13, leaving 7 ✓', 'There were <b>33</b> kuih bangkit at first.'] },
    { id: 'g', level: 3, type: 'blanks', prompt: 'A puzzle on the Maths Week trail: in the multiplication below, each letter stands for a digit. The same letter is always the same digit, and different letters are different digits. Multiplying <b>SING</b> by 4 turns it back to front! Find the digits.',
      art: mulGrid(),
      template: 'S = {0} &nbsp; I = {1} &nbsp; N = {2} &nbsp; G = {3}', blanks: [{ answer: 2, size: 'sm' }, { answer: 1, size: 'sm' }, { answer: 7, size: 'sm' }, { answer: 8, size: 'sm' }],
      hint: 'Think <b>Unit 4 (digit puzzles)</b>: start with S. SING × 4 is still a 4-digit number, so S is small. GNIS ends in S, and 4 × G is always even. Then find G.',
      solution: ['SING × 4 is still a 4-digit number, so S × 4 is less than 10: S is 1 or 2.', 'The answer GNIS ends in S, and anything × 4 is even, so S is even. So <b>S = 2</b>.', 'G × 4 ends in 2, so G is 3 or 8. But G is the first digit of the answer and 2 × 4 = 8, so G is at least 8. So <b>G = 8</b>.', 'Since 2 × 4 = 8 exactly, nothing can be carried into the thousands, so I × 4 plus the carry is less than 10. I is 0 or 1 (2 is taken).', 'Ones: 8 × 4 = 32. Write 2, carry 3. Tens: N × 4 + 3 must end in I. N × 4 + 3 is odd, so I is odd: <b>I = 1</b>.', 'N × 4 + 3 ends in 1, so N × 4 ends in 8: N is 2 or 7. 2 is taken, so <b>N = 7</b>. Check: 2178 × 4 = 8712 ✓', mulGrid(['2', '1', '7', '8'], ['8', '7', '1', '2']), 'So <b>S = 2, I = 1, N = 7, G = 8</b>: 2178 × 4 = 8712.'] },
    { id: 'h', level: 3, type: 'blanks', prompt: 'Mrs D\'Cruz asks the <b>40</b> pupils in her class which hawker foods they like. <b>22</b> like chicken rice, <b>18</b> like laksa and <b>20</b> like satay. <b>9</b> like both chicken rice and laksa, <b>7</b> like both laksa and satay, and <b>10</b> like both chicken rice and satay. <b>4</b> pupils like all three. How many pupils like <b>none</b> of the three? How many like <b>exactly one</b> of them?',
      art: venn(),
      template: 'None: {0} pupils &nbsp;&nbsp; Exactly one: {1} pupils', blanks: [{ answer: 2 }, { answer: 20 }],
      hint: 'Think <b>Unit 11 (Venn diagrams)</b>: fill in the diagram from the <b>middle</b> outwards. "9 like chicken rice and laksa" includes the 4 who like all three.',
      solution: ['Middle: 4 like all three.', 'Two foods only: chicken rice and laksa 9 − 4 = 5; laksa and satay 7 − 4 = 3; chicken rice and satay 10 − 4 = 6.', 'One food only: chicken rice 22 − 5 − 6 − 4 = 7; laksa 18 − 5 − 3 − 4 = 6; satay 20 − 3 − 6 − 4 = 7.', venn([7, 6, 7, 5, 3, 6, 4, 2]), 'Pupils in the circles: 7 + 6 + 7 + 5 + 3 + 6 + 4 = 38. So <b>2</b> pupils like none of them (40 − 38).', 'Exactly one food: 7 + 6 + 7 = <b>20</b> pupils.'] },
    { id: 'i', level: 3, type: 'blanks', prompt: 'At the Racial Harmony Day concert, Hafiz hands out light sticks from a dark bag. The bag has <b>10 red</b>, <b>8 white</b>, <b>6 blue</b> and <b>3 green</b> light sticks. Without looking, what is the <b>smallest</b> number he must take out to be <b>sure</b> of getting:<br>(1) at least <b>3</b> light sticks of the <b>same</b> colour?<br>(2) at least <b>one</b> light stick of <b>every</b> colour?',
      art: stickBag(),
      template: '(1) {0} light sticks &nbsp;&nbsp; (2) {1} light sticks', blanks: [{ answer: 9 }, { answer: 25 }],
      hint: 'Think <b>Unit 12 (the worst case)</b>: imagine Hafiz is as unlucky as possible. In (1), how many can he take <b>without</b> 3 of one colour? In (2), which colour would he get last?',
      solution: ['(1) Worst case: he takes 2 of each colour first, with no 3 the same. That is 2 × 4 = 8 light sticks.', 'The next light stick must make 3 of some colour, so he needs 8 + 1 = <b>9</b>.', '(2) Worst case: the green ones come last, because there are fewest of them. He could take all 10 red, 8 white and 6 blue first: 10 + 8 + 6 = 24 light sticks, with no green.', 'The next one must be green, so he needs 24 + 1 = <b>25</b>.'] },
  ],
  adult: 'This <b>Challenge Zone</b> is the capstone of the course. Unlike the earlier topics, the questions do not say which method to use: choosing the strategy <i>is</i> the skill. The explore models four problem-solving steps (understand, make a plan, carry it out, check), based on George Pólya\'s well-known problem-solving process. Singapore primary maths uses the same four stages when it teaches problem-solving heuristics.<br><br><b>Where each question comes from:</b> Explore: supposition (Unit 8, Chickens and Rabbits). Q1: distributive law (Unit 2). Q2: page numbers (Unit 9). Q3: average (Unit 6). Q4: angles on a straight line and in a triangle, with the pentagon from tessellations (Unit 3). Q5: multiplication principle (Unit 10). Q6: working backwards (Unit 7) with a bar model in units and parts (Unit 6). Q7: digit puzzles (Unit 4). Q8: three-circle Venn diagrams (Unit 11). Q9: worst case, the pigeonhole principle (Unit 12).<br><br><b>Syllabus link:</b> the skills inside the questions come from P4 to P6 work (for example, the angle sum of a triangle is met in P5 and average in P6), but the problems themselves are <b>enrichment</b>, at Maths Olympiad level. <b>Tips:</b> use this page for revision at the end of the course. Ask your child to name a strategy <i>before</i> opening the hint, then compare with the hint. If a question goes wrong, go back to the unit named in its hint and redo one or two questions there. Insist on the check step: many lost marks come from answering only half the question (like forgetting the cost in the bus problem) rather than from wrong calculations.',
};

export default { CZ };
