// Unit 5 · Maths Modelling — original content, Singapore context.
import * as A from '../art.js';
const { svg, kid, leo } = A;
const INK = A.ink, S = A.stroke;
const F = 'font-family="Nunito, sans-serif" font-weight="800"';
const FB = 'font-family="Baloo 2, sans-serif" font-weight="800"';
const tx = (x, y, t, { size = 14, fill = INK, anchor = 'middle', b = false } = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" ${b ? FB : F} font-size="${size}" fill="${fill}">${t}</text>`;
let uid = 0;
const nid = p => `u5${p}${++uid}`;
const r1 = v => Math.round(v * 10) / 10;

// rounded panel with clipped contents
function panel(W, H, inner, bg = '#f3faff') {
  const c = nid('pc');
  return `<defs><clipPath id="${c}"><rect width="${W}" height="${H}" rx="16"/></clipPath></defs><g clip-path="url(#${c})"><rect width="${W}" height="${H}" fill="${bg}"/>${inner}</g>`;
}
// horizontal arrow from x1 to x2 (head at x2)
function arrowH(x1, x2, y, c, w = 7) {
  const d = Math.sign(x2 - x1) || 1, hl = 13, hw = w / 2 + 6, xe = r1(x2 - d * hl);
  return `<path d="M${r1(x1)} ${y} H${xe}" stroke="${INK}" stroke-width="${w + 5}" stroke-linecap="round"/><path d="M${r1(x1)} ${y} H${xe}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/><path d="M${xe} ${y - hw} L${r1(x2)} ${y} L${xe} ${y + hw}Z" fill="${c}" ${S} stroke-width="2.5"/>`;
}
// square bracket with label. up=false: label below; up=true: label above
function bracket(x1, x2, y, label, { up = false, color = INK, size = 13 } = {}) {
  const d = up ? 6 : -6;
  return `<path d="M${r1(x1)} ${y + d} V${y} H${r1(x2)} V${y + d}" fill="none" stroke="${color}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>` +
    (label ? tx(r1((x1 + x2) / 2), up ? y - 7 : y + 17, label, { size, fill: color }) : '');
}

/* ===================== River kit ===================== */
function water(x, y, w, h, c = '#9fd6f5') {
  let waves = '', row = 0;
  for (let yy = y + 14; yy < y + h - 6; yy += 22, row++)
    for (let xx = x + 12 + (row % 2) * 30; xx < x + w - 24; xx += 64)
      waves += `<path d="M${xx} ${yy} q6 -5 12 0 t12 0" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".75"/>`;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>${waves}`;
}
function currentTag(x, y, text) {
  const w = 52 + text.length * 7.2;
  return `<rect x="${x - 6}" y="${y - 15}" width="${r1(w)}" height="22" rx="11" fill="#fff" opacity=".9"/>` + flowArrow(x, y - 4, 30) + tx(x + 42, y + 1, text, { anchor: 'start', fill: '#1b6fa8', size: 13 });
}
function flowArrow(x, y, len = 44, c = '#1b6fa8') {
  return `<path d="M${x} ${y} h${len}" stroke="${c}" stroke-width="3" stroke-linecap="round" stroke-dasharray="3 7"/><path d="M${x + len - 4} ${y - 6} l9 6 l-9 6" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
}
// a boat whose waterline is at y. dir 1 = facing right, -1 = facing left
function boat(x, y, { kind = 'bumboat', dir = 1, color = '#ff6b5b', s = 1 } = {}) {
  let g = '';
  if (kind === 'bumboat') g = `
    <ellipse cx="0" cy="2" rx="68" ry="5" fill="#fff" opacity=".55"/>
    <path d="M-38 -16 V-40 M30 -16 V-40" ${S}/>
    <path d="M-50 -38 Q-4 -50 44 -38 L46 -34 H-52Z" fill="#ffc94a" ${S}/>
    <path d="M-62 -18 H66 Q60 -4 46 2 H-46 Q-58 -4 -62 -18Z" fill="${color}" ${S}/>
    <path d="M-54 -11 H58" stroke="#fff" stroke-width="3" opacity=".75"/>
    ${[-38, -14, 10, 34].map(t => `<circle cx="${t}" cy="-5" r="4.5" fill="#3b3f58"/>`).join('')}
    <path d="M52 -18 q6 -6 12 -4" fill="none" ${S} stroke-width="2.4"/>`;
  else if (kind === 'kayak') g = `
    <ellipse cx="0" cy="2" rx="64" ry="5" fill="#fff" opacity=".55"/>
    <path d="M-30 -36 L28 -4" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="-32" cy="-37" rx="4" ry="9" transform="rotate(-60 -32 -37)" fill="#ffc94a" ${S} stroke-width="2"/>
    <ellipse cx="30" cy="-3" rx="4" ry="9" transform="rotate(-60 30 -3)" fill="#ffc94a" ${S} stroke-width="2"/>
    <path d="M-10 -8 q10 -20 20 0z" fill="#4aa8ff" ${S} stroke-width="2.4"/>
    <circle cx="0" cy="-26" r="8" fill="#e8b48a" ${S} stroke-width="2.4"/>
    <path d="M-9 -28 q9 -12 18 0" fill="#ff6b5b" ${S} stroke-width="2.4"/>
    <path d="M-60 -6 Q0 -18 62 -6 Q0 8 -60 -6Z" fill="${color}" ${S}/>`;
  else g = `
    <ellipse cx="0" cy="2" rx="78" ry="5" fill="#fff" opacity=".55"/>
    <path d="M-8 -58 v-16" ${S}/><path d="M-8 -74 l12 4 l-12 4z" fill="#ff6b5b" ${S} stroke-width="2"/>
    <rect x="-30" y="-58" width="44" height="16" rx="4" fill="#fff" ${S}/>
    <rect x="-52" y="-44" width="88" height="26" rx="6" fill="#fff" ${S}/>
    ${[-44, -24, -4, 16].map(t => `<rect x="${t}" y="-38" width="12" height="10" rx="2" fill="#8fc8ff"/>`).join('')}
    <path d="M-72 -20 H76 Q70 -2 52 2 H-58 Q-70 -6 -72 -20Z" fill="${color}" ${S}/>
    <path d="M-64 -12 H68" stroke="#fff" stroke-width="3" opacity=".75"/>`;
  return `<g transform="translate(${x} ${y}) scale(${dir * s} ${s})">${g}</g>`;
}
function bottle(x, y) {
  return `<g transform="translate(${x} ${y}) rotate(-70)"><rect x="-7" y="-18" width="14" height="28" rx="5" fill="#7b61ff" ${S} stroke-width="2.4"/><rect x="-4" y="-25" width="8" height="8" rx="2" fill="#ffc94a" ${S} stroke-width="2"/></g>`;
}
// a cast kid sitting in a kayak (legs hidden by the hull)
function kayaker(key, x, y, dir = 1, color = '#ffc94a') {
  const c = nid('kc');
  return `<g transform="translate(${x} ${y})">
    <defs><clipPath id="${c}"><rect x="-60" y="-70" width="120" height="98"/></clipPath></defs>
    <ellipse cx="0" cy="36" rx="84" ry="8" fill="#fff" opacity=".5"/>
    <g clip-path="url(#${c})">${kid(key, { x: 0, y: 0, s: .55, flip: dir < 0 })}</g>
    <g transform="scale(${dir} 1)">
      <path d="M-46 0 L44 34" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
      <ellipse cx="-48" cy="-1" rx="5" ry="12" transform="rotate(-70 -48 -1)" fill="#ff6b5b" ${S} stroke-width="2"/>
      <ellipse cx="46" cy="35" rx="5" ry="12" transform="rotate(-70 46 35)" fill="#ff6b5b" ${S} stroke-width="2"/>
      <path d="M-80 30 Q0 12 82 28 Q0 46 -80 30Z" fill="${color}" ${S}/>
      <path d="M-22 25 q22 -6 44 0" fill="none" ${S} stroke-width="2.4"/>
    </g></g>`;
}
// river picture for questions; current flows to the right
function riverQ({ items = [], current = '2 km/h', W = 420, H = 150, jetties = [], dist = '', cx = 16 }) {
  const wy = 22, wh = H - wy - (dist ? 46 : 22);
  let g = `<rect width="${W}" height="${wy}" fill="#8edb9f"/>` + water(0, wy, W, wh) +
    `<rect y="${wy + wh}" width="${W}" height="${H - wy - wh}" fill="#8edb9f"/>` + currentTag(cx, wy + 22, `current ${current}`);
  for (const j of jetties) g += `<rect x="${j.x - 12}" y="${wy + 2}" width="24" height="${r1(wh * .4)}" rx="3" fill="#c98b55" ${S} stroke-width="2.4"/>` + tx(j.x, 16, j.label, { size: 13 });
  for (const it of items) {
    g += it.kind === 'bottle' ? bottle(it.x, it.y) : boat(it.x, it.y, it);
    if (it.label) g += tx(it.x + (it.lx || 0), it.y + (it.ly || 20), it.label, { size: 13, fill: it.lc || INK });
  }
  if (dist) g += bracket(jetties[0].x, jetties[1].x, wy + wh + 8, '') + tx((jetties[0].x + jetties[1].x) / 2, wy + wh + 26, dist, { size: 14 });
  return g;
}
// how the current adds to / takes away from the boat's own speed
function flowDiag(b, c, dir = 'down', { kind = 'kayak', unit = 'km/h' } = {}) {
  const W = 330, H = 214, k = 210 / (b + c), word = kind === 'kayak' ? 'paddling' : 'boat';
  let g = `<rect width="${W}" height="18" fill="#8edb9f"/>` + water(0, 18, W, 86) + `<rect y="104" width="${W}" height="10" fill="#8edb9f"/>` +
    currentTag(16, 42, `current ${c} ${unit}`);
  if (dir === 'down') {
    const x0 = 60, x1 = x0 + b * k, x2 = x1 + c * k;
    g += boat(180, 90, { kind, dir: 1, color: '#ffc94a' }) + tx(268, 46, 'downstream →', { size: 14, fill: '#2c9654' }) +
      arrowH(x0, x1, 148, '#ff6b5b') + arrowH(x1, x2, 148, '#0f9d94') +
      tx((x0 + x1) / 2, 134, `${word} ${b}`, { size: 14, fill: '#d6453a' }) + tx((x1 + x2) / 2 + 6, 134, `current + ${c}`, { size: 14, fill: '#0f7a73' }) +
      bracket(x0, x2, 168, '') + tx(W / 2, 192, `downstream speed = ${b} + ${c} = ${b + c} ${unit}`, { size: 16, fill: '#2c9654', b: true });
  } else {
    const xR = 290, x1 = xR - b * k, x2 = x1 + c * k;
    g += boat(200, 90, { kind, dir: -1, color: '#ffc94a' }) + tx(70, 96, '← upstream', { size: 14, fill: '#d6453a' }) +
      arrowH(xR, x1, 144, '#ff6b5b') + arrowH(x1, x2, 162, '#0f9d94') +
      tx((x1 + xR) / 2, 132, `← ${word} ${b}`, { size: 14, fill: '#d6453a' }) + tx(x1 - 8, 167, `current − ${c}`, { size: 14, fill: '#0f7a73', anchor: 'end' }) +
      bracket(x2, xR, 180, '') + tx(W / 2, 204, `upstream speed = ${b} − ${c} = ${b - c} ${unit}`, { size: 16, fill: '#d6453a', b: true });
  }
  return svg(`0 0 ${W} ${H}`, panel(W, H, g), `${dir === 'down' ? 'Downstream' : 'Upstream'}: ${word} speed ${b} ${dir === 'down' ? 'plus' : 'minus'} current ${c}`, 'style="max-width:400px"');
}
// bar model: downstream and upstream bars
function sdBars(down, up) {
  const boatS = (down + up) / 2, cur = (down - up) / 2, k = 16, x0 = 90, W = 340, H = 134;
  const bw = boatS * k, cw = cur * k;
  const g = tx(84, 40, 'Down', { anchor: 'end', size: 15 }) +
    `<rect x="${x0}" y="20" width="${bw}" height="30" fill="#ffb3ab" ${S} stroke-width="2.4"/><rect x="${x0 + bw}" y="20" width="${cw}" height="30" fill="#9fe3dc" ${S} stroke-width="2.4"/>` +
    tx(x0 + bw / 2, 40, 'boat', { size: 13 }) + tx(x0 + bw + cw / 2, 14, 'current', { size: 12, fill: '#0f7a73' }) + tx(x0 + bw + cw + 6, 40, `= ${down} km/h`, { anchor: 'start', size: 15 }) +
    tx(84, 84, 'Up', { anchor: 'end', size: 15 }) +
    `<rect x="${x0}" y="64" width="${bw - cw}" height="30" fill="#ffb3ab" ${S} stroke-width="2.4"/><rect x="${x0 + bw - cw}" y="64" width="${cw}" height="30" fill="#fff" stroke="${INK}" stroke-width="2.4" stroke-dasharray="5 4"/>` +
    `<path d="M${x0 + bw - cw + 6} 70 l${cw - 12} 18 M${x0 + bw - 6} 70 l-${cw - 12} 18" stroke="#d6453a" stroke-width="2.4" stroke-linecap="round"/>` +
    tx(x0 + (bw - cw) / 2, 84, 'boat − current', { size: 13 }) + tx(x0 + bw + 6, 84, `= ${up} km/h`, { anchor: 'start', size: 15 }) +
    bracket(x0 + bw - cw, x0 + bw + cw, 104, '', { color: '#7b61ff' }) + tx(W / 2 + 20, 124, `${down} − ${up} = ${down - up} = 2 lots of current`, { size: 14, fill: '#7b61ff' });
  return svg(`0 0 ${W} ${H}`, panel(W, H, g, '#fffaf0'), `Bar model: downstream ${down} is boat plus current, upstream ${up} is boat minus current`, 'style="max-width:400px"');
}

/* ===================== Train kit ===================== */
// train whose wheels sit on the track line yT, from x to x+len. dir 1 = front on the right
function train(x, yT, len, { dir = 1, stripe = '#e1484b', body = '#f4f6fb', h = 24, cars } = {}) {
  const n = cars || Math.max(1, Math.round(len / 46)), cw = len / n, y0 = yT - 4 - h;
  let g = '';
  for (let i = 0; i < n; i++) {
    const cx = r1(x + i * cw + 1), w = r1(cw - 2), front = dir === 1 ? i === n - 1 : i === 0;
    const R = Math.min(10, w / 3);
    const d = front && dir === 1 ? `M${cx + 3} ${y0} H${r1(cx + w - R)} Q${r1(cx + w)} ${y0} ${r1(cx + w)} ${y0 + 12} V${y0 + h} H${cx} V${y0 + 3}Z`
      : front ? `M${r1(cx + w - 3)} ${y0} H${r1(cx + R)} Q${cx} ${y0} ${cx} ${y0 + 12} V${y0 + h} H${r1(cx + w)} V${y0 + 3}Z`
        : `M${cx + 3} ${y0} H${r1(cx + w - 3)} V${y0 + h} H${cx} V${y0 + 3}Z`;
    g += `<path d="${d}" fill="${body}" ${S} stroke-width="2.2"/><rect x="${cx + 1}" y="${y0 + h - 9}" width="${r1(w - 2)}" height="4" fill="${stripe}"/>`;
    const span = w - (front ? 14 : 6), m = Math.max(1, Math.floor(span / 13));
    const wx0 = front && dir === -1 ? cx + 12 : cx + 4;
    for (let j = 0; j < m; j++) g += `<rect x="${r1(wx0 + j * span / m + (span / m - 7) / 2)}" y="${y0 + 5}" width="7" height="7" rx="1.5" fill="#8fc8ff"/>`;
    if (front) g += `<rect x="${r1(dir === 1 ? cx + w - 8 : cx + 2)}" y="${y0 + 5}" width="6" height="9" rx="2" fill="${INK}"/>`;
    g += `<circle cx="${r1(cx + w * .25)}" cy="${yT - 3}" r="3" fill="${INK}"/><circle cx="${r1(cx + w * .75)}" cy="${yT - 3}" r="3" fill="${INK}"/>`;
  }
  return g;
}
function track(x1, x2, yT) {
  let g = '';
  for (let x = x1 + 4; x < x2; x += 12) g += `<path d="M${x} ${yT} v4" stroke="#8a6a4a" stroke-width="2"/>`;
  return g + `<path d="M${x1} ${yT} H${x2}" stroke="${INK}" stroke-width="2.6"/>`;
}
function lampPost(x, yT) {
  return `<rect x="${x - 3}" y="${yT - 44}" width="6" height="44" fill="#5d6b88" ${S} stroke-width="2"/><path d="M${x} ${yT - 42} q0 -6 10 -6 h4" fill="none" ${S}/><rect x="${x + 10}" y="${yT - 52}" width="14" height="7" rx="3" fill="#ffc94a" ${S} stroke-width="2"/>`;
}
// ground/water under the line, plus bridge/tunnel/causeway between bx1 and bx2
function structure(kind, bx1, bx2, yT, W, layer) {
  if (layer === 'back') {
    if (kind === 'bridge') {
      let truss = `<path d="M${bx1 + 2} ${yT - 2} L${bx1 + 10} ${yT - 30} H${bx2 - 10} L${bx2 - 2} ${yT - 2}" fill="none" stroke="#7fb3dd" stroke-width="4" stroke-linejoin="round"/>`;
      const n = Math.max(2, Math.round((bx2 - bx1 - 20) / 30)), st = (bx2 - bx1 - 20) / n;
      let z = `M${bx1 + 10} ${yT - 30}`;
      for (let i = 0; i < n; i++) z += ` L${r1(bx1 + 10 + (i + .5) * st)} ${yT - 2} L${r1(bx1 + 10 + (i + 1) * st)} ${yT - 30}`;
      truss += `<path d="${z}" fill="none" stroke="#7fb3dd" stroke-width="3" stroke-linejoin="round"/>`;
      let piers = '';
      const pn = Math.max(1, Math.round((bx2 - bx1) / 70));
      for (let i = 1; i < pn; i++) piers += `<rect x="${r1(bx1 + i * (bx2 - bx1) / pn - 4)}" y="${yT + 2}" width="8" height="20" fill="#c9cfdc" stroke="${INK}" stroke-width="1.5"/>`;
      return `<rect x="0" y="${yT}" width="${r1(bx1)}" height="24" fill="#d9b98a"/><rect x="${r1(bx2)}" y="${yT}" width="${r1(W - bx2)}" height="24" fill="#d9b98a"/>` +
        `<rect x="${r1(bx1)}" y="${yT + 4}" width="${r1(bx2 - bx1)}" height="20" fill="#9fd6f5"/>${piers}${truss}` +
        `<rect x="${r1(bx1)}" y="${yT - 1}" width="${r1(bx2 - bx1)}" height="6" fill="#5d6b88" stroke="${INK}" stroke-width="1.5"/>`;
    }
    if (kind === 'causeway') {
      return `<rect x="0" y="${yT}" width="${W}" height="24" fill="#7cc4ef"/><rect x="0" y="${yT}" width="${r1(bx1)}" height="24" fill="#8edb9f"/><rect x="${r1(bx2)}" y="${yT}" width="${r1(W - bx2)}" height="24" fill="#8edb9f"/>` +
        `<path d="M${r1(bx1)} ${yT} H${r1(bx2)} V${yT + 12} H${r1(bx1)}Z" fill="#c9cfdc" stroke="${INK}" stroke-width="1.5"/>`;
    }
    let g = `<rect x="0" y="${yT}" width="${W}" height="24" fill="#d9b98a"/>`;
    if (kind === 'post') g += lampPost(bx1, yT);
    if (kind === 'tunnel') g += `<path d="M${r1(bx1)} ${yT} V${yT - 34} H${r1(bx2)} V${yT}" fill="#5b4a3a" opacity=".35"/>`;
    return g;
  }
  if (kind === 'tunnel') {
    const m = r1((bx1 + bx2) / 2);
    return `<path d="M${r1(bx1 - 8)} ${yT} Q${r1(bx1 - 4)} ${yT - 40} ${r1(bx1 + 24)} ${yT - 42} Q${m} ${yT - 56} ${r1(bx2 - 24)} ${yT - 42} Q${r1(bx2 + 4)} ${yT - 40} ${r1(bx2 + 8)} ${yT}Z" fill="#3dbb6b" opacity=".42" ${S}/>` +
      `<path d="M${r1(bx1)} ${yT} V${yT - 34} M${r1(bx2)} ${yT} V${yT - 34}" stroke="${INK}" stroke-width="4"/>`;
  }
  return '';
}
/* Start/end picture. mode 'cross': front reaches the start, tail leaves the end.
   mode 'inside': tail just in, front reaches the far end. mode 'post': L = 0. */
function crossDiag({ L = 0, T, kind = 'bridge', mode = 'cross', Llab = '', Tlab = '', travel = '', start = '', end = '', W = 420, cars, label = '' }) {
  const pad = 24, span = mode === 'inside' ? L : 2 * T + L, k = (W - 2 * pad) / span;
  const ex = kind === 'tunnel' ? 14 : 0;
  const bx1 = mode === 'inside' ? pad : pad + T * k, bx2 = bx1 + L * k;
  const s0 = mode === 'inside' ? bx1 : bx1 - T * k, s1 = mode === 'inside' ? bx2 - T * k : bx2;
  const f0 = s0 + T * k, f1 = s1 + T * k;
  const y1 = 92 + ex, y2 = 200 + 2 * ex, yb = y2 + 42, H = yb + (travel ? 30 : 8);
  const row = (yT, sx, cap) => tx(pad - 8, yT - 68 - ex, cap, { anchor: 'start', size: 14, fill: '#0f7a73', b: true }) +
    structure(kind, bx1, bx2, yT, W, 'back') + track(0, W, yT) + train(sx, yT, T * k, { cars }) + structure(kind, bx1, bx2, yT, W, 'front');
  let g = row(y1, s0, start) + row(y2, s1, end);
  if (Llab) g += bracket(bx1, bx2, y1 - 40 - ex, Llab, { up: true, size: 14 });
  if (Tlab) g += mode === 'inside' ? bracket(s0, s0 + T * k, y1 + 5, '', { up: true }) + tx(r1(s0 + T * k / 2), y1 + 20, Tlab, { size: 13 })
    : bracket(s0, s0 + T * k, y1 - 40 - ex, Tlab, { up: true, size: 14 });
  if (travel) {
    g += `<path d="M${r1(f0)} ${y1 - 12} V${yb} M${r1(f1)} ${y2 - 12} V${yb}" stroke="#d6453a" stroke-width="2" stroke-dasharray="4 4"/>` +
      bracket(f0, f1, yb, '', { color: '#d6453a' }) + tx(Math.min(W - 8 - travel.length * 3.9, Math.max(8 + travel.length * 3.9, r1((f0 + f1) / 2))), yb + 21, travel, { size: 16, fill: '#d6453a', b: true });
  }
  g += `<circle cx="${r1(f0)}" cy="${y1 - 16}" r="5.5" fill="#ff6b5b" ${S} stroke-width="2"/><circle cx="${r1(f1)}" cy="${y2 - 16}" r="5.5" fill="#ff6b5b" ${S} stroke-width="2"/>`;
  return svg(`0 0 ${W} ${H}`, panel(W, H, g, '#f4fbff'), label || 'A train at its start and end positions; the red dot marks the front of the train', `style="max-width:${W + 40}px"`);
}
// two trains passing each other in opposite directions
function passDiag({ a, b, sa, sb, W = 420, total = '', label = 'Two trains passing each other' }) {
  const t = (a + b) / (sa + sb), lo = Math.min(-a, -sb * t), hi = Math.max(b, sa * t);
  const pad = 24, k = (W - 2 * pad) / (hi - lo), X = v => r1(pad + (v - lo) * k);
  const row = (yT, aL, bL, cap, mark) => tx(pad - 8, yT - 48, cap, { anchor: 'start', size: 14, fill: '#0f7a73', b: true }) +
    `<rect y="${yT}" width="${W}" height="34" fill="#e9e2d2"/>` + track(0, W, yT) + track(0, W, yT + 34) +
    train(X(aL), yT, a * k, { dir: 1, body: '#ffe9c2', stripe: '#f2a516' }) + train(X(bL), yT + 34, b * k, { dir: -1, body: '#dcefff', stripe: '#4aa8ff' }) +
    tx(X(aL + a / 2), yT - 33, 'Train A →', { size: 14, fill: '#c77d00' }) + tx(X(bL + b / 2), yT + 55, '← Train B', { size: 14, fill: '#1b6fa8' }) +
    `<path d="M${X(mark)} ${yT - 28} V${yT + 38}" stroke="#d6453a" stroke-width="2.4" stroke-dasharray="4 4"/>`;
  const y1 = 72, y2 = 208, H = total ? 294 : 272;
  let g = row(y1, -a, 0, 'Start: the two fronts meet', 0) + row(y2, sa * t - a, -sb * t, 'End: the two tails separate', sa * t - a);
  if (total) g += bracket(X(-sb * t), X(sa * t), 264, '', { color: '#d6453a' }) + tx(W / 2, 284, total, { size: 14, fill: '#d6453a', b: true });
  return svg(`0 0 ${W} ${H}`, panel(W, H, g, '#f4fbff'), label, `style="max-width:${W + 40}px"`);
}
function bike(x, yb) {
  return `<circle cx="${x - 11}" cy="${yb - 8}" r="8" fill="#fff" ${S} stroke-width="2.2"/><circle cx="${x + 11}" cy="${yb - 8}" r="8" fill="#fff" ${S} stroke-width="2.2"/>
    <path d="M${x - 11} ${yb - 8} L${x - 2} ${yb - 20} L${x + 11} ${yb - 8} M${x - 2} ${yb - 20} H${x + 8} L${x + 11} ${yb - 8} M${x + 8} ${yb - 20} l-2 -6" fill="none" stroke="#0f9d94" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M${x - 2} ${yb - 22} L${x + 2} ${yb - 38} L${x + 7} ${yb - 26}" fill="none" stroke="#ff6b5b" stroke-width="5" stroke-linecap="round"/>
    <circle cx="${x + 4}" cy="${yb - 45}" r="6" fill="#d9a77d" ${S} stroke-width="2"/><path d="M${x - 3} ${yb - 47} q7 -10 14 0z" fill="#ffc94a" ${S} stroke-width="2"/>`;
}
// a train overtaking a cyclist on the path beside the track
function cycleDiag({ T, st, sc, W = 420 }) {
  const t = T / (st - sc), lo = -T, hi = st * t, pad = 30, k = (W - 2 * pad) / (hi - lo), X = v => r1(pad + (v - lo) * k);
  const row = (yT, tl, c, cap) => tx(pad - 14, yT - 42, cap, { anchor: 'start', size: 14, fill: '#0f7a73', b: true }) +
    `<rect y="${yT}" width="${W}" height="12" fill="#d9b98a"/><rect y="${yT + 12}" width="${W}" height="56" fill="#8edb9f"/><rect y="${yT + 42}" width="${W}" height="14" fill="#e6e1d6"/>` +
    track(0, W, yT) + train(X(tl), yT, T * k, {}) +
    `<path d="M${X(c)} ${yT - 30} V${yT + 56}" stroke="#d6453a" stroke-width="2" stroke-dasharray="4 4"/>` + bike(X(c), yT + 52);
  const H = 262;
  const g = row(62, -T, 0, 'Start: the front reaches Mr Pillai') + row(188, sc * t, sc * t, 'End: the tail passes Mr Pillai');
  return svg(`0 0 ${W} ${H}`, panel(W, H, g, '#f4fbff'), 'A train overtaking a cyclist: start and end positions', `style="max-width:${W + 40}px"`);
}

/* ===================== Topic 14 ===================== */
function shophouses(x0, y, n) {
  const cols = ['#ffd2cc', '#cdeee0', '#ffe3b3', '#d6ecff', '#f1edff', '#ffe0ef', '#e4f6c8'];
  let g = '';
  for (let i = 0; i < n; i++) {
    const x = x0 + i * 52, c = cols[i % cols.length];
    g += `<rect x="${x}" y="${y}" width="50" height="70" fill="${c}" ${S} stroke-width="2.4"/>
      <path d="M${x - 3} ${y} L${x + 6} ${y - 10} H${x + 44} L${x + 53} ${y}Z" fill="#e0794f" ${S} stroke-width="2.4"/>
      ${[x + 7, x + 29].map(wx => `<rect x="${wx}" y="${y + 10}" width="14" height="18" rx="2" fill="#5fb3a8" ${S} stroke-width="1.8"/><path d="M${wx + 7} ${y + 10} v18" stroke="${INK}" stroke-width="1.6"/>`).join('')}
      <path d="M${x + 6} ${y + 36} h38" stroke="${INK}" stroke-width="2"/>
      <path d="M${x + 15} ${y + 70} v-18 q10 -12 20 0 v18" fill="#5d6b88" ${S} stroke-width="2"/>`;
  }
  return g;
}
const t14 = {
  id: 't14',
  title: 'Boats Going Upstream and Downstream',
  intro: 'A river can give a boat a free push, or slow it right down! Find out how the current changes a boat\'s speed, and use it to solve river-trip puzzles.',
  skills: ['Speed', 'Add and subtract speeds', 'Bar models'],
  art: () => svg('0 0 360 220', panel(360, 220, `
    <circle cx="322" cy="30" r="16" fill="#ffd45c"/>${A.cloud(24, 12, .7)}${A.cloud(190, 8, .55)}
    ${shophouses(4, 60, 7)}
    <rect x="0" y="128" width="360" height="10" fill="#c9cfdc" ${S} stroke-width="2.4"/>
    ${water(0, 138, 360, 82)}
    ${currentTag(172, 160, 'current')}
    <path d="M24 178 h18 M14 188 h24 M26 198 h14" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
    ${boat(108, 196, { kind: 'bumboat', dir: 1, color: '#ff6b5b', s: .8 })}
    ${tx(108, 214, 'with the current: faster!', { size: 12, fill: '#1f7a3f' })}
    ${boat(286, 192, { kind: 'kayak', dir: -1, color: '#ffc94a', s: .8 })}
    ${tx(286, 214, 'against it: slower', { size: 12, fill: '#b8372d' })}`, '#dff3ff'), 'A bumboat going downstream past shophouses and a kayak going upstream'),
  explore: {
    setup: 'The canoeing CCA is at a river camp. In still water (like a calm reservoir), Wei Ming can paddle at <b>6 km/h</b>. But this river flows at a steady <b>2 km/h</b>. The checkpoint is <b>8 km</b> downstream.',
    art: () => svg('0 0 340 300', panel(340, 300, `
      ${A.cloud(20, 10, .6)}${A.cloud(130, 24, .45)}
      <rect y="70" width="340" height="40" fill="#8edb9f"/>
      ${A.tree(36, 96, .45)}
      ${leo({ x: 150, y: 34, s: .38, pose: 'point' })}
      <path d="M260 70 v-44" ${S}/><rect x="196" y="12" width="132" height="34" rx="8" fill="#fff" ${S}/>
      ${tx(262, 34, 'current 2 km/h →', { size: 14, fill: '#1b6fa8' })}
      ${water(0, 108, 340, 192)}
      ${flowArrow(150, 150, 40)}${flowArrow(40, 258, 40)}${flowArrow(250, 286, 40)}
      ${kayaker('weiming', 100, 172, 1, '#ffc94a')}
      ${kayaker('aisyah', 238, 232, -1, '#ff6b5b')}`, '#e3f4ff'), 'Wei Ming and Aisyah in kayaks on a river, with Leo pointing at a sign showing the current'),
    steps: [
      { who: 'leo', text: '<b>Speed</b> tells us how far you go in each unit of time. <b>6 km/h</b> (say "6 kilometres per hour") means 6 km in every hour. So <b>speed = distance ÷ time</b>, and distance = speed × time.' },
      { who: 'weiming', text: 'Going <b>downstream</b>, the river carries me along! Every hour I paddle 6 km, and the water carries me another 2 km.', art: () => flowDiag(6, 2, 'down') },
      { who: 'aisyah', mood: 'think', text: 'Coming back <b>upstream</b>, the river pushes against us. Every hour it pulls us back 2 km.', art: () => flowDiag(6, 2, 'up') },
      { who: 'arjun', text: 'So the trip to the checkpoint takes 8 ÷ 8 = <b>1 hour</b>, but the trip back takes 8 ÷ 4 = <b>2 hours</b>. Same river, same paddler, very different times!',
        art: () => `<table class="tbl"><thead><tr><th>8 km trip</th><th>Speed (km/h)</th><th>Time (h)</th></tr></thead><tbody><tr><th>Down</th><td>6 + 2 = 8</td><td>8 ÷ 8 = <b>1</b></td></tr><tr><th>Up</th><td>6 − 2 = 4</td><td class="hl">8 ÷ 4 = <b>2</b></td></tr></tbody></table>` },
      { who: 'chloe', mood: 'think', text: 'Our coach\'s motorboat goes <b>11 km/h</b> downstream and <b>7 km/h</b> upstream. Can we work backwards to find its speed in still water, and the speed of the current?' },
      { who: 'leo', mood: 'teach', text: 'Draw a model! The two bars differ by <b>2 lots</b> of the current. 11 − 7 = 4, so the current is 4 ÷ 2 = <b>2 km/h</b>. The boat goes 7 + 2 = <b>9 km/h</b> in still water.', art: () => sdBars(11, 7) },
      { who: 'weiming', text: 'Let me check: 9 + 2 = 11 ✓ and 9 − 2 = 7 ✓. And the current is 2 km/h, the same river as ours. Shiok!' },
    ],
  },
  keys: [
    { title: 'Speed', text: 'Speed = distance ÷ time. 9 km/h means 9 km every hour. So distance = speed × time, and time = distance ÷ speed.' },
    { title: 'Downstream', text: 'The current helps. <b>Downstream speed = boat speed + current speed.</b>' },
    { title: 'Upstream', text: 'The current pushes back. <b>Upstream speed = boat speed − current speed.</b>' },
    { title: 'Working backwards', text: 'Downstream − upstream = 2 lots of current. So current = (down − up) ÷ 2, and boat speed = up + current.' },
  ],
  practice: [
    { id: 'a', level: 1, type: 'blanks', prompt: 'Imagine the Singapore River flows steadily at <b>2 km/h</b>. A bumboat travels at <b>9 km/h</b> in still water. What is its speed going downstream? What is its speed going upstream?',
      art: svg('0 0 420 150', panel(420, 150, riverQ({ current: '2 km/h', items: [{ kind: 'bumboat', x: 210, y: 100, dir: 1, color: '#ff6b5b', s: .85, label: 'bumboat: 9 km/h in still water', ly: 22 }] })), 'A bumboat on a river with a current of 2 km/h', 'style="max-width:440px"'),
      template: 'Downstream: {0} km/h &nbsp;&nbsp; Upstream: {1} km/h', blanks: [{ answer: 11 }, { answer: 7 }],
      hint: 'Downstream, the current helps the boat along. Upstream, the current slows it down.',
      solution: ['Downstream, add the current: 9 + 2 = <b>11 km/h</b>.', 'Upstream, take away the current: 9 − 2 = <b>7 km/h</b>.'] },
    { id: 'b', level: 1, type: 'blanks', prompt: 'At an adventure camp, Hafiz kayaks <b>downstream</b> at <b>10 km/h</b>. The river flows at <b>3 km/h</b>. How fast can he paddle in still water? How fast will he go when he paddles back <b>upstream</b>?',
      template: 'In still water: {0} km/h &nbsp;&nbsp; Upstream: {1} km/h', blanks: [{ answer: 7 }, { answer: 4 }],
      hint: 'Downstream speed = paddling speed + current. Which number added to 3 makes 10?',
      solution: ['Downstream speed = paddling speed + current, so 10 = paddling speed + 3.', 'Paddling speed in still water = 10 − 3 = <b>7 km/h</b>.', 'Upstream: 7 − 3 = <b>4 km/h</b>.'] },
    { id: 'c', level: 1, type: 'blanks', prompt: 'On a holiday in Malaysia, Priya\'s family takes a river cruise. The boat travels at <b>13 km/h</b> in still water, and the river flows at <b>2 km/h</b>. How long does the boat take to travel <b>45 km</b> downstream?',
      template: '{0} hours', blanks: [{ answer: 3 }],
      hint: 'First find the downstream speed. Then use time = distance ÷ speed.',
      solution: ['Downstream speed: 13 + 2 = 15 km/h, so the boat goes 15 km every hour.', 'Time = 45 ÷ 15 = <b>3 hours</b>.'] },
    { id: 'd', level: 2, type: 'blanks', prompt: 'Mr Rahman\'s fishing boat travels at <b>14 km/h</b> downstream and <b>8 km/h</b> upstream. Find the speed of the boat in still water and the speed of the current.',
      template: 'Boat in still water: {0} km/h &nbsp;&nbsp; Current: {1} km/h', blanks: [{ answer: 11 }, { answer: 3 }],
      hint: 'Draw two bars: downstream = boat + current, upstream = boat − current. How many lots of the current make up the difference?',
      solution: ['Downstream = boat + current = 14', 'Upstream = boat − current = 8', 'The difference 14 − 8 = 6 is 2 lots of the current, so the current is 6 ÷ 2 = <b>3 km/h</b>.', 'Boat speed in still water = 8 + 3 = <b>11 km/h</b>.', 'Check: 11 + 3 = 14 ✓ and 11 − 3 = 8 ✓'] },
    { id: 'e', level: 2, type: 'mcq', prompt: 'Two ferries on a river sail <b>towards each other</b>. Ferry A goes downstream and Ferry B goes upstream. In still water, Ferry A goes <b>10 km/h</b> and Ferry B goes <b>8 km/h</b>. The current is <b>2 km/h</b>. By how much does the distance between them shrink every hour?',
      art: svg('0 0 420 150', panel(420, 150, riverQ({ current: '2 km/h', items: [{ kind: 'ferry', x: 110, y: 108, dir: 1, color: '#4aa8ff', s: .72, label: 'Ferry A →' }, { kind: 'ferry', x: 314, y: 108, dir: -1, color: '#7b61ff', s: .72, label: '← Ferry B' }] })), 'Two ferries sailing towards each other on a river', 'style="max-width:440px"'),
      options: ['18 km', '22 km', '14 km', '20 km'], answer: 0,
      hint: 'Find each ferry\'s real speed first. How far does each one travel in 1 hour?',
      solution: ['Ferry A goes downstream: 10 + 2 = 12 km/h.', 'Ferry B goes upstream: 8 − 2 = 6 km/h.', 'In 1 hour they travel 12 + 6 = <b>18 km</b> towards each other.', 'Notice: 18 = 10 + 8. The current adds 2 to one ferry and takes 2 away from the other, so it cancels out!'] },
    { id: 'f', level: 2, type: 'blanks', prompt: 'Mdm Lim\'s tour boat travels between two jetties <b>24 km</b> apart on a river. The boat goes <b>10 km/h</b> in still water, and the current is <b>2 km/h</b>. How long does the trip downstream take? How long does the trip back upstream take?',
      template: 'Downstream: {0} hours &nbsp;&nbsp; Back upstream: {1} hours', blanks: [{ answer: 2 }, { answer: 3 }],
      hint: 'Work out the downstream speed and the upstream speed first.',
      solution: ['Downstream speed: 10 + 2 = 12 km/h. Time: 24 ÷ 12 = <b>2 hours</b>.', 'Upstream speed: 10 − 2 = 8 km/h. Time: 24 ÷ 8 = <b>3 hours</b>.', 'The trip back takes 1 hour longer, because the current is against the boat.'] },
    { id: 'g', level: 2, type: 'blanks', prompt: 'A motorboat travels upstream at full speed for <b>3 hours</b> to reach a jetty. In still water it goes <b>15 km/h</b>, and the current is <b>3 km/h</b>. How far did it travel? How long will the trip back downstream take?',
      template: 'Distance: {0} km &nbsp;&nbsp; Trip back: {1} hours', blanks: [{ answer: 36 }, { answer: 2 }],
      hint: 'Upstream speed × time gives the distance. Then use the downstream speed for the trip back.',
      solution: ['Upstream speed: 15 − 3 = 12 km/h.', 'Distance: 12 × 3 = <b>36 km</b>.', 'Downstream speed: 15 + 3 = 18 km/h.', 'Trip back: 36 ÷ 18 = <b>2 hours</b>.'] },
    { id: 'h', level: 3, type: 'blanks', prompt: 'Two jetties are <b>60 km</b> apart on a river. At 9 a.m., Boat A leaves the lower jetty and goes upstream. At the same time, Boat B leaves the upper jetty and goes downstream. They meet at 12 noon. In still water, Boat A goes <b>12 km/h</b>. The current is <b>3 km/h</b>. What is Boat B\'s speed in still water?',
      art: svg('0 0 420 180', panel(420, 180, riverQ({ current: '3 km/h', H: 180, cx: 150, dist: '60 km', jetties: [{ x: 40, label: 'upper jetty' }, { x: 380, label: 'lower jetty' }], items: [{ kind: 'bumboat', x: 120, y: 104, dir: 1, color: '#3dbb6b', s: .6, label: 'Boat B →', ly: 20 }, { kind: 'bumboat', x: 300, y: 104, dir: -1, color: '#ffc94a', s: .6, label: '← Boat A', ly: 20 }] })), 'Boat A and Boat B start 60 km apart and travel towards each other', 'style="max-width:440px"'),
      template: 'Boat B: {0} km/h', blanks: [{ answer: 8 }],
      hint: 'How many hours do they travel? How much closer do they get each hour? Then find Boat A\'s real speed.',
      solution: ['From 9 a.m. to 12 noon is 3 hours.', 'Each hour the boats get 60 ÷ 3 = 20 km closer.', 'Boat A goes upstream, so its real speed is 12 − 3 = 9 km/h.', 'Boat B\'s real speed (downstream) must be 20 − 9 = 11 km/h.', 'Boat B in still water: 11 − 3 = <b>8 km/h</b>.', 'Check: in 3 hours, A goes 9 × 3 = 27 km and B goes 11 × 3 = 33 km. 27 + 33 = 60 km ✓'] },
    { id: 'i', level: 3, type: 'blanks', prompt: 'Nurul kayaks <b>upstream</b>. In still water she paddles at <b>6 km/h</b>, and the river flows at <b>3 km/h</b>. Her water bottle falls into the river and floats along with the current. She notices <b>10 minutes</b> later, turns round at once and paddles downstream to fetch it. How many minutes after turning round does she reach her bottle?',
      art: svg('0 0 420 150', panel(420, 150, riverQ({ current: '3 km/h', items: [{ kind: 'kayak', x: 130, y: 98, dir: -1, color: '#ff6b5b', s: .8, label: '← Nurul paddles upstream', ly: 24 }, { kind: 'bottle', x: 316, y: 92, label: 'bottle drifts →', ly: 30, lc: '#5a43d6' }] })), 'Nurul paddling upstream while her bottle drifts downstream', 'style="max-width:440px"'),
      template: '{0} minutes', blanks: [{ answer: 10 }],
      hint: 'Change the speeds into metres per minute: 6 km/h = 6000 m in 60 minutes = 100 m every minute. How far apart are Nurul and the bottle after 10 minutes?',
      solution: ['In metres per minute: Nurul paddles 100 m/min and the current flows 50 m/min.', 'Upstream, Nurul moves 100 − 50 = 50 m each minute. The bottle drifts 50 m each minute the other way.', 'After 10 minutes, Nurul is 500 m upstream and the bottle is 500 m downstream of where it fell. They are 1000 m apart.', 'Downstream, Nurul moves 100 + 50 = 150 m each minute, and the bottle still drifts 50 m each minute.', 'She gains 150 − 50 = 100 m every minute, so she needs 1000 ÷ 100 = <b>10 minutes</b>.', 'Surprise: the same 10 minutes! The current carries Nurul and the bottle equally, so only her paddling matters.'] },
  ],
  adult: 'Links to school work: speed (distance ÷ time, in km/h and m/s) is taught in <b>P6</b>, so this topic is <b>enrichment</b>. It needs only P4 skills: adding, subtracting, multiplying and dividing whole numbers, plus the sum-and-difference bar model. Common mistakes: adding the current in both directions; forgetting that when two boats travel <i>towards</i> each other the current helps one and slows the other by the same amount, so it cancels out. Tip: draw arrows for the boat and the current before calculating. The river currents here are simplified (the real Singapore River is calm because of the Marina Barrage), and every speed is a steady whole number of km/h.',
};

/* ===================== Topic 15 ===================== */
const t15 = {
  id: 't15',
  title: 'Trains Crossing Bridges',
  intro: 'A train is long! So when it crosses a bridge, it has to travel further than the bridge itself. Learn to follow the front of the train and you\'ll never be fooled.',
  skills: ['Speed', 'Length and distance', 'Diagrams'],
  art: () => svg('0 0 360 220', panel(360, 220, `
    <circle cx="300" cy="36" r="18" fill="#ffd45c"/>${A.cloud(30, 16, .7)}${A.cloud(170, 30, .5)}
    <path d="M0 132 V96 q30 -14 70 -4 V132z" fill="#8edb9f" ${S} stroke-width="2.4"/>
    <rect x="12" y="66" width="16" height="30" fill="#c9cfdc" ${S} stroke-width="2"/><rect x="34" y="56" width="18" height="40" fill="#dfe4ee" ${S} stroke-width="2"/>
    <path d="M290 132 V92 q36 -10 70 0 V132z" fill="#8edb9f" ${S} stroke-width="2.4"/>
    ${A.hdb(304, 46, 40, 50, '#ffe3b3', 4)}
    ${water(0, 132, 360, 88, '#7cc4ef')}
    <rect x="0" y="122" width="360" height="14" fill="#c9cfdc" ${S} stroke-width="2.4"/>
    ${track(0, 360, 122)}
    <path d="M28 96 h26 M18 106 h34 M34 114 h18" stroke="#9aa6bd" stroke-width="3" stroke-linecap="round"/>
    ${train(64, 122, 210, { cars: 4, body: '#fff4dd', stripe: '#3b6fd8' })}
    ${bracket(64, 274, 80, 'train length counts too!', { up: true, color: '#d6453a', size: 13 })}
    ${tx(180, 200, 'the Causeway', { size: 16, fill: '#fff', b: true })}`, '#e3f4ff'), 'A train crossing the Causeway between Johor Bahru and Singapore'),
  explore: {
    setup: 'Arjun and Chloe are at a park beside a river. An MRT train <b>140 m</b> long is about to cross a bridge <b>160 m</b> long. It travels at <b>20 m/s</b>, which means 20 metres every second. Arjun has his stopwatch ready!',
    art: () => svg('0 0 340 300', panel(340, 300, `
      ${A.cloud(16, 14, .6)}${A.cloud(200, 8, .5)}
      ${A.hdb(14, 40, 54, 80, '#ffd2cc', 5)}${A.hdb(270, 30, 56, 90, '#cdeee0', 6)}
      <rect y="120" width="340" height="60" fill="#8edb9f"/>
      ${water(0, 150, 340, 36)}
      ${[50, 170, 290].map(x => `<rect x="${x - 7}" y="112" width="14" height="64" fill="#dfe4ee" ${S} stroke-width="2.4"/>`).join('')}
      <rect x="0" y="104" width="340" height="12" fill="#c9cfdc" ${S} stroke-width="2.4"/>
      ${A.mrt(70, 76, .62)}
      <rect y="186" width="340" height="114" fill="#8edb9f"/>
      ${A.tree(300, 238, .5)}
      ${kid('arjun', { x: 90, y: 196, s: .72, pose: 'wave' })}
      <g transform="translate(122 196)"><circle r="11" fill="#fff" ${S}/><rect x="-3" y="-17" width="6" height="6" fill="#ffc94a" ${S} stroke-width="2"/><path d="M0 0 V-7 M0 0 l5 3" stroke="#d6453a" stroke-width="2.4" stroke-linecap="round"/></g>
      ${kid('chloe', { x: 210, y: 200, s: .72, pose: 'think', mood: 'think' })}`, '#e3f4ff'), 'Arjun with a stopwatch and Chloe watching an MRT train on a bridge over a river'),
    steps: [
      { who: 'chloe', mood: 'think', text: 'The bridge is 160 m and the train goes 20 m every second. So it takes 160 ÷ 20 = 8 seconds to cross. Easy?' },
      { who: 'leo', text: 'Let\'s check where the train is, second by second. We measure from the start of the bridge. Remember: <b>speed = distance ÷ time</b>, so in 4 s the train goes 20 × 4 = 80 m.',
        art: () => `<table class="tbl"><thead><tr><th>Time</th><th>Front of train</th><th>Tail of train</th></tr></thead><tbody>
          <tr><td>0 s</td><td>start of bridge</td><td>140 m before it</td></tr>
          <tr><td>4 s</td><td>80 m on</td><td>60 m before it</td></tr>
          <tr><td>8 s</td><td>end of bridge</td><td class="hl">20 m on: still on!</td></tr>
          <tr><td>12 s</td><td>80 m past</td><td>100 m on</td></tr>
          <tr><td>15 s</td><td>140 m past</td><td><b>end of bridge ✓</b></td></tr></tbody></table>` },
      { who: 'arjun', text: 'At 8 s, most of the train is still on the bridge! To cross <b>completely</b>, the front must travel the whole bridge <b>and</b> one whole train length.',
        art: () => crossDiag({ W: 330, L: 160, T: 140, Llab: 'bridge 160 m', Tlab: 'train 140 m', start: 'Start: front reaches the bridge', end: 'End: tail leaves the bridge', travel: 'front travels 160 + 140 = 300 m' }) },
      { who: 'leo', mood: 'teach', text: 'Distance = 160 + 140 = <b>300 m</b>. Time = distance ÷ speed = 300 ÷ 20 = <b>15 seconds</b>.' },
      { who: 'aisyah', text: 'What about passing a lamp post? The post has no length, so the front only travels <b>one train length</b>: 140 ÷ 20 = <b>7 seconds</b>.',
        art: () => crossDiag({ W: 330, T: 140, kind: 'post', mode: 'post', Tlab: 'train 140 m', start: 'Start: front reaches the post', end: 'End: tail passes the post', travel: 'front travels 140 m', label: 'A train passing a lamp post' }) },
      { who: 'weiming', text: 'So the trick is: pick <b>one point</b> on the train, like the front. Find where it starts and where it ends. That is the distance the train travels!' },
    ],
  },
  keys: [
    { title: 'Follow the front', text: 'Pick one point on the train (the front is easiest). The distance the train travels is how far that point moves.' },
    { title: 'Crossing a bridge or tunnel', text: 'From the front going on to the tail coming off: <b>distance = bridge length + train length</b>.' },
    { title: 'Passing a post or a person', text: 'A lamp post or a person standing still has no length, so <b>distance = train length</b>.' },
    { title: 'Two things moving', text: 'Moving towards each other: <b>add</b> the speeds. Moving the same way (overtaking): <b>subtract</b> the speeds.' },
  ],
  practice: [
    { id: 'a', level: 1, type: 'blanks', prompt: 'An MRT train <b>135 m</b> long travels at <b>15 m/s</b>. How long does it take to pass a lamp post, from the moment the front reaches the post to the moment the tail passes it?',
      art: crossDiag({ T: 135, kind: 'post', mode: 'post', Tlab: 'train 135 m', start: 'Start: the front reaches the lamp post', end: 'End: the tail passes the lamp post', label: 'A train passing a lamp post' }),
      template: '{0} seconds', blanks: [{ answer: 9 }],
      hint: 'How far does the front of the train move between the start and the end?',
      solution: ['The front moves one train length: 135 m.', 'Time = 135 ÷ 15 = <b>9 seconds</b>.'] },
    { id: 'b', level: 1, type: 'blanks', prompt: 'A cross-border train <b>160 m</b> long crosses the Causeway at <b>15 m/s</b>. Suppose the railway across the Causeway is <b>1040 m</b> long. How long does the train take to cross it completely, from the front going on to the tail coming off?',
      art: crossDiag({ L: 1040, T: 160, kind: 'causeway', Llab: 'Causeway 1040 m', Tlab: 'train 160 m', start: 'Start: the front reaches the Causeway', end: 'End: the tail leaves the Causeway', cars: 2, label: 'A train crossing the Causeway' }),
      template: '{0} seconds', blanks: [{ answer: 80 }],
      hint: 'The front must travel the Causeway length plus the train length.',
      solution: ['Distance = 1040 + 160 = 1200 m', 'Time = 1200 ÷ 15 = <b>80 seconds</b> (that is 1 minute 20 seconds).'] },
    { id: 'c', level: 1, type: 'mcq', prompt: 'An LRT train <b>25 m</b> long crosses a bridge <b>95 m</b> long. How far does the front of the train travel, from the moment the front gets onto the bridge to the moment the tail gets off?',
      art: crossDiag({ L: 95, T: 25, Llab: 'bridge 95 m', Tlab: 'train 25 m', start: 'Start: the front reaches the bridge', end: 'End: the tail leaves the bridge', cars: 2, label: 'An LRT train crossing a bridge' }),
      options: ['120 m', '95 m', '70 m', '25 m'], answer: 0,
      hint: 'Look at the red dots. The front has to go over the bridge, and then further, until the tail is off.',
      solution: ['The front travels the length of the bridge, and then one more train length so that the tail gets off.', 'Distance = 95 + 25 = <b>120 m</b>.'] },
    { id: 'd', level: 2, type: 'blanks', prompt: 'A goods train travels at <b>16 m/s</b>. It takes <b>30 seconds</b> to cross a viaduct <b>380 m</b> long completely, from the front going on to the tail coming off. How long is the train?',
      art: crossDiag({ L: 380, T: 100, Llab: 'viaduct 380 m', Tlab: 'train ? m', start: 'Start: the front reaches the viaduct', end: 'End: the tail leaves the viaduct', label: 'A goods train crossing a viaduct' }),
      template: '{0} m', blanks: [{ answer: 100 }],
      hint: 'First find how far the front travels in 30 seconds. That distance is the viaduct plus the train.',
      solution: ['Distance travelled = 16 × 30 = 480 m.', 'This is the viaduct length + the train length.', 'Train length = 480 − 380 = <b>100 m</b>.'] },
    { id: 'e', level: 2, type: 'blanks', prompt: 'A train <b>140 m</b> long goes through a tunnel <b>500 m</b> long at <b>18 m/s</b>. For how many seconds is the <b>whole</b> train inside the tunnel?',
      art: crossDiag({ L: 500, T: 140, kind: 'tunnel', mode: 'inside', Llab: 'tunnel 500 m', Tlab: 'train 140 m', start: 'Start: the tail has just gone in', end: 'End: the front reaches the far end', label: 'A train completely inside a tunnel: start and end positions' }),
      template: '{0} seconds', blanks: [{ answer: 20 }],
      hint: 'The whole train is inside from the moment the tail goes in until the moment the front reaches the far end. Follow the front: where is it at the start?',
      solution: ['When the tail has just gone in, the front is already 140 m inside the tunnel.', 'The front then travels on to the far end: 500 − 140 = 360 m.', 'Time = 360 ÷ 18 = <b>20 seconds</b>.'] },
    { id: 'f', level: 2, type: 'blanks', prompt: 'A train passes a signal post in <b>9 seconds</b>. At the same speed, it crosses a bridge <b>330 m</b> long completely in <b>31 seconds</b>. Find the speed of the train and its length.',
      template: 'Speed: {0} m/s &nbsp;&nbsp; Length: {1} m', blanks: [{ answer: 15 }, { answer: 135 }],
      hint: 'Passing the post: the train travels its own length. Crossing the bridge: its own length <b>plus</b> 330 m. What do the extra seconds pay for?',
      solution: ['Passing the post, the train travels 1 train length in 9 s.', 'Crossing the bridge, it travels 1 train length + 330 m in 31 s.', 'So the extra 330 m takes 31 − 9 = 22 s. Speed = 330 ÷ 22 = <b>15 m/s</b>.', 'Length = 15 × 9 = <b>135 m</b>.', 'Check: (330 + 135) ÷ 15 = 465 ÷ 15 = 31 s ✓'] },
    { id: 'g', level: 3, type: 'blanks', prompt: 'Two trains on side-by-side tracks travel <b>towards each other</b>. Train A is <b>140 m</b> long and goes at <b>16 m/s</b>. Train B is <b>160 m</b> long and goes at <b>14 m/s</b>. How long is it from the moment their fronts meet to the moment their tails separate?',
      art: passDiag({ a: 140, b: 160, sa: 16, sb: 14 }),
      template: '{0} seconds', blanks: [{ answer: 10 }],
      hint: 'Each second, the trains move 16 + 14 m past each other. Altogether, how far must they move past each other?',
      solution: ['From fronts meeting to tails separating, the trains move past each other by both lengths: 140 + 160 = 300 m.', 'They are moving towards each other, so each second they pass each other by 16 + 14 = 30 m.', 'Time = 300 ÷ 30 = <b>10 seconds</b>.', 'Check: in 10 s, A goes 160 m and B goes 140 m. 160 + 140 = 300 m ✓'] },
    { id: 'h', level: 3, type: 'blanks', prompt: 'Mr Pillai cycles at <b>6 m/s</b> along a park connector beside a railway. A train <b>180 m</b> long comes up behind him at <b>21 m/s</b>, going the same way. How long does the train take to pass him, from its front reaching him to its tail passing him?',
      art: cycleDiag({ T: 180, st: 21, sc: 6 }),
      template: '{0} seconds', blanks: [{ answer: 12 }],
      hint: 'Mr Pillai is moving too! Each second, how many metres does the train gain on him?',
      solution: ['Both are going the same way, so each second the train gains 21 − 6 = 15 m on Mr Pillai.', 'The train must gain one whole train length, 180 m, to get its tail past him.', 'Time = 180 ÷ 15 = <b>12 seconds</b>.', 'Check: in 12 s the train goes 252 m and Mr Pillai goes 72 m. 252 − 72 = 180 m ✓'] },
    { id: 'i', level: 3, type: 'blanks', prompt: 'Siti sits by the window of Train A, which travels at <b>14 m/s</b>. Train B, <b>150 m</b> long, comes the other way on the next track. From the moment the front of Train B passes Siti\'s window until its tail passes, she counts <b>6 seconds</b>. What is the speed of Train B?',
      template: 'Train B: {0} m/s', blanks: [{ answer: 11 }],
      hint: 'In those 6 seconds, Train B moves past Siti by its own length. The trains move towards each other, so their speeds add up.',
      solution: ['Train B moves past Siti by its own length, 150 m, in 6 s.', 'So every second Siti and Train B close in by 150 ÷ 6 = 25 m.', 'They move towards each other, so 25 = 14 + speed of B.', 'Speed of Train B = 25 − 14 = <b>11 m/s</b>.'] },
  ],
  adult: 'Links to school work: speed (distance ÷ time) is taught in <b>P6</b>, so this topic is <b>enrichment</b>. The calculations use only P4 whole-number operations. Common mistakes: using only the bridge length and forgetting the length of the train; adding the train length when the question asks how long the train is <i>completely inside</i> a tunnel (then it is tunnel − train); and adding speeds when the trains move the same way. Tip: act it out with a pencil "train" moving across a ruler "bridge", watching one end of the pencil. The numbers are realistic but simplified: for example, a 6-car MRT train is roughly 140 m long, and the Causeway is just over 1 km.',
};

export default { t14, t15 };
