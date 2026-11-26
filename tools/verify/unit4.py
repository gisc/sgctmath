# Independent verification for Unit 4 part 1 (t09, t10, t11).
# Recomputes every answer by brute force / exhaustive search and compares with the stored keys
# (stored keys are read from js/content/unit4.js through node).
import json, subprocess, heapq
from itertools import permutations, product

js = "import u from './js/content/unit4.js'; const o={}; for (const [k,t] of Object.entries(u)) o[k]=Object.fromEntries(t.practice.map(q=>[q.id, q.type==='blanks'? q.blanks.map(b=>[].concat(b.answer)[0]) : q.type==='mcq' ? q.answer : q.pairs.map(p=>p[2])])); console.log(JSON.stringify(o));"
stored = json.loads(subprocess.check_output(['node', '--input-type=module', '-e', js], cwd='/home/claude/sgctmath'))
bad = 0
def check(tid, qid, computed, note=''):
    global bad
    s = stored[tid][qid]
    ok = s == computed
    bad += not ok
    print(f"{'OK ' if ok else 'BAD'} {tid}/{qid}: computed={computed} stored={s} {note}")

# ---------- t09 helpers ----------
def one_worker(hand, machine, deps):
    """hand: {job: dur} done by one person, one at a time; machine: {job: (dur, prereq)} runs alone once prereq done.
    deps: {job: [prereqs]} for hand jobs. Exhaustive over all orders of hand jobs (worker may idle)."""
    best = None
    for order in permutations(hand):
        t = 0; fin = {}
        for j in order:
            # machines whose prereq done can be computed lazily
            need = deps.get(j, [])
            ready = 0
            for p in need:
                if p in fin: ready = max(ready, fin[p])
                elif p in machine:
                    pre = machine[p][1]
                    if pre not in fin: ready = None; break
                    ready = max(ready, fin[pre] + machine[p][0])
                else: ready = None; break
            if ready is None: break
            t = max(t, ready) + hand[j]; fin[j] = t
        else:
            end = max([fin[j] for j in fin] + [fin[m[1]] + m[0] for m in machine.values()])
            best = end if best is None else min(best, end)
    return best

def pan_min(n, cap, side):
    """BFS: each round, choose up to cap prata (each at most once) with <2 sides done."""
    from itertools import combinations
    start = tuple([0]*n); goal = tuple([2]*n)
    frontier = {start}; rounds = 0
    while goal not in frontier:
        nxt = set()
        for st in frontier:
            avail = [i for i in range(n) if st[i] < 2]
            for k in range(1, min(cap, len(avail)) + 1):
                for c in combinations(avail, k):
                    s = list(st)
                    for i in c: s[i] += 1
                    nxt.add(tuple(sorted(s)))
        frontier = nxt; rounds += 1
    return rounds * side

def queue_total(order):
    t = 0; tot = 0
    for d in order: t += d; tot += t
    return tot

def multi_server(jobs, k):
    best = None
    for perm in permutations(jobs):
        for assign in product(range(k), repeat=len(jobs)):
            ts = [0]*k; tot = 0
            for d, a in zip(perm, assign): ts[a] += d; tot += ts[a]
            best = tot if best is None else min(best, tot)
    return best

def bridge(times):
    n = len(times); full = (1 << n) - 1
    dist = {(full, 0): 0}; pq = [(0, full, 0)]
    while pq:
        d, left, side = heapq.heappop(pq)
        if left == 0: return d
        if d > dist.get((left, side), 1e9): continue
        here = left if side == 0 else full ^ left
        ppl = [i for i in range(n) if here >> i & 1]
        moves = [(i,) for i in ppl] + [(i, j) for i in ppl for j in ppl if i < j]
        for m in moves:
            cost = max(times[i] for i in m); mask = sum(1 << i for i in m)
            nl = left ^ mask
            st = (nl, 1 - side); nd = d + cost
            if nd < dist.get(st, 1e9): dist[st] = nd; heapq.heappush(pq, (nd, nl, 1 - side))

# t09 explore check (not a question): Chloe's breakfast
ex = one_worker({'fill':1, 'cups':2, 'milo':1, 'kaya':3, 'pour':1}, {'boil': (8, 'fill')}, {'pour': ['boil', 'milo', 'cups']})
print('explore t09 breakfast least time =', ex, '(text says 10); one at a time =', 1+8+2+1+3+1)
assert ex == 10
print('explore t09 sink totals: longest first', queue_total([5,3,1]), 'shortest first', queue_total([1,3,5]), 'min', min(queue_total(p) for p in permutations([1,3,5])))

check('t09', 'a', [one_worker({'load':5, 'sweep':10, 'mop':15, 'hang':10}, {'wash': (40, 'load')}, {'hang': ['wash'], 'mop': ['sweep']})])
check('t09', 'b', [pan_min(4, 2, 2)])
names = {'Mrs Pillai':6, 'Mr Rahman':2, 'Ms Goh':4}
opts = ['Mrs Pillai, Ms Goh, Mr Rahman', 'Mr Rahman, Ms Goh, Mrs Pillai', 'Ms Goh, Mr Rahman, Mrs Pillai', 'Mrs Pillai, Mr Rahman, Ms Goh']
tots = [queue_total([names[x] for x in o.split(', ')]) for o in opts]
best = min(queue_total(p) for p in permutations(names.values()))
check('t09', 'c', [i for i, t in enumerate(tots) if t == best][0], f'option totals {tots}, best over all orders {best}')
check('t09', 'd', [min(queue_total(p) for p in permutations([15,10,20,5]))])
check('t09', 'e', [pan_min(3, 2, 2)])
check('t09', 'f', [one_worker({'wash':3, 'sambal':8, 'ikan':6, 'eggs':3, 'cuc':2, 'plate':2}, {'cook': (25, 'wash')}, {'plate': ['cook', 'sambal', 'ikan', 'eggs', 'cuc']})], f'(one at a time = {3+25+8+6+3+2+2})')
check('t09', 'g', [multi_server([1,2,3,4,5], 2)])
check('t09', 'h', [pan_min(4, 3, 2)])
check('t09', 'i', [bridge([1,2,6,8])], f'(escort-by-fastest = {2+1+6+1+8})')

# ---------- t10 ----------
def total(pts, x, w=None):
    w = w or [1]*len(pts)
    return sum(wi*abs(p - x) for p, wi in zip(pts, w))
def best(pts, w=None):
    xs = range(min(pts), max(pts) + 1)
    m = min(total(pts, x, w) for x in xs)
    return m, [x for x in xs if total(pts, x, w) == m]

# explore
print('explore t10 3 friends:', best([0,200,700]), {x: total([0,200,700], x) for x in (0,100,200,350,700)})
m4, a4 = best([0,200,700,900]); print('explore t10 4 friends: min', m4, 'range', a4[0], '-', a4[-1])

P = [0, 300, 800]
m, arg = best(P)
cand = [0, 300, 400, 800]
check('t10', 'a', [i for i, x in enumerate(cand) if total(P, x) == m][0], f'min={m} at {arg}')
check('t10', 'b', [m])
P = [0, 100, 250, 600, 900]
m, arg = best(P)
cand = [100, 250, 370, 450]
print('   t10/c option totals', [total(P, x) for x in cand], 'average =', sum(P)/5)
check('t10', 'c', [i for i, x in enumerate(cand) if total(P, x) == m][0], f'min={m} at {arg}')
check('t10', 'd', [m])
P = [0, 200, 500, 1000]
m, arg = best(P)
cand = [200, 350, 500, 100, 750]
check('t10', 'e', [i for i, x in enumerate(cand) if total(P, x) == m], f'min={m}, best range {arg[0]}-{arg[-1]}, option totals {[total(P,x) for x in cand]}')
P = [0, 300, 600, 1000]; W = [15, 10, 12, 20]
m, arg = best(P, W)
fa = [i for i, x in enumerate(P) if total(P, x, W) == m]; assert len(fa) == 1
check('t10', 'f', fa[0], f'min={m} at {arg}; option totals {[total(P, x, W) for x in P]}')
check('t10', 'g', [m // 1000], f'({m} m)')
P = [i*100 for i in range(12)]
m, arg = best(P)
check('t10', 'h', [m], f'best range {arg[0]}-{arg[-1]} m (Post 6 to Post 7)')

# ---------- t11 ----------
def uniq(sols, label):
    print(f'   {label}: {len(sols)} solution(s): {sols}')
    assert len(sols) == 1, label
    return sols[0]

# explore: exactly one liar
SUS = ['Hafiz', 'Mei Ling', 'Ravi', 'Siti']
def stmts(c):
    h = c == 'Siti'
    return [h, c != 'Mei Ling', h, c != 'Siti']
uniq([c for c in SUS if stmts(c).count(False) == 1], 'explore kueh lapis')

# a
P3 = ['Ahmad', 'Xin Yi', 'Priya']; F3 = ['chicken rice', 'laksa', 'satay']
s = uniq([d for d in (dict(zip(P3, p)) for p in permutations(F3)) if d['Ahmad'] != 'satay' and d['Priya'] == 'laksa'], 't11/a')
check('t11', 'a', ['Chicken rice', 'Laksa', 'Satay'].index(s['Xin Yi'].capitalize()))
# b: exactly one truth
def bsay(c):
    k = c == 'Nurul'
    return [k, not k, c != 'Daniel']
s = uniq([c for c in ['Kumar', 'Nurul', 'Daniel'] if bsay(c).count(True) == 1], 't11/b')
check('t11', 'b', ['Kumar', 'Nurul', 'Daniel'].index(s))
# c
Q = ['Siti', 'Jun Jie', 'Daniel', 'Ravi', 'Nurul']
sols = []
for p in permutations(Q):
    pos = {n: i for i, n in enumerate(p)}
    if pos['Siti'] == 0 and pos['Daniel'] == pos['Jun Jie'] + 1 and pos['Nurul'] == pos['Ravi'] + 1 and pos['Ravi'] != 1: sols.append(p)
s = uniq(sols, 't11/c')
check('t11', 'c', ['Jun Jie', 'Daniel', 'Ravi', 'Nurul'].index(s[2]))
# d
P4 = ['Farah', 'Jun Jie', 'Kumar', 'Daniel']; F4 = ['kueh lapis', 'pineapple tarts', 'curry puffs', 'murukku']
sweet = {'kueh lapis', 'pineapple tarts'}
sols = [d for d in (dict(zip(P4, p)) for p in permutations(F4))
        if d['Farah'] in sweet and d['Daniel'] not in sweet and d['Daniel'] != 'curry puffs' and d['Jun Jie'] not in ('pineapple tarts', 'curry puffs')]
s = uniq(sols, 't11/d')
check('t11', 'd', P4.index([k for k, v in s.items() if v == 'curry puffs'][0]))
# e: code with distinct digits
def fb(g, c):
    r = sum(a == b for a, b in zip(g, c)); return (r, len(set(g) & set(c)) - r)
clues = [('956', (1, 0)), ('687', (0, 1)), ('743', (0, 2)), ('328', (0, 0))]
codes = [''.join(p) for p in permutations('0123456789', 3)]
s = uniq([c for c in codes if all(fb(g, c) == f for g, f in clues)], 't11/e')
check('t11', 'e', [int(s)])
# f: 5 speakers, speaker k says "exactly k are lying"; consistent assignments
sols = []
for truth in product([True, False], repeat=5):
    L = truth.count(False)
    if all(t == (L == k) for k, t in zip(range(1, 6), truth)): sols.append(L)
s = uniq(sols, 't11/f')
check('t11', 'f', [s])
# g: relay, each guess has exactly one true half
H = ['Red', 'Blue', 'Green', 'Yellow']
guesses = [[('Yellow', 3), ('Red', 2)], [('Yellow', 2), ('Green', 3)], [('Yellow', 4), ('Green', 1)]]
sols = [d for d in (dict(zip(H, p)) for p in permutations([1, 2, 3, 4])) if all(sum(d[h] == k for h, k in g) == 1 for g in guesses)]
s = uniq(sols, 't11/g')
check('t11', 'g', H.index([h for h in H if s[h] == 1][0]))
# h: truth / fib cards
sols = []
for X, Am, R in product([True, False], repeat=3):   # True = Truth card
    sx, sa, sr = (not Am), (not R), (not X and not Am)
    if sx == X and sa == Am and sr == R: sols.append((X, Am, R))
s = uniq(sols, 't11/h')
opts = [(True, False, False), (False, True, False), (False, False, True), (True, False, True), (True, True, True)]
check('t11', 'h', opts.index(s))

print('\nALL MATCH' if not bad else f'\n{bad} MISMATCHES')
