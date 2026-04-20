import { useAuth } from "../components/AuthContext";
import { getAssetUrl } from "../config";
import '../App.css';
import './WaitingApproval.css';

export default function WaitingApproval() {
    const { currentUser, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <div className="page-container waiting-container">
            <div className="waiting-card">
                <div className="waiting-header">
                    <div className="waiting-logo">
                        <img
                            src={getAssetUrl('tai.png')}
                            alt="TAI logo"
                            className="waiting-logo-image"
                        />
                    </div>
                    <h1 className="waiting-title">Pending Approval</h1>
                    <p className="waiting-subtitle">Thank you for registering!</p>
                </div>

                <div className="waiting-content">
                    <div className="waiting-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                    </div>

                    <div className="waiting-message">
                        <p className="waiting-text">
                            Your account is awaiting administrator approval.
                        </p>
                        <p className="waiting-text">
                            We'll notify you when your account is ready to use.
                        </p>
                    </div>

                    <div className="waiting-user-info">
                        <p><strong>Name:</strong> {currentUser?.name}</p>
                        <p><strong>Email:</strong> {currentUser?.email}</p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="waiting-logout-btn"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}
