import { getStockMovements } from './api/queries'
import { MovementsClient } from './components/movements-client'
import { getUserSalon } from '@/features/business/dashboard/api/queries'
import { createClient } from '@/lib/supabase/server'

export async function StockMovements() {
  const salon = await getUserSalon()

  if (!salon) {
    return (
      <MovementsClient
        movements={[]}
        products={[]}
        locations={[]}
      />
    )
  }

  const supabase = await createClient()

  // Fetch movements, products, and locations in parallel
  const [movements, productsData, locationsData] = await Promise.all([
    getStockMovements(),
    supabase
      .from('products')
      .select('id, name, sku')
      .eq('salon_id', salon.id!)
      .eq('is_active', true)
      .order('name'),
    supabase
      .from('stock_locations')
      .select('id, name')
      .eq('salon_id', salon.id!)
      .order('name'),
  ])

  const products = (productsData.data || []) as Array<{ id: string; name: string | null; sku: string | null }>
  const locations = (locationsData.data || []) as Array<{ id: string; name: string | null }>

  return (
    <MovementsClient
      movements={movements}
      products={products}
      locations={locations}
    />
  )
}
