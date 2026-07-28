import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  FlexItem,
  Tooltip,
} from '@patternfly/react-core';
import { CopyIcon, MagicIcon, TimesIcon } from '@patternfly/react-icons';
import type { DeploymentWithRisk } from '../services/DeploymentsService';
import { normalizeRiskScore } from '../utils/riskScores';

const TICK_INTERVAL_MS = 12;
const CHARS_PER_TICK = 3;

function getImageFullName(data: DeploymentWithRisk): string {
  return data.deployment.containers?.[0]?.image?.name?.fullName ?? 'unknown image';
}

function getContainerName(data: DeploymentWithRisk): string {
  return data.deployment.containers?.[0]?.name ?? 'container';
}

function getCveCount(data: DeploymentWithRisk): number {
  for (const r of data.risk.results) {
    if (r.name === 'Image Vulnerabilities') {
      for (const f of r.factors) {
        const match = f.message.match(/contains (\d+) CVEs/);
        if (match) return parseInt(match[1], 10);
      }
    }
  }
  return 0;
}

function getImageAgeDays(data: DeploymentWithRisk): number {
  for (const r of data.risk.results) {
    if (r.name === 'Image Freshness') {
      for (const f of r.factors) {
        const match = f.message.match(/is (\d+) days old/);
        if (match) return parseInt(match[1], 10);
      }
    }
  }
  return 0;
}

function getComponentCount(data: DeploymentWithRisk): number {
  for (const r of data.risk.results) {
    if (r.name === 'Number of Components in Image') {
      for (const f of r.factors) {
        const match = f.message.match(/contains (\d+) components/);
        if (match) return parseInt(match[1], 10);
      }
    }
  }
  return 0;
}

function getAttackerTools(data: DeploymentWithRisk): string[] {
  const tools = new Set<string>();
  for (const r of data.risk.results) {
    if (r.name === 'Components Useful for Attackers') {
      for (const f of r.factors) {
        const match = f.message.match(/useful for attackers:\s*(.+)$/);
        if (match) match[1].split(',').forEach((c) => tools.add(c.trim()));
      }
    }
  }
  return Array.from(tools);
}

export function generateSummary(data: DeploymentWithRisk): string {
  const { deployment, risk } = data;
  const ns = deployment.namespace;
  const name = deployment.name;
  const normalizedScore = normalizeRiskScore(risk.score);

  if (normalizedScore < 25) {
    return 'This deployment has no significant risk factors. No immediate action required.';
  }

  const image = getImageFullName(data);
  const cveCount = getCveCount(data);
  const ageDays = getImageAgeDays(data);
  const isClusterAdmin = deployment.serviceAccountPermissionLevel === 'CLUSTER_ADMIN';
  const allowsPrivEsc =
    deployment.containers?.[0]?.securityContext?.allowPrivilegeEscalation === true;
  const noResourceLimits =
    deployment.containers?.[0]?.resources?.cpuCoresLimit === 0 &&
    deployment.containers?.[0]?.resources?.memoryMbLimit === 0;
  const writableRoot =
    deployment.containers?.[0]?.securityContext?.readOnlyRootFilesystem === false;
  const componentCount = getComponentCount(data);
  const attackerTools = getAttackerTools(data);
  getContainerName(data);

  const lines: string[] = [];
  lines.push('SUMMARY');

  const summaryParts: string[] = [];
  if (isClusterAdmin && cveCount > 0 && allowsPrivEsc) {
    summaryParts.push(
      `The combination of CLUSTER_ADMIN service account credentials, ${cveCount} critical CVEs, and privilege escalation enabled makes this deployment a high-priority lateral movement risk.`
    );
    summaryParts.push(
      `Image ${image} is ${ageDays} days old and has not been rebuilt with security patches.`
    );
  } else if (isClusterAdmin) {
    summaryParts.push(
      `Service account "${deployment.serviceAccount}" has CLUSTER_ADMIN privileges with automounted token, granting any compromised container full cluster access.`
    );
    if (cveCount > 0) {
      summaryParts.push(
        `Image ${image} contains ${cveCount} critical CVEs, compounding the RBAC exposure.`
      );
    }
  } else if (cveCount > 0) {
    summaryParts.push(
      `Image ${image} contains ${cveCount} critical CVEs and is ${ageDays} days old. The unpatched exposure window is the primary driver of this risk score.`
    );
    if (allowsPrivEsc) {
      summaryParts.push(
        'Privilege escalation is enabled, increasing the blast radius of any exploitation.'
      );
    }
  } else {
    summaryParts.push(
      'Multiple configuration weaknesses contribute to an elevated risk score. No single critical vulnerability, but the combination of factors creates meaningful exposure.'
    );
  }
  lines.push(summaryParts.join(' '));

  lines.push('');
  lines.push('RISK BREAKDOWN');

  const sortedResults = [...risk.results].sort((a, b) => b.score - a.score);
  const breakdownBullets: string[] = [];

  const hasImageIssues = cveCount > 0 || ageDays > 60;
  if (hasImageIssues) {
    const parts: string[] = [];
    if (cveCount > 0) parts.push(`${cveCount} critical CVEs`);
    if (ageDays > 60) parts.push(`${ageDays} days old`);
    breakdownBullets.push(`Unpatched image: ${parts.join(', ')} in ${image}.`);
  }

  if (isClusterAdmin) {
    breakdownBullets.push(
      'CLUSTER_ADMIN service account with automounted token enables full cluster access from compromised pod.'
    );
  }

  if (allowsPrivEsc || writableRoot) {
    const issues: string[] = [];
    if (allowsPrivEsc) issues.push('privilege escalation allowed');
    if (writableRoot) issues.push('writable root filesystem');
    breakdownBullets.push(`Permissive security context: ${issues.join(', ')}.`);
  }

  if (attackerTools.length > 0 || componentCount > 500) {
    const parts: string[] = [];
    if (attackerTools.length > 0) parts.push(attackerTools.join(', '));
    if (componentCount > 500) parts.push(`${componentCount} total components`);
    breakdownBullets.push(`Large attack surface: ${parts.join('; ')}.`);
  }

  if (breakdownBullets.length === 0) {
    for (const result of sortedResults.slice(0, 4)) {
      if (result.score >= 1.5 && result.factors.length > 0) {
        breakdownBullets.push(`${result.name}: ${result.factors[0].message}`);
      }
    }
  }

  for (const bullet of breakdownBullets.slice(0, 4)) {
    lines.push(`- ${bullet}`);
  }

  lines.push('');
  lines.push('IMMEDIATE ACTIONS');

  let actionNum = 0;

  if (isClusterAdmin && deployment.automountServiceAccountToken) {
    actionNum++;
    lines.push(
      `${actionNum}. Disable automounted service account token to cut off cluster API access from this pod.`
    );
    lines.push(
      `oc -n ${ns} patch deployment ${name} --type=json -p='[{"op":"replace","path":"/spec/template/spec/automountServiceAccountToken","value":false}]'`
    );
  }

  if (allowsPrivEsc) {
    actionNum++;
    lines.push(`${actionNum}. Disable privilege escalation on the container.`);
    lines.push(
      `oc -n ${ns} patch deployment ${name} --type=json -p='[{"op":"replace","path":"/spec/template/spec/containers/0/securityContext/allowPrivilegeEscalation","value":false}]'`
    );
  }

  if (noResourceLimits) {
    actionNum++;
    lines.push(`${actionNum}. Set resource limits to contain blast radius.`);
    lines.push(
      `oc -n ${ns} set resources deployment/${name} --limits=cpu=500m,memory=512Mi --requests=cpu=100m,memory=256Mi`
    );
  }

  if (writableRoot) {
    actionNum++;
    lines.push(
      `${actionNum}. ⚠ May affect application behavior: enable read-only root filesystem. Verify the container does not write to disk before applying.`
    );
    lines.push(
      `oc -n ${ns} patch deployment ${name} --type=json -p='[{"op":"replace","path":"/spec/template/spec/containers/0/securityContext/readOnlyRootFilesystem","value":true}]'`
    );
  }

  if (cveCount > 0 && actionNum < 4) {
    actionNum++;
    lines.push(
      `${actionNum}. Rebuild and deploy a patched version of ${image}. Determine the approved fixed image tag and digest before applying.`
    );
  }

  return lines.join('\n');
}

const sectionLabelStyle: React.CSSProperties = {
  fontWeight: 700,
  fontSize: '13px',
  letterSpacing: '0.5px',
  color: 'var(--pf-t--global--color--nonstatus--gray--text, #6a6e73)',
  marginBottom: '4px',
  marginTop: '12px',
};

const commandStyle: React.CSSProperties = {
  fontFamily: 'var(--pf-t--global--font--family--mono, "RedHatMono", monospace)',
  fontSize: '12px',
  backgroundColor: 'var(--pf-t--global--background--color--secondary--default, #f0f0f0)',
  padding: '6px 10px',
  borderRadius: '4px',
  display: 'block',
  overflowX: 'auto',
  margin: '4px 0 8px 0',
  lineHeight: 1.5,
  whiteSpace: 'pre',
};

const SECTION_LABELS = ['SUMMARY', 'RISK BREAKDOWN', 'IMMEDIATE ACTIONS'];

function isOcCommand(line: string): boolean {
  return line.startsWith('oc ') || line.startsWith('oc -');
}

export function renderFormattedText(text: string) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (SECTION_LABELS.includes(line.trim())) {
      elements.push(
        <div key={i} style={i === 0 ? { ...sectionLabelStyle, marginTop: 0 } : sectionLabelStyle}>
          {line}
        </div>
      );
    } else if (isOcCommand(line)) {
      elements.push(
        <code key={i} style={commandStyle}>
          {line}
        </code>
      );
    } else if (line.trim() !== '') {
      elements.push(
        <div key={i} style={{ lineHeight: 1.5, marginBottom: '2px', fontSize: '14px' }}>
          {line}
        </div>
      );
    }
  }

  return elements;
}

type LightspeedInvestigationProps = {
  data: DeploymentWithRisk;
  onClose: () => void;
  title?: string;
};

function LightspeedInvestigation({
  data,
  onClose,
  title = 'AI-assisted investigation',
}: LightspeedInvestigationProps) {
  const fullText = useMemo(() => generateSummary(data), [data]);
  const [charCount, setCharCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const isStreaming = charCount < fullText.length;
  const visibleText = fullText.slice(0, charCount);

  function handleCopy() {
    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  useEffect(() => {
    setCharCount(0);
    const interval = setInterval(() => {
      setCharCount((prev) => {
        const next = prev + CHARS_PER_TICK;
        if (next >= fullText.length) {
          clearInterval(interval);
          return fullText.length;
        }
        return next;
      });
    }, TICK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [fullText]);

  return (
    <Card>
      <CardHeader>
        <Flex
          justifyContent={{ default: 'justifyContentSpaceBetween' }}
          alignItems={{ default: 'alignItemsCenter' }}
          style={{ width: '100%' }}
        >
          <FlexItem>
            <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
              <FlexItem>
                <MagicIcon />
              </FlexItem>
              <FlexItem>
                <span className="pf-v6-u-font-weight-bold">{title}</span>
              </FlexItem>
            </Flex>
          </FlexItem>
          <FlexItem>
            <Tooltip content={copied ? 'Copied' : 'Copy summary'}>
              <Button
                variant="plain"
                onClick={handleCopy}
                isDisabled={isStreaming}
                aria-label="Copy AI summary to clipboard"
              >
                <CopyIcon />
              </Button>
            </Tooltip>
            <Button variant="plain" onClick={onClose} aria-label="Close AI investigation">
              <TimesIcon />
            </Button>
          </FlexItem>
        </Flex>
      </CardHeader>
      <CardBody>
        <Alert
          variant="info"
          isInline
          isPlain
          title="Always review AI-generated content prior to use."
          className="pf-v6-u-mb-md"
        />
        {isStreaming ? (
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5, fontSize: '14px' }}>
            {visibleText}
            <span className="cursor-blink">▊</span>
          </div>
        ) : (
          <div>{renderFormattedText(fullText)}</div>
        )}
      </CardBody>
    </Card>
  );
}

export default LightspeedInvestigation;
