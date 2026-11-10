/**
 * Site-wide FAQs (/faq page + home preview). Service-specific FAQs live in services.ts.
 * `featured: true` items appear in the home-page preview (keep it to 5).
 */
export type FaqCategory =
  | 'General'
  | 'Admissions'
  | 'Career'
  | 'Research'
  | 'Publications'
  | 'Fees & Payments'
  | 'Privacy';

export interface FaqItem {
  id: string;
  category: FaqCategory;
  q: string;
  a: string;
  featured?: boolean;
}

export const faqCategories: FaqCategory[] = [
  'General',
  'Admissions',
  'Career',
  'Research',
  'Publications',
  'Fees & Payments',
  'Privacy',
];

export const faqs: FaqItem[] = [
  // General
  {
    id: 'what-is-oxygen',
    category: 'General',
    q: 'What does Oxygen Edu-Hub do?',
    a: 'We are an academic services and education consultancy. We offer four services: admission guidance, career counselling, research and innovation mentoring, and ethical publication support. Everything we do is guidance and skill-building — we help you make better decisions and produce better work of your own.',
    featured: true,
  },
  {
    id: 'is-consultation-free',
    category: 'General',
    q: 'Is the first consultation really free?',
    a: 'Yes. The first consultation of about 20–30 minutes is free and carries no obligation. We use it to understand your needs and explain how we can help. If we are not the right fit, we will tell you.',
    featured: true,
  },
  {
    id: 'online-or-offline',
    category: 'General',
    q: 'Do you work online or in person?',
    a: 'Both. Most sessions work well over phone or video call, so we can support clients anywhere in India and abroad. In-person meetings are available at our office by appointment.',
  },
  {
    id: 'guarantee',
    category: 'General',
    q: 'Do you guarantee results?',
    a: 'No. Admission, hiring and publication decisions are made by institutions, employers and journals — not by us. We guarantee honest advice, careful work and clear communication, and we never make promises about outcomes that are not ours to give.',
    featured: true,
  },
  // Admissions
  {
    id: 'adm-when-start',
    category: 'Admissions',
    q: 'How early should I start preparing my applications?',
    a: 'For competitive programmes, start 9–12 months before the intake, especially if entrance exams are involved. For study abroad, 12–18 months is ideal. If your deadlines are close, contact us anyway and we will tell you honestly what is still realistic.',
  },
  {
    id: 'adm-quota',
    category: 'Admissions',
    q: 'Can you get me a seat through management or donation quota?',
    a: 'No. We do not arrange seats through payments of any kind and we do not work with such "quotas". We guide you through official, published admission processes only.',
  },
  {
    id: 'adm-sop',
    category: 'Admissions',
    q: 'Will you write my SOP or essays?',
    a: 'No. We help you brainstorm, plan and structure your SOP, essays and recommendation requests, and we give detailed feedback on each draft — but the writing stays yours. This is both ethical and what admission panels expect.',
  },
  // Career
  {
    id: 'car-test',
    category: 'Career',
    q: 'What kind of assessment do you use for career guidance?',
    a: 'We use a validated psychometric assessment of interests, aptitude and work style through a partner tool, and always discuss the results with you in a one-to-one session. A test is a starting point for a conversation, not a final answer.',
  },
  {
    id: 'car-age',
    category: 'Career',
    q: 'What is the right age for career counselling?',
    a: 'Class 9–10 is ideal for stream selection, Class 11–12 for course and career choices, and any stage of college or early career for specialisation, higher studies or a career switch. It is never too early to explore or too late to plan.',
    featured: true,
  },
  {
    id: 'car-placement',
    category: 'Career',
    q: 'Do you provide job placements?',
    a: 'No. We are not a placement agency and we do not guarantee jobs. We help you choose a direction, build your skills plan and present yourself well through your CV, LinkedIn profile and interviews.',
  },
  // Research
  {
    id: 'res-thesis',
    category: 'Research',
    q: 'Do you write theses or dissertations?',
    a: 'No. We never ghostwrite theses, dissertations, chapters or papers. We mentor you on topic selection, methodology, literature review and analysis, and we review your drafts — so you can produce and defend your own work.',
    featured: true,
  },
  {
    id: 'res-stats',
    category: 'Research',
    q: 'Can you help with statistical analysis?',
    a: 'Yes. We help you choose appropriate tests, teach you to run them in SPSS, R or Python, and review your outputs and interpretation. The goal is that you understand and can explain every result.',
  },
  {
    id: 'res-disciplines',
    category: 'Research',
    q: 'Which subjects and disciplines do you support?',
    a: 'We support scholars across sciences, social sciences, management, education and humanities. In the first session we confirm we have suitable subject expertise before any paid work begins.',
  },
  // Publications
  {
    id: 'pub-acceptance',
    category: 'Publications',
    q: 'Can you guarantee my paper will be accepted?',
    a: 'No one can honestly guarantee acceptance — editorial decisions belong to journals and peer reviewers. We improve the clarity and compliance of your manuscript and help you choose a suitable, reputable journal.',
  },
  {
    id: 'pub-predatory',
    category: 'Publications',
    q: 'How do you make sure a journal is not predatory?',
    a: 'We verify indexing directly in the databases (such as Scopus and Web of Science), check DOAJ and the UGC-CARE list where relevant, and review editorial boards, peer-review practices and fees. We never recommend predatory or hijacked journals.',
  },
  {
    id: 'pub-authorship',
    category: 'Publications',
    q: 'Can you add co-authors or provide authorship?',
    a: 'Never. Authorship must reflect genuine intellectual contribution, in line with COPE and ICMJE guidance. We do not sell, broker or add authorship under any circumstances.',
  },
  {
    id: 'pub-plagiarism',
    category: 'Publications',
    q: 'Do you offer plagiarism checking?',
    a: 'Yes. We provide a similarity report and guidance on correct paraphrasing, quotation and citation. We do not "rewrite text to beat the software" — the aim is genuine originality and proper credit to sources.',
  },
  // Fees & Payments
  {
    id: 'fee-pricing',
    category: 'Fees & Payments',
    q: 'How much do your services cost?',
    a: 'Fees depend on the service and the scope of support you need. After the free consultation we share a written plan with transparent pricing. No paid work starts until you have agreed to it.',
  },
  {
    id: 'fee-methods',
    category: 'Fees & Payments',
    q: 'Which payment methods do you accept?',
    a: 'We accept bank transfer, UPI and other methods confirmed in your plan, and issue receipts for every payment. Please do not pay anyone claiming to represent us outside the official channels listed on this website.',
  },
  {
    id: 'fee-refund',
    category: 'Fees & Payments',
    q: 'Can I get a refund if I cancel?',
    a: 'Refunds and rescheduling are governed by our Refund & Cancellation Policy, which explains cancellation windows and how refunds for unused services are handled. Please read it before you book a paid service.',
  },
  // Privacy
  {
    id: 'priv-docs',
    category: 'Privacy',
    q: 'Are my documents and personal details kept confidential?',
    a: 'Yes. Your documents, drafts and data are accessed only by the people working with you, used only to provide the service, and never shared or reused without your permission. See our Privacy Policy for details.',
  },
  {
    id: 'priv-delete',
    category: 'Privacy',
    q: 'Can I ask you to delete my data?',
    a: 'Yes. You can request access to, correction of, or deletion of your personal data at any time, subject to any records we must keep by law. Write to us using the contact details in our Privacy Policy.',
  },
  {
    id: 'priv-ai',
    category: 'Privacy',
    q: 'Do you upload my work to AI tools?',
    a: 'We never upload confidential documents, manuscripts or data to public AI tools. Where any software (such as a similarity checker) is used to support our work, we tell you in advance.',
  },
];
