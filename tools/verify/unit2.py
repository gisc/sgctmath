# Independent verification for js/content/unit2.js (t05, t06).
# Recomputes every answer (brute force where possible), checks uniqueness, and compares with the stored keys.
import itertools, re, subprocess, json, os

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
# Pull the stored answer keys straight from the site module, so we compare against what is actually shipped.
js = """
import u from './js/content/unit2.js';
const out = {};
for (const [tid, t] of Object.entries(u)) for (const q of t.practice)
  out[tid + '/' + q.id] = q.type === 'mcq' ? q.answer : q.type === 'compare' ? q.pairs.map(p => p[2]) : q.blanks.map(b => b.answer);
console.log(JSON.stringify(out));
"""
stored = json.loads(subprocess.run(['node', '--input-type=module', '-e', js], cwd=ROOT, capture_output=True, text=True, check=True).stdout)

computed = {}
notes = {}
def sym(a, b): return '<' if a < b else '>' if a > b else '='

# ---------------- t05 ----------------
# a: which expression equals 23*104?
opts = [23*100 + 23*4, 23*100 + 4, 23*10 + 23*4, 23*100*4]
computed['t05/a'] = [i for i, x in enumerate(opts) if x == 23*104][0]
assert sum(x == 23*104 for x in opts) == 1
computed['t05/b'] = [102 - 100, 18*100, 18*2, 18*102]
assert 18*100 + 18*2 == 18*102
computed['t05/c'] = [8*99]
pairs = [(37*101, 3737), (46*99, 4600 - 99), (26*104, 2600 + 4), (48*98, 4800 - 96)]
computed['t05/d'] = [sym(a, b) for a, b in pairs]
computed['t05/e'] = [24*46 + 24*54]
assert 24*(46+54) == 24*46 + 24*54
computed['t05/f'] = [16*58 + 32*21]
computed['t05/g'] = [45*128 - 15*84]
computed['t05/h'] = [4444*27 + 3333*64]
A, B = 2468*1357, 2467*1358
opts = [A == B, A - B == 1, A - B == 1110, B - A == 1110]
assert sum(opts) == 1
computed['t05/i'] = opts.index(True)
notes['t05/i'] = f'A={A} B={B} B-A={B-A}'
# explore / keys arithmetic
for lhs, rhs in [(15*104, 1560), (15*98, 1470), (15*37 + 15*63, 1500), (12*103, 1236), (13*99, 1287), (27*46 + 27*54, 2700), (14*32 + 28*34, 1400), (16*102, 1632), (23*104, 2392)]:
    assert lhs == rhs, (lhs, rhs)

# ---------------- t06 ----------------
n = '52947'
val = {d: int(d) * 10 ** (len(n) - 1 - i) for i, d in enumerate(n)}
computed['t06/a'] = [val['2'], val['9'], val['4']]
opts = [5*1000 + 6*100 + 8, 56*100 + 8, 56*10 + 8, 5*1000 + 6*10 + 8, 560*10 + 8]
computed['t06/b'] = [i for i, x in enumerate(opts) if x == 5608]
nums = [int(''.join(p)) for p in itertools.permutations('0375') if p[0] != '0']
computed['t06/c'] = [max(nums), min(nums)]
computed['t06/d'] = [2 + 5 + 8, 258 + 582 + 825]
assert 111 * 15 == 258 + 582 + 825
sol = [x for x in range(10, 100) if x // 10 + x % 10 == 11 and (x % 10) * 10 + x // 10 - x == 27]
assert len(sol) == 1, sol
computed['t06/e'] = sol
sol = [x for x in range(10, 100) if 300 + x == 5 * x + 12]
assert len(sol) == 1, sol
computed['t06/f'] = sol
lucky = [x for x in range(10, 100) if x == 7 * (x // 10 + x % 10)]
notes['t06/g'] = f'lucky numbers {lucky}'
computed['t06/g'] = [len(lucky), max(lucky)]
assert 42 in lucky
sol = [x for x in range(1000, 10000) if x + x // 10 + x // 100 + x // 1000 == 4138]
assert len(sol) == 1, sol
computed['t06/h'] = sol
sol = [x for x in range(10000, 100000) if int(str(x) + '1') == 3 * int('1' + str(x))]
assert len(sol) == 1, sol
computed['t06/i'] = sol
# explore / keys arithmetic
assert 472 + 724 + 247 == 1443 == 111 * 13
assert 47*100 + 25 == 4725 and 472*10 + 5 == 4725
assert 6*1000 + 0*100 + 9*10 + 4 == 6094 == 60*100 + 94 == 609*10 + 4
for a, b, c in itertools.permutations(range(10), 3):   # 111 trick holds for all digit choices
    f = lambda x, y, z: 100*x + 10*y + z
    assert f(a, b, c) + f(b, c, a) + f(c, a, b) == 111 * (a + b + c)

bad = 0
for k in stored:
    ok = json.dumps(computed.get(k)) == json.dumps(stored[k])
    bad += not ok
    print(f"{'OK ' if ok else 'BAD'} {k:7} computed={computed.get(k)} stored={stored[k]} {notes.get(k, '')}")
missing = set(computed) - set(stored)
if missing: print('computed but not stored:', missing); bad += 1
print(f'{len(stored)} questions, {bad} problems')
