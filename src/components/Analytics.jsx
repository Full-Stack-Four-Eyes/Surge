import { useState } from 'react'
import './Analytics.css'

export default function Analytics({ jobs }) {
  const [selectedJob, setSelectedJob] = useState(null)
  const publishedJobs = jobs.filter(job => job.status === 'published')
  const totalViews = publishedJobs.reduce((sum, job) => sum + (job.views || 0), 0)
  const totalApplications = publishedJobs.reduce((sum, job) => sum + (job.applications || 0), 0)
  const activeJobs = publishedJobs.filter(job => !job.isFilled).length
  const filledJobs = publishedJobs.filter(job => job.isFilled).length
  
  // Enhanced interest rate calculation
  const interestRate = totalViews > 0 
    ? ((totalApplications / totalViews) * 100).toFixed(1)
    : 0

  // Average views per job
  const avgViewsPerJob = publishedJobs.length > 0 
    ? (totalViews / publishedJobs.length).toFixed(1)
    : 0

  // Average applications per job
  const avgAppsPerJob = publishedJobs.length > 0
    ? (totalApplications / publishedJobs.length).toFixed(1)
    : 0

  // Conversion rate (applications to filled)
  const conversionRate = totalApplications > 0
    ? ((filledJobs / totalApplications) * 100).toFixed(1)
    : 0

  const topJobs = [...publishedJobs]
    .sort((a, b) => {
      // Sort by a combination of views and applications (engagement score)
      const scoreA = ((a.views || 0) * 0.3) + ((a.applications || 0) * 0.7)
      const scoreB = ((b.views || 0) * 0.3) + ((b.applications || 0) * 0.7)
      return scoreB - scoreA
    })
    .slice(0, 5)

  const calculateJobInterestRate = (job) => {
    if (!job.views || job.views === 0) return 0
    return ((job.applications || 0) / job.views * 100).toFixed(1)
  }

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
          <div className="stat-desc">Views to Apps</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-value">{avgViewsPerJob}</div>
          <div className="stat-label">Avg Views/Job</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-value">{avgAppsPerJob}</div>
          <div className="stat-label">Avg Apps/Job</div>
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
          <div className="stat-icon">🔄</div>
          <div className="stat-value">{conversionRate}%</div>
          <div className="stat-label">Conversion Rate</div>
          <div className="stat-desc">Apps to Filled</div>
        </div>
      </div>

      {topJobs.length > 0 && (
        <div className="top-jobs">
          <h3>Top Performing Jobs (by Engagement Score)</h3>
          <div className="top-jobs-list">
            {topJobs.map((job, idx) => {
              const jobInterestRate = calculateJobInterestRate(job)
              return (
                <div 
                  key={job.id} 
                  className="top-job-item"
                  onClick={() => setSelectedJob(selectedJob?.id === job.id ? null : job)}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="rank">#{idx + 1}</span>
                  <div className="job-info">
                    <h4>{job.title}</h4>
                    <div className="job-stats">
                      <span>👁️ {job.views || 0} views</span>
                      <span>📄 {job.applications || 0} applications</span>
                      <span>📊 {jobInterestRate}% interest</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {selectedJob && (
        <div className="job-details-modal" style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--border-radius-lg)',
          border: '2px solid var(--border-color)'
        }}>
          <h3>Detailed Analytics: {selectedJob.title}</h3>
          <div className="analytics-grid" style={{ marginTop: '1rem' }}>
            <div className="stat-card">
              <div className="stat-value">{selectedJob.views || 0}</div>
              <div className="stat-label">Views</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{selectedJob.applications || 0}</div>
              <div className="stat-label">Applications</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{calculateJobInterestRate(selectedJob)}%</div>
              <div className="stat-label">Interest Rate</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{selectedJob.isFilled ? 'Filled' : 'Active'}</div>
              <div className="stat-label">Status</div>
            </div>
          </div>
          <button 
            onClick={() => setSelectedJob(null)}
            className="btn btn-secondary"
            style={{ marginTop: '1rem' }}
          >
            Close Details
          </button>
        </div>
      )}
    </div>
  )
}

