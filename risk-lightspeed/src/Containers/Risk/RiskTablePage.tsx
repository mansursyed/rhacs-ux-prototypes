import { Flex, PageSection } from '@patternfly/react-core';

import SearchFilterStub from '../../components/SearchFilterStub';
import RiskPageHeader from './RiskPageHeader';
import RiskTablePanel from './RiskTablePanel';

/**
 * Ported from stackrox Containers/Risk/RiskTablePage.tsx (classic Risk workloads).
 */
function RiskTablePage() {
  return (
    <>
      <RiskPageHeader />
      <PageSection>
        <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsMd' }}>
          <SearchFilterStub placeholder="Filter deployments" />
          <RiskTablePanel />
        </Flex>
      </PageSection>
    </>
  );
}

export default RiskTablePage;
