import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate()
  const { forgotPassword } = useAuth()
  const [identifier, setIdentifier] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await forgotPassword(identifier)
      const toast = document.getElementById('toast')
      if (toast) {
        toast.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none')
        setTimeout(() => toast.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none'), 3000)
      }
      if (res.reset_token) {
        setTimeout(() => navigate(`/reset-password?token=${res.reset_token}`), 2000)
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fff4f0] text-[#4a2507] flex flex-col">
      <header className="w-full flex justify-between items-center px-6 py-4 sticky top-0 z-50 backdrop-blur-xl bg-[#fff4f0]/80">
        <div className="text-xl font-black text-[#9e3c00] tracking-tighter">The Kinetic Curator</div>
        <div className="flex items-center gap-4">
          <a href="#" className="text-[#805030] hover:text-[#9e3c00] transition-colors duration-200">
            <span className="material-symbols-outlined">help</span>
          </a>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="relative">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#ff7936]/10 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#c6d0ff]/20 rounded-full blur-3xl -z-10" />

            <div className="bg-white rounded-xl p-8 shadow-2xl shadow-[#4a2507]/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#ffd4bb]">
                <div className="h-full bg-[#9e3c00] w-1/3" />
              </div>

              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#ffede4] text-[#9e3c00] mb-4">
                  <span className="material-symbols-outlined text-3xl">lock_reset</span>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-[#4a2507] mb-2">Forgot Password?</h1>
                <p className="text-[#805030] leading-relaxed">
                  No worries. Enter the email or phone number associated with your account and we'll send a secure link to reset your credentials.
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#805030] block ml-1" htmlFor="recovery-identifier">
                    Email or Phone Number
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#805030] group-focus-within:text-[#9e3c00] transition-colors">
                      <span className="material-symbols-outlined text-xl">alternate_email</span>
                    </div>
                    <input
                      id="recovery-identifier"
                      type="text"
                      value={identifier}
                      onChange={e => setIdentifier(e.target.value)}
                      placeholder="curator@example.com"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-[#ffd4bb] border-0 rounded-full text-[#4a2507] placeholder:text-[#805030]/50 focus:bg-white focus:ring-2 focus:ring-[#004be3] transition-all duration-300 outline-none"
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-red-600 text-sm font-medium text-center bg-red-50 px-4 py-3 rounded-full">{error}</div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#9e3c00] to-[#ff7936] text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 transform transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-lg shadow-[#9e3c00]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="material-symbols-outlined animate-spin">refresh</span>
                  ) : (
                    <>
                      <span>Send Recovery Link</span>
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-10 flex flex-col items-center gap-4">
                <Link to="/login" className="text-sm font-semibold text-[#004be3] hover:text-[#0041c8] transition-colors flex items-center gap-1 group">
                  <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
                  Back to Sign In
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-[#ffede4] rounded-lg">
              <span className="material-symbols-outlined text-[#9e3c00]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              <span className="text-[10px] font-bold uppercase tracking-tight text-[#805030]">256-bit Encryption</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-[#ffede4] rounded-lg">
              <span className="material-symbols-outlined text-[#004be3]" style={{ fontVariationSettings: "'FILL' 1" }}>support_agent</span>
              <span className="text-[10px] font-bold uppercase tracking-tight text-[#805030]">24/7 Support</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full flex flex-col items-center gap-4 py-8 mt-auto">
        <div className="flex gap-6">
          <a href="#" className="text-xs text-[#805030] hover:text-[#9e3c00] transition-colors">Privacy Policy</a>
          <a href="#" className="text-xs text-[#805030] hover:text-[#9e3c00] transition-colors">Terms of Service</a>
          <a href="#" className="text-xs text-[#805030] hover:text-[#9e3c00] transition-colors">Contact Support</a>
        </div>
        <p className="text-[10px] text-[#805030] opacity-60">© 2024 Kinetic Curator Marketplace. All rights reserved.</p>
      </footer>

      <div id="toast" className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#4a2507] text-[#fff4f0] px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl opacity-0 translate-y-4 pointer-events-none transition-all duration-500 z-[100]">
        <span className="material-symbols-outlined text-[#ff7936]">check_circle</span>
        <span className="text-sm font-medium">Reset link sent to your inbox!</span>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
