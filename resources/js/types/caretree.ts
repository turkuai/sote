export interface User {
  id: number;
  name: string;
}

export interface PatientProblem {
  id: number;
  category_id: number;
  user_id: number;
  patient_id: number;
  description: string;
  creation_at: string;
}

export interface PatientProblemItem {
  id: number;
  problem_id: number;
  description: string;
  user_id: number;
  created_at: string;
  type: 0 | 1 | 2 | 3;
}

export interface FinalData {
  category: string[];
  description: {
    id: number;
    category_id: number;
    user: string;
    patient_id: number;
    description: string;
    creation_at: string;
  };
  hoitotavoite: {
    id: number;
    problem_id: number;
    description: string;
    user: string;
    created_at: string;
    type: number;
  }[];
}
