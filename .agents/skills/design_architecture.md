# Skill: Design Architecture

## Agent
`@architect` (sub-agent of `@pm`)

## Objective
Produce a comprehensive system blueprint that will serve as the single source of truth for all engineering, frontend, backend, and database agents.

## Instructions
1. **Read**: `production_artifacts/research_memo.md` from @researcher before beginning.
2. **Define Folder Structure**: Produce a full directory tree of how `app_build/` should look when complete. Include every file and folder name.
3. **Define Module Boundaries**: Clearly separate concerns. State what each folder/file owns (e.g., `api/routes/` owns HTTP routing only, not business logic).
4. **Design Data Models**: Define all data entities, their fields, types, and relationships (use a table format).
5. **Define State Management**: Describe how data flows from the database → API → frontend state → UI.
6. **Map Component Tree** (if frontend exists): List all UI components and their parent/child hierarchy.
7. **Draw System Diagram**: Use a Mermaid flowchart to visualize the high-level system.
8. **Save output** to `production_artifacts/architecture_blueprint.md`.
9. **Notify**: Report "Architecture blueprint ready." so @pm can proceed with the final spec.
