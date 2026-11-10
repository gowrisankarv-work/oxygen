import { RouterProvider } from '@/router/router';
import { routes } from '@/router/routes';
import { Layout } from './Layout';

export interface AppProps {
  /** Initial URL (pathname + search + hash). */
  url: string;
}

/** Root component shared by the server prerender and client hydration. */
export function App({ url }: AppProps) {
  return (
    <RouterProvider routes={routes} url={url}>
      <Layout />
    </RouterProvider>
  );
}
