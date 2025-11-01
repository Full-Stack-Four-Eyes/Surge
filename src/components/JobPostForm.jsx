import { useState, useEffect, useRef } from 'react'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuth } from '../hooks/useAuth.jsx'
import './JobPostForm.css'

const JOB_TYPES = [
  'Academic Projects',
  'Startup/Collaborations',
  'Part-time Jobs',
  'Competitions/Hackathons',
  'Team Search'
]

export default function JobPostForm({ job, onSubmit, onCancel, onSaveDraft }) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Academic Projects',
    location: '',
    requiredSkills: [],
    tags: [],
    experienceLevel: 'beginner',
    deadline: '',
    status: 'published'
  })
  const [skillInput, setSkillInput] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [autoSaveStatus, setAutoSaveStatus] = useState('')
  const autoSaveTimerRef = useRef(null)

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        description: job.description || '',
        type: job.type || 'Academic Projects',
        location: job.location || '',
        requiredSkills: job.requiredSkills || [],
        tags: job.tags || [],
        experienceLevel: job.experienceLevel || 'beginner',
        deadline: job.deadline || '',
        status: job.status || 'published'
      })
    }
  }, [job])

  const handleChange = (e) => {
    const newFormData = {
      ...formData,
      [e.target.name]: e.target.value
    }
    setFormData(newFormData)
    
    // Auto-save draft if user has entered some content
    if (newFormData.title || newFormData.description) {
      clearTimeout(autoSaveTimerRef.current)
      autoSaveTimerRef.current = setTimeout(() => {
        handleAutoSave(newFormData)
      }, 2000) // Auto-save after 2 seconds of inactivity
    }
  }

  const handleAutoSave = async (dataToSave) => {
    if (!user || job) return // Don't auto-save if editing existing job
    
    try {
      const draftData = {
        ...dataToSave,
        status: 'draft',
        postedBy: user.uid,
        updatedAt: serverTimestamp()
      }
      
      // Save to drafts subcollection or use a draftId
      const draftId = `draft_${Date.now()}`
      await setDoc(doc(db, 'jobDrafts', draftId), draftData)
      
      setAutoSaveStatus('Draft saved')
      setTimeout(() => setAutoSaveStatus(''), 3000)
    } catch (error) {
      console.error('Error auto-saving draft:', error)
      setAutoSaveStatus('Failed to save draft')
    }
  }

  useEffect(() => {
    return () => {
      clearTimeout(autoSaveTimerRef.current)
    }
  }, [])

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.requiredSkills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        requiredSkills: [...formData.requiredSkills, skillInput.trim()]
      })
      setSkillInput('')
    }
  }

  const handleRemoveSkill = (skill) => {
    setFormData({
      ...formData,
      requiredSkills: formData.requiredSkills.filter(s => s !== skill)
    })
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      })
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Check email verification
    if (user && !user.emailVerified) {
      alert('Please verify your email address before posting jobs. Check your email inbox for the verification link.')
      return
    }
    
    onSubmit(formData)
  }

  return (
    <div className="job-form-overlay">
      <div className="job-form-card">
        <h2>{job ? 'Edit Job Post' : 'Create New Job Post'}</h2>
        
        <form onSubmit={handleSubmit} className="job-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Job Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Frontend Developer Needed"
              />
            </div>

            <div className="form-group">
              <label htmlFor="type">Job Type *</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                {JOB_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="5"
              placeholder="Describe the opportunity, requirements, and what you're looking for..."
            />
          </div>

          <div className="form-row">
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
          </div>

          <div className="form-group">
            <label htmlFor="deadline">Application Deadline</label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Required Skills</label>
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
              {formData.requiredSkills.map((skill, idx) => (
                <span key={idx} className="tag">
                  {skill}
                  <button type="button" onClick={() => handleRemoveSkill(skill)} className="tag-remove">×</button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Tags</label>
            <div className="input-with-button">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Add a tag (e.g., remote, part-time)"
              />
              <button type="button" onClick={handleAddTag} className="btn btn-secondary">
                Add
              </button>
            </div>
            <div className="tags-container">
              {formData.tags.map((tag, idx) => (
                <span key={idx} className="tag">
                  {tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="tag-remove">×</button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="form-actions">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
              {!job && autoSaveStatus && (
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {autoSaveStatus}
                </span>
              )}
              {!job && (
                <button
                  type="button"
                  onClick={() => {
                    onSubmit({ ...formData, status: 'draft' })
                  }}
                  className="btn btn-secondary"
                >
                  Save as Draft
                </button>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" onClick={onCancel} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {job ? 'Update' : formData.status === 'draft' ? 'Publish' : 'Publish Job'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

