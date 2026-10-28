import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useVerification, type RequestableRole } from '../../contexts/VerificationContext'

const roleData: Record<string, { title: string; description: string; icon: string; gradient: string; onboarding: string }> = {
  supplier: {
    title: 'Supplier',
    description: 'List products and reach millions of buyers worldwide.',
    icon: 'inventory_2',
    gradient: 'from-[#ff7936] to-[#9e3c00]',
    onboarding: '/supplier/onboarding',
  },
  seller: {
    title: 'Seller',
    description: 'Full control over your storefront with zero complexity.',
    icon: 'storefront',
    gradient: 'from-[#b9002c] to-[#ff4d6d]',
    onboarding: '/seller/onboarding',
  },
  manufacturer: {
    title: 'Manufacturer',
    description: 'Production line management, wholesale & global logistics.',
    icon: 'factory',
    gradient: 'from-[#004be3] to-[#4a8cff]',
    onboarding: '/manufacturer',
  },
}

const closeIcon = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const RoleGatePage: React.FC = () => {
  const { role } = useParams<{ role: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { submitRequest, getMyRequest } = useVerification()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const close = () => navigate('/')

  const data = role ? roleData[role] : null
  if (!data) {
    return (
      <div className="min-h-screen bg-[#fff4f0] font-['Inter'] flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-3xl font-black text-[#4a2507] mb-4">Invalid Role</h1>
          <button onClick={close} className="text-[#004be3] font-bold hover:underline">Back to Home</button>
        </div>
      </div>
    )
  }

  const isAlreadyThisRole = user?.role === role
  const pendingForThisRole = getMyRequest()?.role === role && getMyRequest()?.status === 'pending'

  // Submitting sends a request; it does not switch the account's role. The account
  // keeps its current role until a developer approves the request and assigns the
  // role on /developer/users.
  const handleApply = async () => {
    setError('')
    setSubmitting(true)
    try {
      const ok = await submitRequest(role as RequestableRole)
      if (ok) {
        navigate('/pending-approval')
      } else {
        setError('Could not submit your request. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={close}>
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-auto animate-pop"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={close}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-[#805030] hover:bg-[#ffede4] transition-colors"
        >
          {closeIcon}
        </button>

        <div className="p-8 pb-6 text-center">
          <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${data.gradient} flex items-center justify-center mb-4 shadow-lg`}>
            <span className="material-symbols-outlined text-white text-2xl">{data.icon}</span>
          </div>
          <h2 className="text-xl font-bold text-[#4a2507] mb-1">{data.title}</h2>
          <p className="text-xs text-[#805030] leading-relaxed">{data.description}</p>
        </div>

        <div className="px-8 pb-8">
          {isAlreadyThisRole ? (
            <button
              onClick={() => {
                const d: Record<string, string> = { supplier: '/supplier/dashboard', seller: '/seller/dashboard', manufacturer: '/manufacturer/factory-hub' }
                navigate(d[role!] || '/')
              }}
              className={`w-full py-3 rounded-xl text-white font-bold text-sm bg-gradient-to-r ${data.gradient} shadow-md active:scale-[0.98] transition-all`}
            >
              Go to Dashboard
            </button>
          ) : (
            <div className="space-y-2.5">
              {pendingForThisRole ? (
                <div className="rounded-xl bg-[#004be3]/10 border border-[#004be3]/20 text-[#004be3] px-4 py-3 text-xs font-bold text-center">
                  Your {data.title} request is already under review.
                </div>
              ) : (
                <button
                  onClick={handleApply}
                  disabled={submitting}
                  className={`w-full py-3 rounded-xl text-white font-bold text-sm bg-gradient-to-r ${data.gradient} shadow-md active:scale-[0.98] transition-all disabled:opacity-60`}
                >
                  {submitting ? 'Sending request...' : `Request ${data.title} Access`}
                </button>
              )}
              {error && <p className="text-[#b9002c] text-xs font-bold text-center">{error}</p>}
              <button onClick={close} className="w-full py-2.5 rounded-xl text-[#805030] font-semibold text-sm hover:bg-[#ffede4] transition-colors">
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes pop { from { opacity: 0; transform: scale(0.95) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .animate-pop { animation: pop 0.2s ease-out; }
      `}</style>
    </div>
  )
}

export default RoleGatePage
