declare module 'react-dom/client' {
  export interface RootOptions {
    onRecoverableError?: (error: unknown, info: { componentStack?: string }) => void;
    onUncaughtError?: (error: unknown, info: { componentStack?: string }) => void;
    onCaughtError?: (error: unknown, info: { componentStack?: string }) => void;
    identifierPrefix?: string;
  }
  export interface Root {
    render(children: React.ReactNode): void;
    unmount(): void;
  }
  export function createRoot(container: Element | DocumentFragment, options?: RootOptions): Root;
  export function hydrateRoot(
    container: Element | Document,
    initialChildren: React.ReactNode,
    options?: RootOptions,
  ): Root;
}
