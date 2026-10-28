export const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
export const GOOGLE_OAUTH_STATE_KEY = 'hobags_oauth_state'
export const GOOGLE_OAUTH_VERIFIER_KEY = 'hobags_oauth_verifier'
export const GOOGLE_OAUTH_REDIRECT_KEY = 'hobags_oauth_redirect_uri'

export function base64UrlEncode(bytes: Uint8Array): string {
  let bin = ''
  bytes.forEach(b => { bin += String.fromCharCode(b) })
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function generateCodeVerifier(): string {
  const bytes = new Uint8Array(64)
  crypto.getRandomValues(bytes)
  return base64UrlEncode(bytes)
}

export async function generateCodeChallenge(verifier: string): Promise<string> {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))
  return base64UrlEncode(new Uint8Array(hash))
}

export function generateState(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return base64UrlEncode(bytes)
}