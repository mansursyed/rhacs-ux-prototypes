import type { RiskResult } from '../types';

const THEORETICAL_MAX_SCORE = 4 * 4 * 4 * 2 * 2 * 1.5 * 1.5 * 1.5; // 864

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
