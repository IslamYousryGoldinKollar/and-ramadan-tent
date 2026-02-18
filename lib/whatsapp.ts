// WhatsApp delivery is intentionally disabled for now.
// Kept as compatibility no-op helpers.

import { normalizeEgyptPhone } from './sms'

interface WhatsAppResult {
  success: boolean
  messageId?: string
}

/**
 * WhatsApp sending is disabled.
 */
export async function sendWhatsApp(to: string, body: string): Promise<WhatsAppResult> {
  const normalizedTo = normalizeEgyptPhone(to)
  console.log(`[WhatsApp][DISABLED] To: ${normalizedTo} | Body: ${body}`)
  return { success: false }
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
