import type { ReactElement } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Nav,
  NavExpandable,
  NavItem,
  NavList,
  PageSidebar,
  PageSidebarBody,
} from '@patternfly/react-core';
import { AngleRightIcon } from '@patternfly/react-icons';

import { usePrototypeVersion } from '../demo/usePrototypeVersion';
import { riskUserWorkloadsViewPath, riskWorkloadsBasePath } from '../routePaths';
import NavigationItem from './NavigationItem';
import './NavigationSidebar.css';

function DisabledNavLabel({
  title,
  showChevron,
  badge,
}: {
  title: string;
  showChevron?: boolean;
  badge?: string;
}): ReactElement {
  return (
    <NavItem>
      <span className="acs-nav-disabled" aria-disabled="true">
        <span>
          {title}
          {badge ? (
            <>
              {' '}
              <span className="acs-nav-disabled__badge">{badge}</span>
            </>
          ) : null}
        </span>
        {showChevron && <AngleRightIcon className="acs-nav-disabled__chevron" />}
      </span>
    </NavItem>
  );
}

/**
 * Classic SoT MainPage nav labels, with non-Risk items blurred/disabled.
 * Risk stays expandable: Workloads (active) + Secrets (blurred).
 */
function NavigationSidebar(): ReactElement {
  const location = useLocation();
  const { version } = usePrototypeVersion();
  const riskActive =
    location.pathname === riskWorkloadsBasePath ||
    location.pathname.startsWith(`${riskWorkloadsBasePath}/`);

  const workloadsPath = (() => {
    const url = new URL(riskUserWorkloadsViewPath, window.location.origin);
    url.searchParams.set('prototype', version);
    return `${url.pathname}${url.search}`;
  })();

  return (
    <PageSidebar className="acs-nav-sidebar">
      <PageSidebarBody>
        <Nav aria-label="Primary">
          <NavList>
            <DisabledNavLabel title="Dashboard" />
            <DisabledNavLabel title="Network" showChevron />
            <DisabledNavLabel title="Violations" />
            <DisabledNavLabel title="Compliance" showChevron />
            <DisabledNavLabel title="Vulnerability Management" showChevron />
            <DisabledNavLabel title="Configuration Management" />

            <NavExpandable title="Risk" isActive={riskActive} isExpanded>
              <NavigationItem isActive={riskActive} path={workloadsPath} content="Workloads" />
              <NavItem>
                <span className="acs-nav-disabled" aria-disabled="true">
                  Secrets
                </span>
              </NavItem>
            </NavExpandable>

            <DisabledNavLabel title="Platform Configuration" showChevron />
          </NavList>
        </Nav>
      </PageSidebarBody>
    </PageSidebar>
  );
}

export default NavigationSidebar;
