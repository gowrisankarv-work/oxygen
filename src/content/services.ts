/**
 * The four service pillars. Edit copy here — every page (home, services, mega-menu,
 * footer, service detail pages, JSON-LD) reads from this file.
 */
import type { IconName } from '@/components/icons/Icon';

export type ServiceSlug = 'admission-expert' | 'career-guidance' | 'research-innovations' | 'publication-services';

export interface ServiceFeature {
  title: string;
  text: string;
  icon: IconName;
  /** Optional sub-services can be hidden with a feature flag (see `flag`). */
  flag?: 'showStudyAbroadVisa';
}

export interface ServiceStep {
  title: string;
  text: string;
}

export interface EngagementModel {
  name: string;
  description: string;
  bestFor: string;
}

export interface Faq {
  q: string;
  a: string;
}

export interface Service {
  slug: ServiceSlug;
  title: string;
  /** One-line description (mega-menu, service band tooltip). */
  tagline: string;
  /** Two-line description (cards). */
  summary: string;
  icon: IconName;
  /** Three key inclusions for the home-page service card. */
  highlights: string[];
  heroSubtitle: string;
  overview: string[];
  whoFor: { title: string; text: string }[];
  included: ServiceFeature[];
  process: ServiceStep[];
  deliverables: string[];
  engagement: EngagementModel[];
  faqs: Faq[];
  related: ServiceSlug[];
  /** Key into config/images.ts */
  image: 'serviceAdmission' | 'serviceCareer' | 'serviceResearch' | 'servicePublication';
  /** Ethics / scope note shown prominently on the page. */
  ethics: { title: string; points: string[] };
  seo: { title: string; description: string };
  /** Label used in WhatsApp messages: "…know more about {topic}." */
  whatsappTopic: string;
}

export const services: Service[] = [
  /* ───────────────────────────── Admission Expert ───────────────────────────── */
  {
    slug: 'admission-expert',
    title: 'Admission Expert',
    tagline: 'Course shortlisting, applications and interview prep for UG, PG and PhD.',
    summary:
      'Find the right course and institution, then build an application that shows who you really are — with an expert beside you at every deadline.',
    icon: 'graduation-cap',
    highlights: [
      'University & course shortlisting',
      'Application & document preparation',
      'Interview & scholarship guidance',
    ],
    heroSubtitle:
      'Personalised admission guidance for UG, PG and PhD aspirants in India and abroad — from the first shortlist to the final interview.',
    overview: [
      'Admissions have become a maze of entrance exams, eligibility rules, portals, essays and deadlines that rarely line up. Students lose good options simply because they heard about them too late, and families make high-stakes decisions on hearsay.',
      'Our Admission Expert service replaces guesswork with a clear plan. We start by understanding your academic record, interests, budget and constraints, then map the courses and institutions that genuinely fit. From there we help you prepare every part of the application and keep track of every date, so nothing is missed.',
      'We are advisers, not agents. We do not sell seats, we do not deal in "management" or "donation" quotas, and we never promise admission. What we do promise is honest advice, careful preparation and steady support until your applications are submitted.',
    ],
    whoFor: [
      {
        title: 'Class 11–12 students',
        text: 'Choosing UG courses and entrance exams, and building a realistic college list.',
      },
      {
        title: 'Graduates aiming for PG',
        text: 'Comparing master’s programmes, eligibility and application timelines in India or overseas.',
      },
      {
        title: 'PhD aspirants',
        text: 'Identifying departments and supervisors, and preparing a strong research application.',
      },
      {
        title: 'Parents',
        text: 'Understanding options, costs and timelines so you can support your child with confidence.',
      },
    ],
    included: [
      {
        title: 'University & course shortlisting',
        text: 'A balanced list of ambitious, target and safe options matched to your profile, interests and budget.',
        icon: 'target',
      },
      {
        title: 'UG / PG / PhD admission guidance',
        text: 'Clear explanations of eligibility, selection processes and reservation rules for each programme you consider.',
        icon: 'graduation-cap',
      },
      {
        title: 'Entrance exam roadmap',
        text: 'Which exams to take, when to register, and a preparation timeline that fits around school or work.',
        icon: 'route',
      },
      {
        title: 'Application & document preparation',
        text: 'Checklists, form-filling guidance and document reviews so every application is complete and consistent.',
        icon: 'clipboard-list',
      },
      {
        title: 'SOP, LOR & essay review',
        text: 'Detailed feedback on drafts you write — structure, clarity and impact. We review and coach; we do not ghostwrite.',
        icon: 'pen',
      },
      {
        title: 'Scholarship guidance',
        text: 'Identifying merit and need-based scholarships you may be eligible for, with help preparing those applications.',
        icon: 'rupee',
      },
      {
        title: 'Interview preparation',
        text: 'Mock interviews with structured feedback for admission panels, PhD interviews and group discussions.',
        icon: 'message-circle',
      },
      {
        title: 'Deadline tracking',
        text: 'A shared calendar of registrations, submissions, counselling rounds and fee dates, with timely reminders.',
        icon: 'calendar',
      },
      {
        title: 'Visa documentation guidance (study abroad)',
        text: 'Help organising financial and academic documents for student visa applications. Final advice rests with the embassy.',
        icon: 'globe',
        flag: 'showStudyAbroadVisa',
      },
    ],
    process: [
      {
        title: 'Profile review',
        text: 'We review your marks, achievements, interests, budget and preferred locations in a one-to-one session.',
      },
      {
        title: 'Options & shortlist',
        text: 'You receive a researched shortlist with eligibility, exams, fees and timelines for each option.',
      },
      {
        title: 'Application plan',
        text: 'We agree a calendar of tasks and deadlines and share document checklists for every application.',
      },
      {
        title: 'Preparation & review',
        text: 'You draft essays and forms; we review, give feedback and check documents before each submission.',
      },
      {
        title: 'Interviews & decisions',
        text: 'Mock interviews, help comparing offers and support through counselling rounds and acceptance steps.',
      },
    ],
    deliverables: [
      'Personalised shortlist report with eligibility and key dates',
      'Entrance exam and application calendar',
      'Document checklist for each application',
      'Written feedback on SOP, LOR and essay drafts',
      'Mock interview with a feedback summary',
      'Scholarship opportunities list (where applicable)',
    ],
    engagement: [
      {
        name: 'Single session',
        description: 'A focused 60-minute consultation to answer specific questions or review your current plan.',
        bestFor: 'Quick clarity on courses, exams or a single application.',
      },
      {
        name: 'Package',
        description:
          'A defined set of sessions covering shortlisting, applications and reviews for one admission cycle.',
        bestFor: 'Students applying to several programmes in one season.',
      },
      {
        name: 'End-to-end',
        description:
          'Complete support from profile review to final acceptance, including interviews and offer comparison.',
        bestFor: 'Families who want one dedicated adviser through the whole journey.',
      },
    ],
    faqs: [
      {
        q: 'Can you guarantee admission to a particular college or university?',
        a: 'No. Admission decisions are made only by institutions, based on their criteria. No honest consultant can guarantee a seat. We improve your preparation and the quality of your applications, and we help you build a balanced list so you have good options.',
      },
      {
        q: 'Do you offer management quota or donation seats?',
        a: 'No. We do not arrange seats through payments of any kind. Our guidance covers merit-based and officially published admission processes only.',
      },
      {
        q: 'Will you write my Statement of Purpose?',
        a: 'We do not ghostwrite SOPs, essays or recommendation letters. We help you brainstorm, plan the structure and give detailed feedback on your drafts, so the final document is genuinely yours — which is also what admission panels expect.',
      },
      {
        q: 'Do you help with admissions abroad as well as in India?',
        a: 'Yes. We guide applicants for programmes in India and abroad. For study-abroad applications we also offer guidance on organising visa documents; final visa decisions and advice rest with the relevant embassy or consulate.',
      },
      {
        q: 'When should I start the admission process?',
        a: 'Ideally 9–12 months before the intake for competitive programmes, and earlier if entrance exams are involved. If your deadlines are close, contact us anyway — we will tell you honestly what is still realistic.',
      },
      {
        q: 'Can parents attend the consultation?',
        a: 'Absolutely. We encourage parents to join, especially for the first session, so that everyone shares the same understanding of options, costs and timelines.',
      },
    ],
    related: ['career-guidance', 'research-innovations'],
    image: 'serviceAdmission',
    ethics: {
      title: 'Our admission guidance promise',
      points: [
        'Guidance and application support only — no seat-selling and no quota "arrangements".',
        'We never guarantee admission; decisions belong to institutions.',
        'Your essays and statements stay your own work — we review, we do not ghostwrite.',
      ],
    },
    seo: {
      title: 'Admission Guidance for UG, PG & PhD',
      description:
        'Expert admission guidance for UG, PG and PhD aspirants: course shortlisting, entrance exam roadmap, SOP review, scholarships and interview preparation.',
    },
    whatsappTopic: 'Admission Expert services',
  },

  /* ───────────────────────────── Career Guidance ───────────────────────────── */
  {
    slug: 'career-guidance',
    title: 'Career Guidance',
    tagline: 'Assessments, stream selection, career mapping and job-readiness support.',
    summary:
      'Discover careers that suit your strengths, choose the right stream or course, and get job-ready with a clear, practical roadmap.',
    icon: 'compass',
    highlights: [
      'Aptitude & interest assessment',
      'Stream selection & career mapping',
      'CV, LinkedIn & mock interviews',
    ],
    heroSubtitle:
      'Career counselling that starts with who you are — for students after 10th and 12th, graduates and early-career professionals.',
    overview: [
      'Career choices are often made under pressure: a stream picked because friends chose it, a degree chosen for its reputation, a job accepted because it came first. Years later, many people realise they never had a structured conversation about what they are good at and what they enjoy.',
      'Our Career Guidance service gives you that conversation — backed by structured assessment and real information about courses, roles and the skills employers look for. We help you see a range of realistic paths, weigh them honestly and take the next concrete step.',
      'Good guidance does not hand you a single "perfect" answer or promise a job. It helps you make an informed decision you own, and prepares you to act on it.',
    ],
    whoFor: [
      {
        title: 'Students after 10th',
        text: 'Choosing between Science, Commerce, Humanities or vocational streams with confidence.',
      },
      {
        title: 'Students after 12th',
        text: 'Comparing degree options, entrance exams and the careers each path can lead to.',
      },
      {
        title: 'College students & graduates',
        text: 'Deciding between higher studies and work, and building a job-ready profile.',
      },
      { title: 'Early-career professionals', text: 'Planning a switch, an upskilling path or a return to study.' },
    ],
    included: [
      {
        title: 'Psychometric & aptitude assessment',
        text: 'A structured assessment of interests, aptitude and work style using a validated partner tool, discussed in a one-to-one session.',
        icon: 'bar-chart',
      },
      {
        title: 'Stream selection after 10th / 12th',
        text: 'Clear comparison of streams and subject combinations, linked to the courses and careers they open up.',
        icon: 'layers',
      },
      {
        title: 'Career mapping',
        text: 'A personalised map of suitable career paths with required qualifications, skills, timelines and typical entry routes.',
        icon: 'route',
      },
      {
        title: 'Resume / CV building',
        text: 'Guidance and line-by-line feedback to create a clear, honest CV tailored to the roles you are targeting.',
        icon: 'file-text',
      },
      {
        title: 'LinkedIn profile building',
        text: 'Practical help with headline, summary, experience and skills so recruiters understand your profile quickly.',
        icon: 'linkedin',
      },
      {
        title: 'Mock interviews',
        text: 'Realistic practice for HR, technical and campus interviews, with specific feedback on content and delivery.',
        icon: 'message-circle',
      },
      {
        title: 'Skill-gap analysis',
        text: 'A comparison of your current skills with your target role, plus a learning plan using reputable courses.',
        icon: 'trending-up',
      },
      {
        title: 'Higher education vs job decisions',
        text: 'A structured look at costs, timing and outcomes to help you decide whether to study further now or start working.',
        icon: 'compass',
      },
      {
        title: 'Workshops for schools & colleges',
        text: 'Interactive career-awareness sessions and resume or interview workshops for groups of students.',
        icon: 'presentation',
      },
    ],
    process: [
      {
        title: 'Discovery conversation',
        text: 'We understand your background, interests, constraints and the decisions you are facing.',
      },
      {
        title: 'Assessment',
        text: 'You complete an aptitude and interest assessment; we interpret the results with you, not just hand over a report.',
      },
      {
        title: 'Options & career map',
        text: 'We explore suitable paths together and document the steps, skills and timelines each one requires.',
      },
      {
        title: 'Action plan',
        text: 'You leave with a practical plan — course choices, applications, skills to build and a timeline.',
      },
      {
        title: 'Readiness support',
        text: 'CV, LinkedIn and interview preparation as you move into applications or the job market.',
      },
    ],
    deliverables: [
      'Assessment summary explained in a one-to-one session',
      'Personalised career map with 2–4 suitable paths',
      'Stream, course or role recommendation with reasoning',
      'Step-by-step action plan with timelines',
      'Reviewed CV and LinkedIn profile (where included)',
      'Mock interview feedback notes (where included)',
    ],
    engagement: [
      {
        name: 'Single session',
        description: 'One in-depth counselling session to talk through a specific decision.',
        bestFor: 'Students who need clarity on one choice, such as a stream or a course.',
      },
      {
        name: 'Package',
        description: 'Assessment, interpretation session and a written career map with follow-up.',
        bestFor: 'Students after 10th or 12th, and graduates planning their next step.',
      },
      {
        name: 'End-to-end',
        description: 'Assessment, career mapping, CV and LinkedIn building and mock interviews over several weeks.',
        bestFor: 'Final-year students and early-career professionals entering the job market.',
      },
    ],
    faqs: [
      {
        q: 'Will a psychometric test tell me exactly which career to choose?',
        a: 'No test can do that on its own. Assessments are a useful starting point that highlight your interests and strengths. The real value comes from discussing the results with a counsellor alongside your marks, circumstances and goals.',
      },
      {
        q: 'Do you guarantee a job or placement?',
        a: 'No. We do not offer placements or guarantee jobs. We help you choose a sensible direction and present yourself well — the hiring decision always rests with the employer.',
      },
      {
        q: 'Is career guidance useful after I have already chosen a degree?',
        a: 'Yes. Many students use guidance mid-degree to choose electives, internships and specialisations, or to plan for higher studies. It is never too late to plan deliberately.',
      },
      {
        q: 'Can parents be part of the career counselling session?',
        a: 'Yes, and we recommend it for school students. We make sure the student’s own interests are heard while addressing the questions parents usually have.',
      },
      {
        q: 'Do you run career workshops for schools and colleges?',
        a: 'Yes. We conduct career-awareness talks, stream-selection sessions and resume and interview workshops. Contact us with your group size and preferred dates.',
      },
      {
        q: 'Are sessions online or in person?',
        a: 'Both. Most counselling works well over a video call, and in-person sessions can be arranged at our office. Your preference is noted when you book.',
      },
    ],
    related: ['admission-expert', 'research-innovations'],
    image: 'serviceCareer',
    ethics: {
      title: 'Our career guidance promise',
      points: [
        'Advice based on your interests and abilities — not on commissions from institutions.',
        'No job or placement guarantees, ever.',
        'Assessment results are explained in context and kept confidential.',
      ],
    },
    seo: {
      title: 'Career Counselling & Guidance',
      description:
        'Career counselling for students and professionals: aptitude assessment, stream selection after 10th and 12th, career mapping, CV, LinkedIn and mock interviews.',
    },
    whatsappTopic: 'Career Guidance',
  },

  /* ─────────────────────────── Research & Innovations ─────────────────────────── */
  {
    slug: 'research-innovations',
    title: 'Research & Innovations',
    tagline: 'Topic selection, proposals, methodology and statistics support for scholars.',
    summary:
      'Expert mentoring for PhD scholars and researchers — from finding a sound research question to choosing methods and interpreting your data.',
    icon: 'flask',
    highlights: [
      'Topic identification & proposal guidance',
      'Methodology & statistical analysis',
      'Research training workshops',
    ],
    heroSubtitle:
      'Methodical, ethical research mentoring for PhD scholars, M.Phil and PG researchers, and faculty — so your work stands on solid ground.',
    overview: [
      'Research is rewarding, but it can also be isolating. Scholars often spend months on a topic that is too broad, a method that does not fit the question, or an analysis they are not confident explaining to a committee.',
      'Our Research & Innovations service gives you a knowledgeable mentor to think alongside. We help you sharpen your question, structure your proposal, choose appropriate methods and understand your data — while you remain the author and owner of every idea and every word.',
      'We work strictly within research-integrity norms. We teach, guide and review. We do not write theses, fabricate or manipulate data, or do work that should be your own.',
    ],
    whoFor: [
      {
        title: 'PhD aspirants & scholars',
        text: 'Shaping a researchable topic, a strong synopsis and a sound methodology.',
      },
      { title: 'PG & M.Phil researchers', text: 'Planning dissertations and understanding statistical analysis.' },
      {
        title: 'Faculty & researchers',
        text: 'Methodological consultation and training for projects and grant proposals.',
      },
      { title: 'Innovators', text: 'Understanding how to protect and progress an idea, including patent basics.' },
    ],
    included: [
      {
        title: 'Research topic identification',
        text: 'Guided exploration of gaps in the literature to arrive at a focused, original and feasible research question.',
        icon: 'lightbulb',
      },
      {
        title: 'Proposal & synopsis guidance',
        text: 'Help structuring objectives, hypotheses, scope and timelines, with feedback on drafts you prepare.',
        icon: 'file-text',
      },
      {
        title: 'Literature review support',
        text: 'Training in search strategies, databases, note-making and synthesis, plus feedback on your review chapter.',
        icon: 'book-open',
      },
      {
        title: 'Research methodology consultation',
        text: 'Choosing designs, sampling, instruments and validity checks that match your research question.',
        icon: 'layers',
      },
      {
        title: 'Statistical analysis guidance (SPSS, R, Python)',
        text: 'Selecting the right tests and learning to run and report them correctly in SPSS, R or Python.',
        icon: 'bar-chart',
      },
      {
        title: 'Data interpretation',
        text: 'Understanding what your results do — and do not — show, and presenting them clearly in tables and text.',
        icon: 'eye',
      },
      {
        title: 'Innovation & patent awareness',
        text: 'An introduction to IP, novelty searches and the patent process. Filing is handled only by registered patent professionals.',
        icon: 'sparkles',
      },
      {
        title: 'Research training workshops',
        text: 'Hands-on workshops on methodology, statistics, reference management and research ethics for groups.',
        icon: 'presentation',
      },
    ],
    process: [
      {
        title: 'Scoping session',
        text: 'We understand your discipline, stage, deadlines and the specific help you need.',
      },
      {
        title: 'Plan & milestones',
        text: 'We agree the scope of mentoring, milestones and how drafts and data will be shared securely.',
      },
      {
        title: 'Guided work sessions',
        text: 'Regular sessions on topic, proposal, methodology or analysis — you do the work, we guide and review.',
      },
      {
        title: 'Review & feedback',
        text: 'Written feedback on your drafts and analysis outputs, with clear explanations you can defend.',
      },
      {
        title: 'Viva & presentation readiness',
        text: 'Practice explaining your methods and findings to supervisors, committees and examiners.',
      },
    ],
    deliverables: [
      'Agreed mentoring plan with milestones',
      'Written feedback on topic, synopsis and chapters you draft',
      'Methodology recommendations with reasoning',
      'Statistical test selection and output interpretation notes',
      'Session notes and learning resources after each meeting',
      'Workshop materials (for group training)',
    ],
    engagement: [
      {
        name: 'Single session',
        description: 'A focused consultation on one question — a topic, a design choice or an analysis.',
        bestFor: 'Researchers who are mostly on track and need an expert second opinion.',
      },
      {
        name: 'Package',
        description: 'A set of sessions for one stage, such as the synopsis, methodology or data analysis.',
        bestFor: 'Scholars preparing for a specific milestone or review.',
      },
      {
        name: 'End-to-end',
        description: 'Ongoing mentoring across stages of your research, from proposal to viva preparation.',
        bestFor: 'PhD scholars who want a consistent methodological mentor.',
      },
    ],
    faqs: [
      {
        q: 'Will you write my thesis or dissertation?',
        a: 'No. We do not ghostwrite theses, dissertations, chapters or papers. Submitting work written by someone else breaches research integrity and university rules. We mentor, train and review so that you can produce and defend your own work.',
      },
      {
        q: 'Can you run my statistical analysis for me?',
        a: 'We guide you in choosing appropriate tests and teach you to run and interpret them, reviewing your outputs along the way. Our aim is that you understand and can explain every result in your work.',
      },
      {
        q: 'Which statistical software do you support?',
        a: 'We support SPSS, R and Python, and can advise on other tools common in your discipline. If you have not chosen a tool yet, we will help you pick one that suits your data and your department’s expectations.',
      },
      {
        q: 'Do you help with patent filing?',
        a: 'We offer awareness and guidance on intellectual property and the patent process. Actual patent searches and filings must be handled by registered patent agents or attorneys, and we can suggest that you consult one.',
      },
      {
        q: 'Is my research data kept confidential?',
        a: 'Yes. Your drafts and data are used only to support you, shared on a need-to-know basis and never published or reused. You can ask us to delete your files once the engagement ends.',
      },
      {
        q: 'Do you work with researchers from all disciplines?',
        a: 'We support scholars across sciences, social sciences, management, education and humanities. During the scoping session we confirm we have the right subject expertise for your work before we begin.',
      },
    ],
    related: ['publication-services', 'admission-expert'],
    image: 'serviceResearch',
    ethics: {
      title: 'Research integrity first',
      points: [
        'We mentor and review — we never ghostwrite theses, chapters or papers.',
        'No fabrication, falsification or manipulation of data, under any circumstances.',
        'Your ideas, drafts and data remain yours and are kept confidential.',
      ],
    },
    seo: {
      title: 'PhD Research Support & Methodology',
      description:
        'Ethical PhD research support: topic identification, synopsis guidance, literature review, research methodology and statistical analysis in SPSS, R and Python.',
    },
    whatsappTopic: 'Research & Innovations support',
  },

  /* ───────────────────────────── Publication Services ───────────────────────────── */
  {
    slug: 'publication-services',
    title: 'Publication Services',
    tagline: 'Editing, formatting, journal selection and reviewer-response support — ethically.',
    summary:
      'Prepare your manuscript for reputable journals with professional editing, formatting, similarity checks and honest journal selection guidance.',
    icon: 'book-open',
    highlights: [
      'Journal selection & predatory screening',
      'Language editing & formatting',
      'Similarity check & reviewer responses',
    ],
    heroSubtitle:
      'Ethical journal publication assistance for researchers and faculty — we help your work read well and reach the right, reputable journal.',
    overview: [
      'Good research deserves to be read. Yet strong manuscripts are often rejected for avoidable reasons: language that obscures the argument, formatting that ignores the journal’s guidelines, a poor journal fit, or a response to reviewers that misses the point.',
      'Our Publication Services help you present your own research at its best. We edit for clarity and correctness, format to the target journal’s author guidelines, check similarity, help you choose suitable indexed journals and guide your replies to reviewers.',
      'We are firm about ethics. We do not ghostwrite papers, sell or add authorship, or work with predatory journals, and we never promise acceptance. Editorial decisions belong to journals — our job is to make sure your submission is clear, compliant and honest.',
    ],
    whoFor: [
      { title: 'PhD scholars', text: 'Preparing papers from thesis work for peer-reviewed journals and conferences.' },
      { title: 'Faculty & researchers', text: 'Polishing manuscripts and choosing reputable, well-matched journals.' },
      { title: 'PG researchers', text: 'Publishing a first paper and learning the submission process properly.' },
      {
        title: 'Authors of books & theses',
        text: 'Formatting long documents to university or publisher requirements.',
      },
    ],
    included: [
      {
        title: 'Journal selection guidance',
        text: 'Shortlisting indexed, reputable journals that match your scope, with checks against predatory and hijacked journals.',
        icon: 'search',
      },
      {
        title: 'Language editing & proofreading',
        text: 'Careful editing for grammar, clarity, flow and academic tone, with tracked changes so you approve every edit.',
        icon: 'pen',
      },
      {
        title: 'Formatting to journal guidelines',
        text: 'Structure, headings, tables, figures, references and word limits aligned to the target journal’s author instructions.',
        icon: 'layers',
      },
      {
        title: 'Plagiarism / similarity check',
        text: 'A similarity report with guidance on proper paraphrasing, quotation and citation — not "rewriting to beat the software".',
        icon: 'file-check',
      },
      {
        title: 'Reference management',
        text: 'Consistent citations in the required style, and training in tools such as Zotero or Mendeley.',
        icon: 'link',
      },
      {
        title: 'Cover letter & reviewer-response guidance',
        text: 'Help structuring a clear cover letter and a respectful, point-by-point response to reviewer comments.',
        icon: 'send',
      },
      {
        title: 'Conference paper support',
        text: 'Editing and formatting abstracts and full papers to conference templates, plus presentation feedback.',
        icon: 'presentation',
      },
      {
        title: 'Book & thesis formatting',
        text: 'Consistent formatting of long documents to university or publisher specifications, including front matter and indexes.',
        icon: 'book-open',
      },
    ],
    process: [
      {
        title: 'Manuscript review',
        text: 'We read your manuscript and target journal (if chosen) and agree what support you need.',
      },
      {
        title: 'Journal fit',
        text: 'We shortlist suitable reputable journals, screening for predatory or hijacked titles.',
      },
      {
        title: 'Editing & formatting',
        text: 'We edit with tracked changes and format to guidelines; you review and approve every change.',
      },
      {
        title: 'Integrity checks',
        text: 'Similarity check, reference consistency and a final compliance checklist before submission.',
      },
      {
        title: 'Submission & revisions',
        text: 'Guidance on the submission portal, cover letter and responding to peer-review comments.',
      },
    ],
    deliverables: [
      'Edited manuscript with tracked changes and comments',
      'Formatted manuscript matching the target journal’s guidelines',
      'Shortlist of suitable reputable journals with reasoning',
      'Similarity report with guidance notes',
      'Cover letter and reviewer-response feedback (where included)',
      'Pre-submission compliance checklist',
    ],
    engagement: [
      {
        name: 'Single session',
        description: 'A consultation on journal choice, a reviewer response or a specific submission problem.',
        bestFor: 'Authors with a nearly ready manuscript who need expert advice on one step.',
      },
      {
        name: 'Package',
        description: 'Editing, formatting and similarity check for one manuscript, with a journal shortlist.',
        bestFor: 'Researchers preparing a paper for its first submission.',
      },
      {
        name: 'End-to-end',
        description: 'Support from journal selection through submission and each round of revisions.',
        bestFor: 'Scholars who want guidance throughout the publication cycle.',
      },
    ],
    faqs: [
      {
        q: 'Do you guarantee publication or acceptance in a journal?',
        a: 'No. Acceptance is decided by journal editors and peer reviewers. Anyone guaranteeing acceptance is a warning sign. We improve the clarity, presentation and compliance of your manuscript and help you choose a suitable journal.',
      },
      {
        q: 'Will you write the paper for me?',
        a: 'No. We do not ghostwrite papers or theses. We edit and format work that you have written, and provide guidance so that the research and the writing remain genuinely yours.',
      },
      {
        q: 'Can you add someone as an author or sell authorship slots?',
        a: 'Never. Authorship must reflect a genuine intellectual contribution, as set out in COPE and ICMJE guidance. We do not sell, broker or add authorship under any circumstances.',
      },
      {
        q: 'How do you identify predatory journals?',
        a: 'We check indexing claims against the actual databases, review editorial boards, peer-review practices, fees and journal websites, and refer to resources such as the UGC-CARE list where relevant. Read our article on spotting predatory journals for the full checklist.',
      },
      {
        q: 'Do you use AI tools to edit my manuscript?',
        a: 'Editing is done by human editors. If any software is used — for example, a grammar or similarity checker — it is used only as a support tool, and we will tell you. Confidential manuscripts are never uploaded to public AI tools.',
      },
      {
        q: 'Is my unpublished manuscript kept confidential?',
        a: 'Yes. Your manuscript is accessed only by the people working on it, is never shared or reused, and can be deleted from our systems on request after the work is complete.',
      },
    ],
    related: ['research-innovations', 'admission-expert'],
    image: 'servicePublication',
    ethics: {
      title: 'Our Publication Ethics',
      points: [
        'We do NOT ghostwrite theses, papers or chapters — we edit and guide your own work.',
        'We do NOT sell, broker or add authorship. Authorship must reflect real contribution.',
        'We do NOT work with predatory or hijacked journals, and we screen every recommendation.',
        'We never guarantee acceptance. Editorial decisions belong to the journal.',
        'We promote originality, proper citation, and awareness of COPE guidelines and the UGC-CARE list.',
      ],
    },
    seo: {
      title: 'Journal Publication Assistance & Editing',
      description:
        'Ethical journal publication assistance: manuscript editing, formatting, similarity checks, reputable journal selection and reviewer-response guidance.',
    },
    whatsappTopic: 'Publication Services',
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

/** Services as select options (forms). */
export const serviceOptions = services.map((s) => ({ value: s.slug, label: s.title }));
