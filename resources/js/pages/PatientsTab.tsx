import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ServerGrid } from 'tai-grid';
import 'tai-grid/style.css';
import { useNotification } from '../components/NotificationContext';
import { getApiBase } from '../config';
import './Admin.css';

export default function PatientsTab({ currentUser, query }) {
  const { showNotification } = useNotification();
  const { t } = useTranslation();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [assignedGroups, setAssignedGroups] = useState([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const [groupsError, setGroupsError] = useState(false);
  const selectedRequest = useRef(0);

  const handlePatientRowClick = async (patient) => {
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
  const NameRenderer = ({ data }) => {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
        {`${data?.first_name || ''} ${data?.last_name || ''}`.trim()}
      </span>
    );
  };

  return (
    <>
      <ServerGrid
        columns={[
          { field: 'name', displayName: t('table.name') },
          { field: 'remarks', displayName: t('table.remarks') },
        ]}
        columnRenderers={{
          name: NameRenderer,
        }}
        path="patients"
        allowEditing={currentUser?.role_type === 'admin'}
        allowDelete={currentUser?.role_type === 'admin'}
        pageSize={10}
        query={query}
        showAddButton={true}
        showNot={showNotification}
        getApiBase={getApiBase}
        onRowClick={handlePatientRowClick}
      />

      <section style={{ marginTop: '1.5rem', borderTop: '1px solid #e5e7eb', paddingTop: '1.25rem' }} aria-live="polite">
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
      </section>
    </>
  );
}
