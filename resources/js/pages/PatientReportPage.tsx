import { CareTreeTest } from '@/components/Treecomponents/CareTreeTest';
import PatientInfo from './PatientsInfoTest';

import { Link } from "react-router-dom";
/**
 * Patient report page.
 * Route: /patients/:patientId (see resources/js/app.tsx).
 * The patient id can be read with useParams: const { patientId } = useParams();
 */
 const { patientId } = useParams();
export default function PatientReportPage() {
  
  return (
    <div className="admin-content-area">
      <div className="admin-content-card">
        
        <CareTreeTest />
        <Link to={/patients/${patient.id}/info}>Info
        
      </div>
    </div>
  );
}
