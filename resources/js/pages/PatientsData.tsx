import { AuthorizedUserData } from '@/types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ServerGrid } from 'tai-grid';
import 'tai-grid/style.css';
import MobileSearchToggle from '../components/MobileSearchToggle';
import { useNotification } from '../components/NotificationContext';
import { getApiBase } from '../config';
import './Admin.css';

type PatientsDataProps = {
  currentUser: AuthorizedUserData;
  query: string;
  onQueryChange: (value: string) => void;
};

const SEARCH_DEBOUNCE_MS = 300;

export default function PatientsData(props: PatientsDataProps) {
  const [refreshKey, setRefreshKey] = React.useState(0);
  const debounceRef = React.useRef(null);
  const [inputValue, setInputValue] = React.useState(props.query || '');
  const { showNotification } = useNotification();
  const { t } = useTranslation();

  React.useEffect(() => {
    setInputValue(props.query);
  }, [props.query]);

  // Debounce: only call onQueryChange 300ms after last keystroke
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
      props.onQueryChange(value);
    }, SEARCH_DEBOUNCE_MS);
  };

  React.useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <>
      <div className="mobile-tab-content hide-on-desktop">
        <div className="mobile-content-section">
          <h2>{t('patients.patient_title')}</h2>
          <MobileSearchToggle
            value={inputValue}
            onChange={handleSearchChange}
          />
          <div style={{ height: '500px', width: '100%' }}>
            <ServerGrid
              key={refreshKey}
              columns={[
                { field: 'first_name', displayName: t('patients.form.firstName') },
                { field: 'last_name', displayName: t('patients.form.lastName') },
                { field: 'social_id', displayName: t('patients.form.socialID') },
                { field: 'arrival_date', displayName: t('patients.form.arrivalDate') },
                { field: 'remarks', displayName: t('patients.form.remarks') },
              ]}
              path="patients"
              allowEditing={props.currentUser?.role_type === 'admin'}
              allowDelete={props.currentUser?.role_type === 'admin'}
              pageSize={10}
              showAddButton={props.currentUser?.role_type === 'admin'}
              query={props.query}
              formComponent={UsersForm}
              getApiBase={getApiBase}
              showNot={showNotification}
              // labels={{
              //   loading: t('grid.loading'),
              //   add: t('grid.add'),
              //   updateFailed: t('grid.errors.updateFailed'),
              //   itemUpdated: t('grid.success.itemUpdated'),
              //   listViewRequiresProps: t('grid.errors.listViewRequiresProps'),
              //   confirmDeleteTitle: t('grid.confirmDelete.title'),
              //   confirmDeleteMessage: t('grid.confirmDelete.message'),
              //   confirmDeleteLabel: t('grid.confirmDelete.delete'),
              //   deletingLabel: t('grid.confirmDelete.deleting'),
              //   cancelLabel: t('grid.confirmDelete.cancel'),
              //   editTitle: t('grid.dialog.edit'),
              //   addTitle: t('grid.dialog.add'),
              //   grid: {
              //     actionsHeader: t('table.actions'),
              //     edit: t('table.edit'),
              //     delete: t('table.delete'),
              //     previous: t('grid.pagination.previous'),
              //     next: t('grid.pagination.next'),
              //     page: t('grid.pagination.page'),
              //     of: t('grid.pagination.of'),
              //   },
              //   dialog: {
              //     save: t('grid.dialog.save'),
              //     cancel: t('grid.dialog.cancel'),
              //     close: t('grid.dialog.close'),
              //   },
              // }}
              transformEditPayload={(payload) => {
                const password = String(payload.password || '').trim();
                const confirmPassword = String(payload.confirmPassword || '').trim();
                const isAdmin = props.currentUser?.role_type === 'admin';

                // Clone payload and remove virtual/password fields
                const { password: _p, confirmPassword: _cp, name: _n, ...restPayload } = payload;

                // If both password fields empty, just return other fields
                if (!password && !confirmPassword) {
                  return restPayload;
                }

                // If only one password field filled, error
                if (!password || !confirmPassword) {
                  throw new Error(t('users.errors.fillBothPasswordFields'));
                }

                // If passwords don't match, error
                if (password !== confirmPassword) {
                  throw new Error(t('users.errors.passwordsDoNotMatch'));
                }

                // Admins can change passwords
                if (isAdmin) {
                  return { ...restPayload, password };
                }

                // Non-admins don't edit users here
                throw new Error(t('users.errors.notAllowedToChangePassword'));
              }}
              transformAddPayload={(payload) => {
                const first_name = String(payload.first_name || '').trim();
                const last_name = String(payload.last_name || '').trim();
                const social_id = String(payload.social_id || '').trim();
                const arrival_date = String(payload.arrival_date || '');
                const remarks = String(payload.remarks);

                const payloadOut: any = {
                  first_name,
                  last_name,
                  social_id,
                  arrival_date,
                  remarks,
                };

                return payloadOut;
              }}
            />
          </div>
        </div>
      </div>

      {/* Desktop view */}
      <div className="hide-on-mobile">
        <div className="tab-header">
          <h2>{t('patients.patient_title')}</h2>
          <div className="user-search">
            <span className="search-icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="6"
                  stroke="#6b7280"
                  strokeWidth="2"
                />
                <line
                  x1="15"
                  y1="15"
                  x2="20"
                  y2="20"
                  stroke="#6b7280"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <input
              type="text"
              autoComplete="off"
              placeholder={t('users.searchPlaceholder')}
              value={inputValue}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <ServerGrid
          key={refreshKey}
          columns={[
            { field: 'first_name', displayName: t('patients.form.firstName') },
            { field: 'last_name', displayName: t('patients.form.lastName') },
            { field: 'social_id', displayName: t('patients.form.socialID') },
            { field: 'arrival_date', displayName: t('patients.form.arrivalDate') },
            { field: 'remarks', displayName: t('patients.form.remarks') },
          ]}
          // columnRenderers={{
          //   name: NameRenderer,
          // }}
          path="patients"
          allowEditing={props.currentUser?.role_type === 'admin'}
          allowDelete={props.currentUser?.role_type === 'admin'}
          pageSize={10}
          showAddButton={props.currentUser?.role_type === 'admin'}
          query={props.query}
          formComponent={UsersForm}
          getApiBase={getApiBase}
          showNot={showNotification}
          // labels={{
          //   loading: t('grid.loading'),
          //   add: t('grid.add'),
          //   updateFailed: t('grid.errors.updateFailed'),
          //   itemUpdated: t('grid.success.itemUpdated'),
          //   listViewRequiresProps: t('grid.errors.listViewRequiresProps'),
          //   confirmDeleteTitle: t('grid.confirmDelete.title'),
          //   confirmDeleteMessage: t('grid.confirmDelete.message'),
          //   confirmDeleteLabel: t('grid.confirmDelete.delete'),
          //   deletingLabel: t('grid.confirmDelete.deleting'),
          //   cancelLabel: t('grid.confirmDelete.cancel'),
          //   editTitle: t('grid.dialog.edit'),
          //   addTitle: t('grid.dialog.add'),
          //   grid: {
          //     actionsHeader: t('table.actions'),
          //     edit: t('table.edit'),
          //     delete: t('table.delete'),
          //     previous: t('grid.pagination.previous'),
          //     next: t('grid.pagination.next'),
          //     page: t('grid.pagination.page'),
          //     of: t('grid.pagination.of'),
          //   },
          //   dialog: {
          //     save: t('grid.dialog.save'),
          //     cancel: t('grid.dialog.cancel'),
          //     close: t('grid.dialog.close'),
          //   },
          // }}
          transformEditPayload={(payload) => {
            const password = String(payload.password || '').trim();
            const confirmPassword = String(payload.confirmPassword || '').trim();
            const isAdmin = props.currentUser?.role_type === 'admin';

            // Clone payload and remove virtual/password fields
            const { password: _p, confirmPassword: _cp, name: _n, ...restPayload } = payload;

            // If both empty, return other fields
            if (!password && !confirmPassword) {
              return restPayload;
            }

            // If only one filled, error
            if (!password || !confirmPassword) {
              throw new Error(t('users.errors.fillBothPasswordFields'));
            }

            // If passwords don't match, error
            if (password !== confirmPassword) {
              throw new Error(t('users.errors.passwordsDoNotMatch'));
            }

            // Admins can change passwords
            if (isAdmin) {
              return { ...restPayload, password };
            }
            throw new Error(t('users.errors.notAllowedToChangePassword'));
          }}
          transformAddPayload={(payload) => {
            const first_name = String(payload.first_name || '').trim();
            const last_name = String(payload.last_name || '').trim();
            const social_id = String(payload.social_id || '').trim();
            const arrival_date = String(payload.arrival_date || '');
            const remarks = String(payload.remarks);

            const payloadOut: any = {
              first_name,
              last_name,
              social_id,
              arrival_date,
              remarks,
            };

            return payloadOut;
          }}
        />
      </div>
    </>
  );
}

function UsersForm({ data, setData }) {
  const { t } = useTranslation();
  const isEditing = !!(data && data.id);
  const getValue = (field) => (data && data[field]) || '';
  const handleChange = (field) => (e) => setData((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="add-user-form">
      <div className="add-user-form-grid">
        <div>
          <label className="form-label">{t('patients.form.firstName')}</label>
          <input
            type="text"
            className="form-input"
            value={getValue('first_name')}
            onChange={handleChange('first_name')}
          />
        </div>
        <div>
          <label className="form-label">{t('patients.form.lastName')}</label>
          <input
            type="text"
            className="form-input"
            value={getValue('last_name')}
            onChange={handleChange('last_name')}
          />
        </div>
        <div>
          <label className="form-label">{t('patients.form.socialID')}</label>
          <input
            type="text"
            className="form-input"
            value={getValue('social_id')}
            onChange={handleChange('social_id')}
          />
        </div>
        <div>
          <label className="form-label">{t('patients.form.arrivalDate')}</label>
          <input
            type="datetime-local"
            className="form-input"
            value={getValue('arrival_date')}
            onChange={handleChange('arrival_date')}
          />
        </div>
        <div>
          <label className="form-label">{t('patients.form.remarks')}</label>
          <input
            type="textarea"
            className="form-input"
            value={getValue('remarks')}
            onChange={handleChange('remarks')}
          />
        </div>
      </div>
    </div>
  );
}
