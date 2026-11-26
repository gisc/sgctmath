// Unit 4b · Logical Thinking (t12, t13, S1) — original content, Singapore context.
import * as A from '../art.js';
const { svg, kid, leo } = A;

/* =====================================================================
   Digit-puzzle layouts (SVG)
   Pattern characters:  0–9 given digit · a–z empty box (each box may hold any digit)
                        A–Z letter tile (same letter = same digit, different letters = different digits)
                        ' ' empty column
   ===================================================================== */
const CW = 36, CH = 44, PAD = 10;
const NUM = 'font-family="Nunito, sans-serif" font-weight="800"';
const HEAD = 'font-family="Baloo 2, sans-serif" font-weight="800"';
const LCOL = { A: '#ff6b5b', B: '#0f9d94', C: '#7b61ff', D: '#f2a516', E: '#4aa8ff', F: '#3dbb6b' };
const lv = s => `<i>${s}</i>`;                       // italic box label in text

function cell(ch, cx, cy, o = {}) {
  const ink = o.ink || A.ink, fill = o.fill || {};
  if (ch === ' ') return '';
  if (ch === '□') return `<rect x="${cx - 15}" y="${cy - 19}" width="30" height="38" rx="7" fill="${o.boxFill || '#fff4d1'}" stroke="#f2a516" stroke-width="2.5" stroke-dasharray="5 3"/>`;
  if ((o.plain || '').includes(ch)) return `<text x="${cx}" y="${cy + 9}" text-anchor="middle" ${NUM} font-size="24" fill="${ink}">${ch}</text>`;
  if (/[0-9]/.test(ch)) return `<text x="${cx}" y="${cy + 10}" text-anchor="middle" ${NUM} font-size="28" fill="${ink}">${ch}</text>`;
  if (/[a-z]/.test(ch)) {
    const v = fill[ch];
    if (v != null) return `<rect x="${cx - 15}" y="${cy - 19}" width="30" height="38" rx="7" fill="#e1f7e8" stroke="#3dbb6b" stroke-width="2.5"/>
      <text x="${cx}" y="${cy + 10}" text-anchor="middle" ${NUM} font-size="27" fill="#0b7a73">${v}</text>`;
    return `<rect x="${cx - 15}" y="${cy - 19}" width="30" height="38" rx="7" fill="${o.boxFill || '#fff4d1'}" stroke="#f2a516" stroke-width="2.5" stroke-dasharray="5 3"/>
      <text x="${cx}" y="${cy + 7}" text-anchor="middle" font-family="Nunito, sans-serif" font-style="italic" font-weight="800" font-size="19" fill="#7b61ff">${ch}</text>`;
  }
  if (/[A-Z]/.test(ch)) {
    const c = LCOL[ch] || '#7b61ff', v = fill[ch];
    const tile = `<rect x="${cx - 15}" y="${cy - 19}" width="30" height="38" rx="9" fill="${c}" stroke="${A.ink}" stroke-width="2.5"/>`;
    if (v != null) return tile + `<text x="${cx + 1}" y="${cy + 12}" text-anchor="middle" ${NUM} font-size="25" fill="#fff">${v}</text><text x="${cx - 9}" y="${cy - 7}" text-anchor="middle" ${NUM} font-size="10" fill="#fff">${ch}</text>`;
    return tile + `<text x="${cx}" y="${cy + 9}" text-anchor="middle" ${HEAD} font-size="25" fill="#fff">${ch}</text>`;
  }
  return `<text x="${cx}" y="${cy + 9}" text-anchor="middle" ${NUM} font-size="26" fill="${ink}">${ch}</text>`;
}

// Vertical multiplication (Singapore layout: the tens row ends in 0). spec: {a, b, parts?, p}
function mulInner(spec, o = {}) {
  const rows = [spec.a, spec.b, ...(spec.parts || []), spec.p];
  const n = Math.max(...rows.map(r => r.length)) + 1;
  const W = n * CW + PAD * 2, ink = o.ink || A.ink;
  const lineAfter = new Set([1]);
  if (spec.parts && spec.parts.length) lineAfter.add(1 + spec.parts.length);
  let y = PAD, g = '';
  rows.forEach((r, i) => {
    const cy = y + CH / 2;
    [...r].forEach((ch, k) => { const col = n - r.length + k; g += cell(ch, PAD + (col + .5) * CW, cy, o); });
    if (i === 1) g += cell('×', PAD + CW / 2, cy, o);
    y += CH;
    if (lineAfter.has(i)) { g += `<path d="M${PAD} ${y + 4} H${W - PAD}" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`; y += 10; }
  });
  return { w: W, h: y + PAD, g };
}

// Long division (Singapore layout). spec: {d, n, q, rows}. q and rows are aligned to the dividend's columns
// with leading spaces. rows alternate: product, then what is left (with the next digit brought down), …, last remainder.
function divInner(spec, o = {}) {
  const ink = o.ink || A.ink;
  const nd = spec.d.length;
  const bx = PAD + nd * CW + 8;                             // bracket x
  const cols = Math.max(spec.n.length, spec.q.length, ...spec.rows.map(r => r.length));
  const X = j => bx + 10 + (j + .5) * CW;
  const W = bx + 10 + cols * CW + PAD;
  let g = '', y = PAD;
  // quotient
  [...spec.q].forEach((ch, j) => { g += cell(ch, X(j), y + CH / 2, o); });
  y += CH;
  const ly = y + 3;
  g += `<path d="M${bx} ${ly} H${X(spec.n.length - 1) + CW / 2 + 6}" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`;
  g += `<path d="M${bx} ${ly} q10 ${CH * .55} -3 ${CH + 2}" fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`;
  y += 6;
  [...spec.d].forEach((ch, i) => { g += cell(ch, PAD + (i + .5) * CW, y + CH / 2, o); });
  [...spec.n].forEach((ch, j) => { g += cell(ch, X(j), y + CH / 2, o); });
  y += CH;
  const first = s => s.search(/\S/);
  spec.rows.forEach((r, k) => {
    [...r].forEach((ch, j) => { g += cell(ch, X(j), y + CH / 2, o); });
    y += CH;
    if (k % 2 === 0 && k < spec.rows.length - 1) {
      const nx = spec.rows[k + 1];
      const s = Math.min(first(r), first(nx)), e = Math.max(r.length, nx.length) - 1;
      g += `<path d="M${X(s) - CW / 2 - 2} ${y + 4} H${X(e) + CW / 2 + 2}" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`;
      y += 10;
    }
  });
  return { w: W, h: y + PAD, g };
}

// A horizontal equation with letter tiles, e.g. 'AB × 4 = CBA'
function eqInner(eq, o = {}) {
  let x = PAD, g = '';
  for (const ch of eq) {
    if (ch === ' ') { x += 8; continue; }
    const w = (o.plain || '').includes(ch) ? 22 : /[0-9]/.test(ch) ? 20 : /[A-Za-z□]/.test(ch) ? CW : 30;
    g += cell(ch, x + w / 2, PAD + CH / 2, o);
    x += w;
  }
  return { w: x + PAD, h: CH + PAD * 2, g };
}

const wrap = (inner, label) => svg(`0 0 ${inner.w} ${inner.h}`, inner.g, label, `style="max-width:${inner.w}px"`);
const mulArt = (spec, label = 'A multiplication puzzle with missing digits', o) => wrap(mulInner(spec, o), label);
const divArt = (spec, label = 'A long division puzzle with missing digits', o) => wrap(divInner(spec, o), label);
const eqArt = (eq, label = 'A letter puzzle', o) => wrap(eqInner(eq, o), label);
const placed = (inner, x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${inner.g}</g>`;

/* ---------- small scene props ---------- */
function paper(x, y, w, h, rot = 0) {
  return `<g transform="rotate(${rot} ${x + w / 2} ${y + h / 2})"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#fff" stroke="${A.ink}" stroke-width="3"/>
    ${[1, 2, 3, 4, 5, 6, 7, 8].map(i => y + i * h / 9).map(yy => `<path d="M${x + 8} ${yy} H${x + w - 8}" stroke="#d9ecff" stroke-width="2"/>`).join('')}
    <path d="M${x + 22} ${y + 4} V${y + h - 4}" stroke="#ffc2c2" stroke-width="2"/></g>`;
}
function magnifier(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M28 28 l30 30" stroke="${A.ink}" stroke-width="14" stroke-linecap="round"/><path d="M28 28 l30 30" stroke="#c98b55" stroke-width="8" stroke-linecap="round"/>
    <circle r="34" fill="#dff1ff" fill-opacity=".55" stroke="${A.ink}" stroke-width="5"/><circle r="34" fill="none" stroke="#7b61ff" stroke-width="2"/>
    <path d="M-18 -12 q6 -12 18 -14" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/></g>`;
}
const splash = (x, y, s = 1, c = '#a8693d') => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -22 q12 -4 14 8 q14 -6 16 8 q-6 8 4 14 q-4 14 -18 8 q-6 12 -18 4 q-14 6 -16 -8 q-14 -4 -6 -16 q-6 -14 10 -14 q2 -6 14 -4z" fill="${c}" opacity=".55"/>`;
function rain(x0, y0, w, h, n = 18) {
  let g = '';
  for (let i = 0; i < n; i++) { const x = x0 + (i * 37) % w, y = y0 + (i * 53) % h; g += `<path d="M${x} ${y} l-5 13" stroke="#7fb8ea" stroke-width="2.5" stroke-linecap="round"/>`; }
  return g;
}
function card(x, y, n, c = '#ff6b5b', s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><rect width="52" height="72" rx="8" fill="#fff" stroke="${A.ink}" stroke-width="3"/>
    <rect x="6" y="6" width="40" height="60" rx="5" fill="${c}" opacity=".14"/>
    <text x="26" y="47" text-anchor="middle" ${HEAD} font-size="28" fill="${c}">${n}</text></g>`;
}

/* ---------- horse (side view, facing right) ---------- */
function horse(x, y, s = 1, { c = '#c98b55', mane = '#5a3a22', cloth = null, flip = false, run = true } = {}) {
  const leg = (lx, ly, a) => `<g transform="translate(${lx} ${ly}) rotate(${a})"><rect x="-5.5" y="-4" width="11" height="48" rx="5" fill="${c}" stroke="${A.ink}" stroke-width="2.6"/><rect x="-7" y="40" width="14" height="9" rx="3" fill="${A.ink}"/></g>`;
  const [a1, a2, a3, a4] = run ? [28, -8, -26, 14] : [0, 0, 0, 0];
  return `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">
    <path d="M-44 -10 q-26 0 -32 34 q16 -6 24 -14 q-2 -10 8 -20z" fill="${mane}" stroke="${A.ink}" stroke-width="2.6" stroke-linejoin="round"/>
    ${leg(-30, 12, a1)}${leg(26, 12, a3)}
    <ellipse cx="0" cy="0" rx="48" ry="24" fill="${c}" stroke="${A.ink}" stroke-width="3"/>
    ${leg(-18, 14, a2)}${leg(36, 12, a4)}
    ${cloth ? `<path d="M-22 -22 h34 l-2 34 h-30z" fill="${cloth}" stroke="${A.ink}" stroke-width="2.6" stroke-linejoin="round"/><path d="M-18 4 h26" stroke="#fff" stroke-width="3" opacity=".7"/>` : ''}
    <path d="M26 -14 q8 -26 26 -42 l20 12 q-12 20 -14 42 q-16 6 -32 -12z" fill="${c}" stroke="${A.ink}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M50 -62 q14 -10 26 0 l18 22 q5 9 -4 14 q-9 4 -16 -3 l-24 -14z" fill="${c}" stroke="${A.ink}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M56 -62 l2 -14 l10 12z" fill="${c}" stroke="${A.ink}" stroke-width="2.6" stroke-linejoin="round"/>
    <path d="M48 -60 q-14 10 -18 30 q-4 12 -8 18 q14 -4 20 -18 q4 -16 12 -24z" fill="${mane}" stroke="${A.ink}" stroke-width="2.4" stroke-linejoin="round"/>
    <circle cx="70" cy="-50" r="3.2" fill="${A.ink}"/><circle cx="88" cy="-30" r="2" fill="${A.ink}"/></g>`;
}
const flag = (x, y, c, t) => `<path d="M${x} ${y} v-70" stroke="${A.ink}" stroke-width="4" stroke-linecap="round"/><path d="M${x} ${y - 70} h40 l-10 13 l10 13 h-40z" fill="${c}" stroke="${A.ink}" stroke-width="2.5" stroke-linejoin="round"/><text x="${x + 15}" y="${y - 51}" text-anchor="middle" ${HEAD} font-size="14" fill="#fff">${t}</text>`;

/* ---------- tables ---------- */
const factTable = (k, hits) => `<table class="tbl"><tbody>${[0, 3, 6].map(r => `<tr>${[1, 2, 3].map(c => r + c).map(i => `<td style="white-space:nowrap;padding:4px 8px" class="${hits.includes(i) ? 'hl' : ''}">${k} × ${i} = ${k * i}</td>`).join('')}</tr>`).join('')}</tbody></table>`;

/* ===================== Topic 12 ===================== */
const t12ex = { a: 'a4', b: 'b', p: '3c2' };
const t12 = {
  id: 't12',
  title: 'Multiplication Digit Puzzles',
  intro: 'Some digits in a multiplication have gone missing! Use the <b>last digit</b> and some smart <b>estimating</b> to track them down, like a maths detective.',
  skills: ['Multiplication', 'Last-digit clues', 'Estimation'],
  art: () => svg('0 0 360 220', `<rect width="360" height="220" rx="20" fill="#fff6e4"/>
    ${paper(26, 18, 170, 188, -4)}
    ${placed(mulInner({ a: 'a6', b: '7', p: 'b52' }), 52, 30, .95)}
    ${splash(170, 40, .9)}
    ${magnifier(150, 150, .75)}
    ${leo({ x: 284, y: 112, s: .6, pose: 'point' })}
    <text x="286" y="30" text-anchor="middle" ${HEAD} font-size="19" fill="#d6453a">Find the</text><text x="286" y="52" text-anchor="middle" ${HEAD} font-size="19" fill="#d6453a">missing digits!</text>`, 'A multiplication with missing digits, a magnifying glass and Leo pointing'),
  explore: {
    setup: 'Wei Ming was doing his homework at the kopitiam when a cup of kopi tipped over! Three digits in one multiplication are now hidden under the stain. Each lettered box hides one digit.',
    art: () => svg('0 0 340 300', `<rect width="340" height="300" rx="20" fill="#fff1dc"/>
      <rect x="0" y="0" width="340" height="56" rx="20" fill="#ffd8a8"/><path d="M0 40 h340" stroke="#0f9d94" stroke-width="10" stroke-dasharray="26 14"/>
      ${kid('weiming', { x: 74, y: 104, s: .86, mood: 'think', pose: 'think' })}
      ${leo({ x: 272, y: 112, s: .7, pose: 'point' })}
      ${A.table(20, 214, 300)}
      ${paper(98, 142, 128, 74, 3)}${placed(mulInner(t12ex), 120, 140, .44)}${splash(196, 168, .75)}
      ${A.kopi(234, 160, .62)}`, 'Wei Ming and Leo at a kopitiam table with a kopi-stained worksheet'),
    steps: [
      { who: 'weiming', mood: 'think', text: 'Oh no! I can only read <b>?4 × ? = 3?2</b>. Three digits are hidden. Where do I even start?', art: () => mulArt(t12ex) },
      { who: 'leo', text: 'Start with the <b>ones</b> digit. The 2 at the end of the answer comes only from <b>4 × <i>b</i></b>. Which numbers in the 4 times table end in 2?', art: () => factTable(4, [3, 8]) },
      { who: 'aisyah', text: '4 × 3 = 1<b>2</b> and 4 × 8 = 3<b>2</b>. So <i>b</i> is <b>3 or 8</b>. Two choices! We need another clue.' },
      { who: 'arjun', mood: 'think', text: 'Let\'s <b>estimate</b>. If <i>b</i> = 3, even the biggest choice, 94 × 3 = 282, is less than 300. Too small! So <i>b</i> must be <b>8</b>.' },
      { who: 'chloe', text: 'Now <span style="white-space:nowrap">?4 × 8</span> is in the 300s. 40 × 8 = 320 and 50 × 8 = 400, so <span style="white-space:nowrap">?4</span> is in the forties: <i>a</i> = <b>4</b>. Then 44 × 8 = <b>352</b>, so <i>c</i> = <b>5</b>.', art: () => mulArt(t12ex, 'The solved puzzle: 44 × 8 = 352', { fill: { a: 4, b: 8, c: 5 } }) },
      { who: 'leo', text: '<b>Detective steps:</b> ① look at the ones digit first, ② estimate the size, ③ if there are two choices, test both, ④ check the whole multiplication at the end.' },
    ],
  },
  keys: [
    { title: 'Ones digit first', text: 'The ones digit of an answer depends only on the ones digits you multiply. 7 × <i>b</i> ends in 2? Then <i>b</i> = 6, because 7 × 6 = 42.' },
    { title: 'Estimate the size', text: 'Round numbers trap the answer. If ?8 × 7 is in the 200s, then ?8 lies between about 200 ÷ 7 ≈ 29 and 300 ÷ 7 ≈ 43.' },
    { title: 'Two choices? Test both', text: 'A last-digit clue often gives two choices (4 × <i>b</i> ends in 2: <i>b</i> = 3 or 8). Try each one and cross out the one that fails.' },
    { title: 'Letter puzzles', text: 'The <b>same letter</b> always stands for the <b>same digit</b>; <b>different letters</b> stand for <b>different digits</b>. Lettered boxes are different: two boxes may hold the same digit.' },
  ],
  practice: [
    { id: 'a', level: 1, type: 'blanks', prompt: 'Mei Ling copied a multiplication from the board, but two digits got smudged. Find the digit in each lettered box.',
      art: mulArt({ a: 'a8', b: '7', p: '2b6' }), puz: { kind: 'mul', a: 'a8', b: '7', p: '2b6' }, labels: 'ab',
      template: `${lv('a')} = {0} &nbsp;&nbsp; ${lv('b')} = {1}`, blanks: [{ answer: 3, size: 'sm' }, { answer: 6, size: 'sm' }],
      hint: 'The answer is in the 200s. Try a few numbers ending in 8: what are 28 × 7 and 38 × 7?',
      solution: ['Ones: 8 × 7 = 56, which ends in 6 ✓.', 'Size: the answer is between 200 and 299. 28 × 7 = 196 is too small and 48 × 7 = 336 is too big.', '38 × 7 = 266 ✓, so <b><i>a</i> = 3</b> and <b><i>b</i> = 6</b>.'] },
    { id: 'b', level: 1, type: 'mcq', prompt: 'A one-digit number is multiplied by <b>6</b>, and the answer ends in <b>4</b>. Which digits could it be?',
      options: ['2', '4', '7', '9'], answer: [1, 3],
      hint: 'Say the 6 times table and look only at the last digit: 6, 12, 18, 24, …',
      solution: ['2 × 6 = 12 ✗ (ends in 2)', '4 × 6 = 24 ✓', '7 × 6 = 42 ✗ (ends in 2)', '9 × 6 = 54 ✓', 'So it could be <b>4 or 9</b>. Last-digit clues often give two choices, so keep both in mind!'] },
    { id: 'c', level: 1, type: 'blanks', prompt: 'Kumar worked out a multiplication at the void deck, but the rain blurred two digits. Find them.',
      art: mulArt({ a: '1a4', b: '3', p: 'b72' }), puz: { kind: 'mul', a: '1a4', b: '3', p: 'b72' }, labels: 'ab',
      template: `${lv('a')} = {0} &nbsp;&nbsp; ${lv('b')} = {1}`, blanks: [{ answer: 2, size: 'sm' }, { answer: 3, size: 'sm' }],
      hint: '4 × 3 = 12: write 2 and carry 1. Then <i>a</i> × 3 + 1 must end in 7.',
      solution: ['Ones: 4 × 3 = 12. Write 2, carry 1.', 'Tens: <i>a</i> × 3 + 1 ends in 7, so <i>a</i> × 3 ends in 6. Only 2 × 3 = 6 works, so <i>a</i> = 2 (and nothing is carried).', 'Hundreds: 1 × 3 = 3, so <i>b</i> = 3.', 'Check: 124 × 3 = 372 ✓. <b><i>a</i> = 2, <i>b</i> = 3</b>'] },
    { id: 'd', level: 2, type: 'blanks', prompt: 'At the Maths Club CCA, Farah\'s puzzle card says the answer is in the <b>1500s</b>. Find the three missing digits.',
      art: mulArt({ a: 'a7b', b: '4', p: '15c6' }), puz: { kind: 'mul', a: 'a7b', b: '4', p: '15c6' }, labels: 'abc',
      template: `${lv('a')} = {0} &nbsp;&nbsp; ${lv('b')} = {1} &nbsp;&nbsp; ${lv('c')} = {2}`, blanks: [{ answer: 3, size: 'sm' }, { answer: 9, size: 'sm' }, { answer: 1, size: 'sm' }],
      hint: 'Which digits times 4 end in 6? Then: 1500 ÷ 4 = 375 and 1600 ÷ 4 = 400.',
      solution: ['Ones: <i>b</i> × 4 ends in 6, so <i>b</i> = 4 (16) or <i>b</i> = 9 (36).', 'Size: 375 × 4 = 1500 and 400 × 4 = 1600, so the top number is from 375 to 399. That makes <i>a</i> = 3.', 'Test both choices: 374 × 4 = 1496 ✗ (not in the 1500s), 379 × 4 = 1516 ✓', 'So <b><i>a</i> = 3, <i>b</i> = 9, <i>c</i> = 1</b>.'] },
    { id: 'e', level: 2, type: 'blanks', prompt: 'From the Puzzle Corner of the school newsletter: a number in the twenties is multiplied by a 1-digit number. Find the missing digits.',
      art: mulArt({ a: '2a', b: 'b', p: 'c74' }), puz: { kind: 'mul', a: '2a', b: 'b', p: 'c74' }, labels: 'abc',
      template: `${lv('a')} = {0} &nbsp;&nbsp; ${lv('b')} = {1} &nbsp;&nbsp; ${lv('c')} = {2}`, blanks: [{ answer: 9, size: 'sm' }, { answer: 6, size: 'sm' }, { answer: 1, size: 'sm' }],
      hint: 'What is the biggest answer you could get? (Try 29 × 9.) What does that tell you about <i>c</i>?',
      solution: ['The biggest possible answer is 29 × 9 = 261, so the answer cannot be 274 or more. It must be 174, so <i>c</i> = 1.', '174 ÷ <i>b</i> must be a number in the twenties. If <i>b</i> is 5 or less, 174 ÷ <i>b</i> is more than 34 (too big). If <i>b</i> = 9, 174 ÷ 9 is less than 20 (too small). So <i>b</i> is 6, 7 or 8.', '174 ÷ 6 = 29 exactly ✓. (174 ÷ 7 and 174 ÷ 8 leave remainders.)', 'Check: 29 × 6 = 174 ✓. <b><i>a</i> = 9, <i>b</i> = 6, <i>c</i> = 1</b>'] },
    { id: 'f', level: 2, type: 'blanks', prompt: 'Mr Rahman wrote this long multiplication on the whiteboard, then rubbed out five digits. Remember: the second row is the top number × <b>30</b>, which is why it ends in 0.',
      art: mulArt({ a: 'a7', b: '3b', parts: ['2c2', 'd410'], p: '1e92' }), puz: { kind: 'mul', a: 'a7', b: '3b', parts: ['2c2', 'd410'], p: '1e92' }, labels: 'abcde',
      template: `${lv('a')} = {0} &nbsp; ${lv('b')} = {1} &nbsp; ${lv('c')} = {2} &nbsp; ${lv('d')} = {3} &nbsp; ${lv('e')} = {4}`,
      blanks: [{ answer: 4, size: 'sm' }, { answer: 6, size: 'sm' }, { answer: 8, size: 'sm' }, { answer: 1, size: 'sm' }, { answer: 6, size: 'sm' }],
      hint: 'First row: 7 × <i>b</i> must end in 2. Second row: <i>a</i>7 × 3 = <i>d</i>41.',
      solution: ['First row ends in 2, so 7 × <i>b</i> ends in 2. 7 × 6 = 42, so <i>b</i> = 6.', 'Second row: <i>a</i>7 × 30 = <i>d</i>410, so <i>a</i>7 × 3 = <i>d</i>41. 7 × 3 = 21 (write 1, carry 2). Then <i>a</i> × 3 + 2 ends in 4, so <i>a</i> × 3 ends in 2: <i>a</i> = 4. 47 × 3 = 141, so <i>d</i> = 1.', 'First row: 47 × 6 = 282, so <i>c</i> = 8.', 'Add the rows: 282 + 1410 = 1692, so <i>e</i> = 6.', '<b><i>a</i> = 4, <i>b</i> = 6, <i>c</i> = 8, <i>d</i> = 1, <i>e</i> = 6</b> (47 × 36 = 1692)'] },
    { id: 'g', level: 2, type: 'blanks', prompt: 'Code-breaking game at the Science Centre! Each letter stands for a digit. The same letter is always the same digit, and different letters are different digits. Crack the code.',
      art: eqArt('AB × 4 = CBA', 'Letter puzzle: AB times 4 equals CBA'), puz: { kind: 'eq', eq: 'AB × 4 = CBA' }, labels: 'ABC',
      template: 'A = {0} &nbsp;&nbsp; B = {1} &nbsp;&nbsp; C = {2}', blanks: [{ answer: 8, size: 'sm' }, { answer: 2, size: 'sm' }, { answer: 3, size: 'sm' }],
      hint: 'A is the last digit of (B × 4), so A must be even. Try A = 2, 4, 6 and 8 in turn.',
      solution: ['A is the ones digit of B × 4, so A is even: 2, 4, 6 or 8.', 'For each A, choose B so that B × 4 ends in A. Then check that the <b>tens</b> digit of the answer is B:',
        '<table class="tbl"><tr><th>A</th><th>try</th><th>tens digit = B?</th></tr><tr><td>2</td><td>23 × 4 = 92, 28 × 4 = 112</td><td>✗ ✗</td></tr><tr><td>4</td><td>41 × 4 = 164, 46 × 4 = 184</td><td>✗ ✗</td></tr><tr><td>6</td><td>64 × 4 = 256, 69 × 4 = 276</td><td>✗ ✗</td></tr><tr><td>8</td><td>82 × 4 = <b>328</b>, 87 × 4 = 348</td><td class="hl">✓ ✗</td></tr></table>',
        'So 82 × 4 = 328: <b>A = 8, B = 2, C = 3</b>.'] },
    { id: 'h', level: 3, type: 'blanks', prompt: 'Priya\'s little brother scribbled over her long multiplication, and only the answer, <b>988</b>, can still be read! Find all seven missing digits.',
      art: mulArt({ a: '3a', b: '2b', parts: ['cde', 'fg0'], p: '988' }), puz: { kind: 'mul', a: '3a', b: '2b', parts: ['cde', 'fg0'], p: '988' }, labels: 'abcdefg',
      template: `${lv('a')} = {0} &nbsp; ${lv('b')} = {1} &nbsp; ${lv('c')} = {2} &nbsp; ${lv('d')} = {3} &nbsp; ${lv('e')} = {4} &nbsp; ${lv('f')} = {5} &nbsp; ${lv('g')} = {6}`,
      blanks: [8, 6, 2, 2, 8, 7, 6].map(n => ({ answer: n, size: 'sm' })),
      hint: '<i>a</i> × <i>b</i> must end in 8. Also, 988 ÷ 39 is a little more than 25, so 2<i>b</i> is at least 26.',
      solution: ['The second row ends in 0, so the 8 at the end of 988 comes from the first row: <i>a</i> × <i>b</i> ends in 8.', 'Size: 3<i>a</i> is at most 39, and 39 × 25 = 975 is less than 988. So 2<i>b</i> is at least 26, which means <i>b</i> is 6, 7, 8 or 9.',
        'Test each <i>b</i> with an <i>a</i> that makes <i>a</i> × <i>b</i> end in 8: <i>b</i> = 6: 33 × 26 = 858 ✗, 38 × 26 = <b>988</b> ✓ · <i>b</i> = 7: 34 × 27 = 918 ✗ · <i>b</i> = 8: 31 × 28 = 868 ✗, 36 × 28 = 1008 ✗ · <i>b</i> = 9: 32 × 29 = 928 ✗',
        'So the puzzle is 38 × 26. First row: 38 × 6 = 228. Second row: 38 × 20 = 760. Check: 228 + 760 = 988 ✓',
        '<b><i>a</i> = 8, <i>b</i> = 6, <i>c</i> = 2, <i>d</i> = 2, <i>e</i> = 8, <i>f</i> = 7, <i>g</i> = 6</b>'] },
    { id: 'i', level: 3, type: 'blanks', prompt: 'A National Day quiz puzzle: a 2-digit number multiplied by <b>itself</b> ends with the same two digits it started with! Same letter = same digit; different letters = different digits.',
      art: eqArt('AB × AB = CAB', 'Letter puzzle: AB times AB equals CAB'), puz: { kind: 'eq', eq: 'AB × AB = CAB' }, labels: 'ABC',
      template: 'A = {0} &nbsp;&nbsp; B = {1} &nbsp;&nbsp; C = {2}', blanks: [{ answer: 2, size: 'sm' }, { answer: 5, size: 'sm' }, { answer: 6, size: 'sm' }],
      hint: 'B × B must end in B. Which digits do that? Also, the answer has only 3 digits, so AB cannot be too big.',
      solution: ['B × B ends in B. Only 0, 1, 5 and 6 work (0 × 0 = 0, 1 × 1 = 1, 5 × 5 = 25, 6 × 6 = 36).', 'The answer has 3 digits, and 32 × 32 = 1024 has 4, so AB is 31 or less.', 'Try them: 10 × 10 = 100 ✗, 15 × 15 = 225 ✗, 16 × 16 = 256 ✗, 20 × 20 = 400 ✗, 21 × 21 = 441 ✗, 25 × 25 = <b>625</b> ✓, 26 × 26 = 676 ✗, 30 × 30 = 900 ✗, 31 × 31 = 961 ✗ (11 is not allowed, because A and B must be different.)', 'So 25 × 25 = 625: <b>A = 2, B = 5, C = 6</b>.'] },
  ],
  adult: 'Links to school work: P4 multiplication (up to 4-digit by 1-digit, and long multiplication with a 2-digit multiplier) and estimation. Solving digit puzzles is <b>enrichment</b> (olympiad style): it trains pupils to reason about place value, carrying and the size of an answer. Common mistakes: forgetting the carried digit, stopping at the first last-digit choice instead of testing both, and forgetting that the tens row of a long multiplication ends in 0. Tip: ask your child to say <i>why</i> each digit is forced, and always to check the finished multiplication.',
};

/* ===================== Topic 13 ===================== */
const t13ex = { d: '5', n: 'a2b', q: '1c4', rows: ['5', 'd2', '30', ' 2e', ' 20', '  0'] };
const t13 = {
  id: 't13',
  title: 'Division Digit Puzzles',
  intro: 'A long division has lost some of its digits. Every row is a clue: the products, the bring-downs and the remainders. Can you rebuild it?',
  skills: ['Long division', 'Remainders', 'Working backwards'],
  art: () => svg('0 0 360 220', `<rect width="360" height="220" rx="20" fill="#eaf6ff"/>
    <rect x="18" y="14" width="214" height="194" rx="12" fill="#c98b55" stroke="${A.ink}" stroke-width="3"/>
    <rect x="28" y="24" width="194" height="174" rx="6" fill="#2f6f5e"/>
    ${placed(divInner({ d: '7', n: '8a1', q: '1b3', rows: ['7', '1c', 'd4', ' 21', ' 21', '  0'] }, { ink: '#fff', boxFill: '#3f8a75' }), 34, 30, .42)}
    <text x="170" y="70" text-anchor="middle" ${HEAD} font-size="15" fill="#ffe27a">remainder</text><text x="170" y="90" text-anchor="middle" ${HEAD} font-size="15" fill="#ffe27a">&lt; divisor</text>
    <text x="170" y="134" text-anchor="middle" ${HEAD} font-size="15" fill="#9fe6c7">check:</text><text x="170" y="154" text-anchor="middle" ${HEAD} font-size="15" fill="#9fe6c7">q × d + r</text>
    ${kid('arjun', { x: 296, y: 86, s: .78, pose: 'wave' })}
    <rect x="252" y="196" width="88" height="8" rx="4" fill="#9edcaa"/>`, 'A chalkboard with a long division puzzle and Arjun waving'),
  explore: {
    setup: 'Aisyah\'s long division worksheet got caught in the rain at the bus stop. Some digits were washed away! Each lettered box hides one digit.',
    art: () => svg('0 0 340 300', `<rect width="340" height="300" rx="20" fill="#e2efff"/>
      ${A.cloud(20, 18, .9)}${A.cloud(230, 28, .8)}${rain(20, 60, 300, 150, 22)}
      <rect x="150" y="84" width="176" height="16" rx="6" fill="#4aa8ff" stroke="${A.ink}" stroke-width="3"/>
      <rect x="160" y="100" width="10" height="150" fill="#9aa4b5" stroke="${A.ink}" stroke-width="2.5"/><rect x="306" y="100" width="10" height="150" fill="#9aa4b5" stroke="${A.ink}" stroke-width="2.5"/>
      <rect x="176" y="190" width="124" height="12" rx="4" fill="#c98b55" stroke="${A.ink}" stroke-width="2.5"/>
      <rect x="214" y="54" width="76" height="28" rx="6" fill="#fff" stroke="${A.ink}" stroke-width="2.5"/><text x="252" y="74" text-anchor="middle" ${HEAD} font-size="16" fill="#0f9d94">BUS 12</text>
      <path d="M0 250 h340 v50 h-340z" fill="#b8c2d6"/>${A.puddle(80, 268, 110)}
      ${kid('aisyah', { x: 82, y: 128, s: .82, mood: 'think', pose: 'think' })}
      ${paper(110, 140, 64, 76, 8)}${splash(146, 176, .6, '#4aa8ff')}
      ${leo({ x: 246, y: 152, s: .62, pose: 'wave' })}`, 'Aisyah at a rainy bus stop with a wet worksheet, and Leo'),
    steps: [
      { who: 'aisyah', mood: 'think', text: 'I divided by <b>5</b>, but now five digits are missing. Where do I begin?', art: () => divArt(t13ex) },
      { who: 'leo', text: 'Start at the <b>bottom</b>. The remainder is 0, so the last two rows are equal: 2<i>e</i> = 20, and <i>e</i> = <b>0</b>. That 0 was <b>brought down</b> from the top, so <i>b</i> = <b>0</b> too.' },
      { who: 'weiming', text: 'Each product row is <b>5 × a quotient digit</b>. The row 30 sits under the quotient digit <i>c</i>, and 5 × 6 = 30, so <i>c</i> = <b>6</b>. And 5 × 4 = 20 ✓.' },
      { who: 'arjun', mood: 'think', text: 'Now work <b>backwards</b>. After subtracting 30, the 2 in "20" was left over. So <i>d</i>2 − 30 = 2, which means <i>d</i>2 = 32: <i>d</i> = <b>3</b>.' },
      { who: 'chloe', text: 'At the top, <i>a</i> − 5 = 3, so <i>a</i> = <b>8</b>. The division was <b>820 ÷ 5 = 164</b>!', art: () => divArt(t13ex, 'The solved division: 820 divided by 5 is 164', { fill: { a: 8, b: 0, c: 6, d: 3, e: 0 } }) },
      { who: 'leo', text: 'Always <b>check by multiplying back</b>: 164 × 5 = 820 ✓. Handy clues: the remainder is smaller than the divisor, each product = divisor × quotient digit, and a brought-down digit drops straight down its column.' },
    ],
  },
  keys: [
    { title: 'Remainder < divisor', text: 'When you divide by 6, the remainder can only be 0, 1, 2, 3, 4 or 5. If 6 or more were left, you could share out once more.' },
    { title: 'Product rows', text: 'Each row under a subtraction line comes from <b>divisor × one quotient digit</b>. If 72 sits under a 9 in the quotient, the divisor is 72 ÷ 9 = 8.' },
    { title: 'Bring-downs', text: 'A digit that is brought down drops <b>straight down its column</b>, so it matches the digit at the top of that column.' },
    { title: 'Check backwards', text: 'Quotient × divisor + remainder = dividend. For 745 ÷ 8 = 93 R 1: 93 × 8 + 1 = 745 ✓' },
  ],
  practice: [
    { id: 'a', level: 1, type: 'mcq', prompt: 'Uncle Kumar packs kueh lapis into boxes of <b>6</b>. He fills as many boxes as he can. Which of these could be the number of pieces <b>left over</b>?',
      options: ['0', '3', '5', '6', '8'], answer: [0, 1, 2],
      hint: 'If 6 or more pieces were left, what could Uncle Kumar do?',
      solution: ['0 left over: every box is full ✓', '3 and 5 are less than 6 ✓', '6 or 8 left over? Then he could fill one more box, so these are not remainders ✗', 'When we divide by 6, the remainder is always <b>0, 1, 2, 3, 4 or 5</b>.'] },
    { id: 'b', level: 1, type: 'blanks', prompt: 'Some digits in Jun Jie\'s long division have rubbed off. Find them.',
      art: divArt({ d: '4', n: 'a6', q: '2b', rows: ['c', '16', '1d', ' 0'] }), puz: { kind: 'div', d: '4', n: 'a6', q: '2b', rows: ['c', '16', '1d', ' 0'] }, labels: 'abcd',
      template: `${lv('a')} = {0} &nbsp; ${lv('b')} = {1} &nbsp; ${lv('c')} = {2} &nbsp; ${lv('d')} = {3}`, blanks: [9, 4, 8, 6].map(n => ({ answer: n, size: 'sm' })),
      hint: 'The first quotient digit is 2, so the first product is 2 × 4. In the row 16, the 1 is what was left over and the 6 was brought down.',
      solution: ['First product: 2 × 4 = 8, so <i>c</i> = 8.', '<i>a</i> − 8 left 1 (the 1 in 16), so <i>a</i> = 9.', '16 ÷ 4 = 4, so <i>b</i> = 4. The product is 4 × 4 = 16, so <i>d</i> = 6.', 'Check: 24 × 4 = 96 ✓. <b><i>a</i> = 9, <i>b</i> = 4, <i>c</i> = 8, <i>d</i> = 6</b>'] },
    { id: 'c', level: 1, type: 'blanks', prompt: 'Mdm Rahman packs curry puffs into boxes of <b>7</b>. She fills <b>8</b> boxes, and there are not enough curry puffs left to fill another box. How many curry puffs could she have had? Give the <b>smallest</b> and the <b>largest</b> possible number.',
      art: eqArt('□□ ÷ 7 = 8 R □', 'A missing 2-digit number divided by 7 is 8 remainder something', { plain: 'R' }),
      template: 'Smallest: {0} &nbsp;&nbsp; Largest: {1}', blanks: [{ answer: 56 }, { answer: 62 }],
      hint: 'The remainder can be any number from 0 up to 6. Use: quotient × divisor + remainder.',
      solution: ['8 full boxes hold 8 × 7 = 56 curry puffs.', 'The leftover (remainder) is less than 7, so it is from 0 to 6.', 'Smallest: 56 + 0 = <b>56</b>. Largest: 56 + 6 = <b>62</b>.'] },
    { id: 'd', level: 2, type: 'blanks', prompt: 'Siti shared her stickers equally among <b>6</b> friends, with some left over. In her long division, six digits are missing. Find them.',
      art: divArt({ d: '6', n: '7a9', q: '1b4', rows: ['6', '1c', '12', ' d9', ' 2e', '  f'] }), puz: { kind: 'div', d: '6', n: '7a9', q: '1b4', rows: ['6', '1c', '12', ' d9', ' 2e', '  f'] }, labels: 'abcdef',
      template: `${lv('a')} = {0} &nbsp; ${lv('b')} = {1} &nbsp; ${lv('c')} = {2} &nbsp; ${lv('d')} = {3} &nbsp; ${lv('e')} = {4} &nbsp; ${lv('f')} = {5}`, blanks: [4, 2, 4, 2, 4, 5].map(n => ({ answer: n, size: 'sm' })),
      hint: 'Fill the easy ones first: 12 = 6 × ?, and 4 × 6 = 2<i>e</i>. Then remember the last remainder <i>f</i> must be less than 6.',
      solution: ['12 = 6 × 2, so <i>b</i> = 2. The last quotient digit is 4: 4 × 6 = 24, so <i>e</i> = 4.', '<i>d</i>9 − 24 = <i>f</i>, and <i>f</i> is less than 6. The only number ending in 9 from 24 to 29 is 29, so <i>d</i> = 2 and <i>f</i> = 29 − 24 = 5.', 'That 2 was left over from 1<i>c</i> − 12, so 1<i>c</i> = 14: <i>c</i> = 4.', '<i>c</i> was brought down from the top, so <i>a</i> = <i>c</i> = 4.', 'Check: 124 × 6 + 5 = 744 + 5 = 749 ✓', '<b><i>a</i> = 4, <i>b</i> = 2, <i>c</i> = 4, <i>d</i> = 2, <i>e</i> = 4, <i>f</i> = 5</b>'] },
    { id: 'e', level: 2, type: 'blanks', prompt: 'For the class newsletter, Ravi hid even the <b>divisor</b> in his puzzle! Find the missing digits.',
      art: divArt({ d: 'a', n: '74b', q: ' 9c', rows: ['72', ' d5', ' 24', '  1'] }), puz: { kind: 'div', d: 'a', n: '74b', q: ' 9c', rows: ['72', ' d5', ' 24', '  1'] }, labels: 'abcd',
      template: `${lv('a')} = {0} &nbsp; ${lv('b')} = {1} &nbsp; ${lv('c')} = {2} &nbsp; ${lv('d')} = {3}`, blanks: [8, 5, 3, 2].map(n => ({ answer: n, size: 'sm' })),
      hint: 'The first product, 72, sits under the quotient digit 9. So 9 × <i>a</i> = 72.',
      solution: ['9 × <i>a</i> = 72, so the divisor <i>a</i> = 8.', '74 − 72 = 2, so <i>d</i> = 2. The 5 beside it was brought down, so <i>b</i> = 5.', '24 = 8 × 3, so <i>c</i> = 3. And 25 − 24 = 1, the remainder ✓', 'Check: 93 × 8 + 1 = 745 ✓. <b><i>a</i> = 8, <i>b</i> = 5, <i>c</i> = 3, <i>d</i> = 2</b>'] },
    { id: 'f', level: 2, type: 'blanks', prompt: 'A code to open the treasure box at the CCA camp: same letter = same digit, different letters = different digits. Crack it!',
      art: eqArt('ABC ÷ 4 = CA', 'Letter puzzle: ABC divided by 4 equals CA'), puz: { kind: 'eq', eq: 'ABC ÷ 4 = CA' }, labels: 'ABC',
      template: 'A = {0} &nbsp;&nbsp; B = {1} &nbsp;&nbsp; C = {2}', blanks: [{ answer: 1, size: 'sm' }, { answer: 6, size: 'sm' }, { answer: 4, size: 'sm' }],
      hint: 'Multiply back: CA × 4 = ABC. Since CA is less than 100, ABC is less than 400. So what can A be?',
      solution: ['Multiply back: CA × 4 = ABC.', 'CA is a 2-digit number, so CA × 4 is less than 400. So A is 1, 2 or 3.', 'The ones digit of A × 4 is C. A = 1 gives C = 4: 41 × 4 = <b>164</b> ✓ (it starts with 1 = A and ends with 4 = C).', 'A = 2 gives C = 8: 82 × 4 = 328, which starts with 3, not 2 ✗. A = 3 gives C = 2: 23 × 4 = 92, only 2 digits ✗.', 'So 164 ÷ 4 = 41: <b>A = 1, B = 6, C = 4</b>.'] },
    { id: 'g', level: 2, type: 'blanks', prompt: 'A division has quotient <b>47</b> and remainder <b>5</b>. What is the <b>smallest</b> possible divisor? For that divisor, what is the dividend?',
      art: eqArt('□ ÷ □ = 47 R 5', 'A missing number divided by a missing divisor is 47 remainder 5', { plain: 'R' }),
      template: 'Smallest divisor = {0} &nbsp;&nbsp; Dividend = {1}', blanks: [{ answer: 6, size: 'sm' }, { answer: 287 }],
      hint: 'The remainder must be smaller than the divisor.',
      solution: ['The remainder 5 must be less than the divisor, so the divisor is at least 6. The smallest divisor is <b>6</b>.', 'Dividend = quotient × divisor + remainder = 47 × 6 + 5 = 282 + 5 = <b>287</b>.', 'Check: 287 ÷ 6 = 47 R 5 ✓'] },
    { id: 'h', level: 3, type: 'blanks', prompt: '<b>Maths Olympiad CCA challenge:</b> a <b>2-digit</b> divisor that ends in 1. Find all the missing digits.',
      art: divArt({ d: 'a1', n: '902', q: ' bc', rows: ['de', ' 8f', ' 8g', '  h'] }), puz: { kind: 'div', d: 'a1', n: '902', q: ' bc', rows: ['de', ' 8f', ' 8g', '  h'] }, labels: 'abcdefgh',
      template: `${lv('a')} = {0} &nbsp; ${lv('b')} = {1} &nbsp; ${lv('c')} = {2} &nbsp; ${lv('d')} = {3} &nbsp; ${lv('e')} = {4} &nbsp; ${lv('f')} = {5} &nbsp; ${lv('g')} = {6} &nbsp; ${lv('h')} = {7}`,
      blanks: [4, 2, 2, 8, 2, 2, 2, 0].map(n => ({ answer: n, size: 'sm' })),
      hint: 'The first part of the dividend is 90. After subtracting <i>de</i>, 8 is left. So what is <i>de</i>?',
      solution: ['The first step divides 90. 90 − <i>de</i> = 8, so <i>de</i> = 82: <i>d</i> = 8, <i>e</i> = 2.', '82 = <i>b</i> × <i>a</i>1. Which 2-digit number ending in 1 goes into 82 exactly? 41 × 2 = 82. So <i>a</i> = 4 and <i>b</i> = 2.', 'Bring down the 2: the next row is 82, so <i>f</i> = 2.', '82 ÷ 41 = 2, so <i>c</i> = 2. The product is 82 (<i>g</i> = 2) and the remainder is 0 (<i>h</i> = 0).', 'Check: 41 × 22 = 902 ✓', '<b><i>a</i> = 4, <i>b</i> = 2, <i>c</i> = 2, <i>d</i> = 8, <i>e</i> = 2, <i>f</i> = 2, <i>g</i> = 2, <i>h</i> = 0</b>'] },
    { id: 'i', level: 3, type: 'blanks', prompt: 'Puzzle Corner: rub out the first digit of a 4-digit number ABCD, and you get BCD, which is exactly ABCD ÷ 9! Same letter = same digit, different letters = different digits.',
      art: eqArt('ABCD ÷ 9 = BCD', 'Letter puzzle: ABCD divided by 9 equals BCD'), puz: { kind: 'eq', eq: 'ABCD ÷ 9 = BCD' }, labels: 'ABCD',
      template: 'A = {0} &nbsp; B = {1} &nbsp; C = {2} &nbsp; D = {3}', blanks: [6, 7, 5, 0].map(n => ({ answer: n, size: 'sm' })),
      hint: 'Draw a bar model: ABCD is 9 units of BCD. But ABCD is also A thousands + BCD. So how many units of BCD make up the A thousands?',
      solution: ['Bar model: ABCD = 9 units, and one unit is BCD.', 'ABCD is also A thousands + BCD. Take one unit of BCD away from both: A thousands = <b>8 units</b>.', 'So one unit, BCD = A thousands ÷ 8 = A × 125. A cannot be 8 or 9 (that would make BCD 1000 or more).',
        'Try A = 1 to 7: 1125 ✗ (A = B), 2250 ✗ (A = B), 3375 ✗ (A = B), 4500 ✗ (C = D), 5625 ✗ (A = D), <b>6750</b> ✓, 7875 ✗ (A = C)',
        'Check: 6750 ÷ 9 = 750 ✓. <b>A = 6, B = 7, C = 5, D = 0</b>'] },
  ],
  adult: 'Links to school work: P4 division of up to 4-digit numbers by a 1-digit number, with remainders. Question 8 uses a 2-digit divisor, which is <b>enrichment</b> (not in the primary long-division syllabus); question 9 uses the P5/P6 bar-model "units" idea. Digit puzzles in general are <b>enrichment</b>. Common mistakes: allowing a remainder that is as big as the divisor, and forgetting that a brought-down digit must match the digit at the top of its column. Tip: after solving, always check with quotient × divisor + remainder = dividend.',
};

/* ===================== Maths Story: Tian Ji's Horse Race ===================== */
const TJ = '#2f6fd6', KG = '#e0282e';
const matchTable = (rows, caption = '') => `<table class="tbl" style="font-size:15px"><thead><tr><th style="padding:4px 6px">Race</th><th style="padding:4px 6px">King</th><th style="padding:4px 6px">Tian Ji</th><th style="padding:4px 6px">Winner</th></tr></thead><tbody>${rows.map((r, i) => `<tr><td style="padding:4px 6px">${i + 1}</td><td style="padding:4px 6px">${r[0]}</td><td style="padding:4px 6px">${r[1]}</td><td style="padding:4px 6px" class="${r[2] === 'Tian Ji' ? 'hl' : ''}">${r[2]}</td></tr>`).join('')}</tbody></table>${caption ? `<small>${caption}</small>` : ''}`;
const ordersTable = () => {
  const names = { F: 'fast', M: 'medium', S: 'slow' };
  const beats = { F: ['M', 'S'], M: ['S'], S: [] };     // Tian Ji's horse → king's horses it beats
  const king = ['F', 'M', 'S'];
  const perms = [['F', 'M', 'S'], ['F', 'S', 'M'], ['M', 'F', 'S'], ['M', 'S', 'F'], ['S', 'F', 'M'], ['S', 'M', 'F']];
  const rows = perms.map(p => { const w = p.map((h, i) => beats[h].includes(king[i])); const n = w.filter(Boolean).length; return `<tr><td style="padding:4px 6px">${p.map((h, i) => `${names[h]}${w[i] ? ' ✓' : ''}`).join(' · ')}</td><td style="padding:4px 6px" class="${n >= 2 ? 'hl' : ''}">${n}</td></tr>`; }).join('');
  return `<table class="tbl" style="font-size:15px"><thead><tr><th style="padding:4px 6px">Tian Ji's horses vs the king's fast · medium · slow</th><th style="padding:4px 6px">Wins</th></tr></thead><tbody>${rows}</tbody></table>`;
};
const S1 = {
  id: 'S1',
  title: 'Maths Story: Tian Ji\'s Horse Race',
  intro: 'Can you win a race with <i>slower</i> horses? Over 2,000 years ago, a clever strategist in China showed how, just by changing the order!',
  skills: ['Strategy', 'Listing all cases', 'Reasoning'],
  art: () => svg('0 0 360 220', `<rect width="360" height="220" rx="20" fill="#fff4dd"/>
    <path d="M30 60 q14 -4 22 -20 h72 q8 16 22 20z" fill="${KG}" stroke="${A.ink}" stroke-width="3" stroke-linejoin="round"/><rect x="52" y="58" width="72" height="34" fill="#ffe3b3" stroke="${A.ink}" stroke-width="3"/><rect x="80" y="70" width="16" height="22" fill="#a86f3f"/>
    <path d="M0 120 q180 -24 360 0 v100 h-360z" fill="#c7e9a6"/>
    <path d="M0 150 q180 -20 360 0" fill="none" stroke="#fff" stroke-width="4" stroke-dasharray="14 10"/><path d="M0 194 q180 -16 360 0" fill="none" stroke="#fff" stroke-width="4" stroke-dasharray="14 10"/>
    ${flag(236, 104, TJ, 'Tian')}${flag(298, 112, KG, 'King')}
    ${horse(112, 140, .72, { c: '#f2c27a', mane: '#8a5a3c', cloth: KG })}
    ${horse(196, 180, .72, { c: '#9b6a47', mane: '#3b2a1e', cloth: TJ })}
    ${A.cloud(170, 18, .8)}`, 'Two horses racing on a track, one with a red cloth for the King and one with a blue cloth for Tian Ji'),
  explore: {
    title: 'The Story',
    setup: 'Long ago, in the state of Qi in ancient China, General <b>Tian Ji</b> liked to race horses against <b>King Wei of Qi</b>, usually for a big bet of gold.',
    art: () => svg('0 0 340 320', `<rect width="340" height="320" rx="20" fill="#fff9ec"/>
      <rect x="22" y="12" width="296" height="214" rx="14" fill="#fff" stroke="${A.ink}" stroke-width="3"/>
      <rect x="10" y="6" width="16" height="226" rx="8" fill="#e0a51c" stroke="${A.ink}" stroke-width="3"/><rect x="314" y="6" width="16" height="226" rx="8" fill="#e0a51c" stroke="${A.ink}" stroke-width="3"/>
      <text x="84" y="36" text-anchor="middle" ${HEAD} font-size="16" fill="${KG}">King's horses</text><text x="250" y="36" text-anchor="middle" ${HEAD} font-size="15" fill="${TJ}">Tian Ji's horses</text>
      ${['fast', 'medium', 'slow'].map((t, i) => `${horse(66, 76 + i * 56, .3, { c: '#f2c27a', mane: '#8a5a3c', cloth: KG, run: false })}<text x="70" y="${104 + i * 56}" text-anchor="middle" ${NUM} font-size="12" fill="${A.ink}">${t}</text>`).join('')}
      ${['fast', 'medium', 'slow'].map((t, i) => `${horse(274, 76 + i * 56, .3, { c: '#9b6a47', mane: '#3b2a1e', cloth: TJ, run: false, flip: true })}<text x="270" y="${104 + i * 56}" text-anchor="middle" ${NUM} font-size="12" fill="${A.ink}">${t}</text>`).join('')}
      <g stroke-width="4" stroke-linecap="round" fill="none"><path d="M226 186 L112 74" stroke="#d6453a" stroke-dasharray="7 6"/><path d="M226 74 L112 130" stroke="#3dbb6b"/><path d="M226 130 L112 186" stroke="#3dbb6b"/></g>
      <text x="170" y="218" text-anchor="middle" ${NUM} font-size="12" fill="#56627a">red: lose · green: win</text>
      ${leo({ x: 100, y: 254, s: .4, pose: 'point' })}${kid('chloe', { x: 246, y: 252, s: .42, mood: 'think', pose: 'think' })}`, 'A scroll showing the King\'s and Tian Ji\'s fast, medium and slow horses, with lines showing Sun Bin\'s new matches'),
    steps: [
      { who: 'leo', text: 'Each side sent out <b>three</b> horses: a fast one, a medium one and a slow one. There were three races, and whoever won <b>two</b> races won the bet.' },
      { who: 'weiming', mood: 'think', text: 'But the king\'s horses were each a little faster than Tian Ji\'s horse of the <b>same kind</b>. Racing fast against fast, medium against medium and slow against slow, Tian Ji lost every time!',
        art: () => matchTable([['fast', 'fast', 'King'], ['medium', 'medium', 'King'], ['slow', 'slow', 'King']], 'Tian Ji loses 0 – 3.') },
      { who: 'arjun', text: 'Tian Ji\'s friend, the strategist <b>Sun Bin</b>, noticed something: Tian Ji\'s <b>fast</b> horse could beat the king\'s <b>medium</b> horse, and Tian Ji\'s <b>medium</b> horse could beat the king\'s <b>slow</b> horse.' },
      { who: 'leo', text: 'Sun Bin said: "Keep the same horses. Just change the order!" Race your <b>slow</b> horse against the king\'s fast horse. Then race your fast horse against his medium one, and your medium horse against his slow one.',
        art: () => matchTable([['fast', 'slow', 'King'], ['medium', 'fast', 'Tian Ji'], ['slow', 'medium', 'Tian Ji']], 'Tian Ji wins 2 – 1 and wins the bet!') },
      { who: 'chloe', mood: 'think', text: 'Is that the <b>only</b> way to win? Let\'s list all <b>6</b> orders for Tian Ji\'s horses and count the wins:', art: ordersTable },
      { who: 'aisyah', text: 'Only <b>one</b> order wins! The trick: give up the race you can\'t win using your <b>weakest</b> player, so your other players each face someone they <b>can</b> beat. But it only works because Tian Ji knew the king\'s order first.' },
    ],
  },
  keys: [
    { title: 'The story', text: 'Same horses, new order: slow vs fast (lose), fast vs medium (win), medium vs slow (win). Tian Ji won 2 races to 1.' },
    { title: 'Sacrifice the weakest', text: 'Use your weakest player against their strongest. Then each of your stronger players can face someone just a little weaker.' },
    { title: 'List every order', text: '3 players can be arranged in 3 × 2 × 1 = <b>6</b> orders. List them all in a table so you don\'t miss any.' },
    { title: 'Knowing comes first', text: 'The plan works only if you know your opponent\'s order <b>before</b> choosing yours. Information is power!' },
  ],
  practice: [
    { id: 'a', level: 1, type: 'mcq', prompt: 'In Sun Bin\'s plan, which of the king\'s horses raced against Tian Ji\'s <b>slow</b> horse?',
      options: ['The king\'s fast horse', 'The king\'s medium horse', 'The king\'s slow horse', 'None: the slow horse did not race'], answer: 0,
      hint: 'Sun Bin gave up one race on purpose. Which race was Tian Ji sure to lose anyway?',
      solution: 'Tian Ji\'s slow horse raced the king\'s <b>fast</b> horse. That race was lost, but it "used up" the king\'s best horse, so Tian Ji\'s fast and medium horses could win the other two races.' },
    { id: 'b', level: 1, type: 'blanks', prompt: 'How many races did Tian Ji win when he raced fast against fast, medium against medium and slow against slow? How many did he win with Sun Bin\'s plan?',
      template: 'Same kinds: {0} races &nbsp;&nbsp; Sun Bin\'s plan: {1} races', blanks: [{ answer: 0, size: 'sm' }, { answer: 2, size: 'sm' }],
      hint: 'Each of the king\'s horses is a little faster than Tian Ji\'s horse of the same kind.',
      solution: ['Same kinds: the king\'s horse is faster in every race, so Tian Ji wins <b>0</b>.', 'Sun Bin\'s plan: lose slow vs fast, win fast vs medium, win medium vs slow. Tian Ji wins <b>2</b>.'] },
    { id: 'c', level: 1, type: 'blanks', prompt: 'The king always sends out his horses in the order fast, medium, slow. In how many different orders can Tian Ji send out his <b>3</b> horses?',
      template: '{0} orders', blanks: [{ answer: 6, size: 'sm' }],
      hint: 'How many choices are there for the first race? Then for the second race? Then the third?',
      solution: ['First race: 3 choices. Second race: 2 horses are left. Third race: 1 horse is left.', '3 × 2 × 1 = <b>6</b> orders: FMS, FSM, MFS, MSF, SFM, SMF (F = fast, M = medium, S = slow).'] },
    { id: 'd', level: 2, type: 'blanks', prompt: 'Look at all 6 orders. In how many of them does Tian Ji win <b>at least 2</b> races? (Remember: his fast horse beats the king\'s medium and slow horses, and his medium horse beats only the king\'s slow horse. His slow horse beats none of the king\'s horses.)',
      template: '{0} orders', blanks: [{ answer: 1, size: 'sm' }],
      hint: 'Make a table of the 6 orders. For each race, decide who wins.',
      solution: ['List every order against the king\'s fast · medium · slow:', ordersTable(), 'Only <b>1</b> order (slow, fast, medium) wins 2 races. Every other order wins 1 race at most.'] },
    { id: 'e', level: 2, type: 'mcq', prompt: 'The king finds out about the trick. Next time, he insists on seeing Tian Ji\'s order <b>first</b>, and then chooses his own order. What is the greatest number of races Tian Ji can be <b>sure</b> to win?',
      options: ['0', '1', '2', '3'], answer: 0,
      hint: 'If you could see your opponent\'s order first, how would you match your horses?',
      solution: ['Whatever order Tian Ji chooses, the king can race fast vs fast, medium vs medium and slow vs slow.', 'Each of the king\'s horses beats Tian Ji\'s horse of the same kind, so Tian Ji can be sure of <b>0</b> wins.', 'The trick works only for the side that knows the other side\'s order first!'] },
    { id: 'f', level: 2, type: 'blanks', prompt: 'At the inter-school Chess Challenge at the community centre, Sunrise Primary puts its <b>strongest</b> player on Board 1, its second-strongest on Board 2 and its third-strongest on Board 3. A win on Board 1 earns <b>3 points</b>, on Board 2 <b>2 points</b> and on Board 3 <b>1 point</b>.<br>Our school\'s team: Ravi is a little weaker than their strongest player but stronger than their second-strongest. Mei Ling is a little weaker than their second-strongest but stronger than their third-strongest. Farah is a little weaker than their third-strongest. What is the <b>greatest</b> number of points our team can earn?',
      template: '{0} points', blanks: [{ answer: 3, size: 'sm' }],
      hint: 'Nobody in our team can beat Board 1. Who should we "give up" there?',
      solution: ['No one in our team can beat their strongest player, so the 3 points on Board 1 are lost anyway. Send Farah (our weakest) there.', 'Board 2: Ravi beats their second-strongest → 2 points.', 'Board 3: Mei Ling beats their third-strongest → 1 point.', 'Total: 2 + 1 = <b>3 points</b>, the most possible, since Board 1 cannot be won.'] },
    { id: 'g', level: 2, type: 'mcq', prompt: 'While visiting Chloe\'s family at Chinese New Year, Hafiz and Chloe play "higher card wins". Hafiz lays down his cards in this order: <b>7</b>, then <b>4</b>, then <b>11</b>. Chloe holds <b>12</b>, <b>8</b> and <b>5</b>, and plays one card against each of his. In which order should Chloe play to win <b>all three</b> rounds?',
      art: svg('0 0 300 200', `<text x="0" y="44" ${NUM} font-size="16" fill="${A.ink}">Hafiz</text>${[7, 4, 11].map((n, i) => card(84 + i * 74, 4, n, TJ)).join('')}
        ${['round 1', 'round 2', 'round 3'].map((t, i) => `<text x="${110 + i * 74}" y="98" text-anchor="middle" ${NUM} font-size="13" fill="#56627a">${t}</text>`).join('')}
        <text x="0" y="158" ${NUM} font-size="16" fill="${A.ink}">Chloe</text><text x="0" y="178" ${NUM} font-size="12" fill="#56627a">(any order)</text>${[12, 8, 5].map((n, i) => card(84 + i * 74, 116, n, KG)).join('')}`, 'Hafiz plays 7, then 4, then 11; Chloe holds 12, 8 and 5', 'style="max-width:300px"'),
      options: ['12, 8, 5', '8, 5, 12', '5, 8, 12', '12, 5, 8'], answer: 1,
      hint: 'Which of Hafiz\'s cards is the hardest to beat? Only one of Chloe\'s cards can beat it. Then use the smallest card that still wins each other round.',
      solution: ['Only Chloe\'s 12 beats Hafiz\'s 11, so save the 12 for round 3.', 'Round 1 (Hafiz 7): the 8 wins. Round 2 (Hafiz 4): the 5 wins.', 'So Chloe plays <b>8, 5, 12</b> and wins all three rounds: 8 &gt; 7, 5 &gt; 4, 12 &gt; 11.', 'Playing 12 first "wastes" it on a card that the 8 could have beaten.'] },
    { id: 'h', level: 3, type: 'blanks', prompt: 'Same cards as before: Hafiz plays <b>7, 4, 11</b> in that order, and Chloe holds <b>12, 8, 5</b>. Chloe could play her cards in 6 different orders. In how many of these orders does she win <b>at least 2</b> rounds?',
      template: '{0} orders', blanks: [{ answer: 5, size: 'sm' }],
      hint: 'List all 6 orders in a table and mark each round ✓ or ✗.',
      solution: ['Against Hafiz\'s 7 · 4 · 11:',
        '<table class="tbl"><thead><tr><th>Chloe plays</th><th>Rounds won</th></tr></thead><tbody><tr><td>12 ✓ · 8 ✓ · 5 ✗</td><td class="hl">2</td></tr><tr><td>12 ✓ · 5 ✓ · 8 ✗</td><td class="hl">2</td></tr><tr><td>8 ✓ · 12 ✓ · 5 ✗</td><td class="hl">2</td></tr><tr><td>8 ✓ · 5 ✓ · 12 ✓</td><td class="hl">3</td></tr><tr><td>5 ✗ · 12 ✓ · 8 ✗</td><td>1</td></tr><tr><td>5 ✗ · 8 ✓ · 12 ✓</td><td class="hl">2</td></tr></tbody></table>',
        'So <b>5</b> of the 6 orders win at least 2 rounds. Only playing the 5 against the 7 and keeping the 12 away from the 11 loses.'] },
    { id: 'i', level: 3, type: 'blanks', prompt: 'Sports Day "pair race": the Red House and the Blue House each send <b>4</b> runners. Each Blue runner races one Red runner, and the faster runner (the <b>smaller</b> time) wins. Red has announced its order (from race 1 to race 4) and Blue may choose its own. What is the <b>greatest</b> number of races Blue can win?',
      art: `<table class="tbl"><thead><tr><th>Team</th><th colspan="4">50 m times in seconds (Red: races 1 to 4 in order)</th></tr></thead><tbody><tr><th style="color:${KG}">Red</th><td>11.8</td><td>12.6</td><td>13.4</td><td>14.5</td></tr><tr><th style="color:${TJ}">Blue</th><td>12.2</td><td>13.0</td><td>13.9</td><td>14.8</td></tr></tbody></table>`,
      template: '{0} races', blanks: [{ answer: 3, size: 'sm' }],
      hint: 'A smaller time is faster. Can any Blue runner beat 11.8 s? If not, who should run against that Red runner?',
      solution: ['No Blue runner is faster than 11.8 s, so race 1 is lost whatever happens. Use Blue\'s slowest runner (14.8 s) there, just like Tian Ji\'s slow horse.', 'Race 2 (12.6 s): 12.2 s wins. Race 3 (13.4 s): 13.0 s wins. Race 4 (14.5 s): 13.9 s wins.', 'Blue wins <b>3</b> races. Winning all 4 is impossible, because nobody can beat 11.8 s.'] },
  ],
  adult: 'This "Maths Story" retells a famous episode recorded by the Han dynasty historian Sima Qian: General Tian Ji, King Wei of Qi and the strategist Sun Bin (4th century BC). The maths behind it is <b>enrichment</b>: listing all arrangements (3 × 2 × 1 = 6) and comparing outcomes systematically. Common mistakes: counting only some orders, and forgetting that the strategy depends on knowing the opponent\'s order first (question 5). Ask your child: "When is it wise to give up one small thing to win something bigger?"',
};

// Puzzle specs used by tools/verify/unit4b.py (the explore puzzles; practice puzzles carry their own `puz`).
export const EXPLORE_PUZZLES = { t12: { kind: 'mul', ...t12ex, answer: { a: 4, b: 8, c: 5 } }, t13: { kind: 'div', ...t13ex, answer: { a: 8, b: 0, c: 6, d: 3, e: 0 } } };

export default { t12, t13, S1 };
