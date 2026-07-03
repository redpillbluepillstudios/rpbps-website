/* Regenerate the default Open Graph share image (public/og/default.png):
   charcoal brand background + the pixel wordmark + a red accent bar.
   Run: node scripts/gen-og.mjs */
import sharp from 'sharp';
import { readFileSync } from 'node:fs';

const ROOT = process.cwd();
const W = 1200, H = 630;
const logoW = 820;

const logoSvg = readFileSync(`${ROOT}/src/assets/images/brand/logo-horizontal.svg`);
const logo = await sharp(logoSvg, { density: 384 }).resize({ width: logoW }).png().toBuffer();
const { height: logoH = 96 } = await sharp(logo).metadata();

const barBuf = await sharp({
  create: { width: W, height: 12, channels: 4, background: '#ed1c24' },
}).png().toBuffer();

await sharp({
  create: { width: W, height: H, channels: 4, background: '#28282c' },
})
  .composite([
    { input: logo, top: Math.round((H - logoH) / 2), left: Math.round((W - logoW) / 2) },
    { input: barBuf, top: H - 12, left: 0 },
  ])
  .png()
  .toFile(`${ROOT}/public/og/default.png`);

console.log(`wrote public/og/default.png ${W}x${H}`);
