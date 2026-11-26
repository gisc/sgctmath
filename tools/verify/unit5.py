# Independent verification for Unit 5 (t14 boats, t15 trains).
# Answers are recomputed by step-by-step simulation / brute-force search,
# then compared with the answer keys stored in js/content/unit5.js.
import json, subprocess, os
from fractions import Fraction as Fr

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
js = "import('./js/content/unit5.js').then(m=>{const o={};for(const[t,v]of Object.entries(m.default))for(const q of v.practice)o[t+'/'+q.id]=q.type==='mcq'?{mcq:q.answer,options:q.options}:q.blanks.map(b=>[].concat(b.answer)[0]);console.log(JSON.stringify(o))})"
stored = json.loads(subprocess.check_output(['node', '--input-type=module', '-e', js], cwd=ROOT))

def run_until(pos_fns, cond, dt=Fr(1, 100), tmax=10**4):
    """Advance time in small exact steps until cond(positions) holds. Returns time."""
    t = Fr(0)
    while t <= tmax:
        if cond(*[f(t) for f in pos_fns]): return t
        t += dt
    raise RuntimeError('never happened')

def unique(cands, name):
    assert len(cands) == 1, f'{name}: {len(cands)} solutions {cands}'
    return cands[0]

res = {}
# ---------------- t14: river flows in the +x direction ----------------
# a: speed = how far the boat moves in 1 hour, by simulation
def speed_over_1h(boat, cur, down):
    v = boat + cur if down else -(boat - cur)
    return abs(v * 1)
res['t14/a'] = [speed_over_1h(9, 2, True), speed_over_1h(9, 2, False)]
# b: search paddling speed p with p + 3 = 10
p = unique([p for p in range(1, 50) if p + 3 == 10], 't14b')
res['t14/b'] = [p, p - 3]
# c: simulate km by km per minute until 45 km downstream (13 + 2)
t = run_until([lambda t: (13 + 2) * t], lambda x: x >= 45, dt=Fr(1, 60))
res['t14/c'] = [t]
# d: brute force boat, current
bd = unique([(b, c) for b in range(1, 50) for c in range(1, 50) if b + c == 14 and b - c == 8], 't14d')
res['t14/d'] = list(bd)
# e: positions after 1 hour, A downstream from 0, B upstream from 100
A0, B0 = 0, 100
gap0 = B0 - A0; gap1 = (B0 - (8 - 2) * 1) - (A0 + (10 + 2) * 1)
opts = ['18 km', '22 km', '14 km', '20 km']
res['t14/e'] = {'mcq': opts.index(f'{gap0 - gap1} km')}
# f: simulate each leg
res['t14/f'] = [run_until([lambda t: 12 * t], lambda x: x >= 24), run_until([lambda t: 24 - 8 * t], lambda x: x <= 0)]
# g
d = (15 - 3) * 3
res['t14/g'] = [d, run_until([lambda t: (15 + 3) * t], lambda x: x >= d)]
# h: search B's still-water speed; A starts at lower jetty x=60 going upstream (-x), B at x=0 downstream
def meets_at_3h(vb):
    tm = run_until([lambda t: 60 - (12 - 3) * t, lambda t: (vb + 3) * t], lambda a, b: b >= a, tmax=20)
    return tm == 3
res['t14/h'] = [unique([vb for vb in range(4, 40) if meets_at_3h(vb)], 't14h')]
# i: metres and minutes; current +x. Bottle and Nurul start at 0.
pad, cur = 6000 // 60, 3000 // 60          # m per minute
nurul_at_10 = -(pad - cur) * 10; bottle_at_10 = cur * 10
tt = run_until([lambda t: nurul_at_10 + (pad + cur) * t, lambda t: bottle_at_10 + cur * t], lambda n, b: n >= b, dt=Fr(1, 10))
res['t14/i'] = [tt]

# ---------------- t15: trains; front position f, tail = f - length ----------------
# a: lamp post at 0; front starts at 0
res['t15/a'] = [run_until([lambda t: 15 * t], lambda f: f - 135 >= 0)]
# b: Causeway from 0 to 1040; tail must reach 1040
res['t15/b'] = [run_until([lambda t: 15 * t], lambda f: f - 160 >= 1040)]
# c: front distance from front-on to tail-off
c_dist = run_until([lambda t: t], lambda f: f - 25 >= 95, dt=Fr(1))
res['t15/c'] = {'mcq': ['120 m', '95 m', '70 m', '25 m'].index(f'{c_dist} m')}
# d: search train length
res['t15/d'] = [unique([L for L in range(1, 1000) if run_until([lambda t: 16 * t], lambda f, L=L: f - L >= 380, dt=Fr(1, 16)) == 30], 't15d')]
# e: whole train inside tunnel [0, 500]: tail >= 0 and front <= 500. Count time (front starts at 0)
dt = Fr(1, 100); inside = 0; t = Fr(0)
while t * 18 - 140 <= 600:
    f = 18 * t
    if f - 140 >= 0 and f <= 500: inside += dt
    t += dt
res['t15/e'] = [round(inside - dt)]   # closed interval counted one step extra
# f: search speed and length
sol = [(v, L) for v in range(1, 60) for L in range(1, 600) if Fr(L, v) == 9 and Fr(L + 330, v) == 31]
res['t15/f'] = list(unique(sol, 't15f'))
# g: A front at 0 moving +16 (tail at -140); B front at 0 moving -14 (tail at +160). End: A tail >= B tail
res['t15/g'] = [run_until([lambda t: 16 * t - 140, lambda t: 160 - 14 * t], lambda at, bt: at >= bt)]
# h: cyclist at 6t, train front at 21t; end when tail passes cyclist
res['t15/h'] = [run_until([lambda t: 21 * t - 180, lambda t: 6 * t], lambda tail, c: tail >= c)]
# i: search speed of B. Siti at 14t; B front at 0 moving -vb; tail at 150 - vb t; passes when tail <= Siti
def passes_in_6(vb):
    return run_until([lambda t: 14 * t, lambda t: 150 - vb * t], lambda s, tail: tail <= s, dt=Fr(1, 10), tmax=100) == 6
res['t15/i'] = [unique([vb for vb in range(1, 60) if passes_in_6(vb)], 't15i')]

bad = 0
for k in stored:
    got = res.get(k)
    st = stored[k]
    if isinstance(st, dict): ok = got is not None and got['mcq'] == st['mcq']; sv, gv = st['mcq'], got and got['mcq']
    else:
        gv = [float(x) for x in got] if got else None; sv = [float(x) for x in st]; ok = gv == sv
    bad += not ok
    print(f"{k:7s} computed {gv}  stored {sv}  {'OK' if ok else 'MISMATCH'}")
missing = set(stored) - set(res)
print(f'{len(stored)} questions, {bad} mismatches, {len(missing)} unverified')

# ---------------- explore numbers ----------------
ex = []
ex.append(('t14 down/up times 1 h, 2 h', [run_until([lambda t: 8 * t], lambda x: x >= 8), run_until([lambda t: 4 * t], lambda x: x >= 8)], [1, 2]))
ex.append(('t14 coach boat 11/7 -> boat, current', list(unique([(b, c) for b in range(1, 30) for c in range(1, 30) if b + c == 11 and b - c == 7], 'ex')), [9, 2]))
ex.append(('t15 cross 160+140 at 20', [run_until([lambda t: 20 * t], lambda f: f - 140 >= 160)], [15]))
ex.append(('t15 lamp post 140 at 20', [run_until([lambda t: 20 * t], lambda f: f - 140 >= 0)], [7]))
# table rows: (time, front from bridge start, tail) -> front 20t, tail 20t-140
ex.append(('t15 table', [(t, 20 * t, 20 * t - 140) for t in (0, 4, 8, 12, 15)], [(0, 0, -140), (4, 80, -60), (8, 160, 20), (12, 240, 100), (15, 300, 160)]))
for name, got, exp in ex:
    print(f"{name:40s} {'OK' if got == exp else 'MISMATCH'} {got}")
