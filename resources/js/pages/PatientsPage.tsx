import { useRef, useState } from 'react';
import { ServerGrid as ServerGridBase } from 'tai-grid';
import 'tai-grid/style.css';
import { useNotification } from '../components/NotificationContext';
import { getApiBase } from '../config';
import './Admin.css';

const ServerGrid = ServerGridBase as React.ComponentType<any>;

type Patient = {
  id: number;
  first_name: string;
  last_name: string;
};

type Group = {
  id: number;
  name: string;
};

export default function PatientsPage() {
  const { showNotification } = useNotification();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [assignedGroups, setAssignedGroups] = useState<Group[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const [groupsError, setGroupsError] = useState(false);
  const selectedRequest = useRef(0);

  const handlePatientRowClick = async (patient: Patient) => {
    const requestId = ++selectedRequest.current;

    setSelectedPatient(patient);
    setAssignedGroups([]);
    setGroupsError(false);
    setIsLoadingGroups(true);

    try {
      const response = await fetch(`${getApiBase()}/api/patients/${patient.id}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Unable to load patient groups');
      }

      const payload = await response.json();
      const groups = payload?.data?.user_groups ?? [];

      if (requestId === selectedRequest.current) {
        setAssignedGroups(Array.isArray(groups) ? groups : []);
      }
    } catch {
      if (requestId === selectedRequest.current) {
        setGroupsError(true);
        showNotification('Unable to load the patient’s assigned groups.', 'error');
      }
    } finally {
      if (requestId === selectedRequest.current) {
        setIsLoadingGroups(false);
      }
    }
  };

  return (
    <div className="admin-content" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', gap: 0, alignItems: 'stretch', minHeight: '400px', background: '#fff', borderRadius: '12px' }}>
        <section style={{ flex: '1 1 50%', minWidth: 0, paddingRight: '1.5rem' }} aria-label="Patients">
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
            onRowClick={handlePatientRowClick}
          />
        </section>

        <div style={{ width: '1px', background: '#e5e7eb', flexShrink: 0 }} />

        <aside style={{ flex: '1 1 50%', minWidth: 0, paddingLeft: '1.5rem' }} aria-live="polite">
          <h2 style={{ marginTop: 0 }}>Groups assigned</h2>

          {!selectedPatient && <p style={{ color: '#6b7280', fontStyle: 'italic' }}>Select a patient to view assigned groups.</p>}

          {selectedPatient && (
            <>
              <p style={{ color: '#374151', fontWeight: 600 }}>
                {selectedPatient.first_name} {selectedPatient.last_name}
              </p>
              {isLoadingGroups && <p style={{ color: '#6b7280' }}>Loading groups...</p>}
              {!isLoadingGroups && groupsError && <p style={{ color: '#b91c1c' }}>Unable to load assigned groups.</p>}
              {!isLoadingGroups && !groupsError && assignedGroups.length === 0 && (
                <p style={{ color: '#6b7280', fontStyle: 'italic' }}>No groups assigned.</p>
              )}
              {!isLoadingGroups && !groupsError && assignedGroups.length > 0 && (
                <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                  {assignedGroups.map((group) => (
                    <li key={group.id} style={{ marginBottom: '0.5rem' }}>
                      {group.name}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
