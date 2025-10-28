'use client'

import { useState, forwardRef } from 'react'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from '@/components/ui/input-group'

export interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  showVisibilityToggle?: boolean
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, showVisibilityToggle = true, disabled, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
      <InputGroup data-disabled={disabled ? '' : undefined}>
        <Input
          type={showPassword ? 'text' : 'password'}
          data-slot="input-group-control"
          className={cn(
            'flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent',
            className
          )}
          disabled={disabled}
          ref={ref}
          {...props}
        />
        {showVisibilityToggle ? (
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => setShowPassword(!showPassword)}
              disabled={disabled}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="size-4 text-muted-foreground" />
              ) : (
                <Eye className="size-4 text-muted-foreground" />
              )}
            </InputGroupButton>
          </InputGroupAddon>
        ) : null}
      </InputGroup>
    )
  }
)

PasswordInput.displayName = 'PasswordInput'
