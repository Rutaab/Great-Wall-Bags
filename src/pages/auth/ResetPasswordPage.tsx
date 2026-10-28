import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate()
  const { resetPassword } = useAuth()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const checks = {
    length: newPassword.length >= 12,
    case: /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword),
    symbol: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    match: newPassword === confirmPassword && newPassword.length > 0,
  }

  const allValid = Object.values(checks).every(Boolean)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!allValid) return
    if (!token) {
      setError('Missing reset token. Please request a new password reset.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await resetPassword(token, newPassword)
      navigate('/reset-success')
    } catch (err: any) {
      setError(err.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  const CheckItem: React.FC<{ id: string; label: string; valid: boolean }> = ({ id, label, valid }) => (
    <li id={id} className={`flex items-center gap-2 text-xs transition-colors ${valid ? 'text-[#9e3c00]' : 'text-[#805030]'}`}>
      <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: valid ? "'FILL' 1" : "'FILL' 0" }}>check_circle</span>
      {label}
    </li>
  )

  return (
    <div className="min-h-screen bg-[#fff4f0] text-[#4a2507] flex flex-col overflow-x-hidden">
      <header className="sticky top-0 z-50 bg-[#fff4f0]/80 backdrop-blur-xl">
        <div className="flex justify-between items-center px-6 py-4 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-8">
            <span className="text-xl font-black text-[#9e3c00] tracking-tighter">The Kinetic Curator</span>
            <nav className="hidden md:flex gap-6 items-center">
              <a href="#" className="text-[#805030] hover:bg-[#ffd4bb] transition-colors px-2 py-1 rounded">Marketplace</a>
              <a href="#" className="text-[#805030] hover:bg-[#ffd4bb] transition-colors px-2 py-1 rounded">Collections</a>
              <a href="#" className="text-[#805030] hover:bg-[#ffd4bb] transition-colors px-2 py-1 rounded">Curators</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="material-symbols-outlined text-[#9e3c00] p-2 hover:bg-[#ffd4bb] rounded-full transition-all active:scale-95">shopping_bag</button>
            <button className="material-symbols-outlined text-[#9e3c00] p-2 hover:bg-[#ffd4bb] rounded-full transition-all active:scale-95">help</button>
            <button className="material-symbols-outlined text-[#9e3c00] p-2 hover:bg-[#ffd4bb] rounded-full transition-all active:scale-95">account_circle</button>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4 lg:p-8 relative">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#ff7936] opacity-10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#004be3] opacity-10 rounded-full blur-3xl" />
        </div>

        <div className="w-full max-w-5xl bg-[#ffede4] rounded-xl overflow-hidden flex flex-col md:flex-row shadow-2xl shadow-[#4a2507]/5">
          <div className="w-full md:w-1/2 bg-gradient-to-r from-[#9e3c00] to-[#ff7936] p-12 flex flex-col items-center justify-center text-white relative">
            <div className="absolute top-6 left-6 flex items-center gap-2 opacity-80">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              <span className="text-xs font-bold tracking-widest uppercase">Encryption Active</span>
            </div>
            <div className="relative mb-8" style={{ perspective: '1000px' }}>
              <img
                className="w-64 h-64 object-cover rounded-xl shadow-2xl border-4 border-white/10"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAw44XQIaFc9Ym15Tu27f6FnuErraMfs5U4fRzGuQJoXtyGY3J_ZreT3GExJHKXZiFwlIHvOUI1BFwCHMAOH7cygYQjrjVbDXcdbwc8z7pPb0LRhgzJ5TdaXMTrApeDZolbHzCAbKbig-XqNKBXRTNNWznZIQP9p30i5NicpKdAt27kHXQQ9qon2v6eaZ9J8pXyeVhuOyAFxQcIVZWZMLBck3nUlCLd7NwJ894HwmJUI3By-wEEXIxgFu28BvCNEky5BiBsrok7GYlI"
                alt=""
              />
              <div className="absolute -bottom-4 -right-4 bg-white text-[#9e3c00] p-4 rounded-xl shadow-lg">
                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
              </div>
            </div>
            <h2 className="text-3xl font-black tracking-tighter mb-4 text-center">FORTIFY YOUR ACCESS</h2>
            <p className="text-white/80 text-center text-sm max-w-xs leading-relaxed">
              Our curators deserve unparalleled security. Reset your credentials using our 256-bit encrypted kinetic protocol.
            </p>
            <div className="mt-12 flex gap-4">
              <div className="w-2 h-2 rounded-full bg-white" />
              <div className="w-2 h-2 rounded-full bg-white/40" />
              <div className="w-2 h-2 rounded-full bg-white/40" />
            </div>
          </div>

          <div className="w-full md:w-1/2 bg-white p-8 lg:p-12">
            <div className="mb-10">
              <h1 className="text-2xl font-bold text-[#4a2507] tracking-tight mb-2">Reset Password</h1>
              <p className="text-[#805030] text-sm">Please choose a unique password to protect your curated collection.</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#805030]" htmlFor="new-password">New Password</label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-[#ffede4] rounded-lg border-none focus:ring-2 focus:ring-[#004be3] transition-all placeholder:text-[#805030]/50 outline-none"
                  />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#805030] hover:text-[#9e3c00] transition-colors">
                    {showNew ? 'visibility_off' : 'visibility'}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#805030]" htmlFor="confirm-password">Confirm New Password</label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-[#ffede4] rounded-lg border-none focus:ring-2 focus:ring-[#004be3] transition-all placeholder:text-[#805030]/50 outline-none"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#805030] hover:text-[#9e3c00] transition-colors">
                    {showConfirm ? 'visibility_off' : 'visibility'}
                  </button>
                </div>
              </div>

              <div className="bg-[#ffede4] p-4 rounded-lg space-y-3">
                <h3 className="text-xs font-bold text-[#4a2507] uppercase tracking-tighter mb-2">Security Requirements</h3>
                <ul className="space-y-2">
                  <CheckItem id="req-length" label="Minimum 12 characters long" valid={checks.length} />
                  <CheckItem id="req-case" label="Mix of uppercase and lowercase" valid={checks.case} />
                  <CheckItem id="req-symbol" label="At least one special symbol (@, #, $)" valid={checks.symbol} />
                  <CheckItem id="req-match" label="Passwords must match" valid={checks.match} />
                </ul>
              </div>

              {error && <p className="text-[#b9002c] text-sm font-bold text-center">{error}</p>}
              <button
                type="submit"
                disabled={!allValid || loading}
                className="w-full py-4 bg-gradient-to-r from-[#9e3c00] to-[#ff7936] text-white font-bold rounded-xl shadow-lg shadow-[#9e3c00]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <><span className="material-symbols-outlined animate-spin">refresh</span> Processing...</>
                ) : (
                  <><span>Update Security Credentials</span><span className="material-symbols-outlined">arrow_forward</span></>
                )}
              </button>

              <p className="text-center">
                <a href="/login" className="text-xs font-semibold text-[#004be3] hover:underline">Cancel and return to login</a>
              </p>
            </form>
          </div>
        </div>
      </main>

      <footer className="py-8 mt-auto">
        <div className="w-full flex flex-col items-center gap-4">
          <div className="flex gap-6 flex-wrap justify-center">
            <a href="#" className="text-xs text-[#805030] hover:text-[#9e3c00] opacity-80 hover:opacity-100 transition-all">Privacy Policy</a>
            <a href="#" className="text-xs text-[#805030] hover:text-[#9e3c00] opacity-80 hover:opacity-100 transition-all">Terms of Service</a>
            <a href="#" className="text-xs text-[#805030] hover:text-[#9e3c00] opacity-80 hover:opacity-100 transition-all">Shipping Info</a>
            <a href="#" className="text-xs text-[#805030] hover:text-[#9e3c00] opacity-80 hover:opacity-100 transition-all">Returns</a>
          </div>
          <p className="text-xs text-[#805030] opacity-80">© 2024 Kinetic Curator Marketplace. All payments secured with 256-bit encryption.</p>
        </div>
      </footer>
    </div>
  )
}

export default ResetPasswordPage
