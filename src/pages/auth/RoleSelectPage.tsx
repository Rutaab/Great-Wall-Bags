import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useVerification, type RequestableRole } from '../../contexts/VerificationContext'

const roles: { role: RequestableRole; title: string; description: string; icon: string; color: string }[] = [
  { role: 'seller', title: 'Seller', description: 'Sell with full control & zero complexity', icon: 'storefront', color: 'from-[#b9002c] to-[#ff4d6d]' },
  { role: 'manufacturer', title: 'Manufacturer', description: 'Production, wholesale & logistics', icon: 'factory', color: 'from-[#004be3] to-[#4a8cff]' },
  { role: 'supplier', title: 'Supplier', description: 'List products & reach millions', icon: 'inventory_2', color: 'from-[#ff7936] to-[#9e3c00]' },
]

const RoleSelectPage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { submitRequest, getMyRequest } = useVerification()
  const [submitting, setSubmitting] = useState<RequestableRole | null>(null)
  const [error, setError] = useState('')

  const existing = getMyRequest()
  const alreadySubmitted = existing?.status === 'pending' || existing?.status === 'approved'

  useEffect(() => {
    // Buyers are sent to onboarding instead of the picker; anyone who already has a
    // marketplace role has nothing to choose here.
    if (user && user.role !== 'buyer') navigate('/', { replace: true })
  }, [user, navigate])

  const handleSelect = async (role: RequestableRole) => {
    setError('')
    setSubmitting(role)
    try {
      // This submits a request. It does not change the account's role - the
      // backend keeps it as `buyer` until a developer assigns the role on
      // /developer/users after approving the request.
      const ok = await submitRequest(role)
      if (ok) {
        navigate('/pending-approval')
      } else {
        setError('Could not submit your request. Please try again.')
      }
    } finally {
      setSubmitting(null)
    }
  }

  if (user && user.role !== 'buyer') return null

  return (
    <div className="min-h-screen bg-[#fff4f0] font-['Inter'] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-[#4a2507] tracking-tighter mb-4">Choose Your Path</h1>
          <p className="text-[#805030] text-lg max-w-xl mx-auto">
            Pick the role you want to apply for. This sends a request to our team &mdash; your account
            stays a buyer until the request is approved and the role is assigned.
          </p>
        </div>

        {alreadySubmitted && (
          <div className="mb-6 rounded-xl bg-[#004be3]/10 border border-[#004be3]/20 text-[#004be3] px-4 py-3 text-sm font-bold text-center">
            {existing?.status === 'pending'
              ? `Your ${existing.role} request is already under review.`
              : `Your ${existing.role} application was approved.`}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl bg-[#b9002c]/10 border border-[#b9002c]/20 text-[#b9002c] px-4 py-3 text-sm font-bold text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map(({ role, title, description, icon, color }) => (
            <button
              key={role}
              onClick={() => handleSelect(role)}
              disabled={submitting !== null || alreadySubmitted}
              className="bg-white rounded-xl p-6 text-left border border-[#dca079]/10 hover:shadow-xl hover:border-[#dca079]/30 transition-all active:scale-[0.98] group disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg`}>
                <span className="material-symbols-outlined text-white text-2xl">{icon}</span>
              </div>
              <h3 className="text-lg font-bold text-[#4a2507] mb-1">{title}</h3>
              <p className="text-sm text-[#805030]">{description}</p>
              <div className="mt-4 flex items-center gap-1 text-[#9e3c00] text-sm font-bold">
                {submitting === role ? (
                  <><span className="material-symbols-outlined animate-spin text-sm">refresh</span> Sending request...</>
                ) : (
                  <><span>Request</span><span className="material-symbols-outlined text-sm">arrow_forward</span></>
                )}
              </div>
            </button>
          ))}
        </div>
        <div className="text-center mt-8">
          <button onClick={() => navigate('/')} className="text-[#805030] text-sm font-medium hover:text-[#9e3c00] transition-colors">Skip for now — I'll decide later</button>
        </div>
      </div>
    </div>
  )
}

export default RoleSelectPage
