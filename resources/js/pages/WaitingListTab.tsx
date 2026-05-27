import React, { useState, useRef } from 'react';
import { ServerGrid } from 'tai-grid';
import 'tai-grid/style.css';
import { getApiBase } from '../config';
import { useNotification } from '../components/NotificationContext';

export default function WaitingListTab({ currentUser }) {
  const { showNotification } = useNotification();
  const [refreshCounter, setRefreshCounter] = useState(0);
  const gridRef = useRef(null);

  // Custom renderer for name
  const NameRenderer = ({ data }) => (
    <span>{`${data?.first_name || ''} ${data?.last_name || ''}`.trim()}</span>
  );

  // Custom renderer for action button
  const ActionRenderer = ({ data }) => (
    <button
      onClick={() => handleApprove(data.id, data.first_name, data.last_name)}
      style={{
        padding: '8px 16px',
        backgroundColor: '#d00c0c',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
      }}
      type="button"
    >
      Accept
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
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify({
          role_type: 'nurse',
        }),
      });

      if (response.ok) {
        showNotification(`${firstName} ${lastName} has been approved and assigned as Nurse.`, 'success');
        // Force grid to refetch by incrementing the counter
        setRefreshCounter(prev => prev + 1);
      } else {
        const data = await response.json();
        showNotification(data.message || 'Failed to approve user', 'error');
      }
    } catch (error) {
      console.error('Error approving user:', error);
      showNotification('Error approving user', 'error');
    }
  };

  return (
    <div>
      <div className="tab-header">
        <h2>Waiting for Approval</h2>
      </div>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Users pending approval. Click "Accept" to approve and assign as Nurse.
      </p>

      <div style={{ height: '500px', width: '100%' }}>
        <ServerGrid
          ref={gridRef}
          key={`waiting-list-${refreshCounter}`}
          columns={['name', 'email', 'action']}
          columnRenderers={{
            name: NameRenderer,
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
        />
      </div>
    </div>
  );
}
