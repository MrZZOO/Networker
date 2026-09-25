# networker-api

Accepts listing applications. One public route, two admin routes, one table.

Express 4 + CommonJS + Postgres, following the same shape as
`x402 Agora/08-public-api`: `node server.js`, bound to `127.0.0.1` behind nginx,
run under pm2.

**Deliberately not tied to any cloud.** It runs on an Oracle Always Free ARM
instance, a Contabo box, or a laptop. Nothing in here is Oracle-specific — that
choice is a deployment detail, not an architecture.

## Routes

```
GET  /v1/health                      public   { ok, uptime }
POST /v1/applications                public   submit an application
GET  /v1/applications?status=pending admin    the review queue
POST /v1/applications/:id/status     admin    { status, note }
```

Admin routes need `Authorization: Bearer $ADMIN_TOKEN`. The service **refuses to
boot** without `ADMIN_TOKEN` set — a missing token is a deployment mistake, not a
mode, and the alternative is silently publishing everyone's email address.

## Run it

```bash
cp .env.example .env     # fill in DATABASE_URL and ADMIN_TOKEN
npm install
npm run migrate          # applies schema.sql; idempotent, safe to re-run
npm start
```

Generate the admin token with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then point the frontend at it — in the repo root `.env`:

```
VITE_API_URL=http://localhost:6040
```

and rebuild. The form's submit button is disabled with a visible reason until that
variable exists, so you will see immediately whether it took.

## Security model — and how it differs from the Supabase version

This is the part worth reading before changing anything.

The Supabase variant (`../supabase/migrations/0001_applications.sql`) had the
browser talk to the database directly. The anon key ships inside the JS bundle and
is readable by anyone, so **row-level security was the only thing** between a
visitor and every applicant's name, email and network. Insert allowed, select
denied, enforced in Postgres.

Here the browser never touches Postgres. It talks to this service, which holds the
credentials. So the rules live in code instead:

- `POST /v1/applications` is public, rate limited, and validated in `validate.js`
- everything that reads applications needs the admin token
- `status` and `feeCurrency` are pinned server-side — a crafted request cannot post
  itself in pre-approved, or claim its fee was quoted in something other than USD

`validate.js` is a **port** of `src/lib/validate.js`, not an import — the browser
copy is ESM inside Vite, this one is CommonJS. The browser copy is a convenience so
people see mistakes as they type. This one is the boundary. **Keep them in step.**

Rate limiting is an in-memory sliding window, 5 submissions per IP per hour. That
is accurate for one process behind nginx and costs no dependency. If this ever runs
as more than one instance it silently stops being accurate — move it to Postgres or
Redis at that point rather than raising the limit and hoping.

## Deploying on Oracle Cloud Always Free

### Two things that bite people, before you start

**Your home region is permanent.** It is picked during signup and cannot be changed
afterwards. From Bali, pick **Singapore** — nearest, and it is where the Agora box
already lives.

**"Out of host capacity" is the normal ARM experience, not a fault.** Free-tier
Ampere A1 is heavily contended. Mitigations, in order of how well they work:
prefer a region with 3 availability domains; APAC and EU regions (Singapore, Tokyo,
Frankfurt) generally provision far faster than US ones; ask for a smaller shape
(1 OCPU / 6 GB is plenty here) since small requests fit in gaps large ones cannot;
and retry — capacity frees up as others release instances.

If ARM will not provision at all, the Always Free **AMD** `VM.Standard.E2.1.Micro`
is almost always available. It is 1 GB RAM, which is tight for Postgres plus Node
but workable at this volume with a 2 GB swap file. Treat it as the fallback, not
the plan.

### Allowances (verify before planning around them)

Oracle [halved the Always Free ARM limit](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier.htm)
from 4 OCPU / 24 GB to **2 OCPU / 12 GB** on 15 June 2026 with no announcement —
people found out when their instances stopped. Also included: 2 AMD micro VMs,
200 GB block storage, and 2 Autonomous Databases at 20 GB each.

This service needs a fraction of it.

### Signup

[signup.oraclecloud.com](https://signup.oraclecloud.com/) ·
[free tier docs](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier.htm) ·
[FAQ](https://www.oracle.com/cloud/free/faq/)

A credit card is required for identity verification. You are not charged unless you
explicitly upgrade to a paid account; expect a temporary authorization hold that
clears in a few days. **Virtual, single-use and prepaid cards are rejected**, as are
debit cards that need a PIN.

### Instance

Compute → Instances → Create instance.

- Image: **Ubuntu 22.04** (or 24.04)
- Shape: **Ampere A1 Flex**, 1 OCPU / 6 GB — small enough to slip past capacity
  pressure, ample for this service
- Networking: assign a public IPv4
- SSH: upload your own public key, or let Oracle generate one and **download the
  private key at that moment** — it is not shown again

Then Networking → your VCN → security list → ingress rules. Open **22** only for
now. Do not open 6040: the service binds `127.0.0.1` and is reached through an SSH
tunnel in development, and through nginx later.

### Install

```bash
ssh -i /path/to/key ubuntu@<PUBLIC_IP>

sudo apt update && sudo apt install -y postgresql nginx git
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm i -g pm2

sudo -u postgres psql -c "create role networker login password 'STRONG_PASSWORD';"
sudo -u postgres psql -c "create database networker owner networker;"
```

Then the service:

```bash
git clone <repo> ~/networker && cd ~/networker/server
cp .env.example .env     # DATABASE_URL, ADMIN_TOKEN, CORS_ORIGINS
npm ci
npm run migrate
pm2 start server.js --name networker-api && pm2 save && pm2 startup
```

### Talking to it from a dev laptop

Do **not** open 6040 to the internet for this. Tunnel it:

```bash
ssh -i /path/to/key -L 6040:127.0.0.1:6040 ubuntu@<PUBLIC_IP>
```

Then in the frontend's `.env`:

```
VITE_API_URL=http://localhost:6040
```

Nothing is exposed, no firewall change, no TLS needed, and `CORS_ORIGINS` already
allows `http://localhost:5195`.

### Going public, later

Needs a domain, which Networker does not have yet. When it does: point an `api.`
subdomain at the instance, open 80/443, `proxy_pass http://127.0.0.1:6040`, then
`sudo certbot --nginx`. Set `CORS_ORIGINS` to the real frontend origin, and **add
that API origin to `connect-src` in the frontend's `vercel.json`** — the CSP is
`'self'` only, so a cross-origin call is blocked until you do, and it will look
like the form silently failing.

### Why not Autonomous Database

It is **Oracle DB, not Postgres**. This service uses `pg` and Postgres-specific SQL
(`jsonb`, `gen_random_uuid`, a partial unique index), so that route means rewriting
`schema.sql` and swapping the driver for no benefit. Its ORDS REST layer is not a
Supabase substitute either — anonymous INSERT needs a hand-written PL/SQL handler
and ORDS roles are not database roles. Run Postgres on the compute instance.

## Reviewing applications

```bash
curl -s https://api.example.com/v1/applications?status=pending \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq

curl -s -X POST https://api.example.com/v1/applications/$ID/status \
  -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -d '{"status":"approved","note":"confirmed by call"}'
```

Approving does **not** publish anything yet — there is no listings table. It marks
the application reviewed so a human can transcribe it into a listing. That step is
deliberate while the directory is small: the first listings set the market's prices
and are worth getting right by hand.
