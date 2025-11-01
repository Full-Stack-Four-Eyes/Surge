import { useState } from 'react'
import { useAuth } from '../hooks/useAuth.jsx'
import { seedJobs } from '../utils/seedJobs'

export default function SeedJobsButton() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSeedJobs = async () => {
    if (!user) {
      setMessage('Please log in first')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const result = await seedJobs(user.uid)
      if (result.success) {
        setMessage(`✅ Successfully added ${result.count} sample jobs! Refresh the page to see them.`)
      } else {
        setMessage(`❌ Error: ${result.error}`)
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Only show to authenticated users
  if (!user) return null

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '20px', 
      right: '20px', 
      zIndex: 1000,
      background: 'white',
      padding: '1rem',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      maxWidth: '300px'
    }}>
      <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>Developer Tools</h4>
      <button
        onClick={handleSeedJobs}
        disabled={loading}
        style={{
          padding: '0.5rem 1rem',
          background: loading ? '#ccc' : '#6366f1',
          color: 'white',
          border: 'none',
          borderRadius: '0.25rem',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '0.875rem',
          width: '100%'
        }}
      >
        {loading ? 'Adding Jobs...' : '📝 Add 20 Sample Jobs'}
      </button>
      {message && (
        <p style={{ 
          margin: '0.5rem 0 0 0', 
          fontSize: '0.75rem', 
          color: message.includes('✅') ? 'green' : 'red' 
        }}>
          {message}
        </p>
      )}
    </div>
  )
}

