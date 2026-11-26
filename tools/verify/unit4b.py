# Independent verification for Unit 4b (t12, t13, S1).
# Digit puzzles: every pattern shown on the page is read from js/content/unit4b.js through node, then solved by
# brute force over ALL numbers of the right length (and all remainders); the number of solutions must be 1 and the
# solution must match the stored answers. Other answers are recomputed by enumeration.
import itertools

def match(pat, act, env):
    """pat/act are equal-length strings. lowercase = box var, uppercase = letter var, digit fixed, space=space."""
    if len(pat) != len(act):
        return False
    for p, a in zip(pat, act):
        if p == ' ' or a == ' ':
            if p != a: return False
        elif p.isdigit():
            if p != a: return False
        elif p.isalpha():
            if p in env:
                if env[p] != a: return False
            else:
                if p.isupper() and a in [v for k, v in env.items() if k.isupper()]:
                    return False
                env[p] = a
        else:
            raise ValueError(p)
    return True

def mul_rows(a, b):
    parts = []
    for i, ch in enumerate(reversed(str(b))):
        parts.append(str(a * int(ch) * 10 ** i))
    return parts, str(a * b)

def solve_mul(spec):
    la, lb = len(spec['a']), len(spec['b'])
    sols = []
    for a in range(10 ** (la - 1), 10 ** la):
        env = {}
        if not match(spec['a'], str(a), env): continue
        for b in range(10 ** (lb - 1), 10 ** lb):
            e = dict(env)
            if not match(spec['b'], str(b), e): continue
            parts, p = mul_rows(a, b)
            ok = True
            if spec.get('parts'):
                if len(spec['parts']) != len(parts): ok = False
                else:
                    for sp, ap in zip(spec['parts'], parts):
                        if not match(sp, ap, e): ok = False; break
            if ok and match(spec['p'], p, e):
                sols.append((a, b, e))
    return sols

def div_layout(N, d):
    """Return quotient string aligned to dividend columns, and working rows (strings with leading spaces)."""
    s = str(N); n = len(s)
    rows = []
    i = 0; cur = int(s[0])
    while cur < d and i < n - 1:
        i += 1; cur = cur * 10 + int(s[i])
    q = [' '] * n
    while True:
        qd = cur // d
        q[i] = str(qd)
        prod = qd * d
        rows.append(' ' * (i + 1 - len(str(prod))) + str(prod))
        rem = cur - prod
        if i == n - 1:
            rows.append(' ' * (i + 1 - len(str(rem))) + str(rem))
            break
        i += 1; cur = rem * 10 + int(s[i])
        while cur < d and i < n - 1:
            q[i] = '0'; i += 1; cur = cur * 10 + int(s[i])
        if cur < d:  # ran out of digits
            q[i] = '0'
            rows.append(' ' * (i + 1 - len(str(cur))) + str(cur))
            break
        rows.append(' ' * (i + 1 - len(str(cur))) + str(cur))
    qs = ''.join(q).rstrip()
    return qs, rows

def solve_div(spec):
    ld, ln = len(spec['d']), len(spec['n'])
    sols = []
    for d in range(max(2, 10 ** (ld - 1)), 10 ** ld):
        env0 = {}
        if not match(spec['d'], str(d), env0): continue
        qlen = len(spec['q'].strip())
        for q in range(10 ** (qlen - 1), 10 ** qlen):
            for r in range(d):
                N = d * q + r
                if len(str(N)) != ln: continue
                e = dict(env0)
                if not match(spec['n'], str(N), e): continue
                qs, rows = div_layout(N, d)
                if not match(spec['q'], qs, e): continue
                if len(rows) != len(spec['rows']): continue
                if all(match(sp, ar, e) for sp, ar in zip(spec['rows'], rows)):
                    sols.append((N, d, q, r, e))
    return sols

def solve_eq(eq):
    """eq like 'ABCD × 9 = DCBA'; letters distinct digits; leading letters nonzero."""
    expr = eq.replace('×', '*').replace('÷', '/').replace('=', '==')
    letters = sorted(set(c for c in eq if c.isupper()))
    words = [w for w in __import__('re').findall(r'[A-Z0-9]+', eq)]
    lead = set(w[0] for w in words if len(w) > 1 and w[0].isalpha())
    sols = []
    for perm in itertools.permutations('0123456789', len(letters)):
        env = dict(zip(letters, perm))
        if any(env[l] == '0' for l in lead): continue
        e = ''.join(env.get(c, c) for c in expr)
        # division must be exact
        try:
            lhs, rhs = e.split('==')
            if '/' in lhs:
                x, y = lhs.split('/'); x, y = int(x), int(y)
                if x % y: continue
                if x // y == int(rhs): sols.append(env)
            elif eval(lhs) == int(rhs):
                sols.append(env)
        except ZeroDivisionError:
            pass
    return sols

import json, subprocess
from itertools import permutations

JS = """import u, {EXPLORE_PUZZLES as E} from './js/content/unit4b.js';
const o={}; for (const [k,t] of Object.entries(u)) o[k]=t.practice.map(q=>({id:q.id,type:q.type,puz:q.puz||null,labels:q.labels||null,
 answer: q.type==='blanks'? q.blanks.map(b=>[].concat(b.answer)[0]) : q.type==='mcq' ? q.answer : null, options:q.options||null}));
console.log(JSON.stringify({topics:o, explore:E}));"""
data = json.loads(subprocess.check_output(['node', '--input-type=module', '-e', JS], cwd='/home/claude/sgctmath'))
Q = {t: {q['id']: q for q in qs} for t, qs in data['topics'].items()}
bad = 0
def report(tag, ok, msg):
    global bad
    bad += not ok
    print(f"{'OK ' if ok else 'BAD'} {tag}: {msg}")

def solve_puz(p):
    if p['kind'] == 'mul':
        return [e for a, b, e in solve_mul(p)]
    if p['kind'] == 'div':
        return [e for N, d, q, r, e in solve_div(p)]
    if p['kind'] == 'eq':
        return solve_eq(p['eq'])

# ---- explore puzzles
for tid, p in data['explore'].items():
    sols = solve_puz(p)
    got = {k: int(v) for k, v in sols[0].items()} if sols else None
    report(f'{tid}/explore', len(sols) == 1 and got == p['answer'], f'solutions={len(sols)} computed={got} stored={p["answer"]}')

# ---- practice digit puzzles
for tid in ('t12', 't13'):
    for q in Q[tid].values():
        if not q['puz']: continue
        sols = solve_puz(q['puz'])
        comp = [int(sols[0][c]) for c in q['labels']] if sols else None
        report(f'{tid}/{q["id"]}', len(sols) == 1 and comp == q['answer'] and len(q['labels']) == len(sols[0]),
               f'solutions={len(sols)} computed={comp} stored={q["answer"]} (labels {q["labels"]}, vars in pattern {len(sols[0]) if sols else 0})')

# ---- t12/b : one-digit numbers whose product with 6 ends in 4
q = Q['t12']['b']; want = [i for i, o in enumerate(q['options']) if int(o) * 6 % 10 == 4]
report('t12/b', want == q['answer'], f'computed={want} stored={q["answer"]} (all digits: {[d for d in range(10) if d*6%10==4]})')

# ---- t13/a : possible remainders when dividing by 6 (simulate packing n kueh, n = 0..200)
rems = {n % 6 for n in range(200)}
q = Q['t13']['a']; want = [i for i, o in enumerate(q['options']) if int(o) in rems]
report('t13/a', want == q['answer'], f'computed={want} stored={q["answer"]}')
# ---- t13/c : n with n // 7 == 8
ns = [n for n in range(200) if n // 7 == 8]
report('t13/c', [min(ns), max(ns)] == Q['t13']['c']['answer'], f'computed={[min(ns), max(ns)]} stored={Q["t13"]["c"]["answer"]}')
# ---- t13/g : smallest divisor d with some n: n//d==47 and n%d==5
cands = [(d, n) for d in range(1, 50) for n in range(1, 3000) if n // d == 47 and n % d == 5]
report('t13/g', list(min(cands)) == Q['t13']['g']['answer'], f'computed={list(min(cands))} stored={Q["t13"]["g"]["answer"]}')

# ---- S1: horses. speed ranks (bigger = faster). King slightly faster than Tian Ji in each class,
# Tian Ji fast > King medium, Tian Ji medium > King slow.
speed = {'KF': 6, 'TF': 5, 'KM': 4, 'TM': 3, 'KS': 2, 'TS': 1}
king = ['KF', 'KM', 'KS']
orders = list(permutations(['TF', 'TM', 'TS']))
wins = lambda o: sum(speed[t] > speed[k] for t, k in zip(o, king))
q = Q['S1']
sun_bin = ('TS', 'TF', 'TM')
report('S1/a', q['a']['answer'] == king.index(king[sun_bin.index('TS')]), f"slow horse met {king[sun_bin.index('TS')]}; stored option {q['a']['answer']}")
report('S1/b', q['b']['answer'] == [wins(('TF', 'TM', 'TS')), wins(sun_bin)], f"computed={[wins(('TF','TM','TS')), wins(sun_bin)]} stored={q['b']['answer']}")
report('S1/c', q['c']['answer'] == [len(orders)], f'computed={len(orders)} stored={q["c"]["answer"]}')
n2 = sum(wins(o) >= 2 for o in orders)
report('S1/d', q['d']['answer'] == [n2], f'computed={n2} stored={q["d"]["answer"]} winning orders={[o for o in orders if wins(o)>=2]}')
# e: king sees Tian Ji's order first and picks his own; guaranteed wins = min over TJ orders of (king's best reply)
guar = max(min(sum(speed[t] > speed[k] for t, k in zip(o, ko)) for ko in permutations(king)) for o in orders)
report('S1/e', int(q['e']['options'][q['e']['answer']]) == guar, f'computed={guar} stored option={q["e"]["options"][q["e"]["answer"]]}')
# f: chess. strength ranks: O1 > Ravi > O2 > MeiLing > O3 > Farah. Boards worth 3,2,1.
st = {'O1': 6, 'Ravi': 5, 'O2': 4, 'Mei': 3, 'O3': 2, 'Farah': 1}
best = max(sum(pts for p, o, pts in zip(perm, ['O1', 'O2', 'O3'], [3, 2, 1]) if st[p] > st[o]) for perm in permutations(['Ravi', 'Mei', 'Farah']))
report('S1/f', q['f']['answer'] == [best], f'computed={best} stored={q["f"]["answer"]}')
# g/h: cards
H = [7, 4, 11]; C = [12, 8, 5]
cw = lambda o: sum(c > h for c, h in zip(o, H))
allwin = [o for o in permutations(C) if cw(o) == 3]
opt = [tuple(int(x) for x in s.split(', ')) for s in q['g']['options']]
report('S1/g', len(allwin) == 1 and opt.index(allwin[0]) == q['g']['answer'], f'all-3 orders={allwin} stored option={q["g"]["options"][q["g"]["answer"]]}')
nh = sum(cw(o) >= 2 for o in permutations(C))
report('S1/h', q['h']['answer'] == [nh], f'computed={nh} stored={q["h"]["answer"]} table={[(o, cw(o)) for o in permutations(C)]}')
# i: pair race, smaller time wins
R = [11.8, 12.6, 13.4, 14.5]; B = [12.2, 13.0, 13.9, 14.8]
bw = max(sum(b < r for b, r in zip(o, R)) for o in permutations(B))
report('S1/i', q['i']['answer'] == [bw], f'computed={bw} stored={q["i"]["answer"]} (orders achieving it: {sum(sum(b<r for b,r in zip(o,R))==bw for o in permutations(B))})')

print('ALL GOOD' if bad == 0 else f'{bad} PROBLEMS')
