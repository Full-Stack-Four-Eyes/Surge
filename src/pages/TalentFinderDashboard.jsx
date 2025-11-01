import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp, addDoc, deleteDoc } from 'firebase/firestore'
import { useAuth } from '../hooks/useAuth.jsx'
import { db } from '../config/firebase'
import Navbar from '../components/Navbar'
import JobPostForm from '../components/JobPostForm'
import JobCard from '../components/JobCard'
import ApplicantList from '../components/ApplicantList'
import Analytics from '../components/Analytics'
import './Dashboard.css'

export default function TalentFinderDashboard() {
  const { user, userData } = useAuth()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('posts')
  const [selectedJob, setSelectedJob] = useState(null)
  const [showJobForm, setShowJobForm] = useState(false)
  const [editingJob, setEditingJob] = useState(null)

  useEffect(() => {
    if (user) {
      fetchJobs()
    }
  }, [user])

  const fetchJobs = async () => {
    try {
      const q = query(
        collection(db, 'jobs'),
        where('postedBy', '==', user.uid)
      )
      const querySnapshot = await getDocs(q)
      const jobsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setJobs(jobsData)
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

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
      fetchJobs()
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
      fetchJobs()
    } catch (error) {
      console.error('Error updating job:', error)
    }
  }

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job post?')) {
      try {
        await deleteDoc(doc(db, 'jobs', jobId))
        fetchJobs()
      } catch (error) {
        console.error('Error deleting job:', error)
      }
    }
  }

  const handleMarkAsFilled = async (jobId) => {
    try {
      await updateDoc(doc(db, 'jobs', jobId), {
        isFilled: true,
        updatedAt: serverTimestamp()
      })
      fetchJobs()
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
            My Posts ({jobs.length})
          </button>
          <button
            className={activeTab === 'analytics' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
        </div>

        {activeTab === 'posts' && (
          <div className="dashboard-content">
            <div className="section-header">
              <h2>Job Posts</h2>
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
              {jobs.length === 0 ? (
                <div className="empty-state">
                  <p>No job posts yet. Create your first opportunity!</p>
                </div>
              ) : (
                jobs.map(job => (
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
                  />
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <Analytics jobs={jobs} />
        )}

        {selectedJob && (
          <ApplicantList
            job={selectedJob}
            onClose={() => setSelectedJob(null)}
          />
        )}
      </div>
    </div>
  )
}

