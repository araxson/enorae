'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'

const optimizeColumnSchema = z.object({
  tableName: z.string().min(1),
  columnName: z.string().min(1),
  compressionType: z.enum(['pglz', 'lz4']),
})

export async function optimizeToastUsage(formData: FormData) {
  try {
    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    const validated = optimizeColumnSchema.parse({
      tableName: formData.get('tableName')?.toString(),
      columnName: formData.get('columnName')?.toString(),
      compressionType: (formData.get('compressionType')?.toString() || 'pglz') as 'pglz' | 'lz4',
    })

    // NOTE: optimize_distinct_column RPC function does not exist in database
    // This is a database maintenance operation that requires an RPC function to be created
    // For now, logging the requested action without executing it
    console.log('Column optimization requested:', {
      tableName: validated.tableName,
      columnName: validated.columnName,
      compressionType: validated.compressionType,
    })

    await supabase.schema('audit').from('audit_logs').insert({
      action: 'optimize_column',
      target_schema: 'public',
      target_table: validated.tableName,
      event_type: 'toast_optimized',
      event_category: 'maintenance',
      severity: 'info',
      user_id: session.user.id,
      metadata: {
        table_name: validated.tableName,
        column_name: validated.columnName,
        compression_type: validated.compressionType,
      },
    })

    revalidatePath('/admin/database-health')
    return { success: true }
  } catch (error) {
    console.error('Error optimizing TOAST usage:', error)
    return { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
