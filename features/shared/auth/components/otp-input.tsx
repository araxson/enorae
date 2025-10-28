'use client'

import { useState, useRef, useCallback, useMemo, KeyboardEvent, ClipboardEvent, ChangeEvent } from 'react'
import { Input } from '@/components/ui/input'
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

  const handleChange = useCallback((index: number, e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value

    if (newValue.length > 1) return
    if (newValue && !/^\d$/.test(newValue)) return

    const newOtp = [...otp]
    newOtp[index] = newValue
    setOtp(newOtp)

    const otpString = newOtp.join('')
    onChange?.(otpString)

    if (newValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    if (otpString.length === length && !otpString.includes('')) {
      onComplete?.(otpString)
    }
  }, [length, onChange, onComplete, otp])

  const handleKeyDown = useCallback((index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }

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

    const lastFilledIndex = Math.min(pastedData.length - 1, length - 1)
    inputRefs.current[lastFilledIndex]?.focus()

    if (otpString.length === length && !otpString.includes('')) {
      onComplete?.(otpString)
    }
  }, [length, onChange, onComplete])

  const handleFocus = useCallback((index: number) => {
    inputRefs.current[index]?.select()
  }, [])

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
            'size-12 text-center text-lg font-semibold',
            'focus-visible:ring-2 focus-visible:ring-primary',
            disabled && 'cursor-not-allowed opacity-50'
          )}
          aria-label={`Digit ${index + 1}`}
        />
      ))}
    </div>
  )
}
