import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'
import { ReservationStatus, Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const dateFrom = searchParams.get('dateFrom') || ''
    const dateTo = searchParams.get('dateTo') || ''
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortDir = (searchParams.get('sortDir') || 'desc') as 'asc' | 'desc'

    const where: Prisma.ReservationWhereInput = {}

    // Search filter
    if (search) {
      where.OR = [
        { employeeName: { contains: search, mode: 'insensitive' } },
        { employeeId: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { serialNumber: { contains: search, mode: 'insensitive' } },
        { phoneNumber: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Status filter
    if (status && Object.values(ReservationStatus).includes(status as ReservationStatus)) {
      where.status = status as ReservationStatus
    }

    // Date range filter
    if (dateFrom) {
      where.reservationDate = { ...((where.reservationDate as any) || {}), gte: new Date(dateFrom) }
    }
    if (dateTo) {
      const end = new Date(dateTo)
      end.setHours(23, 59, 59, 999)
      where.reservationDate = { ...((where.reservationDate as any) || {}), lte: end }
    }

    // Sorting
    const orderBy: Prisma.ReservationOrderByWithRelationInput = {}
    const validSortFields = ['createdAt', 'reservationDate', 'employeeName', 'seatCount', 'status', 'serialNumber']
    if (validSortFields.includes(sortBy)) {
      (orderBy as any)[sortBy] = sortDir
    } else {
      orderBy.createdAt = 'desc'
    }

    const [reservations, total] = await Promise.all([
      prisma.reservation.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: { select: { fullName: true, department: true } },
        },
      }),
      prisma.reservation.count({ where }),
    ])

    return NextResponse.json({
      reservations,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Error fetching reservations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - bulk delete or clear all
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { ids, clearAll } = body

    if (clearAll) {
      const result = await prisma.reservation.deleteMany({})
      return NextResponse.json({ deleted: result.count })
    }

    if (ids && Array.isArray(ids) && ids.length > 0) {
      const result = await prisma.reservation.deleteMany({ where: { id: { in: ids } } })
      return NextResponse.json({ deleted: result.count })
    }

    return NextResponse.json({ error: 'No IDs provided' }, { status: 400 })
  } catch (error) {
    console.error('Error deleting reservations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
