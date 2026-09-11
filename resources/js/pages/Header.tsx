import { ChevronDown, LogOut, Settings } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import LanguageSwitcher from '../components/language-switcher';
import { getAssetUrl } from '../config';
import './Admin.css';

/**
 * Header component - Displays the header with title, user info, and action buttons
 * @param {Object} currentUser - Current authenticated user object
 * @param {Function} onLogout - Handler for logout button click
 * @param {string} currentPage - Current page (dashboard or patients)
 * @param {boolean} isMobile - Whether the current view is mobile
 */
const Header = ({ currentUser, onLogout, currentPage = 'dashboard', isMobile = false  }) => {
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
    navigate('/home/settings');
  };

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    onLogout();
  };

  const handlePatientsClick = () => {
    navigate('/patients', { replace: true });
  };

  const handleDashboardClick = () => {
      navigate('/home', { replace: true });
  };

  return (

    
    <div className="admin-header">
      <h1 className="admin-logo">
        <img src={getAssetUrl('tai.png')} alt="TAI logo" className="admin-logo-image" />
        {currentUser?.role_type === 'student' && <span className="admin-logo-subtitle">{t('user.myDashboard')}</span>}
      </h1>

      {/* Navigation buttons - centered */}
      <div className="header-nav-buttons">
        <button className={`nav-button ${currentPage === 'dashboard' ? 'active' : ''}`} onClick={handleDashboardClick}>
          <strong>{t('nav.dashboard')}</strong>
        </button>
        <button className={`nav-button ${currentPage === 'patients' ? 'active' : ''}`} onClick={handlePatientsClick}>
          <strong>{t('nav.patients')}</strong>
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
