/**
 * Loads `.env`, `.env.local` and `.env.<mode>` files plus process.env, and returns the
 * public build constants that get injected into the bundle as `__ENV__`.
 * Only variables prefixed with VITE_ are exposed (they are public by definition).
 */
import fs from 'node:fs';
import path from 'node:path';

function parseDotenv(content: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const raw of content.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

export function loadEnv(root: string, mode: 'development' | 'production' | 'test'): OxygenBuildEnv {
  const files = ['.env', '.env.local', `.env.${mode}`, `.env.${mode}.local`];
  const fromFiles: Record<string, string> = {};
  for (const file of files) {
    const p = path.join(root, file);
    if (fs.existsSync(p)) Object.assign(fromFiles, parseDotenv(fs.readFileSync(p, 'utf8')));
  }
  const get = (key: string): string => (process.env[key] ?? fromFiles[key] ?? '').trim();

  return {
    DEV: mode !== 'production',
    MODE: mode,
    VITE_SITE_URL: get('VITE_SITE_URL').replace(/\/+$/, ''),
    VITE_FORM_PROVIDER: get('VITE_FORM_PROVIDER'),
    VITE_FORM_ENDPOINT: get('VITE_FORM_ENDPOINT'),
    VITE_FORM_ACCESS_KEY: get('VITE_FORM_ACCESS_KEY'),
    VITE_GA4_ID: get('VITE_GA4_ID'),
    VITE_PLAUSIBLE_DOMAIN: get('VITE_PLAUSIBLE_DOMAIN'),
    VITE_TURNSTILE_SITE_KEY: get('VITE_TURNSTILE_SITE_KEY'),
    BUILD_DATE: new Date().toISOString().slice(0, 10),
  };
}

export function envDefine(env: OxygenBuildEnv): Record<string, string> {
  return {
    __ENV__: JSON.stringify(env),
    '__ENV__.DEV': JSON.stringify(env.DEV),
    'process.env.NODE_ENV': JSON.stringify(env.DEV ? 'development' : 'production'),
  };
}
