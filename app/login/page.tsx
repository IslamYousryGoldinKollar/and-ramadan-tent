'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { isValidEandEmail } from '@/lib/utils'
import { EandLogo } from '@/components/ui/eand-logo'

export default function LoginPage() {
  const router = useRouter()
  const [employeeId, setEmployeeId] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validate email domain
    if (!isValidEandEmail(email)) {
      setError('Email must be from @eand.com domain')
      setLoading(false)
      return
    }

    try {
      const result = await signIn('credentials', {
        employeeId,
        email: email.toLowerCase(),
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ramadan-hero p-4">
      <Card className="w-full max-w-md glass-panel border-0">
        <CardHeader className="space-y-1 pt-8">
          <div className="flex items-center justify-center mb-3">
            <EandLogo size="lg" />
          </div>
          <CardTitle className="text-2xl text-center">Staff Sign In</CardTitle>
          <CardDescription className="text-center">
            Ramadan Tent Reservation System
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input
                id="employeeId"
                type="text"
                inputMode="numeric"
                placeholder="Enter your Employee ID"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Corporate Email</Label>
              <Input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="your.name@eand.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-xl">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full py-5 rounded-2xl bg-eand-ocean hover:bg-eand-ocean/90 active:scale-[0.98] transition-transform" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          <p className="text-xs text-center text-eand-grey mt-4">
            Only @eand.com email addresses are allowed
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
