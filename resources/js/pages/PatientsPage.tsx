import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { useResponsive } from '../hooks/useResponsive';
import './Admin.css';
import Header from './Header';

export default function PatientsPage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { isMobile } = useResponsive();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleNavigateDashboard = () => {
    navigate('/home', { replace: true });
  };

  return (
    <div className="admin-page">
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        currentPage="patients"
        onNavigateDashboard={handleNavigateDashboard}
        isMobile={isMobile}
      />

      <div className="admin-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div style={{ textAlign: 'center' }}>
          <h1>Patients</h1>
          <p>Patients page content goes here...</p>
        </div>
      </div>
    </div>
  );
}
