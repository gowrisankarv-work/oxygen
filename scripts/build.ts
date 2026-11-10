/**
 * Production build:
 *   1. Tailwind CSS (core compile API) → dist/assets/app-[hash].css
 *   2. Client bundle (esbuild, ESM + code splitting, hashed names, metafile) → dist/assets/
 *   3. Server bundle (Node) → .cache/server/entry-server.mjs
 *   4. Prerender every route (incl. every article slug) → dist/<route>/index.html + dist/404.html
 *   5. sitemap.xml, robots.txt, site.webmanifest; copy /public
 *
 * Flags: --analyze  writes dist-stats/bundle.json + a readable size report
 *        --outdir=<dir>  alternative output dir (used by e2e to build a second variant)
 */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { build, type Metafile } from 'esbuild';
import { buildCss } from './tailwind';
import { envDefine, loadEnv } from './lib/env';
import { renderDocument } from './lib/html';
import { generateSitemapXml, generateRobotsTxt } from './sitemap';

const root = process.cwd();
const args = process.argv.slice(2);
const analyze = args.includes('--analyze');
const outArg = args.find((a) => a.startsWith('--outdir='));
const outDir = path.resolve(root, outArg ? outArg.split('=')[1]! : 'dist');
const assetsDir = path.join(outDir, 'assets');

type ServerModule = typeof import('../src/entry-server');

function hash(content: string | Buffer): string {
  return createHash('sha256').update(content).digest('hex').slice(0, 10);
}

function copyDir(src: string, dest: string): void {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

/** Maps a source file (relative to root) to its output chunk + static imports, from the metafile. */
function chunkMap(meta: Metafile): Map<string, string[]> {
  const map = new Map<string, string[]>();
  const outputs = meta.outputs;
  const collect = (out: string, seen: Set<string>): void => {
    if (seen.has(out)) return;
    seen.add(out);
    for (const imp of outputs[out]?.imports ?? []) {
      if (imp.kind === 'import-statement' && !imp.external) collect(imp.path, seen);
    }
  };
  for (const [out, info] of Object.entries(outputs)) {
    if (!info.entryPoint || !out.endsWith('.js')) continue;
    const seen = new Set<string>();
    collect(out, seen);
    map.set(info.entryPoint, [...seen]);
  }
  return map;
}

function toPublicUrl(outPath: string): string {
  return `/${path.relative(outDir, path.resolve(root, outPath)).split(path.sep).join('/')}`;
}

async function main(): Promise<void> {
  const started = Date.now();
  const env = loadEnv(root, 'production');
  if (!env.VITE_SITE_URL) {
    console.warn('⚠  VITE_SITE_URL is not set — canonical URLs/sitemap will use the placeholder domain.');
  }

  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(assetsDir, { recursive: true });

  // 1. Public files first (generated files may overwrite them)
  copyDir(path.join(root, 'public'), outDir);

  // 2. CSS
  const css = await buildCss(root, { minify: true });
  const cssName = `app-${hash(css)}.css`;
  fs.writeFileSync(path.join(assetsDir, cssName), css);

  // 3. Client bundle
  const client = await build({
    entryPoints: [path.join(root, 'src/entry-client.tsx')],
    outdir: assetsDir,
    bundle: true,
    splitting: true,
    format: 'esm',
    platform: 'browser',
    target: ['es2022', 'chrome111', 'safari16.4', 'firefox128'],
    minify: true,
    sourcemap: true,
    metafile: true,
    jsx: 'automatic',
    entryNames: '[name]-[hash]',
    chunkNames: 'chunks/[name]-[hash]',
    assetNames: 'media/[name]-[hash]',
    define: envDefine(env),
    legalComments: 'none',
    logLevel: 'warning',
  });
  const metafile = client.metafile;
  const chunks = chunkMap(metafile);
  const entryOutputs = chunks.get('src/entry-client.tsx');
  if (!entryOutputs?.[0]) throw new Error('Could not locate client entry in metafile');
  const entryJs = toPublicUrl(entryOutputs[0]);
  const entryDeps = entryOutputs.slice(1).map(toPublicUrl);

  // 4. Server bundle
  const serverOut = path.join(root, '.cache', `server-${path.basename(outDir)}`, 'entry-server.mjs');
  await build({
    entryPoints: [path.join(root, 'src/entry-server.tsx')],
    outfile: serverOut,
    bundle: true,
    format: 'esm',
    platform: 'node',
    target: 'node20',
    packages: 'external',
    jsx: 'automatic',
    define: envDefine(env),
    logLevel: 'warning',
  });
  const server = (await import(`${pathToFileURL(serverOut).href}?t=${Date.now()}`)) as ServerModule;

  // 5. Prerender
  const pages = server.getPrerenderPaths();
  let count = 0;
  for (const { path: routePath, source } of [...pages, { path: '/404', source: server.notFoundSource }]) {
    const isNotFound = routePath === '/404';
    const result = await server.renderPage(isNotFound ? '/__not-found__' : routePath);
    const routeChunks = (chunks.get(source) ?? []).map(toPublicUrl);
    const html = renderDocument({
      head: result.head,
      body: result.html,
      cssHref: `/assets/${cssName}`,
      entryJs,
      modulePreloads: [...new Set([...entryDeps, ...routeChunks])],
      preloadImages: result.preloadImages,
      themeColor: server.siteConfig.brand.themeColor,
    });
    const file = isNotFound
      ? path.join(outDir, '404.html')
      : path.join(outDir, routePath === '/' ? '' : routePath.slice(1), 'index.html');
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, html);
    count++;
  }

  // 6. sitemap.xml, robots.txt, manifest
  const siteUrl = server.siteConfig.seo.siteUrl;
  fs.writeFileSync(
    path.join(outDir, 'sitemap.xml'),
    generateSitemapXml(server.getSitemapEntries(), siteUrl, env.BUILD_DATE),
  );
  fs.writeFileSync(path.join(outDir, 'robots.txt'), generateRobotsTxt(siteUrl));
  fs.writeFileSync(
    path.join(outDir, 'site.webmanifest'),
    JSON.stringify(
      {
        name: server.siteConfig.companyName,
        short_name: server.siteConfig.shortName,
        description: server.siteConfig.description,
        start_url: '/',
        display: 'standalone',
        background_color: '#FFFFFF',
        theme_color: server.siteConfig.brand.themeColor,
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      null,
      2,
    ),
  );

  // 7. Bundle report
  const jsBytes = Object.entries(metafile.outputs)
    .filter(([f]) => f.endsWith('.js'))
    .reduce((n, [, o]) => n + o.bytes, 0);
  const entryBytes = entryOutputs.reduce((n, f) => n + (metafile.outputs[f]?.bytes ?? 0), 0);
  if (analyze) {
    const statsDir = path.join(root, 'dist-stats');
    fs.mkdirSync(statsDir, { recursive: true });
    fs.writeFileSync(path.join(statsDir, 'bundle.json'), JSON.stringify(metafile, null, 2));
    const rows = Object.entries(metafile.outputs)
      .filter(([f]) => f.endsWith('.js') || f.endsWith('.css'))
      .sort((a, b) => b[1].bytes - a[1].bytes)
      .map(([f, o]) => `${(o.bytes / 1024).toFixed(1).padStart(8)} KB  ${path.relative(outDir, f)}`);
    fs.writeFileSync(path.join(statsDir, 'report.txt'), rows.join('\n'));
    console.log(rows.slice(0, 15).join('\n'));
    console.log('Full metafile: dist-stats/bundle.json (inspect at https://esbuild.github.io/analyze/)');
  }

  console.log(
    `✓ Built ${count} pages in ${((Date.now() - started) / 1000).toFixed(1)}s → ${path.relative(root, outDir)}/` +
      `  (JS total ${(jsBytes / 1024).toFixed(0)} KB, initial ${(entryBytes / 1024).toFixed(0)} KB, CSS ${(css.length / 1024).toFixed(0)} KB, uncompressed)`,
  );
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
