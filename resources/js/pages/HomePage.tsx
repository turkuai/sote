import { useEffect, useState } from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import './Admin.css';

import { useTranslation } from 'react-i18next';
import { useUserManagement } from '../hooks/useUserManagement';
import { TabConfig } from '../utils/tabConfig';
import GroupsTab from './GroupsTab';
import HomeTabs from './HomeTabs';
import MobileNav from './MobileNav';
import SettingsTab from './SettingsTab';
import UsersTab from './UsersTab';
import WaitingListTab from './WaitingListTab';

export default function HomePage() {

  const { currentUser, handleLogout, isMobile } = useOutletContext<{
    currentUser: any;
    handleLogout: () => void;
    isMobile: boolean;
  }>();

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { tab: urlTab } = useParams<{ tab: string }>();

  const [userQuery, setUserQuery] = useState('');
  const [groupQuery, setGroupQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() =>
    typeof window !== 'undefined'
      ? localStorage.getItem('sidebar_collapsed') === 'true'
      : false
  );

  const { handlers: { handleDeleteUser } } = useUserManagement();

  // Default tab based on role
  const defaultTab =
    currentUser?.role_type === 'admin' || currentUser?.role_type === 'manager'
      ? 'users'
      : 'settings';

  // URL controls active tab
  const activeTab = urlTab || defaultTab;

  const handleTabClick = (tab: string) => {
    navigate(`/home/${tab}`);
  };

  const tabs = TabConfig.getTabs(currentUser, isMobile);
  


  return (
    <div>

      {/* Mobile Content */}
      {isMobile && (
        <>
          {(currentUser?.role_type === 'admin' || currentUser?.role_type === 'manager') && activeTab === 'users' && (
            <UsersTab currentUser={currentUser} query={userQuery} onQueryChange={setUserQuery} onDeleteUser={handleDeleteUser} />
          )}

          {(currentUser?.role_type === 'admin' || currentUser?.role_type === 'manager') && activeTab === 'groups' && (
            <GroupsTab currentUser={currentUser} query={groupQuery} onQueryChange={setGroupQuery} />
          )}

          {currentUser?.role_type === 'nurse' && activeTab === 'groups' && (
            <GroupsTab currentUser={currentUser} query={groupQuery} onQueryChange={setGroupQuery} />
          )}

          {(currentUser?.role_type === 'admin' || currentUser?.role_type === 'manager') && activeTab === 'waiting-list' && (
            <WaitingListTab currentUser={currentUser} />
          )}

          {activeTab === 'settings' && (
            <div className="mobile-tab-content">
              <div className="mobile-content-section">
                <SettingsTab currentUser={currentUser} onLogout={handleLogout} />
              </div>
            </div>
          )}
        </>
      )}

      {/* Desktop: Sidebar + Content */}
      <div className="admin-body hide-on-mobile">
        <HomeTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabClick={handleTabClick}
          getTabLabel={(tab) => TabConfig.getTabLabel(tab, t)}
          renderTabIcon={TabConfig.renderTabIcon}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() =>
            setSidebarCollapsed((c) => {
              const next = !c;
              localStorage.setItem('sidebar_collapsed', String(next));
              return next;
            })
          }
        />

        <div className="admin-content-area">
          <div className="admin-content-card">
            {(currentUser?.role_type === 'admin' || currentUser?.role_type === 'manager') && (
              <div style={{ display: activeTab === 'users' ? 'block' : 'none' }}>
                <UsersTab currentUser={currentUser} query={userQuery} onQueryChange={setUserQuery} onDeleteUser={handleDeleteUser} />
              </div>
            )}

            {(currentUser?.role_type === 'admin' || currentUser?.role_type === 'manager') && (
              <div style={{ display: activeTab === 'groups' ? 'block' : 'none' }}>
                <GroupsTab currentUser={currentUser} query={groupQuery} onQueryChange={setGroupQuery} />
              </div>
            )}

            {currentUser?.role_type === 'nurse' && (
              <div style={{ display: activeTab === 'groups' ? 'block' : 'none' }}>
                <GroupsTab currentUser={currentUser} query={groupQuery} onQueryChange={setGroupQuery} />
              </div>
            )}

            {(currentUser?.role_type === 'admin' || currentUser?.role_type === 'manager') && (
              <div style={{ display: activeTab === 'waiting-list' ? 'block' : 'none' }}>
                <WaitingListTab currentUser={currentUser} />
              </div>
            )}

            <div style={{ display: activeTab === 'settings' ? 'block' : 'none' }}>
              <SettingsTab currentUser={currentUser} onLogout={handleLogout} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Tab Bar */}
      {isMobile && <MobileNav tabs={tabs} activeTab={activeTab} onTabClick={handleTabClick} currentUser={currentUser} />}
    </div>
  );
}
