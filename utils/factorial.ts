export function factorial(value: number): string {
  if (!Number.isInteger(value) || value < 0) throw new Error('Factorial requires a non-negative integer');
  let result = 1n;
  for (let current = 2n; current <= BigInt(value); current += 1n) result *= current;
  return result.toString();
}
