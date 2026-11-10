import type { IconName } from '@/components/icons/Icon';

export interface Value {
  title: string;
  text: string;
  icon: IconName;
}

/** Core values (About page). */
export const values: Value[] = [
  {
    title: 'Integrity',
    text: 'Honest advice, even when it is not what you hoped to hear. No shortcuts, no false promises.',
    icon: 'shield-check',
  },
  {
    title: 'Excellence',
    text: 'Careful, well-researched guidance and work we would be proud to put our name to.',
    icon: 'sparkles',
  },
  {
    title: 'Student-First',
    text: 'Your goals, abilities and circumstances shape every recommendation — never our convenience.',
    icon: 'heart',
  },
  {
    title: 'Innovation',
    text: 'Modern tools and methods, used thoughtfully, to make guidance clearer and more useful.',
    icon: 'lightbulb',
  },
  {
    title: 'Transparency',
    text: 'Clear scope, clear process and clear pricing shared upfront, before you commit.',
    icon: 'eye',
  },
  {
    title: 'Lifelong Learning',
    text: 'We help you build skills and understanding that last well beyond a single application or paper.',
    icon: 'book-open',
  },
];

export const vision =
  'To be the most trusted companion for every learner and researcher at the turning points of their academic journey — the steady supply of oxygen that helps ambition grow.';

export const mission =
  'To provide personalised, ethical and expert guidance in admissions, careers, research and publication, so that every person we work with can make informed decisions and do their best, most honest work.';
