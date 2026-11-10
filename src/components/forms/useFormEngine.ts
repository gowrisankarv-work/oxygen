/**
 * Shared engine for single-step forms (contact, quick enquiry, newsletter):
 * React 19 `useActionState` + Zod validation, blur validation, honeypot + timing checks,
 * optional Turnstile token, and submitForm() with mailto/WhatsApp fallback.
 */
import { useActionState, useCallback, useEffect, useRef, useState } from 'react';
import type { FocusEvent, FormEvent } from 'react';
import type { z } from 'zod';
import {
  HONEYPOT_FIELD,
  spamCheck,
  submitForm,
  type FormPayload,
  type FormType,
  type SubmitResult,
} from '@/lib/submitForm';
import { toFieldErrors, type FieldErrors } from '@/lib/schemas';
import { useToast } from '@/components/ui/Toast';

export type FallbackResult = Extract<SubmitResult, { status: 'fallback' }>;

export interface FormState {
  status: 'idle' | 'error' | 'success' | 'fallback';
  errors: FieldErrors;
  values: Record<string, string | boolean>;
  formError?: string;
  fallback?: FallbackResult;
  /** Increments on each submit so effects can react even when status repeats. */
  attempt: number;
}

const initialState: FormState = { status: 'idle', errors: {}, values: {}, attempt: 0 };

/** Reads FormData into plain values. Checkboxes become booleans. */
export function readForm(formData: FormData, checkboxes: string[] = ['consent']): Record<string, string | boolean> {
  const out: Record<string, string | boolean> = {};
  formData.forEach((value, key) => {
    if (typeof value === 'string') out[key] = value;
  });
  for (const c of checkboxes) out[c] = formData.get(c) === 'on' || formData.get(c) === 'true';
  return out;
}

export interface UseFormEngineOptions<S extends z.ZodTypeAny> {
  schema: S;
  formType: FormType;
  /** Extra non-field context added to the payload (e.g. page, preselected service). */
  context?: Record<string, string>;
  successMessage: { title: string; description?: string };
  onSuccess?: () => void;
  checkboxes?: string[];
}

export function useFormEngine<S extends z.ZodTypeAny>({
  schema,
  formType,
  context,
  successMessage,
  onSuccess,
  checkboxes,
}: UseFormEngineOptions<S>) {
  const toast = useToast();
  const startedAt = useRef(Date.now());
  const [blurErrors, setBlurErrors] = useState<FieldErrors>({});

  const action = useCallback(
    async (prev: FormState, formData: FormData): Promise<FormState> => {
      const values = readForm(formData, checkboxes);
      const attempt = prev.attempt + 1;
      const verdict = spamCheck(String(values[HONEYPOT_FIELD] ?? ''), startedAt.current);
      delete values[HONEYPOT_FIELD];
      if (verdict === 'bot') return { status: 'success', errors: {}, values: {}, attempt };
      if (verdict === 'too-fast') {
        return {
          status: 'error',
          errors: {},
          values,
          attempt,
          formError: 'That was quick! Please take a moment to check your details, then submit again.',
        };
      }
      const parsed = schema.safeParse(values);
      if (!parsed.success) return { status: 'error', errors: toFieldErrors(parsed.error), values, attempt };

      const token = formData.get('cf-turnstile-response');
      const payload: FormPayload = { ...(parsed.data as FormPayload), ...context };
      if (typeof token === 'string' && token) payload['cf-turnstile-response'] = token;
      const result = await submitForm(payload, formType);
      if (result.status === 'success') return { status: 'success', errors: {}, values: {}, attempt };
      return { status: 'fallback', errors: {}, values, fallback: result, attempt };
    },
    [schema, formType, context, checkboxes],
  );

  const [state, formAction, pending] = useActionState(action, initialState);

  // Side effects after each submission attempt
  useEffect(() => {
    if (state.attempt === 0) return;
    if (state.status === 'success') {
      setBlurErrors({});
      startedAt.current = Date.now();
      toast.show({ title: successMessage.title, description: successMessage.description, tone: 'success' });
      onSuccess?.();
    } else if (state.status === 'error' && Object.keys(state.errors).length) {
      setBlurErrors(state.errors);
      // Move focus to the first invalid field
      requestAnimationFrame(() => {
        document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      });
    } else if (state.status === 'fallback' && state.fallback?.reason === 'error') {
      toast.show({
        title: 'We could not send your message',
        description: 'Please use the email or WhatsApp option below instead.',
        tone: 'error',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.attempt]);

  /** Validates a single field against the schema using the form's current values. */
  const fieldError = useCallback(
    (form: HTMLFormElement, name: string): string | undefined => {
      const parsed = schema.safeParse(readForm(new FormData(form), checkboxes));
      return parsed.success ? undefined : toFieldErrors(parsed.error)[name];
    },
    [schema, checkboxes],
  );

  /**
   * On blur: show an error for a field the user has filled in incorrectly.
   * Errors are only ADDED here — clearing happens while typing (onInputClear), so the
   * layout never shifts under the pointer as focus moves to the next control.
   */
  const onBlurValidate = useCallback(
    (e: FocusEvent<HTMLFormElement>) => {
      const target = e.target as HTMLInputElement;
      const name = target.name;
      if (!name || name === HONEYPOT_FIELD || target.type === 'checkbox') return;
      // Focus is moving to the submit button: submitting validates everything anyway, and
      // showing an error now would shift the button away from the pointer mid-click.
      const next = e.relatedTarget as HTMLElement | null;
      if (next && next.getAttribute('type') === 'submit' && e.currentTarget.contains(next)) return;
      if (target.value.trim() === '') return; // don't nag about untouched empty fields
      const message = fieldError(e.currentTarget, name);
      if (message) setBlurErrors((prev) => (prev[name] === message ? prev : { ...prev, [name]: message }));
    },
    [fieldError],
  );

  /** On input/change: remove a field's error as soon as its value becomes valid. */
  const onInputClear = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      const name = (e.target as HTMLInputElement).name;
      if (!name) return;
      // Read everything synchronously: React clears e.currentTarget after the handler returns,
      // and the state updater below may run later.
      const stillInvalid = Boolean(fieldError(e.currentTarget, name));
      setBlurErrors((prev) => {
        if (!prev[name] || stillInvalid) return prev;
        const next = { ...prev };
        delete next[name];
        return next;
      });
    },
    [fieldError],
  );

  return {
    state,
    formAction,
    pending,
    errors: blurErrors,
    onBlurValidate,
    onInputClear,
    /** Default values to restore after React resets the form on submit. */
    v: (key: string) => (typeof state.values[key] === 'string' ? (state.values[key] as string) : undefined),
    checked: (key: string) => state.values[key] === true,
  };
}
