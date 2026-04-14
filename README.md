# Evee — AI Food Intelligence
> Intervention-first food companion for urban India

## Project Structure
```
app_build/          ← All deployable code (Next.js PWA)
production_artifacts/ ← Specs, contracts, reports
.agents/            ← Pipeline agent definitions
```

## Stack
- **Frontend**: Next.js 15 + PWA (installable on Android/iOS)
- **AI**: Gemini 2.5 Flash (`gemini-2.5-flash`)  
- **Database**: Supabase (PostgreSQL)
- **Auth**: Firebase Auth
- **Deploy**: Firebase Hosting + GCP Cloud Run

## Getting Started

```bash
cd app_build
cp .env.example .env.local   # Fill in your keys
npm install
npm run dev                  # http://localhost:3000
```

## Environment Variables
See `app_build/.env.example` for required variables.

## Deployment
See `production_artifacts/Technical_Specification.md` for full GCP deployment guide.
