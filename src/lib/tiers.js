/* ─── The tier ladder ────────────────────────────────────────────────────────
   A tier describes WHO IS BEING REACHED, not who is doing the reaching. One
   person holds a whole ladder: they might open their builder network free and
   charge heavily for a tier-1 fund partner. That is why the fee lives on the
   OFFER (lib/types.js) and not on the listing.

   Order is ascending by how gate-kept the room is — used for sorting and for the
   ladder's left-to-right reading order. */

export const TIERS = [
  {
    id: 'open',
    label: 'Open',
    who: 'An open door. Anyone who asks well, usually at no cost.',
    // The Open tier carries the ink fill in the ladder: "some of this is free" is
    // the most disarming thing Networker can say, so it gets the focal position.
    focal: true,
  },
  {
    id: 'community',
    label: 'Community',
    who: 'Rooms you are in — group chats, dinners, working circles.',
    focal: false,
  },
  {
    id: 'operator',
    label: 'Operator',
    who: 'People who build and run things, reachable because you have worked together.',
    focal: false,
  },
  {
    id: 'inner',
    label: 'Inner',
    who: 'Gate-kept. Partners, principals, the people whose inbox is closed.',
    focal: false,
  },
]

export const TIER_IDS = TIERS.map((t) => t.id)

export const getTier = (id) => TIERS.find((t) => t.id === id) ?? null
