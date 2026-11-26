# Independent verification for Unit 7 (t20 Working Backwards).
# Every answer is found by BRUTE-FORCE SEARCH over all possible starting values:
# each candidate is simulated FORWARDS through the story, and we keep the ones that
# produce the stated ending. We check the solution is unique, then compare with the
# answer keys stored in js/content/unit7.js.
import json, subprocess, os
from fractions import Fraction as Fr

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
js = "import('./js/content/unit7.js').then(m=>{const o={};for(const[t,v]of Object.entries(m.default))for(const q of v.practice)o[t+'/'+q.id]=q.type==='mcq'?{mcq:q.answer,options:q.options}:q.blanks.map(b=>[].concat(b.answer)[0]);console.log(JSON.stringify(o))})"
stored = json.loads(subprocess.check_output(['node', '--input-type=module', '-e', js], cwd=ROOT))

def unique(cands, name):
    assert len(cands) == 1, f'{name}: {len(cands)} solutions {cands[:10]}'
    return cands[0]

def half(x):
    """exact half; None if it is not a whole number (cannot split items/dollars in half)"""
    return x // 2 if x % 2 == 0 else None

res = {}

# ---------- explore ----------
def arjun(m):            # spend half, then $2 -> $4 left
    h = half(m)
    return None if h is None else h - 2
assert unique([m for m in range(1, 1000) if arjun(m) == 4], 'arjun') == 12

def double_swap(w, c):   # W doubles C, then C doubles W
    if c > w: return None
    w, c = w - c, 2 * c
    if w > c: return None
    c, w = c - w, 2 * w
    return w, c
ex = unique([(w, 40 - w) for w in range(0, 41) if double_swap(w, 40 - w) == (20, 20)], 'stickers')
assert ex == (25, 15), ex
print('explore: Arjun $12, Wei Ming 25, Chloe 15  OK')

# ---------- a: spend half, then $6, $15 left ----------
def qa(m):
    h = half(m)
    return None if h is None else h - 6
res['t20/a'] = [unique([m for m in range(1, 2000) if qa(m) == 15], 'a')]

# ---------- b: x3, -7, /4 gives 5 ----------
res['t20/b'] = [unique([x for x in range(-100, 1000) if Fr(3 * x - 7, 4) == 5], 'b')]

# ---------- c: add 8, half eaten, 14 left; MCQ of workings ----------
def qc(x):
    t = x + 8
    return t - t / 2
start_c = unique([x for x in range(0, 500) if qc(x) == 14], 'c')
work = [14 * 2 - 8, 14 / 2 + 8, (14 - 8) * 2, 14 * 2 + 8]   # same order as the options
c_ans = unique([i for i, v in enumerate(work) if v == start_c], 'c-options')
res['t20/c'] = {'mcq': c_ans}
# check each option's printed result matches its working
for opt, v in zip(stored['t20/c']['options'], work):
    assert opt.endswith('= ' + str(int(v))), (opt, v)

# ---------- d: book pages ----------
def qd(n):
    h = half(n)
    if h is None: return None
    left = n - (h + 10)
    h2 = half(left)
    if h2 is None or left < 0: return None
    return left - (h2 + 5)
res['t20/d'] = [unique([n for n in range(1, 5000) if qd(n) == 20], 'd')]

# ---------- e: three friends, fixed gifts, all equal at the end ----------
def qe(d, f, w):
    d, f = d - 6, f + 6
    f, w = f - 9, w + 9
    w, d = w - 4, d + 4
    return (d, f, w) if min(d, f, w) >= 0 else None
c = [(d, f, 75 - d - f) for d in range(76) for f in range(76 - d)
     if qe(d, f, 75 - d - f) == (25, 25, 25)]
res['t20/e'] = list(unique(c, 'e'))

# ---------- f: dispensers (allow halves of a litre in the search) ----------
def qf(a, b):
    p = a / 2
    a, b = a - p, b + p
    a, b = a + 4, b - 4
    return (a, b) if b >= 0 else None
c = [(a, 30 - a) for a in [Fr(k, 2) for k in range(0, 61)] if qf(a, 30 - a) == (15, 15)]
res['t20/f'] = list(unique(c, 'f'))

# ---------- g: Mei Ling & Kumar doubling, Kumar 8 more at the end ----------
def qg(m, k):
    if k > m: return None
    m, k = m - k, 2 * k
    if m > k: return None
    k, m = k - m, 2 * m
    return m, k
c = [(m, 48 - m) for m in range(49) if (r := qg(m, 48 - m)) and r[1] - r[0] == 8]
res['t20/g'] = list(unique(c, 'g'))

# ---------- h: three-player doubling game ----------
def lose(t, i):
    t = list(t)
    for j in range(3):
        if j != i:
            t[i] -= t[j]; t[j] *= 2
    return tuple(t) if min(t) >= 0 else None
def qh(t):
    for i in range(3):
        t = lose(t, i)
        if t is None: return None
    return t
c = [(h, j, 72 - h - j) for h in range(73) for j in range(73 - h) if qh((h, j, 72 - h - j)) == (24, 24, 24)]
res['t20/h'] = list(unique(c, 'h'))

# ---------- i: guppy tanks ----------
def qi(a, b, cc):
    if a < 12: return None
    a, b = a - 12, b + 12
    if b % 2: return None
    m = b // 2; b, cc = b - m, cc + m
    if cc % 3: return None
    m = cc // 3; cc, a = cc - m, a + m
    return a, b, cc
c = [(a, b, 180 - a - b) for a in range(181) for b in range(181 - a)
     if (r := qi(a, b, 180 - a - b)) and r[0] == 2 * r[1] and r[2] == 3 * r[1]]
res['t20/i'] = list(unique(c, 'i'))

# ---------- compare ----------
bad = 0
for k in stored:
    s, r = stored[k], res.get(k)
    if isinstance(s, dict):
        ok = r is not None and s['mcq'] == r['mcq']
        print(f"{k}: computed option {r['mcq'] if r else None}, stored {s['mcq']}  {'OK' if ok else 'MISMATCH'}")
    else:
        ok = r is not None and len(r) == len(s) and all(Fr(str(x)) == Fr(str(y)) for x, y in zip(r, s))
        print(f"{k}: computed {[str(x) for x in r] if r else None}, stored {s}  {'OK' if ok else 'MISMATCH'}")
    bad += not ok
missing = set(res) - set(stored)
if missing: print('not in file:', missing); bad += 1
print(f'{len(stored)} questions, {bad} problems')
