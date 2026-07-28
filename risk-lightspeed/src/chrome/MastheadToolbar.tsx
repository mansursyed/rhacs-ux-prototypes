import type { ReactElement } from 'react';
import { Button, Flex, FlexItem, Tooltip } from '@patternfly/react-core';
import {
  CaretDownIcon,
  CheckCircleIcon,
  DownloadIcon,
  MoonIcon,
  PortIcon,
  QuestionCircleIcon,
  SearchIcon,
} from '@patternfly/react-icons';

/** Visual stub of stackrox MastheadToolbar — staging icon order (no prototype switcher). */
function MastheadToolbar(): ReactElement {
  return (
    <Flex
      spaceItems={{ default: 'spaceItemsSm' }}
      alignItems={{ default: 'alignItemsCenter' }}
      justifyContent={{ default: 'justifyContentFlexEnd' }}
    >
      <FlexItem>
        <Button variant="plain" icon={<SearchIcon />} isDisabled>
          Search
        </Button>
      </FlexItem>
      <FlexItem>
        <Button variant="plain" icon={<DownloadIcon />} isDisabled>
          CLI
        </Button>
      </FlexItem>
      <FlexItem>
        <Tooltip content="Switch to Dark Mode">
          <Button aria-label="Toggle theme" variant="plain" isDisabled>
            <MoonIcon />
          </Button>
        </Tooltip>
      </FlexItem>
      <FlexItem>
        <Tooltip content="Cluster status problems">
          <Button aria-label="Cluster status problems" variant="plain" isDisabled>
            <Flex
              direction={{ default: 'row' }}
              flexWrap={{ default: 'nowrap' }}
              spaceItems={{ default: 'spaceItemsSm' }}
              alignItems={{ default: 'alignItemsCenter' }}
            >
              <FlexItem>
                <PortIcon />
              </FlexItem>
              <FlexItem>
                <CheckCircleIcon color="var(--pf-t--global--icon--color--status--success--default)" />
              </FlexItem>
            </Flex>
          </Button>
        </Tooltip>
      </FlexItem>
      <FlexItem>
        <Button aria-label="Help" variant="plain" isDisabled>
          <QuestionCircleIcon />
        </Button>
      </FlexItem>
      <FlexItem>
        <Button variant="plain" isDisabled aria-label="User menu">
          <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsXs' }}>
            <FlexItem>MS</FlexItem>
            <FlexItem>
              <CaretDownIcon />
            </FlexItem>
          </Flex>
        </Button>
      </FlexItem>
    </Flex>
  );
}

export default MastheadToolbar;
