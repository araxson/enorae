import type { Database } from '@enorae/database/types'

export type Staff = Database['public']['Views']['staff']['Row']
export type Salon = Database['public']['Views']['salons']['Row']