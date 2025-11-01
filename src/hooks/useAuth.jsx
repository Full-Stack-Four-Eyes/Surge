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

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        if (userDoc.exists()) {
          setUserData({ id: firebaseUser.uid, ...userDoc.data() })
        } else {
          // Create user document if it doesn't exist
          const newUserData = {
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || '',
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
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signup = async (email, password, displayName) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(userCredential.user, { displayName })
    await sendEmailVerification(userCredential.user)
    
    // Create user document in Firestore
    const userData = {
      email,
      displayName,
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
    
    // Check if user document exists, create if not
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid))
    if (!userDoc.exists()) {
      const userData = {
        email: userCredential.user.email,
        displayName: userCredential.user.displayName || '',
        role: 'seeker',
        createdAt: serverTimestamp(),
        skills: [],
        interests: [],
        bio: ''
      }
      await setDoc(doc(db, 'users', userCredential.user.uid), userData)
    }
    
    return userCredential
  }

  const signInWithGithub = async () => {
    const provider = new GithubAuthProvider()
    const userCredential = await signInWithPopup(auth, provider)
    
    // Check if user document exists, create if not
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid))
    if (!userDoc.exists()) {
      const userData = {
        email: userCredential.user.email,
        displayName: userCredential.user.displayName || '',
        role: 'seeker',
        createdAt: serverTimestamp(),
        skills: [],
        interests: [],
        bio: ''
      }
      await setDoc(doc(db, 'users', userCredential.user.uid), userData)
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

