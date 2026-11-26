// Unit 10 · Multiplication Principle (t24 Lining Up with Special Conditions) — original content, Singapore context.
import * as A from '../art.js';
const { svg, kid, leo } = A;
const INK = A.ink, S = A.stroke;
const HEAD = 'font-family="Baloo 2, sans-serif" font-weight="800"';
const BODY = 'font-family="Nunito, sans-serif" font-weight="800"';
const TEAL = '#0f9d94', CORAL = '#ff6b5b', SUN = '#ffc94a', GRAPE = '#7b61ff', LEAF = '#3dbb6b', SKY = '#4aa8ff';
const SOFT = '#56627a';

/* ---------- people (extra Singapore kids, drawn with art.js's kid()) ---------- */
const P = {
  ravi: { name: 'Ravi', skin: '#9c6644', hair: 'short', hairC: '#1d1716' },
  daniel: { name: 'Daniel', skin: '#efc7a2', hair: 'curly', hairC: '#6b4428' },
  hafiz: { name: 'Hafiz', skin: '#c9946c', hair: 'short', hairC: '#231a17' },
  junjie: { name: 'Jun Jie', skin: '#f6d6b6', hair: 'short', hairC: '#2b2321' },
  kumar: { name: 'Kumar', skin: '#8d5a3b', hair: 'curly', hairC: '#1d1716' },
  nurul: { name: 'Nurul', skin: '#d2a07a', hair: 'tudung', hairC: GRAPE },
  farah: { name: 'Farah', skin: '#d9a77d', hair: 'tudung', hairC: LEAF },
  siti: { name: 'Siti', skin: '#c99a72', hair: 'tudung', hairC: '#ff8fa3' },
  meiling: { name: 'Mei Ling', skin: '#f3cfae', hair: 'ponytail', hairC: '#2b2321' },
  priya: { name: 'Priya', skin: '#a8714f', hair: 'ponytail', hairC: '#1d1716' },
};
const who = (key, shirt, bottom) => ({ k: { ...P[key], shirt, bottom }, name: P[key].name });
const cast = key => ({ k: key, name: A.KIDS[key].name });

/* ---------- unit helpers (same flat style as art.js) ---------- */

// A row of children standing for a photo. glue: [i, i+1] draws a "block" round two neighbours;
// ends: true highlights the two end places.
function lineUp(list, { glue = null, ends = false, gap = 64, label = 'Children standing in a row', max = 360, blockText = 'one block' } = {}) {
  const s = .5, hy = 58, x0 = 42, feet = hy + 115 * s, W = x0 * 2 + (list.length - 1) * gap;
  const X = i => x0 + i * gap;
  let g = '';
  if (ends) [0, list.length - 1].forEach(i => {
    g += `<rect x="${X(i) - 29}" y="${hy - 34}" width="58" height="${feet - hy + 42}" rx="12" fill="#fff1c7" stroke="${SUN}" stroke-width="3"/>
      <text x="${X(i)}" y="${hy - 40}" text-anchor="middle" ${BODY} font-size="13" fill="#b07a00">end</text>`;
  });
  if (glue) {
    const [a, b] = glue, x1 = X(a) - 30, x2 = X(b) + 30;
    g += `<rect x="${x1}" y="${hy - 36}" width="${x2 - x1}" height="${feet - hy + 46}" rx="14" fill="${CORAL}" fill-opacity=".13" stroke="${CORAL}" stroke-width="3" stroke-dasharray="7 5"/>
      <rect x="${(x1 + x2) / 2 - 42}" y="${hy - 52}" width="84" height="22" rx="11" fill="${CORAL}" stroke="${INK}" stroke-width="2"/>
      <text x="${(x1 + x2) / 2}" y="${hy - 36}" text-anchor="middle" ${BODY} font-size="13" fill="#fff">${blockText}</text>`;
  }
  list.forEach((p, i) => {
    g += kid(p.k, { x: X(i), y: hy, s, mood: p.mood || 'happy', pose: p.pose || 'stand' });
    g += `<text x="${X(i)}" y="${feet + 22}" text-anchor="middle" ${BODY} font-size="13" fill="${INK}">${p.name}</text>`;
  });
  return svg(`0 0 ${W} ${feet + 32}`, g, label, `style="max-width:${max}px"`);
}

// Slot diagram: a box for each place, the number of choices underneath, multiplied.
// cells: [{t: label in box, n: choices, hi: highlight}]
function slotArt(cells, { total = null, label = 'Slots with the number of choices under each', max = 380, bw = 50 } = {}) {
  const gap = 26, W = 10 + cells.length * (bw + gap) - gap + (total != null ? 20 + String(total).length * 15 + 26 : 10);
  let g = '';
  cells.forEach((c, i) => {
    const x = 10 + i * (bw + gap);
    g += `<rect x="${x}" y="8" width="${bw}" height="46" rx="10" fill="${c.hi ? '#fff1c7' : '#e3f6f4'}" stroke="${c.hi ? '#e0a51c' : TEAL}" stroke-width="3"/>
      <text x="${x + bw / 2}" y="37" text-anchor="middle" ${BODY} font-size="${c.t.length > 5 ? 13 : 15}" fill="${INK}">${c.t}</text>
      <text x="${x + bw / 2}" y="90" text-anchor="middle" ${HEAD} font-size="28" fill="${c.hi ? '#d6453a' : INK}">${c.n}</text>`;
    if (i) g += `<text x="${x - gap / 2}" y="88" text-anchor="middle" ${HEAD} font-size="22" fill="${SOFT}">×</text>`;
  });
  if (total != null) g += `<text x="${10 + cells.length * (bw + gap) - gap + 10}" y="90" ${HEAD} font-size="28" fill="${TEAL}">= ${total}</text>`;
  return svg(`0 0 ${W} 102`, g, label, `style="max-width:${max}px"`);
}

// Tree diagram drawn sideways: first choice, then second choice, then numbered ends.
function treeArt(firsts, seconds, { heads = ['Main', 'Drink', 'Set'], label = 'Tree diagram', max = 360 } = {}) {
  const top = 34, lh = 34, n = firsts.length * seconds.length, H = top + n * lh + 8;
  const fx = 40, fw = 116, sx = 196, sw = 86, lx = 314;
  const C = [CORAL, SUN, GRAPE, SKY, LEAF];
  let g = `<text x="${fx + fw / 2}" y="20" text-anchor="middle" ${HEAD} font-size="16" fill="${SOFT}">${heads[0]}</text>
    <text x="${sx + sw / 2}" y="20" text-anchor="middle" ${HEAD} font-size="16" fill="${SOFT}">${heads[1]}</text>
    <text x="${lx}" y="20" text-anchor="middle" ${HEAD} font-size="16" fill="${SOFT}">${heads[2]}</text>`;
  const rootY = top + n * lh / 2;
  firsts.forEach((f, i) => {
    const ys = seconds.map((_, j) => top + (i * seconds.length + j + .5) * lh);
    const my = (ys[0] + ys[ys.length - 1]) / 2;
    g += `<path d="M16 ${rootY} C28 ${rootY} 28 ${my} ${fx} ${my}" fill="none" stroke="${INK}" stroke-width="2.5"/>`;
    ys.forEach((y, j) => {
      g += `<path d="M${fx + fw} ${my} C${fx + fw + 22} ${my} ${sx - 22} ${y} ${sx} ${y}" fill="none" stroke="${INK}" stroke-width="2.5"/>
        <rect x="${sx}" y="${y - 13}" width="${sw}" height="26" rx="13" fill="#fff" stroke="${TEAL}" stroke-width="2.5"/>
        <text x="${sx + sw / 2}" y="${y + 5}" text-anchor="middle" ${BODY} font-size="14" fill="${INK}">${seconds[j]}</text>
        <path d="M${sx + sw} ${y} H${lx - 13}" stroke="#b9c3d6" stroke-width="2" stroke-dasharray="3 4"/>
        <circle cx="${lx}" cy="${y}" r="12" fill="${SUN}" stroke="${INK}" stroke-width="2"/>
        <text x="${lx}" y="${y + 5}" text-anchor="middle" ${BODY} font-size="13" fill="${INK}">${i * seconds.length + j + 1}</text>`;
    });
    g += `<rect x="${fx}" y="${my - 15}" width="${fw}" height="30" rx="15" fill="${C[i % 5]}" stroke="${INK}" stroke-width="2.5"/>
      <text x="${fx + fw / 2}" y="${my + 5}" text-anchor="middle" ${BODY} font-size="14" fill="${i === 1 ? INK : '#fff'}">${f}</text>`;
  });
  g += `<circle cx="12" cy="${rootY}" r="7" fill="${INK}"/>`;
  return svg(`0 0 340 ${H}`, g, label, `style="max-width:${max}px"`);
}

// Digit cards
function cardsArt(digits, label) {
  const g = digits.map((d, i) => `<g transform="translate(${8 + i * 66} 6) rotate(${[-4, 3, -2, 4, -3][i % 5]} 26 36)"><rect width="52" height="70" rx="9" fill="#fff" stroke="${INK}" stroke-width="3"/>
    <rect x="6" y="6" width="40" height="58" rx="6" fill="${[CORAL, TEAL, GRAPE, SKY, LEAF][i % 5]}" opacity=".15"/>
    <text x="26" y="48" text-anchor="middle" ${HEAD} font-size="32" fill="${[CORAL, TEAL, GRAPE, SKY, LEAF][i % 5]}">${d}</text></g>`).join('');
  const W = 16 + digits.length * 66 - 14;
  return svg(`0 0 ${W} 86`, g, label, `style="max-width:${W}px"`);
}

// Bar showing all orders split into "together" and "apart"
function splitBar(total, together, { label = 'All orders split into together and apart', max = 360 } = {}) {
  const w = 300, x0 = 20, tw = w * together / total;
  return svg('0 0 340 104', `
    <text x="${x0 + w / 2}" y="18" text-anchor="middle" ${BODY} font-size="15" fill="${INK}">all ${total} orders</text>
    <path d="M${x0} 26 v-4 h${w} v4" fill="none" stroke="${INK}" stroke-width="2"/>
    <rect x="${x0}" y="32" width="${tw}" height="36" rx="6" fill="${CORAL}" stroke="${INK}" stroke-width="2.5"/>
    <rect x="${x0 + tw}" y="32" width="${w - tw}" height="36" rx="6" fill="${TEAL}" stroke="${INK}" stroke-width="2.5"/>
    <text x="${x0 + tw / 2}" y="56" text-anchor="middle" ${HEAD} font-size="18" fill="#fff">${together}</text>
    <text x="${x0 + tw + (w - tw) / 2}" y="56" text-anchor="middle" ${HEAD} font-size="18" fill="#fff">${total - together}</text>
    <text x="${x0 + tw / 2}" y="90" text-anchor="middle" ${BODY} font-size="14" fill="#d6453a">together</text>
    <text x="${x0 + tw + (w - tw) / 2}" y="90" text-anchor="middle" ${BODY} font-size="14" fill="#0b7a73">NOT together</text>`, label, `style="max-width:${max}px"`);
}

// Gaps method: people in a row with numbered gaps around them
function gapsArt(names, { label = 'People in a row with numbered gaps between and around them', max = 360 } = {}) {
  let g = '', x = 10;
  const gw = 34, pw = 50;
  for (let i = 0; i <= names.length; i++) {
    g += `<rect x="${x}" y="14" width="${gw}" height="44" rx="8" fill="#fff1c7" stroke="#e0a51c" stroke-width="2.5" stroke-dasharray="5 3"/>
      <text x="${x + gw / 2}" y="78" text-anchor="middle" ${BODY} font-size="13" fill="#b07a00">gap ${i + 1}</text>`;
    x += gw + 6;
    if (i < names.length) {
      g += `<circle cx="${x + pw / 2}" cy="36" r="22" fill="${[SKY, GRAPE, LEAF][i % 3]}" stroke="${INK}" stroke-width="2.5"/>
        <text x="${x + pw / 2}" y="42" text-anchor="middle" ${HEAD} font-size="16" fill="#fff">${names[i]}</text>`;
      x += pw + 6;
    }
  }
  return svg(`0 0 ${x + 4} 88`, g, label, `style="max-width:${max}px"`);
}

/* ---------- Singapore scenery bits ---------- */
function flyer(cx, cy, r = 40) {
  let g = `<path d="M${cx} ${cy} L${cx - 20} ${cy + r + 34} M${cx} ${cy} L${cx + 20} ${cy + r + 34}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${INK}" stroke-width="3.5"/>`;
  for (let i = 0; i < 12; i++) {
    const a = i * Math.PI / 6, x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
    g += `<path d="M${cx} ${cy} L${x.toFixed(1)} ${y.toFixed(1)}" stroke="#9aa4b5" stroke-width="1.5"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="#cfe9ff" stroke="${INK}" stroke-width="1.8"/>`;
  }
  return g + `<circle cx="${cx}" cy="${cy}" r="5" fill="${INK}"/>`;
}
function mbs(x, y, s = 1) {   // three hotel towers with the long "boat" on top
  const tower = tx => `<path d="M${tx} 14 h24 l3 92 h-30z" fill="#e8eef7" ${S}/><path d="M${tx + 5} 24 v74 M${tx + 12} 24 v74 M${tx + 19} 24 v74" stroke="#b9c9de" stroke-width="2"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})">${tower(4)}${tower(40)}${tower(76)}
    <path d="M-8 6 h124 q8 0 6 6 h-128 q-6 -6 -2 -6z" fill="#cfd8e6" ${S}/></g>`;
}
function supertree(x, y, s = 1, c = GRAPE) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-6 0 l3 -54 h6 l3 54z" fill="${c}" ${S} stroke-width="2.5"/>
    <path d="M-30 -68 q30 14 60 0 l-26 16 h-8z" fill="${c}" ${S} stroke-width="2.5"/>
    <path d="M-20 -62 l14 8 M20 -62 l-14 8 M0 -60 v6" stroke="#fff" stroke-width="2" opacity=".7"/></g>`;
}
function camera(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M0 20 l-16 46 M0 20 l16 46 M0 20 v46" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
    <rect x="-22" y="-8" width="44" height="30" rx="6" fill="#3b3f58" ${S}/><rect x="-10" y="-14" width="16" height="8" rx="2" fill="#3b3f58" ${S}/>
    <circle cx="2" cy="7" r="9" fill="#8fc8ff" ${S}/><circle cx="2" cy="7" r="3.5" fill="#fff"/><circle cx="16" cy="-2" r="2.5" fill="${SUN}"/></g>`;
}

/* ===================== Topic 24 ===================== */
const EX_MAINS = ['Chicken rice', 'Nasi lemak', 'Mee goreng'], EX_DRINKS = ['Teh', 'Bandung'];
const t24 = {
  id: 't24',
  title: 'Lining Up with Special Conditions',
  intro: 'How many ways can you pick a meal set, or line up for a photo? When a job is done in steps, <b>multiply</b> the choices at each step. Then learn the tricks for friends who must (or must not!) stand together.',
  skills: ['Multiplication principle', 'Slots and tree diagrams', 'Arrangements with conditions'],
  art: () => svg('0 0 360 220', `<rect width="360" height="220" rx="20" fill="#e6f4ff"/>
    ${A.cloud(140, 14, .7)}
    ${flyer(66, 64, 38)}
    ${mbs(244, 30, .95)}
    <rect x="0" y="128" width="360" height="22" fill="#9fd3f5"/><path d="M20 138 q10 -4 20 0 M200 136 q10 -4 20 0 M300 140 q10 -4 20 0" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M0 150 h360 v70 h-360z" fill="#f3e3c3"/><path d="M0 150 h360" stroke="${INK}" stroke-width="3"/>
    ${camera(36, 150, .9)}
    <rect x="147" y="86" width="112" height="118" rx="14" fill="${CORAL}" fill-opacity=".14" stroke="${CORAL}" stroke-width="3" stroke-dasharray="7 5"/>
    <rect x="164" y="74" width="78" height="22" rx="11" fill="${CORAL}" stroke="${INK}" stroke-width="2"/>
    <text x="203" y="90" text-anchor="middle" ${BODY} font-size="13" fill="#fff">together!</text>
    ${kid('weiming', { x: 116, y: 128, s: .55, pose: 'wave' })}
    ${kid('aisyah', { x: 176, y: 128, s: .55 })}
    ${kid('arjun', { x: 230, y: 128, s: .55, pose: 'cheer' })}
    ${kid('chloe', { x: 296, y: 128, s: .55, pose: 'wave', flip: true })}`, 'Four friends lining up for a photo at Marina Bay, with Aisyah and Arjun glued together in one block'),
  explore: {
    setup: 'After a morning at Gardens by the Bay, Wei Ming, Aisyah, Arjun and Chloe stop at a <b>hawker centre</b> nearby. One stall sells a <b>$5 lunch set</b>: choose 1 main (chicken rice, nasi lemak or mee goreng) and 1 drink (teh or bandung).',
    art: () => svg('0 0 340 300', `<rect width="340" height="300" rx="20" fill="#fff6e4"/>
      <path d="M0 20 q0 -20 20 -20 h300 q20 0 20 20 v34 h-340z" fill="${TEAL}"/><path d="M0 54 h340" stroke="${INK}" stroke-width="3"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<path d="M${i * 44 + 4} 54 q22 18 44 0" fill="#fff" ${S} stroke-width="2.5"/>`).join('')}
      <text x="170" y="38" text-anchor="middle" ${HEAD} font-size="20" fill="#fff">HAWKER CENTRE · STALL 12</text>
      <rect x="26" y="78" width="288" height="78" rx="10" fill="#fff" ${S}/>
      <text x="170" y="102" text-anchor="middle" ${HEAD} font-size="17" fill="#d6453a">LUNCH SET $5</text>
      <text x="170" y="122" text-anchor="middle" ${BODY} font-size="13.5" fill="${INK}">Chicken rice · Nasi lemak · Mee goreng</text>
      <text x="170" y="142" text-anchor="middle" ${BODY} font-size="13.5" fill="${TEAL}">+ 1 drink: Teh or Bandung</text>
      ${kid('weiming', { x: 62, y: 196, s: .72, mood: 'think', pose: 'think' })}
      ${leo({ x: 170, y: 204, s: .56, pose: 'point' })}
      ${kid('chloe', { x: 284, y: 196, s: .72, pose: 'wave', flip: true })}
      ${A.table(24, 248, 292)}
      <ellipse cx="96" cy="244" rx="26" ry="7" fill="#fff" ${S} stroke-width="2.5"/><path d="M78 242 q18 -16 36 0z" fill="#fff8e6" ${S} stroke-width="2"/><path d="M98 232 l12 6" stroke="#f2b65a" stroke-width="5" stroke-linecap="round"/>
      ${A.kopi(218, 206, .66)}`, 'Wei Ming, Leo and Chloe at a hawker centre stall with a lunch-set menu'),
    steps: [
      { who: 'weiming', mood: 'think', text: 'There are 3 mains and 2 drinks. How many <b>different</b> lunch sets can I choose? Chicken rice with teh, chicken rice with bandung, nasi lemak with…' },
      { who: 'leo', text: 'Let\'s draw a <b>tree diagram</b> so we don\'t miss any. First a main: 3 branches. From <b>each</b> main, a drink: 2 more branches. Then count the ends.',
        art: () => treeArt(EX_MAINS, EX_DRINKS, { label: 'Tree diagram: 3 mains, each branching into 2 drinks, making 6 lunch sets' }) },
      { who: 'aisyah', text: 'Every main has the <b>same</b> 2 drinks, so there are 3 lots of 2: <b>3 × 2 = 6</b> sets. This is the <b>multiplication principle</b>: when a job is done in steps, multiply the number of choices at each step.' },
      { who: 'chloe', text: 'Now let\'s take a photo in a row with the Supertrees behind us! In how many different orders can the <b>4</b> of us stand? Draw a <b>slot</b> for each place and write the choices under it:',
        art: () => slotArt([{ t: '1st', n: 4 }, { t: '2nd', n: 3 }, { t: '3rd', n: 2 }, { t: '4th', n: 1 }], { total: 24, label: 'Four slots with 4, 3, 2 and 1 choices: 4 × 3 × 2 × 1 = 24' }) + '<small>Any of the 4 can stand first. Then 3 are left, then 2, then 1.</small>' },
      { who: 'arjun', mood: 'think', text: 'But Aisyah and I want to stand <b>next to each other</b>. How many orders now?' },
      { who: 'leo', text: '<b>Glue</b> Aisyah and Arjun into one block! Now there are only <b>3</b> "things" to line up: the block, Wei Ming and Chloe. That is 3 × 2 × 1 = 6 ways. Inside the block they can stand Aisyah–Arjun or Arjun–Aisyah: <b>2</b> ways. So 6 × 2 = <b>12</b> orders.',
        art: () => lineUp([cast('weiming'), cast('aisyah'), cast('arjun'), cast('chloe')], { glue: [1, 2], label: 'Wei Ming, then Aisyah and Arjun glued into one block, then Chloe', max: 340 })
          + slotArt([{ t: 'thing', n: 3 }, { t: 'thing', n: 2 }, { t: 'thing', n: 1 }, { t: 'inside', n: 2, hi: true }], { total: 12, label: '3 × 2 × 1 for the three things, times 2 orders inside the block, equals 12', max: 360 }) },
      { who: 'weiming', text: 'Forget the glue now. Chloe and I keep making each other laugh, so we must <b>NOT</b> stand together. Easy: count <b>all</b> the orders, then take away the ones where we <b>are</b> together. Together is 12 (glue us, just like before), so apart is 24 − 12 = <b>12</b>.',
        art: () => splitBar(24, 12, { label: 'All 24 orders: 12 with Wei Ming and Chloe together, 12 with them apart' }) },
    ],
  },
  keys: [
    { title: 'Multiply the steps', text: 'If a job is done in steps, multiply the choices at each step. 3 T-shirts and 2 pairs of shorts make 3 × 2 = <b>6</b> outfits.' },
    { title: 'Fill the slots', text: 'Draw a box for each place and write the number of choices under it. 4 people in a row: 4 × 3 × 2 × 1 = <b>24</b>. Fill the <b>fussy</b> places first (an end, or a first digit that cannot be 0).' },
    { title: 'Must be together', text: '<b>Glue</b> them into one block. Line up the block with everyone else, then multiply by the number of orders <b>inside</b> the block.' },
    { title: 'Must NOT be together', text: 'Count all the orders, then take away the orders where they <b>are</b> together. All − together = apart.' },
  ],
  practice: [
    { id: 'a', level: 1, type: 'blanks', prompt: 'Uncle Lim\'s stall in the school canteen sells a <b>$3 meal set</b>: any 1 main and any 1 drink from the board. How many different meal sets can Jun Jie choose from?',
      art: svg('0 0 340 182', `<rect x="4" y="4" width="332" height="174" rx="12" fill="#c98b55" ${S}/><rect x="14" y="14" width="312" height="154" rx="6" fill="#2f6f5e"/>
        <text x="170" y="40" text-anchor="middle" ${HEAD} font-size="16" fill="#ffe27a">UNCLE LIM'S STALL · $3 MEAL SET</text>
        <text x="30" y="66" ${HEAD} font-size="15" fill="#9fe6c7">MAINS</text><text x="206" y="66" ${HEAD} font-size="15" fill="#9fe6c7">DRINKS</text>
        ${['Chicken rice', 'Nasi lemak', 'Mee soto', 'Fishball noodles', 'Roti prata'].map((t, i) => `<text x="30" y="${88 + i * 18}" ${BODY} font-size="14" fill="#fff">• ${t}</text>`).join('')}
        ${['Milo', 'Lime juice', 'Soya bean milk'].map((t, i) => `<text x="206" y="${88 + i * 18}" ${BODY} font-size="13.5" fill="#fff">• ${t}</text>`).join('')}`, 'Canteen menu board: 5 mains and 3 drinks', 'style="max-width:360px"'),
      template: '{0} different meal sets', blanks: [{ answer: 15 }],
      hint: 'Pick a main first. How many drinks can go with <b>each</b> main?',
      solution: ['Step 1: choose a main. There are 5 choices.', 'Step 2: choose a drink. Each main can go with any of the 3 drinks.', 'So there are 5 lots of 3: 5 × 3 = <b>15</b> meal sets.'] },
    { id: 'b', level: 1, type: 'mcq', prompt: 'Siti is going from her home to Gardens by the Bay, changing at an MRT interchange on the way. From her home to the interchange she can travel in <b>3</b> ways (A, B or C). From the interchange to Gardens by the Bay she can travel in <b>2</b> ways (1 or 2). How many different ways can she make the whole trip?',
      art: svg('0 0 400 170', `${A.hdb(14, 50, 52, 76, '#ffe3b3', 4)}
        <path d="M68 88 Q119 30 170 88" fill="none" stroke="${CORAL}" stroke-width="5" stroke-linecap="round"/><path d="M68 88 H170" fill="none" stroke="${SUN}" stroke-width="5" stroke-linecap="round"/><path d="M68 88 Q119 146 170 88" fill="none" stroke="${GRAPE}" stroke-width="5" stroke-linecap="round"/>
        ${[['A', 59, CORAL], ['B', 88, SUN], ['C', 117, GRAPE]].map(([t, y, c]) => `<circle cx="119" cy="${y}" r="12" fill="#fff" stroke="${c}" stroke-width="3"/><text x="119" y="${y + 5}" text-anchor="middle" ${BODY} font-size="14" fill="${INK}">${t}</text>`).join('')}
        <rect x="170" y="64" width="62" height="48" rx="10" fill="#f4f6fb" ${S}/><rect x="170" y="64" width="62" height="13" rx="5" fill="#e1484b"/><text x="201" y="102" text-anchor="middle" ${HEAD} font-size="18" fill="${INK}">MRT</text>
        <path d="M232 88 Q278 44 324 88" fill="none" stroke="${TEAL}" stroke-width="5" stroke-linecap="round"/><path d="M232 88 Q278 132 324 88" fill="none" stroke="${SKY}" stroke-width="5" stroke-linecap="round"/>
        ${[['1', 66, TEAL], ['2', 110, SKY]].map(([t, y, c]) => `<circle cx="278" cy="${y}" r="12" fill="#fff" stroke="${c}" stroke-width="3"/><text x="278" y="${y + 5}" text-anchor="middle" ${BODY} font-size="14" fill="${INK}">${t}</text>`).join('')}
        ${supertree(348, 126, .85)}${supertree(376, 130, .62, CORAL)}
        <text x="40" y="148" text-anchor="middle" ${BODY} font-size="15" fill="${INK}">Home</text>
        <text x="201" y="136" text-anchor="middle" ${BODY} font-size="15" fill="${INK}">Interchange</text>
        <text x="360" y="150" text-anchor="middle" ${BODY} font-size="14" fill="${INK}">Gardens</text><text x="360" y="166" text-anchor="middle" ${BODY} font-size="14" fill="${INK}">by the Bay</text>`, 'Route map: 3 ways from home to the interchange, then 2 ways from the interchange to Gardens by the Bay', 'style="max-width:440px"'),
      options: ['5 ways', '6 ways', '8 ways', '9 ways'], answer: 1,
      hint: 'Suppose she takes way A to the interchange. How many ways can she then finish the trip? What about B, and C?',
      solution: ['Each way to the interchange can be followed by either of the 2 ways to the Gardens.', 'A1, A2, B1, B2, C1, C2', 'That is 3 × 2 = <b>6 ways</b>. (3 + 2 = 5 is a common mistake: the trip has two <b>steps</b>, so we multiply.)'] },
    { id: 'c', level: 1, type: 'blanks', prompt: 'Kumar has four digit cards. He uses <b>3</b> different cards to make a 3-digit number. How many different 3-digit numbers can he make?',
      art: cardsArt([2, 4, 7, 9], 'Digit cards 2, 4, 7 and 9'),
      template: '{0} numbers', blanks: [{ answer: 24 }],
      hint: 'Draw three slots: hundreds, tens and ones. How many cards can go in the hundreds slot? How many are left for the tens?',
      solution: ['Hundreds: any of the 4 cards. Tens: 3 cards are left. Ones: 2 cards are left.',
        slotArt([{ t: 'H', n: 4 }, { t: 'T', n: 3 }, { t: 'O', n: 2 }], { total: 24, label: 'Hundreds 4, tens 3, ones 2: 24 numbers', max: 300 }),
        '4 × 3 × 2 = <b>24</b> different numbers (from 247 up to 974).'] },
    { id: 'd', level: 2, type: 'blanks', prompt: 'For a Maths Week game, Priya picks these four digit cards. She uses <b>3</b> different cards to make a 3-digit number. (A 3-digit number cannot start with 0.) How many different 3-digit numbers can she make?',
      art: cardsArt([0, 3, 6, 8], 'Digit cards 0, 3, 6 and 8'),
      template: '{0} numbers', blanks: [{ answer: 18 }],
      hint: 'Fill the fussy slot first. Which cards can go in the <b>hundreds</b> place? After that, can the 0 be used?',
      solution: ['Hundreds (the fussy slot): 3, 6 or 8, but not 0. So <b>3</b> choices.', 'Tens: the 0 is now allowed, and 3 cards are left. So <b>3</b> choices.', 'Ones: 2 cards are left.',
        slotArt([{ t: 'H', n: 3, hi: true }, { t: 'T', n: 3 }, { t: 'O', n: 2 }], { total: 18, label: 'Hundreds 3 (not 0), tens 3, ones 2: 18 numbers', max: 300 }),
        '3 × 3 × 2 = <b>18</b> numbers. (4 × 3 × 2 = 24 would wrongly count numbers such as 036.)'] },
    { id: 'e', level: 2, type: 'blanks', prompt: 'Five members of the Scouts CCA line up for a photo at camp. Mr Rahman wants the two patrol leaders, <b>Daniel</b> and <b>Ravi</b>, to stand at the <b>two ends</b> of the row. Hafiz, Jun Jie and Kumar stand in between. How many different ways can the five line up?',
      art: lineUp([who('daniel', '#b9975b', '#3b3f58'), who('hafiz', '#b9975b', '#3b3f58'), who('junjie', '#b9975b', '#3b3f58'), who('kumar', '#b9975b', '#3b3f58'), who('ravi', '#b9975b', '#3b3f58')], { ends: true, label: 'Five Scouts in a row, with Daniel and Ravi at the two ends', max: 360 }) + `<p style="text-align:center;margin:4px 0 0"><small>One possible photo</small></p>`,
      template: '{0} ways', blanks: [{ answer: 12 }],
      hint: 'Fill the two end slots first. Who can stand at the left end? Once that is chosen, who stands at the right end?',
      solution: ['Left end: Daniel or Ravi, so 2 choices. Right end: the other leader, so 1 choice.', 'The 3 middle places: 3 × 2 × 1 = 6 ways for Hafiz, Jun Jie and Kumar.',
        slotArt([{ t: 'end', n: 2, hi: true }, { t: '2nd', n: 3 }, { t: '3rd', n: 2 }, { t: '4th', n: 1 }, { t: 'end', n: 1, hi: true }], { total: 12, label: 'End 2, middle 3, 2, 1, end 1: 12 ways', max: 440 }),
        '2 × 3 × 2 × 1 × 1 = <b>12</b> ways.'] },
    { id: 'f', level: 2, type: 'blanks', prompt: 'On Racial Harmony Day, five girls from the Malay Dance CCA take a bow in a row after their show. Nurul and Farah are sisters and must stand <b>next to each other</b>. Siti, Priya and Mei Ling can stand anywhere. Fill in the steps.',
      art: lineUp([who('siti', '#ffc94a', '#e0282e'), who('nurul', '#ffc94a', '#e0282e'), who('farah', '#ffc94a', '#e0282e'), who('priya', '#ffc94a', '#e0282e'), who('meiling', '#ffc94a', '#e0282e')], { glue: [1, 2], label: 'Five dancers in a row, with Nurul and Farah glued together', max: 360 }),
      template: 'Line up the block and the 3 other girls: {0} ways<br>Orders inside the block: {1} ways<br>Total: {2} ways', blanks: [{ answer: 24 }, { answer: 2, size: 'sm' }, { answer: 48 }],
      hint: 'After gluing Nurul and Farah, how many "things" are there to line up? Don\'t forget that the sisters can swap places inside the block.',
      solution: ['Glue Nurul and Farah into one block. Now there are 4 things: the block, Siti, Priya and Mei Ling.', 'Line up the 4 things: 4 × 3 × 2 × 1 = <b>24</b> ways.', 'Inside the block: Nurul–Farah or Farah–Nurul, so <b>2</b> ways.', 'Total: 24 × 2 = <b>48</b> ways.'] },
    { id: 'g', level: 3, type: 'mcq', prompt: 'At the Singapore Zoo, Jun Jie, Hafiz, Mei Ling, Priya and Daniel line up in a row for a photo. Jun Jie and Hafiz keep pulling silly faces at each other, so they must <b>NOT</b> stand next to each other. How many different ways can the five line up?',
      art: lineUp([who('junjie', SKY, '#2f4a7a'), who('meiling', CORAL, TEAL), who('hafiz', LEAF, '#3b3f58'), who('priya', SUN, GRAPE), who('daniel', GRAPE, '#3b3f58')], { label: 'One allowed photo: Jun Jie, Mei Ling, Hafiz, Priya, Daniel', max: 360 }) + `<p style="text-align:center;margin:4px 0 0"><small>One allowed photo: Jun Jie and Hafiz are not side by side</small></p>`,
      options: ['48', '72', '96', '120'], answer: 1,
      hint: 'First find the number of ways with no rule at all. Then find the number of ways where Jun Jie and Hafiz <b>are</b> together (glue them!). What should you do with these two numbers?',
      solution: ['All the ways, with no rule: 5 × 4 × 3 × 2 × 1 = 120.', 'Ways with Jun Jie and Hafiz <b>together</b>: glue them, so 4 things: 4 × 3 × 2 × 1 = 24, times 2 inside the block = 48.', 'NOT together = all − together = 120 − 48 = <b>72</b>.',
        '<b>Another way (gaps):</b> first line up Mei Ling, Priya and Daniel: 3 × 2 × 1 = 6 ways. That leaves 4 gaps. Jun Jie picks a gap (4 choices), then Hafiz picks a different gap (3 choices). Different gaps means they are never side by side.',
        gapsArt(['ML', 'P', 'D'], { label: 'Mei Ling, Priya and Daniel in a row with 4 gaps around them', max: 330 }),
        '6 × 4 × 3 = <b>72</b> ✓. (48 counts the "together" photos, and 120 ignores the rule.)'] },
    { id: 'h', level: 3, type: 'blanks', prompt: 'Mrs Pillai arranges 6 different books in a row on the class library shelf: <b>2</b> Maths books, <b>3</b> Science books and <b>1</b> dictionary. The Maths books must be together, and the Science books must be together. How many different ways can she arrange the books?',
      art: svg('0 0 330 150', `<rect x="10" y="118" width="310" height="14" rx="4" fill="#c98b55" ${S}/>
        ${[['S1', TEAL, 34, 86], ['S2', TEAL, 34, 96], ['S3', TEAL, 34, 80], ['D', SUN, 46, 100], ['M2', CORAL, 34, 90], ['M1', CORAL, 34, 84]].reduce((acc, [t, c, w, h]) => {
          const x = acc.x;
          acc.g += `<rect x="${x}" y="${118 - h}" width="${w}" height="${h}" rx="4" fill="${c}" ${S} stroke-width="2.5"/><rect x="${x + 5}" y="${118 - h + 10}" width="${w - 10}" height="4" fill="#fff" opacity=".7"/>
            <text x="${x + w / 2}" y="${118 - h / 2 + 6}" text-anchor="middle" ${BODY} font-size="14" fill="${c === SUN ? INK : '#fff'}">${t}</text>`;
          acc.x += w + 6; return acc;
        }, { x: 40, g: '' }).g}
        <text x="165" y="146" text-anchor="middle" ${BODY} font-size="13" fill="${SOFT}">One way: Science books, dictionary, Maths books</text>`, 'A shelf showing one possible arrangement: three Science books, the dictionary, then two Maths books', 'style="max-width:340px"'),
      template: '{0} ways', blanks: [{ answer: 72 }],
      hint: 'Glue the Maths books into one block and the Science books into another block. How many "things" are there now? Then count the orders <b>inside</b> each block.',
      solution: ['Make two blocks: a Maths block and a Science block. With the dictionary, there are 3 things.', 'Line up the 3 things: 3 × 2 × 1 = 6 ways.', 'Inside the Maths block: 2 × 1 = 2 ways. Inside the Science block: 3 × 2 × 1 = 6 ways.', 'Total: 6 × 2 × 6 = <b>72</b> ways.'] },
    { id: 'i', level: 3, type: 'blanks', prompt: 'At their Chinese New Year reunion dinner, 5 family members sit at a round table with seats numbered 1 to 5. Ah Gong always sits in seat 1. Mei Ling and her cousin Jun Hao must sit <b>next to each other</b>. Mei Ling\'s mother and father sit in the other two seats. How many different ways can the four of them be seated?',
      art: svg('0 0 300 230', `<circle cx="150" cy="116" r="62" fill="#e0282e" ${S}/><circle cx="150" cy="116" r="44" fill="#ff8a7a" opacity=".5"/><circle cx="150" cy="116" r="22" fill="#ffc94a" ${S} stroke-width="2.5"/>
        ${[1, 2, 3, 4, 5].map(k => {
          const a = (-90 + (k - 1) * 72) * Math.PI / 180, x = 150 + 90 * Math.cos(a), y = 116 + 90 * Math.sin(a);
          return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="19" fill="${k === 1 ? SUN : '#fff'}" ${S}/><text x="${x.toFixed(1)}" y="${(y + 6).toFixed(1)}" text-anchor="middle" ${HEAD} font-size="18" fill="${INK}">${k}</text>`;
        }).join('')}
        <text x="180" y="22" ${BODY} font-size="14" fill="${INK}">Ah Gong</text>`, 'A round table with 5 numbered seats; Ah Gong sits in seat 1 at the top, seats 2 to 5 go round clockwise', 'style="max-width:300px"'),
      template: '{0} ways', blanks: [{ answer: 12 }],
      hint: 'Which pairs of seats from 2 to 5 are <b>next to each other</b>? Look carefully at seats 2 and 5: is anyone sitting between them?',
      solution: ['Seats next to each other (not using seat 1): 2 and 3, 3 and 4, 4 and 5. Seats 5 and 2 are <b>not</b> next to each other, because Ah Gong in seat 1 sits between them.',
        '<table class="tbl"><thead><tr><th>Pair of seats</th><th>Next to each other?</th></tr></thead><tbody><tr><td>2 and 3</td><td class="hl">✓</td></tr><tr><td>3 and 4</td><td class="hl">✓</td></tr><tr><td>4 and 5</td><td class="hl">✓</td></tr><tr><td>5 and 2</td><td>✗ (seat 1 is between)</td></tr></tbody></table>',
        'So the cousins\' block can go in <b>3</b> places, and inside the block they can sit in <b>2</b> orders.', 'Mother and father fill the 2 seats left: 2 × 1 = 2 ways.', 'Total: 3 × 2 × 2 = <b>12</b> ways.'] },
  ],
  adult: 'Links to school work: P4 multiplication and systematic listing (making lists and tables). Counting arrangements with the multiplication principle (permutations) is <b>not</b> in the primary MOE syllabus; it is met formally only in upper secondary and JC, so this topic is <b>enrichment</b> (Maths Olympiad style). It pairs with the addition principle in Unit 9: use <b>+</b> when you choose <i>one way or another</i>, and <b>×</b> when a job happens <i>in steps</i>. Common mistakes: adding instead of multiplying (3 + 2 instead of 3 × 2); forgetting to multiply by the orders <b>inside</b> a glued block; letting 0 be the first digit of a number; and, at a round table, treating the two seats beside a fixed person as neighbours. Tip: draw slots (boxes) and fill the fussy places first, and check small cases by listing them all, as in the tree diagram.',
};

export default { t24 };
