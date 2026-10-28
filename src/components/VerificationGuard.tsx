import React from 'react'
import { Navigate } from 'react-router-dom'
import { useVerification } from '../contexts/VerificationContext'
import { useAuth } from '../contexts/AuthContext'

interface VerificationGuardProps {
  children: React.ReactNode
}

const VerificationGuard: React.FC<VerificationGuardProps> = ({ children }) => {
  const { isVerified, getMyRequest } = useVerification()
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />

  if (user.role === 'developer' || isVerified()) return <>{children}</>

  const myRequest = getMyRequest()

  // Only block while an application is actually pending (or rejected and not resubmitted).
  if (myRequest && myRequest.status !== 'approved') {
    return <Navigate to="/pending-approval" replace />
  }

  // Role was granted directly with no application on file -> allow access.
  return <>{children}</>
}

export default VerificationGuard
