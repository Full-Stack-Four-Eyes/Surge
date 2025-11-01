import './JobCard.css'

export default function JobCard({
  job,
  isFinder,
  matchScore,
  isBookmarked,
  onBookmark,
  applicationStatus,
  onEdit,
  onDelete,
  onMarkFilled,
  onViewApplicants,
  onApply,
  applicationDate
}) {
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

  return (
    <div className="job-card">
      <div className="job-card-header">
        <div>
          <h3 className="job-title">{job.title}</h3>
          <div className="job-meta">
            <span className="job-type">{job.type}</span>
            {job.location && <span className="job-location">📍 {job.location}</span>}
          </div>
        </div>
        {!isFinder && matchScore && (
          <div className="match-score">
            <span className="match-percentage">{matchScore}%</span>
            <span className="match-label">Match</span>
          </div>
        )}
      </div>

      <p className="job-description">{job.description?.substring(0, 150)}...</p>

      {job.tags && job.tags.length > 0 && (
        <div className="job-tags">
          {job.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="tag">{tag}</span>
          ))}
        </div>
      )}

      {job.requiredSkills && job.requiredSkills.length > 0 && (
        <div className="job-skills">
          <strong>Skills:</strong> {job.requiredSkills.slice(0, 3).join(', ')}
          {job.requiredSkills.length > 3 && ` +${job.requiredSkills.length - 3} more`}
        </div>
      )}

      <div className="job-card-footer">
        <div className="job-stats">
          {isFinder ? (
            <>
              <span>👁️ {job.views || 0} views</span>
              <span>📄 {job.applications || 0} applications</span>
            </>
          ) : (
            applicationDate && (
              <span className="application-date">
                Applied: {applicationDate.toDate?.().toLocaleDateString() || 'Recently'}
              </span>
            )
          )}
        </div>

        <div className="job-actions">
          {getStatusBadge()}
          
          {isFinder ? (
            <>
              <button onClick={onViewApplicants} className="btn btn-sm btn-primary">
                View Applicants ({job.applications || 0})
              </button>
              <button onClick={onEdit} className="btn btn-sm btn-secondary">
                Edit
              </button>
              {!job.isFilled && (
                <button onClick={onMarkFilled} className="btn btn-sm btn-success">
                  Mark Filled
                </button>
              )}
              <button onClick={onDelete} className="btn btn-sm btn-danger">
                Delete
              </button>
            </>
          ) : (
            <>
              {!applicationStatus && (
                <button onClick={onApply} className="btn btn-sm btn-primary">
                  Apply Now
                </button>
              )}
              <button
                onClick={onBookmark}
                className={`btn btn-sm ${isBookmarked ? 'btn-bookmarked' : 'btn-secondary'}`}
              >
                {isBookmarked ? '★' : '☆'} Bookmark
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

