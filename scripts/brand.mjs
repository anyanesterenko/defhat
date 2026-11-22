// Генерує фавікони та OG-зображення з векторного логотипу (src/brand.ts).
// Запуск: npm run brand
import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const p = (rel) => fileURLToPath(new URL(rel, import.meta.url));
const src = await readFile(p('../src/brand.ts'), 'utf8');
const get = (name) => src.match(new RegExp(`${name} = "([^"]+)"`))[1];
const CREST = get('MARK_CREST');
const DOME = get('MARK_DOME');
const WORD_VB = get('WORD_VIEWBOX');
const WORD = get('WORD_PATH');

const BLACK = '#07080f';
const COPPER = '#b1b1b3';
const PAPER = '#ecedef';

// Фавікон: шолом на чорній плитці, мідний гребінь
const icon = (rx) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-73 -10 328 348">
<rect x="-73" y="-10" width="328" height="348" rx="${rx}" fill="${BLACK}"/>
<g transform="translate(91 164) scale(0.82) translate(-91 -164)"><path d="${DOME}" fill="${PAPER}"/><path d="${CREST}" fill="${COPPER}"/></g></svg>`;
await writeFile(p('../public/favicon.svg'), icon(64));
await sharp(Buffer.from(icon(64))).resize(64, 64).png().toFile(p('../public/favicon.png'));
await sharp(Buffer.from(icon(0))).resize(180, 180).png().toFile(p('../public/apple-touch-icon.png'));

// OG 1200×630
const [wx, wy, ww, wh] = WORD_VB.split(' ').map(Number);
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs><radialGradient id="r" cx="0.78" cy="0.45" r="0.55"><stop offset="0" stop-color="#1c2590" stop-opacity="0.45"/><stop offset="1" stop-color="${COPPER}" stop-opacity="0"/></radialGradient></defs>
<rect width="1200" height="630" fill="${BLACK}"/><rect width="1200" height="630" fill="url(#r)"/>
<g fill="none" stroke="rgba(124,134,255,0.22)" stroke-width="1.5">
${[1.3, 1.7, 2.15, 2.7].map((s) => `<path d="${DOME}" transform="translate(940 330) scale(${s * 1.1}) translate(-91.5 -200)" vector-effect="non-scaling-stroke"/>`).join('')}
</g>
<g transform="translate(940 330) scale(1.1) translate(-91.5 -200)"><path d="${DOME}" fill="#1c2590" stroke="#ecedef" stroke-width="1"/><path d="${CREST}" fill="${COPPER}"/></g>
<svg x="80" y="80" width="300" height="${(300 * wh) / ww}" viewBox="${WORD_VB}"><path d="${WORD}" fill="${PAPER}"/></svg>
<text font-family="Helvetica, Arial, sans-serif" font-weight="300" font-size="62" fill="${PAPER}" letter-spacing="-2">
<tspan x="80" y="330">Technology,</tspan><tspan x="80" y="400">engineering</tspan><tspan x="80" y="470">and integration</tspan></text>
<rect x="80" y="520" width="14" height="14" fill="${COPPER}"/>
<text x="110" y="533" font-family="Menlo, monospace" font-size="18" fill="#b1b1b3" letter-spacing="2">EXPERTISE · SUPPLY · INTEGRATION</text>
</svg>`;
await sharp(Buffer.from(og)).png().toFile(p('../public/og.png'));
console.log('brand assets ready');
