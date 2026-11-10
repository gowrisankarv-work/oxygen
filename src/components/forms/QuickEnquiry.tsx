import { useMemo } from 'react';
import { quickEnquirySchema } from '@/lib/schemas';
import { serviceOptions } from '@/content/services';
import { useNavigate } from '@/router/router';
import { Checkbox, Input, Select, Textarea } from '@/components/ui/Field';
import { ConsentLabel, FallbackPanel, FormAlert, Honeypot, SubmitButton, Turnstile } from './FormParts';
import { useFormEngine } from './useFormEngine';

export interface QuickEnquiryProps {
  /** Pre-selected service slug. */
  service?: string;
  /** Where the enquiry was made (included in the submission). */
  source: string;
  onDone?: () => void;
  compact?: boolean;
}

/** Short enquiry form for service-page sidebars and the "Enquire Now" modal. */
export function QuickEnquiry({ service, source, onDone, compact }: QuickEnquiryProps) {
  const navigate = useNavigate();
  const context = useMemo(() => ({ page: source }), [source]);
  const finish = () => {
    onDone?.();
    void navigate('/thank-you?from=enquiry');
  };
  const { state, formAction, errors, onBlurValidate, onInputClear, v, checked } = useFormEngine({
    schema: quickEnquirySchema,
    formType: 'quick-enquiry',
    context,
    successMessage: { title: 'Enquiry sent', description: 'We will call you back soon.' },
    onSuccess: finish,
  });

  return (
    <form
      action={formAction}
      onBlur={onBlurValidate}
      onChange={onInputClear}
      noValidate
      className="relative space-y-4"
      aria-label="Quick enquiry form"
    >
      <Honeypot />
      <Input label="Name" name="name" required autoComplete="name" defaultValue={v('name')} error={errors.name} />
      <Input
        label="Phone"
        name="phone"
        type="tel"
        required
        autoComplete="tel"
        inputMode="tel"
        defaultValue={v('phone')}
        error={errors.phone}
      />
      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        defaultValue={v('email')}
        error={errors.email}
      />
      <Select
        label="Service"
        name="service"
        required
        options={[...serviceOptions, { value: 'not-sure', label: 'Not sure yet' }]}
        placeholder="Choose a service"
        defaultValue={v('service') ?? service ?? ''}
        error={errors.service}
      />
      {!compact && (
        <Textarea label="Message" name="message" rows={3} defaultValue={v('message')} error={errors.message} />
      )}
      <Checkbox
        name="consent"
        label={<ConsentLabel />}
        required
        error={errors.consent}
        defaultChecked={checked('consent')}
      />
      <Turnstile />
      {state.formError && <FormAlert>{state.formError}</FormAlert>}
      {state.status === 'fallback' && state.fallback ? (
        <FallbackPanel fallback={state.fallback} compact onSent={finish} />
      ) : (
        <SubmitButton fullWidth>Request a call back</SubmitButton>
      )}
    </form>
  );
}
