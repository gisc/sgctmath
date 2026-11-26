// Unit 6 (Part B) · Draw a Model: t18, t19, S2 — original content, Singapore context.
import * as A from '../art.js';
const { svg, kid, leo } = A;
const INK = A.ink, S = A.stroke;
const F = 'font-family="Nunito, sans-serif" font-weight="800"';
const FB = 'font-family="Baloo 2, sans-serif" font-weight="800"';
const tx = (x, y, t, { size = 14, fill = INK, anchor = 'middle', b = false } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" ${b ? FB : F} font-size="${size}" fill="${fill}">${t}</text>`;
let uid = 0;
const nid = p => `u6b${p}${++uid}`;
const r1 = v => Math.round(v * 10) / 10;
const TEAL = '#0f9d94', CORAL = '#ff6b5b', SUN = '#ffc94a', GRAPE = '#7b61ff', LEAF = '#3dbb6b', SKY = '#4aa8ff';

// rounded panel with clipped contents
function panel(W, H, inner, bg = '#f3faff') {
  const c = nid('pc');
  return `<defs><clipPath id="${c}"><rect width="${W}" height="${H}" rx="16"/></clipPath></defs><g clip-path="url(#${c})"><rect width="${W}" height="${H}" fill="${bg}"/>${inner}</g>`;
}
// square bracket with label. up=false: label below; up=true: label above
function bracket(x1, x2, y, label, { up = false, color = INK, size = 14 } = {}) {
  const d = up ? 6 : -6;
  return `<path d="M${r1(x1)} ${y + d} V${y} H${r1(x2)} V${y + d}" fill="none" stroke="${color}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>` +
    (label ? tx(r1((x1 + x2) / 2), up ? y - 7 : y + 18, label, { size, fill: color }) : '');
}
const tri = c => `<span style="color:${c}">▲</span>`;
const dot = c => `<span style="color:${c}">●</span>`;

/* ===================== Item icons (drawn in a ~30 × 30 box around 0,0) ===================== */
const ICON = {
  puff: `<path d="M-14 7 A14 14 0 0 1 14 7 Z" fill="#f2b65a" ${S} stroke-width="2.4"/><path d="M-10 -2 l3 3 M-4 -6 l1 4 M4 -6 l-1 4 M10 -2 l-3 3" stroke="#b77a2a" stroke-width="2" stroke-linecap="round"/>`,
  soya: `<path d="M-8 -9 l8 -5 l8 5z" fill="#e8f7ee" ${S} stroke-width="2"/><rect x="-8" y="-9" width="16" height="22" rx="2" fill="#fff"/><rect x="-8" y="0" width="16" height="7" fill="${LEAF}"/><rect x="-8" y="-9" width="16" height="22" rx="2" fill="none" ${S} stroke-width="2"/><path d="M3 -12 l4 -8" stroke="${CORAL}" stroke-width="3" stroke-linecap="round"/>`,
  pen: `<g transform="rotate(-35)"><rect x="-3.5" y="-15" width="7" height="23" rx="2" fill="${SKY}" ${S} stroke-width="2"/><path d="M-3.5 8 L0 15 L3.5 8Z" fill="#ffe3b3" ${S} stroke-width="2"/><rect x="-3.5" y="-15" width="7" height="6" rx="2" fill="${INK}"/></g>`,
  file: `<path d="M-12 -11 h8 l3 3 h13 v19 h-24z" fill="#f2a516" ${S} stroke-width="2"/><rect x="-12" y="-5" width="24" height="16" rx="1.5" fill="${SUN}" ${S} stroke-width="2"/>`,
  book: `<rect x="-9" y="-13" width="19" height="26" rx="2" fill="${CORAL}" ${S} stroke-width="2"/><rect x="-4" y="-7" width="11" height="7" rx="1.5" fill="#fff"/><path d="M-12 -8 h5 M-12 -2 h5 M-12 4 h5 M-12 10 h5" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`,
  rice: `<ellipse cx="0" cy="7" rx="15" ry="5.5" fill="#fff" ${S} stroke-width="2"/><path d="M-11 6 q0 -15 11 -15 q11 0 11 15z" fill="#fffaf0" ${S} stroke-width="2"/><path d="M-4 -4 q7 -4 12 3 l-2 5 h-12z" fill="#f2b65a" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>`,
  lime: `<path d="M-8 -11 h16 l-2.5 23 h-11z" fill="#c8f0b0" ${S} stroke-width="2"/><path d="M-6 -4 h12" stroke="#fff" stroke-width="2" opacity=".8"/><circle cx="7" cy="-11" r="4.5" fill="#7ac74f" ${S} stroke-width="1.6"/>`,
};
const icon = (k, x, y, s = 1) => `<g transform="translate(${r1(x)} ${r1(y)}) scale(${s})">${ICON[k]}</g>`;

/* Purchases lined up row by row.
   rows: [{who, items:[[iconKey, count], …], price, boxes:[[from, to, 'same'|'extra'], …]}] */
function orderRows(rows, { W = 340, iw = 33, note = '', noteColor = '#d6453a', label = 'Two purchases lined up' } = {}) {
  const rh = 76, top = 4;
  let g = '';
  rows.forEach((r, i) => {
    const y = top + i * rh;
    g += tx(12, y + 18, r.who, { anchor: 'start', size: 15, fill: '#0f7a73' }) + tx(W - 12, y + 19, r.price, { anchor: 'end', size: 18, b: true });
    const icons = r.items.flatMap(([k, n]) => Array(n).fill(k));
    (r.boxes || []).forEach(([a, b, kind]) => {
      const c = kind === 'same' ? ['#d9f3ef', TEAL] : ['#ffe1dd', CORAL];
      g += `<rect x="${10 + a * iw}" y="${y + 26}" width="${(b - a) * iw + 4}" height="44" rx="10" fill="${c[0]}" stroke="${c[1]}" stroke-width="2.4" stroke-dasharray="6 4"/>`;
    });
    icons.forEach((k, j) => { g += icon(k, 12 + j * iw + iw / 2, y + 48, iw / 28); });
  });
  let H = top + rows.length * rh + 4;
  if (note) { g += tx(W / 2, H + 16, note, { size: 17, fill: noteColor, b: true }); H += 30; }
  return svg(`0 0 ${W} ${H}`, panel(W, H, g, '#fffaf0'), label, `style="max-width:${W + 40}px"`);
}

/* ===================== Topic 18 ===================== */
const t18 = {
  id: 't18',
  title: 'Matching Quantities',
  intro: 'Two shopping trips, two receipts, but no price list! Line the purchases up, match what is the same, and the difference tells you the price of one item.',
  skills: ['Comparing', 'Money', 'Bar models'],
  art: () => svg('0 0 360 220', panel(360, 220, `
    <rect x="0" y="0" width="360" height="44" fill="${TEAL}"/>
    ${tx(180, 30, 'SCHOOL BOOKSHOP', { size: 20, fill: '#fff', b: true })}
    <rect x="18" y="58" width="250" height="52" rx="10" fill="#fff" ${S}/>
    ${[0, 1].map(j => icon('pen', 42 + j * 32, 84, 1.05)).join('')}${icon('book', 120, 84, 1.05)}
    <rect x="18" y="122" width="250" height="52" rx="10" fill="#fff" ${S}/>
    ${[0, 1].map(j => icon('pen', 42 + j * 32, 148, 1.05)).join('')}${icon('book', 120, 148, 1.05)}
    <rect x="144" y="127" width="114" height="42" rx="9" fill="#ffe1dd" stroke="${CORAL}" stroke-width="2.2" stroke-dasharray="5 4"/>
    ${[0, 1, 2].map(j => icon('pen', 164 + j * 36, 148, 1.05)).join('')}
    <g transform="translate(286 66)"><path d="M0 0 h60 v30 h-60 l-10 -15z" fill="${SUN}" ${S}/><circle cx="2" cy="15" r="3" fill="#fff" ${S} stroke-width="1.6"/>${tx(32, 21, '$4.60', { size: 15 })}</g>
    <g transform="translate(286 130)"><path d="M0 0 h60 v30 h-60 l-10 -15z" fill="${SUN}" ${S}/><circle cx="2" cy="15" r="3" fill="#fff" ${S} stroke-width="1.6"/>${tx(32, 21, '$8.20', { size: 15 })}</g>
    ${tx(180, 204, '3 more pens cost $3.60 more!', { size: 17, fill: '#d6453a', b: true })}`, '#fff8e6'), 'Two sets of pens and notebooks: 3 extra pens cost 3 dollars 60 cents more'),
  explore: {
    setup: 'It rained during recess and the price list at the canteen snack stall got smudged! Four friends still have their receipts. Can they work out the price of <b>one curry puff</b> and <b>one packet of soya milk</b>?',
    art: () => svg('0 0 340 300', panel(340, 300, `
      <rect x="0" y="0" width="340" height="40" fill="${CORAL}"/>
      ${tx(170, 28, 'SNACKS &amp; DRINKS', { size: 19, fill: '#fff', b: true })}
      <rect x="66" y="50" width="208" height="70" rx="10" fill="#fff" ${S}/>
      ${icon('puff', 92, 72, 1)}${tx(112, 78, 'Curry puff', { anchor: 'start', size: 14 })}${tx(250, 78, '$?.??', { anchor: 'end', size: 15, fill: '#9aa6bd' })}
      ${icon('soya', 92, 102, .9)}${tx(112, 108, 'Soya milk', { anchor: 'start', size: 14 })}${tx(250, 108, '$?.??', { anchor: 'end', size: 15, fill: '#9aa6bd' })}
      <ellipse cx="226" cy="74" rx="34" ry="12" fill="#8fc8ff" opacity=".55"/><ellipse cx="232" cy="104" rx="30" ry="11" fill="#8fc8ff" opacity=".55"/>
      ${kid('aisyah', { x: 82, y: 168, s: .72, pose: 'wave' })}
      <g transform="translate(110 150) rotate(12)"><path d="M0 0 h30 v38 l-5 -4 l-5 4 l-5 -4 l-5 4 l-5 -4 l-5 4z" fill="#fff" ${S} stroke-width="2.2"/><path d="M6 9 h18 M6 17 h18 M6 25 h12" stroke="#9aa6bd" stroke-width="2.2" stroke-linecap="round"/></g>
      ${kid('weiming', { x: 250, y: 168, s: .72, pose: 'think', mood: 'think' })}
      <rect x="0" y="262" width="340" height="38" fill="#e9d8b8"/>
      ${A.table(150, 238, 160).replace(/height="60"/g, 'height="40"')}
      ${icon('puff', 180, 228, .9)}${icon('puff', 212, 228, .9)}${icon('soya', 250, 226, .85)}${icon('soya', 276, 226, .85)}`, '#fff4ec'), 'A canteen stall with a smudged price list; Aisyah holds a receipt and Wei Ming is thinking'),
    steps: [
      { who: 'aisyah', text: 'My receipt says <b>2 curry puffs and 1 soya milk: $3.70</b>. Arjun\'s says <b>2 curry puffs and 3 soya milk: $5.50</b>. Let\'s line them up, one under the other.',
        art: () => orderRows([
          { who: 'Aisyah', items: [['puff', 2], ['soya', 1]], price: '= $3.70', boxes: [[0, 3, 'same']] },
          { who: 'Arjun', items: [['puff', 2], ['soya', 3]], price: '= $5.50', boxes: [[0, 3, 'same'], [3, 5, 'extra']] },
        ], { note: '2 more soya milk ↔ $1.80 more', label: 'Aisyah: 2 curry puffs and 1 soya milk cost 3.70. Arjun: 2 curry puffs and 3 soya milk cost 5.50' }) },
      { who: 'arjun', text: 'The green parts are exactly the same. Arjun only bought <b>2 more soya milk</b>, and paid <b>$1.80 more</b>. So the extra soya milk must cost the extra money!' },
      { who: 'leo', mood: 'teach', text: 'That\'s <b>matching quantities</b>: a difference in <b>quantity</b> matches a difference in <b>money</b>. 2 soya milk cost $1.80, so 1 soya milk costs $1.80 ÷ 2 = <b>$0.90</b>. Then 2 curry puffs cost $3.70 − $0.90 = $2.80, so 1 curry puff costs <b>$1.40</b>.' },
      { who: 'weiming', mood: 'think', text: 'My receipt is trickier: <b>1 curry puff and 2 soya milk: $3.20</b>. Chloe\'s is <b>3 curry puffs and 4 soya milk: $7.80</b>. Nothing matches!',
        art: () => orderRows([
          { who: 'Wei Ming', items: [['puff', 1], ['soya', 2]], price: '= $3.20' },
          { who: 'Chloe', items: [['puff', 3], ['soya', 4]], price: '= $7.80' },
        ], { note: 'Nothing lines up!', noteColor: '#5a43d6', label: 'Wei Ming: 1 curry puff and 2 soya milk cost 3.20. Chloe: 3 curry puffs and 4 soya milk cost 7.80' }) },
      { who: 'chloe', text: 'Then <b>make</b> them match! Imagine Wei Ming buying his order <b>3 times</b>: 3 curry puffs and 6 soya milk. Remember to triple the money too: 3 × $3.20 = $9.60.',
        art: () => orderRows([
          { who: 'Wei Ming\'s order × 3', items: [['puff', 3], ['soya', 6]], price: '= $9.60', boxes: [[0, 7, 'same'], [7, 9, 'extra']] },
          { who: 'Chloe', items: [['puff', 3], ['soya', 4]], price: '= $7.80', boxes: [[0, 7, 'same']] },
        ], { note: '2 more soya milk ↔ $1.80 more', label: 'Wei Ming\'s order times 3 lined up with Chloe\'s order' }) },
      { who: 'leo', mood: 'teach', text: 'Now the curry puffs match. 2 more soya milk cost $1.80 more, so 1 soya milk is <b>$0.90</b>, the same as before! Wei Ming\'s 2 soya milk cost $1.80, so his curry puff cost $3.20 − $1.80 = <b>$1.40</b>.',
        art: () => `<table class="tbl" style="font-size:15px"><thead><tr><th></th><th>Puffs</th><th>Soya</th><th>Cost</th></tr></thead><tbody>
          <tr><th>Wei Ming × 3</th><td>3</td><td>6</td><td>$9.60</td></tr>
          <tr><th>Chloe</th><td>3</td><td>4</td><td>$7.80</td></tr>
          <tr><th>Extra</th><td>0</td><td class="hl">2</td><td class="hl">$1.80</td></tr></tbody></table>` },
      { who: 'weiming', text: 'Let me check Chloe\'s receipt: 3 × $1.40 + 4 × $0.90 = $4.20 + $3.60 = $7.80 ✓. Shiok, the prices work for every receipt!' },
    ],
  },
  keys: [
    { title: 'Line them up', text: 'Write the two purchases one under the other, so the same kind of item sits in the same place. A table or a row of pictures helps.' },
    { title: 'Match the difference', text: 'Cross out what is the same. The <b>extra items</b> cost the <b>extra money</b>. 4 more pencils cost $2.00 more, so 1 pencil costs $2.00 ÷ 4 = $0.50.' },
    { title: 'Make it match', text: 'If nothing matches, multiply a <b>whole</b> purchase so that one item has the same quantity. Multiply the money too!' },
    { title: 'Check every line', text: 'Put your prices back into <b>every</b> purchase. If they all work, you have found the answer.' },
  ],
  practice: [
    { id: 'a', level: 1, type: 'blanks', prompt: `The same shapes stand for the same number. Find the numbers.<br>${tri(CORAL)} + ${tri(CORAL)} + ${tri(CORAL)} + ${dot(SKY)} = 31<br>${tri(CORAL)} + ${dot(SKY)} = 15`,
      template: `${tri(CORAL)} = {0} &nbsp;&nbsp; ${dot(SKY)} = {1}`, blanks: [{ answer: 8, size: 'sm' }, { answer: 7, size: 'sm' }],
      hint: `Both lines have one ${dot(SKY)}. How many more ${tri(CORAL)} does the first line have? How much bigger is its total?`,
      solution: [`Both lines have one ${dot(SKY)}. The first line has 2 more ${tri(CORAL)}.`, 'Its total is 31 − 15 = 16 more.', `So 2 ${tri(CORAL)} = 16, and ${tri(CORAL)} = 16 ÷ 2 = <b>8</b>.`, `${dot(SKY)} = 15 − 8 = <b>7</b>.`, 'Check: 8 + 8 + 8 + 7 = 31 ✓'] },
    { id: 'b', level: 1, type: 'blanks', prompt: 'At the school bookshop, Mei Ling pays <b>$6.10</b> for 3 pens and 1 file. Ravi pays <b>$8.70</b> for 5 pens and 1 file of the same kinds. Find the cost of 1 pen and 1 file.',
      art: orderRows([
        { who: 'Mei Ling', items: [['pen', 3], ['file', 1]], price: '= $6.10' },
        { who: 'Ravi', items: [['pen', 5], ['file', 1]], price: '= $8.70' },
      ], { label: 'Mei Ling: 3 pens and 1 file for 6.10. Ravi: 5 pens and 1 file for 8.70' }),
      template: '1 pen: ${0} &nbsp;&nbsp; 1 file: ${1}', blanks: [{ answer: 1.3 }, { answer: 2.2 }],
      hint: 'Both bought 1 file. What is different about Ravi\'s purchase, and how much more did he pay?',
      solution: ['Both bought 1 file. Ravi bought 5 − 3 = 2 more pens.', 'He paid $8.70 − $6.10 = $2.60 more.', 'So 2 pens cost $2.60, and 1 pen costs $2.60 ÷ 2 = <b>$1.30</b>.', 'Mei Ling\'s 3 pens cost 3 × $1.30 = $3.90, so 1 file costs $6.10 − $3.90 = <b>$2.20</b>.', 'Check Ravi: 5 × $1.30 + $2.20 = $6.50 + $2.20 = $8.70 ✓'] },
    { id: 'c', level: 1, type: 'blanks', prompt: 'At a Hari Raya bazaar, Siti and Nurul buy the same kind of kueh lapis. Siti buys <b>4 more pieces</b> than Nurul and pays <b>$3.40 more</b>. Nurul buys 7 pieces. How much does 1 piece cost? How much does Nurul pay?',
      art: svg('0 0 340 124', panel(340, 124, `
        ${tx(64, 34, 'Nurul', { anchor: 'end', size: 15 })}
        ${[...Array(7)].map((_, i) => `<rect x="${72 + i * 22}" y="14" width="22" height="30" fill="#ffd0dc" ${S} stroke-width="2.2"/>`).join('')}
        ${tx(240, 35, '$?', { anchor: 'start', size: 16, b: true })}
        ${tx(64, 82, 'Siti', { anchor: 'end', size: 15 })}
        ${[...Array(11)].map((_, i) => `<rect x="${72 + i * 22}" y="62" width="22" height="30" fill="${i < 7 ? '#ffd0dc' : '#ffb3ab'}" ${S} stroke-width="2.2"/>`).join('')}
        ${bracket(226, 314, 100, '4 more: $3.40', { color: '#d6453a', size: 14 })}`, '#fffaf0'), 'Bar model: Nurul 7 units; Siti 11 units, the extra 4 units cost 3.40', 'style="max-width:380px"'),
      template: '1 piece: ${0} &nbsp;&nbsp; Nurul pays: ${1}', blanks: [{ answer: 0.85 }, { answer: 5.95 }],
      hint: 'Look at the bar model. The extra 4 pieces match the extra $3.40.',
      solution: ['The extra 4 pieces cost the extra $3.40.', '1 piece costs $3.40 ÷ 4 = <b>$0.85</b>.', 'Nurul pays 7 × $0.85 = <b>$5.95</b>.'] },
    { id: 'd', level: 2, type: 'blanks', prompt: 'Mr Kumar packs storybooks for the school library. A carton with <b>8</b> identical storybooks in it weighs <b>3.9 kg</b>. The same carton with only <b>5</b> of the storybooks weighs <b>2.7 kg</b>. Find the mass of 1 storybook and the mass of the empty carton.',
      template: '1 storybook: {0} kg &nbsp;&nbsp; Empty carton: {1} kg', blanks: [{ answer: 0.4 }, { answer: 0.7 }],
      hint: 'The carton is the same both times. How many storybooks were taken out, and how much lighter did it get?',
      solution: ['The carton is the same, so the difference is 8 − 5 = 3 storybooks.', '3 storybooks weigh 3.9 − 2.7 = 1.2 kg.', '1 storybook weighs 1.2 ÷ 3 = <b>0.4 kg</b>.', '8 storybooks weigh 8 × 0.4 = 3.2 kg, so the empty carton weighs 3.9 − 3.2 = <b>0.7 kg</b>.', 'Check: 0.7 + 5 × 0.4 = 0.7 + 2 = 2.7 kg ✓'] },
    { id: 'e', level: 2, type: 'blanks', prompt: 'At the hawker centre, Mr Rahman pays <b>$7.70</b> for 1 plate of chicken rice and 2 cups of lime juice. Mrs Pillai pays <b>$15.10</b> for 3 plates of chicken rice and 1 cup of lime juice. Find the price of 1 plate of chicken rice and 1 cup of lime juice.',
      art: orderRows([
        { who: 'Mr Rahman', items: [['rice', 1], ['lime', 2]], price: '= $7.70' },
        { who: 'Mrs Pillai', items: [['rice', 3], ['lime', 1]], price: '= $15.10' },
      ], { label: 'Mr Rahman: 1 chicken rice and 2 lime juice for 7.70. Mrs Pillai: 3 chicken rice and 1 lime juice for 15.10' }),
      template: 'Chicken rice: ${0} &nbsp;&nbsp; Lime juice: ${1}', blanks: [{ answer: 4.5 }, { answer: 1.6 }],
      hint: 'Nothing matches yet. What if Mr Rahman bought his whole order 3 times? Remember to multiply the money too.',
      solution: ['Make the chicken rice match: Mr Rahman\'s order × 3 is 3 chicken rice and 6 lime juice, costing 3 × $7.70 = $23.10.', 'Compare with Mrs Pillai: the same 3 chicken rice, but 6 − 1 = 5 more lime juice, and $23.10 − $15.10 = $8.00 more.', '5 lime juice cost $8.00, so 1 lime juice costs $8.00 ÷ 5 = <b>$1.60</b>.', 'Mr Rahman\'s 2 lime juice cost $3.20, so 1 chicken rice costs $7.70 − $3.20 = <b>$4.50</b>.', 'Check Mrs Pillai: 3 × $4.50 + $1.60 = $13.50 + $1.60 = $15.10 ✓'] },
    { id: 'f', level: 2, type: 'blanks', prompt: 'At the gift shop at the Singapore Zoo:<br>• a cap and a keychain cost <b>$15</b> together,<br>• a keychain and a mug cost <b>$17</b> together,<br>• a cap and a mug cost <b>$22</b> together.<br>Find the price of each item.',
      template: 'Cap: ${0} &nbsp;&nbsp; Keychain: ${1} &nbsp;&nbsp; Mug: ${2}', blanks: [{ answer: 10 }, { answer: 5 }, { answer: 12 }],
      hint: 'Add all three totals. How many caps, keychains and mugs is that?',
      solution: ['Add all three: 2 caps + 2 keychains + 2 mugs = $15 + $17 + $22 = $54.', 'So 1 cap + 1 keychain + 1 mug = $54 ÷ 2 = $27.', 'Cap: $27 − (keychain + mug) = $27 − $17 = <b>$10</b>.', 'Keychain: $27 − (cap + mug) = $27 − $22 = <b>$5</b>.', 'Mug: $27 − (cap + keychain) = $27 − $15 = <b>$12</b>.'] },
    { id: 'g', level: 3, type: 'blanks', prompt: 'At a kopitiam, 2 bowls of laksa and 3 cups of teh cost <b>$15.10</b>. 3 bowls of laksa and 2 cups of teh cost <b>$18.40</b>. Find the price of 1 bowl of laksa and 1 cup of teh.',
      template: 'Laksa: ${0} &nbsp;&nbsp; Teh: ${1}', blanks: [{ answer: 5 }, { answer: 1.7 }],
      hint: 'Put both orders together. How many bowls of laksa and cups of teh is that? What does 1 laksa + 1 teh cost?',
      solution: ['Both orders together: 5 laksa + 5 teh = $15.10 + $18.40 = $33.50.', 'So 1 laksa + 1 teh = $33.50 ÷ 5 = $6.70.', 'The second order is 2 sets of (laksa + teh) plus 1 more laksa.', '2 sets cost 2 × $6.70 = $13.40, so 1 laksa = $18.40 − $13.40 = <b>$5.00</b>.', '1 teh = $6.70 − $5.00 = <b>$1.70</b>.', 'Check the first order: 2 × $5.00 + 3 × $1.70 = $10.00 + $5.10 = $15.10 ✓'] },
    { id: 'h', level: 3, type: 'blanks', prompt: 'Priya has 5 glitter stickers. Jun Jie has 8 animal stickers. Altogether their stickers are worth <b>$6.30</b>. If Priya gives Jun Jie 1 glitter sticker and he gives her 1 animal sticker, their stickers will be worth the <b>same</b> amount. How much is 1 glitter sticker worth? How much is 1 animal sticker worth?',
      template: 'Glitter sticker: ${0} &nbsp;&nbsp; Animal sticker: ${1}', blanks: [{ answer: 0.7 }, { answer: 0.35 }],
      hint: 'After the swap, Priya has 4 glitter + 1 animal, and Jun Jie has 7 animal + 1 glitter. These are worth the same. Take away what matches on both sides.',
      solution: ['After the swap: Priya has 4 glitter + 1 animal. Jun Jie has 1 glitter + 7 animal. Both are worth the same.', 'Take away 1 glitter and 1 animal from both: 3 glitter are worth the same as 6 animal.', 'So 1 glitter sticker is worth the same as 2 animal stickers.', 'At the start: 5 glitter + 8 animal = 10 animal + 8 animal = 18 animal stickers\' worth = $6.30.', '1 animal sticker = $6.30 ÷ 18 = <b>$0.35</b>. 1 glitter sticker = 2 × $0.35 = <b>$0.70</b>.', 'Check: after the swap each has $3.15 (4 × $0.70 + $0.35 = $3.15 and 7 × $0.35 + $0.70 = $3.15) ✓'] },
  ],
  adult: 'Links to school work: P4 whole numbers and decimals (money and mass), and the comparison bar model. Finding a unit price from "same items, plus a few extra" is <b>within</b> P4 problem solving. Multiplying a whole purchase to make the quantities match, adding several purchases, and the sticker-swap question are really simultaneous equations in disguise, so those questions (questions 5 to 8) are <b>enrichment</b> (upper primary and olympiad style). Common mistakes: multiplying the items but forgetting to multiply the money; dividing the money difference by the total number of items instead of the <i>extra</i> items; stopping after one price without checking the other purchase. Tip: get your child to draw the items as little pictures in two rows and circle what is the same.',
};

/* ===================== Topic 19 ===================== */
function can(x, y, w = 24, h = 28, c = CORAL) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="#dfe4ee" ${S} stroke-width="2"/><rect x="${x + 1.5}" y="${y + h * .3}" width="${w - 3}" height="${h * .42}" fill="${c}"/><ellipse cx="${x + w / 2}" cy="${y + 2}" rx="${w / 2 - 1.5}" ry="2.5" fill="#fff" stroke="${INK}" stroke-width="1.5"/>`;
}
// Row 1 → Row 2 → Row 3 → … → Row n with jumps of +d
function jumpLine({ first, d, n, word = 'Row', W = 336, H = 156 }) {
  const xs = [36, 108, 180, 300], bw = 52, y = 58;
  const vals = [first, first + d, first + 2 * d, '?'];
  const labs = [`${word} 1`, `${word} 2`, `${word} 3`, `${word} ${n}`];
  let g = '';
  xs.forEach((x, i) => {
    g += `<rect x="${x - bw / 2}" y="${y}" width="${bw}" height="36" rx="9" fill="${i === 3 ? '#fff3c4' : '#d9f3ef'}" ${S} stroke-width="2.4"/>` +
      tx(x, y + 26, vals[i], { size: 19, b: true, fill: i === 3 ? '#c77d00' : INK }) + tx(x, y + 56, labs[i], { size: 15 });
  });
  for (let i = 0; i < 2; i++) {
    const a = xs[i] + 8, b = xs[i + 1] - 8;
    g += `<path d="M${a} ${y - 4} Q${(a + b) / 2} ${y - 34} ${b} ${y - 4}" fill="none" stroke="${CORAL}" stroke-width="2.6"/><path d="M${b - 7} ${y - 11} L${b} ${y - 4} L${b - 9} ${y - 2}" fill="none" stroke="${CORAL}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>` +
      tx((a + b) / 2, y - 24, `+${d}`, { size: 15, fill: '#d6453a' });
  }
  g += `<path d="M196 ${y - 4} Q240 ${y - 34} 284 ${y - 4}" fill="none" stroke="${CORAL}" stroke-width="2.6" stroke-dasharray="5 5"/>` + tx(240, y - 24, `+${d} …`, { size: 15, fill: '#d6453a' }) + tx(240, y + 24, '…', { size: 22, b: true });
  g += bracket(xs[0], xs[3], 130, `${n - 1} jumps of ${d}`, { color: GRAPE, size: 17 });
  return svg(`0 0 ${W} ${H}`, panel(W, H, g, '#f6fbff'), `${word} 1 has ${first}; each ${word.toLowerCase()} adds ${d}; ${word} ${n} is ${n - 1} jumps after ${word} 1`, `style="max-width:${W + 40}px"`);
}
// staircase of n rows plus a turned-round copy, making a rectangle
function pairRect({ first, d, n, u = 5, W = 336 }) {
  const last = first + (n - 1) * d, rh = 9, x0 = 14, y0 = 34;
  let g = tx(x0, 21, 'hall', { anchor: 'start', size: 15, fill: '#0f7a73' }) + `<rect x="${x0 + 36}" y="10" width="14" height="12" fill="#9fe3dc" ${S} stroke-width="1.6"/>` +
    tx(x0 + 66, 21, 'copy turned round', { anchor: 'start', size: 15, fill: '#d6453a' }) + `<rect x="${x0 + 208}" y="10" width="14" height="12" fill="#ffc2bb" ${S} stroke-width="1.6"/>`;
  for (let i = 0; i < n; i++) {
    const a = first + i * d, y = y0 + i * rh;
    g += `<rect x="${x0}" y="${y}" width="${a * u}" height="${rh}" fill="#9fe3dc" stroke="${INK}" stroke-width="1.2"/><rect x="${x0 + a * u}" y="${y}" width="${(first + last - a) * u}" height="${rh}" fill="#ffc2bb" stroke="${INK}" stroke-width="1.2"/>`;
  }
  const R = x0 + (first + last) * u;
  g += `<rect x="${x0}" y="${y0}" width="${(first + last) * u}" height="${n * rh}" fill="none" ${S} stroke-width="2.6"/>`;
  g += tx(R + 5, y0 + 10, `${first}+${last}`, { anchor: 'start', size: 15 }) + tx(R + 5, y0 + n * rh, `${last}+${first}`, { anchor: 'start', size: 15 });
  g += bracket(x0, R, y0 + n * rh + 10, `${first} + ${last} = ${first + last} in every row`, { color: GRAPE, size: 17 });
  const H = y0 + n * rh + 44;
  return svg(`0 0 ${W} ${H}`, panel(W, H, g, '#fffdf6'), `Each row as a bar, plus a copy turned round: every row makes ${first + last}, ${n} rows`, `style="max-width:${W + 40}px"`);
}
// weekly savings bars: weeks 1..k then … then week n with '?'
function saveBars({ first, d, k = 4, n = 12, unit = 3.2, W = 340, H = 200 }) {
  const base = 168, bw = 40, gap = 20, x0 = 20;
  let g = `<path d="M10 ${base} H${W - 10}" ${S}/>`;
  for (let i = 0; i < k; i++) {
    const v = first + i * d, h = v * unit, x = x0 + i * (bw + gap);
    g += `<rect x="${x}" y="${base - h}" width="${bw}" height="${h}" rx="4" fill="${i % 2 ? '#9fe3dc' : '#c9f0eb'}" ${S} stroke-width="2.2"/>` + tx(x + bw / 2, base - h - 8, `$${v}`, { size: 15, b: true }) + tx(x + bw / 2, base + 20, `Wk ${i + 1}`, { size: 13 });
    if (i) g += tx(x - gap / 2, base - h - 30, `+${d}`, { size: 14, fill: '#d6453a', b: true });
  }
  const xd = x0 + k * (bw + gap);
  g += tx(xd + 10, base - 30, '…', { size: 24, b: true });
  const xl = xd + 44, last = first + (n - 1) * d, hl = last * unit;
  g += `<rect x="${xl}" y="${base - hl}" width="${bw}" height="${hl}" rx="4" fill="#fff3c4" stroke="${INK}" stroke-width="2.2" stroke-dasharray="6 4"/>` + tx(xl + bw / 2, base - hl / 2 + 8, '?', { size: 24, b: true, fill: '#c77d00' }) + tx(xl + bw / 2, base + 20, `Wk ${n}`, { size: 13 });
  return svg(`0 0 ${W} ${H}`, panel(W, H, g, '#f6fbff'), `Savings: week 1 ${first} dollars, each week ${d} dollars more; week ${n} unknown`, `style="max-width:${W + 40}px"`);
}
// stack of cans: rows listed top to bottom; null = gap row
function canStack(rows, { W = 340, cw = 18, ch = 20 } = {}) {
  let g = '', y = 14;
  rows.forEach(r => {
    if (r === null) { g += tx(W / 2, y + 16, '⋮', { size: 24, b: true }); y += 30; return; }
    const x0 = W / 2 - r * cw / 2;
    for (let i = 0; i < r; i++) g += can(x0 + i * cw, y, cw, ch, i % 2 ? CORAL : SUN);
    y += ch + 2;
  });
  g += `<rect x="10" y="${y}" width="${W - 20}" height="8" rx="3" fill="#c98b55" ${S} stroke-width="2"/>`;
  return { g, y };
}
function ringsArt() {
  const cx = 112, cy = 118, W = 360, H = 236;
  let g = '';
  const rs = [[100, false], [80, true], [60, true], [38, false]];
  rs.forEach(([r, dash]) => {
    g += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${dash ? '#9aa6bd' : TEAL}" stroke-width="${dash ? 2.4 : 3.2}" ${dash ? 'stroke-dasharray="6 6"' : ''}/>`;
    const k = Math.round(r / 6.5);
    if (!dash) for (let i = 0; i < k; i++) { const a = i * 2 * Math.PI / k; g += `<circle cx="${r1(cx + r * Math.cos(a))}" cy="${r1(cy + r * Math.sin(a))}" r="4.5" fill="${r < 50 ? SUN : CORAL}" stroke="${INK}" stroke-width="1.6"/>`; }
  });
  g += `<path d="M${cx} ${cy + 12} V${cy - 26}" stroke="${INK}" stroke-width="3"/><path d="M${cx} ${cy - 26} h22 v14 h-22z" fill="#e1484b" ${S} stroke-width="2"/><path d="M${cx} ${cy - 19} h22" stroke="#fff" stroke-width="3"/>`;
  g += `<path d="M${cx + 30} ${cy + 24} L236 ${cy + 60}" stroke="${INK}" stroke-width="1.6"/>` + tx(240, cy + 58, 'inner ring:', { anchor: 'start', size: 14 }) + tx(240, cy + 76, '20 pupils', { anchor: 'start', size: 15, b: true, fill: '#c77d00' });
  g += `<path d="M${cx + 86} ${cy - 50} L236 ${cy - 62}" stroke="${INK}" stroke-width="1.6"/>` + tx(240, cy - 70, 'outer ring:', { anchor: 'start', size: 14 }) + tx(240, cy - 52, '56 pupils', { anchor: 'start', size: 15, b: true, fill: '#d6453a' });
  g += tx(240, cy + 6, 'rings in', { anchor: 'start', size: 14, fill: '#5d6b88' }) + tx(240, cy + 24, 'between: ?', { anchor: 'start', size: 14, fill: '#5d6b88' });
  return svg(`0 0 ${W} ${H}`, panel(W, H, g, '#f2fbf4'), 'Rings of pupils around a flagpole: inner ring 20, outer ring 56, rings in between unknown', 'style="max-width:400px"');
}
const t19 = {
  id: 't19',
  title: 'Number Patterns with a Common Difference',
  intro: 'Seats in a hall, cans in a stack, money saved each week: when the same amount is added every time, a few clever rules tell you any number in the pattern, and even the total, without listing them all!',
  skills: ['Number patterns', 'Counting jumps', 'Adding in pairs'],
  art: () => {
    const st = canStack([3, 4, 5, 6, 7], { W: 230, cw: 26, ch: 28 });
    return svg('0 0 360 220', panel(360, 220, `
      <rect x="0" y="0" width="360" height="12" fill="${LEAF}"/>
      <g transform="translate(6 20)">${st.g}</g>
      ${[3, 4, 5, 6, 7].map((v, i) => tx(262, 56 + i * 30, `${v}`, { size: 20, b: true, fill: i % 2 ? '#d6453a' : '#0f7a73' })).join('')}
      ${[0, 1, 2, 3].map(i => tx(300, 72 + i * 30, '+1', { size: 14, fill: GRAPE })).join('')}
      ${tx(282, 28, 'cans', { size: 15 })}
      ${tx(130, 212, 'Each row has 1 more can', { size: 16, b: true, fill: '#0f7a73' })}`, '#fff8ec'), 'A pyramid of cans with 3, 4, 5, 6 and 7 cans in its rows');
  },
  explore: {
    setup: 'The school hall is being set up for the Children\'s Day concert. Row 1 has <b>12</b> seats, and each row has <b>2 more</b> seats than the row in front of it. There are <b>15</b> rows.',
    art: () => {
      let chairs = '';
      for (let r = 0; r < 5; r++) {
        const n = 6 + r, y = 92 + r * 30, w = 20, x0 = 170 - n * w / 2;
        for (let i = 0; i < n; i++) chairs += `<rect x="${x0 + i * w + 2}" y="${y}" width="${w - 4}" height="16" rx="4" fill="${r % 2 ? '#7b9cff' : '#9fb4ff'}" ${S} stroke-width="2"/><rect x="${x0 + i * w + 2}" y="${y + 13}" width="${w - 4}" height="5" rx="2" fill="#5a6fd6"/>`;
      }
      return svg('0 0 340 300', panel(340, 300, `
        <rect x="0" y="0" width="340" height="300" fill="#fdf2e2"/>
        <rect x="40" y="10" width="260" height="58" fill="#ffe7b0" ${S}/>
        <path d="M40 10 h50 q-8 30 0 58 h-50z M300 10 h-50 q8 30 0 58 h50z" fill="#e0282e" ${S}/>
        ${tx(170, 46, 'Children\'s Day', { size: 17, b: true, fill: '#c0392b' })}
        <rect x="30" y="66" width="280" height="10" fill="#c98b55" ${S} stroke-width="2"/>
        ${chairs}
        ${tx(104, 106, 'Row 1', { anchor: 'end', size: 13, fill: '#5d6b88' })}
        ${kid('chloe', { x: 34, y: 222, s: .58, pose: 'wave' })}${kid('arjun', { x: 306, y: 222, s: .58, pose: 'think', mood: 'think' })}`, '#fdf2e2'), 'A school hall with rows of seats; each row has more seats than the one in front');
    },
    steps: [
      { who: 'chloe', text: 'Row 1 has 12 seats, Row 2 has 14, Row 3 has 16, Row 4 has 18… The same number, 2, is added every time. We call 2 the <b>common difference</b>.' },
      { who: 'arjun', mood: 'think', text: 'How many seats are in <b>Row 15</b>? Do I have to list all 15 rows?' },
      { who: 'leo', mood: 'teach', text: 'No need! Count the <b>jumps</b>. From Row 1 to Row 15 there are only <b>14 jumps</b>, because there is always one jump fewer than rows. Row 15 = 12 + 14 × 2 = <b>40</b> seats.',
        art: () => jumpLine({ first: 12, d: 2, n: 15 }) },
      { who: 'aisyah', text: 'How many seats are there <b>altogether</b>? Here\'s a trick: draw each row as a bar, then add a copy of the hall turned round. Row 1 + Row 15 = 12 + 40 = 52, Row 2 + Row 14 = 14 + 38 = 52… every row makes <b>52</b>!',
        art: () => pairRect({ first: 12, d: 2, n: 15 }) },
      { who: 'leo', mood: 'teach', text: 'Together they make a rectangle: 15 rows of 52 = 780 seats. That is <b>two halls\' worth</b>, so the hall has 780 ÷ 2 = <b>390</b> seats.<br><b>Sum = (first + last) × number of rows ÷ 2</b>' },
      { who: 'weiming', text: 'It works the other way too. If the last row had <b>50</b> seats, that is 50 − 12 = 38 more than Row 1, which is 38 ÷ 2 = 19 jumps. So there would be 19 + 1 = <b>20</b> rows.',
        art: () => `<table class="tbl"><thead><tr><th>To find…</th><th>Do this</th></tr></thead><tbody>
          <tr><td>the <i>n</i>th number</td><td>first + (<i>n</i> − 1) × difference</td></tr>
          <tr><td>how many numbers</td><td>(last − first) ÷ difference + 1</td></tr>
          <tr><td>the total</td><td>(first + last) × how many ÷ 2</td></tr></tbody></table>` },
    ],
  },
  keys: [
    { title: 'Common difference', text: 'The same amount is added (or taken away) each time. In 5, 8, 11, 14, … the common difference is 3.' },
    { title: 'Any number in the pattern', text: '<i>n</i>th number = first + (<i>n</i> − 1) × difference. There is always <b>one jump fewer</b> than numbers.' },
    { title: 'How many numbers?', text: 'Count the jumps, then add 1: (last − first) ÷ difference + 1.' },
    { title: 'Add them all', text: 'Pair the first with the last: total = (first + last) × how many ÷ 2.' },
  ],
  practice: [
    { id: 'a', level: 1, type: 'mcq', prompt: 'Which of these number patterns have a <b>common difference</b>?',
      options: ['5, 9, 13, 17, 21', '2, 4, 8, 16, 32', '30, 26, 22, 18, 14', '1, 3, 6, 10, 15'], answer: [0, 2],
      hint: 'Work out the difference between each number and the next. Is it the same every time?',
      solution: ['5, 9, 13, 17, 21: add 4 every time ✓', '2, 4, 8, 16, 32: the gaps are 2, 4, 8, 16. They change (each number doubles) ✗', '30, 26, 22, 18, 14: take away 4 every time ✓ (a pattern can go down too)', '1, 3, 6, 10, 15: the gaps are 2, 3, 4, 5. They grow ✗'] },
    { id: 'b', level: 1, type: 'blanks', prompt: 'Look at this number pattern: <b>7, 11, 15, 19, …</b><br>What is the common difference? What is the <b>20th</b> number?',
      template: 'Common difference = {0} &nbsp;&nbsp; 20th number = {1}', blanks: [{ answer: 4, size: 'sm' }, { answer: 83 }],
      hint: 'From the 1st number to the 20th number, how many jumps are there?',
      solution: ['Each number is 4 more than the one before, so the common difference is <b>4</b>.', 'From the 1st to the 20th number there are 20 − 1 = 19 jumps.', '20th number = 7 + 19 × 4 = 7 + 76 = <b>83</b>.'] },
    { id: 'c', level: 1, type: 'blanks', prompt: 'Priya saves <b>$5</b> in the first week. Each week after that, she saves <b>$3 more</b> than the week before. How much does she save in week 12?',
      art: saveBars({ first: 5, d: 3 }),
      template: '${0}', blanks: [{ answer: 38 }],
      hint: 'From week 1 to week 12, how many times does she add $3?',
      solution: ['From week 1 to week 12 there are 12 − 1 = 11 jumps of $3.', 'Week 12: $5 + 11 × $3 = $5 + $33 = <b>$38</b>.'] },
    { id: 'd', level: 2, type: 'blanks', prompt: 'Along a park connector, the first water point is <b>1.8 km</b> from the start. After that, there is a water point every <b>1.2 km</b>. How far from the start is the <b>9th</b> water point?',
      template: '{0} km', blanks: [{ answer: 11.4 }],
      hint: 'The 1st water point is at 1.8 km. How many 1.2 km gaps are there between the 1st and the 9th water point?',
      solution: ['Between the 1st and the 9th water point there are 9 − 1 = 8 gaps.', '8 × 1.2 km = 9.6 km', '9th water point: 1.8 + 9.6 = <b>11.4 km</b> from the start.'] },
    { id: 'e', level: 2, type: 'blanks', prompt: 'In an HDB multi-storey car park, Uncle Tan paints a green marker on lots number <b>4, 10, 16, 22, …, 154</b> (every 6th lot). How many markers does he paint? Lot 100 has a marker. Which marker is it (1st, 2nd, 3rd, …)?',
      template: '{0} markers &nbsp;&nbsp; Lot 100 has marker number {1}', blanks: [{ answer: 26 }, { answer: 17 }],
      hint: 'How many jumps of 6 take you from 4 to 154? Remember: there is one more number than jumps.',
      solution: ['The common difference is 6.', 'From 4 to 154: (154 − 4) ÷ 6 = 150 ÷ 6 = 25 jumps, so there are 25 + 1 = <b>26</b> markers.', 'From 4 to 100: (100 − 4) ÷ 6 = 96 ÷ 6 = 16 jumps, so lot 100 has marker number 16 + 1 = <b>17</b>.'] },
    { id: 'f', level: 2, type: 'blanks', prompt: 'Find the total: <b>1 + 3 + 5 + 7 + … + 59</b> (all the odd numbers from 1 to 59).',
      template: '{0} numbers are added. &nbsp; Total = {1}', blanks: [{ answer: 30 }, { answer: 900 }],
      hint: 'First count the numbers: (last − first) ÷ 2 + 1. Then pair the first with the last.',
      solution: ['How many numbers: (59 − 1) ÷ 2 + 1 = 29 + 1 = <b>30</b>.', 'First + last = 1 + 59 = 60, and every pair adds up to 60.', 'Total = 60 × 30 ÷ 2 = <b>900</b>.'] },
    { id: 'g', level: 3, type: 'blanks', prompt: 'At a supermarket, cans of condensed milk are stacked in rows. The top row has <b>4</b> cans. Each row has 1 more can than the row above it. The bottom row has <b>15</b> cans. How many rows are there? How many cans are there altogether?',
      art: (() => { const st = canStack([4, 5, 6, null, 15]); return svg(`0 0 340 ${st.y + 30}`, panel(340, st.y + 30, st.g + tx(250, 32, '← 4 cans', { anchor: 'start', size: 14 }) + tx(260, 54, '← 5 cans', { anchor: 'start', size: 14 }) + tx(268, 76, '← 6 cans', { anchor: 'start', size: 14 }) + tx(170, st.y + 25, 'bottom row: 15 cans', { size: 14 }), '#fff8ec'), 'A stack of cans: rows of 4, 5, 6 cans and so on down to 15 cans', 'style="max-width:380px"'); })(),
      template: '{0} rows &nbsp;&nbsp; {1} cans', blanks: [{ answer: 12 }, { answer: 114 }],
      hint: 'Rows: (15 − 4) ÷ 1 + 1. Then add the rows in pairs: top row + bottom row.',
      solution: ['Number of rows: (15 − 4) ÷ 1 + 1 = 11 + 1 = <b>12</b>.', 'Top + bottom = 4 + 15 = 19. The 2nd row + the 2nd-last row = 5 + 14 = 19, and so on.', 'Total = 19 × 12 ÷ 2 = <b>114</b> cans.'] },
    { id: 'h', level: 3, type: 'blanks', prompt: 'On National Day, <b>380</b> pupils stand in rings around the flagpole, one ring inside another. The inner ring has <b>20</b> pupils and the outer ring has <b>56</b> pupils. Each ring has the same number of pupils more than the ring inside it. How many rings are there? How many more pupils does each ring have than the ring inside it?',
      art: ringsArt(),
      template: '{0} rings &nbsp;&nbsp; {1} more pupils in each ring', blanks: [{ answer: 10 }, { answer: 4 }],
      hint: 'Use total = (first + last) × number of rings ÷ 2. What is first + last here?',
      solution: ['Inner + outer = 20 + 56 = 76.', 'Total = 76 × number of rings ÷ 2 = 380, so 76 × number of rings = 760.', 'Number of rings = 760 ÷ 76 = <b>10</b>.', 'From the inner ring to the outer ring there are 10 − 1 = 9 jumps, and 56 − 20 = 36 pupils are added.', 'Each ring has 36 ÷ 9 = <b>4</b> more pupils than the ring inside it.'] },
    { id: 'i', level: 3, type: 'blanks', prompt: 'Jun Jie saves money for 9 weeks. In week 1 he saves <b>$6</b>. Each week he saves the same amount more than the week before. He saves <b>$198</b> altogether. How much more does he save each week? How much does he save in week 9?',
      template: '${0} more each week &nbsp;&nbsp; Week 9: ${1}', blanks: [{ answer: 4 }, { answer: 38 }],
      hint: 'Total = (week 1 + week 9) × 9 ÷ 2. Use the total to find week 1 + week 9 first.',
      solution: ['(Week 1 + week 9) × 9 ÷ 2 = $198, so (week 1 + week 9) × 9 = $396.', 'Week 1 + week 9 = $396 ÷ 9 = $44, so week 9 = $44 − $6 = <b>$38</b>.', 'From week 1 to week 9 there are 8 jumps: $38 − $6 = $32.', 'Each jump: $32 ÷ 8 = <b>$4</b> more each week.', 'Check: 6 + 10 + 14 + 18 + 22 + 26 + 30 + 34 + 38 = 198 ✓'] },
  ],
  adult: 'Links to school work: spotting and continuing number patterns is part of P4 (and P5) mathematics, so finding the next numbers and the common difference is <b>within</b> the syllabus. Writing a general rule for the <i>n</i>th number, counting how many numbers are in a list, and adding a whole pattern by pairing (the trick told about the young Carl Friedrich Gauss) go beyond it and are <b>enrichment</b> (P5/P6 and olympiad style). Common mistakes: using <i>n</i> × difference instead of (<i>n</i> − 1) × difference (the "fence-post" mistake: there is one gap fewer than posts); forgetting the +1 when counting numbers; forgetting to halve when pairing. Tip: for any new pattern, write out the first few numbers and test the rule on them before trusting it.',
};

/* ===================== Maths Story: Han Xin ===================== */
function soldier(x, y, s = 1, hi = false) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M9 -14 V20" stroke="#8a5a3c" stroke-width="2.4" stroke-linecap="round"/><path d="M9 -20 l-3 7 h6z" fill="#c9cfdc" stroke="${INK}" stroke-width="1.4"/>
    <rect x="-7" y="2" width="14" height="17" rx="4" fill="${hi ? CORAL : '#8fb7a2'}" stroke="${INK}" stroke-width="2"/>
    <circle cx="0" cy="-5" r="7" fill="#f3cfae" stroke="${INK}" stroke-width="2"/>
    <path d="M-7.5 -6 q0 -9 7.5 -9 q7.5 0 7.5 9z" fill="${hi ? '#c0392b' : '#5d6b88'}" stroke="${INK}" stroke-width="1.8"/></g>`;
}
function general(x, y, s = 1) {
  const k = { skin: '#f0c8a0', hair: 'short', hairC: '#2b2321', shirt: '#c0392b', bottom: '#5d6b88' };
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-26 36 q-14 40 -20 74 h92 q-6 -34 -20 -74z" fill="#e0282e" ${S}/></g>` +
    kid(k, { x, y, s, pose: 'wave' }) +
    `<g transform="translate(${x} ${y}) scale(${s})">
      <path d="M-24 36 q24 -10 48 0 l2 38 h-52z" fill="#b8c2d6" ${S}/><path d="M-22 50 h44 M-23 62 h46 M-6 38 v34 M8 38 v34" stroke="#7d8aa6" stroke-width="2"/>
      <path d="M-24 70 h48" stroke="#8a5a3c" stroke-width="6"/>
      <path d="M-35 0 q-2 -42 35 -42 q37 0 35 42 q-8 -14 -35 -16 q-27 2 -35 16z" fill="#c9cfdc" ${S}/>
      <path d="M-35 0 q-6 6 -4 14 M35 0 q6 6 4 14" fill="none" ${S}/>
      <path d="M0 -42 q-8 -22 10 -34 q-2 16 4 32z" fill="#e0282e" ${S} stroke-width="2.4"/>
      <path d="M-12 22 q12 10 24 0" fill="none" stroke="#2b2321" stroke-width="3" stroke-linecap="round"/></g>`;
}
// clue panels: rows of k with r left over (unknown total, so only a few rows are shown)
function lineUps(clues, { W = 340, unitWord = 'rows', label = 'Lining up in rows, with some left over' } = {}) {
  const sp = 16, pads = 16;
  const widths = clues.map(([k]) => Math.max(k * sp + pads, 92));
  const gap = (W - widths.reduce((a, b) => a + b, 0)) / (clues.length + 1);
  let g = '', x = gap;
  clues.forEach(([k, r, title], i) => {
    const w = widths[i], cx = x + w / 2, x0 = cx - (k - 1) * sp / 2;
    g += `<rect x="${r1(x)}" y="8" width="${r1(w)}" height="150" rx="12" fill="#fff" stroke="#c9d3e6" stroke-width="2"/>`;
    g += tx(r1(cx), 30, title || `${unitWord} of ${k}`, { size: 15, b: true, fill: '#0f7a73' });
    for (let row = 0; row < 2; row++) for (let j = 0; j < k; j++) g += `<circle cx="${r1(x0 + j * sp)}" cy="${48 + row * 20}" r="6" fill="#9fe3dc" stroke="${INK}" stroke-width="1.8"/>`;
    g += tx(r1(cx), 104, '⋮', { size: 20, b: true });
    for (let j = 0; j < r; j++) g += `<circle cx="${r1(x0 + j * sp)}" cy="120" r="6" fill="${CORAL}" stroke="${INK}" stroke-width="1.8"/>`;
    g += tx(r1(cx), 148, r === 0 ? 'none left over' : `${r} left over`, { size: 14, fill: '#d6453a' });
    x += w + gap;
  });
  return svg(`0 0 ${W} 166`, panel(W, 166, g, '#f3f6fb'), label, `style="max-width:${W + 40}px"`);
}
const remTable = (rows, heads) => `<table class="tbl" style="font-size:15px"><thead><tr>${heads.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td class="${r.ok && i === r.length - 1 ? 'hl' : ''}" style="white-space:nowrap">${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
const mk = (arr, ok) => Object.assign(arr, { ok });

const S2 = {
  id: 'S2',
  title: 'Maths Story: Han Xin Counts His Soldiers',
  intro: 'How do you count a whole army in moments? A famous general from ancient China did it with nothing but rows and remainders. Discover his secret!',
  skills: ['Remainders', 'Multiples', 'Lists and tables'],
  art: () => {
    let troops = '';
    for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) troops += soldier(190 + c * 32, 82 + r * 32, .82);
    troops += soldier(190, 190, .82, true) + soldier(222, 190, .82, true);
    return svg('0 0 360 220', panel(360, 220, `
      <rect x="0" y="0" width="360" height="220" fill="#fdf0d8"/>
      <path d="M0 64 h360 v-20 ${[...Array(12)].map(() => 'h-15 v-10 h-15 v10').join(' ')}z" fill="#e3c9a0" ${S} stroke-width="2.4"/>
      <rect x="0" y="64" width="360" height="156" fill="#f1e2c4"/>
      <path d="M150 64 v-46" ${S}/><path d="M150 18 h30 l-6 9 l6 9 h-30z" fill="#e0282e" ${S} stroke-width="2.4"/>${tx(162, 32, '漢', { size: 14, fill: '#fff' })}
      ${general(72, 100, .78)}
      ${troops}
      <rect x="174" y="168" width="72" height="42" rx="10" fill="none" stroke="${CORAL}" stroke-width="2.6" stroke-dasharray="6 4"/>
      ${tx(300, 196, '2 left', { size: 15, b: true, fill: '#d6453a' })}${tx(300, 212, 'over!', { size: 15, b: true, fill: '#d6453a' })}
      <rect x="204" y="8" width="128" height="32" rx="16" fill="#fff" ${S}/>${tx(268, 31, 'Rows of 5!', { size: 19, b: true, fill: '#c0392b' })}`, '#fdf0d8'), 'General Han Xin orders his soldiers into rows of 5; 2 soldiers are left over');
  },
  explore: {
    title: 'The Story',
    setup: 'More than 2200 years ago in ancient China, <b>Han Xin</b> was a brilliant general. He helped Liu Bang win the throne and start the Han dynasty. A famous legend tells how Han Xin could count his whole army in moments, without counting the soldiers one by one.',
    art: () => svg('0 0 340 300', panel(340, 300, `
      <rect x="0" y="210" width="340" height="90" fill="#9edcaa"/>
      <rect x="58" y="16" width="224" height="132" rx="6" fill="#fff6dc" ${S}/>
      <rect x="44" y="10" width="16" height="144" rx="8" fill="#c98b55" ${S}/><rect x="280" y="10" width="16" height="144" rx="8" fill="#c98b55" ${S}/>
      ${tx(170, 44, 'Han Xin\'s clues', { size: 18, b: true, fill: '#c0392b' })}
      ${tx(170, 72, 'rows of 3 → 1 left over', { size: 15 })}
      ${tx(170, 96, 'rows of 5 → 2 left over', { size: 15 })}
      ${tx(170, 120, 'rows of 7 → 3 left over', { size: 15 })}
      ${tx(170, 142, 'between 900 and 1000', { size: 13, fill: '#5d6b88' })}
      ${kid('arjun', { x: 70, y: 194, s: .7, pose: 'think', mood: 'think' })}
      ${leo({ x: 176, y: 196, s: .62, pose: 'point' })}
      ${kid('aisyah', { x: 282, y: 194, s: .7, pose: 'wave' })}`, '#eaf6ff'), 'A scroll listing Han Xin\'s three clues, with Arjun, Leo and Aisyah'),
    steps: [
      { who: 'leo', text: 'After a battle, Han Xin needed to know how many soldiers he still had. Counting about a thousand soldiers one at a time would take far too long! So he gave three orders.' },
      { who: 'leo', text: '"Line up in rows of 3!" <b>1</b> soldier was left over. "Rows of 5!" <b>2</b> were left over. "Rows of 7!" <b>3</b> were left over. Han Xin knew he had between 900 and 1000 soldiers. He smiled and said: "We have <b>997</b> soldiers."',
        art: () => lineUps([[3, 1], [5, 2], [7, 3]], { label: 'Rows of 3: 1 left over. Rows of 5: 2 left over. Rows of 7: 3 left over' }) },
      { who: 'arjun', mood: 'think', text: 'How did he know? Let\'s start with just two clues. Numbers that leave <b>2</b> when divided by 5 are 2, 7, 12, 17, … Now test each one: does it leave <b>1</b> when divided by 3?',
        art: () => remTable([mk(['2', '2 ÷ 3 = 0 r 2', '✗'], false), mk(['7', '7 ÷ 3 = 2 r 1', '✓'], true)], ['Number', '÷ 3', 'r 1?']) },
      { who: 'chloe', text: '<b>7</b> fits both clues! To find the next one, jump by <b>15</b>. 15 is a multiple of both 3 and 5, so adding it doesn\'t change either remainder: 7, 22, 37, 52, 67, …' },
      { who: 'aisyah', text: 'Now test the third clue: which one leaves <b>3</b> when divided by 7?',
        art: () => remTable([mk(['7', '7 ÷ 7 = 1 r 0', '✗'], false), mk(['22', '22 ÷ 7 = 3 r 1', '✗'], false), mk(['37', '37 ÷ 7 = 5 r 2', '✗'], false), mk(['52', '52 ÷ 7 = 7 r 3', '✓'], true)], ['Number', '÷ 7', 'r 3?']) },
      { who: 'leo', mood: 'teach', text: '<b>52</b> is the smallest number that fits all three clues. To keep <b>all three</b> remainders, jump by 3 × 5 × 7 = <b>105</b>: 52, 157, 262, 367, 472, 577, 682, 787, 892, <b>997</b>, 1102, … Only 997 is between 900 and 1000!' },
      { who: 'weiming', text: 'Let me check: 997 ÷ 3 = 332 r <b>1</b> ✓, 997 ÷ 5 = 199 r <b>2</b> ✓, 997 ÷ 7 = 142 r <b>3</b> ✓. Han Xin was right!' },
    ],
  },
  keys: [
    { title: 'Remainders are clues', text: '"In rows of 5, 2 are left over" means: the number ÷ 5 leaves a <b>remainder</b> of 2.' },
    { title: 'List, then test', text: 'List the numbers that fit one clue (the <b>biggest</b> divisor gives the shortest list). Test each one against the other clues.' },
    { title: 'Jump to the next one', text: 'If a number fits the clues for 3 and 5, adding 15 (a common multiple of 3 and 5) gives the next number that fits both.' },
    { title: 'All short by the same?', text: 'If every grouping is short by the same amount, the number is a common multiple minus that amount. ÷ 3 r 2 and ÷ 4 r 3: both are 1 short, so try 12 − 1 = 11.' },
  ],
  practice: [
    { id: 'a', level: 1, type: 'mcq', prompt: 'Mdm Rahman packs her kuih bahulu into bags of 4. She has <b>1</b> kuih bahulu left over. How many could she have made?',
      options: ['18', '21', '24', '26'], answer: 1,
      hint: 'Divide each number by 4. Which one leaves a remainder of 1?',
      solution: ['18 ÷ 4 = 4 r 2 ✗', '21 ÷ 4 = 5 r <b>1</b> ✓', '24 ÷ 4 = 6 r 0 ✗', '26 ÷ 4 = 6 r 2 ✗', 'So she could have made <b>21</b>.'] },
    { id: 'b', level: 1, type: 'blanks', prompt: 'Arjun has fewer than 12 marbles. When he puts them in groups of 3, <b>2</b> are left over. When he puts them in groups of 4, <b>1</b> is left over. How many marbles does he have?',
      template: '{0} marbles', blanks: [{ answer: 5, size: 'sm' }],
      hint: 'List the numbers under 12 that leave 1 when divided by 4: 1, 5, 9. Which one leaves 2 when divided by 3?',
      solution: ['Numbers under 12 that leave 1 when divided by 4: 1, 5, 9.', '1 ÷ 3 = 0 r 1 ✗ &nbsp; 5 ÷ 3 = 1 r 2 ✓ &nbsp; 9 ÷ 3 = 3 r 0 ✗', 'Arjun has <b>5</b> marbles.'] },
    { id: 'c', level: 1, type: 'blanks', prompt: 'Between 30 and 40 pupils come for a CCA session. When they line up in rows of 5, <b>4</b> are left over. When they get into pairs, <b>1</b> pupil has no partner. How many pupils are there?',
      art: lineUps([[5, 4], [2, 1, 'pairs']], { unitWord: 'rows', label: 'Rows of 5: 4 left over. Pairs: 1 left over' }),
      template: '{0} pupils', blanks: [{ answer: 39 }],
      hint: 'Which numbers between 30 and 40 leave 4 when divided by 5? Which of them is odd?',
      solution: ['Between 30 and 40, the numbers that leave 4 when divided by 5 are 34 and 39.', '1 left over in pairs means the number is <b>odd</b>. 34 is even, 39 is odd.', 'There are <b>39</b> pupils. Check: 39 ÷ 5 = 7 r 4 ✓, 39 ÷ 2 = 19 r 1 ✓'] },
    { id: 'd', level: 2, type: 'blanks', prompt: 'Siti is making bead bracelets for Racial Harmony Day. When she sorts her beads into groups of 3, <b>2</b> are left over. In groups of 5, <b>4</b> are left over. What is the <b>smallest</b> number of beads she could have?',
      template: '{0} beads', blanks: [{ answer: 14 }],
      hint: 'List numbers that leave 4 when divided by 5: 4, 9, 14, … Test each one with ÷ 3.',
      solution: ['Numbers that leave 4 when divided by 5: 4, 9, 14, 19, …', '4 ÷ 3 = 1 r 1 ✗ &nbsp; 9 ÷ 3 = 3 r 0 ✗ &nbsp; 14 ÷ 3 = 4 r 2 ✓', 'The smallest number is <b>14</b> beads.', 'Another way: both clues are 1 short of a full group, so the number is 1 less than a multiple of 15: 15 − 1 = 14.'] },
    { id: 'e', level: 2, type: 'blanks', prompt: 'Mdm Lim baked between 30 and 50 ang ku kueh for a full-month celebration. When she packs them in boxes of 6, <b>4</b> are left over. In boxes of 8, <b>6</b> are left over. How many ang ku kueh did she bake?',
      art: lineUps([[6, 4], [8, 6]], { unitWord: 'boxes', label: 'Boxes of 6: 4 left over. Boxes of 8: 6 left over' }),
      template: '{0} ang ku kueh', blanks: [{ answer: 46 }],
      hint: 'How many more kueh would fill the last box each time? Is it the same for both?',
      solution: ['Boxes of 6 with 4 left over: 2 more kueh would fill another box.', 'Boxes of 8 with 6 left over: 2 more would fill another box too.', 'So the number + 2 is a common multiple of 6 and 8: 24, 48, 72, …', 'The number is 22, 46, 70, … Only <b>46</b> is between 30 and 50.', 'Check: 46 ÷ 6 = 7 r 4 ✓, 46 ÷ 8 = 5 r 6 ✓'] },
    { id: 'f', level: 2, type: 'blanks', prompt: 'Between 100 and 150 Primary 4 pupils line up for the school assembly. In rows of 8, <b>5</b> are left over. In rows of 10, <b>7</b> are left over. How many Primary 4 pupils are there?',
      template: '{0} pupils', blanks: [{ answer: 117 }],
      hint: 'Rows of 10 with 7 left over: the number ends in 7. Which of 107, 117, 127, 137, 147 leaves 5 when divided by 8?',
      solution: ['7 left over in rows of 10 means the number ends in 7: 107, 117, 127, 137 or 147.', '107 ÷ 8 = 13 r 3 ✗ &nbsp; 117 ÷ 8 = 14 r 5 ✓ &nbsp; 127 ÷ 8 = 15 r 7 ✗ &nbsp; 137 ÷ 8 = 17 r 1 ✗ &nbsp; 147 ÷ 8 = 18 r 3 ✗', 'There are <b>117</b> pupils.', 'Shortcut: both rows are 3 short of full, so the number is 3 less than a multiple of 40: 120 − 3 = 117.'] },
    { id: 'g', level: 3, type: 'blanks', prompt: 'Mr Hassan sells rambutans at the wet market. Tied in bundles of 3, <b>1</b> is left over. In bundles of 4, <b>2</b> are left over. In bundles of 5, <b>3</b> are left over. What is the <b>smallest</b> number of rambutans he could have?',
      template: '{0} rambutans', blanks: [{ answer: 58 }],
      hint: 'In each case, how many more would make a full group? Is it the same every time?',
      solution: ['÷ 3 r 1: 2 short of a full group. ÷ 4 r 2: 2 short. ÷ 5 r 3: 2 short.', 'So the number + 2 is a common multiple of 3, 4 and 5.', 'The smallest common multiple of 3, 4 and 5 is 60.', 'The number is 60 − 2 = <b>58</b> rambutans.', 'Check: 58 ÷ 3 = 19 r 1 ✓, 58 ÷ 4 = 14 r 2 ✓, 58 ÷ 5 = 11 r 3 ✓'] },
    { id: 'h', level: 3, type: 'blanks', prompt: 'For the Mid-Autumn Festival, the community centre hangs up lanterns. Counted in 3s, <b>2</b> are left over. Counted in 5s, <b>4</b> are left over. Counted in 7s, <b>5</b> are left over. What is the <b>smallest</b> possible number of lanterns?',
      template: '{0} lanterns', blanks: [{ answer: 89 }],
      hint: 'First find the numbers that fit the 3s and 5s clues (they go up in 15s). Then test them with ÷ 7.',
      solution: ['3s clue and 5s clue: both are 1 short, so the numbers are 15 − 1 = 14, then 29, 44, 59, 74, 89, … (jumps of 15).', 'Test with ÷ 7: 14 r 0, 29 r 1, 44 r 2, 59 r 3, 74 r 4, 89 r <b>5</b> ✓', 'The smallest number is <b>89</b> lanterns.', 'Check: 89 ÷ 3 = 29 r 2 ✓, 89 ÷ 5 = 17 r 4 ✓, 89 ÷ 7 = 12 r 5 ✓'] },
    { id: 'i', level: 3, type: 'blanks', prompt: 'A school\'s marching contingent for the National Day Parade has between 100 and 200 pupils. In rows of 3, <b>1</b> is left over. In rows of 4, <b>1</b> is left over. In rows of 7, <b>none</b> are left over. How many pupils are in the contingent?',
      art: lineUps([[3, 1], [4, 1], [7, 0]], { label: 'Rows of 3: 1 left over. Rows of 4: 1 left over. Rows of 7: none left over' }),
      template: '{0} pupils', blanks: [{ answer: 133 }],
      hint: 'If 1 is left over in rows of 3 and in rows of 4, then the number is 1 more than a multiple of 12. List those numbers and test them with ÷ 7.',
      solution: ['1 left over in rows of 3 and of 4 means the number is 1 more than a common multiple of 3 and 4 (a multiple of 12): 13, 25, 37, 49, …', 'Test with ÷ 7: 13 ✗, 25 ✗, 37 ✗, 49 = 7 × 7 ✓', '49 is the smallest. Now jump by 12 × 7 = 84 to keep all the clues: 49, 133, 217, …', 'Only <b>133</b> is between 100 and 200.', 'Check: 133 ÷ 3 = 44 r 1 ✓, 133 ÷ 4 = 33 r 1 ✓, 133 ÷ 7 = 19 r 0 ✓'] },
  ],
  adult: 'About the story: Han Xin (died 196 BC) was a real general of the early Han dynasty, but "Han Xin counts his soldiers" is a <b>legend</b>. The puzzle itself first appears in an ancient Chinese book, the <i>Sunzi Suanjing</i> (about 1600 years old), and today mathematicians call the idea the <b>Chinese Remainder Theorem</b>. Links to school work: division with remainders, multiples and common multiples are <b>within</b> P4. Solving several remainder clues at once is <b>enrichment</b> (olympiad style). Common mistakes: stopping after checking only one or two clues; jumping by the product of the divisors when a smaller common multiple works (for groups of 6 and 8, jump by 24, not 48); forgetting to use the given range to pick the answer. Tip: always start the list with the biggest divisor, because the list is shorter.',
};

export default { t18, t19, S2 };
