// SMS service using Twilio — best provider for Egypt with reliable delivery
// Alternative Egypt-friendly providers: Unifonic, Infobip, Vonage

interface SmsResult {
  success: boolean
  messageId?: string
}

const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN
const TWILIO_MESSAGING_SERVICE_SID = process.env.TWILIO_MESSAGING_SERVICE_SID
const TWILIO_FROM = process.env.TWILIO_PHONE_NUMBER // Fallback if no Messaging Service

function isSmsConfigured(): boolean {
  return !!(TWILIO_SID && TWILIO_TOKEN && (TWILIO_MESSAGING_SERVICE_SID || TWILIO_FROM))
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
 * Send an SMS message via Twilio
 */
export async function sendSms(to: string, body: string): Promise<SmsResult> {
  const normalizedTo = normalizeEgyptPhone(to)

  if (!isSmsConfigured()) {
    console.log(`[SMS][LOG ONLY] To: ${normalizedTo} | Body: ${body}`)
    return { success: false }
  }

  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`
    const auth = Buffer.from(`${TWILIO_SID}:${TWILIO_TOKEN}`).toString('base64')

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: normalizedTo,
        ...(TWILIO_MESSAGING_SERVICE_SID
          ? { MessagingServiceSid: TWILIO_MESSAGING_SERVICE_SID }
          : { From: TWILIO_FROM! }),
        Body: body,
      }),
    })

    if (response.ok) {
      const data = await response.json()
      return { success: true, messageId: data.sid }
    }

    const errorData = await response.json().catch(() => null)
    console.error('[SMS] Twilio error:', errorData?.message || response.statusText)
    return { success: false }
  } catch (error) {
    console.error('[SMS] Failed to send:', error)
    return { success: false }
  }
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
