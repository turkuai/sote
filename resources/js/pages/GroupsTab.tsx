import { useServerGridLabels } from '@/hooks/useCurrentLanguage';
import { Crown, Eye, EyeOff } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RelationGrid, ServerGrid as ServerGridBase } from 'tai-grid';
import 'tai-grid/style.css';
import GroupRegistrationForm from '../components/GroupRegistrationForm';
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
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#6b7280',
          display: 'flex',
          alignItems: 'center',
          padding: 0,
        }}
        title={visible ? t('groups.hideKey') : t('groups.showKey')}
      >
        {visible ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </span>
  );
}

const SEARCH_DEBOUNCE_MS = 300;

export default function GroupsTab({ currentUser, query, onQueryChange }) {
  const { t } = useTranslation();

  const [refreshKey, setRefreshKey] = useState(0);
  const [inputValue, setInputValue] = useState(query || '');
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [myGroupCount, setMyGroupCount] = useState<number | null>(null);

  // Admin/manager relation panel state
  const [panelGroup, setPanelGroup] = useState<Record<string, unknown> | null>(null);
  const [panelSearch, setPanelSearch] = useState('');
  const [activeRelationTab, setActiveRelationTab] = useState<'users' | 'patients'>('users');
  const [panelRefreshKey, setPanelRefreshKey] = useState(0);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { showNotification } = useNotification();
  const gridLabels = useServerGridLabels();

  // Fetch nurse's group count
  useEffect(() => {
    if (currentUser?.role_type !== 'nurse') return;

    fetch(`${getApiBase()}/api/groups/my`, {
      credentials: 'include',
      headers: { Accept: 'application/json' },
    })
      .then((r) => r.json())
      .then((data) => {
        setMyGroupCount(Array.isArray(data?.data) ? data.data.length : Array.isArray(data) ? data.length : 0);
      })
      .catch(() => setMyGroupCount(0));
  }, [currentUser, refreshKey]);

  // Debounced search for admin/manager groups
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

  // Admin/manager: select a group to show its users/patients
  const handleGroupRowClick = (group: Record<string, unknown>) => {
    setPanelGroup(group);
    setActiveRelationTab('users');
    setPanelSearch('');
    setPanelRefreshKey((prev) => prev + 1);
  };

  const isAdminOrManager = currentUser?.role_type === 'admin' || currentUser?.role_type === 'manager';

  return (
    <>
      {/* NURSE VIEW: only their own groups */}
      {currentUser?.role_type === 'nurse' && (
        <div className="mobile-tab-content">
          <div className="mobile-content-section">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.75rem',
              }}
            >
              <h2 style={{ margin: 0 }}>{t('groups.myGroups')}</h2>

              <button className="add-btn" onClick={() => setShowEnrollModal(true)}>
                {t('groups.autoEnroll')}
              </button>
            </div>

            {myGroupCount === 0 ? (
              <p
                style={{
                  color: '#6b7280',
                  fontStyle: 'italic',
                  textAlign: 'center',
                  margin: '2rem 0',
                }}
              >
                {t('groups.noGroupsYet')}
              </p>
            ) : (
              <div style={{ height: '500px', width: '100%' }}>
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
      )}

      {/* ADMIN / MANAGER VIEW */}
      {isAdminOrManager && (
        <>
          {/* Mobile view */}
          <div className="mobile-tab-content hide-on-desktop">
            <div className="mobile-content-section">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.75rem',
                }}
              >
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
                  allowEditing
                  allowDelete
                  pageSize={10}
                  showAddButton
                  query={query}
                  formComponent={GroupsForm}
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
              {/* Left: all groups */}
              <div style={{ flex: '0 0 50%', minWidth: 0, paddingRight: '1.5rem' }}>
                <div className="tab-header">
                  <h2>{t('groups.managementTitle')}</h2>

                  <div className="user-search">
                    <span className="search-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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

                <ServerGrid
                  key={refreshKey}
                  columns={[
                    { field: 'name', displayName: t('table.name') },
                    { field: 'access_key', displayName: t('groups.table.accessKey') },
                    { field: 'user_count', displayName: t('groups.table.userCount') },
                  ]}
                  columnRenderers={{ name: GroupNameCell, access_key: AccessKeyCell }}
                  path="groups"
                  allowEditing
                  allowDelete
                  pageSize={10}
                  showAddButton
                  query={query}
                  formComponent={GroupsForm}
                  rowActions={[
                    {
                      icon: <span>+</span>,
                      tooltip: t('groups.manageUsers'),
                      onClick: handleGroupRowClick,
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

              {/* Divider */}
              <div
                style={{
                  width: '1px',
                  background: '#e5e7eb',
                  alignSelf: 'stretch',
                  flexShrink: 0,
                }}
              />

              {/* Right: selected group's users/patients */}
              <div style={{ flex: '0 0 50%', minWidth: 0, paddingLeft: '1.5rem' }}>
                {!panelGroup ? (
                  <p
                    style={{
                      color: '#6b7280',
                      fontStyle: 'italic',
                      marginTop: '4rem',
                      textAlign: 'center',
                    }}
                  >
                    {t('groups.panel.selectGroup')}
                  </p>
                ) : (
                  <>
                    <div
                      className="tab-header"
                      style={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 10,
                        backgroundColor: 'white',
                      }}
                    >
                      <h2>{String(panelGroup.name ?? '')}</h2>

                      <div className="user-search">
                        <span className="search-icon">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <circle cx="11" cy="11" r="6" stroke="#6b7280" strokeWidth="2" />
                            <line x1="15" y1="15" x2="20" y2="20" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </span>

                        <input
                          type="search"
                          autoComplete="off"
                          placeholder={t('groups.panel.searchMembers')}
                          value={panelSearch}
                          onChange={(event) => setPanelSearch(event.target.value)}
                        />
                      </div>
                    </div>

                    <div
                      role="tablist"
                      aria-label={t('groups.panel.relations', { defaultValue: 'Group members' })}
                      style={{
                        display: 'flex',
                        gap: '0.5rem',
                        borderBottom: '1px solid #e5e7eb',
                        marginBottom: '1rem',
                      }}
                    >
                      {(['users', 'patients'] as const).map((tab) => {
                        const selected = activeRelationTab === tab;

                        return (
                          <button
                            key={tab}
                            type="button"
                            role="tab"
                            aria-selected={selected}
                            onClick={() => {
                              setActiveRelationTab(tab);
                              setPanelSearch('');
                              setPanelRefreshKey((prev) => prev + 1);
                            }}
                            style={{
                              padding: '0.7rem 1rem',
                              border: 'none',
                              borderBottom: selected ? '2px solid #0891b2' : '2px solid transparent',
                              marginBottom: '-1px',
                              background: 'transparent',
                              color: selected ? '#0891b2' : '#6b7280',
                              fontWeight: selected ? 600 : 500,
                              cursor: 'pointer',
                            }}
                          >
                            {tab === 'users'
                              ? t('groups.panel.users', { defaultValue: 'Users' })
                              : t('groups.panel.patients', { defaultValue: 'Patients' })}
                          </button>
                        );
                      })}
                    </div>

                    <RelationGrid
                      key={`${String(panelGroup.id)}-${activeRelationTab}`}
                      columns={
                        activeRelationTab === 'users'
                          ? [
                              { field: 'name', displayName: t('table.name') },
                              { field: 'email', displayName: t('table.email') },
                              { field: 'role_type', displayName: t('table.role') },
                            ]
                          : [
                              { field: 'name', displayName: t('table.name') },
                              { field: 'social_id', displayName: t('table.socialId') },
                              { field: 'remarks', displayName: t('table.remarks') },
                            ]
                      }
                      path={`groups/${panelGroup.id}/${activeRelationTab}-registered`}
                      addTitle={
                        activeRelationTab === 'users'
                          ? t('groups.panel.addUser', { defaultValue: 'Add user' })
                          : t('groups.panel.addPatient', { defaultValue: 'Add patient' })
                      }
                      addModal={{
                        title:
                          activeRelationTab === 'users'
                            ? t('groups.panel.addUser', { defaultValue: 'Add user' })
                            : t('groups.panel.addPatient', { defaultValue: 'Add patient' }),
                        heading:
                          activeRelationTab === 'users'
                            ? t('groups.panel.selectUsers', { defaultValue: 'Select users to add' })
                            : t('groups.panel.selectPatients', { defaultValue: 'Select patients to add' }),
                        searchPlaceholder: t('groups.panel.searchMembers'),
                        cancelLabel: t('common.cancel'),
                        fetchUrl: `groups/${panelGroup.id}/${activeRelationTab}-unregistered`,
                        addUrl: (id) => `groups/${panelGroup.id}/${activeRelationTab}-registered/${id}`,
                        entityLabel:
                          activeRelationTab === 'users'
                            ? t('groups.panel.user', { defaultValue: 'user' })
                            : t('groups.panel.patient', { defaultValue: 'patient' }),
                        entityLabelPlural:
                          activeRelationTab === 'users'
                            ? t('groups.panel.users', { defaultValue: 'users' })
                            : t('groups.panel.patients', { defaultValue: 'patients' }),
                        onUserAdded: () => {
                          setPanelRefreshKey((prev) => prev + 1);
                          setRefreshKey((prev) => prev + 1);
                        },
                      }}
                      refreshKey={panelRefreshKey}
                      allowDelete={true}
                      pageSize={10}
                      query={panelSearch}
                      getApiBase={getApiBase}
                      showNot={showNotification}
                      labels={gridLabels}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Auto-enroll modal */}
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
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
              }}
            >
              <h3 style={{ margin: 0 }}>{t('groups.joinGroup')}</h3>

              <button
                type="button"
                onClick={() => setShowEnrollModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.25rem',
                  color: '#6b7280',
                  lineHeight: 1,
                }}
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
