---
description: Re-run only the QA phase (tests + security + performance) on existing code
---

When the user types `/audit`, run a full quality pass on the current `app_build/` without rebuilding.

## Execution

### Act as @qa:
1. Read `production_artifacts/context_ledger.md` to understand the current project state.
2. Execute the following 3 tracks **simultaneously**:

   **Track A — @tester**: Execute `skills/write_tests.md`.
   **Track B — @optimizer**: Execute `skills/optimize_performance.md`.
   **Track C — @security**: Execute `skills/security_audit.md`.

3. Consolidate all reports.
4. Update Phase 4 status in `production_artifacts/context_ledger.md`.
5. Report a summary:
   > "🔍 **Audit complete.** Tests: X passed / Y failed. Security: N issues found (M critical). Performance: P optimizations applied. See `production_artifacts/` for full reports."
