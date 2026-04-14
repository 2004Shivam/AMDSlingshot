# 🔬 Research Memo — Evee Tech Stack
> Author: @researcher | Date: 2026-04-14 | **Revised: 2026-04-14** | Consumer: @architect, @pm
> ⚠️ **Rev 2**: PWA (Next.js) replaces React Native. `gemini-2.5-flash` replaces deprecated `gemini-1.5-pro`.

---

## Recommendation Summary

Evee is a **PWA-first, LLM-first app** targeting urban India. Deployable as an installable web app that behaves like a native mobile app. The stack must optimize for:
1. Fast camera/voice capture
2. Sub-10s LLM inference latency
3. Indian vernacular language support
4. Low-cost infra (pre-seed stage)
5. Web + Mobile parity (single codebase preferred at MVP stage)

---

## Frontend

### ✅ Recommended: Next.js 15 (PWA — App Router)
- **Why**: Single codebase deployable as a Progressive Web App — installable on Android/iOS homescreen, behaves like a native app. Eliminates app store dependency. Camera (`getUserMedia`), microphone (`MediaRecorder`), and push notifications (Web Push + FCM web SDK) all available via standard browser APIs. Stitch design tokens translate 1:1 to CSS — zero visual rework.
- **PWA Layer**: `next-pwa` package + `manifest.json` + service worker for offline capability and install prompt.
- **Alternatives considered**: React Native/Expo (not viable — requires native build toolchain + app store); Flutter Web (poor PWA support); Vite SPA (less SSR/SEO capability).
- **Key libraries**: `next`, `next-pwa`, `zustand` (state), `@tanstack/react-query` (async data), CSS Modules (vanilla CSS from design tokens), `framer-motion` (micro-animations).

---

## Backend

### ✅ Phase 1: Next.js API Routes → Phase 2+: FastAPI (Python 3.12)
- **Phase 1 (Now)**: Use Next.js built-in API routes (`/app/api/`) to keep the entire app in one deploy. Lower infra complexity, faster iteration. All Gemini calls happen server-side — API key never exposed to browser.
- **Phase 2 migration**: Extract to standalone FastAPI service on Cloud Run when Python-specific libraries are needed (audio processing, STT, advanced LLM chaining).
- **FastAPI key libraries** (Phase 2+): `fastapi`, `uvicorn`, `pydantic v2`, `sqlalchemy` (async), `alembic` (migrations), `python-jose` (JWT), `celery` + `redis` (notification queue).

---

## LLM / AI Layer

### ✅ Recommended: `gemini-2.5-flash` (Google AI Studio API — FREE TIER)
- **Model ID**: `gemini-2.5-flash` (stable release — NOT preview)
- **Why**: `gemini-1.5-pro` is **deprecated and removed**. `gemini-2.5-flash` is the current stable, production-ready multimodal model. Supports vision (food photo analysis), text reasoning, and audio understanding in one model. Free tier via Google AI Studio API key. Best price-performance in the 2.5 family.
- **Deprecated/Avoided**: `gemini-1.5-pro` ❌, `gemini-2.0-flash` ❌ (deprecated), `gemini-3.x` ❌ (all still Preview status — unstable for production).
- **SDK**: `@google/generative-ai` (JS/TS) — called from Next.js API routes server-side only. API key stored in `.env.local`, never sent to browser.
- **Voice ASR (Phase 2)**: Gemini 2.5 Flash supports audio input natively — send audio blob directly to Gemini instead of needing a separate STT service. Fallback: Google Cloud Speech-to-Text v2 for fine-grained multilingual (Hindi, Hinglish).
- **Prompt Engineering**: System prompt encodes Indian dietary culture, regional cuisine, behavioral psychology framing — this is the product's core IP.

---

## Database

### ✅ Recommended: PostgreSQL 16 (via Supabase or Cloud SQL)
- **Why**: Relational for user profiles + meal history; can store JSONB for flexible LLM-generated meal analysis blobs; pgvector extension for future semantic search on meal history.
- **Cache layer**: Redis (Cloud Memorystore) for session context windows and notification scheduling.

---

## Auth

### ✅ Firebase Auth
- **Why**: Already in user environment (confirmed via MCP). Supports Google Sign-In, phone OTP (critical for India), anonymous auth for cold-start. Free tier is generous.

---

## Push Notifications

### ✅ Firebase Cloud Messaging (FCM)
- Already in ecosystem. Supports iOS + Android from single API. Required for pre-meal contextual nudges.

---

## Storage

### ✅ Firebase Storage / GCS
- For meal photo uploads before LLM processing. Presigned URLs for secure direct upload from mobile.

---

## Deployment

### ✅ Google Cloud Run
- Stateless FastAPI backend. Auto-scales to zero (cost-efficient at pre-seed). Confirmed in user's deployment pipeline.

---

## Key Risk Flags

| Risk | Mitigation |
|---|---|
| Gemini 2.5 Flash vision latency > 10s for menu photos | Pre-compress images client-side (`canvas` resize to 1024px) before sending; stream response with SSE |
| PWA camera on iOS Safari | `getUserMedia` supported on iOS 16.4+; test on Safari explicitly; add fallback file upload |
| Web Push notifications on iOS | Requires iOS 16.4+ + user must add PWA to homescreen first; show onboarding prompt |
| Gemini API free tier rate limits | 15 RPM on free tier — sufficient for MVP; upgrade to paid if needed |
| Swiggy/Zomato API — no official public API | Phase 1: mock static restaurant chips; Phase 2: negotiate or scrape |
| Hindi/multilingual voice (Phase 2) | Gemini 2.5 Flash supports audio natively — send raw audio blob, no STT service needed in Phase 1 |
