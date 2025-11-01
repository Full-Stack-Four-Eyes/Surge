import { useState, useEffect } from 'react'
import { collection, query, where, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuth } from '../hooks/useAuth.jsx'
import './ChatList.css'

export default function ChatList({ onSelectChat }) {
  const { user } = useAuth()
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false)
      return
    }

    // Try query with orderBy first, but fall back if it fails
    let q
    try {
      q = query(
        collection(db, 'chats'),
        where('participants', 'array-contains', user.uid),
        orderBy('lastMessageTime', 'desc')
      )
    } catch (error) {
      // If orderBy fails, use simpler query without ordering
      console.warn('OrderBy query failed, using simple query:', error)
      q = query(
        collection(db, 'chats'),
        where('participants', 'array-contains', user.uid)
      )
    }

    // Set timeout to stop loading after 10 seconds
    const timeoutId = setTimeout(() => {
      setLoading(false)
      console.warn('Chat list loading timeout')
    }, 10000)

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        clearTimeout(timeoutId)
        try {
          const chatsData = await Promise.all(
            snapshot.docs.map(async (docSnapshot) => {
              const chatData = docSnapshot.data()
              const otherUserId = chatData.participants?.find(id => id !== user.uid)
              
              if (!otherUserId) {
                return null
              }

              let otherUserName = 'Unknown User'
              
              try {
                const userDoc = await getDoc(doc(db, 'users', otherUserId))
                if (userDoc.exists()) {
                  otherUserName = userDoc.data().displayName || userDoc.data().email || 'Unknown User'
                }
              } catch (error) {
                console.error('Error fetching user:', error)
              }

              return {
                id: docSnapshot.id,
                ...chatData,
                otherUserId,
                otherUserName,
                unreadCount: chatData.unread?.[user.uid] || 0,
                lastMessageTime: chatData.lastMessageTime || chatData.createdAt || null
              }
            })
          )
          
          // Filter out null entries and sort manually if needed
          const validChats = chatsData.filter(chat => chat !== null)
          
          // Sort by lastMessageTime if available, otherwise by chat ID
          validChats.sort((a, b) => {
            const timeA = a.lastMessageTime?.toDate?.() || a.lastMessageTime?.seconds * 1000 || 0
            const timeB = b.lastMessageTime?.toDate?.() || b.lastMessageTime?.seconds * 1000 || 0
            return timeB - timeA
          })
          
          setChats(validChats)
          setLoading(false)
        } catch (error) {
          console.error('Error processing chat list:', error)
          setLoading(false)
        }
      },
      (error) => {
        clearTimeout(timeoutId)
        console.error('Chat list query error:', error)
        
        // If orderBy fails with index error, try without orderBy
        if (error.code === 'failed-precondition') {
          console.log('Retrying without orderBy...')
          try {
            const simpleQ = query(
              collection(db, 'chats'),
              where('participants', 'array-contains', user.uid)
            )
            
            onSnapshot(simpleQ, async (snapshot) => {
              const chatsData = await Promise.all(
                snapshot.docs.map(async (docSnapshot) => {
                  const chatData = docSnapshot.data()
                  const otherUserId = chatData.participants?.find(id => id !== user.uid)
                  
                  if (!otherUserId) return null

                  let otherUserName = 'Unknown User'
                  try {
                    const userDoc = await getDoc(doc(db, 'users', otherUserId))
                    if (userDoc.exists()) {
                      otherUserName = userDoc.data().displayName || userDoc.data().email || 'Unknown User'
                    }
                  } catch (err) {
                    console.error('Error fetching user:', err)
                  }

                  return {
                    id: docSnapshot.id,
                    ...chatData,
                    otherUserId,
                    otherUserName,
                    unreadCount: chatData.unread?.[user.uid] || 0,
                    lastMessageTime: chatData.lastMessageTime || chatData.createdAt || null
                  }
                })
              )
              
              const validChats = chatsData.filter(chat => chat !== null)
              validChats.sort((a, b) => {
                const timeA = a.lastMessageTime?.toDate?.() || a.lastMessageTime?.seconds * 1000 || 0
                const timeB = b.lastMessageTime?.toDate?.() || b.lastMessageTime?.seconds * 1000 || 0
                return timeB - timeA
              })
              
              setChats(validChats)
              setLoading(false)
            })
          } catch (retryError) {
            console.error('Retry query also failed:', retryError)
            setLoading(false)
          }
        } else {
          setLoading(false)
        }
      }
    )

    return () => {
      clearTimeout(timeoutId)
      unsubscribe()
    }
  }, [user?.uid])

  if (loading) {
    return (
      <div className="chat-list">
        <h3>Messages</h3>
        <div className="chat-list-loading">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div className="spinner" style={{
              width: '40px',
              height: '40px',
              border: '4px solid var(--border-color)',
              borderTopColor: 'var(--primary-color)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }}></div>
            <p style={{ color: 'var(--text-secondary)' }}>Loading chats...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-list">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3>Messages</h3>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-sm btn-secondary"
          style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem' }}
        >
          Refresh
        </button>
      </div>
      {chats.length === 0 ? (
        <div className="no-chats">
          <p style={{ marginBottom: '0.5rem' }}>No messages yet</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>
            Start a conversation by messaging someone from a job post!
          </p>
        </div>
      ) : (
        <div className="chats">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`chat-item ${chat.unreadCount > 0 ? 'unread' : ''}`}
              onClick={() => onSelectChat(chat.otherUserId, chat.otherUserName)}
            >
              <div className="chat-item-content">
                <h4>{chat.otherUserName}</h4>
                <p className="last-message">{chat.lastMessage || 'No messages'}</p>
              </div>
              {chat.unreadCount > 0 && (
                <span className="unread-badge">{chat.unreadCount}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

