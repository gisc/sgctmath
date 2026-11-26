"""Independent verification for Unit 11 (t25 Three-Circle Venn Problems).

For each Venn question:
  1. build an explicit set of people (Python sets) from region counts,
  2. recompute every given (group sizes, pair sizes, total ...) from the sets and compare with the prompt,
  3. recompute the asked-for count from the sets,
  4. enumerate EVERY non-negative way of filling the regions that satisfies the givens and check the
     asked-for count is the same in all of them (uniqueness), or take the max for the "greatest" question.
Stored answers are read from the JS file so the check compares against what the site will accept.
"""
import itertools, re, pathlib

JS = pathlib.Path(__file__).resolve().parents[2] / 'js/content/unit11.js'
src = JS.read_text()

def stored(qid):
    m = re.search(r"\{ id: '%s',.*?(answer: (\d+)|blanks: \[(.*?)\]),\s*\n" % qid, src, re.S)
    blk = re.search(r"\{ id: '%s',(.*?)\n    \{ id: |\{ id: '%s',(.*?)\n  \],\n  adult" % (qid, qid), src, re.S)
    body = blk.group(1) or blk.group(2)
    bl = re.search(r"blanks: \[(.*?)\]", body)
    if bl:
        return [int(x) for x in re.findall(r"answer: (\d+)", bl.group(1))]
    return [int(re.search(r"answer: (\d+)", body).group(1))]

REG3 = ['a', 'b', 'c', 'ab', 'bc', 'ac', 'abc']
REG2 = ['a', 'b', 'ab']

def build(counts):
    """counts: region -> n. Returns dict set-name -> set of person ids, plus all people."""
    people, sets, pid = set(), {'A': set(), 'B': set(), 'C': set()}, 0
    for reg, n in counts.items():
        for _ in range(n):
            pid += 1; people.add(pid)
            if reg == 'none': continue
            for ch in reg: sets[ch.upper()].add(pid)
    return people, sets

def givens3(people, s):
    A, B, C = s['A'], s['B'], s['C']
    return dict(A=len(A), B=len(B), C=len(C), AB=len(A & B), BC=len(B & C), CA=len(C & A), ABC=len(A & B & C),
                union=len(A | B | C), total=len(people), none=len(people - (A | B | C)))

def all_fillings3(g, keys, limit):
    """Every non-negative filling of the 7 regions (+none) consistent with the givens in `keys`."""
    out = []
    rng = range(limit + 1)
    for abc in rng:
        for ab in rng:
            for bc in rng:
                for ac in rng:
                    a = g.get('A', 0) - ab - ac - abc if 'A' in keys else None
                    b = g.get('B', 0) - ab - bc - abc if 'B' in keys else None
                    c = g.get('C', 0) - ac - bc - abc if 'C' in keys else None
                    if None in (a, b, c) or min(a, b, c) < 0: continue
                    d = dict(a=a, b=b, c=c, ab=ab, bc=bc, ac=ac, abc=abc)
                    union = sum(d.values())
                    if 'AB' in keys and ab + abc != g['AB']: continue
                    if 'BC' in keys and bc + abc != g['BC']: continue
                    if 'CA' in keys and ac + abc != g['CA']: continue
                    if 'ABC' in keys and abc != g['ABC']: continue
                    if 'union' in keys and union != g['union']: continue
                    none = g['total'] - union if 'total' in keys else 0
                    if none < 0: continue
                    d['none'] = none
                    out.append(d)
    return out

ok = True
def report(qid, computed, st):
    global ok
    good = list(computed) == list(st)
    ok &= good
    print(f"{qid}: computed {computed}  stored {st}  {'OK' if good else 'MISMATCH'}")

def check_unique(qid, sols, f):
    global ok
    vals = {tuple(f(d)) for d in sols}
    u = len(vals) == 1
    ok &= u
    print(f"   {qid}: {len(sols)} consistent fillings, asked-for values {sorted(vals)} -> {'unique' if u else 'NOT UNIQUE'}")

def expect(qid, got, want):
    global ok
    for k, v in want.items():
        if got[k] != v:
            ok = False; print(f"   {qid}: given {k} = {v} but sets give {got[k]}")

# ---------- explore (class party survey) ----------
people, s = build(dict(a=8, b=4, c=4, ab=5, bc=2, ac=3, abc=3, none=1))
g = givens3(people, s)
expect('explore', g, dict(A=19, B=14, C=12, AB=8, BC=5, CA=6, ABC=3, total=30))
print('explore: union', g['union'], 'none', g['none'], '(story: 29 and 1)')
ok &= g['union'] == 29 and g['none'] == 1
A2, B2 = s['A'], s['B']
print('explore two-circle: satay only', len(A2 - B2), 'both', len(A2 & B2), 'mee siam only', len(B2 - A2), 'neither', 30 - len(A2 | B2), '(story: 11, 8, 6, 5)')
ok &= (len(A2 - B2), len(A2 & B2), len(B2 - A2), 30 - len(A2 | B2)) == (11, 8, 6, 5)

# ---------- a: two groups, everyone in at least one ----------
people, s = build(dict(a=11, b=8, ab=7))
A_, B_ = s['A'], s['B']
expect('a', dict(A=len(A_), B=len(B_), AB=len(A_ & B_)), dict(A=18, B=15, AB=7))
opts = ['26', '33', '40', '19']
report('a', [opts.index(str(len(A_ | B_)))], stored('a'))
sols = [(x, y, z) for x in range(41) for y in range(41) for z in range(41) if x + z == 18 and y + z == 15 and z == 7]
check_unique('a', sols, lambda t: [sum(t)])

# ---------- b: two groups with a rectangle ----------
people, s = build(dict(a=15, b=10, ab=9, none=6))
A_, B_ = s['A'], s['B']
expect('b', dict(A=len(A_), B=len(B_), AB=len(A_ & B_), T=len(people)), dict(A=24, B=19, AB=9, T=40))
report('b', [len(A_ - B_), len(B_ - A_), len(people - (A_ | B_))], stored('b'))
sols = [(x, y, z, 40 - x - y - z) for x in range(41) for y in range(41) for z in range(41) if x + z == 24 and y + z == 19 and z == 9 and x + y + z <= 40]
check_unique('b', sols, lambda t: [t[0], t[1], t[3]])

# ---------- c..g: three groups ----------
def three(qid, regions, givens, keys, ask, limit=60):
    people, s = build(regions)
    g = givens3(people, s)
    expect(qid, g, givens)
    report(qid, ask(g, regions), stored(qid))
    sols = all_fillings3(givens, keys, limit)
    check_unique(qid, sols, lambda d: ask(dict(union=sum(v for k, v in d.items() if k != 'none'), none=d['none']), d))

three('c', dict(a=28, b=21, c=14, ab=8, bc=5, ac=6, abc=4),
      dict(A=46, B=38, C=29, AB=12, BC=9, CA=10, ABC=4), ['A', 'B', 'C', 'AB', 'BC', 'CA', 'ABC'],
      lambda g, d: [g['union']])
three('d', dict(a=13, b=8, c=9, ab=3, bc=2, ac=6, abc=5),
      dict(A=27, B=18, C=22, AB=8, BC=7, CA=11, ABC=5), ['A', 'B', 'C', 'AB', 'BC', 'CA', 'ABC'],
      lambda g, d: [d['a'], d['bc'], d['c']])
three('e', dict(a=7, b=6, c=7, ab=3, bc=2, ac=4, abc=3, none=8),
      dict(A=17, B=14, C=16, AB=6, BC=5, CA=7, ABC=3, total=40), ['A', 'B', 'C', 'AB', 'BC', 'CA', 'ABC', 'total'],
      lambda g, d: [g['none']])
# g: the centre is unknown; the total 38 (everyone in at least one group) is given instead
three('g', dict(a=6, b=6, c=2, ab=11, bc=4, ac=6, abc=3),
      dict(A=26, B=24, C=15, AB=14, BC=7, CA=9, union=38, total=38), ['A', 'B', 'C', 'AB', 'BC', 'CA', 'union', 'total'],
      lambda g, d: [d['abc']])

# ---------- f: tickets 1..100 divisible by 2, 3 or 5 (brute force) ----------
T = set(range(1, 101))
S2, S3, S5 = {x for x in T if x % 2 == 0}, {x for x in T if x % 3 == 0}, {x for x in T if x % 5 == 0}
report('f', [len(S2 | S3 | S5)], stored('f'))
regs = dict(a=len(S2 - S3 - S5), b=len(S3 - S2 - S5), c=len(S5 - S2 - S3), ab=len(S2 & S3 - S5), bc=len(S3 & S5 - S2), ac=len(S2 & S5 - S3), abc=len(S2 & S3 & S5), none=len(T - (S2 | S3 | S5)))
print('   f regions (diagram shows a27 b14 c7 ab13 bc3 ac7 abc3 none26):', regs)
ok &= regs == dict(a=27, b=14, c=7, ab=13, bc=3, ac=7, abc=3, none=26)
print('   f table counts:', len(S2), len(S3), len(S5), len(S2 & S3), len(S3 & S5), len(S2 & S5), len(S2 & S3 & S5), '(stated 50 33 20 16 6 10 3)')
ok &= (len(S2), len(S3), len(S5), len(S2 & S3), len(S3 & S5), len(S2 & S5), len(S2 & S3 & S5)) == (50, 33, 20, 16, 6, 10, 3)

# ---------- h: overlapping square cards, count 1 cm grid cells ----------
cards = [(0, 0, 10), (6, 4, 8), (4, 8, 6)]
cells = [{(x, y) for x in range(cx, cx + s_) for y in range(cy, cy + s_)} for cx, cy, s_ in cards]
report('h', [len(cells[0] | cells[1] | cells[2])], stored('h'))
print('   h overlaps AB, BC, AC, ABC:', len(cells[0] & cells[1]), len(cells[1] & cells[2]), len(cells[0] & cells[2]), len(cells[0] & cells[1] & cells[2]), '(stated 24 16 12 8)')
ok &= (len(cells[0] & cells[1]), len(cells[1] & cells[2]), len(cells[0] & cells[2]), len(cells[0] & cells[1] & cells[2])) == (24, 16, 12, 8)

# ---------- i: greatest number who came on all three days ----------
best, witness = -1, None
for abc in range(12):
    for ab in range(15):
        for bc in range(12):
            for ac in range(12):
                a, b, c = 18 - ab - ac - abc, 14 - ab - bc - abc, 11 - ac - bc - abc
                if min(a, b, c) < 0: continue
                if a + b + c + ab + bc + ac + abc != 24: continue
                if abc > best: best, witness = abc, dict(a=a, b=b, c=c, ab=ab, bc=bc, ac=ac, abc=abc)
report('i', [best], stored('i'))
people, s = build(dict(a=8, b=4, c=2, ab=1, bc=0, ac=0, abc=9))
g = givens3(people, s)
expect('i', g, dict(A=18, B=14, C=11, union=24, ABC=9))
print('   i: example in solution checks out; one maximum witness from search:', witness)

print('ALL OK' if ok else 'PROBLEMS FOUND')
