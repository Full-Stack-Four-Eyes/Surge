import { useState, useEffect } from 'react'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { updateProfile } from 'firebase/auth'
import { useAuth } from '../hooks/useAuth.jsx'
import { db } from '../config/firebase'
import { calculateProfileScore } from '../utils/profileScore'
import Navbar from '../components/Navbar'
import './Profile.css'

export default function Profile() {
  const { user, userData, switchRole } = useAuth()
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    skills: [],
    interests: [],
    location: '',
    experienceLevel: 'beginner',
    preferredJobTypes: []
  })
  const [skillInput, setSkillInput] = useState('')
  const [interestInput, setInterestInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [profileScore, setProfileScore] = useState(null)

  useEffect(() => {
    if (userData) {
      // Get default display name from email if displayName is empty
      let displayName = userData.displayName || ''
      if (!displayName.trim() && user?.email) {
        const emailPart = user.email.split('@')[0]
        displayName = emailPart.charAt(0).toUpperCase() + emailPart.slice(1)
      }
      
      setFormData({
        displayName: displayName,
        bio: userData.bio || '',
        skills: userData.skills || [],
        interests: userData.interests || [],
        location: userData.location || '',
        experienceLevel: userData.experienceLevel || 'beginner',
        preferredJobTypes: userData.preferredJobTypes || []
      })
      
      // Calculate profile score
      const score = calculateProfileScore(userData)
      setProfileScore(score)
    } else if (user) {
      // If user exists but userData hasn't loaded yet, use email for default name
      const emailPart = user.email?.split('@')[0] || 'User'
      const defaultName = emailPart.charAt(0).toUpperCase() + emailPart.slice(1)
      setFormData(prev => ({
        ...prev,
        displayName: prev.displayName || defaultName
      }))
    }
  }, [userData, user])

  // Recalculate profile score when form data changes
  useEffect(() => {
    if (userData) {
      const updatedUserData = { ...userData, ...formData }
      const score = calculateProfileScore(updatedUserData)
      setProfileScore(score)
    }
  }, [formData])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()]
      })
      setSkillInput('')
    }
  }

  const handleRemoveSkill = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skill)
    })
  }

  const handleAddInterest = () => {
    if (interestInput.trim() && !formData.interests.includes(interestInput.trim())) {
      setFormData({
        ...formData,
        interests: [...formData.interests, interestInput.trim()]
      })
      setInterestInput('')
    }
  }

  const handleRemoveInterest = (interest) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter(i => i !== interest)
    })
  }

  const handleJobTypeToggle = (type) => {
    setFormData({
      ...formData,
      preferredJobTypes: formData.preferredJobTypes.includes(type)
        ? formData.preferredJobTypes.filter(t => t !== type)
        : [...formData.preferredJobTypes, type]
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      // Ensure displayName is never empty - use default from email if needed
      let finalDisplayName = formData.displayName?.trim()
      if (!finalDisplayName && user?.email) {
        const emailPart = user.email.split('@')[0]
        finalDisplayName = emailPart.charAt(0).toUpperCase() + emailPart.slice(1)
      }
      
      const updateData = {
        ...formData,
        displayName: finalDisplayName || 'User'
      }
      
      await updateDoc(doc(db, 'users', user.uid), updateData)
      
      // Also update Firebase Auth profile
      if (user.displayName !== finalDisplayName) {
        await updateProfile(user, { displayName: finalDisplayName }).catch(err => {
          console.warn('Could not update auth profile:', err)
        })
      }
      
      setMessage('Profile updated successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Error updating profile: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleRoleSwitch = async (newRole) => {
    await switchRole(newRole)
    setMessage('Role switched successfully!')
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        <div className="profile-card">
          <h1>Edit Profile</h1>

          {profileScore && (
            <div className="profile-score-card" style={{
              marginBottom: '1.5rem',
              padding: '1.5rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 'var(--border-radius-lg)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>
                {profileScore.score}%
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Profile Score: {profileScore.qualityTier}
                </div>
                <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                  {profileScore.suggestions.length > 0 && (
                    <div>
                      <strong>Tips to improve:</strong>
                      <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem' }}>
                        {profileScore.suggestions.slice(0, 3).map((suggestion, idx) => (
                          <li key={idx} style={{ marginTop: '0.25rem' }}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {message && (
            <div className={message.includes('Error') ? 'error-message' : 'success-message'}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="displayName">Full Name *</label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={formData.displayName || ''}
                onChange={handleChange}
                required
                placeholder={user?.email ? `Default: ${user.email.split('@')[0]}` : 'Your name'}
              />
              {!formData.displayName && user?.email && (
                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                  Currently using default name from email. You can change it above.
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Campus Building A"
              />
            </div>

            <div className="form-group">
              <label htmlFor="experienceLevel">Experience Level</label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="form-group">
              <label>Skills</label>
              <div className="input-with-button">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  placeholder="Add a skill (e.g., React, Python)"
                />
                <button type="button" onClick={handleAddSkill} className="btn btn-secondary">
                  Add
                </button>
              </div>
              <div className="tags-container">
                {formData.skills.map((skill, idx) => (
                  <span key={idx} className="tag">
                    {skill}
                    <button type="button" onClick={() => handleRemoveSkill(skill)} className="tag-remove">×</button>
                  </span>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Interests</label>
              <div className="input-with-button">
                <input
                  type="text"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInterest())}
                  placeholder="Add an interest (e.g., Web Development, AI)"
                />
                <button type="button" onClick={handleAddInterest} className="btn btn-secondary">
                  Add
                </button>
              </div>
              <div className="tags-container">
                {formData.interests.map((interest, idx) => (
                  <span key={idx} className="tag">
                    {interest}
                    <button type="button" onClick={() => handleRemoveInterest(interest)} className="tag-remove">×</button>
                  </span>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Preferred Job Types</label>
              <div className="checkbox-group">
                {['Academic Projects', 'Startup/Collaborations', 'Part-time Jobs', 'Competitions/Hackathons', 'Team Search'].map(type => (
                  <label key={type} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.preferredJobTypes.includes(type)}
                      onChange={() => handleJobTypeToggle(type)}
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>

          <div className="role-switch-section">
            <h2>Switch Role</h2>
            <p>You can switch between Talent Finder and Talent Seeker modes</p>
            <div className="role-buttons">
              <button
                onClick={() => handleRoleSwitch('finder')}
                className={`btn ${userData?.role === 'finder' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Talent Finder Mode
              </button>
              <button
                onClick={() => handleRoleSwitch('seeker')}
                className={`btn ${userData?.role === 'seeker' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Talent Seeker Mode
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

