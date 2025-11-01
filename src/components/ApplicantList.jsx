import { useState, useEffect } from 'react'
import { collection, query, where, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import Chat from './Chat'
import './ApplicantList.css'

export default function ApplicantList({ job, onClose }) {
  const [applicants, setApplicants] = useState([])
  const [loading, setLoading] = useState(true)
  const [chatUser, setChatUser] = useState(null)

  useEffect(() => {
    // Use real-time listener for applications
    const q = query(
      collection(db, 'applications'),
      where('jobId', '==', job.id)
    )

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      try {
        const appsData = await Promise.all(
          snapshot.docs.map(async (docSnapshot) => {
            const appData = { id: docSnapshot.id, ...docSnapshot.data() }
            // Fetch user data for each applicant
            try {
              const userDoc = await getDoc(doc(db, 'users', appData.applicantId))
              if (userDoc.exists()) {
                appData.applicant = { id: appData.applicantId, ...userDoc.data() }
              }
            } catch (error) {
              console.error('Error fetching user:', error)
            }
            return appData
          })
        )
        setApplicants(appsData)
        setLoading(false)
      } catch (error) {
        console.error('Error processing applicants:', error)
        setLoading(false)
      }
    }, (error) => {
      console.error('Error in applicants listener:', error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [job.id])

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      await updateDoc(doc(db, 'applications', applicationId), {
        status: newStatus,
        updatedAt: new Date()
      })
      // No need to fetchApplicants - real-time listener will update automatically
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content applicant-list" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Applicants for {job.title}</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        {loading ? (
          <div className="loading">Loading applicants...</div>
        ) : applicants.length === 0 ? (
          <div className="empty-state">No applicants yet.</div>
        ) : (
          <div className="applicants-list">
            {applicants.map((app) => (
              <div key={app.id} className="applicant-card">
                <div className="applicant-info">
                  <h3>{app.applicant?.displayName || 'Unknown User'}</h3>
                  <p className="applicant-email">{app.applicant?.email || ''}</p>
                  <p className="applicant-message">{app.message}</p>
                  {app.resumeUrl && (
                    <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="resume-link">
                      📄 View Resume
                    </a>
                  )}
                </div>
                <div className="applicant-actions">
                  <div className="applicant-status-section">
                    <label className="status-label">Application Status:</label>
                    <select
                      value={app.status}
                      onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="pending">📋 Pending</option>
                      <option value="shortlisted">⭐ Shortlisted</option>
                      <option value="accepted">✅ Accepted</option>
                      <option value="rejected">❌ Rejected</option>
                    </select>
                  </div>
                  <button
                    onClick={() => setChatUser({ id: app.applicantId, name: app.applicant?.displayName || 'User' })}
                    className="btn btn-sm btn-primary"
                  >
                    💬 Message
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {chatUser && (
        <Chat
          userId={chatUser.id}
          userName={chatUser.name}
          onClose={() => setChatUser(null)}
        />
      )}
    </div>
  )
}

