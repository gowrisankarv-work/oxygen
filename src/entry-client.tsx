/**
 * Client entry — hydrates prerendered HTML (production) or renders from scratch (dev server).
 * The initial route's lazy chunk is loaded *before* hydrating so the first client render
 * matches the server HTML exactly (no hydration mismatch).
 */
import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from '@/app/App';
import { routes } from '@/router/routes';
import { matchRoute } from '@/router/paths';
import { loadRoute } from '@/router/router';

async function start(): Promise<void> {
  const container = document.getElementById('root');
  if (!container) return;
  const url = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  const match = matchRoute(routes, window.location.pathname);
  await loadRoute(match.route);

  if (container.hasChildNodes()) {
    hydrateRoot(container, <App url={url} />, {
      onRecoverableError(error) {
        console.error('[hydration]', error);
      },
    });
  } else {
    createRoot(container).render(<App url={url} />);
  }
  window.__OXYGEN_HYDRATED__ = true;
  document.documentElement.dataset.hydrated = 'true';

  if (__ENV__.DEV) void import('@/lib/placeholders').then((m) => m.reportPlaceholdersInDev());
}

void start();
