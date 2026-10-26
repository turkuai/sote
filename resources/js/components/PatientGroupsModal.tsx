import { Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { getApiBase } from '../config';
import './GroupUsersModal.css';

type PatientGroup = {
  id: number | string;
  name?: string;
  access_key?: string;
};

interface PatientGroupsModalProps {
  patientId: number;
  patientName: string;
  existingGroups: PatientGroup[];
  onClose: () => void;
  onGroupAdded: () => void;
}

export default function PatientGroupsModal({ patientId, patientName, existingGroups, onClose, onGroupAdded }: PatientGroupsModalProps) {
  const { t } = useTranslation();

  const [groups, setGroups] = useState<PatientGroup[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    const loadGroups = async () => {
      setLoading(true);
      setError('');

      try {
        // Load all groups and patient's current groups
        const [groupsResponse, patientGroupsResponse] = await Promise.all([
          fetch(`${getApiBase()}/api/groups`, {
            credentials: 'include',
            headers: {
              Accept: 'application/json',
            },
          }),

          fetch(`${getApiBase()}/api/patients/${patientId}/groups`, {
            credentials: 'include',
            headers: {
              Accept: 'application/json',
            },
          }),
        ]);

        if (!groupsResponse.ok) {
          throw new Error('Failed to load groups');
        }

        if (!patientGroupsResponse.ok) {
          throw new Error('Failed to load patient groups');
        }

        const groupsPayload = await groupsResponse.json();

        const patientGroupsPayload = await patientGroupsResponse.json();

        // All groups
        const allGroupsData = groupsPayload?.data?.groups ?? groupsPayload?.data?.data ?? groupsPayload?.data ?? groupsPayload?.groups ?? [];

        const allGroups: PatientGroup[] = Array.isArray(allGroupsData) ? allGroupsData : [];

        // Groups already assigned to patient
        const patientGroupsData = patientGroupsPayload?.data?.data ?? patientGroupsPayload?.data?.groups ?? patientGroupsPayload?.data ?? [];

        const patientGroups: PatientGroup[] = Array.isArray(patientGroupsData) ? patientGroupsData : [];

        const existingIds = new Set(patientGroups.map((group) => String(group.id)));

        // Only show groups patient is NOT already in
        const availableGroups = allGroups.filter((group) => !existingIds.has(String(group.id)));

        setGroups(availableGroups);
      } catch (err) {
        console.error('Error loading groups:', err);

        setError(t('patients.errors.loadGroups', 'Failed to load available groups.'));
      } finally {
        setLoading(false);
      }
    };

    loadGroups();
  }, [patientId, t]);

  const filteredGroups = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return groups;
    }

    return groups.filter((group) => {
      const name = group.name?.toLowerCase() ?? '';
      const accessKey = group.access_key?.toLowerCase() ?? '';

      return name.includes(query) || accessKey.includes(query);
    });
  }, [groups, searchQuery]);

  const toggleGroup = (groupId: number | string) => {
    const id = String(groupId);

    setSelectedGroups((previous) => {
      const next = new Set(previous);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  const handleAddGroups = async () => {
    if (selectedGroups.size === 0 || adding) {
      return;
    }

    setAdding(true);
    setError('');

    try {
      const groupIds = Array.from(selectedGroups);

      for (const groupId of groupIds) {
        const response = await fetch(`${getApiBase()}/api/patients/${patientId}/groups`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            group_id: groupId,
          }),
        });

        const contentType = response.headers.get('content-type') || '';

        if (!response.ok) {
          let errorMessage = `Failed to add patient to group ${groupId}`;

          if (contentType.includes('application/json')) {
            const payload = await response.json();

            errorMessage = payload?.message || payload?.error || errorMessage;
          } else {
            const text = await response.text();
            console.error('Add patient response:', text);
          }

          throw new Error(errorMessage);
        }
      }

      onGroupAdded();
    } catch (err) {
      console.error('Error adding patient to group:', err);

      setError(err instanceof Error ? err.message : t('patients.errors.addToGroup', 'Failed to add patient to group.'));
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="modal-content group-users-modal" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h2>{t('patients.panel.addToGroup', 'Add to Group')}</h2>

          <button type="button" className="modal-close" onClick={onClose} aria-label={t('grid.close', 'Close')}>
            <X size={22} />
          </button>
        </div>

        <div className="modal-body">
          <h3>{patientName}</h3>

          <div className="user-autocomplete-input-wrap">
            <Search size={18} className="user-autocomplete-icon" />

            <input
              type="text"
              className="user-autocomplete-input"
              placeholder={t('patients.panel.searchGroups', 'Search groups...')}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          {error && (
            <div
              style={{
                color: '#dc2626',
                marginTop: '1rem',
                fontSize: '0.9rem',
              }}
            >
              {error}
            </div>
          )}

          {loading ? (
            <div className="empty-message">{t('grid.loading', 'Loading...')}</div>
          ) : filteredGroups.length === 0 ? (
            <div className="empty-message">
              {searchQuery
                ? t('patients.panel.noAvailableGroups', 'No groups found.')
                : t('patients.panel.noAvailableGroups', 'No available groups.')}
            </div>
          ) : (
            <ul className="user-autocomplete-list" style={{ marginTop: '1rem' }}>
              {filteredGroups.map((group) => {
                const groupId = String(group.id);
                const selected = selectedGroups.has(groupId);

                return (
                  <li key={groupId} className={`user-autocomplete-option ${selected ? 'selected' : ''}`} onClick={() => toggleGroup(group.id)}>
                    <input
                      type="checkbox"
                      className="user-list-checkbox"
                      checked={selected}
                      onChange={() => toggleGroup(group.id)}
                      onClick={(event) => event.stopPropagation()}
                    />

                    <span className="user-autocomplete-name">{group.name || `Group ${group.id}`}</span>

                    {group.access_key && <span className="user-autocomplete-email">{group.access_key}</span>}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="cancel-btn" onClick={onClose} disabled={adding}>
            {t('grid.confirmDelete.cancel', 'Cancel')}
          </button>

          <button type="button" className="confirm-btn" onClick={handleAddGroups} disabled={selectedGroups.size === 0 || adding}>
            {adding ? t('grid.loading', 'Adding...') : t('patients.panel.addToGroup', 'Add to Group')}
          </button>
        </div>
      </div>
    </div>
  );
}
