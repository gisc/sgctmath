# Independent verification for Unit 6 part B (t18 matching quantities, t19 patterns, S2 Han Xin).
# Answers are recomputed by brute-force search (prices in cents, masses in 100 g steps,
# remainder puzzles by searching 1..N) or by generating the terms of each sequence,
# then compared with the answer keys stored in js/content/unit6b.js.
import json, subprocess, os

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
js = "import('./js/content/unit6b.js').then(m=>{const o={};for(const[t,v]of Object.entries(m.default))for(const q of v.practice)o[t+'/'+q.id]=q.type==='mcq'?{mcq:q.answer,options:q.options}:q.blanks.map(b=>[].concat(b.answer)[0]);console.log(JSON.stringify(o))})"
stored = json.loads(subprocess.check_output(['node', '--input-type=module', '-e', js], cwd=ROOT))

def unique(cands, name):
    assert len(cands) == 1, f'{name}: {len(cands)} solutions {cands[:5]}'
    return cands[0]

res = {}
C = range(1, 3001)   # prices 1 cent .. $30.00

# ---------------- t18 ----------------
res['t18/a'] = list(unique([(t, c) for t in range(0, 40) for c in range(0, 40) if 3 * t + c == 31 and t + c == 15], 't18a'))
pf = unique([(p, f) for p in C for f in C if 3 * p + f == 610 and 5 * p + f == 870], 't18b')
res['t18/b'] = [pf[0] / 100, pf[1] / 100]
k = unique([k for k in C if (7 + 4) * k - 7 * k == 340], 't18c')     # Siti pays 4 more pieces' worth
res['t18/c'] = [k / 100, 7 * k / 100]
bc = unique([(b, c) for b in range(1, 100) for c in range(1, 100) if 8 * b + c == 39 and 5 * b + c == 27], 't18d')  # 100 g units
res['t18/d'] = [bc[0] / 10, bc[1] / 10]
rl = unique([(r, l) for r in C for l in C if r + 2 * l == 770 and 3 * r + l == 1510], 't18e')
res['t18/e'] = [rl[0] / 100, rl[1] / 100]
res['t18/f'] = list(unique([(c, k, m) for c in range(1, 60) for k in range(1, 60) for m in range(1, 60) if c + k == 15 and k + m == 17 and c + m == 22], 't18f'))
lt = unique([(l, t) for l in C for t in C if 2 * l + 3 * t == 1510 and 3 * l + 2 * t == 1840], 't18g')
res['t18/g'] = [lt[0] / 100, lt[1] / 100]
ga = unique([(g, a) for g in C for a in C if 5 * g + 8 * a == 630 and 4 * g + a == 7 * a + g], 't18h')
res['t18/h'] = [ga[0] / 100, ga[1] / 100]

# ---------------- t19: generate the terms ----------------
def seq(first, d, n): return [first + i * d for i in range(n)]
opts = ['5, 9, 13, 17, 21', '2, 4, 8, 16, 32', '30, 26, 22, 18, 14', '1, 3, 6, 10, 15']
def const_diff(s):
    v = [int(x) for x in s.split(', ')]; return len({b - a for a, b in zip(v, v[1:])}) == 1
res['t19/a'] = {'mcq': [i for i, o in enumerate(opts) if const_diff(o)]}
b = seq(7, 4, 20); res['t19/b'] = [b[1] - b[0], b[19]]
res['t19/c'] = [seq(5, 3, 12)[-1]]
wp = [18 + 12 * i for i in range(9)]           # tenths of a km
res['t19/d'] = [wp[8] / 10]
lots = list(range(4, 155, 6)); assert lots[-1] == 154
res['t19/e'] = [len(lots), lots.index(100) + 1]
odd = list(range(1, 60, 2)); res['t19/f'] = [len(odd), sum(odd)]
cans = list(range(4, 16)); res['t19/g'] = [len(cans), sum(cans)]
rings = unique([(n, d) for n in range(2, 60) for d in range(1, 60) if seq(20, d, n)[-1] == 56 and sum(seq(20, d, n)) == 380], 't19h')
res['t19/h'] = list(rings)
dd = unique([d for d in range(1, 60) if sum(seq(6, d, 9)) == 198], 't19i')
res['t19/i'] = [dd, seq(6, dd, 9)[-1]]

# ---------------- S2: brute-force remainder searches ----------------
N = 100000
def fits(n, conds): return all(n % m == r for m, r in conds)
res['S2/a'] = {'mcq': [i for i, o in enumerate(['18', '21', '24', '26']) if int(o) % 4 == 1]}
res['S2/b'] = [unique([n for n in range(1, 12) if fits(n, [(3, 2), (4, 1)])], 'S2b')]
res['S2/c'] = [unique([n for n in range(31, 40) if fits(n, [(5, 4), (2, 1)])], 'S2c')]
res['S2/d'] = [min(n for n in range(1, N) if fits(n, [(3, 2), (5, 4)]))]
res['S2/e'] = [unique([n for n in range(31, 50) if fits(n, [(6, 4), (8, 6)])], 'S2e')]
res['S2/f'] = [unique([n for n in range(101, 150) if fits(n, [(8, 5), (10, 7)])], 'S2f')]
res['S2/g'] = [min(n for n in range(1, N) if fits(n, [(3, 1), (4, 2), (5, 3)]))]
res['S2/h'] = [min(n for n in range(1, N) if fits(n, [(3, 2), (5, 4), (7, 5)]))]
res['S2/i'] = [unique([n for n in range(101, 200) if fits(n, [(3, 1), (4, 1), (7, 0)])], 'S2i')]

bad = 0
for key in stored:
    got, st = res.get(key), stored[key]
    if isinstance(st, dict):
        gv, sv = got and got['mcq'], st['mcq']
        aslist = lambda v: sorted(v) if isinstance(v, list) else [v]
        ok = got is not None and aslist(gv) == aslist(sv)
    else:
        gv = [round(float(x), 6) for x in got] if got else None; sv = [round(float(x), 6) for x in st]; ok = gv == sv
    bad += not ok
    print(f"{key:7s} computed {gv}  stored {sv}  {'OK' if ok else 'MISMATCH'}")
missing = set(stored) - set(res)
print(f'{len(stored)} questions, {bad} mismatches, {len(missing)} unverified {sorted(missing)}')

# ---------------- explore numbers ----------------
ex = []
ex.append(('t18 Aisyah/Arjun -> puff, soya (cents)', unique([(p, s) for p in C for s in C if 2 * p + s == 370 and 2 * p + 3 * s == 550], 'x1'), (140, 90)))
ex.append(('t18 Wei Ming/Chloe -> puff, soya (cents)', unique([(p, s) for p in C for s in C if p + 2 * s == 320 and 3 * p + 4 * s == 780], 'x2'), (140, 90)))
ex.append(('t18 banner pens: 2p+b=460, 5p+b=820', unique([(p, b) for p in C for b in C if 2 * p + b == 460 and 5 * p + b == 820], 'x3')[0] * 3, 360))
h = seq(12, 2, 15)
ex.append(('t19 hall row 15, total, rows to 50', (h[-1], sum(h), next(n for n in range(1, 99) if seq(12, 2, n)[-1] == 50)), (40, 390, 20)))
ex.append(('S2 smallest 3r1 5r2 7r3', min(n for n in range(1, N) if fits(n, [(3, 1), (5, 2), (7, 3)])), 52))
ex.append(('S2 in 900..1000 (unique)', unique([n for n in range(900, 1001) if fits(n, [(3, 1), (5, 2), (7, 3)])], 'x4'), 997))
ex.append(('S2 list 2 mod 5 & 1 mod 3 -> first', min(n for n in range(1, 99) if fits(n, [(5, 2), (3, 1)])), 7))
ex.append(('S2 jump list 52+105k', [n for n in range(1, 1200) if fits(n, [(3, 1), (5, 2), (7, 3)])], [52, 157, 262, 367, 472, 577, 682, 787, 892, 997, 1102]))
for name, got, exp in ex:
    print(f"{name:42s} {'OK' if got == exp else 'MISMATCH'} {got}")
