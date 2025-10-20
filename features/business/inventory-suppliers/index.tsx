import { Section, Stack, Flex } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SuppliersGrid } from './components/suppliers-grid'
import { getSuppliers } from './api/queries'

export async function Suppliers() {
  const suppliers = await getSuppliers()

  const activeCount = suppliers.filter((s) => s.is_active).length
  const inactiveCount = suppliers.filter((s) => !s.is_active).length

  return (
    <Section size="lg">
      <Stack gap="xl">
        <Flex justify="end" align="start">
          <Button>Add Supplier</Button>
        </Flex>

        <Flex gap="md">
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
        </Flex>

        <SuppliersGrid suppliers={suppliers} />
      </Stack>
    </Section>
  )
}
