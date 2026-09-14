import Header from "@/pages/Header";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { useResponsive } from "../hooks/useResponsive";


export default function ProtectedLayout() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { isMobile } = useResponsive();
  const location = useLocation();
  
  const currentPage =
  location.pathname.startsWith("/patients")
    ? "patients"
    : "dashboard";

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="admin-page">
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        currentPage={currentPage}
        isMobile={isMobile}
      />

      <Outlet context={{ currentUser, handleLogout, isMobile }} />
    </div>
  );
}
