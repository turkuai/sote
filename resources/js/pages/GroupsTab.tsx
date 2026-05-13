import { Crown, Eye, EyeOff } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ServerGrid } from 'tai-grid';
import 'tai-grid/style.css';
import GroupRegistrationForm from '../components/GroupRegistrationForm';
import GroupUsersModal from '../components/GroupUsersModal';
import MobileSearchToggle from '../components/MobileSearchToggle';
import { useNotification } from '../components/NotificationContext';
import { getApiBase } from '../config';
import './Admin.css';

function GroupNameCell({ value, data }: { value: unknown; data: Record<string, unknown> }) {
  const { t } = useTranslation();
  const isOwner = data?.is_owner === true;
  const isMember = data?.is_member === true;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
      {isOwner && (
        <span title={t('groups.youOwnThisGroup')} style={{ display: 'inline-flex' }}>
          <Crown size={14} fill="#eab308" color="#eab308" />
        </span>
      )}
      {!isOwner && isMember && (
        <span
          title={t('groups.youBelongToThisGroup')}
          style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#22c55e',
            flexShrink: 0,
          }}
        />
      )}
      {value != null ? String(value) : ''}
    </span>
  );
}

function AccessKeyCell({ value }: { value: unknown }) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const key = value != null ? String(value) : '';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
      <span>{visible ? key : '••••••••'}</span>
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center', padding: 0 }}
        title={visible ? t('groups.hideKey') : t('groups.showKey')}
      >
        {visible ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </span>
  );
}

const SEARCH_DEBOUNCE_MS = 300;

/**
 * GroupsTab component
 *
 * Handles groups/sectors management
 *
 * Props:
 * - currentUser: Current logged in user object
 * - query: Search query string (debounced value used for API)
 * - onQueryChange: Callback function for search query changes
 */
export default function GroupsTab({ currentUser, query, onQueryChange }) {
  const { t } = useTranslation();
  const [refreshKey, setRefreshKey] = useState(0);
  const [inputValue, setInputValue] = useState(query || '');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showGroupUsersModal, setShowGroupUsersModal] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [myGroupCount, setMyGroupCount] = useState<number | null>(null);
  const debounceRef = useRef(null);
  const { showNotification } = useNotification();

  // Fetch count of nurse's groups to show empty state
  useEffect(() => {
    if (currentUser?.role_type !== 'nurse') return;
    fetch(`${getApiBase()}/api/groups/my`, { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => setMyGroupCount(Array.isArray(data?.data) ? data.data.length : Array.isArray(data) ? data.length : 0))
      .catch(() => setMyGroupCount(0));
  }, [currentUser, refreshKey]);

  // Sync input from parent query
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

  const handleAddUsersClick = (group) => {
    setSelectedGroup(group);
    setShowGroupUsersModal(true);
  };

  const gridLabels = {
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
  };

  return (
    <>
      {/* Nurse view: only their own groups + enroll modal */}
      {currentUser?.role_type === 'nurse' && (
        <>
          {/* Mobile nurse view */}
          <div className="mobile-tab-content hide-on-desktop">
            <div className="mobile-content-section">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <h2 style={{ margin: 0 }}>{t('groups.noGroupsYet')}</h2>
                <button className="add-btn" onClick={() => setShowEnrollModal(true)}>
                  {t('groups.autoEnroll')}
                </button>
              </div>
              {myGroupCount === 0 && (
                <p style={{ color: '#6b7280', fontStyle: 'italic', textAlign: 'center', margin: '2rem 0' }}>{t('groups.noGroupsYet')}</p>
              )}
              {myGroupCount !== 0 && (
                <div style={{ height: '400px', width: '100%' }}>
                  <ServerGrid
                    key={refreshKey}
                    columns={['name']}
                    path="groups/my"
                    allowEditing={false}
                    allowDelete={false}
                    pageSize={10}
                    showAddButton={false}
                    getApiBase={getApiBase}
                    showNot={showNotification}
                    labels={gridLabels}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Desktop nurse view */}
          <div className="hide-on-mobile">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 style={{ margin: 0 }}>{t('groups.myGroups')}</h2>
              <button className="add-btn" onClick={() => setShowEnrollModal(true)}>
                {t('groups.autoEnroll')}
              </button>
            </div>
            {myGroupCount === 0 && (
              <p style={{ color: '#6b7280', fontStyle: 'italic', textAlign: 'center', margin: '3rem 0' }}>{t('groups.noGroupsYet')}</p>
            )}
            {myGroupCount !== 0 && (
              <ServerGrid
                key={refreshKey}
                columns={['name']}
                path="groups/my"
                allowEditing={false}
                allowDelete={false}
                pageSize={10}
                showAddButton={false}
                getApiBase={getApiBase}
                showNot={showNotification}
                labels={gridLabels}
              />
            )}
          </div>
        </>
      )}

      {/* Admin/Manager view: all groups */}
      {(currentUser?.role_type === 'admin' || currentUser?.role_type === 'manager') && (
        <>
          {/* Mobile view */}
          <div className="mobile-tab-content hide-on-desktop">
            <div className="mobile-content-section">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <h2 style={{ margin: 0 }}>{t('tabs.groups')}</h2>
                <button className="add-btn" onClick={() => setShowEnrollModal(true)}>
                  {t('groups.autoEnroll')}
                </button>
              </div>
              <MobileSearchToggle value={inputValue} onChange={handleSearchChange} />
              <div style={{ height: '500px', width: '100%' }}>
                <ServerGrid
                  key={refreshKey}
                  columns={[
                    { field: 'name', displayName: t('table.name') },
                    { field: 'access_key', displayName: t('groups.table.accessKey') },
                    { field: 'user_count', displayName: t('groups.table.userCount') },
                  ]}
                  columnRenderers={{ name: GroupNameCell, access_key: AccessKeyCell }}
                  path="groups"
                  allowEditing={currentUser?.role_type === 'admin' || currentUser?.role_type === 'manager'}
                  allowDelete={currentUser?.role_type === 'admin' || currentUser?.role_type === 'manager'}
                  pageSize={10}
                  showAddButton={currentUser?.role_type === 'admin' || currentUser?.role_type === 'manager'}
                  query={query}
                  formComponent={GroupsForm}
                  rowActions={[
                    {
                      icon: (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"
                            fill="#0891b2"
                          />
                        </svg>
                      ),
                      tooltip: t('groups.manageUsers'),
                      onClick: handleAddUsersClick,
                    },
                  ]}
                  getApiBase={getApiBase}
                  showNot={showNotification}
                  labels={gridLabels}
                  transformEditPayload={(payload) => {
                    const name = String(payload.name || '').trim();
                    if (!name) throw new Error(t('groups.errors.nameRequired'));
                    const access_key = String(payload.access_key || '').trim();
                    if (!access_key) throw new Error(t('groups.errors.accessKeyRequired'));
                    return { name, access_key };
                  }}
                  transformAddPayload={(payload) => {
                    const name = String(payload.name || '').trim();
                    if (!name) throw new Error(t('groups.errors.nameRequired'));
                    const access_key = String(payload.access_key || '').trim();
                    if (!access_key) throw new Error(t('groups.errors.accessKeyRequired'));
                    return { name, access_key };
                  }}
                />
              </div>
            </div>
          </div>

          {/* Desktop view */}
          <div className="hide-on-mobile">
            <h2>{t('groups.managementTitle')}</h2>

            <div className="user-search">
              <span className="search-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11" r="6" stroke="#6b7280" strokeWidth="2" />
                  <line x1="15" y1="15" x2="20" y2="20" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <input type="search" autoComplete="off" placeholder={t('groups.searchPlaceholder')} value={inputValue} onChange={handleSearchChange} />
            </div>
            <div style={{ position: 'relative' }}>
              <button className="add-btn" onClick={() => setShowEnrollModal(true)} style={{ position: 'absolute', top: 0, right: 50, zIndex: 1 }}>
                {t('groups.autoEnroll')}
              </button>
              <ServerGrid
                key={refreshKey}
                columns={[
                  { field: 'name', displayName: t('table.name') },
                  { field: 'access_key', displayName: t('groups.table.accessKey') },
                  { field: 'user_count', displayName: t('groups.table.userCount') },
                ]}
                columnRenderers={{ name: GroupNameCell, access_key: AccessKeyCell }}
                path="groups"
                allowEditing={currentUser?.role_type === 'admin' || currentUser?.role_type === 'manager'}
                allowDelete={currentUser?.role_type === 'admin' || currentUser?.role_type === 'manager'}
                pageSize={10}
                showAddButton={currentUser?.role_type === 'admin' || currentUser?.role_type === 'manager'}
                query={query}
                formComponent={GroupsForm}
                rowActions={[
                  {
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"
                          fill="#0891b2"
                        />
                      </svg>
                    ),
                    tooltip: t('groups.manageUsers'),
                    onClick: handleAddUsersClick,
                  },
                ]}
                getApiBase={getApiBase}
                showNot={showNotification}
                labels={gridLabels}
                transformEditPayload={(payload) => {
                  const name = String(payload.name || '').trim();
                  if (!name) throw new Error(t('groups.errors.nameRequired'));
                  const access_key = String(payload.access_key || '').trim();
                  if (!access_key) throw new Error(t('groups.errors.accessKeyRequired'));
                  return { name, access_key };
                }}
                transformAddPayload={(payload) => {
                  const name = String(payload.name || '').trim();
                  if (!name) throw new Error(t('groups.errors.nameRequired'));
                  const access_key = String(payload.access_key || '').trim();
                  if (!access_key) throw new Error(t('groups.errors.accessKeyRequired'));
                  return { name, access_key };
                }}
              />
            </div>
          </div>
        </>
      )}

      {/* Auto-enroll modal (all roles) */}
      {showEnrollModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowEnrollModal(false)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              width: '100%',
              maxWidth: '420px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>{t('groups.joinGroup')}</h3>
              <button
                type="button"
                onClick={() => setShowEnrollModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: '#6b7280', lineHeight: 1 }}
                title={t('common.close')}
              >
                ✕
              </button>
            </div>
            <GroupRegistrationForm
              onSuccess={() => {
                setShowEnrollModal(false);
                setRefreshKey((prev) => prev + 1);
              }}
            />
          </div>
        </div>
      )}

      {showGroupUsersModal && selectedGroup && (
        <GroupUsersModal
          groupId={selectedGroup.id}
          groupName={selectedGroup.name}
          onClose={() => {
            setShowGroupUsersModal(false);
            setSelectedGroup(null);
          }}
          onUserAdded={() => {
            setShowGroupUsersModal(false);
            setSelectedGroup(null);
            setRefreshKey((prev) => prev + 1);
          }}
        />
      )}
    </>
  );
}

function GroupsForm({ data, setData }) {
  const { t } = useTranslation();
  const [showKey, setShowKey] = useState(false);
  const getValue = (field) => (data && data[field]) || '';
  const handleChange = (field) => (e) => setData((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="add-user-form">
      <div className="add-user-form-grid">
        <div>
          <label className="form-label">{t('groups.form.groupName')}</label>
          <input
            type="text"
            autoComplete="nope"
            className="form-input"
            value={getValue('name')}
            onChange={handleChange('name')}
            placeholder={t('groups.form.groupNamePlaceholder')}
          />
        </div>
        <div>
          <label className="form-label">{t('groups.form.accessKey')}</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              type={showKey ? 'text' : 'password'}
              autoComplete="nope"
              className="form-input"
              value={getValue('access_key')}
              onChange={handleChange('access_key')}
              placeholder={t('groups.form.accessKeyPlaceholder')}
              style={{ paddingRight: '2.5rem' }}
            />
            <button
              type="button"
              onClick={() => setShowKey((v) => !v)}
              style={{
                position: 'absolute',
                right: '0.5rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#6b7280',
                display: 'flex',
                alignItems: 'center',
              }}
              title={showKey ? t('groups.hideKey') : t('groups.showKey')}
            >
              {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
