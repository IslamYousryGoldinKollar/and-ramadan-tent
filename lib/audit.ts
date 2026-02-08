import { prisma } from './prisma'
import { AuditActionType } from '@prisma/client'

/**
 * Create an audit log entry
 */
export async function createAuditLog(
  userId: string,
  reservationId: string | null,
  actionType: AuditActionType,
  metadata?: Record<string, any>
) {
  return prisma.auditLog.create({
    data: {
      userId,
      reservationId,
      actionType,
      metadata: metadata ? JSON.stringify(metadata) : null,
    },
  })
}

/**
 * Get audit logs for a reservation
 */
export async function getReservationAuditLogs(reservationId: string) {
  return prisma.auditLog.findMany({
    where: { reservationId },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          employeeId: true,
        },
      },
    },
    orderBy: { timestamp: 'desc' },
  })
}

/**
 * Get all audit logs (admin only)
 */
export async function getAllAuditLogs(startDate?: Date, endDate?: Date) {
  return prisma.auditLog.findMany({
    where: {
      ...(startDate && endDate
        ? {
            timestamp: {
              gte: startDate,
              lte: endDate,
            },
          }
        : {}),
    },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          employeeId: true,
        },
      },
      reservation: {
        select: {
          id: true,
          serialNumber: true,
          reservationDate: true,
        },
      },
    },
    orderBy: { timestamp: 'desc' },
    take: 1000, // Limit to prevent performance issues
  })
}
