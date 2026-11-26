# Independent verification for js/content/unit10.js (t24 Lining Up with Special Conditions).
# Every count is recomputed by brute force: itertools generates every selection / arrangement,
# and the special condition is applied as a filter. Nothing uses the multiplication formula.
import json, os, subprocess
from itertools import permutations, product

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
js = """
import u from './js/content/unit10.js';
const out = {};
for (const [tid, t] of Object.entries(u)) for (const q of t.practice)
  out[tid + '/' + q.id] = q.type === 'mcq' ? q.answer : q.type === 'compare' ? q.pairs.map(p => p[2]) : q.blanks.map(b => b.answer);
console.log(JSON.stringify(out));
"""
stored = json.loads(subprocess.run(['node', '--input-type=module', '-e', js], cwd=ROOT, capture_output=True, text=True, check=True).stdout)
computed, notes = {}, {}

def adjacent(row, a, b):              # a and b side by side in a straight row
    return abs(row.index(a) - row.index(b)) == 1

# ---------- explore ----------
sets = list(product(['Chicken rice', 'Nasi lemak', 'Mee goreng'], ['Teh', 'Bandung']))
assert len(sets) == 6
kids = ['Wei Ming', 'Aisyah', 'Arjun', 'Chloe']
rows = list(permutations(kids))
assert len(rows) == 24
assert sum(adjacent(r, 'Aisyah', 'Arjun') for r in rows) == 12
assert sum(not adjacent(r, 'Wei Ming', 'Chloe') for r in rows) == 12
assert len(list(product(range(3), range(2)))) == 6        # key card: 3 T-shirts x 2 shorts

# ---------- practice ----------
# a: 5 mains x 3 drinks
mains = ['Chicken rice', 'Nasi lemak', 'Mee soto', 'Fishball noodles', 'Roti prata']
drinks = ['Milo', 'Lime juice', 'Soya bean milk']
computed['t24/a'] = [len(set(product(mains, drinks)))]
# b: routes A/B/C then 1/2; options are the strings '5 ways', '6 ways', ...
trips = list(product('ABC', '12'))
opts_b = [5, 6, 8, 9]
assert opts_b.count(len(trips)) == 1 and 3 + 2 == 5
computed['t24/b'] = opts_b.index(len(trips))
# c: 3-digit numbers from cards 2,4,7,9, different cards
c = {int(''.join(p)) for p in permutations('2479', 3)}
assert min(c) == 247 and max(c) == 974
computed['t24/c'] = [len(c)]
# d: cards 0,3,6,8, no leading zero
d = {''.join(p) for p in permutations('0368', 3) if p[0] != '0'}
assert len({''.join(p) for p in permutations('0368', 3)}) == 24      # the "forgot the 0 rule" distractor in the solution
computed['t24/d'] = [len(d)]
# e: 5 Scouts, Daniel and Ravi at the two ends
scouts = ['Daniel', 'Ravi', 'Hafiz', 'Jun Jie', 'Kumar']
computed['t24/e'] = [sum(1 for r in permutations(scouts) if {r[0], r[-1]} == {'Daniel', 'Ravi'})]
# f: 5 dancers, Nurul and Farah together; also the two intermediate blanks
dancers = ['Nurul', 'Farah', 'Siti', 'Priya', 'Mei Ling']
f_total = sum(adjacent(r, 'Nurul', 'Farah') for r in permutations(dancers))
f_block = len(list(permutations(['NF-block', 'Siti', 'Priya', 'Mei Ling'])))
f_inside = len(list(permutations(['Nurul', 'Farah'])))
assert f_block * f_inside == f_total
computed['t24/f'] = [f_block, f_inside, f_total]
# g: 5 friends, Jun Jie and Hafiz NOT together; options 48, 72, 96, 120
friends = ['Jun Jie', 'Hafiz', 'Mei Ling', 'Priya', 'Daniel']
g = sum(not adjacent(r, 'Jun Jie', 'Hafiz') for r in permutations(friends))
g_together = sum(adjacent(r, 'Jun Jie', 'Hafiz') for r in permutations(friends))
opts_g = [48, 72, 96, 120]
assert opts_g.count(g) == 1 and g_together == 48 and len(list(permutations(friends))) == 120
# gaps method: line up the other 3, choose 2 different gaps (ordered)
gaps = sum(1 for _ in permutations(['Mei Ling', 'Priya', 'Daniel'])) * len(list(permutations(range(4), 2)))
assert gaps == g
computed['t24/g'] = opts_g.index(g)
# h: books M1 M2 S1 S2 S3 D; Maths together and Science together
books = ['M1', 'M2', 'S1', 'S2', 'S3', 'D']
def together(row, group):
    pos = sorted(row.index(b) for b in group)
    return pos[-1] - pos[0] == len(group) - 1
computed['t24/h'] = [sum(1 for r in permutations(books) if together(r, ['M1', 'M2']) and together(r, ['S1', 'S2', 'S3']))]
# i: round table, seats 1..5, Ah Gong in seat 1, Mei Ling & Jun Hao in neighbouring seats
def round_next(s, t, n=5):
    return (s - t) % n in (1, n - 1)
people = ['Mei Ling', 'Jun Hao', 'Mum', 'Dad']
i_count = 0
for p in permutations(people):
    seat = {name: k + 2 for k, name in enumerate(p)}     # seats 2..5
    if round_next(seat['Mei Ling'], seat['Jun Hao']): i_count += 1
assert not round_next(2, 5) and round_next(1, 5) and round_next(1, 2)
computed['t24/i'] = [i_count]

bad = 0
for k in stored:
    ok = json.dumps(computed.get(k)) == json.dumps(stored[k])
    bad += not ok
    print(f"{'OK ' if ok else 'BAD'} {k:7} computed={computed.get(k)} stored={stored[k]} {notes.get(k, '')}")
missing = set(computed) - set(stored)
if missing: print('computed but not stored:', missing); bad += 1
print(f'{len(stored)} questions, {bad} problems (explore counts 6, 24, 12, 12 also checked)')
