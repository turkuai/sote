import { Plus, Search, Trash2, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DataSetView from '../../../grid/src/DataSetView';
import { getApiBase } from '../config';
import './GroupUsersModal.css';

export default function GroupUsersModal({ groupId, groupName, onClose, onUserAdded }) {
  const { t } = useTranslation();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [showAddUsers, setShowAddUsers] = useState(true);
  const [selectedUsersToAdd, setSelectedUsersToAdd] = useState<number[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsersToRemove, setSelectedUsersToRemove] = useState<number[]>([]);
  const lastMemberClickedIndex = useRef<number | null>(null);

  const usersRef = useRef(users);
  useEffect(() => {
    usersRef.current = users;
  }, [users]);

  // Fetch group with users
  useEffect(() => {
    const fetchGroupUsers = async () => {
      try {
        const response = await fetch(`/api/groups/${groupId}/unregistered-users`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          console.log('=== Group Data ===');
          console.log('Group ID:', groupId);
          console.log('Group Name:', groupName);
          console.log('API Response:', data);
          console.log('Group users:', data.data.users);
        }
      } catch (error) {
        console.error('Error fetching group users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupUsers();
  }, [groupId, groupName]);

  // loadPage function utilized by DataSetView
  const loadPage = useCallback(
    async (page: number) => {
      setFetchError(null);
      try {
        const searchParam = searchQuery.trim() ? `&search=${encodeURIComponent(searchQuery.trim())}` : '';

        // The search parameter is passed to the backend API here
        const response = await fetch(`${getApiBase()}/api/users?page=${page}${searchParam}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`API Error ${response.status}: ${text.substring(0, 300)}`);
        }

        const data = await response.json();
        const rows = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];

        // Only filter out members already in the group
        const groupUserIds = usersRef.current.map((u) => u.id);
        return rows.filter((u) => !groupUserIds.includes(u.id));
      } catch (error: any) {
        console.error(error);
        setFetchError(error.message || 'Network error');
        return [];
      }
    },
    [groupId, searchQuery],
  );

  // Component to render individual options within DataSetView
  const UserAutocompleteOption = ({ data }: { data: Record<string, any> }) => {
    const user = data;
    const checked = selectedUsersToAdd.includes(user.id);

    const handleClick = () => {
      // Note: Shift-click range select is omitted for the autocomplete list
      // because DataSetView does not provide the mapped index to the rendered rows.
      setSelectedUsersToAdd((prev) => (checked ? prev.filter((id) => id !== user.id) : [...prev, user.id]));
    };

    return (
      <div className={`user-autocomplete-option${checked ? ' selected' : ''}`} onClick={handleClick}>
        <input type="checkbox" className="user-list-checkbox" checked={checked} onChange={() => {}} tabIndex={-1} />
        <span className="user-autocomplete-name">
          {user.first_name} {user.last_name}
        </span>
        <span className="user-autocomplete-email">{user.email}</span>
      </div>
    );
  };

  const handleAddUsers = async () => {
    if (selectedUsersToAdd.length === 0) return;

    setIsAdding(true);
    try {
      // Add each user to the group via pivot table
      for (const userId of selectedUsersToAdd) {
        await fetch(`/api/groups/${groupId}/users/${userId}`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });
      }

      // Refresh the group users
      const response = await fetch(`/api/groups/${groupId}/registered-users`, {
        credentials: 'include',
        headers: {
          Accept: 'application/json',
        },
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
          <div>{t('grid.loading')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content group-users-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            {groupName} - {t('groups.usersModal.users')}
          </h2>
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
                <Plus size={20} /> {t('groups.usersModal.addUsers')}
              </button>
              <button
                className={`delete-selected-btn${selectedUsersToRemove.length > 0 || isRemoving ? ' visible' : ''}${isRemoving ? ' removing' : ''}`}
                onClick={handleRemoveSelectedUsers}
                disabled={isRemoving}
                type="button"
                title={t('groups.usersModal.removeUser')}
              >
                <Trash2 size={18} />
                {isRemoving ? `Removing…` : `Remove ${selectedUsersToRemove.length}`}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="modal-body">
              <h3>{t('groups.usersModal.addUsersHeading')}</h3>
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
                  <strong>{t('groups.usersModal.error')}</strong>
                  <p style={{ marginTop: '0.5rem', marginBottom: '0' }}>{fetchError}</p>
                </div>
              )}

              {/* Search input */}
              <div className="user-autocomplete-input-wrap" style={{ marginBottom: '0.75rem' }}>
                <Search size={16} className="user-autocomplete-icon" />
                <input
                  type="text"
                  className="user-autocomplete-input"
                  placeholder={t('groups.usersModal.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                  }}
                  autoComplete="off"
                />
              </div>

              {/* DataSetView Implementation */}
              {/* Added a constrained height so DataSetView's internal overflow-y scroll boundary works */}
              <div className="user-autocomplete-list" style={{ height: '300px', padding: 0 }}>
                <DataSetView
                  key={searchQuery} // Forces DataSetView to reset to page 1 on every keystroke
                  render={UserAutocompleteOption}
                  loadPage={loadPage}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowAddUsers(false);
                  onClose();
                }}
              >
                {t('grid.confirmDelete.cancel')}
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
