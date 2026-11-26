// Unit 2 · Calculation Power — original content, Singapore context.
import * as A from '../art.js';
const { svg, kid, leo } = A;
const INK = A.ink, S = A.stroke;
const HEAD = 'font-family="Baloo 2, sans-serif" font-weight="800"';
const BODY = 'font-family="Nunito, sans-serif" font-weight="800"';

const v = s => `<i>${s}</i>`;                                         // italic letter
// a number written with letters for digits, e.g. ov('abc') -> abc with a bar on top
const ov = s => `<span style="text-decoration:overline;white-space:nowrap">${[...s].map(c => /[a-z]/.test(c) ? `<i>${c}</i>` : c).join('')}</span>`;

/* ---------- unit helpers (same flat style as art.js) ---------- */

// Area model: a rectangle `rows` tall, split into column blocks.
// cols: [{ top: '100', w: 200, fill, text: '15 × 100', sub: '= 1500' }]
// cut: optional { w, top, text, sub } drawn as a hatched strip taken away from the right of the last block
function area(rows, cols, { cut = null, label = '', max = 420, h = 96, total = '' } = {}) {
  const x0 = 58, y0 = 38, pid = 'hatch' + Math.random().toString(36).slice(2, 7);
  let x = x0, g = '';
  cols.forEach(c => {
    g += `<rect x="${x}" y="${y0}" width="${c.w}" height="${h}" fill="${c.fill}" ${S}/>`;
    g += `<text x="${x + c.w / 2}" y="${y0 - 12}" text-anchor="middle" ${HEAD} font-size="18" fill="${INK}">${c.top}</text>`;
    g += `<text x="${x + c.w / 2}" y="${y0 + h / 2 - (c.sub ? 4 : -6)}" text-anchor="middle" ${BODY} font-size="${c.w < 90 ? 14 : 16}" fill="${INK}">${c.text}</text>`;
    if (c.sub) g += `<text x="${x + c.w / 2}" y="${y0 + h / 2 + 18}" text-anchor="middle" ${HEAD} font-size="18" fill="${INK}">${c.sub}</text>`;
    x += c.w;
  });
  if (cut) {
    const cx = x - cut.w;
    g += `<defs><pattern id="${pid}" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="10" height="10" fill="#fff"/><line x1="0" y1="0" x2="0" y2="10" stroke="#ff6b5b" stroke-width="4"/></pattern></defs>
      <rect x="${cx}" y="${y0}" width="${cut.w}" height="${h}" fill="url(#${pid})" stroke="#d6453a" stroke-width="3" stroke-dasharray="7 5"/>
      <text x="${cx + cut.w / 2}" y="${y0 + h + 24}" text-anchor="middle" ${HEAD} font-size="17" fill="#d6453a">${cut.top}</text>
      <text x="${cx + cut.w / 2}" y="${y0 + h + 44}" text-anchor="middle" ${BODY} font-size="14" fill="#d6453a">${cut.text}</text>`;
  }
  g += `<text x="${x0 - 12}" y="${y0 + h / 2 + 7}" text-anchor="end" ${HEAD} font-size="20" fill="${INK}">${rows}</text>`;
  if (total) g += `<text x="${(x0 + x) / 2}" y="${y0 + h + (cut ? 72 : 30)}" text-anchor="middle" ${HEAD} font-size="18" fill="#0f7a73">${total}</text>`;
  const W = x + 16, H = y0 + h + (cut ? (total ? 84 : 54) : (total ? 42 : 14));
  return svg(`0 0 ${W} ${H}`, g, label, `style="max-width:${max}px"`);
}

// T-shirt prop
function tee(x, y, s = 1, c = '#4aa8ff') {
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-14 -30 l-26 12 l9 20 l11 -5 v38 h40 v-38 l11 5 l9 -20 l-26 -12 q-14 12 -28 0z" fill="${c}" ${S}/>
    <path d="M-14 -30 q14 12 28 0" fill="none" stroke="#fff" stroke-width="3"/></g>`;
}
// price tag prop
function tag(x, y, text, c = '#ffc94a') {
  return `<g transform="translate(${x} ${y}) rotate(-8)"><path d="M0 0 h70 l16 18 l-16 18 h-70z" fill="${c}" ${S}/><circle cx="72" cy="18" r="4" fill="#fff" ${S} stroke-width="2"/>
    <text x="34" y="25" text-anchor="middle" ${HEAD} font-size="18" fill="${INK}">${text}</text></g>`;
}
// a row of digit cards; returns raw group markup
function cards(digits, x, y, { w = 46, gap = 12, colors = ['#ffc94a', '#4aa8ff', '#ff8fb1', '#3dbb6b', '#b7a8ff'], tilt = true } = {}) {
  return digits.map((d, i) => `<g transform="translate(${x + i * (w + gap)} ${y}) rotate(${tilt ? [-5, 4, -3, 6, -4][i % 5] : 0} ${w / 2} ${w * .65})">
    <rect width="${w}" height="${w * 1.3}" rx="9" fill="#fff" ${S}/><rect x="5" y="5" width="${w - 10}" height="${w * 1.3 - 10}" rx="6" fill="${colors[i % colors.length]}" opacity=".35"/>
    <text x="${w / 2}" y="${w * .9}" text-anchor="middle" ${HEAD} font-size="${w * .62}" fill="${INK}">${d}</text></g>`).join('');
}
const cardSvg = (digits, label) => {
  const W = digits.length * 58 + 20;
  return svg(`0 0 ${W} 84`, cards(digits, 14, 10), label, `style="max-width:${W * 1.1}px"`);
};
// place-value chart: heads e.g. ['Th','H','T','O'], rows of digits; hi = [row, col] cells to highlight
function pvChart(heads, rows, { hi = [], label = 'Place-value chart', max = 360 } = {}) {
  const cw = 64, rh = 46, x0 = 10, y0 = 10;
  const colours = ['#7b61ff', '#0f9d94', '#ff6b5b', '#f2a516', '#4aa8ff', '#3dbb6b'];
  let g = '';
  heads.forEach((hd, i) => {
    const c = colours[(heads.length - 1 - i) % colours.length];
    g += `<rect x="${x0 + i * cw}" y="${y0}" width="${cw}" height="${rh - 6}" fill="${c}" ${S} stroke-width="2.5"/>
      <text x="${x0 + i * cw + cw / 2}" y="${y0 + 27}" text-anchor="middle" ${HEAD} font-size="${hd.length > 3 ? 14 : 17}" fill="#fff">${hd}</text>`;
  });
  rows.forEach((r, j) => r.forEach((d, i) => {
    const on = hi.some(([a, b]) => a === j && b === i);
    g += `<rect x="${x0 + i * cw}" y="${y0 + rh - 6 + j * rh}" width="${cw}" height="${rh}" fill="${on ? '#ffe9a8' : '#fff'}" ${S} stroke-width="2.5"/>
      <text x="${x0 + i * cw + cw / 2}" y="${y0 + rh - 6 + j * rh + 32}" text-anchor="middle" ${HEAD} font-size="24" fill="${INK}">${d}</text>`;
  }));
  const W = x0 * 2 + heads.length * cw, H = y0 * 2 + rh - 6 + rows.length * rh;
  return svg(`0 0 ${W} ${H}`, g, label, `style="max-width:${max}px"`);
}

/* ===================== Topic 5 ===================== */
const t05art = () => svg('0 0 360 220', `<rect width="360" height="220" rx="20" fill="#e8f4ff"/>
  <rect x="18" y="18" width="250" height="150" rx="14" fill="#2f5d50" ${S}/><rect x="26" y="26" width="234" height="134" rx="9" fill="#356b5c"/>
  <text x="143" y="52" text-anchor="middle" ${HEAD} font-size="20" fill="#fff">16 × 102</text>
  <rect x="44" y="66" width="150" height="62" fill="#0f9d94" stroke="#fff" stroke-width="3"/><rect x="194" y="66" width="34" height="62" fill="#ff6b5b" stroke="#fff" stroke-width="3"/>
  <text x="119" y="104" text-anchor="middle" ${BODY} font-size="16" fill="#fff">16 × 100</text>
  <text x="211" y="96" text-anchor="middle" ${BODY} font-size="12" fill="#fff">16</text><text x="211" y="111" text-anchor="middle" ${BODY} font-size="12" fill="#fff">× 2</text>
  <text x="143" y="150" text-anchor="middle" ${HEAD} font-size="19" fill="#ffe27a">1600 + 32 = 1632</text>
  <rect x="60" y="168" width="166" height="10" rx="4" fill="#c98b55" ${S}/>
  ${leo({ x: 312, y: 96, s: .58, pose: 'point' })}
  <text x="300" y="206" text-anchor="middle" ${HEAD} font-size="15" fill="#0f7a73">No calculator!</text>`, 'A chalkboard shows 16 × 102 split into 16 × 100 and 16 × 2');

const t05 = {
  id: 't05',
  title: 'Smart Multiplication with the Distributive Law',
  intro: 'Can you work out 15 × 104 in your head? Break a tricky number into friendly parts, and big multiplications become easy!',
  skills: ['Multiplication', 'Mental maths', 'Number sense'],
  art: t05art,
  explore: {
    setup: 'For Sports Day, the school orders house T-shirts for the P4 pupils. Each T-shirt costs <b>$15</b>. Wei Ming is helping Mrs Pillai check the bills, but nobody has a calculator!',
    art: () => svg('0 0 340 300', `<rect width="340" height="300" rx="20" fill="#fff6e4"/>
      <path d="M0 0 h340 v52 h-340z" fill="#ffe0a3"/><path d="M14 52 h312" stroke="#ff6b5b" stroke-width="8" stroke-dasharray="22 12"/>
      <text x="170" y="36" text-anchor="middle" ${HEAD} font-size="22" fill="${INK}">SPORTS DAY</text>
      ${A.table(108, 224, 220)}
      ${tee(150, 199, .8, '#ff6b5b')}${tee(218, 199, .8, '#4aa8ff')}${tee(286, 199, .8, '#3dbb6b')}
      ${tag(222, 96, '$15')}
      <path d="M22 70 h130 q10 0 10 10 v22 q0 10 -10 10 h-96 l-14 12 l2 -12 h-22 q-10 0 -10 -10 v-22 q0 -10 10 -10z" fill="#fff" ${S}/>
      <text x="87" y="98" text-anchor="middle" ${HEAD} font-size="16" fill="${INK}">104 × $15 = ?</text>
      ${kid('weiming', { x: 64, y: 170, s: .82, mood: 'think', pose: 'think' })}`, 'Wei Ming thinking beside stacks of house T-shirts priced at $15 each'),
    steps: [
      { who: 'weiming', mood: 'think', text: 'The first bill is for <b>104</b> T-shirts at $15 each… 15 × 104. That looks hard to do in my head!' },
      { who: 'leo', mood: 'teach', text: 'Break 104 into friendly parts: <b>104 = 100 + 4</b>. Pay for 100 shirts, then pay for 4 more shirts, and add.',
        art: () => area(15, [{ top: '100', w: 220, fill: '#bfe9e6', text: '15 × 100', sub: '= 1500' }, { top: '+ 4', w: 70, fill: '#ffd0ca', text: '15 × 4', sub: '= 60' }], { total: '15 × 104 = 1500 + 60 = 1560', label: 'Area model: 15 × 104 split into 15 × 100 and 15 × 4' }) },
      { who: 'aisyah', text: 'So the bill is <b>$1560</b>. We split the <b>104</b>, but the <b>15</b> had to multiply <b>both</b> parts.' },
      { who: 'chloe', mood: 'think', text: 'Class 4B ordered <b>98</b> T-shirts. 98 is not 100 + something…' },
      { who: 'leo', mood: 'teach', text: 'But 98 is <b>100 − 2</b>! Pretend you bought 100 shirts, then take away the 2 extra shirts.',
        art: () => area(15, [{ top: '100', w: 290, fill: '#bfe9e6', text: '15 × 100 = 1500' }], { cut: { w: 64, top: '− 2', text: '15 × 2 = 30' }, total: '15 × 98 = 1500 − 30 = 1470', label: 'Area model: 15 × 100 with a strip of 15 × 2 taken away' }) },
      { who: 'arjun', text: 'It works backwards too! Another bill: the Red House got <b>37</b> shirts and the Blue House got <b>63</b> shirts, all at $15. 15 × 37 + 15 × 63 = 15 × (37 + 63) = 15 × 100 = <b>$1500</b>. Same 15, so I just add 37 + 63 first.' },
      { who: 'leo', text: 'That is the <b>distributive law</b>: 15 × (100 + 4) = 15 × 100 + 15 × 4. Look for a number close to a hundred, or a number that is shared by both parts. Then let the friendly numbers do the work!' },
    ],
  },
  keys: [
    { title: 'Split into friendly parts', text: '12 × 103 = 12 × 100 + 12 × 3 = 1200 + 36 = 1236. Multiply <b>every</b> part, not just the first one.' },
    { title: 'Just under a hundred? Subtract', text: '13 × 99 = 13 × 100 − 13 × 1 = 1300 − 13 = 1287' },
    { title: 'Spot the shared number', text: '27 × 46 + 27 × 54 = 27 × (46 + 54) = 27 × 100 = 2700' },
    { title: 'Make a shared number', text: '14 × 32 + 28 × 34: since 28 = 14 × 2, 28 × 34 = 14 × 68. So it is 14 × (32 + 68) = 14 × 100 = 1400' },
  ],
  practice: [
    { id: 'a', level: 1, type: 'mcq', prompt: 'Which of these is the same as <b>23 × 104</b>?',
      options: ['23 × 100 + 23 × 4', '23 × 100 + 4', '23 × 10 + 23 × 4', '23 × 100 × 4'], answer: 0,
      hint: '104 = 100 + 4. The 23 must multiply <b>both</b> parts.',
      solution: ['104 = 100 + 4', 'So 23 × 104 = 23 × 100 + 23 × 4 = 2300 + 92 = 2392.', '"23 × 100 + 4" forgets to multiply the 4 by 23. "23 × 10" uses the wrong place value. "23 × 100 × 4" multiplies instead of adding.', 'The answer is <b>23 × 100 + 23 × 4</b>.'] },
    { id: 'b', level: 1, type: 'blanks', prompt: 'Use the diagram to work out <b>18 × 102</b>.',
      art: area(18, [{ top: '100', w: 220, fill: '#bfe9e6', text: '18 × 100' }, { top: '+ 2', w: 66, fill: '#ffd0ca', text: '18 × 2' }], { label: 'Area model: 18 × 102 split into 18 × 100 and 18 × 2', max: 380 }),
      template: '18 × 102 = 18 × 100 + 18 × {0}<br>= {1} + {2}<br>= {3}', blanks: [{ answer: 2, size: 'sm' }, { answer: 1800 }, { answer: 36 }, { answer: 1836 }],
      hint: '102 = 100 + 2. Work out each block of the diagram, then add.',
      solution: ['102 = 100 + 2', '18 × 100 = 1800', '18 × 2 = 36', '1800 + 36 = <b>1836</b>'] },
    { id: 'c', level: 1, type: 'blanks', prompt: 'A storybook costs <b>$8</b>. The school library buys <b>99</b> copies. How much does the library pay? Try the smart way: 99 = 100 − 1.',
      template: 'The library pays ${0}.', blanks: [{ answer: 792 }],
      hint: 'How much would 100 copies cost? Then take away the cost of 1 copy.',
      solution: ['8 × 99 = 8 × 100 − 8 × 1', '= 800 − 8', '= 792', 'The library pays <b>$792</b>.'] },
    { id: 'd', level: 2, type: 'compare', prompt: 'Compare. Choose &lt;, = or &gt;. Use smart splitting, not long multiplication!',
      pairs: [['37 × 101', '3737', '='], ['46 × 99', '4600 − 99', '>'], ['26 × 104', '2600 + 4', '>'], ['48 × 98', '4800 − 96', '=']],
      hint: 'Split the number near 100. For example, 37 × 101 = 37 × 100 + 37 × 1.',
      solution: ['37 × 101 = 3700 + 37 = 3737, so they are <b>equal</b>.', '46 × 99 = 4600 − <b>46</b> = 4554, but 4600 − 99 = 4501. So 46 × 99 <b>&gt;</b> 4600 − 99.', '26 × 104 = 2600 + <b>104</b> = 2704, but 2600 + 4 = 2604. So 26 × 104 <b>&gt;</b> 2600 + 4.', '48 × 98 = 4800 − 48 × 2 = 4800 − 96, so they are <b>equal</b>.'] },
    { id: 'e', level: 2, type: 'blanks', prompt: 'A bakery packs curry puffs in boxes of <b>24</b>. On Saturday it sold <b>46</b> boxes, and on Sunday it sold <b>54</b> boxes. How many curry puffs did it sell altogether?',
      template: '{0} curry puffs', blanks: [{ answer: 2400 }],
      hint: 'Both days are boxes of 24. How many boxes were sold altogether?',
      solution: ['24 × 46 + 24 × 54 = 24 × (46 + 54)', '= 24 × 100', '= <b>2400</b> curry puffs'] },
    { id: 'f', level: 2, type: 'blanks', prompt: 'Work out the smart way: <b>16 × 58 + 32 × 21</b>',
      template: '16 × 58 + 32 × 21 = {0}', blanks: [{ answer: 1600 }],
      hint: '32 = 16 × 2. Can you rewrite 32 × 21 as 16 × something?',
      solution: ['32 × 21 = 16 × 2 × 21 = 16 × 42', 'So 16 × 58 + 32 × 21 = 16 × 58 + 16 × 42', '= 16 × (58 + 42) = 16 × 100', '= <b>1600</b>'] },
    { id: 'g', level: 3, type: 'blanks', prompt: 'Work out the smart way: <b>45 × 128 − 15 × 84</b>',
      template: '45 × 128 − 15 × 84 = {0}', blanks: [{ answer: 4500 }],
      hint: '45 = 15 × 3. Try to turn 15 × 84 into 45 × something.',
      solution: ['84 = 3 × 28, so 15 × 84 = 15 × 3 × 28 = 45 × 28', '45 × 128 − 45 × 28 = 45 × (128 − 28)', '= 45 × 100', '= <b>4500</b>'] },
    { id: 'h', level: 3, type: 'blanks', prompt: 'Work out the smart way: <b>4444 × 27 + 3333 × 64</b>',
      template: '4444 × 27 + 3333 × 64 = {0}', blanks: [{ answer: 333300 }],
      hint: '4444 = 1111 × 4 and 3333 = 1111 × 3. Can you make 1111 the shared number?',
      solution: ['4444 × 27 = 1111 × 4 × 27 = 1111 × 108', '3333 × 64 = 1111 × 3 × 64 = 1111 × 192', 'So the sum is 1111 × (108 + 192) = 1111 × 300', '= <b>333 300</b>'] },
    { id: 'i', level: 3, type: 'mcq', prompt: '<b>A</b> = 2468 × 1357 and <b>B</b> = 2467 × 1358. Which is true?',
      options: ['A and B are equal.', 'A is bigger by 1.', 'A is bigger by 1110.', 'B is bigger by 1110.'], answer: 3,
      hint: 'Write 2468 as 2467 + 1, and 1358 as 1357 + 1. Then split both products.',
      solution: ['A = (2467 + 1) × 1357 = 2467 × 1357 + <b>1357</b>', 'B = 2467 × (1357 + 1) = 2467 × 1357 + <b>2467</b>', 'Both have the same part 2467 × 1357, so compare what is left: 2467 &gt; 1357.', 'B is bigger by 2467 − 1357 = 1110. The answer is <b>B is bigger by 1110</b>.'] },
  ],
  adult: 'Links to school work: P4 multiplication (up to 4 digits by 1 digit and 3 digits by 2 digits) and mental calculation. Splitting a number to multiply is <b>within</b> P4, but naming the distributive law and "factoring out" a shared number (questions e to i) is <b>enrichment</b>. Common mistakes: multiplying only one part (23 × 104 = 2300 + 4), and taking away the wrong amount (46 × 99 = 4600 − 99 instead of 4600 − 46). Encourage your child to draw a quick area model (a rectangle split into blocks) when unsure.',
};

/* ===================== Topic 6 ===================== */
const t06art = () => svg('0 0 360 220', `<rect width="360" height="220" rx="20" fill="#f1edff"/>
  <text x="180" y="34" text-anchor="middle" ${HEAD} font-size="19" fill="${INK}">Same digit, different value!</text>
  ${['Th', 'H', 'T', 'O'].map((h, i) => `<rect x="${36 + i * 74}" y="46" width="66" height="30" rx="8" fill="${['#ff6b5b', '#f2a516', '#0f9d94', '#4aa8ff'][i]}" ${S} stroke-width="2.5"/>
    <text x="${69 + i * 74}" y="67" text-anchor="middle" ${HEAD} font-size="16" fill="#fff">${h}</text>`).join('')}
  ${cards([7, 7, 7, 7], 45, 84, { w: 48, gap: 26, tilt: false })}
  ${['7000', '700', '70', '7'].map((t, i) => `<path d="M${69 + i * 74} 152 v16" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><path d="M${63 + i * 74} 163 l6 7 l6 -7" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="${38 + i * 74}" y="174" width="62" height="30" rx="15" fill="#fff" ${S} stroke-width="2.5"/><text x="${69 + i * 74}" y="195" text-anchor="middle" ${HEAD} font-size="17" fill="${['#d6453a', '#b9780b', '#0f7a73', '#2a7fd4'][i]}">${t}</text>`).join('')}`,
  'Four digit cards all showing 7, in the thousands, hundreds, tens and ones places, worth 7000, 700, 70 and 7');

const rotTable = () => `<table class="tbl"><thead><tr><th>Number</th><th>H</th><th>T</th><th>O</th></tr></thead><tbody>
  <tr><th>472</th><td class="hl">4</td><td>7</td><td>2</td></tr>
  <tr><th>724</th><td>7</td><td>2</td><td class="hl">4</td></tr>
  <tr><th>247</th><td>2</td><td class="hl">4</td><td>7</td></tr></tbody></table>
  <small>(H = hundreds, T = tens, O = ones.) The 4 appears once in <b>every</b> column: 400 + 40 + 4 = 444 = 4 × 111. The same happens to the 7 and the 2.</small>`;

const t06 = {
  id: 't06',
  title: 'Place Value Puzzles',
  intro: 'A 7 can be worth 7, 70, 700 or even 7000. It all depends on where it sits! Use place value to crack number tricks and digit puzzles.',
  skills: ['Place value', 'Digit puzzles', 'Reasoning'],
  art: t06art,
  explore: {
    setup: 'At the community centre\'s Family Day, Arjun runs a "Maths Magic" booth. He asks Chloe to choose <b>three different digit cards</b>.',
    art: () => svg('0 0 340 300', `<rect width="340" height="300" rx="20" fill="#eafaf0"/>
      <rect x="70" y="14" width="200" height="40" rx="10" fill="#7b61ff" ${S}/><text x="170" y="41" text-anchor="middle" ${HEAD} font-size="20" fill="#fff">MATHS MAGIC ✨</text>
      <rect x="78" y="76" width="184" height="36" rx="18" fill="#fff" ${S}/>
      <text x="170" y="100" text-anchor="middle" ${HEAD} font-size="17" fill="${INK}">472 + 724 + 247 = ?</text>
      <path d="M0 262 h340 v18 q0 20 -20 20 h-300 q-20 0 -20 -20z" fill="#cdebd6"/>
      ${A.table(92, 220, 156)}
      ${cards([4, 7, 2], 104, 170, { w: 36, gap: 12 })}
      ${kid('arjun', { x: 48, y: 160, s: .85, pose: 'wave' })}${kid('chloe', { x: 292, y: 160, s: .85, mood: 'think', pose: 'think', flip: true })}`, 'Arjun and Chloe at a Maths Magic booth with digit cards 4, 7 and 2'),
    steps: [
      { who: 'arjun', text: 'Chloe picked <b>4, 7 and 2</b>. Make a number, then move the first digit to the back, twice: <b>472, 724, 247</b>. Add them up, and I\'ll tell you the answer before you finish!' },
      { who: 'chloe', mood: 'think', text: '472 + 724 + 247 = <b>1443</b>. But how did you know so fast?' },
      { who: 'leo', mood: 'teach', text: 'The secret is <b>place value</b>. The value of a digit = the digit × the value of its place. Look at where each digit sits:', art: rotTable },
      { who: 'aisyah', text: 'So the total is 444 + 777 + 222 = 111 × (4 + 7 + 2) = 111 × 13 = <b>1443</b>. Arjun only had to add the digits and multiply by 111!' },
      { who: 'leo', mood: 'teach', text: 'When we don\'t know the digits, we use letters with a bar on top. ' + ov('abc') + ' means the 3-digit number with digits ' + v('a') + ', ' + v('b') + ', ' + v('c') + '. So ' + ov('abc') + ' = 100 × ' + v('a') + ' + 10 × ' + v('b') + ' + ' + v('c') + '. It does <b>not</b> mean ' + v('a') + ' × ' + v('b') + ' × ' + v('c') + '!' },
      { who: 'weiming', text: 'We can also split a number into <b>groups</b> of digits: 4725 = 47 × 100 + 25, or 472 × 10 + 5. Just never skip a place!' },
    ],
  },
  keys: [
    { title: 'Value = digit × place', text: 'In 3582, the 5 is in the hundreds place, so it stands for 5 × 100 = 500.' },
    { title: 'Split fully or in groups', text: '6094 = 6 × 1000 + 0 × 100 + 9 × 10 + 4 = 60 × 100 + 94 = 609 × 10 + 4' },
    { title: 'Letters for digits', text: ov('ab') + ' = 10 × ' + v('a') + ' + ' + v('b') + ' and ' + ov('abc') + ' = 100 × ' + v('a') + ' + 10 × ' + v('b') + ' + ' + v('c') + '. Then collect the same letters together.' },
    { title: 'The 111 trick', text: ov('abc') + ' + ' + ov('bca') + ' + ' + ov('cab') + ' = 111 × (' + v('a') + ' + ' + v('b') + ' + ' + v('c') + '), because every digit visits every place once.' },
  ],
  practice: [
    { id: 'a', level: 1, type: 'blanks', prompt: 'Look at the number <b>52 947</b>. What does each digit stand for?',
      art: pvChart(['TTh', 'Th', 'H', 'T', 'O'], [[5, 2, 9, 4, 7]], { label: 'Place-value chart for 52 947', max: 340 }),
      template: 'The digit 2 stands for {0}.<br>The digit 9 stands for {1}.<br>The digit 4 stands for {2}.', blanks: [{ answer: 2000 }, { answer: 900 }, { answer: 40 }],
      hint: 'Find each digit\'s column in the chart. Value = digit × the value of its place.',
      solution: ['2 is in the thousands place: 2 × 1000 = <b>2000</b>', '9 is in the hundreds place: 9 × 100 = <b>900</b>', '4 is in the tens place: 4 × 10 = <b>40</b>'] },
    { id: 'b', level: 1, type: 'mcq', prompt: 'Which of these are equal to <b>5608</b>?',
      options: ['5 × 1000 + 6 × 100 + 8', '56 × 100 + 8', '56 × 10 + 8', '5 × 1000 + 6 × 10 + 8', '560 × 10 + 8'], answer: [0, 1, 4],
      hint: 'Work out each one. Watch the place value of the 6 carefully.',
      solution: ['5000 + 600 + 8 = 5608 ✓', '5600 + 8 = 5608 ✓', '560 + 8 = 568 ✗', '5000 + 60 + 8 = 5068 ✗', '5600 + 8 = 5608 ✓'] },
    { id: 'c', level: 1, type: 'blanks', prompt: 'Use all four digit cards, once each, to make 4-digit numbers.',
      art: cardSvg([0, 3, 7, 5], 'Digit cards 0, 3, 7 and 5'),
      template: 'The largest number is {0}.<br>The smallest number is {1}.', blanks: [{ answer: 7530 }, { answer: 3057 }],
      hint: 'For the largest, put the biggest digit in the biggest place. For the smallest, remember a 4-digit number cannot start with 0.',
      solution: ['Largest: digits from biggest to smallest, 7, 5, 3, 0, gives <b>7530</b>.', 'Smallest: 0 cannot go first, so start with the smallest non-zero digit, 3. Then 0, 5, 7.', 'The smallest is <b>3057</b>.'] },
    { id: 'd', level: 2, type: 'blanks', prompt: 'Priya uses the digit cards 2, 5 and 8 to make 258, 582 and 825. Use the 111 trick to find their sum.',
      template: '258 + 582 + 825 = 111 × {0} = {1}', blanks: [{ answer: 15 }, { answer: 1665 }],
      hint: 'Each digit appears once in the hundreds, once in the tens and once in the ones place.',
      solution: ['The 2 gives 200 + 20 + 2 = 222 = 2 × 111. The same happens for 5 and 8.', 'So the sum is 111 × (2 + 5 + 8) = 111 × 15', '= <b>1665</b>'] },
    { id: 'e', level: 2, type: 'blanks', prompt: 'Hafiz writes a 2-digit number. Its two digits add up to <b>11</b>. When he swaps the two digits, the new number is <b>27 more</b> than his number. What is Hafiz\'s number?',
      template: 'Hafiz\'s number is {0}.', blanks: [{ answer: 47 }],
      hint: 'Swapping the digits of ' + ov('ab') + ' gives ' + ov('ba') + '. Each 1 of difference between the digits changes the number by 9.',
      solution: ['Let Hafiz\'s number be ' + ov('ab') + ', with tens digit ' + v('a') + ' and ones digit ' + v('b') + '. Swapped, it becomes ' + ov('ba') + '.', ov('ba') + ' − ' + ov('ab') + ' = (10' + v('b') + ' + ' + v('a') + ') − (10' + v('a') + ' + ' + v('b') + ') = 9 × (' + v('b') + ' − ' + v('a') + ')', '9 × (' + v('b') + ' − ' + v('a') + ') = 27, so ' + v('b') + ' − ' + v('a') + ' = 27 ÷ 9 = 3. The ones digit is 3 more than the tens digit.', 'Two digits with sum 11 and difference 3: the smaller one is (11 − 3) ÷ 2 = 4, the bigger one is 7.', 'Hafiz\'s number is <b>47</b>. Check: 74 − 47 = 27 ✓'] },
    { id: 'f', level: 2, type: 'blanks', prompt: 'Siti writes a 2-digit number. Then she writes the digit <b>3</b> in front of it to make a 3-digit number. The 3-digit number is <b>12 more than 5 times</b> her 2-digit number. What is her 2-digit number?',
      template: 'Her 2-digit number is {0}.', blanks: [{ answer: 72 }],
      hint: 'Writing 3 in front of a 2-digit number adds 300 to it. Draw a bar model: 1 unit + 300 = 5 units + 12.',
      solution: ['Let the 2-digit number be 1 unit. Writing 3 in front makes it 300 + 1 unit.', 'So 1 unit + 300 = 5 units + 12.', 'Take away 1 unit from both sides: 300 = 4 units + 12, so 4 units = 288.', '1 unit = 288 ÷ 4 = 72. Check: 372 = 5 × 72 + 12 = 360 + 12 ✓', 'Her number is <b>72</b>.'] },
    { id: 'g', level: 3, type: 'blanks', prompt: 'Call a 2-digit number a <b>"lucky number"</b> if it is exactly <b>7 times</b> the sum of its digits. For example, 42 is lucky because 7 × (4 + 2) = 42. How many lucky numbers are there, and which is the largest?',
      template: 'There are {0} lucky numbers. The largest is {1}.', blanks: [{ answer: 4, size: 'sm' }, { answer: 84 }],
      hint: 'Write the number as 10 × ' + v('a') + ' + ' + v('b') + ' and set it equal to 7 × (' + v('a') + ' + ' + v('b') + '). Take 7' + v('a') + ' and ' + v('b') + ' away from both sides.',
      solution: ['10' + v('a') + ' + ' + v('b') + ' = 7' + v('a') + ' + 7' + v('b'), 'Take 7' + v('a') + ' + ' + v('b') + ' from both sides: 3' + v('a') + ' = 6' + v('b') + ', so ' + v('a') + ' = 2 × ' + v('b') + '.', 'The tens digit is double the ones digit: 21, 42, 63, 84. (' + v('b') + ' = 5 would make ' + v('a') + ' = 10, which is not a digit.)', 'There are <b>4</b> lucky numbers, and the largest is <b>84</b>.'] },
    { id: 'h', level: 3, type: 'blanks', prompt: ov('abcd') + ' is a 4-digit number. ' + ov('abcd') + ' + ' + ov('abc') + ' + ' + ov('ab') + ' + ' + ov('a') + ' = <b>4138</b>. What is ' + ov('abcd') + '?',
      template: ov('abcd') + ' = {0}', blanks: [{ answer: 3726 }],
      hint: 'Count how many thousands, hundreds, tens and ones each letter gives: ' + v('a') + ' appears as 1000 + 100 + 10 + 1 = 1111 × ' + v('a') + '. Find ' + v('a') + ' first, then ' + v('b') + ', then ' + v('c') + '.',
      solution: ['Splitting by place value: 1111' + v('a') + ' + 111' + v('b') + ' + 11' + v('c') + ' + ' + v('d') + ' = 4138', '1111 × 3 = 3333 and 1111 × 4 = 4444 is too big, so ' + v('a') + ' = 3. Left: 4138 − 3333 = 805.', '111 × 7 = 777 (111 × 8 = 888 is too big), so ' + v('b') + ' = 7. Left: 805 − 777 = 28.', '11 × 2 = 22, so ' + v('c') + ' = 2. Left: 28 − 22 = 6, so ' + v('d') + ' = 6.', ov('abcd') + ' = <b>3726</b>. Check: 3726 + 372 + 37 + 3 = 4138 ✓'] },
    { id: 'i', level: 3, type: 'blanks', prompt: 'Mei Ling has a 5-digit number. If she writes the digit <b>1</b> in <b>front</b> of it, she gets a 6-digit number P. If she writes the digit <b>1</b> at the <b>end</b> of it, she gets a 6-digit number Q. Q is exactly <b>3 times</b> P. What is Mei Ling\'s number?',
      template: 'Mei Ling\'s number is {0}.', blanks: [{ answer: 42857 }],
      hint: 'Let her number be 1 unit. Writing 1 in front adds 100 000: P = 1 unit + 100 000. Writing 1 at the end moves every digit up one place: Q = 10 units + 1.',
      solution: ['P = 1 unit + 100 000 and Q = 10 units + 1.', 'Q = 3 × P, so 10 units + 1 = 3 units + 300 000.', 'Take away 3 units and 1 from both sides: 7 units = 299 999.', '1 unit = 299 999 ÷ 7 = 42 857.', 'Check: P = 142 857, Q = 428 571, and 3 × 142 857 = 428 571 ✓', 'Her number is <b>42857</b>.'] },
  ],
  adult: 'Links to school work: P4 whole numbers up to 100 000 (place value, forming the largest and smallest numbers). Questions a to c are <b>within</b> the P4 syllabus. Using letters for unknown digits (' + ov('abc') + ' = 100' + v('a') + ' + 10' + v('b') + ' + ' + v('c') + ') and the digit puzzles in d to i are <b>enrichment</b> (olympiad style), although the unit-based solutions use the familiar P4 to P6 "units and parts" thinking. Common mistakes: reading ' + ov('abc') + ' as ' + v('a') + ' × ' + v('b') + ' × ' + v('c') + ', and putting 0 first when forming the smallest number. A fun extension: try the 142 857 number on a calculator by multiplying it by 2, 3, 4, 5 and 6.',
};

export default { t05, t06 };
