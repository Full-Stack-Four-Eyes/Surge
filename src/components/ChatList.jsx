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
    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', user.uid),
      orderBy('lastMessageTime', 'desc')
    )

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const chatsData = await Promise.all(
        snapshot.docs.map(async (docSnapshot) => {
          const chatData = docSnapshot.data()
          const otherUserId = chatData.participants.find(id => id !== user.uid)
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
            unreadCount: chatData.unread?.[user.uid] || 0
          }
        })
      )
      setChats(chatsData)
      setLoading(false)
    })

    return unsubscribe
  }, [user.uid])

  if (loading) {
    return <div className="chat-list-loading">Loading chats...</div>
  }

  return (
    <div className="chat-list">
      <h3>Messages</h3>
      {chats.length === 0 ? (
        <div className="no-chats">No messages yet</div>
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

