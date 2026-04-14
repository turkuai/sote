import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { getApiBase } from '../config';
import './GroupUsersModal.css';

export default function GroupUsersModal({ groupId, groupName, onClose, onUserAdded }) {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddUsers, setShowAddUsers] = useState(false);
  const [selectedUsersToAdd, setSelectedUsersToAdd] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});

  // Fetch group with users
  useEffect(() => {
    const fetchGroupUsers = async () => {
      try {
        const response = await fetch(`/api/groups/${groupId}`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          console.log('=== Group Data ===');
          console.log('Group ID:', groupId);
          console.log('Group Name:', groupName);
          console.log('API Response:', data);
          console.log('Group users:', data.data.users);
          setUsers(data.data.users || []);
          setDebugInfo(prev => ({ ...prev, groupUsers: data.data.users }));
        }
      } catch (error) {
        console.error('Error fetching group users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupUsers();
  }, [groupId]);

  // Fetch all users when showing add users modal
  useEffect(() => {
    if (!showAddUsers) return;

    const fetchAllUsers = async () => {
      setFetchError(null);
      try {
        console.log('=== Fetching ALL Users ===');
        const url = `/api/users`;
        console.log('Fetching from:', url);
        
        const response = await fetch(url, {
          credentials: 'include',
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', {
          'content-type': response.headers.get('content-type'),
          'x-powered-by': response.headers.get('x-powered-by'),
        });
        
        // Read response as text first to diagnose
        const responseText = await response.text();
        console.log('Raw response text (first 500 chars):', responseText.substring(0, 500));
        
        if (!response.ok) {
          const error = `API Error ${response.status}: ${responseText.substring(0, 300)}`;
          console.error(error);
          setFetchError(error);
          return;
        }
        
        try {
          const data = JSON.parse(responseText);
          console.log('✓ Parsed JSON successfully');
          console.log('Data structure:', { success: data.success, hasData: !!data.data, count: Array.isArray(data.data) ? data.data.length : 'N/A' });
          
          // Extract users array
          let allUsersArray = [];
          if (Array.isArray(data.data)) {
            allUsersArray = data.data;
          } else if (Array.isArray(data)) {
            allUsersArray = data;
          }
          
          console.log(`Found ${allUsersArray.length} total users`);
          
          // Filter out users already in the group
          const groupUserIds = users.map(u => u.id);
          const availableUsers = allUsersArray.filter(u => !groupUserIds.includes(u.id));
          
          console.log(`Filtered to ${availableUsers.length} available users`);
          console.log('Available users:', availableUsers);
          
          setAllUsers(availableUsers);
          setDebugInfo(prev => ({
            ...prev,
            totalUsers: allUsersArray.length,
            groupUserIds: groupUserIds,
            availableCount: availableUsers.length,
          }));
        } catch (parseError) {
          const error = `Failed to parse JSON: ${parseError.message}`;
          console.error(error);
          console.error('Response that failed to parse:', responseText.substring(0, 1000));
          setFetchError(error);
        }
      } catch (error) {
        console.error('Network error:', error);
        setFetchError(error.message || 'Network error');
      }
    };

    fetchAllUsers();
  }, [showAddUsers, users]);

  const handleAddUsers = async () => {
    if (selectedUsersToAdd.length === 0) return;

    try {
      // Add each user to the group via pivot table
      for (const userId of selectedUsersToAdd) {
        await fetch(`/api/groups/${groupId}/users/${userId}`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Refresh the group users
      const response = await fetch(`/api/groups/${groupId}`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.data.users || []);
      }

      setSelectedUsersToAdd([]);
      setShowAddUsers(false);
      if (onUserAdded) onUserAdded();
    } catch (error) {
      console.error('Error adding users:', error);
    }
  };

  const handleRemoveUser = async (userId) => {
    try {
      const response = await fetch(`/api/groups/${groupId}/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        // Remove user from local state
        setUsers(users.filter(u => u.id !== userId));
        if (onUserAdded) onUserAdded();
      } else {
        console.error('Failed to remove user:', response.status);
      }
    } catch (error) {
      console.error('Error removing user:', error);
    }
  };

  if (loading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content group-users-modal" onClick={(e) => e.stopPropagation()}>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content group-users-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{groupName} - Users</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {!showAddUsers ? (
          <>
            <div className="modal-add-button">
              <button 
                className="add-user-btn"
                onClick={() => setShowAddUsers(true)}
              >
                <Plus size={20} /> Add Users
              </button>
            </div>

            <div className="modal-body">
              {users.length === 0 ? (
                <p className="empty-message">No users in this group</p>
              ) : (
                <ul className="users-list">
                  {users.map(user => (
                    <li key={user.id} className="user-item">
                      <div style={{ flex: 1 }}>
                        <span className="user-name">{user.first_name} {user.last_name}</span>
                        <span className="user-email">{user.email}</span>
                      </div>
                      <button
                        className="remove-user-btn"
                        onClick={() => handleRemoveUser(user.id)}
                        title="Remove user from group"
                        type="button"
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="modal-body">
              <h3>Select users to add</h3>
              {fetchError && (
                <div style={{ color: '#dc2626', marginBottom: '1rem', padding: '1rem', backgroundColor: '#fee2e2', borderRadius: '6px', fontSize: '0.9rem' }}>
                  <strong>Error:</strong>
                  <p style={{ marginTop: '0.5rem', marginBottom: '0' }}>{fetchError}</p>
                </div>
              )}
              
              {/* Debug info - remove later */}
              {debugInfo.totalUsers !== undefined && (
                <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#f3f4f6', borderRadius: '6px', fontFamily: 'monospace' }}>
                  <div>Total users in system: {debugInfo.totalUsers}</div>
                  <div>Users in this group: {debugInfo.groupUserIds?.length || 0}</div>
                  <div>Available to add: {debugInfo.availableCount}</div>
                </div>
              )}
              
              {allUsers.length === 0 && !fetchError ? (
                <div>
                  <p className="empty-message">No users available to add</p>
                  
                </div>
              ) : (
                <div className="users-checkbox-list">
                  {allUsers.map(user => (
                    <label key={user.id} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedUsersToAdd.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsersToAdd([...selectedUsersToAdd, user.id]);
                          } else {
                            setSelectedUsersToAdd(selectedUsersToAdd.filter(id => id !== user.id));
                          }
                        }}
                      />
                      <span>{user.first_name} {user.last_name}</span>
                      <span className="user-email">{user.email}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button 
                className="cancel-btn"
                onClick={() => {
                  setShowAddUsers(false);
                  setSelectedUsersToAdd([]);
                }}
              >
                Cancel
              </button>
              <button 
                className="confirm-btn"
                onClick={handleAddUsers}
                disabled={selectedUsersToAdd.length === 0}
              >
                Add {selectedUsersToAdd.length} User{selectedUsersToAdd.length !== 1 ? 's' : ''}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
