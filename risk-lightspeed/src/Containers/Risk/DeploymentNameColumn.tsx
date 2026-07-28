import { Link, useSearchParams } from 'react-router-dom';
import { Tooltip } from '@patternfly/react-core';
import { CheckIcon, ExclamationCircleIcon } from '@patternfly/react-icons';

import { riskWorkloadsBasePath } from '../../routePaths';

type DeploymentNameColumnProps = {
  original: {
    deployment: { id: string; name: string };
    baselineStatuses: { anomalousProcessesExecuted: boolean }[];
  };
};

/** Ported from stackrox DeploymentNameColumn — links to /main/risk/workloads/:id */
export function DeploymentNameColumn({ original }: DeploymentNameColumnProps) {
  const [searchParams] = useSearchParams();
  const isSuspicious = original.baselineStatuses.some(
    (status) => status.anomalousProcessesExecuted
  );
  const params = new URLSearchParams(searchParams);
  const qs = params.toString();
  const url = `${riskWorkloadsBasePath}/${original.deployment.id}${qs ? `?${qs}` : ''}`;

  return (
    <span className="pf-v6-u-display-inline-flex pf-v6-u-align-items-center">
      {isSuspicious ? (
        <Tooltip content="Abnormal processes discovered">
          <ExclamationCircleIcon color="var(--pf-t--global--icon--color--status--danger--default)" />
        </Tooltip>
      ) : (
        <Tooltip content="No abnormal processes discovered">
          <CheckIcon />
        </Tooltip>
      )}
      <span className="pf-v6-u-pl-sm pf-v6-u-text-nowrap">
        <Link to={url}>{original.deployment.name}</Link>
      </span>
    </span>
  );
}
