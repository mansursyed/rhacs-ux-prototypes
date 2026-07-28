import { Button, Flex, FlexItem, FormSelect, FormSelectOption, Tooltip } from '@patternfly/react-core';
import { ShareAltIcon } from '@patternfly/react-icons';
import { usePrototypeVersion } from './usePrototypeVersion';

export default function VersionSwitcher() {
  const { version, setVersion, prototypes, meta } = usePrototypeVersion();

  function handleShare() {
    const url = new URL(window.location.href);
    url.searchParams.set('prototype', version);
    navigator.clipboard.writeText(url.toString());
  }

  return (
    <Flex
      alignItems={{ default: 'alignItemsCenter' }}
      spaceItems={{ default: 'spaceItemsSm' }}
      className="version-switcher"
    >
      <FlexItem>
        <span className="pf-v6-u-font-size-sm pf-v6-u-color-200">Prototype</span>
      </FlexItem>
      <FlexItem>
        <FormSelect
          value={version}
          onChange={(_e, value) => setVersion(value as typeof version)}
          aria-label="Prototype version"
          ouiaId="prototype-version"
        >
          {prototypes.map((p) => (
            <FormSelectOption key={p.id} value={p.id} label={p.label} />
          ))}
        </FormSelect>
      </FlexItem>
      <FlexItem>
        <Tooltip content={`${meta.description} — copy share link`}>
          <Button variant="plain" icon={<ShareAltIcon />} onClick={handleShare} aria-label="Share" />
        </Tooltip>
      </FlexItem>
    </Flex>
  );
}
