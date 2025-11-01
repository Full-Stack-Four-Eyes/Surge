import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import { useDarkMode } from '../hooks/useDarkMode.jsx'
import ChatList from './ChatList'
import Chat from './Chat'
import RoleToggle from './RoleToggle'
import './Navbar.css'

export default function Navbar() {
  const { user, logout, userData } = useAuth()
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const navigate = useNavigate()
  const [showChatList, setShowChatList] = useState(false)
  const [chatUser, setChatUser] = useState(null)

  const handleLogout = async () => {
    await logout()
    navigate('/')
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
            {!user && (
              <>
                <Link to="/about" className="nav-link">About</Link>
                <Link to="/contact" className="nav-link">Contact</Link>
              </>
            )}
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
                {userData && <RoleToggle />}
                <button 
                  onClick={toggleDarkMode} 
                  className="dark-mode-toggle"
                  title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  aria-label="Toggle dark mode"
                >
                  {isDarkMode ? '☀️' : '🌙'}
                </button>
                <button onClick={handleLogout} className="nav-button">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/signup" className="nav-button">Sign Up</Link>
                <button 
                  onClick={toggleDarkMode} 
                  className="dark-mode-toggle"
                  title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  aria-label="Toggle dark mode"
                >
                  {isDarkMode ? '☀️' : '🌙'}
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {showChatList && user && (
        <div className="chat-list-overlay" onClick={() => setShowChatList(false)}>
          <div className="chat-list-container" onClick={(e) => e.stopPropagation()}>
            <div className="chat-list-wrapper" style={{ 
              borderRadius: 'var(--border-radius-lg)', 
              padding: '1.5rem',
              boxShadow: 'var(--shadow-xl)',
              maxHeight: '500px',
              overflowY: 'auto',
              width: '100%',
              maxWidth: '400px',
              position: 'relative'
            }}>
              <button
                onClick={() => setShowChatList(false)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  transition: 'background-color 0.2s',
                  zIndex: 10
                }}
                onMouseEnter={(e) => e.target.style.background = 'var(--bg-secondary)'}
                onMouseLeave={(e) => e.target.style.background = 'none'}
              >
                ×
              </button>
              <ChatList onSelectChat={handleChatSelect} />
            </div>
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

