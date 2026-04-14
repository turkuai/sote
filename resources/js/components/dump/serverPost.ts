import { useNotification } from './NotificationContext';
import { getApiBase } from '../config';

// Helper to get CSRF token from cookie
function getCsrfToken() {
  const name = 'XSRF-TOKEN';
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const token = parts.pop().split(';').shift();
    return decodeURIComponent(token);
  }
  return '';
}

/**
 * Hook for adding new data to server
 * @param {string} path - API endpoint path
 * @param {Function} fetchData - Function to refresh data after successful add
 * @param {Function} setIsAdding - State setter to close add modal
 * @param {Function} transformAddPayload - Optional function to transform payload before sending
 * @returns {Function} handleAddRow function
 */
export function useServerPost(path, fetchData, setIsAdding, transformAddPayload) {
  const { showNotification } = useNotification();

  const handleAddRow = async (newRowData) => {
    if (!path) return;

    try {
      let addUrl = path.split('?')[0];
      // Ensure leading slash (getApiBase already includes /api)
      if (!addUrl.startsWith('/')) {
        addUrl = '/' + addUrl;
      }

      // Prepare payload - exclude technical fields
      let payload = { ...newRowData };
      delete payload.id;
      delete payload.created_at;
      delete payload.updated_at;

      if (typeof transformAddPayload === 'function') {
        payload = transformAddPayload(payload, { path });
      }

      const csrfToken = getCsrfToken();
      const res = await fetch(getApiBase() + addUrl, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(csrfToken && { 'X-CSRF-TOKEN': csrfToken }),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let msg = 'Failed to add item';
        try {
          const errorData = await res.json();
          msg = errorData.error || errorData.message || msg;
        } catch (_) {
          // ignore json parse error
        }
        throw new Error(msg);
      }

      // Refresh data after successful addition
      await fetchData();
      setIsAdding(false);
      showNotification('Item added successfully!', 'success');
    } catch (err) {
      console.error('Add error:', err);
      showNotification(err.message || 'Failed to add item', 'error');
    }
  };

  return handleAddRow;
}

