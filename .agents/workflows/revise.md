---
description: Revise the approved specification and rebuild only affected parts
---

When the user types `/revise <what to change>`, intelligently update only the affected pipeline phases — not the entire build.

## Execution

### Act as @orchestrator:
1. Read `production_artifacts/context_ledger.md` to understand current state.
2. Read `production_artifacts/Technical_Specification.md` to understand what exists.

3. **Classify the revision scope**:
   - **Spec-level change** (new feature, removed feature, stack change): Re-run from Phase 1 (pm) → approval gate → then all downstream phases.
   - **API-level change** (new endpoint, changed schema): Re-run @api-designer → notify @frontend and @backend to update their affected files only.
   - **UI-only change** (redesign, new page, color change): Re-run @designer → @frontend only.
   - **Backend-only change** (new logic, new DB table): Re-run @dba (if schema change) → @backend only.
   - **Bug fix**: Act as @engineer directly. Fix the described issue in `app_build/`. Then run @qa.

4. After targeted rebuild, always complete with:
   - @security (quick scan of changed files only)
   - @content (update docs if interface changed)
   - @devops (restart the server)

5. Update `production_artifacts/context_ledger.md` with revision notes.
6. Report what was changed and the new live URL.
