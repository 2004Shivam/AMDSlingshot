# Skill: Security Audit

## Agent
`@security`

## Objective
Conduct a thorough security review of the entire codebase. Find and fix vulnerabilities before the code ships.

## Instructions

### Phase 1 — Secrets & Config Scan
1. **Scan all files** in `app_build/` for hardcoded credentials, API keys, passwords, or tokens.
   - Look for patterns: `api_key = "..."`, `password: "..."`, `Bearer xxx`, etc.
   - If found: Remove the secret, replace with an environment variable reference, and add it to `.env.example`.
2. **Check `.gitignore`**: Ensure `.env`, `node_modules/`, `__pycache__/`, `*.key`, `*.pem` are all listed.

### Phase 2 — Dependency Vulnerability Scan
3. **For Node.js**: Analyze `package.json`. Flag any packages with known CVEs (check against common vulnerability lists). Suggest safer updated versions.
4. **For Python**: Analyze `requirements.txt`. Flag any outdated packages with known issues.

### Phase 3 — Code Vulnerability Scan
5. **Injection Attacks**: Check all database queries for string interpolation. Ensure parameterized queries / ORMs are used.
6. **XSS (Cross-Site Scripting)**: Check all places where user-provided data is rendered in HTML. Ensure it is sanitized/escaped.
7. **CORS Policy**: Check the server's CORS configuration. Flag overly permissive policies (e.g., `origin: '*'` in production).
8. **Authentication Checks**: Verify all protected routes have middleware that validates the auth token BEFORE processing the request.
9. **Rate Limiting**: Confirm a rate limiter exists on auth endpoints (login, signup, password reset).
10. **Input Validation**: Confirm all API endpoints validate and sanitize input before processing.

### Phase 4 — Report & Fix
11. **Classify all findings** as `CRITICAL`, `HIGH`, `MEDIUM`, or `LOW`.
12. **Fix all CRITICAL and HIGH** issues directly in `app_build/`.
13. **Save** the full audit report to `production_artifacts/security_report.md`.
14. **Report**: Flag any CRITICAL issues to the user immediately with the message: "🚨 SECURITY ALERT: [issue description]. Fixed in [file]."
