import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { PrototypeId } from '../types';
import { setActiveMockVersion } from '../mocks/handlers';
import {
  STORAGE_KEY,
  getInitialPrototypeId,
  isPrototypeId,
  prototypes,
} from './prototypeVersion';

export type { PrototypeMeta } from './prototypeVersion';
export { getInitialPrototypeId } from './prototypeVersion';

export function usePrototypeVersion() {
  const [searchParams, setSearchParams] = useSearchParams();

  const version = useMemo<PrototypeId>(() => {
    const fromUrl = searchParams.get('prototype');
    if (isPrototypeId(fromUrl)) {
      return fromUrl;
    }
    const fromStorage = localStorage.getItem(STORAGE_KEY);
    if (isPrototypeId(fromStorage)) {
      return fromStorage;
    }
    return getInitialPrototypeId();
  }, [searchParams]);

  const setVersion = useCallback(
    (next: PrototypeId) => {
      localStorage.setItem(STORAGE_KEY, next);
      setActiveMockVersion(next);
      const params = new URLSearchParams(searchParams);
      params.set('prototype', next);
      setSearchParams(params, { replace: true });
      window.dispatchEvent(new CustomEvent('prototype-changed', { detail: next }));
    },
    [searchParams, setSearchParams]
  );

  const meta = prototypes.find((p) => p.id === version) ?? prototypes[0];
  const showLightspeed = version === 'v1' || version === 'v2';

  return {
    version,
    setVersion,
    meta,
    prototypes,
    showLightspeed,
  };
}
