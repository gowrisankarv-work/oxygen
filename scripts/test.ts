/**
 * Unit test runner: bundles tests/**\/*.test.ts(x) with esbuild into .cache/tests,
 * then runs them with Node's built-in test runner (node:test).
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { build } from 'esbuild';
import { envDefine, loadEnv } from './lib/env';

const root = process.cwd();
const testsDir = path.join(root, 'tests');
const outDir = path.join(root, '.cache', 'tests');

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : /\.test\.tsx?$/.test(e.name) ? [p] : [];
  });
}

const entries = walk(testsDir);
if (!entries.length) {
  console.log('No tests found.');
  process.exit(0);
}

fs.rmSync(outDir, { recursive: true, force: true });
const env = loadEnv(root, 'test');
await build({
  entryPoints: entries,
  outdir: outDir,
  outbase: testsDir,
  outExtension: { '.js': '.mjs' },
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node20',
  packages: 'external',
  jsx: 'automatic',
  define: envDefine(env),
  logLevel: 'warning',
});

const compiled = fs
  .readdirSync(outDir, { recursive: true })
  .map(String)
  .filter((f) => f.endsWith('.test.mjs'))
  .map((f) => path.join(outDir, f));

const res = spawnSync(process.execPath, ['--test', '--test-reporter=spec', ...compiled], { stdio: 'inherit' });
process.exit(res.status ?? 1);
