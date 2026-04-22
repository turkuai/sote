import '../css/app.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext';
import { NotificationProvider } from './components/NotificationContext';
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import PatientsPage from "./pages/PatientsPage";
import VerifyEmail from "./pages/VerifyEmail";

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/home" replace /> : <Login />}
      />
      <Route path="/verify-email" element={<VerifyEmail />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/home/:tab" element={<HomePage />} />
        <Route path="/patients" element={<PatientsPage />} />
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
    </React.StrictMode>
  );
}

export default App;
