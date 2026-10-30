import { Clock, Folder, Settings, Stethoscope, Users } from 'lucide-react';
import React from 'react';

// Tab icon map - maps tab names to their corresponding icon components
const TAB_ICON_MAP = {
  users: Users,
  groups: Folder,
  'waiting-list': Clock,
  settings: Settings,
  patients: Stethoscope,
};

// Tab label map - base labels for tabs

const TAB_LABEL_KEY_MAP = {
  users: 'tabs.users',
  groups: 'tabs.groups',
  'waiting-list': 'tabs.waitingList',
  settings: 'tabs.settings',
  patients: 'tabs.patients',
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

    if (currentUser?.role_type === 'admin' || currentUser?.role_type === 'manager') {
      tabs.push('users');
      tabs.push('patients');
      tabs.push('groups');
      tabs.push('waiting-list');
    }

    if (currentUser?.role_type === 'nurse') {
      tabs.push('groups');
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
  getTabLabel(tab, t) {
    const key = TAB_LABEL_KEY_MAP[tab];
    return key ? t(key) : tab;
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
