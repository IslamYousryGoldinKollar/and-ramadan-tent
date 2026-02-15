'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { RamadanCalendar } from '@/components/calendar/ramadan-calendar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatDate, MAX_CAPACITY } from '@/lib/utils'
import { isValidEgyptPhone } from '@/lib/sms'
import {
  Calendar, ArrowLeft, CheckCircle2, User, Users, ChevronRight, ChevronLeft,
  Minus, Plus, Mail, Phone, BadgeCheck, Hash, Sparkles, PartyPopper, Shield, AlertCircle,
  CalendarCheck, UserCircle, Armchair
} from 'lucide-react'

import { EandLogo } from '@/components/ui/eand-logo'

const STEPS = [
  { label: 'Date', icon: Calendar, emoji: '📅', desc: 'Pick a day' },
  { label: 'Info', icon: User, emoji: '👤', desc: 'Your details' },
  { label: 'Seats', icon: Users, emoji: '💺', desc: 'How many?' },
  { label: 'Confirm', icon: CheckCircle2, emoji: '✅', desc: 'Review & book' },
]

export default function TentRegistrationPage() {
  const [step, setStep] = useState(0)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [employeeId, setEmployeeId] = useState('')
  const [employeeName, setEmployeeName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [seatCount, setSeatCount] = useState(1)
  const [availableSeats, setAvailableSeats] = useState<number | null>(null)
  const [availabilityLoading, setAvailabilityLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<any>(null)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const maxSeatsForDate = Math.min(MAX_CAPACITY, availableSeats ?? MAX_CAPACITY)
  const maxSelectableSeats = Math.max(1, maxSeatsForDate)

  const goNext = () => setStep((s) => Math.min(s + 1, STEPS.length - 1))
  const goPrev = () => setStep((s) => Math.max(s - 1, 0))

  // Auto-advance when date selected
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setTimeout(() => goNext(), 400)
  }

  useEffect(() => {
    let cancelled = false

    async function fetchAvailability() {
      if (!selectedDate) {
        setAvailableSeats(null)
        return
      }

      setAvailabilityLoading(true)
      try {
        const response = await fetch(
          `/api/availability?date=${encodeURIComponent(selectedDate.toISOString())}`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch availability')
        }

        const data: { availableSeats: number } = await response.json()
        if (!cancelled) {
          setAvailableSeats(data.availableSeats)
        }
      } catch {
        if (!cancelled) {
          setAvailableSeats(null)
        }
      } finally {
        if (!cancelled) {
          setAvailabilityLoading(false)
        }
      }
    }

    fetchAvailability()
    return () => {
      cancelled = true
    }
  }, [selectedDate])

  useEffect(() => {
    if (availableSeats === null) return
    setSeatCount((prev) => Math.min(prev, Math.max(1, availableSeats)))
  }, [availableSeats])

  const validateInfo = () => {
    const e: Record<string, string> = {}
    if (!employeeId.trim()) e.employeeId = '⚠️ Please enter your Employee ID'
    if (!employeeName.trim()) e.employeeName = '⚠️ Please enter your full name'
    if (!email.trim()) e.email = '⚠️ Please enter your email'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = '⚠️ This doesn\'t look like a valid email'
    if (!phoneNumber.trim()) e.phoneNumber = '⚠️ Please enter your mobile number'
    else if (!isValidEgyptPhone(phoneNumber)) e.phoneNumber = '⚠️ Enter an Egyptian mobile like 01012345678'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleInfoNext = () => {
    if (validateInfo()) goNext()
  }

  const handleBooking = async () => {
    if (!selectedDate) return

    if (availableSeats !== null && seatCount > availableSeats) {
      setError(`Only ${availableSeats} seats available`)
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
      if (!response.ok) throw new Error(data.error || 'Failed to create reservation')

      setSuccess(data)
      setShowSuccessDialog(true)
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
          <Link href="/" className="flex items-center gap-2 text-white/70 active:text-ramadan-gold transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm">Home</span>
          </Link>
          <EandLogo size="sm" className="brightness-0 invert" />
        </div>
      </header>

      {/* Step indicator — visual with icons and numbers */}
      <div className="content-container pt-4 pb-2">
        <div className="flex items-start gap-1">
          {STEPS.map((s, i) => {
            const StepIcon = s.icon
            const isActive = i === step
            const isDone = i < step
            return (
              <div key={s.label} className="flex-1 flex flex-col items-center gap-1.5">
                {/* Progress bar */}
                <div className={`h-1.5 w-full rounded-full transition-all duration-500 ${
                  isDone ? 'bg-emerald-400' : isActive ? 'bg-ramadan-gold' : 'bg-gray-200'
                }`} />
                {/* Step circle */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isDone ? 'bg-emerald-100 text-emerald-600' :
                  isActive ? 'bg-ramadan-gold/20 text-ramadan-gold ring-2 ring-ramadan-gold/30 scale-110' :
                  'bg-gray-100 text-gray-300'
                }`}>
                  {isDone ? <CheckCircle2 className="h-4 w-4" /> : <StepIcon className="h-3.5 w-3.5" />}
                </div>
                <span className={`text-[10px] font-semibold transition-colors ${
                  isActive ? 'text-ramadan-gold' : isDone ? 'text-emerald-600' : 'text-gray-300'
                }`}>{s.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col content-container overflow-hidden">
        <div className="flex-1 flex flex-col py-4">

          {/* ===== STEP 0: Choose Date ===== */}
          {step === 0 && (
            <div className="space-y-4 opacity-0 animate-fade-in-up">
              {/* Important rules — prominent red box */}
              <div className="bg-red-600 rounded-2xl p-4 space-y-2.5 opacity-0 animate-fade-in-up shadow-md">
                <p className="text-sm font-bold text-white flex items-center gap-2">⚠️ Important Guidelines</p>
                <ul className="text-xs text-white/90 space-y-2">
                  <li className="flex gap-2"><span>📅</span><span>Bookings must be made at least <strong className="text-white">48 hours in advance</strong>.</span></li>
                  <li className="flex gap-2"><span>📧</span><span>After booking, you will receive a <strong className="text-white">confirmation email</strong>. Registration is based on first come, first served.</span></li>
                  <li className="flex gap-2"><span>🍽️</span><span>Please <strong className="text-white">bring your own plates, cutlery, and dining essentials</strong>. They will not be provided at the venue.</span></li>
                  <li className="flex gap-2"><span>🧹</span><span>Please help keep the place <strong className="text-white">tidy & clean</strong> so that everyone can enjoy it throughout the month.</span></li>
                </ul>
              </div>

              {/* Step header with big friendly icon */}
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto shadow-sm opacity-0 animate-scale-in">
                  <CalendarCheck className="h-8 w-8 text-eand-ocean" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 opacity-0 animate-fade-in-up delay-100">
                  Step 1: Pick Your Iftar Date
                </h1>
                <p className="text-sm text-gray-500 opacity-0 animate-fade-in-up delay-200 max-w-xs mx-auto">
                  Choose which day you&apos;d like to come for Iftar at the e& Ramadan Tent
                </p>
              </div>

              {/* Helpful instruction card */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 flex items-start gap-3 opacity-0 animate-fade-in-up delay-300">
                <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-base">👇</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-800">How to pick a date:</p>
                  <p className="text-xs text-blue-600 leading-relaxed">
                    Look at the cards below. <strong>Green</strong> = seats available, <strong>Yellow</strong> = almost full, <strong>Red</strong> = no seats left. Just tap a green or yellow card!
                  </p>
                </div>
              </div>

              <RamadanCalendar
                onDateSelect={handleDateSelect}
                selectedDate={selectedDate}
              />
            </div>
          )}

          {/* ===== STEP 1: Your Information ===== */}
          {step === 1 && (
            <div className="space-y-4 opacity-0 animate-fade-in-up">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-50 to-fuchsia-100 rounded-3xl flex items-center justify-center mx-auto shadow-sm opacity-0 animate-scale-in">
                  <UserCircle className="h-8 w-8 text-eand-burgundy" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 opacity-0 animate-fade-in-up delay-100">
                  Step 2: Tell Us About You
                </h1>
                <p className="text-sm text-gray-500 opacity-0 animate-fade-in-up delay-200 max-w-xs mx-auto">
                  We need your info to confirm your booking and send you a ticket
                </p>
              </div>

              {/* Selected date reminder */}
              {selectedDate && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center gap-3 opacity-0 animate-fade-in-up delay-200">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-emerald-600 font-medium">Your chosen date</p>
                    <p className="text-sm font-bold text-emerald-800">{formatDate(selectedDate)}</p>
                  </div>
                  <button onClick={() => { setStep(0) }} className="ml-auto text-[10px] text-emerald-600 underline">Change</button>
                </div>
              )}

              {/* Form */}
              <Card className="border-0 shadow-md rounded-2xl bg-white opacity-0 animate-fade-in-up delay-300">
                <CardContent className="p-4 space-y-4">
                  {/* Employee ID */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-indigo-50 rounded-lg flex items-center justify-center">
                        <Hash className="h-3.5 w-3.5 text-indigo-500" />
                      </div>
                      <label htmlFor="employeeId" className="text-sm font-semibold text-gray-700">Employee ID</label>
                    </div>
                    <Input id="employeeId" inputMode="numeric" autoComplete="off" placeholder="Type your employee ID (e.g. 12345)"
                      className="rounded-xl border-gray-200 focus:border-indigo-400 focus:ring-indigo-200 transition-all"
                      value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} />
                    {errors.employeeId ? (
                      <p className="text-xs text-red-500 flex items-center gap-1 animate-fade-in"><AlertCircle className="h-3 w-3" /> {errors.employeeId}</p>
                    ) : (
                      <p className="text-[11px] text-gray-400">💡 Your company ID number from your badge</p>
                    )}
                  </div>

                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-violet-50 rounded-lg flex items-center justify-center">
                        <BadgeCheck className="h-3.5 w-3.5 text-violet-500" />
                      </div>
                      <label htmlFor="employeeName" className="text-sm font-semibold text-gray-700">Full Name</label>
                    </div>
                    <Input id="employeeName" autoComplete="name" placeholder="Type your full name (e.g. Ahmed Mohamed)"
                      className="rounded-xl border-gray-200 focus:border-violet-400 focus:ring-violet-200 transition-all"
                      value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} />
                    {errors.employeeName ? (
                      <p className="text-xs text-red-500 flex items-center gap-1 animate-fade-in"><AlertCircle className="h-3 w-3" /> {errors.employeeName}</p>
                    ) : (
                      <p className="text-[11px] text-gray-400">💡 As it appears on your ID</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-sky-50 rounded-lg flex items-center justify-center">
                        <Mail className="h-3.5 w-3.5 text-sky-500" />
                      </div>
                      <label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</label>
                    </div>
                    <Input id="email" type="email" inputMode="email" autoComplete="email" placeholder="name@company.com"
                      className="rounded-xl border-gray-200 focus:border-sky-400 focus:ring-sky-200 transition-all"
                      value={email} onChange={(e) => setEmail(e.target.value)} />
                    {errors.email ? (
                      <p className="text-xs text-red-500 flex items-center gap-1 animate-fade-in"><AlertCircle className="h-3 w-3" /> {errors.email}</p>
                    ) : (
                      <p className="text-[11px] text-gray-400">📧 We&apos;ll send your ticket here</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center">
                        <Phone className="h-3.5 w-3.5 text-green-500" />
                      </div>
                      <label htmlFor="phone" className="text-sm font-semibold text-gray-700">Mobile Number</label>
                    </div>
                    <Input id="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="01012345678" maxLength={11}
                      className="rounded-xl border-gray-200 focus:border-green-400 focus:ring-green-200 transition-all"
                      value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                    {errors.phoneNumber ? (
                      <p className="text-xs text-red-500 flex items-center gap-1 animate-fade-in"><AlertCircle className="h-3 w-3" /> {errors.phoneNumber}</p>
                    ) : (
                      <p className="text-[11px] text-gray-400">📱 Egyptian number starting with 01 (11 digits)</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Privacy note */}
              <div className="flex items-center gap-2 justify-center opacity-0 animate-fade-in delay-500">
                <Shield className="h-3.5 w-3.5 text-gray-300" />
                <p className="text-[11px] text-gray-400">Your data is safe and only used for booking</p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 opacity-0 animate-fade-in-up delay-400">
                <Button variant="outline" onClick={goPrev} className="rounded-2xl px-5 border-gray-200 hover:bg-gray-50">
                  <ChevronLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <Button onClick={handleInfoNext} className="flex-1 rounded-2xl py-5 bg-eand-ocean hover:bg-eand-ocean/90 text-base font-semibold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
                  Continue to Seats <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* ===== STEP 2: Number of Seats ===== */}
          {step === 2 && (
            <div className="space-y-5 opacity-0 animate-fade-in-up">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl flex items-center justify-center mx-auto shadow-sm opacity-0 animate-scale-in">
                  <Armchair className="h-8 w-8 text-eand-dark-green" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 opacity-0 animate-fade-in-up delay-100">
                  Step 3: How Many Seats?
                </h1>
                <p className="text-sm text-gray-500 opacity-0 animate-fade-in-up delay-200 max-w-xs mx-auto">
                  Pick how many people will join you for Iftar (including yourself)
                </p>
              </div>

              {/* Selected date + name reminder */}
              <div className="bg-gray-50 rounded-2xl p-3 flex items-center gap-3 text-sm opacity-0 animate-fade-in delay-200">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-500">{selectedDate ? formatDate(selectedDate) : ''}</span>
                <span className="text-gray-300">•</span>
                <span className="text-gray-500 truncate">{employeeName}</span>
              </div>

              {/* Visual seat counter */}
              <div className="bg-white rounded-3xl shadow-md p-6 opacity-0 animate-fade-in-up delay-300">
                {/* Big counter */}
                <div className="flex items-center justify-center gap-5 mb-4">
                  <button
                    onClick={() => setSeatCount(Math.max(1, seatCount - 1))}
                    className="w-16 h-16 rounded-2xl bg-red-50 border-2 border-red-200 flex items-center justify-center active:scale-95 hover:bg-red-100 transition-all"
                  >
                    <Minus className="h-7 w-7 text-red-400" />
                  </button>
                  <div className="text-center min-w-[80px]">
                    <div className="text-6xl font-black text-eand-ocean leading-none animate-scale-in">{seatCount}</div>
                    <div className="text-sm font-medium text-gray-400 mt-1">{seatCount === 1 ? 'seat' : 'seats'}</div>
                  </div>
                  <button
                    onClick={() => setSeatCount(Math.min(maxSelectableSeats, seatCount + 1))}
                    className="w-16 h-16 rounded-2xl bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center active:scale-95 hover:bg-emerald-100 transition-all"
                  >
                    <Plus className="h-7 w-7 text-emerald-500" />
                  </button>
                </div>

                {/* Custom number entry */}
                <div className="flex items-center justify-center gap-2 mb-5">
                  <span className="text-xs text-gray-400 font-medium">or type:</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={maxSelectableSeats}
                    value={seatCount}
                    onChange={(e) => {
                      const v = parseInt(e.target.value)
                      if (!isNaN(v) && v >= 1 && v <= maxSelectableSeats) setSeatCount(v)
                      else if (e.target.value === '') setSeatCount(1)
                    }}
                    className="w-16 text-center text-lg font-bold border-2 border-gray-200 rounded-xl py-1.5 focus:border-eand-ocean focus:ring-2 focus:ring-eand-ocean/20 outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-xs text-gray-400">(1–{maxSelectableSeats})</span>
                </div>

                {/* Visual seat representation */}
                <div className="flex justify-center gap-1.5 flex-wrap mb-4">
                  {Array.from({ length: Math.min(maxSelectableSeats, 20) }).map((_, i) => (
                    <div
                      key={i}
                      onClick={() => setSeatCount(i + 1)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 ${
                        i < seatCount
                          ? 'bg-eand-ocean text-white shadow-md scale-105'
                          : 'bg-gray-100 text-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      <Armchair className="h-4 w-4" />
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-center text-gray-400">
                  Tap a seat (up to 20), use +/- buttons, or type a number • Maximum {maxSelectableSeats} seats
                </p>
              </div>

              {/* Quick picks */}
              <div className="opacity-0 animate-fade-in-up delay-400">
                <p className="text-[11px] text-gray-400 text-center mb-2 font-semibold uppercase tracking-wider">Quick pick</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  {[
                    { n: 1, label: 'Just me', emoji: '🙋' },
                    { n: 2, label: 'Pair', emoji: '👥' },
                    { n: 4, label: 'Small group', emoji: '👨‍👩‍👧‍👦' },
                    { n: 6, label: 'Team', emoji: '🏢' },
                    { n: 10, label: 'Big group', emoji: '🎉' },
                    ...(![1, 2, 4, 6, 10].includes(maxSelectableSeats)
                      ? [
                          {
                            n: maxSelectableSeats,
                            label: maxSelectableSeats === MAX_CAPACITY ? 'Full tent' : 'Max',
                            emoji: '🏟️',
                          },
                        ]
                      : []),
                  ].map(({ n, label, emoji }) => (
                    <button
                      key={n}
                      onClick={() => setSeatCount(Math.min(n, maxSelectableSeats))}
                      disabled={availabilityLoading || maxSeatsForDate <= 0 || n > maxSelectableSeats}
                      className={`px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                        seatCount === n
                          ? 'bg-ramadan-gold text-eand-ocean shadow-md scale-105 ring-2 ring-ramadan-gold/30'
                          : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50 active:scale-95'
                      }`}
                    >
                      <span>{emoji}</span>
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 opacity-0 animate-fade-in-up delay-500">
                <Button variant="outline" onClick={goPrev} className="rounded-2xl px-5 border-gray-200 hover:bg-gray-50">
                  <ChevronLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <Button onClick={goNext} className="flex-1 rounded-2xl py-5 bg-eand-ocean hover:bg-eand-ocean/90 text-base font-semibold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
                  Review Booking <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* ===== STEP 3: Confirm ===== */}
          {step === 3 && (
            <div className="space-y-5 opacity-0 animate-fade-in-up">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-50 to-yellow-100 rounded-3xl flex items-center justify-center mx-auto shadow-sm opacity-0 animate-scale-in">
                  <CheckCircle2 className="h-8 w-8 text-ramadan-gold" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 opacity-0 animate-fade-in-up delay-100">
                  Step 4: Review & Confirm
                </h1>
                <p className="text-sm text-gray-500 opacity-0 animate-fade-in-up delay-200 max-w-xs mx-auto">
                  Please check everything is correct before confirming your booking
                </p>
              </div>

              {/* Summary card */}
              <Card className="overflow-hidden opacity-0 animate-fade-in-up delay-300">
                {/* Header accent */}
                <div className="h-2 bg-gradient-to-r from-eand-ocean via-ramadan-gold to-eand-red" />
                <CardContent className="p-5 space-y-4">
                  {/* Date — prominent */}
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider">Iftar Date</p>
                      <p className="text-base font-bold text-blue-900">{selectedDate ? formatDate(selectedDate) : '—'}</p>
                    </div>
                  </div>

                  {/* Person info */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Name</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{employeeName || '—'}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Employee ID</p>
                      <p className="text-sm font-bold text-gray-900">{employeeId || '—'}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Email</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{email || '—'}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Mobile</p>
                      <p className="text-sm font-bold text-gray-900">{phoneNumber || '—'}</p>
                    </div>
                  </div>

                  {/* Seats — big and prominent */}
                  <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Users className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-semibold text-emerald-500 uppercase tracking-wider">Number of Seats</p>
                      <p className="text-lg font-black text-emerald-800">{seatCount} {seatCount === 1 ? 'seat' : 'seats'}</p>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: Math.min(seatCount, 5) }).map((_, i) => (
                        <Armchair key={i} className="h-4 w-4 text-emerald-400" />
                      ))}
                      {seatCount > 5 && <span className="text-xs text-emerald-400 font-bold ml-0.5">+{seatCount - 5}</span>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Error message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2 animate-fade-in">
                  <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}


              {/* Buttons */}
              <div className="flex gap-3 opacity-0 animate-fade-in-up delay-500">
                <Button variant="outline" onClick={goPrev} className="rounded-2xl px-5 border-gray-200 hover:bg-gray-50">
                  <ChevronLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <Button
                  onClick={handleBooking}
                  disabled={loading}
                  className="flex-1 rounded-2xl py-5 text-base font-bold shadow-lg bg-ramadan-gold hover:bg-ramadan-gold/90 text-eand-ocean active:scale-[0.97] transition-all hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-eand-ocean/30 border-t-eand-ocean rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <PartyPopper className="h-5 w-5" />
                      Confirm My Booking!
                    </span>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md rounded-2xl">
          <DialogHeader>
            <div className="flex justify-center mb-3">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center animate-scale-in">
                <PartyPopper className="h-8 w-8 text-emerald-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-xl">🎉 Reservation Confirmed!</DialogTitle>
            <DialogDescription className="text-center text-sm">
              Thank you for reserving your spot at the e& Egypt Ramadan Tent. We look forward to hosting you!
            </DialogDescription>
          </DialogHeader>
          {success && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-3">
                <div className="text-center">
                  <span className="text-[10px] font-semibold text-emerald-500 uppercase tracking-wider">Your Booking Number</span>
                  <p className="text-3xl font-black text-eand-ocean tracking-wider">{success.serialNumber}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-xl p-2.5 text-center">
                    <span className="text-[10px] text-gray-400 font-medium block">📅 Date</span>
                    <p className="text-sm font-bold text-gray-900">{formatDate(new Date(success.reservationDate))}</p>
                  </div>
                  <div className="bg-white rounded-xl p-2.5 text-center">
                    <span className="text-[10px] text-gray-400 font-medium block">💺 Seats</span>
                    <p className="text-sm font-bold text-gray-900">{success.seatCount}</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100 space-y-2">
                <p className="text-xs font-semibold text-amber-800">Please note the following guidelines:</p>
                <ul className="text-xs text-amber-700 space-y-1.5">
                  <li className="flex gap-1.5"><span>🕐</span><span><strong>Arrival Time</strong> — Please arrive at least 30 minutes before Maghrib prayer to ensure a smooth seating experience.</span></li>
                  <li className="flex gap-1.5"><span>🍽️</span><span><strong>Bring Your Own Essentials</strong> — Please bring your own plates, cutlery, and dining essentials. They will not be provided at the venue.</span></li>
                  <li className="flex gap-1.5"><span>🔄</span><span><strong>Cancellation Policy</strong> — If your plans change and you are unable to attend, please cancel your reservation as early as possible so that your colleagues can benefit from the available spot.</span></li>
                </ul>
              </div>
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
