import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { api, setToken } from '../../services/api'

const OtpVerificationPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const phone = searchParams.get('phone') || ''
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(59)
  const [resendDisabled, setResendDisabled] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

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
    if (!allFilled || !phone) return
    setError('')
    setLoading(true)
    try {
      const code = otp.join('')
      const res = await api.verifyOtp(phone, code)
      setToken(res.token)
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'Invalid verification code')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = useCallback(async () => {
    setResendDisabled(true)
    setTimer(59)
    setOtp(['', '', '', '', '', ''])
    setError('')
    inputRefs.current[0]?.focus()
    try {
      await api.sendOtp(phone)
    } catch (err: any) {
      setError(err.message || 'Failed to resend code')
    }
  }, [phone])

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
              <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-white mb-4">Securing Your Curation</h1>
            <p className="text-lg text-[#ffd4bb] font-medium max-w-md leading-relaxed opacity-90">
              We've sent a unique 6-digit code to your registered device. Enter it to confirm your identity and access your bespoke marketplace experience.
            </p>
            <div className="mt-12 flex gap-4">
              <div className="h-1 w-12 bg-[#ff7936] rounded-full" />
              <div className="h-1 w-3 bg-[#ffd4bb]/30 rounded-full" />
              <div className="h-1 w-3 bg-[#ffd4bb]/30 rounded-full" />
            </div>
          </div>
        </section>

        <section className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 md:px-12 bg-[#fff4f0]">
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-[#c6d0ff] flex items-center justify-center text-[#004be3] mb-4">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            </div>
            <h2 className="text-2xl font-black tracking-tighter text-[#9e3c00]">The Kinetic Curator</h2>
          </div>
          <div className="w-full max-w-md">
            <div className="mb-10">
              <h2 className="text-3xl font-extrabold text-[#4a2507] tracking-tight">Security Check</h2>
              <p className="text-[#805030] mt-2 font-medium">
                Please enter the authentication code sent to{' '}
                <span className="text-[#4a2507] font-bold">{phone}</span>.
              </p>
            </div>

            <div className="flex gap-2 sm:gap-3 mb-10">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => { inputRefs.current[index] = el }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(index, e.target.value)}
                  onKeyDown={e => handleKeyDown(index, e)}
                  className="otp-input w-full aspect-square text-center text-2xl font-bold bg-white border-0 rounded-xl text-[#9e3c00] ring-1 ring-[#dca079]/30 focus:ring-2 focus:ring-[#004be3] transition-all outline-none"
                />
              ))}
            </div>

            {error && <p className="text-[#b9002c] text-sm font-bold text-center mb-4">{error}</p>}

            <div className="space-y-4">
              <button
                id="verify-btn"
                onClick={handleVerify}
                disabled={loading || !allFilled}
                className="w-full py-4 bg-gradient-to-r from-[#9e3c00] to-[#ff7936] text-white font-bold rounded-xl shadow-lg shadow-[#9e3c00]/20 hover:shadow-[#9e3c00]/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-60"
              >
                {loading ? (
                  <><span className="material-symbols-outlined animate-spin">refresh</span> Verifying...</>
                ) : (
                  <><span>Verify & Continue</span><span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span></>
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
            </div>

            <div className="mt-16 flex items-center gap-4 p-4 rounded-xl bg-[#ffede4]">
              <span className="material-symbols-outlined text-[#9f6b48]">lock</span>
              <p className="text-xs text-[#805030] font-medium leading-tight">
                Your security is our priority. Kinetic Curator uses 256-bit encryption and multi-factor authentication to protect your account.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 w-full p-6 lg:left-1/2 lg:w-1/2 flex justify-center lg:justify-start items-center gap-6">
        <a href="#" className="text-[10px] uppercase tracking-widest font-bold text-[#805030] hover:text-[#9e3c00] transition-colors">Privacy Policy</a>
        <a href="#" className="text-[10px] uppercase tracking-widest font-bold text-[#805030] hover:text-[#9e3c00] transition-colors">Terms of Service</a>
        <a href="#" className="text-[10px] uppercase tracking-widest font-bold text-[#805030] hover:text-[#9e3c00] transition-colors">Support</a>
      </footer>

      <style>{`
        .otp-input:focus { box-shadow: 0 0 0 2px #004be3; border-color: transparent; }
      `}</style>
    </div>
  )
}

export default OtpVerificationPage
