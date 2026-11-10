import { getService } from '@/content/services';
import type { RouteMatch } from '@/router/types';

/**
 * Generic page context for WhatsApp messages and enquiries (never personal data).
 * e.g. service pages → "Publication Services".
 */
export function topicForRoute(match: RouteMatch): string | undefined {
  switch (match.route.id) {
    case 'service-detail':
      return getService(match.params.slug ?? '')?.whatsappTopic;
    case 'book-consultation':
      return 'booking a free consultation';
    case 'faq':
    case 'contact':
    case 'home':
      return undefined;
    case 'careers':
      return 'careers at Oxygen Edu-Hub';
    case 'how-we-work':
      return 'how you work with students and researchers';
    default:
      return undefined;
  }
}
