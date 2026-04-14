# 📡 API Contract — Evee v1.0 (Phase 1 MVP)
> Author: @api-designer | Date: 2026-04-14 | Status: LOCKED

## Base URL
- **Development**: `http://localhost:3000/api/v1`
- **Production**: `https://<cloud-run-url>/api/v1` (or Next.js API routes at same domain)

## Authentication
All protected endpoints require:
```
Authorization: Bearer <firebase-jwt-id-token>
```
Obtain via Firebase Auth `getIdToken()` on client.

---

## 1. Menu Scan (Phase 1 Core Feature)

### `POST /api/v1/scan`
Analyze a food photo or menu image and return ranked dish recommendations.

**Request**
```json
{
  "image_base64": "string",       // Base64-encoded JPEG/PNG, max 4MB
  "budget_inr": 250,              // Optional — per-meal budget filter
  "dietary_prefs": ["veg"],       // Optional — ["veg", "vegan", "no-gluten", "halal"]
  "context": "restaurant_menu"   // "restaurant_menu" | "home_food" | "street_food"
}
```

**Response `200 OK`**
```json
{
  "scan_id": "uuid",
  "recommendations": [
    {
      "rank": 1,
      "dish_name": "Dal Tadka + Roti",
      "score": 92,
      "reasoning": "High protein, aligns with your weight loss goal. Under ₹220.",
      "estimated_price_inr": 180,
      "macro_estimate": {
        "protein_g": 18,
        "carbs_g": 45,
        "fat_g": 8,
        "calories_kcal": 320
      },
      "flags": ["budget_safe", "goal_aligned"]
    }
  ],
  "avoid_list": [
    {
      "dish_name": "Paneer Butter Masala",
      "reason": "High saturated fat. Occasional treat, not today."
    }
  ],
  "model_used": "gemini-2.5-flash",
  "latency_ms": 2800
}
```

**Error Responses**
| Code | Meaning |
|---|---|
| 400 | Invalid image / cannot parse menu |
| 413 | Image exceeds 4MB limit |
| 429 | Rate limit hit (15 RPM free tier) |
| 500 | Gemini API error |

---

## 2. User Management

### `POST /api/v1/users/onboard`
Complete 3-tap onboarding. Creates or updates user profile.

**Request**
```json
{
  "uid": "firebase-uid",
  "display_name": "Ravi",
  "goal": "weight_loss",                  // "weight_loss" | "muscle_gain" | "energy" | "gut_health" | "just_eat_better"
  "eating_context": "office_lunch",       // "office_lunch" | "home_cook" | "frequent_dineout" | "street_food_lover"
  "dietary_restriction": "veg",           // "veg" | "vegan" | "non_veg" | "eggetarian" | "jain"
  "budget_per_meal_inr": 200
}
```

**Response `201 Created`**
```json
{
  "uid": "firebase-uid",
  "persona_id": 7,
  "persona_label": "Conscious Office Grazer",
  "confidence_day": 0,
  "onboarded_at": "2026-04-14T10:00:00Z"
}
```

### `GET /api/v1/users/me`
Fetch current user profile.

**Response `200 OK`**
```json
{
  "uid": "string",
  "display_name": "string",
  "goal": "string",
  "dietary_restriction": "string",
  "budget_per_meal_inr": 200,
  "persona_id": 7,
  "confidence_day": 3,
  "total_meals_logged": 14,
  "created_at": "ISO8601"
}
```

### `PATCH /api/v1/users/me`
Update user profile fields (partial update).

**Request**: any subset of onboard fields.
**Response**: updated user object.

---

## 3. Meal Logging

### `POST /api/v1/log/text`
Log a meal from text input.

**Request**
```json
{
  "raw_text": "had dal rice and papad for lunch",
  "meal_type": "lunch",             // "breakfast" | "lunch" | "dinner" | "snack"
  "logged_at": "2026-04-14T13:30:00+05:30"
}
```

**Response `201 Created`**
```json
{
  "meal_id": "uuid",
  "parsed_dishes": ["Dal", "Rice", "Papad"],
  "total_calories_kcal": 480,
  "goal_alignment_score": 78,
  "coach_note": "Solid lunch! Light on protein though — maybe add curd next time.",
  "logged_at": "ISO8601"
}
```

### `POST /api/v1/log/voice` *(Phase 2)*
Log a meal via audio. Accepts audio blob.

**Request**: `multipart/form-data`
```
audio_file: <blob>    // WebM/OGG from MediaRecorder
meal_type: "lunch"
logged_at: "ISO8601"
```

**Response**: Same structure as `/log/text` with additional field:
```json
{ "transcript": "dal rice and papad" }
```

---

## 4. Nudges

### `GET /api/v1/nudge/current`
Get the active contextual nudge for the current time of day.

**Response `200 OK`**
```json
{
  "nudge_id": "uuid",
  "headline": "Lunch in 30 min?",
  "body": "You're near Connaught Place. Dal Makhani at Sagar Ratna fits your ₹200 budget perfectly.",
  "cta_label": "Scan Menu",
  "cta_action": "open_scan",
  "nudge_type": "pre_meal",
  "valid_until": "ISO8601"
}
```

**Response `204 No Content`** — No active nudge right now.

---

## 5. Insights

### `GET /api/v1/insights/weekly`
Get the weekly Food Story report.

**Response `200 OK`**
```json
{
  "week_start": "2026-04-07",
  "week_end": "2026-04-13",
  "top_win": "You hit your protein goal 5 out of 7 days!",
  "pattern_found": "You tend to overeat on Thursday evenings. Stress eating?",
  "next_week_goal": "Try adding one salad per day to hit your fiber target.",
  "meal_count": 19,
  "avg_daily_calories": 1820,
  "goal_alignment_avg_pct": 74
}
```

---

## Error Format (All Endpoints)
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "You've hit the free tier rate limit. Please wait 60 seconds.",
    "details": {}
  }
}
```

---

## API Key Security Contract
- `GEMINI_API_KEY` → stored in `.env.local` only
- Key accessed ONLY in Next.js API route handlers (server-side)
- NEVER referenced in any client-side component
- `.env.local` is in `.gitignore` — confirmed
