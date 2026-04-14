# Skill: Optimize Database

## Agent
`@dba`

## Objective
Design bullet-proof schemas, write efficient queries, and produce migration scripts.

## Pre-Conditions
Read `production_artifacts/architecture_blueprint.md` and `production_artifacts/research_memo.md` before starting.

## Instructions

### Phase 1 — Schema Design
1. **Define all entities** with their fields, types, constraints, and relationships:
   ```
   Table: users
   | Field      | Type         | Constraints              |
   |------------|--------------|--------------------------|
   | id         | UUID/INT     | PRIMARY KEY, AUTO INC    |
   | email      | VARCHAR(255) | UNIQUE, NOT NULL         |
   | created_at | TIMESTAMP    | DEFAULT NOW()            |
   ```
2. **Define all relationships**: one-to-one, one-to-many, many-to-many (with junction tables).
3. **Define indexes**: Add indexes on all foreign keys, and any field used in `WHERE` or `ORDER BY` clauses.
4. **Save schema** to `production_artifacts/db_schema.md`.

### Phase 2 — Migration Scripts
5. **Write migration files** into `app_build/db/migrations/`. Use numbered filenames (e.g., `001_create_users.sql`).
6. **Write a seed file** (`app_build/db/seed.sql` or `.js/.py`) with realistic sample data.

### Phase 3 — Query Optimization
7. **Review all backend queries** in `app_build/`. Flag and rewrite any N+1 query patterns.
8. **Add query explanations** for any complex aggregations.

### Phase 4 — Notify
9. Report "Database schema and migrations ready." Save schema reference to `production_artifacts/db_schema.md`.
