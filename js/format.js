// Tiny maths markup → HTML.
//   [[f:7/4]]        stacked fraction
//   [[m:2 3/4]]      mixed number
//   [[r:0.1(6)]]     recurring decimal: dots over first and last digit inside ( )
//   **bold**
export function rec(s) {
  // "0.1(6)" -> 0.1 6̇ ; "0.(27)" -> 0.2̇7̇ ; "0.(142857)" -> dots on 1 and 7
  const m = s.match(/^([^()]*)\(([^()]+)\)$/);
  if (!m) return s;
  const [, pre, blk] = m;
  const d = [...blk];
  const inner = d.map((c, i) => (i === 0 || i === d.length - 1) ? `<span class="rd">${c}</span>` : c).join('');
  return `<span class="num-txt">${pre}${inner}</span>`;
}
export function frac(a, b) { return `<span class="frac"><span>${a}</span><span>${b}</span></span>`; }
export function fmt(str) {
  if (str == null) return '';
  return String(str)
    .replace(/\[\[f:([^\/\]]+)\/([^\]]+)\]\]/g, (_, a, b) => frac(a, b))
    .replace(/\[\[m:(\S+) ([^\/\]]+)\/([^\]]+)\]\]/g, (_, w, a, b) => `<span class="mixed">${w}${frac(a, b)}</span>`)
    .replace(/\[\[r:([^\]]+)\]\]/g, (_, s) => rec(s))
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
}

// Parse what a child types: "0.625", ".5", "7/4", "1 3/4", "1,200", "$12", "12 cm"
export function parseNum(raw) {
  if (raw == null) return NaN;
  let s = String(raw).trim().toLowerCase()
    .replace(/[$,]/g, '').replace(/(\d) (?=\d{3}\b)/g, '$1').replace(/\s*(km\/h|m\/s|cm²|m²|cm2|m2|hours?|hrs?|seconds?|secs?|pages?|cents?|¢|cm|m|km|kg|g|l|ml|years?|min|mins|minutes|s|h|°|degrees?)$/, '')
    .replace(/[−–]/g, '-').replace(/÷/g, '/').trim();
  if (s === '') return NaN;
  let m = s.match(/^(-?\d+)\s+(\d+)\s*\/\s*(\d+)$/);
  if (m) { const w = +m[1], n = +m[2], d = +m[3]; if (!d) return NaN; return w < 0 ? w - n / d : w + n / d; }
  m = s.match(/^(-?\d*\.?\d+)\s*\/\s*(\d*\.?\d+)$/);
  if (m) { const d = +m[2]; if (!d) return NaN; return +m[1] / d; }
  if (/^-?(\d+\.?\d*|\.\d+)$/.test(s)) return parseFloat(s);
  return NaN;
}
export function sameNum(a, b) {
  if (!isFinite(a) || !isFinite(b)) return false;
  return Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
}
export const norm = s => String(s ?? '').trim().toLowerCase().replace(/\s+/g, '').replace(/[×x*]/g, '×');
