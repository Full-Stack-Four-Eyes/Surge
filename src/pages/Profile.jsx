import { useState, useEffect } from 'react'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { useAuth } from '../hooks/useAuth.jsx'
import { db } from '../config/firebase'
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

  useEffect(() => {
    if (userData) {
      setFormData({
        displayName: userData.displayName || '',
        bio: userData.bio || '',
        skills: userData.skills || [],
        interests: userData.interests || [],
        location: userData.location || '',
        experienceLevel: userData.experienceLevel || 'beginner',
        preferredJobTypes: userData.preferredJobTypes || []
      })
    }
  }, [userData])

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
      await updateDoc(doc(db, 'users', user.uid), formData)
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

          {message && (
            <div className={message.includes('Error') ? 'error-message' : 'success-message'}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="displayName">Full Name</label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                required
              />
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

