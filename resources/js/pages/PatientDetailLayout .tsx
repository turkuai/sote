import { TabConfig } from '@/utils/tabConfig';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import HomeTabs from './HomeTabs';

export default function PatientDetailLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { patientId } = useParams<{ patientId: string }>();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() =>
    typeof window !== 'undefined' ? localStorage.getItem('sidebar_collapsed') === 'true' : false,
  );

  const tabs = ['care-tree', 'info']; // your two tab keys
  const activeTab = location.pathname.includes('info') ? 'info' : 'care-tree';

  //navigates to the unactivetab
  const handleTabClick = (tab: 'info' | 'care-tree') => {
    navigate(tab == 'info' ? `/patients/${patientId}/info` : `/patients/${patientId}`);
  };

  return (
    <main className="admin-body hide-on-mobile">
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
      <Outlet />
    </main>
  );
}
