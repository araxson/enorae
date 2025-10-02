import { Section, Stack, Box, Flex } from '@/components/layout'
import { H1, H3, P, Muted } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SuppliersGrid } from './components/suppliers-grid'
import { getSuppliers } from './dal/suppliers.queries'

export async function Suppliers() {
  const suppliers = await getSuppliers()

  const activeCount = suppliers.filter((s) => s.is_active).length
  const inactiveCount = suppliers.filter((s) => !s.is_active).length

  return (
    <Section size="lg">
      <Stack gap="xl">
        <Flex justify="between" align="start">
          <Box>
            <H1>Suppliers</H1>
            <Muted>
              Manage your inventory suppliers and vendor relationships
            </Muted>
          </Box>
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
