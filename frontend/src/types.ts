export type UserRole = 'student' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  created_at: string;
}

export type IssueStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Closed';

export type PriorityLevel = 'Critical' | 'High' | 'Medium' | 'Low';
export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export type IssueCategory =
  | 'Electrical'
  | 'Plumbing'
  | 'Infrastructure'
  | 'Furniture'
  | 'Cleaning and Hygiene'
  | 'Internet and Networking'
  | 'Laboratory Equipment'
  | 'Other';

export interface StatusHistoryItem {
  id: number;
  report_id: string;
  old_status?: string | null;
  new_status: string;
  updated_by: string;
  comment?: string | null;
  created_at: string;
}

export interface DuplicateSuggestionItem {
  id: number;
  report_id: string;
  matching_report_id: string;
  similarity_score: number;
  text_similarity: number;
  location_match: boolean;
  category_match: boolean;
  review_status: 'pending' | 'confirmed' | 'rejected';
  created_at: string;
  // Detail snapshot
  source_title?: string;
  source_description?: string;
  source_building?: string;
  source_room?: string;
  source_category?: string;
  source_status?: string;
  source_severity?: string;
  matching_title?: string;
  matching_description?: string;
  matching_building?: string;
  matching_room?: string;
  matching_category?: string;
  matching_status?: string;
  matching_severity?: string;
}

export interface ReportItem {
  id: string;
  user_id: number;
  title: string;
  description: string;
  category: IssueCategory;
  building: string;
  floor: string;
  room: string;
  image_path?: string | null;
  severity: SeverityLevel;
  priority: PriorityLevel;
  suggested_priority: PriorityLevel;
  priority_reason?: string | null;
  is_priority_overridden: boolean;
  status: IssueStatus;
  assigned_team?: string | null;
  is_urgent: boolean;
  created_at: string;
  updated_at: string;
  resolved_at?: string | null;
  user_name?: string;
  user_email?: string;
  user_department?: string;
  duplicate_count?: number;
  status_history?: StatusHistoryItem[];
  potential_duplicates?: DuplicateSuggestionItem[];
}

export interface CategoryStat {
  category: string;
  count: number;
  resolved: number;
  pending: number;
}

export interface BuildingStat {
  building: string;
  count: number;
  critical_or_high: number;
}

export interface PriorityStat {
  priority: string;
  count: number;
}

export interface AgingBucket {
  range: string;
  count: number;
}

export interface DashboardStats {
  total_reports: number;
  pending_reports: number;
  in_progress_reports: number;
  resolved_reports: number;
  critical_reports: number;
  high_priority_reports: number;
  avg_resolution_hours: number;
  duplicate_suggestions_count: number;
  category_stats: CategoryStat[];
  building_stats: BuildingStat[];
  priority_stats: PriorityStat[];
  aging_buckets: AgingBucket[];
}

export interface StudentDashboardStats {
  total_submitted: number;
  pending: number;
  in_progress: number;
  resolved: number;
  recent_submissions: ReportItem[];
}

