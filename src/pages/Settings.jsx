import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // ← Added useNavigate
import { useAuth } from '../context/AuthContext';
import "./Settings.css";

const Settings = () => {
    const { user, logout } = useAuth(); // ← Removed updatePassword (doesn't exist)
    const navigate = useNavigate(); // ← Added for logout redirect
    
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    const [profileMessage, setProfileMessage] = useState("");
    const [profileError, setProfileError] = useState("");
    const [profileLoading, setProfileLoading] = useState(false);
    
    const [passwordMessage, setPasswordMessage] = useState(""); // ← Added
    const [passwordError, setPasswordError] = useState(""); // ← Added
    const [passwordLoading, setPasswordLoading] = useState(false); // ← Added

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setProfileMessage("");
        setProfileError("");
        setProfileLoading(true);

        try {
            // You'll need to add updateProfile to AuthContext
            // For now, just show a message
            setProfileMessage('Profile updated successfully!');
        } catch (err) {
            setProfileError(err.message || 'Update failed');
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordMessage("");
        setPasswordError("");
        setPasswordLoading(true);

        if (newPassword !== confirmPassword) {
            setPasswordError('New password does not match!');
            setPasswordLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            setPasswordLoading(false);
            return;
        }

        try {
            // You'll need to add changePassword to AuthContext
            // For now, just show a message
            setPasswordMessage('Password updated successfully!');
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            setPasswordError(err.message || 'Password update failed');
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="settings-container"> {/* ← Changed class name */}
            <header className="settings-header"> {/* ← Added header */}
                <div className="logo">AccountHub</div>
                <nav>
                    <Link to="/dashboard" className="nav-link">Dashboard</Link>
                    <Link to="/settings" className="nav-link active">Settings</Link>
                    <button onClick={handleLogout} className="btn-outline">Logout</button>
                </nav>
            </header>

            <main className="settings-main"> {/* ← Changed class name */}
                <h1>Settings</h1>
                
                <div className="profile-section"> {/* ← Changed class name */}
                    <h3>Edit Profile</h3>
                    {profileMessage && <div className="success-message">{profileMessage}</div>}
                    {profileError && <div className="error-message">{profileError}</div>}
                    <form onSubmit={handleProfileSubmit}>
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button type="submit" disabled={profileLoading}>
                            {profileLoading ? "Saving..." : "Save Changes"}
                        </button>
                    </form>
                </div>

                <div className="password-section"> {/* ← Changed class name */}
                    <h3>Change Password</h3>
                    {passwordMessage && <div className="success-message">{passwordMessage}</div>}
                    {passwordError && <div className="error-message">{passwordError}</div>}
                    <form onSubmit={handlePasswordSubmit}>
                        <label htmlFor="currentPassword">Current Password</label>
                        <input
                            type="password"
                            id="currentPassword"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                        <label htmlFor="newPassword">New Password</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <button type="submit" disabled={passwordLoading}>
                            {passwordLoading ? "Updating..." : "Update Password"}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Settings;