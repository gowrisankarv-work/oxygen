import { siteConfig } from '@/config/site.config';
import type { IconName } from '@/components/icons/Icon';

export interface SocialLink {
  name: string;
  url: string;
  icon: IconName;
}

/** Social profiles from config; empty URLs are omitted everywhere (icons + JSON-LD sameAs). */
export function socialLinks(): SocialLink[] {
  const s = siteConfig.social;
  const all: SocialLink[] = [
    { name: 'Facebook', url: s.facebook, icon: 'facebook' },
    { name: 'Instagram', url: s.instagram, icon: 'instagram' },
    { name: 'LinkedIn', url: s.linkedin, icon: 'linkedin' },
    { name: 'YouTube', url: s.youtube, icon: 'youtube' },
    { name: 'X (Twitter)', url: s.x, icon: 'x' },
  ];
  return all.filter((l) => l.url.trim() !== '');
}
