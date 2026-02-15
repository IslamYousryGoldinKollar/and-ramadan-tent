// WhatsApp messaging via Twilio WhatsApp API
// Uses the same Twilio credentials as SMS, but with whatsapp: prefix
// Sandbox: +14155238886 | Production: your WhatsApp Business number

import { normalizeEgyptPhone } from './sms'

interface WhatsAppResult {
  success: boolean
  messageId?: string
}

const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN
const TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM

function isWhatsAppConfigured(): boolean {
  return !!(TWILIO_SID && TWILIO_TOKEN && TWILIO_WHATSAPP_FROM)
}

/**
 * Send a WhatsApp message via Twilio
 */
export async function sendWhatsApp(to: string, body: string): Promise<WhatsAppResult> {
  const normalizedTo = normalizeEgyptPhone(to)

  if (!isWhatsAppConfigured()) {
    console.log(`[WhatsApp][LOG ONLY] To: ${normalizedTo} | Body: ${body}`)
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
        To: `whatsapp:${normalizedTo}`,
        From: `whatsapp:${TWILIO_WHATSAPP_FROM}`,
        Body: body,
      }),
    })

    if (response.ok) {
      const data = await response.json()
      console.log(`[WhatsApp] Sent to ${normalizedTo} | SID: ${data.sid}`)
      return { success: true, messageId: data.sid }
    }

    const errorData = await response.json().catch(() => null)
    console.error('[WhatsApp] Twilio error:', errorData?.message || response.statusText)
    return { success: false }
  } catch (error) {
    console.error('[WhatsApp] Failed to send:', error)
    return { success: false }
  }
}

/**
 * Send booking confirmation via WhatsApp
 */
export async function sendBookingConfirmationWhatsApp(
  phone: string,
  serialNumber: string,
  date: Date,
  seatCount: number
): Promise<WhatsAppResult> {
  const dateStr = date.toLocaleDateString('en-EG')
  const body = `*e& Ramadan Tent - Booking Confirmed* ✅

📋 *Serial:* ${serialNumber}
📅 *Date:* ${dateStr}
💺 *Seats:* ${seatCount}
📍 *Location:* e& Egypt HQ Kattameya, L1

*Please note:*
🕐 Arrive at least *30 min before Maghrib* prayer.
🍽️ Please *bring your own* plates, cutlery & dining essentials.
🔄 If you can't attend, please *cancel your reservation* so colleagues can use the spot.

Ramadan Kareem! 🌙`

  return sendWhatsApp(phone, body)
}

/**
 * Send cancellation confirmation via WhatsApp
 */
export async function sendCancellationWhatsApp(
  phone: string,
  serialNumber: string
): Promise<WhatsAppResult> {
  const body = `*e& Ramadan Tent - Reservation Cancelled*

Your reservation *${serialNumber}* has been cancelled.

To make a new reservation, visit the booking portal.`

  return sendWhatsApp(phone, body)
}

/**
 * Send reschedule confirmation via WhatsApp
 */
export async function sendRescheduleWhatsApp(
  phone: string,
  serialNumber: string,
  oldDate: Date,
  newDate: Date
): Promise<WhatsAppResult> {
  const oldDateStr = oldDate.toLocaleDateString('en-EG')
  const newDateStr = newDate.toLocaleDateString('en-EG')
  const body = `*e& Ramadan Tent - Reservation Updated* 📝

Your reservation has been moved.

📅 *Previous:* ${oldDateStr}
📅 *New Date:* ${newDateStr}
📋 *Serial:* ${serialNumber}

Please note your new date. Ramadan Kareem! 🌙`

  return sendWhatsApp(phone, body)
}
