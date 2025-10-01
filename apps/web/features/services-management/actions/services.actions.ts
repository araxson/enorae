'use server'

import { createClient } from '@/lib/supabase/client'
import { revalidatePath } from 'next/cache'

export async function createService(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const salonId = formData.get('salonId') as string
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const categoryId = formData.get('categoryId') as string

  const { error } = await (supabase as any).from('services').insert({
    salon_id: salonId,
    name,
    description: description || null,
    category_id: categoryId || null,
    is_active: true,
    is_bookable: true,
  })

  if (error) throw error

  revalidatePath('/business/services')
}

export async function updateService(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const serviceId = formData.get('serviceId') as string
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const isActive = formData.get('isActive') === 'true'
  const isBookable = formData.get('isBookable') === 'true'

  const { error } = await (supabase as any)
    .from('services')
    .update({
      name,
      description: description || null,
      is_active: isActive,
      is_bookable: isBookable,
    })
    .eq('id', serviceId)

  if (error) throw error

  revalidatePath('/business/services')
}

export async function toggleServiceActive(serviceId: string, isActive: boolean) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await (supabase as any)
    .from('services')
    .update({ is_active: isActive })
    .eq('id', serviceId)

  if (error) throw error

  revalidatePath('/business/services')
}

export async function deleteService(serviceId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await (supabase as any)
    .from('services')
    .update({
      deleted_at: new Date().toISOString(),
      deleted_by: user.id,
    })
    .eq('id', serviceId)

  if (error) throw error

  revalidatePath('/business/services')
}