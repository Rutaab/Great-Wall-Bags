require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const app = express();
const PORT = parseInt(process.env.PORT || '3002', 10);
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Secrets come from backend/.env. The defaults are the historical values, kept so
// an existing checkout (and every password hash already in users.json) keeps
// working before anyone configures them. Set real values for any shared deploy.
const JWT_SECRET = process.env.JWT_SECRET || 'hobags_jwt_secret_2024_kinetic';
const PEPPER = process.env.AUTH_PEPPER || 'H0B@g5_S@lt_K!n3t1c_2024';

// --- Google OAuth (Authorization Code + PKCE) ---
// Configure in backend/.env (see GOOGLE_OAUTH_GUIDE.md).
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_REDIRECT_URIS = (process.env.GOOGLE_REDIRECT_URIS || [
  'http://localhost:5173/auth/google/callback',
  'https://localhost:5173/auth/google/callback',
  'https://greatwallbags.vercel.app/auth/google/callback'
].join(',')).split(',').map(u => u.trim()).filter(Boolean);

// Browsers allowed to call this API. Local dev runs over HTTPS on 5173, so the
// https://localhost:5173 origin must be allowed alongside the plain-http one.
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || [
  'http://localhost:5173',
  'https://localhost:5173',
  'http://127.0.0.1:5173',
  'https://127.0.0.1:5173',
  'http://localhost:3000',
  'http://localhost:3001',
  'https://greatwallbags.vercel.app'
].join(',')).split(',').map(o => o.trim()).filter(Boolean);

// --- Email Registration Policy ---
// Only these email providers are permitted to create an account via email signup.
const ALLOWED_EMAIL_DOMAINS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];

function isAllowedEmailDomain(email) {
  const domain = String(email || '').toLowerCase().trim().split('@')[1] || '';
  return ALLOWED_EMAIL_DOMAINS.includes(domain);
}

// --- Role Policy ---
// 'developer' is a single owner account pinned to one email address. Every other
// account is limited to a marketplace role, and 'developer' can never be granted
// from a client request. Identity is decided by the email, never by a role
// string sent by the browser, so a tampered payload cannot escalate an account.
//
// A user's role is ONLY ever written by the developer console at
// /developer/users (PUT /api/admin/users/:id). Accounts cannot change their own
// role, and approving a verification request does not promote anyone - it only
// records the decision. That keeps one writer for `role` in users.json.
const DEVELOPER_EMAIL = 'dev@hobags.com';
const MARKETPLACE_ROLES = ['buyer', 'seller', 'manufacturer', 'supplier'];
const DEVELOPER_CONSOLE_PATH = '/developer/users';

function isDeveloperEmail(email) {
  return String(email || '').toLowerCase().trim() === DEVELOPER_EMAIL;
}

function isMarketplaceRole(role) {
  return MARKETPLACE_ROLES.includes(String(role || '').toLowerCase().trim());
}

// Resolve the authoritative role for an account. Only the owner email resolves to
// 'developer'; every other email is coerced into a marketplace role (unknown or
// 'developer' values fall back to 'buyer') so bad data is never persisted.
function resolveRole(email, requestedRole) {
  if (isDeveloperEmail(email)) return 'developer';
  const role = String(requestedRole || '').toLowerCase().trim();
  return isMarketplaceRole(role) ? role : 'buyer';
}

function normalizeEmail(email) {
  return String(email || '').toLowerCase().trim();
}

// Signup is only open to real consumer mailbox providers. The developer address
// lives on hobags.com, so it can never be minted by a public signup - it must
// already exist in users.json (it is seeded at boot) and can only sign in with
// its password.
function assertNotDeveloperEmail(res, email) {
  if (!isDeveloperEmail(email)) return true;
  res.status(403).json({ error: 'This email address is reserved and cannot be used to create an account' });
  return false;
}

// Shape a user for API responses with the authoritative role applied.
function publicUser(u) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: resolveRole(u.email, u.role),
    avatar: u.avatar ?? null,
  };
}

// --- SMTP (real verification email delivery) ---
// Configure in backend/.env (see backend/.env.example). While SMTP is not
// configured the code is returned in the API response (dev mode).
const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_SECURE = process.env.SMTP_SECURE === 'true';
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const SMTP_FROM = process.env.SMTP_FROM || 'HoBags Kinetic Marketplace <noreply@hobags.com>';
const SMTP_CONFIGURED = !!(SMTP_HOST && SMTP_USER);

const mailTransporter = SMTP_CONFIGURED
  ? nodemailer.createTransport({ host: SMTP_HOST, port: SMTP_PORT, secure: SMTP_SECURE, auth: { user: SMTP_USER, pass: SMTP_PASS } })
  : null;

// Deliver the 6-digit signup code over SMTP when configured. Without SMTP the
// caller falls back to returning the code in the response (dev mode) instead.
async function sendVerificationEmail(email, code) {
  if (!mailTransporter) throw new Error('SMTP is not configured');
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;padding:32px;border:1px solid #e8d9cd;border-radius:12px;background:#fffaf6">
      <h2 style="color:#4a2507;margin:0 0 8px">Kinetic Marketplace</h2>
      <p style="color:#805030;margin:0 0 24px">Confirm your email address to create your account.</p>
      <p style="color:#4a2507;font-weight:bold;margin:0 0 8px">Your verification code is:</p>
      <div style="font-size:36px;font-weight:800;letter-spacing:8px;color:#9e3c00;background:#ffede4;border-radius:8px;padding:16px;text-align:center">${code}</div>
      <p style="color:#805030;font-size:13px;margin:24px 0 0">This code expires in 10 minutes. If you didn't request this, you can safely ignore this email.</p>
    </div>`;
  await mailTransporter.sendMail({ from: SMTP_FROM, to: email, subject: 'Your Kinetic Marketplace verification code', html });
}

// Passwords are stored as `scrypt$<saltB64>$<hashB64>` with a per-user random
// salt. Records written before this format are salted SHA-256 digests; those are
// still accepted so nobody is locked out, and are transparently re-hashed with
// scrypt the first time that account signs in successfully.
const SCRYPT_PREFIX = 'scrypt$';
const SCRYPT_KEYLEN = 64;
const SCRYPT_SALT_BYTES = 16;

function hashPassword(password) {
  const salt = crypto.randomBytes(SCRYPT_SALT_BYTES);
  const hash = crypto.scryptSync(String(password), salt, SCRYPT_KEYLEN);
  return `${SCRYPT_PREFIX}${salt.toString('base64')}$${hash.toString('base64')}`;
}

function legacyHashPassword(password) {
  return crypto.createHash('sha256').update(String(password) + PEPPER).digest('hex');
}

/**
 * Check a password against whichever format the record uses.
 * Returns false for any record with no usable hash, so an account whose hash was
 * lost can never be signed into with an empty or guessed value.
 */
function verifyPassword(password, stored) {
  if (!stored || typeof stored !== 'string') return false;
  const candidate = String(password || '');
  if (stored.startsWith(SCRYPT_PREFIX)) {
    const [, saltB64, hashB64] = stored.split('$');
    if (!saltB64 || !hashB64) return false;
    try {
      const expected = Buffer.from(hashB64, 'base64');
      const actual = crypto.scryptSync(candidate, Buffer.from(saltB64, 'base64'), expected.length);
      return crypto.timingSafeEqual(expected, actual);
    } catch {
      return false;
    }
  }
  const expected = Buffer.from(stored, 'hex');
  const actual = Buffer.from(legacyHashPassword(candidate), 'hex');
  if (expected.length !== actual.length || expected.length === 0) return false;
  return crypto.timingSafeEqual(expected, actual);
}

/** True when a stored hash uses the deprecated format and should be upgraded. */
function needsRehash(stored) {
  return !!stored && typeof stored === 'string' && !stored.startsWith(SCRYPT_PREFIX);
}

function generateToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, name: user.name, role: resolveRole(user.email, user.role) },
    JWT_SECRET,
    { expiresIn: '14d' }
  );
}

app.use(cors({
  origin(origin, callback) {
    // Same-origin/non-browser callers (curl, the Vite proxy, server-to-server)
    // send no Origin header and are always allowed.
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    return callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));

// --- JSON File Helpers ---
const DATA_DIR = path.join(__dirname, 'data');

/**
 * Strict read: returns the parsed value, or `undefined` if the file is missing or
 * unparseable. Several of these files were authored in editors that emit a UTF-8
 * BOM, which makes JSON.parse throw - and treating that as "no data" is
 * destructive, because the next write replaces real records with an empty array.
 * Callers that intend to write must use this and bail out when it returns
 * undefined for a file that does exist.
 */
function readJSONStrict(filename) {
  const p = path.join(DATA_DIR, filename);
  let raw;
  try {
    raw = fs.readFileSync(p, 'utf-8').replace(/^\uFEFF/, '');
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error(`[data] could not read ${filename}: ${err.message}`);
      return undefined;
    }
    return undefined;
  }
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error(`[data] ${filename} is not valid JSON (${err.message})`);
    return undefined;
  }
}

/** True when the file is present on disk (used to tell "missing" from "corrupt"). */
function dataFileExists(filename) {
  return fs.existsSync(path.join(DATA_DIR, filename));
}

/**
 * Thrown when a data file exists but cannot be parsed. Failing loudly is the whole
 * point: a corrupt store must never be silently read as an empty one, because
 * almost every route here is read-modify-write and would then persist `[]` over
 * real records on its next write.
 */
class DataCorruptError extends Error {
  constructor(filename) {
    super(`Data file ${filename} is unreadable; refusing to continue`);
    this.name = 'DataCorruptError';
    this.status = 500;
    this.filename = filename;
  }
}

/**
 * Read for request handling.
 *
 * - Missing file  -> an empty collection, so a brand new install behaves like an
 *   empty store.
 * - Corrupt file  -> throws `DataCorruptError`. Route handlers are synchronous, so
 *   Express turns this into a 500 instead of the request continuing with an empty
 *   store and overwriting the real data on write. This covers every read-before-
 *   write route at once, which is safer than guarding each call site.
 */
function readJSON(filename) {
  const value = readJSONStrict(filename);
  if (value !== undefined) return value;
  if (dataFileExists(filename)) throw new DataCorruptError(filename);
  return filename.endsWith('s.json') ? [] : {};
}

function writeJSON(filename, data) {
  const p = path.join(DATA_DIR, filename);
  // No BOM on write, so the file round-trips through JSON.parse unchanged.
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
}

// --- Helpers ---
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(auth.slice(7), JWT_SECRET);
    // Tokens live for 14 days, so their role/email claims go stale as soon as an
    // account is edited or deleted. Re-resolve the authoritative record on every
    // request: a revoked or downgraded role cannot keep developer access until
    // expiry, and a deleted account is rejected instead of falling back to its
    // (self-signed) token claims.
    const users = readJSON('users.json');
    const stored = users.find(u => u.id === decoded.sub);
    if (!stored) {
      return res.status(401).json({ error: 'Account no longer exists' });
    }
    req.user = {
      ...decoded,
      email: stored.email,
      name: stored.name,
      role: resolveRole(stored.email, stored.role),
    };
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function optionalAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    try {
      const decoded = jwt.verify(auth.slice(7), JWT_SECRET);
      const stored = readJSON('users.json').find(u => u.id === decoded.sub);
      // Same rule as authMiddleware: never fall back to token claims, so a stale
      // or deleted account cannot act as a known user on public endpoints.
      if (stored) {
        req.user = {
          ...decoded,
          email: stored.email,
          name: stored.name,
          role: resolveRole(stored.email, stored.role),
        };
      }
    } catch { /* ignore */ }
  }
  next();
}

// ==================== users.json NORMALIZATION ====================
// users.json is the single source of truth for accounts and roles. This runs once
// at boot so hand-edited or legacy files are repaired before any request is
// served: emails lowercased, ids unique, roles coerced through resolveRole (which
// pins dev@hobags.com to 'developer'), duplicates merged and unusable records
// dropped. It is idempotent and only rewrites the file when something changed.

const DEVELOPER_SEED_ID = 'dev_user_id';

function normalizeUsers() {
  const raw = readJSONStrict('users.json');
  // A corrupt users.json must never be "repaired" into an empty one - that would
  // delete every account. Leave the file untouched and let requests fail with a
  // 500 (readJSON throws) so an operator sees the real problem instead of a
  // silently empty store.
  if (raw === undefined && dataFileExists('users.json')) {
    console.error('[normalize] users.json could not be parsed - SKIPPING normalization to avoid destroying accounts');
    return [];
  }
  // Valid JSON but the wrong shape is just as dangerous as a parse error: an
  // object or string would be treated as an empty account list and then written
  // back over the file.
  if (raw !== undefined && !Array.isArray(raw)) {
    console.error(`[normalize] users.json is ${typeof raw}, expected an array - SKIPPING normalization to avoid destroying accounts`);
    return [];
  }
  const list = Array.isArray(raw) ? raw : [];
  const seenEmails = new Set();
  const seenIds = new Set();
  const normalized = [];
  const changes = [];

  for (const entry of list) {
    if (!entry || typeof entry !== 'object') {
      changes.push('dropped a non-object entry');
      continue;
    }
    const email = normalizeEmail(entry.email);
    if (!email || !email.includes('@')) {
      changes.push(`dropped record with unusable email "${entry.email || ''}"`);
      continue;
    }
    if (seenEmails.has(email)) {
      changes.push(`dropped duplicate account ${email}`);
      continue;
    }
    seenEmails.add(email);

    let id = String(entry.id || '').trim();
    if (!id || seenIds.has(id)) {
      id = `user_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
      changes.push(`reassigned id for ${email}`);
    }
    seenIds.add(id);

    const role = resolveRole(email, entry.role);
    if (String(entry.role || '') !== role) changes.push(`role "${entry.role}" -> "${role}" for ${email}`);

    const user = { ...entry, id, email, role };
    if (entry.email !== email) changes.push(`email lowercased for ${email}`);
    if (!user.passwordHash || typeof user.passwordHash !== 'string') {
      // Store an unusable random hash rather than an empty one, so the account
      // exists and can be repaired by the developer but cannot be signed into.
      user.passwordHash = hashPassword(crypto.randomBytes(32).toString('hex'));
      user.passwordResetRequired = true;
      changes.push(`generated placeholder hash for ${email}`);
    }
    normalized.push(user);
  }

  // The owner account must always exist so dev@hobags.com can sign in. Only seed
  // it when missing - an existing record keeps its id, name and password.
  if (!normalized.some(u => u.email === DEVELOPER_EMAIL)) {
    const seedPassword = process.env.DEVELOPER_PASSWORD || 'admin';
    normalized.unshift({
      id: DEVELOPER_SEED_ID,
      name: 'Developer',
      email: DEVELOPER_EMAIL,
      passwordHash: hashPassword(seedPassword),
      role: 'developer',
      avatar: null,
      createdAt: new Date().toISOString(),
    });
    changes.push(`seeded developer account ${DEVELOPER_EMAIL}`);
  }

  const before = JSON.stringify(list);
  const after = JSON.stringify(normalized);
  if (before !== after) {
    writeJSON('users.json', normalized);
    changes.forEach(c => console.log(`[normalize] users.json: ${c}`));
  }
  return normalized;
}

/** Drop expired password-reset tokens so the file cannot grow without bound. */
function pruneResetTokens() {
  const tokens = readJSONStrict('reset_tokens.json');
  if (tokens === undefined) {
    if (dataFileExists('reset_tokens.json')) {
      console.error('[normalize] reset_tokens.json could not be parsed - SKIPPING prune');
    }
    return;
  }
  // Same shape check as normalizeUsers: an array or string would be iterated and
  // then written back, destroying whatever was actually in the file.
  if (typeof tokens !== 'object' || tokens === null || Array.isArray(tokens)) {
    console.error('[normalize] reset_tokens.json is not an object - SKIPPING prune');
    return;
  }
  const now = Date.now();
  let removed = 0;
  for (const [token, record] of Object.entries(tokens)) {
    if (!record || typeof record !== 'object' || !record.email || now > (record.expires || 0)) {
      delete tokens[token];
      removed++;
    }
  }
  if (removed) {
    writeJSON('reset_tokens.json', tokens);
    console.log(`[normalize] reset_tokens.json: pruned ${removed} expired token(s)`);
  }
}

// ==================== AUTH ROUTES ====================

app.post('/api/auth/signup', (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email, and password are required' });
    if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });
    const normalized = normalizeEmail(email);
    if (!assertNotDeveloperEmail(res, normalized)) return;
    if (!isAllowedEmailDomain(normalized)) {
      return res.status(400).json({ error: 'Only Gmail, Yahoo, Hotmail, and Outlook email addresses are allowed to create an account' });
    }
    const users = readJSON('users.json');
    if (users.find(u => u.email === normalized)) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }
    const user = {
      id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: String(name).replace(/[<>&"'`]/g, '').trim(),
      email: normalized,
      passwordHash: hashPassword(password),
      // New accounts always start as buyers. The role passed by the client is
      // intentionally ignored: a role is only ever set at /developer/users.
      role: 'buyer',
      avatar: null,
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    writeJSON('users.json', users);
    const token = generateToken(user);
    res.status(201).json({ token, user: publicUser(user) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Password-brute-force throttling. Tracked per-IP (stops one host spraying many
// accounts) and per-email (stops one account being sprayed from many hosts).
// Both counters must be clear before a login is even attempted.
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_FAILURES = 5;
const loginFailuresByIp = new Map();     // ip -> { count, firstAt }
const loginFailuresByEmail = new Map();  // email -> { count, firstAt }

function loginThrottleState(key, map) {
  const rec = map.get(key);
  if (!rec) return { blocked: false, remaining: LOGIN_MAX_FAILURES, retryAfterMs: 0 };
  const elapsed = Date.now() - rec.firstAt;
  if (elapsed > LOGIN_WINDOW_MS) {
    map.delete(key);
    return { blocked: false, remaining: LOGIN_MAX_FAILURES, retryAfterMs: 0 };
  }
  const retryAfterMs = LOGIN_WINDOW_MS - elapsed;
  return {
    blocked: rec.count >= LOGIN_MAX_FAILURES,
    remaining: Math.max(0, LOGIN_MAX_FAILURES - rec.count),
    retryAfterMs,
  };
}

function recordLoginFailure(key, map) {
  const rec = map.get(key);
  if (!rec || Date.now() - rec.firstAt > LOGIN_WINDOW_MS) {
    map.set(key, { count: 1, firstAt: Date.now() });
  } else {
    rec.count += 1;
  }
}

function clearLoginFailures(key, map) {
  map.delete(key);
}

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
    const normalized = normalizeEmail(email);
    const ip = req.ip || 'unknown';

    const ipState = loginThrottleState(ip, loginFailuresByIp);
    const emailState = loginThrottleState(normalized, loginFailuresByEmail);
    const blockedBy = ipState.blocked ? { ...ipState, scope: 'ip' }
      : emailState.blocked ? { ...emailState, scope: 'email' }
      : null;
    if (blockedBy) {
      return res.status(429).json({
        error: 'Too many failed sign-in attempts. Try again later.',
        retryAfter: Math.ceil(blockedBy.retryAfterMs / 1000),
        scope: blockedBy.scope,
      });
    }

    // Authentication happens exclusively against users.json - there is no
    // secondary or client-side account store.
    const users = readJSON('users.json');
    const user = users.find(u => u.email === normalized);
    if (!user || !verifyPassword(password, user.passwordHash)) {
      recordLoginFailure(ip, loginFailuresByIp);
      recordLoginFailure(normalized, loginFailuresByEmail);
      const next = loginThrottleState(normalized, loginFailuresByEmail);
      // Report attempts-left so the client can warn before it is fully locked out.
      return res.status(401).json({
        error: 'Invalid email or password',
        attemptsRemaining: next.remaining,
      });
    }

    clearLoginFailures(ip, loginFailuresByIp);
    clearLoginFailures(normalized, loginFailuresByEmail);

    // Opportunistically upgrade records still on the legacy salted-SHA256 format.
    // The plaintext is only available here, at the one moment it is known good.
    if (needsRehash(user.passwordHash)) {
      user.passwordHash = hashPassword(password);
      writeJSON('users.json', users);
      console.log(`[auth] upgraded password hash format for ${user.email}`);
    }
    const token = generateToken(user);
    res.json({ token, user: publicUser(user) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const users = readJSON('users.json');
  const user = users.find(u => u.id === req.user.sub);
  if (!user) return res.status(401).json({ error: 'Account no longer exists' });
  res.json(publicUser(user));
});

// Roles are owned by the developer console. There is deliberately no endpoint
// that lets an account set its own role, and the developer role can never be
// granted at all - it is derived from the email, not stored from a request.
app.post('/api/auth/change-role', authMiddleware, (req, res) => {
  res.status(403).json({
    error: `Roles can only be changed by the developer at ${DEVELOPER_CONSOLE_PATH}. Submit a role request from your account and it will be reviewed there.`,
  });
});

app.put('/api/auth/profile', authMiddleware, (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  const users = readJSON('users.json');
  const idx = users.findIndex(u => u.id === req.user.sub);
  if (idx === -1) return res.status(401).json({ error: 'Account no longer exists' });
  users[idx].name = String(name).replace(/[<>&"'`]/g, '').trim();
  writeJSON('users.json', users);
  res.json(publicUser(users[idx]));
});

// Self-service password change. Requires the current password so a stolen token
// alone cannot lock the real owner out of their own account.
app.put('/api/auth/password', authMiddleware, (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password are required' });
  }
  if (String(newPassword).length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters' });
  }
  const users = readJSON('users.json');
  const idx = users.findIndex(u => u.id === req.user.sub);
  if (idx === -1) return res.status(401).json({ error: 'Account no longer exists' });
  if (!verifyPassword(currentPassword, users[idx].passwordHash)) {
    return res.status(401).json({ error: 'Current password is incorrect' });
  }
  users[idx].passwordHash = hashPassword(newPassword);
  delete users[idx].passwordResetRequired;
  writeJSON('users.json', users);
  res.json({ message: 'Password updated successfully' });
});

app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  const users = readJSON('users.json');
  const user = users.find(u => u.email === normalizeEmail(email));
  // The response is identical whether or not the account exists, so this cannot
  // be used to enumerate registered addresses.
  const message = 'If an account exists with this email, a reset link has been sent';
  if (user) {
    const tokens = readJSON('reset_tokens.json');
    // Invalidate any earlier unused token so only the newest link works.
    for (const [token, record] of Object.entries(tokens)) {
      if (record && record.email === user.email) delete tokens[token];
    }
    const resetToken = `reset_${Date.now()}_${crypto.randomBytes(16).toString('hex')}`;
    tokens[resetToken] = { email: user.email, expires: Date.now() + 3600000 };
    writeJSON('reset_tokens.json', tokens);
    // Handing the token back to the caller would let anyone reset any account,
    // so it is only echoed in non-production, where there is no mail transport.
    if (!IS_PRODUCTION) return res.json({ message, reset_token: resetToken, dev: true });
  }
  res.json({ message });
});

app.post('/api/auth/reset-password', (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ error: 'Token and password are required' });
  if (String(password).length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });
  const tokens = readJSON('reset_tokens.json');
  const record = tokens[token];
  if (!record) return res.status(400).json({ error: 'Invalid or expired reset link' });
  if (Date.now() > record.expires) {
    delete tokens[token];
    writeJSON('reset_tokens.json', tokens);
    return res.status(400).json({ error: 'Reset link has expired' });
  }
  const users = readJSON('users.json');
  const idx = users.findIndex(u => u.email === normalizeEmail(record.email));
  if (idx === -1) return res.status(400).json({ error: 'Invalid or expired reset link' });
  users[idx].passwordHash = hashPassword(password);
  delete users[idx].passwordResetRequired;
  writeJSON('users.json', users);
  // Single use: burn the token even if the write above succeeded.
  delete tokens[token];
  writeJSON('reset_tokens.json', tokens);
  res.json({ message: 'Password reset successful' });
});

app.get('/api/auth/google/config', (req, res) => {
  res.json({ clientId: GOOGLE_CLIENT_ID, allowedRedirectUris: GOOGLE_REDIRECT_URIS });
});

app.post('/api/auth/google/callback', async (req, res) => {
  try {
    const { code, code_verifier, redirect_uri } = req.body;
    if (!code || !code_verifier) return res.status(400).json({ error: 'Missing code or code_verifier' });
    if (!GOOGLE_REDIRECT_URIS.includes(redirect_uri)) {
      return res.status(400).json({ error: 'Unregistered redirect_uri. Add it to GOOGLE_REDIRECT_URIS and to Google Cloud Console.' });
    }

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri,
        grant_type: 'authorization_code',
        code_verifier,
      }).toString(),
    });
    const tokens = await tokenRes.json();
    if (!tokens.access_token) {
      return res.status(401).json({ error: tokens.error_description || tokens.error || 'Google code exchange failed' });
    }

    const infoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const info = await infoRes.json();
    if (!info.sub) return res.status(401).json({ error: 'Could not fetch Google profile' });

    const users = readJSON('users.json');
    let user = users.find(u => u.googleSub === info.sub);
    if (!user && info.email) user = users.find(u => u.email === normalizeEmail(info.email));
    // The owner account signs in with its password only. Refusing it here stops a
    // Google account registered to dev@hobags.com from minting a developer token.
    if (user && isDeveloperEmail(user.email)) {
      return res.status(403).json({ error: `${DEVELOPER_EMAIL} must sign in with its password` });
    }
    if (!user) {
      const oauthEmail = normalizeEmail(info.email || `google_${info.sub}@google.auth`);
      if (!assertNotDeveloperEmail(res, oauthEmail)) return;
      user = {
        id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        name: (info.name || 'Google User').replace(/[<>&"'`]/g, '').trim(),
        email: oauthEmail,
        googleSub: info.sub,
        passwordHash: hashPassword(crypto.randomBytes(32).toString('hex')),
        role: 'buyer',
        avatar: info.picture || null,
        createdAt: new Date().toISOString(),
      };
      users.push(user);
      writeJSON('users.json', users);
    } else {
      user.googleSub = info.sub;
      if (info.name) user.name = info.name.replace(/[<>&"'`]/g, '').trim();
      if (info.picture) user.avatar = info.picture;
      // Self-heal: keep the owner account pinned to developer and coerce any
      // stale/privileged role string on other accounts down to a marketplace role.
      user.role = resolveRole(user.email, user.role);
      writeJSON('users.json', users);
    }
    const token = generateToken(user);
    res.json({ token, user: publicUser(user) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Apple sign-in is disabled. The previous handler trusted any `id_token` string
// without checking its signature and logged the caller in as
// `apple_<prefix>@apple.auth`, which was an account-takeover path that bypassed
// users.json entirely. It stays closed until a real Apple Service ID is
// configured and the id_token is verified against Apple's JWKS.
app.post('/api/auth/apple', (req, res) => {
  res.status(403).json({ error: 'Apple sign-in is not available' });
});

// ==================== PHONE OTP ====================
// Codes are generated here, stored server-side with a short TTL and an attempt
// cap, and checked on verification. The previous handler ignored the submitted
// code entirely and signed anyone in as `phone_<number>@phone.auth`.

const OTP_TTL_MS = 5 * 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;
const OTP_RESEND_COOLDOWN_MS = 30 * 1000;
const otpCodes = new Map(); // phone -> { code, expires, attempts, sentAt }
const otpAttempts = new Map(); // ip -> { count, firstAt }

const OTP_WINDOW_MS = 10 * 60 * 1000;
const OTP_IP_MAX = 20;

function otpIpLimited(req) {
  const key = req.ip || 'unknown';
  const record = otpAttempts.get(key);
  const now = Date.now();
  if (!record || now - record.firstAt > OTP_WINDOW_MS) {
    otpAttempts.set(key, { count: 1, firstAt: now });
    return false;
  }
  record.count += 1;
  return record.count > OTP_IP_MAX;
}

function phoneKey(phone) {
  return String(phone || '').replace(/[^\d+]/g, '');
}

app.post('/api/auth/send-otp', (req, res) => {
  const { phone } = req.body;
  const key = phoneKey(phone);
  if (!key || key.replace(/\D/g, '').length < 6) {
    return res.status(400).json({ error: 'Enter a valid phone number' });
  }
  if (otpIpLimited(req)) {
    return res.status(429).json({ error: 'Too many verification codes requested. Try again later.' });
  }
  const existing = otpCodes.get(key);
  if (existing && Date.now() - existing.sentAt < OTP_RESEND_COOLDOWN_MS) {
    return res.status(429).json({ error: 'Please wait before requesting another code' });
  }
  const code = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
  otpCodes.set(key, { code, expires: Date.now() + OTP_TTL_MS, attempts: 0, sentAt: Date.now() });
  // No SMS gateway is wired up yet, so the code is logged (and echoed in
  // non-production) rather than silently discarded.
  console.log(`[otp] verification code for ${key}: ${code}`);
  const body = { message: 'OTP sent', expires_in: OTP_TTL_MS / 1000 };
  if (!IS_PRODUCTION) body.code = code;
  res.json(body);
});

app.post('/api/auth/verify-otp', (req, res) => {
  const { phone, code, name } = req.body || {};
  const key = phoneKey(phone);
  if (!key || !code) return res.status(400).json({ error: 'Phone and code are required' });
  const record = otpCodes.get(key);
  if (!record) return res.status(401).json({ error: 'Request a new verification code' });
  if (Date.now() > record.expires) {
    otpCodes.delete(key);
    return res.status(401).json({ error: 'Verification code has expired' });
  }
  if (String(code).trim() !== record.code) {
    record.attempts += 1;
    if (record.attempts >= OTP_MAX_ATTEMPTS) otpCodes.delete(key);
    return res.status(401).json({
      error: record.attempts >= OTP_MAX_ATTEMPTS
        ? 'Too many incorrect attempts. Request a new code.'
        : 'Incorrect verification code',
    });
  }
  otpCodes.delete(key);

  const users = readJSON('users.json');
  const email = `phone_${key.replace(/\D/g, '')}@phone.auth`;
  let user = users.find(u => u.email === email);
  if (!user) {
    user = {
      id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: String(name || 'Phone User').replace(/[<>&"'`]/g, '').trim() || 'Phone User',
      email,
      phone: key,
      passwordHash: hashPassword(crypto.randomBytes(32).toString('hex')),
      role: 'buyer',
      avatar: null,
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    writeJSON('users.json', users);
  } else if (name) {
    user.name = String(name).replace(/[<>&"'`]/g, '').trim() || user.name;
    writeJSON('users.json', users);
  }
  const token = generateToken(user);
  res.json({ token, user: publicUser(user) });
});

// ==================== EMAIL VERIFICATION (signup) ====================

const EMAIL_VERIFICATION_FILE = 'email_verification_store.json';
const EMAIL_CODE_EXPIRY_MS = 10 * 60 * 1000;
const EMAIL_CODE_MAX_ATTEMPTS = 5;

app.post('/api/auth/email/request-code', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    const normalized = normalizeEmail(email);
    if (!assertNotDeveloperEmail(res, normalized)) return;
    if (!isAllowedEmailDomain(normalized)) {
      return res.status(400).json({ error: 'Only Gmail, Yahoo, Hotmail, and Outlook email addresses are allowed to create an account' });
    }
    const users = readJSON('users.json');
    if (users.find(u => u.email === normalized)) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }
    const code = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
    const store = readJSON(EMAIL_VERIFICATION_FILE);
    store[normalized] = { code, expires: Date.now() + EMAIL_CODE_EXPIRY_MS, attempts: 0, createdAt: new Date().toISOString() };
    writeJSON(EMAIL_VERIFICATION_FILE, store);

    let devCode = code;
    if (SMTP_CONFIGURED) {
      try {
        await sendVerificationEmail(normalized, code);
        devCode = null;
      } catch (e) {
        console.error('SMTP send failed, falling back to dev mode:', e.message);
      }
    } else {
      console.log(`[DEV] Verification code for ${normalized}: ${code}`);
    }

    const body = { message: `A 6-digit verification code has been sent to ${normalized}`, expires_in: EMAIL_CODE_EXPIRY_MS / 1000 };
    if (devCode && !IS_PRODUCTION) body.code = devCode;
    res.json(body);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/auth/email/register', (req, res) => {
  try {
    const { name, email, password, code } = req.body;
    if (!name || !email || !password || !code) {
      return res.status(400).json({ error: 'Name, email, password, and verification code are required' });
    }
    if (String(password).length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });
    const normalized = normalizeEmail(email);
    if (!assertNotDeveloperEmail(res, normalized)) return;
    if (!isAllowedEmailDomain(normalized)) {
      return res.status(400).json({ error: 'Only Gmail, Yahoo, Hotmail, and Outlook email addresses are allowed to create an account' });
    }
    const store = readJSON(EMAIL_VERIFICATION_FILE);
    const record = store[normalized];
    if (!record) return res.status(400).json({ error: 'No verification code was requested for this email. Please request a new code.' });

    if (Date.now() > record.expires) {
      delete store[normalized];
      writeJSON(EMAIL_VERIFICATION_FILE, store);
      return res.status(400).json({ error: 'Verification code has expired. Please request a new code.' });
    }
    if (String(code).trim() !== record.code) {
      record.attempts = (record.attempts || 0) + 1;
      if (record.attempts >= EMAIL_CODE_MAX_ATTEMPTS) {
        delete store[normalized];
        writeJSON(EMAIL_VERIFICATION_FILE, store);
        return res.status(400).json({ error: 'Too many incorrect attempts. Please request a new code.' });
      }
      writeJSON(EMAIL_VERIFICATION_FILE, store);
      return res.status(400).json({ error: 'Incorrect verification code' });
    }

    const users = readJSON('users.json');
    if (users.find(u => u.email === normalized)) {
      delete store[normalized];
      writeJSON(EMAIL_VERIFICATION_FILE, store);
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    delete store[normalized];
    writeJSON(EMAIL_VERIFICATION_FILE, store);

    const user = {
      id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: String(name).replace(/[<>&"'`]/g, '').trim(),
      email: normalized,
      passwordHash: hashPassword(password),
      // Verified email signup still starts everyone as a buyer. Roles are only
      // ever assigned by the developer at /developer/users.
      role: 'buyer',
      avatar: null,
      verified_email: true,
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    writeJSON('users.json', users);
    const token = generateToken(user);
    res.status(201).json({ token, verified: true, user: publicUser(user) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ==================== PRODUCT ROUTES ====================

app.get('/api/products', optionalAuth, (req, res) => {
  let products = readJSON('products.json');
  const { category, search, featured, route } = req.query;
  if (category) products = products.filter(p => p.category === category || (p.categories || []).includes(category));
  if (route) products = products.filter(p => p.route === route);
  if (search) products = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  if (featured === 'true') products = products.filter(p => p.featured === 'approved');
  res.json(products);
});

app.get('/api/products/route/:route', (req, res) => {
  const products = readJSON('products.json').filter(p => p.route === req.params.route);
  res.json(products);
});

app.get('/api/products/user/:userId', (req, res) => {
  const products = readJSON('products.json').filter(p => p.addedBy && p.addedBy.id === req.params.userId);
  res.json(products);
});

app.get('/api/products/featured/suggestions', (req, res) => {
  let products = readJSON('products.json')
    .filter(p => p.featured !== 'approved' && p.featured !== 'rejected' && p.rating > 0);
  const byRoute = new Map();
  for (const p of products) {
    const arr = byRoute.get(p.route) || [];
    arr.push(p);
    byRoute.set(p.route, arr);
  }
  const result = [];
  for (const [, routeProducts] of byRoute) {
    const scored = routeProducts.map(p => ({
      ...p,
      score: Math.round((p.rating * 0.4 + Math.min(p.reviews / 500, 1) * 0.3 + (() => { const days = (Date.now() - new Date(p.createdAt).getTime()) / 86400000; return days < 7 ? 1.0 : days < 14 ? 0.8 : days < 30 ? 0.5 : days < 90 ? 0.2 : 0; })() * 0.3) * 100) / 100
    })).sort((a, b) => b.score - a.score);
    result.push(scored[0]);
  }
  res.json(result.sort((a, b) => b.score - a.score));
});

app.get('/api/products/top/by-routes', (req, res) => {
  const { routes, perRoute } = req.query;
  const routeList = routes ? routes.split(',') : [];
  const limit = parseInt(perRoute) || 1;
  const allProducts = readJSON('products.json');
  const result = routeList.flatMap(route => {
    return allProducts
      .filter(p => p.route === route && p.featured === 'approved')
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  });
  res.json(result);
});

app.get('/api/products/:id', (req, res) => {
  const products = readJSON('products.json');
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

app.post('/api/products', authMiddleware, (req, res) => {
  const products = readJSON('products.json');
  const product = {
    id: `prod_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    ...req.body,
    addedBy: req.body.addedBy || { id: req.user.sub, name: req.user.name, role: req.user.role },
    createdAt: req.body.createdAt || new Date().toISOString(),
  };
  products.push(product);
  writeJSON('products.json', products);
  res.status(201).json(product);
});

app.post('/api/products/bulk', (req, res) => {
  const incoming = req.body;
  if (!Array.isArray(incoming)) return res.status(400).json({ error: 'Expected array' });
  let existing = readJSON('products.json');
  for (const item of incoming) {
    const idx = existing.findIndex(p => p.id === item.id);
    if (idx >= 0) existing[idx] = { ...existing[idx], ...item };
    else existing.push(item);
  }
  writeJSON('products.json', existing);
  res.json({ ok: true, count: existing.length });
});

app.put('/api/products/:id', authMiddleware, (req, res) => {
  const products = readJSON('products.json');
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });
  products[idx] = { ...products[idx], ...req.body, id: req.params.id };
  writeJSON('products.json', products);
  res.json(products[idx]);
});

app.delete('/api/products/:id', authMiddleware, (req, res) => {
  const products = readJSON('products.json');
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });
  products.splice(idx, 1);
  writeJSON('products.json', products);
  res.json({ ok: true });
});

// ==================== FEATURED CURATION ====================

app.post('/api/featured/:id/approve', authMiddleware, (req, res) => {
  const products = readJSON('products.json');
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });
  products[idx].featured = 'approved';
  writeJSON('products.json', products);
  res.json(products[idx]);
});

app.post('/api/featured/:id/reject', authMiddleware, (req, res) => {
  const products = readJSON('products.json');
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });
  products[idx].featured = 'rejected';
  writeJSON('products.json', products);
  res.json(products[idx]);
});

app.get('/api/products/reviews', (req, res) => {
  const reviews = readJSON('reviews.json');
  res.json(reviews);
});

app.put('/api/products/reviews', (req, res) => {
  writeJSON('reviews.json', req.body);
  res.json({ ok: true });
});

// ==================== REVIEW ROUTES ====================

app.get('/api/reviews/:productId', (req, res) => {
  const reviews = readJSON('reviews.json');
  res.json(reviews[req.params.productId] || []);
});

app.post('/api/reviews/:productId', optionalAuth, (req, res) => {
  const { author, rating, text } = req.body;
  if (!author || !rating || !text) return res.status(400).json({ error: 'Author, rating, and text are required' });
  const reviews = readJSON('reviews.json');
  const list = reviews[req.params.productId] || [];
  const review = {
    id: `rev_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    author, rating, text,
    date: 'Just now',
  };
  list.unshift(review);
  reviews[req.params.productId] = list;
  writeJSON('reviews.json', reviews);

  const products = readJSON('products.json');
  const pidx = products.findIndex(p => p.id === req.params.productId);
  if (pidx >= 0) {
    const totalRating = list.reduce((s, r) => s + r.rating, 0);
    products[pidx].rating = Math.round((totalRating / list.length) * 10) / 10;
    products[pidx].reviews = list.length;
    writeJSON('products.json', products);
    res.json(products[pidx]);
  } else {
    res.json({ id: req.params.productId, rating: rating, reviews: list.length });
  }
});

// ==================== CATEGORY ROUTES ====================

app.get('/api/categories', (req, res) => {
  res.json([
    { id: 'luxury', name: 'Handbags & Purses', slug: 'luxury', description: 'Designer handbags and fashion purses', image: '' },
    { id: 'backpack', name: 'Backpacks', slug: 'backpack', description: 'Backpacks for every occasion', image: '' },
    { id: 'travel', name: 'Luggage & Travel', slug: 'travel', description: 'Travel bags and luggage', image: '' },
    { id: 'school', name: 'Work & School', slug: 'school', description: 'Bags for work and school', image: '' },
    { id: 'handcrafted', name: 'Handcrafted', slug: 'handcrafted', description: 'Artisan handmade bags', image: '' },
    { id: 'kids-baby', name: 'Kids & Baby', slug: 'kids-baby', description: 'Bags for kids and babies', image: '' },
    { id: 'casual-utility', name: 'Casual & Utility', slug: 'casual-utility', description: 'Casual and utility bags', image: '' },
    { id: 'professional-bags', name: 'Professional', slug: 'professional-bags', description: 'Professional bags', image: '' },
    { id: 'sports', name: 'Sports', slug: 'sports', description: 'Sports bags and gear', image: '' },
  ]);
});

// Minimal public seller profile for /store/:sellerId. This replaces the page's
// old habit of reading a display name out of the localStorage user store: the
// backend is the source of truth, and email/hash are never exposed here.
app.get('/api/public/sellers/:id', (req, res) => {
  const user = readJSON('users.json').find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'Seller not found' });
  res.json({
    id: user.id,
    name: user.name,
    avatar: user.avatar ?? null,
    role: resolveRole(user.email, user.role),
    memberSince: user.createdAt || null,
  });
});

// ==================== ORDER ROUTES ====================

// Single source of truth for order status values, shared by order creation
// (POST /api/orders) and developer-console updates (PUT /api/admin/orders/:id).
const VALID_ORDER_STATUSES = ['pending', 'shipped', 'delivered', 'cancelled'];

app.get('/api/orders', authMiddleware, (req, res) => {
  const orders = readJSON('orders.json').filter(o => o.user_id === req.user.sub);
  res.json(orders);
});

app.post('/api/orders', authMiddleware, (req, res) => {
  const { shipping_address, order } = req.body;

  // Full-order upsert: the SPA submits the real order (items + totals) so it
  // persists to the shared orders.json regardless of which browser/device the
  // buyer used. This is what makes /developer/orders consistent across browsers.
  if (order && Array.isArray(order.items)) {
    const existing = readJSON('orders.json');
    const idx = existing.findIndex(o => o.id === order.id);
    const safeOrder = {
      id: String(order.id || `KC-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`),
      user_id: order.user_id || req.user.sub,
      buyer_name: order.buyer_name || null,
      buyer_email: order.buyer_email || null,
      status: VALID_ORDER_STATUSES.includes(order.status) ? order.status : 'pending',
      total: Number(order.total) || 0,
      subtotal: Number(order.subtotal) || 0,
      shipping: Number(order.shipping) || 0,
      tax: Number(order.tax) || 0,
      discount: Number(order.discount) || 0,
      shipping_address: order.shipping_address || null,
      created_at: order.created_at || new Date().toISOString(),
      updated_at: order.updated_at || order.created_at || new Date().toISOString(),
      items: (Array.isArray(order.items) ? order.items : []).filter(i => i && typeof i === 'object'),
    };
    if (idx !== -1) {
      existing[idx] = { ...existing[idx], ...safeOrder, updated_at: new Date().toISOString() };
    } else {
      existing.push(safeOrder);
    }
    writeJSON('orders.json', existing);
    return res.status(201).json(safeOrder);
  }

  const userId = req.user.sub;
  const cart = CARTS[userId] || [];
  const products = readJSON('products.json');
  const items = cart.map(c => {
    const p = products.find(pp => pp.id === c.product_id);
    return {
      product_id: c.product_id,
      name: c.name || (p && p.name) || '',
      image: c.image || (p && (p.image || p.imageUrl)) || '',
      quantity: c.quantity || 1,
      price: Number(c.price != null ? c.price : (p && p.price)) || 0,
      seller_id: (p && (p.addedBy && p.addedBy.id)) || (p && p.seller_id) || null,
      seller_name: (p && p.addedBy && p.addedBy.name) || null,
    };
  });
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const legacyOrder = {
    id: `KC-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    user_id: userId,
    buyer_name: (req.user && (req.user.name || req.user.email)) || null,
    buyer_email: (req.user && req.user.email) || null,
    status: 'pending',
    total,
    shipping_address: shipping_address || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    items,
  };
  const orders = readJSON('orders.json');
  orders.push(legacyOrder);
  writeJSON('orders.json', orders);
  if (CARTS[userId]) CARTS[userId] = [];
  res.status(201).json(legacyOrder);
});

// --- Developer-only order management (shared, so it is consistent across browsers) ---
function requireDeveloper(req, res, next) {
  // req.user.email/role are re-resolved from storage by authMiddleware, so this
  // reflects the current account rather than a possibly stale token claim.
  if (!req.user || !isDeveloperEmail(req.user.email) || req.user.role !== 'developer') {
    return res.status(403).json({ error: 'Developer access only' });
  }
  next();
}

app.get('/api/orders/:id', authMiddleware, (req, res) => {
  const orders = readJSON('orders.json');
  const order = orders.find(o => o.id === req.params.id && o.user_id === req.user.sub);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

// ==================== VERIFICATION REQUEST ROUTES (shared, dev-gated) ====================
// Requests used to live only in browser localStorage, so one submitted in Chrome
// never appeared in another browser or on the developer's console. They now live
// in requests.json, which keeps the All/Pending/Approved/Rejected list identical
// across every browser and device.

const VALID_REQ_STATUSES = ['pending', 'approved', 'rejected'];
const VALID_REQ_ROLES = ['seller', 'manufacturer', 'supplier'];

function sortRequestsNewestFirst(requests) {
  return requests.sort((a, b) => new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime());
}

function safeRequest(raw, fallback = {}) {
  const r = raw && typeof raw === 'object' ? raw : {};
  return {
    id: String(r.id || fallback.id || `RQ-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`),
    userId: String(r.userId || fallback.userId || ''),
    userName: String(r.userName || fallback.userName || ''),
    userEmail: String(r.userEmail || fallback.userEmail || ''),
    role: VALID_REQ_ROLES.includes(r.role) ? r.role : (fallback.role || 'seller'),
    status: VALID_REQ_STATUSES.includes(r.status) ? r.status : 'pending',
    submittedAt: String(r.submittedAt || fallback.submittedAt || new Date().toISOString()),
    reviewedAt: r.reviewedAt || fallback.reviewedAt || null,
    notes: r.notes || fallback.notes || null,
    type: String(r.type || fallback.type || 'onboarding'),
    requestedRole: VALID_REQ_ROLES.includes(r.requestedRole) ? r.requestedRole : (fallback.requestedRole || undefined),
    applicationData: r.applicationData && typeof r.applicationData === 'object' ? r.applicationData : (fallback.applicationData || undefined),
  };
}

app.get('/api/requests/all', authMiddleware, requireDeveloper, (req, res) => {
  res.json(sortRequestsNewestFirst(readJSON('requests.json')));
});

// The caller's own requests, so /account reflects the shared store rather than
// whatever this browser happens to have cached.
app.get('/api/requests/mine', authMiddleware, (req, res) => {
  const mine = readJSON('requests.json').filter(r => r.userId === req.user.sub);
  res.json(sortRequestsNewestFirst(mine));
});

// Upsert a request. userId/userEmail/userName are forced from the authenticated
// account so one browser cannot file - or overwrite - another user's request.
app.post('/api/requests', authMiddleware, (req, res) => {
  const { request } = req.body || {};
  if (!request || !request.id) return res.status(400).json({ error: 'Invalid request payload' });
  const requests = readJSON('requests.json');
  const idx = requests.findIndex(r => r.id === request.id);
  if (idx !== -1 && requests[idx].userId !== req.user.sub) {
    return res.status(403).json({ error: 'You can only submit your own requests' });
  }
  const safe = safeRequest({
    ...request,
    userId: req.user.sub,
    userEmail: req.user.email,
    userName: req.user.name,
  });
  if (idx !== -1) {
    requests[idx] = { ...requests[idx], ...safe, updated_at: new Date().toISOString() };
  } else {
    requests.push({ ...safe, created_at: new Date().toISOString() });
  }
  writeJSON('requests.json', requests);
  // Echo the record that was actually stored, not a freshly generated one, so
  // the id the client receives is the id that was persisted.
  const saved = requests.find(r => r.id === safe.id) || safe;
  res.status(idx !== -1 ? 200 : 201).json(saved);
});

// Record the review decision only. This deliberately does NOT change the user's
// role: `role` in users.json has exactly one writer, PUT /api/admin/users/:id,
// which the developer console surfaces at /developer/users. Approving here means
// "this request is legitimate" - the role itself is then assigned on that page.
app.patch('/api/requests/:id', authMiddleware, requireDeveloper, (req, res) => {
  const requests = readJSON('requests.json');
  const idx = requests.findIndex(r => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Request not found' });

  if (req.body && req.body.status !== undefined) {
    if (!VALID_REQ_STATUSES.includes(req.body.status)) {
      return res.status(400).json({ error: `Status must be one of: ${VALID_REQ_STATUSES.join(', ')}` });
    }
    requests[idx].status = req.body.status;
    requests[idx].reviewedAt = new Date().toISOString();
  }
  if (req.body && req.body.notes != null) {
    requests[idx].notes = Array.isArray(req.body.notes)
      ? req.body.notes.map(String).join(', ')
      : String(req.body.notes);
  }

  writeJSON('requests.json', requests);
  res.json({
    ...requests[idx],
    // Tell the console which page to visit so the role can actually be assigned.
    roleAssignmentRequired:
      requests[idx].status === 'approved'
      && VALID_REQ_ROLES.includes(requests[idx].requestedRole || requests[idx].role),
  });
});

app.delete('/api/requests/:id', authMiddleware, requireDeveloper, (req, res) => {
  const requests = readJSON('requests.json');
  const next = requests.filter(r => r.id !== req.params.id);
  if (next.length === requests.length) return res.status(404).json({ error: 'Request not found' });
  writeJSON('requests.json', next);
  res.json({ ok: true });
});

// ==================== CART ROUTES (session-based) ====================

const CARTS = {};

app.get('/api/cart', optionalAuth, (req, res) => {
  const userId = req.user ? req.user.sub : 'anonymous';
  const products = readJSON('products.json');
  const cart = (CARTS[userId] || []).map(c => {
    if (c.price != null && c.name) return { ...c, price: Number(c.price) || 0 };
    const p = products.find(pp => pp.id === c.product_id);
    if (!p) return { ...c, price: Number(c.price) || 0, name: c.name || '', image: c.image || '' };
    return {
      ...c,
      name: c.name || p.name || '',
      price: Number(c.price != null ? c.price : p.price) || 0,
      image: c.image || p.image || p.imageUrl || '',
      stock: p.stock || 0,
      seller_id: p.addedBy?.id || p.seller_id || null,
      seller_name: p.addedBy?.name || null,
    };
  });
  res.json(cart);
});

app.post('/api/cart/add', optionalAuth, (req, res) => {
  const { product_id, quantity } = req.body;
  const userId = req.user ? req.user.sub : 'anonymous';
  if (!CARTS[userId]) CARTS[userId] = [];
  const existing = CARTS[userId].find(c => c.product_id === product_id);
  if (existing) existing.quantity += (quantity || 1);
  else CARTS[userId].push({ id: `cart_${Date.now()}`, product_id, quantity: quantity || 1, ...req.body });
  res.json({ ok: true });
});

app.delete('/api/cart/:id', optionalAuth, (req, res) => {
  const userId = req.user ? req.user.sub : 'anonymous';
  if (CARTS[userId]) CARTS[userId] = CARTS[userId].filter(c => c.id !== req.params.id);
  res.json({ ok: true });
});

// ==================== WISHLIST ROUTES ====================

const WISHLISTS = {};

app.get('/api/wishlist', authMiddleware, (req, res) => {
  res.json(WISHLISTS[req.user.sub] || []);
});

app.post('/api/wishlist/add', authMiddleware, (req, res) => {
  const { product_id } = req.body;
  if (!WISHLISTS[req.user.sub]) WISHLISTS[req.user.sub] = [];
  if (!WISHLISTS[req.user.sub].find(w => w.product_id === product_id)) {
    WISHLISTS[req.user.sub].push({ id: `wl_${Date.now()}`, user_id: req.user.sub, product_id, created_at: new Date().toISOString() });
  }
  res.json({ ok: true });
});

app.delete('/api/wishlist/:product_id', authMiddleware, (req, res) => {
  if (WISHLISTS[req.user.sub]) {
    WISHLISTS[req.user.sub] = WISHLISTS[req.user.sub].filter(w => w.product_id !== req.params.product_id);
  }
  res.json({ ok: true });
});

// ==================== ADMIN ROUTES ====================
// Every admin route requires an authenticated owner account. These endpoints
// enumerate and mutate all users, orders and platform settings, so an ordinary
// buyer/supplier/seller token must never reach them.
//
// PUT /api/admin/users/:id is the ONLY place a user's `role` is ever written.
// It backs the developer console page at /developer/users, which is the only
// surface in the product where a role can be changed.

app.get('/api/admin/users', authMiddleware, requireDeveloper, (req, res) => {
  // Keep every non-sensitive field (createdAt, googleSub, ...) but drop the
  // password hash and normalise the role.
  const users = readJSON('users.json').map(({ passwordHash, ...u }) => ({
    ...u,
    role: resolveRole(u.email, u.role),
  }));
  res.json(users);
});

app.put('/api/admin/users/:id', authMiddleware, requireDeveloper, (req, res) => {
  const { name, email, role } = req.body || {};
  const users = readJSON('users.json');
  const idx = users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  // Identify the owner account by email so a stale 'developer' string on another
  // record does not make that record permanently unmanageable.
  if (isDeveloperEmail(users[idx].email)) return res.status(400).json({ error: 'Developer account cannot be edited' });
  if (name !== undefined) users[idx].name = String(name).replace(/[<>&"'`]/g, '').trim();
  if (email !== undefined) {
    const normalized = normalizeEmail(email);
    if (isDeveloperEmail(normalized)) {
      return res.status(400).json({ error: 'The developer email cannot be reassigned' });
    }
    if (users.find(u => u.id !== req.params.id && u.email === normalized)) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }
    users[idx].email = normalized;
  }
  if (role !== undefined) {
    const requested = String(role).toLowerCase().trim();
    if (requested === 'developer') {
      return res.status(403).json({ error: 'The developer role cannot be granted' });
    }
    if (!isMarketplaceRole(requested)) {
      return res.status(400).json({ error: `Role must be one of: ${MARKETPLACE_ROLES.join(', ')}` });
    }
    users[idx].role = requested;
  }
  writeJSON('users.json', users);
  res.json(publicUser(users[idx]));
});

app.delete('/api/admin/users/:id', authMiddleware, requireDeveloper, (req, res) => {
  const users = readJSON('users.json');
  const idx = users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  if (isDeveloperEmail(users[idx].email)) return res.status(400).json({ error: 'Developer account cannot be deleted' });
  users.splice(idx, 1);
  writeJSON('users.json', users);
  res.json({ ok: true });
});

app.get('/api/admin/features', authMiddleware, requireDeveloper, (req, res) => {
  const products = readJSON('products.json').filter(p => p.featured === 'approved' || p.featured === 'pending');
  res.json(products.map(p => ({ id: p.id, name: p.name, description: p.spec || '', enabled: p.featured === 'approved' ? 1 : 0, category: p.category, created_at: p.createdAt, updated_at: p.createdAt })));
});

app.patch('/api/admin/features/:id', authMiddleware, requireDeveloper, (req, res) => {
  const { enabled } = req.body;
  const products = readJSON('products.json');
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });
  products[idx].featured = enabled ? 'approved' : 'rejected';
  writeJSON('products.json', products);
  res.json({ id: req.params.id, enabled: enabled ? 1 : 0 });
});

app.get('/api/admin/settings', authMiddleware, requireDeveloper, (req, res) => {
  const settings = readJSON('settings.json');
  res.json(Object.entries(settings));
});

app.put('/api/admin/settings/:key', authMiddleware, requireDeveloper, (req, res) => {
  const settings = readJSON('settings.json');
  settings[req.params.key] = req.body.value;
  writeJSON('settings.json', settings);
  res.json({ ok: true });
});

app.get('/api/admin/stats', authMiddleware, requireDeveloper, (req, res) => {
  const users = readJSON('users.json');
  const products = readJSON('products.json');
  const orders = readJSON('orders.json');
  res.json({
    total_users: users.length,
    total_products: products.length,
    total_orders: orders.length,
    total_revenue: orders.reduce((s, o) => s + (o.total || 0), 0),
  });
});

// Get all orders for admin/developer
app.get('/api/admin/orders', authMiddleware, requireDeveloper, (req, res) => {
  const orders = readJSON('orders.json');
  // Sort by most recent first
  const sorted = orders.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
  res.json(sorted);
});

// Update an order from the developer console (currently the status).
// Only whitelisted fields are writable and the status must be a known value,
// so a bad client can never corrupt orders.json.
app.put('/api/admin/orders/:id', authMiddleware, requireDeveloper, (req, res) => {
  const orders = readJSON('orders.json');
  const idx = orders.findIndex(o => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Order not found' });

  const { status } = req.body || {};
  if (status !== undefined) {
    if (!VALID_ORDER_STATUSES.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_ORDER_STATUSES.join(', ')}` });
    }
    orders[idx].status = status;
  }
  orders[idx].updated_at = new Date().toISOString();
  writeJSON('orders.json', orders);
  res.json(orders[idx]);
});

// Delete an order from the developer console.
app.delete('/api/admin/orders/:id', authMiddleware, requireDeveloper, (req, res) => {
  const orders = readJSON('orders.json');
  const idx = orders.findIndex(o => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Order not found' });
  const [removed] = orders.splice(idx, 1);
  writeJSON('orders.json', orders);
  res.json({ ok: true, id: removed.id });
});

// ==================== SUPPLIER ROUTES ====================

app.get('/api/supplier/dashboard', authMiddleware, (req, res) => {
  res.json({ message: 'Supplier dashboard', orders: [], trends: [] });
});
app.get('/api/supplier/warehouses', authMiddleware, (req, res) => {
  const all = readJSON('supplier_warehouses.json');
  res.json(all.filter(w => w.supplier_id === req.user.sub));
});
app.post('/api/supplier/warehouses', authMiddleware, (req, res) => {
  const b = req.body || {};
  const name = String(b.name || '').trim();
  const location = String(b.location || '').trim();
  if (!name || !location) return res.status(400).json({ error: 'Name and location are required.' });
  const status = ['active', 'maintenance', 'inactive'].includes(b.status) ? b.status : 'active';
  const address = b.address && typeof b.address === 'object' ? b.address : {};
  const warehouse = {
    id: `wh_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    supplier_id: req.user.sub,
    name,
    location,
    address: {
      line1: String(address.line1 || ''),
      line2: String(address.line2 || ''),
      city: String(address.city || ''),
      state: String(address.state || ''),
      country: String(address.country || ''),
      zip: String(address.zip || ''),
    },
    capacity: Math.max(0, Number(b.capacity) || 0),
    utilized: Math.max(0, Number(b.utilized) || 0),
    status,
    manager: b.manager && typeof b.manager === 'object' ? {
      name: String(b.manager.name || ''),
      phone: String(b.manager.phone || ''),
      email: String(b.manager.email || ''),
    } : { name: '', phone: '', email: '' },
    description: String(b.description || ''),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  const all = readJSON('supplier_warehouses.json');
  all.push(warehouse);
  writeJSON('supplier_warehouses.json', all);
  res.status(201).json(warehouse);
});
app.patch('/api/supplier/warehouses/:id', authMiddleware, (req, res) => {
  const all = readJSON('supplier_warehouses.json');
  const idx = all.findIndex(w => w.supplier_id === req.user.sub && w.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Warehouse not found.' });
  const b = req.body || {};
  const w = all[idx];
  if (b.name !== undefined) {
    const name = String(b.name).trim();
    if (!name) return res.status(400).json({ error: 'Warehouse name is required.' });
    w.name = name;
  }
  if (b.location !== undefined) {
    const location = String(b.location).trim();
    if (!location) return res.status(400).json({ error: 'Location is required.' });
    w.location = location;
  }
  if (b.status !== undefined) w.status = ['active', 'maintenance', 'inactive'].includes(b.status) ? b.status : w.status;
  if (b.capacity !== undefined) w.capacity = Math.max(0, Number(b.capacity) || 0);
  if (b.utilized !== undefined) w.utilized = Math.max(0, Number(b.utilized) || 0);
  if (b.description !== undefined) w.description = String(b.description || '');
  if (b.address && typeof b.address === 'object') {
    const cur = w.address || {};
    w.address = {
      line1: String(b.address.line1 ?? cur.line1 ?? ''),
      line2: String(b.address.line2 ?? cur.line2 ?? ''),
      city: String(b.address.city ?? cur.city ?? ''),
      state: String(b.address.state ?? cur.state ?? ''),
      country: String(b.address.country ?? cur.country ?? ''),
      zip: String(b.address.zip ?? cur.zip ?? ''),
    };
  }
  if (b.manager && typeof b.manager === 'object') {
    const cur = w.manager || {};
    w.manager = {
      name: String(b.manager.name ?? cur.name ?? ''),
      phone: String(b.manager.phone ?? cur.phone ?? ''),
      email: String(b.manager.email ?? cur.email ?? ''),
    };
  }
  w.updated_at = new Date().toISOString();
  writeJSON('supplier_warehouses.json', all);
  res.json(w);
});
app.delete('/api/supplier/warehouses/:id', authMiddleware, (req, res) => {
  const all = readJSON('supplier_warehouses.json');
  const next = all.filter(w => !(w.supplier_id === req.user.sub && w.id === req.params.id));
  if (next.length === all.length) return res.status(404).json({ error: 'Warehouse not found.' });
  writeJSON('supplier_warehouses.json', next);
  res.json({ ok: true });
});
app.get('/api/supplier/warehouses/:id/inventory', authMiddleware, (req, res) => {
  res.json([]);
});
app.get('/api/supplier/trends', authMiddleware, (req, res) => {
  res.json([]);
});

// ==================== SELLER ROUTES ====================

app.get('/api/seller/dashboard', authMiddleware, (req, res) => {
  const products = readJSON('products.json').filter(p => p.addedBy && p.addedBy.id === req.user.sub);
  res.json({ products_count: products.length, total_sales: 0, revenue: 0 });
});
app.get('/api/seller/promotions', authMiddleware, (req, res) => { res.json([]); });
app.post('/api/seller/promotions', authMiddleware, (req, res) => { res.json({ ok: true }); });
app.post('/api/seller/promotions/:id/status', authMiddleware, (req, res) => { res.json({ ok: true }); });
app.get('/api/seller/abandoned-carts', authMiddleware, (req, res) => { res.json([]); });
app.get('/api/seller/customer-insights', authMiddleware, (req, res) => { res.json({}); });

// ==================== MANUFACTURER ROUTES ====================

app.get('/api/manufacturer/hub', authMiddleware, (req, res) => {
  const hub = readJSON('manufacturer_hub.json');
  if (Object.keys(hub).length === 0) {
    const products = readJSON('products.json').filter(p => p.addedBy && p.addedBy.id === req.user.sub);
    hub.kpis = [
      { label: 'Total Throughput', value: products.length.toLocaleString() || '0', sub: 'units in catalog', icon: 'speed', capacity: 0, capacityLabel: 'Capacity', change: '0%', changeLabel: 'vs last month' },
      { label: 'Efficiency Rate', value: '—', sub: 'overall line efficiency', icon: 'bolt', width: 0, status: 'No data' },
      { label: 'QC Alerts', value: '0', sub: 'Active alerts require review', icon: 'warning', critical: '0 critical', dark: true },
      { label: 'Downtime', value: '0%', sub: 'last 30 days average', icon: 'block', improvement: '0% improvement', dark: true, red: true }
    ];
    hub.lines = [];
    hub.contracts = [];
    hub.shipments = { active: 0, subtitle: 'No active shipments', activity: [] };
    hub.landing = {
      heroTitle: 'Design Factory',
      heroSubtitle: 'End-to-end manufacturing control platform for modern bag production',
      stats: [
        { icon: 'store', label: 'Plants Online', value: '0', sub: 'across 4 continents' },
        { icon: 'precision_manufacturing', label: 'Active Production Lines', value: '0', sub: '24/7 operation' },
        { icon: 'inventory_2', label: 'Monthly Output', value: '0', sub: 'units manufactured' }
      ]
    };
  }
  res.json(hub);
});
app.get('/api/manufacturer/production', authMiddleware, (req, res) => {
  res.json(readJSON('manufacturer_production.json'));
});
app.get('/api/manufacturer/wholesale-orders', authMiddleware, (req, res) => {
  res.json(readJSON('manufacturer_orders.json'));
});
app.get('/api/manufacturer/logistics', authMiddleware, (req, res) => {
  res.json(readJSON('manufacturer_logistics.json'));
});
app.get('/api/manufacturer/qc', authMiddleware, (req, res) => {
  res.json(readJSON('manufacturer_qc.json'));
});
app.get('/api/manufacturer/contracts', authMiddleware, (req, res) => {
  res.json(readJSON('manufacturer_contracts.json'));
});
app.get('/api/manufacturer/analytics', authMiddleware, (req, res) => {
  res.json(readJSON('manufacturer_analytics.json'));
});
app.get('/api/manufacturer/equipment', authMiddleware, (req, res) => {
  res.json(readJSON('manufacturer_equipment.json'));
});
app.get('/api/manufacturer/equipment/:id/maintenance', authMiddleware, (req, res) => {
  const equipment = readJSON('manufacturer_equipment.json');
  const eq = equipment.find(e => e.id === req.params.id) || equipment.find(e => e.id === req.params.id.replace('eq', 'EQ'));
  res.json(eq ? (eq.maintenance_logs || []) : []);
});
app.get('/api/manufacturer/boms', authMiddleware, (req, res) => {
  res.json(readJSON('manufacturer_boms.json'));
});
app.get('/api/manufacturer/boms/:productId/cost', authMiddleware, (req, res) => {
  const boms = readJSON('manufacturer_boms.json');
  const items = boms.filter(b => b.product_id === req.params.productId);
  const totalCost = items.reduce((s, b) => s + (b.quantity_per_unit || 0) * (b.unit_cost || 0), 0);
  res.json({ product_id: req.params.productId, item_count: items.length, total_cost: Math.round(totalCost * 100) / 100 });
});
app.get('/api/manufacturer/scorecards', authMiddleware, (req, res) => {
  res.json(readJSON('manufacturer_scorecards.json'));
});

app.post('/api/manufacturer/logistics/shipments', authMiddleware, (req, res) => {
  try {
    const { origin, destination, status, eta } = req.body;
    if (!origin || !destination) return res.status(400).json({ error: 'origin and destination are required' });
    const logistics = readJSON('manufacturer_logistics.json');
    const statusColors = {
      'In Transit': 'bg-[#004be3]',
      'Customs Hold': 'bg-[#ff7936]',
      'Delayed': 'bg-[#b9002c]',
      'Delivered': 'bg-green-600'
    };
    const maxNum = logistics.telemetry.reduce((m, t) => {
      const n = parseInt(String(t.id).replace(/[^0-9]/g, ''), 10);
      return isNaN(n) ? m : Math.max(m, n);
    }, 8700);
    const newShipment = {
      id: `TRK-${maxNum + 1}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
      origin,
      destination,
      status: status || 'In Transit',
      statusColor: statusColors[status] || 'bg-[#004be3]',
      eta: eta || 'TBD'
    };
    logistics.telemetry.unshift(newShipment);
    logistics.activeRoutes = (logistics.activeRoutes || 0) + 1;
    writeJSON('manufacturer_logistics.json', logistics);
    res.status(201).json({ ok: true, shipment: newShipment });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/manufacturer/qc/records', authMiddleware, (req, res) => {
  try {
    const { batch, inspector, type } = req.body;
    if (!batch || !inspector) return res.status(400).json({ error: 'batch and inspector are required' });
    const qc = readJSON('manufacturer_qc.json');
    const maxNum = qc.records.reduce((m, r) => {
      const n = parseInt(String(r.id).replace('QC-', ''), 10);
      return isNaN(n) ? m : Math.max(m, n);
    }, 1000);
    const now = new Date();
    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const newRecord = {
      id: `QC-${maxNum + 1}`,
      batch,
      inspector,
      type: type || 'Final',
      date: req.body.date || `${MONTHS[now.getMonth()]} ${now.getDate()}`,
      result: 'Pending Review',
      resultIcon: 'hourglass_top',
      rColor: 'text-[#ff7936]',
      status: 'Review',
      sColor: 'bg-[#ff7936]'
    };
    qc.records.unshift(newRecord);
    writeJSON('manufacturer_qc.json', qc);
    res.status(201).json({ ok: true, record: newRecord });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/manufacturer/boms', authMiddleware, (req, res) => {
  try {
    const { product_id, material_name, material_sku, quantity_per_unit, unit, unit_cost, supplier_name, lead_time_days } = req.body;
    if (!product_id || !material_name) return res.status(400).json({ error: 'product_id and material_name are required' });
    const boms = readJSON('manufacturer_boms.json');
    const maxId = boms.reduce((m, b) => {
      const n = parseInt(String(b.id).replace('bom_', ''), 10);
      return isNaN(n) ? m : Math.max(m, n);
    }, 0);
    const newBomItem = {
      id: `bom_${String(maxId + 1).padStart(2, '0')}`,
      product_id,
      material_name,
      material_sku: material_sku || '',
      quantity_per_unit: Number(quantity_per_unit) || 0,
      unit: unit || 'pcs',
      unit_cost: Number(unit_cost) || 0,
      supplier_name: supplier_name || '',
      lead_time_days: Number(lead_time_days) || 0
    };
    boms.push(newBomItem);
    writeJSON('manufacturer_boms.json', boms);
    res.status(201).json({ ok: true, item: newBomItem });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ==================== MESSAGE ROUTES (Contact) ====================

app.post('/api/messages', optionalAuth, (req, res) => {
  try {
    const { sellerId, sellerName, product, productImage, message } = req.body;
    if (!sellerId || !message) return res.status(400).json({ error: 'sellerId and message are required' });
    const messages = readJSON('messages.json');
    const newMsg = {
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      sellerId,
      sellerName: sellerName || '',
      buyerId: req.user ? req.user.sub : 'anonymous',
      buyerName: req.user ? req.user.name : req.body.buyerName || 'Anonymous',
      buyerEmail: req.user ? req.user.email : req.body.buyerEmail || '',
      product: product || '',
      productImage: productImage || '',
      message: message,
      createdAt: new Date().toISOString(),
    };
    messages.push(newMsg);
    writeJSON('messages.json', messages);
    res.status(201).json({ ok: true, id: newMsg.id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/messages', authMiddleware, (req, res) => {
  const messages = readJSON('messages.json').filter(m => m.sellerId === req.user.sub);
  messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(messages);
});

// ==================== START ====================

// Repair the data files before serving anything, so every request sees a
// normalized users.json: emails lowercased, ids unique, roles coerced through
// resolveRole (which pins dev@hobags.com to 'developer'), duplicates merged, and
// the owner account guaranteed to exist.
normalizeUsers();
pruneResetTokens();

// Turn an unrouted path into a clean 404 JSON body instead of Express' HTML page.
app.use('/api', (req, res) => {
  res.status(404).json({ error: `Unknown API route: ${req.method} ${req.originalUrl}` });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err) {
    // A corrupt store is an operator problem, not a client error: say so instead
    // of the generic message, and never let the request proceed to a write.
    if (err instanceof DataCorruptError) {
      console.error(`[data] ${err.message} (${req.method} ${req.originalUrl})`);
      return res.status(500).json({ error: `Server data store ${err.filename} is unreadable. No data was changed.` });
    }
    console.error('[api] unhandled error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`HoBags API server running on http://localhost:${PORT}`);
  console.log(`[auth] developer console: ${DEVELOPER_CONSOLE_PATH} (${DEVELOPER_EMAIL})`);
  console.log(`[auth] password hashes: ${IS_PRODUCTION ? 'scrypt' : 'scrypt (legacy sha256 upgraded on login)'}`);
});
