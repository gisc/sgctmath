// Unit 1 · Number Sense — original content, Singapore context.
import * as A from '../art.js';
import { frac } from '../format.js';
const { svg, kid, leo } = A;

const rd = d => `<span class="rd">${d}</span>`;           // a single dotted digit (raw HTML)
const v = s => `<i>${s}</i>`;                             // italic letter for algebra

// Long-division "ladder": shows each bring-down step and its remainder
function divSteps(a, b, n, note = '') {
  let r = a % b, rows = '', q = '';
  for (let i = 0; i < n; i++) {
    const t = r * 10, d = Math.floor(t / b), nr = t % b;
    rows += `<tr><td>${t} ÷ ${b}</td><td><b>${d}</b></td><td class="${nr === 0 ? '' : 'hl'}">remainder ${nr}</td></tr>`;
    q += d; r = nr; if (r === 0) break;
  }
  return `<table class="tbl"><thead><tr><th>Divide</th><th>Digit</th><th>Left over</th></tr></thead><tbody>${rows}</tbody></table>${note ? `<small>${note}</small>` : ''}`;
}
function placeTable(rows) {
  // rows: [label, [digits...]]
  const cols = ['ones', '.', 'tenths', 'hundredths', 'thousandths', '4th place'];
  return `<table class="tbl"><thead><tr><th></th>${cols.map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>${rows.map(([l, ds, hi]) => `<tr><th>${l}</th>${ds.map((d, i) => `<td class="${hi === i ? 'hl' : ''}">${d}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}

/* ===================== Topic 1 ===================== */
const t01 = {
  id: 't01',
  title: 'Decimals That Stop and Decimals That Go On',
  intro: 'Some divisions finish neatly. Others go on and on forever! Learn to spot the difference and write never-ending decimals the smart way.',
  skills: ['Division', 'Decimals', 'Patterns'],
  art: () => svg('0 0 360 210', `
    <rect width="360" height="210" rx="20" fill="#fff0f5"/>
    ${A.bottle(24, 50, { label: '1 L' })}
    <text x="100" y="40" font-family="Baloo 2, sans-serif" font-weight="800" font-size="17" fill="${A.ink}">4 friends</text>
    ${[0, 1, 2, 3].map(i => A.cup(98 + i * 50, 52, .5)).join('')}
    <text x="100" y="135" font-family="Nunito, sans-serif" font-weight="800" font-size="15" fill="#0f7a73">0.25 L each ✓ stops</text>
    <text x="100" y="158" font-family="Baloo 2, sans-serif" font-weight="800" font-size="17" fill="${A.ink}">3 friends</text>
    ${[0, 1, 2].map(i => A.cup(98 + i * 50, 165, .66, { h: 34, w: 34 })).join('')}
    <text x="262" y="190" font-family="Nunito, sans-serif" font-weight="800" font-size="15" fill="#d6453a">0.333… L ∞</text>`, 'A 1-litre bottle of bandung shared among 4 cups and among 3 cups'),
  explore: {
    setup: 'Mdm Lee makes <b>1 litre</b> of bandung (rose syrup milk) and shares it equally among her children.',
    art: () => svg('0 0 340 300', `<rect width="340" height="300" rx="20" fill="#eef8ff"/>
      ${A.bottle(150, 40, { label: '1 L' })}
      ${kid('aisyah', { x: 70, y: 150, s: .8, pose: 'wave' })}${kid('weiming', { x: 270, y: 150, s: .8, mood: 'think', pose: 'think' })}`, 'Aisyah and Wei Ming with the bandung bottle'),
    steps: [
      { who: 'leo', text: 'If <b>4</b> children share 1 L, each gets 1 ÷ 4 litres. Let\'s divide step by step:', art: () => divSteps(1, 4, 6) },
      { who: 'aisyah', text: 'So 1 ÷ 4 = <b>0.25</b>. The remainder became <b>0</b>, so the division <b>stops</b>. This is a <b>terminating decimal</b>.' },
      { who: 'weiming', mood: 'think', text: 'What if only <b>3</b> children share it? Let me try 1 ÷ 3…', art: () => divSteps(1, 3, 4, 'The remainder 1 keeps coming back… it never becomes 0!') },
      { who: 'leo', text: 'Because the remainder 1 keeps coming back, the digit 3 repeats <b>forever</b>: 0.3333… This is a <b>recurring decimal</b>. We write it as [[r:0.(3)]]. The dot means "this digit repeats".' },
      { who: 'chloe', text: 'When a <b>block</b> of digits repeats, put dots on the <b>first and last</b> digits of the block. 0.272727… = [[r:0.(27)]] and 0.142857142857… = [[r:0.(142857)]].' },
      { who: 'arjun', mood: 'think', text: 'Careful! In 1 ÷ 6 = 0.16666…, only the 6 repeats, so we write [[r:0.1(6)]]. Only the repeating part gets the dot.' },
    ],
  },
  keys: [
    { title: 'Terminating decimal', text: 'The division ends because the remainder becomes 0. Example: 3 ÷ 8 = 0.375' },
    { title: 'Recurring decimal', text: 'A digit or block of digits repeats forever. Example: 2 ÷ 3 = 0.666… = [[r:0.(6)]]' },
    { title: 'Where do the dots go?', text: 'One repeating digit gets one dot. A repeating block gets dots on its <b>first</b> and <b>last</b> digits: [[r:0.(36)]] = 0.363636…' },
    { title: 'Finding the 20th digit', text: 'Count how many digits are in the repeating block, then divide the position by that number. The <b>remainder</b> tells you which digit of the block it is.' },
  ],
  practice: [
    { id: 'a', level: 1, type: 'mcq', prompt: 'Which of these divisions give a <b>terminating</b> decimal?',
      options: ['3 ÷ 4', '2 ÷ 3', '7 ÷ 8', '5 ÷ 6', '9 ÷ 5'], answer: [0, 2, 4],
      hint: 'Work out each division. Does the remainder ever become 0?',
      solution: ['3 ÷ 4 = 0.75 ✓ stops', '2 ÷ 3 = 0.666… ✗ goes on', '7 ÷ 8 = 0.875 ✓ stops', '5 ÷ 6 = 0.8333… ✗ goes on', '9 ÷ 5 = 1.8 ✓ stops'] },
    { id: 'b', level: 1, type: 'blanks', prompt: 'Mr Tan pours <b>5 L</b> of soya bean milk equally into <b>8</b> jugs. How much milk is in each jug?',
      template: '5 ÷ 8 = {0} L', blanks: [{ answer: 0.625 }],
      hint: '5 ÷ 8: start with 50 ÷ 8, then bring down a 0 each time.',
      solution: ['50 ÷ 8 = 6 remainder 2', '20 ÷ 8 = 2 remainder 4', '40 ÷ 8 = 5 remainder 0, so it stops.', 'Each jug has <b>0.625 L</b>.'] },
    { id: 'c', level: 1, type: 'blanks', prompt: 'Work out 5 ÷ 9. Write the first three decimal places.',
      template: '5 ÷ 9 = 0.{0}{1}{2}…', blanks: [{ answer: 5, size: 'sm' }, { answer: 5, size: 'sm' }, { answer: 5, size: 'sm' }],
      hint: '50 ÷ 9 = 5 remainder 5. What happens next?',
      solution: ['50 ÷ 9 = 5 remainder 5', 'The remainder is 5 again, so the next step is 50 ÷ 9 again.', 'So 5 ÷ 9 = 0.555… = [[r:0.(5)]]'] },
    { id: 'd', level: 2, type: 'mcq', prompt: 'How do we write 0.272727… using recurring dots?',
      options: ['[[r:0.(27)]]', '[[r:0.2(7)]]', `0.${rd(2)}7`, '[[r:0.(272)]]'], answer: 0,
      hint: 'Which block of digits repeats? Put dots on its first and last digits.',
      solution: 'The block <b>27</b> repeats, so the dots go on the 2 and the 7: [[r:0.(27)]]. ([[r:0.2(7)]] would mean 0.27777…)' },
    { id: 'e', level: 2, type: 'mcq', prompt: '1 ÷ 6 = 0.16666… Which is the correct way to write it?',
      options: ['[[r:0.(16)]]', '[[r:0.1(6)]]', `0.${rd(1)}6`, '0.17'], answer: 1,
      hint: 'Does the 1 repeat, or only the 6?',
      solution: 'Only the 6 repeats, so only the 6 gets a dot: [[r:0.1(6)]]. Note: [[r:0.(16)]] means 0.161616…, which is a different number. 0.17 is only a rounded value.' },
    { id: 'f', level: 2, type: 'blanks', prompt: '4 ÷ 11 = 0.363636… = [[r:0.(36)]]. What is the <b>10th</b> digit after the decimal point?',
      template: 'The 10th digit is {0}.', blanks: [{ answer: 6, size: 'sm' }],
      hint: 'The block "36" has 2 digits. Which digit sits in the odd places, and which in the even places?',
      solution: ['Places 1, 3, 5, … are 3. Places 2, 4, 6, … are 6.', '10 is even (10 ÷ 2 = 5 remainder 0), so it is the <b>last</b> digit of the block.', 'The 10th digit is <b>6</b>.'] },
    { id: 'g', level: 3, type: 'blanks', prompt: '1 ÷ 7 = [[r:0.(142857)]]. What is the <b>20th</b> digit after the decimal point?',
      template: 'The 20th digit is {0}.', blanks: [{ answer: 4, size: 'sm' }],
      hint: 'The block 142857 has 6 digits. Work out 20 ÷ 6.',
      solution: ['The repeating block 1 4 2 8 5 7 has 6 digits.', '20 ÷ 6 = 3 remainder 2: three full blocks, then 2 more digits.', 'The 2nd digit of the block is <b>4</b>.'] },
    { id: 'h', level: 3, type: 'blanks', prompt: '3 ÷ 7 = [[r:0.(428571)]]. Find the <b>sum</b> of the first 12 digits after the decimal point.',
      template: 'Sum = {0}', blanks: [{ answer: 54 }],
      hint: '12 digits make exactly 2 repeating blocks.',
      solution: ['One block: 4 + 2 + 8 + 5 + 7 + 1 = 27', '12 digits = 2 blocks, so the sum is 27 × 2 = <b>54</b>.'] },
    { id: 'i', level: 3, type: 'blanks', prompt: 'Using 3 ÷ 7 = [[r:0.(428571)]] again: what is the <b>2026th</b> digit after the decimal point?',
      template: 'The 2026th digit is {0}.', blanks: [{ answer: 5, size: 'sm' }],
      hint: 'The block has 6 digits. Find the remainder when 2026 is divided by 6.',
      solution: ['2026 ÷ 6 = 337 remainder 4 (because 6 × 337 = 2022).', 'So the 2026th digit is the 4th digit of the block 4 2 8 <b>5</b> 7 1.', 'The answer is <b>5</b>.'] },
  ],
  adult: 'Links to school work: P4 decimals, including dividing a whole number by a whole number to get a decimal (e.g. 5 ÷ 8 = 0.625). Recurring-decimal notation is normally met in secondary school, so this topic is <b>enrichment</b>. The key idea for children: a decimal stops when a remainder of 0 appears, and repeats once a remainder they have seen before comes back.',
};

/* ===================== Topic 2 ===================== */
const t02 = {
  id: 't02',
  title: 'Comparing Recurring Decimals',
  intro: 'Which is bigger, [[r:0.(3)]] or 0.33? It\'s a closer race than you think! Learn a sure-fire way to compare decimals that go on forever.',
  skills: ['Place value', 'Comparing', 'Ordering'],
  art: () => svg('-10 0 340 250', `<rect x="-10" width="340" height="250" rx="20" fill="#f1edff"/>${A.balance('0.33', '0.333…', 7)}`, 'A balance scale comparing 0.33 and 0.333…'),
  explore: {
    setup: 'In a class game, each pupil draws a number card. <b>The bigger number wins!</b> Chloe draws [[r:0.(3)]] and Arjun draws 0.33.',
    art: () => svg('0 0 340 300', `<rect width="340" height="300" rx="20" fill="#fff6e4"/>
      <g transform="translate(40 20) rotate(-6)"><rect width="110" height="70" rx="12" fill="#fff" stroke="${A.ink}" stroke-width="3"/><text x="55" y="48" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="30" fill="#ff6b5b">0.3̇</text></g>
      <g transform="translate(190 20) rotate(5)"><rect width="110" height="70" rx="12" fill="#fff" stroke="${A.ink}" stroke-width="3"/><text x="55" y="48" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="30" fill="#0f9d94">0.33</text></g>
      ${kid('chloe', { x: 95, y: 150, s: .85, pose: 'think', mood: 'think' })}${kid('arjun', { x: 245, y: 150, s: .85, pose: 'wave' })}`, 'Chloe and Arjun holding number cards'),
    steps: [
      { who: 'chloe', mood: 'think', text: 'They look almost the same… Who wins?' },
      { who: 'leo', text: 'Write the recurring decimal out in full, then line up the digits by place value:',
        art: () => placeTable([['[[r:0.(3)]]', ['0', '.', '3', '3', '3', '3…'], 4], ['0.33', ['0', '.', '3', '3', '0', '0'], 4]]) },
      { who: 'arjun', text: 'The ones, tenths and hundredths are the same. In the <b>thousandths</b> place, 3 &gt; 0. So [[r:0.(3)]] &gt; 0.33, and Chloe wins!' },
      { who: 'leo', text: 'Round 2: [[r:0.(15)]] or [[r:0.1(5)]]? Write both out:',
        art: () => placeTable([['[[r:0.(15)]]', ['0', '.', '1', '5', '1', '5…'], 4], ['[[r:0.1(5)]]', ['0', '.', '1', '5', '5', '5…'], 4]]) },
      { who: 'weiming', text: 'The first difference is in the thousandths place: 1 &lt; 5. So [[r:0.(15)]] &lt; [[r:0.1(5)]].' },
      { who: 'aisyah', text: '<b>My tip:</b> write out a few more digits than the longest decimal has, then compare from the left. The first place that is different decides!' },
    ],
  },
  keys: [
    { title: 'Write it out', text: 'Change each recurring decimal into its long form: [[r:0.2(7)]] = 0.27777…' },
    { title: 'Line up the places', text: 'Line up the decimal points. Fill empty places of a terminating decimal with 0s: 0.33 = 0.3300' },
    { title: 'Compare from the left', text: 'Start at the biggest place value. The <b>first</b> digit that is different tells you which number is bigger.' },
    { title: 'Same start, different repeat', text: '[[r:0.(15)]] and [[r:0.1(5)]] both start 0.15…, so look further along to find the difference.' },
  ],
  practice: [
    { id: 'a', level: 1, type: 'compare', prompt: 'Compare. Choose &lt;, = or &gt;.',
      pairs: [['[[r:0.(6)]]', '0.66', '>'], ['0.5', '[[r:0.(4)]]', '>'], ['0.12', '[[r:0.(12)]]', '<']],
      hint: 'Write each recurring decimal to 4 decimal places first.',
      solution: ['0.6666… &gt; 0.6600', '0.5000 &gt; 0.4444…', '0.1200 &lt; 0.1212…'] },
    { id: 'b', level: 2, type: 'compare', prompt: 'Compare. Choose &lt;, = or &gt;.',
      pairs: [['[[r:0.(27)]]', '[[r:0.2(7)]]', '<'], ['[[r:0.(31)]]', '[[r:0.3(1)]]', '>'], ['[[r:1.(08)]]', '[[r:1.0(8)]]', '<']],
      hint: 'Both numbers in each pair start the same. Write out 6 decimal places.',
      solution: ['0.272727… &lt; 0.277777… (thousandths: 2 &lt; 7)', '0.313131… &gt; 0.311111… (thousandths: 3 &gt; 1)', '1.080808… &lt; 1.088888… (thousandths: 0 &lt; 8)'] },
    { id: 'c', level: 2, type: 'compare', prompt: 'Compare. Choose &lt;, = or &gt;.',
      pairs: [['[[r:0.4(5)]]', '0.455', '>'], ['[[r:2.(3)]]', '[[r:2.(32)]]', '>'], ['0.909', '[[r:0.(90)]]', '<']],
      hint: 'Fill the empty places of a terminating decimal with zeros: 0.455 = 0.455000',
      solution: ['0.45555… &gt; 0.45500 (4th place: 5 &gt; 0)', '2.3333… &gt; 2.3232… (hundredths: 3 &gt; 2)', '0.909000 &lt; 0.909090… (5th place: 0 &lt; 9)'] },
    { id: 'd', level: 2, type: 'mcq', prompt: 'Which number is the <b>greatest</b>?',
      options: ['[[r:0.(45)]]', '[[r:0.4(5)]]', '0.455', '[[r:0.(4)]]'], answer: 1,
      hint: 'Write each one to 5 decimal places and compare.',
      solution: ['[[r:0.(45)]] = 0.45454…', '[[r:0.4(5)]] = 0.45555…', '0.455 = 0.45500', '[[r:0.(4)]] = 0.44444…', 'The greatest is <b>[[r:0.4(5)]]</b>.'] },
    { id: 'e', level: 2, type: 'mcq', prompt: 'Which list is in order from <b>smallest to greatest</b>?',
      options: ['0.303, [[r:0.(30)]], 0.33, [[r:0.(3)]]', '[[r:0.(30)]], 0.303, 0.33, [[r:0.(3)]]', '0.303, [[r:0.(30)]], [[r:0.(3)]], 0.33', '0.33, [[r:0.(3)]], 0.303, [[r:0.(30)]]'], answer: 0,
      hint: 'Write all four numbers to 6 decimal places.',
      solution: ['0.303 = 0.303000', '[[r:0.(30)]] = 0.303030…', '0.33 = 0.330000', '[[r:0.(3)]] = 0.333333…', 'So: 0.303 &lt; [[r:0.(30)]] &lt; 0.33 &lt; [[r:0.(3)]]'] },
    { id: 'f', level: 3, type: 'mcq', prompt: 'Add recurring dots to 0.1234 to make the <b>greatest</b> possible number. Which is it?',
      options: ['[[r:0.123(4)]]', '[[r:0.12(34)]]', '[[r:0.1(234)]]', '[[r:0.(1234)]]'], answer: 0,
      hint: 'All four start with 0.1234. Look at the 5th decimal place of each.',
      solution: ['[[r:0.123(4)]] = 0.12344…', '[[r:0.12(34)]] = 0.12343…', '[[r:0.1(234)]] = 0.12342…', '[[r:0.(1234)]] = 0.12341…', 'Compare the 5th place: 4 &gt; 3 &gt; 2 &gt; 1, so <b>[[r:0.123(4)]]</b> is greatest.'] },
    { id: 'g', level: 3, type: 'mcq', prompt: 'Now add dots to 0.1234 to make the <b>smallest</b> possible number.',
      options: ['[[r:0.123(4)]]', '[[r:0.12(34)]]', '[[r:0.1(234)]]', '[[r:0.(1234)]]'], answer: 3,
      hint: 'Use what you found in the last question.',
      solution: 'The 5th decimal places are 4, 3, 2 and 1. The smallest is <b>[[r:0.(1234)]]</b> = 0.12341234…' },
    { id: 'h', level: 3, type: 'blanks', prompt: 'A digit is missing from 0.6☐7. How many different digits (0 to 9) can go in the box so that 0.6☐7 is <b>smaller</b> than [[r:0.(6)]]?',
      template: '{0} digits', blanks: [{ answer: 6, size: 'sm' }],
      hint: '[[r:0.(6)]] = 0.6666… Try the box as 5, then 6, then 7.',
      solution: ['[[r:0.(6)]] = 0.6666…', 'If the box is 0 to 5, then 0.6☐7 &lt; 0.66, so it is smaller. ✓', 'If the box is 6: 0.667 &gt; 0.6666…, so it is <b>not</b> smaller.', 'If the box is 7, 8 or 9, it is bigger.', 'So <b>6</b> digits work: 0, 1, 2, 3, 4, 5.'] },
  ],
  adult: 'Links to school work: P4 comparing and ordering decimals by place value. Recurring-decimal notation is secondary-level, so this topic is <b>enrichment</b>. The new twist is making the "hidden" digits visible by writing the decimal out in full. A common mistake is thinking [[r:0.(15)]] and [[r:0.1(5)]] are equal because they start the same way.',
};

/* ===================== Topic 3 ===================== */
const prataArt = () => svg('0 0 360 220', `<rect width="360" height="220" rx="20" fill="#fff4dd"/>
  ${A.prata(95, 105, 4, 0)}${A.prata(240, 105, 4, 1)}
  <text x="168" y="200" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="20" fill="${A.ink}">7 quarters = 1¾ prata</text>
  ${A.kopi(300, 20, .7)}`, 'Two roti prata cut into quarters, with 7 pieces left');
const t03 = {
  id: 't03',
  title: 'Proper Fractions, Improper Fractions and Mixed Numbers',
  intro: 'At the prata shop, every prata is cut into equal pieces. What happens when you eat <i>more</i> than one whole prata? Meet improper fractions and mixed numbers!',
  skills: ['Fractions', 'Mixed numbers', 'Converting'],
  art: prataArt,
  explore: {
    setup: 'At the prata shop, Uncle Raju cuts every roti prata into <b>4 equal pieces</b>. Each piece is [[f:1/4]] of a prata.',
    art: () => svg('0 0 340 300', `<rect width="340" height="300" rx="20" fill="#fff4dd"/>
      <rect x="0" y="0" width="340" height="60" rx="20" fill="#ffd8a8"/><path d="M0 40 h340" stroke="#ff6b5b" stroke-width="10" stroke-dasharray="26 14"/>
      ${kid('aisyah', { x: 85, y: 110, s: .9, pose: 'wave' })}${kid('weiming', { x: 255, y: 110, s: .9, pose: 'cheer' })}
      ${A.table(30, 210, 280)}${A.prata(100, 198, 4, 1, 34)}${A.prata(240, 198, 4, 0, 34)}`, 'Aisyah and Wei Ming at the prata shop'),
    steps: [
      { who: 'aisyah', text: 'I ate 3 pieces. That\'s [[f:3/4]] of a prata. The numerator (3) is <b>smaller</b> than the denominator (4), so [[f:3/4]] is a <b>proper fraction</b>. It is less than 1 whole.',
        art: () => A.fractionCircles(4, 3, 1, { label: 'three quarters' }) },
      { who: 'weiming', text: 'I was hungry and ate 7 pieces! That\'s [[f:7/4]] of a prata.',
        art: () => A.fractionCircles(4, 7, 2, { label: 'seven quarters' }) },
      { who: 'leo', text: 'In [[f:7/4]], the numerator is <b>bigger than or equal to</b> the denominator. It is an <b>improper fraction</b>, which means 1 whole or more.' },
      { who: 'arjun', text: '7 quarters = 4 quarters + 3 quarters = 1 whole and [[f:3/4]]. We write this as the <b>mixed number</b> [[m:1 3/4]]. Quick way: 7 ÷ 4 = 1 remainder 3.' },
      { who: 'chloe', text: 'Going back the other way: [[m:2 1/3]]. 2 wholes = 6 thirds, plus 1 third = 7 thirds = [[f:7/3]]. Shortcut: 2 × 3 + 1 = 7.' },
    ],
  },
  keys: [
    { title: 'Proper fraction', text: 'Numerator smaller than denominator, so it is less than 1. Examples: [[f:3/4]], [[f:2/5]]' },
    { title: 'Improper fraction', text: 'Numerator bigger than or <b>equal to</b> the denominator, so it is 1 or more. Examples: [[f:7/4]], [[f:5/5]]' },
    { title: 'Improper → mixed', text: 'Divide the numerator by the denominator. [[f:11/4]]: 11 ÷ 4 = 2 remainder 3, so it is [[m:2 3/4]]' },
    { title: 'Mixed → improper', text: 'Whole × denominator + numerator. [[m:3 2/5]]: 3 × 5 + 2 = 17, so it is [[f:17/5]]' },
  ],
  practice: [
    { id: 'a', level: 1, type: 'mcq', prompt: 'Which of these are <b>improper fractions</b>?',
      options: ['[[f:5/3]]', '[[f:3/5]]', '[[f:8/8]]', '[[m:1 1/2]]', '[[f:9/4]]'], answer: [0, 2, 4],
      hint: 'An improper fraction has a numerator that is bigger than <b>or equal to</b> its denominator. A mixed number is not an improper fraction.',
      solution: ['[[f:5/3]]: 5 ≥ 3 ✓', '[[f:3/5]]: proper ✗', '[[f:8/8]]: 8 = 8 ✓ (it equals 1 whole)', '[[m:1 1/2]] is a mixed number ✗', '[[f:9/4]]: 9 ≥ 4 ✓'] },
    { id: 'b', level: 1, type: 'blanks', prompt: 'Write [[f:11/4]] as a mixed number.',
      template: '[[f:11/4]] = {m:0,1,2}', blanks: [{ answer: 2, label: 'whole number' }, { answer: 3, label: 'numerator' }, { answer: 4, label: 'denominator' }],
      hint: 'How many 4s are in 11? What is left over?',
      solution: ['11 ÷ 4 = 2 remainder 3', 'So [[f:11/4]] = [[m:2 3/4]]'] },
    { id: 'c', level: 1, type: 'blanks', prompt: 'Write [[m:3 2/5]] as an improper fraction.',
      template: '[[m:3 2/5]] = {f:0,1}', blanks: [{ answer: 17, label: 'numerator' }, { answer: 5, label: 'denominator' }],
      hint: '3 wholes = how many fifths?',
      solution: ['3 wholes = 15 fifths', '15 fifths + 2 fifths = 17 fifths', '[[m:3 2/5]] = [[f:17/5]]'] },
    { id: 'd', level: 2, type: 'blanks', prompt: 'Each circle is <b>1 whole</b>. Write the shaded part as an improper fraction <b>and</b> as a mixed number.',
      art: A.fractionCircles(6, 17, 3, { color: '#4aa8ff', label: '17 sixths shaded' }),
      template: '{f:0,1} = {m:2,3,4}', blanks: [{ answer: 17 }, { answer: 6 }, { answer: 2 }, { answer: 5 }, { answer: 6 }],
      hint: 'Each circle has 6 equal parts. Count all the shaded parts.',
      solution: ['Each circle is cut into 6 parts, so each part is [[f:1/6]].', 'Shaded parts: 6 + 6 + 5 = 17, so the shaded part is [[f:17/6]].', '17 ÷ 6 = 2 remainder 5, so [[f:17/6]] = [[m:2 5/6]].'] },
    { id: 'e', level: 2, type: 'blanks', prompt: 'Mdm Tan bakes <b>23</b> muffins for a school fair. A box holds <b>4</b> muffins. How many boxes\' worth of muffins is that? Write your answer as a mixed number.',
      template: '{m:0,1,2} boxes', blanks: [{ answer: 5 }, { answer: 3 }, { answer: 4 }],
      hint: '23 ÷ 4 = ? remainder ? The leftover muffins fill part of a box.',
      solution: ['23 ÷ 4 = 5 remainder 3', '5 full boxes and 3 out of 4 places in the next box are filled.', 'That is [[m:5 3/4]] boxes.'] },
    { id: 'f', level: 2, type: 'blanks', prompt: 'A fraction has denominator 7 and is an <b>improper</b> fraction. What is the <b>smallest</b> possible numerator?',
      template: 'Smallest numerator = {0}', blanks: [{ answer: 7, size: 'sm' }],
      hint: 'An improper fraction can have its numerator <b>equal</b> to its denominator.',
      solution: 'The numerator must be 7 or more. The smallest is <b>7</b>, giving [[f:7/7]] = 1.' },
    { id: 'g', level: 2, type: 'compare', prompt: 'Compare. Choose &lt;, = or &gt;.',
      pairs: [['[[f:9/4]]', '[[m:2 1/3]]', '<'], ['[[f:10/5]]', '2', '='], ['[[m:1 5/6]]', '[[f:11/6]]', '='], ['[[f:13/3]]', '[[m:4 1/2]]', '<']],
      hint: 'Change the improper fractions into mixed numbers first, then compare the parts.',
      solution: ['[[f:9/4]] = [[m:2 1/4]], and [[f:1/4]] &lt; [[f:1/3]], so [[f:9/4]] &lt; [[m:2 1/3]]', '[[f:10/5]] = 10 ÷ 5 = 2', '[[m:1 5/6]] = (6 + 5) sixths = [[f:11/6]]', '[[f:13/3]] = [[m:4 1/3]], and [[f:1/3]] &lt; [[f:1/2]], so [[f:13/3]] &lt; [[m:4 1/2]]'] },
    { id: 'h', level: 3, type: 'mcq', prompt: 'Which fraction lies <b>between</b> 3 and [[m:3 1/2]]?',
      options: ['[[f:13/4]]', '[[f:15/4]]', '[[f:7/2]]', '[[f:11/4]]'], answer: 0,
      hint: 'Change each one into a mixed number.',
      solution: ['[[f:13/4]] = [[m:3 1/4]] ✓ (between 3 and [[m:3 1/2]])', '[[f:15/4]] = [[m:3 3/4]] is too big', '[[f:7/2]] = [[m:3 1/2]] exactly, which is not <i>between</i>', '[[f:11/4]] = [[m:2 3/4]] is too small'] },
    { id: 'i', level: 3, type: 'blanks', prompt: `${v('a')} is a whole number. ${frac(v('a'), 5)} is an <b>improper</b> fraction, but ${frac(v('a'), 8)} is a <b>proper</b> fraction. How many possible values of ${v('a')} are there?`,
      template: '{0} values', blanks: [{ answer: 3, size: 'sm' }],
      hint: `For ${frac(v('a'), 5)} to be improper, ${v('a')} must be at least 5. For ${frac(v('a'), 8)} to be proper, ${v('a')} must be less than 8.`,
      solution: [`Improper ${frac(v('a'), 5)} means ${v('a')} ≥ 5.`, `Proper ${frac(v('a'), 8)} means ${v('a')} &lt; 8.`, `So ${v('a')} can be 5, 6 or 7: <b>3</b> values.`] },
  ],
  adult: 'Links to school work: P4 Fractions (mixed numbers and improper fractions, converting between them). This topic is <b>within</b> the P4 syllabus. Encourage children to sketch circles or bars when unsure. Note that a fraction such as [[f:5/5]] counts as improper.',
};

/* ===================== Topic 4 ===================== */
const toastArt = () => svg('0 0 360 220', `<rect width="360" height="220" rx="20" fill="#eafaf0"/>
  ${A.kayaToast(30, 120, 1)}${A.kopi(140, 80, .9)}${A.eggs(70, 170, 1)}
  <text x="70" y="40" font-family="Baloo 2, sans-serif" font-weight="800" font-size="22" fill="${A.ink}">1 set = $4</text>
  ${A.mysteryBox(230, 70, 'n', 1.05)}
  <text x="272" y="185" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="20" fill="#7b61ff">cost = 4n</text>`, 'A kaya toast set costs 4 dollars; a mystery box labelled n');
const t04 = {
  id: 't04',
  title: 'Using Letters to Stand for Numbers',
  intro: 'What if you don\'t know a number yet? Give it a letter! Letters let us write rules that work for <i>any</i> number.',
  skills: ['Patterns', 'Expressions', 'Substitution'],
  art: toastArt,
  explore: {
    setup: 'At the kopitiam, one kaya toast set (toast, soft-boiled eggs and a drink) costs <b>$4</b>.',
    art: () => svg('0 0 340 300', `<rect width="340" height="300" rx="20" fill="#eafaf0"/>
      <rect x="40" y="18" width="260" height="56" rx="12" fill="#fff" stroke="${A.ink}" stroke-width="3"/>
      <text x="170" y="44" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="18" fill="#0f9d94">KOPITIAM MENU</text>
      <text x="170" y="64" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="800" font-size="14" fill="${A.ink}">Kaya toast set ........ $4</text>
      ${kid('chloe', { x: 80, y: 120, s: .85, pose: 'think', mood: 'think' })}
      ${leo({ x: 250, y: 130, s: .72, pose: 'point' })}
      ${A.table(20, 232, 300)}${A.kayaToast(40, 226, .7)}${A.kopi(130, 186, .7)}${A.mysteryBox(220, 162, 'n', .8)}`, 'Chloe and Leo at a kopitiam with a mystery box labelled n'),
    steps: [
      { who: 'weiming', text: '2 sets cost 2 × $4 = $8. 5 sets cost 5 × $4 = $20. Easy!' },
      { who: 'chloe', mood: 'think', text: 'But our class doesn\'t know yet how many sets we will order. How do we write the cost?' },
      { who: 'leo', text: 'Use a letter! Let <b>n</b> stand for the number of sets. The cost is n × 4 dollars. In maths we write this as <b>4n</b>, with the number first and no × sign.',
        art: () => `<table class="tbl"><tr><th>Number of sets</th><td>1</td><td>2</td><td>3</td><td>5</td><td><i>n</i></td></tr><tr><th>Cost ($)</th><td>4</td><td>8</td><td>12</td><td>20</td><td><b>4<i>n</i></b></td></tr></table>` },
      { who: 'arjun', text: 'If we order 7 sets, put 7 in place of n: 4 × 7 = <b>$28</b>. This is called <b>substituting</b>.' },
      { who: 'aisyah', text: 'Letters can stand for other things too. If I am <i>a</i> years old and my brother is 3 years older, he is <b><i>a</i> + 3</b> years old.' },
    ],
  },
  keys: [
    { title: 'A letter is a number', text: 'A letter such as <i>n</i> stands for a number we don\'t know yet, or a number that can change.' },
    { title: 'Short ways to write', text: '4 × <i>n</i> is written <b>4<i>n</i></b>. <i>n</i> + <i>n</i> + <i>n</i> = <b>3<i>n</i></b>.' },
    { title: 'Substitute', text: 'To find the value, replace the letter with the number. If <i>n</i> = 7, then 4<i>n</i> = 4 × 7 = 28.' },
    { title: 'Words → letters', text: '"5 more than <i>a</i>" = <i>a</i> + 5 · "<i>m</i> take away 7" = <i>m</i> − 7 · "3 times <i>b</i>" = 3<i>b</i>' },
  ],
  practice: [
    { id: 'a', level: 1, type: 'mcq', prompt: `A carton holds 12 eggs. How many eggs are there in ${v('b')} cartons?`,
      options: [`12${v('b')}`, `${v('b')} + 12`, `12 − ${v('b')}`, `${v('b')} ÷ 12`], answer: 0,
      hint: 'How many eggs are in 2 cartons? In 3 cartons? What do you do each time?',
      solution: `2 cartons: 12 × 2. 3 cartons: 12 × 3. So ${v('b')} cartons: 12 × ${v('b')} = <b>12${v('b')}</b> eggs.` },
    { id: 'b', level: 1, type: 'blanks', prompt: `If ${v('x')} = 5, what is the value of 4${v('x')} + 3?`,
      template: `4${v('x')} + 3 = {0}`, blanks: [{ answer: 23 }],
      hint: `4${v('x')} means 4 × ${v('x')}. Multiply first, then add.`,
      solution: ['4 × 5 = 20', '20 + 3 = <b>23</b>'] },
    { id: 'c', level: 1, type: 'mcq', prompt: `Chloe had $${v('m')}. She spent $7 at the bookshop. How much money does she have left?`,
      options: [`$(${v('m')} − 7)`, `$(${v('m')} + 7)`, `$(7 − ${v('m')})`, `$7${v('m')}`], answer: 0,
      hint: 'Spending money means taking away.',
      solution: `She started with $${v('m')} and took away $7, so she has <b>$(${v('m')} − 7)</b> left.` },
    { id: 'd', level: 2, type: 'blanks', prompt: `A rectangle is ${v('l')} cm long and 6 cm wide. Its perimeter is 2 × (${v('l')} + 6) cm. Find the perimeter when ${v('l')} = 9.`,
      template: 'Perimeter = {0} cm', blanks: [{ answer: 30 }],
      hint: 'Work out the brackets first: 9 + 6.',
      solution: ['9 + 6 = 15', '2 × 15 = <b>30 cm</b>'] },
    { id: 'e', level: 2, type: 'mcq', prompt: `Siti is ${v('y')} years old. Her father is 30 years older than her. How old will her father be in 5 years' time?`,
      options: [`${v('y')} + 35`, `${v('y')} + 30`, `${v('y')} + 5`, `35${v('y')}`], answer: 0,
      hint: `First write her father's age now. Then add 5 years.`,
      solution: [`Father's age now: ${v('y')} + 30`, `In 5 years: ${v('y')} + 30 + 5 = <b>${v('y')} + 35</b>`] },
    { id: 'f', level: 2, type: 'blanks', prompt: 'Fill in the missing numbers.',
      template: `${v('m')} + ${v('m')} + ${v('m')} + ${v('m')} = {0}${v('m')} &nbsp;&nbsp;&nbsp; 5${v('k')} − 2${v('k')} = {1}${v('k')}`, blanks: [{ answer: 4, size: 'sm' }, { answer: 3, size: 'sm' }],
      hint: `5${v('k')} means 5 lots of ${v('k')}. Take away 2 lots of ${v('k')}.`,
      solution: [`4 lots of ${v('m')} = 4${v('m')}`, `5 lots of ${v('k')} − 2 lots of ${v('k')} = 3 lots of ${v('k')} = 3${v('k')}`] },
    { id: 'g', level: 3, type: 'mcq', prompt: `Leo makes squares in a row with ice-cream sticks. Which expression gives the number of sticks needed for ${v('n')} squares?`,
      art: A.matchPattern([1, 2, 3]),
      options: [`4${v('n')}`, `3${v('n')} + 1`, `${v('n')} + 3`, `3${v('n')} + 4`], answer: 1,
      hint: 'Count the sticks: 1 square needs 4, 2 squares need 7, 3 squares need 10. How many more sticks does each new square need?',
      solution: ['Sticks: 4, 7, 10, … Each new square adds 3 sticks.', 'Think of it as 1 starting stick, plus 3 sticks for every square.', `So ${v('n')} squares need <b>3${v('n')} + 1</b> sticks. Check: when ${v('n')} = 3, 3 × 3 + 1 = 10 ✓`] },
    { id: 'h', level: 3, type: 'blanks', prompt: 'Using the same pattern, how many ice-cream sticks are needed to make <b>20</b> squares in a row?',
      template: '{0} sticks', blanks: [{ answer: 61 }],
      hint: `Substitute ${v('n')} = 20 into 3${v('n')} + 1.`,
      solution: ['3 × 20 + 1 = 60 + 1 = <b>61</b> sticks'] },
    { id: 'i', level: 3, type: 'blanks', prompt: `${v('a')} + ${v('b')} = 15 and ${v('a')} − ${v('b')} = 3. Find ${v('a')} and ${v('b')}.`,
      template: `${v('a')} = {0} &nbsp;&nbsp; ${v('b')} = {1}`, blanks: [{ answer: 9, size: 'sm' }, { answer: 6, size: 'sm' }],
      hint: `${v('a')} is 3 more than ${v('b')}. Two numbers add up to 15 and differ by 3…`,
      solution: [`If we take away the difference: 15 − 3 = 12 is two lots of ${v('b')}.`, `${v('b')} = 12 ÷ 2 = 6`, `${v('a')} = 6 + 3 = 9. Check: 9 + 6 = 15 ✓, 9 − 6 = 3 ✓`] },
  ],
  adult: 'Links to school work: P4 number patterns. Algebra is formally introduced in P6, so this topic is <b>enrichment</b>. The aim is for children to see a letter as "a number we haven\'t decided yet", and to write and substitute into simple expressions. The last question uses the same thinking as the P5/P6 "sum and difference" model method.',
};

/* ===================== Maths in Life: Spread the Risk ===================== */
const L1art = () => svg('0 0 400 230', `<rect width="400" height="230" rx="20" fill="#e9f7ff"/>
  <text x="38" y="66" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="20" fill="#d6453a">Plan</text><text x="38" y="88" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="26" fill="#d6453a">A</text>
  <text x="38" y="166" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="20" fill="#0f7a73">Plan</text><text x="38" y="188" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="26" fill="#0f7a73">B</text>
  ${A.kuehBox(76, 30, { ondeh: 12 }, { w: 98, h: 66 })}${A.kuehBox(184, 30, { lapis: 12 }, { w: 98, h: 66 })}${A.kuehBox(292, 30, { tart: 12 }, { w: 98, h: 66 })}
  <path d="M70 116 h320" stroke="#b9d7ee" stroke-width="3" stroke-dasharray="8 8"/>
  ${[0, 1, 2].map(i => A.kuehBox(76 + i * 108, 134, { ondeh: 4, lapis: 4, tart: 4 }, { w: 98, h: 66 })).join('')}`, 'Plan A: one kind of kueh per box. Plan B: every box has all three kinds');
const carry = (key, x, y, counts, mood = 'happy') => `${kid(key, { x, y, s: .8, mood, pose: mood === 'think' ? 'think' : 'stand' })}${A.kuehBox(x - 34, y + 36, counts, { w: 68, h: 40 })}`;
const L1 = {
  id: 'L1',
  title: 'Spread the Risk',
  intro: 'Why do people say "don\'t put all your eggs in one basket"? A kueh delivery on a rainy day shows us why.',
  skills: ['Reasoning', 'Sharing equally', 'Real life'],
  art: L1art,
  explore: {
    setup: 'After a baking class at the community centre, Wei Ming, Aisyah and Arjun have made <b>12 ondeh-ondeh</b>, <b>12 pieces of kueh lapis</b> and <b>12 pineapple tarts</b>. They will share them equally among their <b>3 families</b>. It has just rained, and the path home is slippery!',
    art: () => svg('0 0 340 300', `<rect width="340" height="300" rx="20" fill="#e2f3ff"/>
      ${A.cloud(30, 20, .9)}${A.cloud(220, 34, .7)}
      <path d="M0 200 q170 -30 340 0 v100 h-340z" fill="#9edcaa"/><path d="M60 300 q60 -80 140 -100 q60 -10 140 -4 v104z" fill="#e9d8b8"/>
      ${A.puddle(250, 262, 100)}
      ${carry('weiming', 70, 120, { ondeh: 4, lapis: 4, tart: 4 })}${carry('aisyah', 170, 130, { ondeh: 4, lapis: 4, tart: 4 })}${carry('arjun', 270, 120, { ondeh: 4, lapis: 4, tart: 4 }, 'think')}`, 'Three friends each carrying a box of kueh past a puddle'),
    steps: [
      { who: 'weiming', text: '<b>Plan A:</b> I carry all the ondeh-ondeh, Aisyah carries all the kueh lapis, and Arjun carries all the pineapple tarts. We share them out later.' },
      { who: 'arjun', mood: 'think', text: 'Hmm… what if one of us slips and drops a box? Then <b>nobody</b> gets that kind of kueh!' },
      { who: 'aisyah', text: '<b>Plan B:</b> each of us carries one box with <b>4 ondeh-ondeh, 4 kueh lapis and 4 pineapple tarts</b>. That\'s exactly one family\'s share.' },
      { who: 'chloe', text: 'If one box drops in Plan B, we still lose 12 pieces, the same as Plan A. But the other two families still get <b>every</b> kind of kueh.' },
      { who: 'leo', text: 'That\'s called <b>spreading the risk</b>. When something might go wrong, split things up so that one accident can\'t ruin everything. In other words: don\'t put all your eggs in one basket!' },
    ],
  },
  keys: [
    { title: 'Spread the risk', text: 'Split important things into different places, so one accident only affects a small part.' },
    { title: 'Same total, smaller damage', text: 'Spreading out does not change how much you have. It changes how much one accident can hurt.' },
    { title: 'Equal shares', text: 'To pack one family\'s share in each box, divide each kind of item by the number of boxes.' },
    { title: 'In real life', text: 'Saving your project in two places, or carrying water for a hike in every bag: that is spreading the risk too.' },
  ],
  practice: [
    { id: 'a', level: 1, type: 'mcq', prompt: 'In <b>Plan A</b>, Arjun slips and drops his box of pineapple tarts. How many pineapple tarts are left?',
      options: ['0', '4', '8', '12'], answer: 0,
      hint: 'In Plan A, where are all the pineapple tarts?',
      solution: 'In Plan A, all 12 pineapple tarts are in Arjun\'s box. If it drops, <b>0</b> are left, and no family gets any.' },
    { id: 'g', level: 1, type: 'mcq', prompt: 'Which of these is an example of <b>spreading the risk</b>?',
      options: ['Keeping all your class photos on one phone only', 'Saving your project on the school laptop <b>and</b> on a thumb drive', 'Packing all the team\'s water bottles into one bag', 'Bringing only one pencil to the exam'], answer: 1,
      hint: 'Which choice still works if one thing gets lost or broken?',
      solution: 'If the laptop breaks, the thumb drive still has the project. Keeping it in <b>two places</b> spreads the risk. The other choices put everything in one place.' },
    { id: 'b', level: 1, type: 'blanks', prompt: 'In <b>Plan B</b>, one box drops. How many <b>ondeh-ondeh</b> are left?',
      template: '{0} ondeh-ondeh', blanks: [{ answer: 8 }],
      hint: 'Each box in Plan B has 4 ondeh-ondeh. How many boxes are still safe?',
      solution: ['2 boxes are still safe.', '2 × 4 = <b>8</b> ondeh-ondeh are left.'] },
    { id: 'd', level: 1, type: 'mcq', prompt: 'Which plan makes sure that, even if one box drops, the other families still get <b>all three</b> kinds of kueh?',
      options: ['Plan A', 'Plan B', 'Both plans', 'Neither plan'], answer: 1,
      hint: 'In which plan does every box have every kind of kueh?',
      solution: 'In Plan B every box has all three kinds, so the boxes that are still safe still have ondeh-ondeh, kueh lapis and pineapple tarts. The answer is <b>Plan B</b>.' },
    { id: 'c', level: 2, type: 'blanks', prompt: 'In each plan, exactly <b>one</b> box drops. How many pieces of kueh are lost <b>altogether</b>?',
      template: 'Plan A: {0} pieces &nbsp;&nbsp; Plan B: {1} pieces', blanks: [{ answer: 12 }, { answer: 12 }],
      hint: 'Count everything inside one box for each plan.',
      solution: ['Plan A: one box holds 12 pieces of one kind, so 12 are lost.', 'Plan B: one box holds 4 + 4 + 4 = 12 pieces, so 12 are lost.', 'Both plans lose the <b>same number</b>. Plan B just spreads the loss out.'] },
    { id: 'e', level: 2, type: 'blanks', prompt: 'Next week, <b>4</b> friends share <b>20 curry puffs</b> and <b>16 sardine puffs</b> equally among their 4 families. Each friend carries one family\'s share in a box. What goes in each box?',
      template: '{0} curry puffs and {1} sardine puffs', blanks: [{ answer: 5 }, { answer: 4 }],
      hint: 'Divide each kind by the number of boxes.',
      solution: ['Curry puffs: 20 ÷ 4 = 5', 'Sardine puffs: 16 ÷ 4 = 4', 'Each box has <b>5 curry puffs and 4 sardine puffs</b>.'] },
    { id: 'f', level: 3, type: 'blanks', prompt: 'Using the boxes in the last question, <b>2</b> of the 4 boxes get wet in the rain. How many puffs are still fine altogether?',
      template: '{0} puffs', blanks: [{ answer: 18 }],
      hint: 'How many puffs are in one box? How many boxes are still fine?',
      solution: ['One box: 5 + 4 = 9 puffs', 'Boxes still fine: 4 − 2 = 2', '2 × 9 = <b>18</b> puffs'] },
  ],
  adult: 'This "Maths in Life" page builds reasoning and fair-sharing skills (P4 multiplication and division). The big idea, spreading risk (diversification), shows up later in science (backups), daily life and money management. Ask your child: "Where else could we use this idea?"',
};

export default { t01, t02, t03, t04, L1 };
