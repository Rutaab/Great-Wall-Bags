import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

interface ProtectedRouteProps {
  children?: React.ReactNode
  /** Roles allowed to view the route. Omit to allow any signed-in user. */
  requiredRole?: string[]
  /**
   * Restrict to the developer console. `user` always comes from GET /auth/me, so
   * this reflects the server's answer rather than anything cached in the browser.
   * The backend independently rejects every /api/admin and /api/requests/all call
   * from a non-developer, so this guard is about not rendering the console at all.
   */
  developerOnly?: boolean
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole, developerOnly }) => {
  const { user, isLoggedIn, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff7936]" /></div>
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  if (developerOnly && user?.role !== 'developer') {
    return <Navigate to="/account" replace />
  }

  if (requiredRole && (!user || !requiredRole.includes(user.role))) {
    // Send partners to their own dashboard rather than a dead end.
    const home: Record<string, string> = {
      seller: '/seller/dashboard',
      supplier: '/supplier/dashboard',
      manufacturer: '/manufacturer/factory-hub',
      developer: '/developer',
    }
    return <Navigate to={home[user?.role || ''] || '/account'} replace />
  }

  return children ? <>{children}</> : <Outlet />
}

export default ProtectedRoute