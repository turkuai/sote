import { Settings, Users } from 'lucide-react';
import './Admin.css';

/**
 * MobileNav component - Mobile bottom navigation bar with tabs
 * @param {Array} tabs - Array of tab identifiers to display
 * @param {string} activeTab - Currently active tab identifier
 * @param {Function} onTabClick
 * @param {Object} currentUser
 */
const MobileNav = ({ tabs, activeTab, onTabClick, currentUser }) => {
  const tabIconMap = {
    users: Users,
    settings: Settings,
  };

  const renderTabIcon = (tab) => {
    const IconComponent = tabIconMap[tab];
    if (!IconComponent) {
      return null;
    }

    return <IconComponent size={22} strokeWidth={2.2} aria-hidden="true" />;
  };

  return (
    <nav className="admin-mobile-nav admin-mobile-nav--no-camera" aria-label="Navigation">
      {tabs.map((tab) => (
        <button
          type="button"
          onClick={() => onTabClick(tab)}
          className={['admin-mobile-nav__cell', activeTab === tab ? 'is-active' : ''].join(' ').trim()}
          aria-label={tab}
          key={tab}
        >
          {renderTabIcon(tab)}
        </button>
      ))}
    </nav>
  );
};

export default MobileNav;
