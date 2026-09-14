import { ServerGrid as ServerGridBase } from 'tai-grid';
import 'tai-grid/style.css';
import { useNotification } from '../components/NotificationContext';
import { getApiBase } from '../config';
import './Admin.css';

const ServerGrid = ServerGridBase as React.ComponentType<any>;

export default function PatientsPage() {
  const { showNotification } = useNotification();

  return (
    <div className="admin-content" style={{ padding: '1.5rem' }}>
      <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem' }}>
        <section aria-label="Patients">
          <h1 style={{ marginTop: 0 }}>Patients</h1>
          <ServerGrid
            columns={[
              { field: 'first_name', displayName: 'First name' },
              { field: 'last_name', displayName: 'Last name' },
              { field: 'social_id', displayName: 'Social ID' },
            ]}
            path="patients"
            allowEditing={false}
            allowDelete={false}
            pageSize={10}
            showAddButton={false}
            getApiBase={getApiBase}
            showNot={showNotification}
          />
        </section>
      </div>
    </div>
  );
}
