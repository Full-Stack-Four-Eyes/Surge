import { useState } from 'react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../config/firebase'
import './ApplicationModal.css'

export default function ApplicationModal({ job, onClose, onSubmit }) {
  const [message, setMessage] = useState('')
  const [resume, setResume] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setResume(e.target.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setUploading(true)

    try {
      let resumeUrl = ''

      if (resume) {
        const resumeRef = ref(storage, `resumes/${job.id}_${Date.now()}_${resume.name}`)
        await uploadBytes(resumeRef, resume)
        resumeUrl = await getDownloadURL(resumeRef)
      }

      await onSubmit({
        message,
        resumeUrl,
        jobTitle: job.title
      })
    } catch (err) {
      setError(err.message || 'Failed to submit application')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Apply to {job.title}</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="application-form">
          <div className="form-group">
            <label htmlFor="message">Cover Letter / Proposal *</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows="6"
              placeholder="Tell us why you're a great fit for this opportunity..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="resume">Resume/CV (Optional)</label>
            <input
              type="file"
              id="resume"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
            {resume && (
              <span className="file-name">{resume.name}</span>
            )}
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={uploading}>
              {uploading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

