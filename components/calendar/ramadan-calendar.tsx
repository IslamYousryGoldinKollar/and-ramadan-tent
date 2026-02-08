'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'

const TOTAL_SEATS = 120

interface AvailabilityData {
  date: string
  availableSeats: number
  bookedSeats: number
}

interface RamadanCalendarProps {
  onDateSelect?: (date: Date) => void
  selectedDate?: Date | null
  startDate?: Date
}

export function RamadanCalendar({
  onDateSelect,
  selectedDate,
  startDate,
}: RamadanCalendarProps) {
  const [availability, setAvailability] = useState<Record<string, AvailabilityData>>({})
  const [loading, setLoading] = useState(true)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Calculate Ramadan dates (30 days from start)
  const ramadanStart = startDate || new Date()
  const dates: Date[] = []
  for (let i = 0; i < 30; i++) {
    const date = new Date(ramadanStart)
    date.setDate(date.getDate() + i)
    dates.push(date)
  }

  useEffect(() => {
    async function fetchAvailability() {
      setLoading(true)
      try {
        const start = dates[0]
        const end = dates[dates.length - 1]
        const response = await fetch(
          `/api/availability/range?startDate=${start.toISOString()}&endDate=${end.toISOString()}`
        )
        if (response.ok) {
          const data: Record<string, { availableSeats: number; bookedSeats: number }> = await response.json()
          const availabilityMap: Record<string, AvailabilityData> = {}
          for (const [dateKey, info] of Object.entries(data)) {
            availabilityMap[dateKey] = {
              date: dateKey,
              availableSeats: info.availableSeats,
              bookedSeats: info.bookedSeats,
            }
          }
          setAvailability(availabilityMap)
        }
      } catch (error) {
        console.error('Error fetching availability:', error)
      }
      setLoading(false)
    }

    fetchAvailability()
  }, [startDate])

  const handleDateClick = (date: Date) => {
    if (onDateSelect) {
      onDateSelect(date)
    }
  }

  const isToday = (date: Date) => date.toDateString() === today.toDateString()
  const isPast = (date: Date) => {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    return d < today
  }

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <Card className="border border-gray-100 overflow-hidden">
      <CardContent className="p-3">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-eand-red"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-5 gap-2">
              {dates.map((date) => {
                const dateKey = date.toISOString().split('T')[0]
                const data = availability[dateKey]
                const past = isPast(date)
                const todayDate = isToday(date)
                const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString()
                const available = data?.availableSeats ?? TOTAL_SEATS
                const booked = data?.bookedSeats ?? 0
                const isFull = available === 0
                const pct = Math.round((booked / TOTAL_SEATS) * 100)
                const isLimited = available > 0 && available <= 20

                // Colors
                const barColor = isFull ? 'bg-red-500' : isLimited ? 'bg-amber-400' : 'bg-green-400'
                const textColor = isFull ? 'text-red-500' : isLimited ? 'text-amber-600' : 'text-green-600'

                return (
                  <button
                    key={dateKey}
                    onClick={() => !past && !isFull && handleDateClick(date)}
                    disabled={past || isFull}
                    className={`
                      relative p-2 rounded-xl text-center transition-all min-h-[5rem]
                      ${past ? 'opacity-30 cursor-not-allowed' : 'active:scale-95'}
                      ${!past && !isFull ? 'cursor-pointer hover:shadow-md' : ''}
                      ${isFull && !past ? 'bg-red-50 border border-red-200 cursor-not-allowed' : ''}
                      ${!isFull && !past ? 'bg-white border border-gray-200' : ''}
                      ${past ? 'bg-gray-50 border border-gray-100' : ''}
                      ${isSelected ? 'ring-2 ring-eand-red ring-offset-1 !border-eand-red shadow-md' : ''}
                      ${todayDate && !isSelected ? 'ring-1 ring-red-300' : ''}
                    `}
                  >
                    {todayDate && (
                      <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[8px] font-bold text-white bg-eand-red px-1.5 py-0.5 rounded-full">
                        TODAY
                      </span>
                    )}
                    <div className="text-base font-bold leading-tight">{date.getDate()}</div>
                    <div className="text-[10px] text-gray-400 leading-tight">{dayNames[date.getDay()]}</div>
                    {!past && (
                      <>
                        {/* Progress bar */}
                        <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${barColor}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className={`text-[9px] font-semibold mt-0.5 leading-tight ${textColor}`}>
                          {isFull ? 'FULL' : `${available} left`}
                        </div>
                      </>
                    )}
                  </button>
                )
              })}
            </div>
            {/* Legend */}
            <div className="mt-3 flex items-center justify-center gap-4 text-[10px] text-gray-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                Available
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                Limited (&le;20)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                Full
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
