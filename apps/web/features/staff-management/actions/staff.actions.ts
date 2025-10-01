'use server'

import { createClient } from '@/lib/supabase/client'
import { revalidatePath } from 'next/cache'

export async function createStaffMember(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const salonId = formData.get('salonId') as string
  const title = formData.get('title') as string
  const bio = formData.get('bio') as string
  const experienceYears = formData.get('experienceYears') as string

  const { error } = await (supabase as any).from('staff').insert({
    salon_id: salonId,
    title,
    bio: bio || null,
    experience_years: experienceYears ? parseInt(experienceYears) : null,
  })

  if (error) throw error

  revalidatePath('/business/staff')
}

export async function updateStaffMember(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const staffId = formData.get('staffId') as string
  const title = formData.get('title') as string
  const bio = formData.get('bio') as string
  const experienceYears = formData.get('experienceYears') as string

  const { error } = await (supabase as any)
    .from('staff')
    .update({
      title,
      bio: bio || null,
      experience_years: experienceYears ? parseInt(experienceYears) : null,
    })
    .eq('id', staffId)

  if (error) throw error

  revalidatePath('/business/staff')
}

export async function deleteStaffMember(staffId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await (supabase as any)
    .from('staff')
    .update({
      deleted_at: new Date().toISOString(),
      deleted_by: user.id,
    })
    .eq('id', staffId)

  if (error) throw error

  revalidatePath('/business/staff')
}