import { useServerGridLabels } from '@/hooks/useCurrentLanguage';
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
        formComponent={PatientsForm}
        showAddButton={true}
        showNot={showNotification}
        getApiBase={getApiBase}
        labels={useServerGridLabels()}
      />
    </>
  );
}

function PatientsForm({ data, setData }) {
  const { t } = useTranslation();
  const getValue = (field) => (data && data[field]) || '';
  const handleChange = (field) => (e) => setData((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="add-user-form">
      <div className="add-user-form-grid">
        <div>
          <label className="form-label">{t('table.form.firstName')}</label>
          <input type="text" className="form-input" value={getValue('first_name')} onChange={handleChange('first_name')} />
        </div>
        <div>
          <label className="form-label">{t('table.form.lastName')}</label>
          <input type="text" className="form-input" value={getValue('last_name')} onChange={handleChange('last_name')} />
        </div>
        <div>
          <label className="form-label">{t('table.form.socialId')}</label>
          <input type="text" className="form-input" value={getValue('social_id')} onChange={handleChange('social_id')} />
        </div>
        <div>
          <label className="form-label">{t('table.form.remarks')}</label>
          <input type="text" className="form-input" value={getValue('remarks')} onChange={handleChange('remarks')} />
        </div>
      </div>
    </div>
  );
}
