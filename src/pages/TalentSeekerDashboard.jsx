import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, orderBy, limit, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore'
import { useAuth } from '../hooks/useAuth.jsx'
import { db } from '../config/firebase'
import { rankJobs } from '../utils/jobMatching'
import Navbar from '../components/Navbar'
import JobCard from '../components/JobCard'
import ApplicationModal from '../components/ApplicationModal'
import './Dashboard.css'

export default function TalentSeekerDashboard() {
  const { user, userData } = useAuth()
  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('browse')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [selectedJob, setSelectedJob] = useState(null)
  const [applications, setApplications] = useState([])
  const [bookmarks, setBookmarks] = useState([])

  useEffect(() => {
    if (user) {
      fetchJobs()
      fetchApplications()
      fetchBookmarks()
    }
  }, [user])

  useEffect(() => {
    filterJobs()
  }, [jobs, searchTerm, filterType])

  const fetchJobs = async () => {
    try {
      const q = query(
        collection(db, 'jobs'),
        where('isFilled', '==', false),
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc'),
        limit(50)
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

  const fetchApplications = async () => {
    try {
      const q = query(
        collection(db, 'applications'),
        where('applicantId', '==', user.uid)
      )
      const querySnapshot = await getDocs(q)
      const appsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setApplications(appsData)
    } catch (error) {
      console.error('Error fetching applications:', error)
    }
  }

  const fetchBookmarks = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (userDoc.exists()) {
        setBookmarks(userDoc.data().bookmarks || [])
      }
    } catch (error) {
      console.error('Error fetching bookmarks:', error)
    }
  }

  const filterJobs = () => {
    let filtered = [...jobs]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(job => job.type === filterType)
    }

    // Rank by match score if user profile exists
    if (userData) {
      filtered = rankJobs(filtered, userData)
    }

    setFilteredJobs(filtered)
  }

  const handleBookmark = async (jobId) => {
    try {
      const isBookmarked = bookmarks.includes(jobId)
      const newBookmarks = isBookmarked
        ? bookmarks.filter(id => id !== jobId)
        : [...bookmarks, jobId]

      await updateDoc(doc(db, 'users', user.uid), {
        bookmarks: newBookmarks
      })
      setBookmarks(newBookmarks)
    } catch (error) {
      console.error('Error updating bookmark:', error)
    }
  }

  const getApplicationStatus = (jobId) => {
    const application = applications.find(app => app.jobId === jobId)
    return application?.status || null
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

  const recommendedJobs = userData ? rankJobs(jobs, userData).slice(0, 5) : []

  return (
    <div className="dashboard">
      <Navbar />
      
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Talent Seeker Dashboard</h1>
          <p>Discover opportunities and apply to jobs</p>
        </div>

        <div className="dashboard-tabs">
          <button
            className={activeTab === 'browse' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('browse')}
          >
            Browse Jobs
          </button>
          <button
            className={activeTab === 'recommended' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('recommended')}
          >
            Recommended ({recommendedJobs.length})
          </button>
          <button
            className={activeTab === 'applications' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('applications')}
          >
            My Applications ({applications.length})
          </button>
          <button
            className={activeTab === 'bookmarks' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('bookmarks')}
          >
            Bookmarks ({bookmarks.length})
          </button>
        </div>

        {activeTab === 'browse' && (
          <div className="dashboard-content">
            <div className="filters">
              <input
                type="text"
                placeholder="Search jobs, skills, tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Types</option>
                <option value="Academic Projects">Academic Projects</option>
                <option value="Startup/Collaborations">Startup/Collaborations</option>
                <option value="Part-time Jobs">Part-time Jobs</option>
                <option value="Competitions/Hackathons">Competitions/Hackathons</option>
                <option value="Team Search">Team Search</option>
              </select>
            </div>

            <div className="jobs-grid">
              {filteredJobs.length === 0 ? (
                <div className="empty-state">
                  <p>No jobs found. Try adjusting your filters.</p>
                </div>
              ) : (
                filteredJobs.map(job => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isFinder={false}
                    matchScore={userData ? rankJobs([job], userData)[0]?.matchScore : null}
                    isBookmarked={bookmarks.includes(job.id)}
                    onBookmark={() => handleBookmark(job.id)}
                    applicationStatus={getApplicationStatus(job.id)}
                    onApply={() => setSelectedJob(job)}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'recommended' && (
          <div className="dashboard-content">
            <h2>Jobs Recommended for You</h2>
            <div className="jobs-grid">
              {recommendedJobs.length === 0 ? (
                <div className="empty-state">
                  <p>Complete your profile to get personalized recommendations!</p>
                </div>
              ) : (
                recommendedJobs.map(job => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isFinder={false}
                    matchScore={job.matchScore}
                    isBookmarked={bookmarks.includes(job.id)}
                    onBookmark={() => handleBookmark(job.id)}
                    applicationStatus={getApplicationStatus(job.id)}
                    onApply={() => setSelectedJob(job)}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="dashboard-content">
            <h2>My Applications</h2>
            <div className="jobs-grid">
              {applications.length === 0 ? (
                <div className="empty-state">
                  <p>You haven't applied to any jobs yet.</p>
                </div>
              ) : (
                applications.map(app => {
                  const job = jobs.find(j => j.id === app.jobId)
                  if (!job) return null
                  return (
                    <JobCard
                      key={app.id}
                      job={job}
                      isFinder={false}
                      applicationStatus={app.status}
                      applicationDate={app.createdAt}
                    />
                  )
                })
              )}
            </div>
          </div>
        )}

        {activeTab === 'bookmarks' && (
          <div className="dashboard-content">
            <h2>Bookmarked Jobs</h2>
            <div className="jobs-grid">
              {bookmarks.length === 0 ? (
                <div className="empty-state">
                  <p>No bookmarked jobs yet.</p>
                </div>
              ) : (
                jobs
                  .filter(job => bookmarks.includes(job.id))
                  .map(job => (
                    <JobCard
                      key={job.id}
                      job={job}
                      isFinder={false}
                      matchScore={userData ? rankJobs([job], userData)[0]?.matchScore : null}
                      isBookmarked={true}
                      onBookmark={() => handleBookmark(job.id)}
                      applicationStatus={getApplicationStatus(job.id)}
                      onApply={() => setSelectedJob(job)}
                    />
                  ))
              )}
            </div>
          </div>
        )}

        {selectedJob && (
          <ApplicationModal
            job={selectedJob}
            onClose={() => setSelectedJob(null)}
            onSubmit={async (applicationData) => {
              try {
                await addDoc(collection(db, 'applications'), {
                  ...applicationData,
                  jobId: selectedJob.id,
                  applicantId: user.uid,
                  status: 'pending',
                  createdAt: serverTimestamp()
                })
                await updateDoc(doc(db, 'jobs', selectedJob.id), {
                  applications: (selectedJob.applications || 0) + 1
                })
                setSelectedJob(null)
                fetchApplications()
                fetchJobs()
              } catch (error) {
                console.error('Error submitting application:', error)
              }
            }}
          />
        )}
      </div>
    </div>
  )
}

