import type { IconName } from '@/components/icons/Icon';

export interface Differentiator {
  title: string;
  text: string;
  detail: string;
  icon: IconName;
}

export const differentiators: Differentiator[] = [
  {
    title: 'Personalised mentorship',
    text: 'One-to-one guidance shaped around your profile, goals and constraints.',
    detail:
      'No templates and no batch counselling. Every plan starts with a conversation about you, and you work with a named mentor who knows your file.',
    icon: 'user',
  },
  {
    title: 'Ethical practices',
    text: 'No guarantees we cannot keep, no ghostwriting, no shortcuts.',
    detail:
      'We refuse work that would compromise your integrity — seat-selling, ghostwritten theses, bought authorship or predatory journals. Our reputation depends on yours.',
    icon: 'shield-check',
  },
  {
    title: 'Subject-matter experts',
    text: 'Counsellors, researchers and editors with relevant academic experience.',
    detail:
      'We match you with mentors who understand your field, and we tell you upfront if a request is outside our expertise.',
    icon: 'graduation-cap',
  },
  {
    title: 'Transparent process & pricing',
    text: 'A written scope and clear fees before any paid work begins.',
    detail:
      'You always know what is included, what it costs and what happens next. No hidden charges, and no pressure to buy more than you need.',
    icon: 'eye',
  },
  {
    title: 'Timely communication',
    text: 'Prompt replies, scheduled check-ins and reminders before deadlines.',
    detail:
      'We agree how and when we will communicate, keep written records of feedback, and flag risks to your timeline early.',
    icon: 'clock',
  },
  {
    title: 'End-to-end support',
    text: 'From first questions to final decisions — one team, one plan.',
    detail:
      'Whether you need a single session or support across a full admission or publication cycle, we stay with you until the agreed work is complete.',
    icon: 'route',
  },
];

/** "Our promise vs. what we never do" honesty table. */
export const promises: { promise: string; never: string }[] = [
  { promise: 'Give you honest, evidence-based advice', never: 'Guarantee admission, a job or journal acceptance' },
  { promise: 'Review and strengthen the work you write', never: 'Ghostwrite theses, papers, SOPs or essays' },
  {
    promise: 'Guide you through official admission processes',
    never: 'Sell seats or arrange "management" or "donation" quotas',
  },
  { promise: 'Recommend reputable, properly indexed journals', never: 'Work with predatory or hijacked journals' },
  { promise: 'Respect authorship based on real contribution', never: 'Sell, broker or add authorship' },
  {
    promise: 'Share scope and fees clearly before you commit',
    never: 'Add hidden charges or pressure you into packages',
  },
  { promise: 'Keep your documents and data confidential', never: 'Share or reuse your work without permission' },
];
