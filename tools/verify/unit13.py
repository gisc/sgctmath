# Independent verification for js/content/unit13.js (CZ Mixed Challenge Problems).
# Every answer is recomputed by brute force or simulation, not by the method shown in the solutions.
import itertools, json, os, subprocess
from fractions import Fraction as F

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
js = """
import u from './js/content/unit13.js';
const out = {};
for (const [tid, t] of Object.entries(u)) for (const q of t.practice)
  out[tid + '/' + q.id] = q.type === 'mcq' ? q.answer : q.type === 'compare' ? q.pairs.map(p => p[2]) : q.blanks.map(b => b.answer);
console.log(JSON.stringify(out));
"""
stored = json.loads(subprocess.run(['node', '--input-type=module', '-e', js], cwd=ROOT, capture_output=True, text=True, check=True).stdout)
computed, notes = {}, {}

# ---------------- Explore: 9 buses (45 or 30 seats), 345 people, every seat taken ----------------
ex = [(c, 9 - c) for c in range(10) if 45 * c + 30 * (9 - c) == 345]
assert ex == [(5, 4)], ex
assert 5 * 320 + 4 * 240 == 2560
assert 9 * 45 == 405 and 405 - 345 == 60 and 45 - 30 == 15 and 60 // 15 == 4
assert [c * 45 + (9 - c) * 30 for c in (9, 8, 7, 6, 5)] == [405, 390, 375, 360, 345]

# ---------------- a: 37 adult + 37 child tickets ----------------
computed['CZ/a'] = [sum([18] * 37) + sum([12] * 37)]
assert 37 * 18 == 666 and 37 * 12 == 444

# ---------------- b: digits printed on pages 8..64 (count characters) ----------------
computed['CZ/b'] = [sum(len(str(p)) for p in range(8, 65))]
assert sum(1 for p in range(10, 65)) == 55

# ---------------- c: average re-marking; check with many random valid score sets ----------------
import random
random.seed(13)
avgs = set()
for _ in range(2000):
    others = [random.randint(0, 40) for _ in range(3)]
    hornbill = 90 - 13 - sum(others)          # total must be 18 * 5 = 90
    if hornbill < 3: continue                 # Hornbill must have at least 3 marks to lose 3
    before = [others[0], hornbill, 13, others[1], others[2]]
    assert F(sum(before), 5) == 18
    after = [others[0], hornbill - 3, 21, others[1], others[2]]
    avgs.add(F(sum(after), 5))
assert len(avgs) == 1
computed['CZ/c'] = [int(avgs.pop())]

# ---------------- d: regular pentagram, measured with coordinates ----------------
import math
R = 1.0
V = [(R * math.cos(math.radians(-90 + 72 * k)), R * math.sin(math.radians(-90 + 72 * k))) for k in range(5)]
def ang(P, A, B):
    a1 = math.atan2(A[1] - P[1], A[0] - P[0]); a2 = math.atan2(B[1] - P[1], B[0] - P[0])
    d = abs(a1 - a2) % (2 * math.pi); return math.degrees(min(d, 2 * math.pi - d))
# a star point: tip V0, its two star edges go to V2 and V3
tips = [ang(V[k], V[(k + 2) % 5], V[(k + 3) % 5]) for k in range(5)]
assert all(abs(t - 36) < 1e-9 for t in tips)
# inner pentagon corner should be 108 (the given fact), and b = 180 - 108 = 72
def inter(p1, p2, p3, p4):
    x1, y1 = p1; x2, y2 = p2; x3, y3 = p3; x4, y4 = p4
    den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
    t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den
    return (x1 + t * (x2 - x1), y1 + t * (y2 - y1))
I = [inter(V[k], V[(k + 2) % 5], V[(k + 1) % 5], V[(k + 4) % 5]) for k in range(5)]
pent = [ang(I[k], I[(k + 1) % 5], I[(k - 1) % 5]) for k in range(5)]
assert all(abs(p - 108) < 1e-6 for p in pent), pent
computed['CZ/d'] = [round(tips[0]), round(sum(tips))]

# ---------------- e: banners with 3 stripes, 4 colours, touching stripes differ ----------------
ban = [s for s in itertools.product('RWBY', repeat=3) if s[0] != s[1] and s[1] != s[2]]
computed['CZ/e'] = [len(ban)]
notes['CZ/e'] = f'(wrong idea all different: {sum(1 for s in ban if s[0] != s[2])})'

# ---------------- f: simulate the kuih bangkit story for every starting number ----------------
def run(n):
    if n % 3: return None
    n -= n // 3 + 2
    if n < 0 or n % 2: return None
    n -= n // 2 + 3
    return n
f = [n for n in range(1, 1000) if run(n) == 7]
assert len(f) == 1, f
computed['CZ/f'] = f

# ---------------- g: SING x 4 = GNIS, all digit assignments ----------------
g = [p for p in itertools.permutations(range(10), 4)
     if p[0] and p[3] and (1000 * p[0] + 100 * p[1] + 10 * p[2] + p[3]) * 4 == 1000 * p[3] + 100 * p[2] + 10 * p[1] + p[0]]
assert len(g) == 1, g
computed['CZ/g'] = list(g[0])

# ---------------- h: Venn, by searching all 8 region counts consistent with the data ----------------
sols = set()
for allx in [4]:
    for cl in range(0, 41):
        for ls in range(0, 41):
            for cs in range(0, 41):
                if cl + allx != 9 or ls + allx != 7 or cs + allx != 10: continue
                c = 22 - cl - cs - allx; l = 18 - cl - ls - allx; s = 20 - ls - cs - allx
                if min(c, l, s) < 0: continue
                none = 40 - (c + l + s + cl + ls + cs + allx)
                if none < 0: continue
                sols.add((none, c + l + s))
assert len(sols) == 1, sols
# cross-check with a list of 40 pupils built from the regions
none, one = sols.pop()
pupils = [{'C'}] * 7 + [{'L'}] * 6 + [{'S'}] * 7 + [{'C', 'L'}] * 5 + [{'L', 'S'}] * 3 + [{'C', 'S'}] * 6 + [{'C', 'L', 'S'}] * 4 + [set()] * 2
assert len(pupils) == 40
cnt = lambda *k: sum(1 for p in pupils if set(k) <= p)
assert (cnt('C'), cnt('L'), cnt('S'), cnt('C', 'L'), cnt('L', 'S'), cnt('C', 'S'), cnt('C', 'L', 'S')) == (22, 18, 20, 9, 7, 10, 4)
computed['CZ/h'] = [none, one]

# ---------------- i: worst case, by checking every possible handful ----------------
counts = {'r': 10, 'w': 8, 'b': 6, 'g': 3}
def handfuls(k):  # all colour-count combinations of size k that the bag allows
    for r in range(min(10, k) + 1):
        for w in range(min(8, k - r) + 1):
            for b in range(min(6, k - r - w) + 1):
                gg = k - r - w - b
                if 0 <= gg <= 3: yield (r, w, b, gg)
sure3 = min(k for k in range(1, 28) if all(max(h) >= 3 for h in handfuls(k)))
sureall = min(k for k in range(1, 28) if all(min(h) >= 1 for h in handfuls(k)))
computed['CZ/i'] = [sure3, sureall]

# ---------------- compare ----------------
ok = True
for k in stored:
    c = computed.get(k)
    s = stored[k]
    good = c is not None and [float(x) for x in c] == [float(x) for x in s]
    ok &= good
    print(f"{k}: computed {c} stored {s} {'OK' if good else 'MISMATCH'} {notes.get(k, '')}")
assert set(stored) == set(computed), set(stored) ^ set(computed)
print('ALL MATCH' if ok else 'PROBLEMS')
