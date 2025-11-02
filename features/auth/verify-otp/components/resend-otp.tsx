'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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
