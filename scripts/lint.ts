/**
 * Lint runner using only the installed `eslint` (no typescript-eslint / jsx-a11y plugins
 * available offline — see DECISIONS.md).
 *
 *  1. esbuild strips TypeScript types from every src/scripts/tests/e2e file, keeping JSX
 *     (`jsx: 'preserve'`), into .cache/lint/ — ESLint's default parser can read that.
 *  2. ESLint runs core correctness rules plus a small in-house a11y/security plugin
 *     (img alt, iframe title, explicit button type, rel=noopener on target=_blank,
 *     no positive tabindex, no autofocus).
 *
 * Type-level checks (unused locals, strictness) are covered by `npm run typecheck`.
 * Reported line numbers refer to the type-stripped output and may differ slightly.
 */
import fs from 'node:fs';
import path from 'node:path';
import { transform } from 'esbuild';
import { ESLint, type Linter, type Rule } from 'eslint';

const root = process.cwd();
const outRoot = path.join(root, '.cache', 'lint');
const dirs = ['src', 'scripts', 'tests', 'e2e'];

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return walk(p);
    return /\.(ts|tsx|mjs)$/.test(e.name) && !e.name.endsWith('.d.ts') ? [p] : [];
  });
}

/* ------------------------------ in-house rules ------------------------------ */
type JSXAttr = { type: string; name?: { name?: string }; value?: { type: string; value?: unknown } | null };
type JSXOpening = { name: { type: string; name?: string }; attributes: JSXAttr[] };

function attr(node: JSXOpening, name: string): JSXAttr | undefined {
  return node.attributes.find((a) => a.type === 'JSXAttribute' && a.name?.name === name);
}
const hasSpread = (node: JSXOpening) => node.attributes.some((a) => a.type === 'JSXSpreadAttribute');
const tag = (node: JSXOpening) => (node.name.type === 'JSXIdentifier' ? node.name.name : undefined);

function jsxRule(check: (n: JSXOpening, report: (msg: string) => void) => void): Rule.RuleModule {
  return {
    meta: { type: 'problem', schema: [] },
    create(context) {
      return {
        JSXOpeningElement(node: unknown) {
          check(node as JSXOpening, (message) => context.report({ node: node as Rule.Node, message }));
        },
      } as Rule.RuleListener;
    },
  };
}

const oxygenPlugin = {
  rules: {
    'img-alt': jsxRule((n, report) => {
      if (tag(n) === 'img' && !attr(n, 'alt') && !hasSpread(n))
        report('<img> needs an alt attribute (use alt="" if decorative).');
    }),
    'iframe-title': jsxRule((n, report) => {
      if (tag(n) === 'iframe' && !attr(n, 'title')) report('<iframe> needs a title for screen readers.');
    }),
    'button-type': jsxRule((n, report) => {
      if (tag(n) === 'button' && !attr(n, 'type') && !hasSpread(n))
        report('<button> needs an explicit type ("button" or "submit").');
    }),
    'no-unsafe-target-blank': jsxRule((n, report) => {
      if (tag(n) !== 'a') return;
      const target = attr(n, 'target');
      if (!target || target.value?.type !== 'Literal' || target.value.value !== '_blank') return;
      const rel = attr(n, 'rel');
      if (!rel && !hasSpread(n)) report('target="_blank" links need rel="noopener noreferrer".');
      if (rel?.value?.type === 'Literal' && !String(rel.value.value).includes('noopener'))
        report('rel must include "noopener".');
    }),
    'no-positive-tabindex': jsxRule((n, report) => {
      const t = attr(n, 'tabIndex');
      const v = t?.value as { type: string; expression?: { type: string; value?: unknown } } | undefined;
      if (v?.type === 'JSXExpressionContainer' && v.expression?.type === 'Literal' && Number(v.expression.value) > 0) {
        report('Avoid positive tabIndex values — they break natural focus order.');
      }
    }),
    'no-autofocus': jsxRule((n, report) => {
      if (attr(n, 'autoFocus')) report('Avoid autoFocus — it disorients screen-reader and keyboard users.');
    }),
  },
};

const config: Linter.Config[] = [
  {
    files: ['**/*.js', '**/*.jsx', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { oxygen: oxygenPlugin as unknown as ESLint.Plugin },
    rules: {
      eqeqeq: ['error', 'smart'],
      // no-var is omitted: esbuild emits `var` for `export default <expr>` when stripping types.
      'prefer-const': 'error',
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-unreachable': 'error',
      'no-fallthrough': 'error',
      'no-self-compare': 'error',
      'no-dupe-keys': 'error',
      'no-duplicate-case': 'error',
      'no-unsafe-finally': 'error',
      'no-template-curly-in-string': 'warn',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-console': ['error', { allow: ['warn', 'error', 'group', 'groupCollapsed', 'groupEnd', 'info'] }],
      'oxygen/img-alt': 'error',
      'oxygen/iframe-title': 'error',
      'oxygen/button-type': 'error',
      'oxygen/no-unsafe-target-blank': 'error',
      'oxygen/no-positive-tabindex': 'error',
      'oxygen/no-autofocus': 'error',
    },
  },
  {
    // Build scripts and tests may log progress
    files: ['scripts/**', 'tests/**', 'e2e/**'],
    rules: { 'no-console': 'off' },
  },
];

fs.rmSync(outRoot, { recursive: true, force: true });
const map = new Map<string, string>();
for (const dir of dirs) {
  for (const file of walk(path.join(root, dir))) {
    const rel = path.relative(root, file);
    const src = fs.readFileSync(file, 'utf8');
    const loader = file.endsWith('.tsx') ? 'tsx' : file.endsWith('.ts') ? 'ts' : 'js';
    const { code } = await transform(src, {
      loader,
      jsx: 'preserve',
      target: 'esnext',
      format: 'esm',
      legalComments: 'none',
    });
    const out = path.join(outRoot, rel.replace(/\.(ts|tsx|mjs)$/, file.endsWith('.tsx') ? '.jsx' : '.mjs'));
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, code);
    map.set(out, rel);
  }
}

const eslint = new ESLint({ cwd: outRoot, overrideConfigFile: true, overrideConfig: config });
const results = await eslint.lintFiles(['.']);
let errors = 0;
let warnings = 0;
for (const r of results) {
  if (!r.messages.length) continue;
  console.log(`\n${map.get(r.filePath) ?? r.filePath}`);
  for (const m of r.messages) {
    console.log(
      `  ~${m.line}:${m.column}  ${m.severity === 2 ? 'error' : 'warn '}  ${m.message}  (${m.ruleId ?? 'parse'})`,
    );
  }
  errors += r.errorCount;
  warnings += r.warningCount;
}
console.log(`\nESLint: ${results.length} files, ${errors} errors, ${warnings} warnings`);
process.exit(errors ? 1 : 0);
