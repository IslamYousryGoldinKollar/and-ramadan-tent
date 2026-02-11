import { NextRequest, NextResponse } from 'next/server'
import { db, toPlainObject, docsToArray, generateUniqueSerialNumber } from '@/lib/db'
import { fillVacatedSlots } from '@/lib/waiting-list'
import { sendCancellationConfirmation, sendModificationAlert } from '@/lib/notifications'
import { MAX_CAPACITY } from '@/lib/utils'
import { generateQRCode } from '@/lib/qrcode'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { z } from 'zod'

const ACTIVE_STATUSES = ['CONFIRMED', 'RESCHEDULED', 'CHECKED_IN']

const rescheduleSchema = z.object({
  email: z.string().email(),
  newDate: z.string().transform((str) => new Date(str)),
})

const cancelSchema = z.object({
  email: z.string().email(),
})

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ip = getClientIp(request)
    const limiter = rateLimit(`public-cancel:${ip}`, { windowMs: 60_000, maxRequests: 5 })
    if (!limiter.success) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }

    const body = await request.json()
    const validated = cancelSchema.parse(body)

    const doc = await db.collection('reservations').doc(params.id).get()
    if (!doc.exists) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 })
    }

    const reservation = toPlainObject<any>(doc)!

    if (!reservation.email) {
      return NextResponse.json({ error: 'This reservation requires authentication' }, { status: 403 })
    }
    if (reservation.email.toLowerCase() !== validated.email.toLowerCase()) {
      return NextResponse.json({ error: 'Email does not match reservation' }, { status: 403 })
    }
    if (reservation.status === 'CANCELLED') {
      return NextResponse.json({ error: 'Reservation already cancelled' }, { status: 400 })
    }

    await db.collection('reservations').doc(params.id).update({
      status: 'CANCELLED',
      updatedAt: new Date(),
    })

    if (reservation.email) {
      await sendCancellationConfirmation(reservation.email, reservation.serialNumber)
    }

    await fillVacatedSlots(reservation.reservationDate, reservation.seatCount)
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 })
    }
    console.error('Error cancelling reservation:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ip = getClientIp(request)
    const limiter = rateLimit(`public-reschedule:${ip}`, { windowMs: 60_000, maxRequests: 5 })
    if (!limiter.success) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }

    const body = await request.json()
    const validated = rescheduleSchema.parse(body)

    const doc = await db.collection('reservations').doc(params.id).get()
    if (!doc.exists) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 })
    }

    const reservation = toPlainObject<any>(doc)!

    if (!reservation.email) {
      return NextResponse.json({ error: 'This reservation requires authentication' }, { status: 403 })
    }
    if (reservation.email.toLowerCase() !== validated.email.toLowerCase()) {
      return NextResponse.json({ error: 'Email does not match reservation' }, { status: 403 })
    }
    if (reservation.status === 'CANCELLED') {
      return NextResponse.json({ error: 'Cannot reschedule a cancelled reservation' }, { status: 400 })
    }

    const oldDate = reservation.reservationDate

    // Check availability for new date
    const startOfDay = new Date(validated.newDate)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(validated.newDate)
    endOfDay.setHours(23, 59, 59, 999)

    let bookedSeats = 0
    for (const status of ACTIVE_STATUSES) {
      const snap = await db.collection('reservations')
        .where('reservationDate', '>=', startOfDay)
        .where('reservationDate', '<=', endOfDay)
        .where('status', '==', status)
        .get()
      for (const d of snap.docs) {
        if (d.id !== params.id) {
          bookedSeats += d.data().seatCount || 0
        }
      }
    }

    const availableSeats = MAX_CAPACITY - bookedSeats
    if (availableSeats < reservation.seatCount) {
      return NextResponse.json({ error: `Only ${availableSeats} seats available on the new date` }, { status: 400 })
    }

    const newSerialNumber = await generateUniqueSerialNumber()
    const newQrCodeString = await generateQRCode(newSerialNumber)

    await db.collection('reservations').doc(params.id).update({
      reservationDate: validated.newDate,
      status: 'RESCHEDULED',
      serialNumber: newSerialNumber,
      qrCodeString: newQrCodeString,
      updatedAt: new Date(),
    })

    if (reservation.email) {
      await sendModificationAlert(reservation.email, {
        oldDate,
        newDate: validated.newDate,
        serialNumber: newSerialNumber,
      })
    }

    await fillVacatedSlots(oldDate, reservation.seatCount)

    const updatedDoc = await db.collection('reservations').doc(params.id).get()
    return NextResponse.json(toPlainObject(updatedDoc))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 })
    }
    console.error('Error rescheduling reservation:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 })
  }
}
