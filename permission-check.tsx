import React from 'react';
import { usePermissions } from './permissions-context';

interface PermissionCheckProps {
  action: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireALL?: boolean;
  permissions?: string[];
}

export default function PermissionCheck({ action, children, fallback = null }: PermissionCheckProps) {
  const { hasPermission } = usePermissions();

  if (!hasPermission(action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
