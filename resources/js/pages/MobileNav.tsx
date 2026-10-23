import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import './Admin.css';

type NavItem = { id: string; to: string; label: string; icon?: ReactNode };

export default function MobileNav({ items }: { items: NavItem[] }) {
  return (
    <nav className="admin-mobile-nav admin-mobile-nav--no-camera" aria-label="Section navigation">
      {items.map((item) => (
        <NavLink
          key={item.id}
          to={item.to}
          end
          aria-label={item.label}
          title={item.label}
          className={({ isActive }) => `admin-mobile-nav__cell${isActive ? ' is-active' : ''}`}
        >
          {item.icon}
        </NavLink>
      ))}
    </nav>
  );
}
