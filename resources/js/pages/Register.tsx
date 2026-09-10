import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import { useAuth } from '../components/AuthContext';
import { getAssetUrl } from '../config';
import './Register.css';

export default function Register() {
  const { register, isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(!currentUser?.role_type ? '/waiting-approval' : '/home', { replace: true });
    }
  }, [isAuthenticated, currentUser?.role_type, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setLoading(true);

    try {
      const result = await register(firstName, lastName, email, password, passwordConfirmation);

      if (result.success) {
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setPasswordConfirmation('');
      } else {
        setError(result.error);
        if (result.errors) {
          setFieldErrors(result.errors);
        }
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container register-container">
      <div className="register-card">
        <div className="register-header">
          <div className="register-logo">
            <img src={getAssetUrl('tai.png')} alt="TAI logo" className="register-logo-image" />
          </div>
          <p className="register-subtitle">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} autoComplete="on">
          <div className="register-form-row">
            <div className="register-form-group">
              <label className="register-label">First Name</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                className="register-input"
                name="first_name"
                disabled={loading}
              />
              {fieldErrors.first_name && <span className="register-field-error">{fieldErrors.first_name[0]}</span>}
            </div>

            <div className="register-form-group">
              <label className="register-label">Last Name</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                className="register-input"
                name="last_name"
                disabled={loading}
              />
              {fieldErrors.last_name && <span className="register-field-error">{fieldErrors.last_name[0]}</span>}
            </div>
          </div>

          <div className="register-form-group">
            <label className="register-label">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="register-input"
              name="email"
              autoComplete="email"
              disabled={loading}
            />
            {fieldErrors.email && <span className="register-field-error">{fieldErrors.email[0]}</span>}
          </div>

          <div className="register-form-group">
            <label className="register-label">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              required
              className="register-input"
              name="password"
              autoComplete="new-password"
              disabled={loading}
            />
            {fieldErrors.password && <span className="register-field-error">{fieldErrors.password[0]}</span>}
          </div>

          <div className="register-form-group">
            <label className="register-label">Confirm Password</label>
            <input
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              type="password"
              placeholder="Confirm password"
              required
              className="register-input"
              name="password_confirmation"
              autoComplete="new-password"
              disabled={loading}
            />
            {fieldErrors.password_confirmation && <span className="register-field-error">{fieldErrors.password_confirmation[0]}</span>}
          </div>

          {error && <div className="register-error">{error}</div>}

          <button type="submit" className="register-submit-btn" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
