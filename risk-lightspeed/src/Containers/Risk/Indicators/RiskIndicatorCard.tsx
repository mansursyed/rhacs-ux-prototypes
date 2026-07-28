import { useState } from 'react';
import {
  Card,
  CardBody,
  CardExpandableContent,
  CardHeader,
  CardTitle,
  List,
  ListItem,
} from '@patternfly/react-core';
import type { RiskResult } from '../../../services/DeploymentsService';

type RiskIndicatorCardProps = {
  result: RiskResult;
};

/** Ported from stackrox Containers/Risk/Indicators/RiskIndicatorCard.tsx */
function RiskIndicatorCard({ result }: RiskIndicatorCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <Card isExpanded={isExpanded}>
      <CardHeader
        onExpand={() => setIsExpanded((prev) => !prev)}
        toggleButtonProps={{ 'aria-expanded': isExpanded, 'aria-label': 'Details' }}
      >
        <CardTitle>{result.name}</CardTitle>
      </CardHeader>
      <CardExpandableContent>
        <CardBody>
          <List isPlain isBordered>
            {result.factors.map(({ message, url }, index) => (
              <ListItem key={`${result.name}-${index}`}>
                {url ? (
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    {message}
                  </a>
                ) : (
                  message
                )}
              </ListItem>
            ))}
          </List>
        </CardBody>
      </CardExpandableContent>
    </Card>
  );
}

export default RiskIndicatorCard;
