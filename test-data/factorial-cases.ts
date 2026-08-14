export const validFactorials = [
  { id: 'EXP-006', input: '0', expected: '1' },
  { id: 'EXP-007', input: '1', expected: '1' },
  { id: 'EXP-008', input: '5', expected: '120' },
  { id: 'EXP-009', input: '10', expected: '3628800' }
] as const;

export const clearlyInvalidInputs = [
  { id: 'EXP-013', label: 'empty input', input: '' },
  { id: 'EXP-014', label: 'whitespace-only input', input: '   ' },
  { id: 'EXP-015', label: 'alphabetic input', input: 'abc' },
  { id: 'EXP-016', label: 'alphanumeric input', input: '12abc' },
  { id: 'EXP-019', label: 'special-character input', input: '@#$' },
  { id: 'EXP-026', label: 'HTML/script-like input', input: '<script>alert(1)</script>' },
  { id: 'EXP-027', label: 'SQL-like input', input: "' OR 1=1 --" }
] as const;
