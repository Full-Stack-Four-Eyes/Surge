import { useState } from 'react'
import './JobDetailModal.css'

export default function JobDetailModal({ job, matchScore, isBookmarked, onBookmark, applicationStatus, onApply, onMessage, onClose, isFinder, onEdit, onDelete, onMarkFilled, onViewApplicants }) {
  const [showFullDescription, setShowFullDescription] = useState(false)

  const getStatusBadge = () => {
    if (job.isFilled) {
      return <span className="badge badge-filled">Filled</span>
    }
    if (applicationStatus) {
      const statusColors = {
        pending: 'warning',
        shortlisted: 'success',
        accepted: 'success',
        rejected: 'error'
      }
      return (
        <span className={`badge badge-${statusColors[applicationStatus] || 'warning'}`}>
          {applicationStatus.charAt(0).toUpperCase() + applicationStatus.slice(1)}
        </span>
      )
    }
    return null
  }

  const description = job.description || ''
  const shouldTruncate = description.length > 300

  return (
    <div className="job-detail-overlay" onClick={onClose}>
      <div className="job-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="job-detail-header">
          <div className="job-detail-title-section">
            <h2>{job.title}</h2>
            <div className="job-detail-meta">
              <span className="job-type">{job.type}</span>
              {job.location && <span className="job-location">📍 {job.location}</span>}
              {matchScore && (
                <div className="match-score">
                  <span className="match-percentage">{matchScore}%</span>
                  <span className="match-label">Match</span>
                </div>
              )}
            </div>
          </div>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <div className="job-detail-content">
          <div className="job-detail-section">
            <h3>Description</h3>
            <p className="job-description-full">
              {shouldTruncate && !showFullDescription
                ? `${description.substring(0, 300)}...`
                : description}
            </p>
            {shouldTruncate && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="toggle-description-btn"
              >
                {showFullDescription ? 'Show Less' : 'Show More'}
              </button>
            )}
          </div>

          {job.requiredSkills && job.requiredSkills.length > 0 && (
            <div className="job-detail-section">
              <h3>Required Skills</h3>
              <div className="skills-list">
                {job.requiredSkills.map((skill, idx) => (
                  <span key={idx} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {job.tags && job.tags.length > 0 && (
            <div className="job-detail-section">
              <h3>Tags</h3>
              <div className="tags-list">
                {job.tags.map((tag, idx) => (
                  <span key={idx} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          )}

          <div className="job-detail-section">
            <h3>Job Details</h3>
            <div className="job-details-grid">
              <div className="detail-item">
                <strong>Type:</strong> <span>{job.type}</span>
              </div>
              {job.location && (
                <div className="detail-item">
                  <strong>Location:</strong> <span>{job.location}</span>
                </div>
              )}
              {(job.postedAt || job.createdAt) && (
                <div className="detail-item">
                  <strong>Posted:</strong> <span>
                    {(() => {
                      const date = job.postedAt || job.createdAt
                      if (date?.toDate) return date.toDate().toLocaleDateString()
                      if (date?.seconds) return new Date(date.seconds * 1000).toLocaleDateString()
                      return new Date(date).toLocaleDateString()
                    })()}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="job-detail-footer">
            <div className="job-detail-actions">
              {getStatusBadge()}
              {isFinder ? (
                <>
                  <button onClick={onViewApplicants} className="btn btn-primary">
                    View Applicants ({job.applications || 0})
                  </button>
                  <button onClick={onEdit} className="btn btn-secondary">
                    Edit
                  </button>
                  {!job.isFilled && (
                    <button onClick={onMarkFilled} className="btn btn-success">
                      Mark Filled
                    </button>
                  )}
                  <button onClick={onDelete} className="btn btn-danger">
                    Delete
                  </button>
                </>
              ) : (
                <>
                  {!applicationStatus && onApply && (
                    <button onClick={onApply} className="btn btn-primary">
                      Apply Now
                    </button>
                  )}
                  {onMessage && (
                    <button onClick={onMessage} className="btn btn-secondary">
                      💬 Message Poster
                    </button>
                  )}
                  {onBookmark && (
                    <button
                      onClick={onBookmark}
                      className={`btn ${isBookmarked ? 'btn-bookmarked' : 'btn-secondary'}`}
                    >
                      {isBookmarked ? '★' : '☆'} {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

