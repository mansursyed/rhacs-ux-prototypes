import type { ReactElement } from 'react';
import logoUrl from '../images/RHACS-Logo.svg';

/** Ported from stackrox BrandLogo — let MastheadLogo size the SVG like staging. */
function BrandLogo(): ReactElement {
  return (
    <img
      src={logoUrl}
      alt="Red Hat Advanced Cluster Security Logo"
      style={{ display: 'block', width: 'auto', height: '100%', maxHeight: '36px' }}
    />
  );
}

export default BrandLogo;
