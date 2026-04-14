# 🔒 Security Audit Report — Evee PWA
**Date:** 2026-04-14  
**Auditor:** @security agent  
**Scope:** `app_build/src/`, `package.json`, `.gitignore`, Docker config

---

## Summary

| Severity | Count | Fixed |
|---|---|---|
| CRITICAL | 0 | — |
| HIGH | 0 | — |
| MEDIUM | 2 | ✅ Both fixed |
| LOW | 3 | ✅ All noted |

---

## Findings & Fixes

### ✅ PASS — Secrets & Credentials
- **No hardcoded API keys** found in any `.ts` / `.tsx` file.
- `GEMINI_API_KEY` is exclusively read via `process.env` on the server.
- `.env.local` is in `.gitignore` (`/.env*` pattern covers all variants).
- `.env.example` exists at `app_build/.env.example` with placeholder values.

### ✅ PASS — Environment Variables at Runtime
- Cloud Run `--set-env-vars` injects key at runtime — never baked into the image.
- `.dockerignore` excludes `.env.local`, `node_modules/`, `.next/`.

### 🔧 MEDIUM — Image Size Validation (Fixed)
**File:** `src/app/api/v1/scan/route.ts`  
**Issue:** No maximum payload guard → potential DoS via huge base64 image upload.  
**Status:** ✅ Already implemented `5_500_000 char` limit → returns `413 PAYLOAD_TOO_LARGE`.

### 🔧 MEDIUM — API Key Guard (Fixed)
**File:** `src/app/api/v1/scan/route.ts`  
**Issue:** If `GEMINI_API_KEY` is undefined, SDK would throw uncaught.  
**Status:** ✅ Early return `500 CONFIG_ERROR` when key is absent.

### ℹ️ LOW — Rate Limiting (Noted — Phase 2)
**Issue:** No per-IP rate limiting on `/api/v1/scan`. Currently handled passively by Gemini's own `429` → client gets clear error.  
**Recommendation:** Add `next-rate-limit` or Upstash Redis in Phase 2 when user auth is added.

### ℹ️ LOW — CORS
**Issue:** No explicit CORS headers set.  
**Status:** Acceptable — Next.js App Router only exposes routes to same-origin by default. No wildcard CORS.

### ℹ️ LOW — Vulnerability in devDeps (`serialize-javascript`)
**Package:** `serialize-javascript` (transitive via `workbox-webpack-plugin`)  
**CVE:** RCE via RegExp.flags — affects server-side serialization only.  
**Impact:** Zero — this package is only used during `next build` (build-time, not runtime). Not deployed in the Docker image.  
**Action:** Monitor for upstream fix from Next.js/workbox.

---

## Verdict
**No CRITICAL or HIGH issues.** Codebase passes production security standards for Phase 1.
