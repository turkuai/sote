import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPatient, type Patient } from "../clientapi/fetchpatient";

/**
 * Patient info page.
 * Route: /patients/:patientId/info (see resources/js/app.tsx).
 * Loads all info based on the patientId.
 */
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

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchPatient(patientId!, controller.signal);
        setPatient(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [patientId]);

  if (loading) {
    return <p>Loading patient information...</p>;
  }
  if (error) {
    return <p role="alert">{error}</p>;
  }
  if (!patient) {
    return <p>Patient not found.</p>;
  }

  return (
    <main>
      <div className="admin-content-area">
        <div className="admin-content-card">
          <h1>
            {patient.first_name} {patient.last_name}
          </h1>
          <p><strong>Social ID:</strong> {patient.social_id}</p>
          <p><strong>Arrival date:</strong> {patient.arrival_date || "Not provided"}</p>
          <p><strong>Address:</strong> {patient.address || "Not provided"}</p>
          <p><strong>Phone:</strong> {patient.phone || "Not provided"}</p>
          <p><strong>Job:</strong> {patient.job || "Not provided"}</p>
          <p><strong>Remarks:</strong> {patient.remarks || "No remarks"}</p>
        </div>
      </div>
    </main>
  );
}
