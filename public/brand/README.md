# Brand files

Official OXYGEN EDU-HUB logo, extracted from the client-supplied artwork as transparent PNGs
(sized at 2× their largest on-screen use):

| File | Use |
|---|---|
| `logo-full.png` (480×204) | Wordmark “oxgn” + rule + “EDU-HUB” + shield emblem — light backgrounds (header) |
| `logo-full-white.png` (480×204) | Same, white lettering — dark backgrounds (footer, OG images) |
| `wordmark-white.png` (270×126) | “oxgn” wordmark only, white |
| `emblem.png` (192×192) | Red G-ring + shield-check emblem — favicons and app icons |

Paths and pixel sizes are configured in `src/config/site.config.ts → brand.files`.

**When vector (SVG) originals are available**, drop them in here, update the paths/sizes in
`site.config.ts`, then run `npm run og` to regenerate favicons and Open Graph images.
Do not stretch, recolour or redraw the logo.
