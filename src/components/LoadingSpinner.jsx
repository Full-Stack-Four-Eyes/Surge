import { useState, useEffect } from 'react'
import './LoadingSpinner.css'

export default function LoadingSpinner() {
  const [showMessage, setShowMessage] = useState(false)

  useEffect(() => {
    // Show troubleshooting message after 3 seconds
    const timer = setTimeout(() => {
      setShowMessage(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading CampusConnect...</p>
      {showMessage && (
        <div className="loading-help">
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '1rem' }}>
            Taking longer than expected? Check:
          </p>
          <ul style={{ fontSize: '0.75rem', color: '#6b7280', textAlign: 'left', marginTop: '0.5rem' }}>
            <li>Browser console for errors (F12)</li>
            <li>Firebase configuration in .env file</li>
            <li>Internet connection</li>
          </ul>
        </div>
      )}
    </div>
  )
}

