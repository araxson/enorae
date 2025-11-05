"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export type ComboboxOption = {
  value: string
  label: string
}

export type ComboboxProps = {
  options: readonly ComboboxOption[]
  value?: string
  onChange: (nextValue: string) => void
  placeholder?: string
  emptyMessage?: string
  searchPlaceholder?: string
  disabled?: boolean
  name?: string
  required?: boolean
  startContent?: React.ReactNode
  className?: string
  buttonClassName?: string
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  emptyMessage = "No results found.",
  searchPlaceholder = "Search options...",
  disabled,
  name,
  required,
  startContent,
  className,
  buttonClassName,
}: ComboboxProps): React.ReactElement {
  const [open, setOpen] = React.useState(false)
  const selected = options.find((option) => option.value === value)

  const handleSelect = React.useCallback(
    (nextValue: string) => {
      onChange(nextValue)
      setOpen(false)
    },
    [onChange],
  )

  return (
    <div className={cn("w-full", className)}>
      {name ? <input type="hidden" name={name} value={value ?? ""} required={required} /> : null}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            role="combobox"
            variant="outline"
            aria-expanded={open}
            disabled={disabled}
            className={cn("w-full justify-between", buttonClassName)}
          >
            <span className="flex flex-1 items-center gap-2 truncate text-left">
              {startContent}
              {selected ? selected.label : <span className="text-muted-foreground">{placeholder}</span>}
            </span>
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" aria-hidden="true" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem key={option.value} value={option.value} onSelect={handleSelect}>
                    <Check
                      className={cn(
                        "mr-2 size-4",
                        option.value === value ? "opacity-100" : "opacity-0",
                      )}
                      aria-hidden="true"
                    />
                    <span className="truncate">{option.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
