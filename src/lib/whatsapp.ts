import { siteConfig } from '@/config/site.config';

export const DEFAULT_WHATSAPP_MESSAGE = `Hi ${siteConfig.shortName}, I'd like to know more about your services.`;

/**
 * Builds a wa.me deep link. The number comes from config; the message is URL-encoded.
 * Privacy: only pass generic page context here — never names, emails or phone numbers
 * from form fields (except in the explicit "Send via WhatsApp" fallback the user triggers).
 */
export function buildWhatsAppLink(message?: string, number: string = siteConfig.contact.whatsapp): string {
  const digits = number.replace(/\D/g, '');
  const text = (message ?? DEFAULT_WHATSAPP_MESSAGE).trim();
  return text ? `https://wa.me/${digits}?text=${encodeURIComponent(text)}` : `https://wa.me/${digits}`;
}

/** Page-aware default message, e.g. "…know more about Publication Services." */
export function whatsAppMessageFor(topic?: string): string {
  if (!topic) return DEFAULT_WHATSAPP_MESSAGE;
  return `Hi ${siteConfig.shortName}, I'd like to know more about ${topic}.`;
}
