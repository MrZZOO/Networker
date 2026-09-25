# Networker

A market for access. People list the networks they can genuinely reach — VCs,
angels, exchanges, KOLs, founders, allocators — say how they know them and what an
introduction actually gets you, and name a fee. The buyer pays to *ask*. The lister
keeps the absolute right to refuse, and a refusal refunds in full.

This repo is the v1 landing page. Frontend only: no backend, no chain, no wallet.

## Run it

```bash
npm install
npm run dev        # http://localhost:5195   (strictPort — a collision fails loudly)

npm run build
npm run preview    # http://localhost:5196   serves the real dist/
```

Workspace port registry lives in the comment at the top of `vite.config.js`.

## The one rule this codebase is built around

**The page may state the RULES of the market. It may never state the STATE of the
market until that state is real.**

Networker has zero listings, zero users and zero completed introductions. The
reference design it is built from sells on social proof — "250+ satisfied users" and
a stack of faces. That slot is unfillable and unfakeable, so v1 keeps the geometry
and swaps the payload: the same pill in the same corner carries a mechanic
("Introductions at your discretion") instead of a count. Where the reference shows
faces, this shows **vacancies** — dashed rings and dashed "open slot" cards on the
same grid a real card would sit on. A dashed ring claims nothing.

### `src/config.js` is the gate

Every project-specific claim reads from there. Filled means founder-declared spec.
`null` or `[]` means not real yet, and a null slot renders one of exactly three
things — nothing, a spec-true sentence, or a styled vacancy. Never a plausible
number.

In dev, a corner banner lists which slots are still empty. It is compiled out of
production; `npm run preview` should show no banner at all.

**Hard rule:** listings are records about real people. Never add a listing for
anyone who has not personally agreed to be listed — not as an example, not as a
placeholder, not greyed out. An empty directory is the correct state until real
people sign up.

## Layout

```
src/
├── config.js        THE GATE — every claim on the page
├── lib/
│   ├── types.js     shapes + enums only; exports NO records
│   ├── tiers.js     the tier ladder
│   ├── networks.js  the curated network list + the custom "Other" path
│   ├── channels.js  LinkedIn / X / Telegram / in person
│   ├── geometry.js  the hero's radial connector maths + the plate PRNG
│   ├── format.js    formatters that return null rather than invent
│   └── intake.js    where "List your network" actually goes
├── components/      one per page section, + common/ primitives
├── pages/Home.jsx   the landing page
└── styles/          tokens.css (custom properties) + editorial.css (classes)
```

## The model, in one paragraph

A person does not have one price, they have a **ladder**. The same lister might open
their builder network free and charge heavily for a tier-1 fund partner. So the fee
lives on the **offer**, not the listing. Each offer carries the network, its tier,
`provenance` (how they know it — a claim about the past), `deliverable` (what they
can actually do — a promise about the future, and what a refund is measured
against), and the fee, where `0` is legal and renders "Free".

## Listing applications

`/list` is a real, working intake. It creates an **application**, not a listing —
nothing is published until a person reviews it. On a marketplace whose entire value
is signal quality, an open unmoderated form fills the directory with noise, and a
public directory is hard to un-publish. Reviewing also means no user accounts in v1:
nobody needs a password to ask.

The submit layer is backend-agnostic on purpose (`src/lib/applications.js`), because
the backend choice was still open when it was written. Set **one** of these in
`.env` — see `.env.example`:

```
VITE_API_URL=http://localhost:6040        # our own service, in server/
# or
VITE_SUPABASE_URL=...                     # Supabase, if a project has headroom
VITE_SUPABASE_ANON_KEY=...
```

`VITE_API_URL` wins if both are set. With neither, the form still renders and
validates but the submit button is disabled with its reason shown — never a form
that silently swallows what someone typed.

Two backends ship, and their security models differ in a way worth understanding:

- **`server/`** — Express + Postgres. The browser never touches the database; the
  service holds the credentials and enforces the rules. Runs anywhere, including
  an Oracle Always Free ARM instance. See `server/README.md`.
- **`supabase/migrations/`** — the browser talks to PostgREST directly, so
  row-level security is the whole defence: anon may INSERT, anon may **not**
  SELECT. Never grant it SELECT; the anon key is public and the rows hold personal
  data.

Validation exists twice, deliberately: `src/lib/validate.js` so people see mistakes
as they type, and `server/validate.js` as the boundary that cannot be bypassed.
**Keep them in step.**

## Known-deferred

The `/directory` route (it needs real listings to show), auth, the token, escrow,
and verification. On verification specifically: a connection-graph API almost
certainly does not exist, and nothing here should be built as though it will appear.
What is buildable is proof of account ownership, then on-platform track record, then
vouching. Escrow must never live in the application database — it belongs on-chain.
See `TODO_Networker.txt` in the workspace root.
