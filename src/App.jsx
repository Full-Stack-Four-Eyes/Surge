import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth.jsx'
import LandingPage from './pages/LandingPage'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import ForgotPassword from './pages/auth/ForgotPassword'
import TalentFinderDashboard from './pages/TalentFinderDashboard'
import TalentSeekerDashboard from './pages/TalentSeekerDashboard'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import LoadingSpinner from './components/LoadingSpinner'

function App() {
  const { user, userData, loading } = useAuth()

  // Debug logging
  console.log('App render - loading:', loading, 'user:', user, 'userData:', userData)

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {userData?.role === 'finder' ? (
              <TalentFinderDashboard />
            ) : userData?.role === 'seeker' ? (
              <TalentSeekerDashboard />
            ) : (
              <LoadingSpinner />
            )}
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/finder"
        element={
          <ProtectedRoute>
            <TalentFinderDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/seeker"
        element={
          <ProtectedRoute>
            <TalentSeekerDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App

