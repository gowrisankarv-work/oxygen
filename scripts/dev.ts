/**
 * Development server.
 *  - esbuild context() with watch() + serve() on an internal port (bundles in memory)
 *  - Tailwind recompiles when any src file changes
 *  - Live reload through esbuild's `/esbuild` server-sent "change" event
 *  - Client-side rendering only, with SPA fallback; prerendering happens only in `npm run build`
 *
 * Usage: npm run dev [-- --port=5173]
 */
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { context } from 'esbuild';
import { buildCss } from './tailwind';
import { envDefine, loadEnv } from './lib/env';
import { renderDocument } from './lib/html';
import { startStaticServer } from './lib/static-server';

const root = process.cwd();
const port = Number(process.argv.find((a) => a.startsWith('--port='))?.split('=')[1] ?? 5173);
const devDir = path.join(root, '.cache', 'dev');
const assetsDir = path.join(devDir, 'assets');
const env = loadEnv(root, 'development');

fs.rmSync(devDir, { recursive: true, force: true });
fs.mkdirSync(assetsDir, { recursive: true });

async function writeCss(): Promise<void> {
  try {
    fs.writeFileSync(path.join(assetsDir, 'app.css'), await buildCss(root, { minify: false }));
  } catch (err) {
    console.error('[tailwind]', err);
  }
}

await writeCss();
fs.writeFileSync(
  path.join(devDir, 'index.html'),
  renderDocument({
    head: '<title>OXYGEN EDU-HUB (dev)</title>',
    body: '',
    cssHref: '/assets/app.css',
    entryJs: '/assets/entry-client.js',
    modulePreloads: [],
    themeColor: '#52017F',
    bodyEnd: `
    <script type="module">
      new EventSource('/esbuild').addEventListener('change', () => location.reload());
    </script>`,
  }),
);

// Rebuild CSS whenever sources change, then esbuild's watch picks up the new CSS file
const cssPlugin = {
  name: 'tailwind-rebuild',
  setup(build: { onStart: (cb: () => Promise<void>) => void }) {
    build.onStart(writeCss);
  },
};

const ctx = await context({
  entryPoints: { 'entry-client': path.join(root, 'src/entry-client.tsx'), app: path.join(assetsDir, 'app.css') },
  outdir: path.join(devDir, 'assets-out'),
  bundle: true,
  splitting: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
  sourcemap: true,
  jsx: 'automatic',
  define: envDefine(env),
  chunkNames: 'chunks/[name]-[hash]',
  plugins: [cssPlugin],
  logLevel: 'info',
});
await ctx.watch();
const { port: esbuildPort } = await ctx.serve({ servedir: path.join(devDir, 'assets-out'), port: port + 1 });

// Front server: static files from /public + dev shell, proxying /assets/* and /esbuild to esbuild
await startStaticServer({
  dir: path.join(root, 'public'),
  port,
  spaFallback: true,
  onRequest(req, res) {
    const url = req.url ?? '/';
    if (url.startsWith('/assets/') || url.startsWith('/esbuild')) {
      const upstreamPath = url.startsWith('/assets/') ? url.replace('/assets/', '/') : url;
      const proxy = http.request(
        { hostname: '127.0.0.1', port: esbuildPort, path: upstreamPath, method: req.method, headers: req.headers },
        (up) => {
          res.writeHead(up.statusCode ?? 502, up.headers);
          up.pipe(res);
        },
      );
      req.pipe(proxy);
      return true;
    }
    const pathname = new URL(url, 'http://x').pathname;
    if (!path.extname(pathname) || pathname.endsWith('.html')) {
      const file = path.join(root, 'public', pathname);
      if (!(fs.existsSync(file) && fs.statSync(file).isFile())) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(fs.readFileSync(path.join(devDir, 'index.html')));
        return true;
      }
    }
    return false;
  },
});

console.log(`\n  OXYGEN EDU-HUB dev server → http://localhost:${port}\n`);
