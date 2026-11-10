import type { ArticleBody } from './types';

const body: ArticleBody = {
  blocks: [
    {
      type: 'p',
      text: 'A Statement of Purpose (SOP) is often the only place in an application where a committee hears your voice. Marks show what you have achieved; the SOP explains why it matters, where you are heading and why this programme is the right next step. Use this checklist as you draft and revise.',
    },
    { type: 'h2', id: 'before-you-write', text: 'Before you write a word' },
    {
      type: 'ul',
      items: [
        '**Read the prompt carefully.** Some universities ask specific questions or set strict word limits. Answer what is asked.',
        '**Research the programme.** Note two or three specific courses, labs, faculty interests or features that genuinely connect to your goals.',
        '**List your evidence.** Projects, internships, research, work experience, volunteering — and what each one taught you.',
        '**Define your goal.** You do not need a perfect ten-year plan, but you should be able to describe a clear direction.',
      ],
    },
    { type: 'h2', id: 'structure', text: 'A structure that works' },
    {
      type: 'ol',
      items: [
        '**Opening:** a specific moment, question or problem that sparked your interest — not a famous quotation or a childhood cliché.',
        '**Academic foundation:** the subjects and projects that prepared you, with concrete details.',
        '**Practical experience:** internships, work or research, focusing on what you did and learned, not just job titles.',
        '**Why this programme:** specific reasons this course and institution fit your goals.',
        '**Future goals:** what you plan to do with the degree, and how it connects to everything above.',
        '**Closing:** a short, confident summary of what you will bring and gain.',
      ],
    },
    { type: 'h2', id: 'show-dont-tell', text: 'Show, do not tell' },
    {
      type: 'p',
      text: 'Phrases like "I am passionate about data science" or "I am a hard-working team player" tell the reader nothing. Replace claims with evidence. Instead of saying you are curious, describe the question you could not stop investigating and what you did about it. One well-explained example is worth more than five adjectives.',
    },
    { type: 'h2', id: 'tone-and-length', text: 'Getting the tone and length right' },
    {
      type: 'p',
      text: 'Aim for a confident, professional tone — closer to a thoughtful conversation with a professor than a formal letter or a social media post. Write in the first person and keep sentences clear. Most programmes expect 800–1,000 words unless they say otherwise; if a limit is given, treat it as a firm ceiling. Use short paragraphs, each with one main idea, so a busy reader can follow your argument at a glance. Avoid humour that might not translate, and never criticise previous institutions or teachers — focus instead on what you learned and how you grew.',
    },
    { type: 'h2', id: 'common-mistakes', text: 'Common mistakes to avoid' },
    {
      type: 'ul',
      items: [
        'Repeating your CV line by line instead of explaining the story behind it.',
        'Using the same SOP for every university with only the name changed.',
        'Explaining low marks at length — address a genuine gap briefly and honestly, then move on.',
        'Overly complex vocabulary. Clear, precise writing reads as more confident.',
        'Exceeding the word limit or ignoring formatting instructions.',
      ],
    },
    {
      type: 'callout',
      title: 'Write it yourself',
      text: 'Admission panels read thousands of statements and can usually tell when one is not written by the applicant. Many universities also use similarity and AI-detection tools. Getting feedback is wise; outsourcing the writing is risky and dishonest. At Oxygen Edu-Hub we review and coach — we never ghostwrite.',
      tone: 'info',
    },
    { type: 'h2', id: 'revision-checklist', text: 'Final revision checklist' },
    {
      type: 'ul',
      items: [
        'Does the first paragraph make the reader want to continue?',
        'Is every paragraph connected to your goal for this programme?',
        'Have you named specific features of the programme, not generic praise?',
        'Is each claim supported by an example?',
        'Is it within the word limit, with no spelling or grammar errors?',
        'Have you read it aloud? Awkward sentences are easier to hear than see.',
        'Has someone who knows you well read it and confirmed it sounds like you?',
      ],
    },
    {
      type: 'p',
      text: 'A strong SOP usually takes three to five drafts. Start early, leave a few days between drafts and ask for honest feedback. If you would like an expert review of your draft, our [Admission Expert](/services/admission-expert) service includes detailed SOP, LOR and essay feedback.',
    },
  ],
};

export default body;
