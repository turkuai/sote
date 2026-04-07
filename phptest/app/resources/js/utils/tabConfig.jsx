import React from 'react';
import { Settings, Users } from 'lucide-react';

// Tab icon map - maps tab names to their corresponding icon components
const TAB_ICON_MAP = {
  users: Users,
  settings: Settings,
};

// Tab label map - base labels for tabs
const TAB_LABEL_MAP = {
  users: 'Users',
  settings: 'Settings',
};

/**
 * Tab configuration utility module
 * Provides reusable functions for tab management, labels, and icons
 */
export const TabConfig = {
  /**
   * Get available tabs based on user role and mobile state
   * @param {Object} currentUser - Current authenticated user object
   * @param {boolean} isMobile - Whether the view is mobile
   * @returns {Array<string>} - Array of tab identifiers
   */
  getTabs(currentUser, isMobile) {
    const tabs = [];

    if (currentUser?.role === 'admin') {
      tabs.push('users');
    }

    tabs.push('settings');

    return tabs;
  },

  /**
   * Get label for a tab
   * @param {string} tab - Tab identifier
   * @param {boolean} forMobile - Whether the label is for mobile view
   * @returns {string} - Tab label
   */
  getTabLabel(tab, forMobile = false) {
    return TAB_LABEL_MAP[tab] || tab;
  },

  /**
   * Render icon component for a tab
   * @param {string} tab - Tab identifier
   * @returns {React.ReactElement|null} - Icon component or null
   */
  renderTabIcon(tab) {
    const IconComponent = TAB_ICON_MAP[tab];
    if (!IconComponent) return null;
    return React.createElement(IconComponent, { size: 18 });
  },

  /**
   * Get icon component for a tab (without rendering)
   * @param {string} tab - Tab identifier
   * @returns {React.ComponentType|null} - Icon component class or null
   */
  getTabIcon(tab) {
    return TAB_ICON_MAP[tab] || null;
  },
};
