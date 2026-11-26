# Authoring guide: SG Maths Thinkers

Read this whole file before writing a unit. **`js/content/unit1.js` is the gold standard.** Read it fully and match its depth, tone, structure and polish.

## 1. What we are building
An interactive, self-checking web version of a P4 maths-thinking course for Singapore pupils (age 9–10).
- The topic list comes from a copyrighted Chinese workbook. **Do not translate or copy its text, questions, numbers, stories or pictures.** Use its pages (`/home/claude/bookpages/NNN.jpg`) only to understand **which skills and problem types** each topic covers and how hard they get. Then write **your own** explanations, stories and questions with **different numbers and situations**, set in Singapore.
- Maths Story pages must be **original Singapore stories** too (the owner's decision): Sports Day relay plan (S1), counting the NDP contingent (S2), and HDB addresses like #05-12 as "two numbers, one place" (S3). Do not retell foreign history or legends.

## 2. Files you may touch
(Your lead tells you which file is yours, e.g. `unit4b.js`. Use that file name for the verify script too: `tools/verify/unit4b.py`.)
- **Only** your own `js/content/unitN.js` (it currently exports `{}`) and your own verification script `tools/verify/unitN.py`.
- Do **not** edit `js/art.js`, `js/engine.js`, `js/app.js`, `css/style.css`, `js/content/catalog.js`, `index.js` or other units. Other authors are working in parallel. Unit-specific SVG helpers go **inside your unit file** (build on the exports of `js/art.js`).
- Do **not** run git commands (no commit/push). The lead integrates.
- If you truly need an engine or CSS change, don't make it. Describe it in your final report and use a workaround.

## 3. Topic object (see unit1.js)
```js
const t05 = {
  id: 't05',                // must match catalog.js
  title: '…',               // may refine the catalog title, keep it short and child-friendly
  intro: '…',               // 1–2 sentences, inviting
  skills: ['…','…','…'],    // 3 chips
  art: () => svg(...),      // banner illustration (unique, attractive, ~360×220 viewBox)
  explore: {
    setup: '…',             // the situation
    art: () => svg(...),    // a DIFFERENT scene from the banner (~340×300 viewBox)
    steps: [ { who: 'leo'|'weiming'|'aisyah'|'arjun'|'chloe', mood?: 'happy'|'think'|'teach', text: '…', art?: () => html/svg }, … ]  // 4–7 steps, a dialogue that teaches
  },
  keys: [ {title, text} ×4 ],   // exactly 4 "Remember" cards
  practice: [ … 7–9 questions … ],
  adult: '…',               // notes for parents/teachers: syllabus link (within P4 / P5–6 / enrichment), common mistakes, a tip
};
export default { t05, t06 };    // export every topic of your unit by id
```
Topic ids come from `js/content/catalog.js` (e.g. Unit 3 = t07, t08, L2; Unit 4 = t09–t13, S1; Unit 6 = t16–t19, S2; Unit 8 = t21, t22, S3; Unit 13 = CZ).

## 4. Question types (engine.js)
Every question has `id` ('a','b',… unique within the topic), `level` 1–3, `prompt`, `hint`, `solution` (string or array of steps), and optionally `art` (an SVG string, **not** a function) and `explain`.
- `mcq`: `options: [...]`, `answer: 2` (single) or `answer: [0,3]` (choose all). Options may contain HTML/markup. Make distractors **plausible**: each should be a typical mistake.
- `compare`: `pairs: [[left, right, '<'|'='|'>'], …]`
- `blanks`: `template` with `{0}` input, `{f:0,1}` fraction (numerator, denominator), `{m:0,1,2}` mixed number; `blanks: [{answer, size?:'sm', kind?:'text', label?}]`. Number answers accept equivalent typed forms (0.5 = 1/2), but a typed fraction must be in its **simplest form** (10/24 is rejected with a "simplify" nudge). Store fraction answers in simplest form. `answer` may be an array of acceptable values. Use `kind:'text'` only for short words/letters (case-insensitive, spaces ignored).
- The checker needs **one unambiguous answer**. Avoid open-ended questions, or questions where several answers are correct but only one is accepted. If several are correct, list them all in `answer: [..]`, or rephrase (e.g. "the smallest possible…").

Markup in any text: `[[f:3/4]]` fraction · `[[m:2 1/3]]` mixed number · `[[r:0.1(6)]]` recurring decimal · `**bold**` · plain HTML (`<b>`, `<i>`, tables with `class="tbl"`, `<span class="hl">` highlight). Inside `[[f:..]]` do not put HTML containing `/`. Use `frac(a,b)` from `../format.js` instead.

## 5. Quality bar (non-negotiable)
**Maths accuracy**
- Every answer must be correct. Write `tools/verify/unitN.py`, which **independently recomputes** every numeric answer (brute force or simulation where possible: digit puzzles by search, pigeonhole and Venn by formula plus a check, scheduling by enumeration). Print each question id with the computed and the stored answer. All must match.
- Check that every puzzle has a **unique** solution (search all possibilities).
- Run `node tests.mjs` (all answer keys must pass the site's own checker).
- Units, money (`$12.50`), time (24-h or a.m./p.m. used consistently) and measurement must be realistic.

**Pedagogy**
- Explore: a short story dialogue that **builds** the idea (problem → attempt → insight → method → check). Use worked visuals: bar models, tables, number lines, diagrams.
- Practice difficulty: about 3 × ★, 3 × ★★, 2–3 × ★★★. Start gentle, end with a genuine challenge.
- Hints nudge without giving the answer. Solutions are clear numbered steps that a 10-year-old can follow, ending with the answer in **bold**.
- Use Singapore methods and terms: **model drawing / bar model**, **supposition method**, **working backwards**, **remainder**, "units and parts".
- Mark honestly in `adult` whether the topic is within the P4 MOE syllabus or enrichment (P5/P6/olympiad style).

**Singapore localisation**
- British spelling (colour, metre, litre, practise as a verb, centre). Money in $ and cents. Metric units.
- Contexts: HDB estates, void decks, hawker centres, kopitiam, MRT/LRT/buses, Sentosa, Gardens by the Bay, East Coast Park, Botanic Gardens, Jurong Bird Park/zoo, community centres, CCAs, school canteen, Racial Harmony Day, Hari Raya, Deepavali, Chinese New Year, Christmas, National Day, NDP. Food: chicken rice, prata, nasi lemak, satay, kaya toast, laksa, kueh, curry puffs, ice kachang, teh/kopi.
- Names: a diverse Singaporean mix (Chinese, Malay, Indian, Eurasian), e.g. Mei Ling, Hafiz, Priya, Ravi, Siti, Jun Jie, Nurul, Kumar, Daniel, Farah, Mdm Lim, Mr Rahman, Mrs Pillai, Uncle Tan. The recurring cast: **Leo** (red-and-white lion-cub mascot, the teacher voice), **Wei Ming**, **Aisyah** (wears a tudung), **Arjun**, **Chloe**.
- Keep it warm and inclusive. Light Singlish ("Shiok!", "Can lah!") is fine in dialogue but rare.

**Singapore adaptation checklist (the user's top priority; check every topic before reporting)**
- [ ] The explore story and the banner/explore art are set somewhere recognisably Singaporean.
- [ ] At least 6 of the 7–9 practice questions have a Singapore setting (place, food, transport, school life, festival or national event). Bare-number drills only where the skill is pure technique.
- [ ] Names cover a diverse Singaporean mix across the topic (not all one ethnicity); titles like Mdm/Mr/Uncle/Auntie are used naturally.
- [ ] Money is in $/cents at realistic Singapore prices. Units are metric. Spelling is British.
- [ ] Nothing reads as translated from another country (no yuan/jin/li, no mainland place names, no foreign school customs) (this applies to Maths Story pages too).
- [ ] The adult notes link to the Singapore MOE syllabus (P4 / P5–P6 / enrichment) and use SG terms (model drawing, units and parts, supposition).

**Visual quality**
- Every topic needs a **unique banner** and a **different explore scene**, plus question diagrams wherever a picture helps (geometry **must** have accurate diagrams drawn to match the numbers: angles look like their size, lengths in proportion).
- Use `js/art.js` exports: `svg, leo, leoFace, kid(key,{x,y,s,mood,pose:'stand'|'wave'|'cheer'|'think',flip}), kidFace, cloud, tree, hdb, mrt, heroScene, fractionCircle(s), prata, cup, bottle, matchSquares, matchPattern, bars (bar models), balance, kopi, kayaToast, eggs, mysteryBox, KUEH, kuehBox, table, puddle, ink, stroke`. Build new unit-specific helpers inside your unit file in the **same style**: flat colours, `stroke="#23304a" stroke-width="3"`, rounded joins, palette teal `#0f9d94`, coral `#ff6b5b`, sun `#ffc94a`, grape `#7b61ff`, leaf `#3dbb6b`, sky `#4aa8ff`. Text in SVG: `font-family="Baloo 2, sans-serif"` (headings) or `Nunito, sans-serif`, weight 800.
- Kids are about 150 units tall at s=1 (head centre at y=0, feet at about y=115). Leo is similar.
- SVG `viewBox` is required. For question diagrams add `style="max-width:NNNpx"` so small diagrams are not blown up (pass it as the 4th arg of `svg()`).

## 6. Workflow (take your time, quality over speed)
1. Read `AUTHORING.md` and `js/content/unit1.js` in full. Skim `js/art.js` and `js/engine.js`.
2. Look at the book pages for your topics (Read the jpgs) **only to understand the skills and the difficulty ladder**. Then close them and design your own.
3. Plan each topic: the key idea, the explore story, 4 keys, and a question list with answers. Solve every question yourself.
4. Write `unitN.js`. Write `tools/verify/unitN.py` and run it. Run `node tests.mjs`.
5. Render: a server is already running on port 8765 at the repo root (if `curl -s localhost:8765 >/dev/null` fails, start `cd /home/claude/sgctmath && nohup python3 -m http.server 8765 &`). Run `python3 tools/pages.py <ids> 1100 1 uN_` and also at width 390 (scale 2) for mobile. Use `python3 tools/crop.py` to split tall screenshots, and **Read the images**. Check every illustration, diagram, fraction and table. Fix anything ugly, overlapping, cut off or mismatched with the numbers.
6. Click through at least two questions per topic with Playwright (wrong answer → hint, wrong again → solution; right answer → praise) to make sure the template inputs work.
7. Final self-review: re-read every prompt, hint and solution for typos, ambiguity, spelling and maths. Then report back.

## 7. Final report (your last message)
Topic ids done, number of questions, a one-line summary per topic, the verify output summary, any requested engine/CSS changes, and anything you're unsure about.
