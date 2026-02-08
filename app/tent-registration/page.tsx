'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { RamadanCalendar } from '@/components/calendar/ramadan-calendar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatDate, isValidEandEmail } from '@/lib/utils'
import { Calendar, ArrowLeft, CheckCircle2, User, Hash, ChevronRight, ChevronLeft, Minus, Plus } from 'lucide-react'
import Image from 'next/image'
import { EandLogo } from '@/components/ui/eand-logo'

const STEPS = ['Date', 'Info', 'Seats', 'Confirm']

export default function TentRegistrationPage() {
  const [step, setStep] = useState(0)
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
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [direction, setDirection] = useState<'next' | 'prev'>('next')

  const goNext = () => {
    setDirection('next')
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }
  const goPrev = () => {
    setDirection('prev')
    setStep((s) => Math.max(s - 1, 0))
  }

  // Auto-advance when date selected
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setTimeout(() => goNext(), 300)
  }

  const validateInfo = () => {
    const e: Record<string, string> = {}
    if (!employeeId.trim()) e.employeeId = 'Required'
    if (!employeeName.trim()) e.employeeName = 'Required'
    if (!email.trim()) e.email = 'Required'
    else if (!isValidEandEmail(email)) e.email = 'Must be @eand.com'
    if (!phoneNumber.trim()) e.phoneNumber = 'Required'
    else if (phoneNumber.replace(/[\s\-]/g, '').length < 10) e.phoneNumber = 'Invalid number'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleInfoNext = () => {
    if (validateInfo()) goNext()
  }

  const handleBooking = async () => {
    if (!selectedDate) return
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
      if (!response.ok) throw new Error(data.error || 'Failed to create reservation')

      setSuccess(data)
      setShowSuccessDialog(true)
      // Reset form
      setStep(0)
      setSeatCount(1)
      setEmployeeId('')
      setEmployeeName('')
      setEmail('')
      setPhoneNumber('')
      setSelectedDate(null)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ramadan-subtle flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-eand-ocean/95 backdrop-blur-md border-b border-white/10 safe-top">
        <div className="content-container py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white/70 active:text-ramadan-gold">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm">Home</span>
          </Link>
          <EandLogo size="sm" className="brightness-0 invert" />
        </div>
      </header>

      {/* Step indicator */}
      <div className="content-container pt-4 pb-2">
        <div className="flex items-center gap-1">
          {STEPS.map((label, i) => (
            <div key={label} className="flex-1 flex flex-col items-center gap-1">
              <div className={`h-1 w-full rounded-full transition-all duration-300 ${
                i <= step ? 'bg-ramadan-gold' : 'bg-eand-light-grey'
              }`} />
              <span className={`text-[10px] font-medium transition-colors ${
                i === step ? 'text-ramadan-gold' : i < step ? 'text-eand-grey' : 'text-eand-light-grey'
              }`}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Slide container */}
      <main className="flex-1 flex flex-col content-container overflow-hidden">
        <div className="flex-1 flex flex-col justify-center py-4">

          {/* Step 0: Choose Date */}
          {step === 0 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-eand-ocean/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Calendar className="h-6 w-6 text-eand-ocean" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Choose a Date</h1>
                <p className="text-sm text-gray-500 mt-1">Tap a day to select your Iftar date</p>
              </div>
              <RamadanCalendar
                onDateSelect={handleDateSelect}
                selectedDate={selectedDate}
              />
            </div>
          )}

          {/* Step 1: Your Information */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-eand-burgundy/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <User className="h-6 w-6 text-eand-burgundy" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Your Information</h1>
                <p className="text-sm text-gray-500 mt-1">We&apos;ll send confirmation via email & SMS</p>
              </div>
              <Card className="border-0 shadow-md rounded-2xl bg-white">
                <CardContent className="p-4 space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="employeeId" className="text-sm">Employee ID *</Label>
                    <Input id="employeeId" inputMode="numeric" autoComplete="off" placeholder="e.g. 12345"
                      value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} />
                    {errors.employeeId && <p className="text-xs text-red-500">{errors.employeeId}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="employeeName" className="text-sm">Full Name *</Label>
                    <Input id="employeeName" autoComplete="name" placeholder="e.g. Ahmed Mohamed"
                      value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} />
                    {errors.employeeName && <p className="text-xs text-red-500">{errors.employeeName}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-sm">Corporate Email *</Label>
                    <Input id="email" type="email" inputMode="email" autoComplete="email" placeholder="name@eand.com"
                      value={email} onChange={(e) => setEmail(e.target.value)} />
                    {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-sm">Mobile Number *</Label>
                    <Input id="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="01xxxxxxxxx"
                      value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                    {errors.phoneNumber && <p className="text-xs text-red-500">{errors.phoneNumber}</p>}
                    <p className="text-[11px] text-gray-400">Egyptian mobile (e.g. 01012345678)</p>
                  </div>
                </CardContent>
              </Card>
              <div className="flex gap-3">
                <Button variant="outline" onClick={goPrev} className="rounded-2xl px-5 border-eand-light-grey">
                  <ChevronLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <Button onClick={handleInfoNext} className="flex-1 rounded-2xl py-5 bg-eand-ocean hover:bg-eand-ocean/90">
                  Continue <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Number of Seats */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-eand-dark-green/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Hash className="h-6 w-6 text-eand-dark-green" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Number of Seats</h1>
                <p className="text-sm text-gray-500 mt-1">How many seats do you need?</p>
              </div>
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={() => setSeatCount(Math.max(1, seatCount - 1))}
                  className="w-14 h-14 rounded-2xl bg-eand-light-grey/50 flex items-center justify-center active:bg-eand-light-grey transition-colors"
                >
                  <Minus className="h-6 w-6 text-eand-ocean" />
                </button>
                <div className="text-center">
                  <div className="text-5xl font-bold text-gray-900">{seatCount}</div>
                  <div className="text-sm text-gray-400 mt-1">{seatCount === 1 ? 'seat' : 'seats'}</div>
                </div>
                <button
                  onClick={() => setSeatCount(Math.min(10, seatCount + 1))}
                  className="w-14 h-14 rounded-2xl bg-eand-light-grey/50 flex items-center justify-center active:bg-eand-light-grey transition-colors"
                >
                  <Plus className="h-6 w-6 text-eand-ocean" />
                </button>
              </div>
              <div className="flex justify-center gap-2 flex-wrap">
                {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                  <button
                    key={n}
                    onClick={() => setSeatCount(n)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      seatCount === n
                        ? 'bg-ramadan-gold text-eand-ocean shadow-md'
                        : 'bg-eand-light-grey/50 text-eand-grey active:bg-eand-light-grey'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={goPrev} className="rounded-2xl px-5 border-eand-light-grey">
                  <ChevronLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <Button onClick={goNext} className="flex-1 rounded-2xl py-5 bg-eand-ocean hover:bg-eand-ocean/90">
                  Continue <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-5">
              <div className="text-center">
                <div className="w-12 h-12 bg-ramadan-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="h-6 w-6 text-ramadan-gold" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Confirm Booking</h1>
                <p className="text-sm text-gray-500 mt-1">Review your details and confirm</p>
              </div>
              <Card className="border-0 shadow-md rounded-2xl bg-white">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-50">
                    <span className="text-sm text-gray-500">Date</span>
                    <span className="text-sm font-semibold">{selectedDate ? formatDate(selectedDate) : '—'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-50">
                    <span className="text-sm text-gray-500">Name</span>
                    <span className="text-sm font-semibold">{employeeName || '—'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-50">
                    <span className="text-sm text-gray-500">Employee ID</span>
                    <span className="text-sm font-semibold">{employeeId || '—'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-50">
                    <span className="text-sm text-gray-500">Email</span>
                    <span className="text-sm font-semibold truncate ml-4">{email || '—'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-50">
                    <span className="text-sm text-gray-500">Mobile</span>
                    <span className="text-sm font-semibold">{phoneNumber || '—'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-500">Seats</span>
                    <span className="text-lg font-bold text-eand-red">{seatCount}</span>
                  </div>
                </CardContent>
              </Card>
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              <div className="flex gap-3">
                <Button variant="outline" onClick={goPrev} className="rounded-2xl px-5 border-eand-light-grey">
                  <ChevronLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <Button
                  onClick={handleBooking}
                  disabled={loading}
                  className="flex-1 rounded-2xl py-5 text-base font-semibold shadow-lg bg-ramadan-gold hover:bg-ramadan-gold/90 text-eand-ocean active:scale-[0.98] transition-transform"
                >
                  {loading ? 'Processing...' : 'Confirm Booking'}
                </Button>
              </div>
              <p className="text-xs text-center text-eand-grey">
                You&apos;ll receive confirmation via email & SMS
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md rounded-2xl">
          <DialogHeader>
            <div className="flex justify-center mb-2">
              <CheckCircle2 className="h-14 w-14 text-eand-bright-green" />
            </div>
            <DialogTitle className="text-center text-xl">Booking Confirmed!</DialogTitle>
            <DialogDescription className="text-center">
              Confirmation sent to your email & mobile
            </DialogDescription>
          </DialogHeader>
          {success && (
            <div className="space-y-4">
              <div className="p-4 bg-eand-bright-green/10 rounded-xl space-y-3">
                <div>
                  <span className="text-xs font-medium text-gray-500">Serial Number</span>
                  <p className="text-2xl font-bold text-eand-red tracking-wide">{success.serialNumber}</p>
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
