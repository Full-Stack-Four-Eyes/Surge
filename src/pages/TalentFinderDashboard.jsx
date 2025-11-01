import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { collection, query, where, onSnapshot, doc, updateDoc, serverTimestamp, addDoc, deleteDoc, getDocs } from 'firebase/firestore'
import { useAuth } from '../hooks/useAuth.jsx'
import { db } from '../config/firebase'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import JobPostForm from '../components/JobPostForm'
import JobCard from '../components/JobCard'
import JobDetailModal from '../components/JobDetailModal'
import ApplicantList from '../components/ApplicantList'
import Analytics from '../components/Analytics'
import './Dashboard.css'

export default function TalentFinderDashboard() {
  const { user, userData } = useAuth()
  const location = useLocation()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('posts')
  const [selectedJob, setSelectedJob] = useState(null)
  const [selectedJobDetail, setSelectedJobDetail] = useState(null)
  const [showJobForm, setShowJobForm] = useState(false)
  const [editingJob, setEditingJob] = useState(null)

  // Handle navigation from notifications
  useEffect(() => {
    if (location.state) {
      if (location.state.activeTab) {
        setActiveTab(location.state.activeTab)
      }
      if (location.state.openJobId && location.state.openApplicants) {
        // Find the job and open applicants list
        const job = jobs.find(j => j.id === location.state.openJobId)
        if (job) {
          setSelectedJob(job)
        }
      }
      // Clear the state after handling
      window.history.replaceState({}, document.title)
    }
  }, [location.state, jobs])

  useEffect(() => {
    if (user) {
      // Use real-time listener for jobs to get updated views and applications
      // Note: We'll filter archived jobs in the component
      const q = query(
        collection(db, 'jobs'),
        where('postedBy', '==', user.uid)
      )

      const unsubscribe = onSnapshot(q, (snapshot) => {
        try {
          const jobsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            views: doc.data().views || 0,
            applications: doc.data().applications || 0
          }))
          setJobs(jobsData)
        } catch (error) {
          console.error('Error processing jobs:', error)
        } finally {
          setLoading(false)
        }
      }, (error) => {
        console.error('Error in jobs listener:', error)
        setLoading(false)
      })

      return () => unsubscribe()
    }
  }, [user])

  const handleCreateJob = async (jobData) => {
    try {
      await addDoc(collection(db, 'jobs'), {
        ...jobData,
        postedBy: user.uid,
        createdAt: serverTimestamp(),
        views: 0,
        applications: 0,
        isFilled: false,
        status: jobData.status || 'published'
      })
      setShowJobForm(false)
      // Real-time listener will update automatically
    } catch (error) {
      console.error('Error creating job:', error)
    }
  }

  const handleUpdateJob = async (jobId, updates) => {
    try {
      await updateDoc(doc(db, 'jobs', jobId), {
        ...updates,
        updatedAt: serverTimestamp()
      })
      setEditingJob(null)
      setShowJobForm(false)
      // Real-time listener will update automatically
    } catch (error) {
      console.error('Error updating job:', error)
    }
  }

  const handleDeleteJob = async (jobId) => {
    // Check if job has accepted or shortlisted applicants
    try {
      // Firestore doesn't support 'in' with multiple values easily
      // Check for accepted and shortlisted separately
      const acceptedQuery = query(
        collection(db, 'applications'),
        where('jobId', '==', jobId),
        where('status', '==', 'accepted')
      )
      const shortlistedQuery = query(
        collection(db, 'applications'),
        where('jobId', '==', jobId),
        where('status', '==', 'shortlisted')
      )
      const [acceptedSnapshot, shortlistedSnapshot] = await Promise.all([
        getDocs(acceptedQuery),
        getDocs(shortlistedQuery)
      ])
      const totalImportant = acceptedSnapshot.size + shortlistedSnapshot.size
      
      const confirmed = window.confirm(
        `This job will be moved to Archive. ` +
        (totalImportant > 0 
          ? `It has ${totalImportant} accepted/shortlisted applicant(s). ` 
          : '') +
        'The job will be removed from public listings but can be viewed in Archive. ' +
        'Are you sure you want to archive this job post?'
      )
      if (!confirmed) return
      
      // Archive the job instead of deleting it
      await updateDoc(doc(db, 'jobs', jobId), {
        archived: true,
        archivedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      // Real-time listener will update automatically
    } catch (error) {
      console.error('Error archiving job:', error)
    }
  }

  const handleMarkAsFilled = async (jobId) => {
    try {
      await updateDoc(doc(db, 'jobs', jobId), {
        isFilled: true,
        updatedAt: serverTimestamp()
      })
      // Real-time listener will update automatically
    } catch (error) {
      console.error('Error marking job as filled:', error)
    }
  }

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <Navbar />
      
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Talent Finder Dashboard</h1>
          <p>Post opportunities and manage applicants</p>
        </div>

        <div className="dashboard-tabs">
          <button
            className={activeTab === 'posts' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('posts')}
          >
            Published ({jobs.filter(j => j.status === 'published').length})
          </button>
          <button
            className={activeTab === 'drafts' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('drafts')}
          >
            Drafts ({jobs.filter(j => j.status === 'draft').length})
          </button>
          <button
            className={activeTab === 'applications' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('applications')}
          >
            Applications ({jobs.filter(j => (j.applications || 0) > 0).length})
          </button>
          <button
            className={activeTab === 'analytics' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
          <button
            className={activeTab === 'archive' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('archive')}
          >
            Archive ({jobs.filter(j => j.archived === true).length})
          </button>
        </div>

        {(activeTab === 'posts' || activeTab === 'drafts') && (
          <div className="dashboard-content">
            <div className="section-header">
              <h2>{activeTab === 'posts' ? 'Published Jobs' : 'Draft Jobs'}</h2>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setEditingJob(null)
                  setShowJobForm(true)
                }}
              >
                + Create New Post
              </button>
            </div>

            {showJobForm && (
              <JobPostForm
                job={editingJob}
                onSubmit={editingJob ? (data) => handleUpdateJob(editingJob.id, data) : handleCreateJob}
                onCancel={() => {
                  setShowJobForm(false)
                  setEditingJob(null)
                }}
              />
            )}

            <div className="jobs-grid">
              {jobs.filter(j => {
                if (j.archived) return false // Exclude archived from published/drafts
                return activeTab === 'posts' ? j.status === 'published' : j.status === 'draft'
              }).length === 0 ? (
                <div className="empty-state">
                  <p>{activeTab === 'posts' ? 'No published jobs yet. Create your first opportunity!' : 'No draft jobs. Save a draft while creating a job post!'}</p>
                </div>
              ) : (
                jobs
                  .filter(j => {
                    if (j.archived) return false // Exclude archived from published/drafts
                    return activeTab === 'posts' ? j.status === 'published' : j.status === 'draft'
                  })
                  .map(job => (
                    <JobCard
                      key={job.id}
                      job={job}
                      isFinder={true}
                      onEdit={() => {
                        setEditingJob(job)
                        setShowJobForm(true)
                      }}
                      onDelete={() => handleDeleteJob(job.id)}
                      onMarkFilled={() => handleMarkAsFilled(job.id)}
                      onViewApplicants={() => setSelectedJob(job)}
                      onViewDetails={() => setSelectedJobDetail(job)}
                    />
                  ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="dashboard-content">
            <div className="section-header">
              <h2>Jobs with Applications</h2>
              <p className="applications-subtitle">View all jobs that have received applications</p>
            </div>

            <div className="jobs-grid">
              {jobs.filter(j => (j.applications || 0) > 0).length === 0 ? (
                <div className="empty-state">
                  <p>No jobs have received applications yet. When someone applies, they'll appear here.</p>
                </div>
              ) : (
                jobs
                  .filter(j => (j.applications || 0) > 0)
                  .sort((a, b) => (b.applications || 0) - (a.applications || 0)) // Sort by application count
                  .map(job => (
                    <JobCard
                      key={job.id}
                      job={job}
                      isFinder={true}
                      onEdit={() => {
                        setEditingJob(job)
                        setShowJobForm(true)
                      }}
                      onDelete={() => handleDeleteJob(job.id)}
                      onMarkFilled={() => handleMarkAsFilled(job.id)}
                      onViewApplicants={() => setSelectedJob(job)}
                      onViewDetails={() => setSelectedJobDetail(job)}
                    />
                  ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <Analytics jobs={jobs.filter(j => !j.archived)} />
        )}

        {activeTab === 'archive' && (
          <div className="dashboard-content">
            <div className="section-header">
              <h2>Archived Jobs</h2>
              <p className="applications-subtitle">View all archived job posts</p>
            </div>

            <div className="jobs-grid">
              {jobs.filter(j => j.archived === true).length === 0 ? (
                <div className="empty-state">
                  <p>No archived jobs yet. Archived jobs will appear here.</p>
                </div>
              ) : (
                jobs
                  .filter(j => j.archived === true)
                  .sort((a, b) => {
                    const aTime = a.archivedAt?.toDate?.() || new Date(a.archivedAt || 0)
                    const bTime = b.archivedAt?.toDate?.() || new Date(b.archivedAt || 0)
                    return bTime - aTime // Newest first
                  })
                  .map(job => (
                    <JobCard
                      key={job.id}
                      job={job}
                      isFinder={true}
                      isArchived={true}
                      onViewDetails={() => setSelectedJobDetail(job)}
                      onViewApplicants={() => setSelectedJob(job)}
                    />
                  ))
              )}
            </div>
          </div>
        )}

        {selectedJob && (
          <ApplicantList
            job={selectedJob}
            onClose={() => setSelectedJob(null)}
          />
        )}

        {selectedJobDetail && (
          <JobDetailModal
            job={selectedJobDetail}
            onEdit={() => {
              setSelectedJobDetail(null)
              setEditingJob(selectedJobDetail)
              setShowJobForm(true)
            }}
            onDelete={() => {
              setSelectedJobDetail(null)
              handleDeleteJob(selectedJobDetail.id)
            }}
            onMarkFilled={() => {
              setSelectedJobDetail(null)
              handleMarkAsFilled(selectedJobDetail.id)
            }}
            onViewApplicants={() => {
              setSelectedJobDetail(null)
              setSelectedJob(selectedJobDetail)
            }}
            onClose={() => setSelectedJobDetail(null)}
            isFinder={true}
          />
        )}
      </div>

      <Footer />
    </div>
  )
}

