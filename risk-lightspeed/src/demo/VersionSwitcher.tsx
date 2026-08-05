import { useState } from 'react';
import type { Ref } from 'react';
import {
  Button,
  Flex,
  FlexItem,
  MenuToggle,
  Select,
  SelectList,
  SelectOption,
  Tooltip,
} from '@patternfly/react-core';
import type { MenuToggleElement } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon, ShareAltIcon } from '@patternfly/react-icons';
import type { PrototypeId } from '../types';
import { usePrototypeVersion } from './usePrototypeVersion';

const HELP_TOOLTIP =
  'Use the prototype switcher to change which prototype state is shown. Select an option from the menu to update the UI. Use Share to copy a link that opens the same state.';

export default function VersionSwitcher() {
  const { version, setVersion, prototypes, meta } = usePrototypeVersion();
  const [isOpen, setIsOpen] = useState(false);

  function handleShare() {
    const url = new URL(window.location.href);
    url.searchParams.set('prototype', version);
    navigator.clipboard.writeText(url.toString());
  }

  function onSelect(
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    value: string | number | undefined
  ) {
    if (typeof value === 'string') {
      setVersion(value as PrototypeId);
    }
    setIsOpen(false);
  }

  const toggle = (toggleRef: Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      onClick={() => setIsOpen((open) => !open)}
      isExpanded={isOpen}
      className="version-switcher__toggle"
      aria-label="Select prototype version"
    >
      {meta.label}
    </MenuToggle>
  );

  return (
    <Flex
      direction={{ default: 'column' }}
      spaceItems={{ default: 'spaceItemsSm' }}
      className="version-switcher"
    >
      <FlexItem>
        <Flex
          alignItems={{ default: 'alignItemsCenter' }}
          spaceItems={{ default: 'spaceItemsXs' }}
        >
          <FlexItem>
            <span className="version-switcher__title">Prototype switcher</span>
          </FlexItem>
          <FlexItem>
            <Tooltip content={HELP_TOOLTIP} position="top">
              <Button
                variant="plain"
                className="version-switcher__icon-btn"
                icon={<OutlinedQuestionCircleIcon color="white" />}
                aria-label="How to use the prototype switcher"
              />
            </Tooltip>
          </FlexItem>
        </Flex>
      </FlexItem>
      <FlexItem>
        <Flex
          alignItems={{ default: 'alignItemsCenter' }}
          spaceItems={{ default: 'spaceItemsSm' }}
        >
          <FlexItem grow={{ default: 'grow' }}>
            <Select
              id="prototype-version-select"
              isOpen={isOpen}
              selected={version}
              onSelect={onSelect}
              onOpenChange={(open) => setIsOpen(open)}
              toggle={toggle}
              shouldFocusToggleOnSelect
              popperProps={{ width: 'trigger', minWidth: '18rem' }}
            >
              <SelectList aria-label="Prototype versions">
                {prototypes.map((p) => (
                  <SelectOption
                    key={p.id}
                    value={p.id}
                    description={p.description}
                    isSelected={p.id === version}
                  >
                    {p.label}
                  </SelectOption>
                ))}
              </SelectList>
            </Select>
          </FlexItem>
          <FlexItem>
            <Tooltip content="Copy a share link for the current prototype state">
              <Button
                variant="plain"
                className="version-switcher__icon-btn"
                icon={<ShareAltIcon color="white" />}
                onClick={handleShare}
                aria-label="Share prototype link"
              />
            </Tooltip>
          </FlexItem>
        </Flex>
      </FlexItem>
    </Flex>
  );
}
