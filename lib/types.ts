export type ApplicationStatus =
  | 'APPLIED' | 'PHONE_SCREEN' | 'INTERVIEWING'
  | 'OFFERED' | 'REJECTED' | 'WITHDRAWN'

export interface Application {
  id: string
  company: string
  role: string
  status: ApplicationStatus
  source?: string
  jobUrl?: string
  salary?: string
  notes?: string
  appliedAt: string
  updatedAt: string
  archived: boolean
  history: StatusHistoryItem[]
}

export interface StatusHistoryItem {
  id: string
  fromStatus?: string
  toStatus: string
  changedAt: string
}

export interface Product {
  id: string
  name: string
  category: string
  price: number
  createdAt: string
  updatedAt: string
}

export const STATUS_CONFIG: Record<ApplicationStatus, { label: string; color: string; bg: string; border: string }> = {
  APPLIED:      { label: 'Applied',      color: '#60A5FA', bg: '#60A5FA1A', border: '#60A5FA33' },
  PHONE_SCREEN: { label: 'Phone Screen', color: '#A78BFA', bg: '#A78BFA1A', border: '#A78BFA33' },
  INTERVIEWING: { label: 'Interviewing', color: '#F59E0B', bg: '#F59E0B1A', border: '#F59E0B33' },
  OFFERED:      { label: 'Offered',      color: '#22D3A5', bg: '#22D3A51A', border: '#22D3A533' },
  REJECTED:     { label: 'Rejected',     color: '#F43F5E', bg: '#F43F5E1A', border: '#F43F5E33' },
  WITHDRAWN:    { label: 'Withdrawn',    color: '#6B7280', bg: '#6B72801A', border: '#6B728033' },
}
