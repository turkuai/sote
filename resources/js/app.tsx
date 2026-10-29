import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import '../css/app.css';
import { AuthProvider, useAuth } from './components/AuthContext';
import { NotificationProvider } from './components/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import './i18n';
import ProtectedLayout from './layouts/ProtectedLayout';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import PatientReportPage from './pages/PatientReportPage';
import PatientsPage from './pages/PatientsPage';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import WaitingApproval from './pages/WaitingApproval';
import PatientInfo from './pages/PatientsInfoTest';

function App() {
  const { isAuthenticated, loading, currentUser } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '18px',
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            !currentUser?.role_type ? (
              <Navigate to="/waiting-approval" replace />
            ) : (
              <Navigate to="/home" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/home" replace /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/home" replace /> : <Register />} />
      <Route path="/waiting-approval" element={isAuthenticated && !currentUser?.role_type ? <WaitingApproval /> : <Navigate to="/" replace />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route element={<ProtectedRoute />}>
      <Route element={<ProtectedLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/home/:tab" element={<HomePage />} />
        <Route path="/patients" element={<PatientsPage />} />
        <Route path="/patients/:patientId" element={<PatientReportPage />} />
        <Route path="/patients/:patientId/info" element={<PatientInfo />} />
      </Route>
</Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>,
  );
}

export default App;
