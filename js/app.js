import { PARTS, UNITS } from './content/catalog.js';
import { TOPICS } from './content/index.js';
import { fmt } from './format.js';
import { renderQuestion } from './engine.js';
import { topicScore, resetTopic, resetAll } from './store.js';
import * as A from './art.js';

const main = document.getElementById('main');
document.getElementById('brandLogo').innerHTML = A.leoFace('happy');

const allTopics = UNITS.flatMap(u => u.topics.map(t => ({ ...t, unit: u })));
const starStr = n => `${'★'.repeat(n)}<span class="off">${'★'.repeat(3 - n)}</span>`;

function route() {
  const hash = location.hash || '#/';
  const [, page, arg] = hash.split('/');
  document.querySelectorAll('.topnav a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#/' + (page || '')));
  if (page === 't' && arg) renderTopic(arg);
  else if (page === 'progress') renderProgress();
  else if (page === 'about') renderAbout();
  else renderHome();
  main.focus({ preventScroll: true });
  if (!location.hash.includes('#q-')) window.scrollTo({ top: 0 });
}
window.addEventListener('hashchange', route);

function topicLink(t) {
  const ready = !!TOPICS[t.id];
  const num = `<span class="num ${t.feature ? 'feat' : ''}" style="${t.feature ? `background:${t.unit.color}22;color:${t.unit.color}` : ''}">${t.feature ? (t.n === 'Life' ? '🌏' : t.n === 'Story' ? '📜' : '★') : t.n}</span>`;
  if (!ready) return `<li><span class="soon">${num}<span>${t.title}</span><em>Coming soon</em></span></li>`;
  const sc = topicScore(TOPICS[t.id]);
  return `<li><a href="#/t/${t.id}">${num}<span>${t.title}</span><span class="stars" aria-label="${sc.stars} of 3 stars">${starStr(sc.stars)}</span></a></li>`;
}

function renderHome() {
  document.title = 'SG Maths Thinkers · Primary 4';
  const first = allTopics.find(t => TOPICS[t.id]);
  main.innerHTML = `
  <section class="hero">
    <div>
      <h1>Think like a <span>maths detective!</span></h1>
      <p>Join Leo the lion cub and friends for puzzles set around Singapore: hawker centres, the MRT and more. Every question checks your answer straight away, gives hints, and shows you how to solve it.</p>
      <a class="btn coral" href="#/t/${first.id}">Start with Topic 1 →</a>
      <a class="btn alt" href="#/about" style="margin-left:6px">For parents &amp; teachers</a>
    </div>
    <div class="hero-art">${A.heroScene()}</div>
  </section>
  ${PARTS.map(p => `
    <div class="part-head"><span class="tag" style="background:${p.color}">Part ${p.id}</span><div><h2>${p.title}</h2><p>${p.blurb}</p></div></div>
    <div class="units">${UNITS.filter(u => u.part === p.id).map(u => `
      <section class="unit">
        <div class="unit-top" style="background:${u.color}">${A.UNIT_ICONS[u.icon]()}<div><small>Unit ${u.id}</small><h3>${u.title}</h3></div></div>
        <ol>${u.topics.map(t => topicLink({ ...t, unit: u })).join('')}</ol>
      </section>`).join('')}</div>`).join('')}`;
}

const WHO = {
  leo: m => A.leoFace(m || 'teach'),
  weiming: m => A.kidFace('weiming', m), aisyah: m => A.kidFace('aisyah', m),
  arjun: m => A.kidFace('arjun', m), chloe: m => A.kidFace('chloe', m),
};

function renderTopic(id) {
  const t = TOPICS[id];
  const meta = allTopics.find(x => x.id === id);
  if (!t || !meta) { main.innerHTML = `<div class="card"><h2>That page isn't ready yet</h2><p><a href="#/">Back to home</a></p></div>`; return; }
  document.title = `${meta.title} · SG Maths Thinkers`;
  const u = meta.unit;
  const ready = allTopics.filter(x => TOPICS[x.id]);
  const i = ready.findIndex(x => x.id === id);
  const prev = ready[i - 1], next = ready[i + 1];
  const label = meta.feature ? (meta.n === 'Life' ? 'Maths in Life' : meta.n === 'Story' ? 'Maths Story' : 'Challenge') : `Topic ${meta.n}`;

  main.innerHTML = `
  <div class="crumbs"><a href="#/">Home</a> › Unit ${u.id}: ${u.title}</div>
  <section class="topic-hero" style="background:linear-gradient(135deg, ${u.color}, ${shade(u.color)})">
    <div>
      <div class="kicker">${label}</div>
      <h1>${t.title || meta.title}</h1>
      <p>${fmt(t.intro)}</p>
      <div class="chips">${(t.skills || []).map(s => `<span class="chip">${s}</span>`).join('')}</div>
    </div>
    <div class="art">${t.art ? t.art() : ''}</div>
  </section>

  <section class="section" id="explore">
    <div class="section-title"><div class="ico" style="background:var(--sun-l)">🔍</div><h2>${t.explore.title || 'Let\'s Explore'}</h2></div>
    <div class="card"><div class="story">
      <div><p style="margin-top:0">${fmt(t.explore.setup)}</p><div class="steps" id="steps"></div>
        <div class="step-controls"><button class="btn sun" id="nextStep">Next step ▶</button><button class="btn alt small" id="allSteps">Show all</button><span class="step-count" id="stepCount"></span></div></div>
      <div class="art">${t.explore.art ? t.explore.art() : ''}</div>
    </div></div>
  </section>

  <section class="section" id="keys">
    <div class="section-title"><div class="ico" style="background:var(--grape-l)">💡</div><h2>Remember</h2></div>
    <div class="keys">${t.keys.map((k, j) => { const c = ['#0f9d94', '#ff6b5b', '#7b61ff', '#f2a516'][j % 4]; return `<div class="key" style="border-color:${c};background:${c}10"><h4 style="color:${c}">${k.title}</h4><p>${fmt(k.text)}</p></div>`; }).join('')}</div>
  </section>

  <section class="section" id="practice">
    <div class="section-title"><div class="ico" style="background:var(--leaf-l)">✏️</div><h2>Practise</h2></div>
    <div class="card score-card" id="score" style="margin-bottom:18px"></div>
    <div class="qlist" id="qlist"></div>
  </section>

  ${t.adult ? `<details class="adult card"><summary>Notes for parents &amp; teachers</summary><div>${fmt(t.adult)}</div></details>` : ''}

  <div class="navrow">
    ${prev ? `<a class="btn alt" href="#/t/${prev.id}">← ${prev.feature ? prev.title : 'Topic ' + prev.n}</a>` : '<span></span>'}
    ${next ? `<a class="btn" href="#/t/${next.id}">${next.feature ? next.title : 'Topic ' + next.n + ': ' + next.title} →</a>` : `<a class="btn" href="#/">Back to all topics</a>`}
  </div>`;

  // explore steps
  const stepsEl = main.querySelector('#steps');
  let shown = 0;
  const steps = t.explore.steps;
  const addStep = () => {
    if (shown >= steps.length) return;
    const s = steps[shown++];
    const who = WHO[s.who] ? WHO[s.who](s.mood) : '';
    stepsEl.insertAdjacentHTML('beforeend', `<div class="step"><div class="who">${who}</div><div class="bubble">${fmt(s.text)}${s.art ? `<div class="art-inline">${s.art()}</div>` : ''}</div></div>`);
    main.querySelector('#stepCount').textContent = `Step ${shown} of ${steps.length}`;
    if (shown >= steps.length) { main.querySelector('#nextStep').disabled = true; main.querySelector('#nextStep').textContent = 'All done ✓'; main.querySelector('#allSteps').style.display = 'none'; }
  };
  addStep();
  main.querySelector('#nextStep').addEventListener('click', addStep);
  main.querySelector('#allSteps').addEventListener('click', () => { while (shown < steps.length) addStep(); });

  // practice
  const ql = main.querySelector('#qlist');
  const update = () => {
    const sc = topicScore(t);
    main.querySelector('#score').innerHTML = `<div class="bigstars" aria-label="${sc.stars} of 3 stars">${starStr(sc.stars)}</div>
      <div style="flex:1;min-width:200px"><b>${sc.done} of ${sc.total} questions done</b><div class="meter" style="margin-top:6px"><i style="width:${Math.round(100 * sc.done / sc.total)}%"></i></div>
      <small style="color:var(--ink-soft)">Get it right on your first try to earn the most stars. ★★★ = 90% or more.</small></div>
      <button class="btn alt small" id="resetT">Start again</button>`;
    main.querySelector('#resetT').onclick = () => { if (confirm('Clear your answers for this topic?')) { resetTopic(t.id); renderTopic(id); } };
  };
  t.practice.forEach((q, k) => ql.append(renderQuestion(q, k + 1, t.id, update)));
  update();
}

function shade(hex) {
  const n = parseInt(hex.slice(1), 16);
  const f = c => Math.max(0, Math.round(c * 0.72)).toString(16).padStart(2, '0');
  return '#' + f(n >> 16) + f((n >> 8) & 255) + f(n & 255);
}

function renderProgress() {
  document.title = 'My Stars · SG Maths Thinkers';
  const rows = allTopics.filter(t => TOPICS[t.id]).map(t => {
    const sc = topicScore(TOPICS[t.id]);
    return `<tr><td style="text-align:left"><a href="#/t/${t.id}">${t.feature ? t.title : `Topic ${t.n}: ${t.title}`}</a></td><td>${sc.done}/${sc.total}</td><td style="color:var(--sun);font-size:22px">${starStr(sc.stars)}</td></tr>`;
  }).join('');
  const total = allTopics.filter(t => TOPICS[t.id]).reduce((a, t) => a + topicScore(TOPICS[t.id]).stars, 0);
  main.innerHTML = `<div class="card" style="display:flex;gap:20px;align-items:center;flex-wrap:wrap">
    <div style="width:120px">${A.svg('-80 -70 160 200', A.leo({ pose: 'wave', mood: 'happy' }), 'Leo')}</div>
    <div><h1 style="margin:0">My Stars</h1><p style="margin:0">You have collected <b style="font-size:26px;color:var(--teal)">${total}</b> stars so far. Keep going!</p></div></div>
    <div class="card" style="margin-top:18px;overflow-x:auto"><table class="tbl" style="width:100%"><thead><tr><th style="text-align:left">Topic</th><th>Done</th><th>Stars</th></tr></thead><tbody>${rows}</tbody></table>
    <p><button class="btn alt small" id="resetAll">Clear all my progress</button></p></div>`;
  main.querySelector('#resetAll').onclick = () => { if (confirm('Clear ALL progress on this device?')) { resetAll(); renderProgress(); } };
}

function renderAbout() {
  document.title = 'For Parents & Teachers · SG Maths Thinkers';
  main.innerHTML = `<div class="card">
  <h1>For parents &amp; teachers</h1>
  <p><b>SG Maths Thinkers</b> is free, interactive enrichment practice for Primary 4 pupils. Its topic sequence follows a popular maths-thinking workbook, but every explanation, question, story and illustration here is <b>original</b> and set in everyday Singapore life.</p>
  <h3>How it works</h3>
  <ul>
    <li><b>Let's Explore</b>: a short worked example, revealed one step at a time, so children think before they see the next step.</li>
    <li><b>Remember</b>: the key ideas in a few sentences.</li>
    <li><b>Practise</b>: questions rated ★ to ★★★. A wrong first try gives a <i>hint</i>; a second wrong try shows the <i>worked solution</i>, and the child can try again. Children can also press "Show me how" at any time.</li>
    <li><b>Stars</b>: earned per topic (★★★ for 90% or more, with first-try answers counting most). Progress is stored only in this browser, so nothing is sent anywhere.</li>
  </ul>
  <h3>Syllabus fit</h3>
  <p>Many topics go <b>beyond</b> the MOE Primary 4 syllabus on purpose, for example recurring decimals and using letters for numbers. They are enrichment ideas for curious pupils. Each topic has a short note showing how it links to school work.</p>
  <h3>Typing answers</h3>
  <p>Answer boxes accept whole numbers, decimals (<code>0.625</code>), fractions (<code>7/4</code>) and mixed numbers (<code>1 3/4</code>). Fractions must be in their <b>simplest form</b>: an equal but unsimplified fraction such as <code>10/24</code> gets a gentle "simplify it" nudge. Units such as <code>cm</code> or <code>$</code> are ignored.</p>
  <p class="note">Spotted a mistake or have an idea? Let us know via the <a href="https://github.com/gisc/sgctmath/issues" rel="noopener">GitHub project page</a>.</p>
  </div>`;
}

route();
