import { CareTreeTest } from '@/components/Treecomponents/CareTreeTest';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import HomeTabs from './HomeTabs';
import { TabConfig } from '@/utils/tabConfig';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CareTreeList from '@/components/care/CareTreeList';
import { CareProblem } from '@/types/caretree';

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
  
  //dummy data
  const data: CareProblem[] = [
    {
      category: [
        'Erittäminen - ruuansulatukseen, virtsateiden toimintaan, verenvuotoon ja muuhun erittämiseen liittyvät osatekijät',
        'Ulostamiseen liittyvä häiriö',
        'Ummetus',
      ],

      id: 12,
      category_id: 3,
      user: 'Hoitaja A',
      patient_id: 99,
      description: 'Vatsa ei ole toiminut kahteen päivään...',
      creation_at: '06:20',

      planItems: [
        {
          id: 1,
          problem_id: 12,
          description: 'Lorem ipsum dolor sit amet',
          user_name: 'Hoitaja A',
          created_at: '08:20',
          type: 'goal',
        },
        {
          id: 2,
          problem_id: 12,
          description: 'Lorem ipsum dolor sit amet',
          user_name: 'Hoitaja A',
          created_at: '08:20',
          type: 'goal',
        },
        {
          id: 3,
          problem_id: 12,
          description: 'Lorem ipsum dolor sit amet',
          user_name: 'Hoitaja A',
          created_at: '08:20',
          type: 'activity',
        },
        {
          id: 4,
          problem_id: 12,
          description: 'Fusce non tellus ac lectus',
          user_name: 'Hoitaja B',
          created_at: '05:34',
          type: 'activity',
        },
        {
          id: 5,
          problem_id: 12,
          description: 'Lorem ipsum dolor sit amet',
          user_name: 'Hoitaja A',
          created_at: '12:45',
          type: 'review',
        },
      ],
    },
  ];

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
        <CareTreeList careDataList={data} />
      </div>
    </div>
  </div>
  );
}
