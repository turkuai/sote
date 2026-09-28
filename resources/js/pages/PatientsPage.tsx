import { useServerGridLabels } from '@/hooks/useCurrentLanguage';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ServerGrid } from 'tai-grid';
import 'tai-grid/style.css';
import { useNotification } from '../components/NotificationContext';
import { getApiBase } from '../config';
import './Admin.css';

const SEARCH_DEBOUNCE_MS = 300;

export default function PatientsPage({ e }) {
  const [refreshKey] = useState(0);
  const debounceRef = useRef(null);
  const { showNotification } = useNotification();
  const { t } = useTranslation();

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

        <ServerGrid
          key={refreshKey}
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
          getApiBase={getApiBase}
          showNot={showNotification}
          labels={useServerGridLabels()}
        />
      </div>
    </div>
  );
}
