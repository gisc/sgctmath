# Independent verification for js/content/unit12.js (t26 The Pigeonhole Principle).
# Every answer is recomputed by brute force, without using the ceiling formula:
#  * "at least how many share a box" -> enumerate every way of putting the items into the boxes
#    (or, for big cases, an exact search over box sizes) and take the smallest possible fullest box;
#  * "how many to be SURE" -> enumerate every multiset of picks from the real bag; check that with
#    answer - 1 picks there EXISTS a bad selection, and with answer picks EVERY selection works.
import json, os, subprocess
from itertools import combinations, product
from functools import lru_cache

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
js = """
import u from './js/content/unit12.js';
const out = {};
for (const [tid, t] of Object.entries(u)) for (const q of t.practice)
  out[tid + '/' + q.id] = q.type === 'mcq' ? q.answer : q.type === 'compare' ? q.pairs.map(p => p[2]) : q.blanks.map(b => b.answer);
console.log(JSON.stringify(out));
"""
stored = json.loads(subprocess.run(['node', '--input-type=module', '-e', js], cwd=ROOT, capture_output=True, text=True, check=True).stdout)
computed = {}

def distributions(n, k):
    """every ordered way to put n identical items into k boxes"""
    if k == 1:
        yield (n,); return
    for first in range(n + 1):
        for rest in distributions(n - first, k - 1):
            yield (first,) + rest

def min_fullest_enum(n, k):
    return min(max(d) for d in distributions(n, k))

@lru_cache(None)
def can_fill(n, k, cap):
    """can n items go into k boxes with at most cap in each box? (exact search)"""
    if k == 0: return n == 0
    return any(can_fill(n - x, k - 1, cap) for x in range(0, min(cap, n) + 1))

def min_fullest(n, k):
    """the fullest box is at least m in EVERY distribution; return the biggest such m"""
    m = 0
    while not can_fill(n, k, m): m += 1
    return m

def selections(bag, m):
    """every multiset of m picks from a bag {colour: count}"""
    cols = list(bag)
    for c in product(*[range(bag[x] + 1) for x in cols]):
        if sum(c) == m: yield dict(zip(cols, c))

def sure_number(bag, good):
    """smallest m such that EVERY selection of m is good, and with m - 1 some selection is bad"""
    total = sum(bag.values())
    for m in range(total + 1):
        if all(good(s) for s in selections(bag, m)):
            assert m == 0 or any(not good(s) for s in selections(bag, m - 1))
            return m
    raise ValueError('never sure')

# ---------- explore ----------
assert min_fullest_enum(4, 3) == 2
assert min_fullest_enum(7, 3) == 3
explore_bag = {'S': 5, 'O': 4, 'L': 3}
assert sure_number(explore_bag, lambda s: max(s.values()) >= 2) == 4
assert sure_number(explore_bag, lambda s: s['S'] >= 2) == 9
# keys: 13 pupils / 12 months -> 2 share; 7 in 3 -> 3; adult note: 12 in 4 -> 3 (not 4)
assert min_fullest(13, 12) == 2 and min_fullest(12, 4) == 3

# ---------- practice ----------
# a: 9 curry puffs in 4 boxes. Check which sentences hold for EVERY packing.
D = list(distributions(9, 4))
statements = [
    lambda d: min(d) >= 2,          # every box has at least 2
    lambda d: max(d) >= 3,          # some box has 3 or more
    lambda d: 0 in d,               # some box is empty
    lambda d: max(d) >= 4,          # some box has 4 or more
]
always = [i for i, f in enumerate(statements) if all(f(d) for d in D)]
assert len(always) == 1
computed['t26/a'] = always[0]
assert (3, 2, 2, 2) in D and (9, 0, 0, 0) in D      # the counter-examples named in the solution

# b: 38 pupils, 12 months
b = min_fullest(38, 12)
assert can_fill(38, 12, 4) and not can_fill(38, 12, 3)
assert sorted([4, 4] + [3] * 10) == sorted([4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]) and sum([4, 4] + [3] * 10) == 38
computed['t26/b'] = [38 // 12, 38 % 12, b]

# c: 12 white, 10 black socks -> sure of a matching pair
computed['t26/c'] = [sure_number({'W': 12, 'B': 10}, lambda s: max(s.values()) >= 2)]

# d: 15 of each of 4 colours -> sure of 3 the same
d_bag = {'R': 15, 'Y': 15, 'G': 15, 'B': 15}
d = sure_number(d_bag, lambda s: max(s.values()) >= 3)
computed['t26/d'] = [d - 1, d]

# e: 3 bean bags, holes worth 1/2/3 -> possible totals; 30 players
scores = {sum(t) for t in product([1, 2, 3], repeat=3)}
assert scores == set(range(3, 10))
computed['t26/e'] = [len(scores), min_fullest(30, len(scores))]

# f: smallest number of $2 notes in 12 ang baos so that EVERY packing has an ang bao with >= $10 (5 notes)
assert 10 // 2 == 5
f = next(n for n in range(1, 500) if not can_fill(n, 12, 4))
# cross-check with a smaller full enumeration of the same idea: 3 ang baos, 5 notes needed -> 13
assert next(n for n in range(1, 40) if all(max(x) >= 5 for x in distributions(n, 3))) == 13 == 3 * 4 + 1
computed['t26/f'] = [5, f, f * 2]

# g: 8 orange, 6 lemon, 5 strawberry
g_bag = {'O': 8, 'L': 6, 'S': 5}
g1 = sure_number(g_bag, lambda s: s['S'] >= 2)
g2 = sure_number(g_bag, lambda s: min(s.values()) >= 1)
computed['t26/g'] = [g1, g2]

# h: cards 1..10, sure that two picked cards add up to 11
def has11(cs): return any(a + b == 11 for a, b in combinations(cs, 2))
h = next(m for m in range(1, 11) if all(has11(c) for c in combinations(range(1, 11), m)))
assert any(not has11(c) for c in combinations(range(1, 11), h - 1))
assert not has11((1, 2, 3, 4, 5))
computed['t26/h'] = [h]

# i: columns coloured from R, W, Y with top != bottom
pats = [(t, b) for t in 'RWY' for b in 'RWY' if t != b]
def has_repeat(cols): return len(set(cols)) < len(cols)
i2 = next(m for m in range(1, 10) if all(has_repeat(c) for c in product(pats, repeat=m)))
assert any(not has_repeat(c) for c in product(pats, repeat=i2 - 1))
computed['t26/i'] = [len(pats), i2, min_fullest(20, len(pats))]

# ---------- picture counts ----------
art = subprocess.run(['node', '--input-type=module', '-e', """
import u from './js/content/unit12.js';
const t = u.t26;
const count = s => { const m = {}; for (const x of s.matchAll(/font-size="[\\d.]+" fill="#23304a">([SOL])<\\/text>/g)) m[x[1]] = (m[x[1]] || 0) + 1; return m; };
console.log(JSON.stringify({ explore: count(t.explore.steps[4].art()), g: count(t.practice[6].art) }));
"""], cwd=ROOT, capture_output=True, text=True, check=True).stdout
pic = json.loads(art)
# legend sweets add 1 of each flavour to the picture, so subtract them
assert {k: v - 1 for k, v in pic['explore'].items()} == explore_bag, pic
assert {k: v - 1 for k, v in pic['g'].items()} == g_bag, pic

ok = True
for k in sorted(stored):
    c = computed.get(k)
    match = c == stored[k]
    ok &= match
    print(f"{k}: computed {c}  stored {stored[k]}  {'OK' if match else 'MISMATCH'}")
print('explore checks OK; picture sweet counts OK')
print('ALL MATCH' if ok and len(computed) == len(stored) else 'PROBLEMS')
