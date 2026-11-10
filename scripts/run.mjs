#!/usr/bin/env node
/**
 * Tiny TypeScript script runner (no ts-node / tsx needed).
 *
 * Usage: node scripts/run.mjs <script-name> [...args]
 * Compiles scripts/<script-name>.ts with esbuild into .cache/scripts/ and runs it.
 * Third-party packages stay external so they resolve from node_modules.
 */
import { build } from 'esbuild';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [name, ...args] = process.argv.slice(2);

if (!name) {
  console.error('Usage: node scripts/run.mjs <script-name> [...args]');
  process.exit(1);
}

const entry = path.join(root, 'scripts', `${name}.ts`);
if (!fs.existsSync(entry)) {
  console.error(`No script found at scripts/${name}.ts`);
  process.exit(1);
}

// Unique per process so parallel runs (e.g. two Playwright web servers) never clash.
const outfile = path.join(root, '.cache', 'scripts', `${name}-${process.pid}.mjs`);
process.on('exit', () => fs.rmSync(outfile, { force: true }));
await build({
  entryPoints: [entry],
  outfile,
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node20',
  packages: 'external',
  sourcemap: 'inline',
  logLevel: 'warning',
  banner: {
    js: "import { createRequire as __cr } from 'node:module'; const require = __cr(import.meta.url);",
  },
});

process.argv = [process.argv[0], outfile, ...args];
await import(pathToFileURL(outfile).href);
