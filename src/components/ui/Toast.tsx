/**
 * Toast notifications: a small context + an aria-live="polite" region.
 * Usage: const toast = useToast(); toast.show({ title: 'Sent', tone: 'success' })
 */
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/icons/Icon';

export interface ToastInput {
  title: string;
  description?: string;
  tone?: 'success' | 'error' | 'info';
  durationMs?: number;
}

interface ToastItem extends ToastInput {
  id: number;
}

interface ToastApi {
  show: (t: ToastInput) => void;
}

const ToastContext = createContext<ToastApi>({ show: () => undefined });

export const useToast = (): ToastApi => useContext(ToastContext);

export function ToastProvider({ children }: { children?: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => setItems((list) => list.filter((t) => t.id !== id)), []);

  const show = useCallback(
    (t: ToastInput) => {
      const id = nextId.current++;
      setItems((list) => [...list.slice(-2), { ...t, id }]);
      window.setTimeout(() => dismiss(id), t.durationMs ?? 6000);
    },
    [dismiss],
  );

  const api = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-4 top-20 z-[70] flex flex-col items-center gap-3 sm:inset-x-auto sm:right-6 sm:items-end lg:top-28"
      >
        {items.map((t) => (
          <div
            key={t.id}
            role={t.tone === 'error' ? 'alert' : 'status'}
            className={cn(
              'pop-in pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-card border bg-white p-4 shadow-lift',
              t.tone === 'error' ? 'border-error-600/30' : 'border-line',
            )}
          >
            <Icon
              name={t.tone === 'error' ? 'alert' : t.tone === 'info' ? 'info' : 'check-circle'}
              size={22}
              className={
                t.tone === 'error' ? 'text-error-600' : t.tone === 'info' ? 'text-blue-600' : 'text-success-700'
              }
            />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-purple-900">{t.title}</p>
              {t.description && <p className="mt-0.5 text-small text-muted">{t.description}</p>}
            </div>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className="-m-1.5 grid size-9 place-items-center rounded-full text-muted hover:bg-surface"
              aria-label="Dismiss notification"
            >
              <Icon name="close" size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
