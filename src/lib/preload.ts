import { images } from '@/config/images';
import type { RouteMatch } from '@/router/types';

/** Above-the-fold images to preload with fetchpriority="high" for each route (LCP). */
export function getPreloadImages(match: RouteMatch): { href: string; type?: string }[] {
  if (match.route.id === 'home') return [{ href: images.hero.src, type: 'image/svg+xml' }];
  return [];
}
