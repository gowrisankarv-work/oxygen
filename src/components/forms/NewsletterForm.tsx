import { useId } from 'react';
import { newsletterSchema } from '@/lib/schemas';
import { Checkbox, FieldError } from '@/components/ui/Field';
import { ConsentLabel, FallbackPanel, FormAlert, Honeypot, SubmitButton } from './FormParts';
import { useFormEngine } from './useFormEngine';

/** Footer newsletter strip — email + consent, same submission abstraction as other forms. */
export function NewsletterForm() {
  const id = useId();
  const { state, formAction, errors, onBlurValidate, onInputClear, v, checked } = useFormEngine({
    schema: newsletterSchema,
    formType: 'newsletter',
    successMessage: { title: 'You are subscribed', description: 'Thank you! Look out for our next update.' },
  });

  if (state.status === 'fallback' && state.fallback) {
    return (
      <div className="text-ink">
        <FallbackPanel fallback={state.fallback} compact />
      </div>
    );
  }

  return (
    <form
      action={formAction}
      onBlur={onBlurValidate}
      onChange={onInputClear}
      noValidate
      className="relative w-full max-w-xl"
      aria-label="Newsletter sign-up"
    >
      <Honeypot />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex-1">
          <label htmlFor={`${id}-email`} className="sr-only">
            Email address
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="Your email address"
            defaultValue={v('email')}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? `${id}-email-error` : undefined}
            className="block min-h-12 w-full rounded-full border border-white/25 bg-white/10 px-5 py-3 text-white placeholder:text-white/80 focus:border-gold-400 focus:outline-none focus:ring-4 focus:ring-gold-400/20 aria-[invalid=true]:border-gold-400"
          />
        </div>
        <SubmitButton variant="gold" pendingLabel="Subscribing…">
          Subscribe
        </SubmitButton>
      </div>
      {/* Error sits below the row so it never pushes the Subscribe button while tapping it */}
      <div className="mt-1.5 px-2 [&_p]:text-gold-400">
        <FieldError id={`${id}-email-error`} message={errors.email} />
      </div>
      <Checkbox
        name="consent"
        id={`${id}-consent`}
        label={<span className="text-white/85 [&_a]:text-gold-400">{<ConsentLabel />}</span>}
        error={errors.consent}
        defaultChecked={checked('consent')}
        className="mt-3 [&_p]:text-gold-400"
      />
      {state.formError && (
        <div className="mt-3">
          <FormAlert>{state.formError}</FormAlert>
        </div>
      )}
    </form>
  );
}
