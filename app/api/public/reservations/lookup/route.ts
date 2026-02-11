import { NextRequest, NextResponse } from 'next/server'
import { db, toPlainObject } from '@/lib/db'
import { z } from 'zod'

const lookupSchema = z.object({
  serialNumber: z.string(),
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = lookupSchema.parse(body)

    const snap = await db.collection('reservations')
      .where('serialNumber', '==', validated.serialNumber)
      .limit(1)
      .get()

    if (snap.empty) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 })
    }

    const reservation = toPlainObject<any>(snap.docs[0])!

    if (reservation.email?.toLowerCase() !== validated.email.toLowerCase()) {
      return NextResponse.json({ error: 'Email does not match reservation' }, { status: 403 })
    }

    return NextResponse.json(reservation)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 })
    }
    console.error('Error looking up reservation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
