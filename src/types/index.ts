export type RiskStatus = 'open' | 'mitigated' | 'closed';
export type RiskCategory = 'technical' | 'financial' | 'operational' | 'schedule' | 'scope' | 'resource' | 'stakeholder' | 'legal' | 'security' | 'quality' | 'custom';
export type RiskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  jobTitle: string;
  department: string;
  company: string;
  role: string;
  phoneNumber?: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  email: string;
  displayName: string;
  jobTitle: string;
  projectRole?: string;
}

export interface MitigationStrategy {
  overview: string;
  responsibleRoles: {
    role: string;
    responsibilities: string[];
  }[];
  timeline: {
    phase: string;
    duration: string;
    activities: string[];
  }[];
  resources: {
    type: string;
    requirements: string[];
  }[];
  successMetrics: string[];
  costImplications: {
    item: string;
    estimate: string;
  }[];
  implementationChallenges: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  teamMembers: TeamMember[];
  createdAt: Date;
  updatedAt: Date;
  risks: Risk[];
}

export interface Risk {
  id: string;
  projectId: string;
  title: string;
  description: string;
  category: RiskCategory;
  probability: number;
  impact: number;
  priority: RiskPriority;
  status: RiskStatus;
  assignedTo: string;
  tags: string[];
  mitigationStrategy?: MitigationStrategy;
  solutions?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface GenerateRiskParams {
  industry?: string;
  projectType?: string;
  categories?: RiskCategory[];
  count?: number;
  country?: string;
  budget?: string;
  timeline?: string;
  teamSize?: string;
  stakeholders?: string;
  regulations?: string;
  teamMembers?: TeamMember[];
}

export interface GenerateMitigationParams {
  risk: Risk;
  teamMembers?: TeamMember[];
}

export interface GenerationProgress {
  status: 'idle' | 'generating-risks' | 'generating-strategies' | 'generating-solutions';
  currentItem: number;
  totalItems: number;
  message: string;
}