import { useAuth } from '../components/AuthContext';
import { useNotification } from '../components/NotificationContext';

/**
 * Custom hook for managing user operations (delete, edit, etc.)
 * @returns {Object} Object containing user management handlers
 */
export const useUserManagement = () => {
  const { currentUser } = useAuth();
  const { showNotification } = useNotification();

  // Handler for deleting a user with validation
  const handleDeleteUser = async (row) => {
    const fullName = row.first_name && row.last_name
      ? `${row.first_name} ${row.last_name}`
      : (row.name || row.email || '');

    if (fullName === currentUser?.name) {
      showNotification('You cannot delete your own account!', 'error');
      return false;
    }

    return true;
  };

  return {
    handlers: {
      handleDeleteUser
    }
  };
};

