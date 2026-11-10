/**
 * Minimal static file server that mimics Vercel/Netlify/Cloudflare behaviour:
 *  - "/about" → 301 "/about/" (trailing-slash policy), "/about/" → about/index.html
 *  - unknown paths → 404.html with status 404 (or SPA fallback in dev)
 *  - immutable caching for hashed assets
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.map': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
};

export interface StaticServerOptions {
  dir: string;
  port: number;
  /** Serve index.html for unknown routes (dev). Otherwise serve 404.html with status 404. */
  spaFallback?: boolean;
  /** Optional hook to transform HTML before sending (dev live reload injection). */
  transformHtml?: (html: string) => string;
  /** Extra request handler; return true if handled. */
  onRequest?: (req: http.IncomingMessage, res: http.ServerResponse) => boolean;
}

export function startStaticServer(opts: StaticServerOptions): Promise<http.Server> {
  const root = path.resolve(opts.dir);
  const send = (res: http.ServerResponse, file: string, status = 200) => {
    const ext = path.extname(file);
    const headers: Record<string, string> = { 'Content-Type': TYPES[ext] ?? 'application/octet-stream' };
    if (/\/assets\//.test(file) && /-[A-Za-z0-9]{8,}\./.test(path.basename(file))) {
      headers['Cache-Control'] = 'public, max-age=31536000, immutable';
    } else {
      headers['Cache-Control'] = 'no-cache';
    }
    if (ext === '.html' && opts.transformHtml) {
      const html = opts.transformHtml(fs.readFileSync(file, 'utf8'));
      res.writeHead(status, headers);
      res.end(html);
      return;
    }
    res.writeHead(status, headers);
    fs.createReadStream(file).pipe(res);
  };

  const server = http.createServer((req, res) => {
    if (opts.onRequest?.(req, res)) return;
    const url = new URL(req.url ?? '/', 'http://localhost');
    let pathname: string;
    try {
      pathname = decodeURIComponent(url.pathname);
    } catch {
      pathname = '/';
    }
    const target = path.normalize(path.join(root, pathname));
    if (!target.startsWith(root)) {
      res.writeHead(400).end();
      return;
    }
    if (fs.existsSync(target) && fs.statSync(target).isFile()) return send(res, target);
    if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
      const index = path.join(target, 'index.html');
      if (fs.existsSync(index)) {
        if (!pathname.endsWith('/')) {
          res.writeHead(301, { Location: `${pathname}/${url.search}` }).end();
          return;
        }
        return send(res, index);
      }
    }
    if (opts.spaFallback && !path.extname(pathname)) return send(res, path.join(root, 'index.html'));
    const notFound = path.join(root, '404.html');
    if (fs.existsSync(notFound)) return send(res, notFound, 404);
    res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found');
  });

  return new Promise((resolve) => server.listen(opts.port, () => resolve(server)));
}
