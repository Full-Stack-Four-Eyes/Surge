import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import Chat from './Chat'
import './ApplicantList.css'

export default function ApplicantList({ job, onClose }) {
  const [applicants, setApplicants] = useState([])
  const [loading, setLoading] = useState(true)
  const [chatUser, setChatUser] = useState(null)

  useEffect(() => {
    fetchApplicants()
  }, [job.id])

  const fetchApplicants = async () => {
    try {
      const q = query(
        collection(db, 'applications'),
        where('jobId', '==', job.id)
      )
      const querySnapshot = await getDocs(q)
      const appsData = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const appData = { id: doc.id, ...doc.data() }
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
    } catch (error) {
      console.error('Error fetching applicants:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      await updateDoc(doc(db, 'applications', applicationId), {
        status: newStatus,
        updatedAt: new Date()
      })
      fetchApplicants()
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
                  <button
                    onClick={() => setChatUser({ id: app.applicantId, name: app.applicant?.displayName || 'User' })}
                    className="btn btn-sm btn-primary"
                  >
                    💬 Message
                  </button>
                  <select
                    value={app.status}
                    onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                    className="status-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
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

