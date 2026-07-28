import { Alert, Flex, PageSection, Tab, TabTitleText, Tabs } from '@patternfly/react-core';
import { useSearchParams } from 'react-router-dom';

import type { Deployment, Risk } from '../../services/DeploymentsService';
import RiskIndicatorCard from './Indicators/RiskIndicatorCard';

const riskIndicatorsTab = 'Risk indicators';
const deploymentDetailsTab = 'Deployment details';
const processDiscoveryTab = 'Process discovery';

export type RiskDetailTabsProps = {
  deployment: Deployment;
  risk: Risk | null | undefined;
};

/** Ported from stackrox Containers/Risk/RiskDetailTabs.tsx (detail tabs stubbed beyond indicators). */
function RiskDetailTabs({ deployment, risk }: RiskDetailTabsProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabKey = searchParams.get('contentTab') || riskIndicatorsTab;

  function setActiveTabKey(tabKey: string | number) {
    const next = new URLSearchParams(searchParams);
    next.set('contentTab', String(tabKey));
    setSearchParams(next, { replace: true });
  }

  return (
    <>
      <PageSection type="tabs" padding={{ default: 'noPadding' }}>
        <Tabs
          activeKey={activeTabKey}
          onSelect={(_event, tabKey) => setActiveTabKey(tabKey)}
          role="region"
          usePageInsets
        >
          <Tab
            eventKey={riskIndicatorsTab}
            title={<TabTitleText>{riskIndicatorsTab}</TabTitleText>}
            tabContentId={riskIndicatorsTab}
          />
          <Tab
            eventKey={deploymentDetailsTab}
            title={<TabTitleText>{deploymentDetailsTab}</TabTitleText>}
            tabContentId={deploymentDetailsTab}
          />
          <Tab
            eventKey={processDiscoveryTab}
            title={<TabTitleText>{processDiscoveryTab}</TabTitleText>}
            tabContentId={processDiscoveryTab}
          />
        </Tabs>
      </PageSection>
      <PageSection id={activeTabKey}>
        {activeTabKey === riskIndicatorsTab &&
          (risk ? (
            <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsMd' }}>
              {risk.results.map((result) => (
                <RiskIndicatorCard key={result.name} result={result} />
              ))}
            </Flex>
          ) : (
            <Alert variant="warning" isInline title="Risk not found" component="p">
              Risk for selected deployment may not have been processed.
            </Alert>
          ))}
        {activeTabKey === deploymentDetailsTab && (
          <Alert variant="info" isInline title="Deployment details" component="p">
            Full deployment details tab is not included in this prototype snapshot. Deployment:{' '}
            {deployment.name} in {deployment.clusterName}/{deployment.namespace}.
          </Alert>
        )}
        {activeTabKey === processDiscoveryTab && (
          <Alert variant="info" isInline title="Process discovery" component="p">
            Process discovery is not included in this prototype snapshot.
          </Alert>
        )}
      </PageSection>
    </>
  );
}

export default RiskDetailTabs;
