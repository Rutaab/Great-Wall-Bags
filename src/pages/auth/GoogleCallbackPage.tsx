import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  GOOGLE_OAUTH_STATE_KEY,
  GOOGLE_OAUTH_VERIFIER_KEY,
  GOOGLE_OAUTH_REDIRECT_KEY,
} from '../../services/oauth'

const GoogleCallbackPage: React.FC = () => {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { loginWithGoogleCode } = useAuth()
  const [error, setError] = useState('')
  const doneRef = useRef(false)

  useEffect(() => {
    if (doneRef.current) return

    const oauthError = params.get('error')
    if (oauthError) {
      setError(`Google login failed: ${oauthError.replace(/_/g, ' ')}`)
      return
    }

    const code = params.get('code')
    const state = params.get('state')
    const storedState = sessionStorage.getItem(GOOGLE_OAUTH_STATE_KEY)
    const verifier = sessionStorage.getItem(GOOGLE_OAUTH_VERIFIER_KEY)
    const redirectUri = sessionStorage.getItem(GOOGLE_OAUTH_REDIRECT_KEY)
    sessionStorage.removeItem(GOOGLE_OAUTH_STATE_KEY)
    sessionStorage.removeItem(GOOGLE_OAUTH_VERIFIER_KEY)
    sessionStorage.removeItem(GOOGLE_OAUTH_REDIRECT_KEY)

    if (!code || !state || !storedState || state !== storedState) {
      setError('Google login failed. Please try again.')
      return
    }
    if (!verifier || !redirectUri) {
      setError('Your sign-in session has expired. Please try again.')
      return
    }

    doneRef.current = true
    loginWithGoogleCode(code, verifier, redirectUri)
      .then(() => navigate('/', { replace: true }))
      .catch((err: any) => setError(err.message || 'Google login failed'))
  }, [params, loginWithGoogleCode, navigate])

  return (
    <div className="min-h-screen bg-[#fff4f0] text-[#4a2507] font-['Inter'] flex items-center justify-center p-8">
      <div className="w-full max-w-md text-center space-y-6">
        {error ? (
          <>
            <span className="material-symbols-outlined text-[#b9002c] text-5xl">error</span>
            <h1 className="text-2xl font-extrabold tracking-tight">Sign-in Failed</h1>
            <p className="text-[#805030] font-medium">{error}</p>
            <Link
              to="/login"
              className="inline-block bg-gradient-to-r from-[#9e3c00] to-[#ff7936] text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-[#9e3c00]/20 hover:shadow-[#9e3c00]/40 transition-all duration-300"
            >
              Back to Login
            </Link>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-[#ffdcc7] border-t-[#9e3c00] mx-auto" />
            <h1 className="text-2xl font-extrabold tracking-tight">Completing Sign-In</h1>
            <p className="text-[#805030] font-medium">Please wait while we connect your Google account...</p>
          </>
        )}
      </div>
    </div>
  )
}

export default GoogleCallbackPage