import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAssetUrl } from '../config';
import './Admin.css';

/**
 * Header component - Displays the header with title, user info, and action buttons
 * @param {Object} currentUser - Current authenticated user object
 * @param {Function} onLogout - Handler for logout button click
 * @param {Function} onSettingsClick - Handler for settings menu click
 * @param {string} currentPage - Current page (dashboard or patients)
 * @param {Function} onNavigateDashboard - Handler for dashboard navigation
 * @param {boolean} isMobile - Whether the current view is mobile
 */
const Header = ({ 
  currentUser, 
  onLogout, 
  onSettingsClick, 
  currentPage = 'dashboard',
  onNavigateDashboard,
  isMobile = false 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSettingsClick = () => {
    setIsDropdownOpen(false);
    if (onSettingsClick) {
      onSettingsClick();
    }
  };

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    onLogout();
  };

  const handlePatientsClick = () => {
    navigate('/patients', { replace: true });
  };

  const handleDashboardClick = () => {
    if (onNavigateDashboard) {
      onNavigateDashboard();
    } else {
      navigate('/home', { replace: true });
    }
  };

  return (
    <div className="admin-header">
      <h1 className="admin-logo">
        <img
          src={getAssetUrl('tai.png')}
          alt="TAI logo"
          className="admin-logo-image"
        />
        {currentUser?.role === 'student' && (
          <span className="admin-logo-subtitle">My Dashboard</span>
        )}
      </h1>

      {/* Navigation buttons - centered */}
      <div className="header-nav-buttons">
        <button 
          className={`nav-button ${currentPage === 'dashboard' ? 'active' : ''}`}
          onClick={handleDashboardClick}
        >
          <strong>Dashboard</strong>
        </button>
        <button 
          className={`nav-button ${currentPage === 'patients' ? 'active' : ''}`}
          onClick={handlePatientsClick}
        >
          <strong>Patients</strong>
        </button>
      </div>

      <div className="admin-header-actions">
        {!isMobile && (
          <div className="user-dropdown-container" ref={dropdownRef}>
            <button
              className="user-dropdown-trigger"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="user-info-text">
                Welcome, <strong>{currentUser?.name}</strong>
              </span>
              <ChevronDown size={16} className={`dropdown-icon ${isDropdownOpen ? 'open' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="user-dropdown-menu">
                <button className="dropdown-menu-item" onClick={handleSettingsClick}>
                  <Settings size={16} />
                  Settings
                </button>
                <button className="dropdown-menu-item logout-item" onClick={handleLogoutClick}>
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;


