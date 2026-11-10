/**
 * Global "Enquire Now" modal. Any element with `data-enquire` opens it (event delegation),
 * optionally pre-selecting a service with `data-service="publication-services"`.
 * Components can also call useEnquiry().open(service).
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { getService } from '@/content/services';
import { useLocation } from '@/router/router';
import { QuickEnquiry } from './QuickEnquiry';

interface EnquiryApi {
  open: (service?: string) => void;
}

const EnquiryContext = createContext<EnquiryApi>({ open: () => undefined });
export const useEnquiry = (): EnquiryApi => useContext(EnquiryContext);

export function EnquiryProvider({ children }: { children?: ReactNode }) {
  const [state, setState] = useState<{ open: boolean; service?: string }>({ open: false });
  const { pathname } = useLocation();
  const open = useCallback((service?: string) => setState({ open: true, service }), []);
  const close = useCallback(() => setState((s) => ({ ...s, open: false })), []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.('[data-enquire]');
      if (!el) return;
      e.preventDefault();
      open(el.getAttribute('data-service') ?? undefined);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [open]);

  // Close on navigation
  useEffect(() => close(), [pathname, close]);

  const api = useMemo(() => ({ open }), [open]);
  const service = state.service ? getService(state.service) : undefined;

  return (
    <EnquiryContext.Provider value={api}>
      {children}
      <Dialog
        open={state.open}
        onClose={close}
        title={service ? `Enquire about ${service.title}` : 'Enquire now'}
        description="Leave your details and an expert will call you back — usually within one working day."
      >
        {state.open && <QuickEnquiry service={state.service} source={`Enquiry modal (${pathname})`} onDone={close} />}
      </Dialog>
    </EnquiryContext.Provider>
  );
}
