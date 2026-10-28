import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useVerification } from '../contexts/VerificationContext'
import { useAuth } from '../contexts/AuthContext'

const DASHBOARD_FOR_ROLE: Record<string, string> = {
  seller: '/seller/dashboard',
  supplier: '/supplier/dashboard',
  manufacturer: '/manufacturer',
}

const PendingApprovalPage: React.FC = () => {
  const { getMyRequest, isVerified, submitRequest, reload } = useVerification()
  const { user, refreshUser } = useAuth()
  const navigate = useNavigate()
  const [resubmitting, setResubmitting] = useState(false)

  const myRequest = getMyRequest()
  const approved = isVerified()
  // Approval and role assignment are two separate steps, so the request can be
  // approved while `user.role` is still `buyer`. Access is only live once the role
  // on the account actually matches what was approved - this page waits for that
  // instead of sending the user to a dashboard they cannot open.
  const roleGranted = !!myRequest && !!user && user.role === myRequest.role

  useEffect(() => {
    // Poll the backend, not localStorage, so an approval made in the developer
    // console is picked up by any open tab. The account is re-read as well: the
    // request can be approved while `user.role` is still `buyer`, and the role is
    // only written later at /developer/users. Reloading requests alone would leave
    // this page stuck waiting.
    const interval = setInterval(() => {
      void reload()
      if (!roleGranted) void refreshUser()
    }, 5000)
    return () => clearInterval(interval)
  }, [reload, refreshUser, roleGranted])

  useEffect(() => {
    if (!roleGranted || !myRequest) return
    const target = DASHBOARD_FOR_ROLE[myRequest.role]
    if (!target) return
    const timer = setTimeout(() => navigate(target, { replace: true }), 1200)
    return () => clearTimeout(timer)
  }, [roleGranted, myRequest, navigate])

  const handleResubmit = async () => {
    if (!myRequest) return
    setResubmitting(true)
    try {
      await submitRequest(myRequest.role, myRequest.applicationData)
    } finally {
      setResubmitting(false)
    }
  }

  if (!myRequest) {
    return (
      <div className="min-h-screen bg-[#fff4f0] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#dca079]/10 max-w-md w-full text-center">
          <span className="material-symbols-outlined text-6xl text-[#805030] mb-4">info</span>
          <h2 className="text-xl font-black text-[#4a2507] mb-2">No Request Found</h2>
          <p className="text-sm text-[#805030] mb-6">You haven't submitted a verification request yet.</p>
          <button onClick={() => navigate('/')} className="px-6 py-2.5 bg-[#9e3c00] text-white rounded-full text-sm font-bold">Go Home</button>
        </div>
      </div>
    )
  }

  if (roleGranted) {
    return (
      <div className="min-h-screen bg-[#fff4f0] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#dca079]/10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl text-green-600">check_circle</span>
          </div>
          <h2 className="text-xl font-black text-[#4a2507] mb-2">Access Granted!</h2>
          <p className="text-sm text-[#805030] mb-6">Redirecting to your dashboard...</p>
        </div>
      </div>
    )
  }

  if (approved) {
    // Approved, but the developer has not yet set the role on the account.
    return (
      <div className="min-h-screen bg-[#fff4f0] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#dca079]/10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-[#c6d0ff] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl text-[#004be3]">assignment_turned_in</span>
          </div>
          <h2 className="text-xl font-black text-[#4a2507] mb-2">Request Approved</h2>
          <p className="text-sm text-[#805030] mb-6">
            Your {myRequest.role} application was approved. A developer now needs to enable your{' '}
            {myRequest.role} access, and this page will continue automatically once it's active.
          </p>
          <div className="bg-[#ffede4] rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3 text-sm text-[#805030] justify-center">
              <span className="material-symbols-outlined text-[#9e3c00]">hourglass_bottom</span>
              <span className="font-medium">Waiting for your role to be activated</span>
            </div>
          </div>
          <button onClick={() => navigate('/')} className="text-sm text-[#805030] hover:text-[#9e3c00] transition-colors font-medium">
            Return to Home
          </button>
        </div>
      </div>
    )
  }

  if (myRequest.status === 'rejected') {
    return (
      <div className="min-h-screen bg-[#fff4f0] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#dca079]/10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl text-red-600">cancel</span>
          </div>
          <h2 className="text-xl font-black text-[#4a2507] mb-2">Request Rejected</h2>
          {myRequest.notes && (
            <div className="bg-red-50 rounded-xl p-4 mb-6 text-left">
              <p className="text-xs font-bold text-red-700 mb-1">Developer Notes:</p>
              <p className="text-sm text-red-600">{myRequest.notes}</p>
            </div>
          )}
          <p className="text-sm text-[#805030] mb-6">Your verification request was not approved. You can review the feedback and resubmit.</p>
          <button
            onClick={handleResubmit}
            disabled={resubmitting}
            className="px-6 py-2.5 bg-[#9e3c00] text-white rounded-full text-sm font-bold hover:bg-[#7a2e00] transition-colors disabled:opacity-60"
          >
            {resubmitting ? 'Submitting...' : 'Resubmit Request'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fff4f0] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#dca079]/10 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-[#fff4f0] rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-[3px] border-[#ffdcc7] border-t-[#9e3c00]" />
        </div>
        <h2 className="text-xl font-black text-[#4a2507] mb-2">Pending Developer Review</h2>
        <p className="text-sm text-[#805030] mb-6">
          Your {myRequest.role} application has been submitted. A developer will review your request
          shortly. You'll be automatically redirected once the role is enabled.
        </p>
        <div className="bg-[#ffede4] rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3 text-sm text-[#805030]">
            <span className="material-symbols-outlined text-[#9e3c00]">hourglass_bottom</span>
            <span className="font-medium">Status: Pending Review</span>
          </div>
        </div>
        <button onClick={() => navigate('/')} className="text-sm text-[#805030] hover:text-[#9e3c00] transition-colors font-medium">
          Return to Home
        </button>
      </div>
    </div>
  )
}

export default PendingApprovalPage