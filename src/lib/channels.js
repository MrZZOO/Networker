/* ─── Connection channels ────────────────────────────────────────────────────
   Where an introduction actually happens. The lister chooses which of these they
   open, per offer — someone may take a Telegram intro but never an in-person one.

   Icons are inline SVG path data (24×24, stroke-based, currentColor) so they
   inherit from whatever pill they sit in and need no icon dependency. */

export const CHANNELS = [
  {
    id: 'linkedin',
    label: 'LinkedIn',
    // Simplified 'in' mark, drawn as strokes to match the rest of the set.
    paths: ['M4 9v11', 'M4 4.5v.01', 'M10 20V9', 'M10 14a4 4 0 0 1 8 0v6'],
  },
  {
    id: 'x',
    label: 'X',
    paths: ['M4 4l16 16', 'M20 4L4 20'],
  },
  {
    id: 'telegram',
    label: 'Telegram',
    paths: ['M21 5L3 11.5l5.2 1.8L19 7l-8 8.2V21l3.1-4.1', 'M8.2 13.3L19 7'],
  },
  {
    id: 'irl',
    label: 'In person',
    paths: [
      'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
      'M3 20c0-3 2.7-5 6-5s6 2 6 5',
      'M17 7.5a2.5 2.5 0 0 1 0 5',
      'M18 15.5c2 .7 3 2.2 3 4.5',
    ],
  },
]

export const CHANNEL_IDS = CHANNELS.map((c) => c.id)

export const getChannel = (id) => CHANNELS.find((c) => c.id === id) ?? null

/* A listing's channel set is the union of its offers' channels — an offer may open
   fewer channels than the person does overall, never more. */
export function channelsForListing(listing) {
  if (!listing?.offers?.length) return []
  const seen = new Set()
  for (const offer of listing.offers) {
    for (const id of offer.channels ?? []) seen.add(id)
  }
  return CHANNEL_IDS.filter((id) => seen.has(id))
}
