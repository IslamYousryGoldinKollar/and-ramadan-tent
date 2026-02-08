'use client'

import { useState } from 'react'
import Link from 'next/link'
import { RamadanCalendar } from '@/components/calendar/ramadan-calendar'
import { UserInfoForm } from '@/components/public/user-info-form'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatDate, isValidEandEmail } from '@/lib/utils'
import { Calendar, ArrowLeft, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'

export default function TentRegistrationPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [employeeId, setEmployeeId] = useState('')
  const [employeeName, setEmployeeName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [seatCount, setSeatCount] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<any>(null)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [errors, setErrors] = useState<{
    employeeId?: string
    employeeName?: string
    email?: string
    phoneNumber?: string
  }>({})

  const validateForm = () => {
    const newErrors: typeof errors = {}

    if (!employeeId.trim()) {
      newErrors.employeeId = 'Employee ID is required'
    }
    if (!employeeName.trim()) {
      newErrors.employeeName = 'Full name is required'
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!isValidEandEmail(email)) {
      newErrors.email = 'Email must be from @eand.com domain'
    }
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Mobile number is required'
    } else if (phoneNumber.replace(/[\s\-]/g, '').length < 10) {
      newErrors.phoneNumber = 'Please enter a valid Egyptian mobile number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleBooking = async () => {
    if (!validateForm()) return

    if (!selectedDate) {
      setError('Please select a date from the calendar')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/public/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId,
          employeeName,
          email: email.toLowerCase(),
          phoneNumber: phoneNumber.trim(),
          reservationDate: selectedDate.toISOString(),
          seatCount,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create reservation')
      }

      setSuccess(data)
      setShowSuccessDialog(true)
      setSeatCount(1)
      setEmployeeId('')
      setEmployeeName('')
      setEmail('')
      setPhoneNumber('')
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 safe-top">
        <div className="px-4 py-3 flex items-center justify-between max-w-lg mx-auto w-full">
          <Link href="/" className="flex items-center gap-2 text-gray-600 active:text-eand-red">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm">Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-eand-red">e&</span>
            <span className="text-sm text-gray-500">Egypt</span>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full space-y-5">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Book Your Seat</h1>
          <p className="text-sm text-gray-500">Select a date and fill in your details</p>
        </div>

        {/* Step 1: Calendar */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            1. Choose a Date
          </h2>
          <RamadanCalendar
            onDateSelect={setSelectedDate}
            selectedDate={selectedDate}
          />
        </div>

        {/* Step 2: Your Info */}
        <Card className="border border-gray-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">2. Your Information</CardTitle>
            <CardDescription className="text-sm">
              We&apos;ll send confirmation via email & SMS
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserInfoForm
              employeeId={employeeId}
              employeeName={employeeName}
              email={email}
              phoneNumber={phoneNumber}
              onEmployeeIdChange={setEmployeeId}
              onEmployeeNameChange={setEmployeeName}
              onEmailChange={setEmail}
              onPhoneNumberChange={setPhoneNumber}
              errors={errors}
            />
          </CardContent>
        </Card>

        {/* Step 3: Seats */}
        <Card className="border border-gray-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">3. Number of Seats</CardTitle>
            <CardDescription className="text-sm">
              {selectedDate
                ? `Selected: ${formatDate(selectedDate)}`
                : 'Select a date first'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Input
                id="seats"
                type="number"
                inputMode="numeric"
                min="1"
                max="19"
                value={seatCount}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 1
                  setSeatCount(Math.min(19, Math.max(1, value)))
                }}
                disabled={!selectedDate}
                className="text-center text-lg"
              />
              <Button
                variant="outline"
                onClick={() => setSeatCount(20)}
                disabled={!selectedDate}
                className="whitespace-nowrap"
              >
                Full Tent (20)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Submit */}
        <Button
          size="lg"
          className="w-full py-6 text-base rounded-xl shadow-md active:scale-[0.98] transition-transform"
          onClick={handleBooking}
          disabled={!selectedDate || loading || seatCount < 1}
        >
          {loading ? 'Processing...' : 'Confirm Booking'}
        </Button>

        <p className="text-xs text-center text-gray-400">
          You&apos;ll receive confirmation via email and SMS
        </p>
      </main>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md rounded-2xl">
          <DialogHeader>
            <div className="flex justify-center mb-2">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
            <DialogTitle className="text-center">Booking Confirmed!</DialogTitle>
            <DialogDescription className="text-center">
              Confirmation sent to your email & mobile
            </DialogDescription>
          </DialogHeader>
          {success && (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-xl space-y-3">
                <div>
                  <span className="text-xs font-medium text-gray-500">Serial Number</span>
                  <p className="text-xl font-bold text-eand-red">{success.serialNumber}</p>
                </div>
                <div className="flex gap-4">
                  <div>
                    <span className="text-xs font-medium text-gray-500">Date</span>
                    <p className="text-sm font-medium">{formatDate(new Date(success.reservationDate))}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-500">Seats</span>
                    <p className="text-sm font-medium">{success.seatCount}</p>
                  </div>
                </div>
              </div>
              {success.qrCodeString && (
                <div className="flex justify-center">
                  <Image
                    src={success.qrCodeString}
                    alt="QR Code"
                    width={160}
                    height={160}
                    className="border rounded-xl"
                  />
                </div>
              )}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowSuccessDialog(false)}
                  className="flex-1 rounded-xl"
                >
                  Close
                </Button>
                <Link href="/tent-registration/manage" className="flex-1">
                  <Button className="w-full rounded-xl">
                    Manage Booking
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
