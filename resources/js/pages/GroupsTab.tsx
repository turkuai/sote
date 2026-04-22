import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { ServerGrid } from 'tai-grid';

function AccessKeyCell({ value }: { value: unknown }) {
  const [visible, setVisible] = useState(false);
  const key = value != null ? String(value) : '';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
      <span>{visible ? key : '••••••••'}</span>
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center', padding: 0 }}
        title={visible ? 'Hide key' : 'Show key'}
      >
        {visible ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </span>
  );
}

import 'tai-grid/style.css';
import MobileSearchToggle from '../components/MobileSearchToggle';
import GroupUsersModal from '../components/GroupUsersModal';
import { useNotification } from '../components/NotificationContext';
import { getApiBase } from '../config';
import './Admin.css';

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
export default function GroupsTab({
  currentUser,
  query,
  onQueryChange,
}) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [inputValue, setInputValue] = useState(query || '');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showGroupUsersModal, setShowGroupUsersModal] = useState(false);
  const debounceRef = useRef(null);
  const { showNotification } = useNotification();

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

  return (
    <>
      {/* Mobile view */}
      <div className="mobile-tab-content hide-on-desktop">
        <div className="mobile-content-section">
          <h2>Groups</h2>
          <MobileSearchToggle
            value={inputValue}
            onChange={handleSearchChange}
          />
          <div style={{ height: '500px', width: '100%' }}>
            <ServerGrid
              key={refreshKey}
              columns={['name', 'access_key', 'user_count']}
              columnRenderers={{ access_key: AccessKeyCell }}
              path="groups"
              allowEditing={currentUser?.role_type === 'admin'}
              allowDelete={currentUser?.role_type === 'admin'}
              pageSize={10}
              showAddButton={currentUser?.role_type === 'admin'}
              query={query}
              formComponent={GroupsForm}
              onAddUsers={handleAddUsersClick}
              getApiBase={getApiBase}
              showNot={showNotification}
              transformEditPayload={(payload) => {
                const name = String(payload.name || '').trim();
                if (!name) throw new Error('Group name cannot be empty');
                const access_key = String(payload.access_key || '').trim();
                if (!access_key) throw new Error('Access key cannot be empty');
                return { name, access_key };
              }}
              transformAddPayload={(payload) => {
                const name = String(payload.name || '').trim();
                if (!name) throw new Error('Group name cannot be empty');
                const access_key = String(payload.access_key || '').trim();
                if (!access_key) throw new Error('Access key cannot be empty');
                return { name, access_key };
              }}
            />
          </div>
        </div>
      </div>

      {/* Desktop view */}
      <div className="hide-on-mobile">
        <h2>Groups Management</h2>

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
            placeholder="Search groups..."
            value={inputValue}
            onChange={handleSearchChange}
          />
        </div>
        <ServerGrid
          key={refreshKey}
          columns={['name', 'access_key', 'user_count']}
          columnRenderers={{ access_key: AccessKeyCell }}
          path="groups"
          allowEditing={currentUser?.role_type === 'admin'}
          allowDelete={currentUser?.role_type === 'admin'}
          pageSize={10}
          showAddButton={currentUser?.role_type === 'admin'}
          query={query}
          formComponent={GroupsForm}
          onAddUsers={handleAddUsersClick}
          getApiBase={getApiBase}
          showNot={showNotification}
          transformEditPayload={(payload) => {
            const name = String(payload.name || '').trim();
            if (!name) throw new Error('Group name cannot be empty');
            const access_key = String(payload.access_key || '').trim();
            if (!access_key) throw new Error('Access key cannot be empty');
            return { name, access_key };
          }}
          transformAddPayload={(payload) => {
            const name = String(payload.name || '').trim();
            if (!name) throw new Error('Group name cannot be empty');
            const access_key = String(payload.access_key || '').trim();
            if (!access_key) throw new Error('Access key cannot be empty');
            return { name, access_key };
          }}
        />
      </div>

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
            setRefreshKey(prev => prev + 1);
          }}
        />
      )}
    </>
  );
}

function GroupsForm({ data, setData }) {
  const [showKey, setShowKey] = useState(false);
  const getValue = (field) => (data && data[field]) || '';
  const handleChange = (field) => (e) =>
    setData((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="add-user-form">
      <div className="add-user-form-grid">
        <div>
          <label className="form-label">Group Name *</label>
          <input
            type="text"
            className="form-input"
            value={getValue('name')}
            onChange={handleChange('name')}
            placeholder="e.g., Sector 1, Emergency Room, etc."
          />
        </div>
        <div>
          <label className="form-label">Access Key *</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              type={showKey ? 'text' : 'password'}
              className="form-input"
              value={getValue('access_key')}
              onChange={handleChange('access_key')}
              placeholder="Access key"
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
              title={showKey ? 'Hide key' : 'Show key'}
            >
              {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
