import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSerialNumber(): string {
  const year = new Date().getFullYear().toString().slice(-2)
  const random = Math.floor(1000 + Math.random() * 9000)
  return `RAM-${year}-${random}`
}

/**
 * Generate a unique serial number with DB collision check.
 * Retries up to maxAttempts times if a collision is found.
 */
export async function generateUniqueSerialNumber(
  prisma: { reservation: { findUnique: (args: any) => Promise<any> } },
  maxAttempts: number = 10
): Promise<string> {
  for (let i = 0; i < maxAttempts; i++) {
    const serialNumber = generateSerialNumber()
    const existing = await prisma.reservation.findUnique({
      where: { serialNumber },
      select: { id: true },
    })
    if (!existing) {
      return serialNumber
    }
  }
  throw new Error('Failed to generate a unique serial number after multiple attempts')
}

export function isValidEandEmail(email: string): boolean {
  const emailLower = email.toLowerCase()
  return emailLower.endsWith('@eand.com') || emailLower.endsWith('@goldinkollar.com')
}

export const MAX_CAPACITY = 120

export function calculateCredits(seatCount: number): number {
  if (seatCount === MAX_CAPACITY) {
    return 200 // Full tent booking
  }
  return seatCount * 10 // 10 credits per seat for partial bookings
}

export function getAvailabilityColor(availableSeats: number, totalSeats: number = MAX_CAPACITY): string {
  if (availableSeats === 0) return 'red'
  if (availableSeats <= 20) return 'orange'
  return 'green'
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
