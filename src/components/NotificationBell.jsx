import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, writeBatch } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuth } from '../hooks/useAuth.jsx'
import './NotificationBell.css'

export default function NotificationBell({ onNavigateToJob, onNavigateToApplication }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  const markAsRead = async (notificationId) => {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        read: true,
        readAt: new Date()
      })
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const handleNotificationClick = (notification) => {
    // Mark as read
    if (!notification.read) {
      markAsRead(notification.id)
    }
    
    // Close dropdown
    setShowDropdown(false)
    
    // Navigate based on notification type
    if (notification.type === 'new_application' && notification.jobId) {
      // For finders: navigate to Applications tab and open applicants for that job
      navigate('/dashboard', { 
        state: { 
          activeTab: 'applications',
          openJobId: notification.jobId,
          openApplicants: true
        } 
      })
      // Call callback if provided
      if (onNavigateToJob && notification.jobId) {
        onNavigateToJob(notification.jobId)
      }
    } else if (notification.type === 'application_status' && notification.applicationId) {
      // For seekers: navigate to Applications tab and show that application
      navigate('/dashboard', {
        state: {
          activeTab: 'applications',
          highlightApplicationId: notification.applicationId
        }
      })
      // Call callback if provided
      if (onNavigateToApplication && notification.applicationId) {
        onNavigateToApplication(notification.applicationId)
      }
    } else {
      // Default: just navigate to dashboard
      navigate('/dashboard')
    }
  }

  useEffect(() => {
    if (!user) {
      setNotifications([])
      setUnreadCount(0)
      return
    }

    console.log('Setting up notification listener for user:', user.uid)

    // Try with orderBy first, but we'll use fallback if index is missing
    let q
    let unsubscribe = null
    
    try {
      q = query(
        collection(db, 'notifications'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      )
    } catch (error) {
      console.warn('Could not create query with orderBy, using simple query:', error)
      q = query(
        collection(db, 'notifications'),
        where('userId', '==', user.uid)
      )
    }

    const unsubscribeFn = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      console.log('Notifications received:', notifs.length)
      console.log('Notification details:', notifs.map(n => ({ id: n.id, userId: n.userId, message: n.message, read: n.read })))
      // Sort: unread first, then by date
      notifs.sort((a, b) => {
        if (a.read !== b.read) {
          return a.read ? 1 : -1 // Unread first
        }
        const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt || 0)
        const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt || 0)
        return bTime - aTime // Newer first
      })
      setNotifications(notifs)
      const unread = notifs.filter(n => !n.read).length
      console.log('Unread count:', unread)
      setUnreadCount(unread)
    }, (error) => {
      console.error('Error fetching notifications:', error)
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)
      
      // If index error, try fallback query without orderBy
      if (error.code === 'failed-precondition') {
        console.warn('Firestore index missing. Using fallback query without orderBy.')
        console.warn('To fix: Click the link in the error message to create the index automatically')
        
        // Fallback: query without orderBy and sort client-side
        const fallbackQ = query(
          collection(db, 'notifications'),
          where('userId', '==', user.uid)
        )
        
        const fallbackUnsubscribe = onSnapshot(fallbackQ, (snapshot) => {
          console.log('Fallback query snapshot received, docs:', snapshot.docs.length)
          const notifs = snapshot.docs.map(doc => {
            const data = doc.data()
            console.log('Notification doc:', { id: doc.id, userId: data.userId, message: data.message, read: data.read })
            return {
              id: doc.id,
              ...data
            }
          })
          
          // Sort client-side
          notifs.sort((a, b) => {
            if (a.read !== b.read) {
              return a.read ? 1 : -1
            }
            const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt || 0)
            const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt || 0)
            return bTime - aTime
          })
          
          console.log('Fallback notifications processed:', notifs.length)
          console.log('Notification details:', notifs.map(n => ({ id: n.id, userId: n.userId, message: n.message, read: n.read })))
          setNotifications(notifs)
          const unread = notifs.filter(n => !n.read).length
          console.log('Fallback unread count:', unread)
          setUnreadCount(unread)
        }, (fallbackError) => {
          console.error('Fallback query also failed:', fallbackError)
          setNotifications([])
          setUnreadCount(0)
        })
        
        unsubscribe = fallbackUnsubscribe
      } else {
        // Other error, set empty
        setNotifications([])
        setUnreadCount(0)
      }
    })
    
    unsubscribe = unsubscribeFn

    return () => {
      if (unsubscribe) {
        console.log('Cleaning up notification listener')
        unsubscribe()
      }
    }
  }, [user])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown])

  const markAllAsRead = async () => {
    try {
      const batch = writeBatch(db)
      notifications
        .filter(n => !n.read)
        .forEach(n => {
          batch.update(doc(db, 'notifications', n.id), {
            read: true,
            readAt: new Date()
          })
        })
      await batch.commit()
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now'
    const date = timestamp.toDate?.() || new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'application_status':
        return '📋'
      case 'new_application':
        return '📨'
      case 'new_message':
        return '💬'
      default:
        return '🔔'
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case 'application_status':
        return 'var(--primary-color)'
      case 'new_application':
        return 'var(--success-color)'
      case 'new_message':
        return 'var(--info-color)'
      default:
        return 'var(--text-secondary)'
    }
  }

  if (!user) return null

  return (
    <div className="notification-bell-container" ref={dropdownRef}>
      <button
        className="notification-bell-btn"
        onClick={() => setShowDropdown(!showDropdown)}
        aria-label="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {showDropdown && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button className="mark-all-read-btn" onClick={markAllAsRead}>
                Mark all as read
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">No notifications yet</div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.read ? 'unread' : ''} clickable`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-icon" style={{ color: getNotificationColor(notification.type) }}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <p className="notification-message">{notification.message}</p>
                    <span className="notification-time">{formatTime(notification.createdAt)}</span>
                  </div>
                  {!notification.read && <div className="unread-dot"></div>}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

