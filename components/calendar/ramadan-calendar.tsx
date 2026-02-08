'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { getAvailabilityColor } from '@/lib/utils'

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

  const getColor = (date: Date): string => {
    const dateKey = date.toISOString().split('T')[0]
    const data = availability[dateKey]
    if (!data) return 'gray'
    return getAvailabilityColor(data.availableSeats)
  }

  const handleDateClick = (date: Date) => {
    if (onDateSelect) {
      onDateSelect(date)
    }
  }

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString()
  }

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
                const color = getColor(date)
                const past = isPast(date)
                const todayDate = isToday(date)
                const isSelected =
                  selectedDate &&
                  date.toDateString() === selectedDate.toDateString()
                const isFull = color === 'red'

                return (
                  <button
                    key={dateKey}
                    onClick={() => !past && !isFull && handleDateClick(date)}
                    disabled={past || isFull}
                    className={`
                      relative p-2 rounded-xl text-center transition-all min-h-[4rem]
                      ${past ? 'opacity-40 cursor-not-allowed' : 'active:scale-95'}
                      ${!past && !isFull ? 'cursor-pointer' : ''}
                      ${color === 'green' && !past ? 'bg-green-50 border border-green-200' : ''}
                      ${color === 'orange' && !past ? 'bg-amber-50 border border-amber-200' : ''}
                      ${color === 'red' && !past ? 'bg-red-50 border border-red-200 cursor-not-allowed' : ''}
                      ${color === 'gray' ? 'bg-gray-50 border border-gray-200' : ''}
                      ${isSelected ? 'ring-2 ring-eand-red ring-offset-1 !bg-red-50 !border-eand-red' : ''}
                      ${todayDate && !isSelected ? 'ring-1 ring-gray-400' : ''}
                    `}
                  >
                    {todayDate && (
                      <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-[9px] font-bold text-eand-red bg-white px-1 rounded">
                        TODAY
                      </span>
                    )}
                    <div className="text-base font-bold leading-tight">
                      {date.getDate()}
                    </div>
                    <div className="text-[10px] text-gray-500 leading-tight">
                      {dayNames[date.getDay()]}
                    </div>
                    {data && !past && (
                      <div className={`text-[10px] font-semibold mt-0.5 leading-tight ${
                        isFull ? 'text-red-500' : color === 'orange' ? 'text-amber-600' : 'text-green-600'
                      }`}>
                        {isFull ? 'Full' : `${data.availableSeats}`}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
            {/* Compact legend */}
            <div className="mt-3 flex items-center justify-center gap-3 text-[10px] text-gray-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
                Available
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
                Limited
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-400 inline-block"></span>
                Full
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
