/**
 * Multi-step "Book a Free Consultation" form.
 *  - useReducer state machine: steps 0–2 + review (3)
 *  - per-step Zod validation (validateConsultationStep), inline errors, focus first invalid field
 *  - data persists between steps and in sessionStorage (draft, try/catch)
 *  - ?service=<slug> preselects a service
 *  - final submit through React 19 useActionState → submitForm() → /thank-you, or the
 *    email/WhatsApp fallback when no form provider is configured
 */
import { useActionState, useEffect, useReducer, useRef, useState } from 'react';
import type { FormEvent, FocusEvent, ReactNode } from 'react';
import {
  consultationSchema,
  consultationSteps,
  contactMethodOptions,
  countryCodes,
  educationOptions,
  roleOptions,
  sourceOptions,
  timelineOptions,
  timeSlotOptions,
  toFieldErrors,
  validateConsultationStep,
  type FieldErrors,
} from '@/lib/schemas';
import { HONEYPOT_FIELD, spamCheck, submitForm, type FormPayload } from '@/lib/submitForm';
import { services, getService } from '@/content/services';
import { useNavigate, useSearchParams } from '@/router/router';
import { useHydrated } from '@/hooks/useHydrated';
import { Checkbox, ChoiceGroup, Input, Select, Textarea } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/icons/Icon';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/cn';
import { ConsentLabel, FallbackPanel, FormAlert, Honeypot, SubmitButton, Turnstile } from './FormParts';
import type { FallbackResult } from './useFormEngine';

export interface ConsultationValues {
  fullName: string;
  email: string;
  countryCode: string;
  phone: string;
  city: string;
  role: string;
  services: string[];
  educationLevel: string;
  target: string;
  timeline: string;
  contactMethod: string;
  preferredDate: string;
  timeSlot: string;
  message: string;
  source: string;
  consent: boolean;
}

export const emptyValues: ConsultationValues = {
  fullName: '',
  email: '',
  countryCode: '+91',
  phone: '',
  city: '',
  role: '',
  services: [],
  educationLevel: '',
  target: '',
  timeline: '',
  contactMethod: '',
  preferredDate: '',
  timeSlot: '',
  message: '',
  source: '',
  consent: false,
};

const REVIEW_STEP = 3;
const DRAFT_KEY = 'oxygen-consultation-draft-v1';

interface State {
  step: number;
  values: ConsultationValues;
  errors: FieldErrors;
}

type Action =
  | { type: 'set'; field: keyof ConsultationValues; value: ConsultationValues[keyof ConsultationValues] }
  | { type: 'restore'; values: Partial<ConsultationValues> }
  | { type: 'errors'; errors: FieldErrors }
  | { type: 'fieldError'; field: string; message?: string }
  | { type: 'goto'; step: number }
  | { type: 'reset' };

export function consultationReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'set': {
      const errors = { ...state.errors };
      delete errors[action.field];
      return { ...state, values: { ...state.values, [action.field]: action.value }, errors };
    }
    case 'restore':
      return { ...state, values: { ...state.values, ...action.values } };
    case 'errors':
      return { ...state, errors: action.errors };
    case 'fieldError': {
      const errors = { ...state.errors };
      if (action.message) errors[action.field] = action.message;
      else delete errors[action.field];
      return { ...state, errors };
    }
    case 'goto':
      return { ...state, step: Math.max(0, Math.min(REVIEW_STEP, action.step)), errors: {} };
    case 'reset':
      return { step: 0, values: emptyValues, errors: {} };
    default:
      return state;
  }
}

function optionLabel(opts: { value: string; label: string }[], v: string): string {
  return opts.find((o) => o.value === v)?.label ?? v;
}

function serviceLabel(slug: string): string {
  return slug === 'not-sure' ? 'Not sure yet' : (getService(slug)?.title ?? slug);
}

/* ------------------------------ Progress UI ------------------------------ */
function Progress({ step }: { step: number }) {
  const labels = [...consultationSteps.map((s) => s.title), 'Review'];
  return (
    <div>
      <p className="sr-only" aria-live="polite">
        Step {step + 1} of {labels.length}: {labels[step]}
      </p>
      <ol className="grid grid-cols-4 gap-2" aria-label="Form progress">
        {labels.map((label, i) => {
          const state = i < step ? 'done' : i === step ? 'current' : 'todo';
          return (
            <li key={label} aria-current={state === 'current' ? 'step' : undefined} className="min-w-0">
              <span
                className={cn(
                  'block h-1.5 rounded-full transition-colors duration-300',
                  state === 'todo' ? 'bg-line' : 'bg-signature',
                )}
              />
              <span
                className={cn(
                  'mt-2 flex items-center gap-1.5 text-xs font-semibold sm:text-small',
                  state === 'todo' ? 'text-muted' : 'text-purple-900',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'hidden size-5 shrink-0 place-items-center rounded-full text-[0.7rem] sm:grid',
                    state === 'done'
                      ? 'bg-purple-700 text-white'
                      : state === 'current'
                        ? 'bg-purple-700/10 text-purple-700'
                        : 'bg-line text-muted',
                  )}
                >
                  {state === 'done' ? <Icon name="check" size={12} strokeWidth={3} /> : i + 1}
                </span>
                <span className="truncate">{label}</span>
                {state === 'done' && <span className="sr-only">(completed)</span>}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ---------------------------------- Form ---------------------------------- */
interface SubmitState {
  status: 'idle' | 'error' | 'success' | 'fallback';
  formError?: string;
  fallback?: FallbackResult;
  attempt: number;
}

export function ConsultationForm() {
  const navigate = useNavigate();
  const params = useSearchParams();
  const toast = useToast();
  const [state, dispatch] = useReducer(consultationReducer, { step: 0, values: emptyValues, errors: {} });
  const { step, values, errors } = state;
  const startedAt = useRef(Date.now());
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const restored = useRef(false);
  const [minDate, setMinDate] = useState<string | undefined>(undefined);
  const hydrated = useHydrated();
  const preselected = hydrated ? (params.get('service') ?? '') : '';
  const preselectedService = getService(preselected);

  // Restore draft + apply ?service= preselection (client only → no hydration mismatch)
  useEffect(() => {
    let draft: Partial<ConsultationValues> = {};
    try {
      const raw = window.sessionStorage.getItem(DRAFT_KEY);
      if (raw) draft = JSON.parse(raw) as Partial<ConsultationValues>;
    } catch {
      /* storage unavailable */
    }
    const svc = getService(preselected) ? preselected : '';
    if (svc && !(draft.services ?? []).includes(svc)) draft.services = [...(draft.services ?? []), svc];
    if (Object.keys(draft).length) dispatch({ type: 'restore', values: { ...draft, consent: false } });
    restored.current = true;
    setMinDate(new Date().toISOString().slice(0, 10));
  }, [preselected]);

  // Persist draft between steps (never the consent tick)
  useEffect(() => {
    if (!restored.current) return;
    try {
      const { consent: _consent, ...rest } = values;
      window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(rest));
    } catch {
      /* ignore */
    }
  }, [values]);

  const set = <K extends keyof ConsultationValues>(field: K, value: ConsultationValues[K]) =>
    dispatch({ type: 'set', field, value });

  const focusFirstError = () =>
    requestAnimationFrame(() =>
      document
        .querySelector<HTMLElement>(
          '#consultation-form [aria-invalid="true"], #consultation-form fieldset[aria-describedby] input',
        )
        ?.focus(),
    );

  const goTo = (next: number) => {
    dispatch({ type: 'goto', step: next });
    requestAnimationFrame(() => {
      headingRef.current?.focus({ preventScroll: true });
      headingRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    });
  };

  const next = () => {
    const stepErrors = validateConsultationStep(step, values);
    if (Object.keys(stepErrors).length) {
      dispatch({ type: 'errors', errors: stepErrors });
      focusFirstError();
      return;
    }
    goTo(step + 1);
  };

  const onBlur = (e: FocusEvent<HTMLFormElement>) => {
    const name = (e.target as HTMLInputElement).name;
    if (!name || name === HONEYPOT_FIELD || step === REVIEW_STEP) return;
    const nextFocus = e.relatedTarget as HTMLElement | null;
    if (nextFocus?.getAttribute('type') === 'submit') return; // "Continue" validates the step anyway
    const value = values[name as keyof ConsultationValues];
    const hasValue = Array.isArray(value)
      ? value.length > 0
      : typeof value === 'boolean'
        ? value
        : String(value ?? '').trim() !== '';
    if (!hasValue && !errors[name]) return;
    const message = validateConsultationStep(step, values)[name];
    // Only add errors on blur; errors clear while typing (see the 'set' action) so the layout
    // never shifts under the pointer as focus moves on.
    if (message) dispatch({ type: 'fieldError', field: name, message });
  };

  const [submitState, submitAction] = useActionState(
    async (prev: SubmitState, formData: FormData): Promise<SubmitState> => {
      const attempt = prev.attempt + 1;
      const verdict = spamCheck(String(formData.get(HONEYPOT_FIELD) ?? ''), startedAt.current);
      if (verdict === 'bot') return { status: 'success', attempt };
      if (verdict === 'too-fast') {
        return {
          status: 'error',
          attempt,
          formError: 'That was quick! Please review your details, then submit again.',
        };
      }
      const parsed = consultationSchema.safeParse(values);
      if (!parsed.success) {
        const all = toFieldErrors(parsed.error);
        const firstStep = consultationSteps.findIndex((s) => (s.fields as readonly string[]).some((f) => all[f]));
        dispatch({ type: 'goto', step: firstStep < 0 ? 0 : firstStep });
        dispatch({ type: 'errors', errors: all });
        return { status: 'error', attempt, formError: 'Some details need your attention.' };
      }
      const d = parsed.data;
      const payload: FormPayload = {
        fullName: d.fullName,
        email: d.email,
        phone: `${d.countryCode} ${d.phone}`,
        city: d.city,
        role: optionLabel(roleOptions, d.role),
        services: d.services.map(serviceLabel),
        educationLevel: optionLabel(educationOptions, d.educationLevel),
        target: d.target,
        timeline: optionLabel(timelineOptions, d.timeline),
        contactMethod: optionLabel(contactMethodOptions, d.contactMethod),
        preferredDate: d.preferredDate,
        timeSlot: optionLabel(timeSlotOptions, d.timeSlot),
        message: d.message,
        source: d.source ? optionLabel(sourceOptions, d.source) : '',
      };
      const token = formData.get('cf-turnstile-response');
      if (typeof token === 'string' && token) payload['cf-turnstile-response'] = token;
      const result = await submitForm(payload, 'consultation');
      if (result.status === 'success') return { status: 'success', attempt };
      return { status: 'fallback', fallback: result, attempt };
    },
    { status: 'idle', attempt: 0 },
  );

  const finish = () => {
    try {
      window.sessionStorage.removeItem(DRAFT_KEY);
    } catch {
      /* ignore */
    }
    dispatch({ type: 'reset' });
    void navigate('/thank-you?from=consultation');
  };

  useEffect(() => {
    if (submitState.attempt === 0) return;
    if (submitState.status === 'success') {
      toast.show({
        title: 'Request received',
        description: 'We will contact you to confirm your consultation.',
        tone: 'success',
      });
      finish();
    } else if (submitState.status === 'fallback' && submitState.fallback?.reason === 'error') {
      toast.show({
        title: 'We could not send your request',
        description: 'Please use email or WhatsApp below.',
        tone: 'error',
      });
    } else if (submitState.status === 'error') {
      focusFirstError();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitState.attempt]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (step < REVIEW_STEP) {
      e.preventDefault();
      next();
    }
  };

  const stepTitles = [
    'Tell us about you',
    'What do you need help with?',
    'How and when should we reach you?',
    'Review your details',
  ];

  const reviewRows: { step: number; label: string; value: ReactNode }[] = [
    { step: 0, label: 'Name', value: values.fullName },
    { step: 0, label: 'Email', value: values.email },
    { step: 0, label: 'Phone', value: `${values.countryCode} ${values.phone}` },
    { step: 0, label: 'City', value: values.city },
    { step: 0, label: 'I am a', value: optionLabel(roleOptions, values.role) },
    { step: 1, label: 'Services', value: values.services.map(serviceLabel).join(', ') },
    { step: 1, label: 'Education level', value: optionLabel(educationOptions, values.educationLevel) },
    { step: 1, label: 'Target', value: values.target || '—' },
    { step: 1, label: 'Timeline', value: optionLabel(timelineOptions, values.timeline) },
    { step: 2, label: 'Contact via', value: optionLabel(contactMethodOptions, values.contactMethod) },
    { step: 2, label: 'Preferred date', value: values.preferredDate || 'Any day' },
    { step: 2, label: 'Time slot', value: optionLabel(timeSlotOptions, values.timeSlot) },
    { step: 2, label: 'Message', value: values.message || '—' },
    { step: 2, label: 'Heard about us via', value: values.source ? optionLabel(sourceOptions, values.source) : '—' },
  ];

  return (
    <div className="rounded-[1.5rem] border border-line bg-white p-5 shadow-lift sm:p-8 lg:p-10">
      <Progress step={step} />

      <form
        id="consultation-form"
        action={submitAction}
        onSubmit={onSubmit}
        onBlur={onBlur}
        noValidate
        className="relative mt-8"
        aria-labelledby="consultation-step-title"
      >
        <Honeypot />
        <h2 id="consultation-step-title" ref={headingRef} tabIndex={-1} className="scroll-mt-40 text-h3 outline-none">
          {stepTitles[step]}
        </h2>

        {preselectedService && step === 0 && (
          <p
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-small text-purple-900"
            data-testid="preselected-service"
          >
            <Icon name={preselectedService.icon} size={16} className="text-purple-500" />
            Enquiring about <strong>{preselectedService.title}</strong>
          </p>
        )}

        <div className="mt-6">
          {step === 0 && (
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Full name"
                name="fullName"
                required
                autoComplete="name"
                value={values.fullName}
                onChange={(e) => set('fullName', e.target.value)}
                error={errors.fullName}
                className="sm:col-span-2"
              />
              <Input
                label="Email"
                name="email"
                type="email"
                required
                autoComplete="email"
                inputMode="email"
                value={values.email}
                onChange={(e) => set('email', e.target.value)}
                error={errors.email}
              />
              <Input
                label="City"
                name="city"
                required
                autoComplete="address-level2"
                value={values.city}
                onChange={(e) => set('city', e.target.value)}
                error={errors.city}
              />
              <div className="grid grid-cols-[minmax(0,9.5rem)_1fr] gap-3 sm:col-span-2">
                <Select
                  label="Country code"
                  name="countryCode"
                  required
                  autoComplete="tel-country-code"
                  options={countryCodes}
                  value={values.countryCode}
                  onChange={(e) => set('countryCode', e.target.value)}
                  error={errors.countryCode}
                />
                <Input
                  label="Phone number"
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel-national"
                  inputMode="tel"
                  value={values.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  error={errors.phone}
                  hint={values.countryCode === '+91' ? '10-digit mobile number' : undefined}
                />
              </div>
              <div className="sm:col-span-2">
                <ChoiceGroup
                  legend="I am a…"
                  name="role"
                  type="radio"
                  required
                  columns={3}
                  options={roleOptions}
                  value={values.role ? [values.role] : []}
                  onChange={(v) => set('role', v[0] ?? '')}
                  error={errors.role}
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-6">
              <ChoiceGroup
                legend="Which services are you interested in?"
                name="services"
                required
                options={[
                  ...services.map((s) => ({ value: s.slug, label: s.title })),
                  { value: 'not-sure', label: 'Not sure yet' },
                ]}
                value={values.services}
                onChange={(v) => set('services', v)}
                error={errors.services}
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <Select
                  label="Current education level"
                  name="educationLevel"
                  required
                  options={educationOptions}
                  placeholder="Select your level"
                  value={values.educationLevel}
                  onChange={(e) => set('educationLevel', e.target.value)}
                  error={errors.educationLevel}
                />
                <Select
                  label="Timeline"
                  name="timeline"
                  required
                  options={timelineOptions}
                  placeholder="When do you need support?"
                  value={values.timeline}
                  onChange={(e) => set('timeline', e.target.value)}
                  error={errors.timeline}
                />
              </div>
              <Input
                label="Target course, field or journal"
                name="target"
                value={values.target}
                onChange={(e) => set('target', e.target.value)}
                error={errors.target}
                hint="For example: B.Tech Computer Science, MBA, a career in data science, or an Elsevier journal."
              />
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-6">
              <ChoiceGroup
                legend="Preferred contact method"
                name="contactMethod"
                type="radio"
                required
                columns={3}
                options={contactMethodOptions}
                value={values.contactMethod ? [values.contactMethod] : []}
                onChange={(v) => set('contactMethod', v[0] ?? '')}
                error={errors.contactMethod}
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  label="Preferred date"
                  name="preferredDate"
                  type="date"
                  min={minDate}
                  value={values.preferredDate}
                  onChange={(e) => set('preferredDate', e.target.value)}
                  error={errors.preferredDate}
                />
                <Select
                  label="Preferred time slot"
                  name="timeSlot"
                  required
                  options={timeSlotOptions}
                  placeholder="Choose a time slot"
                  value={values.timeSlot}
                  onChange={(e) => set('timeSlot', e.target.value)}
                  error={errors.timeSlot}
                />
              </div>
              <Textarea
                label="Message"
                name="message"
                rows={4}
                value={values.message}
                onChange={(e) => set('message', e.target.value)}
                error={errors.message}
                hint="Anything that would help us prepare — deadlines, questions or concerns."
              />
              <Select
                label="How did you hear about us?"
                name="source"
                options={sourceOptions}
                placeholder="Select an option"
                value={values.source}
                onChange={(e) => set('source', e.target.value)}
              />
              <Checkbox
                name="consent"
                required
                label={<ConsentLabel />}
                checked={values.consent}
                onChange={(e) => set('consent', e.target.checked)}
                error={errors.consent}
              />
            </div>
          )}

          {step === REVIEW_STEP && (
            <div data-testid="consultation-review">
              <p className="text-muted">Please check your details before sending. You can edit any section.</p>
              {[0, 1, 2].map((s) => (
                <div key={s} className="mt-6 rounded-card border border-line">
                  <div className="flex items-center justify-between border-b border-line bg-surface px-5 py-3">
                    <h3 className="font-display font-semibold text-purple-900">{consultationSteps[s]?.title}</h3>
                    <button
                      type="button"
                      onClick={() => goTo(s)}
                      className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-small font-semibold text-purple-700 hover:bg-white"
                    >
                      <Icon name="pen" size={14} />
                      Edit<span className="sr-only"> {consultationSteps[s]?.title}</span>
                    </button>
                  </div>
                  <dl className="divide-y divide-line">
                    {reviewRows
                      .filter((r) => r.step === s)
                      .map((r) => (
                        <div key={r.label} className="grid gap-1 px-5 py-3 text-small sm:grid-cols-[11rem_1fr]">
                          <dt className="text-muted">{r.label}</dt>
                          <dd className="break-words font-medium text-ink">{r.value}</dd>
                        </div>
                      ))}
                  </dl>
                </div>
              ))}
              <div className="mt-6">
                <Turnstile />
              </div>
            </div>
          )}
        </div>

        {submitState.formError && step === REVIEW_STEP && (
          <div className="mt-6">
            <FormAlert>{submitState.formError}</FormAlert>
          </div>
        )}

        {step === REVIEW_STEP && submitState.status === 'fallback' && submitState.fallback ? (
          <div className="mt-8">
            <FallbackPanel fallback={submitState.fallback} onSent={finish} />
          </div>
        ) : (
          <div className="mt-10 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
            {step > 0 ? (
              <Button variant="ghost" onClick={() => goTo(step - 1)} icon="arrow-left">
                Back
              </Button>
            ) : (
              <span className="text-small text-muted">Takes about 2 minutes · Free, no obligation</span>
            )}
            {step < REVIEW_STEP ? (
              <Button type="submit" arrow>
                {step === 2 ? 'Review details' : 'Continue'}
              </Button>
            ) : (
              <SubmitButton pendingLabel="Sending request…">Confirm &amp; book consultation</SubmitButton>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
