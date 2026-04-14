# Skill: Build Backend

## Agent
`@backend` (sub-agent of `@engineer`)

## Objective
Build the complete server-side of the application — APIs, business logic, database models, auth, and middleware.

## Pre-Conditions (MUST be met before starting)
Before writing any code, confirm these files exist:
- `production_artifacts/api_contract.md` (from @api-designer) ✅
- `production_artifacts/architecture_blueprint.md` (from @architect) ✅
- `production_artifacts/db_schema.md` (from @dba) ✅

If any are missing, halt and notify @orchestrator.

## Instructions
1. **Read all three context documents** before writing code.
2. **Scaffold Server**: Set up the entry point (e.g., `server.js`, `app.py`, `main.go`) with middleware (CORS, body parsing, rate limiting, logging).
3. **Implement Routes**: Follow the `api_contract.md` exactly — same endpoint names, HTTP methods, request/response schemas.
4. **Implement Business Logic**: Write clean service/controller layers. Business logic must NOT live inside route handlers.
5. **Implement Database Layer**: Use the schema from `db_schema.md`. Write all models, repositories, or ORM definitions.
6. **Implement Authentication**: Build auth flows (JWT, session, or OAuth) as defined in the spec.
7. **Implement Error Handling**: Centralized error handler that returns the shared error schema from `api_contract.md`.
8. **Environment Variables**: Never hardcode secrets. Use `.env` / environment variables. Create a `.env.example` file.
9. **Output**: Save all files to `app_build/` (or `app_build/backend/` as per spec). Include `package.json` or `requirements.txt`.
10. **Notify**: "Backend build complete." and list all files created.
