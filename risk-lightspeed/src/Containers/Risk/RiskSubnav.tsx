import { NavList } from '@patternfly/react-core';
import { useSearchParams } from 'react-router-dom';

import NavigationItem from '../../chrome/NavigationItem';
import {
  riskFullViewPath,
  riskPlatformViewPath,
  riskUserWorkloadsViewPath,
} from '../../routePaths';
import { usePrototypeVersion } from '../../demo/usePrototypeVersion';

/** Ported from stackrox Containers/Risk/RiskSubnav.tsx */
function RiskSubnav() {
  const [searchParams] = useSearchParams();
  const { version } = usePrototypeVersion();
  const filteredWorkflowView =
    searchParams.get('filteredWorkflowView') || 'Applications view';

  function withPrototype(path: string) {
    const url = new URL(path, window.location.origin);
    url.searchParams.set('prototype', version);
    return `${url.pathname}${url.search}`;
  }

  return (
    <NavList>
      <NavigationItem
        isActive={filteredWorkflowView === 'Applications view'}
        path={withPrototype(riskUserWorkloadsViewPath)}
        content="User Workloads"
      />
      <NavigationItem
        isActive={filteredWorkflowView === 'Platform view'}
        path={withPrototype(riskPlatformViewPath)}
        content="Platform"
      />
      <NavigationItem
        isActive={filteredWorkflowView === 'Full view'}
        path={withPrototype(riskFullViewPath)}
        content="All Deployments"
      />
    </NavList>
  );
}

export default RiskSubnav;
