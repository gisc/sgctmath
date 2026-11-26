// Unit 4 · Logical Thinking (part 1: t09–t11) — original content, Singapore context.
import * as A from '../art.js';
const { svg, kid, leo } = A;
const INK = A.ink, S = A.stroke;
const HF = 'font-family="Baloo 2, sans-serif" font-weight="800"';
const NF = 'font-family="Nunito, sans-serif" font-weight="800"';

/* ===================== shared helpers ===================== */
// Simple HTML table. head: [..], rows: [[..],..]; cells may be {v, cls}
function tbl(head, rows, caption = '', compact = false) {
  const pad = compact ? ' style="padding:5px 7px"' : '';
  const cell = (c, tag) => (c && typeof c === 'object') ? `<${tag} class="${c.cls || ''}"${pad}>${c.v}</${tag}>` : `<${tag}${pad}>${c}</${tag}>`;
  return `<table class="tbl"${compact ? ' style="font-size:15px"' : ''}>${head ? `<thead><tr>${head.map(h => cell(h, 'th')).join('')}</tr></thead>` : ''}<tbody>${rows.map(r => `<tr>${r.map((c, i) => cell(c, i === 0 ? 'th' : 'td')).join('')}</tr>`).join('')}</tbody></table>${caption ? `<small>${caption}</small>` : ''}`;
}
const YES = { v: '<b style="color:#0f7a73;font-size:1.2em">✓</b>', cls: 'hl' }, NO = '<b style="color:#d6453a;font-size:1.2em">✗</b>';

// Step pictures must not widen the speech bubble on phones: this wrapper adds no width of its own.
const fit = html => `<div style="width:0;min-width:100%;overflow-x:auto">${html}</div>`;

/* ---------- t09 helpers ---------- */
// Gantt / timeline chart. rows: [{label, bars:[{s,e,t,c}]}], T: total minutes
function gantt(rows, T, { unit = 34, label = 'Timeline', end = true, tick = 1, maxw } = {}) {
  const L = Math.max(60, 18 + 9.5 * Math.max(...rows.map(r => r.label.length))), rh = 36, gap = 10, top = 10;
  const W = L + T * unit + 26, axisY = top + rows.length * (rh + gap) + 2, H = axisY + 34;
  let g = '';
  rows.forEach((r, i) => {
    const y = top + i * (rh + gap);
    g += `<text x="${L - 10}" y="${y + rh / 2 + 6}" text-anchor="end" ${NF} font-size="17" fill="${INK}">${r.label}</text>`;
    g += `<rect x="${L}" y="${y}" width="${T * unit}" height="${rh}" rx="6" fill="#f4f6fb"/>`;
    for (const b of r.bars) {
      const x = L + b.s * unit, w = (b.e - b.s) * unit;
      g += `<rect x="${x + 1}" y="${y + 1}" width="${w - 2}" height="${rh - 2}" rx="6" fill="${b.c}" stroke="${INK}" stroke-width="2.2"/>`;
      if (b.t) g += `<text x="${x + w / 2}" y="${y + rh / 2 + 5}" text-anchor="middle" ${NF} font-size="${b.fs || 15}" fill="${b.light ? '#fff' : INK}">${b.t}</text>`;
    }
  });
  g += `<line x1="${L}" y1="${axisY}" x2="${L + T * unit}" y2="${axisY}" stroke="${INK}" stroke-width="2.5"/>`;
  for (let m = 0; m <= T; m += tick) {
    const x = L + m * unit;
    g += `<line x1="${x}" y1="${axisY}" x2="${x}" y2="${axisY + 6}" stroke="${INK}" stroke-width="2"/><text x="${x}" y="${axisY + 22}" text-anchor="middle" ${NF} font-size="15" fill="${INK}">${m}</text>`;
  }
  g += `<text x="${L - 10}" y="${axisY + 22}" text-anchor="end" ${NF} font-size="15" fill="#5d6b88">min</text>`;
  if (end) g += `<line x1="${L + T * unit}" y1="${top - 6}" x2="${L + T * unit}" y2="${axisY}" stroke="#d6453a" stroke-width="2.5" stroke-dasharray="6 5"/>`;
  return svg(`0 0 ${W} ${H}`, g, label, `style="max-width:${maxw || Math.round(W * 1.1)}px"`);
}
const C = { hand: '#ffc94a', mach: '#9fd8ff', wait: '#ffd2cc', ok: '#bfe9e6', grape: '#d9d0ff', leaf: '#c8efd5' };

function kettle(x, y, s = 1, steam = true) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    ${steam ? `<path d="M58 -18 q-8 -10 0 -20 q8 -10 0 -20 M72 -14 q-8 -10 0 -20" fill="none" stroke="#b9c3d6" stroke-width="4" stroke-linecap="round"/>` : ''}
    <path d="M10 70 q-6 -50 18 -62 h28 q24 12 18 62z" fill="#e8eef8" ${S}/>
    <path d="M74 34 q20 -6 26 -26 l6 4 q-4 26 -30 34z" fill="#e8eef8" ${S}/>
    <path d="M24 8 q20 -26 40 0" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M24 8 q20 -26 40 0" fill="none" stroke="#ff6b5b" stroke-width="3.5" stroke-linecap="round"/>
    <rect x="34" y="0" width="16" height="9" rx="3" fill="#ff6b5b" ${S} stroke-width="2.4"/>
    <rect x="2" y="68" width="82" height="10" rx="4" fill="#5d6b88" ${S} stroke-width="2.4"/>
    <circle cx="20" cy="60" r="3.5" fill="#3dbb6b"/></g>`;
}
function pan(x, y, s = 1, n = 2) {
  const k = n === 3 ? .74 : 1;
  const pr = (cx, cy) => `<g transform="translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})"><ellipse cx="${cx}" cy="${cy}" rx="30" ry="15" fill="#f2b65a" stroke="#b77a2a" stroke-width="2.4"/><path d="M${cx - 16} ${cy} q16 -9 32 0 M${cx - 9} ${cy + 6} q9 -5 18 0" fill="none" stroke="#d8933b" stroke-width="2.2" stroke-linecap="round"/></g>`;
  const spots = n === 3 ? [[-47, 2], [0, 2], [47, 2]] : [[-33, 2], [33, 2]];
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <rect x="78" y="-6" width="58" height="14" rx="7" fill="#3b3f58" ${S}/>
    <ellipse cx="0" cy="6" rx="86" ry="38" fill="#3b3f58" ${S}/><ellipse cx="0" cy="2" rx="74" ry="30" fill="#5d6b88"/>
    ${spots.slice(0, n).map(([dx, dy]) => pr(dx, dy)).join('')}</g>`;
}
function bridgeArt() {
  const ppl = [['Ravi', 1, '#4aa8ff'], ['Mei Ling', 2, '#ff6b5b'], ['Uncle Kumar', 6, '#3dbb6b'], ['Grandma', 8, '#7b61ff']];
  return svg('0 0 460 170', `<rect width="460" height="170" rx="16" fill="#1f2a48"/>
    <circle cx="420" cy="30" r="16" fill="#fff3b0"/><circle cx="413" cy="25" r="16" fill="#1f2a48"/>
    <path d="M196 122 q80 -10 150 0 v48 h-150z" fill="#2f6fb3"/><path d="M0 110 h204 v60 h-204z M338 110 h122 v60 h-122z" fill="#2f7a4a"/>
    <rect x="194" y="98" width="154" height="12" rx="4" fill="#c98b55" ${S}/>${[0, 1, 2, 3, 4].map(i => `<line x1="${214 + i * 28}" y1="98" x2="${214 + i * 28}" y2="110" stroke="${INK}" stroke-width="2"/>`).join('')}
    <path d="M196 98 v-26 M346 98 v-26 M196 76 q75 14 150 0" fill="none" stroke="#c98b55" stroke-width="4"/>
    ${ppl.map(([n, t, c], i) => `<circle cx="22" cy="${20 + i * 22}" r="7" fill="${c}" stroke="#fff" stroke-width="2"/><text x="36" y="${25 + i * 22}" ${NF} font-size="15" fill="#fff">${n}: ${t} min</text>`).join('')}
    <g transform="translate(140 132) rotate(-15)"><rect x="-6" y="-6" width="34" height="13" rx="4" fill="#ffc94a" ${S} stroke-width="2"/><path d="M28 -8 l22 -10 v28 l-22 -6z" fill="#fff3b0" opacity=".8"/></g>
    <text x="64" y="150" text-anchor="middle" ${NF} font-size="14" fill="#fff">1 torch</text>
    <text x="271" y="158" text-anchor="middle" ${HF} font-size="15" fill="#fff">at most 2 on the bridge</text>`, 'Four people, one torch and a narrow bridge at night', 'style="max-width:470px"');
}
const panArt = (n, label) => svg('0 0 330 100', `${pan(100, 46, .8, n)}<text x="270" y="40" text-anchor="middle" ${HF} font-size="17" fill="${INK}">each side</text><text x="270" y="66" text-anchor="middle" ${HF} font-size="24" fill="#d6453a">2 min</text>`, label, 'style="max-width:340px"');
function clock(x, y, r, mins = 10) {
  const a = mins / 60 * 2 * Math.PI - Math.PI / 2;
  let t = '';
  for (let i = 0; i < 12; i++) { const b = i * Math.PI / 6; t += `<line x1="${x + (r - 6) * Math.cos(b)}" y1="${y + (r - 6) * Math.sin(b)}" x2="${x + (r - 2) * Math.cos(b)}" y2="${y + (r - 2) * Math.sin(b)}" stroke="${INK}" stroke-width="2"/>`; }
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" ${S}/>${t}
    <line x1="${x}" y1="${y}" x2="${x + (r - 10) * Math.cos(a)}" y2="${y + (r - 10) * Math.sin(a)}" stroke="#ff6b5b" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="${x}" y1="${y}" x2="${x}" y2="${y - r * .45}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="4" fill="${INK}"/>`;
}
function stove(x, y, w = 200) {
  return `<rect x="${x}" y="${y}" width="${w}" height="16" rx="6" fill="#c9cfdc" ${S}/><rect x="${x + 10}" y="${y + 16}" width="${w - 20}" height="44" rx="6" fill="#eef1f7" ${S}/>
    <circle cx="${x + 34}" cy="${y + 38}" r="7" fill="#fff" ${S} stroke-width="2.4"/><circle cx="${x + 60}" cy="${y + 38}" r="7" fill="#fff" ${S} stroke-width="2.4"/>`;
}
function bucket(x, y, c = '#4aa8ff') { return `<path d="M${x} ${y} h34 l-5 34 h-24z" fill="${c}" ${S}/><path d="M${x + 2} ${y} q15 -16 30 0" fill="none" ${S} stroke-width="2.4"/>`; }

/* ---------- t10 helpers ---------- */
function block(x, y, c = '#ffe3b3', s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-15" y="-46" width="30" height="46" rx="3" fill="${c}" ${S} stroke-width="2.4"/>
    ${[0, 1, 2].map(r => `<rect x="-10" y="${-40 + r * 12}" width="7" height="6" fill="#8fc8ff"/><rect x="3" y="${-40 + r * 12}" width="7" height="6" fill="#8fc8ff"/>`).join('')}
    <rect x="-17" y="-50" width="34" height="7" rx="2" fill="#fff" ${S} stroke-width="2"/></g>`;
}
function busStop(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><line x1="0" y1="0" x2="0" y2="-52" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
    <rect x="-15" y="-74" width="30" height="26" rx="6" fill="#0f9d94" ${S} stroke-width="2.4"/>
    <text x="0" y="-55" text-anchor="middle" ${HF} font-size="14" fill="#fff">BUS</text></g>`;
}
const BC = ['#ffe3b3', '#cdeee0', '#ffd2cc', '#dcecff', '#efe3ff', '#fff3b0'];
// pts: [{p, name, sub?, n?}] positions in m. len = road length shown.
function road(pts, len, { W = 560, stop = null, range = null, label = 'Points on a straight road', icon = 'block', showM = true, maxw, gapLabel = null } = {}) {
  const x0 = 40, x1 = W - 40, X = p => x0 + p / len * (x1 - x0);
  const ry = 92;
  const hasN = pts.some(q => q.n);
  let g = `<rect x="16" y="${ry}" width="${W - 32}" height="22" rx="11" fill="#c9cfdc" ${S}/>
    <line x1="30" y1="${ry + 11}" x2="${W - 30}" y2="${ry + 11}" stroke="#fff" stroke-width="3" stroke-dasharray="12 10"/>`;
  if (range) g += `<rect x="${X(range[0])}" y="${ry - 4}" width="${X(range[1]) - X(range[0])}" height="30" rx="8" fill="#3dbb6b" opacity=".45" stroke="#2c9654" stroke-width="2.5"/>`;
  pts.forEach((q, i) => {
    const x = X(q.p);
    if (icon === 'block') g += block(x, ry - 4, q.c || BC[i % BC.length], .9);
    else if (icon === 'dot') g += `<circle cx="${x}" cy="${ry - 16}" r="10" fill="${q.c || '#ff6b5b'}" ${S} stroke-width="2.4"/>`;
    if (q.n) g += `<rect x="${x - 22}" y="${ry - 86}" width="44" height="24" rx="12" fill="#7b61ff" ${S} stroke-width="2"/><text x="${x}" y="${ry - 68}" text-anchor="middle" ${NF} font-size="14" fill="#fff">${q.n}</text>`;
    g += `<circle cx="${x}" cy="${ry + 11}" r="5" fill="${INK}"/>`;
    g += `<text x="${x}" y="${ry + 44}" text-anchor="middle" ${NF} font-size="17" fill="${INK}">${q.name}</text>`;
    if (showM) g += `<text x="${x}" y="${ry + 63}" text-anchor="middle" ${NF} font-size="14" fill="#5d6b88">${q.sub ?? q.p + ' m'}</text>`;
  });
  if (stop != null) g += busStop(X(stop) + 30, ry + 2, .9);
  if (gapLabel) { const [a, b, t] = gapLabel, ya = ry - 40; g += `<path d="M${X(a)} ${ya + 8} v-8 h${X(b) - X(a)} v8" fill="none" stroke="${INK}" stroke-width="2.5"/><text x="${(X(a) + X(b)) / 2}" y="${ya - 8}" text-anchor="middle" ${NF} font-size="15" fill="${INK}">${t}</text>`; }
  const top = hasN ? 0 : gapLabel ? 34 : icon === 'dot' ? 56 : 34;
  return svg(`0 ${top} ${W} ${ry + 72 - top}`, g, label, `style="max-width:${maxw || W}px"`);
}

/* ---------- t11 helpers ---------- */
function magnifier(x, y, s = 1, rot = -35) {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><rect x="-8" y="34" width="16" height="56" rx="7" fill="#a86f3f" ${S}/>
    <circle cx="0" cy="0" r="38" fill="#dff3ff" opacity=".85"/><circle cx="0" cy="0" r="38" fill="none" stroke="${INK}" stroke-width="11"/><circle cx="0" cy="0" r="38" fill="none" stroke="#ffc94a" stroke-width="6"/>
    <path d="M-20 -14 q8 -14 22 -16" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/></g>`;
}
function detHat(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-40 0 q40 -16 80 0 q-6 8 -40 8 q-34 0 -40 -8z" fill="#a8693d" ${S}/>
    <path d="M-28 -4 q2 -30 28 -32 q26 2 28 32 q-28 8 -56 0z" fill="#c98b55" ${S}/><path d="M-27 -10 q27 8 54 0" fill="none" stroke="#7a4a26" stroke-width="5"/></g>`;
}
function speech(x, y, w, text, c = '#fff', fs = 14) {
  return `<rect x="${x}" y="${y}" width="${w}" height="30" rx="12" fill="${c}" ${S} stroke-width="2.4"/><text x="${x + w / 2}" y="${y + 20}" text-anchor="middle" ${NF} font-size="${fs}" fill="${INK}">${text}</text>`;
}
// Who-said-what table
const says = rows => tbl(null, rows.map(([w, t]) => [w, `<span style="display:block;text-align:left">“${t}”</span>`]));
// Logic grid as an HTML table; marks: {'row|col': '✓' or '✗'}
function lgrid(rows, cols, marks = {}) {
  const soft = { 'pineapple tarts': 'pine&shy;apple<br>tarts', murukku: 'muru&shy;kku', 'chicken rice': 'chicken<br>rice' };
  return fit(tbl(['', ...cols.map(c => soft[c] || c.replace(' ', '<br>'))], rows.map(r => [r.replace(' ', '&nbsp;'), ...cols.map(c => { const m = marks[r + '|' + c]; return m === '✓' ? YES : m === '✗' ? NO : '&nbsp;'; })]), '', true));
}

/* ===================== Topic 9 ===================== */
const t09 = {
  id: 't09',
  title: 'Planning Time Wisely',
  intro: 'Why stand around waiting? Smart planners do jobs at the same time, keep the pan full and let the quickest person go first. Let\'s save some minutes!',
  skills: ['Timelines', 'Overlapping jobs', 'Best order'],
  art: () => svg('0 0 360 220', `<rect width="360" height="220" rx="20" fill="#fff4dd"/>
    <rect x="0" y="0" width="360" height="60" rx="20" fill="#ffe1b0"/>
    ${clock(44, 32, 22, 20)}
    <text x="78" y="42" ${HF} font-size="26" fill="#d6453a">Save time!</text>
    ${stove(22, 132, 186)}${pan(104, 112, .72, 2)}
    ${kettle(238, 70, .86)}
    <rect x="222" y="137" width="120" height="14" rx="6" fill="#c98b55" ${S}/>
    <text x="115" y="212" text-anchor="middle" ${NF} font-size="15" fill="${INK}">2 prata at a time</text>
    <text x="282" y="176" text-anchor="middle" ${NF} font-size="15" fill="${INK}">boils by itself</text>`, 'A frying pan with two prata on a stove, a boiling kettle and a clock'),
  explore: {
    setup: 'It is Saturday morning. Chloe wants to make Milo and kaya toast for her family <b>as quickly as possible</b>. She has 6 jobs to do.',
    art: () => svg('0 0 340 300', `<rect width="340" height="300" rx="20" fill="#eaf6ff"/>
      <rect x="0" y="0" width="340" height="150" rx="20" fill="#dff0ff"/>
      <rect x="226" y="24" width="90" height="70" rx="8" fill="#fff" ${S}/><path d="M271 24 v70 M226 59 h90" stroke="${INK}" stroke-width="3"/>
      ${clock(150, 48, 30, 45)}
      ${kid('chloe', { x: 78, y: 120, s: .9, pose: 'think', mood: 'think' })}
      <rect x="124" y="196" width="208" height="16" rx="6" fill="#c98b55" ${S}/><rect x="134" y="212" width="188" height="80" fill="#f3d9b8" ${S}/>
      ${kettle(130, 137, .75)}
      ${A.cup(214, 156, 0, { w: 28, h: 40 })}${A.cup(246, 156, 0, { w: 28, h: 40 })}
      ${A.kayaToast(282, 186, .5)}
      <text x="228" y="258" text-anchor="middle" ${HF} font-size="22" fill="#0f7a73">6 jobs</text>`, 'Chloe in the kitchen with a kettle, cups and kaya toast'),
    steps: [
      { who: 'chloe', text: 'Here are my jobs. If I do them one at a time, it takes 1 + 8 + 2 + 1 + 3 + 1 = <b>16 minutes</b>. My family is hungry!',
        art: () => tbl(['Job', 'Time'], [
          ['Fill the kettle, switch it on', '1&nbsp;min'], ['Water boils <span class="hl">(the kettle does it by itself)</span>', '8&nbsp;min'],
          ['Wash the cups', '2&nbsp;min'], ['Spoon Milo into the cups', '1&nbsp;min'], ['Spread kaya on the toast', '3&nbsp;min'],
          ['Pour hot water and stir (needs boiled water)', '1&nbsp;min']]) },
      { who: 'leo', mood: 'think', text: 'Look closely. While the kettle is boiling, Chloe\'s hands are <b>free</b>! Ask two questions: Which jobs need <b>me</b>? Which jobs happen <b>by themselves</b>?' },
      { who: 'weiming', text: 'So Chloe fills the kettle first. While it boils, she washes the cups, spoons the Milo and spreads the kaya: 2 + 1 + 3 = 6 minutes of work. That fits inside the 8 minutes of boiling!',
        art: () => gantt([
          { label: 'Chloe', bars: [{ s: 0, e: 1, t: 'Fill', c: C.hand }, { s: 1, e: 3, t: 'Cups', c: C.hand }, { s: 3, e: 4, t: 'Milo', c: C.hand, fs: 12 }, { s: 4, e: 7, t: 'Kaya', c: C.hand }, { s: 9, e: 10, t: 'Pour', c: C.hand, fs: 12 }] },
          { label: 'Kettle', bars: [{ s: 1, e: 9, t: 'Boiling…', c: C.mach }] }], 10, { label: 'Timeline: Chloe and the kettle work at the same time' }) },
      { who: 'arjun', text: 'The water is ready at the 9-minute mark. Pouring and stirring takes 1 more minute. Total: 1 + 8 + 1 = <b>10 minutes</b>. Can it be even shorter?' },
      { who: 'leo', text: 'No! The kettle can only start after it is filled, and the pouring must wait for the boiled water. That <b>chain</b> takes 1 + 8 + 1 = 10 minutes, so 10 minutes is the <b>least</b> possible time. Chloe saved 6 minutes!' },
      { who: 'aisyah', mood: 'think', text: 'After breakfast, three of us share <b>one</b> sink to wash up. Arjun needs 1 min, I need 3 min and Wei Ming needs 5 min. Each person\'s time = waiting + washing. Who should go first?',
        art: () => tbl(['Order', 'Each one finishes at', 'Total'], [
          ['Longest first:<br>5, 3, 1', '5, 8, 9', '22&nbsp;min'],
          [{ v: 'Shortest first:<br>1, 3, 5', cls: 'hl' }, { v: '1, 4, 9', cls: 'hl' }, { v: '<b>14&nbsp;min</b>', cls: 'hl' }]], 'Longest first: Wei Ming, Aisyah, Arjun. Shortest first: Arjun, Aisyah, Wei Ming.') },
      { who: 'chloe', text: '<b>Shortest job first!</b> The first person makes everyone else wait, so let the quickest one go first. The total time is the least.' },
    ],
  },
  keys: [
    { title: 'Use the waiting time', text: 'Spot the jobs that run by themselves (a kettle, a rice cooker, a washing machine). Do other jobs while you wait.' },
    { title: 'Find the chain', text: 'Some jobs must happen in a fixed order. That chain of jobs tells you the least possible total time.' },
    { title: 'Keep the pan full', text: 'If a pan holds 2 prata, never leave a space empty. Count the <b>sides</b> to fry, then divide by the spaces in the pan.' },
    { title: 'Shortest job first', text: 'When people share one tap, one barber or one machine, let the quickest go first. Everyone\'s total time is then the least.' },
  ],
  practice: [
    { id: 'a', level: 1, type: 'blanks', prompt: 'Hafiz helps out in his family\'s HDB flat on Saturday morning. Loading the washing machine takes him <b>5 min</b>, and then the machine washes the clothes <b>by itself</b> for <b>40 min</b>. He also has to sweep the floor (<b>10 min</b>), mop the floor (<b>15 min</b>) and hang up the washed clothes (<b>10 min</b>). What is the <b>shortest</b> time Hafiz needs to finish all the jobs?',
      template: '{0} minutes', blanks: [{ answer: 55 }],
      hint: 'Which job happens by itself? What can Hafiz do while he waits? Which job has to wait for the machine?',
      solution: ['Load the machine first: 0 to 5 min.', 'While the machine washes (5 to 45 min), Hafiz sweeps and mops: 10 + 15 = 25 min. This fits inside the 40 min.', 'Hanging up the clothes must wait until the wash ends: 45 to 55 min.',
        gantt([{ label: 'Hafiz', bars: [{ s: 0, e: 5, t: 'Load', c: C.hand }, { s: 5, e: 15, t: 'Sweep', c: C.hand }, { s: 15, e: 30, t: 'Mop', c: C.hand }, { s: 45, e: 55, t: 'Hang', c: C.hand }] }, { label: 'Machine', bars: [{ s: 5, e: 45, t: 'Washing by itself', c: C.mach }] }], 55, { unit: 8, tick: 5, label: 'Timeline for Hafiz' }),
        'Shortest time = 5 + 40 + 10 = <b>55 minutes</b>. (One job at a time would take 80 minutes.)'] },
    { id: 'b', level: 1, type: 'blanks', prompt: 'At the prata shop, Uncle Raju\'s pan holds <b>2 prata</b> at a time. Each side of a prata needs <b>2 min</b> to fry, and both sides must be fried. What is the shortest time needed to fry <b>4 prata</b>?',
      art: panArt(2, 'A pan holding two prata'),
      template: '{0} minutes', blanks: [{ answer: 8 }],
      hint: 'Fry 2 prata on one side, then flip them over. How many rounds of 2 minutes do you need for 4 prata?',
      solution: ['4 prata × 2 sides = 8 sides to fry.', 'The pan fries 2 sides at a time, so we need 8 ÷ 2 = 4 rounds.', '4 rounds × 2 min = <b>8 minutes</b>.'] },
    { id: 'c', level: 1, type: 'mcq', prompt: 'Three teachers reach the staff-room photocopier at the same time. Mrs Pillai needs <b>6 min</b>, Mr Rahman needs <b>2 min</b> and Ms Goh needs <b>4 min</b>. Each teacher\'s time = waiting time + copying time. Which order makes the <b>total</b> time of all three teachers the least?',
      options: ['Mrs Pillai, Ms Goh, Mr Rahman', 'Mr Rahman, Ms Goh, Mrs Pillai', 'Ms Goh, Mr Rahman, Mrs Pillai', 'Mrs Pillai, Mr Rahman, Ms Goh'], answer: 1,
      hint: 'Whoever goes first makes <b>everyone else</b> wait. Who should that be?',
      solution: ['Shortest job first: Mr Rahman (2 min), Ms Goh (4 min), Mrs Pillai (6 min).', 'They finish at 2 min, 2 + 4 = 6 min and 6 + 6 = 12 min. Total = 2 + 6 + 12 = 20 min.', 'Longest job first gives 6 + 10 + 12 = 28 min, which is more.', 'The answer is <b>Mr Rahman, Ms Goh, Mrs Pillai</b>.'] },
    { id: 'd', level: 2, type: 'blanks', prompt: 'Four customers walk into Uncle Tan\'s barber shop at the same time. Uncle Tan is the only barber. Their haircuts take <b>15 min</b>, <b>10 min</b>, <b>20 min</b> and <b>5 min</b>. Each customer\'s time in the shop = waiting time + haircut time. What is the <b>least</b> possible total time that the four customers spend in the shop altogether?',
      template: '{0} minutes', blanks: [{ answer: 100 }],
      hint: 'Shortest haircut first. Then write down the time when each customer is finished, and add them up.',
      solution: ['Best order: 5, 10, 15, 20 min.', 'Finishing times: 5 min, 5 + 10 = 15 min, 15 + 15 = 30 min, 30 + 20 = 50 min.', 'Total = 5 + 15 + 30 + 50 = <b>100 minutes</b>.', 'Another way to see it: everyone waits for the 1st haircut, so it counts 4 times. 5 × 4 + 10 × 3 + 15 × 2 + 20 × 1 = 100.'] },
    { id: 'e', level: 2, type: 'blanks', prompt: 'Uncle Raju\'s pan holds <b>2 prata</b> at a time, and each side needs <b>2 min</b>. Aisyah says, "<b>3 prata</b> will take 8 minutes, because we need two batches." Can it be done faster? What is the <b>shortest</b> time to fry 3 prata?',
      template: '{0} minutes', blanks: [{ answer: 6 }],
      hint: 'Count the sides: 3 prata have 6 sides. Can you keep the pan full every round? You may take a prata out and put it back later.',
      solution: ['Call the prata A, B and C. They have 3 × 2 = 6 sides to fry.',
        tbl(['Time', 'In the pan'], [['0–2&nbsp;min', 'A1, B1'], ['2–4&nbsp;min', 'A2, C1'], ['4–6&nbsp;min', 'B2, C2']], 'A1 means side 1 of prata A. In the 2nd round, B waits on a plate.', true),
        'The pan is full in every round, so 6 sides ÷ 2 = 3 rounds.', '3 rounds × 2 min = <b>6 minutes</b>. Aisyah\'s plan leaves the pan half-empty in the second batch.'] },
    { id: 'f', level: 2, type: 'blanks', prompt: `Siti is making nasi lemak for breakfast. These are her jobs:${tbl(['Job', 'Time'], [['Wash the rice', '3&nbsp;min'], ['Cook the rice in the rice cooker (it cooks by itself)', '25&nbsp;min'], ['Make the sambal', '8&nbsp;min'], ['Fry the ikan bilis', '6&nbsp;min'], ['Fry the eggs', '3&nbsp;min'], ['Slice the cucumber', '2&nbsp;min'], ['Put everything onto the plates', '2&nbsp;min']])}The rice must be washed before it is cooked. Everything must be ready before it goes onto the plates. What is the <b>shortest</b> time Siti needs?`,
      template: '{0} minutes', blanks: [{ answer: 30 }],
      hint: 'Start the rice cooker as early as you can. Add up the jobs Siti can do while the rice is cooking.',
      solution: ['Wash the rice first (0 to 3 min), then switch on the rice cooker (3 to 28 min).', 'While the rice cooks, Siti makes the sambal, fries the ikan bilis and eggs, and slices the cucumber: 8 + 6 + 3 + 2 = 19 min. That fits inside the 25 min.',
        gantt([{ label: 'Siti', bars: [{ s: 0, e: 3, t: 'Wash', c: C.hand, fs: 11 }, { s: 3, e: 11, t: 'Sambal', c: C.hand }, { s: 11, e: 17, t: 'Ikan bilis', c: C.hand, fs: 12 }, { s: 17, e: 20, t: 'Eggs', c: C.hand }, { s: 20, e: 22, t: 'Cuc.', c: C.hand, fs: 11 }, { s: 28, e: 30, t: 'Plate', c: C.hand, fs: 11 }] }, { label: 'Cooker', bars: [{ s: 3, e: 28, t: 'Cooking by itself', c: C.mach }] }], 30, { unit: 16, tick: 5, label: 'Timeline for Siti' }),
        'At 28 min the rice is ready. Plating takes 28 to 30 min.', 'Shortest time = 3 + 25 + 2 = <b>30 minutes</b>.'] },
    { id: 'g', level: 3, type: 'blanks', prompt: 'After a race on Sports Day, <b>5</b> pupils fill their bottles at <b>2</b> water coolers. Filling the bottles takes <b>1, 2, 3, 4</b> and <b>5 min</b>. Each pupil\'s time = waiting time + filling time. What is the <b>least</b> possible total time of all 5 pupils?',
      template: '{0} minutes', blanks: [{ answer: 22 }],
      hint: 'Shortest job first again, but now there are two coolers. Send the two quickest pupils first, one to each cooler. Who goes next?',
      solution: ['Put the pupils in order: 1, 2, 3, 4, 5 min. Take turns using the two coolers.',
        gantt([{ label: 'Cooler A', bars: [{ s: 0, e: 1, t: '1', c: C.ok }, { s: 1, e: 4, t: '3', c: C.ok }, { s: 4, e: 9, t: '5', c: C.ok }] }, { label: 'Cooler B', bars: [{ s: 0, e: 2, t: '2', c: C.grape }, { s: 2, e: 6, t: '4', c: C.grape }] }], 9, { unit: 34, label: 'Two water coolers', end: false }),
        'Cooler A: pupils finish at 1, 4 and 9 min. Cooler B: pupils finish at 2 and 6 min.', 'Total = 1 + 4 + 9 + 2 + 6 = <b>22 minutes</b>.'] },
    { id: 'h', level: 3, type: 'blanks', prompt: 'A bigger pan holds <b>3 prata</b> at a time. Each side still needs <b>2 min</b>, and a prata cannot have both sides fried at the same time. What is the shortest time to fry <b>4 prata</b>?',
      art: panArt(3, 'A bigger pan holding three prata'),
      template: '{0} minutes', blanks: [{ answer: 6 }],
      hint: '4 prata have 8 sides. The pan fries 3 sides per round. How many rounds do you need at least? Can you really do it in that many?',
      solution: ['4 prata × 2 sides = 8 sides. 8 ÷ 3 = 2 remainder 2, so we need at least <b>3</b> rounds.', 'Call the prata A, B, C and D.',
        tbl(['Time', 'In the pan'], [['0–2&nbsp;min', 'A1, B1, C1'], ['2–4&nbsp;min', 'A2, B2, D1'], ['4–6&nbsp;min', 'C2, D2']], 'A1 means side 1 of prata A.', true),
        'So 3 rounds × 2 min = <b>6 minutes</b>. (Frying 3 first and then 1 more would take 8 min.)'] },
    { id: 'i', level: 3, type: 'blanks', prompt: 'On a night walk at Pulau Ubin, four people reach a narrow wooden bridge. At most <b>2</b> people can be on the bridge at a time, and they have only <b>1 torch</b>. Anyone on the bridge must have the torch, so someone has to bring it back each time. Crossing takes Ravi <b>1 min</b>, Mei Ling <b>2 min</b>, Uncle Kumar <b>6 min</b> and Grandma <b>8 min</b>. Two people crossing together walk at the speed of the slower one. What is the <b>shortest</b> time for all four to cross?',
      art: bridgeArt(),
      template: '{0} minutes', blanks: [{ answer: 15 }],
      hint: 'The two slowest walkers should cross <b>together</b>, so their slow times overlap. Make sure a fast walker is waiting on the far side to bring the torch back.',
      solution: ['Ravi and Mei Ling cross: 2 min.', 'Ravi brings the torch back: 1 min.', 'Uncle Kumar and Grandma cross together: 8 min.', 'Mei Ling brings the torch back: 2 min.', 'Ravi and Mei Ling cross again: 2 min.',
        'Total = 2 + 1 + 8 + 2 + 2 = <b>15 minutes</b>. (If Ravi walks with each person and brings the torch back each time, it takes 2 + 1 + 6 + 1 + 8 = 18 min.)'] },
  ],
  adult: 'Links to school work: time (durations and the 24-hour clock, from P3) and adding whole numbers. Planning the order of jobs is not in the MOE syllabus, so this topic is <b>enrichment</b>. The ideas come from real-life planning: the "chain" is what planners call the critical path, and "shortest job first" is used to plan queues. Common mistakes: adding up all the times without noticing that some jobs can overlap; in pan problems, insisting that each batch finishes both sides before the next prata goes in. Tip: draw a timeline with one row for each person or machine, so overlaps are easy to see.',
};

/* ===================== Topic 10 ===================== */
const t10 = {
  id: 't10',
  title: 'Choosing the Best Meeting Point',
  intro: 'Where should a bus stop go so that everyone walks the least? Not always in the middle of the road! Discover the surprising "middle person" rule.',
  skills: ['Number lines', 'Distance', 'Reasoning'],
  art: () => svg('0 0 360 220', `<rect width="360" height="220" rx="20" fill="#e9f7ff"/>
    ${A.cloud(20, 18, .8)}${A.cloud(250, 12, .65)}
    <path d="M0 130 h360 v70 q0 20 -20 20 h-320 q-20 0 -20 -20z" fill="#9edcaa"/>
    ${A.hdb(26, 52, 58, 88, '#ffe3b3', 5)}${A.hdb(150, 40, 60, 100, '#cdeee0', 6)}${A.hdb(282, 60, 56, 80, '#ffd2cc', 5)}
    <rect x="10" y="150" width="340" height="28" rx="14" fill="#c9cfdc" ${S}/><line x1="24" y1="164" x2="336" y2="164" stroke="#fff" stroke-width="3" stroke-dasharray="14 10"/>
    ${busStop(206, 150, 1)}
    <circle cx="55" cy="164" r="6" fill="${INK}"/><circle cx="180" cy="164" r="6" fill="${INK}"/><circle cx="310" cy="164" r="6" fill="${INK}"/>
    <text x="236" y="98" ${HF} font-size="30" fill="#ff6b5b">?</text>
    <text x="180" y="206" text-anchor="middle" ${HF} font-size="18" fill="${INK}">Where is the best spot?</text>`, 'Three HDB blocks along a road and a bus stop with a question mark'),
  explore: {
    setup: 'Arjun, Chloe and Wei Ming live along the same straight road, Jalan Bunga. They want to meet at one spot and then walk to the community library together. Where should they meet so that their <b>total</b> walking distance is the least?',
    art: () => svg('0 0 340 300', `<rect width="340" height="300" rx="20" fill="#fff6e4"/>
      <path d="M0 214 q170 -24 340 0 v66 q0 20 -20 20 h-300 q-20 0 -20 -20z" fill="#9edcaa"/>
      <rect x="10" y="226" width="320" height="24" rx="12" fill="#e9d8b8" ${S}/>
      ${kid('arjun', { x: 46, y: 104, s: .72, pose: 'wave' })}${kid('chloe', { x: 126, y: 104, s: .72, pose: 'think', mood: 'think' })}${kid('weiming', { x: 292, y: 104, s: .72, pose: 'wave', flip: true })}
      <rect x="150" y="36" width="128" height="40" rx="10" fill="#fff" ${S}/><text x="214" y="62" text-anchor="middle" ${HF} font-size="18" fill="#d6453a">Meet here?</text>
      <line x1="214" y1="76" x2="214" y2="226" stroke="${INK}" stroke-width="3" stroke-dasharray="6 6"/>
      <g ${NF} font-size="13" fill="${INK}" text-anchor="middle"><text x="46" y="270">0 m</text><text x="126" y="270">200 m</text><text x="292" y="270">700 m</text><text x="214" y="270">?</text></g>`, 'Arjun, Chloe and Wei Ming standing along a road wondering where to meet'),
    steps: [
      { who: 'weiming', text: 'Let\'s draw a number line. Arjun is at the 0 m mark, Chloe is at 200 m and I am at 700 m.',
        art: () => road([{ p: 0, name: 'Arjun' }, { p: 200, name: 'Chloe' }, { p: 700, name: 'Wei Ming' }], 800, { W: 430, label: 'Arjun at 0 m, Chloe at 200 m, Wei Ming at 700 m' }) },
      { who: 'chloe', mood: 'think', text: 'How about halfway between the two ends, at the 350 m mark? Arjun walks 350 m, I walk 150 m and Wei Ming walks 350 m. Total: <b>850 m</b>.' },
      { who: 'arjun', text: 'Let\'s try other spots and compare. Meeting at Chloe\'s home is the best so far!',
        art: () => tbl(['Meet at', 'Arjun + Chloe + Wei Ming', 'Total'], [
          ['0&nbsp;m', '0 + 200 + 700', '900&nbsp;m'], ['100&nbsp;m', '100 + 100 + 600', '800&nbsp;m'],
          [{ v: '200&nbsp;m', cls: 'hl' }, { v: '200 + 0 + 500', cls: 'hl' }, { v: '<b>700&nbsp;m</b>', cls: 'hl' }],
          ['350&nbsp;m', '350 + 150 + 350', '850&nbsp;m'], ['700&nbsp;m', '700 + 500 + 0', '1200&nbsp;m']]) },
      { who: 'leo', text: 'Here\'s why. Arjun and Wei Ming are 700 m apart. Anywhere <b>between</b> them, those two walk 700 m altogether. The only walk we can change is Chloe\'s, and it is 0 when we meet <b>at the middle person</b>.' },
      { who: 'aisyah', text: 'Now I join them! I live at the 900 m mark. With 4 people there are <b>two</b> middle people: Chloe and Wei Ming.',
        art: () => road([{ p: 0, name: 'Arjun' }, { p: 200, name: 'Chloe' }, { p: 700, name: 'Wei Ming' }, { p: 900, name: 'Aisyah' }], 900, { W: 430, range: [200, 700], label: 'Four friends; the best meeting spots are between Chloe and Wei Ming' }) },
      { who: 'leo', text: 'Pair up from the outside. Arjun and Aisyah always walk 900 m together; Chloe and Wei Ming always walk 500 m together. So <b>any</b> spot in the green part gives the least total: 900 + 500 = <b>1400 m</b>.' },
      { who: 'arjun', mood: 'think', text: 'And if 3 people live in the same block, I count it as 3 points. Find the <b>middle person</b>, not the middle of the road!' },
    ],
  },
  keys: [
    { title: 'Odd number of points', text: 'Meet <b>at the middle point</b>. With 5 homes in a row, meet at the 3rd one.' },
    { title: 'Even number of points', text: 'Any spot <b>between the two middle points</b> (including them) gives the same least total.' },
    { title: 'Pair up from the outside', text: 'The two end people always walk the distance between them, as long as the meeting point is between them. Then pair the next two, and so on.' },
    { title: 'Count people, not places', text: 'A block with 20 people counts as 20 points. Find the middle <b>person</b>, so the meeting point moves towards the bigger crowd.' },
  ],
  practice: [
    { id: 'a', level: 1, type: 'mcq', prompt: 'Three HDB blocks stand along a straight road. The numbers show how far each block is from the start of the road. Where should a new bus stop go so that the <b>total</b> distance from the three blocks to the bus stop is the least?',
      art: road([{ p: 0, name: 'Blk 12' }, { p: 300, name: 'Blk 15' }, { p: 800, name: 'Blk 20' }], 800, { label: 'Blk 12 at 0 m, Blk 15 at 300 m, Blk 20 at 800 m', maxw: 520 }),
      options: ['At Blk 12', 'At Blk 15', 'At the 400 m mark (halfway between Blk 12 and Blk 20)', 'At Blk 20'], answer: 1,
      hint: 'There are 3 blocks. Which one is in the middle?',
      solution: ['With 3 points, the best place is the middle point.', 'Check: at Blk 15 the total is 300 + 0 + 500 = 800 m. At the 400 m mark it is 400 + 100 + 400 = 900 m.', 'The bus stop should be at <b>Blk 15</b>.'] },
    { id: 'b', level: 1, type: 'blanks', prompt: 'Using the same three blocks (0 m, 300 m and 800 m), the bus stop is built at the best place. What is the least total distance from the three blocks to the bus stop?',
      template: '{0} m', blanks: [{ answer: 800 }],
      hint: 'Put the bus stop at Blk 15 and add the three distances.',
      solution: ['Blk 12 to Blk 15: 300 m.', 'Blk 15 to the bus stop: 0 m.', 'Blk 20 to Blk 15: 800 − 300 = 500 m.', 'Total = 300 + 0 + 500 = <b>800 m</b>. It is the same as the distance between the two end blocks!'] },
    { id: 'c', level: 1, type: 'mcq', prompt: 'Five friends live along a straight park connector. They want to meet at one place so that their <b>total</b> walking distance is the least. Where should they meet?',
      art: road([{ p: 0, name: 'Hafiz' }, { p: 100, name: 'Priya' }, { p: 250, name: 'Kumar' }, { p: 600, name: 'Mei Ling' }, { p: 900, name: 'Daniel' }], 900, { icon: 'dot', label: 'Hafiz 0 m, Priya 100 m, Kumar 250 m, Mei Ling 600 m, Daniel 900 m', maxw: 560 }),
      options: ['At Priya\'s home', 'At Kumar\'s home', 'At the 370 m mark (the average of their positions)', 'At the 450 m mark (halfway between Hafiz and Daniel)'], answer: 1,
      hint: '5 is an odd number. Line the friends up in order. Who is in the middle?',
      solution: ['In order: Hafiz, Priya, <b>Kumar</b>, Mei Ling, Daniel. Kumar is 3rd of 5, the middle person.', 'If they meet anywhere else, say a little to the right of Kumar, then 3 friends (Hafiz, Priya, Kumar) walk more and only 2 friends walk less. The total goes up.', 'The best place is <b>Kumar\'s home</b>. (Neither the average nor the halfway point is best!)'] },
    { id: 'd', level: 2, type: 'blanks', prompt: 'The five friends from the last question (at 0 m, 100 m, 250 m, 600 m and 900 m) meet at Kumar\'s home. What is their total walking distance?',
      template: '{0} m', blanks: [{ answer: 1400 }],
      hint: 'Pair up from the outside: Hafiz with Daniel, Priya with Mei Ling.',
      solution: ['Hafiz and Daniel walk 900 − 0 = 900 m altogether.', 'Priya and Mei Ling walk 600 − 100 = 500 m altogether.', 'Kumar walks 0 m.', 'Total = 900 + 500 + 0 = <b>1400 m</b>.'] },
    { id: 'e', level: 2, type: 'mcq', prompt: 'Four blocks are along a straight road. A new playground will be built on the road so that the total distance from the four blocks is the least. Which of these places are <b>best</b>?',
      art: road([{ p: 0, name: 'Blk 401' }, { p: 200, name: 'Blk 405' }, { p: 500, name: 'Blk 409' }, { p: 1000, name: 'Blk 413' }], 1000, { label: 'Blk 401 at 0 m, Blk 405 at 200 m, Blk 409 at 500 m, Blk 413 at 1000 m', maxw: 560 }),
      options: ['At Blk 405 (200 m)', 'At the 350 m mark', 'At Blk 409 (500 m)', 'At the 100 m mark', 'At the 750 m mark'], answer: [0, 1, 2],
      hint: 'With 4 blocks there are two middle blocks. What happens to the total anywhere between them?',
      solution: ['The two middle blocks are Blk 405 (200 m) and Blk 409 (500 m).', 'Anywhere from 200 m to 500 m: the end blocks walk 1000 m together and the middle blocks walk 300 m together. Total = 1300 m.', 'At the 100 m mark: 100 + 100 + 400 + 900 = 1500 m. At the 750 m mark: 750 + 550 + 250 + 250 = 1800 m. Both are more.', 'Best: <b>Blk 405, the 350 m mark and Blk 409</b>.'] },
    { id: 'f', level: 2, type: 'mcq', prompt: 'Pupils from four blocks along a straight road take the same school bus. The purple labels show how many pupils live in each block. Where should the bus pick them up so that the total walking distance of <b>all the pupils</b> is the least?',
      art: road([{ p: 0, name: 'Blk A', n: '15' }, { p: 300, name: 'Blk B', n: '10' }, { p: 600, name: 'Blk C', n: '12' }, { p: 1000, name: 'Blk D', n: '20' }], 1000, { label: 'Blk A 15 pupils at 0 m, Blk B 10 at 300 m, Blk C 12 at 600 m, Blk D 20 at 1000 m', maxw: 560 }),
      options: ['Blk A', 'Blk B', 'Blk C', 'Blk D'], answer: 2,
      hint: 'There are 57 pupils. Line them all up along the road. Where does the middle pupil (the 29th) live?',
      solution: ['Total pupils = 15 + 10 + 12 + 20 = 57. The middle pupil is the 29th (28 on each side).', 'Counting from the left: Blk A has pupils 1–15, Blk B has 16–25, Blk C has 26–37, Blk D has 38–57.', 'The 29th pupil lives in Blk C, so the bus should stop at <b>Blk C</b>.', 'Blk D has the most pupils, but it is not the best choice. Count people, not blocks!'] },
    { id: 'g', level: 3, type: 'blanks', prompt: 'In the last question, the bus stops at Blk C. Every pupil walks along the road to the bus. What is the total walking distance of all 57 pupils? Give your answer in <b>kilometres</b>.',
      art: road([{ p: 0, name: 'Blk A', n: '15' }, { p: 300, name: 'Blk B', n: '10' }, { p: 600, name: 'Blk C', n: '12' }, { p: 1000, name: 'Blk D', n: '20' }], 1000, { stop: 600, label: 'The bus stops at Blk C', maxw: 560 }),
      template: '{0} km', blanks: [{ answer: 20 }],
      hint: 'Each pupil in Blk A walks 600 m. Multiply by the number of pupils in each block, add, then change metres to kilometres.',
      solution: ['Blk A: 15 pupils × 600 m = 9000 m', 'Blk B: 10 pupils × 300 m = 3000 m', 'Blk C: 12 pupils × 0 m = 0 m', 'Blk D: 20 pupils × 400 m = 8000 m', 'Total = 9000 + 3000 + 8000 = 20 000 m = <b>20 km</b>.'] },
    { id: 'h', level: 3, type: 'blanks', prompt: 'For a clean-up day at East Coast Park, 12 volunteers stand at Posts 1 to 12 along a straight path. Neighbouring posts are <b>100 m</b> apart. Afterwards, they all walk along the path to one meeting point. What is the <b>least</b> total distance they walk altogether?',
      art: road(Array.from({ length: 12 }, (_, i) => ({ p: i * 100, name: String(i + 1), sub: '' })), 1100, { icon: 'dot', showM: false, gapLabel: [0, 100, '100 m'], label: 'Posts 1 to 12, each 100 m apart', maxw: 600 }),
      template: '{0} m', blanks: [{ answer: 3600 }],
      hint: '12 is even, so meet between the two middle posts. Pair up Post 1 with Post 12, Post 2 with Post 11, and so on.',
      solution: ['The two middle posts are Post 6 and Post 7. Meet anywhere from Post 6 to Post 7.', 'Pairs: Posts 1 and 12 are 1100 m apart; 2 and 11: 900 m; 3 and 10: 700 m; 4 and 9: 500 m; 5 and 8: 300 m; 6 and 7: 100 m.', 'Total = 1100 + 900 + 700 + 500 + 300 + 100 = <b>3600 m</b>.'] },
  ],
  adult: 'Links to school work: P4 whole numbers, and adding, subtracting and converting lengths (m and km). The best meeting point on a line is the <b>median</b>, which is met formally in secondary school statistics, so this topic is <b>enrichment</b>. Common mistakes: choosing the halfway point between the two ends or the average position; in "weighted" problems, choosing the block with the most people instead of the middle person. Tip: list everyone in order along the road and count in to the middle from both ends.',
};

/* ===================== Topic 11 ===================== */
// Explore puzzle: exactly one person lies. Statements are functions of who ate the kueh.
const SUS = ['Hafiz', 'Mei Ling', 'Ravi', 'Siti'];
const SAY = [
  ['Hafiz', '"Siti ate it."', c => c === 'Siti'],
  ['Mei Ling', '"I didn\'t eat it."', c => c !== 'Mei Ling'],
  ['Ravi', '"Hafiz is telling the truth."', c => c === 'Siti'],   // true exactly when Hafiz\'s sentence is true
  ['Siti', '"I didn\'t eat it."', c => c !== 'Siti'],
];
function suppose() {
  const rows = SUS.map(c => {
    const liars = SAY.filter(([, , f]) => !f(c)).map(([w]) => w);
    const one = liars.length === 1;
    const cell = v => one ? { v, cls: 'hl' } : v;
    return [`If ${c.replace(' ', '&nbsp;')} ate it`, cell(liars.join(', ')), cell(one ? '<b>1</b> ✓' : `${liars.length} ✗`)];
  });
  return tbl(['Suppose…', 'Who would be lying?', 'Lies'], rows, 'Only one case gives exactly 1 liar.', true);
}
const queueArt = () => svg('0 0 470 120', `<rect x="6" y="14" width="86" height="96" rx="10" fill="#ffe1b0" ${S}/><rect x="6" y="14" width="86" height="26" rx="10" fill="#ff6b5b" ${S}/>
  <text x="49" y="33" text-anchor="middle" ${HF} font-size="14" fill="#fff">DRINKS</text>${A.cup(30, 56, .7, { w: 20, h: 28, color: '#ffc94a' })}${A.cup(56, 56, .7, { w: 20, h: 28, color: '#ff8fb1' })}
  ${['1st', '2nd', '3rd', '4th', '5th'].map((t, i) => `<rect x="${108 + i * 72}" y="44" width="62" height="50" rx="10" fill="${i === 2 ? '#fff3b0' : '#fff'}" ${S} ${i === 2 ? '' : 'stroke-dasharray="7 6"'}/><text x="${139 + i * 72}" y="112" text-anchor="middle" ${NF} font-size="15" fill="${INK}">${t}</text><text x="${139 + i * 72}" y="76" text-anchor="middle" ${HF} font-size="22" fill="#7b61ff">?</text>`).join('')}`, 'A queue of five places at the drinks stall', 'style="max-width:480px"');
const g11a = ['Ahmad', 'Xin Yi', 'Priya'], f11a = ['chicken rice', 'laksa', 'satay'];
const g11d = ['Farah', 'Jun Jie', 'Kumar', 'Daniel'], f11d = ['kueh lapis', 'pineapple tarts', 'curry puffs', 'murukku'];
const answerTbl = sol => tbl(null, Object.entries(sol).map(([k, v]) => [k, v]), '', true);

const t11 = {
  id: 't11',
  title: 'Detective Logic Games',
  intro: 'Someone ate the last kueh, and somebody is not telling the truth! Put on your detective hat and use clues, tables and clever "suppose" thinking to crack each case.',
  skills: ['Logic', 'Truth and lies', 'Logic grids'],
  art: () => svg('0 0 360 220', `<rect width="360" height="220" rx="20" fill="#f1edff"/>
    <g transform="translate(150 30)"><rect width="180" height="150" rx="12" fill="#fff" ${S}/>
      ${[1, 2, 3].map(i => `<line x1="${i * 45}" y1="0" x2="${i * 45}" y2="150" stroke="${INK}" stroke-width="2.4"/>`).join('')}
      ${[1, 2].map(i => `<line x1="0" y1="${i * 50}" x2="180" y2="${i * 50}" stroke="${INK}" stroke-width="2.4"/>`).join('')}
      <g ${HF} font-size="26" text-anchor="middle">
        <text x="22" y="34" fill="#d6453a">✗</text><text x="67" y="34" fill="#0f9d94">✓</text><text x="112" y="34" fill="#d6453a">✗</text><text x="157" y="34" fill="#d6453a">✗</text>
        <text x="22" y="84" fill="#d6453a">✗</text><text x="67" y="84" fill="#d6453a">✗</text><text x="157" y="84" fill="#0f9d94">✓</text>
        <text x="112" y="134" fill="#0f9d94">✓</text><text x="157" y="134" fill="#d6453a">✗</text></g></g>
    ${magnifier(92, 92, 1.05)}
    <text x="78" y="108" ${HF} font-size="44" fill="#7b61ff">?</text>
    ${detHat(70, 200, .9)}
    <text x="250" y="206" text-anchor="middle" ${HF} font-size="18" fill="${INK}">Who did it?</text>`, 'A magnifying glass and a logic grid with ticks and crosses'),
  explore: {
    setup: 'After the class party, the last piece of kueh lapis has disappeared! One of four classmates ate it. Each of them says one sentence. Mr Rahman knows that <b>exactly one</b> of the four is lying. Chloe and Arjun put on their detective hats.',
    art: () => svg('0 0 340 300', `<rect width="340" height="300" rx="20" fill="#fff0f5"/>
      <rect x="0" y="0" width="340" height="70" rx="20" fill="#ffd8e6"/>
      ${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${20 + i * 54} 30 l12 18 l12 -18" fill="none" stroke="${['#ff6b5b', '#ffc94a', '#3dbb6b', '#4aa8ff', '#7b61ff', '#0f9d94'][i]}" stroke-width="5" stroke-linecap="round"/>`).join('')}
      ${kid('chloe', { x: 70, y: 110, s: .82, pose: 'stand' })}${detHat(70, 82, .72)}
      ${kid('arjun', { x: 274, y: 110, s: .82, pose: 'think', mood: 'think' })}
      ${A.table(110, 214, 130)}
      ${A.kuehBox(128, 172, {}, { w: 92, h: 42 })}
      <g fill="#ff8fb1"><circle cx="146" cy="207" r="2.5"/><circle cx="172" cy="210" r="2"/><circle cx="196" cy="206" r="2.5"/><circle cx="160" cy="200" r="2"/></g>
      ${magnifier(110, 150, .5, -20)}
      <text x="175" y="160" text-anchor="middle" ${HF} font-size="30" fill="#7b61ff">?</text>`, 'Chloe in a detective hat and Arjun looking at an empty kueh box'),
    steps: [
      { who: 'chloe', text: 'Here is what the four classmates said:',
        art: () => says(SAY.map(([w, s]) => [w, s.slice(1, -1)])) },
      { who: 'arjun', mood: 'think', text: 'Look at Hafiz and Siti. Hafiz says Siti ate it; Siti says she didn\'t. They say <b>opposite</b> things, so exactly one of them is true and the other is a lie!' },
      { who: 'chloe', text: 'There is only <b>one</b> liar, and it must be Hafiz or Siti. So Mei Ling and Ravi are both telling the truth.' },
      { who: 'weiming', text: 'Ravi tells the truth, and he says Hafiz is telling the truth. So Hafiz is honest… which means <b>Siti</b> ate the kueh lapis, and Siti is the liar!' },
      { who: 'leo', text: 'Good detectives always <b>check</b>. Suppose each person ate it in turn, and count the liars. Only one case gives exactly one liar:', art: suppose },
      { who: 'aisyah', text: 'For "who is who" puzzles, I use a <b>logic grid</b>. I put ✗ for "no" and ✓ for "yes". Each row and each column ends up with exactly one ✓.' },
    ],
  },
  keys: [
    { title: 'Look for a clash', text: 'Two sentences that say opposite things cannot both be true or both be false: <b>exactly one</b> of them is true.' },
    { title: 'Suppose and check', text: 'Try each possibility in turn. Throw out any that break a rule, for example by giving too many liars.' },
    { title: 'Logic grids', text: 'Draw a grid for who-is-who puzzles. When you put in a ✓, put ✗ in the rest of its row and column.' },
    { title: 'Check every clue', text: 'When you think you have cracked the case, test your answer against <b>all</b> the clues.' },
  ],
  practice: [
    { id: 'a', level: 1, type: 'mcq', prompt: `Ahmad, Xin Yi and Priya each have a different favourite hawker food: chicken rice, laksa or satay.<br><b>Clue 1:</b> Ahmad\'s favourite is not satay.<br><b>Clue 2:</b> Priya\'s favourite is laksa.<br>What is Xin Yi\'s favourite food?${lgrid(g11a, f11a)}`,
      options: ['Chicken rice', 'Laksa', 'Satay'], answer: 2,
      hint: 'Put a ✓ for Priya and laksa first, and ✗ for everything else in that row and column. Then use Clue 1.',
      solution: ['Clue 2: Priya likes laksa, so nobody else likes laksa, and Priya does not like the others.', 'Ahmad does not like laksa (Priya does) or satay (Clue 1), so Ahmad likes chicken rice.', answerTbl({ Ahmad: 'chicken rice', 'Xin Yi': 'satay', Priya: 'laksa' }), 'The only food left for Xin Yi is <b>satay</b>.'] },
    { id: 'b', level: 1, type: 'mcq', prompt: `A ball knocked over Mdm Lim\'s flower pot at the void deck. One of Kumar, Nurul and Daniel kicked it.${says([['Kumar', 'Nurul kicked it.'], ['Nurul', 'Kumar is lying.'], ['Daniel', 'I didn\'t kick it.']])}Only <b>one</b> of them is telling the truth. Who kicked the ball?`,
      options: ['Kumar', 'Nurul', 'Daniel'], answer: 2,
      hint: 'Kumar and Nurul say opposite things, so exactly one of them tells the truth. What does that tell you about Daniel?',
      solution: ['Kumar and Nurul clash, so one of them tells the truth and the other lies.', 'Only one person tells the truth, so Daniel must be lying.', 'Daniel\'s "I didn\'t kick it" is false, so <b>Daniel</b> kicked the ball.', 'Check: Kumar\'s sentence is false, Nurul\'s is true, Daniel\'s is false. Exactly one is true ✓'] },
    { id: 'c', level: 1, type: 'mcq', prompt: 'Five pupils queue at the canteen drinks stall: Siti, Jun Jie, Daniel, Ravi and Nurul.<br>• Nobody is in front of Siti.<br>• Daniel is right behind Jun Jie.<br>• Nurul is right behind Ravi.<br>• Ravi is not 2nd in the queue.<br>Who is <b>3rd</b> in the queue?',
      art: queueArt(),
      options: ['Jun Jie', 'Daniel', 'Ravi', 'Nurul'], answer: 1,
      hint: 'Siti is 1st. The other four make two pairs that stand together. Which pair can start at 2nd place?',
      solution: ['Siti is 1st, so places 2 to 5 are for the pairs "Jun Jie, Daniel" and "Ravi, Nurul".', 'Ravi is not 2nd, so the Ravi–Nurul pair must be 4th and 5th.', 'Then Jun Jie is 2nd and Daniel is 3rd.', 'The queue is Siti, Jun Jie, <b>Daniel</b>, Ravi, Nurul.'] },
    { id: 'd', level: 2, type: 'mcq', prompt: `For Racial Harmony Day, Farah, Jun Jie, Kumar and Daniel each brought a different snack. Kueh lapis and pineapple tarts are <b>sweet</b>; curry puffs and murukku are <b>savoury</b>.<br><b>Clue 1:</b> Farah brought something sweet.<br><b>Clue 2:</b> Daniel brought something savoury, but not curry puffs.<br><b>Clue 3:</b> Jun Jie did not bring pineapple tarts or curry puffs.<br>Who brought the <b>curry puffs</b>?${lgrid(g11d, f11d)}`,
      options: ['Farah', 'Jun Jie', 'Kumar', 'Daniel'], answer: 2,
      hint: 'Start with Daniel: which savoury snack is left for him? Then look at Jun Jie.',
      solution: ['Clue 2: Daniel\'s snack is savoury but not curry puffs, so Daniel brought <b>murukku</b>.', 'Clue 3: Jun Jie did not bring pineapple tarts or curry puffs, and murukku is taken, so Jun Jie brought <b>kueh lapis</b>.', 'Clue 1: Farah brought something sweet. Kueh lapis is taken, so Farah brought <b>pineapple tarts</b>.',
        answerTbl({ Farah: 'pineapple tarts', 'Jun Jie': 'kueh lapis', Kumar: 'curry puffs', Daniel: 'murukku' }), '<b>Kumar</b> brought the curry puffs.'] },
    { id: 'e', level: 2, type: 'blanks', prompt: `The robotics CCA cupboard has a padlock with a 3-digit code. The three digits are all <b>different</b>. Here are some guesses and what they tell you:${tbl(['Guess', 'What we know'], [['9 5 6', 'One digit is correct and in the right place.'], ['6 8 7', 'One digit is correct but in the wrong place.'], ['7 4 3', 'Two digits are correct, but both are in the wrong place.'], ['3 2 8', 'Nothing is correct.']])}What is the code?`,
      template: 'The code is {0}', blanks: [{ answer: '974', kind: 'text' }],
      hint: 'Start with the guess where <b>nothing</b> is correct. Cross those digits out of the other guesses.',
      solution: ['3 2 8: nothing is correct, so 3, 2 and 8 are not in the code.', '7 4 3: two digits are correct. 3 is out, so <b>7 and 4</b> are in the code. Both are in the wrong place: 7 is not 1st and 4 is not 2nd.',
        '6 8 7: 8 is out and 7 is in, so 7 is the one correct digit and 6 is not in the code. 7 is in the wrong place, so 7 is not 3rd. So <b>7 is 2nd</b>.',
        '9 5 6: one digit is correct and in the right place. 6 is out, and 5 would have to be 2nd, but 7 is 2nd. So <b>9 is 1st</b> (and 5 is not in the code).', '4 is not 2nd, so 4 is 3rd. The code is <b>974</b>.'] },
    { id: 'f', level: 2, type: 'blanks', prompt: `At a Maths Club session in the school library, five friends play a truth game. Each one says one sentence.${says([['Ali', 'Exactly 1 of us is lying.'], ['Bee Lian', 'Exactly 2 of us are lying.'], ['Charmaine', 'Exactly 3 of us are lying.'], ['Dinesh', 'Exactly 4 of us are lying.'], ['Elena', 'All 5 of us are lying.']])}How many of them are lying?`,
      template: '{0} of them are lying.', blanks: [{ answer: 4, size: 'sm' }],
      hint: 'Can two of these sentences be true at the same time? Could all five sentences be false?',
      solution: ['The sentences give different numbers, so <b>at most one</b> of them can be true.', 'Could all five be false? Then all 5 are lying, which makes Elena\'s sentence true. That is a clash, so no.', 'So exactly one sentence is true and the other four are lies: 4 people are lying.', 'That is what Dinesh said, so Dinesh is the one telling the truth. <b>4</b> of them are lying.'] },
    { id: 'g', level: 3, type: 'mcq', prompt: `At Sports Day, the four houses (Red, Blue, Green and Yellow) ran a relay and came 1st, 2nd, 3rd and 4th, with no ties. Before the results, three pupils made guesses. Each pupil got <b>exactly one half</b> of their guess right.${says([['Jun Jie', 'Yellow came 3rd, and Red came 2nd.'], ['Farah', 'Yellow came 2nd, and Green came 3rd.'], ['Kumar', 'Yellow came 4th, and Green came 1st.']])}Which house came <b>1st</b>?`,
      options: ['Red', 'Blue', 'Green', 'Yellow'], answer: 1,
      hint: 'Suppose the first half of Jun Jie\'s guess ("Yellow came 3rd") is true. What must then be true for Farah? Is there a clash?',
      solution: ['Suppose "Yellow came 3rd" is true. Then Farah\'s "Yellow came 2nd" is false, so her other half "Green came 3rd" must be true. But Yellow is 3rd. Clash! ✗',
        'So "Yellow came 3rd" is false, and Jun Jie\'s other half is true: <b>Red came 2nd</b>.', 'Farah: "Yellow came 2nd" is false (Red is 2nd), so <b>Green came 3rd</b>.', 'Kumar: "Green came 1st" is false, so <b>Yellow came 4th</b>.',
        'The only place left is 1st, for <b>Blue</b>. Order: Blue, Red, Green, Yellow.'] },
    { id: 'h', level: 3, type: 'mcq', prompt: `During a Racial Harmony Day games corner, Xin Yi, Ahmad and Ravi each secretly get a card. A <b>Truth</b> card means you must always tell the truth. A <b>Fib</b> card means you must always lie.${says([['Xin Yi', 'Ahmad has a Fib card.'], ['Ahmad', 'Ravi has a Fib card.'], ['Ravi', 'Xin Yi and Ahmad both have Fib cards.']])}Who has a <b>Truth</b> card?`,
      options: ['Only Xin Yi', 'Only Ahmad', 'Only Ravi', 'Xin Yi and Ravi', 'All three'], answer: 1,
      hint: 'Suppose Xin Yi has a Truth card. Follow what happens to Ahmad, then Ravi. Do you reach a clash?',
      solution: ['Suppose Xin Yi has a Truth card. Then Ahmad has Fib, so his sentence is false and Ravi has Truth. But Ravi says Xin Yi has a Fib card, which would be false. Clash! ✗',
        'So Xin Yi has a Fib card. Her sentence is false, so Ahmad has a <b>Truth</b> card.', 'Ahmad tells the truth, so Ravi has a Fib card.', 'Check Ravi: "Xin Yi and Ahmad both have Fib cards" is false (Ahmad has Truth). That suits a Fib card ✓',
        'Only <b>Ahmad</b> has a Truth card.'] },
  ],
  adult: 'Links to school work: there is no matching P4 syllabus topic, so this is <b>enrichment</b>. It builds the careful reasoning used everywhere in maths: listing cases, the "suppose" (supposition) idea and checking answers. Common mistakes: stopping as soon as one answer fits some of the clues, without checking all of them; mixing up "the person who is lying" with "the person who did it". Tip: read each clue aloud as an "if… then…" sentence, and record what you know in a table of ✓ and ✗.',
};

for (const t of [t09, t10, t11]) for (const st of t.explore.steps) if (st.art) { const f = st.art; st.art = () => fit(f()); }
// A diagram in a worked solution joins the step before it (so it is not a numbered step on its own).
for (const t of [t09, t10, t11]) for (const q of t.practice) if (Array.isArray(q.solution))
  q.solution = q.solution.reduce((acc, x) => { if (/^\s*<(svg|table|div)/.test(x) && acc.length) acc[acc.length - 1] += fit(x); else acc.push(x); return acc; }, []);

export default { t09, t10, t11 };
