# Automation traceability

The uploaded final exploratory workbook is the source of truth. IDs are retained in every automated test title.

| Coverage | Scenario IDs |
|---|---|
| Page and calculations | EXP-001–EXP-003, EXP-006–EXP-012, EXP-024 |
| Validation and correction | EXP-013–EXP-023, EXP-026, EXP-027, EXP-029 |
| Accessibility and keyboard | EXP-004, EXP-005 |
| Footer links and copyright | EXP-030–EXP-034 |
| Mandatory suite | MAND-01, MAND-02, MAND-03 |
| API and reliability | EXP-036–EXP-039 |
| Manual-only risk-controlled check | EXP-025 |

## Confirmed product defects

| Defect | Automated test | Expected execution outcome |
|---|---|---|
| BUG-001 | EXP-002 | Fails until title is corrected |
| BUG-002 | EXP-004 | Fails until an accessible name is added |
| BUG-003 | EXP-031 | Fails until Terms points to the Terms route |
| BUG-004 | EXP-032 | Fails until Privacy points to the Privacy route |
| BUG-005 | EXP-034 | Fails until the redundant year range is corrected |
| BUG-006 | EXP-017 | Fails until negative input is rejected without a 5xx response |

Known-defect tests are tagged `@known-defect`. They intentionally retain correct expectations and are not assertion-softened.
