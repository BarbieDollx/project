import {Link} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import "./Dashboard.css";

const Dashboard = () => {
    const {user, logout} = useAuth();

    return(
        <div className='dashboard'>
            <header className='dashboard-header'>
                <div className='logo'>AccountHub</div>
                <nav>
                    <Link to="/dashboard" className='nav-link active'>Dashboard</Link>
                    <Link to="/settings" className='nav-link'>Settings</Link>
                    <button onClick={logout} className='btn-outline'>Logout</button>
                </nav>
            </header>
            <main className='container'>
                <div className='profile'>
                   <h1>Welcome back, {user?.name || "User"}!</h1>
                   <p>Here's an overview of your account.</p>
                </div>
              <div className="card-box">
                <div className="card"> 
                    <p>EMAIL</p>
                    <h2>{user?.email || "N/A"}</h2>
                </div>
                <div className="card">
                    <p>MEMBER SINCE</p>
                    <h2>Just now</h2>
                </div>
                <div className="card">
                    <p>ACCOUNT STATUS</p>
                    <h2 className='activee'>Active</h2>
                </div>
              </div>
              <div className='container2'>
                <h1>Quick Actions</h1>
                <div className='box2'>
                   <div className='settings-link'>
                     <Link to="/settings">Edit Profile</Link>
                   </div>
                   <div>Change Password</div>
                </div>
              </div>
            </main>
        </div>
    )
}

export default Dashboard;