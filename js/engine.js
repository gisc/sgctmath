import { fmt, parseNum, sameNum, norm } from './format.js';
import { getQ, setQ } from './store.js';
import { leoFace } from './art.js';

const PRAISE = ['Well done!', 'Spot on!', 'Excellent thinking!', 'Shiok! You got it!', 'Brilliant!', 'Correct — great work!', 'Steady lah! Correct!'];
const TRY = ['Not quite yet…', 'Almost! Have another go.', 'Hmm, check again.', 'Good try! Look at the hint.'];
const pick = a => a[Math.floor(Math.random() * a.length)];
const LETTERS = 'ABCDEF';

function h(tag, attrs = {}, html = '') {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') e.className = v; else if (k.startsWith('on')) e.addEventListener(k.slice(2), v); else e.setAttribute(k, v);
  }
  if (html) e.innerHTML = html;
  return e;
}

// ----- checking (pure; also used by the test script) -----
export function checkBlank(b, val) {
  const answers = Array.isArray(b.answer) ? b.answer : [b.answer];
  if (b.kind === 'text') return answers.some(a => norm(a) === norm(val));
  const v = parseNum(val);
  return answers.some(a => sameNum(v, typeof a === 'number' ? a : parseNum(a)));
}
export function checkQuestion(q, resp) {
  if (q.type === 'mcq') {
    const ans = [].concat(q.answer).sort().join(',');
    return [...resp].sort().join(',') === ans;
  }
  if (q.type === 'compare') return q.pairs.every((p, i) => resp[i] === p[2]);
  if (q.type === 'blanks') return q.blanks.every((b, i) => checkBlank(b, resp[i]));
  return false;
}

// Template tokens: {0}  simple input;  {f:0,1} fraction input;  {m:0,1,2} mixed-number input
function renderTemplate(tpl, blanks) {
  return fmt(tpl)
    .replace(/\{m:(\d+),(\d+),(\d+)\}/g, (_, a, b, c) => `<span class="mixin">${inp(a, blanks, 'sm')}<span class="fin">${inp(b, blanks, 'sm')}<span class="bar"></span>${inp(c, blanks, 'sm')}</span></span>`)
    .replace(/\{f:(\d+),(\d+)\}/g, (_, a, b) => `<span class="fin">${inp(a, blanks, 'sm')}<span class="bar"></span>${inp(b, blanks, 'sm')}</span>`)
    .replace(/\{(\d+)\}/g, (_, a) => inp(a, blanks, blanks[a]?.size || ''));
}
function inp(i, blanks, size) {
  const b = blanks[i] || {};
  const mode = b.kind === 'text' ? 'text' : 'decimal';
  return `<input class="blank ${size}" data-i="${i}" inputmode="${mode}" autocomplete="off" aria-label="${b.label || 'answer ' + (+i + 1)}">`;
}

export function renderQuestion(q, n, topicId, onChange) {
  const el = h('article', { class: 'q', id: 'q-' + q.id });
  const lv = q.level || 1;
  el.innerHTML = `<div class="q-head"><div class="q-num">${n}</div>
    <div class="q-level" title="Difficulty ${lv} of 3">${'★'.repeat(lv)}<span class="off">${'★'.repeat(3 - lv)}</span></div>
    <span class="q-tag"></span></div>
    <div class="q-prompt">${fmt(q.prompt)}</div>
    ${q.art ? `<div class="q-art">${q.art}</div>` : ''}`;
  const body = h('div', { class: 'q-body' });
  el.append(body);
  let resp;          // current response
  let tries = 0;
  let locked = false;

  // ---- build interaction ----
  if (q.type === 'mcq') {
    const multi = Array.isArray(q.answer);
    resp = new Set();
    if (multi) body.append(h('p', { class: 'q-sub' }, '<small><b>Choose all</b> that are correct.</small>'));
    const box = h('div', { class: 'opts' });
    q.options.forEach((o, i) => {
      const b = h('button', { class: 'opt' + (multi ? ' multi' : ''), type: 'button', 'aria-pressed': 'false' },
        `<span class="mark">${LETTERS[i]}</span><span>${fmt(o)}</span>`);
      b.addEventListener('click', () => {
        if (locked) return;
        if (multi) { resp.has(i) ? resp.delete(i) : resp.add(i); }
        else { resp.clear(); resp.add(i); }
        box.querySelectorAll('.opt').forEach((x, j) => { x.classList.toggle('sel', resp.has(j)); x.setAttribute('aria-pressed', resp.has(j)); x.classList.remove('wrong'); });
      });
      box.append(b);
    });
    body.append(box);
  } else if (q.type === 'compare') {
    resp = q.pairs.map(() => null);
    q.pairs.forEach((p, i) => {
      const row = h('div', { class: 'cmp-row' }, `<span class="cmp-side">${fmt(p[0])}</span><span class="cmp-btns"></span><span class="cmp-side">${fmt(p[1])}</span>`);
      const btns = row.querySelector('.cmp-btns');
      ['<', '=', '>'].forEach(sym => {
        const b = h('button', { class: 'cmp-btn', type: 'button', 'aria-label': { '<': 'is less than', '=': 'is equal to', '>': 'is greater than' }[sym] }, sym === '<' ? '&lt;' : sym === '>' ? '&gt;' : '=');
        b.dataset.sym = sym;
        b.addEventListener('click', () => {
          if (locked) return;
          resp[i] = sym;
          btns.querySelectorAll('.cmp-btn').forEach(x => { x.classList.toggle('sel', x.dataset.sym === sym); x.classList.remove('wrong'); });
        });
        btns.append(b);
      });
      body.append(row);
    });
  } else if (q.type === 'blanks') {
    body.append(h('div', { class: 'blanks' }, renderTemplate(q.template, q.blanks)));
    body.querySelectorAll('.blank').forEach(i => {
      i.addEventListener('input', () => i.classList.remove('bad', 'ok'));
      i.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
    });
  }

  const actions = h('div', { class: 'q-actions' });
  const checkBtn = h('button', { class: 'btn', type: 'button' }, 'Check my answer');
  const showBtn = h('button', { class: 'btn alt small', type: 'button' }, 'Show me how');
  const againBtn = h('button', { class: 'btn alt small', type: 'button', style: 'display:none' }, '↻ Try it again');
  actions.append(checkBtn, showBtn, againBtn);
  el.append(actions);
  const fb = h('div', { class: 'feedback', role: 'status', 'aria-live': 'polite' });
  el.append(fb);

  checkBtn.addEventListener('click', check);
  showBtn.addEventListener('click', () => { if (!locked) finish('shown'); else toggleSolution(); });
  againBtn.addEventListener('click', resetQ);

  function readResp() {
    if (q.type === 'blanks') return [...body.querySelectorAll('.blank')].sort((a, b) => a.dataset.i - b.dataset.i).map(i => i.value);
    if (q.type === 'mcq') return [...resp];
    return resp;
  }
  function incomplete(r) {
    if (q.type === 'mcq') return r.length === 0;
    if (q.type === 'compare') return r.some(x => !x);
    return r.some(x => String(x).trim() === '');
  }
  function check() {
    if (locked) return;
    const r = readResp();
    if (incomplete(r)) { say('try', 'Finish first!', q.type === 'mcq' ? 'Pick an answer, then press <b>Check</b>.' : 'Fill in every answer first.'); return; }
    if (checkQuestion(q, r)) { finish(tries === 0 ? 'first' : 'later'); return; }
    tries++;
    markWrong(r);
    if (tries >= 2) { finish('shown', true); return; }
    say('try', pick(TRY), q.hint ? `<b>Hint:</b> ${fmt(q.hint)}` : 'Read the question again carefully.');
  }
  function markWrong(r) {
    if (q.type === 'mcq') body.querySelectorAll('.opt').forEach((x, j) => x.classList.toggle('wrong', r.includes(j) && ![].concat(q.answer).includes(j)));
    if (q.type === 'compare') body.querySelectorAll('.cmp-row').forEach((row, i) => row.querySelectorAll('.cmp-btn').forEach(b => b.classList.toggle('wrong', b.dataset.sym === r[i] && r[i] !== q.pairs[i][2])));
    if (q.type === 'blanks') body.querySelectorAll('.blank').forEach(i => { const ok = checkBlank(q.blanks[i.dataset.i], i.value); i.classList.toggle('bad', !ok); i.classList.toggle('ok', ok); });
  }
  function showAnswers() {
    if (q.type === 'mcq') body.querySelectorAll('.opt').forEach((x, j) => { x.disabled = true; x.classList.toggle('right', [].concat(q.answer).includes(j)); });
    if (q.type === 'compare') body.querySelectorAll('.cmp-row').forEach((row, i) => row.querySelectorAll('.cmp-btn').forEach(b => { b.disabled = true; if (b.dataset.sym === q.pairs[i][2]) { b.classList.add('right'); b.classList.remove('wrong'); } }));
    if (q.type === 'blanks') body.querySelectorAll('.blank').forEach(i => {
      const b = q.blanks[i.dataset.i];
      if (!checkBlank(b, i.value)) { i.value = [].concat(b.answer)[0]; i.classList.remove('bad'); i.classList.add('ok'); i.style.fontStyle = 'italic'; }
      else i.classList.add('ok');
      i.readOnly = true;
    });
  }
  function finish(status, afterTwo = false) {
    locked = true;
    const prev = getQ(topicId, q.id);
    // never downgrade a better earlier result
    const rank = { first: 3, later: 2, shown: 1 };
    const keep = prev && rank[prev.status] > rank[status] ? prev.status : status;
    setQ(topicId, q.id, { status: keep, tries });
    showAnswers();
    checkBtn.style.display = 'none';
    againBtn.style.display = status === 'first' ? 'none' : '';
    showBtn.textContent = 'Hide solution';
    if (status === 'shown') {
      say('sol', afterTwo ? 'Let\'s look at it together' : 'Here\'s how to do it', solutionHTML(), afterTwo ? 'Read the steps, then press <b>Try it again</b> to have another go.' : '');
    } else {
      say('good', pick(PRAISE), (q.explain ? fmt(q.explain) : '') + solutionHTML(), '');
    }
    tag();
    onChange && onChange();
    if (status === 'first') burst();
  }
  function solutionHTML() {
    const s = q.solution;
    if (!s) return '';
    const inner = Array.isArray(s) ? `<ol>${s.map(x => `<li>${fmt(x)}</li>`).join('')}</ol>` : fmt(s);
    return `<div class="solution"><b>Worked solution</b>${inner}</div>`;
  }
  function toggleSolution() {
    const s = fb.querySelector('.solution');
    if (s) { const hid = s.style.display === 'none'; s.style.display = hid ? '' : 'none'; showBtn.textContent = hid ? 'Hide solution' : 'Show solution'; }
  }
  function say(kind, title, html, extra = '') {
    const mood = kind === 'good' ? 'happy' : kind === 'try' ? 'think' : 'teach';
    fb.className = 'feedback show ' + kind;
    fb.innerHTML = `<div class="fb-ico">${leoFace(mood)}</div><div><h4>${title}</h4>${html}${extra ? `<p>${extra}</p>` : ''}</div>`;
  }
  function resetQ() {
    locked = false; tries = 0;
    checkBtn.style.display = ''; againBtn.style.display = 'none'; showBtn.textContent = 'Show me how';
    fb.className = 'feedback'; fb.innerHTML = '';
    if (q.type === 'mcq') { resp.clear(); body.querySelectorAll('.opt').forEach(x => { x.disabled = false; x.className = 'opt' + (Array.isArray(q.answer) ? ' multi' : ''); }); }
    if (q.type === 'compare') { resp = q.pairs.map(() => null); body.querySelectorAll('.cmp-btn').forEach(b => { b.disabled = false; b.className = 'cmp-btn'; }); }
    if (q.type === 'blanks') body.querySelectorAll('.blank').forEach(i => { i.value = ''; i.readOnly = false; i.className = i.className.replace(/\b(ok|bad)\b/g, '').trim(); i.style.fontStyle = ''; });
    el.classList.remove('correct', 'revealed');
  }
  function tag() {
    const r = getQ(topicId, q.id);
    const t = el.querySelector('.q-tag');
    el.classList.toggle('correct', !!r && r.status !== 'shown');
    el.classList.toggle('revealed', !!r && r.status === 'shown');
    if (!r) { t.className = 'q-tag'; t.textContent = 'Not tried'; return; }
    t.className = 'q-tag ' + (r.status === 'shown' ? 'seen' : 'done');
    t.textContent = r.status === 'first' ? '✓ First try!' : r.status === 'later' ? '✓ Solved' : 'Solution seen';
  }
  tag();
  return el;
}

function burst() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const c = h('div', { class: 'confetti' });
  const cols = ['#ff6b5b', '#ffc94a', '#3dbb6b', '#4aa8ff', '#7b61ff', '#0f9d94'];
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('i');
    p.style.left = Math.random() * 100 + 'vw';
    p.style.background = pick(cols);
    p.style.animationDelay = Math.random() * 0.3 + 's';
    p.style.animationDuration = 1 + Math.random() * 0.8 + 's';
    c.append(p);
  }
  document.body.append(c);
  setTimeout(() => c.remove(), 2200);
}
