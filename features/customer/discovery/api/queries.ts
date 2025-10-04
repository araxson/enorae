import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type Salon = Database['public']['Views']['salons']['Row']

export async function getSalons() {
  const supabase = await createClient()

  // Optional auth check - enriches data if user is logged in
  await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('salons')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Salon[]
}

export async function getSalonBySlug(slug: string) {
  const supabase = await createClient()

  // Optional auth check - enriches data if user is logged in
  await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('salons')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (error) throw error
  return data as Salon
}

export async function searchSalons(query: string) {
  const supabase = await createClient()

  // Optional auth check - enriches data if user is logged in
  await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('salons')
    .select('*')
    .eq('status', 'active')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Salon[]
}
