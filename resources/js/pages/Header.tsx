import { ChevronDown, LogOut, Settings } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
<<<<<<< HEAD
import { useTranslation } from 'react-i18next';
=======
>>>>>>> 6419687 (Every file autoformatted)
import { useNavigate } from 'react-router-dom';
import LanguageSwitcher from '../components/language-switcher';
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
const Header = ({ currentUser, onLogout, onSettingsClick, currentPage = 'dashboard', onNavigateDashboard, isMobile = false }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

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
        <img src={getAssetUrl('tai.png')} alt="TAI logo" className="admin-logo-image" />
<<<<<<< HEAD
        {currentUser?.role_type === 'student' && <span className="admin-logo-subtitle">{t('user.myDashboard')}</span>}
=======
        {currentUser?.role_type === 'student' && <span className="admin-logo-subtitle">My Dashboard</span>}
>>>>>>> 6419687 (Every file autoformatted)
      </h1>

      {/* Navigation buttons - centered */}
      <div className="header-nav-buttons">
        <button className={`nav-button ${currentPage === 'dashboard' ? 'active' : ''}`} onClick={handleDashboardClick}>
<<<<<<< HEAD
          <strong>{t('nav.dashboard')}</strong>
        </button>
        <button className={`nav-button ${currentPage === 'patients' ? 'active' : ''}`} onClick={handlePatientsClick}>
          <strong>{t('nav.patients')}</strong>
=======
          <strong>Dashboard</strong>
        </button>
        <button className={`nav-button ${currentPage === 'patients' ? 'active' : ''}`} onClick={handlePatientsClick}>
          <strong>Patients</strong>
>>>>>>> 6419687 (Every file autoformatted)
        </button>
      </div>

      <div className="admin-header-actions">
        <LanguageSwitcher />
        {!isMobile && (
          <div className="user-dropdown-container" ref={dropdownRef}>
            <button className="user-dropdown-trigger" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <span className="user-info-text">
                {t('user.welcome')}, <strong>{currentUser?.name}</strong>
              </span>
              <ChevronDown size={16} className={`dropdown-icon ${isDropdownOpen ? 'open' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="user-dropdown-menu">
                <button className="dropdown-menu-item" onClick={handleSettingsClick}>
                  <Settings size={16} />
                  {t('user.settings')}
                </button>
                <button className="dropdown-menu-item logout-item" onClick={handleLogoutClick}>
                  <LogOut size={16} />
                  {t('user.logout')}
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
