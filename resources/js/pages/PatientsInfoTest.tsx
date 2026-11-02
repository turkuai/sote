import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useServerGridLabels } from '../hooks/useCurrentLanguage';
import { useTranslation } from "react-i18next";
/**
 * Patient info page.
 * Route: /patients/:patientId/info (see resources/js/app.tsx).
 * loads all info based on the patientId
 */

type Patient = {
  id: number;
  first_name: string;
  last_name: string;
  social_id: string;
  arrival_date?: string | null;
  remarks?: string | null;
};

export default function PatientInfo() {
  const { patientId } = useParams<{ patientId: string }>();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!patientId) {
      setError("Patient ID is missing.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function fetchPatient() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/patients/${patientId}`, {
          credentials: "include",
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Patient not found."
              : "Could not load patient information."
          );
        }
        
        const result = await response.json();
        setPatient(result.data ?? result);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchPatient();
    return () => controller.abort();
  }, [patientId]);

  if (loading) return <p>Loading patient information...</p>;
  if (error) return <p role="alert">{error}</p>;
  if (!patient) return <p>Patient not found.</p>;
  const { t } = useTranslation();
  return (
    <main>
      
      <div className="admin-content-area">
      <div className="admin-content-card">
        <h1>{patient.first_name} {patient.last_name}</h1>
        <p><strong>Social ID:</strong> {patient.social_id}</p>
        <p><strong>Arrival date:</strong> {patient.arrival_date || "Not provided"}</p>
        <p><strong>Address:</strong>{patient.address || "Not provided"}</p>
        <p><strong>Phone:</strong>{patient.phone || "Not provided"}</p>
        <p><strong>Remarks:</strong> {patient.remarks || "No remarks"}</p>
        <p><strong>Job:</strong> {patient.job || "Not provided"}</p>
      </div>
      </div>
    </main>
  );
}