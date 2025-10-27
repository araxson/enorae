import { useState, useTransition } from 'react'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import {
  requireAnyRole,
  getSalonContext,
  setActiveSalonId,
  ROLE_GROUPS,
} from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Database } from '@/lib/types/database.types'

type SalonOption = Pick<Database['public']['Views']['salons_view']['Row'], 'id' | 'name'>

export async function BusinessSalonSwitcher() {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  const { activeSalonId, accessibleSalonIds } = await getSalonContext()
  if (!accessibleSalonIds.length || accessibleSalonIds.length === 1) {
    return null
  }

  const supabase = await createClient()
  const { data } = await supabase
    .from('salons_view')
    .select('id, name')
    .in('id', accessibleSalonIds)
    .order('name', { ascending: true })
    .returns<SalonOption[]>()

  const salons = data ?? []

  if (salons.length === 0) {
    return null
  }

  async function setActiveSalon(formData: FormData) {
    'use server'

    const salonId = formData.get('salonId')
    if (typeof salonId !== 'string' || salonId.length === 0) {
      return
    }

    await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
    await setActiveSalonId(salonId)

    revalidatePath('/business', 'page')
    revalidatePath('/staff', 'page')
  }

  return (
    <BusinessSalonSwitcherClient
      salons={salons}
      activeSalonId={activeSalonId ?? accessibleSalonIds[0] ?? ''}
      setActiveSalon={setActiveSalon}
    />
  )
}

type ClientProps = {
  salons: SalonOption[]
  activeSalonId: string
  setActiveSalon: (formData: FormData) => Promise<void>
}

function BusinessSalonSwitcherClient({ salons, activeSalonId, setActiveSalon }: ClientProps) {
  'use client'

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
    <div className="mb-6 flex flex-col gap-2">
      <Label htmlFor="business-salon-switcher">Active Salon</Label>
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
          {isPending ? 'Switching...' : 'Switch'}
        </Button>
      </div>
    </div>
  )
}
