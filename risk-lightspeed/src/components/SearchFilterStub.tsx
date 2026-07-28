import type { ReactElement } from 'react';
import { AngleDownIcon, FilterIcon } from '@patternfly/react-icons';

/**
 * Visual stub of SoT SearchFilterInput → classic react-select SearchInput
 * (funnel + placeholder + chevron). Non-interactive for the prototype.
 */
function SearchFilterStub({ placeholder }: { placeholder: string }): ReactElement {
  return (
    <div className="acs-search-filter-stub" aria-label={placeholder} role="search">
      <span className="acs-search-filter-stub__icon" aria-hidden>
        <FilterIcon />
      </span>
      <span className="acs-search-filter-stub__placeholder">{placeholder}</span>
      <span className="acs-search-filter-stub__chevron" aria-hidden>
        <AngleDownIcon />
      </span>
    </div>
  );
}

export default SearchFilterStub;
