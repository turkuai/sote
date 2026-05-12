import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import { useAuth } from '../components/AuthContext';
import LanguageSwitcher from '../components/language-switcher';
import { getAssetUrl } from '../config';
import './Login.css';

export default function Login() {
  const { login, isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(currentUser?.role_type ? '/home' : '/waiting-approval', { replace: true });
    }
  }, [isAuthenticated, currentUser?.role_type, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password, rememberMe);

      if (result.success) {
        // Server automatically sets httpOnly cookie with JWT token if rememberMe is true
        // No client-side storage needed
        setPassword('');
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container login-container">
      <div
        style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          zIndex: 10,
        }}
      >
        <LanguageSwitcher />
      </div>
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <img src={getAssetUrl('tai.png')} alt="TAI logo" className="login-logo-image" />
          </div>
          <p className="login-subtitle">{t('auth.pleaseLoginToContinue')}</p>
        </div>

        <form onSubmit={handleSubmit} autoComplete="on">
          <div className="login-form-group">
            <label className="login-label">{t('auth.email')}</label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('auth.enterYourEmail')}
              className="login-input"
              name="email"
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div className="login-form-group">
            <label className="login-label">{t('auth.password')}</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder={t('auth.password')}
              required
              className="login-input"
              name="password"
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          {/* Remember me checkbox - tells server to set persistent httpOnly cookie */}
          <div className="login-form-group">
            <label className="login-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} disabled={loading} />
              {t('auth.rememberMe')}
            </label>
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? t('auth.signingIn') : t('auth.signIn')}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            {t('auth.noAccount')}{' '}
            <Link to="/register" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}>
              {t('auth.signUp')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
