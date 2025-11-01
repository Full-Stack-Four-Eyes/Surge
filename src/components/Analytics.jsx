import './Analytics.css'

export default function Analytics({ jobs }) {
  const totalViews = jobs.reduce((sum, job) => sum + (job.views || 0), 0)
  const totalApplications = jobs.reduce((sum, job) => sum + (job.applications || 0), 0)
  const activeJobs = jobs.filter(job => !job.isFilled && job.status === 'published').length
  const filledJobs = jobs.filter(job => job.isFilled).length
  
  const interestRate = totalViews > 0 
    ? ((totalApplications / totalViews) * 100).toFixed(1)
    : 0

  const topJobs = [...jobs]
    .sort((a, b) => (b.applications || 0) - (a.applications || 0))
    .slice(0, 5)

  return (
    <div className="analytics">
      <h2>Analytics Overview</h2>

      <div className="analytics-grid">
        <div className="stat-card">
          <div className="stat-icon">👁️</div>
          <div className="stat-value">{totalViews}</div>
          <div className="stat-label">Total Views</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📄</div>
          <div className="stat-value">{totalApplications}</div>
          <div className="stat-label">Total Applications</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-value">{interestRate}%</div>
          <div className="stat-label">Interest Rate</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{activeJobs}</div>
          <div className="stat-label">Active Jobs</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-value">{filledJobs}</div>
          <div className="stat-label">Filled Jobs</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-value">{jobs.length}</div>
          <div className="stat-label">Total Posts</div>
        </div>
      </div>

      {topJobs.length > 0 && (
        <div className="top-jobs">
          <h3>Top Performing Jobs</h3>
          <div className="top-jobs-list">
            {topJobs.map((job, idx) => (
              <div key={job.id} className="top-job-item">
                <span className="rank">#{idx + 1}</span>
                <div className="job-info">
                  <h4>{job.title}</h4>
                  <div className="job-stats">
                    <span>👁️ {job.views || 0} views</span>
                    <span>📄 {job.applications || 0} applications</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

