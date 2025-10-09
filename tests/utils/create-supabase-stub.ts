import type { PostgrestError } from '@supabase/supabase-js'

type ServiceRow = {
  id: string
  slug: string | null
}

type SelectResponse = {
  data: ServiceRow[] | null
  error: PostgrestError | null
}

type StubOptions = {
  services?: ServiceRow[]
  error?: PostgrestError | null
}

type Chain = {
  eq: (column: string, value: unknown) => Chain
  ilike: (column: string, pattern: string) => Chain
  select: (columns: string) => Promise<SelectResponse>
}

/**
 * Creates a minimal Supabase client stub that supports the chained calls used in
 * generateUniqueServiceSlug().
 */
export function createSupabaseStub({
  services = [],
  error = null,
}: StubOptions = {}) {
  const chain: Chain = {
    eq() {
      return this
    },
    ilike() {
      return this
    },
    async select() {
      return { data: services, error }
    },
  }

  return {
    schema(schemaName: string) {
      if (schemaName !== 'catalog') {
        throw new Error(`Unexpected schema access: ${schemaName}`)
      }

      return {
        from(tableName: string) {
          if (tableName !== 'services') {
            throw new Error(`Unexpected table access: ${tableName}`)
          }

          return chain
        },
      }
    },
  }
}
