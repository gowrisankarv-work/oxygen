/**
 * Accessible form field primitives.
 * Each field wires label ↔ control (htmlFor/id), hint + error via aria-describedby,
 * and aria-invalid when there is an error. Errors are announced (role="alert" on change).
 */
import { useId } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/icons/Icon';

export const controlClass =
  'block w-full rounded-input border border-line bg-white px-4 py-3 text-base text-ink shadow-[inset_0_1px_2px_rgb(23_20_43/0.04)] transition-[border-color,box-shadow] duration-200 placeholder:text-muted/80 hover:border-purple-500/40 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/15 aria-[invalid=true]:border-error-600 aria-[invalid=true]:ring-error-600/10 disabled:bg-surface';

interface FieldShellProps {
  id: string;
  label: ReactNode;
  required?: boolean;
  hint?: ReactNode;
  error?: string;
  className?: string;
  children: ReactNode;
  /** Visually hide the label (still read by screen readers). */
  hideLabel?: boolean;
}

export function FieldShell({ id, label, required, hint, error, className, children, hideLabel }: FieldShellProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className={cn('text-small font-semibold text-purple-900', hideLabel && 'sr-only')}>
        {label}
        {required ? (
          <span className="text-error-600" aria-hidden="true">
            {' '}
            *
          </span>
        ) : (
          <span className="font-normal text-muted"> (optional)</span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-small text-muted">
          {hint}
        </p>
      )}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <p
      id={id}
      className={cn('flex items-start gap-1.5 text-small font-medium text-error-600', !message && 'hidden')}
      role={message ? 'alert' : undefined}
    >
      {message && <Icon name="alert" size={16} className="mt-0.5" />}
      {message}
    </p>
  );
}

function describedBy(id: string, hint?: ReactNode, error?: string): string | undefined {
  const ids = [error ? `${id}-error` : '', hint && !error ? `${id}-hint` : ''].filter(Boolean);
  return ids.length ? ids.join(' ') : undefined;
}

type Common = {
  label: ReactNode;
  name: string;
  required?: boolean;
  hint?: ReactNode;
  error?: string;
  className?: string;
  hideLabel?: boolean;
  id?: string;
};

export type InputProps = Common &
  Omit<React.HTMLAttributes<HTMLInputElement>, 'className' | 'id' | 'name' | 'required'> & {
    type?: 'text' | 'email' | 'tel' | 'date' | 'search' | 'url' | 'number';
  };

export function Input({
  label,
  name,
  required,
  hint,
  error,
  className,
  hideLabel,
  id: idProp,
  type = 'text',
  ...rest
}: InputProps) {
  const auto = useId();
  const id = idProp ?? `${name}-${auto}`;
  return (
    <FieldShell
      id={id}
      label={label}
      required={required}
      hint={hint}
      error={error}
      className={className}
      hideLabel={hideLabel}
    >
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={controlClass}
        {...rest}
      />
    </FieldShell>
  );
}

export type TextareaProps = Common &
  Omit<React.HTMLAttributes<HTMLTextAreaElement>, 'className' | 'id' | 'name' | 'required'>;

export function Textarea({
  label,
  name,
  required,
  hint,
  error,
  className,
  hideLabel,
  id: idProp,
  rows = 4,
  ...rest
}: TextareaProps) {
  const auto = useId();
  const id = idProp ?? `${name}-${auto}`;
  return (
    <FieldShell
      id={id}
      label={label}
      required={required}
      hint={hint}
      error={error}
      className={className}
      hideLabel={hideLabel}
    >
      <textarea
        id={id}
        name={name}
        rows={rows}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(controlClass, 'min-h-28 resize-y')}
        {...rest}
      />
    </FieldShell>
  );
}

export interface SelectOption {
  value: string;
  label: string;
}

export type SelectProps = Common &
  Omit<React.HTMLAttributes<HTMLSelectElement>, 'className' | 'id' | 'name' | 'required'> & {
    options: SelectOption[];
    placeholder?: string;
  };

export function Select({
  label,
  name,
  required,
  hint,
  error,
  className,
  hideLabel,
  id: idProp,
  options,
  placeholder,
  ...rest
}: SelectProps) {
  const auto = useId();
  const id = idProp ?? `${name}-${auto}`;
  return (
    <FieldShell
      id={id}
      label={label}
      required={required}
      hint={hint}
      error={error}
      className={className}
      hideLabel={hideLabel}
    >
      <div className="relative">
        <select
          id={id}
          name={name}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, hint, error)}
          className={cn(controlClass, 'appearance-none pr-11')}
          {...rest}
        >
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <Icon
          name="chevron-down"
          size={18}
          className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-purple-700"
        />
      </div>
    </FieldShell>
  );
}

export interface CheckboxProps extends Omit<
  React.HTMLAttributes<HTMLInputElement>,
  'className' | 'id' | 'name' | 'required'
> {
  name: string;
  label: ReactNode;
  required?: boolean;
  error?: string;
  className?: string;
  id?: string;
}

export function Checkbox({ name, label, required, error, className, id: idProp, ...rest }: CheckboxProps) {
  const auto = useId();
  const id = idProp ?? `${name}-${auto}`;
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="flex items-start gap-3">
        <input
          id={id}
          name={name}
          type="checkbox"
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-1 size-5 shrink-0 cursor-pointer rounded border-line accent-purple-700"
          {...rest}
        />
        <label htmlFor={id} className="cursor-pointer text-small text-ink">
          {label}
        </label>
      </div>
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

/** Group of checkboxes / radios with a legend (fieldset). */
export function ChoiceGroup({
  legend,
  name,
  options,
  type = 'checkbox',
  value,
  onChange,
  error,
  required,
  columns = 2,
}: {
  legend: ReactNode;
  name: string;
  options: SelectOption[];
  type?: 'checkbox' | 'radio';
  value: string[];
  onChange: (next: string[]) => void;
  error?: string;
  required?: boolean;
  columns?: 1 | 2 | 3;
}) {
  const auto = useId();
  const errId = `${name}-${auto}-error`;
  return (
    <fieldset aria-describedby={error ? errId : undefined}>
      <legend className="mb-2 text-small font-semibold text-purple-900">
        {legend}
        {required ? (
          <span className="text-error-600" aria-hidden="true">
            {' '}
            *
          </span>
        ) : (
          <span className="font-normal text-muted"> (optional)</span>
        )}
      </legend>
      <div className={cn('grid gap-2.5', columns === 2 && 'sm:grid-cols-2', columns === 3 && 'sm:grid-cols-3')}>
        {options.map((o) => {
          const checked = value.includes(o.value);
          const id = `${name}-${auto}-${o.value}`;
          return (
            <label
              key={o.value}
              htmlFor={id}
              className={cn(
                'flex min-h-12 cursor-pointer items-center gap-3 rounded-input border px-4 py-2.5 text-small font-medium transition-colors',
                checked
                  ? 'border-purple-500 bg-surface text-purple-900'
                  : 'border-line bg-white text-ink hover:border-purple-500/40',
              )}
            >
              <input
                id={id}
                type={type}
                name={name}
                value={o.value}
                checked={checked}
                onChange={(e) => {
                  if (type === 'radio') onChange([o.value]);
                  else onChange(e.target.checked ? [...value, o.value] : value.filter((v) => v !== o.value));
                }}
                className="size-4.5 shrink-0 accent-purple-700"
              />
              {o.label}
            </label>
          );
        })}
      </div>
      <FieldError id={errId} message={error} />
    </fieldset>
  );
}
