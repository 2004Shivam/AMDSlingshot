# Skill: Research Stack

## Agent
`@researcher` (sub-agent of `@pm`)

## Objective
Rapidly survey the technology landscape and produce an intelligence memo to inform the spec and architecture.

## Instructions
1. **Analyze the idea**: Extract the core domain (e.g., e-commerce, real-time chat, data dashboard, AI SaaS).
2. **Recommend a tech stack** with justification for each layer:
   - **Frontend**: (e.g., React + Vite, Next.js, SvelteKit, plain HTML/JS)
   - **Backend**: (e.g., Node/Express, FastAPI, Django, Firebase Functions)
   - **Database**: (e.g., Postgres, Firestore, SQLite, MongoDB)
   - **Authentication**: (e.g., Firebase Auth, Auth0, Supabase Auth, JWT)
   - **Hosting/Infra**: (e.g., Firebase Hosting, Vercel, Cloud Run, Railway)
3. **List key libraries** for each layer (e.g., Zod for validation, Tanstack Query for data fetching).
4. **Flag risks**: Note any known complexity traps for this idea.
5. **Save output** to `production_artifacts/research_memo.md`.
6. **Notify**: Report "Research complete. Memo saved." so @pm and @architect can proceed.
