# Google Login — OAuth 2.0 Authorization Code + PKCE Setup Guide

This app now uses the **OAuth 2.0 Authorization Code flow with PKCE** (not the old
Google Identity Services popup). Flow:

```
User clicks "Google" on /login
  -> browser redirects to accounts.google.com (consent screen)
  -> Google redirects back to /auth/google/callback?code=...&state=...
  -> SPA POSTs { code, code_verifier, redirect_uri } to /api/auth/google/callback
  -> Express exchanges code + PKCE verifier + client_secret with Google
  -> Express fetches profile from https://www.googleapis.com/oauth2/v3/userinfo
  -> account is created (role: buyer) or an existing account is linked by email
  -> Express returns its JWT -> SPA stores it -> user is logged in
```

The code exchange runs on the **Termux backend** (server-side), so the Google
Client Secret never reaches the browser.

---

## 1. One-time Google Cloud setup (10–15 min)

1. Go to <https://console.cloud.google.com> → create a project (e.g. `hobags`) or
   pick an existing one.
2. In the hamburger menu: **APIs & Services → OAuth consent screen**.
   - User type: **External**.
   - App name: e.g. `HoBags / Kinetic Marketplace`; add your email.
   - Scopes: you don't need to add scopes manually — the app requests
     `openid email profile`.
   - **Test users**: add the Google addresses you will test with
     (e.g. `you@gmail.com`). While status is "Testing", only these accounts can log in.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**:
   - Application type: **Web application**.
   - **Authorized JavaScript origins** (optional but recommended):
     - `http://localhost:5173`
     - `https://localhost:5173`
     - `https://greatwallbags.vercel.app`
   - **Authorized redirect URIs** (REQUIRED — must match EXACTLY):
     - `http://localhost:5173/auth/google/callback`
     - `https://localhost:5173/auth/google/callback`
     - `https://greatwallbags.vercel.app/auth/google/callback`
   - Click **Create**. Copy the **Client ID** and **Client Secret** now (you can
     download the JSON too).

> If you ever add another domain/frontend URL, you must BOTH add it as a redirect
> URI here AND include it in `GOOGLE_REDIRECT_URIS` in `backend/server.js`.

## 2. Configure the backend

Edit `backend/server.js` (top of file):

```js
const GOOGLE_CLIENT_ID = '3456xxxx-yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = 'GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
```

Keep `GOOGLE_REDIRECT_URIS` in sync with the Google Console list above.

Restart the server on the machine/Termux where it runs (Node 18+ is required —
global `fetch` is used; the dev machine has v22).

## 3. Run locally

1. Backend running on `localhost:3002`, frontend on `localhost:5173`.
2. Open <http://localhost:5173/login> or <https://localhost:5173/login> (Vite's
   `basicSsl` plugin serves on HTTPS) → click **Google**.
3. You land on Google's consent screen → pick a test user → allow.
4. You are redirected back, signed in, and taken to the homepage.

Checklist:
- Google login works on `http://localhost:5173`.
- A new user appears in `backend/data/users.json` with a `googleSub` field and
  `role: "buyer"`.
- Logging in again with the same account reuses the same user (linked by `googleSub`).

## 4. Deploy to production (Vercel + Termux backend)

1. Make sure the Termux backend is running the **updated** `server.js`.
2. Redeploy the frontend exactly as in `REDEPLOY_VERCEL.md`:
   - Start Cloudflare tunnel → copy the `https://...trycloudflare.com` URL.
   - Paste it into `vercel.json` (replace the `YOUR-TUNNEL` placeholder).
   - `git push` (or `vercel --prod`).
3. **No extra config needed for the callback.** Google redirects the browser to
   `https://greatwallbags.vercel.app/auth/google/callback` (client-side SPA route,
   handled by the Vercel SPA fallback rewrite), and the SPA then calls
   `/api/auth/google/callback` which Vercel proxies to your tunnel → the Termux server.
4. Test at <https://greatwallbags.vercel.app/login>.

> Your tunnel URL changes each time it restarts. The Google redirect URI does NOT
> include the tunnel address, because the browser never talks to the tunnel —
> it talks to Google and to your Vercel domain. So tunnel restarts do not break login.

## 5. Going live (publish the consent screen)

While the consent screen is in "Testing" mode, only your test users can log in.
To let everyone use Google login, go to **OAuth consent screen → Publish app**
(Google may ask for a verification if the app requests sensitive scopes; the
`openid email profile` scopes used here normally do NOT require verification).

---

## Files involved

| File | Role |
|------|------|
| `backend/server.js` | Google credentials + `GET /api/auth/google/config` + `POST /api/auth/google/callback` (code exchange, profile fetch, user create/link, JWT) |
| `src/services/oauth.ts` | PKCE verifier/challenge, `state`, Google authorize URL |
| `src/services/api.ts` | `googleConfig()` + `googleCallback()` |
| `src/contexts/AuthContext.tsx` | `loginWithGoogleCode(code, verifier, redirect_uri)` |
| `src/pages/auth/LoginPage.tsx` | builds authorize URL, redirects to Google |
| `src/pages/auth/GoogleCallbackPage.tsx` | validates `state`, exchanges code, redirects home |
| `src/AppRoutes.tsx` | route `/auth/google/callback` |

## Troubleshooting

- **`The OAuth client was not found.`** — `GOOGLE_CLIENT_ID` is still the
  placeholder, or doesn't match the credential in the Google project.
- **`redirect_uri_mismatch` / "not configured" error on Google screen** — the
  redirect URI in the URL doesn't exactly match one registered in Google Console.
- **"Sign-in session has expired"** on callback — the `state`/verifier keys were
  absent (page was opened directly, or sessionStorage was cleared mid-flow).
- **"Google login is not configured for this domain"** — you visited a domain not
  in `GOOGLE_REDIRECT_URIS` (e.g. a random preview URL or an unlisted tunnel).
- **Timeout when redeploying** — the tunnel URL changed; update `vercel.json`.