/** Returns a `tel:` href from any phone format ("+91 98765 43210" → "tel:+919876543210"). */
export function telHref(phone: string): string {
  const trimmed = phone.trim();
  const plus = trimmed.startsWith('+') ? '+' : '';
  return `tel:${plus}${trimmed.replace(/\D/g, '')}`;
}

/**
 * Formats an Indian mobile number for display: "+919876543210" → "+91 98765 43210".
 * Other formats are returned unchanged.
 */
export function formatIndianPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  if (digits.length === 10) return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  return phone;
}

export function mailtoHref(email: string, subject?: string, body?: string): string {
  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body);
  const q = params.toString().replace(/\+/g, '%20');
  return `mailto:${email}${q ? `?${q}` : ''}`;
}
