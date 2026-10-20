import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useServerGridLabels } from '../hooks/useCurrentLanguage';
import { useNavigate } from 'react-router-dom';
import { ServerGrid } from 'tai-grid';
import 'tai-grid/style.css';
import { useNotification } from '../components/NotificationContext';
import { getApiBase } from '../config';
import './Admin.css';

export default function PatientsTab({ currentUser, query, onQueryChange }) {
  const { showNotification } = useNotification();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Row action: open the patient report page (route defined in app.tsx)
  const openPatientReport = (patient) => {
    navigate(`/patients/${patient.id}`);
  };

  // Combine first_name + last_name into one displayed column
  const NameRenderer = ({ data }) => <span>{`${data?.first_name || ''} ${data?.last_name || ''}`.trim()}</span>;

  // Format arrival_date nicely, show placeholder if null
  const ArrivalDateRenderer = ({ data }) => {
    if (!data?.arrival_date) return <span>{t('patients.noArrivalDate')}</span>;
    return <span>{new Date(data.arrival_date as string).toLocaleDateString()}</span>;
  };

  const patientColumns = [
    { field: 'name', displayName: 'Name', valueGetter: (row) => `${row.first_name || ''} ${row.last_name || ''}`.trim() },
    { field: 'social_id', displayName: 'Social ID' },
    { field: 'arrival_date', displayName: 'Arrival Date' },
  ] as any;
  return (
    <div className="admin-content-area">
      <div className="admin-content-card">
        {/* Desktop view */}
        <div className="hide-on-mobile">
          <div className="tab-header">
            <h2>{t('Patients')}</h2>
          </div>
          <ServerGrid
            columns={patientColumns}
            columnRenderers={{
              name: NameRenderer,
              arrival_date: ArrivalDateRenderer,
            }}
            path="patients"
            allowEditing={false}
            allowDelete={false}
            pageSize={10}
            showAddButton={false}
            query={query}
            getApiBase={getApiBase}
            showNot={showNotification}
            labels={useServerGridLabels()}
            rowActions={[
              {
                icon: <ChevronRight size={20} className="w-5 h-5 block text-slate-800" />,
                tooltip: t('groups.manageUsers'),
                onClick: openPatientReport,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
