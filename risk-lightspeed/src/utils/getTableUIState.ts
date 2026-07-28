export type SearchFilter = Record<string, string | string[] | undefined>;

export type TableUIState<DataType> =
  | { type: 'IDLE' }
  | { type: 'LOADING' }
  | { type: 'COMPLETE'; data: DataType[] }
  | { type: 'EMPTY' | 'FILTERED_EMPTY' }
  | { type: 'ERROR'; error: Error };

export function getTableUIState<DataType>({
  isLoading,
  data,
  error,
  searchFilter,
}: {
  isLoading: boolean;
  data: undefined | DataType[];
  error: Error | undefined;
  searchFilter: SearchFilter;
}): TableUIState<DataType> {
  const hasSearchFilters = Object.keys(searchFilter).length > 0;

  if (error) {
    return { type: 'ERROR', error };
  }
  if (isLoading) {
    return { type: 'LOADING' };
  }
  if (data && data.length > 0) {
    return { type: 'COMPLETE', data };
  }
  if (hasSearchFilters) {
    return { type: 'FILTERED_EMPTY' };
  }
  if (data && data.length === 0) {
    return { type: 'EMPTY' };
  }
  return { type: 'IDLE' };
}
