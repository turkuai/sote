import { Plus, Search, Trash2, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import './GroupUsersModal.css';

export default function GroupUsersModal({ groupId, groupName, onClose, onUserAdded }) {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [showAddUsers, setShowAddUsers] = useState(true);
  const [selectedUsersToAdd, setSelectedUsersToAdd] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsersToRemove, setSelectedUsersToRemove] = useState<number[]>([]);
  const lastClickedIndex = useRef<number | null>(null);
  const lastMemberClickedIndex = useRef<number | null>(null);

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

          // Extract users array
          let allUsersArray = [];
          if (Array.isArray(data.data)) {
            allUsersArray = data.data;
          } else if (Array.isArray(data)) {
            allUsersArray = data;
          }

          // Filter out users already in the group
          const groupUserIds = users.map((u) => u.id);
          const availableUsers = allUsersArray.filter((u) => !groupUserIds.includes(u.id));

          setAllUsers(availableUsers);
        } catch (parseError) {
          const error = `Failed to parse JSON: ${parseError.message}`;
          console.error(error);
          console.error('Response that failed to parse:', responseText.substring(0, 1000));
          setFetchError(error);
        }
      } catch (error) {
        setFetchError(error.message || 'Network error');
      }
    };

    fetchAllUsers();
  }, [showAddUsers, users]);

  const filteredSuggestions = allUsers.filter((user) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    return fullName.includes(q) || (user.email && user.email.toLowerCase().includes(q));
  });

  const handleAddUsers = async () => {
    if (selectedUsersToAdd.length === 0) return;

    setIsAdding(true);
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
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveSelectedUsers = async () => {
    if (selectedUsersToRemove.length === 0) return;
    setIsRemoving(true);
    try {
      for (const userId of selectedUsersToRemove) {
        await fetch(`/api/groups/${groupId}/users/${userId}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
      }
      setUsers((prev) => prev.filter((u) => !selectedUsersToRemove.includes(u.id)));
      setSelectedUsersToRemove([]);
      lastMemberClickedIndex.current = null;
      if (onUserAdded) onUserAdded();
    } catch (error) {
      console.error('Error removing users:', error);
    } finally {
      setIsRemoving(false);
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
                onClick={() => {
                  setShowAddUsers(true);
                  setSelectedUsersToRemove([]);
                  lastMemberClickedIndex.current = null;
                }}
              >
                <Plus size={20} /> Add Users
              </button>
              <button
                className={`delete-selected-btn${selectedUsersToRemove.length > 0 || isRemoving ? ' visible' : ''}${isRemoving ? ' removing' : ''}`}
                onClick={handleRemoveSelectedUsers}
                disabled={isRemoving}
                type="button"
                title="Remove selected users from group"
              >
                <Trash2 size={18} />
                {isRemoving ? `Removing…` : `Remove ${selectedUsersToRemove.length}`}
              </button>
            </div>

            <div className="modal-body">
              {users.length === 0 ? (
                <p className="empty-message">No users in this group</p>
              ) : (
                <ul className="users-list">
                  {users.map((user, index) => {
                    const checked = selectedUsersToRemove.includes(user.id);
                    const handleMemberClick = (e: React.MouseEvent) => {
                      if (e.shiftKey && lastMemberClickedIndex.current !== null) {
                        e.preventDefault();
                        const from = Math.min(lastMemberClickedIndex.current, index);
                        const to = Math.max(lastMemberClickedIndex.current, index);
                        const rangeIds = users.slice(from, to + 1).map((u) => u.id);
                        const allChecked = rangeIds.every((id) => selectedUsersToRemove.includes(id));
                        setSelectedUsersToRemove((prev) =>
                          allChecked ? prev.filter((id) => !rangeIds.includes(id)) : [...new Set([...prev, ...rangeIds])],
                        );
                      } else {
                        lastMemberClickedIndex.current = index;
                        setSelectedUsersToRemove((prev) => (checked ? prev.filter((id) => id !== user.id) : [...prev, user.id]));
                      }
                    };
                    return (
                      <li key={user.id} className={`user-item${checked ? ' selected' : ''}`} onClick={handleMemberClick}>
                        <input type="checkbox" className="user-list-checkbox" checked={checked} onChange={() => {}} tabIndex={-1} />
                        <div style={{ flex: 1 }}>
                          <span className="user-name">
                            {user.first_name} {user.last_name}
                          </span>
                          <span className="user-email">{user.email}</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="modal-body">
              <h3>Add users to group</h3>
              {fetchError && (
                <div
                  style={{
                    color: '#dc2626',
                    marginBottom: '1rem',
                    padding: '1rem',
                    backgroundColor: '#fee2e2',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                  }}
                >
                  <strong>Error:</strong>
                  <p style={{ marginTop: '0.5rem', marginBottom: '0' }}>{fetchError}</p>
                </div>
              )}

              {/* Search input */}
              <div className="user-autocomplete-input-wrap" style={{ marginBottom: '0.75rem' }}>
                <Search size={16} className="user-autocomplete-icon" />
                <input
                  type="text"
                  className="user-autocomplete-input"
                  placeholder="Search by name or email…"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    lastClickedIndex.current = null;
                  }}
                  autoComplete="off"
                />
              </div>

              {/* Always-visible user list */}
              {filteredSuggestions.length > 0 ? (
                <ul className="user-autocomplete-list">
                  {filteredSuggestions.map((user, index) => {
                    const checked = selectedUsersToAdd.includes(user.id);
                    const handleClick = (e: React.MouseEvent) => {
                      if (e.shiftKey && lastClickedIndex.current !== null) {
                        e.preventDefault();
                        const from = Math.min(lastClickedIndex.current, index);
                        const to = Math.max(lastClickedIndex.current, index);
                        const rangeIds = filteredSuggestions.slice(from, to + 1).map((u) => u.id);
                        const allChecked = rangeIds.every((id) => selectedUsersToAdd.includes(id));
                        setSelectedUsersToAdd((prev) =>
                          allChecked ? prev.filter((id) => !rangeIds.includes(id)) : [...new Set([...prev, ...rangeIds])],
                        );
                      } else {
                        lastClickedIndex.current = index;
                        setSelectedUsersToAdd((prev) => (checked ? prev.filter((id) => id !== user.id) : [...prev, user.id]));
                      }
                    };
                    return (
                      <li key={user.id} className={`user-autocomplete-option${checked ? ' selected' : ''}`} onClick={handleClick}>
                        <input type="checkbox" className="user-list-checkbox" checked={checked} onChange={() => {}} tabIndex={-1} />
                        <span className="user-autocomplete-name">
                          {user.first_name} {user.last_name}
                        </span>
                        <span className="user-autocomplete-email">{user.email}</span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="empty-message">{searchQuery.trim() ? 'No users found' : 'No users available to add'}</p>
              )}
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button className="confirm-btn" onClick={handleAddUsers} disabled={selectedUsersToAdd.length === 0 || isAdding}>
                {isAdding
                  ? `Adding ${selectedUsersToAdd.length} User${selectedUsersToAdd.length !== 1 ? 's' : ''}…`
                  : `Add ${selectedUsersToAdd.length} User${selectedUsersToAdd.length !== 1 ? 's' : ''}`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
