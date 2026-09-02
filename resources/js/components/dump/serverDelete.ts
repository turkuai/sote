import { getApiBase } from '../config';
import { useNotification } from './NotificationContext';

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
 * Hook for deleting data from server
 * @param {string} path - API endpoint path
 * @param {Function} fetchData - Function to refresh data after successful delete
 * @param {Function} setError - State setter for error state
 * @returns {Function} performDelete function
 */
export function useServerDelete(path, fetchData, setError) {
  const { showNotification } = useNotification();

  const performDelete = async (row) => {
    if (!row.id) {
      console.error('Row has no ID');
      return;
    }

    try {
      let deleteUrl = `${path.split('?')[0]}/${row.id}`;
      // Ensure leading slash (getApiBase already includes /api)
      if (!deleteUrl.startsWith('/')) {
        deleteUrl = '/' + deleteUrl;
      }

      const csrfToken = getCsrfToken();
      const res = await fetch(getApiBase() + deleteUrl, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(csrfToken && { 'X-CSRF-TOKEN': csrfToken }),
        },
      });

      // Try to parse response as JSON, but handle HTML/plain text errors
      let responseData = {};
      const contentType = res.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        try {
          responseData = await res.json();
        } catch (e) {
          // If JSON parse fails, use empty object
        }
      }

      if (!res.ok) {
        // Check for database constraint errors
        const errorMessage = responseData.error || responseData.message || `Delete failed with status ${res.status}`;

        // Check if it's a foreign key constraint error
        const errorStr = String(errorMessage).toLowerCase();
        if (errorStr.includes('foreign key constraint') || errorStr.includes('cannot delete') || errorStr.includes('1451')) {
          showNotification('Cannot delete this record because it is referenced by other data.', 'error');
          throw new Error('Cannot delete this record because it is referenced by other data.');
        }

        showNotification(errorMessage, 'error');
        throw new Error(errorMessage);
      }

      // Refresh data after successful deletion
      await fetchData();
    } catch (err) {
      console.error('Delete error:', err);
      setError(`Failed to delete item: ${err.message}`);
    }
  };

  return performDelete;
}
