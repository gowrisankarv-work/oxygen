/**
 * Legal page content — TEMPLATES ONLY. Every page shows a "to be reviewed by the client's
 * legal advisor" banner while siteConfig.legal.legalReviewed is false (and always in dev).
 * Company details are pulled from site.config.ts so they stay in sync.
 */
import type { ArticleBlock } from '@/content/articles/types';
import { siteConfig, formatAddress } from '@/config/site.config';

export interface LegalSection {
  id: string;
  title: string;
  blocks: ArticleBlock[];
}

export interface LegalDoc {
  id: 'privacy-policy' | 'terms-and-conditions' | 'refund-cancellation-policy' | 'disclaimer';
  title: string;
  intro: string;
  sections: LegalSection[];
}

const c = siteConfig;
const contactLine = `Email: ${c.contact.email} · Phone: ${c.contact.phoneDisplay} · Address: ${formatAddress()}`;

const privacy: LegalDoc = {
  id: 'privacy-policy',
  title: 'Privacy Policy',
  intro: `This Privacy Policy explains how ${c.legal.businessEntity} ("${c.shortName}", "we", "us") collects, uses, shares and protects personal data when you visit our website or use our services. We process personal data in line with applicable Indian law, including the Digital Personal Data Protection Act, 2023 and the rules made under it.`,
  sections: [
    {
      id: 'data-we-collect',
      title: '1. Personal data we collect',
      blocks: [
        { type: 'p', text: 'We collect only the personal data we need to respond to you and provide our services:' },
        {
          type: 'ul',
          items: [
            '**Contact details** — name, email address, phone number and city, when you fill in a form, call, email or message us.',
            '**Enquiry details** — your role (for example student or parent), education level, services of interest, timelines and any message you send.',
            '**Service records** — documents you choose to share with us during an engagement, such as academic records, drafts, manuscripts or data sets.',
            '**Technical data** — basic information such as browser type and pages visited. Analytics cookies are used only if you accept them.',
          ],
        },
        {
          type: 'p',
          text: 'Please do not send us sensitive information (such as health or financial account details) unless it is genuinely necessary for the service and we have asked for it.',
        },
      ],
    },
    {
      id: 'how-we-use',
      title: '2. How we use your data',
      blocks: [
        {
          type: 'ul',
          items: [
            'To respond to enquiries and schedule consultations.',
            'To provide the services you engage us for, and to communicate with you about them.',
            'To send newsletters or updates, only if you have subscribed — you can unsubscribe at any time.',
            'To improve our website and services using aggregated, non-identifying information.',
            'To meet legal, accounting and regulatory obligations.',
          ],
        },
        {
          type: 'p',
          text: 'We do not sell your personal data, and we do not use it for automated decision-making about you.',
        },
      ],
    },
    {
      id: 'consent-and-legal-basis',
      title: '3. Consent and legitimate uses',
      blocks: [
        {
          type: 'p',
          text: 'We process your personal data on the basis of your consent (for example when you tick the consent box on our forms) or for other legitimate uses permitted by law, such as completing a service you have requested. You may withdraw consent at any time by contacting us; this will not affect processing already carried out.',
        },
      ],
    },
    {
      id: 'sharing',
      title: '4. Sharing your data',
      blocks: [
        { type: 'p', text: 'We share personal data only where necessary, and only with:' },
        {
          type: 'ul',
          items: [
            'Team members and contracted mentors or editors working on your engagement, under confidentiality obligations.',
            'Service providers who help us operate (for example form, email, hosting or analytics providers), acting on our instructions.',
            'Authorities, where we are required to do so by law.',
          ],
        },
        {
          type: 'p',
          text: 'We never upload your confidential documents, manuscripts or data to public AI tools, and we never share your work with third parties without your permission.',
        },
      ],
    },
    {
      id: 'retention-security',
      title: '5. Retention and security',
      blocks: [
        {
          type: 'p',
          text: 'We keep personal data only for as long as needed for the purposes above or as required by law, after which it is deleted or anonymised. We use reasonable technical and organisational safeguards to protect your data against unauthorised access, loss or misuse. No method of transmission over the internet is completely secure, but we work to protect your information.',
        },
      ],
    },
    {
      id: 'your-rights',
      title: '6. Your rights',
      blocks: [
        { type: 'p', text: 'Subject to applicable law, you have the right to:' },
        {
          type: 'ul',
          items: [
            'Obtain a summary of the personal data we hold about you and how it is processed.',
            'Request correction, completion, updating or erasure of your personal data.',
            'Withdraw consent you have given.',
            'Nominate another person to exercise your rights in the event of death or incapacity.',
            'Raise a grievance with us, and if unresolved, approach the Data Protection Board of India.',
          ],
        },
      ],
    },
    {
      id: 'cookies',
      title: '7. Cookies',
      blocks: [
        {
          type: 'p',
          text: 'We use essential storage to make the website work (for example, to remember your cookie choice). Analytics cookies are loaded only if you click "Accept" on our cookie banner. You can change your choice at any time by clearing your browser storage for this site.',
        },
      ],
    },
    {
      id: 'children',
      title: '8. Children’s data',
      blocks: [
        {
          type: 'p',
          text: 'Many of our clients are school students. Where a user is under 18, we expect a parent or lawful guardian to provide consent and we process the minimum data necessary. We do not track or target advertising at children.',
        },
      ],
    },
    {
      id: 'grievance',
      title: '9. Contact and grievance officer',
      blocks: [
        {
          type: 'p',
          text: `For any question, request or grievance about your personal data, please contact our Grievance Officer: ${c.people.contactPerson.name}, ${c.people.contactPerson.title}. ${contactLine}. We aim to respond within the timelines required by law.`,
        },
        {
          type: 'p',
          text: 'We may update this policy from time to time. The "Last updated" date at the top shows when it last changed.',
        },
      ],
    },
  ],
};

const terms: LegalDoc = {
  id: 'terms-and-conditions',
  title: 'Terms & Conditions',
  intro: `These Terms & Conditions govern your use of the ${c.shortName} website and services provided by ${c.legal.businessEntity}. By using our website or engaging our services, you agree to these terms. If you do not agree, please do not use the website or services.`,
  sections: [
    {
      id: 'services',
      title: '1. Our services',
      blocks: [
        {
          type: 'p',
          text: 'We provide guidance, mentoring, training, review, editing and formatting services in the areas of admissions, career guidance, research and publication. The exact scope, deliverables, timelines and fees of any paid engagement are set out in a written plan or proposal that you accept before work begins.',
        },
      ],
    },
    {
      id: 'no-guarantee',
      title: '2. No guarantee of outcomes',
      blocks: [
        {
          type: 'p',
          text: 'Admission, scholarship, hiring, visa and publication decisions are made solely by third parties such as institutions, employers, embassies and journals. We do not and cannot guarantee any outcome. Our fees are for the guidance and services provided, not for any result.',
        },
      ],
    },
    {
      id: 'academic-integrity',
      title: '3. Academic integrity',
      blocks: [
        { type: 'p', text: 'We will not provide, and you agree not to request:' },
        {
          type: 'ul',
          items: [
            'Ghostwriting of theses, dissertations, papers, assignments, SOPs, essays or recommendation letters.',
            'Fabrication, falsification or manipulation of data or results.',
            'Sale, brokering or addition of authorship.',
            'Submission to predatory or hijacked journals.',
            'Any "management quota", donation or seat-arrangement services.',
          ],
        },
        {
          type: 'p',
          text: 'We may end an engagement immediately if we reasonably believe our services are being used in breach of academic integrity, without liability for any refund of fees for work already performed.',
        },
      ],
    },
    {
      id: 'client-responsibilities',
      title: '4. Your responsibilities',
      blocks: [
        {
          type: 'ul',
          items: [
            'Provide accurate, complete information and genuine documents.',
            'Meet agreed timelines for sharing information and reviewing drafts.',
            'Make final decisions about your applications, career choices and submissions — you remain responsible for them.',
            'Ensure you have the right to share any documents or data you give us.',
          ],
        },
      ],
    },
    {
      id: 'fees',
      title: '5. Fees and payment',
      blocks: [
        {
          type: 'p',
          text: 'Fees are stated in your written plan and are payable as set out there. Unless stated otherwise, fees are payable in advance and are exclusive of applicable taxes. Payments must be made only through the official channels confirmed by us in writing. Refunds and cancellations are governed by our [Refund & Cancellation Policy](/refund-cancellation-policy).',
        },
      ],
    },
    {
      id: 'ip',
      title: '6. Intellectual property and confidentiality',
      blocks: [
        {
          type: 'p',
          text: 'You retain all rights in your own work, ideas and data. We retain rights in our own materials, templates, workshop content and website content, which you may use for personal, non-commercial purposes only. We keep your documents confidential and use them only to provide the services.',
        },
      ],
    },
    {
      id: 'liability',
      title: '7. Limitation of liability',
      blocks: [
        {
          type: 'p',
          text: 'To the maximum extent permitted by law, our total liability arising out of any engagement is limited to the fees you paid for that engagement. We are not liable for indirect or consequential losses, or for decisions made by third parties. Website content is general information and is not a substitute for advice on your specific situation.',
        },
      ],
    },
    {
      id: 'website-use',
      title: '8. Use of this website',
      blocks: [
        {
          type: 'p',
          text: 'You agree not to misuse the website, attempt to gain unauthorised access, or submit false or malicious information through our forms. Links to third-party websites are provided for convenience; we are not responsible for their content.',
        },
      ],
    },
    {
      id: 'law',
      title: '9. Governing law and disputes',
      blocks: [
        {
          type: 'p',
          text: `These terms are governed by the laws of India. Subject to any mandatory consumer protection rights, the courts at ${c.legal.jurisdiction} shall have jurisdiction. We encourage you to contact us first so we can try to resolve any concern amicably. ${contactLine}.`,
        },
      ],
    },
  ],
};

const refund: LegalDoc = {
  id: 'refund-cancellation-policy',
  title: 'Refund & Cancellation Policy',
  intro: `This policy explains how cancellations, rescheduling and refunds work for services purchased from ${c.legal.businessEntity}. It forms part of our Terms & Conditions. Specific terms in your written plan take precedence where they differ.`,
  sections: [
    {
      id: 'free-consultation',
      title: '1. Free consultation',
      blocks: [
        {
          type: 'p',
          text: 'The initial consultation is free. You may cancel or reschedule it at any time by letting us know.',
        },
      ],
    },
    {
      id: 'single-sessions',
      title: '2. Single paid sessions',
      blocks: [
        {
          type: 'ul',
          items: [
            'Reschedule free of charge with at least 24 hours’ notice (one reschedule per booking).',
            'Cancel at least 24 hours before the session for a full refund.',
            'Cancellations with less than 24 hours’ notice, or missed sessions, are not refundable but may be rescheduled once at our discretion.',
          ],
        },
      ],
    },
    {
      id: 'packages',
      title: '3. Packages and end-to-end engagements',
      blocks: [
        {
          type: 'ul',
          items: [
            'Cancel within 48 hours of payment, before any work has started, for a full refund.',
            'After work has started, you may cancel at any time. We will refund fees for services not yet delivered, less the value of work completed and any third-party costs already incurred (for example assessment or similarity-check licences).',
            'Completed deliverables (such as reviewed documents or edited manuscripts) are not refundable.',
          ],
        },
      ],
    },
    {
      id: 'non-refundable',
      title: '4. Situations not eligible for refunds',
      blocks: [
        {
          type: 'p',
          text: 'Because outcomes are decided by third parties, fees are not refundable on the basis of an admission, scholarship, job, visa or publication decision. Refunds are also not available where an engagement is ended because of a breach of our academic-integrity terms.',
        },
      ],
    },
    {
      id: 'our-cancellation',
      title: '5. If we cancel',
      blocks: [
        {
          type: 'p',
          text: 'If we need to cancel or cannot deliver an agreed service, we will offer an alternative time or mentor, or refund the fees for the undelivered portion in full.',
        },
      ],
    },
    {
      id: 'how-to-request',
      title: '6. How to request a cancellation or refund',
      blocks: [
        {
          type: 'p',
          text: `Write to us with your name, booking details and reason. ${contactLine}. Approved refunds are processed to the original payment method within 7–10 working days; your bank may take additional time to credit the amount.`,
        },
      ],
    },
  ],
};

const disclaimer: LegalDoc = {
  id: 'disclaimer',
  title: 'Disclaimer',
  intro: `${c.shortName} provides academic guidance and support services. Please read this disclaimer carefully — it sets out the limits of what we do and the ethical standards we follow.`,
  sections: [
    {
      id: 'guidance-only',
      title: '1. Guidance only — no guarantees',
      blocks: [
        {
          type: 'p',
          text: 'We do not guarantee admission to any institution or course, any scholarship, any job or placement, any visa decision, or acceptance or publication in any journal or conference. These decisions are made solely by the relevant institutions, employers, authorities and editors.',
        },
      ],
    },
    {
      id: 'ethics',
      title: '2. Our ethics statement',
      blocks: [
        {
          type: 'ul',
          items: [
            'We do **not** ghostwrite theses, dissertations, research papers, assignments, SOPs or essays. We review, edit and guide work that you write.',
            'We do **not** sell, broker or add authorship. Authorship must reflect a genuine contribution, in line with COPE and ICMJE guidance.',
            'We do **not** work with predatory or hijacked journals, and we screen journals before recommending them.',
            'We do **not** arrange seats, "management quota" or donation-based admissions.',
            'We do **not** fabricate, falsify or manipulate data.',
            'We **do** promote originality, proper citation, research ethics and awareness of resources such as the UGC-CARE list.',
          ],
        },
      ],
    },
    {
      id: 'information',
      title: '3. Website information',
      blocks: [
        {
          type: 'p',
          text: 'Content on this website, including articles and FAQs, is general information. It is believed to be accurate at the time of writing, but rules, deadlines and eligibility criteria change. Always verify important details with the official source, and seek advice on your specific situation.',
        },
      ],
    },
    {
      id: 'samples',
      title: '4. Sample content',
      blocks: [
        {
          type: 'p',
          text: 'Where testimonials, figures or team profiles are marked "Sample", they are illustrative placeholders and do not describe real clients, results or people. We do not claim any accreditation, ranking, award or institutional partnership unless it is explicitly stated and verifiable.',
        },
      ],
    },
    {
      id: 'professional-services',
      title: '5. Specialist professional services',
      blocks: [
        {
          type: 'p',
          text: 'Information about patents, visas or legal matters is provided for awareness only. Patent filings must be handled by registered patent agents or attorneys, and visa or legal advice should be obtained from the appropriate authority or qualified professional.',
        },
      ],
    },
    {
      id: 'external-links',
      title: '6. External links',
      blocks: [
        {
          type: 'p',
          text: 'Links to third-party websites are provided for convenience. We do not control and are not responsible for their content, availability or privacy practices.',
        },
      ],
    },
    {
      id: 'contact',
      title: '7. Questions',
      blocks: [{ type: 'p', text: `If you have questions about this disclaimer, please contact us. ${contactLine}.` }],
    },
  ],
};

export const legalDocs: Record<LegalDoc['id'], LegalDoc> = {
  'privacy-policy': privacy,
  'terms-and-conditions': terms,
  'refund-cancellation-policy': refund,
  disclaimer,
};
