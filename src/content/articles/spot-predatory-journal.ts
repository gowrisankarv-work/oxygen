import type { ArticleBody } from './types';

const body: ArticleBody = {
  blocks: [
    {
      type: 'p',
      text: 'Predatory journals charge authors publication fees without providing genuine peer review, editing or indexing. Publishing in one can damage your reputation, make your work hard to find, and in some cases make it ineligible for academic evaluation. Worse, a paper published there usually cannot be republished in a reputable journal. Here is how to protect your research.',
    },
    { type: 'h2', id: 'warning-signs', text: 'Warning signs to look for' },
    {
      type: 'ul',
      items: [
        '**Unsolicited emails** praising your "excellent work" and inviting a submission, often to a journal outside your field.',
        '**Promises of very fast publication** — acceptance in days, or peer review in 48–72 hours.',
        '**Guaranteed acceptance**, or acceptance before you have seen any reviewer comments.',
        '**Vague or false indexing claims**, such as "indexed in Google Scholar" presented as a quality mark, or claims of Scopus or Web of Science indexing that you cannot verify.',
        '**Unclear fees** that are revealed only after acceptance.',
        '**Very broad scope**, for example one journal covering engineering, medicine, management and arts.',
        '**Poor website quality**: spelling errors, broken links, copied content or an address that does not match the publisher.',
        '**Questionable editorial boards** with members who are unaware they are listed, or no verifiable affiliations.',
        '**Invented metrics** such as "Global Impact Factor" or similar numbers that are not the Journal Impact Factor from Clarivate.',
      ],
    },
    { type: 'h2', id: 'hijacked-journals', text: 'Beware of hijacked journals' },
    {
      type: 'p',
      text: 'A hijacked journal is a fake website that copies the name, ISSN and look of a legitimate journal. Authors believe they are submitting to the real title and pay a fee to fraudsters. Always reach a journal through the publisher’s official website or the indexing database itself — never through a link in an email.',
    },
    { type: 'h2', id: 'verify', text: 'How to verify a journal in six steps' },
    {
      type: 'ol',
      items: [
        '**Check the indexing directly.** Search for the journal on the Scopus source list or Web of Science Master Journal List, and match the ISSN, title and publisher exactly.',
        '**Check the UGC-CARE list** if your work will be evaluated by Indian universities or institutions, and confirm the current status of the journal.',
        '**Check DOAJ** for open-access journals. Membership of COPE is another positive sign.',
        '**Read past issues.** Are the articles of reasonable quality and within the journal’s scope? Are authors from recognised institutions?',
        '**Review the peer-review policy and fees.** Legitimate journals describe their process and publish their charges clearly.',
        '**Ask your supervisor or librarian.** They have seen many of these schemes and can often spot a problem quickly.',
      ],
    },
    {
      type: 'callout',
      title: 'If it sounds too good to be true…',
      text: 'Genuine peer review takes time and does not come with guarantees. A promise of guaranteed or very fast acceptance is the single most reliable sign of a predatory operation.',
      tone: 'warning',
    },
    { type: 'h2', id: 'already-submitted', text: 'What if you have already submitted?' },
    {
      type: 'p',
      text: 'If you realise a journal is predatory before publication, write to withdraw your manuscript immediately and keep a record of the email. Do not pay any fees. If the article has already been published, speak to your supervisor or institution about the best course of action — some authors request formal retraction before submitting elsewhere.',
    },
    { type: 'h2', id: 'good-habits', text: 'Good habits for every submission' },
    {
      type: 'ul',
      items: [
        'Shortlist journals from the reference lists of good papers in your field.',
        'Use journal finder tools from established publishers to check scope.',
        'Keep a simple log of each journal you consider, with indexing checks and dates.',
        'Never let urgency — a deadline, a promotion requirement, a viva — rush your due diligence.',
      ],
    },
    {
      type: 'p',
      text: 'Our [Publication Services](/services/publication-services) include journal selection with predatory and hijacked journal screening. We never work with predatory journals and we never promise acceptance — but we will help you choose wisely.',
    },
  ],
};

export default body;
