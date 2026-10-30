import { CareTreeTest } from '@/components/Treecomponents/CareTreeTest';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import HomeTabs from './HomeTabs';
import { TabConfig } from '@/utils/tabConfig';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Patient report page.
 * Route: /patients/:patientId (see resources/js/app.tsx).
 * The patient id can be read with useParams: const { patientId } = useParams();
 */

export default function PatientReportPage() {
  const { currentUser, handleLogout, isMobile } = useOutletContext<{
    currentUser: any;
    handleLogout: () => void;
    isMobile: boolean;
  }>();

const { t } = useTranslation();
const navigate = useNavigate();




const { patientId, tab: urlTab } = useParams<{ patientId: string; tab: string }>();

const tabs = ['care-tree', 'info']; // your two tab keys
const defaultTab = 'care-tree';
const activeTab = urlTab && tabs.includes(urlTab) ? urlTab : defaultTab;


const [sidebarCollapsed, setSidebarCollapsed] = useState(() =>
    typeof window !== 'undefined'
      ? localStorage.getItem('sidebar_collapsed') === 'true'
      : false
  );

const handleTabClick = (tab: string) => {
  navigate(`/patients/${patientId}/${tab}`);
};
  
  return (
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
        <CareTreeTest />
      </div>
    </div>
  </div>
  );
}
