/**
 * Cookie consent state. Stored in localStorage (wrapped in try/catch — storage can be
 * unavailable in private mode). Analytics only loads after the user accepts.
 */
export type ConsentChoice = 'accepted' | 'rejected';

const KEY = 'oxygen-cookie-consent-v1';
const listeners = new Set<() => void>();
let memoryValue: ConsentChoice | null = null;

export function getConsent(): ConsentChoice | null {
  try {
    const v = window.localStorage.getItem(KEY);
    if (v === 'accepted' || v === 'rejected') return v;
  } catch {
    /* storage unavailable — fall back to in-memory value */
  }
  return memoryValue;
}

export function setConsent(choice: ConsentChoice): void {
  memoryValue = choice;
  try {
    window.localStorage.setItem(KEY, choice);
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

export function subscribeConsent(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
