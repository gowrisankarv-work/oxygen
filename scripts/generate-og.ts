/**
 * Generates Open Graph images (1200×630 JPEG) and the favicon set from HTML/SVG templates,
 * rendered with Playwright's Chromium (no image toolchain needed).
 *
 * Outputs (committed to /public so builds stay fast):
 *   public/og/default.jpg, public/og/<service-slug>.jpg
 *   public/favicon.ico (16/32/48 PNG-in-ICO), public/apple-touch-icon.png (180),
 *   public/icon-192.png, public/icon-512.png, public/icon-512-maskable.png
 *
 * Usage: npm run og   (re-run after replacing the logo files in /public/brand — paths come from site.config.ts)
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { siteConfig } from '../src/config/site.config';
import { services } from '../src/content/services';

const root = process.cwd();
const pub = path.join(root, 'public');
/** Inlines a /public file as a data URI so the template renders without a server. */
function dataUri(publicPath: string): string {
  const file = path.join(pub, publicPath.replace(/^\//, ''));
  const mime = file.endsWith('.svg') ? 'image/svg+xml' : 'image/png';
  return `data:${mime};base64,${fs.readFileSync(file).toString('base64')}`;
}
const logoDark = dataUri(siteConfig.brand.files.fullDark.src);
const emblem = dataUri(siteConfig.brand.files.emblem.src);

function ogHtml(eyebrow: string, title: string, subtitle: string): string {
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600&family=Sora:wght@700&display=swap">
<style>
  *{margin:0;box-sizing:border-box}
  body{width:1200px;height:630px;overflow:hidden;font-family:Inter,'Segoe UI',Arial,sans-serif;color:#fff;
    background:linear-gradient(135deg,#2A0A52 0%,#52017F 45%,#7A1D8C 80%,#A3166B 100%);position:relative}
  .slash{position:absolute;inset:0;opacity:.07;background-image:repeating-linear-gradient(-55deg,#fff 0,#fff 2px,transparent 2px,transparent 28px)}
  .blob{position:absolute;width:520px;height:520px;right:-120px;top:-160px;border-radius:42% 58% 63% 37%/41% 44% 56% 59%;
    background:linear-gradient(135deg,#8B5CF6,#D61F8C);opacity:.55;filter:blur(10px)}
  .wrap{position:absolute;inset:0;padding:72px 80px;display:flex;flex-direction:column;justify-content:space-between}
  .brand img{height:118px;width:auto;display:block}
  .eyebrow{font-weight:600;font-size:22px;letter-spacing:4px;text-transform:uppercase;color:#F4B915}
  h1{font-family:Sora,Arial,sans-serif;font-size:68px;line-height:1.05;letter-spacing:-2px;margin-top:16px;max-width:980px}
  p{font-size:28px;opacity:.9;margin-top:18px;max-width:900px;line-height:1.35}
</style></head><body><div class="slash"></div><div class="blob"></div>
<div class="wrap">
  <div class="brand"><img src="${logoDark}" alt=""></div>
  <div><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p>${subtitle}</p></div>
</div></body></html>`;
}

function iconHtml(size: number, maskable: boolean): string {
  const pad = maskable ? size * 0.2 : size * 0.06;
  const bg = maskable ? '#FFFFFF' : 'transparent';
  return `<!doctype html><html><head><style>*{margin:0}html,body{width:${size}px;height:${size}px;background:${bg};overflow:hidden}
  img{display:block;width:${size - pad * 2}px;height:${size - pad * 2}px;margin:${pad}px;image-rendering:auto}</style></head><body><img src="${emblem}" alt=""></body></html>`;
}

/** Builds a .ico containing PNG images (supported by all modern browsers). */
function buildIco(pngs: { size: number; data: Buffer }[]): Buffer {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  const entries: Buffer[] = [];
  let offset = 6 + 16 * pngs.length;
  for (const p of pngs) {
    const e = Buffer.alloc(16);
    e.writeUInt8(p.size >= 256 ? 0 : p.size, 0);
    e.writeUInt8(p.size >= 256 ? 0 : p.size, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(p.data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += p.data.length;
    entries.push(e);
  }
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  // Fonts load from Google if reachable; otherwise system fallbacks are used.
  page.setDefaultTimeout(8000);

  fs.mkdirSync(path.join(pub, 'og'), { recursive: true });
  const ogJobs = [
    {
      file: 'default.jpg',
      eyebrow: 'Admissions · Careers · Research · Publications',
      title: siteConfig.tagline,
      subtitle: 'Ethical, personalised guidance for students, parents, researchers and faculty.',
    },
    ...services.map((s) => ({
      file: `${s.slug}.jpg`,
      eyebrow: siteConfig.shortName,
      title: s.title,
      subtitle: s.tagline,
    })),
  ];
  for (const job of ogJobs) {
    await page.setContent(ogHtml(job.eyebrow, job.title, job.subtitle), { waitUntil: 'load' }).catch(() => undefined);
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(pub, 'og', job.file), type: 'jpeg', quality: 86 });
    console.log(`✓ og/${job.file}`);
  }

  const renderIcon = async (size: number, maskable = false): Promise<Buffer> => {
    const p = await browser.newPage({ viewport: { width: size, height: size } });
    await p.setContent(iconHtml(size, maskable));
    const buf = await p.screenshot({ type: 'png', omitBackground: !maskable });
    await p.close();
    return buf;
  };

  fs.writeFileSync(path.join(pub, 'apple-touch-icon.png'), await renderIcon(180, true));
  fs.writeFileSync(path.join(pub, 'icon-192.png'), await renderIcon(192));
  fs.writeFileSync(path.join(pub, 'icon-512.png'), await renderIcon(512));
  fs.writeFileSync(path.join(pub, 'icon-512-maskable.png'), await renderIcon(512, true));
  const ico = buildIco([
    { size: 16, data: await renderIcon(16) },
    { size: 32, data: await renderIcon(32) },
    { size: 48, data: await renderIcon(48) },
  ]);
  fs.writeFileSync(path.join(pub, 'favicon.ico'), ico);
  console.log('✓ favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png, icon-512-maskable.png');
} finally {
  await browser.close();
}
