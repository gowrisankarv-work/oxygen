/**
 * Placeholder audit: lists everything in config/content that still needs real data.
 *   - every `PLACEHOLDER` marker
 *   - every `.example` email / domain
 *   - every sample phone number (98765 43210 pattern)
 *   - every `isSample: true` item
 *
 * Usage: npm run check:placeholders   (exits 0; add --strict to exit 1 when anything remains)
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const strict = process.argv.includes('--strict');
const scanDirs = ['src/config', 'src/content'];

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : /\.(ts|tsx|json|md)$/.test(e.name) ? [p] : [];
  });
}

interface Hit {
  file: string;
  line: number;
  text: string;
}

const groups: Record<string, Hit[]> = {
  'PLACEHOLDER markers': [],
  '.example emails / domains': [],
  'Sample phone numbers': [],
  'isSample: true items': [],
};

for (const dir of scanDirs) {
  for (const file of walk(path.join(root, dir))) {
    const rel = path.relative(root, file);
    fs.readFileSync(file, 'utf8')
      .split('\n')
      .forEach((raw, i) => {
        const text = raw.trim();
        const hit = { file: rel, line: i + 1, text: text.length > 110 ? `${text.slice(0, 107)}…` : text };
        if (/PLACEHOLDER/.test(raw)) groups['PLACEHOLDER markers']!.push(hit);
        if (/[\w.-]+\.example\b/.test(raw)) groups['.example emails / domains']!.push(hit);
        if (/98765[\s-]?43210/.test(raw)) groups['Sample phone numbers']!.push(hit);
        if (/isSample:\s*true/.test(raw) && !/^\s*(\*|\/\/|\/\*)/.test(raw)) groups['isSample: true items']!.push(hit);
      });
  }
}

let total = 0;
console.log('\nOXYGEN EDU-HUB — placeholder audit');
console.log('===================================');
for (const [name, hits] of Object.entries(groups)) {
  total += hits.length;
  console.log(`\n${name} (${hits.length})`);
  for (const h of hits) console.log(`  ${h.file}:${h.line}  ${h.text}`);
}

const legal = fs.readFileSync(path.join(root, 'src/config/site.config.ts'), 'utf8');
if (/legalReviewed:\s*false/.test(legal)) {
  console.log('\nOther\n  site.config.ts → legal.legalReviewed is false (policy pages show the "template" banner)');
}
if (!process.env.VITE_SITE_URL && !fs.existsSync(path.join(root, '.env'))) {
  console.log('  VITE_SITE_URL is not set (canonical URLs and sitemap use the placeholder domain)');
}

console.log(`\n${total} placeholder line(s) found. See CONTENT_GUIDE.md and HANDOVER.md for what to replace.\n`);
process.exit(strict && total > 0 ? 1 : 0);
