import { sendEmail } from './email'

interface BookingConfirmationData {
  serialNumber: string
  reservationDate: Date
  seatCount: number
  location: string
}

interface ModificationAlertData {
  oldDate: Date
  newDate: Date
  serialNumber: string
}

interface WaitingListNotificationData {
  reservationDate: Date
  seatCount: number
  confirmationLink: string
  deadline: Date
}

export async function sendBookingConfirmation(
  email: string,
  data: BookingConfirmationData
): Promise<void> {
  const subject = `Ramadan Tent Reservation Confirmed - ${data.serialNumber}`
  const text = `Dear Employee,

Your reservation for the e& Egypt Ramadan Tent has been confirmed.

Reservation Details:
- Serial Number: ${data.serialNumber}
- Date: ${data.reservationDate.toLocaleDateString()}
- Seats: ${data.seatCount}
- Location: ${data.location}

The tent is open — just walk in! No QR code needed.

Thank you!
e& Egypt HR Team`

  await sendEmail({ to: email, subject, text })
}

export async function sendModificationAlert(
  email: string,
  data: ModificationAlertData
): Promise<void> {
  const subject = `Ramadan Tent Reservation Updated - ${data.serialNumber}`
  const text = `Dear Employee,

Your reservation has been successfully moved.

Previous Date: ${data.oldDate.toLocaleDateString()}
New Date: ${data.newDate.toLocaleDateString()}
Serial Number: ${data.serialNumber}

Please note your new reservation date.

Thank you!
e& Egypt HR Team`

  await sendEmail({ to: email, subject, text })
}

export async function sendCancellationConfirmation(
  email: string,
  serialNumber: string
): Promise<void> {
  const subject = `Ramadan Tent Reservation Cancelled - ${serialNumber}`
  const text = `Dear Employee,

Your reservation (${serialNumber}) has been cancelled.

If you need to make a new reservation, please visit the booking portal.

Thank you!
e& Egypt HR Team`

  await sendEmail({ to: email, subject, text })
}

export async function sendWaitingListNotification(
  email: string,
  data: WaitingListNotificationData
): Promise<void> {
  const deadlineTime = data.deadline.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const subject = `Ramadan Tent - A Spot is Available!`
  const text = `Dear Employee,

Good news! A spot has opened up for the Ramadan Tent.

Date: ${data.reservationDate.toLocaleDateString()}
Seats Available: ${data.seatCount}

You have until ${deadlineTime} to confirm your booking.

Confirm now: ${data.confirmationLink}

Thank you!
e& Egypt HR Team`

  await sendEmail({ to: email, subject, text })
}

export async function sendReminder(
  email: string,
  serialNumber: string,
  reservationDate: Date
): Promise<void> {
  const subject = `Reminder: Ramadan Tent Reservation Tomorrow - ${serialNumber}`
  const text = `Dear Employee,

This is a reminder that you have a reservation for the Ramadan Tent tomorrow.

Date: ${reservationDate.toLocaleDateString()}
Serial Number: ${serialNumber}

The tent is open — just walk in!

Thank you!
e& Egypt HR Team`

  await sendEmail({ to: email, subject, text })
}
