import { useState, useEffect } from 'react'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuth } from './useAuth.jsx'

export function useUnreadMessages() {
  const { user } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!user?.uid) {
      setUnreadCount(0)
      return
    }

    // Listen to all chats where user is a participant
    let q
    try {
      q = query(
        collection(db, 'chats'),
        where('participants', 'array-contains', user.uid)
      )
    } catch (error) {
      console.error('Error setting up unread messages query:', error)
      return
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        let totalUnread = 0
        
        snapshot.docs.forEach((docSnapshot) => {
          const chatData = docSnapshot.data()
          const unread = chatData.unread?.[user.uid] || 0
          totalUnread += unread
        })
        
        setUnreadCount(totalUnread)
      },
      (error) => {
        console.error('Error fetching unread messages:', error)
        setUnreadCount(0)
      }
    )

    return () => unsubscribe()
  }, [user?.uid])

  return unreadCount
}

