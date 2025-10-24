'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { requireAnyRole } from '@/lib/auth/role-guard'
import { ROLE_GROUPS } from '@/lib/auth/constants'

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

    // Call RPC to optimize column
    const { error } = await supabase.rpc('optimize_distinct_column', {
      table_name: validated.tableName,
      column_name: validated.columnName,
      compression_type: validated.compressionType,
    })

    if (error) {
      console.error('Failed to optimize column:', error)
      return { error: 'Failed to optimize column' }
    }

    await supabase.schema('audit').from('audit_logs').insert({
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
