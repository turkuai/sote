import { useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import './Admin.css';

import { useTranslation } from 'react-i18next';
import { TabConfig } from '../utils/tabConfig';
import GroupsTab from './GroupsTab';
import HomeTabs from './HomeTabs';
import MobileNav from './MobileNav';
import PatientsTab from './PatientsTab';
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
    typeof window !== 'undefined' ? localStorage.getItem('sidebar_collapsed') === 'true' : false,
  );

  // Default tab based on role
  const defaultTab = currentUser?.role_type === 'admin' || currentUser?.role_type === 'manager' ? 'users' : 'settings';

  // URL controls active tab
  const activeTab = urlTab || defaultTab;

  const handleTabClick = (tab: string) => {
    navigate(`/home/${tab}`);
  };

  const tabs = TabConfig.getTabs(currentUser, isMobile);

  const isAdminOrManager = currentUser?.role_type === 'admin' || currentUser?.role_type === 'manager';

  const isNurse = currentUser?.role_type === 'nurse';

  const content = (
    <>
      {isAdminOrManager && activeTab === 'users' && <UsersTab currentUser={currentUser} query={userQuery} onQueryChange={setUserQuery} />}
      {(isAdminOrManager || isNurse) && activeTab === 'groups' && (
        <GroupsTab currentUser={currentUser} query={groupQuery} onQueryChange={setGroupQuery} />
      )}
      {isAdminOrManager && activeTab === 'waiting-list' && <WaitingListTab currentUser={currentUser} />}
      {isAdminOrManager && activeTab === 'patients' && <PatientsTab currentUser={currentUser} query="" />}
      {activeTab === 'settings' && <SettingsTab currentUser={currentUser} onLogout={handleLogout} />}
    </>
  );

  return (
    <div className={isMobile ? 'mobile-tab-content' : 'admin-body'}>
      {!isMobile && (
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
      )}
      <div className={isMobile ? 'mobile-content-section' : 'admin-content-area'}>
        <div className={isMobile ? undefined : 'admin-content-card'}>{content}</div>
      </div>
      <MobileNav tabs={tabs} activeTab={activeTab} onTabClick={handleTabClick} currentUser={currentUser} />
    </div>
  );
}
