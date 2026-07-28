import type { ReactElement, ReactNode } from 'react';
import { Bullseye, Button, Spinner } from '@patternfly/react-core';
import { Tbody, Td, Tr } from '@patternfly/react-table';
import type { TableUIState } from '../utils/getTableUIState';

type Props<T> = {
  tableState: TableUIState<T>;
  colSpan: number;
  renderer: (props: { data: T[] }) => ReactNode;
  emptyProps?: { message?: string };
  filteredEmptyProps?: { onClearFilters?: () => void };
};

function TbodyUnified<T>({
  tableState,
  colSpan,
  renderer,
  emptyProps,
  filteredEmptyProps,
}: Props<T>): ReactElement {
  switch (tableState.type) {
    case 'IDLE':
      return <></>;
    case 'LOADING':
      return (
        <Tbody>
          <Tr>
            <Td colSpan={colSpan}>
              <Bullseye className="pf-v6-u-p-xl">
                <Spinner aria-label="Loading table" />
              </Bullseye>
            </Td>
          </Tr>
        </Tbody>
      );
    case 'ERROR':
      return (
        <Tbody>
          <Tr>
            <Td colSpan={colSpan}>{tableState.error.message}</Td>
          </Tr>
        </Tbody>
      );
    case 'EMPTY':
      return (
        <Tbody>
          <Tr>
            <Td colSpan={colSpan}>{emptyProps?.message ?? 'No results found'}</Td>
          </Tr>
        </Tbody>
      );
    case 'FILTERED_EMPTY':
      return (
        <Tbody>
          <Tr>
            <Td colSpan={colSpan}>
              No results found.{' '}
              {filteredEmptyProps?.onClearFilters && (
                <Button variant="link" isInline onClick={filteredEmptyProps.onClearFilters}>
                  Clear filters
                </Button>
              )}
            </Td>
          </Tr>
        </Tbody>
      );
    case 'COMPLETE':
      return <>{renderer({ data: tableState.data })}</>;
    default:
      return <></>;
  }
}

export default TbodyUnified;
