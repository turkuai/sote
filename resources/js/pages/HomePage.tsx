import { useState } from 'react';
import { Outlet, useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import './Admin.css';

import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import { useUserManagement } from '../hooks/useUserManagement';
import { TabConfig } from '../utils/tabConfig';
import HomeTabs from './HomeTabs';
import MobileNav from './MobileNav';

export default function HomePage() {
  const { currentUser, handleLogout, isMobile } = useOutletContext<{
    currentUser: any;
    handleLogout: () => void;
    isMobile: boolean;
  }>();

  const { t } = useTranslation();
  const navigate = useNavigate();
  const urlTab = useLocation().pathname.split('/')[2];

  const [userQuery, setUserQuery] = useState('');
  const [groupQuery, setGroupQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() =>
    typeof window !== 'undefined' ? localStorage.getItem('sidebar_collapsed') === 'true' : false,
  );

  const {
    handlers: { handleDeleteUser },
  } = useUserManagement();

  // Default tab based on role
  const defaultTab = currentUser?.role_type === 'admin' || currentUser?.role_type === 'manager' ? 'users' : 'settings';

  // URL controls active tab
  const activeTab = urlTab || defaultTab;

  const handleTabClick = (tab: string) => {
    navigate(`/home/${tab}`);
  };

  const tabs = TabConfig.getTabs(currentUser, isMobile);

  const headerTitles: Record<string, string> = {
    users: 'Users',
    patients: 'Patients',
    groups: 'Groups',
    settings: 'Settings',
    'waiting-list': 'Waiting List',
  };

  return (
    <div>
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
            <Header title={headerTitles[urlTab] || 'Home'} />
            <Outlet context={{ currentUser, handleLogout, isMobile, userQuery, setUserQuery, handleDeleteUser, groupQuery, setGroupQuery }} />
          </div>
        </div>
      </div>

      {/* Mobile Bottom Tab Bar */}
      {isMobile && <MobileNav tabs={tabs} activeTab={activeTab} onTabClick={handleTabClick} currentUser={currentUser} />}
    </div>
  );
}
