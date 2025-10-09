import { Section, Stack, Flex } from '@/components/layout'
import { H3, Muted } from '@/components/ui/typography'
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
              <Muted>Total Suppliers</Muted>
              <H3>{suppliers.length}</H3>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Muted>Active</Muted>
              <H3>{activeCount}</H3>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Muted>Inactive</Muted>
              <H3 className="text-muted-foreground">{inactiveCount}</H3>
            </CardContent>
          </Card>
        </Flex>

        <SuppliersGrid suppliers={suppliers} />
      </Stack>
    </Section>
  )
}
