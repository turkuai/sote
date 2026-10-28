export interface PatientProblemItem {
  id: number;
  problem_id: number;
  description: string;
  user_name: string;
  created_at: string;
  type: 'goal' | 'activity' | 'review';
}

export interface CareProblem {
  category: string[];
  id: number;
  category_id: number;
  user: string;
  patient_id: number;
  description: string;
  creation_at: string;
  planItems: PatientProblemItem[];
}
export interface CareCategory {
  name: string;
  id: number;
  parent_category_id: number | null;
}
