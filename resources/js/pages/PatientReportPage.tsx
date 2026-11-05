//import { CareTreeTest } from '@/components/treeComponents/CareTreeTest';

import CareTreeList from '@/components/treeComponents/CareTreeList';
import { CareProblem } from '@/types/caretree';

/**
 * Patient report page.
 * Route: /patients/:patientId (see resources/js/app.tsx).
 * The patient id can be read with useParams: const { patientId } = useParams();
 */
export default function PatientReportPage() {
  //dummy data
  const data: CareProblem[] = [
    {
      category: [
        'Erittäminen - ruuansulatukseen, virtsateiden toimintaan, verenvuotoon ja muuhun erittämiseen liittyvät osatekijät',
        'Ulostamiseen liittyvä häiriö',
        'Ummetus',
      ],

      id: 12,
      category_id: 3,
      user: 'Hoitaja A',
      patient_id: 99,
      description: 'Vatsa ei ole toiminut kahteen päivään...',
      creation_at: '06:20',

      planItems: [
        {
          id: 1,
          problem_id: 12,
          description: 'Lorem ipsum dolor sit amet',
          user_name: 'Hoitaja A',
          created_at: '08:20',
          type: 'goal',
        },
        {
          id: 2,
          problem_id: 12,
          description: 'Lorem ipsum dolor sit amet',
          user_name: 'Hoitaja A',
          created_at: '08:20',
          type: 'goal',
        },
        {
          id: 3,
          problem_id: 12,
          description: 'Lorem ipsum dolor sit amet',
          user_name: 'Hoitaja A',
          created_at: '08:20',
          type: 'activity',
        },
        {
          id: 4,
          problem_id: 12,
          description: 'Fusce non tellus ac lectus',
          user_name: 'Hoitaja B',
          created_at: '05:34',
          type: 'activity',
        },
        {
          id: 5,
          problem_id: 12,
          description: 'Lorem ipsum dolor sit amet',
          user_name: 'Hoitaja A',
          created_at: '12:45',
          type: 'review',
        },
      ],
    },
  ];

  return (
    <div className="admin-content-area">
      <div className="admin-content-card">
        <CareTreeList careDataList={data} />
      </div>
    </div>
  );
}
