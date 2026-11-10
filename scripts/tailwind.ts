/**
 * Tailwind CSS v4 compilation via the core `compile()` API (no CLI / Vite plugin needed).
 *
 * 1. `compile(css, { base, loadStylesheet })` parses src/styles/app.css, resolving
 *    `@import "tailwindcss"` (and relative imports) from disk.
 * 2. Candidates are extracted from src/**\/*.{ts,tsx} with a permissive regex scanner.
 *    Over-matching is harmless: Tailwind ignores tokens that are not utilities.
 * 3. The result is minified with esbuild's CSS loader.
 *
 * Rule for authors: never build class names by string concatenation — write complete
 * literal class strings (map variants through objects) so the scanner can find them.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { compile } from 'tailwindcss';
import { transform } from 'esbuild';

const require = createRequire(import.meta.url);

/** Characters that may appear inside a Tailwind candidate (variants, arbitrary values, opacity). */
const CANDIDATE_RE = /[!A-Za-z0-9_\-[\]#%.:/()@,&>~*=+'"<]+/g;

/**
 * Extracts possible class candidates from source text.
 * Splits on whitespace/quotes/backticks/braces first, then applies a permissive token regex.
 */
export function extractCandidates(source: string): Set<string> {
  const out = new Set<string>();
  const pieces = source.split(/[\s"'`{}\\;$]+/);
  for (const piece of pieces) {
    if (!piece || piece.length > 300) continue;
    const matches = piece.match(CANDIDATE_RE);
    if (!matches) continue;
    for (let m of matches) {
      // trim trailing punctuation that commonly follows a class in code
      m = m.replace(/[,.:)>]+$/, '');
      if (m.length < 2) continue;
      if (!/^[!-]?[a-z@[*]/.test(m)) continue;
      out.add(m);
      // Also add balanced-bracket variant if a trailing ')' was stripped from an arbitrary value
      if (m.includes('[') && !m.endsWith(']')) {
        const idx = m.lastIndexOf(']');
        if (idx > 0) out.add(m.slice(0, idx + 1));
      }
    }
  }
  return out;
}

function walk(dir: string, exts: string[], acc: string[] = []): string[] {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, exts, acc);
    else if (exts.some((e) => entry.name.endsWith(e))) acc.push(p);
  }
  return acc;
}

export async function buildCss(root: string, opts: { minify: boolean }): Promise<string> {
  const entry = path.join(root, 'src', 'styles', 'app.css');
  const css = fs.readFileSync(entry, 'utf8');

  const compiler = await compile(css, {
    base: path.dirname(entry),
    from: entry,
    async loadStylesheet(id: string, base: string) {
      let file: string;
      if (id === 'tailwindcss') file = require.resolve('tailwindcss/index.css');
      else if (id.startsWith('tailwindcss/')) file = require.resolve(id.endsWith('.css') ? id : `${id}.css`);
      else file = path.resolve(base, id);
      return { path: file, base: path.dirname(file), content: fs.readFileSync(file, 'utf8') };
    },
  });

  const candidates = new Set<string>();
  for (const file of walk(path.join(root, 'src'), ['.ts', '.tsx'])) {
    for (const c of extractCandidates(fs.readFileSync(file, 'utf8'))) candidates.add(c);
  }
  const output = compiler.build([...candidates]);
  if (!opts.minify) return output;
  const result = await transform(output, {
    loader: 'css',
    minify: true,
    target: ['chrome111', 'safari16.4', 'firefox128'],
  });
  return result.code;
}
