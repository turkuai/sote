import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import './Admin.css';

import SettingsTab from './SettingsTab';
import Header from './Header';
import HomeTabs from './HomeTabs';
import MobileNav from './MobileNav';
import { usePasswordForm } from '../hooks/usePasswordForm';
import { useUserManagement } from '../hooks/useUserManagement';
import { useResponsive } from '../hooks/useResponsive';
import UsersTab from './UsersTab';
import GroupsTab from './GroupsTab';
import WaitingListTab from './WaitingListTab';
import { TabConfig } from '../utils/tabConfig';

export default function HomePage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { tab: urlTab } = useParams<{ tab: string }>();

  const [userQuery, setUserQuery] = useState('');
  const [groupQuery, setGroupQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Password form hook
  const {
    passwordForm,
    passwordStatus,
    handlers: { handlePasswordInputChange, handlePasswordSubmit, clearPasswordStatus }
  } = usePasswordForm();

  // User management hook
  const {
    handlers: { handleDeleteUser }
  } = useUserManagement();

  // Responsive hook
  const { isMobile } = useResponsive();

  // Set default tab based on role
  const [activeTab, setActiveTab] = useState(() => {
    return (currentUser?.role_type === "admin" || currentUser?.role_type === "manager") ? "users" : "settings";
  });

  useEffect(() => {
    if (activeTab !== 'settings' && passwordStatus) {
      clearPasswordStatus();
    }
  }, [activeTab, passwordStatus, clearPasswordStatus]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleNavigateDashboard = () => {
    navigate(`/home/${defaultTab}`, { replace: true });
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    navigate(`/home/${tab}`);
  };

  // Tab configuration - using utility module
  const tabs = TabConfig.getTabs(currentUser, isMobile);

  return (
    <div className="admin-page">

      {/* Header */}
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        onSettingsClick={() => handleTabClick('settings')}
        currentPage="dashboard"
        onNavigateDashboard={handleNavigateDashboard}
        isMobile={isMobile}
      />

      {/* Mobile Content */}
      {isMobile && (
        <>
          {(currentUser?.role_type === 'admin' || currentUser?.role_type === 'manager') && activeTab === 'users' && (
            <UsersTab
              currentUser={currentUser}
              query={userQuery}
              onQueryChange={setUserQuery}
              onDeleteUser={handleDeleteUser}
            />
          )}

          {(currentUser?.role_type === 'admin' || currentUser?.role_type === 'manager') && activeTab === 'groups' && (
            <GroupsTab
              currentUser={currentUser}
              query={groupQuery}
              onQueryChange={setGroupQuery}
            />
          )}

          {currentUser?.role_type === 'nurse' && activeTab === 'groups' && (
            <GroupsTab
              currentUser={currentUser}
              query={groupQuery}
              onQueryChange={setGroupQuery}
            />
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
          getTabLabel={TabConfig.getTabLabel}
          renderTabIcon={TabConfig.renderTabIcon}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(c => !c)}
        />

        <div className="admin-content-area">
          <div className="admin-content-card">
          {(currentUser?.role_type === 'admin' || currentUser?.role_type === 'manager') && (
            <div style={{ display: activeTab === 'users' ? 'block' : 'none' }}>
              <UsersTab
                currentUser={currentUser}
                query={userQuery}
                onQueryChange={setUserQuery}
                onDeleteUser={handleDeleteUser}
              />
            </div>
          )}

          {(currentUser?.role_type === 'admin' || currentUser?.role_type === 'manager') && (
            <div style={{ display: activeTab === 'groups' ? 'block' : 'none' }}>
              <GroupsTab
                currentUser={currentUser}
                query={groupQuery}
                onQueryChange={setGroupQuery}
              />
            </div>
          )}

          {currentUser?.role_type === 'nurse' && (
            <div style={{ display: activeTab === 'groups' ? 'block' : 'none' }}>
              <GroupsTab
                currentUser={currentUser}
                query={groupQuery}
                onQueryChange={setGroupQuery}
              />
            </div>
          )}

          {(currentUser?.role_type === 'admin' || currentUser?.role_type === 'manager') && (
            <div style={{ display: activeTab === 'waiting-list' ? 'block' : 'none' }}>
              <WaitingListTab currentUser={currentUser} />
            </div>
          )}

          <div style={{ display: activeTab === 'settings' ? 'flex' : 'none', flexDirection: 'column', flex: 1, minHeight: 0, overflowY: 'auto' }}>
            <SettingsTab currentUser={currentUser} onLogout={handleLogout} />
          </div>
        </div>
        </div>
      </div>

      {/* Mobile Bottom Tab Bar */}
      {isMobile && (
        <MobileNav
          tabs={tabs}
          activeTab={activeTab}
          onTabClick={handleTabClick}
          currentUser={currentUser}
        />
      )}

    </div >
  );
}


