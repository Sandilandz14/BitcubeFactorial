# Bitcube QA Engineer Task — Playwright Automation

TypeScript Playwright automation derived from `Bitcube_Exploratory_Test_Sheet_Final.xlsx`.

## What is included

- Traceable scenario IDs in every test title
- Separate mandatory Bitcube suite
- Functional, validation, accessibility, link, API, responsive and reliability coverage
- Six genuine known-defect tests that retain the correct expectations
- Chromium, Firefox and WebKit projects
- HTML, JUnit and JSON reporting
- Screenshots, traces and videos retained on failure
- GitHub Actions regression workflow
- Manual-only classification for the potentially resource-intensive extreme-input scenario

## Requirements

- Node.js 20 or newer
- npm

## Install

```bash
npm ci
npx playwright install
```

## Run

```bash
# Chromium baseline
npm run test:chromium

# Passing regression coverage, excluding confirmed product defects
npm run test:regression

# The three separately identified mandatory tests
npm run test:mandatory

# Confirm the documented defects, including BUG-006 discovered by automation
npm run test:defects

# All tests across Chromium, Firefox and WebKit
npm test
```

Use a different environment without changing code:

```bash
BASE_URL=https://example.test npm run test:chromium
```

## Reporting

```bash
npm run report
```

The HTML report is written to `playwright-report/`; JUnit and JSON output are written to `test-results/`. Failure screenshots, traces and videos are stored under `test-results/artifacts/`.

## Failure interpretation

Tests tagged `@known-defect` are expected to fail against the current application because they prove confirmed product defects. They are not marked with Playwright's `test.fail()` because the assignment requires automation results to match the documented failing test cases visibly.

- Run `npm run test:regression` for the normal release signal.
- Run `npm run test:defects` for defect-reproduction evidence.
- Run the complete suite when a report must contain both passing and failing outcomes.

Framework failures—timeouts, unavailable browsers or locator errors—must be investigated separately from assertion failures that reproduce a documented defect.

## Design decisions

- Page Object Model is limited to stable page interactions and locators.
- Test intent and assertions remain in the specifications.
- No fixed sleeps are used.
- Network behaviour is inspected directly for MAND-03 and invalid-input handling.
- EXP-025 remains manual to avoid repeatedly sending resource-intensive input to a public interview service.

See [TRACEABILITY.md](TRACEABILITY.md) for the scenario-to-automation map.
