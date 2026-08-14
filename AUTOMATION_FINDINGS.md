# Automation execution findings

## BUG-006 — Negative integer bypasses validation and causes an uncontrolled server error

- Related scenario: `EXP-017`
- Severity: High
- Priority: High
- Reproducibility: Always in the captured Chromium execution
- Status: Open

### Steps

1. Open the factorial calculator.
2. Enter `-1`.
3. Select **Calculate!**.
4. Observe the validation/result area and factorial network response.

### Expected

The negative integer is rejected through client-side validation, or the server returns a controlled `4xx` response with a clear user-facing message. No `5xx` response occurs.

### Actual

The value bypasses client-side integer validation. The result area remains blank and the backend returns an uncontrolled `500 Internal Server Error`.

### Impact

Invalid input reaches the backend, produces an unhandled server failure and gives the user no actionable feedback.

## Automation correction for BUG-002

The initial accessibility assertion used the browser-computed accessible name, which can derive a fallback name from placeholder text. The corrected test explicitly requires an associated `<label>`, `aria-label` or `aria-labelledby`, matching the documented defect and accessibility requirement.
