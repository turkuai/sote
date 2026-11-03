import { CareTreeTest } from '@/components/Treecomponents/CareTreeTest';



/**
 * Patient report page.
 * Route: /patients/:patientId (see resources/js/app.tsx).
 * The patient id can be read with useParams: const { patientId } = useParams();
 */

export default function PatientReportPage() {
  
  return (
    <div className="admin-content-area">
      <div className="admin-content-card">
        
        <CareTreeTest />
        
        
      </div>
    </div>
  );
}
