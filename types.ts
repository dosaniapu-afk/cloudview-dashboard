export type CloudProvider = 'All' | 'AWS' | 'Azure' | 'GCP';

export type ResourceStatus = 'Running' | 'Stopped' | 'Error' | 'Provisioning';

export interface CloudResource {
  id: string;
  provider: 'AWS' | 'Azure' | 'GCP';
  serviceName: string; // e.g., "App Service", "EC2"
  resourceName: string;
  status: ResourceStatus;
  cpuUsage: number;
  memoryUsage: number;
  monthlyCost: number;
  environment: string;
  region: string;
  uptime: number;
  incidents: number;
  backupEnabled: boolean;
  type: string; // e.g., "serverless", "db.t3.medium"
  criticality: 'Tier-1' | 'Tier-2' | 'Tier-3';
}

export interface KPIStats {
  totalResources: number;
  activeAlerts: number;
  totalCost: number;
  avgUptime: number;
}
