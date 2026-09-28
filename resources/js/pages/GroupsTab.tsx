import { Crown, Eye, EyeOff } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useServerGridLabels } from '@/hooks/useCurrentLanguage';
import { ServerGrid as ServerGridBase } from 'tai-grid';
import 'tai-grid/style.css';
import GroupRegistrationForm from '../components/GroupRegistrationForm';
import GroupUsersModal from '../components/GroupUsersModal';
import MobileSearchToggle from '../components/MobileSearchToggle';
import { useNotification } from '../components/NotificationContext';
import { getApiBase } from '../config';
import './Admin.css';
const ServerGrid = ServerGridBase as React.ComponentType<any>;

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
  const [panelGroup, setPanelGroup] = useState<Record<string, unknown> | null>(null);
  const [panelLoading, setPanelLoading] = useState(false);
  const [panelSearch, setPanelSearch] = useState('');
  const [groupPath, setGroupPath] = useState('');
  const lastPanelClickedIndex = useRef<number | null>(null);
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

  const handleSearchChange2 = (e) => {
    const value2 = e.target.value;
    setPanelSearch(value2);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
      onQueryChange(value2);
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

  const gridLabels = useServerGridLabels();

  const handleGroupRowClick = (group: Record<string, unknown>) => {
    setPanelGroup(group);
    setGroupPath(`groups/${group.id}/registered-users`);
    setPanelSearch('');
    lastPanelClickedIndex.current = null;

    setPanelLoading(true);
    fetch(`${getApiBase()}/api/groups/${group.id}/registered-users`, { credentials: 'include' })
      .then((r) => r.json())
      .then((res) => {
        const users = res?.data?.users ?? res?.users ?? [];
      })
      .catch()
      .finally(() => setPanelLoading(false));
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
            <div style={{ display: 'flex', gap: 0, alignItems: 'flex-start' }}>
              {/* Left: groups list */}
              <div style={{ flex: '0 0 50%', minWidth: 0, paddingRight: '1.5rem' }}>
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
                    onRowClick={handleGroupRowClick}
                    labels={gridLabels}
                  />
                )}
              </div>
              {/* Divider */}
              <div style={{ width: '1px', background: '#e5e7eb', alignSelf: 'stretch', flexShrink: 0 }} />
              {/* Right: users panel */}
              <div style={{ flex: '0 0 50%', minWidth: 0, paddingLeft: '1.5rem' }}>
                {!panelGroup && (
                  <p style={{ color: '#6b7280', fontStyle: 'italic', marginTop: '4rem', textAlign: 'center' }}>{t('groups.panel.selectGroup')}</p>
                )}
                {panelGroup && (
                  <>
                    <div className="tab-header" style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'white' }}>
                      <h2>{String(panelGroup.name)}</h2>
                      <div className="user-search">
                        <span className="search-icon">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="11" cy="11" r="6" stroke="#6b7280" strokeWidth="2" />
                            <line x1="15" y1="15" x2="20" y2="20" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </span>
                        <input
                          type="search"
                          autoComplete="off"
                          placeholder={t('groups.panel.searchMembers')}
                          value={panelSearch}
                          onChange={(e) => {
                            setPanelSearch(e.target.value);
                            lastPanelClickedIndex.current = null;
                          }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                      <button className="server-grid-add-button" title={t('groups.panel.addUser')} onClick={() => handleAddUsersClick(panelGroup)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>
                    </div>
                    {panelLoading && <p style={{ color: '#6b7280' }}>{t('grid.loading')}</p>}
                    {!panelLoading && (
                      <ServerGrid
                        key={refreshKey}
                        columns={[
                          { field: 'name', displayName: t('table.name') },
                          { field: 'email', displayName: t('table.email') },
                          { field: 'role_type', displayName: t('table.role') },
                        ]}
                        path={groupPath}
                        allowEditing={false}
                        allowDelete={true}
                        pageSize={10}
                        showAddButton={false}
                        getApiBase={getApiBase}
                        showNot={showNotification}
                        labels={gridLabels}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
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
            <div style={{ display: 'flex', gap: 0, alignItems: 'flex-start' }}>
              {/* Left: groups list */}
              <div style={{ flex: '0 0 50%', minWidth: 0, paddingRight: '1.5rem' }}>
                <div className="tab-header">
                  <h2>{t('groups.managementTitle')}</h2>
                  <div className="user-search">
                    <span className="search-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="11" cy="11" r="6" stroke="#6b7280" strokeWidth="2" />
                        <line x1="15" y1="15" x2="20" y2="20" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </span>
                    <input
                      type="search"
                      autoComplete="off"
                      placeholder={t('groups.searchPlaceholder')}
                      value={inputValue}
                      onChange={handleSearchChange}
                    />
                  </div>
                  <button className="add-btn" onClick={() => setShowEnrollModal(true)}>
                    {t('groups.autoEnroll')}
                  </button>
                </div>
                <div>
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
                    onRowClick={handleGroupRowClick}
                  />
                </div>
              </div>
              {/* Divider */}
              <div style={{ width: '1px', background: '#e5e7eb', alignSelf: 'stretch', flexShrink: 0 }} />
              {/* Right: users panel */}
              <div style={{ flex: '0 0 50%', minWidth: 0, paddingLeft: '1.5rem' }}>
                {!panelGroup && (
                  <p style={{ color: '#6b7280', fontStyle: 'italic', marginTop: '4rem', textAlign: 'center' }}>{t('groups.panel.selectGroup')}</p>
                )}
                {panelGroup && (
                  <>
                    <div className="tab-header" style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'white' }}>
                      <h2>{String(panelGroup.name)}</h2>
                      <div className="user-search">
                        <span className="search-icon">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="11" cy="11" r="6" stroke="#6b7280" strokeWidth="2" />
                            <line x1="15" y1="15" x2="20" y2="20" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </span>
                        <input
                          type="search"
                          autoComplete="off"
                          placeholder={t('groups.panel.searchMembers')}
                          value={panelSearch}
                          onChange={handleSearchChange2}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                      <button className="server-grid-add-button" title={t('groups.panel.addUser')} onClick={() => handleAddUsersClick(panelGroup)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>
                    </div>
                    {panelLoading && <p style={{ color: '#6b7280' }}>{t('grid.loading')}</p>}
                    {!panelLoading && (
                      <ServerGrid
                        key={refreshKey}
                        columns={[
                          { field: 'name', displayName: t('table.name') },
                          { field: 'email', displayName: t('table.email') },
                          { field: 'role_type', displayName: t('table.role') },
                        ]}
                        path={groupPath}
                        allowEditing={false}
                        allowDelete={currentUser?.role_type === 'admin' || currentUser?.role_type === 'manager'}
                        pageSize={10}
                        query={query}
                        showAddButton={false}
                        getApiBase={getApiBase}
                        showNot={showNotification}
                        labels={gridLabels}
                      />
                    )}
                  </>
                )}
              </div>
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
            const addedToGroup = selectedGroup;
            setSelectedGroup(null);
            setRefreshKey((prev) => prev + 1);
            // Re-fetch panel members if the affected group is currently open in the panel
            if (panelGroup && addedToGroup && panelGroup.id === addedToGroup.id) {
              setPanelLoading(true);
              fetch(`${getApiBase()}/api/groups/${panelGroup.id}`, { credentials: 'include' })
                .then((r) => r.json())
                .then((res) => {
                  const users = res?.data?.users ?? res?.users ?? [];
                })
                .catch(() => {})
                .finally(() => setPanelLoading(false));
            }
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
