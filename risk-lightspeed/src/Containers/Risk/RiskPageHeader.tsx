import { Button, Flex, PageSection, Title } from '@patternfly/react-core';

/** Ported from stackrox Containers/Risk/RiskPageHeader.tsx (+ Create policy affordance). */
function RiskPageHeader() {
  return (
    <PageSection>
      <Flex
        alignItems={{ default: 'alignItemsCenter' }}
        justifyContent={{ default: 'justifyContentSpaceBetween' }}
      >
        <Title headingLevel="h1">Risk</Title>
        <Button variant="secondary" isDisabled>
          Create policy
        </Button>
      </Flex>
    </PageSection>
  );
}

export default RiskPageHeader;
