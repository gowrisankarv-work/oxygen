/**
 * Serves the production build (dist/) locally — also used by Playwright.
 * Usage: npm run preview [-- --port=4173 --dir=dist]
 */
import path from 'node:path';
import fs from 'node:fs';
import { startStaticServer } from './lib/static-server';

const args = process.argv.slice(2);
const port = Number(args.find((a) => a.startsWith('--port='))?.split('=')[1] ?? process.env.PORT ?? 4173);
const dir = path.resolve(args.find((a) => a.startsWith('--dir='))?.split('=')[1] ?? 'dist');

if (!fs.existsSync(path.join(dir, 'index.html'))) {
  console.error(`No build found in ${dir}. Run "npm run build" first.`);
  process.exit(1);
}

await startStaticServer({ dir, port });
console.log(`Preview: http://localhost:${port}  (serving ${path.relative(process.cwd(), dir) || '.'})`);
