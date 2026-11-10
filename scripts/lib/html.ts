/**
 * HTML document template shared by the prerender (build) and the dev server shell.
 */
import { createHash } from 'node:crypto';

/** Runs before first paint: enables reveal animations only when JS is available. */
export const INLINE_JS_FLAG = "document.documentElement.classList.add('js')";

/** CSP hash for the inline flag script (used in security headers). */
export function inlineScriptHash(): string {
  return `'sha256-${createHash('sha256').update(INLINE_JS_FLAG).digest('base64')}'`;
}

export interface DocumentParts {
  head: string;
  body: string;
  cssHref: string;
  entryJs: string;
  modulePreloads: string[];
  preloadImages?: { href: string; type?: string }[];
  themeColor: string;
  /** Extra markup appended at the end of <body> (dev live-reload). */
  bodyEnd?: string;
}

export function renderDocument(p: DocumentParts): string {
  const preloads = p.modulePreloads.map((href) => `<link rel="modulepreload" href="${href}">`).join('\n    ');
  const imgPreloads = (p.preloadImages ?? [])
    .map(
      (img) =>
        `<link rel="preload" as="image" href="${img.href}"${img.type ? ` type="${img.type}"` : ''} fetchpriority="high">`,
    )
    .join('\n    ');
  return `<!doctype html>
<html lang="en-IN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <script>${INLINE_JS_FLAG}</script>
    ${p.head}
    <meta name="theme-color" content="${p.themeColor}">
    <link rel="icon" href="/favicon.ico" sizes="48x48">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <link rel="manifest" href="/site.webmanifest">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Sora:wght@600;700&display=swap">
    <link rel="stylesheet" href="${p.cssHref}">
    ${imgPreloads}
    <script type="module" src="${p.entryJs}"></script>
    ${preloads}
  </head>
  <body>
    <div id="root">${p.body}</div>${p.bodyEnd ?? ''}
  </body>
</html>
`;
}
