import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../services/api'

const countries = [
  { code: 'US', flag: '🇺🇸', name: 'United States', dial: '+1' },
  { code: 'GB', flag: '🇬🇧', name: 'United Kingdom', dial: '+44' },
  { code: 'FR', flag: '🇫🇷', name: 'France', dial: '+33' },
  { code: 'DE', flag: '🇩🇪', name: 'Germany', dial: '+49' },
  { code: 'CN', flag: '🇨🇳', name: 'China', dial: '+86' },
  { code: 'AE', flag: '🇦🇪', name: 'UAE', dial: '+971' },
]

const PhoneSignupPage: React.FC = () => {
  const navigate = useNavigate()
  const [selectedCountry, setSelectedCountry] = useState(countries[0])
  const [showCountries, setShowCountries] = useState(false)
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      const fullPhone = `${selectedCountry.dial}${phone.replace(/\s/g, '')}`
      await api.sendOtp(fullPhone)
      const toast = document.getElementById('toast')
      if (toast) {
        toast.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none')
        setTimeout(() => {
          toast.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none')
        }, 3000)
      }
      setTimeout(() => navigate(`/verify?phone=${encodeURIComponent(fullPhone)}`), 1000)
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fff4f0] text-[#4a2507] overflow-x-hidden">
      <main className="min-h-screen flex flex-col lg:flex-row">
        <section className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-[#ffe3d3]">
          <div className="absolute inset-0 z-0">
            <img loading="lazy" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB075CAG9gp2h2N4240IHokJgFhoWAMSdj9KOOJgSN7o4naIwbpSnCFn9CMy3RTl2R3631l-UeVVM-QjlIDLWaFm3-iyC0vA4zVoAwYEGh4BV7x4XRrhjYXY7yf68WWeWWkEZYtppEAqJKm15VskqzVFQinE-N-TKU_GE0iFFTS6sHxcz3Iweh8c71DklwPAZbVaX685ERWEvZ5m8ws8PjudXHuGuTiHA2e8ccFWv5-1zLkogPhqhidwFbcDhDfbqds1l_9CC1Rm3n8" alt="" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#9e3c00]/60 to-transparent flex flex-col justify-end p-16">
            <div className="max-w-md">
              <h1 className="text-[#fff4f0] font-black tracking-tighter leading-tight mb-4 text-5xl">
                Curated Precision, Delivered Daily.
              </h1>
              <p className="text-[#fff4f0]/90 text-lg font-medium leading-relaxed">
                Join our kinetic marketplace. Access limited drops and premium textiles sourced from global artisans.
              </p>
            </div>
          </div>
          <div className="absolute top-12 left-12">
            <span className="text-2xl font-black text-[#fff4f0] tracking-tighter">The Kinetic Curator</span>
          </div>
        </section>

        <section className="flex-1 flex flex-col bg-[#fff4f0] p-6 md:p-12 lg:p-24 justify-center items-center">
          <div className="w-full max-w-md">
            <div className="lg:hidden mb-12 flex justify-between items-center">
              <span className="text-xl font-black text-[#9e3c00] tracking-tighter">The Kinetic Curator</span>
              <a href="/login" className="text-[#004be3] font-semibold text-sm">Sign In</a>
            </div>

            <div className="space-y-2 mb-10">
              <h2 className="text-3xl font-extrabold tracking-tight text-[#4a2507]">Create your account</h2>
              <p className="text-[#805030] font-medium">Join our community of tactile enthusiasts.</p>
            </div>

            <form className="space-y-8" onSubmit={e => { e.preventDefault(); handleSubmit() }}>
              <div className="space-y-3">
                <label className="block text-sm font-bold text-[#805030] tracking-wide">PHONE NUMBER</label>
                <div className="flex gap-2 h-14">
                  <div className="relative w-32 shrink-0 h-full group">
                    <button
                      type="button"
                      onClick={() => setShowCountries(!showCountries)}
                      className="w-full h-full flex items-center justify-between px-4 bg-[#ffd4bb] rounded-xl text-[#4a2507] hover:bg-[#ffdcc7] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{selectedCountry.flag}</span>
                        <span className="font-bold">{selectedCountry.dial}</span>
                      </div>
                      <span className="material-symbols-outlined text-sm">expand_more</span>
                    </button>
                    {showCountries && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowCountries(false)} />
                        <div className="absolute top-full mt-2 left-0 w-64 bg-[#fff4f0]/80 backdrop-blur-xl rounded-xl shadow-2xl z-20 border border-[#dca079]/10">
                          <div className="p-2 space-y-1">
                            {countries.map(c => (
                              <button
                                key={c.code}
                                type="button"
                                onClick={() => { setSelectedCountry(c); setShowCountries(false) }}
                                className="flex items-center gap-3 p-3 w-full hover:bg-[#ffede4] rounded-lg cursor-pointer text-left"
                              >
                                <span className="text-xl">{c.flag}</span>
                                <span className="text-sm font-semibold flex-1">{c.name}</span>
                                <span className="text-sm text-[#805030]">{c.dial}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex-1 relative h-full">
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="000 000 0000"
                      className="w-full h-full bg-[#ffd4bb] border-none rounded-xl px-4 text-lg font-bold text-[#4a2507] placeholder:text-[#805030]/40 focus:ring-2 focus:ring-[#004be3]/20 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              {error && <p className="text-[#b9002c] text-sm font-bold text-center">{error}</p>}

              <div className="bg-[#ffede4] rounded-xl p-5 flex gap-4 items-start">
                <div className="bg-[#9e3c00]/10 p-2 rounded-lg">
                  <span className="material-symbols-outlined text-[#9e3c00]">sms</span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-[#4a2507]">We'll send a secure code</p>
                  <p className="text-xs text-[#805030] leading-relaxed">By signing up, you'll receive a 6-digit verification code via SMS. Standard messaging and data rates may apply.</p>
                </div>
              </div>

              <div className="space-y-4">
                <button type="submit" disabled={loading} className="w-full h-14 bg-gradient-to-r from-[#9e3c00] to-[#ff7936] text-white font-black rounded-full shadow-lg shadow-[#9e3c00]/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2 disabled:opacity-60">
                  {loading ? (
                    <><span className="material-symbols-outlined animate-spin">refresh</span> Sending...</>
                  ) : (
                    <><span>Get Verification Code</span><span className="material-symbols-outlined">arrow_forward</span></>
                  )}
                </button>

                <div className="flex items-center gap-4 py-2">
                  <div className="h-[1px] flex-1 bg-[#ffd4bb]" />
                  <span className="text-xs font-bold text-[#805030] tracking-widest">OR</span>
                  <div className="h-[1px] flex-1 bg-[#ffd4bb]" />
                </div>

                <button type="button" className="w-full h-14 bg-white border border-[#dca079]/20 text-[#4a2507] font-bold rounded-full hover:bg-[#ffd4bb] transition-colors flex items-center justify-center gap-3">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span>Sign up with Google</span>
                </button>
              </div>
            </form>

            <footer className="mt-12 text-center">
              <p className="text-sm text-[#805030] font-medium">
                Already have an account?{' '}
                <a href="/login" className="text-[#004be3] font-bold hover:underline">Sign in</a>
              </p>
              <div className="mt-12 flex justify-center gap-6">
                <a href="#" className="text-[10px] uppercase font-black tracking-widest text-[#805030] hover:text-[#9e3c00] transition-colors">Privacy Policy</a>
                <a href="#" className="text-[10px] uppercase font-black tracking-widest text-[#805030] hover:text-[#9e3c00] transition-colors">Terms of Service</a>
              </div>
            </footer>
          </div>
        </section>
      </main>

      <div id="toast" className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#fff4f0]/80 backdrop-blur-xl px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 opacity-0 pointer-events-none translate-y-4 transition-all duration-500 z-50">
        <div className="w-8 h-8 rounded-full bg-[#004be3] flex items-center justify-center text-white">
          <span className="material-symbols-outlined text-lg">check</span>
        </div>
        <span className="font-bold text-[#4a2507]">Code sent! Please check your messages.</span>
      </div>
    </div>
  )
}

export default PhoneSignupPage
