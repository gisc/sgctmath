// Verifies every practice question: answer keys parse, MCQ indexes valid, compare symbols valid,
// and the stored answers pass the same checker the site uses.
import { TOPICS } from './js/content/index.js';
import { checkQuestion, checkBlank } from './js/engine.js';
let n = 0, bad = 0;
const fail = (t, q, m) => { bad++; console.log(`FAIL ${t}/${q.id}: ${m}`); };
for (const [tid, t] of Object.entries(TOPICS)) {
  const ids = new Set();
  for (const q of t.practice) {
    n++;
    if (ids.has(q.id)) fail(tid, q, 'duplicate id'); ids.add(q.id);
    if (!q.hint) fail(tid, q, 'no hint'); if (!q.solution) fail(tid, q, 'no solution');
    if (q.type === 'mcq') {
      const ans = [].concat(q.answer);
      if (ans.some(a => a < 0 || a >= q.options.length)) fail(tid, q, 'answer index out of range');
      if (!checkQuestion(q, ans)) fail(tid, q, 'own answer fails');
      if (new Set(q.options).size !== q.options.length) fail(tid, q, 'duplicate options');
    } else if (q.type === 'compare') {
      if (q.pairs.some(p => !['<', '=', '>'].includes(p[2]))) fail(tid, q, 'bad symbol');
      if (!checkQuestion(q, q.pairs.map(p => p[2]))) fail(tid, q, 'own answer fails');
    } else if (q.type === 'blanks') {
      const slots = new Set([...q.template.matchAll(/\{(?:[mf]:)?([\d,]+)\}/g)].flatMap(m => m[1].split(',').map(Number)));
      if (slots.size !== q.blanks.length) fail(tid, q, `template has ${slots.size} slots, ${q.blanks.length} blanks`);
      if (!checkQuestion(q, q.blanks.map(b => [].concat(b.answer)[0]))) fail(tid, q, 'own answer fails');
    } else fail(tid, q, 'unknown type ' + q.type);
  }
}
// parser sanity
const pc = [[{ answer: 0.625 }, '.625', true], [{ answer: 0.625 }, '5/8', true], [{ answer: 2.75 }, '2 3/4', true], [{ answer: 30 }, '30 cm', true], [{ answer: 30 }, '$30', true], [{ answer: 30 }, '3O', false], [{ answer: 7 }, '', false]];
for (const [b, v, exp] of pc) if (checkBlank(b, v) !== exp) { bad++; console.log('PARSER FAIL', b, v); }
console.log(`${n} questions checked, ${bad} problems`);
process.exit(bad ? 1 : 0);
