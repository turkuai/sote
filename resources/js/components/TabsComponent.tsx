import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import './Admin.css';

export default function TabsComponent({ tabs, activeTab, onTabClick, getTabLabel, renderTabIcon, collapsed, onToggleCollapse }) {
  return (
    <nav className={`admin-sidebar${collapsed ? ' collapsed' : ''}`} role="tablist">
      <button
        type="button"
        className="sidebar-toggle"
        onClick={onToggleCollapse}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        {!collapsed && <span className="sidebar-label">Collapse</span>}
      </button>
      {tabs.map((tab) => {
        const isActive = activeTab === tab;

        return (
          <button
            key={tab}
            type="button"
            onClick={() => onTabClick(tab)}
            className={`admin-sidebar-item${isActive ? ' active' : ''}`}
            role="tab"
            aria-selected={isActive}
            title={collapsed ? getTabLabel(tab) : undefined}
          >
            {renderTabIcon && renderTabIcon(tab)}
            <span className="sidebar-label">{getTabLabel(tab)}</span>
          </button>
        );
      })}
    </nav>
  );
}
