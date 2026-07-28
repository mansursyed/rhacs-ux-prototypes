export type RiskFactor = {
  message: string;
  url?: string;
};

export type RiskResult = {
  name: string;
  score: number;
  factors: RiskFactor[];
};

export type Risk = {
  id: string;
  subject: {
    id: string;
    namespace: string;
    clusterId: string;
    type: string;
  };
  score: number;
  results: RiskResult[];
};

export type Deployment = {
  id: string;
  name: string;
  namespace: string;
  clusterName?: string;
  cluster?: string;
  clusterId?: string;
  type?: string;
  created?: string;
  priority?: string;
  riskScore?: number;
  platformComponent?: boolean;
  serviceAccount?: string;
  serviceAccountPermissionLevel?: string;
  automountServiceAccountToken?: boolean;
  containers?: Array<{
    name?: string;
    image?: {
      name?: {
        fullName?: string;
      };
    };
    securityContext?: {
      privileged?: boolean;
      allowPrivilegeEscalation?: boolean;
      readOnlyRootFilesystem?: boolean;
    };
    resources?: {
      cpuCoresRequest?: number;
      cpuCoresLimit?: number;
      memoryMbRequest?: number;
      memoryMbLimit?: number;
    };
  }>;
};

export type DeploymentWithRisk = {
  deployment: Deployment;
  risk: Risk;
};

export type ListDeploymentRow = {
  deployment: Deployment;
  baselineStatuses: { anomalousProcessesExecuted: boolean }[];
};

export type PrototypeId = 'baseline' | 'v1' | 'v2';
