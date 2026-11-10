/**
 * SAMPLE statistics — hidden by default (features.showStats = false in site.config.ts).
 * Only enable once you have verified, defensible figures; then set isSample: false.
 */
export interface Stat {
  id: string;
  value: number;
  suffix?: string;
  label: string;
  isSample: boolean;
}

export const stats: Stat[] = [
  { id: 's1', value: 500, suffix: '+', label: 'Students guided', isSample: true }, // PLACEHOLDER
  { id: 's2', value: 120, suffix: '+', label: 'Research scholars mentored', isSample: true }, // PLACEHOLDER
  { id: 's3', value: 25, suffix: '+', label: 'Workshops conducted', isSample: true }, // PLACEHOLDER
  { id: 's4', value: 4, label: 'Specialist service areas', isSample: true }, // PLACEHOLDER
];
