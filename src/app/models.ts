export type CaseStatus = 'In progress' | 'Needs approval' | 'Needs information' | 'Completed';

export interface EnterpriseCase {
  id: string;
  title: string;
  category: string;
  status: CaseStatus;
  owner: string;
  updatedAt: string;
  priority: 'Standard' | 'High';
  summary: string;
}

export interface Citation {
  title: string;
  section: string;
  excerpt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  time: string;
  citations?: Citation[];
}

export interface CaseEvent {
  label: string;
  detail: string;
  time: string;
  state: 'done' | 'active' | 'pending';
}

export interface NewRequest {
  request: string;
  category: string;
  files: string[];
}
