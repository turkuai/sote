import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

/**
 * Patient info page.
 * Route: /patients/:patientId/info (see resources/js/app.tsx).
 * Loads all info based on the patientId.
 */

type Patient = {
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

type ErrorKey = "missingId" | "notFound" | "loadFailed" | "generic";

export default function PatientInfo() {
  const { t } = useTranslation();
  const { patientId } = useParams<{ patientId: string }>();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorKey, setErrorKey] = useState<ErrorKey | null>(null);

  useEffect(() => {
    if (!patientId) {
      setErrorKey("missingId");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function fetchPatient() {
      setLoading(true);
      setErrorKey(null);
      try {
        const response = await fetch(`/api/patients/${patientId}`, {
          credentials: "include",
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });

        if (!response.ok) {
          setErrorKey(response.status === 404 ? "notFound" : "loadFailed");
          return;
        }

        const result = await response.json();
        setPatient(result.data ?? result);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setErrorKey("generic");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchPatient();
    return () => controller.abort();
  }, [patientId]);

  if (loading) return <p>{t("patientInfo.loading")}</p>;
  if (errorKey) return <p role="alert">{t(`patientInfo.errors.${errorKey}`)}</p>;
  if (!patient) return <p>{t("patientInfo.errors.notFound")}</p>;

  const na = t("patientInfo.na");

  return (
    <main>
      <div className="admin-content-area">
        <div className="admin-content-card">
          <h1>
            {patient.first_name} {patient.last_name}
          </h1>
          <p><strong>{t("patientInfo.socialId")}:</strong> {patient.social_id}</p>
          <p><strong>{t("patientInfo.arrivalDate")}:</strong> {patient.arrival_date || na}</p>
          <p><strong>{t("patientInfo.address")}:</strong> {patient.address || na}</p>
          <p><strong>{t("patientInfo.phone")}:</strong> {patient.phone || na}</p>
          <p><strong>{t("patientInfo.job")}:</strong> {patient.job || na}</p>
          <p><strong>{t("patientInfo.remarks")}:</strong> {patient.remarks || t("patientInfo.noRemarks")}</p>
        </div>
      </div>
    </main>
  );
}