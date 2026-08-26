import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import { useAuth } from '../components/AuthContext';
import { getAssetUrl } from '../config';
import './Login.css';

export default function Login() {
  const { login, isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
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
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <img src={getAssetUrl('tai.png')} alt="TAI logo" className="login-logo-image" />
          </div>
          <p className="login-subtitle">Please login to continue</p>
        </div>

        <form onSubmit={handleSubmit} autoComplete="on">
          <div className="login-form-group">
            <label className="login-label">Email</label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="login-input"
              name="email"
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div className="login-form-group">
            <label className="login-label">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
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
              Remember me
            </label>
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {/* Microsoft Entra ID Login */}
        <div style={{ marginTop: '1.5rem', borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
          <a href="/auth/entra-id" style={{ textDecoration: 'none' }}>
            <button type="button" className="login-submit-btn" style={{ backgroundColor: '#c5192d', width: '100%', cursor: 'pointer' }}>
              Login with @edu.turku.fi
            </button>
          </a>
          <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: '0.5rem' }}>Login using your Microsoft account</p>
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
