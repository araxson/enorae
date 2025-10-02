import { Section, Stack, Box, Flex } from '@/components/layout'
import { H1, H3, Muted, Small } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { PricingGrid } from './components/pricing-grid'
import { getServicePricing } from './dal/service-pricing.queries'

export async function ServicePricing() {
  const pricing = await getServicePricing()

  const avgPrice = pricing.length > 0
    ? pricing.reduce((sum, p) => sum + (p.current_price || p.base_price), 0) / pricing.length
    : 0

  return (
    <Section size="lg">
      <Stack gap="xl">
        <Flex justify="between" align="start">
          <Box>
            <H1>Service Pricing</H1>
            <Muted>
              Manage pricing for your salon services
            </Muted>
          </Box>
          <Button>Add Pricing</Button>
        </Flex>

        <Flex gap="md">
          <Box className="rounded-lg border p-4">
            <Small>Total Services</Small>
            <H3>{pricing.length}</H3>
          </Box>
          <Box className="rounded-lg border p-4">
            <Small>Average Price</Small>
            <H3>
              ${avgPrice.toFixed(2)}
            </H3>
          </Box>
        </Flex>

        <PricingGrid pricing={pricing} />
      </Stack>
    </Section>
  )
}
