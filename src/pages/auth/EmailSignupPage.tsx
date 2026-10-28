import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../../services/api'
import { sanitize } from '../../utils/sanitize'
import { savePendingSignup } from '../../services/emailPolicy'

type Field = 'fullName' | 'email' | 'password' | 'confirmPassword'

const EmailSignupPage: React.FC = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' })
  const [showPassword] = useState(false)
  const [showConfirm] = useState(false)
  const [touched, setTouched] = useState<Record<Field, boolean>>({ fullName: false, email: false, password: false, confirmPassword: false })
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const [agreedError, setAgreedError] = useState('')

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  const markTouched = (field: Field) => () => setTouched(t => ({ ...t, [field]: true }))

  const fieldError = (field: Field): string => {
    if (!touched[field]) return ''
    switch (field) {
      case 'fullName':
        if (!form.fullName.trim()) return 'Please enter your name'
        if (form.fullName.trim().length < 2) return 'Name must be at least 2 characters'
        return ''
      case 'email':
        if (!form.email.trim()) return 'Please enter your email address'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return 'Please enter a valid email address'
        return ''
      case 'password':
        if (!form.password) return 'Please create a password'
        if (form.password.length < 8) return 'Password must be at least 8 characters'
        return ''
      case 'confirmPassword':
        if (!form.confirmPassword) return 'Please confirm your password'
        if (form.confirmPassword !== form.password) return 'Passwords do not match'
        return ''
      default:
        return ''
    }
  }

  const passwordStrength = (() => {
    const val = form.password
    let s = 0
    if (val.length > 5) s++
    if (val.length > 8) s++
    if (/[A-Z]/.test(val) && /[0-9]/.test(val)) s++
    if (/[^A-Za-z0-9]/.test(val)) s++
    return s
  })()

  const strengthLabels = ['N/A', 'Weak', 'Moderate', 'Strong', 'Professional Grade']
  const strengthColors = ['#805030', '#b31b25', '#9e3c00', '#9e3c00', '#004be3']
  const meterColors = ['#ffdcc7', '#fb5151', '#ff9193', '#ff7936', '#004be3']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError('')
    setAgreedError('')
    setTouched({ fullName: true, email: true, password: true, confirmPassword: true })

    const fields: Field[] = ['fullName', 'email', 'password', 'confirmPassword']
    const anyInvalid = fields.some(f => fieldError(f))
    if (anyInvalid) return
    if (!agreed) {
      setAgreedError('Please agree to the Terms of Service and Privacy Policy')
      return
    }

    setLoading(true)
    try {
      const email = sanitize(form.email)
      const res = await api.emailRequestCode(email)
      savePendingSignup({ name: sanitize(form.fullName), email, password: form.password, role: 'buyer' }, res.code)
      navigate('/signup/email/verify')
    } catch (err: any) {
      setServerError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fff4f0] text-[#4a2507] flex flex-col">
      <main className="flex-grow flex items-center justify-center lg:p-12 p-4">
        <div className="max-w-6xl w-full flex flex-col lg:flex-row bg-white overflow-hidden rounded-xl shadow-2xl shadow-[#4a2507]/5 min-h-[700px]">
          <div className="lg:w-1/2 relative hidden lg:block overflow-hidden">
            <img loading="lazy" className="absolute inset-0 w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPZs_i3WltPQFvm-RDNzos63DyTT4BLnN0PO4l9KbXgwyFt5gpTyeTpKuCcUR7aqHi5-HFf3vEcA90oZrSFiP9lLs2GSlpDdxAzaDbMFFk8tgvvza1i8X8EncMmBv1IaOvsfpLmR4APR_glXl3c8vL4c8_IUkjB5SnGXSjWiweFdc0FmxKM8rOzF4u7-2sAJOTvqLiktiQAWeMRMg8plqQd5bCnsob5aKxybHpDuaFxSZMoS6cjrkgL71O0FpuYL34tyIqf5295ixu" alt="" />
            <div className="absolute inset-0 bg-[#9e3c00]/20 mix-blend-multiply" />
            <div className="absolute bottom-12 left-12 right-12 bg-[#fff4f0]/80 backdrop-blur-xl p-8 rounded-lg border border-white/20">
              <h2 className="text-3xl font-black tracking-tighter text-[#4a2507] mb-4">The Kinetic Curator</h2>
              <p className="text-[#805030] font-medium leading-relaxed">
                Join a global marketplace defined by surgically precise design and energetic curation. Access exclusive collections and velocity-driven retail experiences.
              </p>
              <div className="mt-6 flex gap-4">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-[#9e3c00]">12k+</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#805030]">Active Curators</span>
                </div>
                <div className="w-px h-10 bg-[#dca079]/30" />
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-[#9e3c00]">850</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#805030]">Global Brands</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 w-full p-8 lg:p-16 flex flex-col justify-center bg-white">
            <div className="mb-10">
              <h1 className="text-4xl font-extrabold tracking-tight text-[#4a2507] mb-2">Create Account</h1>
              <p className="text-[#805030] font-medium">Start your journey into the curated marketplace.</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-[#805030]" htmlFor="fullName">Full Name</label>
                <div className="relative group">
                  <input id="fullName" type="text" value={form.fullName} onChange={update('fullName')} onBlur={markTouched('fullName')} placeholder="Alexander Curator" className="w-full bg-[#ffede4] border-none rounded-full py-3.5 px-6 text-[#4a2507] placeholder:text-[#dca079]/60 focus:ring-2 focus:ring-[#004be3]/20 focus:bg-white transition-all" />
                  <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-[#dca079] group-focus-within:text-[#004be3] text-lg">person</span>
                </div>
                {fieldError('fullName') && <p className="px-2 text-xs font-bold text-[#b9002c]">{fieldError('fullName')}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-[#805030]" htmlFor="email">Email Address</label>
                <div className="relative group">
                  <input id="email" type="email" value={form.email} onChange={update('email')} onBlur={markTouched('email')} placeholder="alexander@gmail.com" className="w-full bg-[#ffede4] border-none rounded-full py-3.5 px-6 text-[#4a2507] placeholder:text-[#dca079]/60 focus:ring-2 focus:ring-[#004be3]/20 focus:bg-white transition-all" />
                  <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-[#dca079] group-focus-within:text-[#004be3] text-lg">mail</span>
                </div>
                {fieldError('email') && <p className="px-2 text-xs font-bold text-[#b9002c]">{fieldError('email')}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#805030]" htmlFor="password">Password</label>
                  <div className="relative group">
                    <input id="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={update('password')} onBlur={markTouched('password')} placeholder="••••••••" className="w-full bg-[#ffede4] border-none rounded-full py-3.5 px-6 text-[#4a2507] placeholder:text-[#dca079]/60 focus:ring-2 focus:ring-[#004be3]/20 focus:bg-white transition-all" />
                    <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-[#dca079] group-focus-within:text-[#004be3] text-lg">lock</span>
                  </div>
                  {fieldError('password') && <p className="px-2 text-xs font-bold text-[#b9002c]">{fieldError('password')}</p>}
                  <div className="mt-2 flex items-center gap-1.5 px-2">
                    {[0, 1, 2, 3].map(i => (
                      <div key={i} className="h-1 flex-1 rounded-full transition-colors" style={{ backgroundColor: form.password ? (i < passwordStrength ? meterColors[passwordStrength] : '#ffdcc7') : '#ffdcc7' }} />
                    ))}
                  </div>
                  <p className="text-[10px] font-bold px-2" style={{ color: form.password ? strengthColors[passwordStrength] : '#805030' }}>
                    Security: {form.password ? strengthLabels[passwordStrength] : 'N/A'}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#805030]" htmlFor="confirmPassword">Confirm Password</label>
                  <div className="relative group">
                    <input id="confirmPassword" type={showConfirm ? 'text' : 'password'} value={form.confirmPassword} onChange={update('confirmPassword')} onBlur={markTouched('confirmPassword')} placeholder="••••••••" className="w-full bg-[#ffede4] border-none rounded-full py-3.5 px-6 text-[#4a2507] placeholder:text-[#dca079]/60 focus:ring-2 focus:ring-[#004be3]/20 focus:bg-white transition-all" />
                    <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-[#dca079] group-focus-within:text-[#004be3] text-lg">verified_user</span>
                  </div>
                  {fieldError('confirmPassword') && <p className="px-2 text-xs font-bold text-[#b9002c]">{fieldError('confirmPassword')}</p>}
                </div>
              </div>

              <div className="flex items-start gap-3 py-2">
                <div className="relative flex items-center">
                  <input id="terms" type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="w-5 h-5 rounded border-[#dca079] text-[#004be3] focus:ring-[#004be3]/20 bg-[#ffede4] transition-all" />
                </div>
                <label className="text-sm text-[#805030] leading-tight" htmlFor="terms">
                  I agree to the <a href="#" className="text-[#004be3] font-bold hover:underline decoration-2">Terms of Service</a> and <a href="#" className="text-[#004be3] font-bold hover:underline decoration-2">Privacy Policy</a>.
                </label>
              {agreedError && <p className="text-xs font-bold text-[#b9002c] ml-8">{agreedError}</p>}
              </div>

              {serverError && <p className="text-[#b9002c] text-sm font-bold text-center">{serverError}</p>}
              <div className="pt-4 flex flex-col gap-4">
                <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-[#9e3c00] to-[#ff7936] text-white font-bold text-lg rounded-full shadow-xl shadow-[#9e3c00]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                  {loading ? (
                    <><span className="material-symbols-outlined animate-spin">refresh</span> Sending Verification...</>
                  ) : (
                    <><span>Send 6-Digit Code</span><span className="material-symbols-outlined">mail</span></>
                  )}
                </button>
                <p className="text-center text-sm font-medium text-[#805030]">
                  Already a curator?{' '}
                  <Link to="/login" className="text-[#9e3c00] font-bold hover:underline">Log in here</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>

      <footer className="w-full py-8 bg-[#ffede4] flex flex-col items-center gap-4">
        <div className="flex gap-8">
          <a href="#" className="text-xs text-[#805030] font-medium hover:text-[#9e3c00] transition-colors">Privacy Policy</a>
          <a href="#" className="text-xs text-[#805030] font-medium hover:text-[#9e3c00] transition-colors">Terms of Service</a>
          <a href="#" className="text-xs text-[#805030] font-medium hover:text-[#9e3c00] transition-colors">Shipping Info</a>
          <a href="#" className="text-xs text-[#805030] font-medium hover:text-[#9e3c00] transition-colors">Returns</a>
        </div>
        <p className="text-[10px] text-[#805030] font-bold tracking-widest opacity-60">© 2024 KINETIC CURATOR MARKETPLACE. ENCRYPTED TRANSACTION.</p>
      </footer>
    </div>
  )
}

export default EmailSignupPage
