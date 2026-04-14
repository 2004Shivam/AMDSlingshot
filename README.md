# 🌿 Evee — AI Food Intelligence

> **Intervention-first food companion for urban India.**  
> Scan any menu → get ranked, personalized recommendations before you eat — not after.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![Gemini](https://img.shields.io/badge/Gemini-2.5%20Flash-blue?logo=google)](https://ai.google.dev)
[![PWA](https://img.shields.io/badge/PWA-Installable-green)](https://web.dev/progressive-web-apps/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

---

## 📱 What is Evee?

Most food apps ask *"what did you eat?"* — too late to change anything.

**Evee intervenes before the meal.** Point your phone at a restaurant menu, and Evee uses Google's Gemini AI to:

- 📷 **Read the menu** (any format — printed card, digital board, app screenshot)
- 🤖 **Rank the best dishes** for your goal + budget + diet type
- 💬 **Explain why** in warm, plain English — like advice from a knowledgeable friend
- ⚠️ **Flag dishes to skip** with honest, non-judgmental reasoning
- 📊 **Track patterns** over time to surface behavioral insights

---

## ✨ Features (Phase 1)

| Feature | Status |
|---|---|
| 📷 Smart Menu Scan (camera / upload / drag-drop) | ✅ Live |
| 🤖 Gemini 2.5 Flash AI analysis | ✅ Live |
| 💰 Budget filter (₹ per meal) | ✅ Live |
| 🌿 Diet preference (Veg / Non-veg / Vegan / Eggetarian) | ✅ Live |
| 🏆 Ranked recommendations with scores (0–100) | ✅ Live |
| 💪 Macro estimates (protein, carbs, fat, calories) | ✅ Live |
| 📊 Weekly Food Story (insights + alignment score) | ✅ Live |
| 📲 PWA — installable on Android & iOS | ✅ Live |
| 🎙️ Voice logging in Hindi / English | 🔜 Phase 2 |
| 🔐 User auth (Firebase) + meal history | 🔜 Phase 2 |

---

## 🚀 Quick Start (Local Development)

### Prerequisites

- Node.js 18+
- A free [Gemini API key](https://aistudio.google.com/apikey)

### 1. Clone & install

```bash
git clone https://github.com/2004Shivam/AMDSlingshot.git
cd AMDSlingshot/app_build
npm install
```

### 2. Set up environment

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your keys:

```env
GEMINI_API_KEY=your_key_from_aistudio.google.com
```

> **🔐 Security:** `.env.local` is gitignored. The Gemini key is only accessed server-side via `process.env` — it is never bundled into the client.

### 3. Run

```bash
npm run dev
```

Open **http://localhost:3000** — the app is ready!

---

## 🗂️ Project Structure

```
AMDSlingshot/
├── app_build/                    # 📦 All deployable Next.js code
│   ├── src/
│   │   └── app/
│   │       ├── page.tsx          # Home — Intervention Hub
│   │       ├── scan/
│   │       │   ├── page.tsx      # Menu Scan UI (camera + filters)
│   │       │   └── results/
│   │       │       └── page.tsx  # Ranked AI recommendations
│   │       ├── insights/
│   │       │   └── page.tsx      # Weekly Food Story
│   │       ├── log/page.tsx      # Voice Log (Phase 2 stub)
│   │       ├── history/page.tsx  # Meal History (Phase 2 stub)
│   │       ├── api/v1/
│   │       │   └── scan/
│   │       │       └── route.ts  # 🤖 Gemini 2.5 Flash API route
│   │       ├── globals.css       # Design system (all design tokens)
│   │       └── layout.tsx        # PWA-enabled root layout
│   ├── public/
│   │   └── manifest.json         # PWA manifest
│   ├── .env.example              # Template — copy to .env.local
│   └── next.config.js            # PWA + Turbopack config
│
├── production_artifacts/         # 📄 Living documentation
│   ├── Technical_Specification.md
│   ├── api_contract.md
│   ├── db_schema.md
│   └── architecture_blueprint.md
│
└── .agents/                      # 🤖 AI pipeline agents
```

---

## 🎨 Design System

Evee uses a custom design system called **"The Intelligent Hearth"** — dark, warm, and premium.

| Token | Value | Meaning |
|---|---|---|
| `--ember` | `#FF6B35` | Primary — warmth, action, human |
| `--indigo` | `#6C63FF` | Secondary — AI, intelligence, insight |
| `--gold` | `#FFD166` | Accent — achievement, milestones |
| `--bg-base` | `#131315` | OLED black background |
| `--font-display` | Plus Jakarta Sans | Headlines |
| `--font-body` | Be Vietnam Pro | Body copy |

Glassmorphism cards, score badge rings, animated AI thinking states, and PWA-optimized touch targets throughout.

---

## 🔌 API

### `POST /api/v1/scan`

Analyzes a menu image and returns ranked dish recommendations.

**Request:**
```json
{
  "image_base64": "...",
  "budget_inr": 250,
  "dietary_prefs": ["veg"],
  "context": "restaurant_menu"
}
```

**Response:**
```json
{
  "scan_id": "uuid",
  "recommendations": [
    {
      "rank": 1,
      "dish_name": "Dal Tadka",
      "score": 87,
      "reasoning": "High in plant protein, stays comfortably in your ₹250 budget, and aligns perfectly with your veg goal.",
      "estimated_price_inr": 180,
      "macro_estimate": { "protein_g": 14, "carbs_g": 40, "fat_g": 6, "calories_kcal": 270 },
      "flags": ["budget_safe", "goal_aligned", "high_protein"]
    }
  ],
  "avoid_list": [...],
  "model_used": "gemini-2.5-flash",
  "latency_ms": 2400
}
```

> The endpoint is server-side only — your API key is never exposed to the browser.

---

## 🌐 Deployment

### Option A — Firebase Hosting + Cloud Run (Recommended for Phase 1)

See the [GCP Deployment Guide](#gcp-deployment) section below or `/production_artifacts/Technical_Specification.md`.

### Option B — Vercel (Easiest)

```bash
npm install -g vercel
cd app_build
vercel --prod
```

Set `GEMINI_API_KEY` in the Vercel dashboard under **Environment Variables**.

---

## 🛡️ Security

- ✅ Gemini API key is **server-side only** — `process.env.GEMINI_API_KEY` in a Next.js API Route
- ✅ `.env.local` is gitignored — key never committed
- ✅ Input validation on all API endpoints (size limits, type checks)
- ✅ Rate limit handling with user-facing messages
- ✅ No `NEXT_PUBLIC_` prefix on secret keys — they stay off the client bundle

---

## 🗺️ Roadmap

| Phase | Focus | Status |
|---|---|---|
| **Phase 1** | Menu Scan MVP (this release) | ✅ Complete |
| **Phase 2** | Auth + Voice Logging + Meal History | 🔜 Next |
| **Phase 3** | Personalization Engine + Supabase | 🔜 Planned |
| **Phase 4** | Vernacular AI (Hindi, Tamil, Bengali) | 🔜 Planned |
| **Phase 5** | GCP Cloud Run + Production Deploy | 🔜 Planned |

---

## 🤝 Contributing

Pull requests welcome! For major changes, open an issue first.

```bash
git checkout -b feature/your-feature
# make changes
git commit -m "feat: your feature"
git push origin feature/your-feature
```

---

## 📄 License

MIT © 2026 Shivam

---

*Built with ❤️ and Gemini AI*
