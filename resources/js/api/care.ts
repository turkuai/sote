import { getApiBase } from '@/config';
import type { CareCategory, CareProblem, PatientProblemItem } from '@/types/caretree';

async function getCareData(path: string, signal?: AbortSignal): Promise<ApiCareCategory[] | ApiCareProblem[]> {
  const base = getApiBase().replace(/\/+$/, '');
  const response = await fetch(`${base}/api/care/${path}`, {
    credentials: 'include',
    headers: { Accept: 'application/json' },
    signal,
  });

  const result = await response.json().catch(() => null);

  if (!response.ok || result?.success !== true) {
    throw new Error(result?.message || `Could not load care data (${response.status}).`);
  }

  return result.data;
}

export function fetchPatientCareProblems(patientId: string, signal?: AbortSignal) {
  return getCareData(encodeURIComponent(patientId), signal);
}

export function fetchCareCategories(signal?: AbortSignal) {
  return getCareData('categories', signal);
}

type ApiCareCategory = CareCategory & {
  children?: ApiCareCategory[];
};

export async function loadCareCategories(signal?: AbortSignal): Promise<CareCategory[]> {
  const categories = await fetchCareCategories(signal);

  if (!Array.isArray(categories)) {
    throw new Error('The server did not return a category list.');
  }

  function flattenCategories(categoryList: ApiCareCategory[]): CareCategory[] {
    return categoryList.flatMap(({ id, name, parent_category_id, children }) => [
      { id, name, parent_category_id },
      ...flattenCategories(children ?? []),
    ]);
  }

  return flattenCategories(categories as ApiCareCategory[]);
}

type ApiCareItem = Omit<PatientProblemItem, 'user_name'>;

type ApiCareProblem = {
  id: number;
  category_id: number;
  patient_id: number;
  description: string;
  created_at: string;
  author?: {
    first_name: string;
    last_name: string;
  } | null;
  items: ApiCareItem[];
};

function buildCategoryPaths(categories: ApiCareCategory[], parentPath: string[] = [], paths = new Map<number, string[]>()) {
  for (const category of categories) {
    const path = [...parentPath, category.name];
    paths.set(category.id, path);
    buildCategoryPaths(category.children ?? [], path, paths);
  }

  return paths;
}

export async function loadPatientCare(patientId: string, signal?: AbortSignal): Promise<CareProblem[]> {
  const [problems, categories] = await Promise.all([fetchPatientCareProblems(patientId, signal), fetchCareCategories(signal)]);

  if (!Array.isArray(problems) || !Array.isArray(categories)) {
    throw new Error('The server returned unexpected care data.');
  }

  const categoryPaths = buildCategoryPaths(categories as ApiCareCategory[]);

  return (problems as ApiCareProblem[]).map((problem) => ({
    id: problem.id,
    category_id: problem.category_id,
    patient_id: problem.patient_id,
    description: problem.description,
    category: categoryPaths.get(problem.category_id) ?? [],
    user: problem.author ? `${problem.author.first_name} ${problem.author.last_name}`.trim() : '',
    creation_at: problem.created_at,
    planItems: problem.items.map((item) => ({
      ...item,
      user_name: '',
    })),
  }));
}

async function postCareData(path: string, payload: object): Promise<ApiCareItem | Omit<ApiCareProblem, 'items'>> {
  const base = getApiBase().replace(/\/+$/, '');
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

  const response = await fetch(`${base}/api/care/${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': csrfToken,
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok || result?.success !== true) {
    throw new Error(result?.message || `Could not save care data (${response.status}).`);
  }

  return result.data;
}

export async function saveCareProblemItem(problemId: number, description: string, type: PatientProblemItem['type']): Promise<PatientProblemItem> {
  const item = (await postCareData('problem/item', {
    problem_id: problemId,
    description,
    type,
  })) as ApiCareItem;

  return { ...item, user_name: '' };
}

export async function saveCareProblem(patientId: number, categoryId: number, description: string, categoryPath: string[]): Promise<CareProblem> {
  const problem = (await postCareData('problem', {
    patient_id: patientId,
    category_id: categoryId,
    description,
  })) as Omit<ApiCareProblem, 'items'>;

  return {
    id: problem.id,
    patient_id: problem.patient_id,
    category_id: problem.category_id,
    description: problem.description,
    category: categoryPath,
    user: problem.author ? `${problem.author.first_name} ${problem.author.last_name}`.trim() : '',
    creation_at: problem.created_at,
    planItems: [],
  };
}
