import { useState } from 'react'
import { supabase, RESUME_BUCKET_NAME } from '../config/supabase'
import './ApplicationModal.css'

export default function ApplicationModal({ job, onClose, onSubmit }) {
  const [message, setMessage] = useState('')
  const [resume, setResume] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      const maxSize = 10 * 1024 * 1024 // 10MB
      
      if (!allowedTypes.includes(file.type)) {
        setError('Please upload a PDF, DOC, or DOCX file')
        e.target.value = ''
        return
      }
      
      if (file.size > maxSize) {
        setError('File size must be less than 10MB')
        e.target.value = ''
        return
      }
      
      setResume(file)
      setError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setUploading(true)

    try {
      let resumeUrl = ''

      if (resume) {
        try {
          // Sanitize filename to avoid issues
          const sanitizedName = resume.name.replace(/[^a-zA-Z0-9._-]/g, '_')
          const fileName = `${job.id}_${Date.now()}_${sanitizedName}`
          // Upload directly to bucket root (bucket is already named 'resumes')
          const filePath = fileName

          // Upload file to Supabase Storage
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from(RESUME_BUCKET_NAME)
            .upload(filePath, resume, {
              cacheControl: '3600',
              upsert: false
            })

          if (uploadError) {
            console.error('Upload error details:', uploadError)
            // Provide more specific error message
            if (uploadError.message?.includes('row-level security')) {
              throw new Error('Storage permission error. Please contact support or try again later.')
            }
            throw uploadError
          }

          // Get public URL for the uploaded file (getPublicUrl is synchronous)
          const { data: urlData } = supabase.storage
            .from(RESUME_BUCKET_NAME)
            .getPublicUrl(filePath)
          
          resumeUrl = urlData.publicUrl
        } catch (uploadError) {
          console.error('Upload error:', uploadError)
          const errorMessage = uploadError.message?.includes('row-level security') 
            ? 'Storage permissions not configured. Please contact support.'
            : 'Failed to upload resume. Please try again or submit without a resume.'
          setError(errorMessage)
          setUploading(false)
          return
        }
      }

      await onSubmit({
        message,
        resumeUrl,
        jobTitle: job.title
      })
      
      // Reset form on success
      setMessage('')
      setResume(null)
    } catch (err) {
      console.error('Application submission error:', err)
      setError(err.message || 'Failed to submit application. Please try again.')
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
