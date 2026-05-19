import React from 'react';
import './Admin.css';

export default function HomeTabs({ tabs, activeTab, onTabClick, getTabLabel, renderTabIcon }) {
  return (
    <nav className="admin-sidebar" role="tablist">
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
          >
            {renderTabIcon && renderTabIcon(tab)}
            {getTabLabel(tab)}
          </button>
        );
      })}
    </nav>
  );
}


