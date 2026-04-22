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
import { TabConfig } from '../utils/tabConfig';

export default function HomePage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { tab: urlTab } = useParams<{ tab: string }>();

  const [userQuery, setUserQuery] = useState('');
  const [groupQuery, setGroupQuery] = useState('');

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

  const defaultTab = (currentUser?.role === "admin" || currentUser?.role === "manager") ? "users" : "settings";

  // Set active tab from URL or default
  const [activeTab, setActiveTab] = useState(() => urlTab || defaultTab);

  // Sync activeTab with URL when URL changes
  useEffect(() => {
    if (urlTab && urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
  }, [urlTab]);

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
          {(currentUser?.role === 'admin' || currentUser?.role === 'manager') && activeTab === 'users' && (
            <UsersTab
              currentUser={currentUser}
              query={userQuery}
              onQueryChange={setUserQuery}
              onDeleteUser={handleDeleteUser}
            />
          )}

          {(currentUser?.role === 'admin' || currentUser?.role === 'manager') && activeTab === 'groups' && (
            <GroupsTab
              currentUser={currentUser}
              query={groupQuery}
              onQueryChange={setGroupQuery}
            />
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

      {/* Tabs - Desktop */}
      {!isMobile && (
        <HomeTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabClick={handleTabClick}
          getTabLabel={TabConfig.getTabLabel}
          renderTabIcon={TabConfig.renderTabIcon}
        />
      )}

      {/* Desktop Content Area */}
      <div className="admin-content hide-on-mobile">
        <div className="admin-content-card">
          {(currentUser?.role === 'admin' || currentUser?.role === 'manager') && (
            <div style={{ display: activeTab === 'users' ? 'block' : 'none' }}>
              <UsersTab
                currentUser={currentUser}
                query={userQuery}
                onQueryChange={setUserQuery}
                onDeleteUser={handleDeleteUser}
              />
            </div>
          )}

          {(currentUser?.role === 'admin' || currentUser?.role === 'manager') && (
            <div style={{ display: activeTab === 'groups' ? 'block' : 'none' }}>
              <GroupsTab
                currentUser={currentUser}
                query={groupQuery}
                onQueryChange={setGroupQuery}
              />
            </div>
          )}

          <div style={{ display: activeTab === 'settings' ? 'block' : 'none' }}>
            <SettingsTab currentUser={currentUser} onLogout={handleLogout} />
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


