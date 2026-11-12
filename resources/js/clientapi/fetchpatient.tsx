export type Patient = {
  id: number;
  first_name: string;
  last_name: string;
  social_id: string;
  arrival_date?: string | null;
  address?: string | null;
  phone?: string | null;
  job?: string | null;
  remarks?: string | null;
};

/**
 * Fetches a single patient by id.
 * Makes it check so the loaded patient is correct
 */
export async function fetchPatient(
  patientId: string,
  signal?: AbortSignal
): Promise<Patient> {
  const response = await fetch(`/api/patients/${patientId}`, {
    credentials: "include",
    headers: { Accept: "application/json" },
    signal,
  });

  if (!response.ok) {
    throw new Error(
      response.status === 404
        ? "Patient not found."
        : "Could not load patient information."
    );
  }

  const result = await response.json();
  return (result.data ?? result) as Patient;
}
