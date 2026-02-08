import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'
import { ReservationStatus } from '@prisma/client'

/**
 * Admin-only endpoint to lookup reservation by serial number
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const reservation = await prisma.reservation.findUnique({
      where: { serialNumber: params.id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            employeeId: true,
            email: true,
            department: true,
          },
        },
        auditLogs: {
          orderBy: { timestamp: 'desc' },
          take: 10,
        },
      },
    })

    if (!reservation) {
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(reservation)
  } catch (error) {
    console.error('Error fetching reservation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Admin-only endpoint to update reservation status (e.g., check-in)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { status } = body

    if (!status || !Object.values(ReservationStatus).includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    const reservation = await prisma.reservation.update({
      where: { serialNumber: params.id },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            employeeId: true,
            email: true,
            department: true,
          },
        },
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        reservationId: reservation.id,
        actionType: status === 'CHECKED_IN' ? 'CHECKED_IN' : 'MODIFIED',
        metadata: JSON.stringify({ status }),
      },
    })

    return NextResponse.json(reservation)
  } catch (error) {
    console.error('Error updating reservation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
