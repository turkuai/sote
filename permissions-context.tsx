import { createContext, useContext, type ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface PermissionContextValue {
  permissions: number;
  hasPermission: (action: string) => boolean;
}

const PermissionContext = createContext<PermissionContextValue | null>(null);

const PermissionValues = {
  CREATE: 1,
  READ: 2,
  UPDATE: 4,
  DELETE: 8,
  ADMIN: 16,
  EXPORT: 32,
  IMPORT: 64,
  APPROVE: 128,
};

const ACTION_PERMISSIONS = {
  create_users: PermissionValues.CREATE,
  read_users: PermissionValues.READ,
  update_users: PermissionValues.UPDATE,
  delete_users: PermissionValues.DELETE,
  manage_users: PermissionValues.ADMIN,
  export_users: PermissionValues.EXPORT,
  import_users: PermissionValues.IMPORT,
  approve_users: PermissionValues.APPROVE,
  create_groups: PermissionValues.CREATE,
  update_groups: PermissionValues.UPDATE,
  delete_groups: PermissionValues.DELETE,
  view_groups: PermissionValues.READ,
};

export const PermissionProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useAuth();
  const permissions = currentUser?.permissions ?? 0;

  const hasPermission = (action: string) => {
    if (!action) {
      return false;
    }

    const requiredPermission = ACTION_PERMISSIONS[action] ?? PermissionValues[action?.toUpperCase() as keyof typeof PermissionValues];
    if (!requiredPermission) {
      return false;
    }

    return (permissions & requiredPermission) === requiredPermission;
  };

  return (
    <PermissionContext.Provider value={{ permissions, hasPermission }}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissions must be used within PermissionProvider');
  }
  return context;
};