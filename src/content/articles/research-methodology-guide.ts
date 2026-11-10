import type { ArticleBody } from './types';

const body: ArticleBody = {
  blocks: [
    {
      type: 'p',
      text: 'Research methodology is simply the reasoning behind how you answer your research question. Examiners care less about whether you used a fashionable technique and more about whether your choices make sense together. This guide walks through the core decisions in the order you will usually make them.',
    },
    { type: 'h2', id: 'question-first', text: 'Start with a researchable question' },
    {
      type: 'p',
      text: 'Every methodological choice flows from the question. A good research question is specific, answerable with the time and resources you have, and genuinely open — the answer is not already obvious. "How does social media affect students?" is a topic. "Is daily time on short-video apps associated with self-reported sleep quality among first-year undergraduates in one city?" is a question you can design a study around.',
    },
    { type: 'h2', id: 'approach', text: 'Choose your approach: quantitative, qualitative or mixed' },
    {
      type: 'ul',
      items: [
        '**Quantitative** research measures and tests relationships using numbers — surveys with scales, experiments, secondary datasets. It suits questions about how much, how often or whether variables are related.',
        '**Qualitative** research explores meanings, experiences and processes through interviews, focus groups, observation or documents. It suits questions about how and why.',
        '**Mixed methods** combine both, for example using interviews to explain patterns found in a survey. They are powerful but demand more time and skill.',
      ],
    },
    { type: 'h2', id: 'design', text: 'Pick a research design' },
    {
      type: 'p',
      text: 'Common designs include descriptive surveys, correlational studies, experiments and quasi-experiments, case studies, ethnography and systematic reviews. Ask yourself what kind of claim you want to make. If you want to claim that one thing causes another, you need a design that can support causal reasoning — usually an experiment or a carefully controlled quasi-experiment. A one-time survey can show association, not cause.',
    },
    { type: 'h2', id: 'sampling', text: 'Decide who or what you will study' },
    {
      type: 'p',
      text: 'Define your population clearly, then explain how you will select a sample. Probability methods such as random or stratified sampling allow stronger generalisation; purposive or convenience samples are common in qualitative and exploratory work but limit how far you can generalise. Justify your sample size — for quantitative studies, a power analysis is the most defensible approach.',
    },
    { type: 'h2', id: 'instruments', text: 'Select or build your instruments' },
    {
      type: 'p',
      text: 'Wherever possible, use established questionnaires or scales that have been validated for a similar population, and cite them. If you must build your own instrument, pilot it with a small group first and check its reliability (for example with Cronbach’s alpha) and validity. For interviews, prepare a guide with open questions and prompts, and test it before the main study.',
    },
    { type: 'h2', id: 'analysis', text: 'Plan your analysis before you collect data' },
    {
      type: 'p',
      text: 'Decide in advance which statistical tests or qualitative analysis methods you will use, because this affects what data you need to collect. A t-test, chi-square test, correlation or regression each requires particular types of variables and assumptions. For qualitative data, thematic analysis is a common and well-documented starting point. Tools such as SPSS, R or Python are only as good as the plan behind them.',
    },
    {
      type: 'callout',
      title: 'Ethics is part of methodology',
      text: 'Obtain ethics committee approval where required, take informed consent, protect participants’ anonymity and store data securely. Never alter, invent or selectively drop data to make results look better — it is research misconduct.',
      tone: 'info',
    },
    { type: 'h2', id: 'limitations', text: 'Be honest about limitations' },
    {
      type: 'p',
      text: 'Every study has limitations — sample size, self-reported data, a single location, a short time frame. Naming them clearly shows maturity and helps readers interpret your findings correctly. Examiners are far more concerned by limitations that are hidden than by limitations that are acknowledged.',
    },
    { type: 'h2', id: 'checklist', text: 'Quick consistency check' },
    {
      type: 'ol',
      items: [
        'Does my design match the type of claim my question requires?',
        'Can my sample and instruments actually produce the data my analysis needs?',
        'Have I justified every choice with reasoning or literature?',
        'Could another researcher repeat my study from my description?',
      ],
    },
    {
      type: 'p',
      text: 'If you would like a mentor to talk through these decisions, our [Research & Innovations](/services/research-innovations) service offers methodology consultation and statistics guidance — you do the research, we help you do it well.',
    },
  ],
};

export default body;
