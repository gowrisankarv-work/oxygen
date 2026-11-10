declare module 'react-dom' {
  /* Minimal react-dom declarations — see types/react/index.d.ts for context. */
  export interface FormStatus {
    pending: boolean;
    data: FormData | null;
    method: string | null;
    action: string | ((formData: FormData) => void | Promise<void>) | null;
  }
  export function useFormStatus(): FormStatus;
  export function createPortal(children: React.ReactNode, container: Element | DocumentFragment): React.ReactElement;
  export function flushSync<R>(fn: () => R): R;
  export function preload(href: string, options: { as: string; fetchPriority?: 'high' | 'low' | 'auto' }): void;
  export function preconnect(href: string, options?: { crossOrigin?: string }): void;
}
