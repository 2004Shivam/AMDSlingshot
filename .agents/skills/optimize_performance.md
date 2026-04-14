# Skill: Optimize Performance

## Agent
`@optimizer` (sub-agent of `@qa`)

## Objective
Profile the codebase and aggressively eliminate all performance bottlenecks before deployment.

## Instructions

### Backend Performance
1. **Query Analysis**: Read all database queries. Rewrite any that:
   - Perform full table scans (missing index)
   - Use N+1 patterns (load related data in loop → replace with JOIN or batch)
   - Fetch more columns than needed (use `SELECT specific_fields` not `SELECT *`)
2. **Caching**: Identify any data that is fetched repeatedly and is not user-specific. Suggest or implement in-memory caching (e.g., Redis, node-cache, lru-cache).
3. **Async/Await Optimization**: Check for sequential `await` calls that could run in parallel. Replace with `Promise.all()` or equivalent.

### Frontend Performance
4. **Bundle Size**: Identify large imports. Replace with targeted imports (e.g., `import debounce from 'lodash/debounce'` not `import _ from 'lodash'`).
5. **Image Optimization**: Ensure all images use modern formats (WebP), have explicit `width`/`height`, and use `loading="lazy"` for below-the-fold images.
6. **Render Optimization**: Find and fix any unnecessary re-renders (unnecessary `useEffect` deps, missing `useMemo`/`useCallback`).
7. **CSS**: Remove unused styles. Ensure critical CSS is inlined. Avoid `@import` in CSS files.
8. **Web Vitals Check**: Review layout and ensure no Cumulative Layout Shift (CLS) sources exist (images with no dimensions, dynamic content injection).

### Output
- Apply all fixes directly to files in `app_build/`.
- Document every change in `production_artifacts/optimization_log.md` in the format:
  ```
  - [FILE] Change description → Expected improvement
  ```
- Report: "Optimization complete. See `optimization_log.md` for full details."
