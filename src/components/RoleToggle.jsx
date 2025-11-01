import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import './RoleToggle.css'

export default function RoleToggle() {
  const { userData, switchRole } = useAuth()
  const navigate = useNavigate()
  const [isSwitching, setIsSwitching] = useState(false)

  const handleToggle = async () => {
    if (isSwitching || !userData) return
    
    setIsSwitching(true)
    const newRole = userData.role === 'finder' ? 'seeker' : 'finder'
    
    try {
      await switchRole(newRole)
      navigate(`/${newRole}`)
    } catch (error) {
      console.error('Error switching role:', error)
    } finally {
      setIsSwitching(false)
    }
  }

  const isFinder = userData?.role === 'finder'

  return (
    <div className="role-toggle-container">
      <button
        className={`role-toggle ${isFinder ? 'finder-active' : 'seeker-active'}`}
        onClick={handleToggle}
        disabled={isSwitching}
        title={isFinder ? 'Switch to Talent Seeker Mode' : 'Switch to Talent Finder Mode'}
      >
        <div className="toggle-track">
          <div className="toggle-slider"></div>
          <div className="toggle-labels">
            <span className={`toggle-label seeker-label ${!isFinder ? 'active' : ''}`}>
              <span className="label-emoji">🔍</span>
              <span className="label-text">Seeker</span>
            </span>
            <span className={`toggle-label finder-label ${isFinder ? 'active' : ''}`}>
              <span className="label-emoji">📢</span>
              <span className="label-text">Finder</span>
            </span>
          </div>
        </div>
      </button>
    </div>
  )
}

