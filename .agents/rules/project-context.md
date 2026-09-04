# TiT Pocket Super App & thangit.com — Context & Rules

## Project Identity
- **Repository:** `thangit.com` (Owner: Nguyễn Đức Thắng / Thắng IT)
- **Primary Domain:** `https://thangit.com` (Cloudflare Pages from `origin/main`)
- **PWA Name:** `TiT` (Display name: `Nguyễn Đức Thắng (Thắng IT)`)
- **Memory File:** Refer to root `MEMORY.md` for complete technical details, API list, and module documentation.

## Core Rules
1. **100% Static & Client-Side:** No server-side dependencies, no databases, zero recurring cost ($0/month).
2. **APIs:** Must only use free, CORS-open, public APIs with zero API-key requirement (Binance v3, Open-Meteo, ESPN, Open ExchangeRate, VietQR).
3. **PWA Standalone Integrity:** Maintain valid service worker (`sw.js`), `manifest.json`, and offline capability for calculation/lunar/QR features.
4. **Deploy Workflow:** Every feature is tested with `node -c`, then committed and pushed to `main` for instant Cloudflare Pages edge deployment.
