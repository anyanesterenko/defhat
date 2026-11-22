// Генерує ілюстрацію для блоку «Підхід»: каркасний рельєф у брендових тонах,
// прозоре тло (зливається з секцією). Запуск: node scripts/approach-art.mjs
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const W = 1672, H = 941;
const out = (n) => fileURLToPath(new URL(`../public/${n}`, import.meta.url));

// рельєф: кілька м'яких пагорбів + легка хвиля
const hills = [
  { x: 1.0, y: 0.22, a: 1.0, s: 0.5 },
  { x: 2.3, y: 0.42, a: 0.75, s: 0.6 },
  { x: 1.7, y: 0.85, a: 0.6, s: 0.55 },
  { x: 1.6, y: 0.15, a: 0.35, s: 0.35 },
];
const h = (x, y) =>
  hills.reduce((z, p) => z + p.a * Math.exp(-((x - p.x) ** 2 + ((y - p.y) * 2.2) ** 2) / (2 * p.s * p.s)), 0) +
  0.07 * Math.sin(x * 3.1 + y * 6) ;

const F = 700, CAM = 2.1, HOR = 300, CX = W * 0.5;
const proj = (x, y) => {
  const d = 1 + y * 4.2;
  const z = h(x, y);
  return [CX + (x * 2.4 * F) / (d * 2.4), HOR + ((CAM - z * 0.95) * F) / d, z, d];
};

const NX = 90, NY = 46, X0 = -1.2, X1 = 3.4;
let lines = '';
const fade = (y) => Math.max(0, 0.55 * (1 - y) ** 1.3);
// поперечні лінії (вздовж x)
for (let j = 0; j <= NY; j++) {
  const y = j / NY;
  const pts = [];
  for (let i = 0; i <= NX; i++) { const [sx, sy] = proj(X0 + ((X1 - X0) * i) / NX, y); pts.push(`${sx.toFixed(1)},${sy.toFixed(1)}`); }
  lines += `<polyline points="${pts.join(' ')}" stroke-opacity="${(fade(y) + 0.04).toFixed(3)}"/>`;
}
// поздовжні лінії (вглиб)
for (let i = 0; i <= NX; i += 2) {
  const x = X0 + ((X1 - X0) * i) / NX;
  const pts = [];
  for (let j = 0; j <= NY; j++) { const [sx, sy] = proj(x, j / NY); pts.push(`${sx.toFixed(1)},${sy.toFixed(1)}`); }
  lines += `<polyline points="${pts.join(' ')}" stroke-opacity="0.13"/>`;
}
// вузли на вершинах пагорбів
let nodes = '';
for (const p of hills.slice(0, 3)) {
  const [sx, sy] = proj(p.x, p.y);
  nodes += `<line x1="${sx}" y1="${sy}" x2="${sx}" y2="${sy - 120}" stroke="#ecedef" stroke-opacity=".5" stroke-width="1.2"/>
    <circle cx="${sx}" cy="${sy - 122}" r="4" fill="#ecedef"/>
    <circle cx="${sx}" cy="${sy}" r="16" fill="#a9add6" fill-opacity=".25"/>
    <circle cx="${sx}" cy="${sy}" r="5" fill="#ecedef"/>`;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="v" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".28" stop-color="#fff"/>
    </linearGradient>
    <mask id="m"><rect width="${W}" height="${H}" fill="url(#v)"/></mask>
  </defs>
  <g mask="url(#m)" fill="none" stroke="#dfe1ee" stroke-width="1.1">${lines}</g>
  ${nodes}
</svg>`;

// віддзеркалено: рельєф лежить ліворуч, шолом — праворуч
const buf = await sharp(await sharp(Buffer.from(svg)).png().toBuffer()).flop().png().toBuffer();
for (const w of [800, 1280, 1672]) {
  await sharp(buf).resize(w).webp({ quality: 86, alphaQuality: 90 }).toFile(out(`approach-art-${w}.webp`));
}
await sharp(buf).flatten({ background: '#0a0f42' }).resize(1000).png().toFile(fileURLToPath(new URL('../scripts/.preview-art.png', import.meta.url)));
console.log('ok');
