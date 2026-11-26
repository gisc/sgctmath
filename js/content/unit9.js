// Unit 9 · Addition Principle (t23 Page Number Problems) — original content, Singapore context.
import * as A from '../art.js';
const { svg, kid, leo } = A;
const INK = A.ink, S = A.stroke;
const HEAD = 'font-family="Baloo 2, sans-serif" font-weight="800"';
const BODY = 'font-family="Nunito, sans-serif" font-weight="800"';
const TEAL = '#0f9d94', CORAL = '#ff6b5b', SUN = '#ffc94a', GRAPE = '#7b61ff', LEAF = '#3dbb6b', SKY = '#4aa8ff';
const GROUP_C = [SUN, SKY, GRAPE];          // 1-digit, 2-digit, 3-digit groups
const GROUP_L = ['#fff1c7', '#d9ecff', '#e6e0ff'];

/* ---------- unit helpers (same flat style as art.js) ---------- */

// one digit sticker (rounded square)
function sticker(x, y, d, { c = SUN, s = 26, rot = 0, fg = INK } = {}) {
  return `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="${-s / 2}" y="${-s / 2}" width="${s}" height="${s * 1.15}" rx="${s * .22}" fill="${c}" stroke="${INK}" stroke-width="2.2"/>
    <text x="0" y="${s * .36}" text-anchor="middle" ${HEAD} font-size="${s * .78}" fill="${fg}">${d}</text></g>`;
}
// a number made of stickers, centred on x
function stickNum(x, y, n, o = {}) {
  const s = o.s || 22, ds = String(n).split(''), w = s + 2;
  return ds.map((d, i) => sticker(x - (ds.length - 1) * w / 2 + i * w, y, d, o)).join('');
}
// letterbox with a sticker number
function letterbox(x, y, n, w = 50, h = 40, hi = false) {
  const len = String(n).length;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${hi ? '#fff6d6' : '#dfe6f0'}" ${S} stroke-width="2.5"/>
    <rect x="${x + 8}" y="${y + h - 12}" width="${w - 16}" height="5" rx="2.5" fill="#5d6b88"/>
    ${stickNum(x + w / 2, y + 13, n, { s: 13, c: GROUP_C[len - 1] })}`;
}
// sheet of digit stickers 0–9
function stickerSheet(x, y, s = 1) {
  let g = `<rect x="0" y="0" width="96" height="74" rx="8" fill="#fff" ${S} stroke-width="2.5"/>`;
  for (let i = 0; i < 10; i++) g += sticker(14 + (i % 5) * 17, 16 + Math.floor(i / 5) * 24, i, { s: 14, c: [CORAL, SUN, LEAF, SKY, GRAPE][i % 5], fg: '#fff' });
  g += `<text x="48" y="68" text-anchor="middle" ${BODY} font-size="10" fill="#6b7591">DIGIT STICKERS</text>`;
  return `<g transform="translate(${x} ${y}) scale(${s})">${g}</g>`;
}
// open book with two page numbers at the bottom outer corners
function openBook(cx, y, left, right, { w = 116, h = 128, lc = CORAL, rc = TEAL, fs = 22 } = {}) {
  const lines = side => [0, 1, 2, 3, 4].map(i => {
    const yy = y + 24 + i * 13, x1 = side < 0 ? cx - w + 14 : cx + 14, x2 = side < 0 ? cx - 14 : cx + w - 14 - (i === 4 ? 30 : 0);
    return `<path d="M${x1} ${yy} H${side < 0 && i === 4 ? x2 - 30 : x2}" stroke="#cfd7e4" stroke-width="4" stroke-linecap="round"/>`;
  }).join('');
  return `<path d="M${cx - w - 8} ${y + 6} Q${cx - w / 2} ${y - 4} ${cx} ${y + 10} Q${cx + w / 2} ${y - 4} ${cx + w + 8} ${y + 6} V${y + h + 12} Q${cx + w / 2} ${y + h + 2} ${cx} ${y + h + 16} Q${cx - w / 2} ${y + h + 2} ${cx - w - 8} ${y + h + 12}z" fill="${TEAL}" ${S}/>
    <path d="M${cx} ${y + 8} Q${cx - w / 2} ${y - 10} ${cx - w} ${y} V${y + h} Q${cx - w / 2} ${y + h - 8} ${cx} ${y + h + 8}z" fill="#fff" ${S}/>
    <path d="M${cx} ${y + 8} Q${cx + w / 2} ${y - 10} ${cx + w} ${y} V${y + h} Q${cx + w / 2} ${y + h - 8} ${cx} ${y + h + 8}z" fill="#fff" ${S}/>
    ${lines(-1)}${lines(1)}
    <text x="${cx - w + 14}" y="${y + h - 10}" ${HEAD} font-size="${fs}" fill="${lc}">${left}</text>
    <text x="${cx + w - 14}" y="${y + h - 10}" text-anchor="end" ${HEAD} font-size="${fs}" fill="${rc}">${right}</text>`;
}
// strip that splits a run of numbers into non-overlapping groups. groups: [{from, to, w, label}]
function groupStrip(groups, { label = 'Numbers split into groups', max = 420, note = true } = {}) {
  let x = 10, g = '';
  const y = 30, h = 40;
  groups.forEach((gr, i) => {
    const c = GROUP_C[gr.k ?? i], l = GROUP_L[gr.k ?? i];
    g += `<rect x="${x}" y="${y}" width="${gr.w}" height="${h}" rx="8" fill="${l}" stroke="${c}" stroke-width="3"/>
      <text x="${x + gr.w / 2}" y="${y + 27}" text-anchor="middle" ${HEAD} font-size="18" fill="${INK}">${gr.from}–${gr.to}</text>
      <text x="${x + gr.w / 2}" y="${y - 9}" text-anchor="middle" ${BODY} font-size="14" fill="${INK}">${gr.top || ''}</text>`;
    if (note) g += `<text x="${x + gr.w / 2}" y="${y + h + 22}" text-anchor="middle" ${BODY} font-size="14" fill="#55607a">${gr.label}</text>`;
    x += gr.w + 8;
  });
  return svg(`0 0 ${x + 2} ${y + h + (note ? 32 : 10)}`, g, label, `style="max-width:${max}px"`);
}
// a case table: rows [[group, count, each, digits]] + total row
const nw = t => `<span style="white-space:nowrap">${t}</span>`;
function digitTable(rows, total) {
  return `<table class="tbl" style="font-size:15px"><thead><tr><th style="padding:5px 8px">Group</th><th style="padding:5px 8px">How many</th><th style="padding:5px 8px">Digits each</th><th style="padding:5px 8px">Digits</th></tr></thead><tbody>
    ${rows.map(([gp, n, e, d]) => `<tr><td style="padding:5px 8px">${nw(gp)}</td><td style="padding:5px 8px">${n}</td><td style="padding:5px 8px">${e}</td><td style="padding:5px 8px">${d}</td></tr>`).join('')}
    <tr><th colspan="3" style="padding:5px 8px">Total</th><td class="hl" style="padding:5px 8px"><b>${total}</b></td></tr></tbody></table>`;
}
// queue ticket
function ticket(x, y, n, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M0 0 h110 v150 l-9 -7 l-9 7 l-9 -7 l-9 7 l-9 -7 l-9 7 l-9 -7 l-9 7 l-9 -7 l-9 7 l-9 -7 l-11 7z" fill="#fff" ${S}/>
    <rect x="10" y="12" width="90" height="22" rx="6" fill="${TEAL}"/>
    <text x="55" y="28" text-anchor="middle" ${BODY} font-size="12" fill="#fff">POLYCLINIC</text>
    <text x="55" y="54" text-anchor="middle" ${BODY} font-size="11" fill="#55607a">Your queue no.</text>
    <text x="55" y="96" text-anchor="middle" ${HEAD} font-size="40" fill="${INK}">${n}</text>
    <path d="M18 112 h74 M18 124 h50" stroke="#cfd7e4" stroke-width="4" stroke-linecap="round"/></g>`;
}
// hall seat with a sticker number
function seat(x, y, n, hi = false) {
  return `<rect x="${x}" y="${y}" width="34" height="30" rx="6" fill="${hi ? '#ffd8d3' : '#ffb3a8'}" ${S} stroke-width="2.5"/>
    <rect x="${x - 2}" y="${y + 28}" width="38" height="12" rx="4" fill="${CORAL}" ${S} stroke-width="2.5"/>
    <path d="M${x + 4} ${y + 40} v12 M${x + 30} ${y + 40} v12" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
    ${stickNum(x + 17, y + 13, n, { s: 14, c: '#fff' })}`;
}
// a single page (for rows of pages)
function page(x, y, n, { w = 34, h = 44, stain = false, missing = false } = {}) {
  if (missing) return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="none" stroke="${CORAL}" stroke-width="2.5" stroke-dasharray="5 4"/><text x="${x + w / 2}" y="${y + h - 10}" text-anchor="middle" ${HEAD} font-size="16" fill="#d6453a">?</text>`;
  let g = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="#fff" ${S} stroke-width="2.2"/>
    <path d="M${x + 6} ${y + 10} h${w - 12} M${x + 6} ${y + 18} h${w - 12}" stroke="#cfd7e4" stroke-width="3" stroke-linecap="round"/>
    <text x="${x + w / 2}" y="${y + h - 8}" text-anchor="middle" ${HEAD} font-size="14" fill="${INK}">${n}</text>`;
  if (stain) g += `<path d="M${x + 3} ${y + 20} q2 -14 14 -12 q12 -6 15 8 q5 10 0 18 q-2 14 -15 10 q-14 4 -14 -10 q-5 -6 0 -14z" fill="#8b5a2b"/><circle cx="${x + w - 4}" cy="${y + 8}" r="3" fill="#8b5a2b"/>`;
  return g;
}

/* ===================== Topic 23: Page Number Problems ===================== */
const t23art = () => svg('0 0 360 220', `<rect width="360" height="220" rx="20" fill="#eaf6ff"/>
  <text x="180" y="30" text-anchor="middle" ${HEAD} font-size="20" fill="${INK}">How many digits on the pages?</text>
  ${openBook(180, 52, '99', '100', { w: 118, h: 118, fs: 26 })}
  <text x="98" y="204" text-anchor="middle" ${BODY} font-size="15" fill="#d6453a">2 digits</text>
  <text x="262" y="204" text-anchor="middle" ${BODY} font-size="15" fill="#0f7a73">3 digits</text>
  ${sticker(26, 66, 1, { c: SUN, s: 24, rot: -14 })}${sticker(30, 124, 0, { c: SKY, s: 24, rot: 10 })}
  ${sticker(334, 70, 9, { c: CORAL, s: 24, rot: 12, fg: '#fff' })}${sticker(330, 128, 7, { c: LEAF, s: 24, rot: -8, fg: '#fff' })}`,
'An open book at pages 99 and 100: page 99 uses 2 digits and page 100 uses 3 digits, with loose digit stickers around it');

const exploreArt = () => {
  let boxes = '';
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
    const n = 97 + r * 4 + c;
    boxes += letterbox(124 + c * 50, 52 + r * 44, n, 46, 38, n === 99 || n === 100);
  }
  return svg('0 0 340 300', `<rect width="340" height="300" rx="20" fill="#eef3f8"/>
    <path d="M20 0 h300 q20 0 20 20 v14 h-340 v-14 q0 -20 20 -20z" fill="#cdd6e3"/>
    <rect x="112" y="38" width="216" height="150" rx="8" fill="#9aa8bf" ${S}/>
    <rect x="150" y="8" width="140" height="24" rx="6" fill="${TEAL}" ${S} stroke-width="2.5"/><text x="220" y="26" text-anchor="middle" ${HEAD} font-size="14" fill="#fff">LETTERBOXES</text>
    ${boxes}
    <rect x="12" y="34" width="18" height="230" fill="#d9e0ea" ${S} stroke-width="2.5"/>
    <path d="M0 262 h340 v18 q0 20 -20 20 h-300 q-20 0 -20 -20z" fill="#d6dcc8"/>
    ${kid('arjun', { x: 68, y: 150, s: .8, pose: 'think', mood: 'think' })}
    ${stickerSheet(150, 200, .9)}
    ${kid('aisyah', { x: 282, y: 198, s: .58, pose: 'wave', flip: true })}`,
  'Arjun and Aisyah at an HDB void deck in front of a bank of letterboxes numbered 97 to 108, with a sheet of digit stickers');
};

const t23 = {
  id: 't23',
  title: 'Page Number Problems',
  intro: 'How many digits does it take to number every page of a book? Instead of counting one by one, split the pages into groups, count each group, and <b>add</b>. That is the <b>addition principle</b>!',
  skills: ['Splitting into cases', 'Place value', 'Working backwards'],
  art: t23art,
  explore: {
    setup: 'At an HDB block in Punggol, the void deck has <b>128</b> new letterboxes, numbered 1 to 128. Uncle Hassan from the Residents\' Committee will number them with digit stickers, one sticker for each digit. So letterbox 7 needs 1 sticker, and letterbox 25 needs 2 stickers.',
    art: exploreArt,
    steps: [
      { who: 'arjun', mood: 'think', text: 'How many stickers must Uncle Hassan buy? Do we have to write 1, 2, 3, … all the way to 128 and count every digit?' },
      { who: 'leo', mood: 'teach', text: 'No need! Use the <b>addition principle</b>: split the numbers into groups that <b>do not overlap</b> and <b>leave nothing out</b>. Count each group, then add. Here the natural groups are the 1-digit, 2-digit and 3-digit numbers.',
        art: () => groupStrip([{ from: 1, to: 9, w: 60, label: '1 digit each' }, { from: 10, to: 99, w: 140, label: '2 digits each' }, { from: 100, to: 128, w: 100, label: '3 digits each' }], { label: 'Numbers 1 to 128 split into three groups: 1 to 9, 10 to 99 and 100 to 128', max: 330 }) },
      { who: 'aisyah', text: 'How many numbers are in each group? From 10 to 99 there are <b>not</b> 99 − 10 = 89 numbers. Both 10 and 99 count, so there are 99 − 10 + 1 = <b>90</b>. In the same way, 100 to 128 has 128 − 100 + 1 = <b>29</b> numbers.' },
      { who: 'weiming', text: 'Now multiply by the number of digits each one needs, and add the three groups: 9 + 180 + 87 = <b>276</b>.',
        art: () => digitTable([['1–9', 9, 1, 9], ['10–99', 90, 2, 180], ['100–128', 29, 3, 87]], 276) },
      { who: 'chloe', mood: 'think', text: 'So Uncle Hassan needs <b>276</b> stickers. But a sticker sheet has the same number of each digit, and I think the <b>1</b>s will run out first! How many 1s are needed?' },
      { who: 'leo', mood: 'teach', text: 'Split again, this time <b>by place</b>: count the 1s in the ones place, then the tens place, then the hundreds place, and add.',
        art: () => `<table class="tbl" style="font-size:15px"><thead><tr><th style="padding:5px 8px">Place</th><th style="padding:5px 8px">Letterboxes</th><th style="padding:5px 8px">1s</th></tr></thead><tbody>
          <tr><td style="padding:5px 8px">ones</td><td style="padding:5px 8px">1, 11, 21, …, 121</td><td style="padding:5px 8px">13</td></tr>
          <tr><td style="padding:5px 8px">tens</td><td style="padding:5px 8px">10–19, 110–119</td><td style="padding:5px 8px">20</td></tr>
          <tr><td style="padding:5px 8px">hundreds</td><td style="padding:5px 8px">100–128</td><td style="padding:5px 8px">29</td></tr>
          <tr><th colspan="2" style="padding:5px 8px">Total</th><td class="hl" style="padding:5px 8px"><b>62</b></td></tr></tbody></table><small>Letterbox 111 appears in all three rows. That is right: it needs three "1" stickers!</small>` },
      { who: 'arjun', text: 'Now backwards! The block next door used <b>252</b> stickers. Letterboxes 1 to 99 use 9 + 180 = 189 of them. That leaves 252 − 189 = 63 stickers for 3-digit numbers, and 63 ÷ 3 = 21 letterboxes: 100 to 120. So that block has <b>120</b> letterboxes!' },
    ],
  },
  keys: [
    { title: 'The addition principle', text: 'Split the job into groups that <b>do not overlap</b> and <b>leave nothing out</b>. Count each group, then add the counts.' },
    { title: 'How many from a to b?', text: 'Last − first + 1. Pages 10 to 99: 99 − 10 + 1 = <b>90</b> pages, not 89.' },
    { title: 'Handy totals', text: 'Pages 1 to 9 use 9 digits. Pages 10 to 99 use 90 × 2 = 180 digits. So pages 1 to 99 use <b>189</b> digits. Every page from 100 to 999 uses 3 digits.' },
    { title: 'Counting one digit', text: 'Count place by place: ones, tens, hundreds. Then add. A number such as 77 has two 7s, so it is counted once in each place.' },
  ],
  practice: [
    { id: 'a', level: 1, type: 'blanks', prompt: 'Siti\'s class makes a Hari Raya recipe booklet with <b>75</b> pages. The pages are numbered 1, 2, 3, …, 75. How many digits are used to number all the pages?',
      art: groupStrip([{ from: 1, to: 9, w: 70, label: '1 digit each' }, { from: 10, to: 75, w: 160, label: '2 digits each' }], { label: 'Pages 1 to 75 split into 1 to 9 and 10 to 75', max: 300 }),
      template: 'Pages 1 to 9 use {0} digits.<br>Pages 10 to 75: there are {1} pages, using {2} digits.<br>Total = {3} digits', blanks: [{ answer: 9 }, { answer: 66 }, { answer: 132 }, { answer: 141 }],
      hint: 'Pages 10 to 75: count them with last − first + 1. Each of these pages needs 2 digits.',
      solution: ['Pages 1 to 9: 9 pages × 1 digit = 9 digits', 'Pages 10 to 75: 75 − 10 + 1 = 66 pages, and 66 × 2 = 132 digits', 'Total = 9 + 132 = <b>141</b> digits'] },
    { id: 'b', level: 1, type: 'blanks', prompt: 'Hafiz draws an <b>80</b>-page comic book about the Merlion. When he numbers the pages 1 to 80, how many times does he write the digit <b>7</b>?',
      template: '7s in the ones place: {0}<br>7s in the tens place: {1}<br>Total: {2} times', blanks: [{ answer: 8 }, { answer: 10 }, { answer: 18 }],
      hint: 'Ones place: 7, 17, 27, … Tens place: the seventies. Remember that 77 has a 7 in <b>both</b> places.',
      solution: ['7 in the ones place: 7, 17, 27, 37, 47, 57, 67, 77 → 8 times', '7 in the tens place: 70, 71, …, 79 → 10 times', 'Page 77 is counted in both rows, which is correct because it has two 7s.', 'Total: 8 + 10 = <b>18</b> times'] },
    { id: 'c', level: 1, type: 'blanks', prompt: 'For Speech Day, Mr Ravi labels the seats in the school hall 1, 2, 3, … with digit stickers, one sticker for each digit. He uses <b>105</b> stickers altogether. How many seats are there?',
      art: svg('0 0 300 62', `${[1, 2, 3].map((n, i) => seat(8 + i * 40, 6, n)).join('')}<text x="128" y="32" ${HEAD} font-size="20" fill="${INK}">…</text>${[9, 10, 11].map((n, i) => seat(148 + i * 40, 6, n, n === 10)).join('')}<text x="268" y="32" ${HEAD} font-size="20" fill="${INK}">…</text><text x="288" y="32" ${HEAD} font-size="20" fill="${CORAL}">?</text>`, 'School hall seats labelled 1, 2, 3, then 9, 10, 11 and so on, last seat unknown', 'style="max-width:420px"'),
      template: 'There are {0} seats.', blanks: [{ answer: 57 }],
      hint: 'Seats 1 to 9 use 9 stickers. Every seat after that uses 2 stickers. How many stickers are left after the first 9 seats?',
      solution: ['Seats 1 to 9 use 9 stickers.', '105 − 9 = 96 stickers are left for 2-digit seats.', '96 ÷ 2 = 48 two-digit seats: seats 10, 11, …, 57.', 'There are 9 + 48 = <b>57</b> seats. Check: 9 + 48 × 2 = 105 ✓'] },
    { id: 'd', level: 2, type: 'mcq', prompt: 'At a polyclinic, the queue machine prints ticket numbers 1, 2, 3, … every morning. On Monday, the last ticket printed was number <b>215</b>. How many digits were printed on all of Monday\'s tickets altogether?',
      art: svg('0 0 150 180', ticket(20, 14, 215), 'A polyclinic queue ticket showing number 215', 'style="max-width:130px"'),
      options: ['537', '534', '645', '447'], answer: 0,
      hint: 'Split the tickets into 1-digit, 2-digit and 3-digit numbers. How many tickets are there from 100 to 215?',
      solution: ['Tickets 1 to 9: 9 × 1 = 9 digits', 'Tickets 10 to 99: 90 × 2 = 180 digits', 'Tickets 100 to 215: 215 − 100 + 1 = 116 tickets, and 116 × 3 = 348 digits',
        digitTable([['1–9', 9, 1, 9], ['10–99', 90, 2, 180], ['100–215', 116, 3, 348]], 537),
        '534 forgets the "+ 1" (115 tickets). 645 treats every ticket as 3 digits. 447 counts only 1 digit for each 2-digit ticket.'] },
    { id: 'e', level: 2, type: 'blanks', prompt: 'The page numbers of a Gardens by the Bay nature activity book use <b>402</b> digits altogether. The pages are numbered from 1. How many pages does the book have?',
      template: 'Number of 3-digit pages: {0}<br>The book has {1} pages.', blanks: [{ answer: 71 }, { answer: 170 }],
      hint: 'Work backwards. Pages 1 to 99 use 189 digits. How many digits are left for the 3-digit pages?',
      solution: ['Pages 1 to 99 use 9 + 180 = 189 digits.', 'Digits left: 402 − 189 = 213. Each 3-digit page uses 3 digits.', '213 ÷ 3 = 71 three-digit pages: pages 100 to 170.', 'The book has 99 + 71 = <b>170</b> pages (not 171: the 3-digit pages start at 100, so the 71st one is page 170).', 'Check: 9 + 180 + 71 × 3 = 9 + 180 + 213 = 402 ✓'] },
    { id: 'f', level: 2, type: 'blanks', prompt: 'Kumar\'s Deepavali colouring book has <b>120</b> pages, numbered 1 to 120. How many page numbers contain <b>at least one</b> digit 8? How many page numbers have <b>no</b> 8 at all?',
      template: 'Pages with an 8: {0}<br>Pages with no 8: {1}', blanks: [{ answer: 21 }, { answer: 99 }],
      hint: 'Here we count <b>pages</b>, not digits, so page 88 must be counted only once. Split into groups that do not overlap: an 8 only in the ones place, an 8 only in the tens place, 8s in both places, and pages from 100 to 120.',
      solution: ['8 only in the ones place: 8, 18, 28, 38, 48, 58, 68, 78, 98 → 9 pages', '8 only in the tens place: 80, 81, …, 89 but not 88 → 9 pages', '8 in both places: 88 → 1 page', 'Pages 100 to 120: 108 and 118 → 2 pages',
        '<table class="tbl" style="font-size:15px"><thead><tr><th style="padding:5px 8px">Group</th><th style="padding:5px 8px">Pages</th></tr></thead><tbody><tr><td style="padding:5px 8px">8 only in ones place (1–99)</td><td style="padding:5px 8px">9</td></tr><tr><td style="padding:5px 8px">8 only in tens place (1–99)</td><td style="padding:5px 8px">9</td></tr><tr><td style="padding:5px 8px">8 in both places</td><td style="padding:5px 8px">1</td></tr><tr><td style="padding:5px 8px">100 to 120</td><td style="padding:5px 8px">2</td></tr><tr><th style="padding:5px 8px">Total</th><td class="hl" style="padding:5px 8px"><b>21</b></td></tr></tbody></table>',
        'Pages with an 8: 9 + 9 + 1 + 2 = <b>21</b>', 'Pages with no 8: 120 − 21 = <b>99</b>'] },
    { id: 'g', level: 3, type: 'blanks', prompt: 'Mrs Goh prints a handbook for her school\'s Sports Day. The page numbers, starting from page 1, use exactly <b>25</b> zeros. What is the <b>smallest</b> possible number of pages? What is the <b>largest</b> possible number of pages?',
      template: 'Smallest: {0} pages<br>Largest: {1} pages', blanks: [{ answer: 150 }, { answer: 159 }],
      hint: 'Count the zeros group by group: pages 1 to 99, then page 100, then 101 to 109, then 110, 120, 130, … Keep a running total until it reaches 25.',
      solution: ['Pages 1 to 99: the zeros are in 10, 20, …, 90 → 9 zeros', 'Page 100 has 2 zeros → running total 11', 'Pages 101 to 109 have 1 zero each → 9 more, running total 20',
        '<table class="tbl" style="font-size:15px"><thead><tr><th style="padding:5px 8px">Page</th><th style="padding:5px 8px">110</th><th style="padding:5px 8px">120</th><th style="padding:5px 8px">130</th><th style="padding:5px 8px">140</th><th style="padding:5px 8px">150</th></tr></thead><tbody><tr><th style="padding:5px 8px">Zeros so far</th><td style="padding:5px 8px">21</td><td style="padding:5px 8px">22</td><td style="padding:5px 8px">23</td><td style="padding:5px 8px">24</td><td class="hl" style="padding:5px 8px">25</td></tr></tbody></table>',
        'The 25th zero is on page 150, so the smallest number of pages is <b>150</b>.', 'Pages 151 to 159 have no zeros, so the total stays at 25. Page 160 would make it 26. The largest number of pages is <b>159</b>.'] },
    { id: 'h', level: 3, type: 'blanks', prompt: 'Daniel borrows a <b>60</b>-page storybook from the public library. His little brother tears out <b>one sheet</b> (one piece of paper, with a page number on each side). The page numbers left in the book add up to <b>1783</b>. Which two pages were on the torn-out sheet?',
      art: svg('0 0 400 92', `${[1, 2, 3].map((n, i) => page(8 + i * 42, 14, n, { w: 36, h: 48 })).join('')}<text x="137" y="46" ${HEAD} font-size="22" fill="${INK}">…</text>
        ${page(170, 14, 0, { missing: true, w: 36, h: 48 })}${page(210, 14, 0, { missing: true, w: 36, h: 48 })}<text x="255" y="46" ${HEAD} font-size="22" fill="${INK}">…</text>
        ${[58, 59, 60].map((n, i) => page(286 + i * 36, 14, n, { w: 32, h: 48 })).join('')}
        <path d="M170 72 h76" stroke="${CORAL}" stroke-width="2.5"/><text x="208" y="88" text-anchor="middle" ${BODY} font-size="13" fill="#d6453a">one sheet torn out</text>`, 'Pages 1 to 60 of a book with one sheet, two neighbouring pages, missing somewhere in the middle', 'style="max-width:400px"'),
      template: 'Pages {0} and {1}', blanks: [{ answer: 23, size: 'sm' }, { answer: 24, size: 'sm' }],
      hint: 'First add up all the page numbers from 1 to 60. Pair them: 1 + 60, 2 + 59, … What is missing from that total?',
      solution: ['Pair the pages: 1 + 60 = 61, 2 + 59 = 61, … There are 60 ÷ 2 = 30 pairs, so 1 + 2 + … + 60 = 30 × 61 = 1830.', 'The two torn-out pages add up to 1830 − 1783 = 47.', 'The two pages on one sheet are next to each other, so they are two numbers that differ by 1: (47 − 1) ÷ 2 = 23, and 23 + 1 = 24.', 'The sheet had pages <b>23 and 24</b>. (In a book the front of a sheet has an odd page and the back has the next even page, so 23 and 24 fit.)'] },
    { id: 'i', level: 3, type: 'blanks', prompt: 'Farah spills kopi on her Primary 4 science notebook. Pages <b>21 to 25</b> are stained and their numbers cannot be read. The page numbers she <b>can</b> read add up to <b>1160</b>. The pages are numbered from 1. How many pages does the notebook have?',
      art: svg('0 0 400 74', `${[19, 20].map((n, i) => page(8 + i * 40, 12, n, { w: 34, h: 48 })).join('')}${[21, 22, 23, 24, 25].map((n, i) => page(88 + i * 40, 12, n, { w: 34, h: 48, stain: true })).join('')}${page(288, 12, 26, { w: 34, h: 48 })}<text x="332" y="44" ${HEAD} font-size="22" fill="${INK}">…</text>${page(358, 12, 0, { missing: true, w: 34, h: 48 })}`, 'Pages 21 to 25 are covered by brown kopi stains; the last page number is unknown', 'style="max-width:400px"'),
      template: 'The notebook has {0} pages.', blanks: [{ answer: 50 }],
      hint: 'First find the sum of the stained pages. Then the sum of <b>all</b> the pages is 1160 + that. Which last page gives that total? (1 + 2 + … + n = n × (n + 1) ÷ 2.)',
      solution: ['Stained pages: 21 + 22 + 23 + 24 + 25 = 115 (5 pages, middle page 23, so 5 × 23 = 115).', 'Sum of all the page numbers: 1160 + 115 = 1275.', 'Pairing as in the last question, 1 + 2 + … + n = n × (n + 1) ÷ 2. So n × (n + 1) = 1275 × 2 = 2550.', 'Try numbers near 50: 50 × 51 = 2550 ✓', 'The notebook has <b>50</b> pages. Check: 1 + 2 + … + 50 = 25 × 51 = 1275, and 1275 − 115 = 1160 ✓'] },
  ],
  adult: 'Links to school work: this topic uses P4 <b>place value</b> (ones, tens, hundreds) and whole-number operations, but counting digits and the addition principle are <b>not</b> in the MOE primary syllabus, so the topic is <b>enrichment</b> (olympiad style). The addition principle ("split into cases that do not overlap, count each case, then add") is the first step towards the counting work children meet later in secondary school. The sums of consecutive page numbers in questions h and i preview P5–P6 patterns work. Common mistakes: counting the pages from 10 to 99 as 89 instead of 90 (forgetting "last − first + 1"); forgetting pages 1 to 9; in reverse problems, forgetting to add the 99 pages before page 100; counting a page such as 88 twice when the question asks for <b>pages</b> (not digits); and forgetting that one sheet of a book carries two consecutive pages, odd on the front. Tip: let your child check a small case by hand (for example, pages 1 to 20 use 9 + 22 = 31 digits) before trusting the method on big numbers.',
};

export default { t23 };
