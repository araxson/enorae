'use client'

import { useState, useRef, useEffect, useCallback, useMemo, KeyboardEvent, ClipboardEvent, ChangeEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface OTPInputProps {
  length?: number
  value?: string
  onChange?: (value: string) => void
  onComplete?: (value: string) => void
  disabled?: boolean
  className?: string
}

export function OTPInput({
  length = 6,
  onChange,
  onComplete,
  disabled = false,
  className,
}: Omit<OTPInputProps, 'value'>) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // PERFORMANCE: Wrap handler in useCallback to prevent re-creation
  const handleChange = useCallback((index: number, e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value

    // Only allow single digit
    if (newValue.length > 1) return

    // Only allow numbers
    if (newValue && !/^\d$/.test(newValue)) return

    const newOtp = [...otp]
    newOtp[index] = newValue
    setOtp(newOtp)

    const otpString = newOtp.join('')
    onChange?.(otpString)

    // Auto-focus next input
    if (newValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    // Check if complete
    if (otpString.length === length && !otpString.includes('')) {
      onComplete?.(otpString)
    }
  }, [length, onChange, onComplete, otp])

  const handleKeyDown = useCallback((index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }

    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }, [length, otp])

  const handlePaste = useCallback((e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text/plain').slice(0, length)

    // Only allow numbers
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = Array(length).fill('')
    pastedData.split('').forEach((char, index) => {
      if (index < length) {
        newOtp[index] = char
      }
    })

    setOtp(newOtp)
    const otpString = newOtp.join('')
    onChange?.(otpString)

    // Focus last filled input or first empty
    const lastFilledIndex = Math.min(pastedData.length - 1, length - 1)
    inputRefs.current[lastFilledIndex]?.focus()

    // Check if complete
    if (otpString.length === length && !otpString.includes('')) {
      onComplete?.(otpString)
    }
  }, [length, onChange, onComplete])

  const handleFocus = useCallback((index: number) => {
    inputRefs.current[index]?.select()
  }, [])

  // PERFORMANCE: Memoize input array to prevent re-creation on every render
  const inputs = useMemo(() => Array.from({ length }), [length])

  return (
    <div className={cn('flex justify-center gap-4', className)}>
      {inputs.map((_, index) => (
        <Input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el
          }}
          type="text"
          inputMode="numeric"
          pattern="\d{1}"
          maxLength={1}
          value={otp[index]}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={() => handleFocus(index)}
          disabled={disabled}
          className={cn(
            'w-12 h-12 text-center text-lg font-semibold',
            'focus-visible:ring-2 focus-visible:ring-primary',
            disabled && 'cursor-not-allowed opacity-50'
          )}
          aria-label={`Digit ${index + 1}`}
        />
      ))}
    </div>
  )
}

/**
 * Resend OTP Button Component
 */
interface ResendOTPProps {
  onResend: () => void
  cooldownSeconds?: number
  disabled?: boolean
}

export function ResendOTP({
  onResend,
  cooldownSeconds = 60,
  disabled = false,
}: ResendOTPProps) {
  const [countdown, setCountdown] = useState(0)
  const [isResending, setIsResending] = useState(false)

  // ASYNC FIX: Cleanup timer when component unmounts or countdown resets
  useEffect(() => {
    if (countdown === 0) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [countdown])

  const handleResend = async () => {
    if (countdown > 0 || disabled || isResending) return

    setIsResending(true)
    try {
      await onResend()
      setCountdown(cooldownSeconds)
    } catch (error) {
      console.error('Failed to resend OTP:', error)
    } finally {
      setIsResending(false)
    }
  }

  const canResend = countdown === 0 && !disabled && !isResending

  return (
    <Button
      type="button"
      variant="link"
      onClick={handleResend}
      disabled={!canResend}
      className={cn(
        'text-sm p-0 h-auto',
        canResend
          ? 'text-primary'
          : 'text-muted-foreground'
      )}
    >
      {isResending
        ? 'Sending...'
        : countdown > 0
        ? `Resend in ${countdown}s`
        : 'Resend code'}
    </Button>
  )
}
