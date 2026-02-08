'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { isValidEandEmail } from '@/lib/utils'

interface UserInfoFormProps {
  employeeId: string
  employeeName: string
  email: string
  phoneNumber?: string
  onEmployeeIdChange: (value: string) => void
  onEmployeeNameChange: (value: string) => void
  onEmailChange: (value: string) => void
  onPhoneNumberChange?: (value: string) => void
  errors?: {
    employeeId?: string
    employeeName?: string
    email?: string
    phoneNumber?: string
  }
}

export function UserInfoForm({
  employeeId,
  employeeName,
  email,
  phoneNumber,
  onEmployeeIdChange,
  onEmployeeNameChange,
  onEmailChange,
  onPhoneNumberChange,
  errors,
}: UserInfoFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="employeeId">Employee ID *</Label>
        <Input
          id="employeeId"
          type="text"
          inputMode="text"
          placeholder="Enter your Employee ID"
          value={employeeId}
          onChange={(e) => onEmployeeIdChange(e.target.value)}
          required
        />
        {errors?.employeeId && (
          <p className="text-sm text-red-600">{errors.employeeId}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="employeeName">Full Name *</Label>
        <Input
          id="employeeName"
          type="text"
          inputMode="text"
          autoComplete="name"
          placeholder="Enter your full name"
          value={employeeName}
          onChange={(e) => onEmployeeNameChange(e.target.value)}
          required
        />
        {errors?.employeeName && (
          <p className="text-sm text-red-600">{errors.employeeName}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Corporate Email *</Label>
        <Input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="your.name@eand.com"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
        />
        {errors?.email && (
          <p className="text-sm text-red-600">{errors.email}</p>
        )}
        {email && !isValidEandEmail(email) && (
          <p className="text-sm text-orange-600">
            Email must be from @eand.com domain
          </p>
        )}
      </div>

      {onPhoneNumberChange && (
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Mobile Number *</Label>
        <Input
          id="phoneNumber"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="01xxxxxxxxx"
          value={phoneNumber}
          onChange={(e) => onPhoneNumberChange(e.target.value)}
          required
        />
        {errors?.phoneNumber && (
          <p className="text-sm text-red-600">{errors.phoneNumber}</p>
        )}
        <p className="text-xs text-gray-500">Egyptian mobile number (e.g. 01012345678)</p>
      </div>
      )}
    </div>
  )
}
