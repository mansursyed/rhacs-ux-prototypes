import type { Deployment, DeploymentWithRisk, ListDeploymentRow } from '../types';

export type { Deployment, DeploymentWithRisk };
export type ListDeploymentWithProcessInfo = ListDeploymentRow;
export type Risk = DeploymentWithRisk['risk'];
export type RiskResult = DeploymentWithRisk['risk']['results'][number];

export async function fetchDeploymentsWithProcessInfo(): Promise<ListDeploymentWithProcessInfo[]> {
  const res = await fetch('/v1/deploymentswithprocessinfo');
  if (!res.ok) {
    throw new Error(`Failed to load deployments (${res.status})`);
  }
  const json = (await res.json()) as { deployments: ListDeploymentWithProcessInfo[] };
  return json.deployments;
}

export async function fetchDeploymentsCount(): Promise<number> {
  const res = await fetch('/v1/deploymentscount');
  if (!res.ok) {
    throw new Error(`Failed to load deployment count (${res.status})`);
  }
  const json = (await res.json()) as { count: number };
  return json.count;
}

export async function fetchDeploymentWithRisk(id: string): Promise<DeploymentWithRisk> {
  const res = await fetch(`/v1/deploymentswithrisk/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to load deployment risk (${res.status})`);
  }
  return res.json() as Promise<DeploymentWithRisk>;
}
