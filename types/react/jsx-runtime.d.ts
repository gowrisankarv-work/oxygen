/* Minimal jsx-runtime declarations — see types/react/index.d.ts for context. */
declare module 'react/jsx-runtime' {
  export namespace JSX {
    type Element = globalThis.JSX.Element;
    type ElementType = globalThis.JSX.ElementType;
    interface ElementChildrenAttribute extends globalThis.JSX.ElementChildrenAttribute {}
    interface IntrinsicAttributes extends globalThis.JSX.IntrinsicAttributes {}
    interface IntrinsicElements extends globalThis.JSX.IntrinsicElements {}
  }
  export function jsx(type: unknown, props: unknown, key?: unknown): JSX.Element;
  export function jsxs(type: unknown, props: unknown, key?: unknown): JSX.Element;
  export const Fragment: unknown;
}
