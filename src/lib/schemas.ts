/**
 * Zod validation schemas for every form. Shared by the UI (inline errors) and unit tests.
 */
import { z } from 'zod';

const trimmed = (min: number, msg: string) => z.string().trim().min(min, msg);

export const nameField = trimmed(2, 'Please enter your full name.').max(
  80,
  'Please keep your name under 80 characters.',
);
export const emailField = z
  .string()
  .trim()
  .min(1, 'Please enter your email address.')
  .email('Please enter a valid email address, e.g. name@example.com.');
export const consentField = z.literal(true, {
  error: 'Please agree to the Privacy Policy so we can respond to you.',
});

/** Validates a phone number for a given country code. Indian mobiles: 10 digits starting 6–9. */
export function isValidPhone(countryCode: string, phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  if (countryCode === '+91')
    return /^[6-9]\d{9}$/.test(digits.replace(/^91(?=\d{10}$)/, '').replace(/^0(?=\d{10}$)/, ''));
  return digits.length >= 6 && digits.length <= 14;
}

export const phoneMessage = 'Please enter a valid phone number (10 digits for India).';

/* ------------------------------- Contact ------------------------------- */
export const contactSchema = z.object({
  name: nameField,
  email: emailField,
  phone: z
    .string()
    .trim()
    .refine((v) => v === '' || isValidPhone('+91', v) || isValidPhone('+00', v), phoneMessage),
  service: z.string().optional(),
  message: trimmed(10, 'Please tell us a little more (at least 10 characters).').max(
    2000,
    'Please keep your message under 2,000 characters.',
  ),
  consent: consentField,
});
export type ContactInput = z.infer<typeof contactSchema>;

/* ---------------------------- Quick enquiry ---------------------------- */
export const quickEnquirySchema = z.object({
  name: nameField,
  phone: z
    .string()
    .trim()
    .refine((v) => isValidPhone('+91', v), phoneMessage),
  email: z.union([z.literal(''), emailField]),
  service: z.string().min(1, 'Please choose a service.'),
  message: z.string().trim().max(1000, 'Please keep your message under 1,000 characters.').optional(),
  consent: consentField,
});
export type QuickEnquiryInput = z.infer<typeof quickEnquirySchema>;

/* ------------------------------ Newsletter ----------------------------- */
export const newsletterSchema = z.object({
  email: emailField,
  consent: consentField,
});
export type NewsletterInput = z.infer<typeof newsletterSchema>;

/* ------------------------- Consultation (3 steps) ------------------------ */
export const roleOptions = [
  { value: 'student', label: 'Student' },
  { value: 'parent', label: 'Parent' },
  { value: 'research-scholar', label: 'Research Scholar' },
  { value: 'professional', label: 'Professional' },
  { value: 'faculty', label: 'Faculty' },
  { value: 'institution', label: 'Institution' },
];

export const educationOptions = [
  { value: 'class-9-10', label: 'Class 9–10' },
  { value: 'class-11-12', label: 'Class 11–12' },
  { value: 'undergraduate', label: 'Undergraduate (pursuing / completed)' },
  { value: 'postgraduate', label: 'Postgraduate (pursuing / completed)' },
  { value: 'phd', label: 'PhD (pursuing / completed)' },
  { value: 'working', label: 'Working professional' },
  { value: 'other', label: 'Other' },
];

export const timelineOptions = [
  { value: 'asap', label: 'As soon as possible' },
  { value: '1-3-months', label: 'Within 1–3 months' },
  { value: '3-6-months', label: 'Within 3–6 months' },
  { value: '6-12-months', label: 'Within 6–12 months' },
  { value: 'exploring', label: 'Just exploring' },
];

export const contactMethodOptions = [
  { value: 'call', label: 'Phone call' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'email', label: 'Email' },
];

export const timeSlotOptions = [
  { value: 'morning', label: 'Morning (10 AM – 12 PM)' },
  { value: 'afternoon', label: 'Afternoon (12 PM – 3 PM)' },
  { value: 'evening', label: 'Evening (3 PM – 6 PM)' },
  { value: 'any', label: 'Any time' },
];

export const sourceOptions = [
  { value: 'search', label: 'Google / web search' },
  { value: 'social', label: 'Social media' },
  { value: 'friend', label: 'Friend or family' },
  { value: 'institution', label: 'School / college / university' },
  { value: 'event', label: 'Workshop or event' },
  { value: 'other', label: 'Other' },
];

export const countryCodes = [
  { value: '+91', label: 'India (+91)' },
  { value: '+971', label: 'UAE (+971)' },
  { value: '+1', label: 'USA / Canada (+1)' },
  { value: '+44', label: 'UK (+44)' },
  { value: '+61', label: 'Australia (+61)' },
  { value: '+65', label: 'Singapore (+65)' },
  { value: '+966', label: 'Saudi Arabia (+966)' },
  { value: '+974', label: 'Qatar (+974)' },
  { value: '+968', label: 'Oman (+968)' },
  { value: '+977', label: 'Nepal (+977)' },
  { value: '+94', label: 'Sri Lanka (+94)' },
];

const enumValues = (opts: { value: string }[]) => opts.map((o) => o.value) as [string, ...string[]];

export const consultationSchema = z
  .object({
    // Step 1 — About you
    fullName: nameField,
    email: emailField,
    countryCode: z.enum(enumValues(countryCodes), { error: 'Please choose a country code.' }),

    phone: z.string().trim().min(1, 'Please enter your phone number.'),
    city: trimmed(2, 'Please enter your city.').max(60, 'Please keep the city under 60 characters.'),
    role: z.enum(enumValues(roleOptions), { error: 'Please tell us who you are.' }),
    // Step 2 — Your need
    services: z
      .array(
        z.enum(['admission-expert', 'career-guidance', 'research-innovations', 'publication-services', 'not-sure']),
      )
      .min(1, 'Please choose at least one service (or “Not sure”).'),
    educationLevel: z.enum(enumValues(educationOptions), { error: 'Please choose your current education level.' }),
    target: z.string().trim().max(200, 'Please keep this under 200 characters.').optional(),
    timeline: z.enum(enumValues(timelineOptions), { error: 'Please choose a timeline.' }),
    // Step 3 — Preferences
    contactMethod: z.enum(enumValues(contactMethodOptions), { error: 'Please choose how we should contact you.' }),
    preferredDate: z
      .string()
      .optional()
      .refine((v) => !v || !Number.isNaN(Date.parse(v)), 'Please choose a valid date.'),
    timeSlot: z.enum(enumValues(timeSlotOptions), { error: 'Please choose a time slot.' }),
    message: z.string().trim().max(1500, 'Please keep your message under 1,500 characters.').optional(),
    source: z.string().optional(),
    consent: consentField,
  })
  .superRefine((v, ctx) => {
    if (!isValidPhone(v.countryCode, v.phone)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['phone'], message: phoneMessage });
    }
  });

export type ConsultationInput = z.infer<typeof consultationSchema>;

export const consultationSteps = [
  { id: 'about', title: 'About you', fields: ['fullName', 'email', 'countryCode', 'phone', 'city', 'role'] },
  { id: 'need', title: 'Your need', fields: ['services', 'educationLevel', 'target', 'timeline'] },
  {
    id: 'preferences',
    title: 'Preferences',
    fields: ['contactMethod', 'preferredDate', 'timeSlot', 'message', 'source', 'consent'],
  },
] as const;

export type FieldErrors = Record<string, string>;

/** Flattens Zod issues into { field: firstMessage }. */
export function toFieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? '_form');
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

/**
 * Validates only the given step's fields (per-step validation for the multi-step form).
 * Uses the full schema so cross-field rules (phone ↔ country code) still apply, then keeps
 * only errors that belong to this step.
 */
export function validateConsultationStep(stepIndex: number, values: object): FieldErrors {
  const step = consultationSteps[stepIndex];
  if (!step) return {};
  const result = consultationSchema.safeParse(values);
  if (result.success) return {};
  const all = toFieldErrors(result.error);
  // superRefine only runs once the base schema passes, so check the cross-field phone rule
  // directly — otherwise an invalid phone would slip through step 1 while later steps are empty.
  const v = values as { countryCode?: unknown; phone?: unknown };
  if (
    !all.phone &&
    typeof v.phone === 'string' &&
    v.phone.trim() &&
    !isValidPhone(String(v.countryCode ?? '+91'), v.phone)
  ) {
    all.phone = phoneMessage;
  }
  const fields = step.fields as readonly string[];
  return Object.fromEntries(Object.entries(all).filter(([k]) => fields.includes(k)));
}
