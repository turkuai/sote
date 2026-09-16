import { CareTree } from '@/components/Treecomponents/CareTree';
import './Admin.css';

export default function PatientsPage() {
  return (
    <div
      className="admin-content"
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', background: '#fff', padding: '20px' }}
    >
      <div style={{ textAlign: 'center' }}>
        <h1>Patients</h1>
        <p>Patients page content goes here...</p>
        <div style={{ fontSize: '20px', fontWeight: '700', textAlign: 'left' }}>Hoidon tarve:</div>
        <CareTree
          data={{
            category: [
              'Erittäminen - ruuansulatukseen, virtsateiden toimintaan, verenvuotoon ja muuhun erittämiseen liittyvät osatekijät',
              'Ulostamiseen liittyvä häiriö',
              'Ummetus',
            ],

            description: {
              id: 12,
              category_id: 3,
              user: 'Hoitaja A',
              patient_id: 99,
              description: 'Vatsa ei ole toiminut kahteen päivään...',
              creation_at: '06:20',
            },

            hoitotavoite: [
              {
                id: 1,
                problem_id: 12,
                description: 'Lorem ipsum dolor sit amet',
                user: 'Hoitaja A',
                created_at: '08:20',
                type: 0,
              },
              {
                id: 2,
                problem_id: 12,
                description: 'Lorem ipsum dolor sit amet',
                user: 'Hoitaja A',
                created_at: '08:20',
                type: 0,
              },
              {
                id: 3,
                problem_id: 12,
                description: 'Lorem ipsum dolor sit amet',
                user: 'Hoitaja A',
                created_at: '08:20',
                type: 1,
              },
              {
                id: 4,
                problem_id: 12,
                description: 'Fusce non tellus ac lectus',
                user: 'Hoitaja B',
                created_at: '05:34',
                type: 1,
              },
              {
                id: 5,
                problem_id: 12,
                description: 'Lorem ipsum dolor sit amet',
                user: 'Hoitaja A',
                created_at: '12:45',
                type: 2,
              },
            ],
          }}
        />
      </div>
    </div>
  );
}
