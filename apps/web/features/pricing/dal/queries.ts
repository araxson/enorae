import { createClient } from '@/lib/supabase/client'

export async function getServicePricing(serviceId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('service_pricing')
    .select('*')
    .eq('service_id', serviceId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getCommissions(salonId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('commissions')
    .select(`
      *,
      staff_profiles!inner(full_name),
      services!inner(name)
    `)
    .eq('salon_id', salonId)

  if (error) throw error
  return data
}

export async function getSales(salonId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('sales')
    .select('*')
    .eq('salon_id', salonId)
    .gte('start_date', new Date().toISOString())
    .order('start_date')

  if (error) throw error
  return data
}