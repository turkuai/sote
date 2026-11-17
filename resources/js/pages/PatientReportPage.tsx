//import { CareTreeTest } from '@/components/treeComponents/CareTreeTest';

import { loadPatientCare } from '@/api/care';
import CareTreeList from '@/components/care/CareTreeList';
import type { CareProblem } from '@/types/caretree';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

/**
 * Patient report page.
 * Route: /patients/:patientId (see resources/js/app.tsx).
 * The patient id can be read with useParams: const { patientId } = useParams();
 */
export default function PatientReportPage() {
  const { patientId } = useParams();
  const [result, setResult] = useState<{ patientId: string; data: CareProblem[] } | { patientId: string; error: string } | null>(null);

  // Load care data for the patient selected in the URL.
  useEffect(() => {
    if (!patientId) return;

    const controller = new AbortController();
    setResult(null);

    loadPatientCare(patientId, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setResult({ patientId, data });
        }
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setResult({
            patientId,
            error: error instanceof Error ? error.message : 'Could not load patient care data.',
          });
        }
      });

    return () => controller.abort();
  }, [patientId]);

  const currentResult = result?.patientId === patientId ? result : null;

  return (
    <div className="admin-content-area">
      <div className="admin-content-card">
        {!patientId ? (
          <p role="alert">No patient was selected.</p>
        ) : !currentResult ? (
          <p role="status">Loading patient care data…</p>
        ) : 'error' in currentResult ? (
          <p role="alert">{currentResult.error}</p>
        ) : (
          <CareTreeList key={patientId} patientId={patientId} careDataList={currentResult.data} />
        )}
      </div>
    </div>
  );
}
