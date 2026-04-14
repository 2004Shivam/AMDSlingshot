# Skill: Write Tests

## Agent
`@tester` (sub-agent of `@qa`)

## Objective
Write a comprehensive, automated test suite covering all critical paths of the application.

## Pre-Conditions
Read `production_artifacts/api_contract.md` and `app_build/` directory before starting.

## Instructions

### 1. Detect Testing Framework
Based on the stack in `Technical_Specification.md`, use the appropriate framework:
- **Node.js/React**: Jest + React Testing Library + Supertest (for API)
- **Python**: Pytest + httpx (for async APIs)
- **Playwright**: For end-to-end browser tests if specified

### 2. Write Unit Tests
For every service/utility function in `app_build/`:
- Test the "happy path" (expected input → expected output)
- Test edge cases (empty input, null, boundary values)
- Test error states (invalid input → expected error thrown)

### 3. Write Integration Tests
For every API endpoint in `production_artifacts/api_contract.md`:
- Test success responses with valid data
- Test 400 errors with invalid/missing fields
- Test 401/403 errors for protected endpoints (without & with bad token)
- Test 404 errors for non-existent resources

### 4. Write E2E Tests (if frontend exists)
Cover the top 3-5 critical user flows. For example:
- User signup → login → core action → logout
- Form submission with validation errors

### 5. Configure Test Runner
Ensure a test script is present in `package.json` or equivalent:
```json
"scripts": { "test": "jest --coverage" }
```

### 6. Output
- Save all test files into `app_build/tests/`
- Save test summary report to `production_artifacts/test_report.md`
- Report: "Test suite written: X unit tests, Y integration tests, Z e2e tests."
