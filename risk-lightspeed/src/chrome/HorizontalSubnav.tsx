import type { ReactElement } from 'react';
import { useLocation } from 'react-router-dom';
import { Nav } from '@patternfly/react-core';

import RiskSubnav from '../Containers/Risk/RiskSubnav';
import { riskWorkloadsBasePath } from '../routePaths';
import './HorizontalSubnav.css';

/** Ported from stackrox HorizontalSubnav — Risk only for this prototype. */
function HorizontalSubnav(): ReactElement | null {
  const { pathname } = useLocation();
  const showRisk =
    pathname === riskWorkloadsBasePath || pathname.startsWith(`${riskWorkloadsBasePath}/`);

  if (!showRisk) {
    return null;
  }

  return (
    <Nav variant="horizontal-subnav" className="acs-pf-horizontal-subnav" aria-label="Risk">
      <RiskSubnav />
    </Nav>
  );
}

export default HorizontalSubnav;
