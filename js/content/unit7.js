// Unit 7 · Work Backwards — original content, Singapore context.
import * as A from '../art.js';
const { svg, kid, leo } = A;
const INK = A.ink, S = A.stroke;
const F = 'font-family="Nunito, sans-serif" font-weight="800"';
const FB = 'font-family="Baloo 2, sans-serif" font-weight="800"';
const tx = (x, y, t, { size = 14, fill = INK, anchor = 'middle', b = false } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" ${b ? FB : F} font-size="${size}" fill="${fill}">${t}</text>`;
const r1 = v => Math.round(v * 10) / 10;
let uid = 0;
const nid = p => `u7${p}${++uid}`;

const TEAL = '#0f9d94', TEAL_D = '#0f7a73', TEAL_L = '#dff6f3';
const CORAL = '#ff6b5b', CORAL_D = '#d6453a', CORAL_L = '#ffe4e0';

// rounded panel with clipped contents
function panel(W, H, inner, bg = '#f3faff') {
  const c = nid('pc');
  return `<defs><clipPath id="${c}"><rect width="${W}" height="${H}" rx="16"/></clipPath></defs><g clip-path="url(#${c})"><rect width="${W}" height="${H}" fill="${bg}"/>${inner}</g>`;
}
// straight horizontal arrow, head at x2
function arrowH(x1, x2, y, c, w = 5) {
  const d = Math.sign(x2 - x1) || 1, hl = 11, hw = w / 2 + 5, xe = r1(x2 - d * hl);
  return `<path d="M${r1(x1)} ${y} H${xe}" stroke="${INK}" stroke-width="${w + 4}" stroke-linecap="round"/><path d="M${r1(x1)} ${y} H${xe}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/><path d="M${xe} ${y - hw} L${r1(x2)} ${y} L${xe} ${y + hw}Z" fill="${c}" ${S} stroke-width="2.2"/>`;
}
// a pill-shaped label centred at (x, y)
function pill(x, y, text, { fill = '#fff', color = INK, size = 14, stroke = INK } = {}) {
  const w = r1(text.replace(/<[^>]+>/g, '').length * size * .56 + 16), h = size + 10;
  return `<rect x="${r1(x - w / 2)}" y="${r1(y - h / 2)}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>` + tx(x, r1(y + size * .36), text, { size, fill: color });
}

/* ---------- flowchart of operations ----------
   One row of value boxes joined by arrows with an operation bubble above each arrow.
   back = true: arrows point left (undoing). */
const BW = 62, AW = 68;
function flowRow(x0, y, nodes, ops, { back = false, hi = [] } = {}) {
  const col = back ? CORAL : TEAL, colD = back ? CORAL_D : TEAL_D, colL = back ? CORAL_L : TEAL_L;
  let g = '';
  nodes.forEach((v, i) => {
    const bx = x0 + i * (BW + AW), q = v === '?';
    g += `<rect x="${bx}" y="${y}" width="${BW}" height="42" rx="10" fill="${hi.includes(i) ? '#fff4d1' : q ? '#fff0ee' : '#fff'}" ${S}/>` +
      tx(bx + BW / 2, y + 29, v === '' ? '…' : v, { size: v.length > 4 ? 17 : 20, b: true, fill: q ? CORAL_D : v === '' ? '#9aa6bd' : INK });
  });
  ops.forEach((o, i) => {
    const xa = x0 + i * (BW + AW) + BW + 5, xb = xa + AW - 10;
    g += back ? arrowH(xb, xa, y + 21, col) : arrowH(xa, xb, y + 21, col);
    g += pill(r1((xa + xb) / 2), y - 14, o, { fill: colL, color: colD, stroke: col });
  });
  return g;
}
const rowW = n => n * BW + (n - 1) * AW;
// forward row, plus an optional backward row under it
function flowDiag({ fwd, back, caps = ['Forwards: what happened', 'Backwards: undo each step'], label = 'Flowchart of the steps' }) {
  const n = fwd.nodes.length, W = rowW(n) + 16, x0 = 8;
  let g = tx(x0, 18, caps[0], { anchor: 'start', size: 14, fill: TEAL_D, b: true }) + flowRow(x0, 52, fwd.nodes, fwd.ops, { hi: fwd.hi });
  let H = 104;
  if (back) {
    g += tx(x0, 124, caps[1], { anchor: 'start', size: 14, fill: CORAL_D, b: true }) + flowRow(x0, 158, back.nodes, back.ops, { back: true, hi: back.hi });
    H = 210;
  }
  return svg(`0 0 ${W} ${H}`, panel(W, H, g, '#f7fbff'), label, `style="max-width:${Math.round(W * 1.2)}px"`);
}
// two forward rows (e.g. Monday then Tuesday)
function flowTwoRows(r1n, r2n, caps, label) {
  const W = rowW(3) + 16, x0 = 8;
  const g = tx(x0, 18, caps[0], { anchor: 'start', size: 14, fill: TEAL_D, b: true }) + flowRow(x0, 52, r1n.nodes, r1n.ops) +
    tx(x0, 124, caps[1], { anchor: 'start', size: 14, fill: TEAL_D, b: true }) + flowRow(x0, 158, r2n.nodes, r2n.ops);
  return svg(`0 0 ${W} 210`, panel(W, 210, g, '#f7fbff'), label, `style="max-width:${Math.round(W * 1.2)}px"`);
}

/* ---------- transfer pictures ---------- */
// a person: a cast kid (key) or a coloured circle with an initial
function person(x, y, { key, name, color = '#7b61ff', above = false }) {
  if (key) return kid(key, { x, y: y - 6, s: .42 }) + tx(x, above ? y - 32 : y + 60, name, { size: 15, b: true });
  return `<circle cx="${x}" cy="${y}" r="25" fill="${color}" ${S}/>` + tx(x, y + 8, name[0], { size: 22, fill: '#fff', b: true }) + tx(x, y + 46, name, { size: 15, b: true });
}
// curved arrow from P to Q; bend > 0 bows to the left of the direction of travel
function curveArrow(P, Q, bend, { col = CORAL, label = '', r = 34, lsize = 13, lout = 0 } = {}) {
  const mx = (P.x + Q.x) / 2, my = (P.y + Q.y) / 2, dx = Q.x - P.x, dy = Q.y - P.y, L = Math.hypot(dx, dy);
  const nx = dy / L, ny = -dx / L; // left of travel (screen coordinates)
  const C = { x: mx + nx * bend, y: my + ny * bend };
  const unit = (a, b) => { const l = Math.hypot(b.x - a.x, b.y - a.y); return { x: (b.x - a.x) / l, y: (b.y - a.y) / l }; };
  const u1 = unit(P, C), u2 = unit(Q, C);
  const s = { x: P.x + u1.x * r, y: P.y + u1.y * r }, e = { x: Q.x + u2.x * (r + 2), y: Q.y + u2.y * (r + 2) };
  const ue = unit(C, e), base = { x: e.x - ue.x * 13, y: e.y - ue.y * 13 };
  const d = `M${r1(s.x)} ${r1(s.y)} Q${r1(C.x)} ${r1(C.y)} ${r1(base.x)} ${r1(base.y)}`;
  const head = `M${r1(e.x)} ${r1(e.y)} L${r1(base.x - ue.y * 7)} ${r1(base.y + ue.x * 7)} L${r1(base.x + ue.y * 7)} ${r1(base.y - ue.x * 7)}Z`;
  const sg = Math.sign(bend) || 1, lx = .25 * s.x + .5 * C.x + .25 * e.x + nx * sg * lout, ly = .25 * s.y + .5 * C.y + .25 * e.y + ny * sg * lout;
  return `<path d="${d}" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="3.5" stroke-linecap="round"/><path d="${head}" fill="${col}" ${S} stroke-width="2"/>` +
    (label ? pill(r1(lx), r1(ly), label, { size: lsize, fill: '#fff', color: col === CORAL ? CORAL_D : col === TEAL ? TEAL_D : '#5a43d6', stroke: col }) : '');
}

/* ---------- reverse table (HTML) ----------
   rows: {label, cells:[...]} for amounts (null = not known yet), or {step:'text'} for what happened in between */
function revTable(names, rows, { hi = -1 } = {}) {
  const td = 'style="padding:4px 7px;line-height:1.2"';
  const body = rows.map((r, i) => r.step
    ? `<tr><td colspan="${names.length + 1}" style="padding:2px 8px;text-align:left;font-size:13px;color:#56627a;background:#fafcff">↓ ${r.step}</td></tr>`
    : `<tr><th ${td}>${r.label}</th>${r.cells.map(c => `<td ${td} class="${i === hi ? 'hl' : ''}">${c == null ? '<span style="color:#9aa6bd">?</span>' : c}</td>`).join('')}</tr>`).join('');
  return `<table class="tbl" style="font-size:15px"><thead><tr><th ${td}></th>${names.map(n => `<th ${td}>${n}</th>`).join('')}</tr></thead><tbody>${body}</tbody></table>`;
}
const cv = (v, how) => `<b>${v}</b>${how ? `<br><small style="white-space:nowrap">${how}</small>` : ''}`;

/* ---------- props ---------- */
function purse(x, y, s = 1, color = CORAL) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-30 -8 q0 -14 14 -14 h32 q14 0 14 14 v26 q0 10 -10 10 h-40 q-10 0 -10 -10z" fill="${color}" ${S}/>
    <path d="M-30 -2 h60" stroke="#fff" stroke-width="2.5" opacity=".6"/><circle cx="-5" cy="-23" r="4" fill="#ffc94a" ${S} stroke-width="2"/><circle cx="5" cy="-23" r="4" fill="#ffc94a" ${S} stroke-width="2"/></g>`;
}
function coin(x, y, r = 9) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="#ffc94a" ${S} stroke-width="2.2"/><text x="${x}" y="${y + r * .42}" text-anchor="middle" ${FB} font-size="${r * 1.1}" fill="#b07800">$</text>`;
}
function basket(x, y) {
  return `<g transform="translate(${x} ${y})">
    <path d="M-20 -14 q-4 -22 8 -28 M-6 -14 q2 -26 12 -26 M8 -14 q8 -20 18 -18" fill="none" stroke="#2c9654" stroke-width="5" stroke-linecap="round"/>
    <path d="M-12 -40 q-10 -4 -6 -10 q8 2 6 10z M6 -40 q-2 -10 6 -10 q4 6 -6 10z" fill="#3dbb6b" ${S} stroke-width="2"/>
    <path d="M14 -18 q12 -14 18 -8" fill="none" stroke="#e1484b" stroke-width="6" stroke-linecap="round"/>
    <ellipse cx="-14" cy="-16" rx="9" ry="6" fill="#7b61ff" ${S} stroke-width="2"/>
    <path d="M-30 -14 h60 l-8 30 h-44z" fill="#e0a060" ${S}/><path d="M-26 -2 h52 M-24 8 h48" stroke="${INK}" stroke-width="2" opacity=".5"/>
    <path d="M-22 -14 q22 -34 44 0" fill="none" ${S}/></g>`;
}
function plateRice(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="6" rx="34" ry="9" fill="#fff" ${S}/>
    <path d="M-20 4 q0 -18 20 -18 q20 0 20 18z" fill="#fffdf4" ${S} stroke-width="2.4"/>
    <path d="M2 -2 l20 -6 q6 4 2 10 l-20 4z" fill="#f6d28b" ${S} stroke-width="2"/><path d="M-26 0 l8 -6 l4 6z" fill="#3dbb6b" ${S} stroke-width="1.6"/></g>`;
}
function stickerSheet(x, y, rot = 0) {
  const st = [['#ff6b5b', '★'], ['#4aa8ff', '♥'], ['#3dbb6b', '★'], ['#ffc94a', '●']];
  return `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="-22" y="-16" width="44" height="32" rx="5" fill="#fff" ${S} stroke-width="2.4"/>
    ${st.map(([c, t], i) => `<circle cx="${-11 + (i % 2) * 22}" cy="${-7 + Math.floor(i / 2) * 14}" r="6" fill="${c}"/>`).join('')}</g>`;
}
function dispenser(x, y, label, level = .6, color = '#e8c77a') {
  const c = nid('dp');
  return `<g transform="translate(${x} ${y})"><defs><clipPath id="${c}"><rect x="-30" y="-48" width="60" height="78" rx="10"/></clipPath></defs>
    <rect x="-30" y="-48" width="60" height="78" rx="10" fill="#f4fbff"/>
    <rect x="-32" y="${r1(30 - 78 * level)}" width="64" height="${r1(78 * level)}" fill="${color}" clip-path="url(#${c})"/>
    <rect x="-30" y="-48" width="60" height="78" rx="10" fill="none" ${S}/>
    <rect x="-34" y="-58" width="68" height="12" rx="5" fill="#cfd8e6" ${S} stroke-width="2.4"/>
    <path d="M30 18 h10 v10" fill="none" ${S}/><rect x="34" y="26" width="12" height="6" rx="2" fill="${CORAL}" ${S} stroke-width="2"/>
    <rect x="-34" y="30" width="68" height="10" rx="4" fill="#9aa6bd" ${S} stroke-width="2.4"/>
    ${tx(0, -18, label, { size: 22, b: true })}</g>`;
}
function tank(x, y, label, fish = 3) {
  let f = '';
  for (let i = 0; i < fish; i++) {
    const fx = r1(-24 + i * 48 / Math.max(1, fish - 1)), fy = 4 + (i % 2) * 12, c = ['#ff6b5b', '#ffc94a', '#7b61ff', '#4aa8ff'][i % 4];
    f += `<g transform="translate(${fx} ${fy})"><path d="M-8 0 q8 -8 16 0 q-8 8 -16 0z" fill="${c}" stroke="${INK}" stroke-width="1.6"/><path d="M8 0 l7 -5 v10z" fill="${c}" stroke="${INK}" stroke-width="1.6"/></g>`;
  }
  return `<g transform="translate(${x} ${y})"><rect x="-42" y="-28" width="84" height="58" rx="6" fill="#bfe6ff" ${S}/>
    <rect x="-42" y="-28" width="84" height="10" fill="#fff" opacity=".7"/>
    <path d="M-36 30 q6 -14 2 -22 M32 30 q-6 -12 0 -20" fill="none" stroke="#3dbb6b" stroke-width="4" stroke-linecap="round"/>${f}
    <rect x="-46" y="30" width="92" height="9" rx="3" fill="#c98b55" ${S} stroke-width="2.4"/>
    ${tx(0, 58, label, { size: 16, b: true })}</g>`;
}

/* ---------- explore pictures ---------- */
const stickerSwap = () => {
  const W = 340, H = 192;
  const g = person(56, 92, { key: 'weiming', name: 'Wei Ming', above: true }) + person(284, 92, { key: 'chloe', name: 'Chloe', above: true }) +
    curveArrow({ x: 100, y: 82 }, { x: 240, y: 82 }, 34, { label: '① doubles Chloe\'s', col: TEAL, r: 4, lout: 13 }) +
    curveArrow({ x: 240, y: 122 }, { x: 100, y: 122 }, 30, { label: '② doubles Wei Ming\'s', col: '#7b61ff', r: 4, lout: 13 }) +
    tx(W / 2, 184, '40 stickers altogether · end: the same number each', { size: 13, fill: '#56627a' });
  return svg(`0 0 ${W} ${H}`, panel(W, H, g, '#fffaf0'), 'Wei Ming gives Chloe stickers, then Chloe gives Wei Ming stickers', 'style="max-width:400px"');
};
const swapRows = (s, m) => [
  { label: 'Start', cells: s },
  { step: '① Wei Ming doubles Chloe\'s' },
  { label: 'Middle', cells: m },
  { step: '② Chloe doubles Wei Ming\'s' },
  { label: 'End', cells: [cv(20, '40 ÷ 2'), cv(20, '40 ÷ 2')] },
];

/* ===================== Topic 20 ===================== */
const t20 = {
  id: 't20',
  title: 'Working Backwards with Many Quantities',
  intro: 'You know how the story <i>ends</i>, but not how it began. Rewind it! Start at the end and undo every step, one by one, until you are back at the start.',
  skills: ['Working backwards', 'Inverse operations', 'Reverse tables'],
  art: () => svg('0 0 360 220', panel(360, 220, `
    ${A.cloud(250, 4, .55)}
    ${[[12, 'start'], [134, 'at the market'], [256, 'end']].map(([x, c]) => `<rect x="${x}" y="14" width="92" height="110" rx="14" fill="#fff" ${S}/>` + tx(x + 46, 116, c, { size: 13, fill: '#56627a' })).join('')}
    ${purse(58, 76, 1)}${tx(58, 44, '?', { size: 34, fill: CORAL_D, b: true })}
    ${basket(180, 88)}
    ${purse(290, 78, .8, '#7b61ff')}${coin(324, 62)}${coin(326, 84)}${tx(296, 50, '$9', { size: 24, b: true })}
    ${arrowH(108, 130, 69, TEAL, 4)}${arrowH(230, 252, 69, TEAL, 4)}
    ${pill(122, 140, 'spend half', { fill: TEAL_L, color: TEAL_D, stroke: TEAL, size: 13 })}${pill(238, 140, 'spend $5', { fill: TEAL_L, color: TEAL_D, stroke: TEAL, size: 13 })}
    <path d="M302 160 q0 36 -40 36 H98 q-40 0 -40 -36" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/>
    <path d="M302 160 q0 36 -40 36 H98 q-40 0 -40 -36" fill="none" stroke="${CORAL}" stroke-width="5" stroke-linecap="round"/>
    <path d="M58 146 l-9 15 h18z" fill="${CORAL}" ${S} stroke-width="2.2"/>
    ${pill(180, 196, 'undo: + $5, then × 2 = $28', { fill: '#fff', color: CORAL_D, stroke: CORAL, size: 15 })}`, '#e9f8f1'),
  'A story in three pictures: a purse with an unknown amount, a market basket bought with half the money, and 9 dollars left; a rewind arrow goes back from the end to the start'),
  explore: {
    setup: 'Saturday lunch at the hawker centre below Arjun\'s HDB block. Arjun is counting the coins in his wallet, while Wei Ming and Chloe swap National Day stickers at the next table.',
    art: () => svg('0 0 340 300', panel(340, 300, `
      <rect width="340" height="22" fill="#cfd8e6"/>${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<path d="M${i * 44 + 10} 0 v22" stroke="#b3bfd2" stroke-width="3"/>`).join('')}
      <g transform="translate(110 30)"><path d="M0 0 v8" ${S} stroke-width="2"/><circle cy="10" r="4" fill="${INK}"/><path d="M-22 10 h44" stroke="${INK}" stroke-width="3" stroke-linecap="round"/></g>
      <rect x="12" y="48" width="152" height="30" rx="6" fill="#e1484b" ${S}/>${tx(88, 69, 'CHICKEN RICE', { size: 15, fill: '#fff', b: true })}
      <rect x="176" y="48" width="152" height="30" rx="6" fill="#3dbb6b" ${S}/>${tx(252, 69, 'SUGAR CANE', { size: 15, fill: '#fff', b: true })}
      <rect x="12" y="78" width="152" height="62" fill="#fff6e4" ${S}/><rect x="176" y="78" width="152" height="62" fill="#effbf2" ${S}/>
      <rect x="24" y="88" width="84" height="30" rx="4" fill="#dff1ff" ${S} stroke-width="2.4"/>
      <g transform="translate(40 88)"><path d="M0 0 v8" stroke="${INK}" stroke-width="2"/><path d="M-8 8 q8 22 16 0z" fill="#f6c779" ${S} stroke-width="2"/></g>
      <g transform="translate(70 88)"><path d="M0 0 v8" stroke="${INK}" stroke-width="2"/><path d="M-8 8 q8 22 16 0z" fill="#f6c779" ${S} stroke-width="2"/></g>
      ${tx(136, 108, '$6', { size: 16, fill: CORAL_D, b: true })}
      ${[200, 210, 220].map((x, i) => `<path d="M${x} 136 l${8 - i * 2} -48" stroke="#5aa95a" stroke-width="6" stroke-linecap="round"/><path d="M${x} 136 l${8 - i * 2} -48" stroke="#9edc8c" stroke-width="3" stroke-linecap="round" stroke-dasharray="10 6"/>`).join('')}
      <rect x="244" y="94" width="40" height="30" rx="6" fill="#c9cfdc" ${S} stroke-width="2.4"/>${tx(300, 114, '$2', { size: 16, fill: CORAL_D, b: true })}
      <rect y="140" width="340" height="160" fill="#f1ece2"/>${[0, 1, 2, 3, 4, 5, 6].map(i => `<path d="M${i * 56} 140 v160" stroke="#e2dccf" stroke-width="2"/>`).join('')}
      ${kid('arjun', { x: 70, y: 166, s: .74, pose: 'think', mood: 'think' })}
      ${kid('weiming', { x: 196, y: 170, s: .7, pose: 'wave' })}
      ${kid('chloe', { x: 280, y: 170, s: .7, flip: true })}
      ${A.table(16, 250, 308)}
      ${plateRice(56, 244, .8)}${A.cup(96, 214, .7, { w: 26, h: 34, color: '#b9e28c' })}${purse(132, 238, .55)}${coin(152, 222, 7)}
      ${stickerSheet(214, 240, -8)}${stickerSheet(266, 240, 6)}`, '#fff7ec'),
      'Arjun at a hawker centre table with a plate of chicken rice, sugar cane juice and his wallet; Wei Ming and Chloe swap sticker sheets'),
    steps: [
      { who: 'arjun', mood: 'think', text: 'I came with some money. I spent <b>half</b> of it on a chicken rice set, then <b>$2</b> on sugar cane juice. Now I have <b>$4</b> left. How much did I bring? I forgot!',
        art: () => flowDiag({ fwd: { nodes: ['?', '', '$4'], ops: ['spend half', '− $2'] }, caps: ['What happened to Arjun\'s money'], label: 'Start unknown, spend half, then take away 2 dollars, leaves 4 dollars' }) },
      { who: 'leo', mood: 'teach', text: 'Chloe tried guessing $10: half is $5, and $5 − $2 = $3. Not $4! Guessing could take ages. Instead, <b>work backwards</b>. Start from the <b>end</b>, $4, and undo each step in <b>reverse order</b>. The last thing Arjun did was pay $2, so undo that <b>first</b> by adding $2 back. Spending half is undone by <b>doubling</b>.',
        art: () => flowDiag({ fwd: { nodes: ['?', '', '$4'], ops: ['spend half', '− $2'] }, back: { nodes: ['$12', '$6', '$4'], ops: ['× 2', '+ $2'], hi: [0] }, label: 'Forwards: spend half then take away 2 dollars. Backwards: add 2 dollars then multiply by 2, giving 12 dollars' }) },
      { who: 'arjun', text: '$4 + $2 = $6, and $6 × 2 = <b>$12</b>. Check forwards: half of $12 is $6, and $6 − $2 = $4 ✓. I brought $12!' },
      { who: 'weiming', mood: 'think', text: 'Now our puzzle! Chloe and I have <b>40</b> stickers altogether. ① I gave Chloe as many stickers as she had, so hers <b>doubled</b>. ② Then she gave me as many as I had, so mine doubled. Now we have the <b>same</b> number. How many did each of us have at the start?',
        art: stickerSwap },
      { who: 'leo', mood: 'teach', text: 'With two or more people, use a <b>reverse table</b>. Stickers only move between you, so the total is always <b>40</b>: whatever one person gains, the other loses. Fill the table from the <b>bottom</b>. At the end you have the same number, so each has 40 ÷ 2 = <b>20</b>.',
        art: () => revTable(['Wei Ming', 'Chloe'], swapRows([null, null], [null, null]), { hi: 4 }) },
      { who: 'aisyah', text: 'Now go up one row and undo ②. Wei Ming\'s stickers were <b>doubled</b> to 20, so before that he had 20 ÷ 2 = <b>10</b>. Chloe gave him those 10 stickers, so she had 20 + 10 = <b>30</b>.',
        art: () => revTable(['Wei Ming', 'Chloe'], swapRows([null, null], [cv(10, '20 ÷ 2'), cv(30, '20 + 10')]), { hi: 2 }) },
      { who: 'chloe', text: 'Last, undo ①. My stickers were doubled to 30, so I started with 30 ÷ 2 = <b>15</b>. Wei Ming gave me those 15, so he started with 10 + 15 = <b>25</b>. Check forwards: Wei Ming gives me 15, so we have 10 and 30. I give him 10, so we have 20 and 20 ✓ Shiok!',
        art: () => revTable(['Wei Ming', 'Chloe'], swapRows([cv(25, '10 + 15'), cv(15, '30 ÷ 2')], [cv(10, '20 ÷ 2'), cv(30, '20 + 10')]), { hi: 0 }) },
    ],
  },
  keys: [
    { title: 'Start at the end', text: 'Begin with the number you <b>do</b> know: the final result. List the steps that happened, in order.' },
    { title: 'Undo with the opposite', text: '+ is undone by −, and × is undone by ÷. "Spent half" is undone by <b>doubling</b>. "Gave away 5" is undone by getting the 5 back.' },
    { title: 'Last step first', text: 'Undo the steps in <b>reverse order</b>: the last thing that happened is the first thing you undo. It is like rewinding a video!' },
    { title: 'Many people? Reverse table', text: 'When things are passed around, the <b>total stays the same</b>: whatever one gains, another loses. Fill a table from the bottom row up, then <b>check forwards</b>.' },
  ],
  practice: [
    { id: 'a', level: 1, type: 'blanks', prompt: 'Mdm Rahimah went to Tekka Market. She spent <b>half</b> of her money on fish and vegetables. Then she spent <b>$6</b> on flowers. She had <b>$15</b> left. How much money did she have at first?',
      art: flowDiag({ fwd: { nodes: ['?', '', '$15'], ops: ['spend half', '− $6'] }, caps: ['What happened to Mdm Rahimah\'s money'], label: 'Start unknown, spend half, take away 6 dollars, leaves 15 dollars' }),
      template: 'She had ${0} at first.', blanks: [{ answer: 42 }],
      hint: 'Start from the $15 at the end. Undo the <b>last</b> step first: she spent $6 on flowers, so add it back.',
      solution: ['Undo the flowers: $15 + $6 = $21. This is what she had after the fish and vegetables.', 'Undo "spent half": $21 is the half that was left, so double it: $21 × 2 = $42.', 'Check forwards: half of $42 is $21, and $21 − $6 = $15 ✓', 'She had <b>$42</b> at first.'] },
    { id: 'b', level: 1, type: 'blanks', prompt: 'At the Science Centre, Priya tries a number machine. She puts in a number. The machine <b>multiplies it by 3</b>, then <b>subtracts 7</b>, then <b>divides by 4</b>. The number that comes out is <b>5</b>. What number did Priya put in?',
      art: flowDiag({ fwd: { nodes: ['?', '', '', '5'], ops: ['× 3', '− 7', '÷ 4'] }, caps: ['The number machine'], label: 'Number machine: times 3, minus 7, divide by 4, gives 5' }),
      template: 'Priya put in {0}.', blanks: [{ answer: 9 }],
      hint: 'Start with 5 and undo the steps from last to first. The last step was ÷ 4, so undo it with × 4.',
      solution: ['Undo ÷ 4: 5 × 4 = 20', 'Undo − 7: 20 + 7 = 27', 'Undo × 3: 27 ÷ 3 = 9', 'Check forwards: 9 × 3 = 27, 27 − 7 = 20, 20 ÷ 4 = 5 ✓', 'Priya put in <b>9</b>.'] },
    { id: 'c', level: 1, type: 'mcq', prompt: 'For the class party, Mrs Pillai put some curry puffs on a tray. Then she added <b>8 more</b>. The class ate <b>half</b> of the curry puffs on the tray, and <b>14</b> were left. Which working finds how many curry puffs were on the tray at first?',
      art: flowDiag({ fwd: { nodes: ['?', '', '14'], ops: ['+ 8', 'eat half'] }, caps: ['What happened to the curry puffs'], label: 'Start unknown, add 8, half eaten, leaves 14' }),
      options: ['14 × 2 − 8 = 20', '14 ÷ 2 + 8 = 15', '(14 − 8) × 2 = 12', '14 × 2 + 8 = 36'], answer: 0,
      hint: 'The last step was "eat half". Undo that first. Then undo "added 8".',
      solution: ['Undo the last step first. Half were eaten and 14 were left, so before eating there were 14 × 2 = 28.', 'Then undo "added 8": 28 − 8 = 20.', 'So the working is <b>14 × 2 − 8 = 20</b>. Check: 20 + 8 = 28, half of 28 is 14 ✓', '14 ÷ 2 + 8 repeats the steps instead of undoing them. (14 − 8) × 2 undoes them in the wrong order. 14 × 2 + 8 forgets that "added 8" is undone by taking away 8.'] },
    { id: 'd', level: 2, type: 'blanks', prompt: 'Siti borrows a storybook from her neighbourhood library. On Monday she reads <b>half</b> of the pages, and then <b>10 more</b> pages. On Tuesday she reads <b>half</b> of the pages that are left, and then <b>5 more</b> pages. Now she has <b>20</b> pages left to read. How many pages does the book have?',
      art: flowTwoRows({ nodes: ['?', '', ''], ops: ['read half', 'read 10'] }, { nodes: ['', '', '20'], ops: ['read half', 'read 5'] }, ['Monday: pages not read yet', 'Tuesday: pages not read yet'], 'Monday: read half then 10 more. Tuesday: read half of the rest then 5 more, leaving 20 pages'),
      template: '{0} pages', blanks: [{ answer: 120 }],
      hint: 'Undo Tuesday first. Before she read the extra 5 pages, she had 20 + 5 pages left. That was the half she had <b>not</b> read on Tuesday.',
      solution: ['Undo "read 5 more": 20 + 5 = 25 pages.', 'Undo "read half": 25 is half of what was left on Tuesday morning, so 25 × 2 = 50 pages.', 'Undo Monday\'s "10 more": 50 + 10 = 60 pages.', 'Undo Monday\'s "half": 60 × 2 = 120 pages.', 'Check forwards: Monday she reads 60 + 10 = 70, leaving 50. Tuesday she reads 25 + 5 = 30, leaving 20 ✓', 'The book has <b>120</b> pages.'] },
    { id: 'e', level: 2, type: 'blanks', prompt: 'At the void deck, Daniel, Farah and Wen Hui have <b>75</b> scented erasers altogether. First, Daniel gives Farah <b>6</b> erasers. Next, Farah gives Wen Hui <b>9</b> erasers. Then Wen Hui gives Daniel <b>4</b> erasers. Now all three have the <b>same</b> number of erasers. How many did each of them have at first?',
      art: svg('0 0 340 240', panel(340, 240,
        person(170, 44, { name: 'Daniel', color: '#4aa8ff' }) + person(276, 168, { name: 'Farah', color: '#ff6b5b' }) + person(64, 168, { name: 'Wen Hui', color: '#3dbb6b' }) +
        curveArrow({ x: 170, y: 44 }, { x: 276, y: 168 }, 22, { label: '① 6', lsize: 14 }) +
        curveArrow({ x: 276, y: 168 }, { x: 64, y: 168 }, -18, { label: '② 9', lsize: 14, col: '#7b61ff' }) +
        curveArrow({ x: 64, y: 168 }, { x: 170, y: 44 }, 22, { label: '③ 4', lsize: 14, col: TEAL }), '#fffaf0'),
        'Daniel gives Farah 6, Farah gives Wen Hui 9, Wen Hui gives Daniel 4', 'style="max-width:380px"'),
      template: 'Daniel: {0} &nbsp;&nbsp; Farah: {1} &nbsp;&nbsp; Wen Hui: {2}', blanks: [{ answer: 27 }, { answer: 28 }, { answer: 20 }],
      hint: 'At the end, each has 75 ÷ 3 = 25. Undo the <b>last</b> move first: Wen Hui gave Daniel 4, so take 4 back from Daniel and give it back to Wen Hui.',
      solution: ['At the end each has 75 ÷ 3 = 25.', 'Undo ③ (Wen Hui → Daniel 4): Daniel 25 − 4 = 21, Wen Hui 25 + 4 = 29.', 'Undo ② (Farah → Wen Hui 9): Farah 25 + 9 = 34, Wen Hui 29 − 9 = 20.', 'Undo ① (Daniel → Farah 6): Daniel 21 + 6 = 27, Farah 34 − 6 = 28.',
        revTable(['Daniel', 'Farah', 'Wen Hui'], [{ label: 'Start', cells: [27, 28, 20].map(v => cv(v)) }, { step: '① Daniel gives Farah 6' }, { label: 'After ①', cells: [21, 34, 20].map(v => cv(v)) }, { step: '② Farah gives Wen Hui 9' }, { label: 'After ②', cells: [21, 25, 29].map(v => cv(v)) }, { step: '③ Wen Hui gives Daniel 4' }, { label: 'End', cells: [25, 25, 25].map(v => cv(v)) }], { hi: 0 }),
        'Check: 27 + 28 + 20 = 75 ✓', 'At first: Daniel <b>27</b>, Farah <b>28</b>, Wen Hui <b>20</b>.'] },
    { id: 'f', level: 2, type: 'blanks', prompt: 'Auntie Lily\'s drinks stall has two dispensers of barley water, A and B, with <b>30 L</b> altogether. She pours <b>half</b> of the barley water in A into B. Then she pours <b>4 L</b> from B back into A. Now both dispensers hold the same amount. How much barley water was in each dispenser at first?',
      art: svg('0 0 340 214', panel(340, 214,
        dispenser(84, 132, 'A', .5) + dispenser(256, 132, 'B', .5) +
        curveArrow({ x: 100, y: 66 }, { x: 240, y: 66 }, 30, { label: '① half of A', r: 2, col: '#7b61ff', lout: 13 }) +
        curveArrow({ x: 222, y: 112 }, { x: 118, y: 112 }, -0.01, { label: '② 4 L', r: 2, col: TEAL }) +
        tx(170, 204, '30 L altogether · end: the same amount in each', { size: 13, fill: '#56627a' }), '#f6fbff'),
        'Two barley water dispensers: half of A is poured into B, then 4 litres from B back into A', 'style="max-width:380px"'),
      template: 'A: {0} L &nbsp;&nbsp; B: {1} L', blanks: [{ answer: 22 }, { answer: 8 }],
      hint: 'At the end each dispenser has 15 L. Undo the 4 L pour first. Then remember: after pouring out half, A kept the <b>other half</b>.',
      solution: ['At the end each has 30 ÷ 2 = 15 L.', 'Undo ② (4 L from B to A): A had 15 − 4 = 11 L, B had 15 + 4 = 19 L.', 'Undo ①: after pouring out half, A kept the other half, 11 L. So A had 11 × 2 = 22 L, and it poured 11 L into B.', 'B had 19 − 11 = 8 L before that.',
        revTable(['A', 'B'], [{ label: 'Start', cells: [cv('22 L', '11 × 2'), cv('8 L', '19 − 11')] }, { step: '① half of A into B' }, { label: 'After ①', cells: [cv('11 L', '15 − 4'), cv('19 L', '15 + 4')] }, { step: '② 4 L from B into A' }, { label: 'End', cells: [cv('15 L'), cv('15 L')] }], { hi: 0 }),
        'Check forwards: half of 22 L is 11 L, so A has 11 L and B has 8 + 11 = 19 L. Then A has 11 + 4 = 15 L and B has 19 − 4 = 15 L ✓', 'At first: A had <b>22 L</b> and B had <b>8 L</b>.'] },
    { id: 'g', level: 2, type: 'blanks', prompt: 'For Racial Harmony Day, Mei Ling and Kumar have <b>48</b> ice-cream sticks altogether to build a model kampung house. First, Mei Ling gives Kumar as many sticks as Kumar has. Then Kumar gives Mei Ling as many sticks as Mei Ling has. Now Kumar has <b>8 more</b> sticks than Mei Ling. How many sticks did each of them have at first?',
      art: svg('0 0 340 176', panel(340, 176,
        person(56, 84, { name: 'Mei Ling', color: '#ff6b5b' }) + person(284, 84, { name: 'Kumar', color: '#4aa8ff' }) +
        curveArrow({ x: 90, y: 72 }, { x: 250, y: 72 }, 30, { label: '① doubles Kumar\'s', col: TEAL, r: 4, lout: 13 }) +
        curveArrow({ x: 250, y: 98 }, { x: 90, y: 98 }, 30, { label: '② doubles Mei Ling\'s', col: '#7b61ff', r: 4, lout: 13 }) +
        tx(170, 166, '48 sticks · end: Kumar has 8 more', { size: 13, fill: '#56627a' }), '#fffaf0'),
        'Mei Ling doubles Kumar\'s sticks, then Kumar doubles Mei Ling\'s sticks', 'style="max-width:380px"'),
      template: 'Mei Ling: {0} &nbsp;&nbsp; Kumar: {1}', blanks: [{ answer: 29 }, { answer: 19 }],
      hint: 'First find the end amounts: two numbers that add up to 48 and differ by 8. Then undo ② first. A number that was doubled was half as big before.',
      solution: ['The total stays 48. At the end, Mei Ling has (48 − 8) ÷ 2 = 20 and Kumar has 20 + 8 = 28.', 'Undo ②: Mei Ling\'s sticks were doubled to 20, so she had 10. Kumar gave her 10, so he had 28 + 10 = 38.', 'Undo ①: Kumar\'s sticks were doubled to 38, so he had 19. Mei Ling gave him 19, so she had 10 + 19 = 29.',
        revTable(['Mei Ling', 'Kumar'], [{ label: 'Start', cells: [cv(29, '10 + 19'), cv(19, '38 ÷ 2')] }, { step: '① Mei Ling doubles Kumar\'s' }, { label: 'Middle', cells: [cv(10, '20 ÷ 2'), cv(38, '28 + 10')] }, { step: '② Kumar doubles Mei Ling\'s' }, { label: 'End', cells: [cv(20, '40 ÷ 2'), cv(28, '20 + 8')] }], { hi: 0 }),
        'Check forwards: Mei Ling gives 19, leaving 10, and Kumar has 38. Kumar gives 10, leaving 28, and Mei Ling has 20. 28 − 20 = 8 ✓', 'At first: Mei Ling <b>29</b>, Kumar <b>19</b>.'] },
    { id: 'h', level: 3, type: 'blanks', prompt: 'At the community centre\'s games day, Hafiz, Jun Jie and Ravi play a game with <b>72</b> tokens altogether. In each round, the loser must give each of the other two players <b>as many tokens as that player already has</b>. Hafiz loses Round 1, Jun Jie loses Round 2 and Ravi loses Round 3. After the three rounds, all three boys have the <b>same</b> number of tokens. How many tokens did each boy have at the start?',
      art: svg('0 0 340 226', panel(340, 226,
        person(170, 40, { name: 'Hafiz', color: '#7b61ff' }) + person(56, 146, { name: 'Jun Jie', color: '#ffc94a' }) + person(284, 146, { name: 'Ravi', color: '#3dbb6b' }) +
        curveArrow({ x: 170, y: 40 }, { x: 56, y: 146 }, -18, { label: 'doubles', lsize: 13, col: CORAL, lout: 16 }) +
        curveArrow({ x: 170, y: 40 }, { x: 284, y: 146 }, 18, { label: 'doubles', lsize: 13, col: CORAL, lout: 16 }) +
        tx(170, 216, 'Round 1: Hafiz loses. Then Jun Jie, then Ravi.', { size: 13, fill: '#56627a' }), '#fffaf0'),
        'In Round 1 Hafiz loses and doubles the tokens of Jun Jie and Ravi', 'style="max-width:380px"'),
      template: 'Hafiz: {0} &nbsp;&nbsp; Jun Jie: {1} &nbsp;&nbsp; Ravi: {2}', blanks: [{ answer: 39 }, { answer: 21 }, { answer: 12 }],
      hint: 'At the end each boy has 72 ÷ 3 = 24. In Round 3, Ravi doubled Hafiz\'s and Jun Jie\'s tokens, so before Round 3 they had half as many. Ravi had all the rest.',
      solution: ['At the end each has 72 ÷ 3 = 24.', 'Undo Round 3 (Ravi doubled the other two): Hafiz 24 ÷ 2 = 12, Jun Jie 24 ÷ 2 = 12, Ravi 24 + 12 + 12 = 48.', 'Undo Round 2 (Jun Jie doubled the other two): Hafiz 12 ÷ 2 = 6, Ravi 48 ÷ 2 = 24, Jun Jie 12 + 6 + 24 = 42.', 'Undo Round 1 (Hafiz doubled the other two): Jun Jie 42 ÷ 2 = 21, Ravi 24 ÷ 2 = 12, Hafiz 6 + 21 + 12 = 39.',
        revTable(['Hafiz', 'Jun Jie', 'Ravi'], [{ label: 'Start', cells: [cv(39, '6 + 21 + 12'), cv(21, '42 ÷ 2'), cv(12, '24 ÷ 2')] }, { step: 'Round 1: Hafiz loses' }, { label: 'After R1', cells: [cv(6, '12 ÷ 2'), cv(42, '12 + 6 + 24'), cv(24, '48 ÷ 2')] }, { step: 'Round 2: Jun Jie loses' }, { label: 'After R2', cells: [cv(12, '24 ÷ 2'), cv(12, '24 ÷ 2'), cv(48, '24 + 12 + 12')] }, { step: 'Round 3: Ravi loses' }, { label: 'End', cells: [cv(24), cv(24), cv(24)] }], { hi: 0 }),
        'Check: 39 + 21 + 12 = 72 ✓. In Round 1 Hafiz gives 21 and 12, leaving 39 − 33 = 6 ✓', 'At the start: Hafiz <b>39</b>, Jun Jie <b>21</b>, Ravi <b>12</b>.'] },
    { id: 'i', level: 3, type: 'blanks', prompt: 'Uncle Lim\'s aquarium shop in Clementi has three tanks, A, B and C, with <b>180</b> guppies altogether. First, he moves <b>12</b> guppies from Tank A to Tank B. Next, he moves <b>half</b> of the guppies in Tank B to Tank C. Then he moves <b>a third</b> of the guppies in Tank C to Tank A. Now Tank A has <b>twice</b> as many guppies as Tank B, and Tank C has <b>three times</b> as many as Tank B. How many guppies were in each tank at first?',
      art: svg('0 0 420 256', panel(420, 256,
        tank(70, 100, 'Tank A', 2) + tank(210, 100, 'Tank B', 3) + tank(350, 100, 'Tank C', 4) +
        curveArrow({ x: 96, y: 66 }, { x: 184, y: 66 }, 26, { label: '① 12', r: 2, lout: 14, lsize: 15 }) +
        curveArrow({ x: 236, y: 66 }, { x: 324, y: 66 }, 26, { label: '② half of B', r: 2, col: '#7b61ff', lout: 14, lsize: 15 }) +
        curveArrow({ x: 336, y: 176 }, { x: 84, y: 176 }, 34, { label: '③ a third of C', r: 2, col: TEAL, lsize: 15 }) +
        tx(210, 246, '180 guppies · end: A = 2 × B, C = 3 × B', { size: 15, fill: '#56627a' }), '#f3faff'),
        'Three fish tanks: 12 guppies from A to B, half of B to C, a third of C to A', 'style="max-width:460px"'),
      template: 'Tank A: {0} &nbsp;&nbsp; Tank B: {1} &nbsp;&nbsp; Tank C: {2}', blanks: [{ answer: 27 }, { answer: 48 }, { answer: 105 }],
      hint: 'At the end, let Tank B be 1 unit. Then A is 2 units and C is 3 units, so 6 units = 180. Then undo the <b>last</b> move first: after giving away a third, Tank C kept two thirds.',
      solution: ['End: B = 1 unit, A = 2 units, C = 3 units. 6 units = 180, so 1 unit = 30.', 'So at the end A = 60, B = 30, C = 90.', 'Undo ③: Tank C kept [[f:2/3]] of its guppies, and that was 90. So [[f:1/3]] was 45, and C had 90 + 45 = 135. Those 45 went to A, so A had 60 − 45 = 15.', 'Undo ②: Tank B kept half, which was 30. So B had 60, and 30 went to C. C had 135 − 30 = 105.', 'Undo ①: A gave away 12, so A had 15 + 12 = 27. B had 60 − 12 = 48.',
        revTable(['A', 'B', 'C'], [{ label: 'Start', cells: [cv(27, '15 + 12'), cv(48, '60 − 12'), cv(105)] }, { step: '① 12 from A to B' }, { label: 'After ①', cells: [cv(15), cv(60, '30 × 2'), cv(105, '135 − 30')] }, { step: '② half of B to C' }, { label: 'After ②', cells: [cv(15, '60 − 45'), cv(30), cv(135, '90 + 45')] }, { step: '③ a third of C to A' }, { label: 'End', cells: [cv(60), cv(30), cv(90)] }], { hi: 0 }),
        'Check: 27 + 48 + 105 = 180 ✓', 'At first: Tank A <b>27</b>, Tank B <b>48</b>, Tank C <b>105</b>.'] },
  ],
  adult: 'Links to school work: <b>working backwards</b> is one of the problem-solving heuristics in the MOE primary mathematics syllabus (with "act it out", "draw a model", "make a list or table", "guess and check" and the "before-after" concept). Undoing a chain of whole-number operations, including "spent half" and "a third of the rest", is <b>within</b> P4 to P5 work, and questions 1 to 4 are at that level. Problems where several people pass amounts to each other, especially "give as many as the other already has" (doubling), are <b>enrichment</b>, closer to P6 challenge and olympiad style. Common mistakes: undoing the steps in the original order instead of the reverse order; repeating an operation instead of using its opposite (halving again instead of doubling); and in transfer problems, changing only one person\'s amount, forgetting that whatever one person gains another person loses. Tips: write each step on a separate line and draw an arrow back up the page; in a reverse table, check that every row adds up to the same total; and always finish by checking forwards from the start values you found.',
};

export default { t20 };
