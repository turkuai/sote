import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ServerGrid } from 'tai-grid';
import 'tai-grid/style.css';
import MobileSearchToggle from '../components/MobileSearchToggle';
import { useNotification } from '../components/NotificationContext';
import { getApiBase } from '../config';
import './Admin.css';

const SEARCH_DEBOUNCE_MS = 300;

/**
 * UsersTab component
 *
 * Extracted from Admin.js - handles both mobile and desktop user management views
 * Uses CSS classes for responsive visibility instead of conditional rendering
 * Search is debounced: waits 300ms after last keystroke before triggering the API.
 *
 * Props:
 * - currentUser: Current logged in user object
 * - query: Search query string (debounced value used for API)
 * - onQueryChange: Callback function for search query changes
 * - onDeleteUser: Callback function for deleting a user
 */
export default function UsersTab({ currentUser, query, onQueryChange, onDeleteUser }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [inputValue, setInputValue] = useState(query || '');
  const debounceRef = useRef(null);
  const { showNotification } = useNotification();
  const { t } = useTranslation();

  // Sync input from parent query (e.g. when debounced update lands or initial load)
  useEffect(() => {
    setInputValue(query || '');
  }, [query]);

  // Debounce: only call onQueryChange 300ms after last keystroke
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

  // Custom renderer para combinar first_name y last_name
  const NameRenderer = ({ data }) => {
    const isYou = data?.id === currentUser?.id;
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
        {isYou && (
          <span
            title={t('users.thisIsYou')}
            style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#3b82f6',
              flexShrink: 0,
            }}
          />
        )}
        {`${data?.first_name || ''} ${data?.last_name || ''}`.trim()}
      </span>
    );
  };

  // Custom renderer para role_type - mostrar "Waiting list" si es null
  const RoleTypeRenderer = ({ data }) => <span>{data?.role_type || t('users.waitingList')}</span>;

  return (
    <>
      {/* Mobile view - same ServerGrid and add popup as desktop (all fields: first_name, last_name, email, role) */}
      <div className="mobile-tab-content hide-on-desktop">
        <div className="mobile-content-section">
          <h2>{t('tabs.users')}</h2>
          <MobileSearchToggle value={inputValue} onChange={handleSearchChange} />
          <div style={{ height: '500px', width: '100%' }}>
            <ServerGrid
              key={refreshKey}
              columns={[
                { field: 'name', displayName: t('table.name') },
                { field: 'email', displayName: t('table.email') },
                { field: 'role_type', displayName: t('table.roleType') },
              ]}
              columnRenderers={{
                name: NameRenderer,
              }}
              path="users"
              allowEditing={currentUser?.role_type === 'admin'}
              allowDelete={currentUser?.role_type === 'admin'}
              pageSize={10}
              showAddButton={currentUser?.role_type === 'admin'}
              query={query}
              formComponent={UsersForm}
              getApiBase={getApiBase}
              showNot={showNotification}
              labels={{
                loading: t('grid.loading'),
                add: t('grid.add'),
                updateFailed: t('grid.errors.updateFailed'),
                itemUpdated: t('grid.success.itemUpdated'),
                listViewRequiresProps: t('grid.errors.listViewRequiresProps'),
                confirmDeleteTitle: t('grid.confirmDelete.title'),
                confirmDeleteMessage: t('grid.confirmDelete.message'),
                confirmDeleteLabel: t('grid.confirmDelete.delete'),
                deletingLabel: t('grid.confirmDelete.deleting'),
                cancelLabel: t('grid.confirmDelete.cancel'),
                editTitle: t('grid.dialog.edit'),
                addTitle: t('grid.dialog.add'),
                saveLabel: t('grid.dialog.save'),
                closeLabel: t('grid.dialog.close'),
                previousLabel: t('grid.pagination.previous'),
                nextLabel: t('grid.pagination.next'),
                pageLabel: t('grid.pagination.page'),
                ofLabel: t('grid.pagination.of'),
                actionsHeader: t('table.actions'),
                edit: t('table.edit'),
                delete: t('table.delete'),
                previous: t('grid.pagination.previous'),
                next: t('grid.pagination.next'),
                page: t('grid.pagination.page'),
                of: t('grid.pagination.of'),
              }}
              transformEditPayload={(payload) => {
                const password = String(payload.password || '').trim();
                const confirmPassword = String(payload.confirmPassword || '').trim();
                const isAdmin = currentUser?.role_type === 'admin';

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
                const email = String(payload.email || '').trim();
                const first = String(payload.first_name || '').trim();
                const last = String(payload.last_name || '').trim();
                const password = String(payload.password || '').trim();
                const confirmPassword = String(payload.confirmPassword || '').trim();

                if (password || confirmPassword) {
                  if (!password || !confirmPassword) {
                    throw new Error(t('users.errors.fillBothOrLeaveEmpty'));
                  }
                  if (password !== confirmPassword) {
                    throw new Error(t('users.errors.passwordsDoNotMatch'));
                  }
                }

                const payloadOut: any = {
                  first_name: first,
                  last_name: last,
                  email,
                  role_type: payload.role_type || 'nurse',
                };

                // Only send password when admin actually set one
                if (password) {
                  payloadOut.password = password;
                }

                return payloadOut;
              }}
            />
          </div>
        </div>
      </div>

      {/* Desktop view */}
      <div className="hide-on-mobile">
        <h2>{t('users.managementTitle')}</h2>

        <div className="user-search">
          <span className="search-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="6" stroke="#6b7280" strokeWidth="2" />
              <line x1="15" y1="15" x2="20" y2="20" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <input type="text" autoComplete="off" placeholder={t('users.searchPlaceholder')} value={inputValue} onChange={handleSearchChange} />
        </div>
        <ServerGrid
          key={refreshKey}
          columns={[
            { field: 'name', displayName: t('table.name') },
            { field: 'email', displayName: t('table.email') },
            { field: 'role_type', displayName: t('table.roleType') },
          ]}
          columnRenderers={{
            name: NameRenderer,
          }}
          path="users"
          allowEditing={currentUser?.role_type === 'admin'}
          allowDelete={currentUser?.role_type === 'admin'}
          pageSize={10}
          showAddButton={currentUser?.role_type === 'admin'}
          query={query}
          formComponent={UsersForm}
          getApiBase={getApiBase}
          showNot={showNotification}
          labels={{
            loading: t('grid.loading'),
            add: t('grid.add'),
            updateFailed: t('grid.errors.updateFailed'),
            itemUpdated: t('grid.success.itemUpdated'),
            listViewRequiresProps: t('grid.errors.listViewRequiresProps'),
            confirmDeleteTitle: t('grid.confirmDelete.title'),
            confirmDeleteMessage: t('grid.confirmDelete.message'),
            confirmDeleteLabel: t('grid.confirmDelete.delete'),
            deletingLabel: t('grid.confirmDelete.deleting'),
            cancelLabel: t('grid.confirmDelete.cancel'),
            editTitle: t('grid.dialog.edit'),
            addTitle: t('grid.dialog.add'),
            saveLabel: t('grid.dialog.save'),
            closeLabel: t('grid.dialog.close'),
            previousLabel: t('grid.pagination.previous'),
            nextLabel: t('grid.pagination.next'),
            pageLabel: t('grid.pagination.page'),
            ofLabel: t('grid.pagination.of'),
            actionsHeader: t('table.actions'),
            edit: t('table.edit'),
            delete: t('table.delete'),
            previous: t('grid.pagination.previous'),
            next: t('grid.pagination.next'),
            page: t('grid.pagination.page'),
            of: t('grid.pagination.of'),
          }}
          transformEditPayload={(payload) => {
            const password = String(payload.password || '').trim();
            const confirmPassword = String(payload.confirmPassword || '').trim();
            const isAdmin = currentUser?.role_type === 'admin';

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
            const email = String(payload.email || '').trim();
            const first = String(payload.first_name || '').trim();
            const last = String(payload.last_name || '').trim();
            const password = String(payload.password || '').trim();
            const confirmPassword = String(payload.confirmPassword || '').trim();

            if (password || confirmPassword) {
              if (!password || !confirmPassword) {
                throw new Error(t('users.errors.fillBothOrLeaveEmpty'));
              }
              if (password !== confirmPassword) {
                throw new Error(t('users.errors.passwordsDoNotMatch'));
              }
            }

            const payloadOut: any = {
              first_name: first,
              last_name: last,
              email,
              role_type: payload.role_type || 'nurse',
            };

            if (password) {
              payloadOut.password = password;
            }

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
          <label className="form-label">{t('users.form.firstName')}</label>
          <input type="text" className="form-input" value={getValue('first_name')} onChange={handleChange('first_name')} />
        </div>
        <div>
          <label className="form-label">{t('users.form.lastName')}</label>
          <input type="text" className="form-input" value={getValue('last_name')} onChange={handleChange('last_name')} />
        </div>
        <div>
          <label className="form-label">{t('users.form.email')}</label>
          <input type="email" className="form-input" value={getValue('email')} onChange={handleChange('email')} />
        </div>
        <div>
          <label className="form-label">{t('users.form.role')}</label>
          <select className="form-select" value={getValue('role_type') || 'nurse'} onChange={handleChange('role_type')}>
            <option value="nurse">{t('users.roles.nurse')}</option>
            <option value="manager">{t('users.roles.manager')}</option>
            <option value="admin">{t('users.roles.admin')}</option>
          </select>
        </div>
        {!isEditing && (
          <>
            <div>
              <label className="form-label">{t('users.form.passwordOptional')}</label>
              <input type="password" className="form-input" value={getValue('password')} onChange={handleChange('password')} />
            </div>
            <div>
              <label className="form-label">{t('users.form.confirmPasswordOptional')}</label>
              <input type="password" className="form-input" value={getValue('confirmPassword')} onChange={handleChange('confirmPassword')} />
            </div>
          </>
        )}

        {isEditing && (
          <>
            <div style={{ gridColumn: '1 / -1', fontSize: '0.875rem', color: '#6b7280' }}>{t('users.form.passwordHint')}</div>
            <div>
              <label className="form-label">{t('users.form.password')}</label>
              <input
                type="password"
                className="form-input"
                value={getValue('password')}
                onChange={handleChange('password')}
                placeholder={t('users.form.newPasswordPlaceholder')}
              />
            </div>
            <div>
              <label className="form-label">{t('users.form.confirmPassword')}</label>
              <input
                type="password"
                className="form-input"
                value={getValue('confirmPassword')}
                onChange={handleChange('confirmPassword')}
                placeholder={t('users.form.confirmNewPasswordPlaceholder')}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
