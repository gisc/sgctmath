# Independent verification for js/content/unit6.js (t16 Average, t17 Excess and Shortage).
# Average answers are recomputed from totals; excess/shortage answers are found by brute-force search
# over (people, total) and then SIMULATED: each plan is carried out and its leftover/shortage checked.
import json, os, subprocess
from fractions import Fraction as F

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
js = """
import u from './js/content/unit6.js';
const out = {};
for (const [tid, t] of Object.entries(u)) for (const q of t.practice)
  out[tid + '/' + q.id] = q.type === 'mcq' ? q.answer : q.type === 'compare' ? q.pairs.map(p => p[2]) : q.blanks.map(b => b.answer);
console.log(JSON.stringify(out));
"""
stored = json.loads(subprocess.run(['node', '--input-type=module', '-e', js], cwd=ROOT, capture_output=True, text=True, check=True).stdout)
computed, notes = {}, {}
avg = lambda xs: F(sum(xs), len(xs))

# ---------------- t16 ----------------
computed['t16/a'] = [int(avg([35, 50, 40, 55]))]
assert avg([35, 50, 40, 55]) == 45
# b: search the 5th mark (0..20) whose 5-test average is 16
fifth = [m for m in range(0, 21) if avg([15, 18, 13, 17, m]) == 16]
assert len(fifth) == 1
computed['t16/b'] = [16 * 5, fifth[0]]
# c: simulate moving k pieces from A to B only; find k making all plates equal
plates = [11, 5, 8]
ks = [k for k in range(0, 12) if len({plates[0] - k, plates[1] + k, plates[2]}) == 1]
assert len(ks) == 1
computed['t16/c'] = [plates[0] - ks[0], ks[0]]
# d: Daniel's height by search
d = [h for h in range(100, 220) if avg([150] * 4 + [h]) == 152]
assert len(d) == 1; computed['t16/d'] = d
# e: lowest mark by search; also check it really is lowest-possible-consistent (<= every other mark average)
e = [m for m in range(0, 51) if F(200 - m, 4) == 42]
assert len(e) == 1 and e[0] <= 42; computed['t16/e'] = e
# f: combined average; distractors must differ from truth
f = F(12 * 85 + 18 * 75, 30)
opts = ['80', '79', '81', '77']
assert sum(F(o) == f for o in opts) == 1
computed['t16/f'] = [F(o) == f for o in opts].index(True)
notes['t16/f'] = f'combined={f}'
# g: number of boys by search
g = [b for b in range(1, 100) if F(18 * 14 + b * 9, 18 + b) == 12]
assert len(g) == 1; computed['t16/g'] = g
# h: boys/girls by search
h = [(b, b + 6) for b in range(1, 100) if F(b * 32 + (b + 6) * 26, 2 * b + 6) == 28]
assert len(h) == 1; computed['t16/h'] = list(h[0])
# i: any class average A and any spread works; check for several A and top-8 scores
diffs = set()
for A in range(20, 80):
    tot = 24 * A
    top = 8 * (A + 6)
    other_avg = F(tot - top, 16)
    diffs.add(A - other_avg)
assert len(diffs) == 1; computed['t16/i'] = [int(diffs.pop())]
# explore/keys arithmetic
assert avg([12, 7, 9, 8]) == 9 and avg([12, 7, 9, 8, 14]) == 10
assert (12 - 9) == (9 - 7) + (9 - 8)
assert F(10 * 12 + 20 * 9, 30) == 10 and 10 * 2 == 20 * 1
assert avg([6, 2, 5, 3]) == 4

# ---------------- t17 ----------------
def plan(total, people, each):
    """Carry out a sharing plan: return +left over, or -shortage."""
    given = 0
    for _ in range(people):
        given += each
    return total - given

def solve(conds, maxp=300, maxt=5000):
    """conds: list of (each, result) where result = +left/-short. Return all (people, total)."""
    return [(p, t) for p in range(1, maxp) for t in range(0, maxt)
            if all(plan(t, p, e) == r for e, r in conds)]

sol = solve([(4, 9), (6, -5)]); assert len(sol) == 1
computed['t17/a'] = [sol[0][0], sol[0][0], sol[0][1]]
sol = solve([(6, 20), (8, 4)]); assert len(sol) == 1; computed['t17/b'] = list(sol[0])
sol = solve([(8, -18), (6, -4)]); assert len(sol) == 1; computed['t17/c'] = list(sol[0])
sol = solve([(7, 11), (9, -5)]); assert len(sol) == 1
n = sol[0][0]
exprs = [(11 + 5) / (9 - 7), (11 - 5) / (9 - 7), (11 + 5) / (9 + 7), (9 - 7) / (11 + 5)]
assert sum(x == n for x in exprs) == 1
computed['t17/d'] = exprs.index(n); notes['t17/d'] = f'children={n} stickers={sol[0][1]}'
sol = solve([(10, 24), (13, 0)]); assert len(sol) == 1; computed['t17/e'] = list(sol[0])
# f: planned days D, cranes C: C/20 = D+2 and C/30 = D-2 (simulate day by day)
def days_needed(C, rate):
    d, done = 0, 0
    while done < C:
        done += rate; d += 1
    return d if done == C else None
fs = [(D, C) for D in range(3, 100) for C in range(1, 5000) if days_needed(C, 20) == D + 2 and days_needed(C, 30) == D - 2]
assert len(fs) == 1; computed['t17/f'] = list(fs[0])
# g: plan 1: 5 each, 28 left; plan 2: 4 pupils get 6, the rest get 9, exact
gs = [(p, t) for p in range(5, 200) for t in range(0, 3000) if plan(t, p, 5) == 28 and t - (4 * 6 + (p - 4) * 9) == 0]
assert len(gs) == 1; computed['t17/g'] = list(gs[0])
# h: pencils = 3 * erasers; each member 4 pencils & 1 eraser; 14 pencils and 10 erasers left
hs = [(m, 3 * er) for m in range(1, 300) for er in range(1, 1000) if plan(3 * er, m, 4) == 14 and plan(er, m, 1) == 10]
assert len(hs) == 1; computed['t17/h'] = list(hs[0]); notes['t17/h'] = f'erasers={hs[0][1] // 3}'
# i: rooms R, pupils P: 6 per room -> 4 without a room; 8 per room -> exactly R-2 full rooms, 2 empty
is_ = []
for R in range(3, 200):
    for P in range(1, 2000):
        if P - 6 * R == 4 and P % 8 == 0 and P // 8 == R - 2:
            is_.append((R, P))
assert len(is_) == 1
R, P = is_[0]
opts = [(10, 64), (3, 22), (8, 64), (6, 40)]
assert sum(o == (R, P) for o in opts) == 1
computed['t17/i'] = opts.index((R, P)); notes['t17/i'] = f'rooms={R} pupils={P}'
# explore and banner arithmetic
assert solve([(3, 10), (5, -6)]) == [(8, 34)]
assert solve([(3, 10), (4, 2)]) == [(8, 34)]
assert solve([(4, 3), (5, -1)]) == [(4, 19)]   # banner: 4 cups of pencils

bad = 0
for k in stored:
    ok = json.dumps(computed.get(k)) == json.dumps(stored[k])
    bad += not ok
    print(f"{'OK ' if ok else 'BAD'} {k:7} computed={computed.get(k)} stored={stored[k]} {notes.get(k, '')}")
missing = set(computed) - set(stored)
if missing: print('computed but not stored:', missing); bad += 1
print(f'{len(stored)} questions, {bad} problems')
