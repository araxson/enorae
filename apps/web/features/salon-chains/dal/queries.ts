import { createClient } from '@/lib/supabase/client'

export async function getSalonChain(chainId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salon_chains')
    .select(`
      *,
      salons(*)
    `)
    .eq('id', chainId)
    .single()

  if (error) throw error
  return data
}

export async function getChainLocations(chainId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salons')
    .select('*')
    .eq('chain_id', chainId)
    .order('name')

  if (error) throw error
  return data
}