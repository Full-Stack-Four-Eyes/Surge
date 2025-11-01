import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import './Navbar.css'

export default function Navbar() {
  const { user, logout, userData, switchRole } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const handleRoleSwitch = async () => {
    const newRole = userData?.role === 'finder' ? 'seeker' : 'finder'
    await switchRole(newRole)
    navigate(`/${newRole}`)
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          CampusConnect
        </Link>
        
        <div className="nav-links">
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/profile" className="nav-link">Profile</Link>
              {userData && (
                <button onClick={handleRoleSwitch} className="role-switch-btn">
                  Switch to {userData.role === 'finder' ? 'Talent Seeker' : 'Talent Finder'}
                </button>
              )}
              <button onClick={handleLogout} className="nav-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="nav-button">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

