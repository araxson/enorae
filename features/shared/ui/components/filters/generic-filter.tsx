'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Field, FieldContent, FieldLabel } from '@/components/ui/field'
import { cn } from '@/lib/utils/index'

interface GenericFilterOption<T extends string = string> {
  label: string
  value: T
  icon?: React.ComponentType<{ className?: string }>
}

interface GenericFilterProps<T extends string = string> {
  value: T
  onChange: (value: T) => void
  options: GenericFilterOption<T>[]
  placeholder?: string
  className?: string
  label?: string
  showAll?: boolean
  allValue?: T
  allLabel?: string
}

export function GenericFilter<T extends string = string>({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  className,
  label,
  showAll = true,
  allValue = 'all' as T,
  allLabel = 'All',
}: GenericFilterProps<T>) {
  return (
    <Field className={className}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <FieldContent>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {showAll && <SelectItem value={allValue}>{allLabel}</SelectItem>}
            {options.map((option) => {
              const Icon = option.icon
              return (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    {Icon && <Icon className="size-4" />}
                    {option.label}
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </FieldContent>
    </Field>
  )
}
