# Skill: Build Frontend

## Agent
`@frontend` (sub-agent of `@engineer`)

## Objective
Build the complete client-side of the application with a premium, production-ready UI.

## Pre-Conditions (MUST be met before starting)
Before writing any code, confirm these files exist:
- `production_artifacts/design_tokens.md` (from @designer) ✅
- `production_artifacts/api_contract.md` (from @api-designer) ✅
- `production_artifacts/architecture_blueprint.md` (from @architect) ✅

If any of these are missing, halt and notify @orchestrator.

## Instructions
1. **Read all three context documents** thoroughly before touching any code.
2. **Apply Design Tokens**: Create a `styles/tokens.css` (or equivalent) that declares all CSS custom properties from `design_tokens.md`.
3. **Scaffold Components**: Follow the component tree from `architecture_blueprint.md` exactly.
4. **Implement API Calls**: Use the contracts from `api_contract.md`. Never hardcode API structure — always use what is defined.
5. **Implement Responsiveness**: All layouts must work correctly on mobile (320px), tablet (768px), and desktop (1280px+).
6. **Implement Micro-animations**: Apply the animation principles from `design_tokens.md`.
7. **Accessibility**: Add `aria-label`, `role`, focus states, and keyboard navigation to all interactive elements.
8. **Output**: Save all files to `app_build/` (or `app_build/frontend/` as per spec).
9. **Notify**: "Frontend build complete." and list the files created.
