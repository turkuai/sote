import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ServerGrid } from 'tai-grid';
import 'tai-grid/style.css';
import MobileSearchToggle from '../components/MobileSearchToggle';
import { useNotification } from '../components/NotificationContext';
import { getApiBase } from '../config';
import './Admin.css';

const SEARCH_DEBOUNCE_MS = 300;

const roleTranslationKeys = {
  nurse: 'users.roles.nurse',
  manager: 'users.roles.manager',
  admin: 'users.roles.admin',
};

/**
 * UsersTab component
 *
 * Handles the responsive user management surface with one grid instance.
 */
export default function UsersTab({ currentUser, query, onQueryChange }) {
  const [inputValue, setInputValue] = useState(query || '');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { t } = useTranslation();
  const { showNotification } = useNotification();

  const NameRenderer = ({ data }) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
      {data?.id === currentUser?.id && (
        <span title={t('users.thisIsYou')} style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }} />
      )}
      {`${data?.first_name || ''} ${data?.last_name || ''}`.trim()}
    </span>
  );

  const RoleTyleRenderer = ({ data }) => {
    const roleType = data?.role_type;
    const translationKey = roleTranslationKeys[roleType] || 'users.waitingList';
    return <span>{t(translationKey)}</span>;
  };

  useEffect(() => {
    setInputValue(query || '');
  }, [query]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
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

  return (
    <div className="users-tab">
      <div className="tab-header">
        <h2>{t('users.managementTitle')}</h2>
        <div className="user-search users-tab-search">
          <span className="search-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="6" stroke="#6b7280" strokeWidth="2" />
              <line x1="15" y1="15" x2="20" y2="20" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <input type="text" autoComplete="off" placeholder={t('users.searchPlaceholder')} value={inputValue} onChange={handleSearchChange} />
        </div>
        <MobileSearchToggle value={inputValue} onChange={handleSearchChange} placeholder={t('users.searchPlaceholder')} />
      </div>
      <ServerGrid
        columns={[
          { field: 'name', displayName: t('table.name') },
          { field: 'email', displayName: t('table.email') },
          { field: 'role_type', displayName: t('table.roleType') },
        ]}
        columnRenderers={{
          name: NameRenderer,
          role_type: RoleTyleRenderer,
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
          grid: {
            add: t('grid.add'),
            actionsHeader: t('table.actions'),
            edit: t('table.edit'),
            delete: t('table.delete'),
            previous: t('grid.pagination.previous'),
            next: t('grid.pagination.next'),
            page: t('grid.pagination.page'),
            of: t('grid.pagination.of'),
          },
          dialog: { save: t('grid.dialog.save'), cancel: t('grid.dialog.cancel'), close: t('grid.dialog.close') },
        }}
        transformEditPayload={(payload) => {
          const password = String(payload.password || '').trim();
          const confirmPassword = String(payload.confirmPassword || '').trim();
          const restPayload = { ...payload };
          delete restPayload.password;
          delete restPayload.confirmPassword;
          delete restPayload.name;
          if (!password && !confirmPassword) return restPayload;
          if (!password || !confirmPassword) throw new Error(t('users.errors.fillBothPasswordFields'));
          if (password !== confirmPassword) throw new Error(t('users.errors.passwordsDoNotMatch'));
          if (currentUser?.role_type !== 'admin') throw new Error(t('users.errors.notAllowedToChangePassword'));
          return { ...restPayload, password };
        }}
        transformAddPayload={(payload) => {
          const password = String(payload.password || '').trim();
          const confirmPassword = String(payload.confirmPassword || '').trim();
          if (password || confirmPassword) {
            if (!password || !confirmPassword) throw new Error(t('users.errors.fillBothOrLeaveEmpty'));
            if (password !== confirmPassword) throw new Error(t('users.errors.passwordsDoNotMatch'));
          }
          return {
            first_name: String(payload.first_name || '').trim(),
            last_name: String(payload.last_name || '').trim(),
            email: String(payload.email || '').trim(),
            role_type: payload.role_type || 'nurse',
            ...(password ? { password } : {}),
          };
        }}
      />
    </div>
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
