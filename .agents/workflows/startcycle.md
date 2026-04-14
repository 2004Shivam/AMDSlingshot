---
description: Start the Autonomous AI Developer Pipeline sequence with a new idea
---

When the user types `/startcycle <idea>`, execute the full Autonomous Development Pipeline below.
Read `.agents/agents.md` for all agent personas and their constraints before beginning.

---

## 🚀 PIPELINE EXECUTION

### ═══ PHASE 0 — INITIALIZE ═══
1. Act as **@orchestrator**.
   - Copy `production_artifacts/context_ledger.md` template into active use.
   - Fill in "Project Identity": Name (derive from idea), Idea (verbatim), Started (today's date).
   - Mark all Phase 1 items as 🔄 In Progress in the ledger.
   - Announce: "🚀 Pipeline initialized. Starting parallel Phase 1..."

---

### ═══ PHASE 1 — PARALLEL PLANNING ═══
> Execute the following 3 tracks simultaneously:

**Track A — @researcher**
- Execute `skills/research_stack.md` using the `<idea>`.
- Output: `production_artifacts/research_memo.md`.

**Track B — @architect**
- Wait for Track A to complete (needs research_memo).
- Execute `skills/design_architecture.md`.
- Output: `production_artifacts/architecture_blueprint.md`.

**Track C — @designer**
- Execute `skills/polish_ui.md` in parallel with Track A/B.
- Output: `production_artifacts/design_tokens.md`.

After all 3 tracks complete, act as **@pm**:
- Execute `skills/write_specs.md` using ALL three artifacts as context.
- Output: `production_artifacts/Technical_Specification.md`.

**⛔ APPROVAL GATE**: Present the spec to the user. Ask:
> "📋 **Specification ready!** Review `Technical_Specification.md`. Do you approve this architecture? Add comments directly to the file or reply here with changes. Reply **'Approved'** to proceed to Phase 2."

Loop Phase 1 (pm only) until user says **"Approved"**. Update ledger after approval.

---

### ═══ PHASE 2 — PARALLEL DESIGN CONTRACTS ═══
> Execute the following 2 tracks simultaneously:

**Track A — @api-designer**
- Execute `skills/design_api.md`.
- Output: `production_artifacts/api_contract.md`.

**Track B — @dba**
- Execute `skills/optimize_database.md` (Phase 1 only — schema design).
- Output: `production_artifacts/db_schema.md`.

Update context ledger. Announce: "✅ Phase 2 complete. API contract and database schema locked. Starting parallel build..."

---

### ═══ PHASE 3 — PARALLEL BUILD ═══
> Execute the following 2 tracks simultaneously:

**Track A — @frontend**
- Execute `skills/build_frontend.md`.
- Reads: `design_tokens.md`, `api_contract.md`, `architecture_blueprint.md`.
- Output: Frontend files in `app_build/`.

**Track B — @backend**
- Execute `skills/build_backend.md`.
- Reads: `api_contract.md`, `db_schema.md`, `architecture_blueprint.md`.
- Output: Backend files in `app_build/`.

After both tracks complete, act as **@engineer** to integrate and reconcile any conflicts. Update ledger.

---

### ═══ PHASE 4 — PARALLEL QUALITY ASSURANCE ═══
> Execute the following 3 tracks simultaneously:

**Track A — @tester**
- Execute `skills/write_tests.md`.
- Output: `app_build/tests/`, `production_artifacts/test_report.md`.

**Track B — @optimizer**
- Execute `skills/optimize_performance.md`.
- Output: Fixes applied to `app_build/`, `production_artifacts/optimization_log.md`.

**Track C — @security**
- Execute `skills/security_audit.md`.
- Output: Fixes applied to `app_build/`, `production_artifacts/security_report.md`.

Act as **@qa** to consolidate all findings. If any CRITICAL security issues are found, halt and alert user before proceeding. Update ledger.

---

### ═══ PHASE 5 — DOCUMENTATION ═══
Act as **@content**:
- Execute `skills/write_documentation.md`.
- Output: `README.md`, `CHANGELOG.md`, `.env.example`, SEO tags in `app_build/`.

---

### ═══ PHASE 6 — DEPLOY ═══
Act as **@devops**:
- Execute `skills/deploy_app.md`.
- Install dependencies, start the server.
- 🎉 Output the **live localhost URL** to the user.

Update context ledger: all phases ✅. Announce:
> "🎉 **Build complete!** Your application is live at [URL]. All artifacts are in `production_artifacts/`. Review `README.md` to get started!"
