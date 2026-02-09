// Email service using Resend (https://resend.com)
// Uses HTTP API — no SMTP needed, bypasses corporate email security

const RESEND_API_KEY = process.env.RESEND_API_KEY
const DEFAULT_FROM = process.env.EMAIL_FROM || 'Eand Ramadan Tent <ramadan@theoffsight.com>'

function isConfigured(): boolean {
  return !!RESEND_API_KEY
}

export async function sendEmail(options: {
  to: string
  subject: string
  text: string
  html?: string
}): Promise<boolean> {
  if (!isConfigured()) {
    console.log(`[Email][LOG ONLY] To: ${options.to} | Subject: ${options.subject}`)
    console.log(options.text)
    return false
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: DEFAULT_FROM,
        to: [options.to],
        subject: options.subject,
        text: options.text,
        html: options.html,
      }),
    })

    if (response.ok) {
      const data = await response.json()
      console.log(`[Email] Sent to ${options.to} (id: ${data.id})`)
      return true
    }

    const errorData = await response.json().catch(() => null)
    console.error('[Email] Resend error:', errorData?.message || response.statusText)
    return false
  } catch (error) {
    console.error('[Email] Failed to send:', error)
    return false
  }
}
