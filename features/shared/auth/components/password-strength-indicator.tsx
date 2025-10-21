'use client'

import { useMemo } from 'react'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'

interface PasswordStrengthIndicatorProps {
  password: string
  showRequirements?: boolean
}

type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong'

interface PasswordRequirement {
  label: string
  met: boolean
  test: (password: string) => boolean
}

export function PasswordStrengthIndicator({
  password,
  showRequirements = true
}: PasswordStrengthIndicatorProps) {
  const requirements: PasswordRequirement[] = useMemo(() => [
    {
      label: 'At least 8 characters',
      met: password.length >= 8,
      test: (p) => p.length >= 8,
    },
    {
      label: 'Contains uppercase letter',
      met: /[A-Z]/.test(password),
      test: (p) => /[A-Z]/.test(p),
    },
    {
      label: 'Contains lowercase letter',
      met: /[a-z]/.test(password),
      test: (p) => /[a-z]/.test(p),
    },
    {
      label: 'Contains number',
      met: /[0-9]/.test(password),
      test: (p) => /[0-9]/.test(p),
    },
    {
      label: 'Contains special character',
      met: /[^A-Za-z0-9]/.test(password),
      test: (p) => /[^A-Za-z0-9]/.test(p),
    },
  ], [password])

  const { strength, percentage, indicatorClass, textTone } = useMemo(() => {
    if (!password) {
      return {
        strength: 'weak' as PasswordStrength,
        percentage: 0,
        indicatorClass: '[&_[data-slot=progress-indicator]]:bg-muted',
        textTone: 'text-muted-foreground'
      }
    }

    const metCount = requirements.filter(r => r.met).length

    if (metCount <= 2) {
      return {
        strength: 'weak' as PasswordStrength,
        percentage: 25,
        indicatorClass: '[&_[data-slot=progress-indicator]]:bg-destructive',
        textTone: 'text-destructive'
      }
    }

    if (metCount === 3) {
      return {
        strength: 'fair' as PasswordStrength,
        percentage: 50,
        indicatorClass: '[&_[data-slot=progress-indicator]]:bg-warning',
        textTone: 'text-warning'
      }
    }

    if (metCount === 4) {
      return {
        strength: 'good' as PasswordStrength,
        percentage: 75,
        indicatorClass: '[&_[data-slot=progress-indicator]]:bg-info',
        textTone: 'text-info'
      }
    }

    return {
      strength: 'strong' as PasswordStrength,
      percentage: 100,
      indicatorClass: '[&_[data-slot=progress-indicator]]:bg-success',
      textTone: 'text-success'
    }
  }, [password, requirements])

  if (!password) return null

  return (
    <div className="flex flex-col gap-4">
      {/* Strength Bar */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <small className="text-sm font-medium text-muted-foreground">Password strength:</small>
          <small className={cn('text-sm font-medium', textTone)}>
            {strength.charAt(0).toUpperCase() + strength.slice(1)}
          </small>
        </div>
        <Progress
          value={percentage}
          className={cn('bg-muted transition-none', indicatorClass)}
        />
      </div>

      {/* Requirements List */}
      {showRequirements && (
        <div className="mt-1 flex flex-col gap-2">
          {requirements.map((req, index) => (
            <div key={index} className="flex items-center gap-2">
              {req.met ? (
                <Check className="text-success h-3.5 w-3.5 flex-shrink-0" />
              ) : (
                <X className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              )}
              <small
                className={cn(
                  'text-sm font-medium', 'transition-colors',
                  req.met ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {req.label}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Hook to get password strength validation
 */
export function usePasswordStrength(password: string) {
  return useMemo(() => {
    const requirements = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /[0-9]/.test(password),
      /[^A-Za-z0-9]/.test(password),
    ]

    const metCount = requirements.filter(Boolean).length
    const isValid = metCount >= 4 // At least 4 out of 5 requirements

    return {
      isValid,
      metCount,
      totalCount: requirements.length,
    }
  }, [password])
}
