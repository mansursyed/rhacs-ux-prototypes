import type { PrototypeId } from '../types';
import manifest from '../mocks/manifest.json';

export const STORAGE_KEY = 'risk-lightspeed.prototype';

export type PrototypeMeta = {
  id: PrototypeId;
  label: string;
  description: string;
};

const PROTOTYPE_IDS: PrototypeId[] = ['baseline', 'v1', 'v2'];

export const prototypes = manifest.prototypes as PrototypeMeta[];

export function isPrototypeId(value: string | null | undefined): value is PrototypeId {
  return typeof value === 'string' && (PROTOTYPE_IDS as string[]).includes(value);
}

export function getInitialPrototypeId(): PrototypeId {
  if (typeof window === 'undefined') {
    return 'v1';
  }
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get('prototype');
  if (isPrototypeId(fromUrl)) {
    return fromUrl;
  }
  const fromStorage = localStorage.getItem(STORAGE_KEY);
  if (isPrototypeId(fromStorage)) {
    return fromStorage;
  }
  return isPrototypeId(manifest.default) ? manifest.default : 'baseline';
}
