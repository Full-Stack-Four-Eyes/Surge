import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import ChatList from './ChatList'
import Chat from './Chat'
import './Navbar.css'

export default function Navbar() {
  const { user, logout, userData, switchRole } = useAuth()
  const navigate = useNavigate()
  const [showChatList, setShowChatList] = useState(false)
  const [chatUser, setChatUser] = useState(null)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const handleRoleSwitch = async () => {
    const newRole = userData?.role === 'finder' ? 'seeker' : 'finder'
    await switchRole(newRole)
    navigate(`/${newRole}`)
  }

  const handleChatSelect = (userId, userName) => {
    setChatUser({ id: userId, name: userName })
    setShowChatList(false)
  }

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            🎓 CampusConnect
          </Link>
          
          <div className="nav-links">
            {user ? (
              <>
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <Link to="/profile" className="nav-link">Profile</Link>
                <button 
                  onClick={() => setShowChatList(!showChatList)} 
                  className="nav-link chat-toggle"
                  style={{ position: 'relative' }}
                >
                  💬 Messages
                </button>
                {userData && (
                  <button onClick={handleRoleSwitch} className="role-switch-btn">
                    🔄 {userData.role === 'finder' ? 'Seeker' : 'Finder'}
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

      {showChatList && user && (
        <div className="chat-list-overlay" onClick={() => setShowChatList(false)}>
          <div className="chat-list-container" onClick={(e) => e.stopPropagation()}>
            <ChatList onSelectChat={handleChatSelect} />
          </div>
        </div>
      )}

      {chatUser && (
        <Chat
          userId={chatUser.id}
          userName={chatUser.name}
          onClose={() => setChatUser(null)}
        />
      )}
    </>
  )
}

