/**
 * Development-only placeholder report: logs ONE grouped console warning listing the
 * sample/placeholder data still in config and content. (Full audit: `npm run check:placeholders`.)
 */
import { siteConfig } from '@/config/site.config';
import { testimonials } from '@/content/testimonials';
import { stats } from '@/content/stats';
import { team } from '@/content/team';

export interface PlaceholderSummary {
  exampleEmails: string[];
  samplePhones: string[];
  sampleTestimonials: number;
  sampleStats: number;
  sampleTeam: number;
  other: string[];
}

export function summarizePlaceholders(): PlaceholderSummary {
  const c = siteConfig.contact;
  const other: string[] = [];
  if (c.address.line1.toLowerCase().includes('placeholder')) other.push('contact.address');
  if (!c.mapEmbedUrl) other.push('contact.mapEmbedUrl (map not configured)');
  if (siteConfig.people.founder.name === 'Firstname Lastname') other.push('people.founder');
  if (siteConfig.seo.siteUrl.includes('.example')) other.push('seo.siteUrl (set VITE_SITE_URL)');
  if (!siteConfig.legal.legalReviewed) other.push('legal.legalReviewed = false (policy pages show review banner)');
  if (Object.values(siteConfig.social).every((v) => !v)) other.push('social links (all empty → icons hidden)');
  return {
    exampleEmails: [c.email, c.altEmail].filter((e) => e.endsWith('.example')),
    samplePhones: [c.phoneDisplay].filter((p) => p.replace(/\D/g, '').endsWith('9876543210')),
    sampleTestimonials: testimonials.filter((t) => t.isSample).length,
    sampleStats: stats.filter((s) => s.isSample).length,
    sampleTeam: team.filter((m) => m.isSample).length,
    other,
  };
}

export function reportPlaceholdersInDev(): void {
  const s = summarizePlaceholders();
  const total =
    s.exampleEmails.length +
    s.samplePhones.length +
    s.sampleTestimonials +
    s.sampleStats +
    s.sampleTeam +
    s.other.length;
  if (total === 0) return;
  console.groupCollapsed(`%c⚠ Oxygen Edu-Hub: ${total} placeholder item(s) still need real data`, 'color:#b42318');
  console.warn('Example emails:', s.exampleEmails);
  console.warn('Sample phone numbers:', s.samplePhones);
  console.warn(
    `Sample testimonials: ${s.sampleTestimonials}, sample stats: ${s.sampleStats}, sample team: ${s.sampleTeam}`,
  );
  console.warn('Other:', s.other);
  console.warn('Run `npm run check:placeholders` for the full file-by-file list. See CONTENT_GUIDE.md.');
  console.groupEnd();
}
