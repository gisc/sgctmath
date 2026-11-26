#!/usr/bin/env python3
"""Independent verification of every answer in js/content/unit3.js (Unit 3: Seeing Shapes).

Run from the repo root:  python3 tools/verify/unit3.py
The stored answers are read from the JS module through node; every answer is recomputed here
by brute force / simulation / geometry, and the two are compared.
"""
import json, math, subprocess, itertools, os
from fractions import Fraction

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
js = ("import('./js/content/unit3.js').then(m=>{const o={};for(const [t,v] of Object.entries(m.default))"
      "{o[t]={};for(const q of v.practice)o[t][q.id]={type:q.type,level:q.level,answer:q.type==='mcq'?q.answer:q.type==='blanks'?q.blanks.map(b=>b.answer):q.pairs.map(p=>p[2])}};"
      "console.log(JSON.stringify(o))})")
STORED = json.loads(subprocess.check_output(['node', '--input-type=module', '-e', js], cwd=ROOT))

results = []
def check(tid, qid, computed):
    stored = STORED[tid][qid]['answer']
    ok = json.dumps(computed) == json.dumps(stored)
    results.append(ok)
    print(f"{'OK ' if ok else 'BAD'} {tid}/{qid}: computed={computed} stored={stored}")

# ---------------- polyomino tools ----------------
def cells(spec):
    return [(x, y) for y, r in enumerate(spec) for x, ch in enumerate(r) if ch != '.']
def normal(cs):
    mx = min(x for x, y in cs); my = min(y for x, y in cs)
    return tuple(sorted((x - mx, y - my) for x, y in cs))
def orients(cs):
    res, c = set(), list(cs)
    for _ in range(4):
        c = [(y, -x) for x, y in c]
        res.add(normal(c)); res.add(normal([(-x, y) for x, y in c]))
    return res
def congruent(a, b):
    return normal(b) in orients(a)
def tilings(region, piece):
    """all ways to cover region exactly with copies of piece (turns and flips allowed)"""
    ors, sols = orients(piece), []
    def rec(rem, acc):
        if not rem: sols.append(acc); return
        t = min(rem, key=lambda p: (p[1], p[0]))
        for o in ors:
            for ax, ay in o:
                pl = [(x + t[0] - ax, y + t[1] - ay) for x, y in o]
                if all(p in rem for p in pl): rec(rem - set(pl), acc + [pl])
    rec(frozenset(region), []); return sols
def pieces(spec):
    d = {}
    for y, r in enumerate(spec):
        for x, ch in enumerate(r):
            if ch != '.': d.setdefault(ch, []).append((x, y))
    return d
def connected(cs):
    cs = set(cs); seen = {next(iter(cs))}; st = list(seen)
    while st:
        x, y = st.pop()
        for n in ((x+1,y),(x-1,y),(x,y+1),(x,y-1)):
            if n in cs and n not in seen: seen.add(n); st.append(n)
    return len(seen) == len(cs)
def shoelace(pts):
    return abs(sum(pts[i][0]*pts[(i+1)%len(pts)][1]-pts[(i+1)%len(pts)][0]*pts[i][1] for i in range(len(pts))))/2

I3 = [(0,0),(1,0),(2,0)]; L3 = [(0,0),(0,1),(1,1)]; O4 = [(0,0),(1,0),(0,1),(1,1)]

# ---------------- t07 Cutting Up Shapes ----------------
print('--- t07 ---')
# explore checks: stair shape, 12 squares, no straight tiling, exactly one L tiling, and the drawn ones are right
STAIR = cells(['##..', '###.', '####', '.###'])
assert len(STAIR) == 12 and len(tilings(STAIR, I3)) == 0 and len(tilings(STAIR, L3)) == 1
ps = pieces(['aa..', 'abb.', 'ccbd', '.cdd']); assert all(congruent(L3, p) for p in ps.values()) and sorted(sum(ps.values(), [])) == sorted(STAIR)
stuck = pieces(['ab..', 'abc.', 'abc?', '.?c?'])
assert all(congruent(I3, stuck[k]) for k in 'abc') and not connected(stuck['?'])
# banner pinwheel: 4 identical L-tetrominoes fill a 4x4 square
pw = pieces(['abbb', 'abcc', 'aadc', 'dddc']); assert all(congruent(pw['a'], p) for p in pw.values()) and len(pw['a']) == 4
print('explore + banner shapes checked')

# a: 15-square tray into 5 identical pieces
A1 = cells(['##...', '####.', '#####', '.####'])
per = len(A1) // 5
assert len(A1) % 5 == 0 and (tilings(A1, L3) or tilings(A1, I3))   # it really can be done
check('t07', 'a', [len(A1), per])
# b: T shape of 4 squares, both diagonals in every square -> count triangles (each square gives 4)
T4 = cells(['###', '.#.']); check('t07', 'b', [4 * len(T4)])
# c: parallelogram (0,4),(2,0),(8,0),(6,4) on a 1 cm grid; cut-and-move gives the same area
para = [(0,4),(2,0),(8,0),(6,4)]
moved = shoelace([(2,0),(8,0),(8,4),(2,4)])
assert shoelace(para) == moved
check('t07', 'c', [int(shoelace(para))])
# d: which rectangles are cut into 4 identical pieces? (pieces as polygons; compare sorted side lengths + area)
def sig(poly):
    n = len(poly); sides = sorted(round(math.dist(poly[i], poly[(i+1)%n]), 6) for i in range(n))
    # angles too, to be safe
    angs = []
    for i in range(n):
        a, b, c = poly[i-1], poly[i], poly[(i+1)%n]
        v1 = (a[0]-b[0], a[1]-b[1]); v2 = (c[0]-b[0], c[1]-b[1])
        angs.append(round(math.degrees(math.acos((v1[0]*v2[0]+v1[1]*v2[1])/math.hypot(*v1)/math.hypot(*v2))), 6))
    return (n, tuple(sides), tuple(sorted(angs)), round(shoelace(poly), 6))
R = lambda x, y, w, h: [(x,y),(x+w,y),(x+w,y+h),(x,y+h)]
optsD = [
    [R(i*30, 0, 30, 60) for i in range(4)],
    [R(0,0,60,30), R(60,0,60,30), R(0,30,60,30), R(60,30,60,30)],
    [[(0,0),(120,0),(60,30)], [(120,0),(120,60),(60,30)], [(120,60),(0,60),(60,30)], [(0,60),(0,0),(60,30)]],
    [R(0,0,60,30), R(0,30,60,30), R(60,0,30,60), R(90,0,30,60)],
]
for o in optsD: assert abs(sum(shoelace(p) for p in o) - 7200) < 1e-9   # pieces fill the 120 x 60 rectangle
check('t07', 'd', [i for i, o in enumerate(optsD) if len({sig(p) for p in o}) == 1])
# e: which piece can cut the 12-square shape into 4 identical pieces?
E = cells(['#....', '#####', '#####', '....#'])
assert len(tilings(E, I3)) == 1
ps = pieces(['a....', 'abbbd', 'acccd', '....d']); assert all(congruent(I3, p) for p in ps.values()) and sorted(sum(ps.values(), [])) == sorted(E)
check('t07', 'e', [i for i, pc in enumerate([I3, L3, O4]) if len(pc) * 4 == len(E) and tilings(E, pc)])
# f: arrow area
arrow = [(0,1),(4,1),(4,0),(6,2),(4,4),(4,3),(0,3)]
check('t07', 'f', [int(shoelace(arrow))])
# g: 9 x 4 rectangle cut into 2 identical pieces that make a square
G = pieces(['aaabbbbbb', 'aaabbbbbb', 'aaaaaabbb', 'aaaaaabbb'])
assert congruent(G['a'], G['b'])
SQ = pieces(['bbbbbb', 'bbbbbb', 'aaabbb', 'aaabbb', 'aaaaaa', 'aaaaaa'])
assert normal(SQ['a']) == normal(G['a']) and normal(SQ['b']) == normal(G['b'])   # pieces only slid, not changed
area = 9 * 4; side = next(k for k in range(1, 100) if k * k == area)
check('t07', 'g', [area, side])
# h: big L of three 4 cm squares into 4 smaller similar L's
bigL = 3 * 4 * 4; small = Fraction(bigL, 4); sq = small / 3
side = next(k for k in range(1, 10) if k * k == sq)
REP = pieces(['aa..', 'ab..', 'cbbd', 'ccdd'])
L12 = cells(['##..', '##..', '####', '####'])
assert all(congruent(L3, p) for p in REP.values()) and sorted(sum(REP.values(), [])) == sorted(L12)
assert normal(L12) == normal([(x*2+i, y*2+j) for x, y in [(0,0),(0,1),(1,1)] for i in (0,1) for j in (0,1)])  # L12 is the big L scaled x2
check('t07', 'h', [side, int(small)])
# i: triangles of any size in a side-3 triangle grid (brute force over lattice points)
def tri_count(n):
    pts = [(a, b) for a in range(n + 1) for b in range(n + 1 - a)]        # a e1 + b e2
    dirs = {(1,0), (0,1), (-1,1)}                                       # lattice directions (and negatives)
    def par(p, q):
        d = (q[0]-p[0], q[1]-p[1]); g = math.gcd(abs(d[0]), abs(d[1]))
        u = (d[0]//g, d[1]//g); return u in dirs or (-u[0], -u[1]) in dirs
    def ln(p, q):  # squared length in the triangular lattice
        dx, dy = q[0]-p[0], q[1]-p[1]; return dx*dx + dx*dy + dy*dy
    c = 0
    for p, q, r in itertools.combinations(pts, 3):
        if par(p, q) and par(q, r) and par(p, r) and ln(p, q) == ln(q, r) == ln(p, r) > 0: c += 1
    return c
check('t07', 'i', [tri_count(3)])

# ---------------- t08 Finding Angles Smartly ----------------
print('--- t08 ---')
def ang(d0, d1):  # counter-clockwise angle from direction d0 to d1
    return (d1 - d0) % 360
check('t08', 'a', [ang(58, 180)])                       # ray at 58° on a straight line
check('t08', 'b', [ang(195, 242), ang(62, 195)])         # lines at 15° and 62°
check('t08', 'c', [180 - 65 - 48])
check('t08', 'd', [ang(255, 380)])                       # rays at 20°, 160°, 255°
assert ang(20, 160) == 140 and ang(160, 255) == 95
def clock(h, m=0):
    a = abs(30 * h + m / 2 - 6 * m) % 360; return min(a, 360 - a)
check('t08', 'e', [int(clock(5)), int(clock(10))])
rays = [8, 40, 78, 115, 152]
check('t08', 'f', [sum(1 for p, q in itertools.combinations(rays, 2) if 0 < abs(p - q) < 180)])
sol = [(a, 2 * a, a + 20) for a in range(1, 180) if a + 2 * a + (a + 20) == 180]
assert len(sol) == 1 and ang(140, 180) == sol[0][0] and ang(60, 140) == sol[0][1] and ang(0, 60) == sol[0][2]  # diagram matches
check('t08', 'g', [sol[0][1], sol[0][2]])
# h: fold geometry, simulated: reflect corner A over crease PQ, then measure the angle at P
Px, Py = 190.0, 30.0; A = (20.0, 30.0)
d = (math.cos(math.radians(215)), -math.sin(math.radians(215)))       # crease direction from P (svg coords)
t = (20 - Px) / d[0]; Q = (Px + t * d[0], Py + t * d[1])
def reflect(p, a, b):
    ax, ay = b[0]-a[0], b[1]-a[1]; k = ((p[0]-a[0])*ax + (p[1]-a[1])*ay) / (ax*ax + ay*ay)
    f = (a[0] + k*ax, a[1] + k*ay); return (2*f[0]-p[0], 2*f[1]-p[1])
A1 = reflect(A, (Px, Py), Q)
def angle_at(v, p, q):
    v1 = (p[0]-v[0], p[1]-v[1]); v2 = (q[0]-v[0], q[1]-v[1])
    return math.degrees(math.acos((v1[0]*v2[0]+v1[1]*v2[1]) / math.hypot(*v1) / math.hypot(*v2)))
assert abs(angle_at((Px, Py), Q, A1) - 35) < 1e-6 and 20 < A1[0] < 330 and 30 < A1[1] < 200   # corner lands on the card
check('t08', 'h', [round(angle_at((Px, Py), A1, (330, 30)))])
# i: build triangle with B = m, A = 57 and check exterior angle 128 at C
m = 128 - 57
B = (40.0, 175.0); C = (215.0, 175.0)
angC = 180 - 57 - m
AB = 175 * math.sin(math.radians(angC)) / math.sin(math.radians(57))
Ap = (B[0] + AB * math.cos(math.radians(m)), B[1] - AB * math.sin(math.radians(m)))
assert abs(angle_at(Ap, B, C) - 57) < 1e-6 and abs(angle_at(C, Ap, (320, 175)) - 128) < 1e-6
check('t08', 'i', [m])

# ---------------- L2 Tessellations ----------------
print('--- L2 ---')
interior = lambda n: Fraction(180 * (n - 2), n)
shapes = [3, 4, 5, 6, 8]
check('L2', 'a', [i for i, n in enumerate(shapes) if (360 / interior(n)).denominator == 1])
check('L2', 'b', [int(360 / interior(3)), int(360 / interior(4)), int(360 / interior(6))])
check('L2', 'c', [int(Fraction(360, 3))])
assert interior(6) == 120
check('L2', 'd', [int(360 - 3 * interior(5))])
oct_ = Fraction(360 - 90, 2); assert oct_ == interior(8)
check('L2', 'e', [int(oct_)])
ks = [k for k in range(0, 10) if 2 * 90 + k * 60 == 360]; assert len(ks) == 1
check('L2', 'f', ks)
check('L2', 'g', [(600 // 50) * (400 // 50)])
# h: build the drawn quadrilateral (as in the JS) and confirm its four angles, then 360 - sum
Aq = (40.0, 170.0); Bq = (240.0, 170.0); Cq = (Bq[0] + 120 * math.cos(math.radians(95)), Bq[1] - 120 * math.sin(math.radians(95)))
ca, sa, cc, sc = math.cos(math.radians(70)), math.sin(math.radians(70)), math.cos(math.radians(165)), math.sin(math.radians(165))
dx, dy = Cq[0] - Aq[0], -(Cq[1] - Aq[1]); det = ca * (-sc) - (-cc) * sa; w = (dx * (-sc) - (-cc) * dy) / det
Dq = (Aq[0] + w * ca, Aq[1] - w * sa)
angs = [angle_at(Aq, Bq, Dq), angle_at(Bq, Cq, Aq), angle_at(Cq, Dq, Bq), angle_at(Dq, Aq, Cq)]
assert [round(a, 6) for a in angs[:3]] == [70, 85, 110] and w > 0
check('L2', 'h', [round(angs[3])])
assert 360 - 70 - 85 - 110 == round(angs[3])
# i: count unit triangles inside a hexagon of side 2 (same lattice test as the drawing)
s = 1.0; e1 = (s, 0); e2 = (s / 2, -s * math.sqrt(3) / 2); ap = 2 * s * math.sqrt(3) / 2 + 1e-9
inside = lambda x, y: all(abs(x * math.cos(math.radians(d)) - y * math.sin(math.radians(d))) <= ap for d in (30, 90, 150))
cnt = 0
for a in range(-5, 6):
    for b in range(-5, 6):
        p = (a * e1[0] + b * e2[0], b * e2[1]); q = (p[0] + s, p[1]); r = (p[0] + e2[0], p[1] + e2[1]); t = (q[0] + e2[0], q[1] + e2[1])
        cnt += inside((p[0]+q[0]+r[0])/3, (p[1]+q[1]+r[1])/3) + inside((q[0]+t[0]+r[0])/3, (q[1]+t[1]+r[1])/3)
assert cnt == 6 * 2 * 2   # 6 big triangles x 4
check('L2', 'i', [cnt])

# levels ladder
for tid, qs in STORED.items():
    lv = [q['level'] for q in qs.values()]
    print(f'{tid}: {len(lv)} questions, levels', ''.join(map(str, lv)))
print(f"\n{sum(results)}/{len(results)} answers match" + ('' if all(results) else '  <-- MISMATCH'))
raise SystemExit(0 if all(results) else 1)
