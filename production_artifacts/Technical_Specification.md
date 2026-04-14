# 📋 Technical Specification — Evee v1.0 (MVP)
> Author: @pm | Date: 2026-04-14 | Status: AWAITING USER APPROVAL

## Stitch Screens (live)
- Home Hub: `8857a240b97f44bbbebf8ab511c67e79`
- Menu Scan Results: `a418523fda4e44ee897fdfa658b2fe03`
- Food Story Insights: `de959d16a0cb45efb436e125319d2de6`
- Design System Asset: `6a94fc951a12447d86a76b34d5d0ff28`
- Stitch Project: `2040866908212387064`

## Design System
"Evee Sunset Intelligence" — OLED dark (#131315), Ember orange (#FF6B35), Indigo (#6C63FF), Plus Jakarta Sans + Be Vietnam Pro fonts, Tonal carving, Glassmorphism.

## Tech Stack
- Mobile: React Native (Expo SDK 51)
- Backend: FastAPI Python 3.12
- AI: Gemini 1.5 Pro (Vision + Reasoning)
- ASR: Google Cloud STT v2
- DB: PostgreSQL 16
- Auth: Firebase Auth
- Notifications: FCM
- Deploy: Cloud Run

## MVP Features (0–6 months)
1. Smart Menu Scan (photo → ranked recommendation)
2. Vernacular Voice Logging (Hindi/English/Hinglish)
3. 3-Tap Bayesian Onboarding
4. Contextual Pre-Meal Nudge (FCM)
5. Budget-Aware Recommendations
6. Meal History timeline
7. Weekly Food Story (basic)

## API Endpoints
- POST /api/v1/scan
- POST /api/v1/log/voice
- POST /api/v1/log/text
- GET /api/v1/nudge/current
- GET /api/v1/insights/weekly
- GET/PATCH /api/v1/users/me
- POST /api/v1/users/onboard

## Open Questions (need user input)
1. Platform priority: iOS+Android simultaneously or iOS first?
2. Gemini API Key: existing or stub for now?
3. Voice: Hindi+English MVP — confirm or add Tamil?
4. Restaurant data: mock static data or basic scraper?
