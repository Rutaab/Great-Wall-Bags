import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../services/api'
import {
  getPendingSignup,
  getPendingSignupCode,
  savePendingSignup,
  clearPendingSignup,
} from '../../services/emailPolicy'

const EmailVerifyPage: React.FC = () => {
  const navigate = useNavigate()
  const { signupWithCode } = useAuth()
  const pending = getPendingSignup()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(59)
  const [resendDisabled, setResendDisabled] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const devCode = getPendingSignupCode()

  useEffect(() => {
    if (!pending) {
      navigate('/signup/email', { replace: true })
    }
  }, [pending, navigate])

  useEffect(() => {
    if (timer <= 0) {
      setResendDisabled(false)
      return
    }
    const interval = setInterval(() => setTimer(t => t - 1), 1000)
    return () => clearInterval(interval)
  }, [timer])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const allFilled = otp.every(d => d.length === 1)

  const handleVerify = async () => {
    if (!pending || !allFilled) return
    setError('')
    setLoading(true)
    try {
      await signupWithCode(pending.name, pending.email, pending.password, pending.role, otp.join(''))
      clearPendingSignup()
      navigate('/', { replace: true })
    } catch (err: any) {
      setError(err.message || 'Invalid verification code')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = useCallback(async () => {
    if (!pending) return
    setResendDisabled(true)
    setTimer(59)
    setOtp(['', '', '', '', '', ''])
    setError('')
    inputRefs.current[0]?.focus()
    try {
      const res = await api.emailRequestCode(pending.email)
      savePendingSignup(pending, res.code)
    } catch (err: any) {
      setError(err.message || 'Failed to resend code')
    }
  }, [pending])

  if (!pending) {
    return (
      <div className="min-h-screen bg-[#fff4f0] text-[#4a2507] font-['Inter'] flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-extrabold tracking-tight">No sign-up in progress</h1>
          <p className="text-[#805030] font-medium">Please start over to create your account.</p>
          <Link to="/signup/email" className="inline-block bg-gradient-to-r from-[#9e3c00] to-[#ff7936] text-white font-bold py-3 px-8 rounded-xl">Back to Sign Up</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fff4f0] text-[#4a2507] overflow-hidden">
      <main className="flex min-h-screen">
        <section className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center overflow-hidden bg-[#4a2507]">
          <div className="absolute inset-0 z-0">
            <img loading="lazy" className="w-full h-full object-cover opacity-60" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDchxyKT4kQJuuoju7in8AK23TtI06v3Zqzhm2QNlC62TgrB4hPIbNQc5NqMIDb2iWxaMg0jjYhn96qwi4mFeV1uClVl-eMhVHUum2At3J__RhdkV11lf89uvqFgqmCtNBXUlxHEMGSZ5e9oYNvFpKQguj6Geo8lkt-IM_1F6mjDwz95orG2D2aimuU8BI-dZse1bjrnYJuo7D-76DJX8IOg__p5wOJWBAIj25sOqs7ggSIjDVzLwwavZF4WXrx4fX5mOMy32lID8mh" alt="" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-tr from-[#4a2507]/80 via-transparent to-[#9e3c00]/20 z-10" />
          <div className="relative z-20 flex flex-col items-center text-center px-12">
            <div className="mb-8 w-24 h-24 rounded-full bg-[#c6d0ff] flex items-center justify-center text-[#004be3] shadow-2xl scale-110">
              <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>mark_email_read</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-white mb-4">Verify Your Email</h1>
            <p className="text-lg text-[#ffd4bb] font-medium max-w-md leading-relaxed opacity-90">
              We've sent a unique 6-digit code to your inbox. Enter it below to confirm this email belongs to you and unlock your account.
            </p>
            <div className="mt-12 flex gap-4">
              <div className="h-1 w-12 bg-[#ff7936] rounded-full" />
              <div className="h-1 w-3 bg-[#ffd4bb]/30 rounded-full" />
              <div className="h-1 w-3 bg-[#ffd4bb]/30 rounded-full" />
            </div>
          </div>
        </section>

        <section className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 md:px-12 bg-[#fff4f0]">
          <div className="w-full max-w-md">
            <div className="mb-10">
              <h2 className="text-3xl font-extrabold text-[#4a2507] tracking-tight">Email Confirmation</h2>
              <p className="text-[#805030] mt-2 font-medium">
                Enter the 6-digit code sent to{' '}
                <span className="text-[#4a2507] font-bold">{pending.email}</span>.
              </p>
            </div>

            <div className="flex gap-2 sm:gap-3 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => { inputRefs.current[index] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(index, e.target.value)}
                  onKeyDown={e => handleKeyDown(index, e)}
                  className="otp-input w-full aspect-square text-center text-2xl font-bold bg-white border-0 rounded-xl text-[#9e3c00] ring-1 ring-[#dca079]/30 focus:ring-2 focus:ring-[#004be3] transition-all outline-none"
                />
              ))}
            </div>

            {devCode && (
              <p className="mb-4 text-center text-xs font-bold text-[#9e3c00] bg-[#ffede4] rounded-lg px-4 py-2">
                No email is sent in demo mode — your code is: {devCode}
              </p>
            )}

            {error && <p className="text-[#b9002c] text-sm font-bold text-center mb-4">{error}</p>}

            <div className="space-y-4">
              <button
                id="verify-btn"
                onClick={handleVerify}
                disabled={loading || !allFilled}
                className="w-full py-4 bg-gradient-to-r from-[#9e3c00] to-[#ff7936] text-white font-bold rounded-xl shadow-lg shadow-[#9e3c00]/20 hover:shadow-[#9e3c00]/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-60"
              >
                {loading ? (
                  <><span className="material-symbols-outlined animate-spin">refresh</span> Creating Account...</>
                ) : (
                  <><span>Verify & Create Account</span><span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span></>
                )}
              </button>

              <div className="flex items-center justify-between pt-4 border-t border-[#ffede4]">
                <span className="text-sm font-medium text-[#805030]">
                  Resend code in{' '}
                  <span className="text-[#9e3c00] font-bold">
                    {timer > 0 ? `00:${timer < 10 ? '0' + timer : timer}` : '00:00'}
                  </span>
                </span>
                <button
                  onClick={handleResend}
                  disabled={resendDisabled}
                  className={`text-sm font-bold transition-all ${
                    resendDisabled
                      ? 'text-[#805030] opacity-50 cursor-not-allowed'
                      : 'text-[#004be3] hover:text-[#003ab5]'
                  }`}
                >
                  Resend Code
                </button>
              </div>

              <div className="pt-2 text-center">
                <Link to="/signup/email" className="text-sm font-bold text-[#9e3c00] hover:underline">← Change details / start over</Link>
              </div>
            </div>

            <div className="mt-10 flex items-center gap-4 p-4 rounded-xl bg-[#ffede4]">
              <span className="material-symbols-outlined text-[#9f6b48]">verified</span>
<p className="text-xs text-[#805030] font-medium leading-tight">
  Your code expires in 10 minutes. Check your inbox (including spam) for an email from Kinetic Marketplace.
</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 w-full p-6 lg:left-1/2 lg:w-1/2 flex justify-center lg:justify-start items-center gap-6">
        <Link to="/login" className="text-[10px] uppercase tracking-widest font-bold text-[#805030] hover:text-[#9e3c00] transition-colors">Sign In</Link>
        <Link to="/signup" className="text-[10px] uppercase tracking-widest font-bold text-[#805030] hover:text-[#9e3c00] transition-colors">Sign Up</Link>
        <Link to="/" className="text-[10px] uppercase tracking-widest font-bold text-[#805030] hover:text-[#9e3c00] transition-colors">Home</Link>
      </footer>

      <style>{`
        .otp-input:focus { box-shadow: 0 0 0 2px #004be3; border-color: transparent; }
      `}</style>
    </div>
  )
}

export default EmailVerifyPage