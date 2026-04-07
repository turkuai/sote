import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

import SettingsTab from './SettingsTab';
import Header from './Header';
import HomeTabs from './HomeTabs';
import MobileNav from './MobileNav';
import { usePasswordForm } from '../hooks/usePasswordForm';
import { useUserManagement } from '../hooks/useUserManagement';
import { useResponsive } from '../hooks/useResponsive';
import UsersTab from './UsersTab';
import { TabConfig } from '../utils/tabConfig';

export default function HomePage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [userQuery, setUserQuery] = useState('');

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
    return currentUser?.role === "admin" ? "users" : "settings";
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

  // Tab configuration - using utility module
  const tabs = TabConfig.getTabs(currentUser, isMobile);

  return (
    <div className="admin-page">

      {/* Header */}
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        onSettingsClick={() => setActiveTab('settings')}
        isMobile={isMobile}
      />

      {/* Mobile Content */}
      {isMobile && (
        <>
          {currentUser?.role === 'admin' && activeTab === 'users' && (
            <UsersTab
              currentUser={currentUser}
              query={userQuery}
              onQueryChange={setUserQuery}
              onDeleteUser={handleDeleteUser}
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
          onTabClick={setActiveTab}
          getTabLabel={TabConfig.getTabLabel}
          renderTabIcon={TabConfig.renderTabIcon}
        />
      )}

      {/* Desktop Content Area */}
      <div className="admin-content hide-on-mobile">
        <div className="admin-content-card">
          {currentUser?.role === 'admin' && (
            <div style={{ display: activeTab === 'users' ? 'block' : 'none' }}>
              <UsersTab
                currentUser={currentUser}
                query={userQuery}
                onQueryChange={setUserQuery}
                onDeleteUser={handleDeleteUser}
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
          onTabClick={setActiveTab}
          currentUser={currentUser}
        />
      )}

    </div >
  );
}


