import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  contactSchema,
  newsletterSchema,
  quickEnquirySchema,
  consultationSchema,
  validateConsultationStep,
  isValidPhone,
  toFieldErrors,
} from '../src/lib/schemas';

describe('isValidPhone', () => {
  it('validates Indian mobiles', () => {
    assert.equal(isValidPhone('+91', '98765 43210'), true);
    assert.equal(isValidPhone('+91', '+91 98765 43210'), true);
    assert.equal(isValidPhone('+91', '12345 67890'), false, 'must start with 6-9');
    assert.equal(isValidPhone('+91', '98765'), false);
  });
  it('accepts reasonable international numbers', () => {
    assert.equal(isValidPhone('+44', '7700 900123'), true);
    assert.equal(isValidPhone('+1', '12'), false);
  });
});

describe('contactSchema', () => {
  const valid = {
    name: 'Asha Kumar',
    email: 'asha@example.com',
    phone: '',
    service: '',
    message: 'I need help choosing a course.',
    consent: true,
  };
  it('accepts valid input', () => assert.equal(contactSchema.safeParse(valid).success, true));
  it('rejects bad email, short message and missing consent', () => {
    const r = contactSchema.safeParse({ ...valid, email: 'nope', message: 'hi', consent: false });
    assert.equal(r.success, false);
    if (!r.success) {
      const e = toFieldErrors(r.error);
      assert.ok(e.email);
      assert.ok(e.message);
      assert.ok(e.consent);
    }
  });
  it('rejects an invalid optional phone', () => {
    assert.equal(contactSchema.safeParse({ ...valid, phone: '123' }).success, false);
  });
});

describe('quickEnquirySchema / newsletterSchema', () => {
  it('requires phone and service', () => {
    const r = quickEnquirySchema.safeParse({ name: 'Ravi', phone: '', email: '', service: '', consent: true });
    assert.equal(r.success, false);
    if (!r.success) {
      const e = toFieldErrors(r.error);
      assert.ok(e.phone && e.service);
    }
  });
  it('accepts an empty optional email', () => {
    assert.equal(
      quickEnquirySchema.safeParse({
        name: 'Ravi',
        phone: '9876543210',
        email: '',
        service: 'career-guidance',
        consent: true,
      }).success,
      true,
    );
  });
  it('newsletter needs email + consent', () => {
    assert.equal(newsletterSchema.safeParse({ email: 'a@b.co', consent: true }).success, true);
    assert.equal(newsletterSchema.safeParse({ email: 'a@b.co', consent: false }).success, false);
  });
});

describe('consultationSchema (multi-step)', () => {
  const full = {
    fullName: 'Asha Kumar',
    email: 'asha@example.com',
    countryCode: '+91',
    phone: '9876543210',
    city: 'Chennai',
    role: 'student',
    services: ['admission-expert'],
    educationLevel: 'class-11-12',
    target: 'B.Sc. Physics',
    timeline: '1-3-months',
    contactMethod: 'whatsapp',
    preferredDate: '',
    timeSlot: 'evening',
    message: '',
    source: '',
    consent: true,
  };
  it('accepts a complete submission', () => assert.equal(consultationSchema.safeParse(full).success, true));
  it('validates only the current step', () => {
    const step0 = validateConsultationStep(0, { ...full, fullName: '', services: [] });
    assert.ok(step0.fullName);
    assert.equal(step0.services, undefined, 'step-2 errors are not reported on step 1');
    const step1 = validateConsultationStep(1, { ...full, services: [] });
    assert.ok(step1.services);
    const step2 = validateConsultationStep(2, { ...full, consent: false, timeSlot: '' });
    assert.ok(step2.consent && step2.timeSlot);
  });
  it('applies the phone rule for the chosen country code', () => {
    assert.ok(validateConsultationStep(0, { ...full, phone: '12345' }).phone);
    // …even while later steps are still empty (superRefine would not run)
    assert.ok(
      validateConsultationStep(0, { ...full, phone: '12345', services: [], timeSlot: '', consent: false }).phone,
    );
    assert.equal(validateConsultationStep(0, { ...full, countryCode: '+44', phone: '7700900123' }).phone, undefined);
  });
  it('rejects unknown enum values', () => {
    assert.equal(consultationSchema.safeParse({ ...full, role: 'hacker' }).success, false);
  });
});
