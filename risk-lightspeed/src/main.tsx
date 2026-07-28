import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './css.imports';
import App from './App';
import './styles.css';
import { setActiveMockVersion } from './mocks/handlers';
import { getInitialPrototypeId } from './demo/prototypeVersion';

// Match SoT light theme (useTheme adds theme-light on html)
document.documentElement.classList.add('theme-light');
document.documentElement.classList.remove('theme-dark', 'pf-v6-theme-dark');

async function enableMocking() {
  const { worker } = await import('./mocks/browser');
  setActiveMockVersion(getInitialPrototypeId());
  return worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
    },
  });
}

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

function ensureDefaultQuery() {
  const url = new URL(window.location.href);
  let changed = false;
  if (!url.searchParams.get('prototype')) {
    url.searchParams.set('prototype', 'baseline');
    changed = true;
  }
  // Classic Risk default workflow view on workloads list / detail
  if (
    url.pathname.includes('/main/risk/workloads') &&
    !url.searchParams.get('filteredWorkflowView')
  ) {
    url.searchParams.set('filteredWorkflowView', 'Applications view');
    changed = true;
  }
  if (changed) {
    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  }
}

function renderApp() {
  ensureDefaultQuery();
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter basename={basename}>
        <App />
      </BrowserRouter>
    </StrictMode>
  );
}

enableMocking()
  .then(renderApp)
  .catch((error) => {
    console.error('Failed to start mock service worker', error);
    renderApp();
  });
