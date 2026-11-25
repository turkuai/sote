import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPatient, type Patient } from "../clientapi/fetchpatient";
import { useTranslation } from "react-i18next";

/**
 * Patient info page.
 * Route: /patients/:patientId/info (see resources/js/app.tsx).
 * Loads all info based on the patientId.
 */

export default function PatientInfo() {
  const { patientId } = useParams<{ patientId: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorKey, setErrorKey] = useState<string | null>(null);

  const { t } = useTranslation();

  useEffect(() => {
    if (!patientId) {
      setErrorKey("patientInfo.errors.idMissing");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setErrorKey(null);
      try {
        const data = await fetchPatient(patientId!, controller.signal);
        setPatient(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setErrorKey("patientInfo.errors.loadFailed");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [patientId]);

  if (loading) {
    return <p>{t("patientInfo.loading")}</p>;
  }
  if (errorKey) {
    return <p role="alert">{t(errorKey)}</p>;
  }
  if (!patient) {
    return <p>{t("patientInfo.errors.notFound")}</p>;
  }

  return (
    <main>
      <div className="admin-content-area">
        <div className="admin-content-card">
          <h1>
            {patient.first_name} {patient.last_name}
          </h1>
          <p><strong>{t("patientInfo.socialId")}:</strong> {patient.social_id}</p>
          <p><strong>{t("patientInfo.arrivalDate")}:</strong> {patient.arrival_date || t("patientInfo.notProvided")}</p>
          <p><strong>{t("patientInfo.address")}:</strong> {patient.address || t("patientInfo.notProvided")}</p>
          <p><strong>{t("patientInfo.phone")}:</strong> {patient.phone || t("patientInfo.notProvided")}</p>
          <p><strong>{t("patientInfo.job")}:</strong> {patient.job || t("patientInfo.notProvided")}</p>
          <p><strong>{t("patientInfo.remarks")}:</strong> {patient.remarks || t("patientInfo.noRemarks")}</p>
        </div>
      </div>
    </main>
  );
}