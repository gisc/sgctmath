# Independent verification for js/content/unit9.js (t23 Page Number Problems).
# Every answer is recomputed by brute force: the page/ticket/seat numbers are literally written out as
# strings and their digits counted. Reverse problems are solved by searching every possible page count,
# and each is checked to have exactly one answer.
import json, os, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
js = """
import u from './js/content/unit9.js';
const out = {};
for (const [tid, t] of Object.entries(u)) for (const q of t.practice)
  out[tid + '/' + q.id] = q.type === 'mcq' ? q.answer : q.type === 'compare' ? q.pairs.map(p => p[2]) : q.blanks.map(b => b.answer);
console.log(JSON.stringify(out));
"""
stored = json.loads(subprocess.run(['node', '--input-type=module', '-e', js], cwd=ROOT, capture_output=True, text=True, check=True).stdout)
computed, notes = {}, {}

def text(a, b):            # all the numbers a..b written out one after another
    return ''.join(str(i) for i in range(a, b + 1))
def digits(n): return len(text(1, n))
def count(n, d): return text(1, n).count(d)
def only(xs):
    assert len(xs) == 1, xs
    return xs[0]

# ---------- explore ----------
assert digits(128) == 276
assert len(text(1, 9)) == 9 and len(text(10, 99)) == 180 and len(text(100, 128)) == 87
assert count(128, '1') == 62
ones = sum(1 for i in range(1, 129) if str(i)[-1] == '1')
tens = sum(1 for i in range(1, 129) if len(str(i)) >= 2 and str(i)[-2] == '1')
hund = sum(1 for i in range(1, 129) if len(str(i)) >= 3 and str(i)[-3] == '1')
assert (ones, tens, hund) == (13, 20, 29)
assert only([n for n in range(1, 2000) if digits(n) == 252]) == 120
assert digits(20) == 31        # adult note example

# ---------- practice ----------
# a: pages 1..75
computed['t23/a'] = [len(text(1, 9)), len(range(10, 76)), len(text(10, 75)), digits(75)]
# b: digit 7 in 1..80, by place
b1 = sum(1 for i in range(1, 81) if str(i)[-1] == '7')
b2 = sum(1 for i in range(1, 81) if len(str(i)) >= 2 and str(i)[-2] == '7')
assert b1 + b2 == count(80, '7')
computed['t23/b'] = [b1, b2, count(80, '7')]
# c: seats, 105 stickers -> unique number of seats
computed['t23/c'] = [only([n for n in range(1, 2000) if digits(n) == 105])]
# d: tickets 1..215; options as stored, and each distractor equals the named mistake
d = digits(215)
opts = [537, 534, 645, 447]
assert opts.count(d) == 1
assert 9 + 180 + (215 - 100) * 3 == 534 and 215 * 3 == 645 and 9 + 90 + 116 * 3 == 447
computed['t23/d'] = opts.index(d)
# e: 402 digits -> unique page count; number of 3-digit pages
e = only([n for n in range(1, 5000) if digits(n) == 402])
computed['t23/e'] = [len(range(100, e + 1)), e]
# f: pages 1..120 with at least one 8, and with none
f = sum(1 for i in range(1, 121) if '8' in str(i))
computed['t23/f'] = [f, 120 - f]
# g: exactly 25 zeros: every possible page count, smallest and largest
g = [n for n in range(1, 2000) if count(n, '0') == 25]
assert g == list(range(g[0], g[-1] + 1))
computed['t23/g'] = [g[0], g[-1]]
notes['t23/g'] = f'possible page counts {g[0]}..{g[-1]}'
# h: 60 pages, one sheet (odd front, even back) torn, remaining sum 1783
tot = sum(range(1, 61))
h = [(p, p + 1) for p in range(1, 60, 2) if tot - p - (p + 1) == 1783]
h_any = [(p, p + 1) for p in range(1, 60) if tot - p - (p + 1) == 1783]   # also unique among ANY two neighbouring pages
assert h_any == h
computed['t23/h'] = list(only(h))
# i: pages 21..25 stained, clean sum 1160 -> unique total page count (book must contain page 25)
i = only([n for n in range(25, 5000) if sum(range(1, n + 1)) - sum(range(21, 26)) == 1160])
computed['t23/i'] = [i]

bad = 0
for k in stored:
    ok = json.dumps(computed.get(k)) == json.dumps(stored[k])
    bad += not ok
    print(f"{'OK ' if ok else 'BAD'} {k:7} computed={computed.get(k)} stored={stored[k]} {notes.get(k, '')}")
missing = set(computed) - set(stored)
if missing: print('computed but not stored:', missing); bad += 1
print(f'{len(stored)} questions, {bad} problems')
