// Phone helpers.
// SMS delivery is intentionally disabled for now.

interface SmsResult {
  success: boolean
  messageId?: string
}

/**
 * Normalize Egyptian phone numbers to E.164 format (+20...)
 */
export function normalizeEgyptPhone(phone: string): string {
  let cleaned = phone.replace(/[\s\-\(\)]/g, '')

  // Already in E.164
  if (cleaned.startsWith('+20')) return cleaned

  // Starts with 20 (no plus)
  if (cleaned.startsWith('20') && cleaned.length >= 12) return `+${cleaned}`

  // Local format starting with 0
  if (cleaned.startsWith('0')) return `+2${cleaned}`

  // Just the number without leading 0 (e.g. 1xxxxxxxxx)
  if (cleaned.length === 10) return `+20${cleaned}`

  return `+20${cleaned}`
}

/**
 * Validate that a phone number looks like a valid Egyptian mobile number
 */
export function isValidEgyptPhone(phone: string): boolean {
  const normalized = normalizeEgyptPhone(phone)
  // Egyptian mobile numbers: +20 1x xxxx xxxx (11 digits after +20)
  return /^\+20(10|11|12|15)\d{8}$/.test(normalized)
}

/**
 * SMS sending is disabled.
 * Kept as a compatibility no-op to avoid changing API contracts.
 */
export async function sendSms(to: string, body: string): Promise<SmsResult> {
  const normalizedTo = normalizeEgyptPhone(to)
  console.log(`[SMS][DISABLED] To: ${normalizedTo} | Body: ${body}`)
  return { success: false }
}

/**
 * Send booking confirmation SMS
 */
export async function sendBookingConfirmationSms(
  phone: string,
  serialNumber: string,
  date: Date,
  seatCount: number
): Promise<SmsResult> {
  const dateStr = date.toLocaleDateString('en-EG')
  const body = `e& Ramadan Tent - Confirmed! Serial: ${serialNumber} | Date: ${dateStr} | Seats: ${seatCount} | Location: HQ Kattameya, L1. Arrive 30 min before Maghrib. Bring your own plates & cutlery. If plans change, please cancel so colleagues can use the spot.`

  return sendSms(phone, body)
}
