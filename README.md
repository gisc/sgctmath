# SG Maths Thinkers · Primary 4

Free, interactive maths-thinking practice for Primary 4 pupils in Singapore.
**Live site:** https://gisc.github.io/sgctmath/

- 🔍 **Let's Explore**: worked examples revealed one step at a time
- 💡 **Remember**: the key ideas in a few sentences
- ✏️ **Practise**: questions rated ★ to ★★★ with instant checking, a hint after a wrong first try, and a worked solution after a second wrong try
- ⭐ **Stars** per topic, saved only in the child's browser (localStorage)

Questions, stories and illustrations are **original** and set in everyday Singapore life (kopitiam, prata shop, MRT, HDB estates). The topic sequence is modelled on the contents list of a P4 maths-thinking workbook. No text or images from that book are reproduced.

## Progress
| Unit | Topics | Status |
|---|---|---|
| 1 Number Sense | 1–4 + Maths in Life | ✅ done |
| 2–13 | 5–26, stories, Challenge Zone | 🚧 coming |

## Develop
A plain static site, with no build step.
```
python3 -m http.server   # then open http://localhost:8000
node tests.mjs           # checks every answer key against the site's own checker
```
Content lives in `js/content/unitN.js`. Illustrations are hand-coded SVG in `js/art.js`.

### Question types
- `mcq`: one answer (`answer: 2`) or several (`answer: [0, 2]`)
- `compare`: rows of `[left, right, '<' | '=' | '>']`
- `blanks`: a template with `{0}` input boxes, `{f:0,1}` fraction boxes, and `{m:0,1,2}` mixed-number boxes

Maths markup in text: `[[f:7/4]]` fraction · `[[m:1 3/4]]` mixed number · `[[r:0.1(6)]]` recurring decimal.

## Licence
Code: MIT. Content and illustrations: CC BY-NC-SA 4.0 © ComputingSG.
