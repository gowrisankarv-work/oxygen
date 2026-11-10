import type { ReactNode } from 'react';
import { Link } from '@/router/router';
import { cn } from '@/lib/cn';
import { Icon, type IconName } from '@/components/icons/Icon';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'light' | 'outline-light' | 'whatsapp' | 'gold';
export type ButtonSize = 'sm' | 'md' | 'lg';

const base =
  'group relative inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-full font-semibold whitespace-nowrap transition-[transform,box-shadow,background-color,color,border-color] duration-200 ease-premium active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-purple-700 text-white shadow-soft hover:bg-purple-900 hover:shadow-lift',
  secondary: 'border border-purple-700/25 bg-white text-purple-700 hover:border-purple-500 hover:bg-surface',
  ghost: 'text-purple-700 hover:bg-surface',
  light: 'bg-white text-purple-900 shadow-soft hover:bg-surface',
  'outline-light': 'border border-white/50 text-white hover:border-white hover:bg-white/10',
  whatsapp: 'bg-whatsapp-700 text-white shadow-soft hover:brightness-110',
  gold: 'bg-gold-400 text-purple-900 shadow-soft hover:brightness-105',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-small',
  md: 'px-6 py-3 text-[0.95rem]',
  lg: 'px-7 py-3.5 text-base',
};

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  /** Leading icon. */
  icon?: IconName;
  /** Shows a trailing arrow that slides on hover. */
  arrow?: boolean;
  className?: string;
  children?: ReactNode;
}

function Inner({ icon, arrow, variant, children }: Pick<CommonProps, 'icon' | 'arrow' | 'variant' | 'children'>) {
  return (
    <>
      {variant === 'primary' && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-white/20 blur-md motion-safe:animate-sheen"
        />
      )}
      {icon && <Icon name={icon} size={18} />}
      <span className="relative">{children}</span>
      {arrow && (
        <Icon
          name="arrow-right"
          size={18}
          className="relative transition-transform duration-200 ease-premium group-hover:translate-x-1"
        />
      )}
    </>
  );
}

export function buttonClasses({
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
}: Pick<CommonProps, 'variant' | 'size' | 'fullWidth' | 'className'>): string {
  return cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className);
}

export interface ButtonProps
  extends CommonProps, Omit<React.HTMLAttributes<HTMLButtonElement>, 'className' | 'children'> {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export function Button({
  variant = 'primary',
  size,
  fullWidth,
  icon,
  arrow,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={buttonClasses({ variant, size, fullWidth, className })} {...rest}>
      <Inner icon={icon} arrow={arrow} variant={variant}>
        {children}
      </Inner>
    </button>
  );
}

export interface ButtonLinkProps
  extends CommonProps, Omit<React.HTMLAttributes<HTMLAnchorElement>, 'className' | 'children' | 'href'> {
  /** Internal path ("/contact") or external URL ("https://…", "tel:", "mailto:"). */
  to: string;
  /** Opens in a new tab with rel="noopener noreferrer" (external links). */
  external?: boolean;
}

export function ButtonLink({
  to,
  external,
  variant = 'primary',
  size,
  fullWidth,
  icon,
  arrow,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  const cls = buttonClasses({ variant, size, fullWidth, className });
  const content = (
    <Inner icon={icon} arrow={arrow} variant={variant}>
      {children}
    </Inner>
  );
  if (external || /^(https?:|mailto:|tel:)/.test(to)) {
    const newTab = external ?? /^https?:/.test(to);
    return (
      <a href={to} className={cls} {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <Link to={to} className={cls} {...rest}>
      {content}
    </Link>
  );
}
