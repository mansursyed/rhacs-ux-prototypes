import { useEffect, useMemo, useState } from 'react';
import { Pagination, Toolbar, ToolbarContent, ToolbarItem } from '@patternfly/react-core';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

import TbodyUnified from '../../components/TbodyUnified';
import { getDateTime } from '../../utils/dateUtils';
import { getTableUIState } from '../../utils/getTableUIState';
import {
  fetchDeploymentsCount,
  fetchDeploymentsWithProcessInfo,
} from '../../services/DeploymentsService';
import type { ListDeploymentWithProcessInfo } from '../../services/DeploymentsService';
import { usePrototypeVersion } from '../../demo/usePrototypeVersion';
import { DeploymentNameColumn } from './DeploymentNameColumn';

/** Priority is the classic Risk default sort (asc). */
const sortBy = { index: 4, direction: 'asc' as const };
const noopSort = () => undefined;

/** Ported from stackrox Containers/Risk/RiskTablePanel.tsx (classic columns). */
function RiskTablePanel() {
  const { version } = usePrototypeVersion();
  const [data, setData] = useState<ListDeploymentWithProcessInfo[] | undefined>();
  const [deploymentCount, setDeploymentCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchDeploymentsWithProcessInfo(), fetchDeploymentsCount()])
      .then(([deployments, count]) => {
        const sorted = [...deployments].sort((a, b) => {
          const pa = parseInt(a.deployment.priority || '0', 10);
          const pb = parseInt(b.deployment.priority || '0', 10);
          return pa - pb;
        });
        setData(sorted);
        setDeploymentCount(count);
        setError(undefined);
      })
      .catch((err: Error) => setError(err))
      .finally(() => setIsLoading(false));
  }, [version]);

  const paged = useMemo(() => {
    if (!data) {
      return undefined;
    }
    const start = (page - 1) * perPage;
    return data.slice(start, start + perPage);
  }, [data, page, perPage]);

  const tableState = getTableUIState({
    isLoading,
    data: paged,
    error,
    searchFilter: {},
  });

  return (
    <div>
      <Toolbar>
        <ToolbarContent>
          <ToolbarItem align={{ default: 'alignEnd' }} variant="pagination">
            <Pagination
              itemCount={deploymentCount}
              page={page}
              onSetPage={(_, newPage) => setPage(newPage)}
              perPage={perPage}
              onPerPageSelect={(_, newPerPage) => {
                setPerPage(newPerPage);
                setPage(1);
              }}
            />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
      <Table variant="compact" aria-label="Risk deployments">
        <Thead noWrap>
          <Tr>
            <Th width={25} sort={{ sortBy, onSort: noopSort, columnIndex: 0 }}>
              Name
            </Th>
            <Th width={25} sort={{ sortBy, onSort: noopSort, columnIndex: 1 }}>
              Created
            </Th>
            <Th sort={{ sortBy, onSort: noopSort, columnIndex: 2 }}>Cluster</Th>
            <Th sort={{ sortBy, onSort: noopSort, columnIndex: 3 }}>Namespace</Th>
            <Th width={10} sort={{ sortBy, onSort: noopSort, columnIndex: 4 }}>
              Priority
            </Th>
          </Tr>
        </Thead>
        <TbodyUnified
          tableState={tableState}
          colSpan={5}
          emptyProps={{ message: 'No results found' }}
          renderer={({ data: rows }) =>
            rows.map((deploymentWithProcessInfo) => {
              const { deployment } = deploymentWithProcessInfo;
              const priorityAsInt = parseInt(deployment.priority || '', 10);
              const priorityDisplay =
                Number.isNaN(priorityAsInt) || priorityAsInt < 1 ? '-' : priorityAsInt;

              return (
                <Tbody key={deployment.id}>
                  <Tr>
                    <Td dataLabel="Name">
                      <DeploymentNameColumn original={deploymentWithProcessInfo} />
                    </Td>
                    <Td dataLabel="Created">
                      {deployment.created ? getDateTime(deployment.created) : '-'}
                    </Td>
                    <Td dataLabel="Cluster">
                      {deployment.cluster || deployment.clusterName}
                    </Td>
                    <Td dataLabel="Namespace">{deployment.namespace}</Td>
                    <Td dataLabel="Priority">{priorityDisplay}</Td>
                  </Tr>
                </Tbody>
              );
            })
          }
        />
      </Table>
    </div>
  );
}

export default RiskTablePanel;
