import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ReservationStatus } from '@prisma/client'
import { fillVacatedSlots } from '@/lib/waiting-list'
import { sendCancellationConfirmation, sendModificationAlert } from '@/lib/notifications'
import { generateUniqueSerialNumber } from '@/lib/utils'
import { generateQRCode } from '@/lib/qrcode'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { z } from 'zod'

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
    // Rate limit: 5 requests per minute per IP
    const ip = getClientIp(request)
    const limiter = rateLimit(`public-cancel:${ip}`, { windowMs: 60_000, maxRequests: 5 })
    if (!limiter.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const validated = cancelSchema.parse(body)

    const reservation = await prisma.reservation.findUnique({
      where: { id: params.id },
    })

    if (!reservation) {
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 }
      )
    }

    // Verify email matches (for public reservations)
    if (!reservation.email) {
      return NextResponse.json(
        { error: 'This reservation requires authentication' },
        { status: 403 }
      )
    }
    
    if (reservation.email.toLowerCase() !== validated.email.toLowerCase()) {
      return NextResponse.json(
        { error: 'Email does not match reservation' },
        { status: 403 }
      )
    }

    if (reservation.status === ReservationStatus.CANCELLED) {
      return NextResponse.json(
        { error: 'Reservation already cancelled' },
        { status: 400 }
      )
    }

    // Update reservation status
    await prisma.reservation.update({
      where: { id: params.id },
      data: { status: ReservationStatus.CANCELLED },
    })

    // Send cancellation email
    if (reservation.email) {
      await sendCancellationConfirmation(reservation.email, reservation.serialNumber)
    }

    // Trigger waiting list fill
    await fillVacatedSlots(reservation.reservationDate, reservation.seatCount)

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error cancelling reservation:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Rate limit: 5 requests per minute per IP
    const ip = getClientIp(request)
    const limiter = rateLimit(`public-reschedule:${ip}`, { windowMs: 60_000, maxRequests: 5 })
    if (!limiter.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const validated = rescheduleSchema.parse(body)

    const reservation = await prisma.reservation.findUnique({
      where: { id: params.id },
    })

    if (!reservation) {
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 }
      )
    }

    // Verify email matches (for public reservations)
    if (!reservation.email) {
      return NextResponse.json(
        { error: 'This reservation requires authentication' },
        { status: 403 }
      )
    }
    
    if (reservation.email.toLowerCase() !== validated.email.toLowerCase()) {
      return NextResponse.json(
        { error: 'Email does not match reservation' },
        { status: 403 }
      )
    }

    if (reservation.status === ReservationStatus.CANCELLED) {
      return NextResponse.json(
        { error: 'Cannot reschedule a cancelled reservation' },
        { status: 400 }
      )
    }

    const oldDate = reservation.reservationDate

    // Check availability for new date
    const startOfDay = new Date(validated.newDate)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(validated.newDate)
    endOfDay.setHours(23, 59, 59, 999)

    const existingReservations = await prisma.reservation.findMany({
      where: {
        reservationDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          in: [ReservationStatus.CONFIRMED, ReservationStatus.RESCHEDULED, ReservationStatus.CHECKED_IN],
        },
        id: { not: params.id },
      },
    })

    const bookedSeats = existingReservations.reduce((sum: number, r) => sum + r.seatCount, 0)
    const availableSeats = 20 - bookedSeats

    if (availableSeats < reservation.seatCount) {
      return NextResponse.json(
        { error: `Only ${availableSeats} seats available on the new date` },
        { status: 400 }
      )
    }

    // Generate new unique serial number and QR code
    const newSerialNumber = await generateUniqueSerialNumber(prisma)
    const newQrCodeString = await generateQRCode(newSerialNumber)

    // Update reservation
    const updatedReservation = await prisma.reservation.update({
      where: { id: params.id },
      data: {
        reservationDate: validated.newDate,
        status: ReservationStatus.RESCHEDULED,
        serialNumber: newSerialNumber,
        qrCodeString: newQrCodeString,
      },
    })

    // Send modification email
    if (reservation.email) {
      await sendModificationAlert(reservation.email, {
        oldDate,
        newDate: validated.newDate,
        serialNumber: newSerialNumber,
      })
    }

    // Trigger waiting list fill for old date
    await fillVacatedSlots(oldDate, reservation.seatCount)

    return NextResponse.json(updatedReservation)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error rescheduling reservation:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
