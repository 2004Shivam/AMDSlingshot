# 🗄️ Database Schema — Evee v1.0 (Phase 1 MVP)
> Author: @dba | Date: 2026-04-14 | DB: PostgreSQL 16 (Supabase free tier)

## Design Principles
- Supabase-hosted PostgreSQL (free tier: 500MB, no credit card)
- Use Supabase client library (`@supabase/supabase-js`) from Next.js directly in Phase 1
- Row Level Security (RLS) enabled — users can only access their own data
- JSONB for LLM-generated analysis blobs (flexible schema)
- All timestamps in UTC

---

## Tables

### `users`
```sql
CREATE TABLE users (
  uid                  TEXT PRIMARY KEY,          -- Firebase Auth UID
  display_name         TEXT,
  goal                 TEXT NOT NULL,             -- 'weight_loss' | 'muscle_gain' | etc.
  eating_context       TEXT NOT NULL,
  dietary_restriction  TEXT NOT NULL DEFAULT 'veg',
  budget_per_meal_inr  INTEGER DEFAULT 200,
  persona_id           SMALLINT,                  -- 1-12 Bayesian cold-start persona
  confidence_day       SMALLINT DEFAULT 0,        -- 0-7 calibration period
  total_meals_logged   INTEGER DEFAULT 0,
  onboarded_at         TIMESTAMPTZ,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: users can only read/write their own row
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_self_access" ON users
  USING (uid = auth.uid()::TEXT);
```

### `meal_events`
```sql
CREATE TABLE meal_events (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_uid             TEXT NOT NULL REFERENCES users(uid) ON DELETE CASCADE,
  meal_type            TEXT NOT NULL,             -- 'breakfast' | 'lunch' | 'dinner' | 'snack'
  raw_input            TEXT,                      -- original text or transcript
  input_type           TEXT DEFAULT 'text',       -- 'text' | 'voice' | 'scan'
  parsed_dishes        JSONB,                     -- [{"name": "Dal", "qty_g": 150}]
  llm_analysis         JSONB,                     -- full Gemini response blob
  total_calories_kcal  INTEGER,
  protein_g            NUMERIC(6,1),
  carbs_g              NUMERIC(6,1),
  fat_g                NUMERIC(6,1),
  goal_alignment_score SMALLINT,                  -- 0-100
  coach_note           TEXT,                      -- LLM-generated coaching note
  mood_tag             TEXT,                      -- 'stressed' | 'happy' | 'rushed' (Phase 2)
  location_tag         TEXT,                      -- 'home' | 'office' | 'restaurant' (Phase 2)
  logged_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_meal_events_user_uid ON meal_events(user_uid);
CREATE INDEX idx_meal_events_logged_at ON meal_events(logged_at DESC);

-- RLS
ALTER TABLE meal_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "meals_self_access" ON meal_events
  USING (user_uid = auth.uid()::TEXT);
```

### `scan_events`
```sql
CREATE TABLE scan_events (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_uid          TEXT NOT NULL REFERENCES users(uid) ON DELETE CASCADE,
  image_url         TEXT,                         -- Firebase Storage URL
  scan_context      TEXT,                         -- 'restaurant_menu' | 'home_food'
  llm_response      JSONB,                        -- full ranked recommendation blob
  budget_filter_inr INTEGER,
  model_used        TEXT DEFAULT 'gemini-2.5-flash',
  latency_ms        INTEGER,
  scanned_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_scan_events_user_uid ON scan_events(user_uid);

ALTER TABLE scan_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "scans_self_access" ON scan_events
  USING (user_uid = auth.uid()::TEXT);
```

### `nudge_logs`
```sql
CREATE TABLE nudge_logs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_uid     TEXT NOT NULL REFERENCES users(uid) ON DELETE CASCADE,
  nudge_type   TEXT,                              -- 'pre_meal' | 'reminder'
  headline     TEXT,
  body         TEXT,
  cta_action   TEXT,
  was_opened   BOOLEAN DEFAULT FALSE,
  was_acted_on BOOLEAN DEFAULT FALSE,
  sent_at      TIMESTAMPTZ DEFAULT NOW(),
  opened_at    TIMESTAMPTZ
);

ALTER TABLE nudge_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "nudges_self_access" ON nudge_logs
  USING (user_uid = auth.uid()::TEXT);
```

---

## Entity Relationship Diagram

```
users (1) ──────< meal_events (N)
users (1) ──────< scan_events (N)
users (1) ──────< nudge_logs (N)
```

---

## Supabase Setup (Phase 1)

```bash
# Install client
npm install @supabase/supabase-js

# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here  # server-side only
```

**Note**: `NEXT_PUBLIC_*` vars are exposed to the browser but are safe with RLS.
`SUPABASE_SERVICE_ROLE_KEY` must only be used in API routes (bypasses RLS — admin only).

---

## Indexes Summary

| Table | Index | Purpose |
|---|---|---|
| `meal_events` | `user_uid` | Fast user-scoped queries |
| `meal_events` | `logged_at DESC` | Chronological meal history |
| `scan_events` | `user_uid` | Fast user-scoped queries |

---

## Future Migrations (Phase 2+)
- Add `embeddings` column (`vector(768)`) to `meal_events` for semantic search (pgvector)
- Add `weekly_reports` table for cached Food Story snapshots
- Add `notification_preferences` table (timing, frequency)
