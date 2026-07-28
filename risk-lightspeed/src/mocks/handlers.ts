import { http, HttpResponse } from 'msw';
import type { JsonBodyType } from 'msw';
import { getFixture, listDeploymentIds } from './loadFixtures';
import type { PrototypeId } from '../types';

let activeVersion: PrototypeId = 'v1';

if (typeof window !== 'undefined') {
  window.addEventListener('prototype-changed', ((event: CustomEvent<PrototypeId>) => {
    activeVersion = event.detail;
  }) as EventListener);
}

export function setActiveMockVersion(version: PrototypeId) {
  activeVersion = version;
}

function json(body: unknown) {
  return HttpResponse.json(body as JsonBodyType);
}

export const handlers = [
  http.get('/v1/auth/status', () => json(getFixture(activeVersion, 'auth-status.json'))),
  http.get('/v1/mypermissions', () => json(getFixture(activeVersion, 'mypermissions.json'))),
  http.get('/v1/metadata', () => json(getFixture(activeVersion, 'metadata.json'))),
  http.get('/v1/featureflags', () => json({ featureFlags: [] })),
  http.get('/v1/deploymentscount', () =>
    json(getFixture(activeVersion, 'deployments-count.json'))
  ),
  http.get('/v1/deploymentswithprocessinfo', () =>
    json(getFixture(activeVersion, 'deployments-list.json'))
  ),
  http.get('/v1/deploymentswithrisk/:id', ({ params }) => {
    const id = String(params.id);
    try {
      return json(getFixture(activeVersion, `deployments-with-risk/${id}.json`));
    } catch {
      const fallbackId = listDeploymentIds(activeVersion)[0];
      return json(getFixture(activeVersion, `deployments-with-risk/${fallbackId}.json`));
    }
  }),
  http.get('/v1/deployments/:id', ({ params }) => {
    const id = String(params.id);
    try {
      const data = getFixture(activeVersion, `deployments-with-risk/${id}.json`) as {
        deployment: unknown;
      };
      return json(data.deployment);
    } catch {
      return HttpResponse.json({ error: 'not found' }, { status: 404 });
    }
  }),
  http.get(/\/v1\/.*/, () => json({})),
  http.get(/\/v2\/.*/, () => json({})),
  http.post(/\/v1\/.*/, () => json({})),
];
