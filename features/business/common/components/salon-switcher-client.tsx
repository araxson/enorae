'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Database } from '@/lib/types/database.types'
import {
  Field,
  FieldContent,
  FieldLabel,
} from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'

type SalonOption = Pick<Database['public']['Views']['salons_view']['Row'], 'id' | 'name'>

type ActionResponse<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

type ClientProps = {
  salons: SalonOption[]
  activeSalonId: string
  setActiveSalon: (formData: FormData) => Promise<ActionResponse>
}

export function BusinessSalonSwitcherClient({ salons, activeSalonId, setActiveSalon }: ClientProps) {
  const [value, setValue] = useState(activeSalonId)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = () => {
    const formData = new FormData()
    formData.set('salonId', value)
    startTransition(async () => {
      await setActiveSalon(formData)
    })
  }

  return (
    <Field className="mb-6">
      <FieldLabel htmlFor="business-salon-switcher">Active Salon</FieldLabel>
      <FieldContent>
        <div className="flex items-center gap-2">
          <Select value={value} onValueChange={setValue}>
            <SelectTrigger id="business-salon-switcher" className="w-64">
              <SelectValue placeholder="Select salon" />
            </SelectTrigger>
            <SelectContent>
              {salons.map(salon => (
                <SelectItem key={salon.id || 'unknown'} value={salon.id || ''}>
                  {salon.name || 'Untitled Salon'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="button" variant="outline" onClick={handleSubmit} disabled={isPending}>
            {isPending ? (
              <>
                <Spinner />
                Switching
              </>
            ) : (
              'Switch'
            )}
          </Button>
        </div>
      </FieldContent>
    </Field>
  )
}
