# Independent verification for Unit 8 (t21, t22, S3).
# Recomputes every answer by brute force / exact fractions / simulation and compares with the stored keys
# (stored keys are read from js/content/unit8.js through node).
import json, subprocess
from fractions import Fraction as F

js = "import u from './js/content/unit8.js'; const o={}; for (const [k,t] of Object.entries(u)) o[k]=Object.fromEntries(t.practice.map(q=>[q.id, q.type==='blanks'? q.blanks.map(b=>[].concat(b.answer)[0]) : q.type==='mcq' ? q.answer : q.pairs.map(p=>p[2])])); console.log(JSON.stringify(o));"
stored = json.loads(subprocess.check_output(['node', '--input-type=module', '-e', js], cwd='/home/claude/sgctmath'))
opts_js = "import u from './js/content/unit8.js'; const o={}; for (const [k,t] of Object.entries(u)) o[k]=Object.fromEntries(t.practice.filter(q=>q.type==='mcq').map(q=>[q.id,q.options])); console.log(JSON.stringify(o));"
options = json.loads(subprocess.check_output(['node', '--input-type=module', '-e', opts_js], cwd='/home/claude/sgctmath'))
bad = 0
def check(tid, qid, computed, note=''):
    global bad
    s = stored[tid][qid]
    ok = s == computed
    bad += not ok
    print(f"{'OK ' if ok else 'BAD'} {tid}/{qid}: computed={computed} stored={s} {note}")

def two_kinds(n, total, a, b):
    """All (count_a, count_b) with count_a + count_b = n and a*count_a + b*count_b = total."""
    return [(x, n - x) for x in range(n + 1) if a * x + b * (n - x) == total]

def unique(sols, label):
    global bad
    if len(sols) != 1:
        bad += 1; print(f"BAD {label}: {len(sols)} solutions {sols}")
    return sols[0]

# ---------------- t21 ----------------
# explore: 10 heads, 28 legs
ch, rb = unique(two_kinds(10, 28, 2, 4), 'explore'); assert (ch, rb) == (6, 4); print('OK  t21/explore: 6 chickens, 4 rabbits')
ch, rb = unique(two_kinds(12, 32, 2, 4), 't21a')
check('t21', 'a', [12 * 2, 32 - 24, rb, ch])
bi, tr = unique(two_kinds(20, 47, 2, 3), 't21b'); check('t21', 'b', [bi, tr])
n2, n5 = unique(two_kinds(15, 51, 2, 5), 't21c'); check('t21', 'c', [n2, n5])
t4, t6 = unique(two_kinds(15, 72, 4, 6), 't21d'); check('t21', 'd', [t6])
b2, b3 = unique(two_kinds(14, 33, 2, 3), 't21e'); check('t21', 'e', options['t21']['e'].index(str(b3)), f'(3-pointers={b3}, 2-pointers={b2})')
right, wrong = unique(two_kinds(20, 72, 5, -2), 't21f'); check('t21', 'f', [right])
safe, broke = unique(two_kinds(300, 5400, 20, -100), 't21g'); check('t21', 'g', [broke])   # in cents
sols = [(b, t, f) for b in range(31) for t in range(31) for f in range(31) if b + t + f == 30 and t == f and 2*b + 3*t + 4*f == 78]
b, t, f = unique(sols, 't21h'); check('t21', 'h', [b])
sols = [(c, w, k) for c in range(16) for w in range(16) for k in range(16) if c + w + k == 15 and w == k and 6*c - 2*w == 62]
c, w, k = unique(sols, 't21i'); check('t21', 'i', [c])

# ---------------- t22 ----------------
# explore: 3 h and 6 h together; must be independent of the batch size
times = {F(T) / (F(T) / 3 + F(T) / 6) for T in (6, 12, 60, 300, 7)}
assert times == {F(2)}; print('OK  t22/explore: 2 h for every batch size')
left = 1 - F(1, 3) - F(1, 4); check('t22', 'a', [left.numerator, left.denominator])
# b: brute force over many pencil prices (in cents)
res = {(2 * 5 * 3 * p) // p for p in range(1, 500)}; assert len(res) == 1; check('t22', 'b', [res.pop()])
# c: meet time, exact fractions, any path length
res = {F(L) / (F(L, 12) + F(L, 4)) for L in (1, 1200, 7, 360)}; assert len(res) == 1; check('t22', 'c', [int(res.pop())])
res = {F(V) / (F(V, 4) + F(V, 12)) for V in (1, 12, 100, 9)}; assert len(res) == 1; check('t22', 'd', [int(res.pop())])
# e: simulate jars for many starting counts
outs = set()
for n0 in range(12, 200):
    j = {'A': n0, 'B': n0, 'C': n0}
    for src, dst, k in (('A', 'B', 12), ('B', 'C', 7), ('C', 'A', 10)):
        j[src] -= k; j[dst] += k
    most = max(j, key=j.get); least = min(j, key=j.get)
    assert list(j.values()).count(j[most]) == 1 and list(j.values()).count(j[least]) == 1
    outs.add((most, least, j[most] - j[least]))
assert len(outs) == 1; check('t22', 'e', list(outs.pop()))
# f: brother = Farah/2, sister = 3*Farah, average 30 -> search Farah's savings
sols = [fa for fa in [F(x, 2) for x in range(0, 400)] if (fa / 2 + fa + 3 * fa) / 3 == 30]
fa = unique(sols, 't22f'); check('t22', 'f', [int(3 * fa)])
# g: price up 1/5 then down 1/5, many original prices
ratios = {(P * F(6, 5) * F(4, 5) - P) / P for P in (25, 100, 7, F(13, 3))}
assert ratios == {F(-1, 25)}
want = 'lower by [[f:1/25]] of the original price'
check('t22', 'g', options['t22']['g'].index(want), '(change = -1/25)')
# h: alternate days, exact fractions
done, day = F(0), 0
while done < 1:
    day += 1; done += F(1, 6) if day % 2 == 1 else F(1, 9)
assert done == 1  # finishes exactly at the end of that day
check('t22', 'h', [day])
kumar = 1 / (F(1, 4) - F(1, 6)); check('t22', 'i', [int(kumar)])

# ---------------- S3 ----------------
ZOO = {(2, 5): 'Orangutans', (3, 6): 'Tigers', (6, 3): 'Elephants', (5, 1): 'Giraffes', (1, 2): 'Kiosk'}
check('S3', 'a', options['S3']['a'].index(ZOO[(6, 3)]))
check('S3', 'b', list(next(k for k, v in ZOO.items() if v == 'Giraffes')))
ST = {'A': (0, 4), 'B': (4, 0), 'C': (4, 4), 'D': (2, 2)}
check('S3', 'c', options['S3']['c'].index(next(k for k, v in ST.items() if v == (4, 0))))
SEN = {'Beach Station': (1, 1), 'Fort Siloso': (1, 6), 'Luge': (4, 4), 'Aquarium': (6, 6), 'Palawan Beach': (5, 1), 'Tanjong Beach': (8, 2)}
x, y = SEN['Beach Station']; check('S3', 'd', [x + 3, y + 3], f"-> {[k for k, v in SEN.items() if v == (x + 3, y + 3)]}")
# e: BFS shortest path along grid lines on a 9x7 grid
from collections import deque
def bfs(a, b, W, Hh):
    d = {a: 0}; q = deque([a])
    while q:
        p = q.popleft()
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            n = (p[0] + dx, p[1] + dy)
            if 0 <= n[0] <= W and 0 <= n[1] <= Hh and n not in d: d[n] = d[p] + 1; q.append(n)
    return d[b]
check('S3', 'e', [bfs(SEN['Fort Siloso'], SEN['Tanjong Beach'], 9, 7) * 100])
# f: count unit squares inside rectangle and perimeter by walking the edge
P = [(2, 1), (7, 1), (7, 4), (2, 4)]
area = sum(1 for i in range(10) for j in range(10) if 2 <= i < 7 and 1 <= j < 4)
per = sum(abs(P[k][0] - P[(k + 1) % 4][0]) + abs(P[k][1] - P[(k + 1) % 4][1]) for k in range(4))
check('S3', 'f', [area, per])
sols = [(a, b) for a in range(10) for b in range(8) if a == b + 2 and a + b == 10]
check('S3', 'g', list(unique(sols, 'S3g')))
pos = (0, 0)
for dx, dy in ((3, 0), (0, 4), (2, 0), (0, -1), (-4, 0)):
    pos = (pos[0] + dx, pos[1] + dy); assert 0 <= pos[0] <= 6 and 0 <= pos[1] <= 5, 'robot leaves the drawn grid'
check('S3', 'h', [pos[0], pos[1], bfs(pos, (0, 0), 6, 5)])
grass = sum(1 for i in range(10) for j in range(10) if 1 <= i < 7 and 1 <= j < 5 and not (3 <= i < 5 and 2 <= j < 4))
check('S3', 'i', [grass * 10 * 10])

print('\nALL OK' if bad == 0 else f'\n{bad} PROBLEMS')
