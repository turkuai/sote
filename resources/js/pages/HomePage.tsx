import { useState } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TabsComponent from '../components/TabsComponent';
import MobileNav from './MobileNav';
import { TabConfig } from '../utils/tabConfig';

export default function HomePage() {
  const { currentUser, handleLogout, isMobile } = useOutletContext<{ currentUser: any; handleLogout: () => void; isMobile: boolean }>();
  const { t } = useTranslation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() =>
    typeof window !== 'undefined' && localStorage.getItem('sidebar_collapsed') === 'true',
  );
  const tabs = TabConfig.getTabs(currentUser, isMobile);
  const items = tabs.map((id) => ({
    id,
    to: `/home/${id}`,
    label: TabConfig.getTabLabel(id, t),
    icon: TabConfig.renderTabIcon(id),
  }));

  return (
    <div>
      <div className="admin-body">
        <div className="hide-on-mobile">
          <TabsComponent
            items={items}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed((collapsed) => {
              const next = !collapsed;
              localStorage.setItem('sidebar_collapsed', String(next));
              return next;
            })}
          />
        </div>
        <div className="admin-content-area">
          <div className="admin-content-card"><Outlet context={{ currentUser, handleLogout, isMobile }} /></div>
        </div>
      </div>
      {isMobile && <MobileNav items={items} />}
    </div>
  );
}
