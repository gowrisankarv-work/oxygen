import type { ArticleBody } from './types';
import chooseCourse from './choose-course-after-12th';
import sopChecklist from './sop-checklist';
import predatoryJournal from './spot-predatory-journal';
import methodology from './research-methodology-guide';

/** Article bodies keyed by slug. Imported only by the article page so listings stay light. */
export const articleBodies: Record<string, ArticleBody> = {
  'how-to-choose-the-right-course-after-12th': chooseCourse,
  'statement-of-purpose-checklist': sopChecklist,
  'how-to-spot-a-predatory-journal': predatoryJournal,
  'beginners-guide-to-research-methodology': methodology,
};
