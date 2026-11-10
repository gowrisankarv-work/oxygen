declare module 'react-dom/server' {
  export function renderToString(element: React.ReactNode, options?: { identifierPrefix?: string }): string;
  export function renderToStaticMarkup(element: React.ReactNode, options?: { identifierPrefix?: string }): string;
}
