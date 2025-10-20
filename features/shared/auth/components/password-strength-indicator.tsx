'use client'

import { useMemo } from 'react'
import { Stack, Flex } from '@/components/layout'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

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

  const { strength, color, percentage } = useMemo(() => {
    if (!password) {
      return { strength: 'weak' as PasswordStrength, color: 'bg-gray-300', percentage: 0 }
    }

    const metCount = requirements.filter(r => r.met).length

    if (metCount <= 2) {
      return {
        strength: 'weak' as PasswordStrength,
        color: 'bg-red-500',
        percentage: 25
      }
    } else if (metCount === 3) {
      return {
        strength: 'fair' as PasswordStrength,
        color: 'bg-orange-500',
        percentage: 50
      }
    } else if (metCount === 4) {
      return {
        strength: 'good' as PasswordStrength,
        color: 'bg-yellow-500',
        percentage: 75
      }
    } else {
      return {
        strength: 'strong' as PasswordStrength,
        color: 'bg-green-500',
        percentage: 100
      }
    }
  }, [password, requirements])

  if (!password) return null

  return (
    <Stack gap="sm">
      {/* Strength Bar */}
      <Stack gap="xs">
        <Flex justify="between" align="center">
          <small className="text-sm font-medium leading-none text-muted-foreground">Password strength:</small>
          <small
            className={cn(
              'text-sm font-medium leading-none', 'font-medium',
              strength === 'weak' && 'text-red-500',
              strength === 'fair' && 'text-orange-500',
              strength === 'good' && 'text-yellow-600',
              strength === 'strong' && 'text-green-600'
            )}
          >
            {strength.charAt(0).toUpperCase() + strength.slice(1)}
          </small>
        </Flex>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div
            className={cn('h-full transition-all duration-300', color)}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </Stack>

      {/* Requirements List */}
      {showRequirements && (
        <Stack gap="xs" className="mt-1">
          {requirements.map((req, index) => (
            <Flex key={index} gap="xs" align="center">
              {req.met ? (
                <Check className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
              ) : (
                <X className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              )}
              <small
                className={cn(
                  'text-sm font-medium leading-none', 'transition-colors',
                  req.met ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {req.label}
              </small>
            </Flex>
          ))}
        </Stack>
      )}
    </Stack>
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
