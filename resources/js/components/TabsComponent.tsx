import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import '../pages/Admin.css';

type TabItem = { id: string; to: string; label: string; icon?: ReactNode };

export default function TabsComponent({
  items,
  collapsed,
  onToggleCollapse,
}: {
  items: TabItem[];
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  return (
    <nav className={`admin-sidebar${collapsed ? ' collapsed' : ''}`} aria-label="Section navigation">
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
      {items.map((item) => (
        <NavLink
          key={item.id}
          to={item.to}
          end
          className={({ isActive }) => `admin-sidebar-item${isActive ? ' active' : ''}`}
          title={collapsed ? item.label : undefined}
        >
          {item.icon}
          <span className="sidebar-label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
