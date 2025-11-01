import { useState, useEffect, useRef } from 'react'
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuth } from '../hooks/useAuth.jsx'
import './Chat.css'

export default function Chat({ userId, userName, onClose }) {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null)

  // Create or get chat ID
  const chatId = [user.uid, userId].sort().join('_')

  useEffect(() => {
    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('createdAt', 'asc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setMessages(msgs)
      setLoading(false)
      
      // Mark messages as read
      msgs.forEach(msg => {
        if (msg.senderId !== user.uid && !msg.read) {
          updateDoc(doc(db, 'chats', chatId, 'messages', msg.id), {
            read: true
          })
        }
      })
    })

    // Mark chat as read
    updateDoc(doc(db, 'chats', chatId), {
      [`unread.${user.uid}`]: 0
    }).catch(() => {
      // Chat document might not exist yet, that's okay
    })

    return unsubscribe
  }, [chatId, user.uid])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        text: newMessage,
        senderId: user.uid,
        senderName: user.displayName || 'You',
        createdAt: serverTimestamp(),
        read: false
      })

      // Update chat metadata
      await updateDoc(doc(db, 'chats', chatId), {
        lastMessage: newMessage,
        lastMessageTime: serverTimestamp(),
        [`unread.${userId}`]: (await getDoc(doc(db, 'chats', chatId))).data()?.unread?.[userId] + 1 || 1
      }).catch(async () => {
        // Create chat document if it doesn't exist
        await setDoc(doc(db, 'chats', chatId), {
          participants: [user.uid, userId],
          lastMessage: newMessage,
          lastMessageTime: serverTimestamp(),
          unread: { [userId]: 1, [user.uid]: 0 }
        })
      })

      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  if (loading) {
    return (
      <div className="chat-container">
        <div className="chat-header">
          <h3>{userName}</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <div className="chat-loading">Loading messages...</div>
      </div>
    )
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>{userName}</h3>
        <button onClick={onClose} className="close-btn">×</button>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="no-messages">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${msg.senderId === user.uid ? 'sent' : 'received'}`}
            >
              <div className="message-content">
                <p>{msg.text}</p>
                <span className="message-time">
                  {msg.createdAt?.toDate?.().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  }) || 'Just now'}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="chat-input-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="chat-input"
        />
        <button type="submit" className="send-btn" disabled={!newMessage.trim()}>
          Send
        </button>
      </form>
    </div>
  )
}

