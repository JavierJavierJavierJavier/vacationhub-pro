import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/layout/Layout'
import LoginPage from './pages/Login.tsx'
import ForgotPasswordPage from './pages/ForgotPassword.tsx'
import ResetPasswordPage from './pages/ResetPassword.tsx'
import DashboardPage from './pages/Dashboard'
import CalendarPage from './pages/Calendar'
import RequestsPage from './pages/Requests'
import ApprovalsPage from './pages/Approvals'
import TeamPage from './pages/Team'
import ReportsPage from './pages/Reports'
import SettingsPage from './pages/Settings.tsx'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

function AdminRoute({ children }) {
  const { user } = useAuth()
  
  if (!user?.isAdmin) {
    return <Navigate to="/" replace />
  }
  
  return children
}

export default function App() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const resetToken = searchParams.get('token')
  const resetEmail = searchParams.get('email')
  const resetFlag = searchParams.get('reset')

  if (location.pathname === '/' && resetFlag === '1' && resetToken && resetEmail) {
    const resetQuery = `?email=${encodeURIComponent(resetEmail)}&token=${encodeURIComponent(resetToken)}`
    return <Navigate to={`/reset-password${resetQuery}`} replace />
  }

  return (
    <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<DashboardPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/requests" element={<RequestsPage />} />
          <Route
            path="/approvals"
            element={
              <AdminRoute>
                <ApprovalsPage />
              </AdminRoute>
            }
          />
          <Route
            path="/team"
            element={
              <AdminRoute>
                <TeamPage />
              </AdminRoute>
            }
          />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  )
}
