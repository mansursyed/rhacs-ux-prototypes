import type { PrototypeId } from '../types';

const baseModules = import.meta.glob('./data/base/**/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>;

const v2Modules = import.meta.glob('./data/variants/v2/**/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>;

function normalizeKey(path: string, prefix: string): string {
  return path.replace(prefix, '').replace(/^\//, '');
}

function buildMap(modules: Record<string, unknown>, prefix: string) {
  const map = new Map<string, unknown>();
  for (const [path, value] of Object.entries(modules)) {
    map.set(normalizeKey(path, prefix), value);
  }
  return map;
}

const baseMap = buildMap(baseModules, './data/base/');
const v2Map = buildMap(v2Modules, './data/variants/v2/');

export function getFixture(version: PrototypeId, relativePath: string): unknown {
  if (version === 'v2') {
    const override = v2Map.get(relativePath);
    if (override !== undefined) {
      return override;
    }
  }
  // baseline and v1 share the same fixture data; UI differs by version flag
  const base = baseMap.get(relativePath);
  if (base === undefined) {
    throw new Error(`Missing fixture: ${relativePath}`);
  }
  return base;
}

export function listDeploymentIds(version: PrototypeId): string[] {
  const list = getFixture(version, 'deployments-list.json') as {
    deployments: Array<{ deployment: { id: string } }>;
  };
  return list.deployments.map((d) => d.deployment.id);
}
