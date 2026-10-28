import React, { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { sanitize } from '../../utils/sanitize'
import { api } from '../../services/api'
import {
  GOOGLE_AUTH_URL,
  GOOGLE_OAUTH_STATE_KEY,
  GOOGLE_OAUTH_VERIFIER_KEY,
  GOOGLE_OAUTH_REDIRECT_KEY,
  generateCodeChallenge,
  generateCodeVerifier,
  generateState,
} from '../../services/oauth'

declare global {
  interface Window {
    AppleID?: {
      auth: {
        init: (config: {
          clientId: string
          scope: string
          redirectURI: string
          usePopup: boolean
        }) => void
        signIn: () => Promise<{ authorization: { id_token: string } }>
      }
    }
  }
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { login, loading, loginAttempts, lockoutTime, isLoggedIn } = useAuth()
  const [oauthLoading, setOauthLoading] = useState<'google' | null>(null)

  useEffect(() => {
    if (isLoggedIn) navigate('/', { replace: true })
  }, [isLoggedIn, navigate])

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [keepLoggedIn, setKeepLoggedIn] = useState(false)
  const [error, setError] = useState('')
  const [lockoutCountdown, setLockoutCountdown] = useState(0)

  useEffect(() => {
    if (!lockoutTime) { setLockoutCountdown(0); return }
    const update = () => {
      const remaining = Math.max(0, Math.ceil((lockoutTime - Date.now()) / 1000))
      setLockoutCountdown(remaining)
      if (remaining <= 0) setLockoutCountdown(0)
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [lockoutTime])

  const handleGoogleLogin = useCallback(async () => {
    setOauthLoading('google')
    setError('')
    try {
      const config = await api.googleConfig()
      const redirectUri = config.allowedRedirectUris.find(u => {
        const url = new URL(u)
        return url.host === window.location.host && url.pathname === '/auth/google/callback'
      })
      if (!redirectUri) {
        setError('Google login is not configured for this domain. Check the allowedRedirectUris on the server.')
        setOauthLoading(null)
        return
      }
      const verifier = generateCodeVerifier()
      const challenge = await generateCodeChallenge(verifier)
      const state = generateState()
      sessionStorage.setItem(GOOGLE_OAUTH_STATE_KEY, state)
      sessionStorage.setItem(GOOGLE_OAUTH_VERIFIER_KEY, verifier)
      sessionStorage.setItem(GOOGLE_OAUTH_REDIRECT_KEY, redirectUri)
      const params = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'openid email profile',
        state,
        code_challenge: challenge,
        code_challenge_method: 'S256',
        prompt: 'select_account',
      })
      window.location.href = `${GOOGLE_AUTH_URL}?${params.toString()}`
    } catch (err: any) {
      setOauthLoading(null)
      setError(err.message || 'Google login setup failed')
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await login(sanitize(email), password)
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'Invalid email or password')
    }
  }

  return (
    <div className="min-h-screen bg-[#fff4f0] text-[#4a2507] font-['Inter']">
      <main className="flex min-h-screen">
        <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#4a2507]">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#4a2507]/80 via-transparent to-transparent" />
          <img loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10000ms] hover:scale-110"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCo3ebnQw3d1879_Ga2Z5IPkvAA8Ec64MMSk2YbzNU5-AcCe0HyXu5bwB6wu72w5G6rxsqcUs-w2Vek8-dEfsEe5v6QcXx73F1eW5rXeK92MiZfcCgmF3r_u8D9sktQRpvze6cd-n0BnYwiDiExP8r6UUTBk1uCqDSMEf09sCyqzRlZ6e7jUw6lJCULm4Gfjf6NEU18901953T4UkTJUvxeSVF8AKdEwp58Jh9ark1PA0hv0SaidV9HV2P_509eIlGAPEoAJQ40nRHt"
            alt=""
          />
          <div className="relative z-20 flex flex-col justify-end p-16 w-full h-full">
            <span className="text-[#ff7936] font-black text-4xl tracking-tighter mb-6">The Kinetic Curator</span>
            <h2 className="text-[#fff4f0] text-5xl font-bold tracking-tight max-w-md leading-tight">
              Where Motion Meets <span className="text-[#ff7936]">Excellence.</span>
            </h2>
            <p className="mt-4 text-[#ffdcc7] text-lg max-w-sm font-medium leading-relaxed">
              Access the world's most dynamic collection of curated essentials. Your journey starts here.
            </p>
          </div>
        </section>

        <section className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#fff4f0]">
          <div className="w-full max-w-md space-y-8">
            <header className="text-left">
              <div className="lg:hidden mb-8">
                <span className="text-[#9e3c00] font-black text-2xl tracking-tighter">The Kinetic Curator</span>
              </div>
              <h1 className="text-[#4a2507] text-3xl font-extrabold tracking-tight">Welcome Back</h1>
              <p className="text-[#805030] mt-2 font-medium">Please enter your credentials to access your account.</p>
            </header>

            <div className="grid grid-cols-1">
              <button
                onClick={handleGoogleLogin}
                disabled={oauthLoading !== null}
                className="flex items-center justify-center gap-3 px-4 py-3 bg-white text-[#4a2507] border border-[#dca079]/20 rounded-xl hover:bg-[#ffd4bb] transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
              >
                {oauthLoading === 'google' ? (
                  <span className="material-symbols-outlined animate-spin text-lg">refresh</span>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                )}
                <span className="text-sm font-semibold">{oauthLoading === 'google' ? 'Signing In...' : 'Google'}</span>
              </button>
            </div>

            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-[#dca079]/20" />
              <span className="flex-shrink mx-4 text-[#805030] text-xs uppercase tracking-widest">or continue with email</span>
              <div className="flex-grow border-t border-[#dca079]/20" />
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label className="block text-[#4a2507] text-xs font-bold uppercase tracking-wider ml-1" htmlFor="email">Email Address</label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="curator@kinetic.com"
                    className="w-full px-5 py-4 bg-[#ffede4] border-none rounded-xl text-[#4a2507] placeholder:text-[#805030]/50 focus:bg-white focus:ring-2 focus:ring-[#004be3] transition-all duration-300"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#805030]/40">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center ml-1">
                  <label className="block text-[#4a2507] text-xs font-bold uppercase tracking-wider" htmlFor="password">Password</label>
                  <Link to="/forgot-password" className="text-[#004be3] text-xs font-bold hover:text-[#9e3c00] transition-colors">Forgot Password?</Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-5 py-4 bg-[#ffede4] border-none rounded-xl text-[#4a2507] placeholder:text-[#805030]/50 focus:bg-white focus:ring-2 focus:ring-[#004be3] transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#805030]/40 hover:text-[#9e3c00] transition-colors"
                  >
                    <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <label className="relative flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={keepLoggedIn}
                    onChange={e => setKeepLoggedIn(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 bg-[#ffdcc7] rounded border-none peer-checked:bg-[#004be3] flex items-center justify-center transition-all duration-200">
                    <span className="material-symbols-outlined text-white text-[16px] hidden peer-checked:block">check</span>
                  </div>
                  <span className="ml-3 text-[#805030] text-sm font-medium">Keep me logged in</span>
                </label>
              </div>

              {lockoutCountdown > 0 && (
                <div className="flex items-center gap-2 p-3 bg-[#b9002c]/10 rounded-xl border border-[#b9002c]/20">
                  <span className="material-symbols-outlined text-[#b9002c] text-lg">lock</span>
                  <p className="text-[#b9002c] text-xs font-bold flex-1">Account locked. Try again in {lockoutCountdown}s</p>
                  <div className="w-8 h-8 rounded-full bg-[#b9002c]/10 flex items-center justify-center">
                    <span className="text-[#b9002c] text-sm font-black">{lockoutCountdown}</span>
                  </div>
                </div>
              )}
              {error && !lockoutCountdown && <p className="text-[#b9002c] text-sm font-bold text-center">{error}</p>}
              {loginAttempts > 0 && !lockoutCountdown && (
                <p className="text-[#ff7936] text-xs font-bold text-center">{5 - loginAttempts} attempt(s) remaining before lockout</p>
              )}
              <button
                type="submit"
                disabled={loading || lockoutCountdown > 0}
                className="w-full bg-gradient-to-r from-[#9e3c00] to-[#ff7936] text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-[#9e3c00]/20 hover:shadow-[#9e3c00]/40 active:scale-[0.98] transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><span className="material-symbols-outlined animate-spin">refresh</span> Signing In...</>
                ) : (
                  'Sign In to Curator'
                )}
              </button>
            </form>

            <footer className="pt-6 text-center">
              <p className="text-[#805030] font-medium">
                New to the marketplace?{' '}
                <Link to="/signup" className="text-[#004be3] font-bold hover:underline transition-all">Create an account</Link>
              </p>
            </footer>
          </div>
        </section>
      </main>
    </div>
  )
}

export default LoginPage
