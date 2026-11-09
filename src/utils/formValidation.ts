/**
 * Clinical & Ergonomic Input Sanitizers and Validators for NNTS Web Application
 * Ensures inputs strictly conform to their domain types (e.g. Names cannot contain numbers).
 */

/**
 * Filter text to only allow alphabetic characters, spaces, and valid name punctuations (. , ' ’).
 * Completely strips digits and special symbols to prevent numbers in name fields.
 */
export function filterNameInput(value: string): string {
  // Allow letters (including Indonesian accents if any), spaces, dots, commas, apostrophes
  return value.replace(/[^a-zA-Z\s.,'’-]/g, '');
}

/**
 * Validates whether a name contains at least 2 alphabetic characters and zero digits.
 */
export function validateName(value: string): { valid: boolean; error?: string } {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return { valid: false };
  }
  if (/\d/.test(value)) {
    return { valid: false, error: 'Nama tidak boleh mengandung angka' };
  }
  if (trimmed.length < 2) {
    return { valid: false, error: 'Nama minimal 2 huruf' };
  }
  return { valid: true };
}

/**
 * Filter input to only allow numeric digits (e.g. for NIP, SIP, NIK, or phone numbers).
 */
export function filterDigitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Filter code inputs (e.g. Invitation codes like POSYANDU-2026, DOKTER-2026)
 * Uppercase alphanumeric and dashes only.
 */
export function filterInvitationCode(value: string): string {
  return value.replace(/[^a-zA-Z0-9-]/g, '').toUpperCase();
}

/**
 * Filter positive decimal numbers for somatic measures (Weight, Height, MUAC).
 */
export function filterPositiveDecimal(value: string): string {
  // Allow digits and at most one decimal point
  const cleaned = value.replace(/[^0-9.]/g, '');
  const parts = cleaned.split('.');
  if (parts.length > 2) {
    return `${parts[0]}.${parts.slice(1).join('')}`;
  }
  return cleaned;
}
