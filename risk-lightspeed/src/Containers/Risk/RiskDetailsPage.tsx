import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Bullseye,
  Button,
  Flex,
  FlexItem,
  PageBreadcrumb,
  PageSection,
  Skeleton,
  Spinner,
  Title,
} from '@patternfly/react-core';
import { MagicIcon } from '@patternfly/react-icons';
import { Link, useParams, useSearchParams } from 'react-router-dom';

import LightspeedInvestigation from '../../components/LightspeedInvestigation';
import { usePrototypeVersion } from '../../demo/usePrototypeVersion';
import { fetchDeploymentWithRisk } from '../../services/DeploymentsService';
import type { DeploymentWithRisk } from '../../services/DeploymentsService';
import RiskDetailTabs from './RiskDetailTabs';

/**
 * Ported from stackrox Containers/Risk/RiskDetailsPage.tsx
 * Lightspeed investigate CTA is prototype-only (v1/v2).
 */
function RiskDetailsPage(): ReactElement {
  const { deploymentId = '' } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showLightspeed, version } = usePrototypeVersion();

  const [data, setData] = useState<DeploymentWithRisk | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();
  const [showPanel, setShowPanel] = useState(
    showLightspeed && searchParams.get('investigate') === 'lightspeed'
  );

  useEffect(() => {
    setIsLoading(true);
    fetchDeploymentWithRisk(deploymentId)
      .then((result) => {
        setData(result);
        setError(undefined);
      })
      .catch((err: Error) => setError(err))
      .finally(() => setIsLoading(false));
  }, [deploymentId, version]);

  useEffect(() => {
    if (searchParams.get('investigate') === 'lightspeed' && showLightspeed) {
      setShowPanel(true);
      const next = new URLSearchParams(searchParams);
      next.delete('investigate');
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams, showLightspeed]);

  useEffect(() => {
    if (!showLightspeed) {
      setShowPanel(false);
    }
  }, [showLightspeed]);

  const listParams = new URLSearchParams(searchParams);
  listParams.delete('investigate');
  listParams.delete('contentTab');
  if (!listParams.get('filteredWorkflowView')) {
    listParams.set('filteredWorkflowView', 'Applications view');
  }
  const filteredWorkflowView = listParams.get('filteredWorkflowView') || 'Applications view';
  const listHref = `/main/risk/workloads?${listParams.toString()}`;
  const breadcrumbTitle =
    filteredWorkflowView === 'Platform view'
      ? 'Platform risk'
      : filteredWorkflowView === 'Full view'
        ? 'All deployment risk'
        : 'User workload risk';

  const deploymentName = data?.deployment.name;
  const panelTitle =
    version === 'v2' ? 'AI risk briefing (eng feedback)' : 'AI-assisted investigation';

  return (
    <>
      <PageBreadcrumb>
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to={listHref}>{breadcrumbTitle}</Link>
          </BreadcrumbItem>
          <BreadcrumbItem isActive>
            {deploymentName ?? <Skeleton width="200px" />}
          </BreadcrumbItem>
        </Breadcrumb>
      </PageBreadcrumb>
      <PageSection>
        <Flex
          justifyContent={{ default: 'justifyContentSpaceBetween' }}
          alignItems={{ default: 'alignItemsCenter' }}
        >
          {deploymentName ? (
            <Title headingLevel="h1">{deploymentName}</Title>
          ) : (
            <Skeleton width="25%" screenreaderText="Loading deployment information" />
          )}
          {showLightspeed && (
            <FlexItem>
              <Button
                variant="primary"
                icon={<MagicIcon />}
                isDisabled={!data || showPanel}
                onClick={() => setShowPanel(true)}
              >
                Investigate with Lightspeed
              </Button>
            </FlexItem>
          )}
        </Flex>
      </PageSection>
      {error && (
        <PageSection>
          There was an error loading the deployment data: {error.message}
        </PageSection>
      )}
      {isLoading && !data && (
        <Bullseye>
          <Spinner aria-label="Loading deployment information" />
        </Bullseye>
      )}
      {data && !error && (
        <>
          {showLightspeed && showPanel && (
            <PageSection>
              <LightspeedInvestigation
                data={data}
                onClose={() => setShowPanel(false)}
                title={panelTitle}
              />
            </PageSection>
          )}
          <RiskDetailTabs deployment={data.deployment} risk={data.risk} />
        </>
      )}
    </>
  );
}

export default RiskDetailsPage;
