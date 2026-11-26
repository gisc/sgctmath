// Unit 8 · Make a Supposition (t21, t22, S3) — original content, Singapore context.
import * as A from '../art.js';
const { svg, kid, leo } = A;
const INK = A.ink, S = A.stroke;
const HF = 'font-family="Baloo 2, sans-serif" font-weight="800"';
const NF = 'font-family="Nunito, sans-serif" font-weight="800"';

/* ===================== shared helpers ===================== */
function tbl(head, rows, caption = '', compact = false) {
  const pad = compact ? ' style="padding:5px 8px"' : '';
  const cell = (c, tag) => (c && typeof c === 'object') ? `<${tag} class="${c.cls || ''}"${pad}>${c.v}</${tag}>` : `<${tag}${pad}>${c}</${tag}>`;
  return `<table class="tbl"${compact ? ' style="font-size:15px"' : ''}>${head ? `<thead><tr>${head.map(h => cell(h, 'th')).join('')}</tr></thead>` : ''}<tbody>${rows.map(r => `<tr>${r.map((c, i) => cell(c, i === 0 ? 'th' : 'td')).join('')}</tr>`).join('')}</tbody></table>${caption ? `<small>${caption}</small>` : ''}`;
}
const H = v => ({ v, cls: 'hl' });
// Step pictures must not widen the speech bubble on phones: this wrapper adds no width of its own.
const fit = html => `<div style="width:0;min-width:100%;overflow-x:auto">${html}</div>`;

/* ---------- t21 helpers: chickens and rabbits ---------- */
function chicken(x, y, s = 1, flip = false) {
  return `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">
    <path d="M-6 18 v16 m-6 4 l6 -4 l6 4 M8 18 v16 m-6 4 l6 -4 l6 4" fill="none" stroke="#e08a1e" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-18 -2 q-16 -16 -10 -30 q8 10 18 16z" fill="#fff" ${S}/>
    <ellipse cx="0" cy="4" rx="24" ry="18" fill="#fff" ${S}/>
    <path d="M-12 0 q10 16 22 2" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M12 -26 q2 -10 7 -4 q3 -9 7 -2 q6 -5 5 5z" fill="#ff6b5b" ${S} stroke-width="2"/>
    <circle cx="20" cy="-16" r="11" fill="#fff" ${S}/>
    <path d="M30 -19 l10 3 l-10 4z" fill="#ffc94a" ${S} stroke-width="2"/>
    <path d="M30 -11 q3 9 -4 7z" fill="#ff6b5b"/>
    <circle cx="23" cy="-18" r="2.4" fill="${INK}"/></g>`;
}
function rabbit(x, y, s = 1, flip = false) {
  const fur = '#e9e4f2', dk = '#d3cce3';
  return `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">
    ${[-18, -8, 6, 15].map(lx => `<rect x="${lx - 4}" y="14" width="9" height="22" rx="4" fill="${dk}" ${S} stroke-width="2.4"/>`).join('')}
    <circle cx="-24" cy="2" r="7" fill="#fff" ${S} stroke-width="2.4"/>
    <ellipse cx="0" cy="6" rx="25" ry="16" fill="${fur}" ${S}/>
    <ellipse cx="13" cy="-36" rx="5.5" ry="16" transform="rotate(-14 13 -36)" fill="${fur}" ${S} stroke-width="2.4"/>
    <ellipse cx="13" cy="-36" rx="2.2" ry="10" transform="rotate(-14 13 -36)" fill="#ffb3c4"/>
    <ellipse cx="26" cy="-34" rx="5.5" ry="16" transform="rotate(14 26 -34)" fill="${fur}" ${S} stroke-width="2.4"/>
    <ellipse cx="26" cy="-34" rx="2.2" ry="10" transform="rotate(14 26 -34)" fill="#ffb3c4"/>
    <circle cx="20" cy="-10" r="12" fill="${fur}" ${S}/>
    <circle cx="24" cy="-12" r="2.4" fill="${INK}"/><circle cx="31" cy="-7" r="2.6" fill="#ff8fa3"/>
    <path d="M30 -4 l9 -2 M30 -3 l9 3" stroke="${INK}" stroke-width="1.4"/></g>`;
}
// A row of heads. The first r animals get 2 extra (coral) legs: the "swap" picture of the supposition method.
function legsPic(n, r = 0, label = '') {
  const w = 31, W = n * w + 12;
  let g = '';
  for (let i = 0; i < n; i++) {
    const x = 6 + w * i + w / 2, rab = i < r;
    g += `<path d="M${x - 4} 28 L${x - 5} 58 M${x + 4} 28 L${x + 5} 58" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`;
    if (rab) g += `<path d="M${x - 8} 26 L${x - 11} 58 M${x + 8} 26 L${x + 11} 58" stroke="#ff6b5b" stroke-width="3.5" stroke-linecap="round"/>
      <text x="${x}" y="76" text-anchor="middle" ${NF} font-size="13" fill="#d6453a">+2</text>`;
    g += rab ? `<ellipse cx="${x - 4}" cy="4" rx="3" ry="8" fill="#e9e4f2" ${S} stroke-width="2"/><ellipse cx="${x + 4}" cy="4" rx="3" ry="8" fill="#e9e4f2" ${S} stroke-width="2"/>`
      : `<path d="M${x - 5} 10 q2 -8 5 -3 q3 -7 6 1z" fill="#ff6b5b" ${S} stroke-width="1.8"/>`;
    g += `<circle cx="${x}" cy="19" r="10" fill="${rab ? '#e9e4f2' : '#fff3b0'}" ${S} stroke-width="2.4"/>`;
  }
  return svg(`0 -6 ${W} ${r ? 90 : 72}`, g, label, `style="max-width:${Math.round(W * 1.05)}px"`);
}
function fence(x, y, w, h = 56) {
  let g = `<rect x="${x}" y="${y + 10}" width="${w}" height="9" rx="3" fill="#d9a36b" ${S} stroke-width="2.4"/><rect x="${x}" y="${y + h - 22}" width="${w}" height="9" rx="3" fill="#d9a36b" ${S} stroke-width="2.4"/>`;
  for (let px = x + 6; px <= x + w - 6; px += 38) g += `<rect x="${px - 5}" y="${y}" width="10" height="${h}" rx="3" fill="#c98b55" ${S} stroke-width="2.4"/>`;
  return g;
}
function bike(x, y, s = 1, three = false, c = '#4aa8ff') {
  const wh = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${INK}" stroke-width="4"/><circle cx="${cx}" cy="${cy}" r="3" fill="${INK}"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})">
    ${three ? `${wh(-30, 0, 15)}<circle cx="-38" cy="-2" r="14" fill="none" stroke="#5d6b88" stroke-width="3.5"/>` : wh(-30, 0, 15)}${wh(30, 0, 15)}
    <path d="M-30 0 L-6 0 L14 -26 L-14 -26 Z M-6 0 L-18 -34 M30 0 L18 -36" fill="none" stroke="${c}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M-26 -36 h16 M12 -38 l12 -4" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/></g>`;
}

/* ===================== Topic 21 ===================== */
const t21 = {
  id: 't21',
  title: 'Chickens and Rabbits',
  intro: 'Count the heads, count the legs… then work out how many of each animal there are! The <b>supposition method</b> cracks these puzzles without endless guessing.',
  skills: ['Supposition', 'Reasoning', 'Checking'],
  art: () => svg('0 0 360 220', `<rect width="360" height="220" rx="20" fill="#fff6e4"/>
    <path d="M0 168 q180 -22 360 0 v32 q0 20 -20 20 h-320 q-20 0 -20 -20z" fill="#bde6a8"/>
    <rect x="66" y="14" width="228" height="50" rx="12" fill="#fff" ${S}/>
    <text x="180" y="47" text-anchor="middle" ${HF} font-size="23" fill="${INK}">10 heads · 28 legs</text>
    ${chicken(88, 140, 1.35)}${rabbit(262, 140, 1.35, true)}
    <text x="180" y="150" text-anchor="middle" ${HF} font-size="56" fill="#7b61ff">?</text>
    <text x="180" y="206" text-anchor="middle" ${NF} font-size="15" fill="#2c7a3e">How many of each?</text>`, 'A chicken and a rabbit under a sign saying 10 heads and 28 legs'),
  explore: {
    setup: 'On a learning journey to a farm in <b>Kranji</b>, the class stops at a pen of chickens and rabbits. Arjun counts <b>10 heads</b>. Chloe crouches down and counts <b>28 legs</b>.',
    art: () => svg('0 0 340 300', `<rect width="340" height="300" rx="20" fill="#e8f6ff"/>
      ${A.cloud(14, 16, .7)}${A.cloud(236, 30, .6)}
      <path d="M0 150 q170 -18 340 0 v130 q0 20 -20 20 h-300 q-20 0 -20 -20z" fill="#bde6a8"/>
      ${A.tree(170, 150, .5)}
      ${kid('arjun', { x: 70, y: 92, s: .74, pose: 'think', mood: 'think' })}${kid('chloe', { x: 270, y: 92, s: .74, pose: 'wave', flip: true })}
      ${fence(12, 146, 316, 60)}
      ${chicken(52, 262, .62)}${rabbit(118, 258, .62)}${chicken(178, 266, .62, true)}${rabbit(236, 262, .62, true)}${chicken(296, 258, .62, true)}
      <rect x="124" y="26" width="92" height="34" rx="8" fill="#fff" ${S} stroke-width="2.4"/>
      <text x="170" y="49" text-anchor="middle" ${HF} font-size="15" fill="#2c7a3e">Farm visit</text>`, 'Arjun and Chloe at a farm pen with chickens and rabbits'),
    steps: [
      { who: 'arjun', mood: 'think', text: 'How many chickens and how many rabbits are there? I could guess and check… but that might take ages.' },
      { who: 'leo', text: 'Let\'s make a <b>supposition</b>. Suppose all 10 animals were chickens. Each chicken has 2 legs, so there would be 10 × 2 = <b>20 legs</b>.', art: () => legsPic(10, 0, 'Ten heads, each with 2 legs: 20 legs') },
      { who: 'chloe', text: 'But I counted <b>28</b> legs. Our supposition is 28 − 20 = <b>8 legs short</b>!' },
      { who: 'leo', text: 'Now swap one chicken for a rabbit. The number of heads stays at 10, but we <b>gain 2 legs</b>, because a rabbit has 4 − 2 = 2 more legs than a chicken.',
        art: () => tbl(['Rabbits', 'Chickens', 'Legs'], [['0', '10', '20'], ['1', '9', '22'], ['2', '8', '24'], ['3', '7', '26'], [H('4'), H('6'), H('<b>28</b>')]], 'Every swap adds 2 legs.', true) },
      { who: 'weiming', text: 'We are 8 legs short, and each swap adds 2 legs. 8 ÷ 2 = 4 swaps. So there are <b>4 rabbits</b> and 10 − 4 = <b>6 chickens</b>!', art: () => legsPic(10, 4, 'Four of the animals get 2 extra legs each: 28 legs') },
      { who: 'aisyah', text: 'Check: 6 × 2 + 4 × 4 = 12 + 16 = 28 legs ✓. We can also suppose they were <b>all rabbits</b>: 10 × 4 = 40 legs. That is 12 legs too many. 12 ÷ 2 = 6 chickens. Same answer!' },
      { who: 'leo', text: 'The supposition method works whenever two kinds of things are counted together: $2 and $5 notes, bicycles and tricycles, 2-point and 3-point baskets… <b>Suppose</b> they are all one kind, find the <b>difference</b>, then <b>divide</b> by the change for each swap.' },
    ],
  },
  keys: [
    { title: 'Suppose they are all the same', text: 'Pretend every item is the same kind, e.g. all chickens. Work out the total you would get.' },
    { title: 'Find the difference', text: 'Compare with the real total. All chickens: 20 legs. Real: 28 legs. Difference: 8 legs.' },
    { title: 'Divide by the change per swap', text: 'One swap changes the total by 4 − 2 = 2 legs. 8 ÷ 2 = 4 swaps, so there are <b>4 of the other kind</b> (rabbits).' },
    { title: 'Check both facts', text: 'Your answer must give the right number of heads <b>and</b> the right number of legs. Careful: supposing "all chickens" finds the <b>rabbits</b> first.' },
  ],
  practice: [
    { id: 'a', level: 1, type: 'blanks', prompt: 'Another pen at the Kranji farm has chickens and rabbits. There are <b>12 heads</b> and <b>32 legs</b>. Fill in the steps.',
      template: 'If all 12 animals were chickens, there would be {0} legs.<br>That is {1} legs fewer than the real number.<br>So there are {2} rabbits and {3} chickens.',
      blanks: [{ answer: 24, size: 'sm' }, { answer: 8, size: 'sm' }, { answer: 4, size: 'sm' }, { answer: 8, size: 'sm' }],
      hint: 'All chickens: 12 × 2 legs. Each rabbit has 2 more legs than a chicken.',
      solution: ['Suppose all were chickens: 12 × 2 = 24 legs.', 'Legs short: 32 − 24 = 8.', 'Each swap from a chicken to a rabbit adds 2 legs: 8 ÷ 2 = <b>4 rabbits</b>.', 'Chickens: 12 − 4 = <b>8</b>. Check: 8 × 2 + 4 × 4 = 16 + 16 = 32 ✓'] },
    { id: 'b', level: 1, type: 'blanks', prompt: 'A bicycle rental kiosk at <b>East Coast Park</b> has 20 bicycles and tricycles. Altogether they have <b>47 wheels</b>. How many of each are there?',
      art: svg('0 0 340 104', `${bike(84, 62, 1.05, false, '#4aa8ff')}${bike(250, 62, 1.05, true, '#ff6b5b')}<text x="84" y="98" text-anchor="middle" ${NF} font-size="15" fill="${INK}">bicycle: 2 wheels</text><text x="250" y="98" text-anchor="middle" ${NF} font-size="15" fill="${INK}">tricycle: 3 wheels</text>`, 'A bicycle with 2 wheels and a tricycle with 3 wheels', 'style="max-width:340px"'),
      template: '{0} bicycles and {1} tricycles', blanks: [{ answer: 13, size: 'sm' }, { answer: 7, size: 'sm' }],
      hint: 'Suppose all 20 were bicycles. How many wheels would that be? Each tricycle has 1 more wheel than a bicycle.',
      solution: ['Suppose all 20 were bicycles: 20 × 2 = 40 wheels.', 'Wheels short: 47 − 40 = 7.', 'Each tricycle has 3 − 2 = 1 more wheel, so there are 7 ÷ 1 = <b>7 tricycles</b>.', 'Bicycles: 20 − 7 = <b>13</b>. Check: 13 × 2 + 7 × 3 = 26 + 21 = 47 ✓'] },
    { id: 'c', level: 1, type: 'blanks', prompt: 'For Chinese New Year, Grandma Ong fills her red packets with <b>$2</b> and <b>$5</b> notes only. She uses <b>15 notes</b>, worth <b>$51</b> altogether. How many of each note does she use?',
      template: '{0} notes of $2 and {1} notes of $5', blanks: [{ answer: 8, size: 'sm' }, { answer: 7, size: 'sm' }],
      hint: 'Suppose all 15 notes were $2 notes. How much money is missing? Each $5 note is worth $3 more than a $2 note.',
      solution: ['Suppose all 15 notes were $2 notes: 15 × $2 = $30.', 'Missing: $51 − $30 = $21.', 'Swapping a $2 note for a $5 note adds $3: $21 ÷ $3 = <b>7</b> notes of $5.', 'Notes of $2: 15 − 7 = <b>8</b>. Check: 8 × $2 + 7 × $5 = $16 + $35 = $51 ✓'] },
    { id: 'd', level: 2, type: 'blanks', prompt: 'On a school camp at <b>Pulau Ubin</b>, 72 pupils sleep in 15 tents. Some tents sleep <b>4</b> pupils and the rest sleep <b>6</b> pupils. Every tent is full. How many 6-person tents are there?',
      template: '{0} tents for 6 pupils', blanks: [{ answer: 6, size: 'sm' }],
      hint: 'Suppose all 15 tents were 4-person tents. How many pupils would have no place to sleep?',
      solution: ['Suppose all 15 tents were 4-person tents: 15 × 4 = 60 places.', 'Pupils without a place: 72 − 60 = 12.', 'Changing a 4-person tent into a 6-person tent gives 2 more places: 12 ÷ 2 = <b>6</b> tents for 6 pupils.', 'Check: 9 tents × 4 + 6 tents × 6 = 36 + 36 = 72 ✓'] },
    { id: 'e', level: 2, type: 'mcq', prompt: 'In a basketball CCA match, Hafiz scores <b>33 points</b> from <b>14 baskets</b>. Each basket is worth either 2 points or 3 points. How many <b>3-point</b> baskets does he score?',
      options: ['5', '7', '9', '11'], answer: 0,
      hint: 'Suppose all 14 baskets were 2-pointers. How many points short is that?',
      solution: ['Suppose all 14 baskets were 2-pointers: 14 × 2 = 28 points.', 'Points short: 33 − 28 = 5.', 'Each 3-pointer is worth 1 point more, so there are 5 ÷ 1 = <b>5</b> three-point baskets (and 9 two-point baskets).', 'Check: 9 × 2 + 5 × 3 = 18 + 15 = 33 ✓ (9 is the number of 2-point baskets, a common slip!)'] },
    { id: 'f', level: 2, type: 'blanks', prompt: 'A <b>National Day quiz</b> at the community centre has 20 questions. A correct answer earns <b>5 points</b>. A wrong answer <b>loses 2 points</b>. Priya answers every question and scores <b>72 points</b>. How many questions does she get right?',
      template: '{0} correct answers', blanks: [{ answer: 16, size: 'sm' }],
      hint: 'Suppose she got all 20 right. Each wrong answer does not just miss 5 points; it also takes away 2. How much does one wrong answer cost her?',
      solution: ['Suppose all 20 answers were correct: 20 × 5 = 100 points.', 'Points short: 100 − 72 = 28.', 'Each wrong answer loses the 5 points <b>and</b> takes away 2 more: it costs 5 + 2 = 7 points.', 'Wrong answers: 28 ÷ 7 = 4. Correct answers: 20 − 4 = <b>16</b>.', 'Check: 16 × 5 − 4 × 2 = 80 − 8 = 72 ✓'] },
    { id: 'g', level: 3, type: 'blanks', prompt: 'Uncle Ravi delivers <b>300</b> glass bottles of soya bean milk to a kopitiam. He is paid <b>20 cents</b> for each bottle delivered safely, but he must pay <b>$1</b> for each bottle that breaks. He receives <b>$54</b> altogether. How many bottles broke?',
      template: '{0} bottles broke', blanks: [{ answer: 5, size: 'sm' }],
      hint: 'Suppose no bottles broke. How much would he get? Work in cents. One broken bottle loses the 20 cents and costs another 100 cents.',
      solution: ['Suppose all 300 bottles arrived safely: 300 × 20¢ = 6000¢ = $60.', 'He is short by $60 − $54 = $6 = 600¢.', 'Each broken bottle: he misses 20¢ and pays 100¢, so it costs him 120¢.', 'Broken bottles: 600 ÷ 120 = <b>5</b>.', 'Check: 295 × 20¢ = $59, and $59 − 5 × $1 = $54 ✓'] },
    { id: 'h', level: 3, type: 'blanks', prompt: 'The East Coast Park kiosk now rents out <b>bicycles</b> (2 wheels), <b>tricycles</b> (3 wheels) and <b>family bikes</b> (4 wheels). There are 30 of them with <b>78 wheels</b> altogether. There are as many tricycles as family bikes. How many <b>bicycles</b> are there?',
      template: '{0} bicycles', blanks: [{ answer: 18, size: 'sm' }],
      hint: 'Group one tricycle with one family bike: that pair is 2 vehicles with 7 wheels. Suppose all 30 were bicycles, then swap 2 bicycles for one pair at a time.',
      solution: ['Tricycles and family bikes come in pairs: 1 tricycle + 1 family bike = 2 vehicles with 3 + 4 = 7 wheels.', 'Suppose all 30 were bicycles: 30 × 2 = 60 wheels. Short: 78 − 60 = 18 wheels.', 'Swapping 2 bicycles (4 wheels) for one pair (7 wheels) adds 3 wheels.', 'Number of pairs: 18 ÷ 3 = 6. So 6 tricycles and 6 family bikes.', 'Bicycles: 30 − 6 − 6 = <b>18</b>. Check: 18 × 2 + 6 × 3 + 6 × 4 = 36 + 18 + 24 = 78 ✓'] },
    { id: 'i', level: 3, type: 'blanks', prompt: 'A Maths Olympiad practice round at school has 15 questions. A correct answer earns <b>6 points</b>, a wrong answer <b>loses 2 points</b> and a blank earns <b>0 points</b>. Nurul scores <b>62 points</b>. She left exactly as many questions blank as she got wrong. How many did she get right?',
      template: '{0} correct answers', blanks: [{ answer: 11, size: 'sm' }],
      hint: 'Wrong answers and blanks come in pairs. Suppose all 15 were correct. How many points does it cost to change 2 correct answers into 1 wrong answer and 1 blank?',
      solution: ['Suppose all 15 answers were correct: 15 × 6 = 90 points. Short: 90 − 62 = 28 points.', 'Change 2 correct answers (12 points) into 1 wrong (−2) and 1 blank (0). That costs 12 + 2 = 14 points.', 'Number of such pairs: 28 ÷ 14 = 2. So 2 wrong answers and 2 blanks.', 'Correct answers: 15 − 2 − 2 = <b>11</b>.', 'Check: 11 × 6 − 2 × 2 = 66 − 4 = 62 ✓'] },
  ],
  adult: 'Links to school work: P4 whole numbers and the four operations, and money. "Make a supposition" is one of the problem-solving heuristics in the Singapore MOE framework; the <b>supposition (assumption) method</b> is usually practised in P5–P6 word problems, so this topic is <b>enrichment</b> for P4. Common mistakes: dividing the difference by 4 (legs per rabbit) instead of by 2 (the <i>difference</i> per swap); forgetting that supposing "all chickens" finds the number of <b>rabbits</b> first; in marks-deduction problems, using 2 instead of 5 + 2 = 7 for the cost of one wrong answer. Tip: if your child is stuck, build a small swap table (0, 1, 2, … swaps) until the pattern is clear, then let them jump straight to the answer by dividing.',
};

/* ---------- t22 helpers ---------- */
function star(x, y, r, c = '#ffc94a', rot = 0) {
  let d = '';
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; d += `${i ? 'L' : 'M'}${(x + rr * Math.cos(a)).toFixed(1)} ${(y + rr * Math.sin(a)).toFixed(1)}`; }
  return `<path d="${d}Z" fill="${c}" ${S} stroke-width="2" transform="rotate(${rot} ${x} ${y})"/>`;
}
// n equal unit squares, split into coloured segments: segs [{k, c, t}]
function unitBar(n, segs, { u = 25, label = '' } = {}) {
  let g = '', i = 0;
  const x0 = 6, W = n * u + 12;
  for (const sg of segs) {
    for (let j = 0; j < sg.k; j++) g += `<rect x="${x0 + (i + j) * u}" y="6" width="${u}" height="30" fill="${sg.c}" ${S} stroke-width="2.2"/>`;
    const a = x0 + i * u, b = x0 + (i + sg.k) * u;
    if (sg.t) g += `<path d="M${a + 2} 44 v6 h${b - a - 4} v-6" fill="none" stroke="${INK}" stroke-width="2"/><text x="${(a + b) / 2}" y="70" text-anchor="middle" ${NF} font-size="17" fill="${INK}">${sg.t}</text>`;
    i += sg.k;
  }
  return svg(`0 0 ${W} 78`, g, label, `style="max-width:${W + 20}px"`);
}

/* ===================== Topic 22 ===================== */
const t22 = {
  id: 't22',
  title: 'Trying Out Specific Numbers',
  intro: 'Some problems never tell you the total: "a tank", "a batch", "her money". The trick? <b>Suppose</b> a friendly number for it, and the problem becomes easy!',
  skills: ['Supposition', 'Common multiples', 'Rates'],
  art: () => svg('0 0 360 220', `<rect width="360" height="220" rx="20" fill="#e9f7ff"/>
    <rect x="14" y="34" width="132" height="12" rx="5" fill="#b9c3d6" ${S} stroke-width="2.4"/><rect x="128" y="34" width="14" height="30" rx="4" fill="#b9c3d6" ${S} stroke-width="2.4"/>
    <rect x="216" y="34" width="54" height="12" rx="5" fill="#b9c3d6" ${S} stroke-width="2.4"/><rect x="216" y="34" width="14" height="30" rx="4" fill="#b9c3d6" ${S} stroke-width="2.4"/>
    <path d="M135 66 v50 M223 66 v70" stroke="#4aa8ff" stroke-width="5" stroke-linecap="round" stroke-dasharray="7 6"/>
    <rect x="110" y="80" width="140" height="122" rx="10" fill="#fff" ${S}/>
    <rect x="112" y="138" width="136" height="62" rx="8" fill="#8cc9ff"/>
    <path d="M112 140 q17 -7 34 0 t34 0 t34 0 t34 0" fill="none" stroke="#fff" stroke-width="3"/>
    <rect x="110" y="80" width="140" height="122" rx="10" fill="none" ${S}/>
    <text x="180" y="122" text-anchor="middle" ${HF} font-size="26" fill="${INK}">? L</text>
    <text x="22" y="26" ${NF} font-size="15" fill="${INK}">Tap A: 4 h</text><text x="206" y="26" ${NF} font-size="15" fill="${INK}">Tap B: 12 h</text>
    <g transform="rotate(6 312 132)"><rect x="268" y="92" width="88" height="82" rx="4" fill="#fff3b0" ${S} stroke-width="2.4"/>
      <text x="312" y="120" text-anchor="middle" ${HF} font-size="16" fill="#7b61ff">Suppose</text><text x="312" y="140" text-anchor="middle" ${HF} font-size="16" fill="#7b61ff">it holds</text><text x="312" y="162" text-anchor="middle" ${HF} font-size="20" fill="#d6453a">12 L!</text></g>`, 'Two taps filling a tank of unknown size, with a note saying suppose it holds 12 litres'),
  explore: {
    setup: 'For National Day, the residents\' committee needs a batch of paper stars to decorate the void deck. <b>Aisyah</b> can fold the whole batch by herself in <b>3 hours</b>. <b>Arjun</b> needs <b>6 hours</b>. Nobody has said how many stars are in the batch!',
    art: () => svg('0 0 340 300', `<rect width="340" height="300" rx="20" fill="#eef4fb"/>
      <rect x="0" y="0" width="340" height="40" rx="20" fill="#d9e3f2"/>
      <rect x="18" y="40" width="26" height="250" fill="#f3e3c8" ${S} stroke-width="2.4"/><rect x="296" y="40" width="26" height="250" fill="#f3e3c8" ${S} stroke-width="2.4"/>
      <path d="M44 52 q126 40 252 0" fill="none" stroke="${INK}" stroke-width="2"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => { const x = 62 + i * 29, y = 52 + 40 * (1 - Math.pow((x - 170) / 126, 2)) * .5; return `<path d="M${x - 10} ${y} h20 l-10 18z" fill="${i % 2 ? '#fff' : '#e1484b'}" ${S} stroke-width="2"/>`; }).join('')}
      ${kid('aisyah', { x: 100, y: 112, s: .8, pose: 'wave' })}${kid('arjun', { x: 242, y: 112, s: .8, pose: 'think', mood: 'think', flip: true })}
      ${A.table(40, 184, 260)}
      <path d="M44 196 h252 v44 q-126 10 -252 0z" fill="#fff" ${S}/><path d="M44 196 h252 v14 h-252z" fill="#e1484b" ${S} stroke-width="2.4"/>
      ${star(96, 174, 11, '#ffc94a', 10)}${star(124, 176, 9, '#ff6b5b', -8)}${star(150, 173, 11, '#7b61ff', 4)}${star(212, 175, 10, '#3dbb6b', -12)}${star(240, 173, 11, '#4aa8ff', 6)}
      <text x="170" y="282" text-anchor="middle" ${HF} font-size="18" fill="${INK}">How many stars?</text>`, 'Aisyah and Arjun folding paper stars at the void deck'),
    steps: [
      { who: 'arjun', mood: 'think', text: 'If we fold together, how long will it take? We don\'t even know how many stars there are!' },
      { who: 'leo', text: 'When a number is missing, <b>suppose</b> one! Choose a number that divides nicely by both 3 and 6. Let\'s suppose the batch has <b>12 stars</b>.' },
      { who: 'aisyah', text: 'Then in 1 hour I fold 12 ÷ 3 = <b>4 stars</b>, and Arjun folds 12 ÷ 6 = <b>2 stars</b>. Together we fold 4 + 2 = <b>6 stars</b> every hour.' },
      { who: 'weiming', text: '12 stars ÷ 6 stars per hour = <b>2 hours</b>. Done!' },
      { who: 'chloe', mood: 'think', text: 'But what if the real batch has 60 stars, or 300? Does the answer change? Let\'s test a few:',
        art: () => tbl(['Stars in the batch', '12', '60', '300'], [['Aisyah in 1&nbsp;h', '4', '20', '100'], ['Arjun in 1&nbsp;h', '2', '10', '50'], ['Together in 1&nbsp;h', '6', '30', '150'], ['Time together', H('2&nbsp;h'), H('2&nbsp;h'), H('2&nbsp;h')]], '', true) },
      { who: 'leo', text: 'It is <b>always 2 hours</b>! The size of the batch does not matter, so we may suppose any number we like. The smartest choice is a <b>common multiple</b> of the numbers in the problem, so that everything divides exactly.' },
      { who: 'arjun', text: 'It works for fractions too. To compare [[f:1/3]] and [[f:1/4]] of something, suppose there are 12 of them: [[f:1/3]] of 12 is 4 and [[f:1/4]] of 12 is 3.',
        art: () => unitBar(12, [{ k: 4, c: '#c9bdff', t: '⅓ → 4' }, { k: 3, c: '#ffd2cc', t: '¼ → 3' }, { k: 5, c: '#fff', t: '5 left' }], { label: 'A bar of 12 units: 4, 3 and 5 units' }) },
    ],
  },
  keys: [
    { title: 'No total? Suppose one!', text: 'If a problem only gives times, fractions or "times as much", choose a number for the unknown amount.' },
    { title: 'Pick a common multiple', text: '3 hours and 6 hours: suppose 6 or 12. [[f:1/3]] and [[f:1/4]]: suppose 12. Then everything divides exactly.' },
    { title: 'How much in 1 hour?', text: 'Total ÷ time = amount done in 1 hour. When people or taps work together, <b>add</b> the amounts for 1 hour.' },
    { title: 'Same answer every time', text: 'The answer does not depend on the number you chose. Try a second number to check!' },
  ],
  practice: [
    { id: 'a', level: 1, type: 'blanks', prompt: 'Mdm Lim spends [[f:1/3]] of her money at the wet market and [[f:1/4]] of her money at the bakery. What fraction of her money is left? Give your answer in its simplest form.',
      template: '{f:0,1} of her money is left', blanks: [{ answer: 5, label: 'numerator' }, { answer: 12, label: 'denominator' }],
      hint: 'Suppose she has $12 (12 can be divided by 3 and by 4). How many dollars does she spend at each shop?',
      solution: ['Suppose Mdm Lim has $12.', 'Wet market: [[f:1/3]] of $12 = $4. Bakery: [[f:1/4]] of $12 = $3.',
        unitBar(12, [{ k: 4, c: '#c9bdff', t: '$4' }, { k: 3, c: '#ffd2cc', t: '$3' }, { k: 5, c: '#fff', t: '$5 left' }], { label: 'A bar of $12 split into $4, $3 and $5' }),
        'Left: $12 − $4 − $3 = $5, which is [[f:5/12]] of $12.', 'So <b>[[f:5/12]]</b> of her money is left. (Try supposing $24: $8 + $6 spent, $10 left, and [[f:10/24]] = [[f:5/12]] ✓)'] },
    { id: 'b', level: 1, type: 'blanks', prompt: 'At the school bookshop, a file costs <b>3 times</b> as much as a pencil. A school bag costs <b>5 times</b> as much as a file. With the money for <b>2 school bags</b>, how many pencils can you buy?',
      template: '{0} pencils', blanks: [{ answer: 30 }],
      hint: 'No prices are given, so suppose a pencil costs $1. Then work out the file and the school bag.',
      solution: ['Suppose a pencil costs $1.', 'A file costs 3 × $1 = $3. A school bag costs 5 × $3 = $15.', '2 school bags cost 2 × $15 = $30.', '$30 buys 30 ÷ 1 = <b>30 pencils</b>. (Supposing the pencil costs 50¢ gives the same answer!)'] },
    { id: 'c', level: 1, type: 'blanks', prompt: 'Ravi walks the whole length of a park connector in <b>12 minutes</b>. Siti cycles the same path in <b>4 minutes</b>. They start from opposite ends at the same time. After how many minutes do they meet?',
      template: 'They meet after {0} minutes', blanks: [{ answer: 3, size: 'sm' }],
      hint: 'Suppose the path is 1200 m long. How many metres does each of them cover in 1 minute? How much of the gap closes every minute?',
      solution: ['Suppose the path is 1200 m long.', 'In 1 minute, Ravi walks 1200 ÷ 12 = 100 m and Siti cycles 1200 ÷ 4 = 300 m.', 'Together they close 100 + 300 = 400 m of the gap every minute.', 'Time to meet: 1200 ÷ 400 = <b>3 minutes</b>.'] },
    { id: 'd', level: 2, type: 'blanks', prompt: 'The school\'s community garden has a water tank. <b>Tap A</b> alone fills it in <b>4 hours</b>. <b>Tap B</b> alone fills it in <b>12 hours</b>. How long do the two taps take to fill the empty tank together?',
      template: '{0} hours', blanks: [{ answer: 3, size: 'sm' }],
      hint: 'Suppose the tank holds 12 litres. How many litres does each tap pour in 1 hour?',
      solution: ['Suppose the tank holds 12 L (a multiple of both 4 and 12).', 'In 1 hour: Tap A pours 12 ÷ 4 = 3 L and Tap B pours 12 ÷ 12 = 1 L.', 'Together: 3 + 1 = 4 L every hour.', 'Time: 12 ÷ 4 = <b>3 hours</b>.'] },
    { id: 'e', level: 2, type: 'blanks', prompt: `For Hari Raya, Nurul\'s mother fills three jars, A, B and C, with the <b>same number</b> of kuih makmur. Then Nurul moves <b>12</b> pieces from Jar A to Jar B, then <b>7</b> pieces from Jar B to Jar C, and then <b>10</b> pieces from Jar C to Jar A. Which jar now has the most, which has the fewest, and how many more does the fullest jar have than the emptiest?`,
      template: 'Most: Jar {0} &nbsp; Fewest: Jar {1} &nbsp; Difference: {2} pieces', blanks: [{ answer: ['B', 'Jar B'], kind: 'text', size: 'sm' }, { answer: ['C', 'Jar C'], kind: 'text', size: 'sm' }, { answer: 8, size: 'sm' }],
      hint: 'We are not told how many pieces each jar had. Suppose each jar started with 50 pieces, then follow the moves one by one.',
      solution: ['Suppose each jar started with 50 pieces.',
        tbl(['', 'Jar A', 'Jar B', 'Jar C'], [['Start', '50', '50', '50'], ['A→B&nbsp;12', '38', '62', '50'], ['B→C&nbsp;7', '38', '55', '57'], ['C→A&nbsp;10', H('48'), H('55'), H('47')]], '', true),
        'Jar B has the most (55) and Jar C has the fewest (47).', 'Difference: 55 − 47 = <b>8 pieces</b>. Supposing a different starting number changes every jar by the same amount, so the answer stays the same.'] },
    { id: 'f', level: 2, type: 'blanks', prompt: 'Farah, her brother and her sister save up for a family trip. Her brother saves <b>half</b> as much as Farah. Her sister saves <b>3 times</b> as much as Farah. On average, the three of them save <b>$30</b> each. How much does her sister save?',
      template: '$ {0}', blanks: [{ answer: 60 }],
      hint: 'Suppose her brother saves $1 (so there are no halves). Find what the others save and their average. How many times bigger is the real average?',
      solution: ['Suppose her brother saves $1. Then Farah saves $2 and her sister saves 3 × $2 = $6.', 'Total: $1 + $2 + $6 = $9. Average: $9 ÷ 3 = $3.', 'The real average is $30, which is 10 times as much as $3.', 'So everything is 10 times as much: her sister saves 10 × $6 = <b>$60</b>.', 'Check: $10 + $20 + $60 = $90, and $90 ÷ 3 = $30 ✓'] },
    { id: 'g', level: 3, type: 'mcq', prompt: 'Before Chinese New Year, a shop <b>raises</b> the price of a tin of pineapple tarts by [[f:1/5]]. After the festival, the shop <b>lowers</b> the new price by [[f:1/5]]. Compared with the original price, the final price is…',
      options: ['the same as the original price', 'higher by [[f:1/25]] of the original price', 'lower by [[f:1/25]] of the original price', 'lower by [[f:1/5]] of the original price'], answer: 2,
      hint: 'Suppose the original price is $25 (divisible by 5, and the new price will be too). Work out the price after each change.',
      solution: ['Suppose the original price is $25.', 'Raise by [[f:1/5]]: [[f:1/5]] of $25 = $5, so the new price is $30.', 'Lower by [[f:1/5]]: [[f:1/5]] of $30 = $6, so the final price is $24.', 'The final price is $1 lower, and $1 is [[f:1/25]] of $25.', 'So it is <b>lower by [[f:1/25]] of the original price</b>. It is not the same, because the second [[f:1/5]] is taken from a <i>bigger</i> price.'] },
    { id: 'h', level: 3, type: 'blanks', prompt: 'Hafiz and Priya paint a mural at their void deck for National Day. Hafiz alone would take <b>6 days</b>. Priya alone would take <b>9 days</b>. They take turns: Hafiz paints on Day 1, Priya on Day 2, Hafiz on Day 3, and so on. On which day is the mural finished?',
      template: 'On Day {0}', blanks: [{ answer: 7, size: 'sm' }],
      hint: 'Suppose the mural has 18 equal parts (18 is a multiple of 6 and 9). How many parts does each of them paint in a day?',
      solution: ['Suppose the mural has 18 parts. Hafiz paints 18 ÷ 6 = 3 parts a day; Priya paints 18 ÷ 9 = 2 parts a day.', 'Every 2 days (Hafiz + Priya), 3 + 2 = 5 parts are painted.',
        tbl(['Day', 'Painter', 'Parts done'], [['1', 'Hafiz', '3'], ['2', 'Priya', '5'], ['3', 'Hafiz', '8'], ['4', 'Priya', '10'], ['5', 'Hafiz', '13'], ['6', 'Priya', '15'], [H('7'), H('Hafiz'), H('<b>18</b>')]], '', true),
        'After Day 6, 15 parts are done and 3 are left. Hafiz paints exactly 3 parts on Day 7.', 'The mural is finished on <b>Day 7</b>.'] },
    { id: 'i', level: 3, type: 'blanks', prompt: 'Uncle Tan can paint the corridor of an HDB block by himself in <b>6 hours</b>. When Uncle Tan and Uncle Kumar work together, they take <b>4 hours</b>. How long would <b>Uncle Kumar</b> take to paint the corridor by himself?',
      template: '{0} hours', blanks: [{ answer: 12 }],
      hint: 'Suppose the corridor has 12 sections. How many sections does Uncle Tan paint in 1 hour? How many do the two of them paint in 1 hour?',
      solution: ['Suppose the corridor has 12 sections (12 is a multiple of 6 and 4).', 'Uncle Tan paints 12 ÷ 6 = 2 sections an hour.', 'Together they paint 12 ÷ 4 = 3 sections an hour.', 'So Uncle Kumar paints 3 − 2 = 1 section an hour.', 'By himself he needs 12 ÷ 1 = <b>12 hours</b>.'] },
  ],
  adult: 'Links to school work: P4 multiples and common multiples, fractions of a quantity, and the four operations. Choosing a convenient number is a standard Singapore heuristic ("make a supposition") that pupils use later in P5–P6 fraction, ratio and percentage problems. Work-rate and meeting problems are not in the primary syllabus, so this topic is <b>enrichment</b>. Note that question 1 needs [[f:1/3]] + [[f:1/4]], which P4 pupils can add using a common denominator; supposing $12 lets them solve it with whole numbers instead. Common mistakes: adding the times (3 h + 6 h) instead of the amounts done per hour; thinking "up by [[f:1/5]] then down by [[f:1/5]]" returns to the same price. Tip: ask your child to solve the problem twice with two different supposed numbers. Getting the same answer is a powerful check.',
};

/* ---------- S3 helpers: coordinate grids ---------- */
// W×H grid, first quadrant. pts: [{x, y, t, c, at:'r'|'l'|'t'|'b', mark:'dot'|'x'|'star'}]
function grid(W, Hh, { u = 38, pts = [], rects = [], path = null, guides = [], label = 'A coordinate grid', maxw, bg = '#fff', extra = '' } = {}) {
  const L = 38, T = 28, R = 34, B = 34;
  const X = i => L + i * u, Y = j => T + (Hh - j) * u;
  let g = `<rect x="${X(0)}" y="${Y(Hh)}" width="${W * u}" height="${Hh * u}" fill="${bg}"/>`;
  for (let i = 0; i <= W; i++) g += `<line x1="${X(i)}" y1="${Y(0)}" x2="${X(i)}" y2="${Y(Hh)}" stroke="#c9d3e6" stroke-width="1.6"/>`;
  for (let j = 0; j <= Hh; j++) g += `<line x1="${X(0)}" y1="${Y(j)}" x2="${X(W)}" y2="${Y(j)}" stroke="#c9d3e6" stroke-width="1.6"/>`;
  if (typeof extra === 'function') g += extra(X, Y);
  for (const r of rects) g += `<polygon points="${r.p.map(([a, b]) => `${X(a)},${Y(b)}`).join(' ')}" fill="${r.c}" fill-opacity="${r.o ?? .55}" stroke="${r.s || INK}" stroke-width="3" stroke-linejoin="round"/>`;
  // axes
  g += `<line x1="${X(0)}" y1="${Y(0)}" x2="${X(W) + 16}" y2="${Y(0)}" stroke="${INK}" stroke-width="3"/><path d="M${X(W) + 24} ${Y(0)} l-11 -6 v12z" fill="${INK}"/>
    <line x1="${X(0)}" y1="${Y(0)}" x2="${X(0)}" y2="${Y(Hh) - 16}" stroke="${INK}" stroke-width="3"/><path d="M${X(0)} ${Y(Hh) - 24} l-6 11 h12z" fill="${INK}"/>
    <text x="${X(W) + 22}" y="${Y(0) + 24}" text-anchor="middle" font-family="Nunito, sans-serif" font-style="italic" font-weight="800" font-size="17" fill="${INK}">x</text>
    <text x="${X(0) + 16}" y="${Y(Hh) - 12}" text-anchor="middle" font-family="Nunito, sans-serif" font-style="italic" font-weight="800" font-size="17" fill="${INK}">y</text>`;
  for (let i = 0; i <= W; i++) g += `<text x="${X(i)}" y="${Y(0) + 22}" text-anchor="middle" ${NF} font-size="15" fill="${INK}">${i}</text>`;
  for (let j = 1; j <= Hh; j++) g += `<text x="${X(0) - 12}" y="${Y(j) + 5}" text-anchor="end" ${NF} font-size="15" fill="${INK}">${j}</text>`;
  for (const [a, b] of guides) g += `<path d="M${X(a)} ${Y(0)} V${Y(b)} H${X(0)}" fill="none" stroke="#d6453a" stroke-width="2.4" stroke-dasharray="6 5"/>`;
  if (path) {
    g += `<polyline points="${path.map(([a, b]) => `${X(a)},${Y(b)}`).join(' ')}" fill="none" stroke="#7b61ff" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>`;
    path.slice(1, -1).forEach(([a, b]) => { g += `<circle cx="${X(a)}" cy="${Y(b)}" r="3.5" fill="#7b61ff"/>`; });
  }
  for (const p of pts) {
    const x = X(p.x), y = Y(p.y), c = p.c || '#ff6b5b';
    if (p.mark === 'x') g += `<path d="M${x - 8} ${y - 8} l16 16 M${x + 8} ${y - 8} l-16 16" stroke="#d6453a" stroke-width="5" stroke-linecap="round"/>`;
    else if (p.mark === 'fly') g += `<ellipse cx="${x - 6}" cy="${y - 7}" rx="7" ry="4.5" transform="rotate(-30 ${x - 6} ${y - 7})" fill="#dff3ff" stroke="${INK}" stroke-width="1.6"/><ellipse cx="${x + 6}" cy="${y - 7}" rx="7" ry="4.5" transform="rotate(30 ${x + 6} ${y - 7})" fill="#dff3ff" stroke="${INK}" stroke-width="1.6"/><ellipse cx="${x}" cy="${y}" rx="5" ry="7" fill="#3b3f58"/><circle cx="${x}" cy="${y - 7}" r="3.5" fill="#3b3f58"/>`;
    else g += `<circle cx="${x}" cy="${y}" r="7" fill="${c}" ${S} stroke-width="2.4"/>`;
    if (p.t) {
      const at = p.at || 'r', fs = p.fs || 15;
      const [tx, ty, anc] = at === 'r' ? [x + 12, y + 5, 'start'] : at === 'l' ? [x - 12, y + 5, 'end'] : at === 't' ? [x, y - 13, 'middle'] : [x, y + 24, 'middle'];
      g += `<text x="${tx + (p.dx || 0)}" y="${ty + (p.dy || 0)}" text-anchor="${anc}" ${NF} font-size="${fs}" fill="${INK}" stroke="#fff" stroke-width="4" paint-order="stroke" stroke-linejoin="round">${p.t}</text>`;
    }
  }
  const VW = L + W * u + R, VH = T + Hh * u + B;
  return svg(`0 0 ${VW} ${VH}`, g, label, `style="max-width:${maxw || VW}px"`);
}
const ZOO = [{ x: 2, y: 5, t: 'Orangutans', c: '#f2a516' }, { x: 3, y: 6, t: 'Tigers', c: '#ff6b5b' }, { x: 6, y: 3, t: 'Elephants', c: '#9aa7c2', at: 't' }, { x: 5, y: 1, t: 'Giraffes', c: '#ffc94a' }, { x: 1, y: 2, t: 'Kiosk', c: '#3dbb6b' }];
const zooMap = () => grid(8, 6, { pts: ZOO, bg: '#f2fbef', label: 'Zoo map: Orangutans (2, 5), Tigers (3, 6), Elephants (6, 3), Giraffes (5, 1), Kiosk (1, 2)', maxw: 420 });
const SENTOSA = [{ x: 1, y: 1, t: 'Beach Station', c: '#7b61ff' }, { x: 1, y: 6, t: 'Fort Siloso', c: '#a86f3f' }, { x: 4, y: 4, t: 'Luge', c: '#ff6b5b', at: 't' }, { x: 6, y: 6, t: 'Aquarium', c: '#4aa8ff' }, { x: 5, y: 1, t: 'Palawan Beach', c: '#ffc94a', at: 'b' }, { x: 8, y: 2, t: 'Tanjong Beach', c: '#3dbb6b', at: 'l' }];
const sentosaMap = (opts = {}) => grid(9, 7, { u: 38, pts: SENTOSA, bg: '#eef9ff', label: 'Sentosa grid map: Beach Station (1, 1), Fort Siloso (1, 6), Luge (4, 4), Aquarium (6, 6), Palawan Beach (5, 1), Tanjong Beach (8, 2)', maxw: 460, ...opts });

function descartesScene() {
  const rene = { name: 'René', skin: '#f3d2b5', hair: 'curly', hairC: '#5a3a22', shirt: '#2f4a7a', bottom: '#2f4a7a' };
  let ceil = '';
  for (let i = 0; i <= 7; i++) ceil += `<line x1="${30 + i * 40}" y1="20" x2="${30 + i * 40}" y2="120" stroke="#d8c7a6" stroke-width="2"/>`;
  for (let j = 0; j <= 4; j++) ceil += `<line x1="30" y1="${20 + j * 25}" x2="310" y2="${20 + j * 25}" stroke="#d8c7a6" stroke-width="2"/>`;
  return svg('0 0 340 300', `<rect width="340" height="300" rx="20" fill="#f6eedd"/>
    <rect x="30" y="20" width="280" height="100" fill="#fbf6ea" stroke="#c9b58e" stroke-width="3"/>${ceil}
    <path d="M30 120 V20 H310" fill="none" stroke="#d6453a" stroke-width="4"/>
    <path d="M110 120 V70 H30" fill="none" stroke="#d6453a" stroke-width="2.5" stroke-dasharray="6 5"/>
    <g transform="translate(110 70)"><ellipse cx="-6" cy="-7" rx="7" ry="4.5" transform="rotate(-30 -6 -7)" fill="#dff3ff" stroke="${INK}" stroke-width="1.6"/><ellipse cx="6" cy="-7" rx="7" ry="4.5" transform="rotate(30 6 -7)" fill="#dff3ff" stroke="${INK}" stroke-width="1.6"/><ellipse cx="0" cy="0" rx="5" ry="7" fill="#3b3f58"/><circle cx="0" cy="-7" r="3.5" fill="#3b3f58"/></g>
    <text x="250" y="148" text-anchor="middle" ${HF} font-size="16" fill="#7a5b2e">the ceiling</text>
    <rect x="34" y="150" width="20" height="120" rx="6" fill="#a86f3f" ${S}/>
    <rect x="62" y="196" width="58" height="30" rx="12" fill="#fff" ${S} stroke-width="2.4"/>
    ${kid(rene, { x: 118, y: 192, s: .72, pose: 'think', mood: 'think' })}
    <path d="M110 200 q8 -5 16 0" fill="none" stroke="#5a3a22" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M54 232 h250 v46 h-250z" fill="#a86f3f" ${S}/>
    <path d="M60 236 q40 -16 92 -12 q70 -6 150 4 v30 h-242z" fill="#3dbb6b" ${S}/>
    <path d="M150 238 q60 10 150 2" fill="none" stroke="#2c9654" stroke-width="3"/>
    <rect x="288" y="240" width="16" height="40" rx="5" fill="#a86f3f" ${S}/>
    <text x="230" y="208" text-anchor="middle" ${HF} font-size="30" fill="#7b61ff">?</text>`, 'Young René Descartes in bed, watching a fly on the ceiling tiles');
}

/* ===================== Maths Story: Descartes and the Grid ===================== */
const S3 = {
  id: 'S3',
  title: 'Maths Story: Descartes and the Grid',
  intro: 'How can you tell a friend <i>exactly</i> where something is? About 400 years ago, a thinker lying in bed came up with a brilliant answer: use <b>two numbers</b>.',
  skills: ['History of maths', 'Grids and coordinates', 'Area on a grid'],
  art: () => svg('0 0 360 220', `<rect width="360" height="220" rx="20" fill="#bfe3ff"/>
    <path d="M18 22 q80 -8 160 2 q90 -10 164 0 l-4 176 q-80 10 -160 0 q-80 8 -158 -2z" fill="#fbecc4" ${S}/>
    <path d="M60 120 q20 -50 90 -46 q40 -26 100 -6 q50 6 54 46 q-10 40 -70 42 q-50 22 -110 6 q-70 -4 -64 -42z" fill="#a8e0a0" ${S} stroke-width="2.6"/>
    ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<line x1="${44 + i * 40}" y1="34" x2="${44 + i * 40}" y2="186" stroke="#c9a96b" stroke-width="1.4"/>`).join('')}
    ${[0, 1, 2, 3, 4].map(j => `<line x1="34" y1="${46 + j * 34}" x2="330" y2="${46 + j * 34}" stroke="#c9a96b" stroke-width="1.4"/>`).join('')}
    <path d="M84 148 C120 150 140 110 164 114 S220 140 244 80" fill="none" stroke="#d6453a" stroke-width="3.5" stroke-dasharray="8 7" stroke-linecap="round"/>
    <path d="M234 70 l20 20 M254 70 l-20 20" stroke="#d6453a" stroke-width="6" stroke-linecap="round"/>
    ${A.tree(118, 128, .32)}${A.tree(210, 158, .28)}
    <g transform="translate(300 66)"><circle r="20" fill="#fff" ${S} stroke-width="2.4"/><path d="M0 -15 l5 15 l-5 15 l-5 -15z" fill="#ff6b5b" ${S} stroke-width="1.6"/><text y="-24" text-anchor="middle" ${HF} font-size="13" fill="${INK}">N</text></g>
    <rect x="96" y="190" width="168" height="26" rx="10" fill="#fff" ${S} stroke-width="2.4"/>
    <text x="180" y="209" text-anchor="middle" ${HF} font-size="16" fill="${INK}">X marks the spot!</text>`, 'A treasure map of an island drawn on a grid, with a red X'),
  explore: {
    title: 'The Story: A Fly on the Ceiling',
    setup: 'About 400 years ago in France lived a thinker called <b>René Descartes</b> (say "ruh-NAY day-KART"). He was a philosopher, a scientist and a mathematician.',
    art: descartesScene,
    steps: [
      { who: 'leo', text: 'As a boy, René was often unwell, so his teachers let him rest in bed late every morning. He did not waste the time: he lay there and <b>thought</b>. He kept this habit all his life.' },
      { who: 'leo', mood: 'think', text: 'One morning, so the story goes, he watched a fly crawling across the ceiling. He wondered: "How could I tell someone <b>exactly</b> where that fly is, at every moment?"' },
      { who: 'arjun', mood: 'think', text: '"It\'s near the corner" is not exact enough. The fly keeps moving!' },
      { who: 'leo', text: 'René looked at the corner where two walls met the ceiling. He realised he only needed to say how far the fly was <b>along</b> one wall and how far it was <b>out</b> from the other. <b>Two numbers</b> pin down any spot!',
        art: () => grid(6, 4, { u: 40, pts: [{ x: 4, y: 3, mark: 'fly', t: '(4, 3)', at: 'r', dx: 6, dy: 6 }], guides: [[4, 3]], bg: '#fbf6ea', label: 'A fly at the point (4, 3) on a grid', maxw: 320 }) },
      { who: 'chloe', text: 'So the fly is 4 squares across and 3 squares up. We write that as <b>(4, 3)</b>. The corner where we start counting is <b>(0, 0)</b>.' },
      { who: 'leo', text: 'Order matters! The <b>across</b> number always comes first, then the <b>up</b> number. (4, 3) and (3, 4) are different spots. Think of a map: first go <b>along</b> (across), then go <b>up</b>. Across first, up second!',
        art: () => grid(6, 5, { u: 38, pts: [{ x: 4, y: 3, c: '#ff6b5b', t: '(4, 3)', at: 'r' }, { x: 3, y: 4, c: '#4aa8ff', t: '(3, 4)', at: 'l' }], guides: [[4, 3]], label: 'The points (4, 3) and (3, 4) are in different places', maxw: 320 }) },
      { who: 'aisyah', text: 'In <b>1637</b>, Descartes published a book showing how points, lines and curves could all be described with numbers. Pairs of numbers like (4, 3) are now called <b>Cartesian coordinates</b>, after him. (Nobody knows if the fly story really happened, but the idea certainly did!)' },
      { who: 'weiming', text: 'And we use his idea every day: maps, the seat plan at the National Stadium, video games, even the map app on a phone. Let\'s try some Singapore maps!' },
    ],
  },
  keys: [
    { title: 'Two numbers for one place', text: 'A point on a grid is given by a pair of numbers called its <b>coordinates</b>, like (5, 2).' },
    { title: 'Across first, then up', text: 'In (5, 2), go 5 squares <b>across</b> from (0, 0), then 2 squares <b>up</b>. The across number is also called the <i>x</i>-coordinate; the up number is the <i>y</i>-coordinate.' },
    { title: 'Moving on a grid', text: 'Moving right adds to the first number; moving up adds to the second. Left and down take away.' },
    { title: 'Distance and area', text: 'Along grid lines, distance = squares across + squares up or down. A rectangle 5 squares long and 3 squares wide covers 5 × 3 = 15 squares.' },
  ],
  practice: [
    { id: 'a', level: 1, type: 'mcq', prompt: 'Here is a simple grid map of some animals at the <b>Singapore Zoo</b>. What is at <b>(6, 3)</b>?',
      art: zooMap(),
      options: ['Tigers', 'Elephants', 'Giraffes', 'Orangutans'], answer: 1,
      hint: 'Start at (0, 0). Go 6 squares across first, then 3 squares up.',
      solution: ['(6, 3) means 6 across, then 3 up.', 'That point is the <b>Elephants</b>.', 'The Tigers are at (3, 6): 3 across and 6 up. Mixing up the order sends you to the wrong animal!'] },
    { id: 'b', level: 1, type: 'blanks', prompt: 'Use the same zoo map. What are the coordinates of the <b>Giraffes</b>?',
      art: zooMap(),
      template: 'Giraffes: ( {0} , {1} )', blanks: [{ answer: 5, size: 'sm' }, { answer: 1, size: 'sm' }],
      hint: 'From the Giraffes, look straight down to read the across number, then straight left to read the up number.',
      solution: ['Straight down from the Giraffes, the across number is 5.', 'Straight left, the up number is 1.', 'The Giraffes are at <b>(5, 1)</b>. Across first, then up.'] },
    { id: 'c', level: 1, type: 'mcq', prompt: 'For Sports Day, four game stations A, B, C and D are marked on a grid plan of the school field. Which station is at <b>(4, 0)</b>?',
      art: grid(5, 5, { pts: [{ x: 0, y: 4, t: 'A', c: '#ff6b5b' }, { x: 4, y: 0, t: 'B', c: '#4aa8ff', at: 't' }, { x: 4, y: 4, t: 'C', c: '#3dbb6b' }, { x: 2, y: 2, t: 'D', c: '#ffc94a' }], bg: '#eaf8e4', label: 'Stations A (0, 4), B (4, 0), C (4, 4), D (2, 2)', maxw: 300 }),
      options: ['A', 'B', 'C', 'D'], answer: 1,
      hint: '(4, 0) means 4 across and 0 up. Where do you end up if you do not go up at all?',
      solution: ['Go 4 squares across from (0, 0), then 0 squares up.', 'You stay on the across line (the <i>x</i>-axis), at station <b>B</b>.', 'Station A is at (0, 4): 0 across and 4 up.'] },
    { id: 'd', level: 2, type: 'blanks', prompt: 'Here is a simple grid map of <b>Sentosa</b> (not to scale). Mei Ling starts at <b>Beach Station</b>. She moves <b>3 squares right</b> and then <b>3 squares up</b>. What are the coordinates of the place she reaches?',
      art: sentosaMap(),
      template: 'She reaches ( {0} , {1} )', blanks: [{ answer: 4, size: 'sm' }, { answer: 4, size: 'sm' }],
      hint: 'Beach Station is at (1, 1). Moving right adds to the first number; moving up adds to the second.',
      solution: ['Beach Station is at (1, 1).', '3 squares right: 1 + 3 = 4. 3 squares up: 1 + 3 = 4.', 'She reaches <b>(4, 4)</b>, which is the Luge.'] },
    { id: 'e', level: 2, type: 'blanks', prompt: 'On the Sentosa grid map, each square is <b>100 m</b> wide. Paths run only along the grid lines. What is the <b>shortest</b> walking distance from <b>Fort Siloso</b> to <b>Tanjong Beach</b>?',
      art: sentosaMap({}),
      template: '{0} m', blanks: [{ answer: 1100 }],
      hint: 'Find the coordinates of both places. How many squares across and how many squares down?',
      solution: ['Fort Siloso is at (1, 6) and Tanjong Beach is at (8, 2).', 'Across: 8 − 1 = 7 squares. Down: 6 − 2 = 4 squares.', 'Any shortest path along the grid lines has 7 + 4 = 11 squares (the purple path is one of them).', sentosaMap({ path: [[1, 6], [1, 3], [8, 3], [8, 2]] }), '11 × 100 m = <b>1100 m</b>.'] },
    { id: 'f', level: 2, type: 'blanks', prompt: 'A new vegetable plot at a community garden is the rectangle PQRS on this grid. Each square is <b>1 m</b> by <b>1 m</b>. Find the <b>area</b> and the <b>perimeter</b> of the plot.',
      art: grid(8, 5, { rects: [{ p: [[2, 1], [7, 1], [7, 4], [2, 4]], c: '#9edcaa' }], pts: [{ x: 2, y: 1, t: 'P (2, 1)', at: 'b', c: INK }, { x: 7, y: 1, t: 'Q (7, 1)', at: 'b', c: INK }, { x: 7, y: 4, t: 'R (7, 4)', at: 't', c: INK }, { x: 2, y: 4, t: 'S (2, 4)', at: 't', c: INK }], label: 'Rectangle P (2, 1), Q (7, 1), R (7, 4), S (2, 4)', maxw: 400 }),
      template: 'Area = {0} m² &nbsp;&nbsp; Perimeter = {1} m', blanks: [{ answer: 15, size: 'sm' }, { answer: 16, size: 'sm' }],
      hint: 'Length = difference of the across numbers of P and Q. Width = difference of the up numbers of Q and R.',
      solution: ['Length PQ: 7 − 2 = 5 m. Width QR: 4 − 1 = 3 m.', 'Area = 5 × 3 = <b>15 m²</b> (count the squares to check!).', 'Perimeter = 5 + 3 + 5 + 3 = <b>16 m</b>.'] },
    { id: 'g', level: 3, type: 'blanks', prompt: 'A treasure is buried somewhere on the Sentosa grid map. The clue says: <i>"Its across number is <b>2 more</b> than its up number, and the two numbers <b>add up to 10</b>."</i> Where is the treasure?',
      art: sentosaMap(),
      template: 'The treasure is at ( {0} , {1} )', blanks: [{ answer: 6, size: 'sm' }, { answer: 4, size: 'sm' }],
      hint: 'Two numbers add up to 10 and differ by 2. Take away the difference, then share the rest equally.',
      solution: ['The two numbers add up to 10, and the across number is 2 more than the up number.', 'Take away the extra 2: 10 − 2 = 8. Share equally: up number = 8 ÷ 2 = 4.', 'Across number = 4 + 2 = 6.', 'The treasure is at <b>(6, 4)</b>. Check: 6 + 4 = 10 ✓ and 6 − 4 = 2 ✓'] },
    { id: 'h', level: 3, type: 'blanks', prompt: 'A cleaning robot at <b>Changi Airport</b> starts at (0, 0) on the floor grid. It moves <b>3 right</b>, <b>4 up</b>, <b>2 right</b>, <b>1 down</b> and then <b>4 left</b>. Where does it stop? Then it must go back to (0, 0) along the grid lines. What is the shortest distance back, in squares?',
      art: grid(6, 5, { pts: [{ x: 0, y: 0, t: 'Start', at: 'r', dy: -14, c: '#3dbb6b' }], bg: '#f4f6fb', label: 'A floor grid with the robot starting at (0, 0)', maxw: 320 }),
      template: 'It stops at ( {0} , {1} ). Shortest way back: {2} squares.', blanks: [{ answer: 1, size: 'sm' }, { answer: 3, size: 'sm' }, { answer: 4, size: 'sm' }],
      hint: 'Keep track of both numbers after each move. Right and left change the first number; up and down change the second.',
      solution: ['(0, 0) → 3 right → (3, 0) → 4 up → (3, 4) → 2 right → (5, 4) → 1 down → (5, 3) → 4 left → <b>(1, 3)</b>.',
        grid(6, 5, { path: [[0, 0], [3, 0], [3, 4], [5, 4], [5, 3], [1, 3]], pts: [{ x: 0, y: 0, t: 'Start', at: 'r', dy: -14, c: '#3dbb6b' }, { x: 1, y: 3, t: 'Stop (1, 3)', at: 't', c: '#ff6b5b' }], bg: '#f4f6fb', label: 'The robot\'s path ends at (1, 3)', maxw: 320 }),
        'To get back from (1, 3): 1 square left and 3 squares down.', 'Shortest distance back = 1 + 3 = <b>4 squares</b>.'] },
    { id: 'i', level: 3, type: 'blanks', prompt: 'At <b>Bishan-Ang Mo Kio Park</b>, a rectangular lawn (green) has opposite corners at (1, 1) and (7, 5). A square pond (blue) with corners (3, 2), (5, 2), (5, 4) and (3, 4) sits inside the lawn. Each square is <b>10 m</b> by <b>10 m</b>. What is the area of the <b>grass</b> (the lawn without the pond)?',
      art: grid(8, 6, { rects: [{ p: [[1, 1], [7, 1], [7, 5], [1, 5]], c: '#9edcaa' }, { p: [[3, 2], [5, 2], [5, 4], [3, 4]], c: '#8cc9ff', o: 1 }], label: 'A lawn from (1, 1) to (7, 5) with a square pond from (3, 2) to (5, 4)', maxw: 400 }),
      template: '{0} m²', blanks: [{ answer: 2000 }],
      hint: 'First count the grid squares: lawn squares minus pond squares. Then remember each square is 10 m × 10 m = 100 m².',
      solution: ['Lawn: (7 − 1) × (5 − 1) = 6 × 4 = 24 squares.', 'Pond: (5 − 3) × (4 − 2) = 2 × 2 = 4 squares.', 'Grass: 24 − 4 = 20 squares.', 'Each square is 10 m × 10 m = 100 m², so the grass covers 20 × 100 = <b>2000 m²</b>.'] },
  ],
  adult: 'This Maths Story retells the life of René Descartes (1596–1650). It is well recorded that poor health as a schoolboy let him stay in bed late in the mornings, a habit he kept for life; the fly on the ceiling is a popular legend. His 1637 work <i>La Géométrie</i> joined algebra and geometry. Links to school work: P4 area and perimeter of rectangles. Coordinates themselves are taught in <b>secondary school</b>, so the grid questions are <b>enrichment</b>, kept to whole numbers and the first quadrant. Common mistakes: writing the up number first, e.g. (3, 6) for (6, 3); counting dots instead of squares when finding lengths. Tip: say "along first, then up" every time you plot a point.',
};

for (const t of [t21, t22, S3]) for (const st of t.explore.steps) if (st.art) { const f = st.art; st.art = () => fit(f()); }
for (const t of [t21, t22, S3]) for (const q of t.practice) if (Array.isArray(q.solution))
  q.solution = q.solution.reduce((acc, x) => { if (/^\s*<(svg|table|div)/.test(x) && acc.length) acc[acc.length - 1] += fit(x); else acc.push(x); return acc; }, []);

export default { t21, t22, S3 };
