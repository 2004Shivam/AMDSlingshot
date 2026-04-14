# 🏗️ Architecture Blueprint — Evee
> Author: @architect | Date: 2026-04-14 | Consumer: @frontend, @backend, @pm

---

## System Overview

Evee is a **mobile-first, LLM-orchestrated food intelligence platform**. The architecture is designed around three non-negotiable principles:

1. **Zero-Friction Capture**: Every input path (camera, voice, text) must be < 3 taps deep.
2. **Sub-10s Intelligence**: The LLM pipeline from photo/voice capture to ranked recommendation must complete in < 10 seconds.
3. **Intervention-First**: The app's primary mode is proactive (push to user) not reactive (user queries app).

---

## High-Level Architecture

```mermaid
graph TD
    subgraph Mobile App [React Native - Expo]
        A[Home Screen - Intervention Hub]
        B[Camera Module - Menu Scan]
        C[Voice Module - Meal Log]
        D[Insights Screen - Food Story]
        E[Profile / Settings]
    end

    subgraph API Gateway [FastAPI - Cloud Run]
        F[Auth Middleware - Firebase JWT]
        G[/api/v1/scan - Vision Pipeline]
        H[/api/v1/log - Voice+Text Pipeline]
        I[/api/v1/nudge - Contextual Recommendation]
        J[/api/v1/insights - Behavioral Analysis]
        K[/api/v1/user - Profile CRUD]
    end

    subgraph AI Layer
        L[Gemini 1.5 Pro - Vision + Reasoning]
        M[Google STT v2 - Hindi/EN ASR]
        N[LLM Context Builder - System Prompt Engine]
    end

    subgraph Data Layer
        O[(PostgreSQL - User Profiles + Meal Events)]
        P[(Redis - Session Context Cache)]
        Q[Firebase Storage - Photo Upload]
    end

    subgraph Notification Engine
        R[Celery Worker - Scheduler]
        S[FCM - Push Delivery]
    end

    A --> B & C & D
    B --> G
    C --> H
    D --> J
    G & H & I & J --> F
    F --> L
    L --> N
    N --> O & P
    R --> S
    S --> A
```

---

## Folder Structure

```
evee/
├── mobile/                          # React Native (Expo) App
│   ├── app/
│   │   ├── (tabs)/
│   │   │   ├── index.tsx            # Home — Intervention Hub
│   │   │   ├── scan.tsx             # Menu Scan Screen
│   │   │   ├── log.tsx              # Voice/Text Log Screen
│   │   │   ├── insights.tsx         # Food Story / Behavioral Insights
│   │   │   └── profile.tsx          # User Profile
│   │   ├── onboarding/
│   │   │   ├── index.tsx            # 3-tap onboarding entry
│   │   │   ├── goal.tsx             # Step 1: Goal
│   │   │   ├── context.tsx          # Step 2: Eating Context
│   │   │   └── restrictions.tsx     # Step 3: Dietary Restrictions
│   │   ├── _layout.tsx              # Root layout + navigation
│   │   └── auth.tsx                 # Firebase Auth screen
│   ├── components/
│   │   ├── ui/
│   │   │   ├── FAB.tsx              # Floating Action Button
│   │   │   ├── Card.tsx             # Glassmorphism card
│   │   │   ├── NudgeCard.tsx        # Contextual nudge bottom sheet
│   │   │   ├── RecommendationCard.tsx
│   │   │   ├── InsightCard.tsx      # Behavioral insight card
│   │   │   └── ConfidencePill.tsx   # Day 0-7 confidence indicator
│   │   ├── scan/
│   │   │   ├── CameraView.tsx       # Camera capture component
│   │   │   ├── ScanOverlay.tsx      # Animated scan grid
│   │   │   └── ResultSheet.tsx      # Recommendation bottom sheet
│   │   └── voice/
│   │       ├── VoiceRecorder.tsx    # Animated mic button
│   │       └── TranscriptBubble.tsx
│   ├── hooks/
│   │   ├── useCamera.ts
│   │   ├── useVoice.ts
│   │   ├── useMeals.ts
│   │   └── useNudge.ts
│   ├── store/
│   │   ├── userStore.ts             # Zustand: user profile + auth
│   │   ├── mealStore.ts             # Zustand: meal history cache
│   │   └── nudgeStore.ts            # Zustand: active nudge state
│   ├── services/
│   │   ├── api.ts                   # Axios instance + interceptors
│   │   ├── firebase.ts              # Firebase Auth + Storage client
│   │   └── notifications.ts         # FCM setup + handlers
│   ├── constants/
│   │   └── tokens.ts                # Design tokens as TS constants
│   └── types/
│       ├── meal.ts
│       ├── user.ts
│       └── recommendation.ts
│
├── backend/                         # FastAPI Python Backend
│   ├── app/
│   │   ├── main.py                  # FastAPI app entry + router mount
│   │   ├── config.py                # Pydantic Settings (env vars)
│   │   ├── dependencies.py          # JWT auth dependency
│   │   ├── routers/
│   │   │   ├── scan.py              # Vision pipeline endpoint
│   │   │   ├── log.py               # Voice + text log endpoint
│   │   │   ├── nudge.py             # Pre-meal recommendation endpoint
│   │   │   ├── insights.py          # Behavioral analysis endpoint
│   │   │   └── users.py             # User profile CRUD
│   │   ├── services/
│   │   │   ├── llm_service.py       # Gemini API wrapper + prompt builder
│   │   │   ├── vision_service.py    # Image preprocessing + Gemini Vision
│   │   │   ├── stt_service.py       # Google STT v2 wrapper
│   │   │   ├── context_service.py   # User context window builder
│   │   │   └── nudge_service.py     # Contextual nudge generation
│   │   ├── models/
│   │   │   ├── user.py              # SQLAlchemy User model
│   │   │   ├── meal_event.py        # SQLAlchemy MealEvent model
│   │   │   └── nudge_log.py         # Nudge delivery + response log
│   │   ├── schemas/
│   │   │   ├── scan.py              # Pydantic request/response
│   │   │   ├── log.py
│   │   │   ├── nudge.py
│   │   │   └── user.py
│   │   └── db/
│   │       ├── database.py          # Async SQLAlchemy engine
│   │       └── init_db.py           # Table creation
│   ├── alembic/                     # DB migrations
│   ├── workers/
│   │   └── nudge_worker.py          # Celery task: pre-meal notification scheduler
│   ├── prompts/
│   │   ├── system_prompt.py         # Master Indian food context system prompt
│   │   ├── scan_prompt.py           # Menu scan structured output prompt
│   │   ├── log_prompt.py            # Meal log extraction prompt
│   │   └── insight_prompt.py        # Behavioral analysis prompt
│   ├── tests/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env.example
│
├── production_artifacts/            # Pipeline docs (non-deployable)
└── README.md
```

---

## Data Models

### User
```sql
users (
  id            UUID PRIMARY KEY,
  firebase_uid  TEXT UNIQUE NOT NULL,
  name          TEXT,
  city          TEXT,
  language      TEXT DEFAULT 'en',    -- en/hi/ta/bn
  goal          TEXT,                 -- energy/weight/health/muscle
  eating_context TEXT,                -- home/canteen/ordering
  dietary_restriction TEXT,           -- veg/nonveg/vegan
  budget_per_meal INTEGER,            -- in INR
  persona_id    INTEGER,              -- 1-12 Bayesian cold start persona
  confidence_day INTEGER DEFAULT 0,   -- 0-7 calibration period
  created_at    TIMESTAMPTZ DEFAULT NOW()
)
```

### MealEvent
```sql
meal_events (
  id              UUID PRIMARY KEY,
  user_id         UUID REFERENCES users(id),
  logged_at       TIMESTAMPTZ DEFAULT NOW(),
  meal_time       TEXT,               -- breakfast/lunch/dinner/snack
  input_type      TEXT,               -- photo/voice/text
  raw_input_ref   TEXT,               -- GCS path for photo, transcript for voice
  dishes          JSONB,              -- LLM-extracted dish array with nutrition
  location        TEXT,               -- canteen/home/restaurant/delivery
  mood_tag        TEXT NULLABLE,      -- self-reported: stressed/normal/happy
  budget_spent    INTEGER NULLABLE,   -- INR
  llm_analysis    JSONB               -- Full LLM response for meal
)
```

### NudgeLog
```sql
nudge_logs (
  id          UUID PRIMARY KEY,
  user_id     UUID REFERENCES users(id),
  sent_at     TIMESTAMPTZ DEFAULT NOW(),
  nudge_type  TEXT,                   -- pre_meal/stress_alert/weekly_story
  content     TEXT,                   -- Nudge message shown
  opened      BOOLEAN DEFAULT FALSE,
  acted_on    BOOLEAN DEFAULT FALSE   -- Did user follow the recommendation?
)
```

---

## LLM Context Window Design

Each LLM call is built with a **structured context window** containing:

```python
{
  "system": MASTER_SYSTEM_PROMPT,     # Indian food culture, behavioral framing
  "user_context": {
    "profile": { goal, eating_context, dietary_restriction, budget, city, language },
    "recent_meals": [...last_5_meal_events],
    "time_of_day": "lunch",
    "day_of_week": "Tuesday",
    "confidence_day": 3
  },
  "task": TASK_SPECIFIC_PROMPT,       # scan / log / nudge / insight
  "input": { photo_url | transcript | text }
}
```

---

## API Design Summary

| Endpoint | Method | Purpose | Auth |
|---|---|---|---|
| `/api/v1/scan` | POST | Photo → ranked recommendation | JWT |
| `/api/v1/log/voice` | POST | Audio → meal event | JWT |
| `/api/v1/log/text` | POST | Text → meal event | JWT |
| `/api/v1/nudge/current` | GET | Get active contextual nudge | JWT |
| `/api/v1/insights/weekly` | GET | Weekly behavioral Food Story | JWT |
| `/api/v1/users/me` | GET/PATCH | User profile | JWT |
| `/api/v1/users/onboard` | POST | 3-tap onboarding completion | JWT |

---

## Security Model

- **Auth**: Firebase JWT validated server-side on every request via `firebase-admin` Python SDK
- **Storage**: All meal photos uploaded directly to Firebase Storage with user-scoped rules; backend receives signed URL only
- **Secrets**: All API keys (Gemini, GCS, DB) via Cloud Run Secret Manager environment injection
- **Rate limiting**: Scan endpoint limited to 5/hour on free tier (enforced via Redis counter)
