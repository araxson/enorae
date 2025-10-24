'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'

const refreshStatsSchema = z.object({
  tableName: z.string().min(1),
})

export async function refreshTableStatistics(formData: FormData) {
  try {
    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    const validated = refreshStatsSchema.parse({
      tableName: formData.get('tableName')?.toString(),
    })

    // Call RPC to refresh statistics
    const { error } = await supabase.rpc('refresh_statistics', {
      table_name: validated.tableName,
    })

    if (error) {
      console.error('Failed to refresh statistics:', error)
      return { error: 'Failed to refresh statistics' }
    }

    await supabase.schema('audit').from('audit_logs').insert({
      event_type: 'statistics_refreshed',
      event_category: 'maintenance',
      severity: 'info',
      user_id: session.user.id,
      metadata: {
        table_name: validated.tableName,
      },
    })

    revalidatePath('/admin/database-health')
    return { success: true }
  } catch (error) {
    console.error('Error refreshing statistics:', error)
    return { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
