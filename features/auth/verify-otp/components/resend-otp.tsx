'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useToast } from '@/lib/hooks/use-toast'

interface ResendOTPProps {
  onResend: () => void
  cooldownSeconds?: number
  disabled?: boolean
}

export function ResendOTP({
  onResend,
  cooldownSeconds = 60,
  disabled = false,
}: ResendOTPProps): React.ReactElement {
  const [countdown, setCountdown] = useState(0)
  const [isResending, setIsResending] = useState(false)
  const { toast } = useToast()

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
      toast({
        title: 'Code sent',
        description: 'A new verification code has been sent to your email.',
      })
    } catch (error) {
      console.error('Failed to resend OTP:', error)
      toast({
        variant: 'destructive',
        title: 'Failed to resend code',
        description: error instanceof Error ? error.message : 'Please try again later.',
      })
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
