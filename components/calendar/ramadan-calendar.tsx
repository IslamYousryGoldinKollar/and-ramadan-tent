'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, XCircle, AlertTriangle, Sparkles } from 'lucide-react'
import { MAX_CAPACITY } from '@/lib/utils'

const DEFAULT_RAMADAN_START_DATE = new Date('2026-02-19T12:00:00.000Z')

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

  // 48-hour advance booking cutoff
  const minBookingDate = new Date()
  minBookingDate.setHours(minBookingDate.getHours() + 48)
  minBookingDate.setHours(0, 0, 0, 0)

  // Calculate Ramadan dates (30 days from start)
  const ramadanStart = startDate || DEFAULT_RAMADAN_START_DATE
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
  const isTooSoon = (date: Date) => {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    return d >= today && d < minBookingDate
  }

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  return (
    <div className="space-y-4">
      {/* Color Legend — shown prominently at top */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3">
        <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2 text-center">What the colors mean</p>
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-emerald-50 border border-emerald-200">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span className="text-[10px] font-bold text-emerald-700">Available</span>
            <span className="text-[9px] text-emerald-600">Tap to book!</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-amber-50 border border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span className="text-[10px] font-bold text-amber-700">Almost Full</span>
            <span className="text-[9px] text-amber-600">Hurry up!</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-red-50 border border-red-200">
            <XCircle className="h-4 w-4 text-red-400" />
            <span className="text-[10px] font-bold text-red-600">Full</span>
            <span className="text-[9px] text-red-500">No seats</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card className="overflow-hidden">
        <CardContent className="p-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eand-ocean"></div>
              <p className="text-sm text-gray-400">Loading available dates...</p>
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-2">
              {dates.map((date, index) => {
                const dateKey = date.toISOString().split('T')[0]
                const data = availability[dateKey]
                const past = isPast(date)
                const tooSoon = isTooSoon(date)
                const todayDate = isToday(date)
                const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString()
                const available = data?.availableSeats ?? MAX_CAPACITY
                const booked = data?.bookedSeats ?? 0
                const isFull = available === 0
                const isFridayOrSaturday = date.getDay() === 5 || date.getDay() === 6
                const disabled = past || tooSoon || isFull || isFridayOrSaturday
                const pct = Math.round((booked / MAX_CAPACITY) * 100)
                const isLimited = available > 0 && available <= 20
                const isAlmostFull = available > 0 && available <= 40

                // Visual state
                let cardBg = 'bg-emerald-50/60 border-emerald-200/60 hover:border-emerald-400 hover:shadow-lg hover:bg-emerald-50'
                let numberColor = 'text-gray-900'
                let statusBg = 'bg-emerald-100'
                let statusText = 'text-emerald-700'
                let statusLabel = `${available} seats`
                let barColor = 'bg-emerald-400'
                let emoji = ''

                if (isFull && !past) {
                  cardBg = 'bg-red-50/80 border-red-200 cursor-not-allowed'
                  numberColor = 'text-red-300'
                  statusBg = 'bg-red-100'
                  statusText = 'text-red-500'
                  statusLabel = 'FULL'
                  barColor = 'bg-red-400'
                  emoji = '✕'
                } else if (isLimited && !past) {
                  cardBg = 'bg-amber-50/80 border-amber-200 hover:border-amber-400 hover:shadow-lg hover:bg-amber-50'
                  statusBg = 'bg-amber-100'
                  statusText = 'text-amber-700'
                  statusLabel = `${available} left!`
                  barColor = 'bg-amber-400'
                  emoji = '⚡'
                } else if (isAlmostFull && !past) {
                  cardBg = 'bg-yellow-50/60 border-yellow-200/60 hover:border-yellow-400 hover:shadow-lg'
                  statusBg = 'bg-yellow-100'
                  statusText = 'text-yellow-700'
                  statusLabel = `${available} left`
                  barColor = 'bg-yellow-400'
                }

                if (isFridayOrSaturday && !past) {
                  cardBg = 'bg-gray-50 border-gray-200/50 cursor-not-allowed'
                  numberColor = 'text-gray-300'
                  statusLabel = 'Closed'
                  statusText = 'text-gray-400'
                }

                if (past || tooSoon) {
                  cardBg = 'bg-gray-50 border-gray-200/50 cursor-not-allowed'
                  numberColor = 'text-gray-300'
                }

                return (
                  <button
                    key={dateKey}
                    onClick={() => !disabled && handleDateClick(date)}
                    disabled={disabled}
                    className={`
                      relative p-2 rounded-xl text-center transition-all duration-200 min-h-[5.5rem] border
                      opacity-0 animate-fade-in-up
                      ${past || tooSoon ? 'opacity-30' : 'active:scale-95'}
                      ${cardBg}
                      ${isSelected ? 'ring-2 ring-eand-ocean ring-offset-2 !border-eand-ocean shadow-lg scale-[1.02]' : ''}
                      ${todayDate && !isSelected ? 'ring-2 ring-ramadan-gold/50' : ''}
                    `}
                    style={{ animationDelay: `${Math.min(index * 30, 600)}ms` }}
                  >
                    {/* Today badge */}
                    {todayDate && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[7px] font-bold text-white bg-ramadan-gold px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                        ⭐ TODAY
                      </span>
                    )}
                    {/* Selected check */}
                    {isSelected && (
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-eand-ocean rounded-full flex items-center justify-center shadow-md">
                        <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                      </span>
                    )}
                    <div className={`text-lg font-bold leading-tight ${numberColor}`}>{date.getDate()}</div>
                    <div className="text-[9px] text-gray-400 leading-tight">{dayNames[date.getDay()]}, {monthNames[date.getMonth()]}</div>
                    {!past && (
                      <>
                        {/* Progress bar */}
                        <div className="mt-1.5 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                            style={{ width: `${Math.max(pct, 3)}%` }}
                          />
                        </div>
                        <div className={`text-[9px] font-bold mt-0.5 leading-tight ${statusText} flex items-center justify-center gap-0.5`}>
                          {emoji && <span>{emoji}</span>}
                          {statusLabel}
                        </div>
                      </>
                    )}
                    {past && (
                      <div className="text-[9px] text-gray-300 mt-2">Past</div>
                    )}
                    {tooSoon && !past && (
                      <div className="text-[9px] text-gray-300 mt-2">Too soon</div>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Helpful hint */}
      <div className="flex items-center gap-2 justify-center px-4">
        <Sparkles className="h-3.5 w-3.5 text-ramadan-gold flex-shrink-0" />
        <p className="text-[11px] text-gray-400 text-center">
          Tap any <span className="text-emerald-600 font-semibold">green</span> or <span className="text-amber-600 font-semibold">yellow</span> date to pick it
        </p>
      </div>
    </div>
  )
}
