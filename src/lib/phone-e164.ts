/**
 * Normalize phone input to E.164 (+country digits, no spaces).
 * Server strips spaces; clients should still send a consistent + prefix.
 */
export function toE164PhoneNumber(input: string): string {
  const trimmed = input.replace(/\s/g, "").trim();
  if (!trimmed) return trimmed;
  if (trimmed.startsWith("+")) return trimmed;
  const digits = trimmed.replace(/^00/, "").replace(/\D/g, "");
  if (digits.startsWith("237")) return `+${digits}`;
  return `+237${digits}`;
}
