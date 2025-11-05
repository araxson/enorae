import { AdminSecurityClient } from './components'

export async function SecurityAudit(): Promise<React.JSX.Element> {
  return <AdminSecurityClient />
}
export type * from './api/types'
