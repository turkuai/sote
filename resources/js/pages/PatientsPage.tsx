import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ServerGrid } from 'tai-grid';
import 'tai-grid/style.css';
import MobileSearchToggle from '../components/MobileSearchToggle';
import { useNotification } from '../components/NotificationContext';
import { getApiBase } from '../config';
import './Admin.css';

const SEARCH_DEBOUNCE_MS = 300;


export default function PatientsTab({ currentUser, query, onQueryChange }) {
  const [refreshKey] = useState(0);
  const [inputValue, setInputValue] = useState(query || '');
  const debounceRef = useRef(null);
  const { showNotification } = useNotification();
  const { t } = useTranslation();

  useEffect(() => {
    setInputValue(query || '');
  }, [query]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
      onQueryChange(value);
    }, SEARCH_DEBOUNCE_MS);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // Combine first_name + last_name into one displayed column
  const NameRenderer = ({ data }) => (
    <span>{`${data?.first_name || ''} ${data?.last_name || ''}`.trim()}</span>
  );

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
      {/* Mobile view */}
      <div className="mobile-tab-content hide-on-desktop">
        <div className="mobile-content-section">
          <h2>{t('tabs.patients')}</h2>
          <MobileSearchToggle value={inputValue} onChange={handleSearchChange} />
          <div style={{ height: '500px', width: '100%' }}>
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
              query={query}
              getApiBase={getApiBase}
              showNot={showNotification}
            />
          </div>
        </div>
      </div>

      {/* Desktop view */}
      <div className="hide-on-mobile">
        <div className="tab-header">
          <h2>{t('Patients')}</h2>
          <div className="user-search">
            <span className="search-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="6" stroke="#6b7280" strokeWidth="2" />
                <line x1="15" y1="15" x2="20" y2="20" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            <input type="text" autoComplete="off" placeholder={t('Search Patient')} value={inputValue} onChange={handleSearchChange} />
          </div>
        </div>
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
          query={query}
          getApiBase={getApiBase}
          showNot={showNotification}
        />
      </div>
    </div>
  </div>
);
}