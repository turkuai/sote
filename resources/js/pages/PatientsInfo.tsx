import { fetchPatient, type Patient } from "../api/fetchPatient";

useEffect(() => {
  if (!patientId) {
    setError("Patient ID is missing.");
    setLoading(false);
    return;
  }

  const controller = new AbortController();
  setLoading(true);
  setError("");

  fetchPatient(patientId, controller.signal)
    .then(setPatient)
    .catch((err) => {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Something went wrong.");
    })
    .finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });

  return () => controller.abort();
}, [patientId]);

    if (loading) { 
      return(
      <p>Loading patient information...</p>
      );
    }
    if (error) {
      return(
      <p role="alert">{error}</p>
      );
    }
    if (!patient) {
      return(
      <p>Patient not found.</p>
      );
    }

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
