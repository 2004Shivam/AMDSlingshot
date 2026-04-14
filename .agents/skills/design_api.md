# Skill: Design API Contract

## Agent
`@api-designer` (sub-agent of `@engineer`)

## Objective
Define the complete API surface before any code is written. This is the binding contract between @frontend and @backend.

## Instructions
1. **Read**: `production_artifacts/architecture_blueprint.md` and `production_artifacts/Technical_Specification.md`.
2. **Define all endpoints** in the following format for each one:

   ```
   ### [METHOD] /api/v1/[resource]
   - **Purpose**: [What this endpoint achieves]
   - **Auth Required**: Yes | No
   - **Request Body** (if POST/PUT/PATCH):
     ```json
     { "field": "type | description" }
     ```
   - **Success Response** (200/201):
     ```json
     { "field": "type | description" }
     ```
   - **Error Responses**: 400 (validation), 401 (unauth), 404 (not found), 500 (server error)
   ```

3. **Define Authentication Flow**: Diagram the full auth lifecycle (signup, login, token refresh, logout).
4. **Define Shared Error Schema**: All errors return `{ "error": { "code": "...", "message": "..." } }`.
5. **Save output** to `production_artifacts/api_contract.md`.
6. **Notify**: "@frontend and @backend can now begin. API contract is locked."

## Constraint
The API contract is LOCKED once saved. Changes require re-notifying all dependent agents.
