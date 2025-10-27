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
    <form action={setActiveSalon} className="mb-6 flex flex-col gap-2">
      <Label htmlFor="business-salon-switcher">Active Salon</Label>
      <div className="flex items-center gap-2">
        <select
          id="business-salon-switcher"
          name="salonId"
          defaultValue={activeSalonId ?? accessibleSalonIds[0]}
          className="w-64 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {salons.map(salon => (
            <option key={salon.id || 'unknown'} value={salon.id || ''}>
              {salon.name || 'Untitled Salon'}
            </option>
          ))}
        </select>
        <Button type="submit" variant="outline">
          Switch
        </Button>
      </div>
    </form>
  )
}
