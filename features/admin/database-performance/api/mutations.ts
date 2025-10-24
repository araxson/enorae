'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/service-role'

const createIndexSchema = z.object({
  tableName: z.string().min(1),
  columnName: z.string().min(1),
  indexType: z.enum(['btree', 'hash', 'gist', 'gin']),
})

export async function createRecommendedIndex(formData: FormData) {
  try {
    const session = await requireAnyRole(ROLE_GROUPS.PLATFORM_ADMINS)
    const supabase = createServiceRoleClient()

    const validated = createIndexSchema.parse({
      tableName: formData.get('tableName')?.toString(),
      columnName: formData.get('columnName')?.toString(),
      indexType: (formData.get('indexType')?.toString() || 'btree') as
        | 'btree'
        | 'hash'
        | 'gist'
        | 'gin',
    })

    // Create index via RPC
    const { error } = await supabase.rpc('create_index_on_column', {
      table_name: validated.tableName,
      column_name: validated.columnName,
      index_type: validated.indexType,
    })

    if (error) {
      console.error('Failed to create index:', error)
      return { error: 'Failed to create index' }
    }

    await supabase.schema('audit').from('audit_logs').insert({
      event_type: 'index_created',
      event_category: 'maintenance',
      severity: 'info',
      user_id: session.user.id,
      metadata: {
        table_name: validated.tableName,
        column_name: validated.columnName,
        index_type: validated.indexType,
      },
    })

    revalidatePath('/admin/database-health')
    return { success: true }
  } catch (error) {
    console.error('Error creating index:', error)
    return { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
