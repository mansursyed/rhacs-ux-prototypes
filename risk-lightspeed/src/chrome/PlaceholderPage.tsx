import { PageSection, Title } from '@patternfly/react-core';

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <PageSection>
      <Title headingLevel="h1">{title}</Title>
      <p className="pf-v6-u-mt-md pf-v6-u-color-200">
        This area is chrome-only in the Risk Lightspeed prototype. Open Risk to explore the
        click-through experience.
      </p>
    </PageSection>
  );
}
