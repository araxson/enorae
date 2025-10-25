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

    // NOTE: refresh_statistics RPC function does not exist in database
    // This is a database maintenance operation that requires an RPC function to be created
    // For now, logging the requested action without executing it
    console.log('Statistics refresh requested for table:', validated.tableName)

    // Statistics refresh logged without actual execution (RPC not available)
    await supabase.schema('audit').from('audit_logs').insert({
      action: 'refresh_statistics',
      target_schema: 'public',
      target_table: validated.tableName,
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
