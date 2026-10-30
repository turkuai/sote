import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router-dom';
import { ServerGrid } from 'tai-grid';
import 'tai-grid/style.css';
import { useNotification } from '../components/NotificationContext';
import { getApiBase } from '../config';
import { useServerGridLabels } from '../hooks/useCurrentLanguage';

export default function WaitingListTab({}) {
  const { currentUser } = useOutletContext<{ currentUser: { role_type?: String; id?: string; name?: string; username?: string } }>();
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
        backgroundColor: '#ce1717',
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
          labels={useServerGridLabels()}
        />
      </div>
    </div>
  );
}
