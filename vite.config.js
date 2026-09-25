import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Networker — a marketplace for access to people's networks.
// Frontend-only in v1: no backend, no proxy, no chain. CONFIG.API_URL is null and
// the app makes no network calls at all, so unlike the Agora/MTF frontends there is
// no /api rewrite to mirror in dev.
//
// Workspace port registry: 5173 x402-agents · 5174 agora dashboard · 5175 agora-frontend
// · 5176 agora preview · 5180 MTF · 5181 hyperbots · 5183 MTFBOTS · 5185/5186 popeye.fun
// · 5190/5191 Spinach RWA → this project takes 5195 (dev) + 5196 (preview), both
// strictPort so a collision fails loudly instead of silently binding elsewhere.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5195,
    strictPort: true,
  },
  // `vite preview` serves the real production build (dist/) for a pre-deploy eyeball.
  // Local-only; Vercel ignores this block and serves dist/ with vercel.json instead.
  preview: {
    port: 5196,
    strictPort: true,
  },
})
