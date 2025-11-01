import { useState, useEffect } from 'react'
import {
  collection,
  query,
  getDocs,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
  limit,
  orderBy,
  where
} from 'firebase/firestore'
import { useAuth } from '../hooks/useAuth.jsx'
import { db } from '../config/firebase'
import { rankJobs } from '../utils/jobMatching'
import { notifyNewApplication, getApplicantName } from '../utils/notifications'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import JobCard from '../components/JobCard'
import ApplicationModal from '../components/ApplicationModal'
import JobDetailModal from '../components/JobDetailModal'
import Chat from '../components/Chat'
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
  const [chatUser, setChatUser] = useState(null)
  const [selectedJobDetail, setSelectedJobDetail] = useState(null)
  const [viewedJobs, setViewedJobs] = useState([])

  useEffect(() => {
    if (user) {
      fetchJobs()
      fetchApplications()
      fetchBookmarks()
      fetchViewedJobs()
    }
  }, [user])

  useEffect(() => {
    filterJobs()
  }, [jobs, searchTerm, filterType])

  // ✅ simplified Firestore query (no index required)
  const fetchJobs = async () => {
    try {
      const q = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'), limit(50))
      const querySnapshot = await getDocs(q)
      let jobsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      // manual filtering instead of Firestore index
      jobsData = jobsData.filter(job => job.status === 'published' && job.isFilled === false)

      setJobs(jobsData)
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchApplications = async () => {
    try {
      const q = query(collection(db, 'applications'), where('applicantId', '==', user.uid))
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

    // Search filter - enhanced to search title, description, skills, and tags
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(job =>
          job.title?.toLowerCase().includes(searchLower) ||
          job.description?.toLowerCase().includes(searchLower) ||
          job.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
          job.requiredSkills?.some(skill => skill.toLowerCase().includes(searchLower))
      )
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(job => job.type === filterType)
    }

    // Rank by match score with user behavior learning
    if (userData) {
      const userBehavior = {
        appliedJobs: applications.map(app => app.jobId),
        viewedJobs: viewedJobs,
        bookmarkedJobs: bookmarks
      }
      filtered = rankJobs(filtered, userData, userBehavior)
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

  const handleMessage = async (job) => {
    // Get job poster's info to open chat
    try {
      const posterDoc = await getDoc(doc(db, 'users', job.postedBy))
      if (posterDoc.exists()) {
        const posterData = posterDoc.data()
        setChatUser({
          id: job.postedBy,
          name: posterData.displayName || posterData.email || 'Job Poster'
        })
      } else {
        setChatUser({
          id: job.postedBy,
          name: 'Job Poster'
        })
      }
    } catch (error) {
      console.error('Error fetching job poster:', error)
      setChatUser({
        id: job.postedBy,
        name: 'Job Poster'
      })
    }
  }

  const fetchViewedJobs = async () => {
    if (!user) return
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        setViewedJobs(userData.viewedJobs || [])
      }
    } catch (error) {
      console.error('Error fetching viewed jobs:', error)
    }
  }

  const handleViewJob = async (jobId) => {
    // Only increment view if user hasn't viewed this job before
    if (!viewedJobs.includes(jobId)) {
      try {
        // Add jobId to user's viewed jobs
        const newViewedJobs = [...viewedJobs, jobId]
        await updateDoc(doc(db, 'users', user.uid), {
          viewedJobs: newViewedJobs
        })
        setViewedJobs(newViewedJobs)

        // Increment view count on job
        const jobDoc = await getDoc(doc(db, 'jobs', jobId))
        if (jobDoc.exists()) {
          const currentViews = jobDoc.data().views || 0
          await updateDoc(doc(db, 'jobs', jobId), {
            views: currentViews + 1
          })
          
          // Update local jobs state
          setJobs(prevJobs => 
            prevJobs.map(job => 
              job.id === jobId ? { ...job, views: currentViews + 1 } : job
            )
          )
        }
      } catch (error) {
        console.error('Error tracking view:', error)
      }
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

  const recommendedJobs = userData ? rankJobs(
    jobs, 
    userData,
    {
      appliedJobs: applications.map(app => app.jobId),
      viewedJobs: viewedJobs,
      bookmarkedJobs: bookmarks
    }
  ).slice(0, 5) : []

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

          {/* Browse Jobs */}
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
                              matchScore={userData ? rankJobs([job], userData, {
                                appliedJobs: applications.map(app => app.jobId),
                                viewedJobs: viewedJobs,
                                bookmarkedJobs: bookmarks
                              })[0]?.matchScore : null}
                              isBookmarked={bookmarks.includes(job.id)}
                              onBookmark={() => handleBookmark(job.id)}
                              applicationStatus={getApplicationStatus(job.id)}
                              onApply={() => setSelectedJob(job)}
                              onMessage={() => handleMessage(job)}
                              onViewDetails={() => {
                                setSelectedJobDetail(job)
                              }}
                          />
                      ))
                  )}
                </div>
              </div>
          )}

          {/* Recommended */}
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
                              onMessage={() => handleMessage(job)}
                              onViewDetails={() => {
                                setSelectedJobDetail(job)
                              }}
                          />
                      ))
                  )}
                </div>
              </div>
          )}

          {/* Applications */}
          {activeTab === 'applications' && (
              <div className="dashboard-content">
                <h2>My Applications</h2>
                <p className="applications-subtitle">View all jobs you've applied to, including those that may no longer be available.</p>
                <div className="jobs-grid">
                  {applications.length === 0 ? (
                      <div className="empty-state">
                        <p>You haven't applied to any jobs yet.</p>
                      </div>
                  ) : (
                      applications.map(app => {
                        // Try to find job in current jobs list first
                        let job = jobs.find(j => j.id === app.jobId)
                        
                        // If job not found, use preserved job data from application
                        if (!job && app.jobData) {
                          job = {
                            id: app.jobId,
                            ...app.jobData,
                            isDeleted: true // Mark as deleted for UI display
                          }
                        }
                        
                        if (!job) return null
                        
                        return (
                            <JobCard
                                key={app.id}
                                job={job}
                                isFinder={false}
                                applicationStatus={app.status}
                                applicationDate={app.createdAt}
                                onMessage={() => {
                                  if (job.postedBy) {
                                    handleMessage(job)
                                  }
                                }}
                                onViewDetails={() => {
                                  setSelectedJobDetail(job)
                                }}
                                onBookmark={() => {
                                  if (!job.isDeleted) {
                                    handleBookmark(job.id)
                                  }
                                }}
                                isBookmarked={!job.isDeleted && bookmarks.includes(job.id)}
                            />
                        )
                      })
                  )}
                </div>
              </div>
          )}

          {/* Bookmarks */}
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
                                matchScore={userData ? rankJobs([job], userData, {
                                appliedJobs: applications.map(app => app.jobId),
                                viewedJobs: viewedJobs,
                                bookmarkedJobs: bookmarks
                              })[0]?.matchScore : null}
                                isBookmarked={true}
                                onBookmark={() => handleBookmark(job.id)}
                                applicationStatus={getApplicationStatus(job.id)}
                                onApply={() => setSelectedJob(job)}
                                onMessage={() => handleMessage(job)}
                                onViewDetails={() => {
                                setSelectedJobDetail(job)
                              }}
                            />
                          ))
                  )}
                </div>
              </div>
          )}

          {/* Application Modal */}
          {selectedJob && (
              <ApplicationModal
                  job={selectedJob}
                  onClose={() => setSelectedJob(null)}
                  onSubmit={async (applicationData) => {
                    try {
                      const docRef = await addDoc(collection(db, 'applications'), {
                        ...applicationData,
                        jobId: selectedJob.id,
                        applicantId: user.uid,
                        status: 'pending',
                        createdAt: serverTimestamp(),
                        // Preserve job data in case job is deleted
                        jobTitle: selectedJob.title,
                        jobData: {
                          title: selectedJob.title,
                          type: selectedJob.type,
                          location: selectedJob.location,
                          description: selectedJob.description,
                          requiredSkills: selectedJob.requiredSkills,
                          tags: selectedJob.tags
                        }
                      })
                      await updateDoc(doc(db, 'jobs', selectedJob.id), {
                        applications: (selectedJob.applications || 0) + 1
                      })
                      
                      // Create notification for job poster
                      try {
                        const applicantName = await getApplicantName(user.uid)
                        console.log('Creating notification for:', selectedJob.postedBy, 'from applicant:', user.uid)
                        await notifyNewApplication(docRef.id, selectedJob.postedBy, selectedJob.id, applicantName, selectedJob.title)
                        console.log('Notification created successfully')
                      } catch (notifError) {
                        console.error('Failed to create notification, but application was submitted:', notifError)
                        console.error('Notification error details:', {
                          error: notifError.message,
                          code: notifError.code,
                          stack: notifError.stack
                        })
                        // Don't fail the whole application if notification fails
                      }
                      
                      setSelectedJob(null)
                      fetchApplications()
                      fetchJobs()
                    } catch (error) {
                      console.error('Error submitting application:', error)
                    }
                  }}
              />
          )}

          {chatUser && (
            <Chat
              userId={chatUser.id}
              userName={chatUser.name}
              onClose={() => setChatUser(null)}
            />
          )}

          {selectedJobDetail && (
            <JobDetailModal
              job={selectedJobDetail}
              matchScore={userData ? rankJobs([selectedJobDetail], userData, {
                appliedJobs: applications.map(app => app.jobId),
                viewedJobs: viewedJobs,
                bookmarkedJobs: bookmarks
              })[0]?.matchScore : null}
              isBookmarked={bookmarks.includes(selectedJobDetail.id)}
              onBookmark={() => handleBookmark(selectedJobDetail.id)}
              applicationStatus={getApplicationStatus(selectedJobDetail.id)}
              onApply={() => {
                setSelectedJobDetail(null)
                setSelectedJob(selectedJobDetail)
              }}
              onMessage={() => {
                setSelectedJobDetail(null)
                handleMessage(selectedJobDetail)
              }}
              onViewJob={handleViewJob}
              onClose={() => setSelectedJobDetail(null)}
            />
          )}
        </div>
      <Footer />
      </div>
  )
}
