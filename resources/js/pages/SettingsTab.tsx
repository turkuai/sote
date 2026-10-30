import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router-dom';
import 'tai-grid/style.css';
import { getApiBase } from '../config';
import './Admin.css';

/**
 * SettingsTab component - User settings including user details, password change, and logout
 * @param {Object} currentUser - Current authenticated user object
 * @param {Function} onLogout - Handler for logout button click
 */
const SettingsTab = ({}) => {
  const { handleLogout: onLogout, currentUser } = useOutletContext<{
    handleLogout: () => void;
    currentUser: { role_type?: String; id?: string; name?: string; username?: string } | null;
  }>();

  const { t } = useTranslation();
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordStatus, setPasswordStatus] = useState(null);

  const handlePasswordInputChange = (field, value) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordStatus({ type: 'error', message: t('settings.password.errors.fillAllFields') });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({ type: 'error', message: t('settings.password.errors.passwordMismatch') });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordStatus({ type: 'error', message: t('settings.password.errors.passwordTooShort') });
      return;
    }

    try {
      const response = await fetch(`${getApiBase()}/api/users/${currentUser?.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: passwordForm.newPassword,
          current_password: passwordForm.currentPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || t('settings.password.errors.failed'));
      }

      setPasswordStatus({ type: 'success', message: t('settings.password.success') });
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Password change error:', error);
      setPasswordStatus({ type: 'error', message: error.message || t('settings.password.errors.tryAgain') });
    }
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return (
      <div className="admin-settings">
        <div className="admin-settings-section">
          <h3>{t('settings.mobile.userDetails')}</h3>
          <div className="settings-field">
            <span className="settings-label">{t('settings.fields.name')}</span>
            <span className="settings-value">{currentUser?.name || '-'}</span>
          </div>
          <div className="settings-field">
            <span className="settings-label">{t('settings.fields.username')}</span>
            <span className="settings-value">{currentUser?.username || '-'}</span>
          </div>
          <div className="settings-field">
            <span className="settings-label">{t('settings.fields.role')}</span>
            <span className="settings-value">{currentUser?.role_type || '-'}</span>
          </div>
        </div>

        <div className="admin-settings-section">
          <h3>{t('settings.mobile.changePassword')}</h3>
          <form className="password-form" onSubmit={handlePasswordSubmit} autoComplete="off">
            <label className="password-form-field">
              <span>{t('settings.password.current')}</span>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => handlePasswordInputChange('currentPassword', e.target.value)}
                placeholder={t('settings.password.placeholders.current')}
              />
            </label>
            <label className="password-form-field">
              <span>{t('settings.password.new')}</span>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)}
                placeholder={t('settings.password.placeholders.new')}
              />
            </label>
            <label className="password-form-field">
              <span>{t('settings.password.confirmNew')}</span>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => handlePasswordInputChange('confirmPassword', e.target.value)}
                placeholder={t('settings.password.placeholders.confirm')}
              />
            </label>

            {passwordStatus && (
              <div className={`password-status ${passwordStatus.type === 'error' ? 'error' : 'success'}`} role="alert">
                {passwordStatus.message}
              </div>
            )}

            <button type="submit" className="password-submit-btn">
              {t('settings.actions.updatePassword')}
            </button>
          </form>
        </div>

        <div className="admin-settings-section">
          <h3>{t('settings.mobile.account')}</h3>
          <button type="button" className="settings-logout-btn" onClick={onLogout}>
            {t('user.logout')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>{t('settings.header.title')}</h2>
        <p>{t('settings.header.description')}</p>
      </div>

      <div className="settings-layout">
        <div className="settings-sidebar">
          <button className="settings-nav-item active">{t('settings.tabs.profile')}</button>
        </div>

        <div className="settings-content">
          <div className="settings-profile">
            <h3>{t('settings.profile.title')}</h3>
            <p className="settings-description">{t('settings.profile.description')}</p>

            <div className="settings-form-group">
              <label>{t('settings.fields.name')}</label>
              <input type="text" value={currentUser?.name || 'Mohammad Admin'} readOnly className="settings-input" />
            </div>

            <div className="settings-form-group">
              <label>{t('settings.fields.username')}</label>
              <input type="text" value={currentUser?.username || 'admin'} readOnly className="settings-input" />
            </div>

            <div className="settings-form-group">
              <label>{t('settings.fields.role')}</label>
              <input type="text" value={String(currentUser?.role_type || 'Administrator')} readOnly className="settings-input" />
            </div>

            <div className="settings-form-group">
              <label>{t('settings.password.current')}</label>
              <input
                type="password"
                autoComplete="new-password"
                value={passwordForm.currentPassword}
                onChange={(e) => handlePasswordInputChange('currentPassword', e.target.value)}
                placeholder={t('settings.password.placeholders.current')}
                className="settings-input"
              />
            </div>

            <div className="settings-form-group">
              <label>{t('settings.password.new')}</label>
              <input
                type="password"
                autoComplete="new-password"
                value={passwordForm.newPassword}
                onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)}
                placeholder={t('settings.password.placeholders.new')}
                className="settings-input"
              />
            </div>

            <div className="settings-form-group">
              <label>{t('settings.password.confirm')}</label>
              <input
                type="password"
                autoComplete="new-password"
                value={passwordForm.confirmPassword}
                onChange={(e) => handlePasswordInputChange('confirmPassword', e.target.value)}
                placeholder={t('settings.password.placeholders.confirmDesktop')}
                className="settings-input"
              />
            </div>

            {passwordStatus && (
              <div className={`password-status ${passwordStatus.type === 'error' ? 'error' : 'success'}`} role="alert">
                {passwordStatus.message}
              </div>
            )}

            <div className="settings-actions">
              <button type="button" className="settings-update-btn" onClick={handlePasswordSubmit}>
                {t('settings.actions.updateProfile')}
              </button>
              <button type="button" className="settings-logout-btn-new" onClick={onLogout}>
                {t('user.logout')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
