'use client'

import { useState, useRef, KeyboardEvent, ClipboardEvent, ChangeEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Flex } from '@/components/layout'
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

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
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
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
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
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
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
  }

  const handleFocus = (index: number) => {
    inputRefs.current[index]?.select()
  }

  return (
    <Flex gap="sm" justify="center" className={className}>
      {Array.from({ length }).map((_, index) => (
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
    </Flex>
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

  const handleResend = async () => {
    if (countdown > 0 || disabled || isResending) return

    setIsResending(true)
    try {
      await onResend()
      setCountdown(cooldownSeconds)

      // Start countdown
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } finally {
      setIsResending(false)
    }
  }

  const canResend = countdown === 0 && !disabled && !isResending

  return (
    <button
      type="button"
      onClick={handleResend}
      disabled={!canResend}
      className={cn(
        'text-sm transition-colors',
        canResend
          ? 'text-primary hover:underline cursor-pointer'
          : 'text-muted-foreground cursor-not-allowed'
      )}
    >
      {isResending
        ? 'Sending...'
        : countdown > 0
        ? `Resend in ${countdown}s`
        : 'Resend code'}
    </button>
  )
}
