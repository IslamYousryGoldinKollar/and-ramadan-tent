'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { RamadanCalendar } from '@/components/calendar/ramadan-calendar'
import { BookingForm } from '@/components/booking/booking-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from 'lucide-react'

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Select a date from the calendar below to make a reservation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RamadanCalendar
              onDateSelect={setSelectedDate}
              selectedDate={selectedDate}
            />
          </div>
          <div className="lg:col-span-1">
            <BookingForm selectedDate={selectedDate} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
