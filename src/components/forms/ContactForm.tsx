import { useMemo } from 'react';
import { contactSchema } from '@/lib/schemas';
import { serviceOptions } from '@/content/services';
import { useNavigate } from '@/router/router';
import { Checkbox, Input, Select, Textarea } from '@/components/ui/Field';
import { ConsentLabel, FallbackPanel, FormAlert, Honeypot, SubmitButton, Turnstile } from './FormParts';
import { useFormEngine } from './useFormEngine';

/** Contact page form. On success → /thank-you. Unconfigured provider → email/WhatsApp fallback. */
export function ContactForm() {
  const navigate = useNavigate();
  const context = useMemo(() => ({ page: 'Contact page' }), []);
  const { state, formAction, errors, onBlurValidate, onInputClear, v, checked } = useFormEngine({
    schema: contactSchema,
    formType: 'contact',
    context,
    successMessage: { title: 'Message sent', description: 'Thank you — we will be in touch soon.' },
    onSuccess: () => void navigate('/thank-you?from=contact'),
  });

  return (
    <form
      action={formAction}
      onBlur={onBlurValidate}
      onChange={onInputClear}
      noValidate
      className="relative space-y-5"
      aria-label="Contact form"
    >
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Full name"
          name="name"
          required
          autoComplete="name"
          defaultValue={v('name')}
          error={errors.name}
        />
        <Input
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          defaultValue={v('email')}
          error={errors.email}
        />
        <Input
          label="Phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          defaultValue={v('phone')}
          error={errors.phone}
          hint="Include your country code if outside India."
        />
        <Select
          label="Service of interest"
          name="service"
          options={[...serviceOptions, { value: 'not-sure', label: 'Not sure yet' }]}
          placeholder="Choose a service"
          defaultValue={v('service') ?? ''}
          error={errors.service}
        />
      </div>
      <Textarea
        label="Your message"
        name="message"
        required
        rows={5}
        defaultValue={v('message')}
        error={errors.message}
      />
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
        <FallbackPanel fallback={state.fallback} onSent={() => void navigate('/thank-you?from=contact&via=direct')} />
      ) : (
        <SubmitButton>Send message</SubmitButton>
      )}
    </form>
  );
}
