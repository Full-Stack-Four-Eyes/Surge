import { useState, useEffect, createContext, useContext } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../config/firebase'

const AuthContext = createContext({})

export const useAuth = () => {
  return useContext(AuthContext)
}

// Helper function to extract display name from email
function getDefaultDisplayName(email, displayName) {
  if (displayName && displayName.trim()) {
    return displayName.trim()
  }
  if (email) {
    // Extract part before @ and capitalize first letter
    const emailPart = email.split('@')[0]
    return emailPart.charAt(0).toUpperCase() + emailPart.slice(1)
  }
  return 'User'
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    let mounted = true
    let timeoutId

    // Timeout fallback to prevent infinite loading
    timeoutId = setTimeout(() => {
      if (mounted) {
        console.warn('Auth loading timeout - proceeding without user')
        setLoading(false)
      }
    }, 5000) // 5 second timeout

    try {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (!mounted) return
        
        try {
            if (firebaseUser) {
              setUser(firebaseUser)
              // Fetch user data from Firestore
              const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
              if (userDoc.exists()) {
                const data = userDoc.data()
                // Ensure displayName exists, use default if not
                const finalDisplayName = data.displayName || getDefaultDisplayName(firebaseUser.email, firebaseUser.displayName)
                
                // Update displayName if it was missing
                if (!data.displayName && finalDisplayName) {
                  await setDoc(doc(db, 'users', firebaseUser.uid), {
                    displayName: finalDisplayName
                  }, { merge: true })
                }
                
                setUserData({ id: firebaseUser.uid, ...data, displayName: finalDisplayName })
              } else {
                // Create user document if it doesn't exist
                const defaultDisplayName = getDefaultDisplayName(firebaseUser.email, firebaseUser.displayName)
                const newUserData = {
                  email: firebaseUser.email,
                  displayName: defaultDisplayName,
                  role: 'seeker', // default role
                  createdAt: serverTimestamp(),
                  skills: [],
                  interests: [],
                  bio: ''
                }
                await setDoc(doc(db, 'users', firebaseUser.uid), newUserData)
                setUserData({ id: firebaseUser.uid, ...newUserData })
              }
          } else {
            setUser(null)
            setUserData(null)
          }
        } catch (error) {
          console.error('Error in auth state change handler:', error)
          if (mounted) {
            setUser(null)
            setUserData(null)
            clearTimeout(timeoutId)
            setLoading(false)
          }
        } finally {
          if (mounted) {
            clearTimeout(timeoutId)
            setLoading(false)
          }
        }
      })

      return () => {
        mounted = false
        clearTimeout(timeoutId)
        unsubscribe()
      }
    } catch (error) {
      console.error('Error setting up auth listener:', error)
      if (mounted) {
        clearTimeout(timeoutId)
        setLoading(false)
      }
    }
  }, [])

  const signup = async (email, password, displayName) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    
    // Use provided displayName or default from email
    const finalDisplayName = displayName?.trim() || getDefaultDisplayName(email, null)
    await updateProfile(userCredential.user, { displayName: finalDisplayName })
    await sendEmailVerification(userCredential.user)
    
    // Create user document in Firestore
    const userData = {
      email,
      displayName: finalDisplayName,
      role: 'seeker',
      createdAt: serverTimestamp(),
      skills: [],
      interests: [],
      bio: ''
    }
    await setDoc(doc(db, 'users', userCredential.user.uid), userData)
    
    return userCredential
  }

  const login = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password)
  }

  const logout = async () => {
    await signOut(auth)
  }

  const resetPassword = async (email) => {
    return await sendPasswordResetEmail(auth, email)
  }

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    const userCredential = await signInWithPopup(auth, provider)
    
    // Check if user document exists, create or update if not
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid))
    const defaultDisplayName = getDefaultDisplayName(
      userCredential.user.email, 
      userCredential.user.displayName
    )
    
    if (!userDoc.exists()) {
      // Create new user document
      const userData = {
        email: userCredential.user.email,
        displayName: defaultDisplayName,
        role: 'seeker',
        createdAt: serverTimestamp(),
        skills: [],
        interests: [],
        bio: ''
      }
      await setDoc(doc(db, 'users', userCredential.user.uid), userData)
    } else {
      // Update displayName if it's missing
      const existingData = userDoc.data()
      if (!existingData.displayName || existingData.displayName.trim() === '') {
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          displayName: defaultDisplayName
        }, { merge: true })
      }
    }
    
    return userCredential
  }

  const signInWithGithub = async () => {
    const provider = new GithubAuthProvider()
    const userCredential = await signInWithPopup(auth, provider)
    
    // Check if user document exists, create or update if not
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid))
    const defaultDisplayName = getDefaultDisplayName(
      userCredential.user.email, 
      userCredential.user.displayName
    )
    
    if (!userDoc.exists()) {
      // Create new user document
      const userData = {
        email: userCredential.user.email,
        displayName: defaultDisplayName,
        role: 'seeker',
        createdAt: serverTimestamp(),
        skills: [],
        interests: [],
        bio: ''
      }
      await setDoc(doc(db, 'users', userCredential.user.uid), userData)
    } else {
      // Update displayName if it's missing
      const existingData = userDoc.data()
      if (!existingData.displayName || existingData.displayName.trim() === '') {
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          displayName: defaultDisplayName
        }, { merge: true })
      }
    }
    
    return userCredential
  }

  const switchRole = async (newRole) => {
    if (user && (newRole === 'finder' || newRole === 'seeker')) {
      try {
        await setDoc(doc(db, 'users', user.uid), {
          role: newRole
        }, { merge: true })
        setUserData(prev => ({ ...prev, role: newRole }))
      } catch (error) {
        console.error('Error switching role:', error)
      }
    }
  }

  const value = {
    user,
    userData,
    signup,
    login,
    logout,
    resetPassword,
    signInWithGoogle,
    signInWithGithub,
    switchRole,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

