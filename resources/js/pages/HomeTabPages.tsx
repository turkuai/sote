import { useState, type ReactNode } from 'react';
import { Navigate, useOutletContext } from 'react-router-dom';
import { useUserManagement } from '../hooks/useUserManagement';
import { TabConfig } from '../utils/tabConfig';
import GroupsTab from './GroupsTab';
import PatientsTab from './PatientsTab';
import SettingsTab from './SettingsTab';
import UsersTab from './UsersTab';
import WaitingListTab from './WaitingListTab';

type HomeContext = { currentUser: any; handleLogout: () => void; isMobile: boolean };

function HomeTab({ tab, children }: { tab: string; children: (context: HomeContext) => ReactNode }) {
  const context = useOutletContext<HomeContext>();
  const availableTabs = TabConfig.getTabs(context.currentUser, context.isMobile);
  if (!availableTabs.includes(tab)) return <Navigate to={`/home/${availableTabs[0] || 'settings'}`} replace />;
  return <>{children(context)}</>;
}

export function HomeIndexRedirect() {
  const { currentUser, isMobile } = useOutletContext<HomeContext>();
  const firstTab = TabConfig.getTabs(currentUser, isMobile)[0] || 'settings';
  return <Navigate to={`/home/${firstTab}`} replace />;
}

export function UsersPage() {
  const { currentUser } = useOutletContext<HomeContext>();
  const [query, setQuery] = useState('');
  const { handlers: { handleDeleteUser } } = useUserManagement();
  return <HomeTab tab="users">{() => <UsersTab currentUser={currentUser} query={query} onQueryChange={setQuery} onDeleteUser={handleDeleteUser} />}</HomeTab>;
}

export function GroupsPage() {
  const { currentUser } = useOutletContext<HomeContext>();
  const [query, setQuery] = useState('');
  return <HomeTab tab="groups">{() => <GroupsTab currentUser={currentUser} query={query} onQueryChange={setQuery} />}</HomeTab>;
}

export function PatientsTabPage() {
  const { currentUser } = useOutletContext<HomeContext>();
  const [query, setQuery] = useState('');
  return <HomeTab tab="patients">{() => <PatientsTab currentUser={currentUser} query={query} onQueryChange={setQuery} />}</HomeTab>;
}

export function WaitingListPage() {
  const { currentUser } = useOutletContext<HomeContext>();
  return <HomeTab tab="waiting-list">{() => <WaitingListTab currentUser={currentUser} />}</HomeTab>;
}

export function SettingsPage() {
  const { currentUser, handleLogout } = useOutletContext<HomeContext>();
  return <HomeTab tab="settings">{() => <SettingsTab currentUser={currentUser} onLogout={handleLogout} />}</HomeTab>;
}
