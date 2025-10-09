import test from 'node:test'
import assert from 'node:assert/strict'

import { createSessionStub } from '../../utils/create-session-stub'
import type { SupabaseCatalogClient } from '@/features/business/inventory/products/api/mutations'

const envDefaults: Record<string, string> = {
  NEXT_PUBLIC_SUPABASE_URL: 'https://inventory.test.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key-0987654321',
  SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key-0987654321',
  NODE_ENV: 'test',
}

for (const [key, value] of Object.entries(envDefaults)) {
  if (!process.env[key]) {
    process.env[key] = value
  }
}

const productMutations = await import('@/features/business/inventory/products/api/mutations/product-mutations')
const { createProduct, updateProduct, deleteProduct } = productMutations

type ProductRow = {
  id: string
  salon_id: string
  name: string
  description?: string | null
  cost_price?: number | null
  retail_price?: number | null
  reorder_point?: number | null
  reorder_quantity?: number | null
  unit_of_measure?: string | null
  is_active?: boolean | null
  is_tracked?: boolean | null
  deleted_at?: string | null
  deleted_by_id?: string | null
  created_by_id?: string | null
  updated_by_id?: string | null
}

function createInventorySupabaseStub(initialProducts: ProductRow[] = []) {
  const products = initialProducts.map((row) => ({ ...row }))
  const operations: Array<{ type: 'insert' | 'update'; payload: Record<string, unknown> }> = []
  let idCounter = 1

  const selectBuilder = (rows: ProductRow[]) => ({
    eq(column: string, value: unknown) {
      const filtered = rows.filter((row) => row[column as keyof ProductRow] === value)
      return {
        async single<T = ProductRow>() {
          const first = filtered[0]
          if (!first) {
            return {
              data: null as unknown as T,
              error: {
                code: 'PGRST116',
                message: 'No rows found',
                details: null,
                hint: null,
              },
            }
          }
          return { data: { ...first } as unknown as T, error: null }
        },
        async maybeSingle<T = ProductRow>() {
          const first = filtered[0]
          return { data: (first ? { ...first } : null) as unknown as T, error: null }
        },
      }
    },
    async single<T = ProductRow>() {
      const first = rows[0]
      if (!first) {
        return {
          data: null as unknown as T,
          error: {
            code: 'PGRST116',
            message: 'No rows found',
            details: null,
            hint: null,
          },
        }
      }
      return { data: { ...first } as unknown as T, error: null }
    },
  })

  const client = {
    schema(schemaName: string) {
      if (schemaName !== 'inventory') {
        throw new Error(`Unsupported schema ${schemaName}`)
      }
      return {
        from(tableName: string) {
          if (tableName !== 'products') {
            throw new Error(`Unsupported table ${tableName}`)
          }
          return {
            insert(payload: Record<string, unknown>) {
              const row: ProductRow = {
                id: (payload.id as string) ?? `prod_${idCounter++}`,
                salon_id: payload.salon_id as string,
                name: payload.name as string,
              }
              if ('description' in payload) row.description = payload.description as string | undefined
              if ('cost_price' in payload) row.cost_price = payload.cost_price as number | undefined
              if ('retail_price' in payload) row.retail_price = payload.retail_price as number | undefined
              if ('reorder_point' in payload) row.reorder_point = payload.reorder_point as number | undefined
              if ('reorder_quantity' in payload) row.reorder_quantity = payload.reorder_quantity as number | undefined
              if ('unit_of_measure' in payload) row.unit_of_measure = payload.unit_of_measure as string | undefined
              if ('is_tracked' in payload) row.is_tracked = payload.is_tracked as boolean | undefined
              if ('is_active' in payload) row.is_active = payload.is_active as boolean | undefined
              if ('created_by_id' in payload) row.created_by_id = payload.created_by_id as string | undefined
              if ('updated_by_id' in payload) row.updated_by_id = payload.updated_by_id as string | undefined
              products.push(row)
              operations.push({ type: 'insert', payload: { ...payload, id: row.id } })
              return {
                select() {
                  return {
                    async single<T = ProductRow>() {
                      return { data: { ...row } as unknown as T, error: null }
                    },
                  }
                },
              }
            },
            update(payload: Record<string, unknown>) {
              return {
                eq(column: string, value: unknown) {
                  const target = products.find((row) => row[column as keyof ProductRow] === value)
                  if (target) {
                    for (const [key, value] of Object.entries(payload)) {
                      ;(target as Record<string, unknown>)[key] = value
                    }
                    operations.push({ type: 'update', payload: { id: target.id, ...payload } })
                  }
                  return {
                    select() {
                      return {
                        async single<T = ProductRow>() {
                          if (!target) {
                            return {
                              data: null as unknown as T,
                              error: {
                                code: 'PGRST116',
                                message: 'No rows found',
                                details: null,
                                hint: null,
                              },
                            }
                          }
                          return { data: { ...target } as unknown as T, error: null }
                        },
                      }
                    },
                    async single<T = ProductRow>() {
                      if (!target) {
                        return {
                          data: null as unknown as T,
                          error: {
                            code: 'PGRST116',
                            message: 'No rows found',
                            details: null,
                            hint: null,
                          },
                        }
                      }
                      return { data: { ...target } as unknown as T, error: null }
                    },
                  }
                },
              }
            },
            select() {
              return {
                eq(column: string, value: unknown) {
                  return selectBuilder(products).eq(column, value)
                },
                async single<T = ProductRow>() {
                  return selectBuilder(products).single<T>()
                },
              }
            },
          }
        },
      }
    },
  }

  return {
    client: client as unknown as SupabaseCatalogClient,
    state: products,
    operations,
  }
}

test('createProduct stores sanitized payload and revalidates', async () => {
  const { client, operations, state } = createInventorySupabaseStub()
  const session = createSessionStub()
  let revalidatedPath: string | null = null

  const result = await createProduct(
    '11111111-1111-1111-1111-111111111111',
    {
      name: 'Shampoo',
      description: undefined,
      cost_price: 10,
      retail_price: 25,
      reorder_point: 5,
      reorder_quantity: 10,
      is_tracked: true,
      is_active: true,
    },
    {
      supabase: client,
      session,
      skipAccessCheck: true,
      revalidate: (path) => {
        revalidatedPath = path
      },
    },
  )

  assert.deepEqual(result.success, true)
  assert.equal(revalidatedPath, '/business/inventory')
  const inserted = state[0]
  assert.equal(inserted.name, 'Shampoo')
  assert.equal('description' in inserted, false)
  assert.equal(inserted.created_by_id, session.user.id)
  assert.equal(operations[0].type, 'insert')
})

test('updateProduct validates input and prevents invalid pricing', async () => {
  const initial: ProductRow = {
    id: 'prod-1',
    salon_id: '11111111-1111-1111-1111-111111111111',
    name: 'Conditioner',
    description: 'Original',
    cost_price: 5,
    retail_price: 15,
  }

  const stub = createInventorySupabaseStub([initial])
  const { client, state } = stub
  const session = createSessionStub()

  const invalid = await updateProduct(
    initial.id,
    {
      cost_price: -5,
    },
    {
      supabase: client,
      session,
      skipAccessCheck: true,
    },
  )

  assert.equal(invalid.success, undefined)
  assert.ok(invalid.error?.includes('greater than or equal to 0'))

  let revalidatedPath: string | null = null

  const updated = await updateProduct(
    initial.id,
    {
      cost_price: 12,
      description: undefined,
    },
    {
      supabase: client,
      session,
      skipAccessCheck: true,
      revalidate: (path) => {
        revalidatedPath = path
      },
    },
  )

  assert.equal(updated.success, true)
  const stored = state.find((row) => row.id === initial.id)
  assert.ok(stored)
  assert.equal(stored?.cost_price, 12)
  assert.equal(stored?.description, 'Original')
  assert.equal(revalidatedPath, '/business/inventory')
})

test('deleteProduct marks product as deleted and revalidates', async () => {
  const initial: ProductRow = {
    id: 'prod-1',
    salon_id: '11111111-1111-1111-1111-111111111111',
    name: 'Serum',
  }
  const { client, state } = createInventorySupabaseStub([initial])
  const session = createSessionStub()
  const fixedNow = new Date('2025-01-01T00:00:00.000Z')
  let revalidated: string | null = null

  const result = await deleteProduct(
    initial.id,
    {
      supabase: client,
      session,
      skipAccessCheck: true,
      now: () => fixedNow,
      revalidate: (path) => {
        revalidated = path
      },
    },
  )

  assert.deepEqual(result, { success: true })
  const updated = state.find((row) => row.id === initial.id)
  assert.ok(updated)
  assert.equal(updated?.deleted_at, fixedNow.toISOString())
  assert.equal(updated?.deleted_by_id, session.user.id)
  assert.equal(revalidated, '/business/inventory')
})
