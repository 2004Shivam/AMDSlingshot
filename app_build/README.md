# Evee — app_build

This directory contains all deployable Next.js PWA code.

## Quick start

```bash
cp .env.example .env.local   # Add your GEMINI_API_KEY
npm install
npm run dev                  # http://localhost:3000
```

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | ✅ Yes | [Get free key](https://aistudio.google.com/apikey) |
| `NEXT_PUBLIC_SUPABASE_URL` | Phase 2 | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Phase 2 | Supabase anon key |
| `NEXT_PUBLIC_FIREBASE_*` | Phase 2 | Firebase config |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm start` | Run production build locally |

See root [README.md](../README.md) for full documentation.
