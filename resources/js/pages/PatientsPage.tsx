import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { useResponsive } from '../hooks/useResponsive';
import './Admin.css';
import Header from './Header';
import PatientsData from './PatientsData';

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

  const handleSettingsClick = () => {
    navigate(`/home/settings`);
  };

  const [userQuery, setUserQuery] = React.useState('');

  return (
    <div className="admin-page">
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        currentPage="patients"
        onNavigateDashboard={handleNavigateDashboard}
        isMobile={isMobile}
        onSettingsClick={handleSettingsClick}
      />

      <div
        className="admin-content"
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}
      >
        <div style={{ textAlign: 'center' }}>
          <PatientsData
            currentUser={currentUser}
            query={userQuery}
            onQueryChange={setUserQuery}
          />
        </div>
      </div>
    </div>
  );
}
