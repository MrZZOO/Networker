/* Networker intake service.
 *
 * One job: accept a listing application, validate it, store it. Nothing here is
 * public except POST /v1/applications and the health check — reading applications
 * needs the admin token, because the rows hold real people's names, emails and a
 * description of who they can reach.
 *
 * Shape follows x402 Agora/08-public-api: Express 4, CommonJS, `node server.js`,
 * bound to 127.0.0.1 behind nginx, run under pm2. Deliberately NOT tied to any
 * cloud — it runs on an Oracle Always Free ARM box, a Contabo VPS, or a laptop.
 */

require('dotenv').config()

const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')
const { validateApplication } = require('./validate')

const PORT = process.env.PORT || 6040
const HOST = process.env.HOST || '127.0.0.1'
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || null

const CORS_ORIGINS = (process.env.CORS_ORIGINS || 'http://localhost:5195,http://localhost:5196')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set. Copy .env.example to .env and fill it in.')
  process.exit(1)
}
if (!ADMIN_TOKEN) {
  // Refuse to boot rather than silently exposing the review endpoint. A missing
  // token is a deployment mistake, not a mode.
  console.error('ADMIN_TOKEN is not set. Refusing to start with an unprotected admin route.')
  process.exit(1)
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Managed Postgres almost always wants TLS; a local socket does not.
  ssl: process.env.PGSSL === 'disable' ? false : { rejectUnauthorized: false },
  max: 4,
  idleTimeoutMillis: 30_000,
})

const app = express()
app.disable('x-powered-by')
// Behind nginx: trust one proxy hop so req.ip is the real client, not the proxy.
app.set('trust proxy', 1)
app.use(express.json({ limit: '32kb' }))
app.use(
  cors({
    origin: CORS_ORIGINS,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86_400,
  })
)

/* ── Rate limiting ──────────────────────────────────────────────────────────
   In-memory sliding window, per IP. Good enough for one process behind nginx and
   costs no dependency. If this ever runs on more than one instance it stops being
   accurate — move it to Postgres or Redis at that point, do not just raise the
   limit and hope. */
const WINDOW_MS = 60 * 60 * 1000
const MAX_PER_WINDOW = 5
const hits = new Map()

function rateLimited(ip) {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS)
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent)
    return true
  }
  recent.push(now)
  hits.set(ip, recent)
  return false
}

// Keep the map from growing without bound on a long-lived process.
setInterval(() => {
  const now = Date.now()
  for (const [ip, times] of hits) {
    const recent = times.filter((t) => now - t < WINDOW_MS)
    if (recent.length) hits.set(ip, recent)
    else hits.delete(ip)
  }
}, WINDOW_MS).unref()

const wrap = (fn) => (req, res) =>
  Promise.resolve(fn(req, res)).catch((err) => {
    console.error(`[${req.method} ${req.path}]`, err)
    // Never leak a database error to the browser.
    if (!res.headersSent) res.status(500).json({ ok: false, error: 'Something went wrong.' })
  })

function requireAdmin(req, res, next) {
  const header = req.get('authorization') || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token || token !== ADMIN_TOKEN) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' })
  }
  next()
}

/* ── Routes ─────────────────────────────────────────────────────────────── */

app.get('/v1/health', (req, res) => {
  res.json({ ok: true, uptime: Math.round(process.uptime()) })
})

// Public. The only write anyone can make without a token.
app.post(
  '/v1/applications',
  wrap(async (req, res) => {
    if (rateLimited(req.ip)) {
      return res.status(429).json({ ok: false, error: 'Too many submissions. Try again later.' })
    }

    const result = validateApplication(req.body)
    if (!result.ok) return res.status(400).json({ ok: false, error: result.error })

    const r = result.record
    try {
      await pool.query(
        `insert into applications
           (display_name, headline, contact_email, contact_handle, offers, source_ip)
         values ($1, $2, $3, $4, $5::jsonb, $6)`,
        [r.display_name, r.headline, r.contact_email, r.contact_handle, JSON.stringify(r.offers), req.ip]
      )
    } catch (err) {
      // 23505 = unique violation, i.e. the one-pending-per-email index.
      if (err.code === '23505') {
        return res
          .status(409)
          .json({ ok: false, error: 'You already have an application pending. We will be in touch.' })
      }
      throw err
    }

    res.status(201).json({ ok: true })
  })
)

// Admin. Review queue.
app.get(
  '/v1/applications',
  requireAdmin,
  wrap(async (req, res) => {
    const status = ['pending', 'approved', 'rejected'].includes(req.query.status)
      ? req.query.status
      : 'pending'
    const { rows } = await pool.query(
      `select id, created_at, display_name, headline, contact_email, contact_handle,
              offers, status, review_note
         from applications
        where status = $1
        order by created_at desc
        limit 200`,
      [status]
    )
    res.json({ ok: true, count: rows.length, applications: rows })
  })
)

// Admin. Mark one reviewed.
app.post(
  '/v1/applications/:id/status',
  requireAdmin,
  wrap(async (req, res) => {
    const { status, note } = req.body || {}
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ ok: false, error: 'status must be approved, rejected or pending' })
    }
    const { rowCount } = await pool.query(
      `update applications set status = $1, review_note = $2 where id = $3`,
      [status, typeof note === 'string' ? note.slice(0, 1000) : null, req.params.id]
    )
    if (!rowCount) return res.status(404).json({ ok: false, error: 'Not found' })
    res.json({ ok: true })
  })
)

app.use((req, res) => res.status(404).json({ ok: false, error: 'Not found' }))

const server = app.listen(PORT, HOST, () => {
  console.log(`networker-api listening on ${HOST}:${PORT}`)
  console.log(`CORS origins: ${CORS_ORIGINS.join(', ')}`)
})

for (const sig of ['SIGTERM', 'SIGINT']) {
  process.on(sig, () => {
    server.close(() => pool.end().then(() => process.exit(0)))
  })
}
