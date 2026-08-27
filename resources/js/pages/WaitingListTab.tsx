import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ServerGrid } from 'tai-grid';
import 'tai-grid/style.css';
import { useNotification } from '../components/NotificationContext';
import { getApiBase } from '../config';

export default function WaitingListTab({ currentUser }) {
  const { t } = useTranslation();
  const { showNotification } = useNotification();
  const [refreshCounter, setRefreshCounter] = useState(0);
  const gridRef = useRef(null);

  // Custom renderer for name
  const NameRenderer = ({ data }) => <span>{`${data?.first_name || ''} ${data?.last_name || ''}`.trim()}</span>;

  // Custom renderer for action button
  const ActionRenderer = ({ data }) => (
    <button
      onClick={() => handleApprove(data.id, data.first_name, data.last_name)}
      style={{
        padding: '8px 16px',
        backgroundColor: '#10b981',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
      }}
      type="button"
    >
      {t('waitingList.accept')}
    </button>
  );

  const handleApprove = async (userId, firstName, lastName) => {
    try {
      // Get CSRF token from meta tag
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

      const response = await fetch(`${getApiBase()}/api/users/${userId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify({
          role_type: 'nurse',
        }),
      });

      if (response.ok) {
        showNotification(
          t('waitingList.notifications.approved', {
            name: `${firstName} ${lastName}`,
          }),
          'success',
        );
        // Force grid to refetch by incrementing the counter
        setRefreshCounter((prev) => prev + 1);
      } else {
        const data = await response.json();
        showNotification(data.message || t('waitingList.notifications.failed'), 'error');
      }
    } catch (error) {
      console.error('Error approving user:', error);
      showNotification(t('waitingList.notifications.error'), 'error');
    }
  };

  return (
    <div>
      <div className="tab-header">
        <h2>{t('waitingList.title')}</h2>
      </div>
      <p style={{ color: '#666', marginBottom: '20px' }}>{t('waitingList.description')}</p>

      <div style={{ height: '500px', width: '100%' }}>
        <ServerGrid
          ref={gridRef}
          key={`waiting-list-${refreshCounter}`}
          columns={[
            { field: 'first_name', displayName: t('waitingList.table.name') },
            { field: 'last_name', displayName: t('waitingList.table.lastName') },
            { field: 'email', displayName: t('table.email') },
            { field: 'action', displayName: t('table.actions') },
          ]}
          columnRenderers={{
            first_name: NameRenderer,
            action: ActionRenderer,
          }}
          path="users?role_type=null"
          pageSize={10}
          query=""
          allowEditing={false}
          allowDelete={false}
          showAddButton={false}
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
              actionsHeader: t('table.actions'),
              edit: t('table.edit'),
              delete: t('table.delete'),
              previous: t('grid.pagination.previous'),
              next: t('grid.pagination.next'),
              page: t('grid.pagination.page'),
              of: t('grid.pagination.of'),
            },
            dialog: {
              save: t('grid.dialog.save'),
              cancel: t('grid.dialog.cancel'),
              close: t('grid.dialog.close'),
            },
          }}
        />
      </div>
    </div>
  );
}
