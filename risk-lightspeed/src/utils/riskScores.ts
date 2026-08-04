import type { RiskResult } from '../types';

/** Product of each category's max multiplier — StackRox central/risk/scorer. */
export const THEORETICAL_MAX_SCORE = 4 * 4 * 4 * 2 * 2 * 1.5 * 1.5 * 1.5; // 864

/**
 * Max multiplier per risk result name (from StackRox deployment scorers).
 * Result `score` on a deployment is that category's multiplier (≥ 1).
 */
export const RISK_CATEGORY_MAX_WEIGHT: Record<string, number> = {
  'Policy Violations': 4,
  'Suspicious Process Executions': 4,
  'Image Vulnerabilities': 4,
  'Service Configuration': 2,
  'Service Reachability': 2,
  'Components Useful for Attackers': 1.5,
  'Number of Components in Image': 1.5,
  'Image Freshness': 1.5,
  // Demo-only alias sometimes used in fixtures
  'Service Account Permission Level': 2,
};

export const RISK_CATEGORY_DISPLAY_NAME: Record<string, string> = {
  'Policy Violations': 'Policy Violations',
  'Suspicious Process Executions': 'Suspicious Processes',
  'Image Vulnerabilities': 'Image Vulnerabilities',
  'Service Configuration': 'Service Configuration',
  'Service Reachability': 'Service Reachability',
  'Components Useful for Attackers': 'Risky Components',
  'Number of Components in Image': 'Component Count',
  'Image Freshness': 'Image Freshness',
  'Service Account Permission Level': 'Service Configuration',
};

export type RiskSeverity =
  | 'CRITICAL_VULNERABILITY_SEVERITY'
  | 'IMPORTANT_VULNERABILITY_SEVERITY'
  | 'MODERATE_VULNERABILITY_SEVERITY'
  | 'LOW_VULNERABILITY_SEVERITY'
  | 'UNKNOWN_VULNERABILITY_SEVERITY';

export function normalizeRiskScore(rawScore: number): number {
  if (rawScore <= 1) {
    return 0;
  }
  const normalized = (Math.log(rawScore) / Math.log(THEORETICAL_MAX_SCORE)) * 100;
  return Math.min(100, Math.round(normalized));
}

export function formatMultiplier(score: number): string {
  const rounded = Math.round(score * 10) / 10;
  return Number.isInteger(rounded) ? `${rounded}` : rounded.toFixed(1);
}

/** Contributing categories only (multiplier meaningfully above 1). */
export function contributingRiskResults(results: RiskResult[]): RiskResult[] {
  return [...results]
    .filter((r) => r.score > 1.01)
    .sort((a, b) => b.score - a.score);
}

/** Short insight for LLM-style breakdown — no repeated image refs or full factor dumps. */
export function conciseRiskInsight(result: RiskResult): string {
  const messages = result.factors.map((f) => f.message).join(' ');

  switch (result.name) {
    case 'Suspicious Process Executions': {
      const procs = [
        ...messages.matchAll(/Process\s+"([^"]+)"/g),
      ].map((m) => m[1].replace(/^.*\//, ''));
      const unique = [...new Set(procs)];
      if (unique.length === 0) {
        return `${result.factors.length} anomalous process${result.factors.length === 1 ? '' : 'es'}`;
      }
      return `anomalous ${unique.slice(0, 3).join(', ')} execution${unique.length === 1 ? '' : 's'}`;
    }
    case 'Image Vulnerabilities': {
      const cves = messages.match(/contains (\d+) CVEs/);
      const range = messages.match(/ranging between (.+?)(?:$|\.)/i);
      if (cves) {
        return range
          ? `${cves[1]} CVEs (${range[1]})`
          : `${cves[1]} CVEs in the image`;
      }
      return 'image vulnerabilities present';
    }
    case 'Image Freshness': {
      const days = messages.match(/is (\d+) days old/);
      return days ? `${days[1]}-day-old image (unpatched window)` : 'stale image';
    }
    case 'Number of Components in Image': {
      const n = messages.match(/contains (\d+) components/);
      return n ? `${n[1]} image components (large attack surface)` : 'high component count';
    }
    case 'Components Useful for Attackers': {
      const tools = messages.match(/useful for attackers:\s*(.+)$/i);
      if (tools) {
        const list = tools[1]
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
          .slice(0, 4);
        return list.length ? `attacker-useful tools: ${list.join(', ')}` : 'attacker-useful tools present';
      }
      return 'attacker-useful tools present';
    }
    case 'Service Configuration':
    case 'Service Account Permission Level':
      if (/CLUSTER_ADMIN|elevated|automount/i.test(messages)) {
        return 'elevated service-account / config exposure';
      }
      return 'service configuration weaknesses';
    case 'Service Reachability':
      return 'broad network exposure';
    case 'Policy Violations': {
      const n = result.factors.length;
      return `${n} active policy violation${n === 1 ? '' : 's'}`;
    }
    default: {
      const first = result.factors[0]?.message ?? result.name;
      return first
        .replace(/Image\s+"[^"]+"\s*/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 80);
    }
  }
}

export function getRiskSeverity(normalizedScore: number): RiskSeverity {
  if (normalizedScore >= 76) return 'CRITICAL_VULNERABILITY_SEVERITY';
  if (normalizedScore >= 51) return 'IMPORTANT_VULNERABILITY_SEVERITY';
  if (normalizedScore >= 26) return 'MODERATE_VULNERABILITY_SEVERITY';
  if (normalizedScore >= 1) return 'LOW_VULNERABILITY_SEVERITY';
  return 'UNKNOWN_VULNERABILITY_SEVERITY';
}

export function severityLabel(severity: RiskSeverity): string {
  switch (severity) {
    case 'CRITICAL_VULNERABILITY_SEVERITY':
      return 'Critical';
    case 'IMPORTANT_VULNERABILITY_SEVERITY':
      return 'Important';
    case 'MODERATE_VULNERABILITY_SEVERITY':
      return 'Moderate';
    case 'LOW_VULNERABILITY_SEVERITY':
      return 'Low';
    default:
      return 'Unknown';
  }
}

export function severityColor(
  severity: RiskSeverity
): 'red' | 'orange' | 'yellow' | 'blue' | 'grey' {
  switch (severity) {
    case 'CRITICAL_VULNERABILITY_SEVERITY':
      return 'red';
    case 'IMPORTANT_VULNERABILITY_SEVERITY':
      return 'orange';
    case 'MODERATE_VULNERABILITY_SEVERITY':
      return 'yellow';
    case 'LOW_VULNERABILITY_SEVERITY':
      return 'blue';
    default:
      return 'grey';
  }
}

export function topRiskFactors(results: RiskResult[], limit = 3): string[] {
  return [...results]
    .sort((a, b) => b.score - a.score)
    .flatMap((r) => r.factors.map((f) => f.message))
    .slice(0, limit);
}
