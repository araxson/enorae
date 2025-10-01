'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/client'

export async function toggleFavorite(salonId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Check if already favorited
  const { data: existing } = await supabase
    .from('favorites')
    .select('id')
    .eq('customer_id', user.id)
    .eq('salon_id', salonId)
    .single()

  if (existing) {
    // Remove favorite
    await (supabase as any)
      .from('favorites')
      .delete()
      .eq('id', (existing as any).id)
  } else {
    // Add favorite
    await (supabase as any)
      .from('favorites')
      .insert({
        customer_id: user.id,
        salon_id: salonId,
      })
  }

  revalidatePath('/favorites')
  revalidatePath(`/salons/${salonId}`)
}