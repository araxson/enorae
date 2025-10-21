import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SuppliersGrid } from './components/suppliers-grid'
import { getSuppliers } from './api/queries'

export async function Suppliers() {
  const suppliers = await getSuppliers()

  const activeCount = suppliers.filter((s) => s.is_active).length
  const inactiveCount = suppliers.filter((s) => !s.is_active).length

  return (
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <div className="flex flex-col gap-8">
        <div className="flex gap-4 items-start justify-end">
          <Button>Add Supplier</Button>
        </div>

        <div className="flex gap-4">
          <Card>
            <CardContent>
              <p className="text-sm text-muted-foreground">Total Suppliers</p>
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">{suppliers.length}</h3>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <p className="text-sm text-muted-foreground">Active</p>
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">{activeCount}</h3>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <p className="text-sm text-muted-foreground">Inactive</p>
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-muted-foreground">{inactiveCount}</h3>
            </CardContent>
          </Card>
        </div>

        <SuppliersGrid suppliers={suppliers} />
      </div>
    </section>
  )
}
