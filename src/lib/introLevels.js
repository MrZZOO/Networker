/* ─── What kind of introduction is on offer ─────────────────────────────────
   "I know them" is not a product. What a buyer pays for is the STRENGTH of the
   introduction, and these four are genuinely different goods at genuinely
   different prices. Making it a choice rather than free text lets a buyer
   compare two listings, and stops a lister implying more than they mean.

   Ordered strongest first, which is also roughly most to least expensive. */

export const INTRO_LEVELS = [
  {
    id: 'vouch',
    label: 'Warm intro, with a vouch',
    who: 'I introduce you and say you are worth their time.',
  },
  {
    id: 'direct',
    label: 'Direct intro, no vouch',
    who: 'I make the connection. The opinion is yours to earn.',
  },
  {
    id: 'forward',
    label: 'I forward your message',
    who: 'It reaches them from me, so it gets read. No promise beyond that.',
  },
  {
    id: 'inperson',
    label: 'In person',
    who: 'I introduce you at a room I am already in.',
  },
]

export const INTRO_LEVEL_IDS = INTRO_LEVELS.map((l) => l.id)

export const getIntroLevel = (id) => INTRO_LEVELS.find((l) => l.id === id) ?? null
