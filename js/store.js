// Progress kept on this device (localStorage, falls back to memory).
const KEY = 'sgctmath:v1';
let mem = {};
function load() {
  try { const s = localStorage.getItem(KEY); return s ? JSON.parse(s) : {}; } catch { return mem; }
}
function save(d) {
  mem = d;
  try { localStorage.setItem(KEY, JSON.stringify(d)); } catch { /* private mode etc. */ }
}
// record: { status: 'first'|'later'|'shown', tries }
export function getQ(topicId, qid) { return (load()[topicId] || {})[qid]; }
export function setQ(topicId, qid, rec) {
  const d = load(); d[topicId] = d[topicId] || {}; d[topicId][qid] = rec; save(d);
}
export function topicScore(topic) {
  const recs = load()[topic.id] || {};
  const qs = topic.practice || [];
  let pts = 0, done = 0;
  for (const q of qs) {
    const r = recs[q.id]; if (!r) continue;
    done++;
    pts += r.status === 'first' ? 1 : r.status === 'later' ? 0.6 : 0;
  }
  const pct = qs.length ? pts / qs.length : 0;
  const stars = !done ? 0 : pct >= 0.9 ? 3 : pct >= 0.6 ? 2 : 1;
  return { pts, done, total: qs.length, pct, stars };
}
export function resetTopic(topicId) { const d = load(); delete d[topicId]; save(d); }
export function resetAll() { save({}); }
